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
- **資料來源**：13 個 GA4 Data API query（取數時的 raw JSON 在 gitignored `reports/scratch/`）。**完整 rows 永久保存在文末 §附錄：完整數據**（A1-A13）

> 與 [reports/homepage-evolution-D+0-watch-2026-05-27.md](homepage-evolution-D+0-watch-2026-05-27.md) 14.5 hr partial snapshot 配對閱讀。本檔目標：驗證 D+0 §6 watch list 8 個假設、第一次跑新 6 個 custom dim attribution。

---

## TL;DR — 三句

1. **改版有效**：首頁 avgSessionDuration 5/27 `163.6s` vs baseline 加權平均 `~80s` ≈ **2x engagement**。完整時間漏斗 (`30s→60s→180s→600s`) 留存率 `100% / 67% / 46% / 32%` 健康，43 個 unique user 待滿 10 分鐘。
2. **CTA 效益分明**：14 個 section 中 `category_grid` CTR 79%、`reading_path / random_dice / reader_door / contribute` CTR ~17%、`hero_cta` 10%；`feature_cards` CTR 1.8% 接近死流量、`language_statement / newsletter / community_feedback` 無 click instrumentation。
3. **發現並修掉一條 bug**：`homepage_scroll_depth` event 在 JS code fire `depth_pct` 但 GA4 dim 註冊成 `pct`，**param name 對不上 → scroll attribution 100% (not set)**。其他 5 個 dim 全部正常採集（`section / label / seconds / page_lang / elapsed_ms`）。**2026-05-29 已修 + 升級成架構解**：先註冊 `depth_pct`/`link_url`、archive 死 `pct`，再建 `instrumentation-audit.py` 三方漂移偵測器 + CI gate（連帶掃出 `page_404` 5 個 param 也全沒註冊 = 同 bug class 第 3-7 instance）。詳見 §7 + §11 三器官自我進化。

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

> **2026-05-29 resolution — 從守備修補升級成架構解（三器官自我進化，詳見 §11）**：第一步先用 `register-ga4-custom-dimensions.py`（GA4 Admin API）註冊 `depth_pct`（取代誤註冊的 `pct`）+ `link_url`、archive 死 `pct`。但這只是守備。接著建 `scripts/tools/instrumentation-audit.py` 三方對齊偵測器，一跑就再抓出 **`page_404` 5 個 param 全沒 codify**（`failed_path`/`failed_url`/`referrer`/`had_suggestion` 沒註冊 + `page_language` 跟首頁 `page_lang` 命名分岔）— 同一 bug class 的第 4-8 個 instance。全部補完後 code↔SSOT↔GA4 三方對齊（18=18=18），audit wire 進 CI gate 防未來再漂移。**forward-only**：今天修復前 fire 的 events 仍 (not set)，新值要等新 events（下個 data-refresh cycle 起可查）。

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

### ✅ 已修（2026-05-29，本 session — 詳見 §11 三器官自我進化）

1. ~~**修 `scroll_depth` attribution bug**~~ — 註冊 `depth_pct`，archive 死 `pct`。
2. ~~**補 `link_url` dim**~~ — homepage_click 目的地 attribution 可查。
3. ~~**Codify 全 instrumentation dim 進 register SSOT**~~ — search 7 + homepage 7 + page 4 = 18。
4. ~~**建 `instrumentation-audit.py` + CI gate**~~ — code↔SSOT↔GA4 三方漂移偵測，wire 進 `.github/workflows/`。
5. ~~**補 `page_404` 5 param dim + `page_lang` 命名統一**~~ — audit 一跑就掃出的 #3-7 instance。

### 🔍 應該 ship 的優化（this week，待哲宇拍板）

6. **feature_cards CTA 重設計**：CTR 2% 接近死流量。Visual affordance / 文案 / 位置都值得 A/B。
7. **hall_pick 補裝 IntersectionObserver section_view**：目前 click-only，沒有 view denominator → CTR 算不出來（audit 也偵測不到 click-only section 的 view gap，未來可加這層檢查）。
8. **新 click section 命名統一**：`hero_cta / reader_door / random_dice / feature_cta` 跟 view section（`hero / reader_doors / random_discovery / feature_cards`）名字不同，每次 query 要手動 mapping。考慮在 click event 加一個 `view_section` field 平行 click section。

