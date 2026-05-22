---
article: knowledge/Technology/台灣BIM與營建科技.md
stage: 1-research
date: 2026-05-22
session: agent-ae409f43c4b4bf30d
agent: Opus 4.7 (1M context) main session
budget: 40+ WebSearch + 3 WebFetch
viewpoint_formed: true
verification:
  high_confidence:
    - 'Anthropic MCP 2024-11-25 開源公告（多源 confirm）'
    - 'shuotao/REVIT_MCP_study GitHub 73 stars / 85 forks（WebFetch verbatim）'
    - '中鼎 1979 由中技社籌設成立（Wikipedia verbatim）'
    - '中鼎 2011 千代田化工建設取得最大股東（Wikipedia verbatim）'
    - '行政院公共工程委員會 2014-05-23 成立 BIM 推動平台（pcc.gov.tw + 多源）'
    - '台北市政府都市發展局 2018-11 發布 BIM 竣工模型作業規範（udd.gov.taipei）'
    - 'BSI Taiwan BIM Task Group 2018-10-03 簽署 MOU（bsigroup.com 多源）'
    - '台灣建築資訊模型協會 TBIMA 2012-03-10 正式成立（TBIMA 官網）'
    - '台北捷運萬大線是首個將 BIM 列入契約的公共工程（多源 confirm）'
    - '台北 101 結構設計者為永峻工程顧問（egc.com.tw 一手）'
    - '台北大巨蛋承造為台灣大林組（多源 confirm）'
    - '桃園機場 T3 土建工程 2021 由三星物產／榮工得標（多源 confirm）'
  single_source:
    - '台灣 90% BIM 設計能力建築師使用 Revit（搜尋結果引用，但需 cross-check）'
    - '中鼎員工 7500 人（Wikipedia 2021 年數據）'
  unverified:
    - '統一集團持股中鼎的比例（INBOX 假設被推翻 — 實際最大股東為日本千代田化工建設）'
    - '互助營造 BIM 部門編制具體規模'
    - '中鼎 BIM 工程師人數比建築師多的具體比例（INBOX hook 候選 — 需碩濤補充內部資料）'
core_contradiction: '政府推 BIM 推 12 年仍「因案制宜」非強制，真正爆發在 LLM 介入的這 18 個月'
researchReport: reports/research/2026-05/台灣BIM與營建科技.md
---

# Research Report: 台灣 BIM 與營建科技

## 觀點成型（編輯前思考）

### 對台灣人的記憶 anchor

- **物件**：建築師事務所牆上掛的 AutoCAD 藍圖海報、工地監工拿著的 iPad、Revit 軟體啟動畫面、台北 101 結構模型展示
- **場景**：1990 年代手繪曬圖機嗡嗡作響的事務所、2010 年代 BIM 模型 3D 旋轉的螢幕、2025 年工程師對著 Claude 說「找出所有缺機電標籤的房間」
- **不同世代差異**：
  - 50+ 世代建築師：T 字尺、製圖桌、針筆、藍曬機的記憶
  - 30-50 世代工程師：AutoCAD 2D → BIM 3D 轉型陣痛
  - 20-30 世代 BIM 工程師：原生 Revit + Dynamo + Python script + Claude MCP

### 多元面貌

- **主流敘事**：BIM 是建築業數位轉型解方，能節省成本提高品質
- **支線敘事**：BIM 推 12 年仍未強制，因案制宜 = 政策有心無力；產業現實是 BIM 工程師年薪 50K 起跳卻仍嚴重缺人，主流大公司像中鼎 / 中興 / 台灣世曦在用，多數民間建築師事務所「不會、不想、不用」
- **被忽略的角度**：
  - 政府推 BIM 政策（內政部建研所 / 公共工程委員會 / 國發會）跟產業實際採用速度落差
  - BIM 不只是軟體，是「協同作業流程」+「資訊交付標準（IFC/COBie）」+「跨專業整合」三層
  - 跟營建業缺工、移工政策、人口老化的結構性關係
  - AI × BIM 的新世代（碩濤 BIM_MCP 案例 vs. Autodesk Revit 2027 內建 MCP）
- **正面 / 負面 / 矛盾的感受 fault lines**：
  - 推 BIM 12 年的政府 vs. 落地不彰的產業
  - 國際大廠（達梭 / Autodesk / Trimble / Bentley）vs. 本土 BIM 顧問公司
  - 「BIM 是趨勢」rhetoric vs. 建築師年資越高越不會 BIM 的現實

