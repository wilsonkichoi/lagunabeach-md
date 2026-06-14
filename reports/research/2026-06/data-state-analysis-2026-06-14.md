# Taiwan.md 資料狀態深度盤點 — GA4 + Search Console 一個月 × pipeline 盲點

_2026-06-14 | 視窗：2026-05-17 → 06-14（28 天）| 來源：GA4 + Search Console（service account）+ 11 條 sense pipeline code inspection_

---

## 主軸方向（一句話）

**瓶頸不是流量，是 CTR。** 一個月 39 萬次搜尋曝光只換到 5,279 次點擊（**CTR 1.35%**，站體標準目標是 3%）——台灣在搜尋裡「被看到」但「沒被點」。而驅動內容進化的 **EVOLVE pipeline 自己的文件寫明要用 per-page bounce / exit-page / striking-distance / zero-result 訊號選題，實際 fetch 腳本根本沒抓這些**。結果：內容進化在用「流量量級」而不是「CTR / engagement」選題，剛好瞎在唯一能把 1.35% 推到 3% 的那一層。

三個方向，依 ROI 排序：
1. **補 EVOLVE 的眼睛**（per-page bounce / exit / striking-distance）——doc 寫了、fetch 沒給，是文件 vs 實作的靜默漂移。
2. **CTR 工程**（title / snippet / striking-distance 5-15 名的查詢）——390k 曝光的轉換率工程，比再寫新文章 ROI 高。
3. **converter 是最佳轉換資產卻沒插管**——`大陸用語轉換器` 是 CTR 最高的查詢（27%），但 converter 前端事件一個月只 fire 47 次。

---

## Part 1 — 一個月資料（事實層）

### 1.1 流量：穩定，不是衰退

| 指標（28d） | 值 |
| --- | --- |
| Sessions | 38,644 |
| Active users | 33,026 |
| Pageviews | 54,034 |
| Engagement rate | 29.4% |
| 日均 sessions | ~1,000–1,500（穩定，週期性尖峰 05-24 / 06-05 / 06-13 ~1,900–2,200） |

> **方法論註記（broken-instrument 自捕）**：`ga-query.py --dims date` 預設回傳**按 sessions 降序**而非日期序。第一輪我誤把 `slice(0,7)` 當「第一週」、`slice(21,28)` 當「第四週」算出「流量腰斬 -47%」——其實是拿「最高 7 天」比「最低 7 天」的排序假象。畫出日序 sparkline 才抓到。對應 REFLEXES broken-instrument-blindspot：**對「資料的順序」的假設也是一把壞尺**。

### 1.2 通路

| Channel | Sessions | % |
| --- | --- | --- |
| Direct | 15,623 | 40% |
| Organic Search | 8,565 | 22% |
| **Unassigned** | 8,198 | **21%** |
| Referral | 3,388 | 9% |
| Organic Social | 2,982 | 8% |
| AI Assistant | 77 | 0.2% |

- **Unassigned 21%** 是大缺口——GA4 無法歸因的 session（多半是 social / dark traffic / 缺 referrer）。值得追。
- **AI Assistant 只有 77**——所有 MCP / AI-readiness 投資目前換到的 AI 轉介流量極小（但這個 category 在長大，值得當早期指標養）。

### 1.3 頁面：高度集中首頁

| Page | Views | |
| --- | --- | --- |
| `/` | 9,178 | 首頁吃掉 17% 全站 pageviews |
| `/latest/` | 1,805 | |
| `/art/臺灣漫遊錄/` | 1,772 | hero 文 |
| `/technology/Computex/` | 1,764 | 時事 hero |
| `/technology/雷亞遊戲/` | 1,376 | |
| `/society/我是OO人/` | 1,227 | |
| `/terminology/converter/` | 597 | **轉換器（高 CTR 資產）** |

站體是**首頁 + 幾篇 hero 文**的頭重型結構。長尾文章各自幾十到幾百 views。

### 1.4 語言 × 國家

| 語言 | Sessions | | 國家 | Sessions |
| --- | --- | --- | --- | --- |
| 中文 | 23,108 (60%) | | 台灣 | 21,585 (56%) |
| English | 13,627 (35%) | | **新加坡** | **7,749 (20%)** |
| 日本語 | 776 (2%) | | 中國 | 1,984 |
| 한국어 | 454 (1%) | | 美國 | 1,874 |
| Français | 153 | | 日本 | 1,041 |
| Español | 123 | | 香港 | 460 |

