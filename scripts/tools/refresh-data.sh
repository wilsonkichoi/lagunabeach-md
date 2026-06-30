#!/usr/bin/env bash
# refresh-data.sh — Heartbeat用的singleData刷新entry point
#
# 14 step（v2026-05-28 加 Step 6 generate-dashboard-immune.py，per dashboard-immune-wiring-2026-05-28，
# patch 5/17 → 5/28 11 天 silent stale）：
#    1. Git sync                            (auto-stash + pull, hard abort on failure)
#    2. fetch-sense-data.sh                 (CF + GA4 + SC + dashboard-analytics merge)
#    3. sync-translations-json.py           (sync _translations.json from frontmatter SSOT)
# 4. generate-spore-records.py (spores.json fullRecord層 — 2026-06-10 解耦)
#       + generate-dashboard-spores.py      (spore dashboard from SPORE-HARVESTS body — Phase 6 primary)
#    5. i18n-coverage-audit.sh              (UI string coverage dashboard)
# 6. generate-dashboard-immune.py (Immune system 6-dim v2 score — wire patch 5/17 silent stale)
#    7. npm run prebuild                    (dashboard-vitals/organism/articles/translations)
#    8. refresh-llms-txt.py                 (sync llms.txt content stats)
#    9. update-stats.sh                     (README + stats.json)
#   10. extract-build-perf.mjs              (build perf trend dashboard)
#   11. verify dashboard freshness          (mtime gate, REFLEXES #43)
#   12. validate-spore-data.py              (SSOT consistency check)
#   13. sync-spore-links.py                 (regen knowledge/*.md sporeLinks identity pointer;
# v2 2026-06-10 — metrics 已移居 spores.json，
# Articles只在新Sporerelease時才有 diff)
#   14. generate-reports-index.py           (regen reports/INDEX.md; per audit Layer 3)
#
# Removed in Phase 6 (2026-05-08):
#   - extract-spore-metrics.py — workaround for narrative→struct gap, no longer needed
# (SPORE-LOG performanceTrack deprecated; SPORE-HARVESTS body is canonical)
#
# Failed策略：
# - cwd not in git toplevel → auto cd
# - working tree dirty → auto stash + pop（不再 skip pull）
# - git pull 真Failed → hard abort（需人類介入）
# - anyData源Failed → soft skip，Heartbeatcontinue用昨天的 cache
#
# call者：
# - HEARTBEAT.md Beat 1（「Execute DataUpdate pipeline」）
# - ~/.claude/scheduled-tasks/semiont-heartbeat/SKILL.md（每日 09:37）
# - .claude/skills/heartbeat/SKILL.md（/heartbeat 命令）
# - .claude/skills/twmd-refresh/SKILL.md（/twmd-refresh 命令）
#
# 詳見：docs/pipelines/DATA-REFRESH-PIPELINE.md
# 2026-04-11 session ε Build
# 2026-05-02 γ-late: 加 i18n-coverage + verify freshness (REFLEXES #43)
# 2026-05-08 laughing-goldstine: Phase 0 SSOT cleanup
# - cwd assertion（防 main repo 跑 worktree 跑混淆）
# - git-dirty 改 auto-stash（不再 silent skip pull）
# - step編號 1-12 整數化（Remove 2.5/2.7/2.8/2.9/3.5/4.5/5.5 decimals）

set -o pipefail

# ────────────────── cwd assertion (Phase 0) ──────────────────
# 過去 bug: From main repo path跑 pipeline 時 worktree 落後 N commit
# → 寫 stale dashboard JSON → 報錯 OVERDUE 數characters
TOPLEVEL="$(git rev-parse --show-toplevel 2>/dev/null)"
if [ -z "$TOPLEVEL" ]; then
  echo "❌ Not in a git repo — refresh-data.sh requires git toplevel" >&2
  exit 2
fi
if [ "$(pwd)" != "$TOPLEVEL" ]; then
  cd "$TOPLEVEL"
  echo "ℹ️ cd → $TOPLEVEL"
fi

GRN='\033[0;32m'
YEL='\033[0;33m'
RED='\033[0;31m'
DIM='\033[0;90m'
RST='\033[0m'