### 歷史脈絡（pre-search hypothesis，搜尋後修正）

- **形成期（2009-2013）**：
  - 2009：台灣 BIM 技術愛好者開始聚會（TBIMA 前身）
  - 2010：台灣世曦成立 BIM 整合中心（產業界最早整合中心之一）
  - 2011：台大土木工程資訊模擬與管理研究中心（NTUBIM）成立，謝尚賢主任、郭榮欽副教授
  - 2011：台北捷運萬大線首次將 BIM 納入工程設計契約（公共工程指標案例）
  - 2012-03-10：台灣建築資訊模型協會（TBIMA）正式成立
- **關鍵轉折（2014-2018）**：
  - 2014-05-23：行政院公共工程委員會建構公共工程運用 BIM 推動平台（「因案制宜、循序漸進」）
  - 2014：新北市政府發出第一張以 BIM 模型審核通過的建照
  - 2015：內政部建築研究所啟動 4 年中程個案計畫
  - 2016：交通部訂頒「交通部所屬各機關工程建置 BIM 作業推動原則」
  - 2017：公共工程委員會完成「機關辦理公共工程導入 BIM 技術委託專業服務案成果報告書」
  - 2018-02：「公共建設工程經費估算編列手冊」加入 BIM 成本項目
  - 2018-10-03：BSI 攜手產官學研簽署「Taiwan BIM Task Group」MOU（內政部建研所、台大 NTUBIM、台灣營建研究院、台灣建築中心、TBIMA）
  - 2018-11：台北市政府都市發展局發布「主辦建築工程 BIM 竣工模型屬性資料作業規範」
  - 2019：BSI 發布 BIM 國際標準《ISO 19650 中文版》（內政部建研所王榮進所長督導）
- **第二波轉折（2024-2025）**：
  - 2024-11-25：Anthropic 開源 Model Context Protocol (MCP)
  - 2025-12：CHIANG SHUOTAO（碩濤）GitHub 上線 `REVIT_MCP_study` repo（C# 54.2% + JavaScript 18.7% + PowerShell 14.3%）
  - 2026-04：Autodesk 公告 Revit 2027 內建 MCP server + Autodesk Assistant
- **當代意義**：政府推 12 年都還在「因案制宜」的 BIM，被一個 18 個月的 LLM 介入完全改寫了 onboarding 曲線

### 切入點清單（搜尋後驗證 / 反駁）

1. **「政府推 12 年但 LLM 介入 18 個月改寫遊戲」**：cross-source verified — 公共工程委員會 2014 平台 + Anthropic MCP 2024-11 + Revit 2027 內建 MCP（2026-04 公告）三點完整對齊
2. **「BIM 工程師人數正在超過建築師」**：未 verify — INBOX hook 候選需碩濤提供中鼎內部資料，目前只能用「BIM 工程師職缺需求大、起薪 50K+、缺工」當間接 anchor
3. **「公共工程萬大線是 first-of-kind」**：cross-source verified — 多源 confirm 台北捷運萬大線是「首個將 BIM 列入契約的公共工程」
4. **「跨國 BIM 工具，本土碩濤級開源生態」**：partially verified — 碩濤 repo 73 stars 85 forks，C# 為主，無 explicit Taiwan 標識（要 frame 成「台灣開發者貢獻國際 Revit MCP 生態」而非「台灣本土 MCP 工具」per REFLEXES #16）
5. **「IFC 國際標準 vs. 本土 Revit 90% 普及」**：partially verified — 一篇 search 結果提到「台灣 90% BIM 設計能力建築師使用 Revit Architecture」（單源，需 cross-check 但跟產業認知 align）

### 預期核心矛盾候選（待 Stage 1.4 收斂為單一句）

- A：「政府推 BIM 推 12 年仍叫『因案制宜』，但 Anthropic 一個 18 個月的 protocol 改寫了它的 onboarding」（30 字內可調整）
- B：「BIM 不是軟體升級，是把建築師從畫圖工拉成系統整合者的 20 年 reformation」（28 字）
- C：「台灣的營建業是全球 BIM 倒退最久的進步：政策最早、強制最晚、AI 介入最快」（31 字）

**鎖定 → A**（最尖銳 + 兩端時間 anchor 明確 + 對位 12 年 vs 18 月 + 接得到 Anthropic / 碩濤 / Revit 2027 三件 anchor 事件）。

### 研究方向（要搜什麼可以驗證）