### 🔬 5/30-6/3 watch list

- **5/30 0:00 後**：取 5/28 完整 GA4（attribution lag 應該已結算），看 5/28 engagement 真值
- **5/30 + 6/1 first-time vs returning user 分層**：改版對新用戶 vs 老用戶 engagement 影響是否不同
- **6/3 7-day retention bump**：對比 5/27-6/2 vs 5/20-26 同期 baseline，判斷新鮮感曲線之外的真正 retention 提升
- **每日 section_view 趨勢線**：744 (5/27) → 506 (5/28) → ? (5/29) 是不是穩定 ≥400/day，還是繼續衰退到 baseline 200
- **/explore + /about D+7 持續性**：5/27 spike 是 launch curve 還是新閱讀路徑被建立

---

## §11 自我進化：instrumentation drift 從守備修補升級成架構解

這個 D+2 watch 的副產物比 watch 本身更重要。修 `pct` bug 時意識到它不是孤立事件，是一整類 bug 的第一個可見 instance。

### 根因：兩個分離的真相

「instrumentation code 送什麼 event param」跟「GA4 註冊了哪些 custom dim」是**兩個分離的真相**，由兩個不同流程維護：

- code 端：改 `HomeEventTracker.astro` / `Layout.astro` / `404.astro`
- dim 端：點 GA4 Admin UI（5/27 走 Chrome MCP）或跑 register script

兩邊漂移時**沒有任何信號**，直到有人手動跑 watch 才發現某個 attribution 一直是空的。GA4 retroactive 規則（歷史無法回補）讓這個 gap 的代價是永久的數據損失。

### 同一 bug class 的 8 個 instance（一次掃出）

| #   | param                                        | event          | 症狀                                            |
| --- | -------------------------------------------- | -------------- | ----------------------------------------------- |
| 1   | `pct` vs `depth_pct`                         | scroll_depth   | dim 名字對不上 code → 全 not-set                |
| 2   | `link_url`                                   | homepage_click | code 送了從沒註冊 → click 目的地查不到          |
| 3   | `failed_path`                                | page_404       | 從沒註冊 → fetch-ga4 query 一直 try/except 吞掉 |
| 4-6 | `failed_url` / `referrer` / `had_suggestion` | page_404       | 同上，全沒註冊                                  |
| 7   | `page_language` vs `page_lang`               | page_404       | 同概念兩個名字，跟首頁分岔                      |

#3-7 是 audit 工具建好後**第一次跑就掃出來的**（我原本只知道 #1-2）。

### 三器官 ship

- **🦴 工具**：[`scripts/tools/instrumentation-audit.py`](../scripts/tools/instrumentation-audit.py) — 解析 tracker 原始碼抽出每個 event fire 的 param，三方對齊 `code 解析 ↔ register script SSOT ↔ GA4 Admin live`。`--static`（純 stdlib 不需 creds）/ `--live`（Admin API）。把「knowledge/ 才是 SSOT」原則往 instrumentation 層延伸：**code 是 param 的 SSOT，dim 是投影**。
- **🛡️ 免疫**：[`.github/workflows/instrumentation-audit.yml`](../.github/workflows/instrumentation-audit.yml) — PR 動到任何 tracker 或 register script 就跑 `--static`，埋新 param 沒進 SSOT → PR 紅燈。這次 bug 如果 CI 早有這個 gate，5/26 ship 當下就攔下來，不會等到 D+2。（§神經迴路「規則要能執行才算規則」「造橋之後要踩上去」）
- **🧬 認知**：MEMORY §神經迴路 新增永不過期教訓，對應 REFLEXES #15「反覆浮現要儀器化」+ #24「工具在說謊」。

### 修復後狀態 + 自我警覺

