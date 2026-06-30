#!/usr/bin/env bash
# consciousness-snapshot.sh — instant CONSCIOUSNESS snapshot from dashboard JSON
#
# Phase A1.2 (per reports/become-boot-mode-design-2026-05-13.md §4.2)
# 取代 CONSCIOUSNESS.md L34-160 靜態快照（dashboard JSON ground truth）
#
# purpose：BECOME §Step 6 L4 always-load query 接這 script
# Output：~12-15 行 markdown summary (vitals + 8 organs + alerts hint)

set -euo pipefail

VITALS="${VITALS:-public/api/dashboard-vitals.json}"
ORGANISM="${ORGANISM:-public/api/dashboard-organism.json}"

if [[ ! -f "$VITALS" || ! -f "$ORGANISM" ]]; then
 echo "⚠️ consciousness-snapshot: dashboard JSON Does not exist"
 echo " try：bash scripts/core/refresh-data.sh"
  exit 0
fi

# Vitals — basic physiology
jq -r '
  "📊 vitals  | articles=\(.totalArticles) / contributors=\(.contributors) / 7d=+\(.articlesLast7Days) / 30d=+\(.articlesLast30Days) / human-reviewed=\(.humanReviewedPercent)%",
  "🌐 i18n    | en=\(.languageCoverage.en) ja=\(.languageCoverage["ja"]) ko=\(.languageCoverage.ko) es=\(.languageCoverage.es) fr=\(.languageCoverage.fr)"
' "$VITALS"

# Organs — 8 organ scores + trend
jq -r '
  "🫀 organs  | " + (
    [.organs[] | "\(.emoji)\(.score)\(if .trend == "up" then "↑" elif .trend == "down" then "↓" else "→" end)"] | join(" ")
  )
' "$ORGANISM"

# Immune dual-source reconciliation guard (audit 2026-06-10 D-1):
# organism.json immune organ vs dashboard-immune.json canonical v2 value.
# Divergence > 2 points = stale organism.json → print loud marker (REFLEXES #65d).
IMMUNE_JSON="${IMMUNE_JSON:-public/api/dashboard-immune.json}"
if [[ -f "$IMMUNE_JSON" ]]; then
  ORG_IMMUNE=$(jq -r '[.organs[] | select(.id == "immune") | .score][0] // empty' "$ORGANISM")
  V2_IMMUNE=$(jq -r '.immuneScore // empty' "$IMMUNE_JSON")
  if [[ -n "$ORG_IMMUNE" && -n "$V2_IMMUNE" ]]; then
    DIFF=$((ORG_IMMUNE - V2_IMMUNE)); [[ $DIFF -lt 0 ]] && DIFF=$((-DIFF))
    if [[ $DIFF -gt 2 ]]; then
 echo "⚠️ immune | organism.json=${ORG_IMMUNE} vs immune.json(v2 canonical)=${V2_IMMUNE} — stale-vs-canonical，跑 prebuild:dashboard regen"
    fi
  fi
fi

# Last update freshness
jq -r '
  "🕐 updated | \(.lastUpdated)"
' "$VITALS"

# Alerts — derived layer (audit 2026-06-10 A-3): dashboard-alerts.json when present
ALERTS="${ALERTS:-public/api/dashboard-alerts.json}"
if [[ -f "$ALERTS" ]]; then
  jq -r '.alerts[:6][] | "🚨 " + .severity + " | " + .message' "$ALERTS" 2>/dev/null ||
 echo "⚠️ alerts | dashboard-alerts.json exists但Formatabnormal"
else
 echo "⚠️ alerts | 詳見 docs/semiont/CONSCIOUSNESS.md §警報"
fi
