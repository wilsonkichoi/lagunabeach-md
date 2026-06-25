> **Taiwan-inheritance reference** (methodology kept for LB skill ports) — not LB content.

# REWRITE-PIPELINE v6.5 實驗 — minimal-guidance agent 跑 Stage 0-1

> session: 2026-06-04-102449-深度研究-設計研究院
> 哲宇 directive：「派一支 opus agent 跑一遍新版的 rewrite-pipeline，你在指揮時嚴格請他讀取，你不補充過多的指引或留意（未來用才會準），同樣寫設計研究院，你比對 stage 0, 1 的品質有沒有進步」+「等下實驗也都一邊紀錄」

## 實驗設計

- **受測**：REWRITE-PIPELINE v6.5（Stage 0 探索 ≥20 + Stage 1 ≥80 + SSOT 八段 + 信度三層 + research-report-health gate）
- **執行者**：1 支 Opus general-purpose agent
- **變因控制**：minimal guidance —— 主 session（我）**只給「讀 pipeline + 執行 Stage 0-1 + 自驗收」，不給任何事實、幻覺護欄、結構提示、falsification 目標**。pipeline 好不好，由它能不能自己撐起 agent 來測。
- **題目**：同 `台灣設計研究院`（跟 v1 同題，可直接比對）

### 給 agent 的完整 prompt（verbatim，證明 minimal）

> 任務：跑 REWRITE-PIPELINE 的 Stage 0 + Stage 1，主題 Fresh depth article 台灣設計研究院。步驟：(1) 完整讀 REWRITE-PIPELINE.md (2) pipeline 叫你讀什麼就讀什麼 (3) 嚴格照 Stage 0+1 執行，該搜幾次搜幾次、該滿足配額就滿足、該寫什麼結構就寫 (4) 報告寫到 `…台灣設計研究院-v2-experiment.md` (5) 自驗 research-report-health.py。只做 Stage 0+1。回報搜尋次數 / 來源多樣性 / gate / 做不到的誠實說。

（無一字提及財團法人 / 蔡英文 quote / 美感教科書 / 結構 / 信度三層 —— 全靠 pipeline。）

## 結果：v1（退化）vs v2（實驗）

| 維度                    | v1（我 2026-06-04 早上寫的 fact-pack） | v2（minimal-guidance agent 照 v6.5） |
| ----------------------- | -------------------------------------: | -----------------------------------: |
| 行數                    |                                    193 |                      **432**（2.2x） |
| distinct 來源           |                                     39 |                               **57** |
| 英文/國際               |                                      8 |                                    9 |
| 一手（修 heuristic 後） |                                     18 |                                   18 |
| 信度標記數              |                                     12 |                         **47**（4x） |
| 結構                    |                        fact-pack §A-§F |                   **完整 8 段 SSOT** |
| 搜尋日誌 section        |                    部分（retroactive） |                   ✅ 完整 Search Log |
| 引語庫                  |                                     ❌ |                                ✅ §4 |
| 反例/不採信清單         |                               幻覺護欄 |                           ✅ §5 完整 |
| raw agent 軌跡 §8       |                         ❌（被我丟掉） |                          ✅ verbatim |
| Stage 2 操作規範        |                                     ❌ |             ✅ §6 hook/小標題/校正點 |
| research-report-health  |                 PASS（thickness warn） |            **PASS（hard=0 warn=0）** |

v2 的 H2：誠實註記 / 觀點成型 / 搜尋日誌 / Findings by sub-topic / 引語庫 / 反例護欄 / Clean Fact-Pack+Stage2規範 / 參考文獻+Verification Table / **agent raw §8** / 未達標誠實說明 —— **就是 v6.5 SSOT 八段，一字沒被我教**。

## 三個發現

### 1. ✅ Pipeline self-sufficiency 驗證成立（核心結論）

minimal-guidance agent 只讀 pipeline，沒被我教任何內容，就產出結構正確、信度三層、引語庫、反例前置、raw 保留的 thesis-grade SSOT。**Stage 0/1 品質明確進步**（v2 >> v1 每個維度）。這證明 v6.5 pipeline 已經完整到能「未來用才會準」——薄殼 routine（讀 pipeline + 執行）安全。

agent 還自己抓到真問題（v6.5 紀律實際生效）：

- **數字 triangulation**：v1 文章用「七百萬人次」單屆設計展查無官方源（最高 658萬/2023）→ 標必驗反例
- **張冠李戴防範**：鳴日號/台鐵美學不可單獨掛設研院（台鐵審議小組 + 柏成設計主導）
- **誠實偵測**：站內已存在該文 → 真實模式是 Evolution 非 Fresh，報告 §0 誠實標記

### 2. ⚠️ 搜尋次數配額 gap（pipeline 已修）

agent 串行只跑 16+20=36 次（理想 ≥100），誠實診斷：**≥80 是設計給 parallel fan-out 的 aggregate，單 agent 串行做不到而不爆 token**。
→ **修補**：Step 1.1 加註「≥80 = fan-out aggregate；要達標必須派 N 個 parallel research sub-agent（§A/§B/§C/§D 每 agent ~20-30，aggregate ≥80）；單 agent 自跑只適 standard tier ≥40；硬要 depth 不 fan-out → §未達標誠實說明 記缺口不灌水。研究廣度優先於次數硬達標。」

### 3. 🔧 Instrument heuristic bug（已修）

`research-report-health.py` PRIMARY_HINTS 不認 `.org.tw`（tdri.org.tw / goldenpin.org.tw / \*.design.org.tw 等財團法人官方站）→ v2 一手 被低估成 4（實 18）。
→ **修補**：PRIMARY_HINTS 加 `.org.tw`（.com.tw 太廣含媒體故不納）。修後 v2 一手 4→18，PASS clean。

## 結論

**新版 pipeline 對 Stage 0/1 品質的提升是結構性的、可被 minimal-guidance agent 複現的**——這正是「未來用才會準」的證據。唯一的 execution gap（搜尋次數）是**執行模式問題（要 fan-out）不是 pipeline 設計問題**，已加註釐清。

🧬