- **新加坡是第二大國（20%）**——龐大的中文閱讀 SG 受眾，意外但重要（華語圈而非英語圈在撐第二大盤）。
- **babel 五語 ROI 落差**：ja/ko/fr/es/de/id 加總 < 5% 流量。但 SC 顯示韓國 279 點擊（CTR 1.99%）、日本 226 點擊（2.32%）有真實 organic search——小但非零，是種子不是死投資。sovereignty 視角下這是「先存在、流量後到」的長線。

### 1.5 Search Console：CTR 是真瓶頸

| 指標（28d） | 值 |
| --- | --- |
| Clicks | 5,279 |
| Impressions | 390,093 |
| **CTR** | **1.35%**（目標 3%） |

| 國家 | Clicks | Impressions | CTR |
| --- | --- | --- | --- |
| 台灣 | 3,753 | 160,695 | 2.34% |
| 韓國 | 279 | 14,055 | 1.99% |
| **美國** | 255 | **108,575** | **0.23%** |
| 日本 | 226 | 9,745 | 2.32% |

- **美國 108k 曝光只有 0.23% CTR**——巨大的「被搜尋到卻幾乎沒人點」盤。英文內容在美國搜尋大量曝光但 title/snippet 不吸引點擊，或排在 wrong-intent 的查詢上。這一格是 CTR 工程最大的單一機會。
- **Brand vs non-brand（7d）**：brand CTR 3.77%（956 曝光）/ nonBrand 2.34%（24,677 曝光）。aggregate CTR 被 brand 撐高——真正的外部 discoverability 是 nonBrand 那條。

**Top 查詢（7d，CTR 高 = 已驗證的入口）**：
- `大陸用語轉換器` 27% CTR pos 2.1 —— **converter 是全站最佳轉換查詢**
- `黃山料服裝設計` 18% / `阿神本名` 3.7% / `世界三大電腦展` 17%

**Striking-distance（高曝光低 CTR，pos 5-15 = CTR 工程金礦）**：
- `無名小站` 1,178 曝光 1.53% pos 8.6
- `吳百福` 705 曝光 1.28% pos 2.6（pos 2 卻 1.3% CTR = title 問題）
- `黃山料學歷` 700 曝光 1.29% / `紀政` 553 曝光 pos 10.6 / `jj lin age` 335 曝光 pos 8.8 / `侯孝賢` pos 13

### 1.6 GA4 事件：homepage tracker 有資料，新事件剛上線

| Event | 28d count | 註 |
| --- | --- | --- |
| `homepage_section_view` | 13,195 | 首頁 landmark 追蹤運作中 |
| `homepage_time_milestone` | 5,548 | |
| `homepage_scroll_depth` | 2,866 | |
| `homepage_click` | 1,795 | |
| `search_query` | 838 | 站內搜尋 |
| `converter_term_lookup` | **47** | **converter 前端事件幾乎沒插管** |

新的 generic `scroll_depth` / `section_view`（跨頁、本日才上線）尚無資料——下個月才看得到文章頁的殘留曲線。

---

## Part 2 — Pipeline 盲點（之前看不到的東西）

完整 code inspection（11 腳本 + EVOLVE/MAINTAINER pipeline）見附錄。核心發現：

### 2.1 結構性發現：EVOLVE 文件 vs fetch 實作的靜默漂移

EVOLVE-PIPELINE.md Phase 1A 明文列出選題要看的訊號，但 `fetch-ga4.py` 根本沒抓：

| EVOLVE doc 寫要看（Phase 1A/1B） | fetch 實際有抓？ |
| --- | --- |
| 「Per-page Bounce Rate — 哪些文章讀者看了就跑？」 | ❌ 只抓**全站** bounce，非 per-page |
| 「Exit Pages — 讀者從哪篇離開？」 | ❌ 從未 query exitPagePath |
| 「裝置分布 — 手機排版是否優先？」 | ❌ top-level 沒抓 deviceCategory（只有 converter 頁有） |
| 「高曝光 + 低 CTR」striking-distance | ⚠️ 只 flag CTR<5%，沒按 position 分桶（pos 8-15 金礦沒單獨浮出） |
| 「有曝光但無對應文章」zero-result | ⚠️ `fetch-search-events.py` 有抓但只印 stdout，沒 persist、沒餵回 EVOLVE |

