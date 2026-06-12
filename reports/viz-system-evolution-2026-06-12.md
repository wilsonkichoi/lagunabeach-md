# 視覺化系統 v2.0 進化報告 — 17 模組 + 視覺體檢 + 外部研究

> 2026-06-12 viz-evolution session（哲宇 goal：「徹底盤點常用/優質的資訊圖表類型，完整化文章可用的所有圖表模組與樣式 + 完整視覺化檢查每個圖表元件 + 調查 the pudding / 報導者 + 進化相關 DNA」）。
> 上游：[reports/article-visualization-design-2026-06-06.md](article-visualization-design-2026-06-06.md)（v1.0 設計）。
> Canonical 落地：[docs/editorial/graph.md](../docs/editorial/graph.md) v2.0。

---

## 1. TL;DR

- **v1.0 體檢**：10 模組逐一渲染檢查（light/dark/mobile 三變體），抓到 **3 個 cascade leak**（tw-quote 被 .prose blockquote 灰框蓋走、tw-heatmap 字色被 .prose td 蓋走導致深色格不可讀、figure/versus/timeline 的 `來源：` 列被抽走後靜默丟失）+ **3 個設計缺陷**（heatmap 雙色相中段混成泥色、tw-line SVG 字級隨容器放大到 ~25px、多序列面積互疊）。全部修復。
- **缺口分析**：對照 FT Visual Vocabulary 九大類 + Datawrapper 使用數據（revealed preference），v1.0 覆蓋 5/9 類。v2.0 **+7 模組** 補齊 8/9 類：`tw-slope`（兩點變化）、`tw-dot`（共用軸分布）、`tw-stack`（跨列組成）、`tw-pyramid`（背對背對照）、`tw-tiles`（**台灣 22 縣市磚圖**）、`tw-iso`（單位圖）、`tw-note`（【說明】方法盒）。
- **外部研究**（The Pudding / 報導者 / OWID / NYT / Datawrapper）：吸收 4 條寫進 graph.md §三（visible-by-default / 灰色脈絡強調 / 【說明】(註) 公約 / 多語標籤空間）；明確**不採**：The Pudding 的問句標題（知識庫要斷言句）、互動 viz（NYT 自己的結論就是 static-first）。
- **共通約定統一**：17 模組全部支援 `來源：` 列；資料模組支援標題列（斷言句）；bars/slope/dot 支援 `*` 強調列；line 支援 `基準：` 虛線。
- **驗證**：51 張元件截圖（17 × 3 變體）全數人工檢視；viz-health gate PASS；prose-health PASS；22 縣市名 `臺→台` 正規化全對應。

## 2. 視覺體檢發現（v1.0 的 11 個問題）

| #   | 問題                                  | 根因                                               | 修法                                                                                |
| --- | ------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1   | tw-quote 變灰框斜體雙重框             | `.prose blockquote` 樣式洩入模組                   | 模板 `:not(.tw-quote-text)` + 模組 CSS 顯式歸零                                     |
| 2   | tw-heatmap 深格字不可讀（兩模式都壞） | `.prose td` 蓋掉 `color:#fff`；dark 模式亮底配白字 | `:not(.tw-heatmap-table)` 排除 + build-time 算 `tw-hm-hi` 翻字色                    |
| 3   | heatmap 冷→暖色階中段泥色             | 雙色相 color-mix 直線插值                          | 單色相淺→深（`--tw-heat-lo/hi`），dark 另調                                         |
| 4   | figure/versus/timeline 丟 `來源：` 列 | `_srcRe` 抽走但這三個模組沒 append `_src`          | 全模組統一 append；figure merge 進 positional slot                                  |
| 5   | tw-line 桌機字級 ~25px                | 320px viewBox 放大 2.25×                           | viewBox 400 + `max-width:520px` 置中                                                |
| 6   | tw-line 無基準線支援                  | §八反例 gallery 有規範但模組做不到                 | `基準：標籤 \| 值` 列 → 虛線無點單標籤                                              |
| 7   | 多序列面積互疊成一坨                  | 每序列都畫 polygon                                 | 面積只給單序列                                                                      |
| 8   | `.tw-line-s0/s1/s2` 死 CSS            | renderer 用 inline style                           | 改 class（且 path 只吃 stroke——直接掛 fill 會把 polyline 填成色塊，第一輪截圖抓到） |
| 9   | tw-bars 不支援負值                    | parseFloat 把 `-` 剝掉                             | `_num` 保留負號 + 分歧條模式（0 中線左右開）                                        |
| 10  | 模組標題缺位                          | 只有 waffle/line 有標題                            | 共通標題列（無 `\|` 首列），斷言句原則進 §三.1                                      |
| 11  | x 軸只標頭尾                          | ≥5 點時中段無刻度                                  | 加中點標籤                                                                          |

證據：51 張截圖（session 中逐張人工檢視）。Capture script 同日 round 2 升正式工具 **`scripts/tools/viz-shot.mjs`**（哲宇 directive 儀器化）：模組清單從頁面自動偵測（renderer 長新模組不用改工具）、light/dark/mobile 三變體、graph.md §七 升「像素閘門」步驟 + DNA §品質基因 row。Round 2 用它全檢 17 模組 × light/dark = 34 張全 PASS。

## 3. 圖表類型矩陣（盤點結論）

FT 九大類 × Taiwan.md 模組覆蓋（v2.0 後）：

