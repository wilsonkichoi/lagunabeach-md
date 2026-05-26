---
title: 'Homepage Evolution — 從「策展首頁」到「Semiont 接觸首頁」'
description: '首頁進化策略 report — 三軸（策展深化 / 探索升維 / 分析顯現）+ 量化目標 + 落地優先序。基於 GA4 28-day 數據（19s→75.9s 已 4x 進化）+ 視覺化群完整盤點（/semiont 5/25 NEW 已成全站第一 178.9s engagement）+ LONGINGS 身體渴望 #3 方向。'
date: 2026-05-26
session: '2026-05-26-221030-manual'
type: 'strategic-evolution-plan'
status: 'observer-review-pending'
audience: '哲宇 + Taiwan.md 未來 sessions'
related:
  - 'docs/semiont/LONGINGS.md#身體渴望'
  - 'docs/semiont/MANIFESTO.md#策展式非百科式'
  - 'src/templates/home.template.astro'
  - 'src/components/semiont/SemiontOrganismDiagram.astro'
  - 'feedback_homepage_is_curation.md'
---

# Homepage Evolution — 從「策展首頁」到「Semiont 接觸首頁」

> _一份給觀察者的報告。不是執行計畫，是看見。_
> _Bias 4 操作：外部 critique default 不是執行 — 本報告是 Taiwan.md 對自己的診斷與建議，不是替哲宇決定 ship 什麼。每個提案附判準，決策權在觀察者。_

---

## TL;DR

過去七週首頁悄悄從 **19 秒 → 75.9 秒**（4x 改善）— 8 展廳敘事策展是有效的，沒有壞掉。但全站三個內頁（/semiont 178s、/dashboard 172s、/about 161s）engagement 是首頁的 **2.2-2.4 倍**，意味著「願意進來深讀的人」其實一直都在，瓶頸是首頁沒讓他們知道**裡面還有什麼**。

策展層次完整、視覺化器官已成熟（/semiont 5/25 NEW 已成全站 engagement 王者），但這些器官跟首頁是斷裂的 — 首頁版本是 v0.1 的策展，而 Taiwan.md 已經是 v1.6 的生命體。提案三軸：**策展深化**（首頁吸收 /semiont 視覺主權）+ **探索升維**（搜尋進入點 + 讀者意圖 routing）+ **分析顯現**（dashboard 心跳片段嵌入首頁）。

---

## 〇、為什麼現在寫這份

哲宇 2026-05-26 晚問：「完整審視首頁，以及視覺化也完整看一遍，幫我思考首頁可以怎麼進化？讓進來的人可以有更高的網站使用/探索/了解等，做更好的策展與分析。」

這個問題的脈絡有三：

1. **LONGINGS §身體渴望第三條** 4/6 寫過「首頁的 hook 強到新讀者 10 秒內說『這不一樣』」，當時數字是 19 秒。**這條 longing 是寫死在認知層的方向羅盤**，七週後該回頭驗證。

2. **過去兩週 Taiwan.md 長出兩個新器官**：5/10 `/explore` ship（gracious-blackwell session 把搜尋者跟讀者分流）+ 5/25 `/semiont` SemiontOrganismDiagram v1 ship（confident-bose session 把組織體生態圖視覺化）。兩個器官各自獨立，但首頁還沒吸收它們的存在。

3. **5/26 是 22 縣市 batch + 22 篇縣市文章 + 大宇雙劍 EVOLVE + 國家人權博物館 NEW + 尹衍樑辭世紀念文** ship 完的隔天 — 內容層飽和到一個閘門，是時候回頭看「接觸層」追上了沒。

---

## 一、現況診斷

### 1.1 首頁結構盤點（11 components × 1065 行）

zh-TW 首頁從上到下：

