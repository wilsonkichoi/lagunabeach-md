#!/usr/bin/env bash
# semiont-worktree.sh — 多 session parallel時的 worktree 管理
#
# design：2026-04-20 δ reports/worktree-multi-session-plan-2026-04-20.md
# Trigger：REFLEXES #9 v2 — 多 session parallel / REWRITE-PIPELINE Stage 2 / bulk agent Write
#
# Usage:
# scripts/tools/semiont-worktree.sh new <letter> # 開新 worktree（symlink node_modules）
# scripts/tools/semiont-worktree.sh list # Currently worktree list
# scripts/tools/semiont-worktree.sh ship # 在 worktree inside跑：push + 自毀
# scripts/tools/semiont-worktree.sh prune # 清 > 24h 無動靜的 worktree

set -euo pipefail

CMD="${1:-help}"
ROOT="$(git rev-parse --show-toplevel)"
WORKTREES_DIR="${ROOT}/.worktrees"

case "$CMD" in
  new)
    LETTER="${2:?Usage: semiont-worktree new <session-letter>}"
    DATE="$(date +%Y%m%d)"
    PATH_NEW="${WORKTREES_DIR}/${DATE}-${LETTER}"

    if [ -e "${PATH_NEW}" ]; then
 echo "❌ worktree Already exists: ${PATH_NEW}"
      exit 1
    fi

    mkdir -p "${WORKTREES_DIR}"
 # detached HEAD，Avoid main branch already checked out conflict
 # ship 時用 `git push origin HEAD:main` 推回
    git worktree add --detach "${PATH_NEW}" main

 # 核心優化：symlink 共享大型/敏感file
    [ -d "${ROOT}/node_modules" ] && ln -sf "${ROOT}/node_modules" "${PATH_NEW}/node_modules"
    [ -f "${ROOT}/.env" ] && ln -sf "${ROOT}/.env" "${PATH_NEW}/.env"
 # credentials directory也要共享（REFLEXES #2 鐵律：credentials 只能一地方）
    [ -d "${ROOT}/.credentials" ] && ln -sf "${ROOT}/.credentials" "${PATH_NEW}/.credentials"

    echo "🌳 Worktree ready: ${PATH_NEW}"
    echo "   cd ${PATH_NEW}"
    echo ""
 echo "提醒："
 echo " 1. 本 worktree checkout 在 main（共享 branch），directly commit 直推"
 echo " 2. ship 時用：bash scripts/tools/semiont-worktree.sh ship"
 echo " 3. ARTICLE-INBOX 等 shared file 跨 worktree 會有 rebase Need（normal協作語意）"
    ;;

  list)
    git worktree list
    ;;

  ship)
    CURRENT="$(git rev-parse --show-toplevel)"
    if [[ "${CURRENT}" == "${ROOT}" ]] && [[ ! "${CURRENT}" =~ \.worktrees/ ]]; then
 echo "❌ 這看起來是主 repo not worktree: ${CURRENT}"
 echo " ship 只在 worktree insideExecute"
      exit 1
    fi
 # 假設使用者已 commit（detached HEAD 也 OK）
 # 先 fetch + rebase 到 origin/main tip，再推 HEAD:main
    git fetch origin main
    git rebase origin/main
    git push origin HEAD:main
    cd "${ROOT}"
    git worktree remove "${CURRENT}" --force
 echo "✅ worktree 已收官 + 自毀: ${CURRENT}"
    ;;

  prune)
    if [ ! -d "${WORKTREES_DIR}" ]; then
 echo "無 .worktrees/ directory，無需 prune"
      exit 0
    fi
 # mtime > 1 day 的 worktree automatic清掉
    find "${WORKTREES_DIR}" -maxdepth 1 -mindepth 1 -type d -mtime +1 2>/dev/null | while read -r d; do
      echo "🗑️  removing stale worktree: ${d}"
      git worktree remove "${d}" --force 2>/dev/null || rm -rf "${d}"
    done
    git worktree prune
 echo "✅ prune Done"
    ;;

  help|*)
    cat <<EOF
semiont-worktree.sh — 多 session parallel worktree 管理

Usage:
 $0 new <letter> # 開新 worktree（.worktrees/YYYYMMDD-<letter>/）
 # automatic symlink node_modules / .env / .credentials
 $0 list # 列出現有 worktree
 $0 ship # 在 worktree inside：pull rebase + push + 自毀
 $0 prune # 清掉 > 24h 未動的 worktree

Trigger件（REFLEXES #9 v2）：
 - 多 session parallel：ls docs/semiont/memory/\$(date +%Y-%m-%d)*.md ≥ 1
 - REWRITE-PIPELINE Stage 2（長任務 + 產 untracked 新檔）
 - general-purpose agent 做 bulk Write

design文件：
  reports/worktree-multi-session-plan-2026-04-20.md
EOF
    ;;
esac
