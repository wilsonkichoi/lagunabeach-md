# 資料視覺化類型分類學 + 設計最佳實務：原始研究筆記

> 研究日期：2026-06-06
> 用途：Taiwan.md 知識庫文章《視覺化編輯指南 graph.md》素材
> 搜尋次數：18 次
> 研究方法：WebSearch × 18 → 綜合分析

---

## 一、搜尋日誌

| #          | 查詢關鍵字                                                                | 主要來源                                                                             |
| ---------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 1          | FT Financial Times Visual Vocabulary chart types classification 2024      | ft-interactive.github.io/visual-vocabulary / github.com/Financial-Times/chart-doctor |
| 2          | Datawrapper academy chartability chart type selection guide               | datawrapper.de/blog/chart-types-guide                                                |
| 3          | Alberto Cairo data visualization best practices how charts lie            | wwnorton.com/books/9781324001560                                                     |
| 4          | Edward Tufte data-ink ratio chartjunk principles                          | graficto.com, thedoublethink.com                                                     |
| 5          | Datawrapper blog when to use bar chart line chart pie chart               | datawrapper.de/blog/pie-charts / line charts / bar charts                            |
| 6          | NYT Reuters graphics editorial explanatory visualization narrative        | propublica.org/nerds/design-principles                                               |
| 7          | WCAG accessibility data visualization alt text charts 2024                | w3.org/WAI, smashingmagazine.com                                                     |
| 8          | color blind accessible color palette data visualization                   | tableau.com/blog, davidmathlogic.com/colorblind                                      |
| 9          | chart title descriptive takeaway annotation direct labeling vs legend     | practicalreporting.com, storytellingwithcharts.com                                   |
| 10         | treemap waffle chart sankey diagram when to use                           | datawrapper.de/blog/chart-types-guide, cleanchart.app                                |
| 11         | scatter plot bubble chart heatmap correlation visualization               | atlassian.com, webdatarocks.com                                                      |
| 12         | y-axis truncation misleading charts honest visualization principles       | arxiv.org/abs/1907.02035, tableau.com                                                |
| 13         | slope chart dot plot comparison ranking when to use                       | storytellingwithdata.com, domo.com                                                   |
| 14         | mobile responsive data visualization small screen                         | boundev.com, visualcinnamon.com                                                      |
| 15         | data source attribution citation credibility visualization journalism     | opentext.ku.edu, numberanalytics.com                                                 |
| 16         | narrative visualization explanatory vs exploratory progressive disclosure | vis.stanford.edu/files/2010-Narrative-InfoVis.pdf, springer.com                      |
| 17         | geospatial choropleth map visualization pitfalls                          | felt.com/blog/choropleth-maps, numberanalytics.com                                   |
| 18         | histogram box plot violin plot distribution comparison                    | atlassian.com, domo.com                                                              |
| 19 (bonus) | stacked bar chart 100% stacked part-to-whole                              | dataviz.unhcr.org, perceptualedge.com                                                |
| 20 (bonus) | qualitative text visualization word cloud annotation                      | depictdatastudio.com, policyviz.com                                                  |

---

## 二、視覺化類型完整分類學

> 骨架來源：FT Visual Vocabulary（9 大類）+ Severino Ribecca Data Visualisation Catalogue（16 功能類）+ Datawrapper 40 種圖型指南
> URL: https://ft-interactive.github.io/visual-vocabulary/
> URL: https://datavizcatalogue.com
> URL: https://www.datawrapper.de/blog/chart-types-guide

---

### 2.1 比較（Comparison）

**核心問題**：「這些東西有多不一樣？」

#### 長條圖（Bar / Column Chart）

- **何時用**：類別數量少到中（3-15 項）；需要精確比較數值大小；重要比例如選舉結果。Datawrapper：「3% 差異在長條圖清楚看到，在圓餅圖幾乎看不見」
- **何時不用**：時間序列（改用折線圖）；類別超過 20 個、需要捲動（考慮 dot plot）；Y 軸需截斷（強制誤導）
- 來源：https://www.datawrapper.de/blog/chart-types-guide

#### 點圖（Dot Plot / Cleveland Dot Plot）

- **何時用**：類別多（20+）且每項只有 1-2 個值；想消除長條圖的視覺噪音；需要 rank order 的清晰呈現
- **何時不用**：讀者不熟悉、需要在「面積」直覺評估大小時（長條圖更直覺）
- 來源：https://www.domo.com/learn/charts/cleveland-dot-plot