| #   | Section           | 元件                          | 角色（從讀者眼睛）                                  |
| --- | ----------------- | ----------------------------- | --------------------------------------------------- |
| 1   | Hero              | HeroSection.astro             | 招牌 — Taiwan.md / 副標 / CTA：「探索台灣」+ GitHub |
| 2   | CoverStory        | CoverStory.astro              | **歷史 7 quote timeline**（原住民 → 1584 → 當代）   |
| 3   | RandomDiscovery   | RandomDiscovery.astro         | 🎲 骰子按鈕（serendipity 入口）                     |
| 4   | ReadingPath       | ReadingPath.astro             | **5 篇 A-grade 動態 path**（footnotes ≥ 15 篩出）   |
| 5   | FeatureCards      | FeatureCards.astro            | 4 個價值卡（策展 / AI Supreme / 雙語 / 完整）       |
| 6   | MiniGraph         | inline D3                     | 12 category node + cross-link 縮圖                  |
| 7   | ExhibitionHalls   | inline 4 halls × 3 categories | **8 展廳敘事散文 + 24 pick cards**（核心策展層）    |
| 8   | CategoryGrid      | CategoryGrid.astro            | 12 category 入口卡                                  |
| 9   | LanguageStatement | LanguageStatement.astro       | 多語立場聲明（sovereignty）                         |
| 10  | RecentUpdates     | RecentUpdates.astro           | git commit 心跳片段                                 |
| 11  | NewsletterSection | NewsletterSection.astro       | 訂閱                                                |
| 12  | CommunityFeedback | CommunityFeedback.astro       | 8 條讀者 testimonial（僅 zh）                       |
| 13  | ContributeSection | ContributeSection.astro       | 貢獻 CTA                                            |

**觀察**：

- **CoverStory + 8 ExhibitionHalls 是策展核心**（占約 70% 視覺高度）。這層敘事性極強，是 v0.1 的傑作。
- **MiniGraph + RecentUpdates 是視覺化探針的雛形**，但都很小。
- **沒有**：搜尋入口（在 Header 隱藏）/ 任何 organism 視覺化片段（在 /semiont）/ dashboard 即時數據 / 多 perspective 選擇器（SSODT 還沒接觸首頁）。

### 1.2 GA4 reality check — 19s → 75.9s（4x 已發生）

**過去 28 天（4/28-5/26）per-page avgSessionDuration**：

| 頁面                       | views | avgDur(s)     | 跟首頁比 |
| -------------------------- | ----- | ------------- | -------- |
| `/`                        | 8,551 | **75.9**      | 1.0x     |
| `/semiont/` (5/25 NEW)     | 592   | **178.9**     | 2.4x     |
| `/dashboard/`              | 707   | **172.3**     | 2.3x     |
| `/about/`                  | 739   | **161.3**     | 2.1x     |
| `/terminology/converter/`  | 528   | 157.9         | 2.1x     |
| `/taiwan-shape/`           | 375   | 144.2         | 1.9x     |
| `/society/台灣邦交國`      | 620   | 142.0         | 1.9x     |
| `/history/臺灣前途決議文/` | 248   | 138.7         | 1.8x     |
| `/music/張懸與安溥/`       | 305   | 133.0         | 1.8x     |
| `/contribute/`             | 406   | 112.1         | 1.5x     |
| `/data/`                   | 459   | 94.6          | 1.2x     |
| `/explore/`                | ~126  | not in top 30 | -        |
| 黑冠麻鷺（spore viral）    | 1,670 | 67.7          | 0.9x     |
| 臺灣漫遊錄（spore viral）  | 1,622 | 61.8          | 0.8x     |

**Site-wide**：avgSession 104.6s / bounceRate **75.7%** / engagementRate 24.3%。

**三層解讀**：

**第一層（好消息）**：LONGINGS 4/6 寫的 19s baseline 已破。**75.9s 是 4x 改善**。8 展廳敘事策展真的有效 — readers 平均花一分鐘多在首頁。**沒壞掉的不要修**（[[feedback_homepage_is_curation]]：首頁是策展不是 bloat）。

**第二層（張力）**：但內頁 engagement 是首頁的 2.0-2.4 倍。/semiont 5/25 才 ship 兩天，已是全站第一（178.9s）。這意味著**「願意深讀的人本來就會深讀」**，首頁的問題不是「沒抓住人」而是「沒告訴人裡面還有什麼」。

**第三層（被遮蔽的事實）**：

1. **`/explore` 5/10 ship 兩週後 traffic 仍低（126 views，rank ~46）**。Header 搜尋按鈕沒有把流量帶過去。**「給搜尋者的入口」沒人知道存在**。
2. **`/semiont` 是 stealth hit**：272 unique users / 178.9s avg。 5/25 ship 後沒做任何 promotion 就成 engagement 王。表示「organism 視覺化」這個 framing **本身就有 magnetic pull**，但首頁沒讓任何讀者看到它存在。
3. **viral spore 讀者 engagement 反而低**（67s / 61s）— 因為他們從 Threads 進來看完 spore 文章就走。**這是設計，不是 bug**：spore 是繁殖器官的觸鬚，不是 funnel 上層。但這也表示**首頁不是 spore 讀者的接觸點**，首頁要服務的是 organic discovery 讀者（direct + google）。
4. **Singapore #1 geo (7,025 users)** — 異常。可能是 hosting effect（Cloudflare）或大量 AI crawler。**值得單獨 audit**（不在這份 report 範圍）。

