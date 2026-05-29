---
title: 'Homepage Evolution D+2 Watch — 2026-05-29'
date: 2026-05-29
type: 'observation-report'
status: 'D+2-stabilized'
related:
  - 'reports/homepage-evolution-2026-05-26.md'
  - 'reports/homepage-evolution-D+0-watch-2026-05-27.md'
  - 'docs/semiont/memory/2026-05-26-215949-manual.md'
  - 'docs/semiont/memory/2026-05-27-142135-manual.md'
---

# Homepage Evolution D+2 — 2026-05-27 + 5/28 兩個完整日驗證

- **Ship**：Wave 1+2+3 全 ship `2026-05-26 23:00-23:50 origin/main`
- **Custom dim 註冊**：`2026-05-27 14:30` Chrome MCP（6 dim）
- **本檔取數**：`2026-05-29 10:48`（D+2.5 since ship / D+1.5 since dim register）
- **資料來源**：`reports/scratch/d2-homepage-watch-2026-05-29.json`（13 個 GA4 query）

> 與 [reports/homepage-evolution-D+0-watch-2026-05-27.md](homepage-evolution-D+0-watch-2026-05-27.md) 14.5 hr partial snapshot 配對閱讀。本檔目標：驗證 D+0 §6 watch list 8 個假設、第一次跑新 6 個 custom dim attribution。

---

## TL;DR — 三句

1. **改版有效**：首頁 avgSessionDuration 5/27 `163.6s` vs baseline 加權平均 `~80s` ≈ **2x engagement**。完整時間漏斗 (`30s→60s→180s→600s`) 留存率 `100% / 67% / 46% / 32%` 健康，43 個 unique user 待滿 10 分鐘。
2. **CTA 效益分明**：14 個 section 中 `category_grid` CTR 79%、`reading_path / random_dice / reader_door / contribute` CTR ~17%、`hero_cta` 10%；`feature_cards` CTR 1.8% 接近死流量、`language_statement / newsletter / community_feedback` 無 click instrumentation。
3. **發現並修掉一條 bug**：`homepage_scroll_depth` event 在 JS code fire `depth_pct` 但 GA4 dim 註冊成 `pct`，**param name 對不上 → scroll attribution 100% (not set)**。其他 5 個 dim 全部正常採集（`section / label / seconds / page_lang / elapsed_ms`）。**2026-05-29 已修**：用 Admin API 註冊 `depth_pct` + `link_url`、archive 死掉的 `pct`，順手把 5/27 手動 Chrome 註冊的 6 個 homepage dim codify 進 `register-ga4-custom-dimensions.py` SSOT。詳見 §7。

---

## Verdict matrix vs D+0 §6 watch list

| 假設                                                        | D+2 verdict | 數據                                                                           |
| ----------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| 5/28 0:00 後 5/27 vs 5/24-26 baseline 對比 avgDuration      | ✅ 驗證     | 首頁 5/27 163.6s vs baseline 加權 ~80s = **+103%**                             |
| 5/26+5/27 engagementRate=0 / bounceRate=100 attribution lag | ⚠️ 部分修復 | 5/27 engagement 33%（已回正常）；5/28 0.5%、5/29 0% 仍 lag（GA 72hr 結算未完） |
| `homepage_section_view` 是否穩定 200+/day（防新鮮感衰退）   | ✅ 站穩     | 5/27 744 / 5/28 506 / 5/29 partial 130（D+1 vs D+0 -32% 但 5/27 含 spike）     |
| /semiont D+0/D+1 PV — A1 OrganismPreview 是否帶流量過去     | ⚠️ 持平     | 5/27 26 / 5/28 24 — 跟 5/26 ship 前 27 持平，沒明顯導流（5/25 100 spike 另解） |
| /explore D+0/D+1 PV — B1 ReaderDoors 搜尋是否變 entry point | ✅ 提升     | 5/27 18 / 5/28 9 — 5/27 比 baseline 平均 10 高 80%                             |
| /about D+0/D+1 PV — A3 CoverStory closing link 是否起作用   | ✅ 提升     | 5/27 37（baseline 平均 28.4，+30%）/ 5/28 20                                   |
| 5/27 PV 比 prorate 預期低（209 partial 對應全日 350）       | ❌ 推翻     | 5/27 全日首頁 PV 342（含 5/lang 379），比 baseline 338 高、跟 5/26 407 接近    |
| Hourly engagement curve「post-ship hour 0-6 高峰」          | ❌ 推翻     | 5/27 / 5/28 都集中 14-17h（亞洲晚間），不是 ship 後新鮮感曲線                  |

