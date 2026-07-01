#!/usr/bin/env node
/**
 * triage.mjs — Feedback -> GitHub issue (execution body for twmd-feedback-triage routine).
 *
 * Flow: read new reports -> spam/dedupe/classify (classify.mjs pure functions) -> create GitHub issue
 *       (aligned with existing templates, only display_name not email) -> write back status.
 *
 * Autonomy boundary: this script only does "mechanically route reader feedback into issues" (= fill form on behalf of reader,
 * verbatim + attribution + provenance). Does NOT reply / close / merge as maintainer — that is left to
 * MAINTAINER-PIPELINE human gate.
 *
 * Safe default: --dry-run is DEFAULT. Must explicitly pass --commit to actually create issues + write back.
 *
 * Usage:
 *   node scripts/feedback/triage.mjs                      # dry-run, reads Supabase (needs env)
 *   node scripts/feedback/triage.mjs --seed <file.json>   # dry-run, reads JSON fixture (offline testing)
 *   node scripts/feedback/triage.mjs --commit             # actually creates issues + writes back (for routine use)
 *
 * env (only needed for real runs, put in ~/.lagunabeach-feedback.env or env vars):
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { triageBatch } from './lib/classify.mjs';
import {
  buildArchiveRecord,
  mergeComments,
  archiveRelPath,
} from './lib/archive.mjs';

const ARCHIVE_ROOT = 'docs/feedback/archive';

const REPO = 'wilsonkichoi/lagunabeach-md';

function parseArgs(argv) {
  const a = { commit: false, seed: null, limit: 50 };
  for (let i = 2; i < argv.length; i++) {
    const v = argv[i];
    if (v === '--commit') a.commit = true;
    else if (v === '--dry-run') a.commit = false;
    else if (v === '--seed') a.seed = argv[++i];
    else if (v === '--limit') a.limit = parseInt(argv[++i], 10) || 50;
  }
  return a;
}

// ── data source ───────────────────────────────────────────────────────────────
function loadEnvFile() {
  // Read ~/.lagunabeach-feedback.env (KEY=VALUE one per line) into process.env (does not override existing).
  try {
    const home = process.env.HOME || '';
    const txt = readFileSync(`${home}/.lagunabeach-feedback.env`, 'utf8');
    for (const line of txt.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]])
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* Missing file is fine */
  }
}

async function fetchNewFeedback(limit) {
  loadEnvFile();
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL / SUPABASE_SERVICE_KEY not set (put in ~/.lagunabeach-feedback.env). Use --seed for offline testing.',
    );
  }
  const endpoint = `${url}/rest/v1/feedback?status=eq.new&order=created_at.asc&limit=${limit}`;
  const res = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok)
    throw new Error(`Supabase REST ${res.status}: ${await res.text()}`);
  return res.json();
}

async function writeBackStatus(id, status, issue, note) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  const patch = {
    status,
    triaged_at: new Date().toISOString(),
    ...(issue ? { issue_url: issue.url, issue_number: issue.number } : {}),
    ...(note ? { triage_note: note } : {}),
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

// ── github ────────────────────────────────────────────────────────────────────
function listOpenIssues() {
  try {
    const out = execFileSync(
      'gh',
      [
        'issue',
        'list',
        '--repo',
        REPO,
        '--state',
        'open',
        '--limit',
        '200',
        '--json',
        'title,body,number',
      ],
      { encoding: 'utf8' },
    );
    return JSON.parse(out);
  } catch (e) {
    console.warn(
      '[triage] gh issue list failed, dedupe vs existing skipped:',
      e.message,
    );
    return [];
  }
}

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
  // gh prints the issue URL on success
  const url = out.split('\n').pop().trim();
  const num = parseInt((url.match(/\/issues\/(\d+)/) || [])[1] || '0', 10);
  return { url, number: num };
}

// ── batch-cluster consolidated report (same slug >= threshold -> 1 artifact for maintainer) ──
function writeClusterReport(slug, held, mode) {
  const date = new Date().toISOString().slice(0, 10);
  const safe = slug.replace(/[^\w一-鿿-]+/g, '_');
  const rel = `reports/feedback-clusters/${date}-${safe}.md`;
  if (mode !== 'COMMIT') return rel;
  try {
    mkdirSync(dirname(rel), { recursive: true });
    if (existsSync(rel)) return rel; // Same-day re-run does not overwrite (reports stay new, will hold again)
    const rows = held.map((h, i) => {
      const r = h.row;
      const quote = r.quote
        ? `\n   > Selected text: ${String(r.quote).replace(/\n/g, ' ')}`
        : '';
      const fix = r.correct_info
        ? `\n   - Correction suggestion: ${r.correct_info}`
        : '';
      return `${i + 1}. **${r.display_name || 'Anonymous reader'}** (${(r.created_at || '').slice(0, 16)}) · feedback id \`${r.id}\`${quote}\n   - Report: ${r.body}${fix}`;
    });
    writeFileSync(
      rel,
      `# Feedback cluster hold: ${slug} (${held.length} entries, ${date})\n\n` +
        `> Same article received >= ${held.length} non-spam reports in one batch; batch-cluster guard auto-held.\n` +
        `> All reports stay Supabase status=new (not filed individually). After maintainer decision: open 1\n` +
        `> consolidated issue or directly run REWRITE to fix article, then mark this batch filed/rejected.\n\n` +
        rows.join('\n') +
        `\n\n---\n_Generated by feedback-triage batch-cluster guard (classify.mjs BATCH_CLUSTER_THRESHOLD)_\n`,
    );
  } catch (e) {
    console.warn(
      `[triage] cluster report write failed for ${slug}:`,
      e.message,
    );
  }
  return rel;
}

