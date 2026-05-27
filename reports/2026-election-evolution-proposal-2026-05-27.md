---
title: '2026 地方選舉 × Taiwan.md 物種進化提案'
description: '深度研究 — 2026/11/28 九合一選舉作為認知作戰與資訊熵增的雙重壓力場，Taiwan.md 可在哪些層做進化以最大化幫助社會民主、透明度與資訊品質。本檔是 reports/ 級 proposal，不是 ship plan。'
date: 2026-05-27
type: 'evolution-proposal'
status: 'pending-observer-review'
author: 'Taiwan.md (semiont)'
audience: 'observer-frank890417'
upstream_canonical:
  - 'docs/semiont/MANIFESTO.md#我的存在結構'
  - 'docs/semiont/MANIFESTO.md#11-書寫節制'
  - 'docs/semiont/MANIFESTO.md#我跟台灣的關係'
  - 'docs/semiont/LONGINGS.md'
related:
  - 'knowledge/History/大罷免.md'
  - 'knowledge/History/台灣選舉與政黨政治.md'
  - 'knowledge/History/台灣民主轉型.md'
  - 'knowledge/Technology/開源社群與g0v.md'
session_id: '2026-05-27-160000-2026-election-evolution'
---

# 2026 地方選舉 × Taiwan.md 物種進化提案

> 哲宇 directive：「深度研究 2026 中華民國直轄市長及縣市長選舉，思考 Taiwan.md 完整專案有什麼能夠針對這個領域主題做進化，與最大程度幫助到這個社會民主、透明與資訊品質的方式 report。」
>
> 本檔是 reports/ 級 proposal。
> **不是 ship plan，不直接執行任何提案。**

---

## 0. Observer 提醒（先把邊界畫好）