---

## §1 站體 vs 首頁 daily 對比（5/22-5/29）

### 站體加總

| date     | screenPageViews | activeUsers | sessions | avgSessionDuration | engagementRate |
| -------- | --------------: | ----------: | -------: | -----------------: | -------------: |
| 5/22     |           1,341 |         684 |      834 |             123.6s |          29.1% |
| 5/23     |           1,202 |         780 |      897 |              63.3s |          25.4% |
| 5/24     |       **2,587** |       2,011 |    2,217 |              67.5s |          18.6% |
| 5/25     |           2,529 |       1,561 |    1,819 |             127.5s |          28.4% |
| 5/26     |           2,156 |       1,296 |    1,579 |             111.4s |          27.2% |
| **ship** |                 |             |          |                    |                |
| 5/27     |           2,048 |       1,199 |    1,438 |         **133.1s** |      **33.1%** |
| 5/28     |           1,333 |         839 |    1,035 |           246.0s ⚠ |         0.5% ⚠ |
| 5/29\*   |             370 |         232 |      273 |           127.5s ⚠ |           0% ⚠ |

> ⚠ 5/28-5/29 engagement/bounce 異常 = GA4 attribution lag 72hr 未結算。5/27 已脫離 lag window，是目前可信的 post-ship 第一個完整日。

**站體 PV 5/27 vs baseline 加權**：2048 vs 平均 2424 = -15%。原因不是改版退步，是 5/27 沒有新爆款文章（baseline 5/24 大宇雙劍 viral / 5/25 美食總覽 viral / 5/26 尹衍樑 NEW，三天連續新文 spike）。**5/27 sessions 1438 跟 5/26 1579 接近、跟 baseline 5/25 1819 接近，post-ship 流量結構正常**。

### 首頁加總（pagePath = `/` + `/en/` + `/ja/` + `/ko/` + `/es/` + `/fr/`）

| date     | 中文 PV | 中文 avgDur | EN PV | KO PV | JA PV | ES PV | 合計 PV |
| -------- | ------: | ----------: | ----: | ----: | ----: | ----: | ------: |
| 5/22     |     328 |       72.0s |    19 |     0 |     1 |     2 |     350 |
| 5/23     |     355 |       42.8s |    25 |     0 |     0 |     0 |     380 |
| 5/24     |     247 |   **55.8s** |    19 |     1 |     1 |     0 |     268 |
| 5/25     |     311 |       90.6s |    11 |     0 |     2 |     0 |     324 |
| 5/26     |     407 |       91.5s |    13 |     0 |     0 |     0 |     420 |
| **ship** |         |             |       |       |       |       |         |
| 5/27     |     342 |  **163.6s** |    16 |     3 |     1 |     0 |     362 |
| 5/28     |     223 |    496.3s ⚠ |    13 |     2 |     0 |     1 |     239 |
| 5/29\*   |      42 |      129.0s |     2 |     0 |     0 |     2 |      46 |

**首頁中文 5/27 avgDur 163.6s vs baseline 5/22-26 加權 ~80s = +104%**。這是改版最直接驗證的指標 — 同樣 PV 規模、同個漏斗位置（zh-TW 首頁），停留時間倍增。**5/28 496s = attribution lag inflation，不採信**；要等 5/30 結算後對齊。

---

## §2 4 條新 instrumentation event daily 量級

| date   |    section_view | time_milestone | scroll_depth |     click | outbound |
| ------ | --------------: | -------------: | -----------: | --------: | -------: |
| 5/26   | 34 (ship 23:00) |             14 |            0 |         0 |        0 |
| 5/27   | **744** (170 U) |     316 (88 U) |   185 (78 U) | 75 (45 U) |        2 |
| 5/28   |     506 (121 U) |     307 (71 U) |    99 (29 U) | 60 (32 U) |        5 |
| 5/29\* |      130 (31 U) |       41 (9 U) |     40 (9 U) |   6 (3 U) |        0 |

