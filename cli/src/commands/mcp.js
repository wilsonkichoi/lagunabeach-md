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
import path from 'path';
import { fileURLToPath } from 'url';
import { getKnowledgePath } from '../lib/knowledge.js';

// Absolute path to cli/src/index.js — not published to npm yet, so install
// snippets must point at a real file path rather than an npx package name.
const INDEX_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../index.js',
);

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
        chalk.cyan(
          `    claude mcp add lagunabeachmd -- node ${INDEX_PATH} mcp serve`,
        ),
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
        console.log(
          chalk.gray(
            '  Run this once (not published to npm yet — runs from your clone):',
          ),
        );
        console.log('');
        console.log(
          chalk.cyan(
            `  claude mcp add lagunabeachmd -- node ${INDEX_PATH} mcp serve`,
          ),
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
            '  Not published to npm yet — add this to ~/Library/Application Support/Claude/claude_desktop_config.json:',
          ),
        );
        console.log('');
        const snippet = JSON.stringify(
          {
            mcpServers: {
              lagunabeachmd: {
                command: 'node',
                args: [INDEX_PATH, 'mcp', 'serve'],
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
        console.log(chalk.cyan('command: node'));
        console.log(chalk.cyan(`args: ["${INDEX_PATH}", "mcp", "serve"]`));
      } else {
        console.log(
          chalk.yellow(`  Client "${opts.client}" not yet documented.`),
        );
        console.log(
          chalk.gray(
            `  Any MCP client works — point it at: node ${INDEX_PATH} mcp serve`,
          ),
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
