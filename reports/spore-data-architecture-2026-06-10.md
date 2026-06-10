---
title: '孢子資料架構解耦 — spores.json 獨立資料層設計與遷移'
date: 2026-06-10
session: '2026-06-10-spore-data-architecture'
type: 'architecture-design'
status: 'shipped'
trigger: '哲宇 callout：孢子數字回填會改文章檔案，污染 /latest 最新文章排序與「最近更新」訊號'
related:
  - 'reports/spore-ssot-pipeline-cleanup-2026-05-08.md'
  - 'reports/latest-articles-discoverability-design-2026-06-09.md'
  - 'reports/seo-optimization-plan-2026-06-07.md'
---

# 孢子資料架構解耦 — spores.json 獨立資料層

> **一句話**：孢子的 engagement 數字搬出文章 frontmatter，住進自己的 JSON 記錄層（`src/data/spores.json` + `public/api/spores.json`）；文章只留不可變的 identity pointer（id / platform / date / url）。從此 harvest 回填只動孢子自己的檔案，文章的 git 時間軸乾淨了。

---

## 1. 觸發與目標

哲宇 2026-06-10 callout：抓取孢子數字時會更新進文章（frontmatter `sporeLinks` 的 views/likes/...），這個寫入直接影響「最新文章列表」跟「最近更新的文章」的排序。孢子資料更新不該等於文章更新。

**目標（哲宇原話的工程翻譯）**：

1. 文章持有一個孢子 index，指向孢子記錄是哪一筆（pointer，不是 payload）
2. 孢子有自己的列表 + 完整資料記錄 + 靜態化 API（對齊文章的 `article-index.json` / `articles.json` 模式）
3. 孢子數字更新不影響文章本體與文章的更新日期
4. 孢子成為獨立資料來源，可被索引、可被資料組合

## 2. 現況盤點

### 2.1 資料層級（2026-05-08 Phase 0-3 SSOT cleanup 後的現狀）

| 層                                 | 角色                                                 | 寫入者                         |
| ---------------------------------- | ---------------------------------------------------- | ------------------------------ |
| `SPORE-LOG.md §發文紀錄`           | Identity SSOT（# / 日期 / 語言 / 平台 / slug / URL） | 人類 / publish routine         |
| `SPORE-HARVESTS/{batch}.md`        | Harvest event SSOT（孢子 #N 在 D+N 的數字）          | harvest routine                |
| `knowledge/*.md` `sporeLinks`      | Derived view，**含 mutable 數字**                    | `sync-spore-links.py --apply`  |
| `src/content/zh-TW/*.md`           | knowledge 的 mirror                                  | 同上 + sync.sh                 |
| `public/api/dashboard-spores.json` | Dashboard 分析聚合（totals / top / weekly）          | `generate-dashboard-spores.py` |

### 2.2 污染鏈（這次要切斷的）

```
SPORE-HARVESTS/{batch}.md  (cron 收割寫入數字)
   ↓ sync-spore-links.py --apply        ← refresh-data Step 13 + 每次 npm run prebuild (prebuild:status)
knowledge/{Cat}/{slug}.md frontmatter 數字被改   ← 唯一的 mutation 點
   ↓ commit（subject 多為 spore/harvest/memory 類，只有 [routine] 被排除）
build-content-dates.mjs  (git log 取每檔最新非 cosmetic commit)
   ↓ src/data/content-dates.json
   ├─ getLatestArticles() → /latest（6 語）+ /explore 最新區塊 + 首頁最新入口
   ├─ build-latest.mjs → /api/latest.json → 文章頁「站上最新」rail
   ├─ astro.config.mjs → sitemap <lastmod>          ← SEO freshness 一起被污染
   └─ article.template.astro → JSON-LD dateModified  ← 同上
```

### 2.3 量化證據（2026-06-10 實測）

