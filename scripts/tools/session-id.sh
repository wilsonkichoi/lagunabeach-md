#!/usr/bin/env bash
# session-id.sh — generate canonical session ID
# Format: YYYY-MM-DD-HHMMSS-{handle}
#
# Usage:
#   bash scripts/tools/session-id.sh                    # auto-detect handle / interactive prompt
#   bash scripts/tools/session-id.sh α                  # explicit Greek letter (cron scenario)
#   bash scripts/tools/session-id.sh BABEL-BATCH        # explicit AAAAA-BBBBB title
#   SESSION_HANDLE=β bash scripts/tools/session-id.sh   # via env var
#
# Handle detection chain:
#   1. CLI arg ($1)              — explicit, highest priority
#   2. $SESSION_HANDLE env var   — cron / scheduler injection
#   3. Worktree dirname          — inferred from pwd `.claude/worktrees/{name}`
#                                  normalize: strip any leading `YYYYMMDD-`
#                                  + trailing `-{hash}`, take the middle purpose-title
#   4. Interactive TTY prompt    — ask for AAAAA-BBBBB uppercase 2-3 keyword title (v3 added)
#   5. fallback `manual`         — cron non-TTY fallback
#
# Conventions (per reports/session-id-naming-2026-05-04.md
#       + reports/worktree-naming-2026-05-09.md
#       + 2026-05-09 brave-kirch-editorial upgraded to AAAAA-BBBBB uppercase):
#   - Cron heartbeat -> Greek letter (alpha/beta/gamma/delta/...)
#   - Claude Code worktree -> `YYYYMMDD-{purpose-title}` directory
#       e.g. directory `20260509-babel-batch2` -> handle = `babel-batch2`
#       Auto-codename worktrees (`charming-mclaren`) grandfathered; new ones use date+topic
#   - Interactive new session -> AAAAA-BBBBB (2-3 uppercase English keywords dash-joined)
#       e.g. `EDITORIAL-REWRITE` / `BABEL-BATCH-3` / `ROUTINE-FLYWHEEL`
#       Why uppercase: `ls` lex sort naturally groups them away from lowercase worktree handles
#       Why dash-joined: consistent with worktree naming, grep-friendly
#       Historical files not renamed (per time-is-structure-repair protocol)
#   - Observer-triggered manual -> reuse current worktree or manual-{topic}
#
# Three handle character sets are non-overlapping (Greek / lowercase-kebab / UPPERCASE-KEBAB),
# lexicographic sort auto-aligns chronological + species grouping.

set -euo pipefail

handle="${1:-${SESSION_HANDLE:-}}"

if [ -z "$handle" ]; then
  pwd_str=$(pwd)
  if [[ "$pwd_str" == *".claude/worktrees/"* ]]; then
    wt=$(echo "$pwd_str" | sed -E 's|.*/\.claude/worktrees/([^/]+).*|\1|')
    # Step 1: strip trailing hash (e.g. `charming-mclaren-7d79a7` -> `charming-mclaren`)
    handle=$(echo "$wt" | sed -E 's|-[0-9a-f]{6,}$||')
    # Step 2: strip leading YYYYMMDD- (new standard: `20260509-babel-batch2` -> `babel-batch2`)
    handle=$(echo "$handle" | sed -E 's|^[0-9]{8}-||')
    # Guard: if stripped to empty or pure 8-digit date (worktree has date but no topic) -> fall through to prompt
    if [ -z "$handle" ] || [[ "$handle" =~ ^[0-9]{8}$ ]]; then
      handle=""
    fi
  fi
fi

# Interactive prompt — only fires when TTY is available and handle not yet resolved
# Cron / Claude bash subshell / pipe redirect all skip (no TTY)
if [ -z "$handle" ] && [ -t 2 ] && [ -r /dev/tty ]; then
  {
    echo ""
    echo "🧬 Session handle not set. Enter a title for this session."
    echo "   Format: AAAAA-BBBBB (2-3 uppercase English keywords dash-joined)"
    echo "   Examples: EDITORIAL-REWRITE / BABEL-BATCH-3 / ROUTINE-FLYWHEEL"
    echo ""
    printf "   Title: "
  } >&2
  raw=""
  read -r raw </dev/tty || raw=""
  # Normalize: spaces -> dash, uppercase, strip non [A-Z0-9-], squash dashes, trim leading/trailing dashes
  raw=$(echo "$raw" \
    | tr '[:space:]' '-' \
    | tr '[:lower:]' '[:upper:]' \
    | sed -E 's/[^A-Z0-9-]+//g; s/-+/-/g; s/^-+|-+$//g')
  if [ -n "$raw" ]; then
    handle="$raw"
  fi
fi

# Final fallback: non-TTY environment (cron / Claude subshell) with no signal
if [ -z "$handle" ]; then
  handle="manual"
fi

date_str=$(date +%Y-%m-%d-%H%M%S)
echo "${date_str}-${handle}"
