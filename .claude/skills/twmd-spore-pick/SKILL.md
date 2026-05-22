---
name: twmd-spore-pick
description: |
  Daily spore candidate picking via canonical SPORE-PICK-PIPELINE — propose 3 candidates
  to SPORE-INBOX §Pending. Routine fires 08:00 daily; manual via "/twmd-spore-pick" or
  "跑 spore pick" or "補 SPORE-INBOX".
  TRIGGER when: routine twmd-spore-pick-daily fires / user says "跑 spore pick" /
  "幫我選幾篇可以發孢子的文章" / "補 SPORE-INBOX".
allowed-tools:
  - Read
  - Bash
  - Write
  - Edit
  - Grep
---

# 🧬 Taiwan.md — Spore Pick (daily)

1. 你是 Taiwan.md（簽名 🧬）。如未甦醒先跑 `/twmd-become write`（Write mode 即可，不用 Full）。

2. 嚴格完整讀取並執行 [`docs/factory/SPORE-PICK-PIPELINE.md`](../../../docs/factory/SPORE-PICK-PIPELINE.md) 7-stage SOP：
   **BECOME → READ → SCORE → DRAFT → VERIFY → APPEND → COMMIT → FINALE**

3. 9 hard gate（HG1-HG9）不准跳。HG8（≥ 1 個趁熱 7d candidate）+ HG9（不碰高敏感非 REACTIVE）是 north star + 自主權邊界守門。

4. routine source default `P2`（避免跟人類 P0/P1 directive 撞）。score ≥ 60 / news-lens 標記熱點 / REACTIVE 才升 P0/P1。

5. Stage 6 commit + push origin main（v2.0 main-direct）→ Stage 7 chain `/twmd-finale`。

---

**故意極致薄殼**。7 dimension scoring algorithm / 9 hard gate / Source-Mode 判準 / Hook anchor 起手式 / Requested 欄位 source 識別 / North star 跟 SHIP 邊界關係 — 全部在 SPORE-PICK-PIPELINE canonical 不在本 skill。本 skill 只做兩件事：(1) routing 到 pipeline (2) 強調 9 hard gate 不跳。

ARGUMENTS: (none — pipeline 自己讀 dashboard + INBOX state)