#### Slope Chart（斜率圖）

- **何時用**：**剛好比較兩個時間點或兩個條件**；想同時看「方向、幅度、排序改變」；before-after 分析
- **何時不用**：超過 2 個時間點；線條超過 15 條（線重疊、標籤碰撞）
- 來源：https://www.domo.com/learn/charts/slope-chart

#### 子彈圖（Bullet Chart）

- **何時用**：KPI 與目標值比較（量 vs 目標 vs 背景範圍）；dashboard 空間有限
- **何時不用**：無明確目標值時

---

### 2.2 排名（Ranking）

**核心問題**：「誰最大/最小/排第幾？」

#### 排序橫長條圖（Sorted Horizontal Bar）

- **何時用**：顯示相對排名；類別名稱較長（橫向比縱向更易讀）
- **何時不用**：重點不是排名而是比較數值差異

#### Bump Chart（名次折線圖）

- **何時用**：多個時間點的排名變化；展示「順位」的動態
- **何時不用**：時間點只有 2 個（用 slope chart）；類別超過 15 個（視覺雜亂）
- 來源：https://www.domo.com/learn/charts/bump-charts

#### 排序表格（Ranked Table）

- **何時用**：排名是主要資訊但還需要看詳細數字；讀者需要掃描具體值
- **何時不用**：想讓排名差異在視覺上一目了然（用圖形編碼更快）

---

### 2.3 部分對全體（Part-to-Whole）

**核心問題**：「各部分如何組成整體？」

#### 圓餅圖（Pie Chart）

- **何時用**：最多 5 個類別；比例接近 25%、50%、75%（這些在圓形中最易辨識）；一個明顯的主角（佔 70%+ 那種）
- **何時不用**：比較多個類別的大小差異（用長條圖）；超過 5 個切片；想精確讀數（人眼比較角度很差）
- 來源：https://www.datawrapper.de/blog/pie-charts

#### 甜甜圈圖（Donut Chart）

- 同圓餅圖規則，中心可放 big number 或主題文字。視覺上較輕盈
- 過度使用「美化」甜甜圈（立體、分裂、爆炸效果）是 chartjunk 典型

#### 堆疊長條圖（Stacked Bar）

- **何時用**：同時呈現「各部分比例」+「總量大小」；類別超過 5 個不適合圓餅時
- **何時不用**：中間段落難以比較（讀者無法判斷非從 0 開始的 bar 長度）
- 來源：https://affine.pro/blog/when-to-use-a-stacked-bar-chart

#### 100% 堆疊長條圖（100% Stacked Bar）

- **何時用**：各類別「佔比組成如何改變」比絕對量更重要；跨組別的比例對比
- **何時不用**：總量本身是重要資訊（100% 堆疊去除了總量資訊）
- 來源：https://www.perceptualedge.com/blog/?p=2239

#### Treemap（樹狀矩形圖）

- **何時用**：超過 5 個類別的部分對全體；資料有層級（類→子類）；展示相對大小比例
- **何時不用**：精確比較面積（人眼比較矩形面積很差）；類別數很少
- 來源：https://www.tableau.com/blog/5-unusual-alternatives-pie-charts

#### Waffle Chart（方格圖）

- **何時用**：讀者熟悉「100 格 = 100%」概念；想要比圓餅更直覺的比例呈現；1%=1格的離散感是亮點
- **何時不用**：多個類別同時比較（複雜度爆炸）；精確讀數

---

### 2.4 分布（Distribution）

**核心問題**：「資料如何分散？集中在哪裡？有沒有異常值？」

#### 直方圖（Histogram）

- **何時用**：單一連續變數的分布；了解資料的中心位置、分散程度、形狀（偏態、雙峰）
- **何時不用**：比較多個組別的分布（box plot 更好）；離散類別（用長條圖）

#### Box Plot（箱形圖）

- **何時用**：比較多個組別的分布；強調中位數、四分位距、異常值；簡潔呈現統計摘要
- **何時不用**：讀者不熟悉統計術語；單一分布形狀複雜（雙峰）（violin plot 更好）
- 來源：https://matplotlib.org/stable/gallery/statistics/boxplot_vs_violin.html

#### Violin Plot（提琴圖）