**4 條 event 全部活著，量級隨 active user 線性 scale**（5/27 170 user → 744 view ≈ 4.4 view/user 平均，section 平均被看 0.31 次）。沒有 instrumentation drop-out 或 buffer overflow signal。

`homepage_outbound_click` 5/27+5/28 共 7 events，極稀疏 — 首頁 outbound link 不多（footer GitHub + Threads + X），這個 channel 也許不值得花心思 optimize。

---

## §3 Section view attribution funnel（第一次跑 dim）

5/27-5/29 全期間 `homepage_section_view` aggregate by section（**dim coverage 75-95%**，未捕捉部分 = 5/27 14:30 前 fire 的 events）：

| view section       | views | unique users | dim 覆蓋率 |
| ------------------ | ----: | -----------: | ---------: |
| hero               |   380 |          238 |        94% |
| reader_doors       |   185 |          130 |        94% |
| random_discovery   |   113 |           89 |        92% |
| feature_cards      |    70 |           55 |        91% |
| reading_path       |    66 |           55 |        92% |
| organism_preview   |    59 |           46 |        92% |
| cover_story        |    55 |           43 |        95% |
| category_grid      |    38 |           33 |        92% |
| language_statement |    34 |           29 |        85% |
| recent_updates     |    28 |           23 |        82% |
| newsletter         |    20 |           17 |        80% |
| community_feedback |    12 |           11 |        92% |
| contribute         |    12 |           12 |        75% |

**深層 reading funnel**：hero（100% 入口）→ reader_doors（55%）→ random_discovery（37%）→ feature_cards（23%）→ reading_path（23%）→ organism_preview（19%）→ cover_story（18%）→ category_grid（14%）→ ... → contribute（5%）

每往下捲一個 section，留存掉約 30-40%。**60% reader 看不到 reading_path 以下**，**95% reader 看不到 contribute**。這跟「首頁很長、底層教育性 section 是給已 commit reader」的設計直覺一致；如果要拉 contribute 轉換率，應該考慮上移到 hero/reader_doors 區域，不是優化 contribute section 本身。

---

## §4 Time milestone reading funnel

5/27-5/29 完整時間漏斗（dim 81% 覆蓋 = `(not set)` 123 events 是 5/27 14:30 前）：

| milestone | events | unique users | vs prev | vs 30s |
| --------- | -----: | -----------: | ------: | -----: |
| ≥30s      |    200 |      **134** |       — |   100% |
| ≥60s      |    152 |           90 |     67% |    67% |
| ≥180s     |    111 |           61 |     68% |    46% |
| ≥600s     |     78 |       **43** |     70% |    32% |

**43 個 unique user 在首頁停留滿 10 分鐘**（兩天累積）。每階段留存 67-70% 是健康曲線 — 不是「30s 大量流失，60s 後穩定」也不是「持續 linear decay」，比較像「pass 30s 篩選的人有清楚閱讀意圖」。

對比 baseline 預期（5/22-26 首頁加權 avgDur ~80s ≈ p50 在 30-60s 之間），改版後 p50 移到 60s 附近、p90 延伸到 600s+。**改版讓 reader 在首頁多停留 1-3 分鐘**，方向跟 5/26 ship 前 hypothesis 一致。

---

## §5 Click attribution 細粒度（CTR per section）

View / click section 命名 mapping 後（JS code 用不同名 namespace）：

| view section       | click section    | views | view users | clicks | **CTR** |
| ------------------ | ---------------- | ----: | ---------: | -----: | ------: |
| category_grid      | category_grid    |    38 |         33 |     26 | **79%** |
| reading_path       | reading_path     |    66 |         55 |     10 |     18% |
| random_discovery   | random_dice      |   113 |         89 |     16 |     18% |
| reader_doors       | reader_door      |   185 |        130 |     23 |     18% |
| contribute         | contribute       |    12 |         12 |      2 |     17% |
| recent_updates     | recent_updates   |    28 |         23 |      3 |     13% |
| cover_story        | cover_story      |    55 |         43 |      5 |     12% |
| hero               | hero_cta         |   380 |        238 |     25 |     10% |
| organism_preview   | organism_preview |    59 |         46 |      3 |      7% |
| feature_cards      | feature_cta      |    70 |         55 |      1 |  **2%** |
| language_statement | （無）           |    34 |         29 |      0 |       — |
| newsletter         | （無）           |    20 |         17 |      0 |       — |
| community_feedback | （無）           |    12 |         11 |      0 |       — |