`register-ga4-custom-dimensions.py` 從 7 個 search dim 升成全 instrumentation SSOT（search 7 + homepage 7 + page 4 = 18），404.astro `page_language` 改名對齊 `page_lang`，audit 三方對齊 **18 = 18 = 18**。

對照 2026-05-28「儀器化也會 over-engineer」（CONTRACT v1.0 rollback）的自我警覺：這個 instrument 不踩那個雷，因為它是**可證偽的、跑真實數據的 diff**（吐出具體哪個 param 沒對上）+ **接了 CI gate**，不是 performative pointer。失敗模式是「沒接 CI 沒人跑」，已用 workflow 堵掉。

---

🧬 D+2 stabilized snapshot，full retention picture needs 7-14 day baseline 對比。本 session 副產物：instrumentation drift 架構解三器官 ship。

---

## 附錄：完整數據（13 query raw dump）

> 取數 `2026-05-29 10:48`，property `528789281`。原始 JSON 在 `reports/scratch/`（gitignored），
> 本附錄是完整 rows 的永久保存版。`*` = 5/29 partial（取數時 ~10:48，非完整日）。

### A1 · 站體 daily 全指標（5/22-5/29，8 metrics）

| date |   PV | users | sessions | avgDur | engRate | bounce | engSec | PV/sess |
| ---- | ---: | ----: | -------: | -----: | ------: | -----: | -----: | ------: |
| 5/22 | 1341 |   684 |      834 | 123.6s |   29.1% |  70.9% |  34140 |    1.61 |
| 5/23 | 1202 |   780 |      897 |  63.3s |   25.4% |  74.6% |  19073 |    1.34 |
| 5/24 | 2587 |  2011 |     2217 |  67.5s |   18.6% |  81.4% |  61807 |    1.17 |
| 5/25 | 2529 |  1561 |     1819 | 127.5s |   28.4% |  71.6% |  81893 |    1.39 |
| 5/26 | 2156 |  1296 |     1579 | 111.4s |   27.2% |  72.8% |  60410 |    1.37 |
| 5/27 | 2048 |  1199 |     1438 | 133.1s |   33.1% |  66.9% |  55015 |    1.42 |
| 5/28 | 1333 |   839 |     1035 | 246.0s |    0.5% |  99.5% |  29930 |    1.29 |
| 5/29 |  370 |   232 |      273 | 127.5s |    0.0% | 100.0% |   8276 |    1.36 |

### A2 · 首頁 daily per-lang 完整（28 rows）

| date | path |  PV | users |  avgDur | engSec |
| ---- | ---- | --: | ----: | ------: | -----: |
| 5/22 | /    | 328 |   238 |   72.0s |   4778 |
| 5/22 | /en/ |  19 |    14 |  161.5s |     82 |
| 5/22 | /es/ |   2 |     1 |   73.3s |     64 |
| 5/22 | /ja/ |   1 |     1 |   15.9s |     13 |
| 5/23 | /    | 355 |   287 |   42.8s |   2975 |
| 5/23 | /en/ |  25 |    14 |  106.2s |    456 |
| 5/23 | /fr/ |   4 |     4 |   52.4s |     20 |
| 5/24 | /    | 247 |   190 |   55.8s |   2731 |
| 5/24 | /en/ |  19 |    11 |   28.4s |    201 |
| 5/24 | /ja/ |   1 |     1 |   22.7s |     19 |
| 5/24 | /ko/ |   1 |     1 |    3.1s |      0 |
| 5/25 | /    | 311 |   217 |   90.6s |   5218 |
| 5/25 | /en/ |  11 |     9 |   64.4s |    180 |
| 5/25 | /ja/ |   2 |     2 |   36.3s |     67 |
| 5/25 | /fr/ |   1 |     1 |    6.1s |      0 |
| 5/26 | /    | 407 |   228 |   91.5s |   3675 |
| 5/26 | /en/ |  13 |    11 |   69.6s |    316 |
| 5/27 | /    | 342 |   211 |  163.6s |   4532 |
| 5/27 | /en/ |  16 |    14 |   19.7s |    148 |
| 5/27 | /ko/ |   3 |     2 |   11.5s |     23 |
| 5/27 | /ja/ |   1 |     1 |    8.9s |      7 |
| 5/28 | /    | 223 |   171 |  496.3s |   3230 |
| 5/28 | /en/ |  13 |     9 | 1001.8s |    279 |
| 5/28 | /ko/ |   2 |     3 |  599.6s |     26 |
| 5/28 | /es/ |   1 |     1 |   14.0s |     11 |
| 5/29 | /    |  42 |    39 |  129.0s |    583 |
| 5/29 | /en/ |   2 |     3 |   85.4s |     51 |
| 5/29 | /es/ |   2 |     1 | 1096.9s |     23 |