- **何時用**：比 box plot 顯示更多分布細節；資料有多峰分布；需要同時看密度和統計摘要
- **何時不用**：資料量太少（密度估計不可靠）；讀者不習慣閱讀密度圖形

#### 蜂群圖（Beeswarm / Strip Plot）

- **何時用**：資料量中等（100-1000 點），每個資料點都重要；想保留個別觀測的資訊
- **何時不用**：資料量超過幾千（點會重疊到看不見）

---

### 2.5 相關（Correlation）

**核心問題**：「兩個變數有關係嗎？怎樣的關係？」

#### 散佈圖（Scatter Plot）

- **何時用**：探索兩個連續變數的關係；顯示相關方向、強度、異常值；可加回歸線
- **何時不用**：超過幾千點（過度重疊，改用 hexbin 或 heatmap）；類別型變數
- 來源：https://www.atlassian.com/data/charts/what-is-a-scatter-plot

#### 泡泡圖（Bubble Chart）

- **何時用**：三個連續變數（XY 位置 + 泡泡大小）；最多可編碼 7 個變數（XY、大小、顏色、形狀等）
- **何時不用**：資料點太多（泡泡重疊）；大小差異範圍太小（看起來一樣大）；超過 3 個變數反而認知負荷爆炸
- 來源：https://handsondataviz.org/scatter-bubble-datawrapper.html

#### 熱力圖（Heatmap）

- **何時用**：兩個類別變數的矩陣關係（如：月份 × 時段）；大量資料的密度/模式；多變數相關矩陣
- **何時不用**：精確讀出數值（顏色編碼不如位置精確）；類別太多（格子太小看不清）
- 來源：https://www.webdatarocks.com/blog/best-charts-to-show-correlation/

---

### 2.6 趨勢與時間（Trend Over Time）

**核心問題**：「隨著時間如何變化？」

#### 折線圖（Line Chart）

- **何時用**：連續時間序列；多組趨勢比較；時間間距不一致也適用
- **何時不用**：時間點很少（< 5 個點）且只有一個類別（用長條圖更清楚）；類別型 X 軸
- 來源：https://academy.datawrapper.de/article/129-what-to-consider-when-creating-line-charts

#### 面積圖（Area Chart）

- **何時用**：強調總量隨時間的增減；單一序列的累積變化
- **何時不用**：多條線疊在一起（互相遮蓋，辨識困難）；重點是比較而非總量

#### 堆疊面積圖（Stacked Area）

- **何時用**：展示多個組別如何共同貢獻總量趨勢
- **何時不用**：中間的段落比較很難（同堆疊長條問題）

---

### 2.7 流向（Flow）

**核心問題**：「東西如何流動、轉換、分配？」

#### Sankey 圖（Sankey Diagram）

- **何時用**：跨階段的量流動（錢、能源、流量）；展示分配/再分配；attribution 分析
- **何時不用**：需要並排比較類別；追蹤時間趨勢；展示靜態比例；線性漏斗流失（流失圖更清楚）
- 差別：Sankey 圖注重「量的流動」；Alluvial 圖（異變圖）注重「類別隸屬改變」（人換工作、立場轉移）
- 來源：https://www.astrato.io/blog/sankey-use-cases

#### 衝積圖（Alluvial / Parallel Coordinates）

- **何時用**：多個類別變數間的關係；調查結果跨問題分析；政策偏好轉變
- **何時不用**：連線過多導致蜘蛛網（要限制類別數）

---

### 2.8 地理（Geospatial）

**核心問題**：「地理分布模式是什麼？」

#### Choropleth Map（面量圖）

- **何時用**：地理區域的相對值（選舉結果、人均收入、疾病率）；資料已標準化（per capita 等）
- **何時不用**：原始數量（大面積地區會視覺主導，城市反而看不見）；比較各地區排名（用長條圖）
- 陷阱：**Region size bias**：大面積地區（如西部縣市）在圖上搶眼但人口少，反而誤導重心
- 必須使用標準化數值（絕不直接用人口總數、案例總數）
- 來源：https://felt.com/blog/choropleth-maps

#### Dot Map（點密度圖）

- **何時用**：原始個案的地理分布；可以看到密度和集中程度
- **何時不用**：點太多互相重疊（改用 hexbin）

#### Proportional Symbol Map（比例符號地圖）