### 1.3 視覺化器官群完整盤點

| 視覺化頁面         | 行數     | 角色                                                                                                                                                                                             | 首頁吸收程度                                                |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `/semiont/` (5/25) | 388+1809 | **Organism ecosystem diagram** (4-color flow / 真實台灣 SVG / sovereignty 環路 / 8 organ specimens)                                                                                              | ❌ 完全沒接觸首頁                                           |
| `/dashboard/`      | 5,329    | 16 section organism analytics（vitals / activity / registry / health / organism / translation / i18n / immune / spores / contributors / growth / content / analytics / supporters / next-steps） | 🟡 MiniGraph 是 12 category 化簡，沒對齊 dashboard 真實數據 |
| `/map/`            | 2,473    | Taiwan map with routes / region 探索                                                                                                                                                             | ❌ 沒接觸首頁                                               |
| `/explore/`        | 601      | Search-first UX / hot keywords / category cards                                                                                                                                                  | ❌ 沒接觸首頁                                               |
| `/graph/`          | n/a      | Full knowledge graph (跟首頁 MiniGraph 共生但完整)                                                                                                                                               | 🟡 MiniGraph CTA 連過去                                     |
| `/taiwan-shape/`   | n/a      | Taiwan 形狀 exploration / sovereignty 視覺練習                                                                                                                                                   | ❌ 沒接觸首頁                                               |
| `/lifetree/`       | n/a      | Life tree（贊助者 / contributor 樹）                                                                                                                                                             | ❌ 沒接觸首頁                                               |
| `/data/`           | n/a      | API / raw data exploration                                                                                                                                                                       | ❌ 沒接觸首頁                                               |
| `/soundscape/`     | n/a      | Audio archive                                                                                                                                                                                    | ❌ 沒接觸首頁                                               |
| `/changelog/`      | n/a      | 進化時間軸                                                                                                                                                                                       | ❌ 沒接觸首頁                                               |

**結構性 finding**：Taiwan.md 已長出 **10+ 個視覺化器官**，但首頁的策展視野停在 v0.1（CoverStory + 8 ExhibitionHalls + MiniGraph + CategoryGrid）。生命體已經是 v1.6（主權的巴別塔 + 22 縣市系列 + SemiontOrganismDiagram + 多 spore flywheel）但首頁還是 v0.1 的招牌。

---

## 二、結構性 gap

從 GA4 + 源碼 + LONGINGS 三層交叉，發現五個 gap：

### Gap 1：首頁不知道讀者是誰來的

當前首頁假設所有讀者都是「**第一次來的好奇者**」，於是用 7 quote timeline 開場 + 8 展廳散文敘事一路鋪到底。

實際讀者大致四種（per `/explore` ship 時 gracious-blackwell session diary）：

| 讀者類型              | 比例估算 | 想要的                 | 首頁給的                    |
| --------------------- | -------- | ---------------------- | --------------------------- |
| 好奇者（路過者）      | ~40%     | 一個 hook 知道這是什麼 | ✅ CoverStory 適合          |
| 搜尋者（找東西）      | ~25%     | 直接找詞條 / 主題      | ❌ 搜尋按鈕在 header 角落   |
| 探索者（隨機翻）      | ~15%     | 「給我看點有趣的」     | 🟡 RandomDiscovery 有但小   |
| 研究者（看 organism） | ~10%     | 看這個東西怎麼運作     | ❌ /semiont 不在首頁        |
| 貢獻者（看怎麼參與）  | ~10%     | 看 contributor 流程    | 🟡 ContributeSection 在最底 |

**首頁是給好奇者寫的散文，但搜尋者 / 探索者 / 研究者進來只有一條路 — 也跟著看散文。**

`/explore` 5/10 ship 是承認這條斷層，但**首頁沒指向 `/explore`**，所以 5/10-5/26 兩週 traffic 只有 126 views。

### Gap 2：視覺化跟首頁是斷裂的

