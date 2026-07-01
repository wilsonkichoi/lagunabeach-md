#!/usr/bin/env bash
# refresh-data.sh — single data-refresh entry point for heartbeat
#
# 14 steps (v2026-05-28 added Step 6 generate-dashboard-immune.py, per dashboard-immune-wiring-2026-05-28,
# fixing 5/17 to 5/28 11-day silent stale):
#    1. Git sync                            (auto-stash + pull, hard abort on failure)
#    2. fetch-sense-data.sh                 (CF + GA4 + SC + dashboard-analytics merge)
#    3. sync-translations-json.py           (sync _translations.json from frontmatter SSOT)
#    4. generate-spore-records.py           (spores.json full record layer, 2026-06-10 decoupled)
#       + generate-dashboard-spores.py      (spore dashboard from SPORE-HARVESTS body, Phase 6 primary)
#    5. i18n-coverage-audit.sh              (UI string coverage dashboard)
#    6. generate-dashboard-immune.py        (immune system 6-dim v2 score, wire fix for 5/17 silent stale)
#    7. npm run prebuild                    (dashboard-vitals/organism/articles/translations)
#    8. refresh-llms-txt.py                 (sync llms.txt content stats)
#    9. update-stats.sh                     (README + stats.json)
#   10. extract-build-perf.mjs              (build perf trend dashboard)
#   11. verify dashboard freshness          (mtime gate, REFLEXES #43)
#   12. validate-spore-data.py              (SSOT consistency check)
#   13. sync-spore-links.py                 (regen knowledge/*.md sporeLinks identity pointer;
#                                            v2 2026-06-10, metrics moved to spores.json,
#                                            articles only diff on new spore publish day)
#   14. generate-reports-index.py           (regen reports/INDEX.md; per audit Layer 3)
#
# Removed in Phase 6 (2026-05-08):
#   - extract-spore-metrics.py — workaround for narrative-to-struct gap, no longer needed
#     (SPORE-LOG tracking deprecated; SPORE-HARVESTS body is canonical)
#
# Failure strategy:
#   - cwd not at git toplevel  -> auto cd
#   - working tree dirty       -> auto stash + pop (no longer skip pull)
#   - git pull fails           -> hard abort (human intervention needed)
#   - any data source fails    -> soft skip, heartbeat uses yesterday's cache
#
# Callers:
#   - HEARTBEAT.md Beat 1 ("run data-refresh pipeline")
#   - ~/.claude/scheduled-tasks/semiont-heartbeat/SKILL.md (daily 09:37)
#   - .claude/skills/heartbeat/SKILL.md (/heartbeat command)
#   - .claude/skills/twmd-refresh/SKILL.md (/twmd-refresh command)
#
# See: docs/pipelines/DATA-REFRESH-PIPELINE.md
# 2026-04-11 session epsilon built
# 2026-05-02 gamma-late: added i18n-coverage + verify freshness (REFLEXES #43)
# 2026-05-08 laughing-goldstine: Phase 0 SSOT cleanup
#   - cwd assertion (prevent main repo / worktree confusion)
#   - git-dirty changed to auto-stash (no longer silent skip pull)
#   - step numbering normalized to integers (removed 2.5/2.7/2.8/2.9/3.5/4.5/5.5 decimals)

set -o pipefail

# ────────────────── cwd assertion (Phase 0) ──────────────────
# Past bug: running pipeline from main repo path when worktree was N commits behind
# -> wrote stale dashboard JSON -> reported wrong OVERDUE numbers
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
echo -e "${GRN}🧬 Data Refresh Pipeline${RST}"
echo -e "${DIM}   $(git rev-parse --abbrev-ref HEAD) @ $(git rev-parse --short HEAD)${RST}"
echo -e "${DIM}═══════════════════════════════════${RST}"
echo ""

# ────────────────── Step 1 — Git sync ──────────────────
# Phase 0 rewrite: no longer silent skip pull on dirty
# - working tree dirty -> auto-stash + pop
# - git pull fails     -> hard abort
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
  echo -e "${YEL}   human intervention needed: check merge conflict / detached HEAD / network${RST}"
  exit 2
fi
echo -e "${DIM}   ✓ HEAD now $(git rev-parse --short HEAD)${RST}"
echo ""

# ────────────────── Step 2 — three-source sense fetch ──────────────────
# Soft fail: any source failure uses yesterday's cache
echo -e "${GRN}[2/13]${RST} three-source sense fetch..."
if bash scripts/tools/fetch-sense-data.sh 2>&1 | grep -E '^\[|^   [✅⚠️❌]|^📁|^[✅⚠️❌]' | tail -20; then
  true