- **何時用**：地理位置上的數量比較（泡泡大小代表量）；不需要區域邊界
- **何時不用**：需要比較各區域內部比例

---

### 2.9 階層與網絡（Hierarchy / Network）

**核心問題**：「結構如何組成？關係如何連結？」

#### 樹狀圖（Tree / Org Chart / Dendrogram）

- **何時用**：嚴格的層級關係（每個子節點只有一個父節點）；組織架構、分類系統、決策樹
- **何時不用**：關係是網狀而非樹狀（用網絡圖）

#### 網絡圖（Network Graph）

- **何時用**：節點之間的多對多連結；社會網絡、影響力分析、引用關係
- **何時不用**：節點和邊太多（「毛球圖」問題）；想傳達清晰的資訊（先過濾）
- 來源：https://ixdf.org/literature/article/how-to-show-hierarchical-data-with-information-visualization

---

### 2.10 單一關鍵數字（Big Number / KPI）

**核心問題**：「這個數字重要嗎？好還是壞？有在進步嗎？」

#### Big Number Card

- **何時用**：最重要的單一指標；dashboard 首頁的錨定數字
- **必須包含**：背景（目標值、上期比較、基準線）；條件色（紅/綠）但要搭配文字說明（色盲考量）
- 「KPI without context can lead to misinterpretation in up to 84% of cases」—Geckoboard
- 陷阱：只放數字不放脈絡，讀者無法判斷「是好是壞」

#### Gauge / Speedometer

- **何時用**：進度百分比；用於非技術讀者直覺理解「達標程度」
- **何時不用**：精確讀數、多個指標同時比較（空間浪費、視覺複雜）
- 來源：https://www.klipfolio.com/blog/gauge-visualization

---

### 2.11 文字與質性（Qualitative / Annotation）

**核心問題**：「文字和訪談說了什麼？哪句話最重要？」

#### Pull Quote（引言框）

- **何時用**：一句話能代表核心訴求或矛盾；讓量化資料有人的溫度
- **何時不用**：引言沒有代表性（cherry-picking 一個極端聲音）

#### Word Cloud（文字雲）

- **何時用**：快速展示詞頻分布；給讀者「大致感覺」
- **何時不用**：精確分析（人眼比較字體大小很差）；常見停止詞污染（要先清理）；重要性不等於頻率
- 警告：word cloud 幾乎不應出現在嚴肅的資料新聞中——它看起來直覺但分析力極弱

#### Annotated Timeline / Annotated Chart

- **何時用**：折線圖/時間序列上標出重要事件節點（政策改變、重大新聞）
- **何時不用**：事件太多導致標籤堆疊

---

## 三、每個圖型「怎麼做才好」：好壞對照

> 來源綜合：Cole Nussbaumer Knaflic《Storytelling with Data》+ Datawrapper Academy + ProPublica Design Principles + Alberto Cairo

### 3.1 標題（Title）

**規則**：標題應是結論，不是標籤。

| ❌ 壞                | ✅ 好                                         |
| -------------------- | --------------------------------------------- |
| 「各縣市失業率比較」 | 「台北失業率連續三年最低，但差距正在縮小」    |
| 「2023 年 GDP 成長」 | 「台灣 2023 年 GDP 成長 3.1%，超越南韓 1.4%」 |
| 「健保費用趨勢」     | 「健保費用 10 年漲幅 43%，但佔薪資比例反降」  |

**研究支持**：「Informative titles required less mental effort and were viewed as more aesthetically pleasing, compared to generic titles」（ScienceDirect, 2020）

**標題公式**（ProPublica/NYT）：

- 格式：6-12 字 + 左對齊 + 副標題提供更多細節
- 問自己：「讀者只讀標題，能不能帶走 takeaway？」

### 3.2 Annotation（直接標籤 vs 圖例）

**規則**：盡量直接標，盡量不用圖例。

| ❌ 壞                                    | ✅ 好                                          |
| ---------------------------------------- | ---------------------------------------------- |
| 折線圖右下角有圖例，讀者眼睛需要來回跳動 | 折線終點直接標類別名                           |
| 長條圖上方放圖例                         | 直接在長條旁或上方標數值                       |
| 顏色意義只在圖例，正文沒解釋             | 標題或副標題直接說「藍色是 2022，橘色是 2023」 |

**核心原則**（Practical Reporting Inc.）：「Avoid legends, footnotes, and other forms of 'indirect' labeling in your charts!」

