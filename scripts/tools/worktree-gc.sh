#!/usr/bin/env bash
# worktree-gc.sh — worktree Safety回收（胼胝體鐵律：用完要刪，但刪前先儀器化Check有None丟工作）
#
# Cheyu reminder 2026-06-14：「worktree 用完要記得刪掉（Can儀器化Check是否有丟再刪），
# Don't一直累積一堆滯留file」。本tool刪前對Each worktree 驗三道：
# (1) locked？（可能是 live background agent）→ Skipped，除非 --force-locked
# (2) 有未 commit 變更？→ Keep（會丟工作）
# (3) 有未進 origin/main 的 commit？→ Keep（會丟工作）
# 三道全過才算「乾淨」可刪。判斷不確定時一律偏向「Keep」。
#
# Usage:
# bash scripts/tools/worktree-gc.sh # dry-run：列可刪 / Keep + cause
# bash scripts/tools/worktree-gc.sh --apply # 真的 remove 乾淨且 unlocked 的
# bash scripts/tools/worktree-gc.sh --apply --force-locked # 連 locked 的乾淨 worktree 也刪（自負risk）
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
 if [ "$cur_wt" = "$MAIN" ]; then cur_wt=""; cur_locked=0; return; fi # 永不動主 worktree

  if [ ! -d "$cur_wt" ]; then
 echo " prune $cur_wt（directory已Does not exist）"; pruned=$((pruned+1))
    [ "$APPLY" = 1 ] && git worktree prune 2>/dev/null
    cur_wt=""; cur_locked=0; return
  fi

  local br reason="" safe=1
  br="$(git -C "$cur_wt" rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"

  # (1) locked
 if [ "$cur_locked" = "1" ] && [ "$FORCE_LOCKED" = "0" ]; then reason="LOCKED（可能 live agent）"; safe=0; fi
 # (2) 未 commit 變更
  local dirty; dirty="$(git -C "$cur_wt" status --porcelain 2>/dev/null | grep -c . || true)"; dirty="${dirty:-0}"
 if [ "$dirty" -gt 0 ]; then reason="${reason:+$reason; }${dirty} 未 commit 變更"; safe=0; fi
 # (3) 未進 origin/main 的 commit
  local unpushed; unpushed="$(git -C "$cur_wt" log --oneline origin/main..HEAD 2>/dev/null | grep -c . || true)"; unpushed="${unpushed:-0}"
 if [ "$unpushed" -gt 0 ]; then reason="${reason:+$reason; }${unpushed} 未進 origin/main 的 commit"; safe=0; fi

  if [ "$safe" = "1" ]; then
 echo " REMOVE $cur_wt [$br]（乾淨：0 dirty / 0 unpushed）"; removable=$((removable+1))
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
echo "可刪（乾淨）: ${removable} / Keep（有未存工作或 locked）: ${kept} / prune（directory消失）: ${pruned}"
[ "$APPLY" = 0 ] && echo "（dry-run — 加 --apply 真的 remove；locked 的乾淨 worktree 需 --apply --force-locked）"
exit 0
