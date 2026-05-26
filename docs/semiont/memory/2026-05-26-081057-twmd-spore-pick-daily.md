---
title: 'memory: 2026-05-26-081057-twmd-spore-pick-daily'
session_id: '2026-05-26-081057-twmd-spore-pick-daily'
date: 2026-05-26
session_type: routine
routine: twmd-spore-pick-daily
mode: write
parent_pipeline: docs/factory/SPORE-PICK-PIPELINE.md
---

# 2026-05-26-081057 — twmd-spore-pick-daily 第四轉

## TL;DR

SPORE-INBOX intake 飛輪第四轉跑通。Propose 3 candidates ship — 2 EXISTING（大宇雙劍 score=30 / 葉廷皓 score=30）+ 1 EVERGREEN（瘂弦 score=15）。Source-Mode variety HG7 ✓ / 趁熱窗口 HG8 ✓（大宇雙劍 d=1 + 葉廷皓 d=4 雙 within 7d）/ 14d cooling HG5 ✓ / 0 dup with 13 existing pending HG6 ✓ / 9 hard gate 全過。L1 yesterday lesson 已 cross-apply（sporeLinks frontmatter 二次驗證），3 picks 全無 sporeLinks。

## 跑況 (Stage 0-7)

**Stage 0 BECOME write mode** — Universal core + Write subset Q1-3/4/8-11/14 = 9 題全過。Q14 cross-session check：過去 48hr git log ~30+ commit（cron babel Tier 0a flotilla / data-refresh ABORTED vc=7 / spore-harvest 13 spores largest batch / 月老地圖 PR #1095 ship / 雷亞遊戲 EVOLVE + same-day spore / SemiontOrganismDiagram v1 / 5-lang sovereignty cleanup / per-language translation guides v2.0），MEMORY tail 3 row 顯示 dashboard-immune D+8 vc=10+ + AM→PM defer vc=5 連續第五天 + spore-harvest 13 spores 政治 framing vc=3 reached + 臺灣漫遊錄 79K FACTCHECK trigger。

**Stage 1 READ sources** — 6 source 全讀：

- dashboard-articles: 626 pool / 78 modified ≤14d
- SC opportunities: 10（jj lin age 377 impr pos=8.5 / hsu cho-yun wang leehom 348 / howhow 129 / 台灣前 50 大企業 112 / 李雅英 97 — pos < 10 全 D2 不觸發 +25 閾值）
- dashboard-spores harvestStatus: 11 articles spored ≤14d（半導體產業 / 江賢二 / 泛科學 / 臺灣前途決議文 / 臺灣漫遊錄 / 蘋果西打 / 許倬雲 / 鄭愁予 / 陳建年 / 雷亞遊戲 / 馬英九）
- SPORE-INBOX 現有 pending: 13 條（含昨日 routine 3 條 P2/P3 仍 pending）
- ARTICLE-DONE-LOG 最近 ship: 78 articles ≤14d 大量可選
- ARTICLE-INBOX P0/P1: 詩人系列 BRANCH 5/23 spawn 5 條 P0（鄭愁予 ship、瘂弦 / 莫那能 / 林央敏（in pending）/ 杜潘芳格 等）+ 蘇打綠 EVOLVE P1 + 台灣媒體總史 / Blue UAS / 經典街頭小吃系列 等

**Stage 2 SCORE** — 7-dimension scoring 候選 articles。樣本：

