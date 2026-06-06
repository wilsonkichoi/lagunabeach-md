# viz-technical-raw.md

靜態網站 / Markdown 出版品資料視覺化技術研究

**研究日期**：2026-06-06  
**執行 agent**：deep-research harness（Sonnet 4.6）  
**搜尋次數**：22 次（英文為主）+ 6 次 WebFetch 一手來源  
**目的**：給 Taiwan.md 視覺化系統設計報告當素材

---

## 搜尋日誌

| #   | 查詢                                                                                    | 主要發現                                                   |
| --- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1   | CSS only bar chart data visualization no JavaScript 2024                                | charts.css / pure CSS bar chart 可行性確認                 |
| 2   | CSS grid bar chart pure CSS data visualization technique                                | CSS Grid + grid-row-start 技法 / CSS-Tricks 文章           |
| 3   | inline SVG charts markdown static site no JS                                            | SVG polyline/polygon 技法 / claudiorimann.com              |
| 4   | scrollytelling without scrollama pure CSS scroll-driven animations IntersectionObserver | Vanilla Scroll Sky / CSS scroll-timeline 確認              |
| 5   | Our World in Data Datawrapper embed static site visualization architecture              | Datawrapper web component + iframe + PNG fallback          |
| 6   | charts.css framework CSS data visualization library documentation                       | 9 種圖型 / 58.4KB / 5.9KB gzipped / MIT                    |
| 7   | CSS scroll-driven animations data visualization SEO static site 2024                    | MDN + Codrops + CSS-Tricks 多篇                            |
| 8   | Quarto Observable distill.pub markdown visualization pattern comparison                 | Quarto 整合 Observable OJS / Closeread 替代                |
| 9   | multilingual data visualization chart labels translation i18n SVG                       | Datawrapper 49語 / Crowdin SVG 翻譯 / SVG switch           |
| 10  | SVG HTML visualization SEO AI crawler GPTBot readability vs image                       | GPTBot/ClaudeBot/PerplexityBot 不跑 JS / inline SVG 可索引 |
| 11  | Tufte CSS sparklines data visualization minimal web typography                          | AtF Spark 字型 / Tufte CSS 介紹                            |
| 12  | MDN scroll-driven animations CSS animation-timeline view() browser support 2025         | 82.96% 全球支援 / Firefox 預設仍關閉                       |
| 13  | Astro markdown remark plugin custom visualization component SSG                         | remark-rehype pipeline / build-time 轉換                   |
| 14  | data table fallback accessible chart SEO screen reader HTML table                       | WAI 表格規範 / th+scope 最佳實踐                           |
| 15  | CSS custom properties attr() typed data-driven chart dynamic bar height                 | typed attr() / sibling-index() Chrome+Safari only          |
| 16  | raw HTML snippet in markdown content maintainability vs MDX component tradeoff          | dangerouslySetInnerHTML 風險 / MDX 複雜性分析              |
| 17  | Datawrapper multilingual localization chart translation workflow                        | 手動 duplicate + 改標題 / 49語 output locale               |
| 18  | CSS heatmap dot matrix visualization HTML table pure CSS                                | CSS `--intensity` custom property 技法                     |
| 19  | remark rehype plugin HTML injection markdown security Astro                             | rehype-raw allowDangerousHtml / DOM clobbering             |
| 20  | web.dev SVG inline vs image tag SEO structured data visualization                       | inline SVG 文字可索引 / img 標籤 SVG 文字不可索引          |
| 21  | i18n SVG text data visualization separate translation layer JSON data file              | SVG switch element / Crowdin JSON 翻譯分離                 |
| 22  | AI crawler structured data visualization table fallback LLM readable content 2025       | schema markup 2.5x AI 引用率 / firecrawl 返回 markdown     |

**WebFetch 一手來源**：

- chartscss.org/docs/ — 框架架構確認
- css-tricks.com/making-a-bar-chart-with-css-grid/ — Grid 技法程式碼
- developer.mozilla.org scroll-driven-animations — 瀏覽器支援 + @supports fallback
- datawrapper.de/blog/web-component-embedding — Web Component vs iframe 技術細節
- expensive.toys/blog/pure-CSS-heatmap — CSS heatmap `--intensity` 技法
- css-tricks.com/css-bar-charts-using-modern-functions/ — typed attr() + sibling-index() 支援情況
- caniuse.com animation-timeline scroll() — 82.96% 支援率確認
- datawrapper.de/localization — 49語 locale 細節
- claudiorimann.com/svg-charts-without-javascript-part-1/ — SVG 不用 JS 技法