- URL: https://www.practicalreporting.com/blog/2024/9/17/avoid-legends-footnotes-and-other-forms-of-indirect-labeling-in-your-charts-whenever-possible

**例外**：直接標籤讓圖面凌亂時（>8 條折線）才退回圖例

### 3.3 色彩

**三條鐵律**：

1. **語意色**：紅色=危險/下降、綠色=好/上升、藍色=中性──但要意識到 8% 男性是紅綠色盲
2. **色盲友善**：避免紅+綠組合。推薦 Okabe-Ito 8 色盤（在所有類型色盲皆可分辨）。只用一個色相時最安全
3. **高對比**：圖形元素對背景 3:1 對比率（WCAG 2.1 AA 標準）；文字 4.5:1

| ❌ 壞                        | ✅ 好                          |
| ---------------------------- | ------------------------------ |
| 紅綠配色代表正負             | 橘藍配色 + 文字標籤            |
| 彩虹色代表連續數值（無語意） | 單色相從淺到深                 |
| 8 個類別 8 種顏色            | 最重要的類別用強調色，其餘灰色 |
| 只靠顏色區分                 | 顏色 + 形狀/線條樣式雙重編碼   |

**工具**：davidmathlogic.com/colorblind（色盲模擬器）

- URL: https://davidmathlogic.com/colorblind/

### 3.4 排序

**規則**：幾乎所有情況都應該排序，不要用資料的「原始順序」。

| 圖型                           | 排序原則                   |
| ------------------------------ | -------------------------- |
| 長條圖（比較）                 | 由大到小 / 由小到大        |
| 長條圖（時間序列）             | 保持時間順序               |
| 圓餅圖                         | 最大的從 12 點鐘開始順時針 |
| Dot Plot                       | 依數值排序                 |
| 例外：固定類別（月份、年齡組） | 保持自然順序               |

### 3.5 座標軸

**Y 軸截斷規則**：

- **長條圖**：Y 軸必須從 0 開始。截斷 Y 軸的長條圖在視覺上系統性誇大差異（即使讀者被告知截斷，仍會高估差異）
- **折線圖**：不必從 0 開始，但需要說明脈絡。例如：體溫圖從 36°C 開始完全合理
- 出處：Correll et al.「Truncating the Y-Axis: Threat or Menace?」CHI 2020 — https://arxiv.org/pdf/1907.02035

**其他座標軸規則**：

- 兩個 Y 軸（雙軸圖）幾乎永遠是壞主意——讀者無法判斷哪條線應對哪個軸
- 對數軸（log scale）使用時必須明確標示，並加解說文字
- 格線：保留必要的輔助格線（水平），移除垂直格線（通常多餘）

### 3.6 留白

Tufte 的 **data-ink ratio** 原則：最大化傳達資料的墨水比例，最小化非資料的「chartjunk」。

**可安全刪除的元素**：

- 深色邊框/背景
- 3D 效果（永遠不要）
- 圓餅圖陰影
- 不必要的格線（特別是垂直格線）
- 重複標籤（圖例 + 標籤同時存在）
- 裝飾性圖案/圖示

**留白的正面作用**：引導視線、降低認知負荷

### 3.7 行動裝置

「Mobile data visualization is a design discipline, not a responsive CSS trick」— boundev.com

**核心規則**：

- 桌機可放 15-20 個資料點；手機一個螢幕最多 3-5 個
- 每個行動裝置螢幕只回答一個問題
- 觸控目標最小 44×44px
- 圖例放在圖上方（手機上滑動後圖例會消失）
- 長橫向長條圖在手機上要換成垂直版面
- 字體在縮放後仍可讀（最小 14px body text）
- 線條粗細要夠（細線在高 DPI 螢幕不一定清楚）

| ❌ 手機陷阱          | ✅ 解法                    |
| -------------------- | -------------------------- |
| 複雜多軸圖縮小到手機 | 重新設計成單一重點的簡化版 |
| 圖例在圖的下方       | 圖例在圖的上方             |
| 標籤小於 12px        | 最小 14px，重要標籤 16px   |
| 懸停（hover）互動    | 改成點擊互動               |

---

## 四、敘事型 vs 探索型視覺化

> 來源：Segel & Heer「Narrative Visualization: Telling Stories with Data」IEEE InfoVis 2010 — http://vis.stanford.edu/files/2010-Narrative-InfoVis.pdf
>
> - Springer 2025「Exploratory and explanatory features in data storytelling」

