/**
 * LagunaBeach.md MCP Command — Model Context Protocol server
 *
 * Exposes LagunaBeach.md as a free, local-first, no-API-key MCP server so Claude
 * Code / Claude Desktop / Cursor / Copilot CLI / Codex CLI can query the
 * knowledge base directly. Tools: search / read / rag / cite / organs / stats.
 *
 * The server (lib/mcp-server.js) is implemented on @modelcontextprotocol/sdk
 * over stdio. Nothing leaves the machine — queries run against the local
 * knowledge base (auto-synced to ~/.lagunabeachmd on first use).
 *
 * Usage:
 *   lagunabeachmd mcp serve                      # start MCP server on stdio
 *   lagunabeachmd mcp install --client claude-code   # print one-line install
 */

import chalk from 'chalk';
import { getKnowledgePath } from '../lib/knowledge.js';

// Published to npm as `lagunabeach-md`, so install snippets use the npx
// one-liner — no clone required.
const NPX_SERVE = 'npx -y lagunabeach-md mcp serve';

export function mcpCommand(program) {
  const mcp = program
    .command('mcp')
    .description(
      'Model Context Protocol server — free, local-first Laguna Beach knowledge for any MCP client',
    )
    .action(() => {
      console.log('');
      console.log(
        chalk.bold('🔌 lagunabeachmd MCP — Laguna Beach knowledge for your AI'),
      );
      console.log('');
      console.log(
        chalk.gray(
          '  Free · no API key · local-first (queries never leave your machine)',
        ),
      );
      console.log('');
      console.log(chalk.gray('  Subcommands:'));
      console.log(
        chalk.gray('    lagunabeachmd mcp serve     Start MCP server (stdio)'),
      );
      console.log(
        chalk.gray(
          '    lagunabeachmd mcp install   Print client install snippet',
        ),
      );
      console.log('');
      console.log(chalk.gray('  Quick start (Claude Code):'));
      console.log(
        chalk.cyan(`    claude mcp add lagunabeachmd -- ${NPX_SERVE}`),
      );
      console.log('');
    });

  mcp
    .command('serve')
    .description('Start MCP server on stdio (for Claude Desktop / Cursor)')
    .action(async () => {
      try {
        const { startMcpServer } = await import('../lib/mcp-server.js');
        await startMcpServer();
        // startMcpServer connects and keeps process alive via stdio.
      } catch (err) {
        console.error(
          chalk.red(`\n❌ MCP server failed to start: ${err.message}\n`),
        );
        console.error(chalk.gray(err.stack));
        process.exit(1);
      }
    });

  mcp
    .command('install')
    .description('Print an MCP install snippet for the given client')
    .option(
      '--client <client>',
      'claude-code | claude-desktop | cursor',
      'claude-code',
    )
    .action((opts) => {
      console.log('');
      console.log(chalk.bold(`🔌 MCP install — ${opts.client}`));
      console.log('');
      if (opts.client === 'claude-code') {
        console.log(chalk.gray('  Run this once:'));
        console.log('');
        console.log(
          chalk.cyan(`  claude mcp add lagunabeachmd -- ${NPX_SERVE}`),
        );
        console.log('');
        console.log(
          chalk.gray(
            '  Then ask Claude anything about Laguna Beach — it will use',
          ),
        );
        console.log(
          chalk.gray(
            '  lagunabeachmd_search / lagunabeachmd_rag / lagunabeachmd_cite.',
          ),
        );
      } else if (opts.client === 'claude-desktop') {
        console.log(
          chalk.gray(
            '  Add this to ~/Library/Application Support/Claude/claude_desktop_config.json:',
          ),
        );
        console.log('');
        const snippet = JSON.stringify(
          {
            mcpServers: {
              lagunabeachmd: {
                command: 'npx',
                args: ['-y', 'lagunabeach-md', 'mcp', 'serve'],
              },
            },
          },
          null,
          2,
        );
        console.log(chalk.cyan(snippet));
      } else if (opts.client === 'cursor') {
        console.log(chalk.gray('  Cursor MCP config (via Settings → MCP):'));
        console.log('');
        console.log(chalk.cyan('command: npx'));
        console.log(
          chalk.cyan('args: ["-y", "lagunabeach-md", "mcp", "serve"]'),
        );
      } else {
        console.log(
          chalk.yellow(`  Client "${opts.client}" not yet documented.`),
        );
        console.log(
          chalk.gray(`  Any MCP client works — point it at: ${NPX_SERVE}`),
        );
      }
      console.log('');
      console.log(
        chalk.gray('  Free · no API key · local-first · open-source (MIT)'),
      );
      console.log(
        chalk.gray(`  Knowledge base location: ${getKnowledgePath()}`),
      );
      console.log('');
    });
}
