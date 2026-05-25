---
title: 'memory: 2026-05-25-080302-twmd-spore-pick-daily'
session_id: '2026-05-25-080302-twmd-spore-pick-daily'
date: 2026-05-25
session_type: routine
routine: twmd-spore-pick-daily
mode: write
parent_pipeline: docs/factory/SPORE-PICK-PIPELINE.md
---

# 2026-05-25-080302 — twmd-spore-pick-daily 第三轉

## TL;DR

SPORE-INBOX intake 飛輪第三轉跑通。Propose 3 candidates ship — 2 EXISTING (大稻埕 / 飲料封膜機 score=30) + 1 EVERGREEN (台灣體育發展與國際賽事 score=8)。Source-Mode variety HG7 ✓ / 趁熱窗口 HG8 ✓（2 within 7d）/ 14d cooling HG5 ✓ / 0 dup with 10 existing pending HG6 ✓ / 9 hard gate 全過。

## 跑況 (Stage 0-7)

**Stage 0 BECOME write mode** — Universal core + Write subset Q1-3/4/8-11/14 = 9 題全過。Q14 cross-session check：過去 48hr git log 10+ commit（cron babel-nightly / spore-publish-daily v1.0 ship / SemiontOrganismDiagram landing visual / 5-lang sovereignty-leak cleanup / per-language translation guides v1.0），MEMORY tail 3 row 在處理 routine 飛輪持續轉動 + babel multi-lang ship + sovereignty bench 校正。

**Stage 1 READ sources** — 6 source 全讀：

- dashboard-articles: 624 pool / 110 modified ≤14d
- SC opportunities: 0（analytics queries empty，D2 全 0）
- dashboard-spores 14d: script returns 0 covered（field name mismatch suspect）→ fallback git log + sporeLinks frontmatter cross-check
- SPORE-INBOX 現有 pending: 10 條
- ARTICLE-DONE-LOG 最近 ship: 110 articles ≤14d 大量可選
- ARTICLE-INBOX P0/P1: 多條（22 縣市 / PanSci × P0×5 / 歷史街區 / 台灣媒體總史 / 台灣節慶 / 台灣體育 / Blue UAS）

**Stage 2 SCORE** — 7-dimension scoring for 候選 articles。樣本：