### 4.1 根本差異

| 維度     | 探索型（Exploratory）        | 敘事型（Explanatory / Editorial） |
| -------- | ---------------------------- | --------------------------------- |
| 目的     | 讓讀者自己發現               | 作者引導讀者看到重點              |
| 前提     | 讀者有資料素養 + 主題知識    | 讀者可以是零基礎                  |
| 結構     | 開放、非線性                 | 有始有終、線性或半線性            |
| 作者角色 | 設計工具讓人探索             | 選擇「這張圖說一件事」            |
| 典型場景 | 開放資料工具、互動 dashboard | 新聞圖表、文章配圖                |
| 認知負荷 | 高（讀者負責詮釋）           | 低（作者已幫你消化）              |

**Taiwan.md 的場景**：幾乎全是 **敘事型**。讀者來看文章，不是來分析資料庫。

### 4.2 敘事型視覺化五個層次

1. **作者已選好 takeaway**：只展示支持核心論點的資料（但要誠實揭露不一致之處）
2. **一張圖一個重點**（one chart, one insight）：如果這張圖在說兩件事，就拆成兩張圖
3. **Annotation layer 是第一公民**：直接在圖上寫「2020年這裡爆發 X」；不是事後添加的注腳
4. **漸進揭露（Progressive Disclosure）**：先顯示整體，再 zoom in 到焦點；先結論，再細節
5. **文字與圖形協作**：好的新聞圖表不是「文章旁的裝飾」——文字和圖要共同構成論點

**ProPublica Design Principles（2013）**：

- 「Be ruthless in the cause of clarity and in defense of the user's attention」
- 「Design is just as much about what you leave out as what you put in」
- URL: https://www.propublica.org/nerds/design-principles-for-news-apps-graphics

### 4.3 Annotation Layer 最佳實務

- 重要資料點直接在圖上標注文字（而非讓讀者自己讀出 X 座標值）
- Annotation 要解釋「為什麼重要」，不只是「這裡是 X」
- 「Graphs with text annotations reduce cognitive effort compared with graphs with no text annotations」（ScienceDirect, 2020）
- 避免：annotation 太多讓圖面失焦（一張圖最多 1-3 個 annotation）

---

## 五、無障礙 + 可信度

### 5.1 無障礙（Accessibility）

**法律基礎**：WCAG 2.1 AA 是許多國家政府網站的法定標準

#### Alt Text（替代文字）

- WCAG 成功標準 1.1.1：所有非文字內容必須有文字替代
- **公式**：`alt="[圖型] of [資料主題] where [關鍵洞察]"`
- 範例：`alt="折線圖，顯示台灣 2010-2023 年健保費用，其中 2016 年改革後費用成長速度明顯放緩"`
- 複雜圖表要附 **長描述（long description）**：包含刻度、關鍵數值、趨勢說明
- 來源：https://www.w3.org/WAI/tutorials/images/complex/

#### Data Table Fallback

- 複雜視覺化旁邊提供可存取的資料表格版本
- 讓視力障礙讀者可以用螢幕閱讀器（screen reader）探索資料

#### 對比比率

- 圖形元素對相鄰元素：最小 3:1（WCAG 2.1 AA）
- 所有文字元素對背景：最小 4.5:1
- 來源：https://www.smashingmagazine.com/2024/02/accessibility-standards-empower-better-chart-visual-design/

#### 非顏色編碼

- WCAG 1.4.1：不能只靠顏色傳遞意義
- 同時使用：顏色 + 形狀 / 顏色 + 線條樣式 / 顏色 + 文字標籤

### 5.2 可信度（Credibility）

#### 來源標註（Source Attribution）

- **每一張圖都必須標來源**，格式：`資料來源：[機構名稱]，[年份]`
- 如有加工：「資料來源：XX，由 Taiwan.md 編輯整理」
- 「93% of visualizations in COVID studies cited data sources; ~7% did not — undermining credibility」（Mapping COVID-19 Crisis Visualizations, 2021）

#### 誠實的座標軸

- 長條圖 Y 軸從 0 開始（否則一定要特別說明且有正當理由）
- 截斷 Y 軸時：用缺口符號（≈）標示；在圖說明文字說明理由
- **核心測試**：「讀者只看這張圖，會不會得出錯誤比例感？」