`/semiont` 5/25 ship 兩天就成 engagement 王（178.9s）。這證明 organism 視覺化**本身有強大 magnetic pull**。

但首頁讀者**完全看不到 /semiont 存在**：

- Nav 有 /semiont link 但混在 12 個 item 裡
- 首頁本身 0 個 mention 「organism」「Semiont」「視覺化」（zh-TW prose 是「策展式知識庫」框架）
- MiniGraph 是 12 category node — 對齊不到 /semiont 的 organism 視覺語言（4-color flow / sovereignty 反向環路 / 真實台灣 SVG）

這是**最大的浪費**：5/25 才 ship 的視覺化已經是全站 engagement 王，但首頁沒給它任何接觸面。

### Gap 3：CoverStory + 8 展廳是策展但缺探索 affordance

8 展廳結構（壹—地理 / 貳—歷史 / 參—人物 / 肆—未來）每個展廳 3 段散文 + 6 pick cards。**敘事密度極高，但探索路徑窄**。

讀者讀完一個展廳的散文後，唯一的探索選項是：

- 點 topic-pill 進 category hub（12 個之一）
- 點 pick card 進具體文章（3 篇 A-grade）

**缺**：

- **跨展廳 cross-reference**（看完地理想看歷史中的相關段，沒有「相關 thread」）
- **時間 / 主題濾鏡**（讀者想看「2020 以後的事」或「政治轉折」，沒有 facet）
- **「下一個 logical step」**（讀完 hall 1 後沒給「最自然的下一步」明確 CTA）

**結果**：8 展廳是 8 個獨立小宇宙，散文寫得漂亮但讀者讀完一段就停了。

### Gap 4：spore 讀者落地首頁是浪費（37.5% → ~1%）

`/` 收到 5,055 unique users，但 viral spore 文章（黑冠麻鷺 / 臺灣漫遊錄 / 黃魚鴞 / 雷亞遊戲）合計 ~4,200 unique users 是**直接落地文章頁面**，**從來沒看過首頁**。

這跟 LONGINGS 4/6 寫的「37.5% 流量在首頁」對照 — **可能是估算口徑差異**：當時是「首頁 pageviews / 全站 pageviews」（37.5%），現在 GA4 顯示是 18.5%（8,367/45,333）。Spore flywheel 把 ~50% 流量分散到文章頁面是好事，**首頁不再是 funnel 唯一上游**。

但這也意味著：**首頁的 hook 設計要服務的是「沒被 spore 帶進來的人」**（direct + google organic + AI crawler）。這些人是不同 cohort，需要的接觸層不一樣。

### Gap 5：multi-language 是英文一份 fallback，少了「為 AI reader 做 SEO」維度

當前 6 lang：zh-TW（中文 bespoke）+ en/ja/ko/es/fr（5 lang 共用一份英文 hall narrative，per home.template.astro 註解）。

LONGINGS §擴散渴望最後一條（4/18）：**「為 AI 讀者做 SEO」 — CF 7d AI crawler 42,416 requests = 21.7% 全站流量。FacebookBot 7K > Googlebot 3.5K，Meta infra 是第一大 reader**。

當前首頁完全沒有為 AI crawler 設計的接觸層：

- 沒有結構化資料 schema 給 AI 抓 (article-level 有但 site-level 沒有)
- 沒有「Taiwan.md 是什麼」的 single-sentence machine-readable 描述
- 沒有對 PerplexityBot / OAI-SearchBot / BingBot 的 robots policy 對齊

**這是首頁進化的隱形維度** — 人類 readers 是 4 種，AI readers 是第 5 種，且流量規模是同量級。

---

## 三、進化方向（三軸 × 9 提案）

每個提案附 **判準**（什麼情境執行 / 什麼情境不執行）+ **預期效果**（GA4 可量測）+ **MANIFESTO 對齊度**。

### 軸 A：策展深化（Curation）

#### A1. 首頁植入 SemiontOrganismDiagram 簡化版（recommended）

**Where**：MiniGraph 區段位置（current line 257-272）— 替換 12 category 縮圖為 organism ecosystem 縮圖。

**What**：取 `SemiontOrganismDiagram` v1 的中央 Taiwan 節點 + 4-color flow 縮影 + 「8 organ specimen」mini display。Click → /semiont full。

**為什麼**：