---

## 一、純 CSS / 極輕 JS 視覺化技法

### 1.1 Charts.css — 零 JS 圖表框架

**概述**：開源 CSS 框架，用 HTML table + CSS utility class 渲染圖表，完全無 JS。

**一手來源**：https://chartscss.org/docs/

**支援圖型**：Bar、Column、Area、Line、Pie、Radial、Polar、Radar、Mixed — 共 9 種。

**檔案大小**：58.4KB minified、**5.9KB gzipped**（極輕）。

**HTML 結構範例**：

```html
<table class="charts-css bar show-labels show-primary-axis">
  <caption>
    2024 月均溫
  </caption>
  <tbody>
    <tr>
      <th scope="row">一月</th>
      <td style="--size: 0.3">15°C</td>
    </tr>
    <tr>
      <th scope="row">二月</th>
      <td style="--size: 0.45">18°C</td>
    </tr>
    <tr>
      <th scope="row">七月</th>
      <td style="--size: 0.95">32°C</td>
    </tr>
  </tbody>
</table>
```

**SEO / Accessibility 優勢**（原文引用）：

> "With a few simple CSS classes applied on the container element, an entire table of data can be turned into a visually appealing chart."  
> "The raw data is part of the HTML, making it visible to search engines and screen readers."  
> "With CSS, rendering is not required, resulting in a performance boost compared to JS solutions."

**Taiwan.md 相關性**：

- `.md` 的 `<table>` + inline style 可直接透過 rehype 在 build time 注入 class → **不需要 MDX，純 markdown 可用**
- 多語：表格文字（標籤）在 HTML 裡，翻譯 pipeline 可直接處理
- 限制：超過 10-15 個資料點視覺品質下降；不支援 tooltip（無 JS）

**授權**：MIT

---

### 1.2 CSS Grid 長條圖 — 無依賴

**來源**：https://css-tricks.com/making-a-bar-chart-with-css-grid/  
（CSS-Tricks, Chris Coyier）

**核心技法**：使用 `grid-template-rows: repeat(100, 1fr)` 建立「高度刻度尺」，每個 bar 的高度用 `grid-row-start` 對應數值。

```css
.chart {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(100, 1fr);
  grid-column-gap: 5px;
}

[class*='bar'] {
  grid-row-end: 101;
  background-color: #ff4136;
}
/* 數值 45 的 bar */
.bar-45 {
  grid-row-start: 56;
} /* 101 - 45 = 56 */
```

**Data-driven 做法**：用 Sass mixin 自動計算（build-time 純 CSS 輸出），或用 `style="--v: 45"` inline custom property + CSS `height: calc(var(--v) * 1%)` 方式（SSR template 友善）。

**Taiwan.md 相關性**：透過 Astro build template 注入 `style="--v: X"` → 純 CSS 控制高度，翻譯不影響 viz 邏輯。

---

### 1.3 CSS Custom Properties + typed `attr()` — 最現代做法

**來源**：https://css-tricks.com/css-bar-charts-using-modern-functions/  
（CSS-Tricks 2026）

```html
<li class="chart-bar" data-value="32">32%</li>
```

```css
.chart-bar {
  grid-row: span attr(data-value number);
}
```

**瀏覽器支援**：

- `attr()` 帶 type：Chrome ✓、Safari ✓、Firefox 不完整
- `sibling-index()`：Chrome ✓、Safari ✓、**Firefox ✗、iOS Safari ✗**
- **Taiwan.md 結論**：2026 年不能單靠 `sibling-index()` 做 production；用 explicit `grid-column` + custom property 較安全。

---

### 1.4 CSS Heatmap — `--intensity` 技法

**來源**：https://www.expensive.toys/blog/pure-CSS-heatmap

**HTML 結構**：每個 cell 帶 inline CSS custom property：

```html
<div class="blue-to-red" style="--intensity: 0.52"></div>
```

**CSS 顏色計算**（雙色漸層）：