#### 取樣偏誤揭露

- 樣本來源和限制要在圖說或注腳說明
- 時間範圍選擇：為什麼選這個起點？（不要選對自己論點最有利的起點）
- 標本數：N<30 的統計要特別警示，N<10 不應畫趨勢線

#### 不確定性視覺化

- 信賴區間（confidence interval）：折線圖的陰影帶
- 誤差棒（error bar）：長條圖的 whisker
- 「Visualizing uncertainty is not just being transparent; it's a sign of data maturity」

---

## 六、視覺化發布前檢查清單

> 綜合來源：Storytelling with Data pre-publication checklist + Interhacktives 7-point checklist + Nature Cell Biology checklist (2025)
> URL: https://www.storytellingwithdata.com/blog/my-pre-publication-checklist-for-an-effective-graph
> URL: https://medium.com/interhacktivity/data-visualisation-checklist-7-things-to-check-before-you-click-publish-d6ea54e66b6e
> URL: https://www.nature.com/articles/s41556-025-01684-z

### 第一層：資料正確性

- [ ] 數字是否已核實（三次確認原則，特別是絕對數字）
- [ ] Y 軸是否從合適的基準線開始（長條圖必須從 0）
- [ ] 百分比加總是否等於 100%（或正確解釋為什麼不是）
- [ ] 時間範圍選擇是否公正（沒有選擇性截取）
- [ ] 取樣偏誤是否有揭露

### 第二層：圖型選擇

- [ ] 這張圖是否是回答這個問題的最佳圖型？
- [ ] 有沒有更簡單的方式傳達同樣的資訊？
- [ ] 圖型是否符合讀者的視覺素養？

### 第三層：標題與文字

- [ ] 標題是否說出 takeaway（而不只是描述資料）？
- [ ] 副標題/圖說是否補充了足夠的背景？
- [ ] 關鍵資料點是否有 annotation（而非讓讀者自己找）？
- [ ] 來源是否標明？格式是否正確？

### 第四層：視覺設計

- [ ] 是否有不必要的 chartjunk 可以刪除？
- [ ] 色彩對比是否符合 WCAG（3:1 for graphics, 4.5:1 for text）？
- [ ] 色盲讀者能否理解這張圖（不只靠顏色傳遞意義）？
- [ ] 圖例是否能改為直接標籤？
- [ ] 資料是否按邏輯排序（而不是資料庫原始順序）？

### 第五層：無障礙

- [ ] Alt text 是否有寫，且遵循「圖型 + 主題 + 洞察」公式？
- [ ] 複雜圖表是否有資料表格版本？
- [ ] 圖面元素在 200% 縮放後是否仍可讀？

### 第六層：行動裝置

- [ ] 在手機螢幕上是否能讀懂（字不小、標籤不擠）？
- [ ] 互動元素（如有）是否可觸控（最小 44px）？
- [ ] 圖例是否在圖的上方（不是下方）？

### 第七層：整體敘事

- [ ] 一張圖是否只在說一件事？
- [ ] 文字與圖表是否協作而不重複？
- [ ] 讀者只看圖和標題，能否帶走正確 takeaway？
- [ ] 有沒有任何元素可能被誤讀為誤導？

---

## 七、關鍵權威來源索引

### 一級來源（直接引用的原始資料）

| 來源                                              | 類型                     | URL                                                                                    |
| ------------------------------------------------- | ------------------------ | -------------------------------------------------------------------------------------- |
| FT Visual Vocabulary（Financial Times）           | 分類框架 + 40+ 圖型      | https://ft-interactive.github.io/visual-vocabulary/                                    |
| FT Visual Vocabulary GitHub                       | 開源版                   | https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary            |
| Datawrapper Blog: Friendly guide to chart types   | 圖型選擇指南             | https://www.datawrapper.de/blog/chart-types-guide                                      |
| Datawrapper: Pie charts                           | 圓餅圖深度               | https://www.datawrapper.de/blog/pie-charts                                             |
| Datawrapper: Line charts                          | 折線圖深度               | https://academy.datawrapper.de/article/129-what-to-consider-when-creating-line-charts  |
| Severino Ribecca: Data Visualisation Catalogue    | 圖型百科（16 類）        | https://datavizcatalogue.com                                                           |
| Alberto Cairo: How Charts Lie                     | 誠實可信度               | https://wwnorton.com/books/9781324001560                                               |
| Cole Nussbaumer Knaflic: Storytelling with Data   | 敘事視覺化               | https://www.storytellingwithdata.com                                                   |
| Edward Tufte: data-ink ratio, chartjunk           | 最小化原則               | https://thedoublethink.com/tuftes-principles-for-visualizing-quantitative-information/ |
| Segel & Heer: Narrative Visualization (IEEE 2010) | 敘事型 vs 探索型學術論文 | http://vis.stanford.edu/files/2010-Narrative-InfoVis.pdf                               |
| Correll: Truncating the Y-Axis (CHI 2020)         | Y 軸截斷研究             | https://arxiv.org/pdf/1907.02035                                                       |
| ProPublica Design Principles                      | 新聞圖表設計             | https://www.propublica.org/nerds/design-principles-for-news-apps-graphics              |