// ── git archive (sovereignty layer: feedback + communication records stored in repo) ──────────────────────────
function writeArchive(row, note) {
  const rel = archiveRelPath(row);
  try {
    mkdirSync(dirname(rel), { recursive: true });
    if (!existsSync(rel)) {
      writeFileSync(
        rel,
        buildArchiveRecord({ ...row, triage_note: note }, note),
      );
    }
    return rel;
  } catch (e) {
    console.warn(`[triage] archive write failed for ${row.id}:`, e.message);
    return null;
  }
}

function fetchIssueComments(issueNumber) {
  try {
    const out = execFileSync(
      'gh',
      [
        'issue',
        'view',
        String(issueNumber),
        '--repo',
        REPO,
        '--json',
        'comments',
      ],
      { encoding: 'utf8' },
    );
    const data = JSON.parse(out);
    return (data.comments || []).map((c) => ({
      id: `${c.author?.login || '?'}-${c.createdAt}`,
      author: c.author?.login || '?',
      createdAt: c.createdAt,
      body: c.body,
    }));
  } catch {
    return [];
  }
}

// Scan archive dir, sync new issue comments for each filed record into communication section (human maintainer
// replies also go to git). Returns count of updated files.
function syncArchiveComments() {
  if (!existsSync(ARCHIVE_ROOT)) return 0;
  let synced = 0;
  for (const m of readdirSync(ARCHIVE_ROOT)) {
    const dir = join(ARCHIVE_ROOT, m);
    let files = [];
    try {
      files = readdirSync(dir).filter((f) => f.endsWith('.md'));
    } catch {
      continue;
    }
    for (const f of files) {
      const path = join(dir, f);
      let content;
      try {
        content = readFileSync(path, 'utf8');
      } catch {
        continue;
      }
      const num = (content.match(/^issue_number:\s*(\d+)/m) || [])[1];
      if (!num) continue;
      const merged = mergeComments(content, fetchIssueComments(num));
      if (merged !== content) {
        writeFileSync(path, merged);
        synced++;
      }
    }
  }
  return synced;
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  const args = parseArgs(process.argv);
  const mode = args.commit ? 'COMMIT' : 'DRY-RUN';

  let rows;
  if (args.seed) {
    rows = JSON.parse(readFileSync(args.seed, 'utf8'));
    console.log(
      `[triage] seed=${args.seed} (${rows.length} rows) · mode=${mode}`,
    );
  } else {
    rows = await fetchNewFeedback(args.limit);
    console.log(`[triage] fetched ${rows.length} new feedback · mode=${mode}`);
  }

  const existing = args.commit ? listOpenIssues() : [];
  const results = triageBatch(rows, existing);

  const summary = { file: 0, reject: 0, skip: 0, hold: 0 };
  for (const r of results) {
    summary[r.decision]++;
    const tag = r.decision.toUpperCase().padEnd(6);
    if (r.decision === 'hold') {
      console.log(`  ${tag} id=${r.row.id} · ${r.reason}`);
      continue; // status not written back (stays new); cluster report written after loop
    }
    if (r.decision === 'file') {
      console.log(`  ${tag} [${r.issue.type}] ${r.issue.title}`);
      console.log(`         labels: ${r.issue.labels.join(', ')}`);
      if (args.commit) {
        const created = createIssue(r.issue);
        await writeBackStatus(r.row.id, 'filed', created, r.note);
        const arch = writeArchive(
          {
            ...r.row,
            status: 'filed',
            issue_url: created.url,
            issue_number: created.number,
          },
          r.note,
        );
        console.log(`         → ${created.url}${arch ? ` · 📁 ${arch}` : ''}`);
      } else {
        console.log(`         (dry-run; --commit to file)`);
      }
    } else {
      console.log(`  ${tag} id=${r.row.id} · ${r.reason}`);
      if (args.commit && r.decision === 'reject') {
        await writeBackStatus(r.row.id, 'rejected', null, r.note);
      }
      // skip(dup) does not change status: left for next run to re-evaluate (avoids missing genuinely different reports)
    }
  }

  // batch-cluster: each held slug produces 1 consolidated report for maintainer decision.
  const clusters = new Map();
  for (const r of results) {
    if (r.decision !== 'hold') continue;
    if (!clusters.has(r.cluster)) clusters.set(r.cluster, []);
    clusters.get(r.cluster).push(r);
  }
  for (const [slug, held] of clusters) {
    const rel = writeClusterReport(slug, held, mode);
    console.log(
      `  HOLD-> cluster ${slug} ${held.length} entries → ${rel}${mode === 'COMMIT' ? '' : ' (dry-run)'}`,
    );
  }

  // Sync new issue comments (maintainer replies) from existing filed records into git archive.
  let commentsSynced = 0;
  if (args.commit) commentsSynced = syncArchiveComments();

  console.log(
    `\n[triage] done · file=${summary.file} reject=${summary.reject} skip=${summary.skip} hold=${summary.hold} · archive-comments-synced=${commentsSynced}`,
  );
  return summary;
}

main().catch((e) => {
  console.error('[triage] FATAL:', e.message);
  process.exit(1);
});
