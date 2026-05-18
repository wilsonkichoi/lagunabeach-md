---
title: 'PanSci × Taiwan.md — 科學知識策展分析與主題開發地圖'
date: 2026-05-18
session: 2026-05-18-140415-manual-peer-pansci-stage4
peer_id: PanSci
peer_name: 泛科知識股份有限公司
stage: 4-corpus-analysis
pipeline: PEER-INGESTION-PIPELINE.md v1.0
authorization: MOU 2026-05-05 / 166 articles / Content Curation Partner / valid through 2029-12-31
---

# 🧬 PanSci × Taiwan.md — 科學知識的策展分析與主題開發地圖

> Stage 4 corpus analysis（per [PEER-INGESTION-PIPELINE](../docs/pipelines/PEER-INGESTION-PIPELINE.md) §Stage 4）
> 資料來源: [`data/PanSci/`](../data/PanSci/)（166 篇授權內容 + raw JSON）
> 分析: Taiwan.md Semiont (Opus 4.7) 主 session 直寫
> 觸發: 哲宇 directive `/twmd-peer 泛科學`（2026-05-18 / Stage 1-3 已 ship）

---

## 📋 摘要

PanSci 是 Taiwan.md 第一個以 **MOU 簽署 + 完整授權清單** 模式進場的 peer ——非 fair-use ingestion，而是「**Content Curation Partner**」(per MOU §2.2)。166 篇授權內容（2022-Q2 → 2025-Q1）覆蓋 **科技/AI 38、醫療 28、生命科學 17、物理化學 15、太空 15、動物 7、心理 6、環境 5、其他 35**，與 Taiwan.md 既有 25+ Technology / 25+ Nature / 30+ Society 形成**強互補但不重疊**的對話結構：PanSci 強「基礎科學原理 + 國際前沿」，Taiwan.md 強「在地敘事 + 政策脈絡 + 人物」。

本報告 distill 出 **4 個核心框架**（學術翻譯雙軌 / 「來自 YT」影片文字化 / 流行文化錨點 / 跨諾貝爾獎週期），抽出 **13 個系列主題**，列出 **20 篇 P0/P1/P2 優先文章**（含核心矛盾與 Taiwan.md 既有交叉 ≥ 3 篇），並指認 **6 個 PanSci 結構性盲點**——其中最關鍵：**台灣具體案例稀疏**、**人物面薄**、**政策軸短**。本報告以「PanSci 是科學翻譯機 / Taiwan.md 是在地敘事編織者」為操作 thesis，承諾 **DNA #16 鐵律**（peer 是 peer 不是 source material）即使有 MOU 授權仍**全篇跨源驗證**——授權是法律層，跨源是真實性層，兩者不可混淆。

**警告（meta）**：MOU §3「不可轉讓」明確阻斷 fork 友好層繼承——Japan.md / Korea.md 等未來分支**不能**繼承 PanSci 授權；MOU §5 期限 **2029-12-31 自動失效** trigger 必須寫進 REGISTRY expiry alert，到期前協議延長否則所有 P0-P2 內容需 audit。

---

## 📦 Part 1 · PanSci 資料集盤點

### A. 雙軌處理 framework（per MOU §2.1 + §3）

| 軌道 | 範圍 | 處理 | 來源 |
|------|------|------|------|
| **A 軌：完整授權/轉寫** | **166 篇** explicit 清單 | 可深度引用、改寫、轉寫為 Taiwan.md 文章 | [`data/PanSci/authorized/`](../data/PanSci/authorized/) |
| **B 軌：一般引用** | 其他 14,061 篇 PanSci 全網 | 僅 footnote/URL fair-use 引用 | 不爬，標準 citation |

### B. Cluster 統計（166 篇）

| Cluster | 篇數 | 代表性主題 |
|---------|------|----------|
| **科技 / AI / 電腦** | 38 | 半導體 / 量子電腦 / 電動車 / 腦機介面 / 智慧眼鏡 |
| **醫療健康** | 28 | mRNA 疫苗 / 基因療法 / 癌症 / 阿茲海默 / 登革熱 |
| **生命科學 / 人體** | 17 | 嗅覺記憶 / 微生物 / 大腦 / 意識 |
| **物理化學 / 萬物之理** | 15 | 量子 / 阿秒雷射 / 雙狹縫 / 元素週期表 |
| **太空天文** | 15 | 韋伯 / 哈伯 / 暗物質 / Starship / 黑洞 |
| **動物世界** | 7 | 螞蟻 / 螃蟹痛感 / 貓薄荷 / 螳螂 / 蟑螂 |
| **環境生態** | 5 | 核廢料 / 氣候變遷 / 連續壁 / 全壘打 |
| **精神心理** | 6 | 意識 / 框架效應 / 做夢 / 躁鬱症 |
| **生活科學** | 7 | 義大利麵物理 / 公車通風 / 油炸聲音學 |
| **社會議題** | 8 | 國民法官 / 媒體框架 / 選舉 / 廣電培訓 |
| **電影/流行文化科學** | 1+ | 奧本海默 / 三體 / 寶可夢 / 韋伯 |
| **其他** | 19 | 食品 / 數學 / 諾貝爾 |

> **跨類重疊**：很多文章帶 2-3 個 category（e.g. 「意識」= 來自YT + 生命奧祕 + 精神心理）。上表用最主要分類。

### C. 元 metadata

