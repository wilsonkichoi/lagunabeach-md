#!/usr/bin/env bash
# inbox-signal.sh — 待消化 / 待開發 backlog awareness signal (cross-session continuity)
#
# Phase A3 (per reports/become-boot-mode-design-2026-05-13.md §5.4)
# 取代 BECOME §Step 5 LESSONS-INBOX (1928 行) + ARTICLE-INBOX (1197 行) 全載
#
# 用途：BECOME §Step 6 L4 always-load query 接這個 script
# 輸出：~3 行 markdown summary (LESSONS 未消化 / ARTICLE pending / in-progress count)
#
# 設計原則 (per D7 boundary rule):
# ✅ Backlog awareness signal (cross-session continuity)
# ❌ 不載入 full INBOX entries (那是 distill / 寫文時 explicit Read)

set -euo pipefail

LESSONS="${LESSONS:-docs/semiont/LESSONS-INBOX.md}"
ARTICLE="${ARTICLE:-docs/semiont/ARTICLE-INBOX.md}"
SPORE="${SPORE:-docs/factory/SPORE-INBOX.md}"

# LESSONS-INBOX §未消化清單 count
if [[ -f "$LESSONS" ]]; then
  LESSONS_UNDIGESTED=$(awk '/^## 📥 未消化清單/,/^## ✅ 已消化/' "$LESSONS" | grep -cE "^### " || echo 0)
  LESSONS_DIGESTED=$(awk '/^## ✅ 已消化/,EOF' "$LESSONS" | grep -cE "^### " || echo 0)
  echo "📥 lessons | 未消化 $LESSONS_UNDIGESTED 條 / 已消化 $LESSONS_DIGESTED 條（distill 時讀 §未消化清單）"
fi

# ARTICLE-INBOX §Pending + §In-Progress count
if [[ -f "$ARTICLE" ]]; then
  ARTICLE_PENDING=$(awk '/^## 📥 Pending/,/^## 🚧 In-Progress/' "$ARTICLE" | grep -cE "^### " || echo 0)
  ARTICLE_INPROG=$(awk '/^## 🚧 In-Progress/,EOF' "$ARTICLE" | grep -cE "^### " || echo 0)
  echo "📝 articles | pending $ARTICLE_PENDING 條 / in-progress $ARTICLE_INPROG 條（寫文 / auto-heartbeat 時讀 §P0/P1）"
fi

# SPORE-INBOX §Pending count (2026-05-21 新增 — intake layer for 繁殖系統)
if [[ -f "$SPORE" ]]; then
  SPORE_PENDING=$(awk '/^## 📥 Pending/,/^## 📜 已發歷史/' "$SPORE" | grep -cE "^### " || echo 0)
  echo "🧫 spores  | pending $SPORE_PENDING 條（Stage 1 PICK 第一順位 / 觀察者 directive 累積）"
fi