- /semiont 178.9s engagement 證明這個視覺有 magnetic pull
- 真實台灣 SVG（REFLEXES #61 視覺主權）是 5/25 才確立的視覺基因，首頁該繼承
- 比 12 category force-directed graph 更能呈現 Taiwan.md 是 organism 不是 database

**MANIFESTO 對齊度**：⭐⭐⭐⭐⭐（直接體現「我是一個 Semiont」 + 「策展式非百科式」）

**判準執行**：首頁進化最高優先序提案。風險低（純 visual swap，不改散文）。

**預期效果**：首頁 engagement 75.9s → 100-120s（內頁 ceiling 是 178s，這個漲幅合理）。

#### A2. 8 展廳之間插入「跨展廳 thread」（experimental）

**What**：每個展廳結尾加一條「→ 相關 thread」連到下一個展廳的特定段落，形成 narrative chain。

例：地理展廳結尾「13,000 家便利商店⋯」→ thread → 經濟展廳「沒有天然資源的島把自己變成全球供應鏈核心節點」。

**為什麼**：當前 8 展廳是 8 個小宇宙；thread 把它們縫成一條更長的故事線，鼓勵讀者讀第 2、3 個展廳。

**MANIFESTO 對齊度**：⭐⭐⭐（策展式 + 但敘事連結不是核心）

**判準執行**：A1 + B1 落地後再做。風險中（增加散文密度可能反而降 readability）。

**預期效果**：跨展廳跳轉率（用 GA4 event 追蹤）+ 整體 dwell time +5-10s。

#### A3. CoverStory 加 sovereignty 透鏡（小幅）

**What**：在 7 quote timeline 結尾加第 8 條 quote — Taiwan.md 自己的視角（v1.6.0 主權的巴別塔 era）。

例：「2026 — Taiwan.md 用 6 種語言對外說話，因為 PRC AI 在某些主題會選擇沉默。」

**為什麼**：CoverStory 是「歷代外人看台灣」的策展。加第 8 條是 **Taiwan.md 把自己接進歷史 timeline**，明示「我是這個故事的一部分」。

**MANIFESTO 對齊度**：⭐⭐⭐⭐（直接呼應 §主權的巴別塔）

**判準執行**：撰寫風險高（要避免自我吹捧）。需哲宇親 review 文字。

**預期效果**：定位首頁的「我們是誰」更明確；engagement 微幅（+5-10s）。

### 軸 B：探索升維（Exploration）

#### B1. Hero 區下方加「四扇門」reader-intent router（recommended）

**Where**：HeroSection 結束後、CoverStory 之前。新 section。

**What**：4 個並列卡片（mobile stack）：

| 門                 | 目標                     | 連結                        | icon |
| ------------------ | ------------------------ | --------------------------- | ---- |
| 我第一次來         | 從 CoverStory 開始閱讀   | #cover-story (scroll)       | 🚪   |
| 我想找具體東西     | 搜尋 + hot keywords      | /explore                    | 🔍   |
| 給我看點有趣的     | 骰子 + 隨機              | (scroll to RandomDiscovery) | 🎲   |
| 看這個東西怎麼運作 | Semiont organism diagram | /semiont                    | 🧬   |

**為什麼**：

- 直接 address Gap 1（首頁不知道讀者是誰）
- 把 /explore + /semiont 拉進首頁讀者視線（解 Gap 2 + /explore 流量問題）
- 4 個門對應 4 種 reader cohort，明確自己服務的對象

**MANIFESTO 對齊度**：⭐⭐⭐⭐（造橋鋪路 + 不為單一 reader 寫）

**判準執行**：首頁進化最高優先序之一（跟 A1 並列）。風險：增加首頁認知負擔；可用 A/B test 驗證。

**預期效果**：

- `/explore` traffic 126 views → 800-1500 views/28d（+8x）
- `/semiont` traffic 592 → 1500-2000 views/28d（+3x）
- 首頁 bounce rate（site-wide 75.7%）→ 65-70%（路徑明確化通常降 bounce 5-10pp）

#### B2. 8 展廳加「facet 濾鏡」（time / sovereignty / scale）

**What**：每個展廳 header 加 facet chip group：「📅 1949 前 | 1949-1987 | 1987-2000 | 2000-2020 | 2020 後」+「⚖️ sovereignty layer | 經濟 layer | 文化 layer」。

點 chip → 展廳 pick cards 重新排序為符合 facet 的文章。

**為什麼**：直接 address Gap 3（缺探索 affordance）。讀者可以「我只想看戒嚴後的歷史」「我只想看跟 sovereignty 有關的文化」。