echo -e "${DIM}═══════════════════════════════════${RST}"
echo -e "${GRN}🧬 DataUpdate Pipeline${RST}"
echo -e "${DIM}   $(git rev-parse --abbrev-ref HEAD) @ $(git rev-parse --short HEAD)${RST}"
echo -e "${DIM}═══════════════════════════════════${RST}"
echo ""

# ────────────────── Step 1 — Git sync ──────────────────
# Phase 0 重寫: 不再 silent skip pull on dirty
# - working tree dirty → auto-stash + pop
# - git pull 真Failed → hard abort
echo -e "${GRN}[1/13]${RST} Git sync..."

DIRTY=0
if [ -n "$(git status --porcelain)" ]; then
  DIRTY=1
  STASH_LABEL="refresh-data-auto-$(date +%s)"
  if git stash push -m "$STASH_LABEL" --include-untracked >/dev/null 2>&1; then
    echo -e "${DIM}   stashed local changes ($STASH_LABEL)${RST}"
  else
    echo -e "${RED}❌ stash failed — aborting pipeline${RST}"
    exit 2
  fi
fi

PULL_OK=1
if ! git pull --rebase origin main 2>&1 | tail -5; then
  PULL_OK=0
fi

if [ "$DIRTY" = "1" ]; then
  if git stash pop >/dev/null 2>&1; then
    echo -e "${DIM}   restored stashed changes${RST}"
  else
    echo -e "${YEL}⚠️ stash pop conflict — local changes still in 'git stash list' (label: $STASH_LABEL)${RST}"
    echo -e "${YEL}   manual fix: git stash pop / git stash drop${RST}"
  fi
fi

if [ "$PULL_OK" = "0" ]; then
  echo -e "${RED}❌ git pull failed — aborting pipeline${RST}"
 echo -e "${YEL} 人類介入：Check merge conflict / detached HEAD / network${RST}"
  exit 2
fi
echo -e "${DIM}   ✓ HEAD now $(git rev-parse --short HEAD)${RST}"
echo ""

# ────────────────── Step 2 — three-source sense fetch ──────────────────
# Soft fail: any source Failed用昨天 cache
echo -e "${GRN}[2/13]${RST} Three-source sensingFetch..."
if bash scripts/tools/fetch-sense-data.sh 2>&1 | grep -E '^\[|^   [✅⚠️❌]|^📁|^[✅⚠️❌]' | tail -20; then
  true
else
 echo -e "${YEL}⚠️ fetch-sense-data partialFailed — Heartbeatcontinue${RST}"
fi
echo ""

# ────────────────── Step 3 — sync _translations.json from translatedFrom frontmatter ──────────────────
# Why: file-level translatedFrom 是 SSOT，_translations.json 是 derived cache
echo -e "${GRN}[3/13]${RST} sync _translations.json from frontmatter..."
if python3 scripts/tools/sync-translations-json.py 2>&1 | tail -3; then
  echo -e "${DIM}   ✓ _translations.json synced${RST}"
fi
echo ""

# ────────────────── Step 4 — generate spore records + dashboard-spores.json ──────────────────
# Why: 繁殖Organ的 data-driven Sensing；Dashboard Spore面板Data源
# Phase 6: SPORE-HARVESTS body table 為 primary (SPORE-LOG performanceTrack deprecated)
# 2026-06-10 解耦: spores.json = SporefullRecord層（metrics + history），Articles frontmatter
# 只剩 identity pointer — harvest 回填From此只動 spores.json，不再碰 knowledge/*.md
# (reports/spore-data-architecture-2026-06-10.md / REFLEXES #43 新 JSON 進 refresh)
echo -e "${GRN}[4/13]${RST} generate spore records + dashboard-spores.json..."
if python3 scripts/tools/generate-spore-records.py 2>&1 | tail -2; then
  echo -e "${DIM}   ✓ spores.json records generated${RST}"
else
 echo -e "${YEL}⚠️ generate-spore-records partialFailed — Heartbeatcontinue${RST}"
