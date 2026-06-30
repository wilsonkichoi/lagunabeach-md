#!/usr/bin/env node
/**
 * generate-dashboard-alerts.mjs — derived alert layer (audit 2026-06-10 A-3)
 *
 * The CONSCIOUSNESS alert section was originally cron-refreshed prose. After the
 * heartbeat→routine transition, no routine took over updates and it stalled at
 * 2026-04-30 as a zombie snapshot. This script demotes alerts to derived state:
 * each prebuild:dashboard run mechanically derives alerts from existing dashboard
 * JSON + cognitive-layer files, outputting public/api/dashboard-alerts.json.
 * consciousness-snapshot.sh detects that file and shows the top 6 (BECOME entry).
 *
 * Threshold calibration (REFLEXES #66): based on 2026-06-10 audit ground truth —
 * organ<50 red line follows ANATOMY usage guide, 404 red line follows
 * EXP-2026-04-11-A post-fix baseline 6%, inbox threshold follows LESSONS distill
 * trigger line (>=30 auto-scan) × 10 as red line (buffer design allows accumulation).
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

// ── 1. Organ score red line (ANATOMY: any organ < 50 needs intervention) ─────
const organism = readJson('public/api/dashboard-organism.json');
if (organism?.organs) {
  for (const o of organism.organs) {
    if (typeof o.score === 'number' && o.score < 50) {
      addAlert(
        `organ-${o.id}`,
        'red',
        `${o.emoji} ${o.nameZh || o.name} organ score ${o.score} < 50, needs intervention`,
        'dashboard-organism.json',
      );
    }
  }
} else {
  addAlert(
    'organism-missing',
    'red',
    'dashboard-organism.json missing or unparseable',
    'generator',
  );
}

// ── 2. Immune v2 status passthrough (status string IS the diagnosis) ─────────
const immune = readJson('public/api/dashboard-immune.json');
// drift/danger worse than attention; severity escalates accordingly (v1 regex
// missed the worse tiers, status degradation escaped alerts — caught at immune v3 launch)
if (
  immune?.status &&
  /需關注|漂移|危險|critical|attention|drift|danger/i.test(immune.status)
) {
  const sev = /危險|danger/i.test(immune.status)
    ? 'red'
    : /漂移|drift/i.test(immune.status)
      ? 'yellow'
      : 'yellow';
  addAlert(
    'immune-status',
    sev,
    `Immune v3=${immune.immuneScore}: ${immune.status}`,
    'dashboard-immune.json',
  );
}

// ── 3. Three-source sensing: 404 rate + AI crawler success rate ──────────────
const analytics = readJson('public/api/dashboard-analytics.json');
const cf = analytics?.cloudflare24h || analytics?.cloudflare;
if (cf) {
  const rate = parseFloat(cf.notFoundRate ?? cf['404Rate'] ?? NaN);
  if (!Number.isNaN(rate) && rate > 8) {
    // Red line 8%: EXP-2026-04-11-A post-fix baseline ~6%, > 8% = structural regression
    addAlert(
      'cf-404',
      'yellow',
      `CF 24h 404 rate ${rate}% > 8% (post-fix baseline ~6%)`,
      'dashboard-analytics.json',
    );
  }
}

// ── 4. UNKNOWNS falsifiable experiments overdue (audit I-3: mechanical check replaces human memory) ──
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
        `UNKNOWNS ${m[2]} verification date ${m[1]} overdue, not yet judged`,
        'UNKNOWNS.md',
      );
    }
  }
}

// ── 5. Inbox backlog red line (LESSONS distill trigger 30 × 10 = structural saturation) ─
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
    `LESSONS-INBOX ${lessonsCount} undigested entries > 300 saturation line`,
    'LESSONS-INBOX.md',
  );
} else if (lessonsCount > 200) {
  addAlert(
    'lessons-backlog',
    'yellow',
    `LESSONS-INBOX ${lessonsCount} undigested entries > 200 (distill capacity signal)`,
    'LESSONS-INBOX.md',
  );
}

// ── 6. MEMORY index exceeds distill trigger (MEMORY.md rule: > 80 rows triggers 3-layer distill) ─
const memoryPath = 'docs/semiont/MEMORY.md';
if (existsSync(memoryPath)) {
  const rows = countEntries(memoryPath, /^\| 20\d\d-/gm);
  if (rows > 80) {
    addAlert(
      'memory-index-rows',
      'yellow',
      `MEMORY.md index ${rows} rows > 80 distill trigger line (design 2026-04-14 not yet implemented)`,
      'MEMORY.md',
    );
  }
}

// ── 6.5 ARTICLE-INBOX ghost entries (status=done/dropped but not moved = archive-on-completion drift) ─
// Born 2026-06-19 inbox-distill: manual distill revealed 16 accumulated ghosts. Deep investigation +
// safe cleanup tool: scripts/tools/inbox-audit.py; cheap per-boot signal: inbox-signal.sh ghost line.
// Threshold >=3 yellow / >=8 red: catches well before "accumulate to 16" (archive rule requires same-session clear).
const inboxPath = 'docs/semiont/ARTICLE-INBOX.md';
if (existsSync(inboxPath)) {
  const text = readFileSync(inboxPath, 'utf8');
  const pIdx = text.search(/^## .*Pending/m);
  const pending = pIdx >= 0 ? text.slice(pIdx) : text;
  const ghosts = (pending.match(/^\s*-\s*\*\*Status\*\*.*/gm) || []).filter(
    (l) => /done|dropped|已完成|✅/.test(l) && !/pending/.test(l),
  ).length;
  if (ghosts >= 8) {
    addAlert(
      'inbox-ghosts',
      'red',
      `ARTICLE-INBOX ${ghosts} status=done entries not archived >= 8 (structural archive-rule drift; inbox-audit.py --apply-safe to clean)`,
      'ARTICLE-INBOX.md',
    );
  } else if (ghosts >= 3) {
    addAlert(
      'inbox-ghosts',
      'yellow',
      `ARTICLE-INBOX ${ghosts} status=done entries not archived (archive-rule drift; inbox-audit.py --apply-safe to clean)`,
      'ARTICLE-INBOX.md',
    );
  }
}

// ── 7. Dashboard JSON staleness (> 36h no update = refresh flywheel broken) ────
const vitals = readJson('public/api/dashboard-vitals.json');
if (vitals?.lastUpdated) {
  const ageH = (Date.now() - new Date(vitals.lastUpdated).getTime()) / 3.6e6;
  if (ageH > 36) {
    addAlert(
      'vitals-stale',
      'red',
      `dashboard-vitals.json ${Math.round(ageH)}h stale > 36h (data-refresh flywheel broken?)`,
      'dashboard-vitals.json',
    );
  }
}

// ── 8. Spore harvest backlog (OVERDUE backfill > 10 = reproductive system half-blind) ─
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
    `Spore harvest OVERDUE ${overdue} entries > 10 (posted without backfill = half-blind)`,
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
      note: 'Derived alert layer — mechanical takeover of CONSCIOUSNESS alerts (audit 2026-06-10 A-3)',
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
