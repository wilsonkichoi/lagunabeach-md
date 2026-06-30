#!/usr/bin/env node
/**
 * lb — LagunaBeach.md unified CLI (thin router)
 *
 * Why: 90+ loose scripts under scripts/, hard to discover by memory.
 * This CLI is a pure routing layer: each subcommand points to a canonical
 * tool without duplicating any logic (same philosophy as article-health.py
 * SSOT consolidation + skill thin-shell pattern). Add a row to COMMANDS
 * when a new tool is born.
 *
 * Usage:
 *   node scripts/lb.mjs <command> [args...]
 *   npm run lb -- <command> [args...]
 *   npx lb <command> (package.json bin registered, available after npm install)
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ── Command registry (architecture-as-data: add tool = add one row) ──────────
// run: argv array ({args} placeholder = user args insertion point; absent = append to end)
const COMMANDS = {
  // ── Daily ──
  status: {
    desc: 'Vitals: organ score + routine status + inbox backlog (BECOME ground truth)',
    cat: 'Daily',
    run: [
      'bash',
      '-c',
      'bash scripts/tools/consciousness-snapshot.sh; echo; bash scripts/tools/routine-status.sh; echo; bash scripts/tools/inbox-signal.sh',
    ],
  },
  sync: {
    desc: 'knowledge/ SSOT → src/content/ projection sync',
    cat: 'Daily',
    run: ['bash', 'scripts/core/sync.sh'],
  },
  build: {
    desc: 'astro build (without prebuild/postbuild; full chain: npm run build)',
    cat: 'Daily',
    run: ['npx', 'astro', 'build'],
  },
  dev: {
    desc: 'sync + astro dev',
    cat: 'Daily',
    run: ['npm', 'run', 'dev'],
  },
  'session-id': {
    desc: 'Get canonical session ID (YYYY-MM-DD-HHMMSS-{handle})',
    cat: 'Daily',
    run: ['bash', 'scripts/tools/session-id.sh'],
  },

  // ── Quality ──
  health: {
    desc: 'Article health SSOT (25 plugins): lb health <file> or lb health --all',
    cat: 'Quality',
    run: ['python3', 'scripts/tools/article-health.py'],
  },
  links: {
    desc: 'dist/ internal link verification (multiprocessing; requires build first)',
    cat: 'Quality',
    run: ['bash', 'scripts/tools/verify-internal-links.sh'],
  },
  parity: {
    desc: 'Refactor HTML parity gate: lb parity <dist-baseline> <dist-after>',
    cat: 'Quality',
    run: ['bash', 'scripts/tools/build-parity-diff.sh'],
  },
  viz: {
    desc: 'tw-* visual module pixel gate (light/dark/mobile screenshots)',
    cat: 'Quality',
    run: ['node', 'scripts/tools/viz-shot.mjs'],
  },
  frontmatter: {
    desc: 'Frontmatter validation (same as CI)',
    cat: 'Quality',
    run: ['node', 'scripts/core/test-frontmatter.mjs'],
  },

  // ── Sensing / Data ──
  perf: {
    desc: 'CI build perf trend (GitHub Actions API → dashboard-build-perf.json)',
    cat: 'Sensing',
    run: ['node', 'scripts/core/extract-build-perf.mjs'],
  },
  'i18n-status': {
    desc: 'Translation coverage status across languages',
    cat: 'Sensing',
    run: ['python3', 'scripts/utils/i18n-status.py'],
  },

  // ── Translation ──
  translate: {
    desc: 'lang-sync translation pipeline (OpenRouter cascade): lb translate --help',
    cat: 'Translation',
    run: ['python3', 'scripts/tools/lang-sync/openrouter-translate.py'],
  },
};

// ── Router ───────────────────────────────────────────────────────────────────
const [cmd, ...args] = process.argv.slice(2);

function printHelp() {
  console.log(
    '🧬 lb — LagunaBeach.md unified CLI (thin router, logic lives in canonical tools)\n',
  );
  const cats = [...new Set(Object.values(COMMANDS).map((c) => c.cat))];
  for (const cat of cats) {
    console.log(`  ${cat}`);
    for (const [name, c] of Object.entries(COMMANDS).filter(
      ([, c]) => c.cat === cat,
    )) {
      console.log(`    lb ${name.padEnd(14)} ${c.desc}`);
    }
    console.log('');
  }
  console.log(
    '  Other tools: ls scripts/tools/ (90+, this table covers high-frequency + gate commands)',
  );
}

if (
  !cmd ||
  cmd === 'help' ||
  cmd === '--help' ||
  cmd === '-h' ||
  cmd === 'list'
) {
  printHelp();
  process.exit(0);
}

const entry = COMMANDS[cmd];
if (!entry) {
  const candidates = Object.keys(COMMANDS).filter(
    (k) => k.startsWith(cmd) || k.includes(cmd),
  );
  console.error(`Unknown command: ${cmd}`);
  if (candidates.length)
    console.error(`   Did you mean: ${candidates.join(' / ')}`);
  console.error('   lb help for full list');
  process.exit(1);
}

const [bin, ...binArgs] = entry.run;
// Sanity: routed tool must exist (catches stale pointers after tool relocation)
const target = binArgs.find((a) => a.startsWith('scripts/'));
if (target && !existsSync(resolve(ROOT, target))) {
  console.error(
    `Route target not found: ${target} (tool moved? Update scripts/lb.mjs COMMANDS table)`,
  );
  process.exit(1);
}

const r = spawnSync(bin, [...binArgs, ...args], {
  stdio: 'inherit',
  cwd: ROOT,
});
process.exit(r.status ?? 1);
