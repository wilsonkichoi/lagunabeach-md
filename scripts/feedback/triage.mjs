#!/usr/bin/env node
/**
 * triage.mjs — Feedback → GitHub issue（cron routine twmd-feedback-triage 的執行體）。
 *
 * 流程：讀新回報 → spam/dedupe/分類（classify.mjs 純函式）→ 開 GitHub issue
 *       （對齊既有 template,只放 display_name 不放 email）→ 回寫 status。
 *
 * §自主權邊界：本 script 只做「把讀者原話機械性 routing 成 issue」（= 代讀者填表單,
 * verbatim + 署名 + provenance）。**不**以維護者身份回覆 / close / merge —— 那留給
 * MAINTAINER-PIPELINE 的人類 gate。
 *
 * 安全預設：--dry-run 是 DEFAULT。要真的開 issue + 回寫必須顯式 --commit。
 *
 * 用法：
 *   node scripts/feedback/triage.mjs                      # dry-run,讀 Supabase（需 env）
 *   node scripts/feedback/triage.mjs --seed <file.json>   # dry-run,讀 JSON fixture（離線測試）
 *   node scripts/feedback/triage.mjs --commit             # 真的開 issue + 回寫（routine 用）
 *
 * env（正式跑才需要,放 ~/.taiwanmd-feedback.env 或環境變數）：
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { triageBatch } from './lib/classify.mjs';

const REPO = 'frank890417/taiwan-md';

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
  // 讀 ~/.taiwanmd-feedback.env（KEY=VALUE 一行一條）進 process.env(不覆蓋已存在)。
  try {
    const home = process.env.HOME || '';
    const txt = readFileSync(`${home}/.taiwanmd-feedback.env`, 'utf8');
    for (const line of txt.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]])
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* 沒有就算了 */
  }
}

async function fetchNewFeedback(limit) {
  loadEnvFile();
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL / SUPABASE_SERVICE_KEY 未設定（放 ~/.taiwanmd-feedback.env）。離線測試請用 --seed。',
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

  const summary = { file: 0, reject: 0, skip: 0 };
  for (const r of results) {
    summary[r.decision]++;
    const tag = r.decision.toUpperCase().padEnd(6);
    if (r.decision === 'file') {
      console.log(`  ${tag} [${r.issue.type}] ${r.issue.title}`);
      console.log(`         labels: ${r.issue.labels.join(', ')}`);
      if (args.commit) {
        const created = createIssue(r.issue);
        await writeBackStatus(r.row.id, 'filed', created, r.note);
        console.log(`         → ${created.url}`);
      } else {
        console.log(`         (dry-run; --commit to file)`);
      }
    } else {
      console.log(`  ${tag} id=${r.row.id} · ${r.reason}`);
      if (args.commit && r.decision === 'reject') {
        await writeBackStatus(r.row.id, 'rejected', null, r.note);
      }
      // skip(dup) 不改 status:留著下次再判（避免漏接真不同的回報）
    }
  }

  console.log(
    `\n[triage] done · file=${summary.file} reject=${summary.reject} skip=${summary.skip}`,
  );
  return summary;
}

main().catch((e) => {
  console.error('[triage] FATAL:', e.message);
  process.exit(1);
});
