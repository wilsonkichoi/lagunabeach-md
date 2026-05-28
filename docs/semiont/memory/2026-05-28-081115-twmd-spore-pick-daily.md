---
title: 'memory: 2026-05-28-081115-twmd-spore-pick-daily'
session_id: '2026-05-28-081115-twmd-spore-pick-daily'
date: 2026-05-28
session_type: routine
routine: twmd-spore-pick-daily
mode: write
parent_pipeline: docs/factory/SPORE-PICK-PIPELINE.md
---

# 2026-05-28-081115 — twmd-spore-pick-daily 第六轉

> session twmd-spore-pick-daily — daily cron @ 08:00 (actual fire 08:11，~11min 延後 daemon load)
> Session span: 08:11:15 → 08:14:30 +0800 (~3 min, 1 commit `c07661f65`)
> 資料來源：`git log %ai`

## ACK Read protocol

✅ Read protocol: SPORE-PICK-PIPELINE:523 / SPORE-INBOX:599 / SPORE-WRITING:925 / SPORE-LOG:tail-150 / Total 4 files ~2200 lines / Skim/grep/head used: NO

per [ROUTINE-PROMPT-CONTRACT 鐵律 2](../../docs/semiont/ROUTINE-PROMPT-CONTRACT.md) — HARD gate Read protocol ACK 一行進 memory log。

## 觸發

Cron `twmd-spore-pick-daily` 08:00 排程觸發（actual 08:11 daemon load 延後 11 min）。SPORE-INBOX intake 飛輪第六轉。Propose 3 candidates ship — 2 EXISTING（艋舺 score=30 / 台灣 BIM 與營建科技 score=30）+ 1 EVERGREEN（台灣媒體總史 score=8）。9 hard gate 全過 / SPORE-INBOX pending 14 → 17 / commit `c07661f65` push origin main。

## Stage 0-1 — BECOME + 6 source READ

Universal core + Write subset Q1-3/4/8-11/14 = 9 題全過。Cron routine 自動觸發 BECOME write mode（skill 載入，pipeline canonical 4 file 全 Read 不抽樣）。

6 source READ：

- **1.1** dashboard-articles pool: **631/757** candidates（non-about, wc>2000）
- **1.2** SC opportunities (pos>10, imp>100): **2 條**（張懸 121 imp pos 12.6 / md 624 imp pos 10.8 — 與 3 candidates 不直接匹配）
- **1.3** SPORE-LOG 14d cover (HG5 exclude list) **16 articles**: portaly-五月公開信 / 半導體產業 / 台灣美食總覽 / 國家人權博物館 / 大宇雙劍 / 尹衍樑 / 江賢二 / 泛科學 / 臺灣前途決議文 / 臺灣漫遊錄 / 落日飛車 / 許倬雲 / 鄭愁予 / 陳建年 / 雷亞遊戲 / 馬英九
- **1.4** SPORE-INBOX 現有 pending: **14 條** 真實 entry（葉廷皓 / 大稻埕 / 西門町 / 二二八事件 / 周蕙 / 尊 / 施振榮 / 曾博恩 / 飲料封膜機 / 愛玉 / 林央敏 / 瘂弦 / 台灣體育發展 / TASA — 加 1 條 schema 範例 = 15 grep match）
- **1.5** ARTICLE-DONE-LOG 最近 7 天（5/21-5/28）: ~17 articles ship — 大量 candidates，其中 12 個歷史街區 + Wave 3 BIM + 葉廷皓 + 江賢二 + 許倬雲 + 鄭愁予 + 落日飛車 + 馬英九 + 國家人權博物館 + 大宇雙劍 + 尹衍樑（後 11 已被 14d cover 排除）
- **1.6** ARTICLE-INBOX P0 NEW 可作 EVERGREEN-TOPIC：TASA（已 pending）/ 台灣媒體總史（未 pending）/ 22 縣市系列 + 歷史街區系列（多已 ship）
- **1.7** news-lens P1 count this week: **0**（無 `from news-lens weekly` 或 `by twmd-news-lens-weekly` 實際 entry — grep match 2 條皆為 schema doc 引用）→ daily routine 補 **3 條**

## Stage 2-3 — 7-dim score + draft

| 候選         | D1 趁熱        | D2 SC | D3 news | D4 多語 fanout               | D5 冷門 | D6 hook variety | D7 敏感度 | Total  | Priority | Source-Mode      |
| ------------ | -------------- | ----- | ------- | ---------------------------- | ------- | --------------- | --------- | ------ | -------- | ---------------- |
| 艋舺         | +30 (d=7)      | 0     | 0       | 0 (Geography ∉ high_fanout)  | 0       | 0               | 0         | **30** | P2       | EXISTING-ARTICLE |
| 台灣 BIM     | +30 (d=6)      | 0     | 0       | 0 (Technology ∉ high_fanout) | 0       | 0               | 0         | **30** | P2       | EXISTING-ARTICLE |
| 台灣媒體總史 | 0 (no article) | 0     | 0       | +8 (Society 媒體史 judgment) | 0       | 0               | 0         | **8**  | P3       | EVERGREEN-TOPIC  |