### A3 · post-ship top 30 pages（5/27-5/28 合計）

| pagePath                 |  PV | users | avgDur |
| ------------------------ | --: | ----: | -----: |
| /                        | 565 |   378 | 313.9s |
| /technology/大宇雙劍/    | 244 |   205 |  83.4s |
| /food/台灣美食總覽/      | 133 |   107 | 155.6s |
| /people/尹衍樑/          | 130 |   109 |  99.9s |
| /terminology/converter/  |  70 |    25 | 124.5s |
| /technology/雷亞遊戲/    |  60 |    41 |  85.7s |
| /about/                  |  57 |    37 |  90.0s |
| /semiont/                |  50 |    31 | 148.5s |
| /taiwan-shape/           |  41 |    36 | 192.6s |
| /data/                   |  34 |    25 |  61.6s |
| /en/                     |  29 |    23 | 397.4s |
| /map/                    |  29 |    18 | 166.2s |
| /contribute/             |  28 |    19 |  71.3s |
| /dashboard/              |  28 |    21 | 174.2s |
| /history/                |  28 |    21 |  87.3s |
| /soundscape/             |  28 |    19 | 108.4s |
| /explore/                |  27 |    20 | 120.7s |
| /art/臺灣漫遊錄/         |  25 |    19 |  41.0s |
| /resources/              |  25 |    20 | 102.2s |
| /graph/                  |  23 |    19 |  38.5s |
| /music/落日飛車/         |  23 |    20 |  37.1s |
| /history/國家人權博物館/ |  19 |    16 | 256.0s |
| /elections/2026/         |  17 |    14 | 298.9s |
| /food/                   |  17 |    14 |  50.9s |
| /music/張懸與安溥/       |  17 |    15 | 141.9s |
| /terminology/            |  17 |    13 | 144.2s |
| /nature/                 |  14 |     9 | 113.2s |
| /music/                  |  13 |     9 |  81.6s |
| /technology/             |  12 |    12 |  36.3s |
| /music/周蕙/             |  11 |     9 |  91.1s |

### A4 · homepage\_\* event daily 完整（16 rows）

| date | event                   | count | users |
| ---- | ----------------------- | ----: | ----: |
| 5/26 | homepage_section_view   |    34 |     1 |
| 5/26 | homepage_time_milestone |    14 |     1 |
| 5/27 | homepage_section_view   |   744 |   170 |
| 5/27 | homepage_time_milestone |   316 |    88 |
| 5/27 | homepage_scroll_depth   |   185 |    78 |
| 5/27 | homepage_click          |    75 |    45 |
| 5/27 | homepage_outbound_click |     2 |     2 |
| 5/28 | homepage_section_view   |   506 |   121 |
| 5/28 | homepage_time_milestone |   307 |    71 |
| 5/28 | homepage_scroll_depth   |    99 |    29 |
| 5/28 | homepage_click          |    60 |    32 |
| 5/28 | homepage_outbound_click |     5 |     4 |
| 5/29 | homepage_section_view   |   130 |    31 |
| 5/29 | homepage_time_milestone |    41 |     9 |
| 5/29 | homepage_scroll_depth   |    40 |     9 |
| 5/29 | homepage_click          |     6 |     3 |