- 57 篇 zh 文章帶 `sporeLinks`，其中 **34 篇（60%）** 的 content-date 來自 spore 相關 commit（ship / harvest / 回填 / SSOT cleanup），不是真實內容更新
- 12+ 篇凍在 2026-05-09 `5db9f136e`（上一輪 spore SSOT cleanup 批次 commit）— 上次重構自己也成了污染源，這次遷移 commit 必須先教 content-dates 認得排除
- a88bdd119（6/10 13:15「孢子 engagement 回填 6 篇」）讓嘻哈等 6 篇在下次 prebuild 取得假新鮮日期
- 影響面超出 /latest 美觀問題：sitemap lastmod 假更新正是 Google 點名的「artificially refreshing」紅旗（6/7 SEO session 修掉全站 lastmod=now，這條從側門又漏回來）

### 2.4 為什麼 2026-05-08 那輪 cleanup 沒解決這個

那輪解的是「sporeLinks 手寫 drift」（讓它變 derived view，從 SSOT 重生）。方向正確，但 derived view 的**落點**選在文章 frontmatter，等於把高頻 mutable 數據寫進低頻的內容檔案。資料正確性修好了，時間軸耦合是這次才浮出的第二層問題。

## 3. 目標架構

```
SSOT 層（完全不動 — 工廠 routine 零改動）:
  docs/factory/SPORE-LOG.md            發文紀錄 identity
  docs/factory/SPORE-HARVESTS/*.md     harvest events

衍生記錄層（新 — 孢子自己的完整資料）:
  src/data/spores.json                 generate-spore-records.py 產出，git tracked
                                       per-spore: id / slug / articlePath / articleUrl /
                                       lang / platform / date / url / metrics(latest) /
                                       metricsAsOf / history[]（全部 D+N 快照）
                                       + byArticle index { slug: [ids] }

靜態 API 層（新 — 隨站 deploy，站外可索引）:
  public/api/spores.json               同內容（gitignored，prebuild 重生，CI build 自帶）

文章層（identity pointer，append-only，只在發新孢子時動一次）:
  knowledge/{Cat}/{slug}.md
    sporeLinks:
      - id: 132
        platform: 'threads'
        date: '2026-06-09'
        url: 'https://...'
    （不再有 views / likes / reposts / comments / shares）

消費端:
  SporeFootprint.astro                 frontmatter 給 identity，數字 join src/data/spores.json
  dashboard                            維持 dashboard-spores.json（不動）
  content-dates.mjs                    文章檔不再被 harvest 改動 + COSMETIC 補 spore commit 排除
```

### 3.1 設計決策與取捨

**D1 — frontmatter 留 identity pointer，不留數字、也不全刪。**
全刪（純 slug join）會讓 knowledge/ 不再自我描述（fork 拿走 markdown 就斷）、且 SPORE-LOG slug 對檔名的 normalize 已知脆弱（emoji 前綴 / 版本括號）。留 pointer 哲宇點名要、append-only、發布當天才動一次。`id` 讓「指向哪一筆記錄」顯式化，`url` 兼作 join fallback。

**D2 — spores.json 是 derived，markdown 工廠仍是 SSOT。**（⚠️ 同日下午被 [spore-json-ssot-2026-06-10.md](spore-json-ssot-2026-06-10.md) 取代：結構層 SSOT 翻成 spore-log.json + spore-metrics.json，敘事留 markdown）
harvest cron / publish routine / 五份 SPORE-\* pipeline 全部圍著 SPORE-LOG + SPORE-HARVESTS 運作，改 SSOT 位置 = 重訓整個繁殖系統，blast radius 不成比例。derived JSON 已滿足「獨立資料源、可索引、可組合」。未來若要 JSON-as-SSOT（harvest 直接寫 JSON、markdown 變 view）是獨立的 Phase，本輪不做。

**D3 — history 進記錄層。**
SPORE-HARVESTS 有每次 D+N 快照，現行 sporeLinks 只留最新一筆。spores.json 把完整時間序列收進 `history[]`，這是「更完整的記錄」的實體：成長曲線、平台對比、viral 偵測都可以直接組合。

