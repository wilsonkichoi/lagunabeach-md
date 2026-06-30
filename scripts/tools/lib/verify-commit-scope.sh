#!/usr/bin/env bash
# verify-commit-scope.sh — commit 範圍自檢（胼胝體鐵律 commit 防線 / cross-session-git-index-pollution vc=2）
#
# 多核心parallel時 git index / working tree 是共享的。「我」commit 前後都可能掃進
# 別 session 的檔（誤掃 977 untracked）或誤刪 sibling 在用的檔（phantom delete）。
# 這驗 staged / committed 的檔數 == 我expected的數，不對就 fail-loud。
#
# Usage:
# bash .../verify-commit-scope.sh --staged <expected> # commit 前驗 index
# bash .../verify-commit-scope.sh --head <expected> # commit 後驗 HEAD（含 phantom-delete Check）
# bash .../verify-commit-scope.sh --staged # 不給 expected → 只印list供人眼確認
#
# exit: 0=scope 對 / 1=mismatch 或有 phantom delete / 2=usage
set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "ERROR not-a-git-repo"; exit 2; }

mode="${1:-}"; expected="${2:-}"
case "$mode" in
  --staged)
    files="$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null || true)"
    dels="$(git diff --cached --name-only --diff-filter=D 2>/dev/null | grep -c . || true)"
    label="staged" ;;
  --head)
    files="$(git show HEAD --name-only --format="" --diff-filter=ACMR 2>/dev/null | grep -v '^$' || true)"
    dels="$(git show HEAD --name-only --format="" --diff-filter=D 2>/dev/null | grep -c . || true)"
    label="HEAD" ;;
  *) echo "usage: $0 --staged|--head [expected_count]"; exit 2 ;;
esac

count="$(printf '%s\n' "$files" | grep -c . || true)"; count="${count:-0}"; dels="${dels:-0}"
echo "scope（$label）: ${count} 檔 / ${dels} deletions（expected: ${expected:-未指定}）"
[ "$count" -gt 0 ] && printf '%s\n' "$files" | sed 's/^/  + /'
[ "$dels" -gt 0 ] && git show HEAD --name-only --format="" --diff-filter=D 2>/dev/null | grep . | sed 's/^/  - DEL /' 2>/dev/null || true

rc=0
if [ -n "$expected" ] && [ "$count" -ne "$expected" ]; then
 echo "❌ SCOPE MISMATCH（${count} ≠ ${expected}）— 疑似 cross-session 污染，停下Check"
  rc=1
fi
if [ "$dels" -gt 0 ]; then
 echo "⚠️ ${dels} deletion 在範圍inside — 確認not phantom-delete 掉 sibling 在用的檔（vc=2 根因）"
  [ "$rc" -eq 0 ] && rc=1
fi
[ "$rc" -eq 0 ] && echo "✅ scope OK"
exit "$rc"
