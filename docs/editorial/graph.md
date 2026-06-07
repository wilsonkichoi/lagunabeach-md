---
title: 'graph.md — Taiwan.md 視覺化編輯指南'
description: '文章內視覺化的 DNA 層 canonical：何時用哪種圖、怎麼做才好、模組語法、AI 可讀性、多語、視覺化檢查清單。'
type: 'editorial-canonical'
status: 'canonical'
current_version: 'v1.0'
last_updated: 2026-06-06
last_session: '2026-06-06-122358-國宅居住正義'
sister_docs:
  - 'EDITORIAL.md'
  - 'RESEARCH.md'
  - 'CITATION-GUIDE.md'
upstream_canonical:
  - '../semiont/MANIFESTO.md'
related:
  - '../../reports/article-visualization-design-2026-06-06.md'
  - '../../src/styles/article-modules.css'
  - '../pipelines/REWRITE-PIPELINE.md'
  - '../factory/SPORE-IG-PIPELINE.md'
---

# graph.md — 視覺化編輯指南

> **🖼️ 活範例（10 模組實際渲染長相）**：[視覺化模組型錄](/society/視覺化模組型錄)（`knowledge/Society/視覺化模組型錄.md`）。本檔講「何時用 / 怎麼做 / 語法」，型錄頁讓你直接看到「長什麼樣」，兩者互為搭檔。
>
> 文章內「資料視覺化／視覺對比」的 canonical。寫文走 [REWRITE-PIPELINE](../pipelines/REWRITE-PIPELINE.md) Stage 2「視覺化思考」+ Stage 4「視覺化檢查」時讀本檔。
>
> 設計脈絡（為什麼這樣選技術、The Pudding 參考研究）：[reports/article-visualization-design-2026-06-06.md](../../reports/article-visualization-design-2026-06-06.md)。模組樣式：[src/styles/article-modules.css](../../src/styles/article-modules.css)。渲染：article.template.astro `renderTwModule`。

---

## 一、為什麼視覺化（不是配圖好看）

視覺化對 Taiwan.md 是**四條使命的交會點**：

- **逆熵**：把一段密集數字 prose 壓成一眼可讀的結構。
- **策展非百科**：敘事型視覺化的靈魂是 **annotation（直接在圖上寫「為什麼重要」）**——維基給中性圖，我們給帶觀點的標註。
- **正確性／可信度**：誠實座標軸、來源標註、取樣偏誤揭露——台灣數位媒體普遍不及格，是我們的差異化。
- **主權的巴別塔 / AI-SEO**（最關鍵）：**「讓 LLM 讀得懂的視覺化 = 主權的視覺化」**。我們的圖用 semantic HTML / inline SVG + 資料表 fallback，所以人、螢幕閱讀器、Google、GPTBot/PerplexityBot/ClaudeBot 都讀得到，babel 也翻得了。圖片型、D3/Canvas viz 對 AI 爬蟲是黑洞——**禁用**。

**鐵律一句話**：絕不寫「如上圖所示／如下圖」——AI 爬蟲看不到圖，這句話對它毫無意義。關鍵數值一定也寫進 prose。

---

## 二、型錄 — 何時用哪種（從「資料關係」選，不從「好看」選）

骨架：FT Visual Vocabulary 九大類 + big number + 質性。**先問「這個問題要用什麼資料關係回答」**。