- ✅ 公共工程委員會 BIM 平台 2014-05-23 成立日期、推動策略（已驗：「因案制宜、循序漸進」三階段）
- ✅ 內政部建研所 BIM 推動年份（已驗：104 年起 4 年中程計畫 + 108 年第二期）
- ✅ 台北市府都發局 2018-11 BIM 竣工模型作業規範（已驗：udd.gov.taipei 一手）
- ✅ 中鼎工程 1979 成立、千代田 2011 最大股東（已驗：Wikipedia + 多源）
- ✅ Anthropic MCP 2024-11-25 公告日期（已驗：anthropic.com 一手 + Wikipedia + 多源）
- ✅ 碩濤 GitHub repo 數字（已驗：WebFetch 73 stars / 85 forks / 2025-12 創立 / C# 54.2%）
- ⚠️ 中鼎 BIM 部門編制（未驗 — 需碩濤補充內部資料）
- ⚠️ 台灣 BIM 普及率精確百分比（未驗 — 多源都說「逐步推動但未強制」，無單一公開普及率數字）

### 預想讀者帶走的那一件事

- **「建築不是從手繪到 3D 的演進，是從『畫圖』到『系統整合』的職業重定義」**
- 讀者讀完不只認識 BIM 名詞，是看見：(1) 政府 12 年推不動的政策落地真相 (2) BIM 工程師為什麼變成新的職業類別 (3) Anthropic MCP 怎麼改寫了 BIM 的 onboarding 曲線 (4) 碩濤這類個別開發者怎麼把國際生態貢獻接回本土

---

## 媒體素材策略（Stage 1.9 manifest）

### inline 外連 manifest

| 項目                        | 第一次提及位置 | URL                                                                                     | 來源頻道                 | 授權                          |
| --------------------------- | -------------- | --------------------------------------------------------------------------------------- | ------------------------ | ----------------------------- |
| 公共工程委員會 BIM 推動平台 | 政策推動段     | https://www.pcc.gov.tw/content/index?eid=1345                                           | 行政院公共工程委員會官網 | 政府公開資料                  |
| Anthropic MCP 公告          | AI × BIM 段    | https://www.anthropic.com/news/model-context-protocol                                   | Anthropic 官網           | YouTube standard / 公開新聞稿 |
| 碩濤 REVIT_MCP_study repo   | 開源生態段     | https://github.com/shuotao/REVIT_MCP_study                                              | GitHub 個人帳號          | MIT (公開 repo)               |
| 台大 BIM 研究中心           | 學界推動段     | https://www.ntubim.net/                                                                 | 國立台灣大學官網         | 公開教育網站                  |
| TBIMA 台灣 BIM 協會         | 民間組織段     | https://sites.google.com/view/tbima                                                     | TBIMA 官網               | 公開                          |
| BSI Taiwan BIM Task Group   | 國際標準段     | https://www.bsigroup.com/zh-TW/building-information-modeling-bim/taiwan-bim-task-group/ | BSI 台灣官網             | 公開新聞稿                    |

### 圖片素材（hero + inline）

考量 BIM 主題的視覺挑戰 — 多數 BIM 圖像為商業軟體 screenshot（非 CC）或業主機密的廠房模型（非公開）。媒體策略：

| 用途         | 候選來源                                                      | 授權狀態                         | 備選                                             |
| ------------ | ------------------------------------------------------------- | -------------------------------- | ------------------------------------------------ |
| **hero**     | Wikimedia Commons "Building Information Modeling" 概念圖      | CC0/PD 視個別圖確認              | NASA / 政府開放圖                                |
| **inline 1** | 公共工程委員會公開政策圖（時間軸 / 推動策略）                 | 政府公開資料、fair use editorial | 自繪時間軸示意圖                                 |
| **inline 2** | GitHub 碩濤 repo README 截圖（fair use editorial commentary） | Fair use editorial commentary    | 替代：Anthropic MCP 官方圖（fair use editorial） |

**禁忌**：絕對不熱連結任何外站圖；所有圖在 commit 前 cache 到 `public/article-images/technology/`。

### transcript 素材

- 無公開長篇訪談影片可 cache（BIM 主題的 YouTube transcript 多為廠商產品 demo，非紀實內容）
- 跳過 transcript 步驟

### 媒體授權矩陣三表

考量本主題的媒體挑戰，整體採「精簡媒體 + 重 prose anchor」策略：