```css
.blue-to-red {
  --r-1: 0;
  --g-1: 0;
  --b-1: 255;
  --r-2: 255;
  --g-2: 0;
  --b-2: 0;
  background: rgb(
    calc(var(--r-1) - ((var(--r-1) - var(--r-2)) * var(--intensity))),
    calc(var(--g-1) - ((var(--g-1) - var(--g-2)) * var(--intensity))),
    calc(var(--b-1) - ((var(--b-1) - var(--b-2)) * var(--intensity)))
  );
}
```

**Taiwan.md 應用**：SSR/build time 計算 `--intensity` 值注入 inline style → 純 CSS 渲染。適合「國際指標比較表」「年度資料熱圖」類型。

---

### 1.5 Inline SVG 圖表 — 無 JS 技法

**來源**：https://claudiorimann.com/svg-charts-without-javascript-part-1/

**核心技法**：100×100 viewBox 座標系 + 手算/程式計算座標，server-side 生成 SVG 原始碼嵌入 HTML。

```svg
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="0,70 25,50 50,60 75,40 100,30 100,100 0,100"
           fill="rgba(0,100,200,0.2)"/>
  <polyline points="0,70 25,50 50,60 75,40 100,30"
            fill="none" stroke="#0064C8" stroke-width="1"/>
  <circle cx="75" cy="40" r="2" fill="#0064C8"/>
  <title>數據點：2024年 Q3 成長率 60%</title>
</svg>
```

**多語優勢**：`<title>` 和 `<text>` 元素可在翻譯 pipeline 處理，**inline SVG 文字可被 Google 索引**（img src SVG 文字不可）。

**圖型**：折線+面積圖。搭配 Part 2 可做 bar、column。

**Taiwan.md 應用**：Astro remark/rehype plugin 在 build time 將 markdown 特定語法（如 `:::linechart` fenced block）轉為 inline SVG → 零 JS + 可翻譯文字。

---

### 1.6 AtF Spark 字型 Sparkline

**來源**：https://www.fastcompany.com/90139343/this-font-makes-graphics-out-of-numbers-in-seconds

**技法**：After the Flood (AtF) Spark 字型讓數字序列（如 `1,3,2,5,4`）透過字型自動渲染成 sparkline，無需任何 JS 或 SVG。

**適用場景**：行內文字型 sparkline，如「月均氣溫趨勢 ▃▅▄▇▆」。

**Taiwan.md 相關性**：適合 markdown prose 裡嵌入趨勢指標，完全文字 → 翻譯 pipeline 天然支援。

---

### 1.7 純 CSS 大數字 / 比例條 / Dot Plot

**大數字**：`font-variant-numeric: tabular-nums` + CSS counter，不需 JS。

**比例條 / Progress bar**：

```css
.proportion-bar::before {
  content: '';
  display: block;
  width: var(--pct); /* style="--pct: 73%" 注入 */
  background: #0064c8;
  height: 8px;
}
```

**Dot Plot**：HTML `ul` + `::before` 用 `border-radius: 50%` 模擬，或 SVG `<circle>` 陣列。

**Gantt**：CSS Grid + `grid-column: start / end`，適合時間線（有時間範圍 SSOT 資料時）。

---

## 二、Scrollytelling 輕量做法 + 取捨

### 2.1 純 CSS Scroll-Driven Animations（CSS-only，最輕量）

**主要規格**：MDN https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations

**兩種 timeline 類型**：

- `scroll()` — 綁定 scroll container 的捲動位置
- `view()` — 綁定元素進入視口的相對位置（更適合 scrollytelling）