else
  echo -e "${YEL}⚠️  fetch-sense-data partial failure — heartbeat continues${RST}"
fi
echo ""

# ────────────────── Step 3 — sync _translations.json from translatedFrom frontmatter ──────────────────
# Why: file-level translatedFrom is SSOT, _translations.json is derived cache
echo -e "${GRN}[3/13]${RST} sync _translations.json from frontmatter..."
if python3 scripts/tools/sync-translations-json.py 2>&1 | tail -3; then
  echo -e "${DIM}   ✓ _translations.json synced${RST}"
fi
echo ""

# ────────────────── Step 4 — generate spore records + dashboard-spores.json ──────────────────
# Why: data-driven sensing for the reproduction organ; dashboard spore panel data source
# Phase 6: SPORE-HARVESTS body table is primary (SPORE-LOG tracking deprecated)
# 2026-06-10 decoupled: spores.json = full spore record layer (metrics + history), article frontmatter
# only has identity pointer — harvest backfill now only touches spores.json, not knowledge/*.md
# (reports/spore-data-architecture-2026-06-10.md / REFLEXES #43 new JSON in refresh)
echo -e "${GRN}[4/13]${RST} generate spore records + dashboard-spores.json..."
if python3 scripts/tools/generate-spore-records.py 2>&1 | tail -2; then
  echo -e "${DIM}   ✓ spores.json records generated${RST}"
else
  echo -e "${YEL}⚠️  generate-spore-records partial failure — heartbeat continues${RST}"
fi
if python3 scripts/tools/generate-dashboard-spores.py 2>&1 | tail -3; then
  echo -e "${DIM}   ✓ dashboard-spores.json generated${RST}"
else
  echo -e "${YEL}⚠️  generate-dashboard-spores partial failure — heartbeat continues${RST}"
fi
echo ""

# ────────────────── Step 5 — generate dashboard-i18n.json ──────────────────
# Why: UI string coverage dashboard was 12h stale because this generation step was not in refresh pipeline
echo -e "${GRN}[5/14]${RST} generate dashboard-i18n.json (UI string coverage)..."
if bash scripts/tools/i18n-coverage-audit.sh --json-out public/api/dashboard-i18n.json 2>&1 | tail -3; then
  echo -e "${DIM}   ✓ dashboard-i18n.json generated${RST}"
else
  echo -e "${YEL}⚠️  i18n-coverage-audit partial failure — heartbeat continues${RST}"
fi
echo ""

# ────────────────── Step 6 — generate dashboard-immune.json ──────────────────
# Why: immune system 6-dim v2 score generator existed since 2026-05-17 but never wired into refresh pipeline.
# Step 11 freshness gate caught 5/17 → 5/28 (11 days) silent stale across 22+ consecutive cycles.
# Wire here between i18n + prebuild so npm prebuild can consume IMMUNE_V2 flag downstream.
echo -e "${GRN}[6/14]${RST} generate dashboard-immune.json (6-dim immune score v2)..."
if python3 scripts/core/generate-dashboard-immune.py 2>&1 | tail -5; then
  echo -e "${DIM}   ✓ dashboard-immune.json generated${RST}"
else
  echo -e "${YEL}⚠️  generate-dashboard-immune partial failure — heartbeat continues${RST}"
fi
echo ""

# ────────────────── Step 7 — prebuild dashboard data ──────────────────
echo -e "${GRN}[7/14]${RST} npm run prebuild..."
if npm run prebuild > /tmp/prebuild.log 2>&1; then
  tail -6 /tmp/prebuild.log
  echo -e "${DIM}   ✓ dashboard JSON regenerated${RST}"
else
  echo -e "${YEL}⚠️  prebuild failed — Beat 1 will flag build-broken (P0)${RST}"
  tail -15 /tmp/prebuild.log
fi
rm -f /tmp/prebuild.log
echo ""

# ────────────────── Step 8 — refresh public/llms.txt content stats ──────────────────
# Why: llms.txt is the robots.txt-equivalent for LLM training pipelines, must stay in sync with dashboard-vitals
echo -e "${GRN}[8/14]${RST} refresh public/llms.txt content stats..."
if python3 scripts/tools/refresh-llms-txt.py 2>&1 | tail -3; then
  echo -e "${DIM}   ✓ llms.txt synced with dashboard-vitals${RST}"