fi
if python3 scripts/tools/generate-dashboard-spores.py 2>&1 | tail -3; then
  echo -e "${DIM}   ✓ dashboard-spores.json generated${RST}"
else
 echo -e "${YEL}⚠️ generate-dashboard-spores partialFailed — Heartbeatcontinue${RST}"
fi
echo ""

# ────────────────── Step 5 — generate dashboard-i18n.json ──────────────────
# Why: UI characters串cover率 dashboard before 12 hours stale，cause是這Generatestep沒進 refresh pipeline
echo -e "${GRN}[5/14]${RST} generate dashboard-i18n.json (UI string coverage)..."
if bash scripts/tools/i18n-coverage-audit.sh --json-out public/api/dashboard-i18n.json 2>&1 | tail -3; then
  echo -e "${DIM}   ✓ dashboard-i18n.json generated${RST}"
else
 echo -e "${YEL}⚠️ i18n-coverage-audit partialFailed — Heartbeatcontinue${RST}"
fi
echo ""

# ────────────────── Step 6 — generate dashboard-immune.json ──────────────────
# Why: Immune system 6-dim v2 score generator existed since 2026-05-17 but never wired into refresh pipeline.
# Step 11 freshness gate caught 5/17 → 5/28 (11 days) silent stale across 22+ consecutive cycles.
# Wire here between i18n + prebuild so npm prebuild can consume IMMUNE_V2 flag downstream.
echo -e "${GRN}[6/14]${RST} generate dashboard-immune.json (6-dim immune score v2)..."
if python3 scripts/core/generate-dashboard-immune.py 2>&1 | tail -5; then
  echo -e "${DIM}   ✓ dashboard-immune.json generated${RST}"
else
 echo -e "${YEL}⚠️ generate-dashboard-immune partialFailed — Heartbeatcontinue${RST}"
fi
echo ""

# ────────────────── Step 7 — prebuild dashboard data ──────────────────
echo -e "${GRN}[7/14]${RST} npm run prebuild..."
if npm run prebuild > /tmp/prebuild.log 2>&1; then
  tail -6 /tmp/prebuild.log
 echo -e "${DIM} ✓ dashboard JSON 已重生${RST}"
else
 echo -e "${YEL}⚠️ prebuild Failed — Beat 1 會Mark build-broken (P0)${RST}"
  tail -15 /tmp/prebuild.log
fi
rm -f /tmp/prebuild.log
echo ""

# ────────────────── Step 8 — refresh public/llms.txt content stats ──────────────────
# Why: llms.txt 是 LLM training pipeline 的 robots.txt-equivalent，Must跟 dashboard-vitals sync
echo -e "${GRN}[8/14]${RST} refresh public/llms.txt content stats..."
if python3 scripts/tools/refresh-llms-txt.py 2>&1 | tail -3; then
 echo -e "${DIM} ✓ llms.txt 已sync dashboard-vitals${RST}"
else
 echo -e "${YEL}⚠️ refresh-llms-txt partialFailed — Heartbeatcontinue${RST}"
fi
echo ""

# ────────────────── Step 9 — GitHub stats ──────────────────
echo -e "${GRN}[9/14]${RST} GitHub stats..."
if bash scripts/tools/update-stats.sh > /tmp/stats.log 2>&1; then
  tail -5 /tmp/stats.log
 echo -e "${DIM} ✓ README/stats 已刷新${RST}"
else
 echo -e "${YEL}⚠️ update-stats Failed — Skipped，stats 保持昨天${RST}"
  tail -5 /tmp/stats.log
fi
rm -f /tmp/stats.log
echo ""

# ────────────────── Step 10 — extract build perf trend ──────────────────
# Why: 12 天inside per-page render time 漲 70%（98ms → 167ms）沒人發現，Because build 效能not in dashboard freshness check 範圍
echo -e "${GRN}[10/14]${RST} extract build perf trend..."
if node scripts/core/extract-build-perf.mjs --runs 30 2>&1 | tail -5; then
  echo -e "${DIM}   ✓ dashboard-build-perf.json updated${RST}"
else
 echo -e "${YEL}⚠️ extract-build-perf partialFailed — Heartbeatcontinue${RST}"