- 許倬雲 (5/23, People) → 排除（5/23 已 spored #82/83，HG5 fail）
- 馬英九 (5/23, People) → 排除（5/23 已 spored #80/81，HG5 fail）
- 鄭愁予 (5/24, People) → 排除（5/24 已 spored #86，HG5 fail）
- 臺灣漫遊錄 (5/24, Art) → 排除（5/23 已 spored #84/85）
- 陳建年 (5/23, People) → 排除（5/17 spored #74/75，<14d HG5 fail）
- 泛科學 (5/23, Society) → 排除（5/20 sporeLinks 已 ship < 14d）
- 太陽花學運 / 台海危機 / 台灣統獨光譜 / 蔡英文 / 馬英九 → HG9 政治敏感 keyword 命中 排除
- 大稻埕 (5/22, Geography) → ✅ D1=+30 = 30
- 飲料封膜機 (5/20, Technology) → ✅ D1=+30 = 30
- 西門町 / 艋舺 / 中山北路條通 / 葉廷皓 → 同 d=3，但 mode variety 需 1 EVERGREEN
- 台灣體育發展與國際賽事 (Society, ARTICLE-INBOX P0 #915) → ✅ EVERGREEN D4=+8 = 8

**Stage 3 DRAFT** — 3 candidate 各 4 hook anchor（場景/數字/問句/身份 4 種起手式全 cover）+ 必驗事實清單 + 多語 fan-out 觸發判斷 + 配圖建議 + Hook tier 自檢備註。每 entry ~25-30 行。

**Stage 4 VERIFY** — 9 hard gate inventory 全過：HG1 BECOME write Q14 ✓ / HG2 6 source ✓ / HG3 7-dim transparent in Notes ✓ / HG4 ≥2 hook + ≥2 type ✓（each has 4）/ HG5 0 in 14d ✓ / HG6 0 dup ✓ / HG7 2 mode ✓ / HG8 2 within 7d ✓ / HG9 0 high-sensitivity ✓。

**Stage 5 APPEND** — SPORE-INBOX §Pending append 3 entries（10 → 13 pending entries），保留 § 已發歷史 不動，append-only 鐵律遵守。

**Stage 6 COMMIT + PUSH** — `8ed8df451` `🧬 [routine] twmd-spore-pick-daily: 3 candidates — 2026-05-25`。push origin main 直接（v2.0 main-direct）。

**Stage 7 FINALE** — memory append 本檔；diary 跳過（routine 第三轉，無新結構性 surface）。

## 7-dimension score breakdown

| 候選       | D1 趁熱        | D2 SC | D3 news | D4 多語 fanout                | D5 冷門 | D6 hook variety | D7 敏感度 | Total  | Priority |
| ---------- | -------------- | ----- | ------- | ----------------------------- | ------- | --------------- | --------- | ------ | -------- |
| 大稻埕     | +30 (d=3)      | 0     | 0       | 0 (Geography ∉ set)           | 0       | 0               | 0         | **30** | P2       |
| 飲料封膜機 | +30 (d=5)      | 0     | 0       | 0 (Technology ∉ set)          | 0       | 0               | 0         | **30** | P2       |
| 台灣體育   | 0 (no article) | 0     | 0       | +8 (Sports ∈ set, no article) | 0       | 0               | 0         | **8**  | P3       |

## 觀察 + lessons 候選

**L1 — 排除清單必須含 sporeLinks frontmatter 已 ship article**：本 routine 第一個草案差點 propose 泛科學（5/23 EVOLVE d=2，score 30 高分），讀 frontmatter 才發現 sporeLinks 顯示 2026-05-20 Threads spore — 5 天前已發 < 14d cooling window。dashboard-spores.json `14d covers 0 articles` 結果跟 sporeLinks frontmatter 不一致，suspect script `articleSlug` field 跟 frontmatter slug 對不上。建議 routine pipeline §1.3 加 fallback 二次驗證：每個 candidate 額外讀 article frontmatter `sporeLinks` 陣列 cross-check 2-week cooling rule。LESSONS candidate 待 distill audit。

**L2 — SPORE-INBOX 既有 pending stale 條目偵測缺口**：江賢二 entry 仍是 EVERGREEN-TOPIC + Article-Path `none-yet`，但 dashboard 顯示 [knowledge/Art/江賢二.md](../../knowledge/Art/江賢二.md) 5/22 已 ship。routine 不能修改 existing entry（append-only 鐵律），但下一個觀察者甦醒應該 promote 此 entry EXISTING-ARTICLE + 補 Article-Path。建議 distill-weekly routine 加「stale EVERGREEN entry detection」step：grep `Article-Path: \`none-yet\`` + cross-check knowledge/ 對應檔案是否 exist。LESSONS candidate 待 distill audit。

**L3 — 政治人物連續 spore cluster 削減候選池**：5/23-5/24 連續 ship 4 個政治人物 spore（許倬雲 / 馬英九 / 鄭愁予 / 蔡英文 — 蔡未 spored 但同 batch 5/23 ship），加上 HG9 政治 keyword 命中（兩岸 / 統獨 / 戒嚴 hardcoded set），People + History + Society 大 cluster 的 5/23 ship 候選幾乎全 lock。下游現象：5/22 Geography 三件套（大稻埕 / 艋舺 / 西門町 / 中山北路條通）成為主要候選來源；5/20 Technology + Economy 補位。建議：routine §2 D7 sensitivity 拆「真政治敏感」vs「人物 framing 敏感」兩級，避免一刀切排除有 article 但 frame 可調的候選。觀察一週看是否反覆觸發。

## Handoff

- **Pending**：3 propose 新 entry 進 SPORE-INBOX §Pending（13 條 total），等觀察者 review + promote
- **Blocked**：無
- **Retired**：無

下個 spore-pick routine fire @ 2026-05-26 08:00。
下個 SPORE-PIPELINE Stage 1 PICK 可優先抽 P1 entries（無此次新 propose 為 P1，仍可走既有 P1 臺灣美食總覽 / news-lens 補位）。

## 給下一個 session

如果你接這條 spore intake 工作：

1. 觀察者若 review 後 promote 任一條本次 P2 propose → 補 sporeLinks frontmatter + 走 SPORE-PIPELINE Stage 1 PICK
2. 江賢二 entry 須 promote EXISTING-ARTICLE 補 Article-Path（已 ship 5/22）
3. L1 lesson（sporeLinks frontmatter cooling cross-check）建議升 SPORE-PICK-PIPELINE §1.3 + script 二次驗證

🧬