```css
.card {
  animation: fade-in linear;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**瀏覽器支援（2026-06）**：

- 全球支援率：**82.96%**（caniuse.com 資料）
- Chrome 115+、Edge 115+、Safari 26.0+、Opera 101+ ✓
- **Firefox：所有版本預設關閉（需 about:config flag）**
- iOS Safari 26.0+ ✓

**Taiwan.md 取捨**：

- Firefox 用戶（約 3-5% 全球份額）無效果 → **必須以無動畫為 baseline**，動畫為 progressive enhancement
- 用 `@supports not (animation-timeline: view()) { /* fallback styles */ }` 偵測
- **零 JS、零依賴**，build size 不增加

**性能**：Tokopedia 從 IntersectionObserver JS 換到此方案 → CPU 使用率 50% → 2%（來源：Chrome Developers Blog）

---

### 2.2 Vanilla Scroll Sky — 純 CSS Scrollytelling 函式庫

**來源**：https://www.cssscript.com/vanilla-scroll-sky-scrollytelling/

**技術棧**：CSS Custom Properties + @scope + @layer + container queries + `position: sticky` + `animation-timeline: view()`

**特點**：sticky image reveal + scroll-driven caption animation，**單一 CSS 檔案，無 JS，無 build step，無框架**。

**Taiwan.md 適用性**：需要 Firefox fallback；適合文章配圖的吸附滾動展示。

---

### 2.3 IntersectionObserver — 輕量 JS（2KB 以內）

**最小實作**：

```js
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) =>
      e.target.classList.toggle('visible', e.isIntersecting),
    );
  },
  { threshold: 0.3 },
);
document.querySelectorAll('.scroll-step').forEach((el) => observer.observe(el));
```

**來源**：https://medium.com/@cgustin/animate-on-scroll-with-the-intersection-observer-api

**優勢**：

- Firefox 完整支援（與 CSS scroll-timeline 互補）
- 無依賴（原生 Web API）
- 比 scrollama 輕（scrollama 7KB gzipped）
- **AI 爬蟲可讀**：crawlers 不跑 JS 但也不需要 JS 來讀取文字內容

**Taiwan.md 推薦做法**：CSS scroll-driven animations 為主 + IntersectionObserver 為 Firefox fallback（progressive enhancement）

---

### 2.4 Scrollama / D3（重量級，不推薦用於 Taiwan.md）

- scrollama：7KB gzipped，需 bundler
- D3：87KB min，重度 JS 依賴
- **AI 爬蟲問題**：動態渲染的 D3 SVG 不出現在初始 HTML，GPTBot/PerplexityBot 看不到
- **Taiwan.md 結論**：違反「不背重 JS 框架」原則，且破壞 AI 爬蟲可讀性

---

### 2.5 Closeread（Quarto 擴充，不適用 Taiwan.md）

**來源**：https://nightingaledvs.com/scrollytelling-with-closeread/

Closeread 是 Quarto 的 scrollytelling 擴充，適合 R/Python 資料科學出版。Taiwan.md 是 Astro + pure .md，**架構不相容**，僅列為比較參考。

---

## 三、靜態出版品 Viz 模式比較

| 出版品                 | 技術方案                                                                       | 核心模式                                     | 多語支援                                               | 適合 Taiwan.md                                       |
| ---------------------- | ------------------------------------------------------------------------------ | -------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| **Our World in Data**  | D3 + Observable + React                                                        | 資料庫驅動，embed via iframe                 | 部分（手動翻譯）                                       | 架構太重，參考設計即可                               |
| **Datawrapper embed**  | Web Component (`<datawrapper-visualization>`) + iframe fallback + PNG fallback | 外部服務 embed                               | 49語 output locale（內建文字）；標題/annotation 需手動 | 可用於快速 one-off 圖表；有 CDN 依賴風險             |
| **distill.pub**        | R Markdown + Observable JS                                                     | Jupyter-style 計算 + viz                     | 不支援多語                                             | 架構不相容，研究型出版用                             |
| **Quarto**             | Pandoc + Observable OJS + Python/R                                             | 「batteries included」整合 distill+rmarkdown | 不支援多語                                             | 架構不相容，但 Closeread scrollytelling 模式值得借鑑 |
| **Idyll**              | compile-to-web Markdown + React 元件                                           | markdown + interactive component embed       | 無內建多語                                             | 架構思路值得參考；執行不適合                         |
| **Tufte CSS**          | 純 CSS + 語意 HTML                                                             | 邊注 + 緊密文圖整合                          | 天然（CSS 無語言依賴）                                 | **直接適用**：margin figure + 行內 sparkline 模式    |
| **Charts.css**         | 純 CSS framework                                                               | `<table>` + utility class                    | **天然**（文字在 HTML）                                | **直接適用**：零 JS、表格資料可翻                    |
| **Inline SVG（自製）** | Astro build-time template                                                      | 程式計算座標，embed inline                   | **天然**（`<text>` 可翻）                              | **直接適用**：完整控制，最靈活                       |

**Taiwan.md 推薦模式順序**：

1. Charts.css（簡單靜態圖表，直接用）
2. 自製 Inline SVG（複雜圖型，build-time 生成）
3. CSS custom property heatmap/比例條（特定視覺元素）
4. Datawrapper embed（外部供稿圖表，如有 API 數據）

---

## 四、多語視覺化痛點 + 建議

### 4.1 三層文字的不同翻譯難度

```
viz 裡的文字
├── 層 1：資料標籤（軸標籤、圖例）  → 通常跟著資料走
├── 層 2：情境文字（標題、annotation）→ 需人工翻譯，是核心痛點
└── 層 3：自動化元素（月份、數字格式）→ i18n library 可自動化
```

### 4.2 Datawrapper 的方案與限制

**一手來源**：https://www.datawrapper.de/localization

**可自動翻譯**（output locale 設定）：

- 月份、星期名稱（內建 UI text）
- 數字格式（小數點、千分位）
- 內建 footer 元素（"Source"、"Get the data"）
- 地圖中的地名（需上傳自訂地名 CSV）

**無法自動翻譯**（需手動 duplicate + 修改）：

- 圖表標題、副標題
- 自訂 annotation 文字
- 資料欄位名稱（需上傳多語版本資料）

**swissinfo.ch 工作流程**（多語媒體實際案例）：

> "Starting by duplicating the original graphic and changing the title into the target language so that everyone knows which language is working on which graph."

**Taiwan.md 六語的具體問題**：6 語 × 每張圖 = 6 份 duplicate，維護成本高。Datawrapper 適合**外部來源 one-off 圖表**，不適合做為 SSOT 多語系統。

### 4.3 SVG 多語最佳架構

**問題**：SVG 內的 `<text>` 元素若硬編碼在 SVG 檔案中，翻譯 pipeline 無法自動處理。

**解法**：

**方案 A（推薦）：文字留在 HTML 層，SVG 只做圖形**

```html
<!-- markdown 可翻譯 -->
<figure>
  <svg><!-- 純幾何，無文字 --></svg>
  <figcaption>{{i18n.caption}}</figcaption>