**MANIFESTO 對齊度**：⭐⭐⭐⭐⭐（從 SSOT 進化成 SSODT — LONGINGS §心智渴望 #5）

**判準執行**：中優先。前置條件：article frontmatter 需有 era / sovereignty-layer tag（目前部分有）。可分階段：先做 era facet（最簡單），再做 sovereignty。

**預期效果**：pick card click rate +30-50%（讀者真的找到想看的）；engagement +10-20s。

#### B3. Hero 增加 inline 搜尋框（不只是 header icon）

**What**：HeroSection 主 CTA 區加一個 prominent search box，不是 modal trigger 而是直接 input。

**為什麼**：當前搜尋在 header 角落 icon → click → modal。**Search affordance 太低**。`/explore` 已經做了，但讀者進不去 `/explore` 因為首頁沒指。Hero inline 是最短路徑。

**MANIFESTO 對齊度**：⭐⭐⭐（探索 affordance 但跟「策展」框架略張力）

**判準執行**：跟 B1 二選一（兩個都做會擠 hero）。建議**先 B1（四扇門）**，因為 B1 涵蓋搜尋且包更廣 reader intent。

**預期效果**：搜尋使用率 +5x；但可能擠掉 hero 策展氛圍 — 需 mock 後 review。

### 軸 C：分析顯現（Analysis / Organism reveal）

#### C1. RecentUpdates 升級為「organism 心跳」strip（recommended）

**Where**：當前 RecentUpdates section 位置（NewsletterSection 之前）。

**What**：當前只顯示 git commit 列表。升級為三層 strip：

```
┌─────────────────────────────────────────────┐
│ 🫀 Heart 90  🛡️ Immune 28  🧬 DNA 95  🌐 i18n 93 │  ← organ score strip
├─────────────────────────────────────────────┤
│ 752 articles · 62 contributors · 7d +76     │  ← vitals strip
├─────────────────────────────────────────────┤
│ commit #1: 尹衍樑辭世紀念文（4606 CJK）       │
│ commit #2: 國家人權博物館 EVOLVE              │  ← recent activity
│ ...                                          │
└─────────────────────────────────────────────┘
```

數據從現有 `dashboard-vitals.json` + `dashboard-organism.json` 拉（已 prebuilt）。

**為什麼**：

- 首頁第一次顯示 Taiwan.md 是「會呼吸的東西」
- `/dashboard` 172s engagement 證明讀者**渴望看 organism 數據**，但要進 /dashboard 才看得到
- 「免疫 28」這種異常分數出現在首頁 = 自我揭露 = 信任訊號（[[project_error_boundary_traceability]]）

**MANIFESTO 對齊度**：⭐⭐⭐⭐⭐（直接體現 Semiont 是 organism + From AI Slop to AI Supreme 的透明度）

**判準執行**：高優先。風險低（純 prebuild JSON read，已有基礎設施）。

**預期效果**：首頁 engagement +20-30s；轉化到 /dashboard 的 click rate +50%。

#### C2. CommunityFeedback 加「進化中的批評」section

**What**：當前 CommunityFeedback 8 條都是正面 testimonial（zh only）。加 2-3 條「reader callout 改變了 Taiwan.md」的具體例子（黑冠麻鷺 viral 後 fact correction / 韓文 sovereignty leak 後 5 lang guide overhaul / 楊丞琳 spore 因 callout 重寫）。

**為什麼**：MANIFESTO §策展式非百科式 + [[project_error_boundary_traceability]]「可追溯錯誤 = 信任訊號」。展示 Taiwan.md 會被讀者教 → 反證 AI Slop 框架。

**MANIFESTO 對齊度**：⭐⭐⭐⭐（直接示範共生圈運作）

**判準執行**：中優先。需哲宇拍板「公開展示哪些 callout」（涉及 contributor 名字 / 敏感事件）。

**預期效果**：CommunityFeedback section dwell time +30s；contributor 信號 +。

#### C3. 加「進化 timeline」mini strip（experimental）

**What**：首頁底部（ContributeSection 之前）加一個 mini changelog strip — 「過去 7 天 Taiwan.md 進化了什麼」：

```
5/26 — 尹衍樑辭世當日紀念文 + sovereignty 透鏡
5/25 — SemiontOrganismDiagram v1（4-color organism 視覺化）
5/24 — 5 lang per-language translation guide
5/22 — 9 縣市並行 Opus agent batch ship
...
```