每 candidate 4 hook anchor cover 場景/數字/問句/身份 4 起手式 + 必驗事實 ≥ 10 條 + 多語 fan-out 判斷 + 配圖建議 + Hook tier 自檢備註。艋舺是 Wave 1 5/21 ship 距今 **7 天最舊 candidate** — 不發就過 14d cutoff，此週 routine 最緊迫趁熱對象。台灣 BIM 是 Wave 3 5/22 ship + 對應碩濤 self-recommend 起點 — spore 可放大「政府推不動 12 年 vs MCP 18 月」反差。台灣媒體總史是 P0 EVERGREEN 對應 5/17 哲宇 directive，150 年五階段 frame。

## Stage 4-6 — VERIFY + APPEND + COMMIT

9 hard gate inventory 全過：

- **HG1** BECOME write 9 題 ✓（cron skill 載入）
- **HG2** 6 source 全讀 ✓（line count cite in §Stage 0-1）
- **HG3** 7-dim transparent in Notes ✓（每 entry score=NN 拆解）
- **HG4** ≥2 hook + ≥2 type（each candidate has 4 hook + 4 type 起手式 covered）✓
- **HG5** 0 in 14d SPORE-LOG cover（艋舺 / BIM / 媒體總史 三者皆未在 16 articles 列表）✓
- **HG6** 0 dup with 14 existing pending（三者 Article-Path 皆未在 INBOX）✓
- **HG7** 2 modes（EXISTING × 2 + EVERGREEN × 1）✓
- **HG8** 1+ candidate ≤7d（艋舺 d=7 / BIM d=6 — 兩條 ≤7d 雙重滿足）✓
- **HG9** 0 hardcoded sensitivity keyword 命中（兩岸/228/戒嚴/統獨/中共/習近平）✓ — 媒體總史 borderline check：黨外雜誌史 + 紅媒爭議 mid-high 敏感但 hardcoded set 未命中，且 article ship 時 frame 為「150 年五階段媒體形式演化」literary mode 可避開政治正撞通過 HG9

SPORE-INBOX §Pending append 3 entries（保留 §已發歷史 不動，append-only 鐵律遵守）。commit `c07661f65` `🧬 [routine] twmd-spore-pick-daily: 3 candidates — 2026-05-28` push origin main 直接（v2.0 main-direct）。INBOX pending count 14 → 17，未過 distill threshold 20 / 30 alert / 50 auto-drop。

## 收官 checklist

| 檢查項                        | 狀態                                                                                                  |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| ACK Read protocol line        | ✅ §ACK Read protocol（CONTRACT 鐵律 2 ✓）                                                            |
| 3 candidates appended         | ✅ 艋舺 / 台灣 BIM / 台灣媒體總史                                                                     |
| HG7 至少 2 個不同 Source-Mode | ✅ 2 EXISTING + 1 EVERGREEN                                                                           |
| HG8 至少 1 個 ≤7d             | ✅ 兩條 ≤7d（艋舺 d=7 + BIM d=6）                                                                     |
| memory file 已寫              | ✅ docs/semiont/memory/2026-05-28-081115-twmd-spore-pick-daily.md                                     |
| All scoring cite path:line    | ✅ entry Notes 內每 D1-D7 explanation 含 source（SC=朱玉恩 baseline / SPORE-LOG 14d / ARTICLE-INBOX） |

## 觀察與後續

- **routine 第六轉跑況**：cron 排程穩定，08:11 daemon load 延後 ~11 min 可接受。整個 cycle 3 min wall-clock（fast — 因 source data 已 cache 在 dashboard-articles.json）
- **INBOX 健康度**：pending 14→17，仍在 < 20 健康範圍；EVERGREEN/EXISTING 比例 6/11 = 36% EVERGREEN 偏高（哲宇 directive + routine 都偏好等 article ship 的 P3 candidates 累積）
- **趁熱窗口最後機會**：艋舺 5/21 ship 距今 7 天，本週不發就過 14d cutoff — 觀察者 review 可考慮 promote P2→P1 強制本週 ship
- **歷史街區三件套就緒**：大稻埕（5/25 propose）+ 西門町（5/27 propose）+ 艋舺（5/28 propose）三 Wave 1 歷史街區 spore candidate 同時 pending，可形成 Geography mini-cluster ship cluster pacing
- **next cron**：明日 2026-05-29 08:00 第七轉 — predict 仍會 propose Wave 2 歷史街區批次（牯嶺街 / 永康街 / 公館 / 寶藏巖 / 北投溫泉街 / 大龍峒 / 四四南村 / 士林 / 中山北路條通 9 個 candidate 都 ≤7d 滿足 HG8）
- **無 escalation 觸發**：1x fail counter = 0，cron 連續第六轉成功
