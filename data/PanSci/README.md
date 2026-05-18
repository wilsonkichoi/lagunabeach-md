# PanSci 泛科學 — Content Curation Partner 資料集

Taiwan.md 第一個正式簽 MOU 的 Content Curation Partner（per `data/PanSci/_authorization/` MOU 2026-05-05）。

- **乙方**：泛科知識股份有限公司（統編 24935439 / 負責人 徐挺耀）
- **聯繫窗口**：王喆宣
- **網站**：https://pansci.asia/
- **創立**：2011 年（至今 15 年）
- **CMS**：WordPress + REST API（`/wp-json/wp/v2/`）
- **全網規模**：14,227 篇（2026-05 探測）

## 合作架構（雙軌）

| 軌道 | 範圍 | 處理方式 | 子目錄 |
|------|------|---------|--------|
| **A. 完整授權/轉寫** | 166 篇 explicit 授權清單 | 可深度引用、改寫、轉寫為 Taiwan.md 文章 | `authorized/` |
| **B. 一般引用** | 其他 14,061 篇全網內容 | 僅 follow 一般 footnote/URL 引用規範（fair use）| 不爬，標準引用 |

## 授權範圍（A 軌）

- **數量**：166 篇（2022-06 to 2025-Q1）
- **MOU 簽署日**：2026-05-05
- **MOU 有效期**：至 2029-12-31
- **授權清單**：[`_authorization/authorize-list.json`](_authorization/authorize-list.json)（machine-readable）
- **授權清單原始檔**：[`_authorization/pansci_2022_2025_authorize.xlsx`](_authorization/pansci_2022_2025_authorize.xlsx)
- **MOU PDF**：`_authorization/Taiwan-md_PanSci_MOU_2026-05-05.pdf`（gitignored — 含對方聯繫資訊，per MOU §6 保密義務不入 public repo）

## 授權限制（MOU §3）

- **非獨家**：PanSci 仍可用於其他用途
- **不可轉讓**：⚠️ Taiwan.md fork（per MANIFESTO §Fork 友好層）**不能繼承授權**
- **僅限 Taiwan.md 專案建置與展示用途**：不得用於商業銷售、再授權第三方
- **每篇使用授權內容的頁面必須標註**：PanSci 名稱、標誌、原始連結
- **Taiwan.md 官網**：必須正式列示 PanSci 為「**Content Curation Partner 專業資料策展夥伴**」

## 授權清單 statistics

```
總數: 166 篇
年份: 2022(27) / 2023(68) / 2024(63) / 2025(8)
字數: 849-13,536（median 3,515 / avg 3,906）
科學生（高中生科普）: 77 篇
一般科普: 89 篇

Top authors:
- PanSci 編輯部: 111
- 胡中行: 8
- 顯微觀點: 8
- F 編: 8
- linjunJR: 5

Top categories:
- 來自 YT: 89   ← 89 篇是 YouTube 影片文字版
- 專欄: 79
- 科學生: 49
- 科技能源: 38
- 萬物之理: 31
- 活得科學: 27
- 人體解析: 25
- 醫療健康: 25
- 太空天文: 17
```

## 目錄結構

```
data/PanSci/
├── README.md                          # 本檔
├── _authorization/                    # 授權文件區
│   ├── pansci_2022_2025_authorize.xlsx  # 原始授權清單
│   ├── authorize-list.json              # machine-readable 版（166 篇）
│   └── Taiwan-md_PanSci_MOU_2026-05-05.pdf  # gitignored
├── authorized/                        # 166 篇授權內容（A 軌爬取結果）
│   └── {wp_id}-{title-slug}.md
└── raw/                               # WordPress API raw JSON provenance
    ├── manifest.json
    ├── posts.json
    ├── categories.json
    └── tags.json
```

## 爬取器

爬取器：[`scripts/tools/fetch-pansci-data.py`](../../scripts/tools/fetch-pansci-data.py)

```bash
# 跑全部 166 篇授權清單
python3 scripts/tools/fetch-pansci-data.py

# Dry-run（不下載，只列計畫）
python3 scripts/tools/fetch-pansci-data.py --dry-run

# 只跑前 N 篇（測試）
python3 scripts/tools/fetch-pansci-data.py --limit 5
```

爬取器特性：
- Idempotent（可重跑，預設 skip 已存在的 markdown）
- Rate limit 1.2s/request（保守，PanSci WP server 穩定）
- HTTP 429/503 retry with exponential backoff
- HTML → markdown 轉換（headings / links / images / lists / blockquotes）
- Featured image / author / categories / tags 完整保留

## 上次爬取

請見 [`raw/manifest.json`](raw/manifest.json)。

## 下次建議重爬

授權清單若有更新（雙方再協議），先更新 `_authorization/authorize-list.json`，再 re-run crawler。

文章內容若 PanSci 站方更新（少見），可手動 re-fetch 特定 WP ID。

## 跟其他 peer 的差異

| 維度 | TFT（fair-use peer）| PanSci（MOU partner）|
|------|--------------------|----------------------|
| 關係 | peer ingestion 公開資料 | **正式合作夥伴 with MOU** |
| 授權 | fair use 引用 | **explicit 完整授權清單** |
| 標註 | footnote 引用 | **Content Curation Partner 公示 + 每篇來源標註** |
| 期限 | 無 | **2029-12-31 到期** |

## 參考文件

- Stage 1 fit check 報告：[`reports/PanSci-stage1-fit-check-2026-05-18.md`](../../reports/PanSci-stage1-fit-check-2026-05-18.md)
- Pipeline 規格：[`docs/pipelines/PEER-INGESTION-PIPELINE.md`](../../docs/pipelines/PEER-INGESTION-PIPELINE.md)
- Peer registry：[`docs/peers/REGISTRY.md`](../../docs/peers/REGISTRY.md)

🧬