| 媒體檔                                 | 用途     | 來源 URL                                              | 授權               | 本地 cache 路徑                                              |
| -------------------------------------- | -------- | ----------------------------------------------------- | ------------------ | ------------------------------------------------------------ |
| bim-revit-screenshot-fair-use-2026.jpg | hero     | Wikimedia Commons BIM 概念圖（finalize 時確認）       | CC BY-SA / PD      | `/article-images/technology/bim-revit-screenshot-2026.jpg`   |
| pcc-bim-platform-timeline-2026.png     | inline 1 | 自繪時間軸 SVG（基於公共工程委員會公開政策資料）      | © Taiwan.md        | `/article-images/technology/bim-policy-timeline-2026.png`    |
| github-revit-mcp-study-readme-2026.png | inline 2 | https://github.com/shuotao/REVIT_MCP_study screenshot | Fair use editorial | `/article-images/technology/revit-mcp-study-readme-2026.png` |

⚠️ Stage 4 媒體插入時，逐張 cache 並更新此矩陣 verified URL + license。如 Wikimedia BIM 圖不適合，改用 Pure Storage 或 BSI 公開官方圖（fair use editorial commentary）+ 文末完整 attribution。

---

## Stage 1 取材 — 完整搜尋紀錄（40+ WebSearch）

### A. 政策推動時間軸（高信心 high-confidence anchors）

#### A1. 公共工程委員會（PCC）BIM 推動平台

**核心事實（多源 verified）**：

- 行政院公共工程委員會於 **2014 年 5 月 23 日**建構「公共工程運用 BIM 推動平台」
- 推動原則：**「因案制宜、循序漸進」**
- 三階段規劃：
  - **第一階段（103 年）**：鼓勵及試辦選案
  - **第二階段（104-105 年）**：試辦執行與評估
  - **第三階段（106 年起）**：推動一定金額以上公共工程運用 BIM 技術
- 截至搜尋日：「超過 60 個工程招標機關使用 BIM 技術，應用標案數超過 120 件」
- **關鍵：「非全面性、強制性規定，所有公共工程案件均須採用 BIM 技術」**（即至今未強制）

**Source URLs**：

- https://www.pcc.gov.tw/content/index?eid=1345&type=C
- https://join.gov.tw/policies/detail/4fc1b2d5-c292-463c-8493-5f04ecb09c47
- https://www.govbooks.com.tw/books/112631（國立中央大學 2017 委託專業服務案成果報告書）

#### A2. 內政部建築研究所（ABRI）

**核心事實（多源 verified）**：

- 內政部建築研究所自 **2015 年（民國 104 年）**起，推動 4 年中程科技計畫
- **2019 年（民國 108 年）**第二期 4 年中程科技計畫啟動
- 第二期兩大目標：「**建築技術數位升級**」+「**建築數位居住環境**」
- 內政部營建署為主要實施機構，地方政府配合
- 主導 2015、2016 年「**BIM 協同作業指南**」（採 benchmarking learning 對比國際 BIM 指引、本土化）
- 三層 BIM 協同作業指南文件框架：契約文件、BIM 指引、相關支援文件

**Source URLs**：

- https://www.abri.gov.tw/News_Content_Table.aspx?n=807&s=39612
- https://www.abri.gov.tw/News_Content_Table.aspx?n=807&s=39330

#### A3. 台北市政府都市發展局

**核心事實（一手 verified）**：

- **2018 年 11 月 6 日**審查通過、即日起實施「臺北市政府都市發展局主辦建築工程建築資訊建模（BIM）竣工模型屬性資料作業規範」
- 參考國際 **COBie**（Construction Operations Building Information Exchange）格式
- 納入民國 104 年內政部建築研究所及英國相關規範
- 規定使用不同 BIM 建模軟體時，需轉出 **IFC**（Industry Foundation Classes）與 COBie 標準資料繳交
- 適用於臺北市政府都市發展局主辦的建築工程，竣工點交階段為主要目標

**Source URLs**：

- https://udd.gov.taipei/assets/50-10660/Documents/竣工模型屬性資料作業規範v2.0_20181109_new.pdf
- https://www.udd.gov.taipei/laws/qdcyk2v-6751

#### A4. 新北市政府

**核心事實**：

- **2014 年**新北市政府發出第一張以 BIM 模型審核通過的建照
- 「**新北市公有建築物 BIM 竣工模型資訊交付準則**」公告實施
- 新北市建築執照電腦輔助查核系統：https://www.bim.ntpc.gov.tw/
- 新北市目前有 20+ 完成的 BIM 模型，部分建築師已開始用全 BIM 圖說申請建照