### 二級來源（設計標準與無障礙）

| 來源                                                  | 類型           | URL                                                                                                                                             |
| ----------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| W3C WAI: Complex Images                               | Alt text 規範  | https://www.w3.org/WAI/tutorials/images/complex/                                                                                                |
| Smashing Magazine: Accessibility Standards for Charts | WCAG + 圖表    | https://www.smashingmagazine.com/2024/02/accessibility-standards-empower-better-chart-visual-design/                                            |
| David Mathlogic: Colorblind simulator                 | 色盲模擬       | https://davidmathlogic.com/colorblind/                                                                                                          |
| Tableau: Colorblind-friendly viz                      | 色彩最佳實務   | https://www.tableau.com/blog/examining-data-viz-rules-dont-use-red-green-together                                                               |
| Okabe-Ito 8-color palette                             | 色盲友善色盤   | https://thenode.biologists.com/data-visualization-with-flying-colors/research/                                                                  |
| UNHCR Data Viz: Part-to-whole                         | 部分對全體指南 | https://dataviz.unhcr.org/chart-types/part-to-a-whole/                                                                                          |
| Practical Reporting: Direct labeling                  | 圖例 vs 直接標 | https://www.practicalreporting.com/blog/2024/9/17/avoid-legends-footnotes-and-other-forms-of-indirect-labeling-in-your-charts-whenever-possible |
| Felt: Choropleth maps                                 | 地圖視覺化     | https://felt.com/blog/choropleth-maps                                                                                                           |
| Storytelling with Data: Pre-pub checklist             | 發布前清單     | https://www.storytellingwithdata.com/blog/my-pre-publication-checklist-for-an-effective-graph                                                   |
| Interhacktives: 7-point checklist                     | 發布前清單     | https://medium.com/interhacktivity/data-visualisation-checklist-7-things-to-check-before-you-click-publish-d6ea54e66b6e                         |
| Nature Cell Biology checklist (2025)                  | 科學視覺化清單 | https://www.nature.com/articles/s41556-025-01684-z                                                                                              |

---

## 八、研究總結（寫給 graph.md 編輯者）

這份研究橫跨 20 次搜尋，綜合了 FT Visual Vocabulary（業界最廣泛使用的圖型分類框架）、Datawrapper Academy（實作導向的最佳實務）、Alberto Cairo 的可信度哲學、Edward Tufte 的最小化原則、Segel & Heer 的敘事型視覺化學術框架，以及 WCAG 2.1 的無障礙標準。

**Taiwan.md 編輯指南的核心啟示有四**：第一，圖型選擇從「這個問題要用什麼關係回答」出發，而不是從「哪張圖看起來好看」出發，FT 的九大分類（比較/排名/部分對全體/分布/相關/時間趨勢/流向/地理/層級網絡）提供了最清晰的決策框架。第二，台灣媒體常見的兩大錯誤——截斷 Y 軸的長條圖和圓餅圖類別過多——有清楚的替換方案（long bar → dot plot + 排序，pie >5 類 → stacked bar）。第三，敘事型視覺化的核心是「annotation layer 是第一公民」——不要讓讀者從刻度反推重要性，直接在圖上寫出來。第四，無障礙（alt text、非顏色編碼、資料表格備援）在台灣數位媒體普遍不足，是 Taiwan.md 可以建立明顯差異化的地方。

所有檢查清單項目均有學術或業界來源支撐，可直接轉化為 Taiwan.md 視覺化品質閘門的一部分。
