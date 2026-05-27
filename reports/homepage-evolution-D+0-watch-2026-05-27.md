---
title: 'Homepage Evolution D+0 Watch — 2026-05-27 (ship 5/26 23:00-23:50 + 14hr)'
date: 2026-05-27
type: 'observation-report'
status: 'partial-d0-snapshot'
related:
  - 'reports/homepage-evolution-2026-05-26.md'
  - 'docs/semiont/memory/2026-05-26-215949-manual.md'
---

# Homepage Evolution D+0 — 14 hr 後觀察

Wave 1+2+3 全 ship 時間：2026-05-26 23:00-23:50 origin/main。
本檔時間：2026-05-27 ~14:00（D+0 partial，~14.5 hr 後）。

> ⚠️ **這是 14 hr partial snapshot**，不是穩定信號。完整 D+0 要到 5/28 00:00；可信比較期需要 2-4 週（per 昨日 memory「等 2-4 週 GA4 數據驗證」commitment）。

---

## 1. 最有趣的數字：首頁 engagement 飆 5x，但 sample 太小

| 日期                       | screenPageViews | activeUsers | sessions | **avgSessionDuration** |
| -------------------------- | --------------- | ----------- | -------- | ---------------------- |
| 5/24（baseline）           | 247             | 190         | 230      | **55.8s**              |
| 5/25                       | 311             | 217         | 278      | **90.6s**              |
| 5/26（ship 同日 23:00 後） | 325             | 217         | 281      | **123.7s**             |
| 5/27 D+0 partial 14.5 hr   | **109**         | 78          | 105      | **271.5s**             |

avgSessionDuration **55.8s → 271.5s** = 4.9x。
但 D+0 PV=109 跟前 3 天平均 ~290 比掉一半 → sample size 警示。

**caveat**：5/27 才走 14.5 hr（14:00 / 24 hr = 60% 一日）。若按比例 prorate 預估完整 5/27 ~ 180 PV，仍比 5/26 325 低 ~45%。要嘛今天 organic traffic 低、要嘛 GA 處理 lag、要嘛改版觸發過濾掉了某些 bot session（GA 用戶基準變嚴）。

**caveat #2**：5/26 + 5/27 的 `engagementRate=0` / `bounceRate=1` 看起來壞掉（avgDuration 高得不可能搭配 100% bounce）。GA4 attribution lag 已知 48-72 hr，下次再查這兩個指標應該會自己對回來。

---

## 2. 改版 instrumentation 4 個事件全部活著 ✓

5/27 GA event ranking（fired today，2026-05-27 為一個 14 hr partial 取樣）：

| eventName                   | eventCount | activeUsers | 狀態                                  |
| --------------------------- | ---------- | ----------- | ------------------------------------- |
| page_view                   | 789        | 480         | (GA default)                          |
| session_start               | 563        | 469         | (GA default)                          |
| first_visit                 | 455        | 455         | (GA default)                          |
| user_engagement             | 353        | 152         | (GA default)                          |
| **homepage_section_view**   | **236**    | **56**      | ✓ Phase 6 IntersectionObserver        |
| scroll                      | 186        | 107         | (GA default)                          |
| **homepage_time_milestone** | **94**     | **26**      | ✓ Phase 6 time                        |
| **homepage_scroll_depth**   | **65**     | **19**      | ✓ Phase 6 scroll                      |
| click                       | 28         | 21          | (GA default outbound)                 |
| **homepage_click**          | **19**     | **14**      | ✓ Phase 2.5 ReaderDoors + 13 sections |
| search_query                | 18         | 5           | (5/10 ship /explore)                  |
| search_result_click         | 3          | 3           | search 內轉化                         |
| form_start                  | 1          | 1           | 「歡迎指正」or feedback form          |

**4 條新 instrumentation 全部 active**：section_view / time_milestone / scroll_depth / click。
**未見**：`homepage_form_submit`（無 form 提交，正常）/ `homepage_outbound_click`（事件命名為 GA default `click`？要查 HomeEventTracker code 確認）。