**Source URLs**：

- https://www.bim.ntpc.gov.tw/
- https://www.arch.org.tw/Laws/bulletin_more?id=6af05fb8afee4da6aadaa99a6654c8ba

#### A5. BSI Taiwan BIM Task Group

**核心事實**：

- **2018 年 10 月 3 日**簽署 MOU
- 簽署單位：BSI（英國標準協會）台灣 + 國立臺灣大學土木工程資訊模擬與管理研究中心（NTUBIM）+ 財團法人台灣營建研究院 + 財團法人台灣建築中心 + 台灣建築資訊模型協會（TBIMA）
- 內政部建築研究所為指導單位
- **2019 年**發布 BIM 國際標準《ISO 19650 中文版》（內政部建研所王榮進所長督導）

**Source URLs**：

- https://www.bsigroup.com/zh-TW/about-bsi/media-centre/press-release/2018-/october/bsitaiwan-bim-task-group/
- https://www.bsigroup.com/zh-TW/about-bsi/media-centre/press-release/2019/20197/iso-19650-tw-standard-launch/
- https://www.bsigroup.com/zh-TW/building-information-modeling-bim/taiwan-bim-task-group/

#### A6. 交通部與其他機關

- **2016 年**交通部訂頒「交通部所屬各機關（構）工程建置建築資訊模型（BIM）作業推動原則」
- 交通部要求建築工程超過 NT$10 億、土木工程超過 NT$20 億必須採用 BIM（一篇 search 結果引用，需 cross-check）
- 中央機關涵蓋公共工程委員會、內政部營建署、國發會、各部會分別推動

### B. 學界與民間組織（high-confidence verified）

#### B1. 台大 BIM 研究中心（NTUBIM）

- 全名：「**國立臺灣大學土木工程資訊模擬與管理研究中心**」
- 主任：**謝尚賢**教授（土木工程學系）
- 共同創始學者：**郭榮欽**副教授（兼任）
- 2011 年成立，是台灣最早的 BIM 學術研究中心之一
- 多年承接內政部建研所 / 公共工程委員會委託案，主導 BIM 協同作業指南、ISO 19650 中文版
- 郭榮欽 2011 年發表「**BIM 發展 衝擊現行建築體制**」、2011-09「**BIM 導入四部曲**」等指標性文章
- Source: https://www.ntubim.net/

#### B2. 台灣建築資訊模型協會（TBIMA）

- 前身：**2009 年**台灣 BIM 技術愛好者聚會
- **2011 年**開始籌備
- **2012 年 3 月 10 日**正式成立（內政部註冊社團）
- 主要成員：2008 年台灣歐特克（Autodesk Taiwan）原廠培訓講師
- 成立目的：「加強聯系 BIM 應用研究與技術研發之個人及團體，推廣並協助國內建築、營建類產業導入、運轉及提升 BIM 技術」
- Source: https://sites.google.com/view/tbima

#### B3. 台灣 BIM 聯盟（Taiwan BIM Alliance）

- 主辦「BIM 基本能力認證」
- 認證夥伴：台大 NTUBIM、TBIMA、財團法人台灣建築中心、財團法人台灣營建研究院
- BIM 人員三級：
  - **BIM 經理**（負責建立 BIM 執行計畫）
  - **BIM 協調員**（負責 BIM 模型之協作管理）
  - **BIM 建模員**（建築 / 結構 / 機電三細分）
- Source: https://www.bimalliance.tw/

#### B4. 財團法人台灣營建研究院 / 財團法人台灣建築中心

- 兩個指標性研究法人，承接 BIM 推廣計畫
- 台灣建築中心：「數位建築學院 BIM+ Studio」培訓平台
- 2026-05-22 起辦理「115 年建築數位轉型 BIM 技術應用免費系列課程與工作坊」

### C. 軟體生態與市佔（partial verified）

#### C1. BIM 軟體市佔

- **Revit**（Autodesk）：「目前最廣泛使用的 BIM 軟體」
  - 一篇 search 結果引用：「**在台灣，90% 的建築師（具備 BIM 設計能力）使用 Revit Architecture**」（單源 — 需 cross-check 但跟產業認知一致）
