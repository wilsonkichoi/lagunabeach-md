#!/usr/bin/env bash
# inbox-signal.sh — 待消化 / 待開發 backlog awareness signal (cross-session continuity)
#
# Phase A3 (per reports/become-boot-mode-design-2026-05-13.md §5.4)
# 取代 BECOME §Step 5 LESSONS-INBOX (1928 行) + ARTICLE-INBOX (1197 行) 全載
#
# purpose：BECOME §Step 6 L4 always-load query 接這 script
# Output：~3 行 markdown summary (LESSONS undigested / ARTICLE pending / in-progress count)
#
# Design principles (per D7 boundary rule):
# ✅ Backlog awareness signal (cross-session continuity)
# ❌ 不Load full INBOX entries (那是 distill / 寫文時 explicit Read)

set -euo pipefail

LESSONS="${LESSONS:-docs/semiont/LESSONS-INBOX.md}"
ARTICLE="${ARTICLE:-docs/semiont/ARTICLE-INBOX.md}"
SPORE="${SPORE:-docs/factory/SPORE-INBOX.md}"

# LESSONS-INBOX §undigestedlist count
if [[ -f "$LESSONS" ]]; then
 # awk range covers both §undigested sections (line ~261 no-emoji + ~2434 emoji-prefixed); end at ✅ or ❌ H2
 LESSONS_UNDIGESTED=$(awk '/^## .*undigestedlist/,/^## [✅❌]/' "$LESSONS" | grep -cE "^### " || echo 0)
 LESSONS_DIGESTED=$(awk '/^## ✅ digested/,EOF' "$LESSONS" | grep -cE "^### " || echo 0)
 echo "📥 lessons | undigested $LESSONS_UNDIGESTED / digested $LESSONS_DIGESTED （distill 時讀 §undigestedlist）"
fi

# ARTICLE-INBOX §Pending + §In-Progress count
if [[ -f "$ARTICLE" ]]; then
  ARTICLE_PENDING=$(awk '/^## 📥 Pending/,/^## 🚧 In-Progress/' "$ARTICLE" | grep -cE "^### " || echo 0)
  ARTICLE_INPROG=$(awk '/^## 🚧 In-Progress/,EOF' "$ARTICLE" | grep -cE "^### " || echo 0)
 echo "📝 articles | pending $ARTICLE_PENDING / in-progress $ARTICLE_INPROG （寫文 / auto-heartbeat 時讀 §P0/P1）"
 # 👻 ghost early-warning：§Pending 裡 status=done/dropped 卻沒搬走的幽靈（Done歸檔鐵律drift）
 # 深查 + Safety清除：scripts/tools/inbox-audit.py（誕生 2026-06-19-inbox-distill）
 ARTICLE_GHOST=$(awk '/^## 📥 Pending/{p=1} p && /^[[:space:]]*-[[:space:]]*\*\*Status\*\*/ && /done|dropped|已Done|✅/ && !/pending/{c++} END{print c+0}' "$ARTICLE")
  if [[ "${ARTICLE_GHOST:-0}" -gt 0 ]]; then
 echo "👻 inbox ghost | ${ARTICLE_GHOST} status=done 卻沒搬走 — 跑 scripts/tools/inbox-audit.py --apply-safe 清"
  fi
fi

# SPORE-INBOX §Pending count (2026-05-21 add — intake layer for 繁殖System)
if [[ -f "$SPORE" ]]; then
 SPORE_PENDING=$(awk '/^## 📥 Pending/,/^## 📜 已發歷史/' "$SPORE" | grep -cE "^### " || echo 0)
 echo "🧫 spores | pending $SPORE_PENDING （Stage 1 PICK 第一順位 / Observer directive 累積）"
fi
