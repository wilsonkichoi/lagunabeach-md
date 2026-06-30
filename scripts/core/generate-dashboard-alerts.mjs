#!/usr/bin/env node
/**
 * generate-dashboard-alerts.mjs — derived 警報層 (audit 2026-06-10 A-3)
 *
 * CONSCIOUSNESS §警報 原是「cron-refreshed」prose，heartbeat → routine 轉型後
 * None routine 接手Update，停在 2026-04-30 變殭屍快照。本script把警報降級為
 * derived state：每次 prebuild:dashboard Fromexisting dashboard JSON + 認知層
 * file機械推導，Output public/api/dashboard-alerts.json。
 * consciousness-snapshot.sh Detect到該檔即display前 6 （BECOME Universal core entry point）。
 *
 * 閾值校準依據（REFLEXES #66）：2026-06-10 audit 當日 ground truth dogfood —
 * organ<50 紅線沿用 ANATOMY §如何使用這圖、404 紅線沿用 EXP-2026-04-11-A
 * Fix後基線 6%、inbox 閾值沿用 LESSONS distill Trigger線（≥30 automaticScan）放大
 * 10x 當紅線（buffer design本就Allow累積）。
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const OUT = 'public/api/dashboard-alerts.json';
const alerts = [];

function addAlert(id, severity, message, source) {
  alerts.push({ id, severity, message, source });
}

function readJson(p) {
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

// ── 1. Organ分數紅線（ANATOMY：anyOrgan < 50 Need干預）─────────────────
const organism = readJson('public/api/dashboard-organism.json');
if (organism?.organs) {
  for (const o of organism.organs) {
    if (typeof o.score === 'number' && o.score < 50) {
      addAlert(
        `organ-${o.id}`,
        'red',
        `${o.emoji} ${o.nameZh} Organ分數 ${o.score} < 50，Need干預`,
        'dashboard-organism.json',
      );
    }
  }
} else {
  addAlert(
    'organism-missing',
    'red',
    'dashboard-organism.json 缺失或CannotParse',
    'generator',
  );
}

// ── 2. Immunity v2 status 直通（status characters串本身就是診斷）──────────────────
const immune = readJson('public/api/dashboard-immune.json');
// drift/危險 比 需關注 更糟，severity corresponding升級（首版 regex 漏掉更糟的兩級，
// status 惡化反而逃出警報 — 2026-06-10 immune v3 上線時自Fetch）
if (
  immune?.status &&
  /需關注|drift|危險|critical|attention|drift|danger/i.test(immune.status)
) {
  const sev = /危險|danger/i.test(immune.status)
    ? 'red'
    : /drift|drift/i.test(immune.status)
      ? 'yellow'
      : 'yellow';
  addAlert(
    'immune-status',
    sev,
    `Immunity v3=${immune.immuneScore}：${immune.status}`,
    'dashboard-immune.json',
  );
}

// ── 3. Three-source sensing：404 rate + AI crawler Success率 ──────────────────────────
const analytics = readJson('public/api/dashboard-analytics.json');
const cf = analytics?.cloudflare24h || analytics?.cloudflare;
if (cf) {
  const rate = parseFloat(cf.notFoundRate ?? cf['404Rate'] ?? NaN);
  if (!Number.isNaN(rate) && rate > 8) {
    // 紅線 8%：EXP-2026-04-11-A Fix後基線 ~6%，> 8% = structure性回升
    addAlert(
      'cf-404',
      'yellow',
      `CF 24h 404 rate ${rate}% > 8%（Fix後基線 ~6%）`,
      'dashboard-analytics.json',
    );
  }
}

// ── 4. UNKNOWNS 可證偽實驗到期未判定（audit I-3 根治：機械Check取代人記）──
const unknownsPath = 'docs/semiont/UNKNOWNS.md';
if (existsSync(unknownsPath)) {
  const unknowns = readFileSync(unknownsPath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  const dueRe = /due_date:\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(EXP-[A-Za-z0-9-]+)/g;
  let m;
  while ((m = dueRe.exec(unknowns)) !== null) {
    if (m[1] < today) {
      addAlert(
        `exp-overdue-${m[2]}`,
        'yellow',
        `UNKNOWNS ${m[2]} Verify日 ${m[1]} 已Expired未判定`,
        'UNKNOWNS.md',
      );
    }
  }
}

// ── 5. Inbox backlog 紅線（LESSONS distill Trigger線 30 的 10x = structure性飽和）─
function countEntries(path, pattern) {
  if (!existsSync(path)) return 0;
  const text = readFileSync(path, 'utf8');
  return (text.match(pattern) || []).length;
}
const lessonsCount = countEntries(
  'docs/semiont/LESSONS-INBOX.md',
  /^### 20\d\d-/gm,
);
if (lessonsCount > 300) {
  addAlert(
    'lessons-saturation',
    'red',
    `LESSONS-INBOX undigested ${lessonsCount} > 300 飽和線`,
    'LESSONS-INBOX.md',
  );
} else if (lessonsCount > 200) {
  addAlert(
    'lessons-backlog',
    'yellow',
    `LESSONS-INBOX undigested ${lessonsCount} > 200（distill 產能訊號）`,
    'LESSONS-INBOX.md',
  );
}

// ── 6. MEMORY 索引exceeds蒸餾Trigger線（MEMORY.md rule：> 80 rows Trigger三層蒸餾）─
const memoryPath = 'docs/semiont/MEMORY.md';
if (existsSync(memoryPath)) {
  const rows = countEntries(memoryPath, /^\| 20\d\d-/gm);
  if (rows > 80) {
    addAlert(
      'memory-index-rows',
      'yellow',
      `MEMORY.md 索引 ${rows} rows > 80 蒸餾Trigger線（design 2026-04-14 未implement）`,
      'MEMORY.md',
    );
  }
}

// ── 6.5 ARTICLE-INBOX 幽靈 entry（status=done/dropped 卻沒搬走 = Done歸檔鐵律drift）─
// 誕生 2026-06-19-inbox-distill：manual distill 才發現 16 幽靈累積。深查 + Safety清除tool
// scripts/tools/inbox-audit.py；每-boot 便宜訊號 inbox-signal.sh 的 👻 ghost line。
// 閾值 ≥3 yellow / ≥8 red：遠在「累積到 16」before就喊（Done歸檔鐵律本request ship 同 session 清）。
const inboxPath = 'docs/semiont/ARTICLE-INBOX.md';
if (existsSync(inboxPath)) {
  const text = readFileSync(inboxPath, 'utf8');
  const pIdx = text.search(/^## .*Pending/m);
  const pending = pIdx >= 0 ? text.slice(pIdx) : text;
  const ghosts = (pending.match(/^\s*-\s*\*\*Status\*\*.*/gm) || []).filter(
    (l) => /done|dropped|已Done|✅/.test(l) && !/pending/.test(l),
  ).length;
  if (ghosts >= 8) {
    addAlert(
      'inbox-ghosts',
      'red',
      `ARTICLE-INBOX ${ghosts} status=done 沒搬走 ≥ 8（Done歸檔鐵律structure性drift；inbox-audit.py --apply-safe 清）`,
      'ARTICLE-INBOX.md',
    );
  } else if (ghosts >= 3) {
    addAlert(
      'inbox-ghosts',
      'yellow',
      `ARTICLE-INBOX ${ghosts} status=done 沒搬走（Done歸檔鐵律drift；inbox-audit.py --apply-safe 清）`,
      'ARTICLE-INBOX.md',
    );
  }
}