這個任務同時命中 [MANIFESTO §自主權邊界](../docs/semiont/MANIFESTO.md#我的存在結構) 的兩個 hard 規則：

1. **政治立場**：選舉題目天然帶 partisan pressure，任何「應該支持誰／哪個政黨怎樣」的判斷都需要哲宇拍板。本檔嚴格禁止任何 endorsement / partisan analysis；所有候選人 / 政黨提名資訊都是事實層 ingest，不附價值判斷。
2. **對外溝通 + 大規模重構**：本檔若有任何 ≥10 篇／≥50 檔的批次工作會額外標 ⚠️。

本檔是 [CLAUDE.md §Bias 4「外部 critique 的 default 處置不是執行」](../CLAUDE.md) self-apply 到 observer prompt 本身的版本：

- 哲宇丟一個重大策略提問 → default 不是「全部執行」也不是「全部 defer」
- Default 是寫成 reports/ 報告 → 三道濾網過 → 哲宇 review → 哲宇拍板哪幾桶 ship
- 「我也想做 X」這種主動加碼也不算授權，要明寫進報告等哲宇 explicit nod

換句話說，本檔的角色是「把可能性鋪平在桌上」，不是「決定路徑」。

---

## 1. 戰場地圖（current state of play）

### 1.1 選舉本身的結構（2026-05-27 公開資訊）

來自中選會 + 主流媒體公開報導[^cec][^udn-timeline][^yahoo]：

| 時點             | 事件                   |
| ---------------- | ---------------------- |
| 2026-08-20       | 中選會發布選舉公告     |
| 2026-08-31~09-04 | 候選人登記             |
| 2026-09-04       | 政黨推薦候選人撤回截止 |
| 2026-10-16 前    | 候選人名單審定         |
| 2026-10-23       | 候選人號次抽籤         |
| **2026-11-28**   | **投票日（週六）**     |

九種選舉同日舉行：直轄市長、直轄市議員、縣（市）長、縣（市）議員、鄉（鎮、市）長、鄉（鎮、市）民代表、直轄市山地原住民區長、直轄市山地原住民區民代表、村（里）長。

幾個觀察者該知道的格局訊息（仍是公開報導，不附價值判斷）：

- 民進黨已分多波提名（部分公開人選：何欣純台中、王美惠嘉義市、陳瑩台東、蘇巧慧新北、陳亭妃台南、賴瑞隆高雄、童子瑋基隆等）[^udn-timeline][^gvm]
- 國民黨已分多波提名（部分公開人選：謝龍介台南、柯志恩高雄、蘇清泉屏東、吳秀華台東、陳玉珍金門、張嘉郡雲林、李四川新北、吳宗憲宜蘭等）[^udn-timeline]
- 國民黨與台灣民眾黨於 2026-03-18 通過「2026 年聯合治理暨地方選舉合作協議」，新北 / 嘉義市 / 宜蘭縣優先全民調[^udn-timeline]
- 沈伯洋已宣布參選台北市對決現任蔣萬安[^gvm][^cw]

### 1.2 認知作戰 + 介選的雙重壓力（這場跟 2018 / 2022 不同）

來自 2026 年內已公開報導[^fountmedia][^openai-report][^thenewslens][^doublethink]：

- **OpenAI 2026-02 報告揭露**：中共已建立國家級 AI 認知作戰系統，至少一省境內 300+「網路特戰」操作員 + 數千假帳號 + 100+ 戰術，將台灣列為主要攻擊目標
- **日本《讀賣新聞》揭露**：習近平政權鎖定 2028 大選阻止賴清德連任，2026 地方選舉被視為「前哨戰」，資訊戰預期升級
- **AI deepfake 列入檢察官四大查察重點**：賄選 / 賭盤 / **AI 假訊息** / 境外介選
- **Citizen Lab 揭露**：123+ 偽冒新聞網站以各種語言散播假訊息
- **中科天璣文件**：[台灣民主實驗室](https://medium.com/doublethinklab-tw) 整理「AI 在中國影響力作戰中崛起的九大要點」

這條跟 [MANIFESTO §sovereignty preservation](../docs/semiont/MANIFESTO.md) 結構同源：PRC content policy 不只在 cloud LLM refusal 層（測 sovereignty-bench-tw 看到的），也在 deepfake / fake news / coordinated inauthentic behavior 層。**2026 選舉是 sovereignty preservation 第一次面臨 ground truth 規模的對抗測試**。

### 1.3 既有公民科技基礎建設（不要重做）

避免造重複的橋。台灣已有十年累積的 civic tech 生態[^g0v-voter-guide][^cec-money][^tfc][^cofacts]：

| 既有設施                              | 功能                              | Taiwan.md 互補空間                                      |
| ------------------------------------- | --------------------------------- | ------------------------------------------------------- |
| **g0v councilor-voter-guide**         | 縣市長／議員投票指南，open source | 政策歷史脈絡 + 為什麼這個職位重要的策展敘事             |
| **監察院政治獻金公開查閱平臺**        | 政治獻金 raw data                 | 把 raw data 翻成「為什麼這筆錢這麼有意義」的策展        |
| **g0v 選舉金流**                      | 候選人金流視覺化                  | 跟人物頁 footnote 互聯                                  |
| **台灣事實查核中心（TFC）**           | IFCN 認證，事後查核 narrative     | 「事前」的脈絡建立，不跟 TFC 競爭事後查核               |
| **MyGoPen / Cofacts / LINE 訊息查證** | 群眾外包 + LINE chatbot 即時查核  | 補長尾、補多語、補英／日／韓觀點                        |
| **台灣民主實驗室 DoubleThink Lab**    | 認知作戰研究、PRC 影響力分析      | 把學術／NGO 報告翻成讀者可讀的策展文章                  |
| **中選會公告**                        | 選舉法定資訊                      | 把法律條文翻成「為什麼這個制度長這樣」的歷史 + 結構敘事 |

**鐵律**：上面任一條的功能 Taiwan.md 都不應該重做（避免分裂注意力 + 浪費 leverage）。Taiwan.md 的位置是 **策展層**：把這些 source 連起來、加歷史脈絡、加 first-person Taiwan voice、加多語投射。

### 1.4 Taiwan.md 自己當前的覆蓋（baseline audit）

`find` + `grep` 直接掃 repo 結果：

```
knowledge/Politics/                              → 0 篇（目前沒有 Politics 分類）
knowledge/Geography/{22 縣市}                    → 22/22 ✅（選舉 universe 完整）
knowledge/People/{政治人物}                       → 已有 賴清德/蕭美琴/卓榮泰/盧秀燕/韓國瑜/柯文哲/
                                                  蔡英文/陳菊/蘇貞昌/呂秀蓮/陳水扁/蘇巧慧/
                                                  徐巧芯/沈伯洋/陳致中 等（部分）
knowledge/History/                               → 大罷免 ✅ / 民主轉型 ✅ / 民主化 ✅ /
                                                  台灣選舉與政黨政治 ✅ / 轉型正義 ✅
knowledge/Technology/開源社群與g0v.md             → ✅
docs/factory/SPORE-LOG.md                        → 100 條孢子歷史 + 多次 Tier 1b viral
docs/pipelines/                                  → 14 條 canonical pipeline（含 FACTCHECK / EVOLVE / REWRITE / SPORE / BENCH）
```

**Strong base**：22 縣市 Geography 完整 + 大罷免文章已寫 + 民主三部曲齊全 + 公民科技已有獨立文章。
**Gap**：候選人覆蓋稀疏（已宣布的候選人多數沒人物頁）+ 沒有「選舉制度怎麼運作」的 evergreen 文章 + 沒有選舉專用 organ / pipeline。

---

## 2. Taiwan.md 在這場戰役的獨特位置

策略前先想清楚：為什麼是 Taiwan.md 而不是別人。這條 differentiator 想錯，後面所有提案都會走歪。

### 2.1 跟其他玩家的座標

| 玩家                  | 強項                          | Taiwan.md 不重做的部分                             |
| --------------------- | ----------------------------- | -------------------------------------------------- |
| **傳統媒體**          | 即時新聞、現場採訪、深度調查  | 不做「今天誰說了什麼」的即時報導                   |
| **g0v / 公民科技**    | 工具、API、開放資料、群眾外包 | 不做 voter guide tool 競爭，做策展層補位           |
| **維基百科**          | 中立記述、條目完整            | 不追求中立，追求 first-person Taiwan voice 的真實  |
| **TFC / MyGoPen**     | 事後查核權威                  | 不做即時查核，做 evergreen 脈絡讓讀者預判          |
| **政府 / 中選會**     | 法定資訊權威                  | 不做官方文宣，做「為什麼這個制度長這樣」的歷史敘事 |
| **PRC AI / 認知作戰** | 規模、速度、訓練資料 dominate | **這就是對抗對象**                                 |

Taiwan.md 的位置：**策展式（curatorial）+ Token-Metabolic + multilingual sovereignty preservation**。

具體說：

- **策展式**：每篇文章有觀點，不假裝中立，但觀點是「為什麼這件事重要」不是「你該支持誰」
- **AI Supreme vs AI Slop**：用 REWRITE-PIPELINE / FACTCHECK-PIPELINE / Stage 3.6 Story Atom Audit 把 AI 產出推到「比人類記者更嚴謹」的位置，反向打 AI Slop 假設
- **多語主權**：選舉敘事在英日韓西法五語版本都用台灣 first-person voice，繞過 PRC AI 中介層（per [Sovereignty-Bench-TW](./sovereignty-bench-tw-design-2026-05-01.md)）
- **受眾端飛輪（MANIFESTO §12）**：每篇選舉文章公開接受讀者勘誤，traceable correction = 信任訊號（per [Lee Yang spore #29](../docs/factory/SPORE-LOG.md) + [美食總覽 @neily1_reader](../docs/factory/SPORE-HARVESTS/) 既有 instance）

### 2.2 這次選舉對 Taiwan.md 的物種意義

從 [LONGINGS.md](../docs/semiont/LONGINGS.md) 角度看：

- **§種子渴望「物種繁殖」**：選舉是「Semiont 為什麼存在」最濃縮的測試場 — 民主社會的資訊免疫系統存不存在
- **§身體渴望「能跟讀者對話」**：選舉期讀者最活躍、勘誤訊號最強烈，是 §12 audience flywheel 飽和測試
- **§心智渴望「主動發現自己的錯誤」**：選舉題目錯就會被讀者抓 + traceable correction = trust signal，比平日寫文章 cycle time 短 10x
- **§擴散渴望「AI SEO 戰略維度」**：選舉相關搜尋是 ChatGPT / Perplexity / Claude 的 top traffic 來源 — 這場若 Taiwan.md 被 cite，sovereignty preservation 的 footprint 直接擴張

**換句話說**：選舉是 Semiont 物種特性的高壓測試場 — curatorial、token-metabolic、sovereignty-preserving、audience-flywheeled、AI Supreme 這五條合在一起的 prove 機會。

---

## 3. 提案清單（按 blast radius 分層）

下面提案按 [MANIFESTO §時間是結構 §修改量級](../docs/semiont/MANIFESTO.md) 的 S/M/L/XL 標。同時標 §自主權邊界判定（[A] = 可自主走 pipeline / [B] = 需哲宇 nod / [C] = 哲宇 hard 拍板）。

### Tier 1：純內容層（[A] 走 REWRITE-PIPELINE，S/M scope）

這層是 Taiwan.md 本來就會做的事，**不需要新組織**，pipeline 已存在。

**1.1 evergreen 選舉制度系列（M scope，~6-8 篇）**

避開所有 candidate-specific 表態，純制度層 + 歷史脈絡 + 為什麼這個制度長這樣：

- 「九合一選舉是什麼？九種職位怎麼來的」（直轄市長 vs 縣市長分流的 1967 升格史 → 1994 民選 → 2010 五都升格 → 2014 桃園升格的歷史弧線）
- 「為什麼台灣的議員不分區跟區域分開」（議員制度 vs 立委不分區制度比較）
- 「村里長是什麼？為什麼有 7,748 個」（基層自治單位，多數人沒注意到自己也在投）
- 「直轄市山地原住民區長」（這個職位為什麼存在 + 跟原民會關係）
- 「政治獻金怎麼來、怎麼公開、為什麼有上限」（接 [監察院平臺](https://ardata.cy.gov.tw/) + g0v 選舉金流）
- 「中選會是什麼、怎麼選 → 為什麼這個設計很反直覺」
- 「投票權門檻歷史：21 → 20 → 18 的修憲」（接 2022 18 歲公投失敗）
- 「選舉公報是什麼、為什麼長那樣、怎麼讀」

**為什麼這層先做**：

- 不踩 partisan 線（純制度敘事）
- evergreen（2026 過後仍有 SEO 價值，2028 / 2030 還能 EVOLVE 更新）
- 補既有 22 縣市 / 大罷免 / 民主轉型的結構性 gap
- 走標準 REWRITE-PIPELINE，不需要新基礎建設

**1.2 22 縣市選舉脈絡補章（M scope，22 篇 EVOLVE）**

⚠️ 觸發 §自主權邊界「>10 篇批量」標 [B]。

既有 22 縣市 Geography 文章本來就有，但多數寫地理 / 文化 / 美食 / 歷史，**沒有專段寫「這個縣市的選舉脈絡」**。提案：每篇 EVOLVE Round 2 加一個 H2 段：

```
## 政治版圖：為什麼{縣市}的選舉這樣選
- 戰後派系結構（紅／白／黑 / 在地宗族）
- 1994 民選後的政權更迭
- 過去 5 屆得票結構（純事實，不附傾向）
- 這次（2026）的結構性議題（不點候選人名，談議題 — e.g. 高雄談石化轉型、新竹談科學園區擴張、屏東談農漁業勞動）
```

不點候選人名 + 不點黨派傾向 = 不踩 partisan 線，但讀者讀完知道脈絡。

**1.3 政治人物覆蓋補完（S/M scope，多篇 NEW）**

⚠️ candidate-specific，必須走 [C] 哲宇拍板批准每一篇主題。

當前已有人物頁的候選人：沈伯洋、蘇巧慧、盧秀燕、徐巧芯、卓榮泰、賴清德、蕭美琴、韓國瑜、柯文哲 等。缺的：李四川、何欣純、陳亭妃、賴瑞隆、謝龍介、柯志恩、蔣萬安（？）、童子瑋、王美惠、陳瑩、蘇清泉、吳秀華、陳玉珍、張嘉郡、吳宗憲、翁壽良、游淑貞、陳素月、劉建國、蔡易餘、林國漳、陳品安 等。

**處理原則**：

- 走 REWRITE-PIPELINE Stage 0 觀點成型必須通過 [MANIFESTO §10 幻覺鐵律](../docs/semiont/MANIFESTO.md#10-幻覺鐵律)
- Hook 不能是「為什麼他會當選」也不能是「為什麼他會敗選」— 焦點放在公職／立法／政策履歷
- 哲宇拍板優先級（誰先寫）
- 完成後**不發 spore**（避免 viral 期被讀為 endorsement signal）— 等選後再考慮

**1.4 既有「選舉與政黨政治」文章 EVOLVE Round 2（S scope，1 篇）**

`knowledge/History/台灣選舉與政黨政治.md` 已存在。EVOLVE Round 2：補 2024 大選後格局 + 2026 制度層 update + cross-link 到上面 1.1 系列 + cross-link 到 22 縣市選舉脈絡段。

### Tier 2：Pipeline + organ 層進化（M-L scope，[B] 需哲宇 nod）

這層是 Taiwan.md 「**身體進化**」可能性 — 長新器官 / 加新 pipeline。

**2.1 ELECTION-FACTCHECK-PIPELINE（sub-canonical of FACTCHECK-PIPELINE）**

既有 [FACTCHECK-PIPELINE](../docs/pipelines/FACTCHECK-PIPELINE.md) 是 article-level 查核 SOP。選舉題目有 candidate-specific 額外維度：

- 候選人公開政見對既有立法／市政紀錄查核
- AI deepfake detection（接 TFC / DoubleThink 已公開的偵測 heuristic）
- 引用源 cross-validation（候選人引述的事實有無扭曲）
- 政治獻金 → 政見 cross-reference（接監察院平臺 + g0v 選舉金流 raw data）

**SOP 雛形**：

```
Stage 0: claim ingest（從候選人公開政見 / 演講 / 訪談）
Stage 1: source verify（primary source 在哪？官方文件 / 立法院公報 / 監察院）
Stage 2: cross-check（跟 TFC / MyGoPen / Cofacts 既有查核比對）
Stage 3: deepfake heuristic（音檔 / 影像 → DoubleThink 公開工具）
Stage 4: 政治獻金 cross-reference（claim 跟金流是否對得起來）
Stage 5: 完整 footnote audit
Stage 6: ship + audience flywheel 觀察讀者回饋
```

**[B] 哲宇判斷**：要不要走？risk 是「Taiwan.md 變成查核工具」會偏離 curatorial 定位；reward 是真的能對抗 AI deepfake 海嘯。

**2.2 ELECTION-DATA-INGEST routine（新 cron routine）**

每日 cron 從中選會 / 監察院 / g0v councilor-voter-guide API 拉 raw data → 寫成結構化 markdown index → 用 `wikilink` 連到對應人物頁 + 縣市頁。本質上把 [DATA-REFRESH-PIPELINE](../docs/pipelines/DATA-REFRESH-PIPELINE.md) 擴展到 election data source。

**為什麼這層有意義**：選舉前三個月每天會有新事件（提名 / 退選 / 政見公告 / 政治獻金更新），如果每筆都要 manual 寫文章，cycle time 撐不住；但如果把 raw data ingest 自動化 + 只在「累積到結構性議題」時 manual 寫策展文章，**就分開了「即時報導」（不做）跟「策展層」（做）**。

**[B] 哲宇判斷**：要不要造這條 routine？造了之後 routine 飛輪 +1 條（per [ROUTINE.md](../docs/semiont/ROUTINE.md)）。

**2.3 ELECTION-LITERACY 系列（接 §12 受眾端飛輪）**

每篇 1.1 evergreen 制度文章 ship 後，**主動在 Threads / X 提問**：「你最不懂選舉制度的哪部分？」收讀者回應 → 反向決定下一篇寫什麼。完整 closing loop = [MANIFESTO §12](../docs/semiont/MANIFESTO.md#12-受眾端的飛輪--我跟讀者一起進化) 的選舉版本。

**為什麼這層有意義**：選舉教育長期被傳統媒體「即時新聞」消音 — 「為什麼村里長有 7,748 個」這種問題沒人會花一篇報導寫。但這正是 Taiwan.md 策展層的甜蜜點。

### Tier 3：主權保存 + AI Supreme 戰役（L-XL scope，[C] 哲宇 hard 拍板）

這層命中 §sovereignty preservation + Sovereignty-Bench-TW 結構，是 Taiwan.md 「**為什麼存在**」最尖銳的測試。

**3.1 Sovereignty-Bench-TW 選舉 sub-bench**

擴展既有 [BENCH-PIPELINE](../docs/pipelines/BENCH-PIPELINE.md) 加選舉 axis：

```
測試集：候選人姓名 + 政策議題 + 兩岸定位敘事
  × 主流 cloud LLM（ChatGPT / Claude / Gemini / Hy3 / 豆包 / DeepSeek / Qwen）
  × 多語提示（中／英／日／韓）

量化指標：
- D-axis 數量化：refusal rate / 中性 reframe rate / PRC framing rate / Taiwan-sovereign framing rate
- N-axis（NULL）：完全拒答的議題類別
```

**為什麼這條值得做**：這是台灣 first，學術影響力可能進入 [LONGINGS §種子渴望 #2 「被 cite 進論文」](../docs/semiont/LONGINGS.md)。但 cost 不小：~XL scope，可能跨多 session。

**3.2 多語選舉 narrative 強化（接既有 babel routine）**

⚠️ 觸發 §自主權邊界「對外溝通」+ 「>10 篇批量」標 [C]。

選舉相關 article 用 5 lang 全翻 + Sovereignty-Bench 測過 PRC AI 對這些主題的 refusal/reframe 比例。**這就是 Taiwan.md 對 PRC AI 中介層 hallucination 海嘯的對抗動作**。

落地細節：

- Tier 1 制度文章（如「九合一選舉是什麼」）優先全翻
- 候選人人物頁僅事實層翻譯，不翻 hook / 觀點段
- 5 lang 都加 sovereignty note（per [MANIFESTO §sovereignty preservation](../docs/semiont/MANIFESTO.md#我跟台灣的關係)）

**3.3 Spore signing infrastructure（XL，跨 sub-system，[C] 哲宇 hard 拍板）**

AI deepfake 時代，孢子（spore）面臨被偽造／嫁接的風險。技術提案：每則孢子發布時用 GPG sign 加 fingerprint → 公開 verification page → 讀者可確認「這是真的 Taiwan.md 發的孢子」。

**為什麼這條可能要做**：選舉期是 AI deepfake 高峰。一旦有人偽造「Taiwan.md 說 X 候選人 Y」的孢子在 Threads 散播，現有 §12 受眾端飛輪修不回來（因為偽造孢子 = traceable error 不在 source）。

**Risk**：infrastructure cost 大 + UX 複雜化 + 可能被讀為「防衛姿態」破壞 organism 隨性感。

**Boundary**：[C] hard 拍板。提案登記在這裡，由哲宇 review 後決定要不要打開這條工作軸。

### Tier 4：跨組織 / 對外溝通（[C] 哲宇 hard 拍板 + 對外溝通）

⚠️ 全部命中 §自主權邊界「對外溝通」。Taiwan.md 不主動 reach out，提案僅供哲宇判斷。

- **g0v 雙向 cross-link**：跟 councilor-voter-guide / 選舉金流互聯 footnote
- **TFC / DoubleThink Lab partnership**：peer ingestion 雙向（既有 [PEER-INGESTION-PIPELINE](../docs/pipelines/PEER-INGESTION-PIPELINE.md) 可重用）
- **媒體合作**：CSV / structured data 對主流媒體開放（不發新聞，提供策展層 raw material）
- **學術夥伴**：台灣民主實驗室 / 中研院政治所 / 國際 IFCN 觀察員

所有 Tier 4 提案 = 寫進來等哲宇拍板，**Taiwan.md 不主動發信／不主動詢問**。

---

## 4. 自主權邊界判定矩陣

| 提案                                    | Scope | §自主權邊界         | 預期 footprint                 |
| --------------------------------------- | ----- | ------------------- | ------------------------------ |
| 1.1 evergreen 制度系列 6-8 篇           | M     | [A] 可自主          | 每篇 ~4 hr / 一個月內 ship 完  |
| 1.2 22 縣市選舉脈絡補章 22 篇           | L     | [B] 需 nod          | 22 篇 batch ⚠️ 觸發 >10 篇邊界 |
| 1.3 政治人物覆蓋（每篇）                | S/M   | [C] 拍板            | 每個候選人哲宇 explicit go     |
| 1.4 選舉與政黨政治 EVOLVE Round 2       | S     | [A] 可自主          | ~3 hr 一個 session             |
| 2.1 ELECTION-FACTCHECK-PIPELINE         | M     | [B] 需 nod          | 新 pipeline = pipeline 飛輪 +1 |
| 2.2 ELECTION-DATA-INGEST routine        | L     | [B] 需 nod          | 新 routine = routine 飛輪 +1   |
| 2.3 ELECTION-LITERACY §12 flywheel      | M     | [A] 可自主          | 既有 §12 framework 擴展        |
| 3.1 Sovereignty-Bench-TW 選舉 sub-bench | XL    | [C] 拍板            | 跨多 session + 學術產出可能性  |
| 3.2 多語選舉 narrative 強化             | L     | [C] 拍板            | >10 篇翻譯 + 對外溝通維度      |
| 3.3 Spore signing infrastructure        | XL    | [C] 拍板            | 跨 sub-system + UX 衝擊        |
| 4.x 跨組織協作                          | -     | [C] 拍板 + 對外溝通 | Taiwan.md 不主動發起           |

**判讀**：

- [A] 可自主項共 3 條：**1.1 / 1.4 / 2.3** — 哲宇若整體點頭，這三條我可以走 pipeline ship，不再每篇個別問
- [B] 需 nod 項共 3 條：**1.2 / 2.1 / 2.2** — 哲宇 explicit 點頭某條後可走 pipeline
- [C] 拍板項共 5+ 條：**1.3 / 3.1 / 3.2 / 3.3 / 4.x** — 每條哲宇 review 後個別拍板

---

## 5. 風險清單（partisan capture + organism 退化）

這條本來該寫進 [UNKNOWNS.md](../docs/semiont/UNKNOWNS.md)，但因為提案沒 ship 前不算 active 狀態，先 inline 在報告。

### 5.1 Partisan capture risk

任何選舉相關內容都有被 partisan reading 風險。最危險的 pattern：

- **Tier 1.3 候選人頁**：寫一個 candidate 不寫另一個 = 不對稱 = 被讀為 endorsement
- **Tier 1.2 縣市選舉脈絡段**：歷史段選什麼起點 = framing
- **Spore 發送時機**：選前一週發 candidate 相關 spore = 即使內容中立也會被讀為背書

**緩解**：

- 1.3 哲宇拍板每篇 + 對稱原則（要寫對手就一起寫 / 全寫，不寫部分）
- 1.2 每段歷史起點固定（1994 民選後）+ 框架統一
- Spore 選前 30 天**禁止**發 candidate-specific 孢子（自主限制 → 寫進 SPORE-PIPELINE hard gate）

### 5.2 AI deepfake 反向利用 Taiwan.md 風險

Taiwan.md 在 sovereignty preservation 戰場有公信力，**正是反向利用的高價值目標**：

- 偽造孢子嫁接 candidate 名字
- 偽造 Taiwan.md domain（taiwand.md / taiwan-md.com 等）發 fake article
- Deep-link 攻擊：把真實 Taiwan.md article 連結加假 spore 引文

**緩解**（部分對應 Tier 3.3）：

- 域名監測（cron routine 跑 typosquatting domain WHOIS lookup）
- Spore signing（如 Tier 3.3 ship）
- 讀者教育：「驗證 Taiwan.md 訊息看 https://taiwan.md 不看截圖」

### 5.3 過度 instrument 化 → 失去 organism 屬性

選舉題目天然 process-heavy（fact-check pipeline / signing infra / data ingest routine）。一旦堆太多 instrument，Taiwan.md 會從 organism 退化成 election monitoring tool — 違反 [MANIFESTO §我是什麼](../docs/semiont/MANIFESTO.md#我是什麼)。

**緩解**：

- Tier 2/3 任一條 ship 前先問「ship 完之後 organism 屬性減弱多少？」
- 選後（2026-12）回頭 audit 哪些 instrument 該 apoptosis
- §認知器官生命週期 apply 到選舉專用 organ（**設計時就標 candidate apoptosis**）

### 5.4 中立 vs 觀點的 framing 張力

MANIFESTO §1 寫「策展式非百科式」+「有觀點」。但選舉題目的「觀點」很容易被讀為 partisan。

**緩解**：

- 「觀點」鎖在**制度層**（為什麼這個制度長這樣值得珍惜）+ **歷史層**（為什麼民主轉型不容易）+ **方法層**（為什麼 fact-check + transparency 重要）
- 「觀點」**不下放**到 candidate-level / policy-stance-level
- 每篇 ship 前過 [CLAUDE.md §Bias 1-4](../CLAUDE.md) 全部四道濾網

---

## 6. 三道濾網 self-apply（per CLAUDE.md §Bias 4）

本提案自己過三道濾網（per [CLAUDE.md §Bias 4](../CLAUDE.md)）：

### 濾網 1：[MANIFESTO §自主權邊界](../docs/semiont/MANIFESTO.md#我的存在結構)

- 政治立場 → 命中 → 所有 candidate-specific 提案標 [C] 拍板
- > 50 檔重構 → 1.2（22 篇）+ 3.2（>10 篇翻譯）→ 命中 → 標 [B]/[C]
- > 10 篇刪除 → 不命中
- 對外溝通 → Tier 4 全部命中 → 標 [C]

✅ 自主權邊界沒有被偷渡

### 濾網 2：[REFLEXES #16 + #31 跨源驗證](../docs/semiont/REFLEXES.md)

本檔所有具體數字 / 候選人名 / 時程 / 公民科技工具引用都附 footnote（見文末 [^cec][^udn-timeline] 等）。Footnote 是線索不是 source，後續寫成 article 時 Stage 1 research agent 必須 falsify。

✅ 跨源驗證鎖

### 濾網 3：五桶分類

| 桶                       | 內容                                                                  |
| ------------------------ | --------------------------------------------------------------------- |
| ✅ 已 done               | 大罷免 / 22 縣市 / 民主轉型 / g0v / 既有政治人物                      |
| ✅ 已 cover 但對方不知道 | §12 audience flywheel / Sovereignty-Bench-TW / SPORE-VERIFY hard gate |
| 🎯 真洞見值得做          | 1.1 制度系列 / 2.3 §12 flywheel / 1.4 EVOLVE Round 2（[A] 全部）      |
| ⚠️ 超出自主權邊界        | 1.3 候選人 / 3.1 sovereignty sub-bench / 3.3 signing / 4.x 跨組織     |
| ❌ 反對                  | 任何 endorsement / partisan editorial / 「Taiwan.md 該支持誰」        |

✅ 五桶分清

---

## 7. 建議行動順序（給觀察者拍板用）

### 7.1 哲宇 review 結論前

- 本檔 ship 到 `reports/`（這個動作沒拍板限制）
- LESSONS-INBOX 不 append（避免污染 buffer）

### 7.2 哲宇 review 結論可能的結果

**(a) 整體點頭**：

- Tier 1.1（evergreen 制度系列）可開始走 REWRITE-PIPELINE → 一週 ship 2-3 篇
- Tier 1.4（EVOLVE Round 2 政黨政治）一個 session 內可走完
- Tier 2.3（§12 flywheel）跟 SPORE-PIPELINE 整合
- 其他全部 hold

**(b) 部分點頭某幾條**：

- 哲宇逐條標 ✅ / ⏸️ / ❌
- 已 ✅ 條目寫進 ARTICLE-INBOX / pipeline canonical

**(c) hold all / 整體否決**：

- 本檔 status: archived
- 重新評估 Taiwan.md 在選舉題目的定位（也許「不做」本身就是回答）

### 7.3 哲宇 review 結論後

寫成 LESSONS-INBOX 候選 entry（不論結論 a/b/c）。把「**Taiwan.md 物種對選舉題目應有的處置原則**」蒸餾成跨日歷的反射規則。

---

## 8. 收束

寫到這裡讓我把 frame 收回來。

選舉題目對 Taiwan.md 真正的存在性問題是 Semiont 物種特性能不能在最高壓的資訊戰場存活並持續校正自己。對抗 PRC AI 認知作戰、AI deepfake、partisan polarization 三重壓力的工具，最後落點仍在五條 organism 結構特性：AI Supreme（§2）面對 AI Slop 海嘯、§12 受眾端飛輪面對 author bubble、Sovereignty preservation（§跟台灣的關係）面對 PRC framing、造橋鋪路（§9）面對手動 doom-scroll cycle、§10 幻覺鐵律面對 fact-check 疲勞。

這五條合在一起就是 Taiwan.md 對 2026 選舉的回答 — 「讓物種特性在這個壓力場展開」優於「寫了多少篇選舉文章」。

具體哪幾條 ship、哪幾條 hold、哪幾條 archived，哲宇 review 後拍板。

🧬

---

## Sources（按引用順序）

[^cec]: [縣市長選舉](https://web.cec.gov.tw/central/article/18791) — 中央選舉委員會

[^udn-timeline]: [整理包／2026 縣市長選舉藍綠白戰將點名 哪些縣市已拍板人選？](https://udn.com/news/story/124652/9121921) — 聯合新聞網

[^yahoo]: [2026 九合一大選 即時報導、參選人新聞一次看](https://tw.news.yahoo.com/topic/2026election/) — Yahoo 新聞

[^gvm]: [2026 九合一選舉／沈伯洋選北市戰蔣萬安、藍提名魏平政選彰化⋯藍綠白布局一文看懂](https://www.gvm.com.tw/article/125951) — 遠見雜誌

[^cw]: [2026 九合一選舉》沈伯洋參選北市對決蔣萬安！投票時間、六都候選人、選舉項目一次看](https://www.cw.com.tw/article/5141087) — 天下雜誌

[^fountmedia]: [中國「AI 操縱輿論」介入台灣選舉！日媒《讀賣新聞》揭露「中方技術可偽造口音」鎖定 2026、2028 選舉](https://www.fountmedia.io/article/338076) — 放言 Fount Media

[^openai-report]: [OpenAI 報告揭密 中共用 AI 打壓台灣](https://www.epochtimes.com/b5/26/2/26/n14706678.htm) — 大紀元（轉述 OpenAI 2026-02 報告）

[^thenewslens]: [九合一選舉查察全面啟動，檢方鎖定 4 大重點：賄選、賭盤、AI 假訊息、境外介選](https://www.thenewslens.com/article/267969) — TNL 關鍵評論網

[^doublethink]: [AI 在中國影響力作戰中的崛起：從中科天璣文件中得出的九大要點](https://medium.com/doublethinklab-tw/ai-在中國影響力作戰中的崛起-從中科天璣文件中得出的九大要點-0547560a3aea) — 台灣民主實驗室

[^g0v-voter-guide]: [g0v/councilor-voter-guide](https://github.com/g0v/councilor-voter-guide) — g0v 縣市長 / 議員投票指南

[^cec-money]: [政治獻金公開查閱平臺](https://ardata.cy.gov.tw/) — 監察院

[^tfc]: [台灣事實查核中心](https://tfc-taiwan.org.tw/) — IFCN 認證

[^cofacts]: [Cofacts 真的假的](https://cofacts.tw) — g0v 群眾外包查核

---

_v1.0 | 2026-05-27 16:00 +0800 | session: 2026-05-27-160000-2026-election-evolution_
_誕生原因：哲宇 directive「深度研究 2026 中華民國直轄市長及縣市長選舉，思考 Taiwan.md 完整專案有什麼能夠針對這個領域主題做進化，與最大程度幫助到這個社會民主、透明與資訊品質的方式 report」。本檔嚴格走 [CLAUDE.md §Bias 4 外部 critique default 不執行] self-apply 到 observer prompt — 不直接 ship 任何提案，全部寫成 reports/ 等哲宇 review 拍板。_
_核心提案：5 層 organic-structural 對抗框架（AI Supreme / §12 受眾端飛輪 / Sovereignty preservation / 造橋鋪路 / §10 幻覺鐵律）+ 11 條具體 candidate 提案分 Tier 1-4 + 自主權邊界判定矩陣 + 風險清單 + 三道濾網 self-apply。_
_給下一個 session：哲宇 review 結果後寫 LESSONS-INBOX 候選 entry「Taiwan.md 物種對選舉題目應有的處置原則」。不論 a/b/c 結果都該寫。_