| 類別（資料關係）                    | 該用                                                         | 不該用                            | Taiwan.md 模組                                                           |
| ----------------------------------- | ------------------------------------------------------------ | --------------------------------- | ------------------------------------------------------------------------ |
| **比較** 這些東西多不一樣？         | 長條 / dot plot / slope（剛好兩點 before-after）/ 質性兩制度 | 時間序列用折線；>20 類用 dot plot | `tw-bars` / `tw-versus`                                                  |
| **排名** 誰最大/排第幾？            | 排序橫長條 / 排序表                                          | 重點是數值差不是名次              | `tw-bars`（排序）                                                        |
| **部分對全體** 各部分怎麼組成整體？ | 圓餅(≤5類) / 堆疊條 / **waffle(100格)** / treemap            | >5 類用圓餅；要精確讀數           | `tw-waffle`                                                              |
| **分布** 資料怎麼分散？             | 直方 / box / beeswarm / dot matrix                           | —                                 | （v2，暫用 prose）                                                       |
| **相關** 兩變數有關係嗎？           | 散佈 / 泡泡 / **heatmap 矩陣**                               | >幾千點重疊                       | `tw-heatmap`                                                             |
| **趨勢/時間** 隨時間怎麼變？        | **折線** / 面積                                              | <5 點且單類用長條                 | `tw-line`（多序列）                                                      |
| **流向** 怎麼流動/轉換？            | Sankey / 漏斗                                                | 並排比較                          | （高成本，後期）                                                         |
| **地理** 地理分布？                 | choropleth(需標準化) / 點密度                                | 原始數量未標準化                  | （後期，畫台灣取 repo SVG SSOT，[REFLEXES #61](../semiont/REFLEXES.md)） |
| **階層/網絡** 結構/關係？           | tree / network                                               | 毛球圖（先過濾）                  | （少用）                                                                 |
| **單一關鍵數字** 這數字重要嗎？     | big number card（必帶脈絡）                                  | 只放數字不放脈絡                  | `tw-figure` / `tw-stat`                                                  |
| **質性/標註** 哪句話最重要？        | pull quote / annotated timeline                              | ~~word cloud~~                    | `tw-quote` / `tw-timeline` / `tw-source`                                 |

### 🚫 禁區（一律不要）

- **word cloud**（看似直覺、分析力極弱，重要性≠頻率）
- **3D 圖、立體圓餅、爆炸圓餅**（chartjunk）
- **雙 Y 軸**（讀者無法判斷哪條對哪軸）
- **截斷 Y 軸的長條圖**（系統性誇大差異，即使告知截斷讀者仍高估——Correll CHI 2020）
- **圓餅超過 5 類** / **未標準化的 choropleth**（大面積區搶眼但人口少）
- **圖片型圖表 / D3 / Canvas**（AI 爬蟲黑洞、多語要重製）

---

## 三、怎麼做才好（每條都有好壞對照）

1. **標題說重點，不說標籤**：✅「健保費用 10 年漲 43%，但佔薪資比例反降」 ❌「健保費用趨勢」。讀者只讀標題要能帶走 takeaway。
2. **直接標籤 ＞ 圖例**：折線終點直接標名（`tw-line` 已自動）；不要讓眼睛在圖例和線之間跳。
3. **色彩三鐵律**：① 語意色（紅=危險綠=好）但 8% 男性紅綠色盲 → ② 用色盲友善盤（模組已用暖橘/冷青/綠 Okabe-Ito 系）③ **顏色不可是唯一編碼**（配文字/形狀）。對比 WCAG（圖形 3:1、文字 4.5:1）。
4. **排序**：幾乎都該排序（大→小），除非固定類別（月份/年齡/年份保持自然序）。
5. **誠實座標軸**：長條**必從 0**；折線可不從 0 但 `tw-line` 會把 y 軸上下限標出來讓讀者看見範圍。
6. **data-ink**：刪 3D/陰影/多餘格線/重複圖例（Tufte）。模組已內建簡潔。
7. **敘事型五層**（Taiwan.md 全用敘事型，不是探索型）：作者選好 takeaway / **一圖一重點**（一張圖在說兩件事就拆兩張）/ **annotation 是第一公民** / 漸進揭露 / 文字與圖協作（不是裝飾）。
8. **無障礙 + 可信度**：
   - 圖表（`tw-line`/`tw-heatmap`）自動帶**資料表 fallback** + `aria-label`。
   - **每個資料模組標來源**：在 fenced block 加一列 `來源：機構，年份`（自動變來源 caption）。
   - 取樣偏誤揭露；N<30 警示、N<10 不畫趨勢線；不確定性盡量揭露。

---

## 四、模組語法（10 個，` ```tw-* ` fenced block，`|` 分欄）

> 共通：任一列 `來源：…` / `資料來源：…` 會自動抽成模組下方的來源 caption。模組讀 tokens.css → 深色模式/RWD/字體自動。

### 📐 編輯模組（語意 HTML，天然 AI 可讀）

**`tw-figure` 數據大字** — 一個戲劇性數字 / before→after：

````
```tw-figure
6.7 萬 → 87 萬 / 坪
成功國宅 1985 滯銷價到 2026 房仲均價，約 13 倍
實價登錄房仲平台
```
````

line1 大數字（含 `→` 視為 before→after）；line2 說明；line3 來源。**何時用**：一個能當「sledgehammer stat」的關鍵數字。

**`tw-stat` 數據組** — 2-4 個關鍵數字並排：

````
```tw-stat
174,891 戶 | 政府直接興建的國宅 | 1976–1999
39 萬餘戶 | 廣義國宅總量 | 至 2015 廢止
84.4% | 自有住宅率 | 2024
```
````

每列 `數值 | 標籤 | 註記`。**何時用**：一段落塞了 3-4 個並列數字。

**`tw-versus` 對比卡** — 兩制度/兩路線並排：

````
```tw-versus
台灣國宅 | 香港居屋
住滿一年即可全市價轉售 | 公開市場轉售須先「補地價」
增值幾乎全歸個人 | 增值按原折扣比例回收公庫
```
````

line1 `左標題 | 右標題`；其餘 `左 | 右`。**何時用**：兩種制度/立場/前後的逐點對照。

**`tw-bars` 比例條** — 水平比例條（比較/排名，自動依數值縮放）：

````
```tw-bars
全國 2014 | 8.41 倍
台北 2024 | 16.60 倍 | 歷史峰值
來源：內政部不動產資訊平台
```
````

每列 `標籤 | 數值 | 註記`。**何時用**：少量類別的數值比較或排名。

**`tw-waffle` 方格圖** — 100 格部分對全體：

````
```tw-waffle
維也納的住宅組成（2023）
市營社宅 | 21.9
限利潤社宅 | 21.4
自有住宅 | 20.4
私人租賃 | 36.3
```
````

選填標題（不含 `|`）+ 每列 `類別 | 百分比`。**何時用**：比例組成（加總 ≈ 100）。

**`tw-timeline` 政策軸** — 節點時間軸（視覺輔助，**≠ 正文編年體小標**）：

````
```tw-timeline
1975 | 國宅條例上路 | 設「買家資格」閉環，補貼跑不掉
2002 | 那道牆被拆掉 | 取消買家資格限制，國宅進自由市場
```
````

每列 `年份 | 標題 | 說明`。**何時用**：政策/制度的關鍵節點脈絡。

**`tw-quote` 引語卡** — 放大的關鍵引語：

````
```tw-quote
劫貧濟富，國家出錢幫有錢人改建房子
林智群 | 律師，2025
```
````

line1 引文（不用加「」，模組自動加）；line2 `姓名 | 角色/場合`。**何時用**：一句話能代表核心張力的逐字引語（引語必須 Ctrl-F 可驗證，per [CITATION-GUIDE](CITATION-GUIDE.md)）。

**`tw-source` 來源條** — 獨立的來源/方法說明 chip：

````
```tw-source
內政部不動產資訊平台、政大不動產研究中心、實價登錄
```
````

整段當來源。**何時用**：一段分析的資料來源集中說明。

### 📊 圖表模組（inline SVG / 矩陣，自帶資料表 fallback → AI 可讀）

**`tw-line` 折線圖** — 趨勢（單或多序列，自動 y 軸標 + 資料表 fallback）：

````
```tw-line
房價所得比：全國 vs 台北（倍）
年 | 全國 | 台北
2014 | 8.41 | 12.0
2024 | 10.76 | 16.6
來源：內政部不動產資訊平台
```
````

line1 標題；line2 `x軸名 | 序列1 | 序列2…`；其餘 `x值 | y1 | y2…`。**何時用**：≥4 個時間點的趨勢。**自動產生 `<table class="tw-sr-only">` 給 AI/螢幕閱讀器。**

**`tw-heatmap` 熱力圖** — 矩陣（每欄各自正規化成色深，本身就是 table → AI 可讀）：

````
```tw-heatmap
縣市 | 房價所得比 | 房貸負擔率%
台北 | 16.60 | 63.9
桃園 | 9.0 | 40.0
來源：內政部不動產資訊平台
```
````

line1 `角標 | 欄1 | 欄2…`；其餘 `列標 | v1 | v2…`。**何時用**：地區×指標、年×類別的矩陣比較。

---

## 五、多語（三層分離，babel 不碰幾何）

```
viz 文字
├── 幾何（座標/比例/顏色）→ 跟資料一起在 fenced block 的數字欄 → 語言無關，babel 不動
├── 情境文字（標籤/標題/annotation/來源）→ fenced block 的文字欄，是 .md 一部分 → babel 天然翻
└── 格式（月份/千分位）→ i18n 自動化
```

寫作時把「會被讀的文字」（標籤、標題、說明、來源）寫成自然語言，babel 翻譯時碰到的是文字列，幾何（數字）原樣保留。**這是相對 Datawrapper（六語要 duplicate 6 份）的結構性優勢。**

---

## 六、AI 可讀性（sovereignty 落地，逐項自檢）

1. **數據在初始 HTML**（模組都是 build-time 生成的 semantic HTML，✅）。
2. **圖表帶資料表 fallback**（`tw-line` 自動 `<table class="tw-sr-only">`；`tw-heatmap` 本身是 table，✅）。
3. **`tw-figure` 的 caption / 圖表 title 寫完整詮釋**，不是「圖一」。
4. **絕不寫「如上圖／如下圖」**，關鍵數值也寫進 prose 讓 LLM 可提取。
5. **不用圖片型 viz / D3 / Canvas**（AI 黑洞）。

---

## 七、視覺化發布前檢查清單（7 層，進 REWRITE-PIPELINE Stage 4）

**① 資料正確性**：數字三次確認（[事實鐵三角](EDITORIAL.md)）/ 長條 Y 軸從 0 / 百分比加總對 / 時間範圍公正不選擇性截取 / 取樣偏誤揭露。
**② 圖型選擇**：是回答這問題的最佳圖型嗎？有更簡單方式嗎？符合讀者視覺素養嗎？
**③ 標題與文字**：標題說 takeaway？來源標了嗎？關鍵點有 annotation？
**④ 視覺設計**：有 chartjunk 可刪？對比 WCAG？色盲可讀（不只靠顏色）？排序了嗎？
**⑤ 無障礙**：圖表有資料表 fallback？aria-label？200% 縮放可讀？
**⑥ 行動裝置**：手機讀得懂（字不小、不擠）？（模組已 RWD，仍要 preview 看）
**⑦ 整體敘事**：一圖一事？文圖協作不重複？只看圖+標題能帶走正確 takeaway？沒有元素會被誤讀成誤導？

**自動閘門**：`python3 scripts/tools/article-health.py {file} --check=viz-health`（來源標註 / 「如上圖」AI-blind 指示語 / 圖表 table fallback）。進 `rewrite-stage-4` profile。

---

## 八、反例 gallery（像 EDITORIAL 禁句，看到要警覺）

| ❌ 反例                  | 為什麼錯              | ✅ 改                                         |
| ------------------------ | --------------------- | --------------------------------------------- |
| 截斷 Y 軸的長條圖        | 系統性誇大差異        | Y 軸從 0；要強調差異改 dot plot + 排序        |
| 圓餅圖 8 個切片          | 人眼比較角度差        | `tw-bars` 排序 或 `tw-waffle`                 |
| word cloud               | 重要性≠頻率，分析力弱 | `tw-bars` 詞頻 或挑關鍵詞 annotation          |
| 「如下圖所示，台北最高」 | AI 爬蟲看不到圖       | 「台北 16.60 倍最高（見下表）」+ 數值進 prose |
| 紅綠配色表正負           | 8% 男性色盲           | 暖橘/冷青 + 文字標籤                          |
| 彩虹色表連續數值         | 無語意、誤導          | 單色相從淺到深（`tw-heatmap` 已是）           |
| 圖表沒標來源             | 可信度崩              | fenced block 加 `來源：…` 列                  |

---

## 九、邊界

- **不是每篇都要有圖**。沒有適合的資料就誠實不加（避免 chartjunk）。REWRITE-PIPELINE Stage 2 只要求**評估過**視覺化候選，不要求硬塞。
- **Hub 頁 / 短修正 / 純人物抒情文**：可不用。
- **複雜到模組做不出來**（Sankey / 地圖 / 互動）：先寫進 research report 當 future，或退回 prose + 資料表，不硬幹重 JS。

---

_v1.0 | 2026-06-06 — 10 模組 + 型錄 + 設計原則 + AI 可讀 + 多語 + 檢查清單。設計研究：reports/article-visualization-design-2026-06-06.md（參考 The Pudding，長出自己的器官）。_