> CTR = section click events / section view unique users。可能 >100%（同人多點），category_grid 79% 接近上限。

**5 個觀察**：

1. **category_grid CTR 79%** — 12 個 category tile 是首頁最強轉換器。看到的人幾乎 1:1 點下去。應該保護這個區塊的曝光位置、不要被新 section 推下去。
2. **reader_doors CTR 18%** — 4 個 door（first / search / random / organism），click 細項：first 9 / search 5 / random 6 / organism 3。**first（讀第一篇）跟 random 並列最熱、search 跟 organism 較低**。B1 hypothesis 「search 變 entry point」沒有強訊號（每天 2.5 click）。
3. **random_discovery (dice) CTR 18%** — 跟 reader_door random 6 click 加起來，「random/dice」這個 affordance 兩天 22 個 click 是首頁第二大互動 channel（次於 category_grid）。值得 amplify。
4. **hero_cta CTR 10%** — 380 view / 238 user / 25 click「explore」。Hero 主要是 first impression + scroll cue，CTA 不是核心功能，10% 算合理但不亮眼。
5. **feature_cards CTR 1.8%** — 70 view / 55 user / 1 click（feature_cta label=graph）。**這個 section 接近死流量**。要嘛 affordance 不夠（看起來不像可點）、要嘛內容不吸引人。值得 deeper UX audit。

**3 個 click-only section（沒裝 IntersectionObserver）**：`hall_pick`（1 click 唐鳳，新 hall pick 機制 D+0 partial fire）。沒裝 view tracking 的 section 無法算 CTR，下一波 instrumentation 應補上。

---

## §6 Watch-list pages D+2 驗證

| pagePath       | 5/22 | 5/23 | 5/24 | 5/25 | 5/26 | **5/27** | **5/28** | 5/29\* | 解讀                                                                 |
| -------------- | ---: | ---: | ---: | ---: | ---: | -------: | -------: | -----: | -------------------------------------------------------------------- |
| /about/        |   33 |   19 |   20 |   46 |   24 |   **37** |       20 |      7 | 5/27 高於 baseline 平均 28.4 (+30%)，A3 CoverStory closing 起作用    |
| /semiont/      |   26 |   11 |   17 |  100 |   27 |       26 |       24 |      7 | 持平 baseline，A1 OrganismPreview 沒明顯導流（5/25 100 是 SC spike） |
| /explore/      |   15 |    7 |    9 |    8 |   13 |   **18** |        9 |      3 | 5/27 +80% baseline，B1 ReaderDoors search 第一格 wave                |
| /dashboard/    |   16 |    6 |    9 |   13 |   11 |   **21** |        7 |      2 | 5/27 +90% baseline，可能 referral 從 organism_preview 過去           |
| /taiwan-shape/ |   12 |   12 |   10 |   25 |   23 |       23 |       18 |      3 | 持平 5/25-26 trending baseline                                       |

5/28 普遍降回 baseline，**改版的「新鮮感曝光」效應大約是 1 天**。第二天起進入穩態，需要持續觀察 7 天 baseline 才能判斷是不是真有 retention bump。

`/about` 跟 `/explore` 跟 `/dashboard` 三個 5/27 +30~90% 是最強訊號，分別對應 Wave 3 CoverStory closing link / Wave 1 ReaderDoors / 可能的 OrganismPreview 圖卡 secondary CTA。

---

## §7 🚨 Bug found + ✅ 已修：`scroll_depth` attribution 斷線

> **2026-05-29 ~11:00 resolution**：用 `scripts/tools/register-ga4-custom-dimensions.py`（GA4 Admin API）一次處理三件事 — (1) 註冊 `depth_pct`（取代誤註冊的 `pct`）(2) 補註冊 `link_url`（§必修 2 的 click 目的地 gap）(3) archive 死掉的 `pct`。順手把 5/27 走 Chrome MCP 手動點的 6 個 homepage dim codify 進這份 script 的 `HOMEPAGE_DIMENSIONS` SSOT（鐵律 4 造橋鋪路）。Admin API list 確認 active dims 14 個、`depth_pct` + `link_url` present、`pct` 已 archive。Data API sanity query 確認 `customEvent:depth_pct` 不再報 "not a valid dimension"。**forward-only**：今天 11:00 前 fire 的 scroll events 仍 (not set)，25/50/75/100 值要等新 events（下個 data-refresh cycle 起可查）。