**D4 — 保值規則（防止數字遺失）。**
有些孢子的數字只存在現行 frontmatter（早期 harvest 沒有 body row）。生成順序：harvest body（primary）→ 前一版 spores.json（preserve）→ 一次性 `--seed-frontmatter`（遷移時把現行 frontmatter 數字收進記錄層，之後才 strip）。對齊 contributors.json 的 preserve-on-fail 模式。

**D5 — git tracking 策略。**
`src/data/spores.json` tracked（build-time import、fresh clone 可 dev、harvest 數字變動有單一 diff 落點）；`public/api/spores.json` gitignored（prebuild 重生，CI 自帶，避免雙份 diff noise）。

**D6 — content-dates COSMETIC 補丁（雙保險 + 歷史清洗）。**
架構解（文章檔不再被動）是主修復；commit-subject 排除是 belt-and-suspenders + 歷史污染清洗。新 pattern 走 type-position 精準匹配（`^🧬 \[semiont\] spore\b` 等），實測不誤傷 `heal: ... 孢子 #132 查證抓出文章 date error` 這類真內容修正。發布紀律同步寫進 SPORE-PIPELINE：spore ship commit 只准動 frontmatter sporeLinks + factory 檔，內文修正一律另開 heal commit。

## 4. 實作計畫

| #   | 變更                                                      | 檔案                                                                                          |
| --- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | 新生成器：records + 靜態 API                              | `scripts/tools/generate-spore-records.py`（新）                                               |
| 2   | identity-only 寫回                                        | `scripts/tools/sync-spore-links.py`（render/entry shape 改）                                  |
| 3   | 消費端 join                                               | `src/components/SporeFootprint.astro`                                                         |
| 4   | COSMETIC 擴充                                             | `scripts/core/build-content-dates.mjs`                                                        |
| 5   | 遷移：57 zh + 22 譯文 strip metrics（10 檔 dry-run 先行） | knowledge/ + src/content mirrors                                                              |
| 6   | Guard + wiring                                            | `validate-spore-data.py` / `package.json` prebuild:spores / `refresh-data.sh`（REFLEXES #43） |
| 7   | 文件同步                                                  | SPORE-LOG §SSOT 階層 / SPORE-HARVEST-PIPELINE / SPORE-PIPELINE SHIP step / DNA gene map       |

## 5. 驗證標準（過了才算 ship）

1. `npm run prebuild` 全綠；spores.json 記錄數 = SPORE-LOG 發文紀錄有效行數
2. **解耦實證**：改一筆 SPORE-HARVESTS 數字 → `sync-spore-links --apply` 對 knowledge/ 0 diff；`generate-spore-records` 對 spores.json 有 diff；content-dates.json 文章日期不變
3. 遷移後 frontmatter 無任何 metric 欄（validator hard guard 上線）
4. SporeFootprint 渲染數字與遷移前一致（嘻哈 369 共鳴等 spot-check）
5. /latest 排序：被污染的 34 篇在 COSMETIC 補丁後回到真實內容日期
6. 數字保值：現行 frontmatter 的每一筆 metrics 都能在 spores.json 找到（無遺失）

## 6. 邊界與不做的事

- 不動 SPORE-LOG / SPORE-HARVESTS 的格式與寫入流程（harvest cron 零改動）
- 不動 dashboard-spores.json（分析聚合層繼續服務 dashboard）
- ~~不做 JSON-as-SSOT 反轉（記錄在此作為未來選項）~~ → 同日下午哲宇拍板執行，見 [reports/spore-json-ssot-2026-06-10.md](spore-json-ssot-2026-06-10.md)（結構層翻 JSON、敘事留 markdown）
- 譯文的 sporeLinks 本輪只 strip metrics 成 identity-only，不建跨語言 join（SporeFootprint 在譯文頁照常用該檔自己的 identity entries）

---

_v1.0 | 2026-06-10 | 哲宇 directive「先寫 report 再完整實作、邊做邊測試驗證」_
_遷移範圍 79 檔 > 50 檔 §自主權邊界：哲宇本人下令，已授權；批次仍守 10 檔 dry-run 鐵律_
