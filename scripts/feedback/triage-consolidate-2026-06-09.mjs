#!/usr/bin/env node
/**
 * triage-consolidate-2026-06-09.mjs — ONE-OFF consolidation run for 2026-06-09 feedback batch.
 *
 * Why: this batch had 12 reports from one reader (Cs Gou) on one article (National Space Center),
 * section-by-section corrections. Deterministic triage.mjs would open 12 identically-titled
 * [Fact Check] issues (batch-boundary dedupe gap: classify.mjs isDuplicate title-match only blocks
 * cross-run existing issues, not same-batch distinct body-sig same-article content). Pipeline design
 * intent is "one fact-check issue per article" (see classify.mjs:191), so correct action = merge
 * 12 into 1 issue (each item verbatim + individual feedback id provenance), bug + idea filed separately.
 *
 * This script reuses lib functions (buildIssue / archive) to keep archive + provenance format consistent.
 * Structural finding (pipeline needs built-in same-article content clustering) goes through LESSONS gate.
 *
 * Usage: node scripts/feedback/triage-consolidate-2026-06-09.mjs            # dry-run
 *        node scripts/feedback/triage-consolidate-2026-06-09.mjs --commit   # file + write-back + archive
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildIssue, triageNoteFor } from './lib/classify.mjs';
import { buildArchiveRecord, archiveRelPath } from './lib/archive.mjs';

const REPO = 'wilsonkichoi/lagunabeach-md';
const COMMIT = process.argv.includes('--commit');
const rows = JSON.parse(readFileSync('/tmp/feedback-new.json', 'utf8'));

// ── partition ──────────────────────────────────────────────────────────────
// Original one-off target article from upstream (historical, will never run on LB data)
const TARGET_SLUG = 'national-space-organization';
const spaceRows = rows
  .filter((r) => r.article_slug === TARGET_SLUG && r.type === 'content')
  .sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
const otherRows = rows.filter(
  (r) => !(r.article_slug === TARGET_SLUG && r.type === 'content'),
);

console.log(
  `[consolidate] space-corrections=${spaceRows.length} · other=${otherRows.length} · mode=${COMMIT ? 'COMMIT' : 'DRY-RUN'}`,
);

// ── build consolidated [Fact Check] issue ─────────────────────
function ts(s) {
  return (s || '').slice(0, 16).replace('T', ' ');
}
const article = spaceRows[0];
const cleanUrl = `https://lagunabeach.md/technology/${TARGET_SLUG}`;
const reader = article.display_name || 'Anonymous reader';

let body =
  `**Which article?**\n${article.article_title}\n🔗 ${cleanUrl}\n\n` +
  `This issue was auto-consolidated from on-site feedback: one reader (**${reader}**) submitted **${spaceRows.length}** section-by-section corrections/additions. ` +
  `Each item is recorded verbatim below (with individual feedback id provenance). Maintainer: please verify each item (human gate).\n\n---\n`;

spaceRows.forEach((r, i) => {
  body += `\n### Correction ${i + 1}\n`;
  if (r.quote) {
    body += `\n**Selected passage**\n> ${String(r.quote).replace(/\n/g, '\n> ')}\n`;
  }
  body += `\n**What's wrong**\n${r.body}\n`;
  if (r.correct_info) {
    body += `\n**Correct info + source**\n${r.correct_info}\n`;
  }
  body += `\n<sub>feedback id: \`${r.id}\` · ${ts(r.created_at)}</sub>\n`;
});

body += `\n---\n> 🧬 Auto-consolidated from on-site feedback (feedback-triage / 2026-06-09 consolidation) · reporter: ${reader} · ${spaceRows.length} feedback entries merged`;

const spaceIssue = {
  type: 'content',
  title: `[Fact Check] ${article.article_title}`,
  labels: ['needs-verification', 'from-feedback'],
  body,
};

// ── build bug + idea issues via lib ──────────────────────────────────────────
const plan = [
  { kind: 'consolidated', issue: spaceIssue, rows: spaceRows },
  ...otherRows.map((r) => ({
    kind: 'single',
    issue: buildIssue(r),
    rows: [r],
  })),
];

// ── execute ──────────────────────────────────────────────────────────────────
function createIssue(issue) {
  const args = [
    'issue',
    'create',
    '--repo',
    REPO,
    '--title',
    issue.title,
    '--body',
    issue.body,
  ];
  for (const l of issue.labels) args.push('--label', l);
  const out = execFileSync('gh', args, { encoding: 'utf8' }).trim();
  const url = out.split('\n').pop().trim();
  const num = parseInt((url.match(/\/issues\/(\d+)/) || [])[1] || '0', 10);
  return { url, number: num };
}

async function writeBack(id, issue, note) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  const patch = {
    status: 'filed',
    triaged_at: new Date().toISOString(),
    issue_url: issue.url,
    issue_number: issue.number,
    triage_note: note,
  };
  const res = await fetch(`${url}/rest/v1/feedback?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`write-back ${res.status}: ${await res.text()}`);
}

function writeArchive(row, issue, note) {
  const rel = archiveRelPath(row);
  mkdirSync(dirname(rel), { recursive: true });
  if (!existsSync(rel)) {
    writeFileSync(
      rel,
      buildArchiveRecord(
        {
          ...row,
          status: 'filed',
          issue_url: issue.url,
          issue_number: issue.number,
        },
        note,
      ),
    );
  }
  return rel;
}

for (const p of plan) {
  console.log(`\n${p.kind.toUpperCase()} → ${p.issue.title}`);
  console.log(
    `  labels: ${p.issue.labels.join(', ')} · rows: ${p.rows.length}`,
  );
  if (!COMMIT) {
    console.log('  (dry-run; --commit to file)');
    continue;
  }
  const created = createIssue(p.issue);
  console.log(`  → ${created.url}`);
  for (const r of p.rows) {
    const note = triageNoteFor(r);
    await writeBack(r.id, created, note);
    const arch = writeArchive(r, created, note);
    console.log(`    ✓ writeback + 📁 ${arch} (${r.id.slice(0, 8)})`);
  }
}

console.log(
  `\n[consolidate] done · issues=${COMMIT ? plan.length : 0} (1 consolidated + ${otherRows.length} single) · rows-filed=${COMMIT ? rows.length : 0}`,
);
