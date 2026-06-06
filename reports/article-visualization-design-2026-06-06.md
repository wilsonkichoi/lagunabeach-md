# 文章視覺化系統設計報告 — 參考 The Pudding，長出 Taiwan.md 自己的視覺化器官

> type: design | 2026-06-06 | session 國宅居住正義 → 視覺化系統
> 觸發：哲宇「graph.md 編輯指南 + REWRITE-PIPELINE 視覺化思考環節 + 深度研究 pudding.cool」
> 研究底稿（SSOT，本報告所有判斷的來源）：
>
> - [viz-pudding-raw.md](research/2026-06/viz-pudding-raw.md)（The Pudding 深掘，21 搜尋 + 18 一手抓取）
> - [viz-taxonomy-raw.md](research/2026-06/viz-taxonomy-raw.md)（圖型分類學 + 最佳實務，20 搜尋）
> - [viz-technical-raw.md](research/2026-06/viz-technical-raw.md)（靜態/CSS/AI 爬蟲技術，22 搜尋 + 9 一手）
> - 已建 v1：[src/styles/article-modules.css](../src/styles/article-modules.css) + [article.template.astro](../src/templates/article.template.astro) `renderer.code`

---

## 0. TL;DR — 一頁讀懂

**核心主張（thesis）**：The Pudding 是**參考案例**，不是要照抄的對象。我們**借鏡它的編輯哲學**（問題先於資料／結論要明確／讀者是偵探／annotation 是主角），但**不照搬它的技術棧**（D3 / Svelte / Canvas / OAuth 互動），而是從 Taiwan.md 自己的約束**長出最適合自己的視覺化器官**。因為 Taiwan.md 的三個約束——靜態 `.md` SSOT、六語、以及最關鍵的 **AI-SEO／主權使命**——讓「比較樸素」的靜態技術路反而**比 Pudding 的互動路更適合我們**：

> **讓 LLM 讀得懂的視覺化，就是主權的視覺化。** 同一個性質（文字進 DOM）讓圖表「無障礙」「可被 Google 索引」「可被 GPTBot/PerplexityBot/ClaudeBot 提取」「可被翻譯 pipeline 處理」——這四件事是同一件事，而它正是 Taiwan.md 存在的理由（[MANIFESTO §主權的巴別塔](../docs/semiont/MANIFESTO.md)）。D3/Canvas viz 對 AI 爬蟲是黑洞；inline-SVG/HTML-table viz 是 LLM 的食物。

**五個拍板決策**：

