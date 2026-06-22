/**
 * LagunaBeach.md Mailmap Command
 *
 * Inspect and manage repo .mailmap for consolidating scattered git commit
 * identities. Git native feature: .mailmap maps {commit-name, commit-email}
 * to a canonical {name, email} so `git shortlog` / `git log --format=%aN`
 * / GitHub contributor graph all treat them as one person.
 *
 * Usage:
 *   lagunabeachmd mailmap                 — list all commit identities + consolidation state
 *   lagunabeachmd mailmap scan --mine     — find your own identity variants (via git config user.email)
 *   lagunabeachmd mailmap add             — interactive: add a new canonical + aliases block
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_ROOT = path.resolve(__dirname, '../..');
const REPO_ROOT = path.resolve(CLI_ROOT, '..');
const MAILMAP_PATH = path.join(REPO_ROOT, '.mailmap');

function isInRepo() {
  try {
    return (
      fs.existsSync(path.join(REPO_ROOT, 'knowledge')) &&
      fs.existsSync(path.join(REPO_ROOT, '.git'))
    );
  } catch {
    return false;
  }
}

function git(args) {
  return execSync(`git ${args}`, { cwd: REPO_ROOT, encoding: 'utf8' });
}

function prompt(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

/**
 * Pull all commit identities from git log. Returns:
 *   [{ name, email, count, canonicalName, canonicalEmail }]
 * sorted by count desc. `canonical*` reflect the post-mailmap mapping.
 */
export function collectIdentities() {
  const raw = git(`log --format='%an|%ae|%aN|%aE' --all`).trim();
  const counts = new Map();
  for (const line of raw.split('\n')) {
    if (!line) continue;
    const [name, email, cName, cEmail] = line.split('|');
    const key = `${name}|${email}`;
    const prev = counts.get(key) || {
      name,
      email,
      canonicalName: cName,
      canonicalEmail: cEmail,
      count: 0,
    };
    prev.count++;
    counts.set(key, prev);
  }
  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}

function formatIdentity(id) {
  return `${id.name} <${id.email}>`;
}

function isConsolidated(id) {
  return id.name !== id.canonicalName || id.email !== id.canonicalEmail;
}

function printScan(identities, mine = null) {
  console.log(chalk.bold('\n🧬 Git commit identities\n'));

  const filtered = mine
    ? identities.filter(
        (id) =>
          id.email.toLowerCase().includes(mine.toLowerCase()) ||
          id.name.toLowerCase().includes(mine.toLowerCase()),
      )
    : identities;

  if (!filtered.length) {
    console.log(
      chalk.gray(`  No commit identities found matching "${mine}".\n`),
    );
    return;
  }

  for (const id of filtered) {
    const consolidated = isConsolidated(id);
    const commitStr = chalk.gray(`${String(id.count).padStart(5)} commits`);
    const identityStr = formatIdentity(id);
    if (consolidated) {
      const canonical = `${id.canonicalName} <${id.canonicalEmail}>`;
      console.log(
        `  ${commitStr}  ${chalk.yellow(identityStr)}\n` +
          `  ${' '.repeat(14)}  ${chalk.green('→')} ${chalk.cyan(canonical)} ${chalk.gray('(via .mailmap)')}`,
      );
    } else {
      console.log(`  ${commitStr}  ${identityStr}`);
    }
  }

  if (mine) {
    const total = filtered.reduce((s, id) => s + id.count, 0);
    const canonicalGroups = new Set(
      filtered.map((id) => `${id.canonicalName}|${id.canonicalEmail}`),
    );
    console.log('');
    console.log(
      chalk.gray(
        `  Commits matching "${mine}": ${total}, consolidating to ${canonicalGroups.size} identities.`,
      ),
    );
    if (canonicalGroups.size > 1) {
      console.log(
        chalk.yellow(
          '  ⚠️  Still split. Consider running `lagunabeachmd mailmap add` to consolidate the rest.',
        ),
      );
    }
  }
  console.log('');
}

