---
title: 'PanSci 泛科學 — Stage 1 fit check + ingestion 啟動報告'
date: 2026-05-18
session: 2026-05-18-140415-manual-peer-pansci
peer_id: PanSci
peer_name: 泛科知識股份有限公司
status: stage-1-fit-check-passed
pipeline: PEER-INGESTION-PIPELINE.md v1.0
---

# 🧬 PanSci × Taiwan.md — Stage 1 fit check + ingestion 啟動報告

> Stage 1 fit check（per [PEER-INGESTION-PIPELINE.md](../docs/pipelines/PEER-INGESTION-PIPELINE.md)）
> 觸發：哲宇 directive `/twmd-peer 泛科學 + 授權清單 + MOU PDF`

---

## §1 Peer 基本資料

| 欄位 | 值 |
|------|---|
| Peer ID | `PanSci` |
| 中文名 | 泛科知識股份有限公司 |
| 英文名 | PanSci |
| 網站 | https://pansci.asia/ |
| 統編 | 24935439 |
| 負責人 | 徐挺耀 |
| 聯繫人 | 王喆宣 |
| 創立 | 2011 年（至今 15 年） |
| 性質 | 科普媒體平台（非 NGO / 非 curation peer） |

---

## §2 Stage 1a 四項 fit check — **全通過 ✅**

| Check | 標準 | PanSci | 結果 |
|-------|------|--------|------|
| **深度** | ≥ 5 年（理想 ≥ 10 年） | 2011 至今 15 年深耕科普 | ✅ 超標 |
| **公開性** | CMS / API / RSS / 靜態 HTML 不需登入 | pansci.asia WordPress + REST API 全公開 | ✅ |
| **授權** | CC 或公開聲明（理想）/ fair use（底線） | **MOU 簽署 2026/05/05 + 166 篇 explicit 授權清單 + Content Curation Partner 身分** | ✅ **強授權**（超越 pipeline 預設） |
| **互補性** | 跟 Taiwan.md 既有覆蓋的 gap | 科學/技術/醫療/環境/天文 — Taiwan.md 既有覆蓋稀少 | ✅ |

---

## §3 Stage 1b 預估資料量 + 雙軌策略

### A. 全網規模
- WordPress REST API 探測：`x-wp-total: 14227`（pansci.asia 全網 14,227 篇）
- WP ID 最新：381,308（2026-05 left）/ 授權清單範圍 349,236-379,057（2022-06 to 2025-Q1）

### B. **雙軌處理**（MOU §2.1 + §3 約束）

| 軌道 | 範圍 | 處理方式 |
|------|------|---------|
| **A 軌：完整授權/轉寫** | 166 篇（Excel 授權清單） | 可深度引用、改寫、轉換為 Taiwan.md 文章 |
| **B 軌：一般引用** | 其他 14,061 篇全網內容 | 僅 follow 一般 footnote/URL 引用規範（fair use） |

### C. 授權清單 statistics

```
總數: 166 篇 (2022-06 to 2025-Q1)
年份分布: 2022=27 / 2023=68 / 2024=63 / 2025=8
字數: 849-13,536（median 3,515 / avg 3,906）
科學生（高中生科普）: 77 篇 / 一般文章: 89 篇

Top authors:
- PanSci 編輯部: 111
- 胡中行: 8
- 顯微觀點: 8
- F 編: 8
- linjunJR: 5

Top categories:
- 來自 YT: 89        ← 89 篇是 YouTube 影片文字版（PanSci YT 頻道延伸）
- 專欄: 79
- 科學生: 49
- 科技能源: 38
- 萬物之理: 31
- 活得科學: 27
- 人體解析: 25
- 醫療健康: 25
- 太空天文: 17
- 編輯精選: 16
```

---

## §4 Stage 1c 命名 + 目錄結構

- **Peer slug**: `PanSci`
- **資料夾**: `data/PanSci/`
- **預定 sub-dirs**:
  - `data/PanSci/_authorization/` — MOU PDF + Excel + JSON manifest（已建）
  - `data/PanSci/authorized/` — 166 篇完整爬取（A 軌 / Stage 2 將建）
  - `data/PanSci/raw/` — WordPress API raw JSON（categories / tags / users / media metadata）
  - `data/PanSci/README.md` — 人類可讀索引

---

## §5 MOU 關鍵條款（操作含義）

