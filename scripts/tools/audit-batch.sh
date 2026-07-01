#!/usr/bin/env bash
# audit-batch.sh — mechanized detection of sub-agent batch cross-pollination commits
# Per REFLEXES #42 "Sub-agent N-article sequential three cheats" + REFLEXES #31 "Sub-agent claims are leads not facts"
# Usage:
#   bash scripts/tools/audit-batch.sh --since "2 hours ago"
#   bash scripts/tools/audit-batch.sh --since "2026-05-02 09:00"
#   bash scripts/tools/audit-batch.sh --hash-range "e63e0bbd..HEAD"
#
# Detection:
#   1. A commit touches multiple knowledge/ article .md files but message only mentions 1 -> cross-pollination alert
#   2. evolve/rewrite commit has no corresponding reports/research/{ym}/{slug}.md -> missing audit report alert

set -uo pipefail
cd "$(dirname "$0")/../.."

RED=$'\033[0;31m'
YEL=$'\033[0;33m'
GRN=$'\033[0;32m'
BLU=$'\033[0;34m'
DIM=$'\033[0;90m'
RST=$'\033[0m'

# Parse args
SINCE=""
HASH_RANGE=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --since) SINCE="$2"; shift 2 ;;
    --hash-range) HASH_RANGE="$2"; shift 2 ;;
    --help|-h)
      sed -n '2,11p' "$0"
      exit 0
      ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

if [[ -z "$SINCE" && -z "$HASH_RANGE" ]]; then
  SINCE="6 hours ago"
fi

if [[ -n "$HASH_RANGE" ]]; then
  RANGE_ARG=("$HASH_RANGE")
else
  RANGE_ARG=(--since="$SINCE")
fi

printf "%s═══ audit-batch.sh — sub-agent batch cheat detection ═══%s\n" "$BLU" "$RST"
printf "%sRange: %s%s\n\n" "$DIM" "${HASH_RANGE:-since=$SINCE}" "$RST"

COMMITS=$(git log "${RANGE_ARG[@]}" --pretty=format:'%H' 2>/dev/null)
if [[ -z "$COMMITS" ]]; then
  printf "%s⚠️  No commits in range%s\n" "$YEL" "$RST"
  exit 0
fi

CROSS_POLLINATION_COUNT=0
MISSING_AUDIT_COUNT=0
TOTAL_EVOLVE_COMMITS=0

# Layer 1: Cross-pollination detection
printf "%s── Layer 1: Cross-pollination commits (single commit touches multiple knowledge/ articles but message mentions only 1)%s\n\n" "$BLU" "$RST"

for hash in $COMMITS; do
  SUBJECT=$(git log -1 --pretty=format:'%s' "$hash" 2>/dev/null)

  # Skip non-evolve/rewrite commits + skip stage5/cross-link/heal/batch (legitimately touch multiple)
  if [[ ! "$SUBJECT" =~ (evolve|rewrite) ]]; then
    continue
  fi
  if [[ "$SUBJECT" =~ (stage5|cross-link|heal:|batch) ]]; then
    continue
  fi

  TOTAL_EVOLVE_COMMITS=$((TOTAL_EVOLVE_COMMITS + 1))

  ARTICLES=$(git show --stat --name-only "$hash" 2>/dev/null | \
    grep -E '^knowledge/[A-Z][a-zA-Z]+/[^/]+\.md$' | \
    grep -v '_Home\|_translations\|_taxonomy' | \
    sort -u)

  count=$(printf '%s\n' "$ARTICLES" | grep -c '^knowledge/' 2>/dev/null || true)
  count=${count:-0}

  if (( count > 1 )); then
    MENTIONED_COUNT=0
    while IFS= read -r art; do
      [[ -z "$art" ]] && continue
      slug=$(basename "$art" .md)
      if printf '%s' "$SUBJECT" | grep -qF "$slug"; then
        MENTIONED_COUNT=$((MENTIONED_COUNT + 1))
      fi
    done <<< "$ARTICLES"

    if (( MENTIONED_COUNT < count )); then
      SHORT=$(printf '%s' "$hash" | cut -c1-8)
      printf "%s🚨 %s%s: %s\n" "$RED" "$SHORT" "$RST" "$SUBJECT"
      printf "   touches %d articles, message mentions only %d:\n" "$count" "$MENTIONED_COUNT"
      printf '%s\n' "$ARTICLES" | sed 's/^/      /'
      printf "\n"
      CROSS_POLLINATION_COUNT=$((CROSS_POLLINATION_COUNT + 1))
    fi
  fi
done

if (( CROSS_POLLINATION_COUNT == 0 )); then
  printf "%s✅ no cross-pollination commits%s\n" "$GRN" "$RST"
fi
printf "\n"

# Layer 2: Missing audit report detection
printf "%s── Layer 2: Missing audit report (evolve/rewrite commit with no corresponding reports/research/ file)%s\n\n" "$BLU" "$RST"

CURRENT_YM=$(date +%Y-%m)
declare -a MISSING_REPORTS=()

for hash in $COMMITS; do
  SUBJECT=$(git log -1 --pretty=format:'%s' "$hash" 2>/dev/null)
  if [[ ! "$SUBJECT" =~ (evolve|rewrite) ]]; then
    continue
  fi
  if [[ "$SUBJECT" =~ (stage5|cross-link|heal:|batch) ]]; then
    continue
  fi

  ARTICLES=$(git show --stat --name-only "$hash" 2>/dev/null | \
    grep -E '^knowledge/[A-Z][a-zA-Z]+/[^/]+\.md$' | \
    grep -v '_Home\|_translations\|_taxonomy' | \
    sort -u)

  while IFS= read -r art; do
    [[ -z "$art" ]] && continue
    slug=$(basename "$art" .md)
    if [[ ! -f "reports/research/${CURRENT_YM}/${slug}.md" ]]; then
      SHORT=$(printf '%s' "$hash" | cut -c1-8)
      MISSING_REPORTS+=("$SHORT|$slug|$art")
      MISSING_AUDIT_COUNT=$((MISSING_AUDIT_COUNT + 1))
    fi
  done <<< "$ARTICLES"
done

if (( MISSING_AUDIT_COUNT == 0 )); then
  printf "%s✅ all evolve/rewrite commits have corresponding audit reports%s\n" "$GRN" "$RST"
else
  for entry in "${MISSING_REPORTS[@]}"; do
    IFS='|' read -r short slug art <<< "$entry"
    printf "%s⚠️  %s%s -> %s\n" "$YEL" "$short" "$RST" "$art"
    printf "   missing reports/research/%s/%s.md\n" "$CURRENT_YM" "$slug"
  done
fi
printf "\n"

# Summary
printf "%s═══ Summary ═══%s\n" "$BLU" "$RST"
printf "  Total evolve/rewrite commits: %d\n" "$TOTAL_EVOLVE_COMMITS"
printf "  Cross-pollination commits:    %d\n" "$CROSS_POLLINATION_COUNT"
printf "  Missing audit reports:        %d\n\n" "$MISSING_AUDIT_COUNT"

if (( CROSS_POLLINATION_COUNT > 0 || MISSING_AUDIT_COUNT > 0 )); then
  printf "%s❌ sub-agent cheats detected — add missing audit reports or split commits%s\n" "$RED" "$RST"
  printf "%scanonical: REFLEXES #42 + LESSONS-INBOX 2026-05-02 EVOLVE-batch%s\n" "$DIM" "$RST"
  exit 1
fi

printf "%s✅ Batch audit clean%s\n" "$GRN" "$RST"
exit 0