async function addEntry() {
  if (!isInRepo()) {
    console.error(
      chalk.red('\n❌ Must be run from inside the lagunabeach-md repo.\n'),
    );
    process.exit(1);
  }

  const identities = collectIdentities();
  const unconsolidated = identities.filter((id) => !isConsolidated(id));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  console.log(chalk.bold('\n🧬 Mailmap — add canonical + aliases\n'));
  console.log(
    chalk.gray(
      '   Consolidate your scattered git history identities into one canonical.',
    ),
  );
  console.log(
    chalk.gray('   This modifies .mailmap (repo-shared, needs a PR).\n'),
  );

  try {
    const canonical = await prompt(
      rl,
      chalk.bold('Canonical identity (format: Name <email>): '),
    );
    if (!/^.+\s+<[^>]+>$/.test(canonical)) {
      rl.close();
      console.error(chalk.red('\n❌ Invalid format. Use "Name <email>".\n'));
      process.exit(1);
    }

    console.log(chalk.gray('\n   Unconsolidated commit identities (top 15):'));
    const top = unconsolidated.slice(0, 15);
    top.forEach((id, i) => {
      console.log(
        `   ${chalk.cyan(String(i + 1).padStart(2))}. ${formatIdentity(id)} ${chalk.gray(`(${id.count} commits)`)}`,
      );
    });
    console.log('');

    const sel = await prompt(
      rl,
      chalk.bold(
        'Numbers to alias (comma-separated, e.g. 1,3,5; blank to cancel): ',
      ),
    );
    rl.close();

    if (!sel) {
      console.log(chalk.gray('\nCancelled.\n'));
      return;
    }

    const indices = sel
      .split(',')
      .map((s) => parseInt(s.trim(), 10) - 1)
      .filter((n) => n >= 0 && n < top.length);

    if (!indices.length) {
      console.error(chalk.red('\n❌ No valid numbers selected.\n'));
      process.exit(1);
    }

    const aliases = indices.map((i) => top[i]);
    const entries = aliases
      .map((a) => `${canonical} ${formatIdentity(a)}`)
      .join('\n');

    const banner = `\n# Added by lagunabeachmd mailmap on ${new Date().toISOString().slice(0, 10)}`;
    const newBlock = `${banner}\n${entries}\n`;

    // Preview
    console.log(chalk.bold('\nAbout to append to .mailmap:\n'));
    console.log(chalk.gray(newBlock));

    const rl2 = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    const confirm = await prompt(rl2, chalk.bold('Confirm? (y/N): '));
    rl2.close();

    if (!/^y(es)?$/i.test(confirm)) {
      console.log(chalk.gray('\nCancelled, .mailmap unchanged.\n'));
      return;
    }

    fs.appendFileSync(MAILMAP_PATH, newBlock, 'utf8');

    console.log(
      chalk.green(
        `\n✅ Written to .mailmap: ${aliases.length} aliases merged into canonical.`,
      ),
    );
    console.log(
      chalk.gray('   Verify: `git log --format=%aN | sort -u | grep ...`'),
    );
    console.log(
      chalk.gray(
        '   .mailmap is repo-shared — commit + PR for full consolidation in git history.\n',
      ),
    );
  } catch (err) {
    rl.close();
    console.error(chalk.red(`\n❌ Failed: ${err.message}\n`));
    process.exit(1);
  }
}

export function mailmapCommand(program) {
  const cmd = program
    .command('mailmap')
    .description(
      'Inspect + manage .mailmap (git commit identity consolidation)',
    );

  cmd
    .command('scan', { isDefault: true })
    .description('List commit identities and consolidation state')
    .option(
      '--mine',
      'Filter to your identity variants (via git config user.email)',
    )
    .option('--match <keyword>', 'Filter by name/email keyword')
    .option('--json', 'Output JSON')
    .action((opts) => {
      if (!isInRepo()) {
        console.error(
          chalk.red('\n❌ Must be run from inside the lagunabeach-md repo.\n'),
        );
        process.exit(1);
      }
      const identities = collectIdentities();
      let filter = opts.match || null;
      if (opts.mine && !filter) {
        try {
          filter = git('config user.email').trim();
        } catch {
          filter = null;
        }
      }
      if (opts.json) {
        const out = filter
          ? identities.filter(
              (id) =>
                id.email.toLowerCase().includes(filter.toLowerCase()) ||
                id.name.toLowerCase().includes(filter.toLowerCase()),
            )
          : identities;
        console.log(JSON.stringify(out, null, 2));
        return;
      }
      printScan(identities, filter);
    });

  cmd
    .command('add')
    .description('Interactive: add canonical + aliases block to .mailmap')
    .action(addEntry);
}