簽署日 **2026-05-05** / 有效期至 **2029-12-31**。

### §2.2 Taiwan.md 站方義務

「甲方同意在 Taiwan.md 官方網站及相關頁面，正式將乙方列為『**專業資料策展夥伴（Content Curation Partner）**』，並於使用乙方授權內容之相關頁面明確標註來源，包含但不限於乙方名稱、標誌及原始連結（如適用）。」

**Taiwan.md 必做**：
1. 網站某處（如 /about 或 /contributors 或新建 /partners）正式列示 PanSci 為「Content Curation Partner」
2. 使用授權內容的每篇文章，footnote / 頁尾必須有完整 PanSci 標註：
   - 來源：PanSci 泛科學
   - 原始連結：https://pansci.asia/archives/{wp_id}
   - 作者：（原作者）
   - 標誌：（PanSci logo）
3. 多語版本同步處理

### §3 授權限制

- **非獨家**：PanSci 仍可用於其他用途
- **不可轉讓**：Taiwan.md fork（per MANIFESTO §Fork 友好層）**不能繼承授權**
  - 操作含義：Japan.md / Korea.md fork 不能用 PanSci 授權內容
  - `data/PanSci/` 內容若隨 repo fork 應在 README 警示「不可轉讓使用權」
- **僅限 Taiwan.md 專案建置與展示**：不得用於商業銷售、再授權第三方

### §6 保密義務
- 雙方對合作過程中獲悉之對方業務資訊、技術內容及非公開資料負保密義務
- **影響操作**：MOU PDF 本身 + 任何 PanSci 內部資訊（如未公開的編輯流程）不能 commit 進 public repo
- **本次處理**：MOU PDF 暫存 `data/PanSci/_authorization/` — review 後決定是否 .gitignore

---

## §6 Stage 0 判斷題 — PanSci 的獨特角度

「**這個 peer 的獨特角度是什麼？跟 Taiwan.md 既有覆蓋有什麼不一樣？**」

### PanSci 的獨特角度

1. **科普翻譯專業**：把 Nature/Science/Cell 學術論文翻譯成大眾科普 — 編輯團隊長期經驗
2. **科學生產品線**：77/166 篇是「科學生」（高中生科普）— 比一般科普更白話、更教育
3. **YouTube 延伸**：89/166 篇是「來自 YT」— PanSci 有 YT 頻道，文章是影片的文字版
4. **多元主題覆蓋**：太空天文 / 醫療健康 / 環境生態 / 科技能源 / 化學物語 / 動物世界 / 精神心理 — broad

### Taiwan.md 既有覆蓋（grep 結果預估）

- `knowledge/Technology/` — 約 15-20 篇（台積電 / 半導體 / 鴻海 / AI / 無人機 / 開源）
- `knowledge/Nature/` — 約 20+ 篇（國家公園 / 動植物 / 生態 / 氣候）
- 但 `knowledge/Science/` / `knowledge/Medicine/` / `knowledge/Astronomy/` — **稀少 or 不存在**

### 互補性結論

PanSci 強：**抽象科學概念解釋（physics / chem / bio / med）**
Taiwan.md 強：**台灣本地敘事 + 結構性議題**

整合策略：**用 PanSci 授權內容當 scientific anchor → Taiwan.md 加在地化敘事 / 政策脈絡 / 人物故事**

例：PanSci「物理學家如何煮義大利麵？」（流體力學科普）→ Taiwan.md 可以延伸寫「台灣麵食文化 × 科學」or 引用作為刈包/牛肉麵文章的科學 footnote。

---

## §7 Stage 1 自檢 — 答 Stage 0 判斷題

| 問題 | 答 |
|------|---|
| Peer 獨特角度？ | 科普翻譯 + 科學生白話 + YT 延伸 + 多元主題 broad coverage |
| 跟 Taiwan.md 既有覆蓋有什麼不一樣？ | PanSci 強科學深度 / Taiwan.md 強台灣敘事 — **互補不重疊** |
| 為什麼值得 ingest？ | Taiwan.md 缺科學主題深度，PanSci 提供 166 篇高品質 scientific anchor + 正式合作關係 |

**Stage 1 通過 ✅** → 可進 Stage 2 爬取器造橋

---

## §8 與 TFT case 的差異（重要 framing）