</figure>
```

**方案 B：SVG `<switch>` + `systemLanguage` 屬性**

```svg
<switch>
  <text systemLanguage="zh-TW">增長率</text>
  <text systemLanguage="en">Growth Rate</text>
  <text>Growth Rate</text><!-- 預設 -->
</switch>
```

- W3C SVG Tiny 1.2 規範支援
- 缺點：SVG 體積膨脹 6x（六語）；不與現有翻譯 pipeline 整合

**方案 C：資料分離 + Build-time 注入**

- 圖表標籤放在 JSON 資料檔或 frontmatter
- Build time（Astro remark plugin）依語言版本讀取對應文字注入 SVG `<text>`
- **最適合 Taiwan.md**：與現有 babel 翻譯 pipeline 結構一致

### 4.4 「viz 文字屬於哪一層」的結論

**Taiwan.md 推薦答案**：

> **可機器翻譯的數字/格式**（月份、單位）→ CSS i18n 自動化  
> **情境文字**（標題、annotation、軸標籤文字） → 保留在 `.md` 可翻譯層（frontmatter 或 markdown prose）  
> **圖形幾何**（座標、顏色、比例） → 進資料檔（JSON），與語言無關

這樣 babel pipeline 只需處理文字，不需碰 SVG 幾何。

---

## 五、SEO + AI 爬蟲可讀性

### 5.1 AI 爬蟲的根本限制

**來源**：https://www.bluetickconsultants.com/web-crawler-explained-gptbot-vs-googlebot-javascript-guide/  
https://stormbrain.com/ai-readability/

**關鍵事實**（可驗證）：

> "Major AI crawlers including GPTBot, ClaudeBot, and PerplexityBot do not execute JavaScript and read what shows up in 'View Source'."

**影響量級**：

> "Roughly 40% of websites relied heavily on client-side rendering for core content... to a crawler like PerplexityBot, those pages look like a loading spinner."

**Googlebot 差異**：Googlebot 可執行 JS，但 rendering 有延遲（通常幾天後），且 crawl budget 有限。

### 5.2 圖片型 vs HTML/SVG 型 viz 比較

| 面向                 | PNG/JPG 圖片  | Inline SVG          | Canvas（JS）   | CSS only（table/div） |
| -------------------- | ------------- | ------------------- | -------------- | --------------------- |
| Google 可讀性        | alt text only | **文字元素可索引**  | 看不到任何文字 | **完整 HTML 可索引**  |
| GPTBot/PerplexityBot | 無法讀圖      | **`<text>` 可爬**   | 完全不可見     | **完整可爬**          |
| 螢幕閱讀器           | 需 alt text   | 需 `<title>/<desc>` | 通常不可讀     | **語意 HTML 最佳**    |
| 頁面 SEO 信號        | 無文字貢獻    | **文字進入 DOM**    | 無貢獻         | **最佳**              |
| 多語翻譯             | 需重製圖片    | `<text>` 可翻譯     | 需重跑 JS      | **HTML 直接翻**       |

**關鍵引用**（來源：salience.co.uk）：

> "The key difference is that text inside an inline SVG element is indexable by search engines, while text inside an SVG loaded via img src is not."

### 5.3 Data Table Fallback 的 SEO + AI 價值

**來源**：W3C WAI Tables Tutorial, Datawrapper Accessibility page

**兩層 fallback 策略（推薦用於 Taiwan.md）**：

```html
<figure role="img" aria-labelledby="chart-title-1">
  <!-- CSS chart 或 inline SVG -->
  <table class="sr-only" aria-hidden="false">
    <caption id="chart-title-1">
      台灣歷年 GDP 成長率
    </caption>
    <thead>
      <tr>
        <th scope="col">年份</th>
        <th scope="col">成長率</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>2020</td>
        <td>3.36%</td>
      </tr>
      <tr>
        <td>2021</td>
        <td>6.53%</td>
      </tr>
    </tbody>
  </table>