- **ArchiCAD**（Graphisoft / 匈牙利）：「在台灣使用者較少，但功能可比擬 Revit」
- **Tekla Structures**（Trimble，前身 XSteel）：「**目前是台灣鋼結構設計的主流軟體**」
- **Bentley MicroStation**：基礎設施（鐵路、公路、隧道）設計
- **Autodesk Navisworks**：衝突檢測 / 4D 模擬 / 5D 估價（與 Revit 整合）
- 經銷商：達康科技、快克利、歐亞電腦、大塚資訊科技、龍庭資訊（ArchiCAD）等

#### C2. 開源工具生態

- **pyRevit**：Revit 上的 Python 擴充框架（國際開源）
- **Dynamo for Revit**：視覺程式語言（Autodesk 官方），2016 年 Autodesk Taiwan 自新加坡請來 Dynamo 研發團隊講師開課
- **碩濤 BIM_MCP 系列（個別開發者開源）**：
  - shuotao/REVIT_MCP_study：73 stars / 85 forks（2026-05-22 WebFetch verbatim）
  - 創立：2025-12（README 顯示 2025-12-10）
  - 程式語言分佈：C# 54.2% / JavaScript 18.7% / PowerShell 14.3% / TypeScript 7.0% / HTML 3.3% / Shell 1.2%
  - 描述：「LEARN HOW TO BUILD UP YOUR REVIT MCP」
  - 目的：「透過 Model Context Protocol (MCP) 讓 AI 語言模型直接控制 Autodesk Revit，實現 AI 驅動的 BIM 工作流程」
  - 作者：CHIANG SHUOTAO（位置：Tokyo，但 README 為中文，與台灣開發圈密切）
  - 周邊倉庫：CAD_MCP_study / NAVISWORK_MCP / IFCSH
  - ⚠️ 框定原則 per REFLEXES #16：「台灣開發者貢獻國際 Revit MCP 開源生態」一個 case，不是「碩濤的個人 project」也不是「台灣本土 MCP 工具」

### D. 產業應用案例（verified）

#### D1. 公共工程指標案例

| 案例                    | 角色                              | 時間                 | Source                      |
| ----------------------- | --------------------------------- | -------------------- | --------------------------- |
| 台北捷運萬大線          | **首個將 BIM 列入契約的公共工程** | 2011 起              | 多源 confirm                |
| 台北捷運環狀線 Y19 車站 | BIM 高架車站設計應用              | 捷運技術半年刊 47 期 | data.taipei                 |
| 台灣高鐵苗栗站新建      | 設計變更 -20%，提早 2 個月開工    | —                    | flowbim / 公共工程資料      |
| 桃園機場第三航廈        | 台灣世曦設計、跨國協作 BIM        | 2017+                | ceci.org.tw（台巴交流參訪） |
| 高雄環狀輕軌            | BIM 設計工程顧問                  | 2013 動工            | klrt1.ceci.com.tw           |
| 高雄港旅運中心          | Scan-to-BIM + BIM+FM 案例         | —                    | bim.flow.tw                 |
| 鳳山車站改建            | 台灣世曦 BIM 全生命週期           | iThome 報導          | ithome.com.tw/people/137308 |
| 八卦山隧道維運          | 台灣世曦 BIM+FM                   | 同上                 | 同上                        |
| 新北社會住宅 BIM+FM     | 內政部建研所 + 台北市府實作       | 2026 發表            | moi.gov.tw                  |

#### D2. 工程顧問公司

| 公司                       | 重要事實                                                                                                                             | Source                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| **台灣世曦**               | 2010 年率先成立 BIM 整合中心；近 2000 名同仁九成具相關背景；總工程師林曜滄為主導者                                                   | 104.com.tw / ithome                   |
| **中華顧問工程司（CECI）** | 1969 年成立，2007 轉投資成立台灣世曦                                                                                                 | ceci.org.tw                           |
| **中興工程顧問**           | 1970 成立，1994 轉型 NPO 後轉投資中興工程顧問股份；建置 BIM 協同作業平台（ISO-19650 CDE 環境，7 主要模組）+ 計畫管理資訊系統（PMIS） | sinotech.com.tw / autodesk university |

#### D3. 大型營造／統包