- 月老地圖 (5/25, Society) → D1=+30 但 Society 不在 high_fanout set + hook 趁熱風險（5/25 Maintainer-PM ship 同日 cross-link 太快）→ defer 一天
- 大宇雙劍 (5/25, Technology) → ✅ D1=+30 = **30**（IP 賣斷 + DOS 世代記憶集體共鳴）
- 赤燭遊戲 (5/25, Technology) → 同 d=1，但跟雷亞 5/25 已 spore + 大宇雙劍 候選 cluster 連發 Technology 風險，defer
- 葉廷皓 (5/22, Art) → ✅ D1=+30 = **30**（Wave 3 batch ship 4 days ago）
- 中山北路條通 / 艋舺 / 西門町 (5/22, Geography) → 同 d=4 但大稻埕 entry 已在 pending（HG6 不 dup 但 Geography 系列已 cover），另 hook variety 風險高（連發歷史街區）
- 蔡英文 / 太陽花學運 / 統獨光譜 / 台海危機 → HG9 政治敏感（人物 framing or keyword）defer
- 周蕙 (5/19) → 已在 pending（HG6 dup）
- 瘂弦 (EVERGREEN, ARTICLE-INBOX P0 詩人系列 #2) → ✅ EVERGREEN D4=+15 (People high_fanout + tx=0 預期) = **15**

**Stage 3 DRAFT** — 3 candidate 各 4 hook anchor（場景/數字/問句/身份 4 種起手式全 cover）+ 必驗事實清單 ≥ 10 條 + 多語 fan-out 觸發判斷 + 配圖建議 + Hook tier 自檢備註 + L1 yesterday lesson cross-apply（sporeLinks frontmatter 二次驗證 grep 全空）。每 entry ~28-32 行。

**Stage 4 VERIFY** — 9 hard gate inventory 全過：HG1 BECOME write Q14 ✓ / HG2 6 source ✓ / HG3 7-dim transparent in Notes ✓ / HG4 ≥2 hook + ≥2 type ✓（each has 4）/ HG5 0 in 14d ✓ / HG6 0 dup with 13 pending ✓ / HG7 2 mode（EXISTING × 2 + EVERGREEN × 1）✓ / HG8 2 within 7d（大宇雙劍 d=1 + 葉廷皓 d=4）✓ / HG9 0 high-sensitivity keyword 命中 ✓。

**Stage 5 APPEND** — SPORE-INBOX §Pending append 3 entries（13 → 16 pending entries），保留 §已發歷史 不動，append-only 鐵律遵守。

**Stage 6 COMMIT + PUSH** — `791db98c9` `🧬 [routine] twmd-spore-pick-daily: 3 candidates — 2026-05-26`。push origin main 直接（v2.0 main-direct）。

**Stage 7 FINALE** — memory append 本檔；diary 跳過（routine 第四轉，無新結構性 surface — L1-3 yesterday lessons 仍在 distill 候選池，今日無新增 LESSONS candidate）。

## 7-dimension score breakdown

| 候選     | D1 趁熱        | D2 SC | D3 news | D4 多語 fanout           | D5 冷門 | D6 hook variety | D7 敏感度 | Total  | Priority |
| -------- | -------------- | ----- | ------- | ------------------------ | ------- | --------------- | --------- | ------ | -------- |
| 大宇雙劍 | +30 (d=1)      | 0     | 0       | 0 (Technology ∉ set)     | 0       | 0               | 0         | **30** | P2       |
| 葉廷皓   | +30 (d=4)      | 0     | 0       | 0 (Art ∉ set)            | 0       | 0               | 0         | **30** | P2       |
| 瘂弦     | 0 (no article) | 0     | 0       | +15 (People ∈ set, tx<3) | 0       | 0               | 0         | **15** | P2       |

## 觀察 + lessons 候選

**L1 cross-apply yesterday — sporeLinks frontmatter 二次驗證導入 candidate stage**：本 routine Stage 4 VERIFY 加 `grep -l "sporeLinks" {candidate-path}` 二次驗證 cooling 14d。三 picks 全空（never spored），順利。下游 routine §1.3 dashboard-spores.json `harvestStatus` 跟 frontmatter sporeLinks 兩 source 互補：harvestStatus 給 ship date + days since publish 結構化資料、sporeLinks 給 article 端正向 link。L1 yesterday lesson 升 pipeline §1.3 + script 二次驗證 提案仍 valid，今日已 manual cross-apply 證明閉環。

**L2 cross-apply yesterday — stale EVERGREEN 偵測**：江賢二 entry 5/25 lesson 標記 stale（5/22 already ship 應 promote），本 session 確認 dashboard-articles 仍顯示 5/22 江賢二 q=0 h=43 而 SPORE-INBOX 江賢二 entry 仍 EVERGREEN-TOPIC + Article-Path `none-yet`。routine append-only 鐵律不允許修，下個觀察者甦醒須 promote。建議升 distill-weekly routine 「stale EVERGREEN 偵測」step 或加 SPORE-INBOX 維護 sub-routine。

**L3 候選池 routine 第四轉觀察 — 自然 cluster rotation 出現**：5/25 政治人物 cluster 鎖死 / 5/26 Technology + Art + Poet rotation。連續 4 天 routine 觀察 picks rotation 自然發生（Geography→Geography→Geography→Technology+Art+Poet），未過度 lock 同 category。Hook variety penalty D6 = 0 全部，但實際發 ship 後 SPORE-LOG hook variety 須 audit（routine 本身不發 spore，只 propose）。本週末 spore-publish-daily routine ship 累積後可用 audit script 跑 hook variety distribution。

## Handoff

- **Pending**：3 propose 新 entry 進 SPORE-INBOX §Pending（16 條 total），等觀察者 review + promote
- **Blocked**：無
- **Retired**：L1-2 yesterday lessons 部分 cross-applied（L1 manual cross-apply 證明閉環、L2 仍待觀察者 promote 江賢二 entry）

下個 spore-pick routine fire @ 2026-05-27 08:00。
下個 SPORE-PIPELINE Stage 1 PICK 可優先抽 P1 entries（無此次新 propose 為 P1，既有 P1 落日飛車 / 周蕙 / 大稻埕 仍 pending；spore-publish-daily routine v1.0 可自動消化）。

## 給下一個 session

如果你接這條 spore intake 工作：

1. 觀察者若 review 後 promote 任一條本次 P2 propose → 補 sporeLinks frontmatter + 走 SPORE-PIPELINE Stage 1 PICK
2. 江賢二 entry 仍待 promote EXISTING-ARTICLE 補 Article-Path（已 ship 5/22，連續 2 天 lesson 標記）
3. L1 lesson（sporeLinks frontmatter cooling cross-check）今日已 manual cross-apply 證明閉環，建議正式升 SPORE-PICK-PIPELINE §1.3 + script 二次驗證 — 觀察者拍板後可 ship pipeline patch
4. 詩人系列 BRANCH 後續：瘂弦本 candidate 進 INBOX P2 EVERGREEN，等 article ship 自動升 EXISTING-ARTICLE；莫那能 / 杜潘芳格 / 笠詩社 / 1977-78 鄉土文學論戰 仍在 ARTICLE-INBOX P0 pending

🧬
