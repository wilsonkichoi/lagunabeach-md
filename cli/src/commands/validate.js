/**
 * LagunaBeach.md Validate Command
 *
 * Quality checker for a single article.
 * Outputs a score card with detailed checks.
 *
 * Usage:
 *   lagunabeachmd validate main-beach
 *   lagunabeachmd validate pageant-of-the-masters --json
 *   lagunabeachmd validate heisler-park --fix
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { getArticleFiles, readArticle } from '../lib/knowledge.js';
import { ensureData } from '../lib/ensure-data.js';

// ── AI hollow phrase patterns ────────────────────────────────────────────────
const HOLLOW_PATTERNS = [
  {
    pattern: /plays? an? (vital|important|key|crucial) role/gi,
    label: '"plays a vital role"',
  },
  {
    pattern: /stands? as a (testament|symbol) to/gi,
    label: '"stands as a testament to"',
  },
  {
    pattern: /(is|remains) an? (integral|essential|indispensable) part of/gi,
    label: '"an integral part of"',
  },
  { pattern: /in (today's|the modern) world/gi, label: '"in today\'s world"' },
  {
    pattern: /(it'?s|it is) worth noting that/gi,
    label: '"it\'s worth noting that"',
  },
  {
    pattern: /serves as a (reminder|symbol) of/gi,
    label: '"serves as a reminder of"',
  },
  {
    pattern: /continues to (evolve|grow|thrive)/gi,
    label: '"continues to evolve"',
  },
  {
    pattern: /rich (history|cultural heritage|tapestry)/gi,
    label: '"rich history/tapestry" cliché',
  },
];

// Minimum word count to pass
const MIN_WORD_COUNT = 800;
// Minimum ## headings to pass
const MIN_HEADINGS = 3;
// Minimum reference links to pass
const MIN_REFERENCES = 2;
// Ideal description length range
const DESC_MIN = 50;
const DESC_MAX = 200;

/**
 * Count CJK + latin words in text.
 */
function countWords(text) {
  if (!text) return 0;
  const cjkRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g;
  const cjkCount = (text.match(cjkRegex) || []).length;
  const withoutCjk = text.replace(cjkRegex, ' ');
  const latinWords = withoutCjk
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);
  return cjkCount + latinWords.length;
}

/**
 * Find an article file by slug (searches all article files).
 * @param {string} slug
 * @returns {string|null} Absolute file path or null
 */
function findArticleBySlug(slug) {
  try {
    const files = getArticleFiles();
    // Exact match first
    const exact = files.find((f) => path.basename(f, '.md') === slug);
    if (exact) return exact;

    // Partial match (slug as substring)
    const partial = files.find((f) => path.basename(f, '.md').includes(slug));
    return partial || null;
  } catch {
    return null;
  }
}

/**
 * Run all quality checks on a parsed article.
 * @returns {{ checks: Array, score: number, total: number }}
 */