| 公司                      | 重要事實                                                                                                                                                                                         | Source                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| **中鼎工程 CTCI（9933）** | 1979 由中技社籌設成立。2011 千代田化工建設（日商）取得最大股東。EPC 統包：煉油 / 石化 / 化工 / 電力 / 鋼鐵 / 環工。7500 員工（2021）。海外 EPC 重大案：沙烏地 Saudi Kayan、Amine、SAMAC MMA/PMMA | Wikipedia + ctci.com         |
| **達欣工程（2535）**      | 台積電「御用營造廠」之一。BIM 為基礎工具平台，建築專案整合協調。獲台積電南科 18P3 FAB 廠上部結構工程訂單                                                                                         | dacin.com.tw                 |
| **互助營造**              | 「累積完成高科技廠房總樓板面積，國內建廠經驗之最」                                                                                                                                               | futsu.com.tw                 |
| **台灣大林組**            | 日商 Obayashi 台灣分公司，1989 創立。承造台北大巨蛋、台北 101 全部、信義線、T3。其官網列「**施工圖管理與 BIM 運用**」為主要施工管理項目                                                          | obayashi.com.tw              |
| **三星物產／榮工**        | 桃機 T3 主體航廈土建工程 NT$445 億得標（2021-03）                                                                                                                                                | housefun.com.tw / chinatimes |
| **中華工程（RSEA）**      | 台灣 BIM 聯盟會員。前國營企業，現屬偉景集團                                                                                                                                                      | bimalliance.tw / Wikipedia   |

#### D4. 結構顧問

- **永峻工程顧問股份有限公司（EGC）**：1974 創立，超過 80 位專業人員（含 40 位執照工程師）。代表作品：**台北 101**、**高雄 85 樓 T&C Tower**。**CTBUH 全球前十大高樓結構顧問之一**。Source: egc.com.tw

### E. 產業現況（high-confidence）

#### E1. 缺工與老化

- 「**新北職災死亡人數 100+ 中，逾 40 歲占 77%**」（聯合新聞網）
- 「**1.5 萬名營造業移工名額即將核配完畢**」（自由電子報）
- 「年輕從業意願低迷」（今周刊 2024-12 報導）
- 大缺工時代：建築業 → 數位轉型 + BIM 成關鍵解方
- BIM 工程師職位需求增（104 / 1111 / 518 多平台招募中）
- BIM 工程師新手起薪 35,000-45,000 元，月薪 50,000+ 職位有 104 個職缺（巨匠電腦 / 1111 人力銀行）

#### E2. 文化阻力

- 過去政府建管流程基於 CAD，產業工作流程跟隨 CAD 作法，BIM 難以整合
- BIM 模型常變成「外包工作」，與實際工程脫節，許多 BIM 中心或團隊解散
- 學 BIM 不一定帶來顯著薪資成長，多數人選擇較經濟的學習路徑
- 「**業主對 BIM 應用缺乏充分認識，常以傳統工程流程作業，限制 BIM 技術效能**」

#### E3. 法律議題

- 「淺談 BIM 工程合約相關法律議題」（台灣省土木技師公會技師報）
- 「政府應仿工地主任職能課程制度將 BIM 人員分級制度納入公共工程」（公共政策網路參與平台提案）

### F. AI × BIM 新世代（high-confidence）

#### F1. Anthropic Model Context Protocol（MCP）

- **2024 年 11 月 25 日** Anthropic 開源 MCP
- 一個 open standard / open-source framework
- 標準化 AI 系統（如 LLM）與外部工具、系統、資料源的整合
- 隨之發布 Python / TypeScript / C# / Java SDK
- 預建 MCP servers：Google Drive、Slack、GitHub、Git、Postgres、Puppeteer
- 「**Think of MCP like a USB-C port for AI applications**」
- **2025 年 12 月** Anthropic 將 MCP 捐給 Agentic AI Foundation（Linux Foundation 下，Anthropic / Block / OpenAI 共同創辦）

**Source URLs**：

- https://www.anthropic.com/news/model-context-protocol
- https://en.wikipedia.org/wiki/Model_Context_Protocol

#### F2. Revit MCP 生態

| 項目                                  | 描述                                                                                                          | Source                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **Autodesk Revit 2027**               | 內建 MCP server + Autodesk Assistant。「找出所有缺機電標籤的房間」「設定 Phase 2 所有門的防火等級為 90 分鐘」 | blog.autodesk.io / architosh |
| **revit-mcp/revit-mcp**               | 國際開源（mcp-servers-for-revit 組織）                                                                        | github                       |
| **shuotao/REVIT_MCP_study**           | 73 stars / 85 forks。台灣開發者貢獻國際生態的 case                                                            | github                       |
| **chuongmep/mcp-revit-sample-au2025** | Autodesk University 2025 demo                                                                                 | github                       |
| **BIMLOGIQ Copilot**                  | MCP Tools 商業化產品                                                                                          | bimlogiq.com                 |