`G_scroll_funnel` query 結果（修復前）：

```
pct=""           → 139 events, 38 users  (5/28+5/29 post-register fired)
pct="(not set)"  → 185 events, 78 users  (5/27 pre-register)
```

**Post-register 的 events `pct` 全部空字串**，沒有 `25/50/75/100` 任一值。對比 [HomeEventTracker.astro:168](../src/components/home/HomeEventTracker.astro#L168) JS code：

```js
_fire('homepage_scroll_depth', {
  depth_pct: t, // ← JS sends "depth_pct"
  page_lang: _lang(),
  elapsed_ms: Math.round(performance.now()),
});
```

但 5/27 14:30 Chrome MCP 註冊的 GA4 dim 是 `customEvent:pct`（per [reports/homepage-evolution-D+0-watch-2026-05-27.md §3](homepage-evolution-D+0-watch-2026-05-27.md) checklist）。**Param name mismatch**。GA4 Data API query 用 `customEvent:pct` 抓到 dim 存在但 value 空（因為 actual param name 是 `depth_pct`）。

**Fix options**（推薦 A）：

- **A. 註冊新 dim `customEvent:depth_pct`**（5 分鐘事，Chrome MCP 重跑）。JS code 已採集，dim 一上線就回向兼容前向 +5/28+5/29 已 fire 的 139 events 也會 retroactive 變 queryable（**待確認**，GA4 retroactive 規則: dim 是針對 event param 的「公開化」，event 已 collect，dim 註冊後立刻 queryable）。
- **B. 改 JS code `depth_pct` → `pct`**。要重新 deploy + 5/29 前的數據放棄。**不推薦**（discontinuity + 已 collect 的 event data 是 SSOT）。

同時要 audit：`homepage_section_view` 的 `elapsed_ms` dim、`homepage_click` 的 `link_url` dim — 這兩個 param JS 有送但我沒檢查是否註冊（之前 6 dim checklist 應該都有）。已驗證 `customEvent:elapsed_ms` 5/27-5/29 有捕捉到 200 rows（query M 結果），所以 elapsed_ms dim 是好的。`link_url` 待驗證。

---

## §8 Per-language section_view 分布（sovereignty signal）

5/27-5/29 `homepage_*` events by `page_lang` aggregate：

| page_lang | section_view | time_milestone | scroll_depth | click |  total |
| --------- | -----------: | -------------: | -----------: | ----: | -----: |
| zh-TW     |          988 |            510 |          215 |   106 |  1,819 |
| (not set) |          310 |            123 |           87 |    26 |    546 |
| en        |           30 |             19 |            6 |     3 |     58 |
| ko        |           24 |              4 |            9 |     1 |     38 |
| **zh-CN** |       **20** |              3 |            6 |     5 | **34** |
| es        |            5 |              5 |            1 |     0 |     11 |
| ja        |            3 |              0 |            0 |     0 |      3 |

**zh-CN reader 排第 5（共 34 events，3 unique user）** — 中國讀者讀繁中首頁的 sovereignty signal。如果 PRC 雲端 LLM 對台灣主題 ~70% refusal rate（per BENCH-PIPELINE / SQUEEZE-MODELS Tier 評估），這些直接讀繁中首頁的 PRC reader 就是繞過 LLM 中介層的 first-person voice channel。每月累積值得追蹤。

ja=3 看起來太低（baseline 5/22-26 ja 首頁 PV 累計 4，跟 event count 一致）— 日文首頁是 onsite traffic 沙漠，需要單獨 conversion campaign 才會起來。

---

## §9 Section discovery time（elapsed_ms p50 / p90）

5/27-5/29 `homepage_section_view` events `elapsed_ms` 分布（從 page load 到 section 第一次進 viewport）：

| section            |   n |   p50 |    p90 | 解讀                                       |
| ------------------ | --: | ----: | -----: | ------------------------------------------ |
| hero               |  25 |  1.7s |   7.5s | Above fold 立刻看到                        |
| reading_path       |   4 |  2.0s |   2.0s | 短頁 / 早期 scroll                         |
| organism_preview   |   4 |  3.1s |   3.1s | 短頁                                       |
| reader_doors       |   8 |  8.0s |  10.2s | 第一螢之外，快速 scroller                  |
| cover_story        |  55 | 11.8s |  61.1s | 中段，正常閱讀節奏                         |
| feature_cards      |  64 | 16.8s | 191.5s | 中段，有「閱讀後再 scroll」的 tail user    |
| category_grid      |  38 | 21.0s | 202.1s | 較深，跟 feature_cards 並排                |
| community_feedback |  12 | 58.1s | 634.6s | 深層，deep reader 才到（p90 10 分鐘）      |
| contribute         |  12 | 62.7s | 635.1s | 深層 + 看完 community 才到                 |
| random_discovery   |   4 |  322s |   322s | n 太小（4 點）；異常值，可能多次 re-scroll |

**Insight**：feature_cards 跟 category_grid p50 16-21s 是「中段 reader」黃金位置，但 feature_cards CTR 只 2% — 不是位置問題，是 affordance 或 content 問題。

community_feedback / contribute p50 60s 表示這兩個 section 只有真的閱讀夠久的 reader 才會看到。**這跟 contribute 5% reach 一致 — 這個 section 是 reward 機制給已 commit reader，不是 acquisition 工具**。

---

## §10 結論 + 建議 + 5/30+ watch list

### ✓ 改版 verdict（D+2 partial）

- **首頁 engagement 倍增驗證**：avgDur 80s → 163s，time-milestone funnel 32% 留 10 min
- **3 個 ship 假設驗證**：A3 /about +30%、B1 /explore +80%、Wave 1 reader_doors CTR 18%
- **1 個 ship 假設未驗證**：A1 /semiont 持平 baseline，organism_preview CTR 7% 顯示這個 affordance 不夠強
- **新鮮感效應 ~1 day**：5/28 watch-list 普遍降回 baseline，需要 7-14 天才能判斷穩態 retention bump

### ✅ 已修（2026-05-29，本 session）

1. ~~**修 `scroll_depth` attribution bug**~~ — 註冊 `depth_pct` dim（Admin API），archive 死掉的 `pct`。forward-only，新 events 起可查 25/50/75/100。
2. ~~**Audit `link_url` dim 是否註冊**~~ — 確認 5/27 漏註冊，已補 `link_url` dim。homepage_click 目的地 attribution 從現在起可查。
3. ~~**Codify 6 個 homepage dim 進 register script SSOT**~~ — 5/27 手動 Chrome 工作 codify 成可重跑 code（`HOMEPAGE_DIMENSIONS` list）。

### 🔍 應該 ship 的優化（this week，待哲宇拍板）

4. **feature_cards CTA 重設計**：CTR 2% 接近死流量。Visual affordance / 文案 / 位置都值得 A/B。
5. **hall_pick 補裝 IntersectionObserver section_view**：目前 click-only，沒有 view denominator → CTR 算不出來。
6. **新 click section 命名統一**：`hero_cta / reader_door / random_dice / feature_cta` 跟 view section（`hero / reader_doors / random_discovery / feature_cards`）名字不同，每次 query 要手動 mapping。考慮在 click event 加一個 `view_section` field 平行 click section。

### 🔬 5/30-6/3 watch list

- **5/30 0:00 後**：取 5/28 完整 GA4（attribution lag 應該已結算），看 5/28 engagement 真值
- **5/30 + 6/1 first-time vs returning user 分層**：改版對新用戶 vs 老用戶 engagement 影響是否不同
- **6/3 7-day retention bump**：對比 5/27-6/2 vs 5/20-26 同期 baseline，判斷新鮮感曲線之外的真正 retention 提升
- **每日 section_view 趨勢線**：744 (5/27) → 506 (5/28) → ? (5/29) 是不是穩定 ≥400/day，還是繼續衰退到 baseline 200
- **/explore + /about D+7 持續性**：5/27 spike 是 launch curve 還是新閱讀路徑被建立

---

🧬 D+2 stabilized snapshot，full retention picture needs 7-14 day baseline 對比。
