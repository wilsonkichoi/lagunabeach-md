#!/usr/bin/env bash
# people-title-check.sh v1.0 — People category title colon-sandwich compliance check
# Per EDITORIAL.md principle 5 (v5.4, Issue #618): People/ titles must be "Name: representative arc or scene"
#
# Advisory tool (does not block commit), used for:
#   1. Dashboard KPI display of compliance rate
#   2. List files pending migration
#   3. Self-check for new PRs
#
# Usage:
#   bash scripts/tools/people-title-check.sh              # summary report
#   bash scripts/tools/people-title-check.sh --list       # list all non-compliant files
#   bash scripts/tools/people-title-check.sh --json       # JSON output (for dashboard)

set -uo pipefail
cd "$(dirname "$0")/../.."

KNOWLEDGE_DIR="knowledge/People"
JSON_MODE=false
LIST_MODE=false

for arg in "$@"; do
  [[ "$arg" == "--json" ]] && JSON_MODE=true
  [[ "$arg" == "--list" ]] && LIST_MODE=true
done

total=0
compliant=0
non_compliant=0
declare -a non_compliant_list=()

for filepath in "$KNOWLEDGE_DIR"/*.md; do
  [[ ! -f "$filepath" ]] && continue
  filename=$(basename "$filepath")
  # Skip hub / roadmap files (prefixed with _)
  [[ "$filename" == _* ]] && continue

  total=$((total + 1))

  # Extract title from frontmatter
  title=$(sed -n '/^---$/,/^---$/p' "$filepath" | grep -E "^title:" | head -1 | sed "s/title: *//; s/^['\"]//; s/['\"]$//")

  # Check: title must contain full-width colon ：
  if echo "$title" | grep -q "："; then
    compliant=$((compliant + 1))
  else
    non_compliant=$((non_compliant + 1))
    non_compliant_list+=("$filename|$title")
  fi
done

if [[ $total -eq 0 ]]; then
  echo "⚠️  No .md files found under $KNOWLEDGE_DIR, check path."
  exit 1
fi

compliance_pct=$(echo "scale=1; $compliant * 100 / $total" | bc)

if $JSON_MODE; then
  # JSON output for dashboard integration
  echo "{"
  echo "  \"total\": $total,"
  echo "  \"compliant\": $compliant,"
  echo "  \"nonCompliant\": $non_compliant,"
  echo "  \"complianceRate\": $compliance_pct,"
  echo "  \"nonCompliantFiles\": ["
  for i in "${!non_compliant_list[@]}"; do
    fname=$(echo "${non_compliant_list[$i]}" | cut -d'|' -f1)
    comma=","; [[ $i -eq $((${#non_compliant_list[@]} - 1)) ]] && comma=""
    echo "    \"$fname\"$comma"
  done
  echo "  ]"
  echo "}"
else
  echo ""
  echo "👤 people-title-check v1.0 — People title colon-sandwich compliance"
  echo "   Rule: EDITORIAL.md principle 5 (v5.4) | Issue #618"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📊 Total: $total articles"
  echo "   ✅ Compliant (Name: subtitle): $compliant ($compliance_pct%)"
  echo "   ❌ Pending migration (name only): $non_compliant"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [[ $non_compliant -gt 0 ]]; then
    if $LIST_MODE; then
      echo ""
      echo "❌ Full non-compliant list ($non_compliant articles):"
      for item in "${non_compliant_list[@]}"; do
        fname=$(echo "$item" | cut -d'|' -f1)
        title=$(echo "$item" | cut -d'|' -f2-)
        printf "   • %-40s  title: %s\n" "$fname" "$title"
      done
    else
      echo ""
      echo "   First 20 (use --list for full list):"
      count=0
      for item in "${non_compliant_list[@]}"; do
        fname=$(echo "$item" | cut -d'|' -f1)
        echo "   • $fname"
        count=$((count + 1))
        [[ $count -ge 20 ]] && echo "   ... $((non_compliant - 20)) more" && break
      done
    fi
    echo ""
    echo "📌 Required format: \"Name: representative arc or scene\""
    echo "   ❌ John Doe"
    echo "   ✅ John Doe: From early sketches to the founding of the Laguna Beach Art Association"
    echo ""
    echo "   Tiered sweep plan: see LESSONS-INBOX.md #2026-04-26"
  else
    echo ""
    echo "✅ All People article titles comply with the colon-sandwich rule!"
  fi
  echo ""
fi