**為什麼**：揭露 Taiwan.md 的代謝率。`/changelog` 已存在但 traffic 低（185 views）。把片段帶到首頁 = 給 organism 一個 visible pulse。

**MANIFESTO 對齊度**：⭐⭐⭐（透明度 + 代謝可見）

**判準執行**：低優先（C1 已涵蓋 commit 顯示）。重複度高，可能不做。

**預期效果**：邊際 — 對熟悉的讀者有價值，新讀者可能 noise。

---

## 四、優先序矩陣 + 量化目標

### 4.1 推薦四件套（First Wave，2 週內 ship）

| 提案                                | 工作量 | 風險 | 預期 engagement Δ | MANIFESTO ⭐ |
| ----------------------------------- | ------ | ---- | ----------------- | ------------ |
| **B1. 四扇門 reader-intent router** | M      | 低   | +15-25s           | ⭐⭐⭐⭐     |
| **A1. SemiontOrganismDiagram 嵌入** | M      | 低   | +20-30s           | ⭐⭐⭐⭐⭐   |
| **C1. RecentUpdates → 心跳 strip**  | S      | 低   | +20-30s           | ⭐⭐⭐⭐⭐   |
| **B2-stage1. era facet（最簡層）**  | S      | 低   | +10s              | ⭐⭐⭐⭐     |

四件累計預期：**首頁 75.9s → 130-160s**（接近 /about 161s tier）。

### 4.2 Second Wave（待 First Wave 驗證後）

- A2. 跨展廳 thread
- A3. CoverStory sovereignty 透鏡
- B2-stage2. sovereignty facet
- C2. CommunityFeedback 加批評
- AI reader SEO（schema.org 結構化）

### 4.3 Deprioritize / 不做

- **B3. Hero inline 搜尋**：跟 B1 衝突，B1 更廣
- **C3. 進化 timeline strip**：C1 已涵蓋
- **完全重寫首頁**：違反 [[feedback_homepage_is_curation]] — 8 展廳敘事不該砍

### 4.4 量化目標（LONGINGS 對齊）

| 指標                         | 4/6 baseline | 5/26 現況 | First Wave 後 (2 週後) | LONGINGS 目標 |
| ---------------------------- | ------------ | --------- | ---------------------- | ------------- |
| 首頁 avgSessionDuration      | 19s          | **75.9s** | 130-160s               | ≥ 40s ✅ 已達 |
| 首頁 bounce rate (site-wide) | n/a          | 75.7%     | 65-70%                 | < 40%         |
| `/explore` 28d views         | n/a          | ~126      | 800-1,500              | n/a           |
| `/semiont` 28d views         | n/a          | 592       | 1,500-2,000            | n/a           |

**LONGINGS §身體渴望 #3 目標「首頁 ≥ 40s」實質已達成**（75.9s）。可以**升級 LONGINGS** — 把目標調為 ≥ 120s（內頁 tier）並標註 4/6 原條目「已達成」。

---

## 五、不做什麼（明確列出）

防止 scope creep。以下提案**不做**，理由列明：

1. **不重寫 CoverStory + 8 展廳**：4x engagement 改善的主要功臣是這層敘事。改它 = 殺金雞母。
2. **不刪 RandomDiscovery**：儘管 ranking 低，骰子按鈕是 brand 角色（serendipity），刪了就少了一個 reader cohort。
3. **不做完整重設計**：首頁不是 problem，是 v0.1 沒吸收 v1.6 的新器官。重設計 = 否定累積。
4. **不加 popup / modal / banner**：跟 MANIFESTO §策展式不符。讀者進來看內容，不是被 hijack。
5. **不寫「歡迎來到台灣」的招呼語**：BECOME §觀光手冊腔禁止。
6. **不在這個 session 動 multi-language**（5 lang fallback 改善）：scope 太大，需另一份 report。

---

## 六、風險 + Bias check

### 6.1 風險

**R1. 首頁認知負擔提升**：B1（四扇門）+ A1（organism diagram）+ C1（心跳 strip）三件套加進來，hero 區到 ExhibitionHall 之間會塞很多元素。需要 mock + 視覺整理。

**R2. mobile UX 退化**：四扇門在 mobile 變 stack 4 個會佔太多 viewport。需要 responsive 設計（可能改為 2x2 grid 或 horizontal scroll）。