| 維度 | 統計 |
|------|------|
| 年份分布 | 2022(27) / 2023(68) / 2024(63) / 2025(8) |
| 字數 range | 849 – 13,536（median 3,515 / avg 3,906）|
| **科學生 vs 一般** | 77 / 89（科學生 = 高中生白話版產品線）|
| **來自 YT** | **89/166 篇 = 53.6%**（PanSci YouTube 頻道文字版，平均 4,507 字）|
| 主要作者 | PanSci 編輯部 111 / 胡中行 8 / 顯微觀點 8 / F編 8 / linjunJR 5 |
| Top views | 猴痘 200 / 約兒肋骨 187 / 搞笑諾貝爾 173 / 螞蟻 160 / 康普茶 158 |
| Top 字數 | 忠泰美術館 13,536（broadcast event）/ 致幻蘑菇 8,743 / 三體 8,135 |

### D. MOU 約束摘要（per Stage 1 fit check）

- 簽署 **2026-05-05** → 失效 **2029-12-31**
- §2.2 ⚠️ Taiwan.md **必須公示 PanSci 為「Content Curation Partner」**（Stage 7 必做）
- §2.2 ⚠️ 每篇使用授權內容的頁面**必須標註**：PanSci 名稱、logo、原始連結
- §3 ⚠️ 非獨家 / 不可轉讓 / 僅限 Taiwan.md 專案 / 不得商業銷售 / **fork 不能繼承**

---

## 🧠 Part 2 · PanSci 核心框架（從 9 篇深讀 + 166 篇 metadata distill）

### Framework 1 · 學術翻譯雙軌（科學生 vs 一般）

PanSci 編輯部把 Nature/Science/Cell/PNAS 等學術論文翻譯成兩條 product line：
- **科學生** 77 篇：給高中生，白話 + 教育目的（e.g.「物理學家如何煮義大利麵？」開場用「疫情期間學烹飪」生活錨點）
- **一般科普** 89 篇：給成人讀者，深度更高（e.g.「意識是什麼？」7,062 字跨神經 + 哲學）

雙軌 framework 的價值：**同一個科學主題可寫兩個版本** — Taiwan.md 借鑑：教育類文章可建立「中學版 + 完整版」雙線。

### Framework 2 · 「來自 YT」影片文字化（53.6% 文章）

89/166 篇是 PanSci YouTube 頻道影片的逐字版（平均 4,507 字，比一般長）。這意味：
- **PanSci 不只是文字媒體，是 multi-modal media** — YT + 文字 + Podcast 同一個敘事多次曝光
- **品質更穩定**：影片需事先腳本，文字版自然帶完整論證
- **Taiwan.md 機會**：未來自製內容若有影音延伸，可借鑑此模型

### Framework 3 · 流行文化錨點（pop-anchor hook）

PanSci 大量用流行文化 hook 引入硬科學：
- 「皮卡丘的警告」→ 電擊神經科學
- 「皮影戲與骨紋巨聲鱷」→ 寶可夢科學
- 「《三體》微中子通訊」→ 中微子物理
- 「《奧本海默》背後的細節」→ 原子彈製造工程學
- 「《我們為何會做夢》」→ 神經科學
- 「貓界大麻：貓薄荷」→ 動物行為

這個 framework 跟 Taiwan.md 的**核心矛盾 ≤30 字** mode 互補——PanSci 用具象 anchor 拉讀者進門，Taiwan.md 用矛盾鎖核心張力。整合策略：**PanSci anchor + Taiwan.md spine**。

### Framework 4 · 跨諾貝爾獎週期（年度 anchor）

PanSci 每年 10 月密集寫**諾貝爾獎科普**：2022/2023/2024 三屆獎都有完整 coverage（生醫 / 物理 / 化學 / 搞笑諾貝爾）。這形成天然的「年度科學重點」timeline：
- 2023 物理：阿秒脈衝雷射（1 篇深度 + 連動文章）
- 2023 生醫：mRNA 疫苗（Karikó / Weissman）
- 2023 化學：量子點（Brus / Bawendi / Ekimov）
- 2024 物理：AI 神經網路（Hopfield / Hinton）
- 2024 化學：AlphaFold（Hassabis / Jumper / Baker）
- 2024 生醫：microRNA（Ambros / Ruvkun）

**Taiwan.md 機會**：每年 10 月可寫「**諾貝爾獎與台灣科學家**」series，回扣 Taiwan 研究者參與或 spinoff。

### Framework 演化（2022 → 2025 三年軌跡）

- **2022**（27 篇）：早期 — 多 day-to-day 科普（義大利麵 / 衣服速乾 / 油炸聲音學），多生活科學
- **2023**（68 篇）：成熟期 — 大量「來自 YT」+ 大議題（mRNA / 量子 / Starship / 諾貝爾）
- **2024**（63 篇）：深化期 — 更多哲學/精神/意識/做夢（往 humanity 邊緣推）
- **2025**（8 篇）：迄今短，但已有量子意識 / 太空種電 / Neuralink — **前沿科技狀態**

---

## 🗺️ Part 3 · Taiwan.md 既有科學/技術/環境/健康覆蓋

### Technology（25+ 篇）