function runChecks(frontmatter, body) {
  const checks = [];

  // ── 1. Frontmatter completeness ─────────────────────────────────────────
  const fmFields = ['title', 'description', 'date', 'tags', 'category'];
  const fmPresent = fmFields.filter((f) => {
    const val = frontmatter[f];
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== null && val !== '';
  });
  const fmScore = fmPresent.length;
  const fmPass = fmScore === fmFields.length;
  checks.push({
    id: 'frontmatter',
    pass: fmPass,
    warn: !fmPass,
    label: 'Frontmatter complete',
    detail: `${fmScore}/${fmFields.length}`,
    missing: fmFields.filter((f) => !fmPresent.includes(f)),
    points: fmPass ? 20 : Math.floor((fmScore / fmFields.length) * 20),
    maxPoints: 20,
    fix: fmPass
      ? null
      : `Fill in missing fields: ${fmFields.filter((f) => !fmPresent.includes(f)).join(', ')}`,
  });

  // ── 2. Word count ────────────────────────────────────────────────────────
  const wordCount = countWords(body);
  const wcPass = wordCount >= MIN_WORD_COUNT;
  checks.push({
    id: 'wordcount',
    pass: wcPass,
    warn: !wcPass,
    label: 'Word count sufficient',
    detail: `${wordCount.toLocaleString()} words`,
    points: wcPass ? 20 : Math.floor((wordCount / MIN_WORD_COUNT) * 20),
    maxPoints: 20,
    fix: wcPass
      ? null
      : `Article is currently ${wordCount} words; aim for at least ${MIN_WORD_COUNT}. Expand each section.`,
  });

  // ── 3. Headings ──────────────────────────────────────────────────────────
  const headingMatches = body.match(/^##\s+.+/gm) || [];
  const headingCount = headingMatches.length;
  const headingPass = headingCount >= MIN_HEADINGS;
  checks.push({
    id: 'headings',
    pass: headingPass,
    warn: !headingPass,
    label: 'Heading count sufficient',
    detail: `${headingCount}, recommend ≥${MIN_HEADINGS}`,
    points: headingPass ? 20 : Math.floor((headingCount / MIN_HEADINGS) * 20),
    maxPoints: 20,
    fix: headingPass
      ? null
      : `Add more ## sections — consider: Overview, History, Today, See Also, References`,
  });

  // ── 4. Reference links ───────────────────────────────────────────────────
  const refMatches = body.match(/\[.+?\]\(https?:\/\/.+?\)/g) || [];
  const refCount = refMatches.length;
  const refPass = refCount >= MIN_REFERENCES;
  checks.push({
    id: 'references',
    pass: refPass,
    warn: !refPass,
    label: 'References',
    detail: `${refCount} source(s)`,
    points: refPass ? 20 : Math.floor((refCount / MIN_REFERENCES) * 20),
    maxPoints: 20,
    fix: refPass
      ? null
      : `Add at least ${MIN_REFERENCES} Markdown reference links, e.g. [Source name](https://example.com)`,
  });

  // ── 5. AI hollow phrases ─────────────────────────────────────────────────
  const foundHollow = [];
  for (const { pattern, label } of HOLLOW_PATTERNS) {
    const matches = body.match(pattern);
    if (matches) {
      foundHollow.push({ label, count: matches.length });
    }
  }
  const hollowTotal = foundHollow.reduce((s, h) => s + h.count, 0);
  const hollowPass = hollowTotal === 0;
  checks.push({
    id: 'hollow',
    pass: hollowPass,
    warn: !hollowPass,
    label: 'AI hollow phrasing',
    detail: hollowPass ? 'none' : `${hollowTotal} instance(s)`,
    found: foundHollow,
    points: hollowPass ? 10 : Math.max(0, 10 - hollowTotal * 3),
    maxPoints: 10,
    fix: hollowPass
      ? null
      : `Remove or rewrite: ${foundHollow.map((h) => h.label).join(', ')}`,
  });

  // ── 6. Description length ────────────────────────────────────────────────
  const descLen = (frontmatter.description || '').length;
  const descPass = descLen >= DESC_MIN && descLen <= DESC_MAX;
  const descWarn = descLen > 0 && !descPass;
  checks.push({
    id: 'description',
    pass: descPass,
    warn: descWarn,
    label: 'Description length',
    detail:
      descLen === 0
        ? 'missing description'
        : `${descLen} chars${descPass ? ', good' : descLen < DESC_MIN ? ', too short' : ', too long'}`,
    points: descPass ? 10 : descLen === 0 ? 0 : 5,
    maxPoints: 10,
    fix: descPass
      ? null
      : descLen === 0
        ? 'Add a description field — aim for a 50-200 character summary'
        : descLen < DESC_MIN
          ? `Description too short (${descLen} chars) — expand to ${DESC_MIN}-${DESC_MAX} chars`
          : `Description too long (${descLen} chars) — trim to ${DESC_MAX} chars or fewer`,
  });

  // Calculate total score
  const score = checks.reduce((s, c) => s + c.points, 0);
  const total = checks.reduce((s, c) => s + c.maxPoints, 0);

  return { checks, score, total };
}

/**
 * Return score tier label + emoji.
 */
function scoreTier(score, total) {
  const pct = (score / total) * 100;
  if (pct >= 90) return { emoji: '🟢', label: 'Excellent' };
  if (pct >= 70) return { emoji: '🟡', label: 'Needs improvement' };
  return { emoji: '🔴', label: 'Needs major rework' };
}

export function validateCommand(program) {
  program
    .command('validate <slug>')
    .description('Quality-check a single article and output a score card')
    .option('--json', 'Output as JSON')
    .option('--fix', 'Show suggested fixes for failing checks')
    .action(async (slug, opts) => {
      try {
        await ensureData({ quiet: true });

        const filePath = findArticleBySlug(slug);
        if (!filePath) {
          const msg = `Article not found: "${slug}". Check the slug, or run lagunabeachmd sync first.`;
          if (opts.json) {
            console.log(JSON.stringify({ error: msg }, null, 2));
          } else {
            console.error(chalk.red(`\n❌ ${msg}\n`));
          }
          process.exit(1);
        }

        const article = readArticle(filePath);
        const { frontmatter, body } = article;
        const { checks, score, total } = runChecks(frontmatter, body);
        const tier = scoreTier(score, total);

        // ── JSON output ────────────────────────────────────────────────────
        if (opts.json) {
          console.log(
            JSON.stringify(
              {
                slug,
                title: frontmatter.title,
                filePath,
                score,
                total,
                tier: tier.label,
                checks: checks.map((c) => ({
                  id: c.id,
                  label: c.label,
                  pass: c.pass,
                  detail: c.detail,
                  points: c.points,
                  maxPoints: c.maxPoints,
                  fix: c.fix || null,
                })),
              },
              null,
              2,
            ),
          );
          return;
        }

        // ── Human-readable score card ──────────────────────────────────────
        console.log('');
        console.log(
          chalk.bold(`📋 Quality check: ${frontmatter.title || slug}`),
        );
        console.log('');

        for (const check of checks) {
          const icon = check.pass ? chalk.green('✅') : chalk.yellow('⚠️ ');
          const label = chalk.white(check.label);
          const detail = chalk.gray(`(${check.detail})`);
          console.log(`${icon} ${label} ${detail}`);

          if (opts.fix && check.fix) {
            console.log(chalk.gray(`   💡 ${check.fix}`));
          }
        }

        console.log('');
        const tierStr = `${tier.emoji} ${tier.label}`;
        console.log(chalk.bold(`Score: ${score}/${total} — ${tierStr}`));
        console.log('');

        if (!opts.fix && checks.some((c) => !c.pass)) {
          console.log(chalk.gray('  Tip: use --fix to see suggested fixes\n'));
        }
      } catch (err) {
        console.error(chalk.red(`\n❌ Validation failed: ${err.message}\n`));
        process.exit(1);
      }
    });
}
