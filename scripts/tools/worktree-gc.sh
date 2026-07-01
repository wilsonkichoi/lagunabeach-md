#!/usr/bin/env bash
# worktree-gc.sh — safe worktree garbage collection (rule: clean up when done, but verify no work is lost before deleting)
#
# Pre-removal checks for each worktree:
#   (1) locked? (may be a live background agent) -> skip unless --force-locked
#   (2) uncommitted changes? -> keep (would lose work)
#   (3) commits not in origin/main? -> keep (would lose work)
# All three must pass to be considered "clean" and removable. When uncertain, always bias toward "keep".
#
# Usage:
#   bash scripts/tools/worktree-gc.sh                       # dry-run: list removable / kept + reason
#   bash scripts/tools/worktree-gc.sh --apply               # actually remove clean unlocked ones
#   bash scripts/tools/worktree-gc.sh --apply --force-locked # also remove clean locked worktrees (at your own risk)
set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "ERROR not-a-git-repo"; exit 2; }
MAIN="$(git rev-parse --show-toplevel)"
APPLY=0; FORCE_LOCKED=0
for a in "$@"; do
  [ "$a" = "--apply" ] && APPLY=1
  [ "$a" = "--force-locked" ] && FORCE_LOCKED=1
done

git fetch origin -q 2>/dev/null || true
removable=0; kept=0; pruned=0

cur_wt=""; cur_locked=0
flush() {
  [ -z "$cur_wt" ] && return
  if [ "$cur_wt" = "$MAIN" ]; then cur_wt=""; cur_locked=0; return; fi   # never touch main worktree

  if [ ! -d "$cur_wt" ]; then
    echo "  prune  $cur_wt (directory no longer exists)"; pruned=$((pruned+1))
    [ "$APPLY" = 1 ] && git worktree prune 2>/dev/null
    cur_wt=""; cur_locked=0; return
  fi

  local br reason="" safe=1
  br="$(git -C "$cur_wt" rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"

  # (1) locked
  if [ "$cur_locked" = "1" ] && [ "$FORCE_LOCKED" = "0" ]; then reason="LOCKED (possibly live agent)"; safe=0; fi
  # (2) uncommitted changes
  local dirty; dirty="$(git -C "$cur_wt" status --porcelain 2>/dev/null | grep -c . || true)"; dirty="${dirty:-0}"
  if [ "$dirty" -gt 0 ]; then reason="${reason:+$reason; }${dirty} uncommitted changes"; safe=0; fi
  # (3) commits not in origin/main
  local unpushed; unpushed="$(git -C "$cur_wt" log --oneline origin/main..HEAD 2>/dev/null | grep -c . || true)"; unpushed="${unpushed:-0}"
  if [ "$unpushed" -gt 0 ]; then reason="${reason:+$reason; }${unpushed} commits not in origin/main"; safe=0; fi

  if [ "$safe" = "1" ]; then
    echo "  REMOVE $cur_wt [$br] (clean: 0 dirty / 0 unpushed)"; removable=$((removable+1))
    if [ "$APPLY" = 1 ]; then
      local fflag=""; [ "$cur_locked" = "1" ] && fflag="--force"
      git worktree remove $fflag "$cur_wt" 2>&1 | sed 's/^/    /'
    fi
  else
    echo "  KEEP   $cur_wt [$br] — $reason"; kept=$((kept+1))
  fi
  cur_wt=""; cur_locked=0
}

while IFS= read -r line; do
  case "$line" in
    "worktree "*) flush; cur_wt="${line#worktree }" ;;
    "locked"*)    cur_locked=1 ;;
    "") ;;
  esac
done < <(git worktree list --porcelain)
flush

echo "---"
echo "removable (clean): ${removable}  /  kept (unsaved work or locked): ${kept}  /  pruned (dir gone): ${pruned}"
[ "$APPLY" = 0 ] && echo "(dry-run — add --apply to actually remove; clean locked worktrees need --apply --force-locked)"
exit 0