---

## 3. 🚨 結構性 gap：6 個 event params 沒註冊成 GA4 Custom Dimension（✅ 2026-05-27 ~14:30 resolved — Chrome MCP 註冊 6 dim 完成）

> **後續 update**：2026-05-27 ~14:30 哲宇 directive「你用 chrome 做」→ Claude in Chrome MCP 完成 6 個 custom dim 註冊（Homepage Section / Homepage Click Label / Scroll Percent / Time Milestone Seconds / Page Language / Elapsed MS）。Data API `getMetadata` 確認 13 個 custom dim 全 queryable。`customEvent:section / label / pct / seconds / page_lang / elapsed_ms` 即時可 group by。
>
> **GA4 custom dim NOT retroactive**：5/26 23:00 - 5/27 14:30 ~15.5 hr events 沒被 dim 捕捉，dim attribution 從 ~14:30 起前向收集。要看完整 attribution 需等 5/28 0:00 + 進一步累積。

GA4 metadata API 列現有 custom dimensions：

```
✓ customEvent:click_position  (Clicked Result Position — search)
✓ customEvent:click_title     (Clicked Result Title — search)
✓ customEvent:click_url       (Clicked Result URL — search)
✓ customEvent:results_count   (Search Results Count)
✓ customEvent:search_lang     (Search Language)
✓ customEvent:search_mode     (Search Mode)
✓ customEvent:search_term     (Search Term)
```

**所有 7 條註冊的 custom dim 都是 5/10 search 那波留下來的**。Phase 6 新 instrumentation 的 6 個 event param 都沒登錄：

| 新事件                  | param 名     | 用途                                                                                                  | 註冊狀態 |
| ----------------------- | ------------ | ----------------------------------------------------------------------------------------------------- | -------- |
| homepage_section_view   | `section`    | reader_doors / cover_story / random_discovery / reading_path / feature_cards 等 14 section 哪個被看到 | ❌       |
| homepage_section_view   | `elapsed_ms` | 多久後第一次進到該 section                                                                            | ❌       |
| homepage_click          | `section`    | hero_cta / reader_door / categories_grid 哪個區的 click                                               | ❌       |
| homepage_click          | `label`      | reader_door 子 label：first / search / random / organism                                              | ❌       |
| homepage_scroll_depth   | `pct`        | 25 / 50 / 75 / 100                                                                                    | ❌       |
| homepage_time_milestone | `seconds`    | 30 / 60 / 180 / 600                                                                                   | ❌       |
| homepage\_\*            | `page_lang`  | 哪個語言                                                                                              | ❌       |

**含意**：events 在 fire ✓，DebugView 看得到，但 **Data API query 不能 group by `section` / `label`**。要回答「哪個 reader door 最常被點」「哪個 section 最常被看到」現在沒辦法 — 需要先進 GA4 property → Admin → Custom definitions 註冊。

**對應 Wave 1+2+3 ship 的盲點**：昨日 memory 預期「2-4 週 GA4 數據驗證 +50-100s engagement 假設」，但 sample size + custom dim 沒註冊 = 即使等 4 週也只能看 aggregate `homepage_section_view` 總量，沒辦法做 ReaderDoors B1 是不是真有用 / OrganismPreview A1 對 /semiont CTR 影響 / 8 quote CoverStory 第幾個 quote drop-off 多 的細粒度 attribution。

---

## 4. D+0 14.5 hr Top pages snapshot