else
  echo -e "${YEL}⚠️  refresh-llms-txt partial failure — heartbeat continues${RST}"
fi
echo ""

# ────────────────── Step 9 — GitHub stats ──────────────────
echo -e "${GRN}[9/14]${RST} GitHub stats..."
if bash scripts/tools/update-stats.sh > /tmp/stats.log 2>&1; then
  tail -5 /tmp/stats.log
  echo -e "${DIM}   ✓ README/stats refreshed${RST}"
else
  echo -e "${YEL}⚠️  update-stats failed — skipping, stats keep yesterday's values${RST}"
  tail -5 /tmp/stats.log
fi
rm -f /tmp/stats.log
echo ""

# ────────────────── Step 10 — extract build perf trend ──────────────────
# Why: per-page render time grew 70% (98ms to 167ms) over 12 days unnoticed because build perf was not in dashboard freshness check scope
echo -e "${GRN}[10/14]${RST} extract build perf trend..."
if node scripts/core/extract-build-perf.mjs --runs 30 2>&1 | tail -5; then
  echo -e "${DIM}   ✓ dashboard-build-perf.json updated${RST}"
else
  echo -e "${YEL}⚠️  extract-build-perf partial failure — heartbeat continues${RST}"
fi
echo ""

# ────────────────── Step 11 — verify dashboard freshness ──────────────────
# REFLEXES #43: every public/api/dashboard-*.json must have today's mtime, otherwise a generator was skipped
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
  echo -e "${DIM}   ✓ all $(ls public/api/dashboard-*.json | wc -l | tr -d ' ') dashboard JSONs have today's mtime${RST}"
else
  echo -e "${RED}❌ $STALE_COUNT dashboard(s) not today's mtime (generator missed?)${RST}"
  echo -e "$STALE_LIST"
  echo -e "${YEL}   fix: add the corresponding generator to refresh-data.sh${RST}"
fi
echo ""

# ────────────────── Step 12 — spore data SSOT validation ──────────────────
# Why: dashboard freshness only checks mtime, not spore parse correctness
# Past generator parser bug (K suffix) silent fail -> views_latest=null but mtime fresh
echo -e "${GRN}[12/14]${RST} spore data SSOT validation..."
if python3 scripts/tools/validate-spore-data.py 2>&1 | tail -4 | head -3; then
  echo -e "${DIM}   ✓ spore data validation passed${RST}"
else
  echo -e "${RED}⚠️  spore data validation reported issues — see above${RST}"
fi
echo ""

# ────────────────── Step 13 — sync sporeLinks (v2 identity-only) ──────────────────
# Why: knowledge/*.md sporeLinks were hand-written, drifted from SPORE-LOG (identity SSOT).
# After Phase 3 it is a derived view; v2 (2026-06-10) only has identity pointer (id/platform/
# date/url), metrics live in spores.json. This step is usually a no-op, only diffs on new spore publish day.
echo -e "${GRN}[13/14]${RST} sync sporeLinks identity pointers (regen from spore-log.json)..."
if python3 scripts/tools/sync-spore-links.py --apply 2>&1 | tail -3; then
  echo -e "${DIM}   ✓ sporeLinks synced${RST}"
else
  echo -e "${YEL}⚠️  sync-spore-links partial failure — heartbeat continues${RST}"
fi
echo ""

# ────────────────── Step 14 — regen reports/INDEX.md ──────────────────
# Why: reports/ top-level has 113+ scattered .md files with no index (per audit Layer 3, high leverage
# to reduce grep noise 90%). Daily regen keeps INDEX fresh without moving files or breaking 239 existing references.
# Script is idempotent: if nothing changed, INDEX content stays the same.
echo -e "${GRN}[14/14]${RST} regen reports/INDEX.md..."
if python3 scripts/tools/generate-reports-index.py 2>&1 | tail -2; then
  echo -e "${DIM}   ✓ reports/INDEX.md updated (per audit Layer 3)${RST}"
else
  echo -e "${YEL}⚠️  reports/INDEX.md regen failed — heartbeat continues${RST}"
fi
echo ""

echo -e "${DIM}═══════════════════════════════════${RST}"
echo -e "${GRN}🧬 Data refresh pipeline complete${RST}"
echo -e "${DIM}Next: HEARTBEAT.md Beat 1 diagnosis${RST}"
echo -e "${DIM}═══════════════════════════════════${RST}"