**= EVOLVE 在用「流量量級」選題，因為它能拿到的就只有流量。** 能移動 CTR 的訊號（per-page 黏著度 / 離開點 / 排名 5-15 的查詢）它的 doc 說要用，但管線斷在 fetch 層。

### 2.2 抓了沒用的訊號（fetched but not consumed）

| 訊號 | 抓的人 | 卡在哪 |
| --- | --- | --- |
| `events_404`（404 事件） | fetch-ga4.py | 落 cache 沒人讀，沒 escalate INBOX |
| `potential_404`（SC vs sitemap） | fetch-search-console.py | 偵測到不 action |
| `zero_result_queries`（站內 0 結果搜尋） | fetch-search-events.py | 只 stdout，沒進 ARTICLE-INBOX |
| brand/nonBrand CTR split | generate-dashboard-analytics.py | dashboard 顯示了，EVOLVE 選題不吃（用 aggregate 虛榮 CTR） |

### 2.3 完全沒碰的訊號

deviceCategory（手機 vs 桌機黏著度）、exitPagePath、landingPagePath、per-page bounce、query position 分桶、Discover vs Organic 拆分、newVsReturning × page。

---

## Part 3 — 建議方向（依 ROI）

1. **🥇 補 EVOLVE 的眼睛（本報告同步 ship 第一刀）**：`fetch-ga4.py` 加 per-page bounce + engagement + exit-page report，讓 EVOLVE Phase 1A 真的拿得到它 doc 上承諾的訊號。15-30 min，直接讓內容進化從「挑流量大的」變「挑該救的」。
2. **🥈 CTR 工程當一級飛輪**：把 striking-distance（pos 5-15）查詢分桶 + 美國 0.23% CTR 盤當 title/snippet 重寫信號。390k 曝光的 1.35%→3% 比寫新文章 ROI 高一個量級。對應 [Search Strategy memory]。
3. **🥉 converter 插管 + 放大**：`大陸用語轉換器` 是已驗證最佳入口（27% CTR），但前端事件月 47 次。補 converter_term_lookup / convert / copy 事件 → 量化需求飛輪 → converter-demand.py 才有真資料。
4. **action loop 補洞**：404 / zero-result / potential-404 三個訊號都「偵測到但不 action」——接一條 escalate 到 ARTICLE-INBOX / LESSONS-INBOX 的線。
5. **觀察清單**：Unassigned 21% 歸因缺口、AI Assistant 77（早期 AI 轉介指標養著）、新加坡 20%（華語圈第二大盤的內容策略）。

---

## Part 4 — 本 session 同步 ship 的進化

依「過程中發現可進化就進化」：**close EVOLVE 的 #1 盲點**。`fetch-ga4.py` top_pages report 補 `bounceRate` + `averageSessionDuration` per page（之前只有全站 bounce），EVOLVE Phase 1A 從此拿得到 doc 上承諾的「per-page bounce — 哪些文章讀者看了就跑」。

**第一跑就抓到老 pipeline 看不到的訊號**（worked example）：

| Page | Bounce | Dwell | 讀法 |
| --- | --- | --- | --- |
| `/` | 52% | 211s | 黏 |
| **`/latest/`** | **97%** | 66s | **死路——讀者落地就走，幾乎不往下逛** |
| `/art/臺灣漫遊錄/` | 85% | 61s | 高跳出（hero 文卻留不住） |
| `/technology/Computex/` | 59% | 139s | 相對黏 |
| `/society/我是OO人/` | 77% | 110s | |

`/latest` 97% bounce 是舊 pipeline（只有全站 bounce）**看不見**的——這正是「站上最新完整卡片」改版該驗收的指標，下個月可看改版前後 /latest bounce 變化。exit-page（B5）在 GA4 Data API 無對應 dimension（UA 遺留），故本刀只做 valid 的 per-page bounce；exit 的替代是用 bounce + 站內 click 事件推。完整變更見下方 git log。

---

_作者：Taiwan.md | 觸發：哲宇要求完整深挖一個月 GA4+SC + 找 pipeline 盲點 + 找主軸方向記錄 + 歸檔報告 + 過程中發現可進化就進化_
_資料快照：/tmp/twmd-analysis/（ga-daily/channels/pages/lang/country + sc-28d）；blind-spots code inspection：11 腳本 + EVOLVE/MAINTAINER pipeline_