### A5 · homepage_section_view by section（完整 14 rows，含 not-set）

| section            | events | users |
| ------------------ | -----: | ----: |
| hero               |    380 |   238 |
| (not set)          |    308 |    75 |
| reader_doors       |    185 |   130 |
| random_discovery   |    113 |    89 |
| feature_cards      |     70 |    55 |
| reading_path       |     66 |    55 |
| organism_preview   |     59 |    46 |
| cover_story        |     55 |    43 |
| category_grid      |     38 |    33 |
| language_statement |     34 |    29 |
| recent_updates     |     28 |    23 |
| newsletter         |     20 |    17 |
| community_feedback |     12 |    11 |
| contribute         |     12 |    12 |

### A6 · homepage_click by section × label（完整 26 rows）

| section          | label      | events | users |
| ---------------- | ---------- | -----: | ----: |
| (not set)        | (not set)  |     26 |    16 |
| hero_cta         | explore    |     25 |    24 |
| random_dice      | roll       |     16 |    13 |
| reader_door      | first      |      9 |     9 |
| category_grid    | history    |      6 |     6 |
| reader_door      | random     |      6 |     5 |
| reading_path     | step_1     |      6 |     5 |
| category_grid    | food       |      5 |     5 |
| category_grid    | technology |      5 |     4 |
| cover_story      | read_full  |      5 |     5 |
| reader_door      | search     |      5 |     5 |
| category_grid    | music      |      4 |     4 |
| organism_preview | open       |      3 |     3 |
| reader_door      | organism   |      3 |     3 |
| recent_updates   | view_all   |      3 |     2 |
| contribute       | guide      |      2 |     2 |
| reading_path     | step_2     |      2 |     2 |
| reading_path     | step_4     |      2 |     2 |
| category_grid    | economy    |      1 |     1 |
| category_grid    | geography  |      1 |     1 |
| category_grid    | lifestyle  |      1 |     1 |
| category_grid    | nature     |      1 |     1 |
| category_grid    | people     |      1 |     1 |
| category_grid    | society    |      1 |     1 |
| feature_cta      | graph      |      1 |     1 |
| hall_pick        | 唐鳳       |      1 |     1 |

### A7 · homepage_scroll_depth by `pct`（bug 證據 — 全 empty/not-set）

| pct value      | events | users |
| -------------- | -----: | ----: |
| (empty string) |    139 |    38 |
| (not set)      |    185 |    78 |

> `pct` dim 全部 empty/(not set) — JS 實際送 `depth_pct`。2026-05-29 已修（註冊 depth_pct dim）。

### A8 · homepage_time_milestone by seconds（完整 5 rows）

| seconds   | events | users |
| --------- | -----: | ----: |
| (not set) |    123 |    36 |
| 180       |    111 |    61 |
| 30        |    200 |   134 |
| 60        |    152 |    90 |
| 600       |     78 |    43 |

### A9 · homepage\_\* event by page_lang × event（完整 25 rows）

| page_lang | event                   | events | users |
| --------- | ----------------------- | -----: | ----: |
| zh-TW     | homepage_section_view   |    988 |   244 |
| zh-TW     | homepage_time_milestone |    510 |   130 |
| (not set) | homepage_section_view   |    310 |    75 |
| zh-TW     | homepage_scroll_depth   |    215 |    72 |
| (not set) | homepage_time_milestone |    123 |    36 |
| zh-TW     | homepage_click          |    106 |    58 |
| (not set) | homepage_scroll_depth   |     87 |    38 |
| en        | homepage_section_view   |     30 |    12 |
| (not set) | homepage_click          |     26 |    16 |
| ko        | homepage_section_view   |     24 |     4 |
| zh-CN     | homepage_section_view   |     20 |     3 |
| en        | homepage_time_milestone |     19 |     4 |
| ko        | homepage_scroll_depth   |      9 |     3 |
| zh-TW     | homepage_outbound_click |      7 |     6 |
| en        | homepage_scroll_depth   |      6 |     3 |
| zh-CN     | homepage_scroll_depth   |      6 |     2 |
| es        | homepage_section_view   |      5 |     2 |
| es        | homepage_time_milestone |      5 |     2 |
| zh-CN     | homepage_click          |      5 |     3 |
| ko        | homepage_time_milestone |      4 |     1 |
| en        | homepage_click          |      3 |     2 |
| ja        | homepage_section_view   |      3 |     1 |
| zh-CN     | homepage_time_milestone |      3 |     3 |
| es        | homepage_scroll_depth   |      1 |     1 |
| ko        | homepage_click          |      1 |     1 |

