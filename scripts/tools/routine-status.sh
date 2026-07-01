#!/usr/bin/env bash
# routine-status.sh — last 24hr cron routine run status (cross-session continuity signal)
#
# Phase A2 (per reports/become-boot-mode-design-2026-05-13.md section 5.3)
# Replaces BECOME Step 3 full ROUTINE.md (649 lines) loading requirement
#
# Purpose: BECOME Step 6 L4 always-load query feeds this script
# Output: ~3-5 line markdown summary (which routines ran in last 24h + timestamps)
#
# Design principle (per D7 boundary rule):
# YES: what cron did for me (cross-session continuity)
# NO: work artifact inspection (PR/issue list -> MAINTAINER Stage 1)

set -euo pipefail

MEMORY_DIR="${MEMORY_DIR:-docs/semiont/memory}"

if [[ ! -d "$MEMORY_DIR" ]]; then
  echo "⚠️ routine-status: $MEMORY_DIR does not exist"
  exit 0
fi

TODAY=$(date +%Y-%m-%d)
YESTERDAY=$(date -v-1d +%Y-%m-%d 2>/dev/null || date -d 'yesterday' +%Y-%m-%d)

# List routine memory files from last 24hr (filename schema: YYYY-MM-DD-HHMMSS-{handle}.md)
# Handle portion is routine name (e.g. twmd-data-refresh-am / twmd-maintainer-pm / spore-harvest-am)

ROUTINE_FIRES=$(
  ls "$MEMORY_DIR"/"$TODAY"-*.md "$MEMORY_DIR"/"$YESTERDAY"-*.md 2>/dev/null \
    | awk -F'/' '{print $NF}' \
    | awk -F'-' '
      {
        date = $1"-"$2"-"$3
        time = substr($4, 1, 2)":"substr($4, 3, 2)
        handle = ""
        for (i=5; i<=NF; i++) handle = handle (i>5?"-":"") $i
        sub(/\.md$/, "", handle)
        # only take routine-fire types (exclude manual / interactive sessions)
        if (handle ~ /^(twmd-|spore-|prebuild-)/) {
          print date" "time"  "handle
        }
      }
    ' \
    | sort -u
)

if [[ -z "$ROUTINE_FIRES" ]]; then
  echo "📋 routine | no cron fires in last 24hr (check ~/.claude/scheduled-tasks/ is working)"
  exit 0
fi

echo "📋 routine | last 24hr cron fires:"
echo "$ROUTINE_FIRES" | tail -10 | sed 's/^/  /'