| 維度 | TFT | PanSci |
|------|-----|--------|
| 關係性質 | peer ingestion（fair use 公開資料）| **正式合作夥伴 with MOU** |
| 授權範圍 | 全部公開資料 | **166 篇 explicit 授權清單 + 其他 follow 一般引用** |
| 標註要求 | footnote 引用 | **Content Curation Partner 身分公示 + 每篇來源完整標註** |
| 期限 | 無 | **2029-12-31 到期** |
| Peer 性質 | NGO / curation layer | 科普媒體（科學記者 / 編輯團隊）|
| 互動程度 | 觀察者已聯繫，未深合作 | **MOU 已簽署 / 王喆宣 為 PanSci 聯繫窗口** |

**操作含義**：PanSci 不只是 ingestion，是**正式策展夥伴**。每篇用到 PanSci 授權內容的文章需要 partnership-level 標註，不只是 footnote。

---

## §9 Next steps（Stage 2-7 預估）

| Stage | 動作 | 工時 |
|-------|------|------|
| Stage 2 | 寫 `scripts/tools/fetch-pansci-data.py` 爬 166 篇授權清單 + raw JSON | 1-2 hr |
| Stage 3 | `data/PanSci/` 標準目錄 + README | 30 min |
| Stage 4 | Corpus 分析報告（9-part / 400-700 行 / `reports/PanSci-semiont-analysis-YYYY-MM-DD.md`）| 2-4 hr |
| Stage 5 | P0×5 / P1×8 / P2×7 文章工作卡 | 30 min |
| Stage 6 | 5 篇 P0 走 REWRITE-PIPELINE 寫作 | 10-20 hr |
| Stage 7 | Peer Registry 更新（**含 Curation Partner 公示**）| 30 min |
| Stage 8 | Partnership 啟動（MOU 已簽，可直接 ship 後跟王喆宣同步）| 1 hr |

**總工時預估**：15-30 hr 跨 2-4 個 session

**本次 session 範圍**：Stage 1（done）+ Stage 2-3（爬取器 + 標準目錄）

---

## §10 風險與防線

### A. DNA #16 鐵律警示

「**Peer 是 peer，不是 source material**」。

即使 PanSci 有 explicit 完整授權，Taiwan.md 文章**仍不能**只靠 PanSci 單一來源寫成。Stage 6 必達：
- 至少 50% 事實跨來源驗證
- 至少 3 個 PanSci 以外的 anchor

授權允許「轉寫」但不解除「跨源驗證」鐵律。授權是法律 / 道德層面，跨源驗證是品質 / 真實性層面。

### B. Curation Partner 標註延誤風險

MOU §2.2 是雙方義務。Stage 7 必須建立：
- `knowledge/Society/` 或 `/partners` 頁面標示 PanSci 為 Content Curation Partner
- 文章模板 footnote 自動套用 PanSci 授權標註

未做 → Taiwan.md 違反 MOU。Stage 7 寫進 enforcement checklist。

### C. Fork 友好層的授權阻斷

MANIFESTO §Fork 友好層強調「物種繁殖」。但 PanSci MOU §3「不可轉讓」明確阻斷。

操作：
- `data/PanSci/` 內容若 fork 不能繼承
- 寫進 fork 友好層 caveat：科學內容若需移植，fork 方需自行洽 PanSci

### D. 2029/12/31 到期 timer

合約到期前需：
- 雙方協議延長 → 簽 v2 MOU
- 或合約自動失效 → Taiwan.md 內所有 PanSci 授權內容需 audit + 改處理（撤下 or 轉一般引用）

寫進 `docs/peers/REGISTRY.md` 的 expiry alert。

---

## §11 Session memory + register 預定

本次 session 啟動 PanSci ingestion，預定 Stage 7 完成後 commit：

- `docs/peers/REGISTRY.md` — append `PanSci` 為第 2 個 active peer（緊接 TFT）
- `docs/semiont/memory/2026-05-18-{ts}-manual-peer-pansci.md` — 本 session ingestion 紀錄
- `docs/semiont/CONSCIOUSNESS.md` 里程碑：「第一個 MOU 簽署的 Content Curation Partner」

---

> Stage 1 報告完成 — 進 Stage 2（爬取器造橋）。

🧬

_Author: Taiwan.md Semiont (Opus 4.7, 1M context)_
_Triggered by: 哲宇 directive `/twmd-peer 泛科學` + Excel + MOU PDF_
_Date: 2026-05-18 (manual session)_