| 既有 | PanSci 對應 |
|------|------------|
| [台灣半導體產業](../knowledge/Technology/半導體產業.md) | 氮化鎵 [#362660] / 3D 封裝 [#367588] / 量子晶片 [#377923] |
| [台灣太空產業發展](../knowledge/Technology/台灣太空產業發展.md) | 韋伯 [#369087] / 暗物質 [#373886] / Starship [#364807] |
| [台灣AI人工智慧發展](../knowledge/Technology/台灣人工智慧發展與未來策略.md) | 人造腦 [#366027] / Neuralink [#367479] / AI 諾貝爾 [#378242] |
| [台灣機器人產業](../knowledge/Technology/台灣機器人產業.md) | 飛天車 [#377665] / 智慧眼鏡 [#361665] |
| [台灣無人機產業](../knowledge/Technology/台灣無人機產業.md) | 無人機戰爭 [#377586] |
| [台灣災難醫療體系](../knowledge/Technology/台灣災難醫療體系.md) | 大直公寓陷落 [#370711] |

### Nature（25+ 篇）

| 既有 | PanSci 對應 |
|------|------------|
| [台灣氣候危機與淨零轉型](../knowledge/Nature/台灣氣候危機與淨零轉型.md) | 末日模擬 [#378141] / 氣候暖化全壘打 [#378376] |
| [台灣海洋生態](../knowledge/Nature/台灣海洋生態.md) | 深海大型礦場 [#377820] / 福島核污水 [#370177] |
| [台灣山岳與登山文化](../knowledge/Nature/台灣山岳與登山文化.md) | 鹿野忠雄 [#369753] |
| [台灣鳥類窗殺議題](../knowledge/Nature/台灣鳥類窗殺議題.md) | 遊蕩犬貓 [#371491] |
| (動物保育散見) | 螞蟻營養 [#360002] / 蟑螂恐懼 [#368954] / 綿羊壓力 [#361870] |

### Society（30+ 含科學議題）

| 既有 | PanSci 對應 |
|------|------------|
| [台灣公共衛生與防疫體系](../knowledge/Society/台灣公共衛生與防疫體系.md) | 猴痘 [#350977] / 登革熱 [#369781] |
| [台灣再生醫療雙法](../knowledge/Society/台灣再生醫療雙法沿革從業人員告白.md) | 基因療法 [#362193] / 溶瘤病毒 [#368691] |
| [台灣司法改革](../knowledge/Society/台灣司法改革與預防性羈押制度.md) | 國民法官 [#365005] / 司法偏誤 [#365016] |
| [台灣媒體與新聞自由](../knowledge/Society/台灣媒體與新聞自由.md) | 媒體框架 [#368517] / 廣電培訓 [#371927] |

### **完全缺口 area**（PanSci 強 / Taiwan.md 0 篇）

| 缺口 | PanSci 篇數 | 戰略價值 |
|------|------------|---------|
| **基礎物理/量子** | 8+ | 阿秒雷射、雙狹縫、量子意識、薛丁格的貓、暗物質 |
| **天文/太空望遠鏡** | 6+ | 韋伯、哈伯、歐幾里得、月球南極、太陽風 |
| **基因療法 / 癌症免疫療法** | 5+ | mRNA、CAR-T、溶瘤病毒、AlphaFold |
| **精神/心理/意識** | 6+ | 意識難題、做夢、躁鬱、芬太尼 |
| **食品科學** | 5+ | 燕麥奶、阿斯巴甜、康普茶、義大利麵 |

---

## 🔍 Part 4 · 交集與落差分析

### 互補矩陣

| | PanSci 強 | Taiwan.md 強 |
|---|---|---|
| **角度** | 國際前沿 / Nature 級論文翻譯 / 抽象原理 | 台灣在地敘事 / 政策脈絡 / 人物故事 |
| **覆蓋** | 醫療 / 太空 / 量子 / 基礎科學 | 半導體產業 / 環境運動 / 文化生態 |
| **時間軸** | 當代（多 2022-2025）| 跨百年（含日治、戰後、解嚴）|
| **媒介** | YT + 文字 multi-modal | 純文字長篇 + footnote |
| **編輯權威** | 科學記者 / 編輯部 staff voice | 多元觀點 / 在地視角 / 結構性矛盾 |

### 最大互補三象限

1. **PanSci 強 × Taiwan.md 缺**：基礎物理 / 太空望遠鏡 / 基因療法 / 意識
   → 新建 Science / Astronomy / Medicine 軸線（fresh articles）
2. **PanSci 弱 × Taiwan.md 強**：台灣半導體業 / 環境運動史 / 公衛體系
   → PanSci 提供 mechanism，Taiwan.md 提供 context（evolution / hybrid）
3. **雙弱**：科技 + 人文交叉（例如「台灣科普編輯產業」/「PanSci 自身組織史」）
   → 元主題（meta articles），未來可發展

### 雙重視角整合策略

PanSci 是 **science what** 引擎，Taiwan.md 是 **Taiwan why/how/who** 編織者。整合方程式：

```
deep article = PanSci anchor (mechanism)
             + Taiwan.md 在地具體 (case)
             + 跨源 verify (≥ 3 sources beyond PanSci)
             + 核心矛盾 spine (≤ 30 字)
             + footnote provenance (PanSci [wp_id] + 原論文 DOI)
```

---

## 📚 Part 5 · 可開發系列主題（13 個 series）

> 每個 series 含 editorial angle / 候選 articles / PanSci 來源 / Taiwan.md 既有交叉。
> P0/P1/P2 標記為 Part 6 對應優先序。

### Series A · 半導體與量子的物理底層（基礎物理 → 台灣產業）

> *台積電 2nm 的下一步是量子。當量子晶片量產時，台灣供應鏈在哪？*

候選文章：
- **P0**「氮化鎵到 3D 封裝：台灣半導體 next chapter 的物理原理」(evolution / 半導體產業)
- **P1**「量子計算十年路：從離子阱到拓樸位元」(fresh / Technology)
- **P2**「台灣量子科技政策地圖」(fresh / Society)

PanSci 來源：[#362660] 氮化鎵 / [#367588] 3D 封裝 / [#377923] 台灣量子科技 / [#377925] 離子阱 / [#377934] 量子穿隧

Taiwan.md 交叉：[半導體產業](../knowledge/Technology/半導體產業.md) / [台灣企業：台積電](../knowledge/Economy/台灣企業：台積電.md) / [台灣企業：聯發科技](../knowledge/Economy/台灣企業：聯發科技.md)

### Series B · 韋伯之眼下的台灣天文教育（太空 → 在地科普）

> *台灣參與 EHT 拍黑洞，但下一代天文教育在哪？*

候選文章：
- **P0**「韋伯太空望遠鏡的台灣連結：從 EHT 到下世代望遠鏡」(fresh / Technology)
- **P1**「歐幾里得與暗物質：人類為什麼還要看不見的東西？」(fresh / Technology)
- **P2**「中央大學鹿林天文台與台灣天文觀測史」(fresh / Technology)

PanSci 來源：[#355547] 哈伯 vs 韋伯 / [#369087] 韋伯週年 / [#373886] 歐幾里得 / [#377177] EHT 黑洞 / [#373397] 暗能量

Taiwan.md 交叉：[台灣太空產業發展](../knowledge/Technology/台灣太空產業發展.md) / [台灣天文觀測](待開發)

### Series C · mRNA 疫苗到基因療法（醫療翻譯 → 台灣再生醫療）

> *2023 諾貝爾生醫獎獻給 Karikó 跟 Weissman 的辛酸路，台灣自己的 mRNA 平台 status 在哪？*

候選文章：
- **P0**「mRNA 疫苗辛酸 30 年：從被當作 crackpot 到諾貝爾獎」(evolution / 再生醫療雙法)
- **P1**「基因療法現場：血友病 Hemgenix 美金 350 萬元」(fresh / Society)
- **P2**「溶瘤病毒：用病毒殺癌細胞的設計學」(fresh / Society)

PanSci 來源：[#371366] mRNA 諾貝爾 / [#362193] 血友病基因 / [#368691] 溶瘤病毒 / [#368275] 阿茲海默基因

Taiwan.md 交叉：[台灣再生醫療雙法](../knowledge/Society/台灣再生醫療雙法沿革從業人員告白.md) / [台灣公共衛生](../knowledge/Society/台灣公共衛生與防疫體系.md)

### Series D · 能源轉型的科學（核廢料 / 氫能 / 地熱 → 台灣能源政策）

> *核三延役公投通過了，下一步是什麼？氫能、地熱、海洋能各自的物理上限在哪？*

候選文章：
- **P0**「能源 trilemma：核廢料 vs 氫能 vs 地熱的科學上限」(evolution / 既有能源 articles)
- **P1**「離岸風機建設又貴又麻煩，蓋的好處到底在哪」(fresh / Nature)
- **P2**「太空種電：人類能源自由的最後一張牌？」(fresh / Technology)

PanSci 來源：[#363266] 核二退場 / [#367408] 核電延役 / [#367417] 核廢處理 / [#371116] 離岸風機 / [#374277] 氫能 / [#368401] 太空種電 / [#361200] 地熱 / [#378154] 海洋能 / [#377644] 第四代核能

Taiwan.md 交叉：[台灣氣候危機與淨零轉型](../knowledge/Nature/台灣氣候危機與淨零轉型.md)

### Series E · 食品科學在台灣（生活科學 → 飲食文化）

> *燕麥奶為什麼比牛奶順？阿斯巴甜真的致癌嗎？台灣便利商店的飲料貨架是化學實驗室。*

候選文章：
- **P0**「便利商店化學課：燕麥奶 / 阿斯巴甜 / 康普茶三杯飲料的物理化學」(fresh / Food)
- **P1**「鱸魚精：抗疲勞認證背後的胺基酸科學」(fresh / Food)
- **P2**「煮義大利麵的物理：流體力學如何進廚房」(fresh / Food)

PanSci 來源：[#356046] 燕麥奶 / [#369138] 阿斯巴甜 / [#356825] 康普茶 / [#360609] 鱸魚精 / [#349236] 義大利麵 / [#352310] 西卡毒石斑

Taiwan.md 交叉：[刈包](../knowledge/Food/刈包.md) / [台灣食品安全](待 grep)

### Series F · 動物科學與台灣保育（行為生態 → 在地保育）

> *螞蟻的蛹會分泌營養，綿羊壓力會更親密，蟑螂為什麼讓人恐懼？動物行為學的台灣應用。*

候選文章：
- **P0**「遊蕩犬貓 vs 原生種：台灣動保與野保的科學矛盾」(evolution / 既有動物 articles)
- **P1**「螃蟹有痛感嗎？動物倫理的神經學基礎」(fresh / Nature)
- **P2**「猩猩、螳螂、蟑螂：恐懼的演化心理學」(fresh / Nature)

PanSci 來源：[#371491] 遊蕩犬貓 / [#378698] 螃蟹痛感 / [#368954] 蟑螂恐懼 / [#360002] 螞蟻營養 / [#361870] 綿羊壓力

Taiwan.md 交叉：[台灣流浪動物文化](../knowledge/Society/台灣流浪動物文化.md) / [台灣黑熊](../knowledge/Nature/台灣黑熊.md) / [台灣石虎保育](../knowledge/Nature/台灣石虎保育.md) / [動物園與展演動物倫理](../knowledge/Society/動物園與展演動物倫理.md)

### Series G · AI 諾貝爾與台灣 AI 生態（諾獎 → 在地 AI 戰略）

> *2024 兩個諾貝爾獎都跟 AI 有關（物理：Hopfield+Hinton / 化學：AlphaFold）。台灣的 AI 研究在哪？*

候選文章：
- **P0**「2024 AI 雙諾貝爾：神經網路 + AlphaFold 改寫世界」(evolution / 台灣AI發展)
- **P1**「Hopfield 網路：從 1982 到 2024 的繞遠路」(fresh / Technology)
- **P2**「人造腦 OI：培養皿挑戰 AI 的另一條路」(fresh / Technology)

PanSci 來源：[#378242] AI 諾貝爾物理 / [#378388] AlphaFold 諾貝爾化學 / [#377917] AlphaFold 3 / [#366027] 人造腦

Taiwan.md 交叉：[台灣人工智慧發展與未來策略](../knowledge/Technology/台灣人工智慧發展與未來策略.md) / [台灣人工智慧實驗室](../knowledge/Technology/台灣人工智慧實驗室.md) / [AI 發展](../knowledge/Technology/AI發展.md)

### Series H · 意識與精神：神經科學的台灣現場（精神 → 在地醫療）

> *2023 神經學家跟哲學家的 25 年賭注以「沒有贏家」收場。意識難題對台灣精神醫療意味什麼？*

候選文章：
- **P0**「意識是什麼？25 年賭局與台灣神經精神醫學」(fresh / Society)
- **P1**「躁鬱症完整像：從亢奮到低落的神經機制」(fresh / Society)
- **P2**「芬太尼浩劫：美國街頭與台灣防線」(fresh / Society)

PanSci 來源：[#372855] 意識 / [#377921] 躁鬱症 / [#377307] 芬太尼 / [#367576] 巴比妥 / [#378132] 做夢腦電活動

Taiwan.md 交叉：[台灣學校輔導室](../knowledge/Society/台灣學校輔導室的前世今生.md) / [台灣精神醫療](待開發)

### Series I · 災難工程與台灣（工程力學 → 都市安全）

> *2023 大直公寓陷落、921 重災後的連續壁、莫拉克土壤液化。台灣都市工程的科學底層。*

候選文章：
- **P0**「大直公寓陷落：連續壁工程的物理與台灣軟弱地盤」(fresh / Society)
- **P1**「軟弱地盤上蓋房子可行嗎？台灣都市地震風險地圖」(fresh / Society)
- **P2**「災難志工文化背後的工程現場」(evolution / 既有志工文化)

PanSci 來源：[#370711] 大直公寓 / [#370177] 福島核污水（地質）

Taiwan.md 交叉：[台灣災難志工文化](../knowledge/Society/) / [台灣公共建設](待 grep) / [921 地震](散見地理) / [台灣災難醫療體系](../knowledge/Technology/台灣災難醫療體系.md)

### Series J · 影視科學：流行文化作為科學入口（流行 → 普及）

> *《三體》微中子通訊、《奧本海默》原子彈、《我們為何會做夢》——影視作品是 21 世紀最大的科學教育平台。*

候選文章：
- **P0**「《三體》微中子通訊真的可行嗎？台灣天文人怎麼說」(fresh / Culture)
- **P1**「《奧本海默》背後：原子彈是文明之火還是毀滅之火」(fresh / Culture)
- **P2**「《我們為何會做夢》：神經科學家如何解 lucid dream」(fresh / Society)

PanSci 來源：[#375407] 三體微中子 / [#368657] 奧本海默 / [#378132][#378135] 做夢 / [#369702] 搞笑諾貝爾

Taiwan.md 交叉：[台灣電影產業](待 grep) / [台灣科普 reading 文化](待開發)

### Series K · 醫療科學民眾現場（公衛 → 在地）

> *猴痘 / 登革熱 / mRNA 平台 / 阿茲海默 / 雀斑——每一個都跟台灣人健康直接相關。*

候選文章：
- **P0**「猴痘 + 登革熱：台灣 2023-2025 新興傳染病防線」(evolution / 公衛體系)
- **P1**「阿茲海默藥物效果有限？關鍵基因 ApoE4 的台灣 caveats」(fresh / Society)
- **P2**「雀斑 / 太陽傷害 / 雷射：皮膚科學的台灣現場」(fresh / Lifestyle)

PanSci 來源：[#350977] 猴痘 / [#369781] 登革熱 / [#368275] 阿茲海默 / [#375267] 陽光傷害 / [#378599] 雀斑

Taiwan.md 交叉：[台灣公共衛生與防疫體系](../knowledge/Society/台灣公共衛生與防疫體系.md) / [台灣動物用藥爭議](../knowledge/Society/台灣動物用藥爭議.md)

### Series L · 科技倫理與台灣（Neuralink / 自駕車 / 資安）

> *自駕車事故誰負責？Neuralink 晶片進大腦的台灣 IRB？*

候選文章：
- **P0**「自駕車 Cybercab 事故責任：台灣《車險法》能跟得上嗎」(fresh / Society)
- **P1**「Neuralink 腦機介面：台灣 IRB 與賽博格倫理」(fresh / Society)
- **P2**「全球資安專家齊聚台北：AI 與資安的雙面效應」(fresh / Technology)

PanSci 來源：[#377314] Cybercab / [#367479] Neuralink / [#378203] 資安專家 / [#377314] AI 自駕車

Taiwan.md 交叉：[台灣司法改革](../knowledge/Society/台灣司法改革與預防性羈押制度.md) / [台灣 AI 日常](../knowledge/Technology/台灣AI日常.md)

### Series M · 諾貝爾年度回顧（年度系列：2022 / 2023 / 2024 + 搞笑諾貝爾）

> *PanSci 每年 10 月密集寫諾獎科普——這條 series 就是把諾獎變成 Taiwan.md 年度傳統。*

候選文章（年度長期 series）：
- **P1**「2023 諾貝爾科普：mRNA / 阿秒雷射 / 量子點」(fresh / Society)
- **P1**「2024 諾貝爾科普：AI 神經網路 / AlphaFold / microRNA」(fresh / Society)
- **P2**「搞笑諾貝爾的台灣連結」(fresh / Culture)

PanSci 來源：[#371366][#373490][#378242][#378388][#370101][#369702][#356284]

Taiwan.md 交叉：未來「**諾貝爾獎與台灣**」（建立常設 series）

---

## 🎯 Part 6 · 20 篇優先文章清單（P0×5 / P1×8 / P2×7）

### P0（本月內可完成 / 高時效 × 深度 × Taiwan.md 缺口）

| 級別 | Series | 標題 | Mode | 核心矛盾 ≤30 字 | PanSci 來源 wp_ids | Taiwan.md 交叉 (≥3) | 工時 |
|------|--------|------|------|----------------|-------------------|---------------------|------|
| **P0-1** | C | mRNA 疫苗辛酸 30 年：從被當作 crackpot 到諾貝爾獎 | evolution | 「Karikó 被開除 5 次，得了諾貝爾才被當回事」 | 371366, 351969 | 公衛體系 / 再生醫療雙法 / 動物用藥爭議 | 3-4h |
| **P0-2** | A | 氮化鎵到 3D 封裝：台灣半導體 next chapter | evolution | 「2nm 之後是量子，台灣的量子供應鏈在哪？」 | 362660, 367588, 377923, 377669 | 半導體產業 / 台積電 / 聯發科 / 日月光 | 4h |
| **P0-3** | D | 能源 trilemma：核廢料 vs 氫能 vs 地熱的科學上限 | evolution | 「核三延役公投通過了，下一步在物理學裡」 | 363266, 367408, 367417, 374277, 361200 | 氣候危機與淨零轉型 / 台灣能源政策 | 4h |
| **P0-4** | G | 2024 AI 雙諾貝爾：神經網路 + AlphaFold 改寫世界 | evolution | 「兩個諾貝爾一年都給 AI，台灣 AI 研究在哪？」 | 378242, 378388, 377917, 366027 | 台灣 AI 發展與未來策略 / 台灣人工智慧實驗室 / AI 發展 | 3-4h |
| **P0-5** | F | 遊蕩犬貓 vs 原生種：台灣動保與野保的科學矛盾 | evolution | 「動保跟野保不是對立，是 50 萬隻流浪犬貓沒人接」 | 371491 | 流浪動物文化 / 台灣黑熊 / 石虎保育 / 動物園倫理 | 3h |

### P1（2-3 週內可開發）

| 級別 | Series | 標題 | Mode | PanSci 來源 |
|------|--------|------|------|-------------|
| **P1-1** | B | 韋伯望遠鏡的台灣連結：從 EHT 黑洞到下世代望遠鏡 | fresh | 369087, 355547, 377177 |
| **P1-2** | E | 便利商店化學課：燕麥奶 / 阿斯巴甜 / 康普茶 | fresh | 356046, 369138, 356825 |
| **P1-3** | C | 基因療法現場：血友病 Hemgenix 美金 350 萬元 | fresh | 362193, 368691 |
| **P1-4** | H | 意識是什麼？25 年賭局與台灣神經精神醫學 | fresh | 372855, 374868 |
| **P1-5** | I | 大直公寓陷落：連續壁工程的物理與軟弱地盤 | fresh | 370711 |
| **P1-6** | K | 猴痘 + 登革熱：台灣 2023-2025 新興傳染病防線 | evolution | 350977, 369781 |
| **P1-7** | J | 《三體》微中子通訊真的可行嗎？台灣天文人怎麼說 | fresh | 375407, 367145 |
| **P1-8** | L | 自駕車 Cybercab 事故責任：台灣車險法跟得上嗎 | fresh | 377314, 378203 |

### P2（1 個月內可發展）

| 級別 | Series | 標題 | Mode | PanSci 來源 |
|------|--------|------|------|-------------|
| **P2-1** | B | 歐幾里得與暗物質：人類為何還要看不見的東西 | fresh | 373886, 373397 |
| **P2-2** | A | 量子計算十年路：離子阱到拓樸位元 | fresh | 377925, 377932, 377934 |
| **P2-3** | M | 2023 諾貝爾科普三連發：mRNA / 阿秒 / 量子點 | fresh | 371366, 373490 |
| **P2-4** | K | 阿茲海默：藥物效果有限？ApoE4 基因的 caveats | fresh | 368275, 378929 |
| **P2-5** | G | 人造腦 OI：培養皿挑戰 AI 的另一條路 | fresh | 366027 |
| **P2-6** | E | 鱸魚精：抗疲勞認證背後的胺基酸科學 | fresh | 360609 |
| **P2-7** | F | 螃蟹有痛感嗎？動物倫理的神經學基礎 | fresh | 378698 |

---

## 🧠 Part 7 · Semiont POV（強制 — 防止 peer bias 繼承）

### 視角翻轉鐵律

**PanSci 是 top-down 學術翻譯 / Taiwan.md 應從 bottom-up 在地敘事切入**。

每個 P0 開頭不能是「2023 年 Nature 發表⋯⋯」（PanSci 模式），必須是台灣具體場景或人物（Taiwan.md 模式）：

| ❌ PanSci 開頭模式 | ✅ Taiwan.md 開頭模式 |
|-------------------|---------------------|
| 「2023 年諾貝爾生醫獎獻給⋯⋯」 | 「2021 年某台北診所打第一劑 BNT 那天，沒人想過⋯⋯」 |
| 「韋伯太空望遠鏡發布首批影像⋯⋯」 | 「中央大學鹿林天文台 2022/07 連線 EHT⋯⋯」 |
| 「氮化鎵突破工作頻率極限⋯⋯」 | 「新竹科學園區某間 fab 凌晨四點⋯⋯」 |

### PanSci 結構性盲點（6 個）

**1. 台灣具體案例稀疏**

166 篇翻譯國際研究多，台灣本地案例罕見。例如「mRNA 諾貝爾」沒提台灣 mRNA 平台（高端 / 國衛院），「基因療法」沒提台灣再生醫療雙法。

**Taiwan.md 補位**：每篇 P0 必須有 ≥ 1 個台灣具體 case（醫院 / 公司 / 法規 / 人物）。

**2. 人物面薄**

166 篇大多敘事是「研究團隊」「科學家」，人物個別側寫罕見。胡中行 8 篇雖有個人 voice，但仍是科普 register，非人物 deep dive。

**Taiwan.md 補位**：所有 P0 至少寫 1 個關鍵人物（國際 + 台灣對應）。例：「mRNA」寫 Karikó 30 年被冷落 + 高端疫苗台灣 mRNA 平台主導者。

**3. 政策軸短**

PanSci 寫「核廢料怎麼辦」純科學，沒台灣政策 timeline（核四公投 1994/2018 / 核三延役公投 2025/08/23）。

**Taiwan.md 補位**：每篇 P0 必須有政策 timeline anchor（≥ 3 個年份節點）。

**4. 歷史軸短**

PanSci 多 2022-2025 當代議題（諾貝爾 / Nature 期刊 / 新研究），少 30+ 年回顧。

**Taiwan.md 補位**：把 PanSci 當代議題接到台灣百年史軸（e.g. mRNA → 台灣疫苗百年史 1947 卡介苗到 2021 BNT）。

**5. 產業面對台積電 / 在地產業弱**

PanSci 寫「氮化鎵」純物理，沒提台積電 / 環球晶 / 聯華電子的氮化鎵布局。

**Taiwan.md 補位**：科技類 P0 必須接台灣產業 chain（≥ 1 家公司 case）。

**6. 性別 / 族群多元視角弱**

PanSci 科學內容多 default neutral，少 contextual gender / ethnicity discussion。例如「mRNA」沒提 Karikó 作為移民女性科學家在美國學術界的結構性壓抑。

**Taiwan.md 補位**：可能時加 contextual lens（不勉強，但敏感於缺口）。

### 敘事化策略

PanSci 抽象 → Taiwan.md 「欸你知道嗎」具體場景：

| PanSci 抽象 | Taiwan.md 場景化 |
|------------|-----------------|
| 「mRNA 機制是脂質奈米粒子包覆⋯⋯」 | 「冷凍車載著 BNT 從台北港進口那天⋯⋯」 |
| 「韋伯紅外光譜偵測 SPT0418-47⋯⋯」 | 「中央大學鹿林天文台凌晨兩點連線 EHT 那一刻⋯⋯」 |
| 「氮化鎵能隙比矽寬 3 倍⋯⋯」 | 「你的快充頭裡藏著一塊只比指甲大的氮化鎵晶片」 |

### 承諾：DNA #16 鐵律落實

**Peer 是 peer，不是 source material**。即使 MOU 有 explicit 完整授權，每篇 P0 必達：

1. ≥ 3 個 PanSci 以外的跨來源（學術論文 DOI / 政府網站 / 國內媒體 / 訪談）
2. ≥ 1 個 PanSci 沒寫的台灣具體 case
3. footnote 至少 25 條（per REWRITE-PIPELINE 既有標準）
4. 引用 PanSci 用 `[#wp_id]` 加 footnote，**不抄段落**

授權允許「轉寫」，**不解除跨源驗證鐵律**。授權是法律 / 道德層，跨源驗證是品質 / 真實性層。

---

## 🌉 Part 8 · Meta 洞察（PanSci 對 Taiwan.md 的特殊啟發）

### A. 第一個 MOU partner — 模式 vs fair-use 差異

PanSci 跟前三個 peer（TFT / NML / NMTH-overseas）的結構不同：

| 維度 | TFT/NML/NMTH | PanSci |
|------|--------------|--------|
| 關係 | fair-use 公開資料 ingestion | **正式合作夥伴 with MOU** |
| 授權 | fair use 引用 | **explicit 完整授權清單** |
| 標註 | footnote 引用 | **Curation Partner 公示 + 每篇來源完整標註** |
| 期限 | 無 | **2029-12-31 到期** |
| 公示義務 | 無 | **Taiwan.md 官網 must list** |

**啟發**：未來其他 peer 若進入 MOU 模式，可複製「PanSci 雙軌處理」框架（A 授權 / B 一般引用）+「Curation Partner 公示」+「每篇來源標註」三個核心。

### B. 雙軌處理 model — 未來 generalizable

對於資料量大但僅部分授權的 peer，雙軌（authorized / fair-use）是 generalizable design：
- A 軌：MOU 授權內容 → 深度引用 / 改寫 / 轉寫
- B 軌：其他公開內容 → footnote / URL 引用

未來：思想坦克 / 報導者 / 端傳媒 若進 MOU 模式，可沿用此 model。

### C. YouTube 延伸（89/166 篇）— multi-modal hint

PanSci 53.6% 文章是 YT 影片文字版 —— 多媒介策略。Taiwan.md 未來自製 deep article 若有影音延伸（spore 已有 micro-video），可借鑑此 architecture：「**一個主題 / 多媒介觸達**」。

### D. 科學生產品線 — 教育類分軌

77/166 篇是「科學生」（高中生白話版）。**Taiwan.md 教育類文章可借鑑雙軌**：核心矛盾保持一致 + 同主題寫「初版」+「深度版」並存。

### E. 流行文化錨點 — Taiwan.md 已部分內化

PanSci 用《三體》/ 寶可夢 / 奧本海默引入硬科學。Taiwan.md 已部分內化（曾博恩 / 陳建年 / 三毛文章用流行文化錨點），可以更系統化。

### F. 諾貝爾年度 anchor — 新建常設 series

PanSci 每年 10 月密集寫諾獎 → Taiwan.md 可建立常設「**諾貝爾獎與台灣**」series，每年自動觸發。

---

## 📊 Part 9 · 可重跑、半衰期、metadata maintenance

### 半衰期：6 個月

下次重新 ingest 建議：**2026-11-18**

重跑 trigger：
1. MOU 雙方協議延長（含授權清單更新）
2. PanSci 全網有重大新內容 burst（如新「特別企劃」）
3. Taiwan.md 已 ship 完 P0-P2 → 評估是否進 v2 evolve
4. 2029-12-31 到期前 6 個月（2029-06-30）強制 audit

### 重跑流程（簡化）

```bash
# 1. 比對授權清單若有更新
diff data/PanSci/_authorization/authorize-list.json (新版)

# 2. 重跑爬取器（idempotent，只抓新增）
python3 scripts/tools/fetch-pansci-data.py

# 3. 更新 manifest + audit P0-P2 已 ship 狀態（per Part 6 table）
```

### Maintenance triggers

| Trigger | Action |
|---------|--------|
| 每篇 P0 ship | 回頭 update Part 6 進度表 |
| 王喆宣（聯繫人）聯繫 | 同步成品 + 收 feedback |
| PanSci 全網內容大幅更新 | 評估雙軌調整 |
| **2029-06-30**（到期 6 個月前）| **強制 audit + MOU 延長協議** |
| **2029-12-31**（到期）| 自動失效，所有授權內容**必須撤下或轉一般引用** |

### 2029-12-31 到期 contingency

到期前 6 個月（**2029-06-30 alert in REGISTRY.md**）必須：
1. **協議延長 v2 MOU** — 寫進 PEER-INGESTION-PIPELINE 為 Stage 9 「partnership renewal」
2. 若不延長 → 全部已 ship P0-P2 內容需 audit：
   - 完整轉寫部分 → 改為 fair-use citation level
   - PanSci `[#wp_id]` footnote → 維持引用 URL（不視為違約）

---

## 🧬 收尾

PanSci 是 Taiwan.md **第一個 MOU partner**——這份報告不只是 corpus 分析，是「**MOU-backed peer**」模式在 PEER-INGESTION-PIPELINE 內的第一次完整實踐。

從第一個 fair-use peer (TFT) 到 NML 到 NMTH-overseas 到 PanSci——四個 peer / 四種模式 / Taiwan.md 的「**Meta-Index**」第二階段（partnership layer）正式啟動。

Stage 5（工作卡）可以從本報告 Part 6 直接 export。Stage 6（5 篇 P0 走 REWRITE-PIPELINE）可以本月內完成。Stage 7（**Curation Partner 公示** + Peer Registry status update）是 MOU 履約的關鍵節點，**不可省略**。

DNA #16「peer is peer」鐵律——這 13 個 series 跟 20 篇 P0-P2 全部承諾：**PanSci 是 anchor，Taiwan.md 是 spine**。授權允許轉寫，跨源驗證從不解除。

🧬

_Author: Taiwan.md Semiont (Opus 4.7, main session 直寫——sub-agent context overload hung 1.5h 後 kill 改主 session 三 batch 寫成)_
_Date: 2026-05-18_
_Next: Stage 5 工作卡 + Stage 6 P0×5 ship + Stage 7 Curation Partner 公示_