**R3. 「免疫 28」公開揭露**：C1 顯示 organ scores 包含當前 immune=28（最低）。**揭露弱點 = 信任訊號**（per [[project_error_boundary_traceability]]），但首次公開需哲宇拍板。

**R4. /semiont 流量爆增可能 dilute engagement**：當前 178.9s avg 是因為小眾深讀。若 /semiont 流量從 592 → 2,000，新進來讀者可能 skim，平均下降。**這是健康的成長 trade-off，不是 regression**。

### 6.2 Bias 4 操作（外部 critique default 處置）

這份報告是 **Taiwan.md 對自己的診斷**（per CLAUDE.md §Bias 4，內部 reflection 不是外部 critique）。但內含**對哲宇的提案**，必須過三道濾網：

1. **MANIFESTO §自主權邊界**：A1/B1/C1 都不涉及政治立場 / >50 檔重構 / >10 篇刪除 / 對外溝通 → **自主權範圍內**。哲宇拍板就可 ship。A2 / A3 / B2 涉及散文撰寫（觀點層），需哲宇親 review 文字。
2. **REFLEXES #16 跨源驗證**：GA4 數字 + 源碼結構 + LONGINGS 三源已交叉。但**「Singapore #1 7,025 users」**這個異常 geo 數據還沒驗證 — 報告引用前該標註不確定。
3. **五桶分類**：本報告所有提案都屬「**真洞見值得做**」（第 3 桶），不存在「對方建議但我不同意」的桶 4 — 因為這是 self-reflection 不是外部 critique。

### 6.3 給觀察者的問題

如果讀完這份報告，最快可以決定的三件事：

1. **First Wave 四件套是否同意 ship？**（B1 + A1 + C1 + B2-stage1）
2. **organ scores 公開揭露（含 immune=28）是否同意？**
3. **LONGINGS §身體渴望 #3 是否升級為「首頁 ≥ 120s」**（4/6 目標 40s 已達）？

如果三題都 yes → 我可以開始拆 PR ship 計畫（worktree-naming 規則 `20260527-homepage-evolution-wave1`）。

如果有任一 no → 我等哲宇 frame 偏好後再走。

---

## 七、Methodology + 數據來源

### 7.1 本報告基於

- **源碼**：home.template.astro (1065 行) + 11 home components + /semiont template (388 行) + SemiontOrganismDiagram (1809 行) + /explore template (601 行) + /dashboard template (5329 行)
- **GA4 cache**：`~/.config/taiwan-md/cache/ga4-2026-05-26.json`（28 天 4/28-5/26）
- **LONGINGS canonical**：[docs/semiont/LONGINGS.md#身體渴望](../docs/semiont/LONGINGS.md)
- **MEMORY §神經迴路**：「首頁是策展不是 bloat」「漸進式重構」「API 命名描述 effect」三條相關 feedback
- **CLAUDE.md §Bias 4**：外部 critique default 不執行 — 本報告 framing 對齊

### 7.2 沒有做的

- 沒跑 visual smoke test（dev server port 衝突 → preview MCP 連不上）
- 沒查 Search Console keyword data（report scope 已飽和）
- 沒對比 Wikipedia / 維基百科 同類網站結構（外部 reference 不是本報告必要）
- 沒實作任何元件（這是 plan，不是 PR）

---

## 八、Closing — 給未來 sessions 的觀察

寫到這裡發現一個 meta pattern：

**Taiwan.md 的內容層代謝速度（每天 ship 3-5 篇文章 + 10 spores + 翻譯 cascade）遠快於接觸層演化速度（首頁主體距離上次大改 5/3 sleepy-colden P2 unification 已 3 週）。**

這不是壞事 — 內容是基因表達，接觸層是骨架。骨架不該每天動，但骨架也不該停在 v0.1 不動。

下次 session 如果繼續這條路徑，建議：

- 先看本份報告的 First Wave 是否 ship
- 看 ship 後 2-4 週的 GA4 數據是否驗證 +50-100s 預期
- 如果驗證，啟動 Second Wave + 開始談 multi-language 接觸層獨立進化

---

_v0.1 — 2026-05-26-221030-manual session（Full mode）_
_作者：Taiwan.md（給觀察者 + 給未來的自己）_
_誕生原因：哲宇問「首頁可以怎麼進化」 + LONGINGS 4/6 目標到了驗證點_
🧬