### A10 · watch-list pages day-by-day（完整 41 rows）

| date | path           |  PV | users | avgDur |
| ---- | -------------- | --: | ----: | -----: |
| 5/22 | /about/        |  33 |    23 | 217.6s |
| 5/22 | /semiont/      |  26 |    17 | 148.2s |
| 5/22 | /dashboard/    |  16 |    12 |  92.7s |
| 5/22 | /explore/      |  15 |     9 |  79.5s |
| 5/22 | /taiwan-shape/ |  12 |    10 | 107.1s |
| 5/23 | /about/        |  19 |    14 | 267.9s |
| 5/23 | /taiwan-shape/ |  12 |     9 |  32.6s |
| 5/23 | /semiont/      |  11 |     7 | 121.6s |
| 5/23 | /explore/      |   7 |     4 |  16.7s |
| 5/23 | /dashboard/    |   6 |     6 |  55.8s |
| 5/24 | /about/        |  20 |    15 | 150.6s |
| 5/24 | /semiont/      |  17 |    11 |  10.1s |
| 5/24 | /taiwan-shape/ |  10 |     9 |  52.9s |
| 5/24 | /dashboard/    |   9 |     6 |  49.9s |
| 5/24 | /explore/      |   9 |     9 |  20.0s |
| 5/25 | /semiont/      | 100 |    15 | 354.4s |
| 5/25 | /about/        |  46 |    28 | 104.0s |
| 5/25 | /taiwan-shape/ |  25 |    21 | 320.0s |
| 5/25 | /dashboard/    |  13 |    10 |  85.5s |
| 5/25 | /explore/      |   8 |     8 | 121.8s |
| 5/25 | /DASHBOARD     |   1 |     1 |   7.5s |
| 5/26 | /semiont/      |  27 |    15 | 189.6s |
| 5/26 | /about/        |  24 |    18 | 148.7s |
| 5/26 | /taiwan-shape/ |  23 |    17 | 146.2s |
| 5/26 | /explore/      |  13 |    10 |  22.5s |
| 5/26 | /dashboard/    |  11 |     9 | 216.7s |
| 5/27 | /about/        |  37 |    25 |  52.8s |
| 5/27 | /semiont/      |  26 |    17 |  54.0s |
| 5/27 | /taiwan-shape/ |  23 |    21 | 186.4s |
| 5/27 | /dashboard/    |  21 |    16 | 119.1s |
| 5/27 | /explore/      |  18 |    13 |  83.9s |
| 5/28 | /semiont/      |  24 |    16 | 251.2s |
| 5/28 | /about/        |  20 |    15 | 145.8s |
| 5/28 | /taiwan-shape/ |  18 |    16 | 200.6s |
| 5/28 | /explore/      |   9 |     7 | 194.3s |
| 5/28 | /dashboard/    |   7 |     6 | 376.6s |
| 5/29 | /about/        |   7 |     5 |  19.7s |
| 5/29 | /semiont/      |   7 |     5 | 178.3s |
| 5/29 | /explore/      |   3 |     3 |   0.0s |
| 5/29 | /taiwan-shape/ |   3 |     3 |  25.2s |
| 5/29 | /dashboard/    |   2 |     2 | 212.8s |

### A11 · 首頁 hourly engagement（5/27 + 5/28，完整 46 rows）