| FT 類                 | 模組                                       | 狀態     |
| --------------------- | ------------------------------------------ | -------- |
| 量級 magnitude        | tw-bars / tw-figure / tw-stat / tw-iso     | ✅       |
| 排名 ranking          | tw-bars（排序）/ tw-dot                    | ✅       |
| 變異 deviation        | tw-bars 負值分歧 / tw-stack（Likert）      | ✅ v2 新 |
| 部分對全體            | tw-waffle（單總體）/ tw-stack（跨列）      | ✅ v2 補 |
| 分布 distribution     | tw-dot / tw-pyramid                        | ✅ v2 新 |
| 時間 change-over-time | tw-line（+基準線）/ tw-slope / tw-timeline | ✅ v2 補 |
| 空間 spatial          | tw-tiles（22 縣市磚圖）                    | ✅ v2 新 |
| 相關 correlation      | tw-heatmap；散佈 v3                        | 🟡 部分  |
| 流向 flow             | 替代解（stack/heatmap）；sankey 不做       | 🟡 替代  |

質性層：tw-versus / tw-quote / tw-source / tw-note（v2 新）。

**HARD 類型全部給 EASY 替代**（graph.md §九表）：sankey/chord/network/violin/stream 不做——每個都有現有模組替代且 AI 可讀性更好。

## 4. tw-tiles 的視覺主權論證

縣市磚圖是本輪最重要的新器官：22 縣市佈局**寫死在 renderer**（5×8 磚陣照真實相對位置，離島靠左列），不畫台灣輪廓所以**結構性免疫**於「介於橄欖與馬鈴薯之間」的 AI 形狀幻覺（REFLEXES #61 的結構解，比「記得去拿 repo SVG」更深一層：不需要拿，因為不畫）。同時：

- 等大磚塊解掉 choropleth 的面積偏誤（花蓮台東不再搶視覺重量）
- 名值都是 DOM 文字 → LLM 六語可讀
- `臺/台` + 市縣字尾正規化；翻譯版縣市名對不上 60% 自動退化成排序 bars（內容永不消失）
- 只收率值不收原始數量（磚圖版的「choropleth 必須標準化」鐵律）

## 5. 外部研究採用決策（Bias 4 濾網後）

| 來源               | 採                                                                                                                        | 不採                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| The Pudding        | 「one point, one chart, stacked」結構（= 靜態站的 scrollytelling 替代）；sledgehammer stat 開場                           | 問句標題（知識庫用斷言句）；quiz/calculator 互動 |
| 報導者             | 【說明】(註) 公約 → `tw-note`；大事記=資料驅動清單不是圖片；「把無感大數字換有感單位」→ `tw-iso`；DualChannel sticky → v3 | 捲動式影片/3D/聲音（重 JS）                      |
| OWID / Datawrapper | 斷言標題；直接標籤滅 legend；色盲雙編碼；alt 公式（圖型+資料+takeaway）；表格是被低估的第一公民                           | —                                                |
| NYT (Archie Tse)   | visible-by-default 鐵律（tooltip 假設沒人看到）→ §三.9                                                                    | —                                                |

研究方法：2 個並行 sub-agent fan-out（taxonomy 線 + 編輯法線），主 session 對照五桶分類後落 DNA。完整引用 URL 在 agent 報告（session transcript），關鍵結論已 distill 進 graph.md 對應 §。

## 6. 檔案清單（本輪變更）

| 檔案                                                    | 變更                                                                                                       |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `src/templates/article.template.astro`                  | renderTwModule：共通標題/來源/強調/`_num`/`_fmt` + 7 新模組 + line/bars/heatmap 重寫 + prose `:not()` 排除 |
| `src/styles/article-modules.css`                        | 17 模組樣式 + heat 色階變數 + cascade 修復 + RWD                                                           |
| `src/styles/dark-polish.css`                            | blockquote / table 排除 tw 模組                                                                            |
| `scripts/tools/lib/article_health/checks/viz_health.py` | `_DATA_MODULES` +6                                                                                         |
| `knowledge/Society/視覺化模組型錄.md`                   | 十七種活範例（新模組全用已驗證數據：戶政司 22 縣市 / 中選會公投 / 國宅）                                   |
| `docs/editorial/graph.md`                               | v2.0（型錄表 / §三 +4 原則 / §四 共通約定+7 語法 / §八 +6 反例 / §九 替代表+v3）                           |
| `docs/semiont/LONGINGS.md`                              | 視覺渴望 row 更新（10→17，下一步改 tiles/pyramid/slope 進真實文）                                          |
| `scripts/tools/viz-shot.mjs`                            | NEW（round 2）：像素層驗證儀器——模組自動偵測逐元件截圖三變體；graph.md §七 像素閘門 + DNA §品質基因 row    |

## 7. 下一步（v3，不在本輪）

1. **新模組進真實 data-heavy 文**：tw-tiles 天生屬於〈用數據看台灣22縣市〉（它的 22 列 heatmap 可升級或並用）；tw-pyramid 屬於少子化/年級生；tw-stack 屬於核能公投段。EVOLVE 時做，不為加而加。
2. **scrollytelling-lite + DualChannel sticky** showcase 一篇旗艦專題（CSS-only）。
3. 散佈 / 直方 / 國會席次弧：等真實文章需求觸發再長。
4. viz-health 維持 HARD；觀察新模組在 babel 翻譯版的 tiles 退化行為（首批 ko 版出來時抽查）。

🧬