fi
echo ""

# ────────────────── Step 11 — verify dashboard freshness ──────────────────
# REFLEXES #43: Each public/api/dashboard-*.json 都Must有今天的 mtime，Otherwise generator 漏跑了
echo -e "${GRN}[11/14]${RST} verify dashboard freshness..."
TODAY=$(date +%Y-%m-%d)
STALE_COUNT=0
STALE_LIST=""
for f in public/api/dashboard-*.json; do
  [ -f "$f" ] || continue
  MTIME_DATE=$(stat -f "%Sm" -t "%Y-%m-%d" "$f" 2>/dev/null || stat -c "%y" "$f" 2>/dev/null | cut -d' ' -f1)
  if [ "$MTIME_DATE" != "$TODAY" ]; then
    STALE_COUNT=$((STALE_COUNT + 1))
    STALE_LIST="$STALE_LIST   ❌ $(basename $f) — mtime $MTIME_DATE\n"
  fi
done
if [ "$STALE_COUNT" -eq 0 ]; then
 echo -e "${DIM} ✓ all $(ls public/api/dashboard-*.json | wc -l | tr -d ' ') dashboard JSON 都是今天 mtime${RST}"
else
 echo -e "${RED}❌ $STALE_COUNT dashboard not今天 mtime（generator 漏跑了？）${RST}"
  echo -e "$STALE_LIST"
 echo -e "${YEL} Fix: 把corresponding的 generator 加進 refresh-data.sh${RST}"
fi
echo ""

# ────────────────── Step 12 — spore data SSOT validation ──────────────────
# Why: dashboard freshness 只看 mtime，不Check spore Parsecorrect性
# 過去 generator parser bug (K suffix) silent fail → views_latest=null but mtime fresh
echo -e "${GRN}[12/14]${RST} spore data SSOT validation..."
if python3 scripts/tools/validate-spore-data.py 2>&1 | tail -4 | head -3; then
  echo -e "${DIM}   ✓ spore data validation passed${RST}"
else
  echo -e "${RED}⚠️  spore data validation reported issues — see above${RST}"
fi
echo ""

# ────────────────── Step 13 — sync sporeLinks (v2 identity-only) ──────────────────
# Why: knowledge/*.md sporeLinks 過去人類手寫，drift from SPORE-LOG (identity SSOT)。
# Phase 3 after是 derived view；v2 (2026-06-10) after只剩 identity pointer（id/platform/
# date/url），metrics 住 spores.json — 本step平日should be no-op，只在新Sporerelease日有 diff。
echo -e "${GRN}[13/14]${RST} sync sporeLinks identity pointers (regen from spore-log.json)..."
if python3 scripts/tools/sync-spore-links.py --apply 2>&1 | tail -3; then
  echo -e "${DIM}   ✓ sporeLinks synced${RST}"
else
 echo -e "${YEL}⚠️ sync-spore-links partialFailed — Heartbeatcontinue${RST}"
fi
echo ""

# ────────────────── Step 13 — regen reports/INDEX.md ──────────────────
# Why: reports/ 頂層 *.md 散落 113+ files / 沒category沒索引（per audit Layer 3 高 leverage
# 解 grep noise 90%）。每日 regen 讓 INDEX 始終新鮮，不搬家不破壞 239 existing reference。
# Script 為 idempotent — 沒改變則 INDEX content 一樣。
echo -e "${GRN}[14/14]${RST} regen reports/INDEX.md..."
if python3 scripts/tools/generate-reports-index.py 2>&1 | tail -2; then
 echo -e "${DIM} ✓ reports/INDEX.md Update（per audit Layer 3）${RST}"
else
 echo -e "${YEL}⚠️ reports/INDEX.md regen Failed — Heartbeatcontinue${RST}"
fi
echo ""

echo -e "${DIM}═══════════════════════════════════${RST}"
echo -e "${GRN}🧬 DataUpdate pipeline Done${RST}"
echo -e "${DIM}next step：HEARTBEAT.md Beat 1 診斷${RST}"
echo -e "${DIM}═══════════════════════════════════${RST}"