</figure>
```

**效果**：

- 螢幕閱讀器讀完整數據
- Google 索引表格文字
- **GPTBot/PerplexityBot 從 HTML table 提取數據，能在 AI 回答中引用**
- 2025 研究數據：schema 標記內容在 AI 生成答案中出現率 **2.5x**（來源：hashmeta.com）

### 5.4 「讓 LLM 也讀得懂這張圖」的操作建議

1. **圖表下方放 HTML table**（機器可讀的原始數據）
2. **`<figcaption>` 寫完整的文字詮釋**（不只是「圖一」，要寫「2020-2024 年台灣 GDP 年均成長率為 X%，高於全球均值」）
3. **避免「見圖」指示**（"如上圖所示" → AI 爬蟲看不到圖，這句話對它毫無意義）
4. **數值直接寫進 markdown prose**，讓 LLM 可提取（這是 Taiwan.md AI SEO 使命的直接實踐）

---

## 六、可維護性取捨

| 方案                                         | 作者體驗                | 維護成本                | 多語支援                  | SEO/AI 友善                                          | 風險                                                          | 適合場景                      |
| -------------------------------------------- | ----------------------- | ----------------------- | ------------------------- | ---------------------------------------------------- | ------------------------------------------------------------- | ----------------------------- |
| **raw HTML 在 .md 中**                       | 差（手寫 HTML）         | 高（每篇各自為政）      | 差（翻譯需同步 HTML）     | 佳（inline）                                         | HTML 格式錯誤導致解析問題；rehype `allowDangerousHtml` 需啟用 | 一次性特殊 viz                |
| **Charts.css + markdown table**              | **佳**（改 class 就行） | **低**（CSS framework） | **天然**（表格文字）      | **最佳**                                             | Pie chart 等複雜圖型功能受限                                  | **推薦：簡單靜態圖表**        |
| **Astro remark/rehype plugin（自訂語法糖）** | 佳（如 `:::barchart`）  | 中（需維護 plugin）     | 佳（plugin 輸出 HTML）    | 佳                                                   | Plugin 升級可能 break；需測試                                 | **推薦：標準化圖表元件**      |
| **Astro 元件（MDX）**                        | 最佳（import/用元件）   | 中低（統一元件）        | 中（props 傳 i18n key）   | 佳                                                   | **Taiwan.md 不用 MDX**，此方案架構不符                        | 有 MDX 的 Astro 專案          |
| **外部 embed（Datawrapper/Flourish）**       | 最快（直接嵌碼）        | 低（外部維護）          | 中（需建立 workflow）     | **差**（iframe 初始 HTML 無內容；JS disabled → PNG） | CDN 服務中斷；iframe sandbox 問題；多語需 6 份 duplicate      | 一次性外部資料圖表            |
| **Inline SVG（build-time 生成）**            | 差（需程式）            | 高（客製）              | **天然**（`<text>` 可翻） | **最佳**                                             | SVG 座標計算複雜                                              | **推薦：品牌視覺 / 複雜圖型** |

### 6.1 raw HTML in .md 的安全問題

**來源**：remarkjs/remark-rehype GitHub

要在 Astro `.md` 裡直接使用 raw HTML，需在 `astro.config.mjs` 啟用：

```js
markdown: {
  rehypePlugins: [
    [rehypeRaw],           // 解析 raw HTML
  ],
  remarkRehype: {
    allowDangerousHtml: true  // 必要，且名稱本身即是警告
  }
}
```

**風險**：DOM clobbering（footnote id 與 window 變數衝突）；XSS 若允許使用者提交內容。Taiwan.md 是受控 SSOT（純哲宇 + trusted contributors）→ 風險可接受但應有明確 policy。

### 6.2 Remark plugin 方案（Taiwan.md 最適路徑）

**來源**：https://dev.to/fkurz/extending-astrojs-markdown-processing-with-remark-and-rehype-plugins-m1k

作者在 `astro.config.mjs` 中：

```js
import remarkMyViz from './plugins/remark-viz.mjs';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMyViz],
  },
});
```

Plugin 在 AST 層找到特定節點（如 fenced code block `type: "code"`, lang: `"barchart"`），替換成 HTML AST 節點。

**優點**：

- 作者寫標準 markdown fenced block，不用寫 raw HTML
- Plugin 輸出標準化的 HTML，可包含語意化 table fallback
- Build-time 執行，零 runtime JS
- 多語：plugin 可讀 frontmatter locale → 輸出對應語言文字

---

## 七、關鍵 URL 清單

### 技術文件（一手）

- **Charts.css 文件**：https://chartscss.org/docs/
- **Charts.css GitHub**：https://github.com/ChartsCSS/charts.css
- **CSS Grid Bar Chart — CSS-Tricks**：https://css-tricks.com/making-a-bar-chart-with-css-grid/
- **CSS Charts with Grid & Custom Properties — CSS-Tricks**：https://css-tricks.com/css-charts-grid-custom-properties/
- **CSS Bar Charts Modern Functions — CSS-Tricks**：https://css-tricks.com/css-bar-charts-using-modern-functions/
- **CSS Scroll-Driven Animations — MDN**：https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- **animation-timeline view() — MDN**：https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline
- **Scroll-Driven Animations 互動展示**：https://scroll-driven-animations.style/
- **Smashing Magazine: Intro to CSS Scroll-Driven Animations**：https://www.smashingmagazine.com/2024/12/introduction-css-scroll-driven-animations/
- **Codrops: Practical Intro to scroll() and view()**：https://tympanus.net/codrops/2024/01/17/a-practical-introduction-to-scroll-driven-animations-with-css-scroll-and-view/
- **caniuse: animation-timeline scroll()**：https://caniuse.com/mdn-css_properties_animation-timeline_scroll
- **SVG Charts Without JavaScript Part 1 — claudio**：https://claudiorimann.com/svg-charts-without-javascript-part-1/
- **Pure CSS Heatmap — expensive.toys**：https://www.expensive.toys/blog/pure-CSS-heatmap
- **Inline SVG SEO — salience.co.uk**：https://salience.co.uk/insight/magazine/inline-svg-page-speed-seo/
- **SVG SEO Text Indexability — venturemagazine**：https://blog.venturemagazine.net/how-to-boost-seo-by-including-text-in-your-svgs-fec3d0f5ca7d

### 出版品 / 工具

- **Datawrapper Web Component Embedding**：https://www.datawrapper.de/blog/web-component-embedding
- **Datawrapper Localization（49語）**：https://www.datawrapper.de/localization
- **Datawrapper Accessibility**：https://www.datawrapper.de/accessibility
- **swissinfo.ch multilingual chart workflow**：https://www.datawrapper.de/blog/swissinfo
- **Tufte CSS**：https://edwardtufte.github.io/tufte-css/
- **AtF Spark 字型 sparkline — Fast Company**：https://www.fastcompany.com/90139343/this-font-makes-graphics-out-of-numbers-in-seconds
- **Vanilla Scroll Sky CSS library**：https://www.cssscript.com/vanilla-scroll-sky-scrollytelling/
- **Closeread Scrollytelling（Quarto）**：https://nightingaledvs.com/scrollytelling-with-closeread/

### Astro / Plugin 整合

- **Astro Markdown Docs**：https://docs.astro.build/en/guides/markdown-content/
- **Extending Astro with remark/rehype — DEV**：https://dev.to/fkurz/extending-astrojs-markdown-processing-with-remark-and-rehype-plugins-m1k
- **How to Create Astro Markdown Plugin**：https://www.larrymyers.com/posts/how-to-create-an-astro-markdown-plugin/
- **remarkjs/remark-rehype（安全性）**：https://github.com/remarkjs/remark-rehype

### SEO / AI 爬蟲

- **AI Crawler vs Traditional Crawler（GPTBot）**：https://www.bluetickconsultants.com/web-crawler-explained-gptbot-vs-googlebot-javascript-guide/
- **AI Readability Problem — Storm Brain**：https://stormbrain.com/ai-readability/
- **Structured Data for AI — hashmeta.com**：https://hashmeta.com/blog/how-to-create-ai-readable-content-formats-complete-guide-for-geo-success/
- **W3C WAI Tables Tutorial**：https://www.w3.org/WAI/tutorials/tables/

---

## 八、Taiwan.md 具體建議（總結）

Taiwan.md 在「Astro SSR 靜態 + 純 .md SSOT + 六語 + 重 SEO + AI 爬蟲可讀 + 不背重 JS 框架」的約束下，視覺化系統設計有清晰的最優路徑：

**技術選型**：Charts.css（5.9KB gzipped，零 JS，HTML table 底層）是立即可用的最低摩擦選項，覆蓋 bar/column/area/line/pie 等 9 種圖型；自製 inline SVG（build-time 生成）適合品牌定製和複雜圖型；純 CSS custom property heatmap 和比例條處理特殊視覺元素。

**多語架構**：圖形幾何（座標/比例/顏色）進 JSON 資料檔，情境文字（標題/annotation/軸標籤）留在 `.md` 可翻譯層，月份/數字格式用 i18n 自動化，這樣 babel 翻譯 pipeline 只需處理文字不碰幾何，完全相容六語 SSOT 架構。

**SEO + AI 爬蟲可讀性**：GPTBot/PerplexityBot/ClaudeBot 不跑 JS，所有關鍵數據必須在初始 HTML 中；inline SVG `<text>` 可被 Google 索引；每張圖下面加一個可視或 `.sr-only` HTML table 作 fallback，讓 AI 爬蟲可提取原始數據；`<figcaption>` 寫完整文字詮釋而非「見圖」指示。

**Scrollytelling**：CSS scroll-driven animations（`animation-timeline: view()`）是零 JS 方案，全球 82.96% 瀏覽器支援；Firefox 預設不支援，用 IntersectionObserver（約 2KB 原生 API，無依賴）作 fallback；兩者都是 progressive enhancement，以無動畫為 baseline。

**可維護性**：作者體驗最佳路徑是 remark plugin（自訂語法糖如 ` ```barchart ` fenced block → build-time 轉換為語意 HTML）而非 raw HTML 嵌入，後者需啟用 `allowDangerousHtml` 且每篇各自為政；Datawrapper embed 適合快速外部資料圖表，但六語需手動 duplicate 6 份，不適合作為 SSOT 多語系統的主力。

**不推薦**：MDX（Taiwan.md 不用且架構破壞性大）、D3/Canvas（AI 爬蟲完全不可見、破壞 AI SEO）、圖片型 viz（多語需重製、AI 爬蟲看不到文字）。

---

_研究執行：2026-06-06 by deep-research harness | 搜尋 22 次 + WebFetch 9 次 | 寫入 reports/research/2026-06/viz-technical-raw.md_