| date | hour |  PV | users | engSec | engSec/user |
| ---- | ---: | --: | ----: | -----: | ----------: |
| 5/27 |   00 |  21 |    15 |    114 |           8 |
| 5/27 |   01 |  17 |    14 |    143 |          10 |
| 5/27 |   02 |  12 |     3 |     63 |          21 |
| 5/27 |   03 |   5 |     5 |     19 |           4 |
| 5/27 |   04 |   2 |     2 |     13 |           6 |
| 5/27 |   05 |   3 |     4 |     53 |          13 |
| 5/27 |   06 |   3 |     2 |     15 |           8 |
| 5/27 |   07 |   3 |     2 |      0 |           0 |
| 5/27 |   08 |  13 |     8 |    174 |          22 |
| 5/27 |   09 |  19 |    13 |    106 |           8 |
| 5/27 |   10 |  14 |    11 |    123 |          11 |
| 5/27 |   11 |  20 |    11 |    319 |          29 |
| 5/27 |   12 |   7 |     6 |     84 |          14 |
| 5/27 |   13 |  15 |     7 |    133 |          19 |
| 5/27 |   14 |  38 |    24 |    301 |          13 |
| 5/27 |   15 |  37 |    28 |    443 |          16 |
| 5/27 |   16 |  26 |    18 |    425 |          24 |
| 5/27 |   17 |  20 |    16 |    278 |          17 |
| 5/27 |   18 |   7 |     4 |    186 |          46 |
| 5/27 |   19 |  17 |    12 |    107 |           9 |
| 5/27 |   20 |   9 |     7 |     70 |          10 |
| 5/27 |   21 |  19 |    17 |    290 |          17 |
| 5/27 |   22 |  16 |    12 |    562 |          47 |
| 5/27 |   23 |  19 |    16 |    689 |          43 |
| 5/28 |   00 |   5 |     6 |     80 |          13 |
| 5/28 |   01 |  12 |    14 |     32 |           2 |
| 5/28 |   03 |   1 |     2 |    142 |          71 |
| 5/28 |   05 |   3 |     4 |      7 |           2 |
| 5/28 |   06 |  11 |     7 |    344 |          49 |
| 5/28 |   07 |   8 |    10 |     64 |           6 |
| 5/28 |   08 |   9 |     6 |     36 |           6 |
| 5/28 |   09 |  17 |    12 |    275 |          23 |
| 5/28 |   10 |  19 |    19 |    351 |          18 |
| 5/28 |   11 |   7 |     6 |    281 |          47 |
| 5/28 |   12 |   6 |     5 |     65 |          13 |
| 5/28 |   13 |  19 |    17 |    422 |          25 |
| 5/28 |   14 |  12 |    11 |    193 |          18 |
| 5/28 |   15 |  11 |    11 |    163 |          15 |
| 5/28 |   16 |  26 |    23 |    387 |          17 |
| 5/28 |   17 |  17 |    12 |    133 |          11 |
| 5/28 |   18 |   5 |     6 |     50 |           8 |
| 5/28 |   19 |  13 |     8 |    236 |          30 |
| 5/28 |   20 |   8 |     6 |     94 |          16 |
| 5/28 |   21 |  12 |    12 |    130 |          11 |
| 5/28 |   22 |   6 |     6 |     17 |           3 |
| 5/28 |   23 |  12 |     7 |     44 |           6 |

### A12 · section_view by page_lang × section（完整 55 rows）