1. **技術走分層靜態路**，不走互動框架：CSS module class（已建 v1 4 個）→ Charts.css/inline-SVG 真圖表（含 HTML table fallback）→ CSS scroll-driven scrollytelling-lite（showcase）。全程零重 JS、零 MDX、build-time 生成。叫用方式統一是 ` ```tw-* ` fenced 語法糖（marked code renderer，已驗證可行）。
2. **新增 `docs/editorial/graph.md`** 當視覺化編輯指南 canonical：型錄（11 類圖型何時用）+ 怎麼做才好 + 語法 + 視覺化檢查清單。所有寫文/翻譯 pipeline pointer 到它。
3. **REWRITE-PIPELINE 加一個「視覺化思考」環節**（Stage 2 寫作前）：問「這篇有哪些資料/對比/時序/比例，適合從文字升級成視覺化？」+ 一圖一重點原則 + viz 指標。
4. **新增 viz 品質閘門**：`article-health.py --check=viz-health`（來源標註在不在、誠實座標軸、table fallback、alt、AI 可讀）+ 視覺化發布前 7 層 checklist。
5. **多語架構三層分離**：圖形幾何（座標/比例/顏色）跟資料一起放 fenced block 文字列 → 翻譯 pipeline 天然能處理（語法已這樣設計）；情境文字（標題/annotation）留 `.md` 可翻層；月份/數字格式走 i18n。babel 不碰幾何。

**現況**：v1 的 4 個模組（數據大字 / 對比卡 / 比例條 / 政策軸）已建好、已在《國宅與居住正義》dogfood、light/dark/RWD/AI-readable 全過、format gate 全綠。本報告定義怎麼把它長成完整的「視覺敘事」能力。

---

## 1. 為什麼視覺化 — 跟 Taiwan.md 使命的扣連

不是「文章配圖好看」。視覺化對 Taiwan.md 是**四條使命線的交會點**：

| 使命                                | 視覺化怎麼服務它                                                                                                                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **逆熵獸**（吞混亂 → 結構化知識）   | 一張好圖把一段密集數字 prose 壓縮成一眼可讀的結構。國宅文的 6.7萬→87萬 大字、房價所得比比例條，就是把「數字堆疊」逆熵成「視覺結構」。                                                                        |
| **策展式非百科**（有觀點）          | 敘事型視覺化的靈魂是 **annotation layer**——直接在圖上寫「為什麼重要」。這正是「策展」在視覺層的落地：維基給你中性圖表，我們給你帶觀點的標註。                                                                |
| **正確性 / 可信度**（§事實鐵三角）  | 誠實座標軸（長條 Y 軸從 0）、來源標註、取樣偏誤揭露、不確定性視覺化——台灣數位媒體普遍不及格，是 Taiwan.md 可建立明顯差異化的地方。                                                                           |
| **主權的巴別塔 / AI-SEO**（最關鍵） | 見上方 thesis。圖表用 semantic HTML/SVG + table fallback = LLM 能在六種語言裡讀到、引用台灣的第一人稱數據。圖片型/Canvas viz 做不到。**這條把「視覺化」從 nice-to-have 升級成 sovereignty infrastructure。** |

加上哲宇的第五條：**「好的視覺化感受」**——讀者讀完一篇文章，記得的常常是那一張讓他「啊，原來如此」的圖，不是第七段的句子。

---

## 2. The Pudding 深度 study（參考案例）— 借鏡什麼、不照搬什麼

The Pudding（pudding.cool，2017-，Peabody 得獎，791K visits/月）自述「explains ideas debated in culture with visual essays」。它紅的原因不是技術炫，是**編輯哲學 + 無截稿壓力 + 每個人從研究到 code 全包**。

### 2.1 四種視覺敘事形態

| 形態                           | 機制                                   | 招牌作                                                                                                                                                 | Taiwan.md 可行性                                                     |
| ------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| **A. Scrollytelling**          | 圖固定（sticky），文字滑過觸發狀態轉換 | [Making It Big](https://pudding.cool/2017/01/making-it-big/)（7000 dots V 形）/ [Film Dialogue by Gender](https://pudding.cool/2017/03/film-dialogue/) | 🟡 **輕量版可做**（CSS sticky + scroll-driven）。showcase 用，非預設 |
| **B. Interactive Explorer**    | 讀者篩選/輸入/玩                       | [Judge My Spotify](https://pudding.cool/2021/10/judge-my-music/) / [Hip Hop Vocabulary](https://pudding.cool/2017/02/vocabulary/) beeswarm             | 🔴 **不採用**（OAuth/大型篩選需後端+重 JS，破壞 AI 可讀性）          |
| **C. Annotated Static Charts** | 靜態圖 + 直接標註，詞少資料密          | [Birthday Effect](https://pudding.cool/2025/04/birthday-effect/)（annotation 是主角）                                                                  | 🟢 **核心借鏡**。SEO/AI/多語最友好，是 Taiwan.md 主力模板            |
| **D. Conceptual Metaphor**     | 把資料變成可感受的形狀/空間            | [Abortion Mazes](https://pudding.cool/2024/10/abortion-mazes/)（迷宮=政策複雜度）                                                                      | 🟡 **偶一為之**（SVG 版低成本；專題級高成本）                        |

### 2.2 十條編輯原則（真正的寶藏，零 JS、寫作即可用）

從一手訪談萃取，這十條**不需要任何技術**，今天就能進 EDITORIAL：

1. **資料要給結論**（Blinderman：「water is wet 不算 finding」）— 不是探索，是回答問題。
2. **中心問題先於資料**（Goldenberg：「dataset 不存在，但 data 在外面」）。
3. **Sledgehammer stat**：簡單故事開門見山給最強數字，不藏招。
4. **Character as engine**：複雜主題用「一個人物的旅程」帶路（國宅文的老里長石忠勝就是）。
5. **形狀從資料長出來**：V 形/倒 V/迷宮——先問「這主題的資料是什麼形狀」，不是先選圖型。
6. **漸進揭露**：每個 step 是新維度，不是同維度重複。
7. **Static before interactive**：先用靜態設計確認訊息，再 code。
8. **Story > aesthetics**：「美但說不出重點 = 沒用」。
9. **Transparency as trust**：方法論公開（這跟 Taiwan.md 的 research report SSOT + footnote 同源）。
10. **Accessibility built-in**：`prefers-reduced-motion`、animation toggle、ARIA——「最愉悅的體驗也是最包容的」。

### 2.3 對 Taiwan.md 的結論

> **The Pudding 最可學的不是互動技術，是「靜態也能很好」**——Birthday Effect 幾乎全靠 annotated 靜態圖傳達一整套統計推論。而「靜態 + 標註 + semantic HTML」正好是 Taiwan.md 在 AI-SEO/多語約束下的最優解。我們跟 Pudding 走相反的技術路（它重互動、我們重靜態），卻能達到它 80% 的敘事效果 + 它做不到的 AI 可讀性。

scrollytelling 的 80% 效果，Pudding 自己也承認是 `position: sticky` 兩行 CSS 做的，JS（Scrollama）只負責偵測「哪段進視窗」。這條輕量路 Taiwan.md 完全能走。

---

## 3. 視覺化類型分類學（graph.md 的核心型錄）

**決策框架**：選圖從「**這個問題要用什麼資料關係回答**」出發，不從「哪張好看」。骨架用 FT Visual Vocabulary 九大類 + 補兩類（big number / 質性）。

| #   | 類別（資料關係）                | 主要圖型                                                | Taiwan.md 常見場景           | v1/演進                                        |
| --- | ------------------------------- | ------------------------------------------------------- | ---------------------------- | ---------------------------------------------- |
| 1   | **比較** comparison             | 長條 / dot plot / **slope（兩點 before-after）** / 子彈 | 縣市比較、兩制度、前後對照   | `tw-versus`（質性對比）✅ / slope 待建         |
| 2   | **排名** ranking                | 排序橫條 / bump / 排序表                                | 各國指標排名、歷年順位       | 待建                                           |
| 3   | **部分對全體** part-to-whole    | 圓餅(≤5類) / 堆疊條 / 100%堆疊 / treemap / **waffle**   | 預算組成、族群比例、語言覆蓋 | 待建（waffle 最 Taiwan.md）                    |
| 4   | **分布** distribution           | 直方 / box / **beeswarm/strip** / dot matrix            | 所得分布、年齡結構           | 待建                                           |
| 5   | **相關** correlation            | 散佈 / 泡泡 / heatmap                                   | 房價 vs 所得、雙變數         | heatmap CSS 可做                               |
| 6   | **趨勢/時間** trend             | **折線** / 面積 / 堆疊面積                              | 歷年數據、政策演變           | `tw-bars`（離散）✅ / 折線 SVG 待建            |
| 7   | **流向** flow                   | Sankey / alluvial / **漏斗**                            | 預算流向、人口遷移、立場轉移 | 高成本，後期                                   |
| 8   | **地理** geospatial             | choropleth(需標準化) / dot / 比例符號                   | 縣市分布、選舉               | 高成本，後期（用 repo SVG SSOT，REFLEXES #61） |
| 9   | **階層/網絡** hierarchy/network | tree / dendrogram / network                             | 組織、引用、關係             | 高成本，少用                                   |
| 10  | **單一關鍵數字** big number     | big number card（必帶脈絡）                             | 「6.7萬→87萬」「£194bn」     | `tw-figure` ✅                                 |
| 11  | **質性/標註** qualitative       | **pull quote** / annotated timeline / ~~word cloud~~    | 引語、政策時間軸             | `tw-timeline` ✅ / pull-quote 待建             |

**禁區**（graph.md 要明寫）：word cloud（看似直覺、分析力極弱）、3D 圖、雙 Y 軸、截斷 Y 軸的長條、圓餅超過 5 類、未標準化的 choropleth。

> v1 已覆蓋 4 個高頻場景（big number / 質性對比 / 離散比例 / 時間軸）。演進優先序看 §6。

---

## 4. 設計原則 — 怎麼做才好（graph.md §怎麼做）

從 Storytelling with Data / Datawrapper / Tufte / Cairo / ProPublica / WCAG 萃取，每條都有好壞對照：

- **標題說重點不說標籤**：「健保費用 10 年漲 43%，但佔薪資比例反降」＞「健保費用趨勢」。讀者只讀標題要能帶走 takeaway。
- **直接標籤 ＞ 圖例**：折線終點直接標名，不要右下角圖例讓眼睛跳。
- **色彩三鐵律**：語意色（紅=危險綠=好，但 8% 男性紅綠色盲）→ 用 Okabe-Ito 色盲友善盤 + **顏色不可是唯一編碼**（配形狀/文字）→ 對比 WCAG（圖形 3:1、文字 4.5:1）。v1 已用暖橘/冷青雙色 + 文字標籤雙編碼。
- **排序**：幾乎都該排序（大→小），除非固定類別（月份/年齡）。
- **誠實座標軸**：長條 Y 軸**必從 0**（Correll CHI 2020：即使告知截斷，讀者仍系統性高估差異）；折線可不從 0 但要說明。
- **data-ink ratio**：刪掉 3D、陰影、多餘格線、重複圖例（Tufte）。
- **行動裝置**：手機一螢幕最多 3-5 點，一螢幕回答一個問題，圖例放上方，標籤 ≥14px。
- **敘事型（Taiwan.md 全用）的五層**：作者選好 takeaway / 一圖一重點 / **annotation 是第一公民** / 漸進揭露 / 文字與圖協作（不是裝飾）。
- **無障礙 + 可信度**：alt 公式「[圖型] of [主題] where [洞察]」/ 複雜圖附 data table / **每張圖標來源**（格式「資料來源：機構，年份」）/ 取樣偏誤揭露 / N<30 警示、N<10 不畫趨勢線 / 不確定性用陰影帶或誤差棒。

---

## 5. 技術架構 — Taiwan.md 怎麼實作

### 5.1 約束（決定一切）

`marked.parse() → set:html .prose`（無 sanitizer，raw HTML class 通過，392 個 video-embed 為證）/ 純 `.md` SSOT / 六語從中文翻 / 重 SEO + **AI 爬蟲（不跑 JS）** / 不背重 JS 框架。

### 5.2 分層策略（從輕到重，預設用輕的）

| Tier                      | 技術                                                                                                                | 用途                                               | AI 可讀                    | 狀態             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | -------------------------- | ---------------- |
| **0 編輯模組**            | CSS module class（讀 tokens.css）via `tw-*` fenced renderer                                                         | 數據大字/對比/比例條/時間軸/引語等「編輯視覺單元」 | ✅ semantic HTML           | **v1 已建 4 個** |
| **1 真圖表**              | Charts.css（5.9KB、HTML table 底層）或 build-time inline SVG，**都附 `<table>` fallback**                           | 折線/長條/堆疊/heatmap/waffle 等標準圖型           | ✅ table + `<text>` 可索引 | 待建（v2）       |
| **2 Scrollytelling-lite** | CSS `animation-timeline: view()`（82.96% 支援）+ IntersectionObserver（Firefox fallback），`position:sticky` 扛固定 | 1-2 篇 showcase 專題的漸進揭露                     | ✅ 無 JS baseline          | 後期（v3）       |
| **✗ 不做**                | MDX / D3 / Canvas / 圖片型圖表 / Datawrapper 當六語 SSOT                                                            | —                                                  | ❌ AI 黑洞或多語重製       | 排除             |

**統一叫用語法 = ` ```tw-* ` fenced block**（已驗證）。marked code renderer 攔 `tw-` 開頭 lang，build-time 轉 semantic HTML。好處：作者寫乾淨 markdown 不寫 raw HTML、零 runtime JS、可包 table fallback、plugin 集中維護。