| pagePath                           | PV      | users | avgDuration |
| ---------------------------------- | ------- | ----- | ----------- |
| /technology/大宇雙劍/              | **125** | 116   | 50.7s       |
| **/** （首頁）                     | 109     | 78    | **271.5s**  |
| /people/尹衍樑/                    | 74      | 64    | 71.8s       |
| /food/台灣美食總覽/                | 25      | 24    | 156.2s      |
| /technology/雷亞遊戲/              | 21      | 14    | 37.7s       |
| /about/                            | 13      | 9     | 166.4s      |
| /history/國家人權博物館/           | 11      | –     | –           |
| /art/臺灣漫遊錄/                   | 5       | 5     | 130.7s      |
| /taiwan-shape                      | 4       | 4     | **885.3s**  |
| /en                                | 4       | 4     | 180.0s      |
| /culture/台灣原住民族16族文化地圖/ | 3       | 3     | **815.9s**  |
| /dashboard                         | 3       | 2     | 391.6s      |
| /data                              | 3       | 3     | 257.8s      |

**3 個觀察**：

1. **首頁 271s 已超越昨日 baseline /semiont 178.9s / /dashboard 172.3s**（per 5/26 report Beat 1）。即使 sample 小、有 attribution lag 風險，首頁從「19s baseline」→「75.9s 28d」→「271s D+0」的方向明確。
2. **昨晚兩個 R2 EVOLVE article（大宇雙劍 5/26 ship + 尹衍樑 5/26 NEW）佔 PV 前三**。Recent ship dominate traffic 的 pattern 重複（per 雷亞 D+0 21K viral 5/25 / 美食總覽 D+0 5/27 79K reach）。
3. **/about D+0 13 PV 比近期日常高**。可能跟 5/26 Wave 3 CoverStory closing prose 加 `/about` link 有關（A3 內加「了解更多 →」）。要看 5/28 是否續存。

---

## 5. Realtime snapshot（取數時 ~14:00 30 min window）

| 頁面         | 同時在線 |
| ------------ | -------- |
| 台灣美食總覽 | 6        |
| 首頁         | 5        |
| 大宇雙劍     | 4        |
| 道德課       | 2        |
| 尹衍樑       | 2        |

11 個用戶同時在線，首頁排第二 — 流量還在正常運作，沒有 deploy/build issue 造成 404 風暴。

---

## 6. 結論 + 給 5/28-6/3 的 watch list

### ✓ 確認

- 4 條新 instrumentation event 全部在 fire（section_view 236 / time_milestone 94 / scroll_depth 65 / click 19）
- 首頁 avgDuration 從 55s → 271s 方向強烈正向（caveat：14hr partial + attribution lag）
- 沒 deploy/build error，realtime 流量正常

### 🚨 必修

- **註冊 6 個 GA4 Custom Dimension**（section / label / pct / seconds / page_lang / elapsed_ms）— 不然 Wave 1+2+3 的 attribution 大部分不可查。GA4 Admin → Custom definitions → Create custom dimension（event-scope）。每條一行設定，10 分鐘事。沒做 = 4 週後也只能看 aggregate 不能 attribution。

### 🔍 5/28-6/3 watch list

- 5/28 0:00 後抓完整 5/27 vs 5/24-5/26 4-day baseline 對比 avgDuration（攻擊 attribution lag 假設）
- 5/28 開始 hourly engagement curve（看是否「post-ship hour 0-6 高峰」是注意力曲線還是新鮮感曲線）
- `homepage_section_view` total 趨勢（236/day base 是否穩定 200+，還是新鮮感衰退）
- /semiont D+0 / D+1 PV — A1 OrganismPreview 是否帶流量過去
- /explore D+0 / D+1 PV — B1 ReaderDoors 第二格搜尋是否變 entry point
- /about D+0 / D+1 PV — A3 CoverStory closing 的 link 是否真起作用

### ❓ 不確定，需累積數據

- 5/27 PV 109 < 5/26 prorate 預期 ~190 是 organic traffic 自然 dip 還是改版觸發 bot 過濾收緊？需 5/28 + 5/29 觀察。
- engagementRate=0 / bounceRate=100% 5/26+5/27 attribution lag 還是 instrumentation 改變了 GA 的 engaged_session 判定邏輯？需 5/30 後對齊。

---

🧬 partial D+0 14 hr snapshot, full picture needs 5/28 00:00 + 2-4 week stabilization.