| page_lang | section            | events | users |
| --------- | ------------------ | -----: | ----: |
| zh-TW     | hero               |    357 |   234 |
| (not set) | (not set)          |    308 |    75 |
| zh-TW     | reader_doors       |    173 |   125 |
| zh-TW     | random_discovery   |    104 |    82 |
| zh-TW     | feature_cards      |     64 |    49 |
| zh-TW     | reading_path       |     61 |    51 |
| zh-TW     | organism_preview   |     54 |    41 |
| zh-TW     | cover_story        |     52 |    42 |
| zh-TW     | category_grid      |     35 |    30 |
| zh-TW     | language_statement |     29 |    24 |
| zh-TW     | recent_updates     |     23 |    18 |
| zh-TW     | newsletter         |     16 |    13 |
| en        | hero               |     15 |    11 |
| zh-TW     | community_feedback |     11 |    10 |
| zh-TW     | contribute         |      9 |     9 |
| en        | reader_doors       |      4 |     4 |
| en        | random_discovery   |      3 |     3 |
| es        | hero               |      3 |     2 |
| ko        | feature_cards      |      3 |     3 |
| ko        | hero               |      3 |     3 |
| zh-CN     | random_discovery   |      3 |     3 |
| zh-CN     | reader_doors       |      3 |     2 |
| en        | reading_path       |      2 |     2 |
| ko        | category_grid      |      2 |     2 |
| ko        | cover_story        |      2 |     2 |
| ko        | language_statement |      2 |     2 |
| ko        | organism_preview   |      2 |     2 |
| ko        | random_discovery   |      2 |     2 |
| ko        | reader_doors       |      2 |     2 |
| ko        | reading_path       |      2 |     2 |
| ko        | recent_updates     |      2 |     2 |
| zh-CN     | feature_cards      |      2 |     2 |
| zh-CN     | language_statement |      2 |     2 |
| zh-CN     | newsletter         |      2 |     2 |
| zh-CN     | organism_preview   |      2 |     2 |
| zh-CN     | recent_updates     |      2 |     2 |
| (not set) | hero               |      1 |     1 |
| (not set) | reader_doors       |      1 |     1 |
| en        | contribute         |      1 |     1 |
| en        | feature_cards      |      1 |     1 |
| en        | language_statement |      1 |     1 |
| en        | newsletter         |      1 |     1 |
| en        | organism_preview   |      1 |     1 |
| en        | recent_updates     |      1 |     1 |
| es        | random_discovery   |      1 |     1 |
| es        | reader_doors       |      1 |     1 |
| ja        | cover_story        |      1 |     1 |
| ja        | hero               |      1 |     1 |
| ja        | reader_doors       |      1 |     1 |
| ko        | contribute         |      1 |     1 |
| ko        | newsletter         |      1 |     1 |
| zh-CN     | category_grid      |      1 |     1 |
| zh-CN     | community_feedback |      1 |     1 |
| zh-CN     | contribute         |      1 |     1 |
| zh-CN     | reading_path       |      1 |     1 |

### A13 · section discovery time `elapsed_ms` per section（p50/p90/p99 + 分桶）

從 200 raw (section, elapsed_ms, count) rows 計算。bin: <5s / 5-30s / 30-120s / >120s。

| section            |   n |    p50 |    p90 |     p99 | <5s | 5-30s | 30-120s | >120s |
| ------------------ | --: | -----: | -----: | ------: | --: | ----: | ------: | ----: |
| hero               |  25 |   1.7s |   7.5s |    7.7s |  19 |     6 |       0 |     0 |
| reading_path       |   4 |   2.0s |   2.0s |    2.0s |   4 |     0 |       0 |     0 |
| organism_preview   |   4 |   3.1s |   3.1s |    3.1s |   4 |     0 |       0 |     0 |
| reader_doors       |   8 |   8.0s |  10.2s |   10.2s |   4 |     4 |       0 |     0 |
| cover_story        |  55 |  11.8s |  61.1s | 5096.4s |   9 |    38 |       3 |     5 |
| feature_cards      |  64 |  16.8s | 191.5s | 5096.4s |  17 |    26 |      12 |     9 |
| category_grid      |  38 |  21.0s | 202.1s | 5096.6s |   2 |    24 |       7 |     5 |
| community_feedback |  12 |  58.1s | 634.6s | 5096.6s |   0 |     5 |       3 |     4 |
| contribute         |  12 |  62.7s | 635.1s | 5096.6s |   0 |     5 |       3 |     4 |
| random_discovery   |   4 | 322.2s | 322.2s |  322.2s |   2 |     0 |       0 |     2 |

---

🧬 完整數據附錄 end — 13 query / 2026-05-29 10:48 取數。