### 5.3 多語三層分離（已內建在語法）

```
viz 文字
├── 幾何（座標/比例/顏色）→ 跟資料一起在 fenced block 的數字欄 → 語言無關
├── 情境文字（標籤/標題/annotation）→ fenced block 的文字欄，是 .md 一部分 → babel 天然翻
└── 格式（月份/千分位）→ i18n library 自動化
```

v1 的 ` ```tw-bars 全國 2014 | 8.41 倍 ` 正是這個結構——數字是幾何、「全國 2014」「倍」是可翻文字、同一行。babel 翻譯時碰到的是文字列，幾何不動。**這是 Taiwan.md 相對 Datawrapper（六語要 duplicate 6 份）的結構性優勢。**

### 5.4 AI 爬蟲可讀性（sovereignty 落地）

每個 Tier 1 圖表**強制**：(1) 數據在初始 HTML（非 JS 渲染）(2) 附 `<table>` fallback 讓 GPTBot/PerplexityBot/ClaudeBot 提取原始數據（2025 研究：結構化內容 AI 引用率 2.5×）(3) `<figcaption>` 寫**完整文字詮釋**而非「如上圖」(4) 關鍵數值也寫進 prose。**「如上圖所示」對 AI 爬蟲毫無意義——它看不到圖。**

---

## 6. v1 已建 + 演進路線

### v1（已建、已 dogfood、ship-ready）

`tw-figure` 數據大字 / `tw-versus` 對比卡 / `tw-bars` 比例條 / `tw-timeline` 政策軸。覆蓋 §3 型錄的 #10 / #1質性 / #6離散 / #11。tokens 驅動 → dark/RWD/字體自動。

### v2 候選（補型錄缺口，優先序）

1. **`tw-source` 來源標籤**（質性）— 小成本、高使命價值（可信度），最先做。
2. **`tw-quote` 引語卡**（質性 #11）— pull quote，人物/社會文常用。
3. **`tw-line` 折線圖**（趨勢 #6）— build-time inline SVG + table fallback。最高需求（歷年數據）。
4. **`tw-stack` / `tw-waffle` 部分對全體**（#3）— 預算組成、比例。waffle 對「1 格=1%」直覺好。
5. **`tw-rank` 排序條/dot**（排名 #2）— 各國/縣市排名。
6. **`tw-small-multiples`**（CSS grid 多小圖）— 多語/多年/多縣市一眼比較。
7. **`tw-annotate` 標註圖**（Pudding 形態 C 的核心）— 圖上直接標「為什麼重要」。

### v3（showcase 級）

scrollytelling-lite（CSS scroll-driven）做 1-2 篇旗艦專題的漸進揭露；conceptual metaphor（SVG）偶一為之。

---

## 7. `docs/editorial/graph.md` 設計（編輯指南 canonical）

**位置**：`docs/editorial/graph.md`，跟 EDITORIAL/RESEARCH/CITATION-GUIDE 並列，是視覺化的 DNA 層 SSOT。

**結構**（建議章節）：

1. **§為什麼視覺化**（本報告 §1 濃縮：四使命 + sovereignty 扣連）
2. **§型錄**（本報告 §3：11 類圖型何時用/何時不用 + 禁區）
3. **§怎麼做才好**（本報告 §4：標題/標籤/色彩/排序/座標軸/行動/敘事五層/無障礙可信度，每條好壞對照）
4. **§語法**（每個 `tw-*` 模組的 fenced 語法 + 範例 + 渲染結果 + 何時用哪個）
5. **§多語**（三層分離規則）
6. **§AI 可讀性**（table fallback / figcaption 詮釋 / 不寫「如上圖」）
7. **§視覺化檢查清單**（本報告 §9 的 7 層 checklist）
8. **§反例 gallery**（截斷 Y 軸長條、word cloud、彩虹色、雙 Y 軸——實際反例對照，像 EDITORIAL 的禁句）

**被誰引用**：REWRITE-PIPELINE（Stage 0.6 + Stage 2 + Stage 4）、SPORE-PIPELINE（孢子配圖）、DIARY/MEMORY（不需要）、EVOLVE-PIPELINE。CLAUDE.md §Bias 3 編輯表加一列「走視覺化 → 必讀 graph.md」。

---

## 8. REWRITE-PIPELINE 整合 — 視覺化思考環節 + 指標

### 8.1 新增「視覺化思考」step（Stage 2 寫作前，或 Stage 0.6 觀點成型內）

借 Pudding「問題先於資料」，加一個強制自問（不是強制加圖——**沒有適合的資料就不加**）：

> **Step 2.x 視覺化思考**：掃過 fact-pack，問三題——
>
> 1. 這篇有哪些「**資料關係**」（比較/排名/比例/分布/趨勢/流向/單一大數字/質性對比）密集到讓 prose 變數字堆疊？
> 2. 每個密集點，§3 型錄哪個圖型最適合回答它？（一圖一重點：一個關係一張圖）
> 3. 這張圖的 **annotation** 要寫什麼「為什麼重要」？（不是裝飾，是策展觀點）
>
> 產出：在 research report §觀點成型 或 fact-pack 標出「視覺化候選清單」（哪段 → 哪個 `tw-*` 模組 → 想講的重點）。Writer agent 吃這份清單。

對應 Pudding 原則：問題先於資料、一圖一重點、annotation 第一公民、形狀從資料長出來。

### 8.2 指標（instrument，不是 aspirational）

| 指標           | 定義                                                | 健康帶                                     | 工具                                  |
| -------------- | --------------------------------------------------- | ------------------------------------------ | ------------------------------------- |
| **viz 密度**   | (圖表+模組) / 1k CJK                                | 跟 media band 共管，避免 atomization       | `paragraph-rhythm`（擴充計入 `tw-*`） |
| **viz 必要性** | depth 文（≥4500 字）至少評估過 1 個視覺化候選       | ≥1 候選被考慮（可記「評估後不加 + 理由」） | viz-thinking step 落 research report  |
| **來源標註率** | 每個資料 viz 有來源                                 | 100%                                       | `viz-health` plugin                   |
| **AI 可讀率**  | 每個 Tier 1 圖表有 table fallback + figcaption 詮釋 | 100%                                       | `viz-health` plugin                   |

**反 Goodhart 護欄**：viz 不是越多越好（avoid chartjunk）。指標是「有沒有**評估過**」+「加的有沒有**合規**」，不是「加幾個」。沒有適合資料就誠實不加，記 research report。

---

## 9. 視覺化檢查（visual-check）— 怎麼驗

兩條腿：**自動 plugin gate** + **人工 preview 截圖**。

### 9.1 自動：`article-health.py --check=viz-health`（新 plugin）

- 每個 `tw-*` 資料模組有沒有來源欄？
- 長條/比例條有沒有疑似截斷（值域不含 0 的警示）？
- Tier 1 圖表有沒有 `<table>` fallback + 非空 `<figcaption>`？
- 有沒有「如上圖/如下圖」這種 AI 爬蟲讀不到的指示語？（grep WARN）
- 進 `rewrite-stage-4` profile。

### 9.2 人工：7 層發布前 checklist（進 graph.md §檢查 + Stage 4）

資料正確性（Y 軸從 0、百分比加總、取樣偏誤）/ 圖型選擇（最佳圖型？更簡單方式？）/ 標題與文字（標題說 takeaway？來源在？）/ 視覺設計（chartjunk？對比？色盲？直接標籤？排序？）/ 無障礙（alt 公式？table？200% 縮放？）/ 行動裝置（手機讀得懂？）/ 整體敘事（一圖一事？文圖協作？只看圖+標題能帶走 takeaway？）

### 9.3 接上現有 preview workflow

Stage 4 媒體插入後，跑 `preview_start` + scroll 到每個 viz 模組截圖 light + dark（就像這個 session 驗 v1 那樣），人工看「視覺化感受」。截圖存 reports 當 dogfood 證據。

---

## 10. Roadmap（分階段，每階段可獨立 ship）

**Phase 1（現在可做）**：寫 `graph.md`（本報告 §3-§9 落地）+ v1 4 模組 commit + canonical 化 + REWRITE-PIPELINE 加視覺化思考 step + CLAUDE.md §Bias 3 加一列。**不寫新 code**，純文件 + 既有 v1。

**Phase 2**：建 `viz-health` plugin（進 rewrite-stage-4）+ v2 前三模組（`tw-source` / `tw-quote` / `tw-line` SVG）+ 各帶 table fallback。一篇 depth 文 dogfood。

**Phase 3**：v2 其餘（waffle/rank/small-multiples/annotate）+ scrollytelling-lite showcase 一篇旗艦專題（如《國宅》升級成捲動版，或新寫一篇）。

**度量成功**：不是「做了幾個模組」，是「Taiwan.md 文章被 LLM 引用時，數據被正確提取的比例上升」+「讀者停留/回訪」+「哲宇覺得『有好的視覺化感受』」。

---

## 11. 一句話收束

The Pudding 證明了視覺敘事能讓「想法更易被接近」（visual storytelling makes ideas more accessible）。Taiwan.md 的版本多一層：**讓想法更易被接近的同一個動作，也讓想法更易被 AI 在六種語言裡讀到、引用、傳下去**——這就是把 The Pudding 的工藝，接到主權的巴別塔上。我們不做最炫的互動，我們做最讀得懂的視覺化，而「讀得懂」包含人、螢幕閱讀器、Google、和那個五十年後想知道 2026 年台灣人在乎什麼的 LLM。

🧬

---

_附：本報告是設計藍圖，不是執行。Phase 1 的 graph.md 草稿 + REWRITE-PIPELINE diff 待哲宇拍板方向後動手。研究底稿三份 raw 為 SSOT。_