// ── 7. Dashboard JSON staleness（> 36h 沒Update = refresh 飛輪斷）────────
const vitals = readJson('public/api/dashboard-vitals.json');
if (vitals?.lastUpdated) {
  const ageH = (Date.now() - new Date(vitals.lastUpdated).getTime()) / 3.6e6;
  if (ageH > 36) {
    addAlert(
      'vitals-stale',
      'red',
      `dashboard-vitals.json ${Math.round(ageH)}h 未Update > 36h（data-refresh 飛輪斷？）`,
      'dashboard-vitals.json',
    );
  }
}

// ── 8. Spore harvest 欠帳（OVERDUE 回填 > 10 = 繁殖System半盲）───────────
const spores = readJson('public/api/dashboard-spores.json');
const harvestStatus = spores?.harvestStatus || [];
const overdue = harvestStatus.filter((h) =>
  String(h.status || '')
    .toUpperCase()
    .includes('OVERDUE'),
).length;
if (overdue > 10) {
  addAlert(
    'spore-harvest-overdue',
    'yellow',
    `Spore回填 OVERDUE ${overdue} > 10（發了不回填＝半盲）`,
    'dashboard-spores.json',
  );
}

// ── output ───────────────────────────────────────────────────────────────
const severityRank = { red: 0, yellow: 1 };
alerts.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

writeFileSync(
  OUT,
  JSON.stringify(
    {
      lastUpdated: new Date().toISOString(),
      generator: 'scripts/core/generate-dashboard-alerts.mjs',
      note: 'derived 警報層 — CONSCIOUSNESS §警報 的機械接管 (audit 2026-06-10 A-3)',
      count: alerts.length,
      alerts,
    },
    null,
    2,
  ) + '\n',
);
console.log(
  `🚨 dashboard-alerts: ${alerts.length} alerts (${alerts.filter((a) => a.severity === 'red').length} red) → ${OUT}`,
);
