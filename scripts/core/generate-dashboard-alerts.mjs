#!/usr/bin/env node
/**
 * generate-dashboard-alerts.mjs — derived 警報層 (audit 2026-06-10 A-3)
 *
 * CONSCIOUSNESS §警報 原是「cron-refreshed」prose，heartbeat → routine 轉型後
 * 沒有 routine 接手更新，停在 2026-04-30 變殭屍快照。本腳本把警報降級為
 * derived state：每次 prebuild:dashboard 從既有 dashboard JSON + 認知層
 * 檔案機械推導，輸出 public/api/dashboard-alerts.json。
 * consciousness-snapshot.sh 偵測到該檔即顯示前 6 條（BECOME Universal core 入口）。
 *
 * 閾值校準依據（REFLEXES #66）：2026-06-10 audit 當日 ground truth dogfood —
 * organ<50 紅線沿用 ANATOMY §如何使用這張圖、404 紅線沿用 EXP-2026-04-11-A
 * 修復後基線 6%、inbox 閾值沿用 LESSONS distill 觸發線（≥30 自動掃描）放大
 * 10x 當紅線（buffer 設計本就允許累積）。
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

// ── 1. 器官分數紅線（ANATOMY：任何器官 < 50 需要干預）─────────────────
const organism = readJson('public/api/dashboard-organism.json');
if (organism?.organs) {
  for (const o of organism.organs) {
    if (typeof o.score === 'number' && o.score < 50) {
      addAlert(
        `organ-${o.id}`,
        'red',
        `${o.emoji} ${o.nameZh} 器官分數 ${o.score} < 50，需要干預`,
        'dashboard-organism.json',
      );
    }
  }
} else {
  addAlert(
    'organism-missing',
    'red',
    'dashboard-organism.json 缺失或無法解析',
    'generator',
  );
}

// ── 2. 免疫 v2 status 直通（status 字串本身就是診斷）──────────────────
const immune = readJson('public/api/dashboard-immune.json');
if (immune?.status && /需關注|critical|attention/i.test(immune.status)) {
  addAlert(
    'immune-status',
    'yellow',
    `免疫 v2=${immune.immuneScore}：${immune.status}`,
    'dashboard-immune.json',
  );
}

// ── 3. 三源感知：404 rate + AI crawler 成功率 ──────────────────────────
const analytics = readJson('public/api/dashboard-analytics.json');
const cf = analytics?.cloudflare24h || analytics?.cloudflare;
if (cf) {
  const rate = parseFloat(cf.notFoundRate ?? cf['404Rate'] ?? NaN);
  if (!Number.isNaN(rate) && rate > 8) {
    // 紅線 8%：EXP-2026-04-11-A 修復後基線 ~6%，> 8% = 結構性回升
    addAlert(
      'cf-404',
      'yellow',
      `CF 24h 404 rate ${rate}% > 8%（修復後基線 ~6%）`,
      'dashboard-analytics.json',
    );
  }
}

// ── 4. UNKNOWNS 可證偽實驗到期未判定（audit I-3 根治：機械檢查取代人記）──
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
        `UNKNOWNS ${m[2]} 驗證日 ${m[1]} 已過期未判定`,
        'UNKNOWNS.md',
      );
    }
  }
}

// ── 5. Inbox backlog 紅線（LESSONS distill 觸發線 30 的 10x = 結構性飽和）─
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
    `LESSONS-INBOX 未消化 ${lessonsCount} 條 > 300 飽和線`,
    'LESSONS-INBOX.md',
  );
} else if (lessonsCount > 200) {
  addAlert(
    'lessons-backlog',
    'yellow',
    `LESSONS-INBOX 未消化 ${lessonsCount} 條 > 200（distill 產能訊號）`,
    'LESSONS-INBOX.md',
  );
}

// ── 6. MEMORY 索引超過蒸餾觸發線（MEMORY.md 規則：> 80 rows 觸發三層蒸餾）─
const memoryPath = 'docs/semiont/MEMORY.md';
if (existsSync(memoryPath)) {
  const rows = countEntries(memoryPath, /^\| 20\d\d-/gm);
  if (rows > 80) {
    addAlert(
      'memory-index-rows',
      'yellow',
      `MEMORY.md 索引 ${rows} rows > 80 蒸餾觸發線（design 2026-04-14 未實作）`,
      'MEMORY.md',
    );
  }
}

// ── 7. Dashboard JSON staleness（> 36h 沒更新 = refresh 飛輪斷）────────
const vitals = readJson('public/api/dashboard-vitals.json');
if (vitals?.lastUpdated) {
  const ageH = (Date.now() - new Date(vitals.lastUpdated).getTime()) / 3.6e6;
  if (ageH > 36) {
    addAlert(
      'vitals-stale',
      'red',
      `dashboard-vitals.json ${Math.round(ageH)}h 未更新 > 36h（data-refresh 飛輪斷？）`,
      'dashboard-vitals.json',
    );
  }
}

// ── 8. Spore harvest 欠帳（OVERDUE 回填 > 10 = 繁殖系統半盲）───────────
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
    `孢子回填 OVERDUE ${overdue} 條 > 10（發了不回填＝半盲）`,
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