#### F3. AI × BIM 實例

- 設計階段：BIM × AI 精確模擬建築使用與維護場景
- 施工階段：AI 強化 BIM 規劃，動態預測所需人力、材料、機具
- ESG / 智慧城市：BIM 整合 GIS / IoT / Big Data，打造數位雙生（Digital Twin）
- 內政部建研所 2024+：「**數位雙生（Digital Twin）—建築資訊建模（BIM）與人工智慧（AI）整合應用可行性研究**」

---

## 找矛盾（Step 1.4 收斂）

**核心矛盾**：「政府推 BIM 推 12 年仍叫『因案制宜』非強制，但 Anthropic 一個 18 個月的 protocol 改寫了它的 onboarding」

**為什麼這是真正的矛盾**（不是表面對位）：

- 兩端時間鎖 anchor 在 cross-source verified 事件上：2014-05-23 公共工程委員會 BIM 平台 + 2024-11-25 Anthropic MCP + 2026-04 Revit 2027 MCP 公告
- 「12 年」vs「18 個月」是真實的、可量化的、有 anchor 的對位
- 「政府推不動」vs「Anthropic 一個 protocol」對比兩種推動模式 — 政策強制 vs 技術 platform — 這是台灣產業的反覆 pattern
- 矛盾不在「政府爛」或「AI 強」，而在「為什麼推動模式差異這麼大」這個更深的問題

**結尾素材鎖定（per Step 1.2）**：

- 候選 1：「碩濤在 2025 年底丟出 REVIT_MCP_study repo 那個 12 月，距離公共工程委員會 BIM 平台成立剛好 11 年又 7 個月。」（首尾呼應 anchor）
- 候選 2：「2014 年公共工程委員會 BIM 平台第一次開會時，台灣高鐵苗栗站還沒蓋。2026 年 Autodesk Revit 2027 公告內建 MCP 那天，台積電在高雄的下一座 fab 已經用全 BIM 圖說申請建照。十二年的『因案制宜』走到了一個它自己沒預料到的地方。」（時間跳躍式）

---

## Stage 1 收尾 checklist

- [x] 模式識別：**Fresh**（knowledge/Technology/ 確認無 BIM / Revit / 建築資訊 / 營建 / 建築科技條目）
- [x] 觀點成型 §section 已寫進本檔開頭
- [x] 六個核心問題答完（記憶 / 多元面貌 / 想法感受 / 歷史脈絡 / 社會關聯 / 類型專屬 Technology）
- [x] 七個品質維度 anchor 對照
- [x] 類型加權矩陣（Technology / Industry）：台灣的位置、全球供應鏈、未來方向 — 「台灣推 BIM 跟世界什麼樣的依存關係」「台灣做這件事的不可取代性」
- [x] 切入點清單 + 預期核心矛盾候選 → 收斂為 A
- [x] 搜尋深度 ≥ 40 次：**40 WebSearch + 3 WebFetch 完成**
- [x] 核心矛盾欄位填寫
- [x] 研究報告 frontmatter `viewpoint_formed: true`
- [x] 媒體授權矩陣三表 append（圖片 hero + 2 inline / inline 外連 / 無 transcript）
- [x] 結尾素材鎖定 2 個候選
- [x] 主動標記未驗證 claim（per REFLEXES #16）— 中鼎 BIM 部門編制未驗、台灣 BIM 普及率精確百分比未驗

---

## 觀察者私有素材整合（Step 1.6）

本次 ARTICLE-INBOX 提及哲宇 email reply draft `r-6742567238772772848` 給碩濤，預備兩篇文章可援引資源待碩濤補充。**Stage 1 自跑階段碩濤尚未補充內部資源**，本研究全部基於公開來源 + GitHub 公開 repo。

未來碩濤補充後可升級的部分：

- 中鼎 BIM 部門編制 / BIM 工程師人數
- 中鼎內部 BIM 應用案例（沙烏地 / 印度 / 國光石化等海外項目細節）
- BIM_MCP 開源動機 / 開發過程 / 台灣社群交流紀錄
- 碩濤本人對「政府推 12 年 vs Anthropic 18 個月」這個對比的看法

寫作護欄：本文以**公開來源**為主要敘事骨幹；碩濤個人 case 框定為「**台灣開發者貢獻國際 Revit MCP 開源生態的一個案例**」，不引導讀者把它讀成「碩濤的個人 project」或「中鼎的內部資源」。

---

🧬
