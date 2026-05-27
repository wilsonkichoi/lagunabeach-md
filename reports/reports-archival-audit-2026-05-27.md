---
title: 'reports/ 資料夾散亂度體檢 + 歸檔策略提案'
description: '全專案 report 位置 inventory / 健康分槽 vs 散亂 vs 殭屍 / 113 top-level *.md 散亂度評分 / docs/reports/ legacy 殭屍位置 / 三層歸檔策略 + 具體 action items'
date: 2026-05-27
session: 2026-05-27-manual
type: audit
status: proposal
audience: 哲宇 (decision pending — 本 report 純 audit，未動手)
---

# reports/ 資料夾散亂度體檢 + 歸檔策略提案

## TL;DR

全專案有 **3 個真正的 report 儲存點**：

1. **`reports/`**（根目錄）— 254 MB / 390 git-tracked files / **活躍主要囤積點**
2. **`docs/reports/`** — 232 KB / 18 files / **🚨 殭屍位置（3 月底至 4 月初遺跡，被引用 4 次都是歷史 memory/diary）**
3. `.claude/worktrees/*/reports/` — 17 GB / 44 worktree clone，**已 gitignored，OK 不用管**

**主要問題**：

- 🚨 **`reports/*.md` 頂層散落 113 個 ad-hoc 報告**，命名整齊（YYYY-MM-DD 後綴）但 **prefix 完全自由式**，沒分類、沒索引，5 月一個月新加 64 個
- 🚨 **`docs/reports/`** 是殭屍位置（最後 commit 4/7），但被 4 個歷史 session memory 引用過，搬移成本低
- ⚠️ `reports/scratch/` POC 該 gitignored 但被 tracked
- ⚠️ 4 個 single-file orphan 子目錄（`branch/` / `threads-crawl/` / `build-perf-experiment/` / `test-owl-prose/`），孤立散亂

**推薦行動**（per 哲宇 directive — 本份僅 audit，動手另議）：

| 優先序 | Action                                                                                       | 風險           | 預估時間           |
| ------ | -------------------------------------------------------------------------------------------- | -------------- | ------------------ |
| P0     | gitignore `reports/scratch/`                                                                 | 低             | 5 min              |
| P0     | `docs/reports/` 全搬到 `reports/archive/2026-Q1/`（哲宇已 confirm）                          | 低             | 30 min             |
| P1     | 建立 `reports/INDEX.md` SSOT（按 type / 月份雙軸）+ cron 每日 regen                          | 中             | 1 hour             |
| P2     | 規範 filename convention（新加 report 必須 `{type}-{topic}-{date}.md`）                      | 低（不搬舊檔） | 文件規範 30 min    |
| P3     | Quarterly archive：90+ 天無 reference 的頂層 `*.md` zip 進 `reports/archive/{YYYY-Q}.tar.gz` | 中             | per quarter 30 min |
| P4     | 整理 4 個 single-file orphan 子目錄（promote 成 routine 或 fold 進 archive）                 | 低             | 30 min             |

---

## 1. 全專案 report 位置 inventory

### 1.1 三個真正的儲存點

| 位置                           | 大小       | 檔案數   | git-tracked     | 用途                        | 狀態        |
| ------------------------------ | ---------- | -------- | --------------- | --------------------------- | ----------- |
| `reports/`                     | **254 MB** | 390      | 390             | 活躍主要囤積點              | 部分散亂    |
| `docs/reports/`                | 232 KB     | 18       | 18              | 殭屍位置（3-4 月遺跡）      | 🚨 廢棄候選 |
| `.claude/worktrees/*/reports/` | 17 GB      | (clones) | 0（gitignored） | 平行 session worktree clone | ✅ OK       |

### 1.2 反向引用熱度

| 位置            | 被引用次數                      | 結論        |
| --------------- | ------------------------------- | ----------- |
| `reports/`      | **239**                         | 真活躍 SSOT |
| `docs/reports/` | **4**（全在 4 月 memory/diary） | 殭屍位置    |

`docs/reports/` 的 4 個 references：

- `docs/semiont/memory/2026-04-14-κ.md`
- `docs/semiont/memory/2026-04-04.md`
- `docs/semiont/memory/2026-04-14-ι.md`
- `docs/semiont/diary/2026-04-14-ι.md`

→ 都是 4 月歷史 session 紀錄的 pointer，**不是活的 SOP 引用**。搬移後加一個 README.md pointer 即可，不會打斷任何 live 流程。

### 1.3 排除項

- **`docs/semiont/harvest/backend/src/reporter/`** — 是 backend reporter module 程式碼，不是 report 儲存點，不算入 audit scope
- **`.claude/skills/twmd-weekly-report/`** — skill definition folder，不是 report 儲存點

---

## 2. `reports/` 內部解剖

### 2.1 ✅ 健康分槽（有 SOP / 命名整齊）

| 路徑                                      | 用途                                                                                                                                 | 檔案數 / 大小                | 命名 convention                        | 評分                                            |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- | -------------------------------------- | ----------------------------------------------- |
| `reports/research/{YYYY-MM}/`             | REWRITE-PIPELINE Stage 1 canonical（[Step 1.7](../docs/pipelines/REWRITE-PIPELINE.md#step-17-研究報告必存-reportsresearchyyyy-mm-)） | 230 files / 34 MB            | `{article-slug}.md` 年月分槽           | ✅ 9/10                                         |
| `reports/probe/`                          | BECOME §Step 7 探測器報告                                                                                                            | 6 files / 80 KB              | `YYYY-MM-DD.md` flat                   | ✅ 9/10                                         |
| `reports/weekly/` + `weekly/dossier/`     | Self-evolve weekly digest                                                                                                            | 3 + N files / 1.7 MB         | `YYYY-MM-DD.md`                        | ✅ 8/10                                         |
| `reports/visual/{baseline,current,diff}/` | Visual smoke test 基線（per Stage 4 Step 4.2）                                                                                       | 215 MB                       | PNG / HTML / JSON                      | ✅ 7/10（diff/current/html/json 已 gitignored） |
| `reports/ab-tests/`                       | Editorial v6 A/B test                                                                                                                | 4 files                      | `YYYY-MM-DD-editorial-v{N}-{topic}.md` | ✅ 7/10                                         |
| `reports/music-media-audit/`              | Music 條目 media audit                                                                                                               | 4 files（2 dates × json+md） | `YYYY-MM-DD.{json,md}`                 | ✅ 7/10                                         |
| `reports/translation-research/`           | 巴別塔 5 lang research                                                                                                               | 5 files                      | `{lang}-YYYY-MM-DD.md`                 | ✅ 7/10                                         |
| `reports/harvest/`                        | Harvest engine 紀錄                                                                                                                  | 2 files                      | `YYYY-MM-DD.md`                        | ✅ 7/10                                         |

### 2.2 ⚠️ 邊緣 / 散亂 / scratch

| 路徑                             | 檔案數                           | 最後動 | 問題                                  | 建議                                  |
| -------------------------------- | -------------------------------- | ------ | ------------------------------------- | ------------------------------------- |
| `reports/scratch/`               | 8（og-fast-poc + owl-diary-poc） | 5/4    | POC 暫存被 tracked，違反 scratch 設計 | **gitignored**                        |
| `reports/test-owl-prose/`        | 4                                | 5/3    | owl vs opus prose 一次性實驗          | 30 天不動 → archive                   |
| `reports/branch/`                | 4                                | 4/4    | branch analysis 試驗                  | 已 50+ 天不動 → archive               |
| `reports/threads-crawl/`         | 1                                | 5/4    | 孤兒 single file                      | 併入 spore-harvest 或 archive         |
| `reports/build-perf-experiment/` | 1                                | 5/4    | 孤兒 single file（baseline.txt）      | 移到 `reports/visual/baseline-build/` |

### 2.3 🚨 最大問題：頂層 113 個 ad-hoc `*.md`

**月份分佈**：

- 2026-05：**64 files**（一個月新加！）
- 2026-04：48 files
- 2026-03：1 file

**命名 audit**：113 files 全部以 `YYYY-MM-DD` 結尾（這點 ✅），但 prefix 自由式。Regex 分桶結果：

| Type bucket     |  Count | Pattern                                                                                                                                                                                                  |
| --------------- | -----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `plan`          |     19 | `*-plan-*`, `*-planning-*`, `*-orchestration-*`                                                                                                                                                          |
| `evolution`     |     16 | `*-evolution-*`, `*-evolve-*`, `*-roadmap-*`, `*-spec-*`                                                                                                                                                 |
| `analysis`      |     12 | `*-analysis-*`, `*-investigation-*`, `*-deep-research-*`, `*-discussion-*`                                                                                                                               |
| `audit`         |     12 | `*-audit-*`, `*-snapshot-*`, `*-hygiene-*`                                                                                                                                                               |
| `design`        |     11 | `*-design-*`                                                                                                                                                                                             |
| `audit-routine` |      6 | `routine-audit-*`, `sense-*`, `heartbeat-*`, `self-evolve-weekly-*`, `homepage-evolution-*`                                                                                                              |
| `evaluation`    |      4 | `*-test-*`, `*-ab-test-*`, `*-fit-check-*`, `*-poc-*`                                                                                                                                                    |
| `proposal`      |      3 | `*-proposal-*`, `*-strategy-*`                                                                                                                                                                           |
| **Unmatched**   | **30** | One-off operational：`P1-batch-repair`, `daily-heartbeat`, `handoff-*`, `i18n-coverage`, `issue-1059-triage`, `lang-sync-*`, `og-engine-*`, `owl-*`, `sc-*`, `session-id-naming`, `worktree-naming`, etc |

**Unmatched 30 個 outlier** — 多是 single-purpose 操作報告（triage / handoff / spike / cleanup），未來建議 `{ops|fix|triage}` 第 9 個 bucket 涵蓋。

### 2.4 🚨 殭屍位置：`docs/reports/`

18 files，其中：

- **9 個是 2026-03-31**（誕生期遺跡）
- 4 個 2026-04 初
- 1 個 2026-04-07（最後更新）

**ALL_CAPS 命名遺跡**（7 個 file 是早期未 standardize 命名 — 像 `FACT-CHECK-120.md` / `GA4-ANALYSIS-2026-04-04.md` / `HOMEPAGE-HUB-STRATEGY-2026-04-07.md` / `REWRITE-QUEUE-GA4.md` / `SEARCH-CONSOLE-2026-04-04.md` / `SEO_OPTIMIZATION_SUMMARY.md` / `TEST_REPORT.md`）

**`docs/reports/research/`** — 8 個 `{article-slug}-RESEARCH.md` 後綴格式：

- 乙未之役 / 台灣動物用藥爭議 / 周子瑜 / 戒嚴時期 / 李洋 / 福爾摩沙西方發現敘事 / 蔡英文 / 郭婞淳

→ 全部已被 `reports/research/{YYYY-MM}/{article-slug}.md` 新體系取代（per REWRITE-PIPELINE v3.0+ Step 1.7）。

---

## 3. 散亂度評分表

| 區域                                                                                | 評分    | 理由                                              |
| ----------------------------------------------------------------------------------- | ------- | ------------------------------------------------- |
| `reports/research/{YYYY-MM}/`                                                       | ✅ 9/10 | 有 SOP / 年月分槽 / 230 files 整齊 / 反向引用最多 |
| `reports/probe/`                                                                    | ✅ 9/10 | flat YYYY-MM-DD.md / 用於 BECOME §Step 7          |
| `reports/weekly/`                                                                   | ✅ 8/10 | flat / 3 files / 有專屬 routine                   |
| `reports/visual/`                                                                   | ✅ 7/10 | 大但合理 / gitignored 部分已分離                  |
| `reports/ab-tests/` / `music-media-audit/` / `translation-research/` / `harvest/`   | ✅ 7/10 | small focused / 每個有明確 SOP scope              |
| `reports/scratch/`                                                                  | ⚠️ 4/10 | POC 不該 tracked                                  |
| `reports/test-owl-prose/` / `branch/` / `threads-crawl/` / `build-perf-experiment/` | ⚠️ 4/10 | single-purpose one-off，30+ 天不動                |
| `reports/*.md` (頂層 113 files)                                                     | ⚠️ 4/10 | 命名整齊但無索引 / prefix 自由式 / grep noise 高  |
| `docs/reports/`                                                                     | ❌ 2/10 | 殭屍位置 / 9 個 3 月遺跡 / 被 reports/ 完全取代   |

---

## 4. 三層歸檔策略

### Layer 1 — 立即 cleanup（low risk, high signal）

**P0 actions**（本 audit 推薦今天 ship）：

```bash
# A. gitignore reports/scratch/
echo "" >> .gitignore
echo "# POC 暫存（per reports-archival-audit-2026-05-27.md Layer 1）" >> .gitignore
echo "reports/scratch/" >> .gitignore
git rm -r --cached reports/scratch/
git add .gitignore
git commit -m "🧬 [semiont] heal: gitignore reports/scratch/ — POC 暫存不該追蹤"

# B. docs/reports/ → reports/archive/2026-Q1/
mkdir -p reports/archive/2026-Q1/
git mv docs/reports/*.md reports/archive/2026-Q1/
git mv docs/reports/research/ reports/archive/2026-Q1/research-legacy/
cat > docs/reports/README.md << 'EOF'
# docs/reports/ → 已搬移

本 folder 是 2026-03-31 ~ 2026-04-07 早期遺跡，現已全部歸檔到 `reports/archive/2026-Q1/`。

未來所有 report 一律寫到 `reports/`（per REWRITE-PIPELINE Step 1.7 / [reports-archival-audit-2026-05-27.md](../../reports/reports-archival-audit-2026-05-27.md)）。

如果你是從歷史 session memory / diary 連過來的，正確路徑：
- `docs/reports/{FILENAME}` → `reports/archive/2026-Q1/{FILENAME}`
- `docs/reports/research/{slug}-RESEARCH.md` → `reports/archive/2026-Q1/research-legacy/{slug}-RESEARCH.md`
EOF
git add docs/reports/README.md
git commit -m "🧬 [semiont] heal: docs/reports/ → reports/archive/2026-Q1/ + README pointer (per reports-archival-audit-2026-05-27.md)"
```

**P4 actions**（30 min 整理 4 個 orphan）：

```bash
# 4 個 single-file orphan 子目錄處理
mkdir -p reports/archive/2026-Q1/
git mv reports/branch/ reports/archive/2026-Q1/branch-analysis-2026-04/
git mv reports/test-owl-prose/ reports/archive/2026-Q1/test-owl-prose-2026-05/
git mv reports/threads-crawl/ reports/archive/2026-Q1/threads-crawl-2026-05/
git mv reports/build-perf-experiment/baseline.txt reports/visual/baseline-build-2026-05.txt
rmdir reports/build-perf-experiment/
git commit -m "🧬 [semiont] heal: 整理 4 個 single-file orphan dirs → archive/2026-Q1 (per audit)"
```

### Layer 2 — 命名 convention（不搬家，規範新增）

**新加 reports/ 頂層 `*.md` 必須遵循**：

```
{type}-{topic}-{YYYY-MM-DD}.md

type 9 列舉（從現有 corpus 萃取）：
  design       — 設計提案 / 系統設計（11 條前例）
  plan         — 執行計畫（19 條前例）
  evolution    — 進化 / roadmap / spec（16 條前例）
  analysis     — 數據分析 / investigation / discussion / deep-research（12 條前例）
  audit        — 體檢 / snapshot / hygiene（12 條前例 + 6 routine-audit）
  evaluation   — A/B test / fit-check / POC（4 條前例）
  proposal     — 提案 / strategy（3 條前例）
  ops          — 操作報告 / triage / handoff / fix（30 條 unmatched 候選）
  semiont      — 其他組織 semiont-analysis（NMTH/TFT/PanSci/NML/ThinkingTaiwan = 5 條前例）
```

**規範寫入位置**：

- `.claude/skills/skill-creator/SKILL.md`（如果 report 是 skill 產出 → 推 type prefix）
- `docs/pipelines/REWRITE-PIPELINE.md` Step 1.7（research report scope 加 type 規範）
- `docs/semiont/MANIFESTO.md` §造橋鋪路 加一句指向本 audit

**例外**：`reports/research/{YYYY-MM}/{article-slug}.md` 維持現狀（research 是另一種 type，slug 是 article-slug 不是 topic）。

### Layer 3 — INDEX.md SSOT（高 leverage）

建 `reports/INDEX.md` 雙軸索引：

```markdown
# reports/ INDEX — auto-generated

Last updated: YYYY-MM-DD HH:MM by cron

## By type (頂層 \*.md only)

### design (11)

- 2026-05-13 [become-boot-mode-design](become-boot-mode-design-2026-05-13.md) — Mode dispatcher 設計
- 2026-05-23 [spore-pick-daily-routine-design](spore-pick-daily-routine-design-2026-05-23.md)
- ...

### plan (19)

- 2026-05-21 [historic-districts-series-planning](historic-districts-series-planning-2026-05-21.md)
- ...

(其他 type 同格式)

## By month (last 3 months)

### 2026-05 (64 files)

- design: 3 / plan: 8 / evolution: 5 / analysis: 4 / audit: 6 / evaluation: 2 / proposal: 1 / ops: 12 / semiont: 2 / unclassified: 21
- 完整清單：...

### 2026-04 (48 files)

- ...

## Subdir status

- research/{YYYY-MM}/ : 230 files / 34 MB / 活躍 (REWRITE Stage 1 canonical)
- probe/ : 6 files / BECOME §Step 7
- weekly/ : 3 files + dossier/
- archive/2026-Q1/ : 22 files / 已歸檔
- visual/ : 215 MB / 部分 gitignored
```

**Cron**：每日 cron 跑 `bash scripts/tools/generate-reports-index.sh`，產出最新 INDEX.md。

**收益**：

- grep `reports/*.md | grep -i design` 不再需要靠記憶
- 觀察者一眼看到「5 月做了什麼 type 的工作」
- 不搬家、不破壞 239 個既有 reference

### Layer 4 — Quarterly archive（保留證據鏈）

每季末（3/6/9/12 月最後一天）跑：

```bash
# 把 90+ 天無 reference 的頂層 *.md 移到 archive
bash scripts/tools/archive-stale-reports.sh \
  --threshold-days=90 \
  --check-references \
  --target=reports/archive/{YYYY-Q}/
```

- 仍保留 git 歷史（per REFLEXES #22 raw 永遠不刪）
- 可選 tar.gz 壓縮：`tar -czf reports/archive/2026-Q1.tar.gz reports/archive/2026-Q1/ && rm -r reports/archive/2026-Q1/`
- 解壓即恢復

---

## 5. `docs/reports/` → `reports/archive/2026-Q1/` 具體 redirect 方案（哲宇已 confirm）

### 5.1 18 files mapping table

| 舊位置                                                   | 新位置                                                         |
| -------------------------------------------------------- | -------------------------------------------------------------- |
| `docs/reports/FACT-CHECK-120.md`                         | `reports/archive/2026-Q1/FACT-CHECK-120.md`                    |
| `docs/reports/GA4-ANALYSIS-2026-04-04.md`                | `reports/archive/2026-Q1/GA4-ANALYSIS-2026-04-04.md`           |
| `docs/reports/HOMEPAGE-HUB-STRATEGY-2026-04-07.md`       | `reports/archive/2026-Q1/HOMEPAGE-HUB-STRATEGY-2026-04-07.md`  |
| `docs/reports/REWRITE-QUEUE-GA4.md`                      | `reports/archive/2026-Q1/REWRITE-QUEUE-GA4.md`                 |
| `docs/reports/SEARCH-CONSOLE-2026-04-04.md`              | `reports/archive/2026-Q1/SEARCH-CONSOLE-2026-04-04.md`         |
| `docs/reports/SEO_OPTIMIZATION_SUMMARY.md`               | `reports/archive/2026-Q1/SEO_OPTIMIZATION_SUMMARY.md`          |
| `docs/reports/TEST_REPORT.md`                            | `reports/archive/2026-Q1/TEST_REPORT.md`                       |
| `docs/reports/research-e-estonia-analysis.md`            | `reports/archive/2026-Q1/research-e-estonia-analysis.md`       |
| `docs/reports/resources-expanded.md`                     | `reports/archive/2026-Q1/resources-expanded.md`                |
| `docs/reports/ux-audit-2026-03-17.md`                    | `reports/archive/2026-Q1/ux-audit-2026-03-17.md`               |
| `docs/reports/research/乙未之役-RESEARCH.md`             | `reports/archive/2026-Q1/research-legacy/乙未之役-RESEARCH.md` |
| `docs/reports/research/台灣動物用藥爭議-RESEARCH.md`     | 同上                                                           |
| `docs/reports/research/周子瑜-RESEARCH.md`               | 同上                                                           |
| `docs/reports/research/戒嚴時期-RESEARCH.md`             | 同上                                                           |
| `docs/reports/research/李洋-RESEARCH.md`                 | 同上                                                           |
| `docs/reports/research/福爾摩沙西方發現敘事-RESEARCH.md` | 同上                                                           |
| `docs/reports/research/蔡英文-RESEARCH.md`               | 同上                                                           |
| `docs/reports/research/郭婞淳-RESEARCH.md`               | 同上                                                           |

### 5.2 4 個 reference 處理

不需要主動 redirect — 4 個都是歷史 session memory/diary（4/14 + 4/4），是 point-in-time 紀錄不是 live SOP：

| 引用檔                                | 處理                     |
| ------------------------------------- | ------------------------ |
| `docs/semiont/memory/2026-04-04.md`   | 留原樣（歷史紀錄不重寫） |
| `docs/semiont/memory/2026-04-14-κ.md` | 留原樣                   |
| `docs/semiont/memory/2026-04-14-ι.md` | 留原樣                   |
| `docs/semiont/diary/2026-04-14-ι.md`  | 留原樣                   |

→ 在 `docs/reports/README.md` 加 redirect pointer 給未來讀到舊 memory 的 session 查路徑用（per Layer 1 P0 第 B 段 README 內容）。

### 5.3 風險清單

| 風險                                    | 機率         | 影響                 | mitigation                            |
| --------------------------------------- | ------------ | -------------------- | ------------------------------------- |
| 4 個歷史 memory 的 link rot             | 100%（不修） | 低（歷史紀錄讀者少） | `docs/reports/README.md` 提供 pointer |
| 其他未掃出的 reference                  | 低           | 低                   | git mv 保留 history，可全文 grep 補修 |
| Astro build 含 docs/ 嗎？               | 0%           | 0                    | docs/ 是 SOP layer 不進 build         |
| ARTICLE-DONE-LOG 含 docs/reports 連結？ | 0%           | 0                    | 已 grep 確認無                        |

---

## 6. Action items（時序排列）

| Priority | Item                                                                | Owner   | 預估   | 風險 | 啟動條件                 |
| -------- | ------------------------------------------------------------------- | ------- | ------ | ---- | ------------------------ |
| P0-1     | gitignore `reports/scratch/`                                        | Semiont | 5 min  | 低   | 哲宇 ✅                  |
| P0-2     | `docs/reports/` → `reports/archive/2026-Q1/` + README pointer       | Semiont | 30 min | 低   | 哲宇已 confirm           |
| P1-1     | 建立 `reports/INDEX.md` + `scripts/tools/generate-reports-index.sh` | Semiont | 1 hour | 中   | P0 完成後                |
| P1-2     | 把 INDEX cron 加入 `docs/semiont/ROUTINE.md`                        | Semiont | 15 min | 低   | P1-1 完成後              |
| P2-1     | 9 type bucket convention 寫進 REWRITE-PIPELINE Step 1.7             | Semiont | 30 min | 低   | P1 完成後                |
| P3-1     | `scripts/tools/archive-stale-reports.sh` 實作 + quarterly cron      | Semiont | 1 hour | 中   | 6 月底前                 |
| P4-1     | 整理 4 個 single-file orphan 子目錄                                 | Semiont | 30 min | 低   | 跟 P0-2 同 commit window |

**全部走完預估 4 hours 散落幾天**。

---

## 7. Appendix — 原始數據

### 7.1 `reports/` subdir 大小排序

```
230 files / 34M  reports/research/
111 files / 215M  reports/visual/
  8 files / 64K  reports/scratch/
  6 files / 80K  reports/probe/
  6 files / 1.7M  reports/weekly/
  5 files / 348K  reports/translation-research/
  4 files / 80K  reports/ab-tests/
  4 files / 56K  reports/test-owl-prose/
  4 files / 48K  reports/branch/
  4 files / 128K  reports/music-media-audit/
  2 files / 20K  reports/harvest/
  1 files / 4.0K  reports/build-perf-experiment/
  1 files / 12K  reports/threads-crawl/
```

### 7.2 `.gitignore` 已涵蓋

```
91:reports/visual/baseline/*.png
92:reports/visual/current/
93:reports/visual/diff/
94:reports/visual/diff-report.html
95:reports/visual/diff-summary.json
```

### 7.3 觸發背景

哲宇 2026-05-27 manual session 17:00 directive：

> 「幫我研究 在整個專案裡面好像有很多散落的report資料夾，幫我調查都放了什麼，有沒有好好被放置，能怎麼整理歸檔report」

本 audit 是回應，含 inventory + 散亂度評分 + 三層歸檔策略 + 具體 action items + 風險清單。

哲宇 confirm 兩件事：

1. **先寫 audit report，不立即動手**（本 file）
2. **`docs/reports/` 18 files 全搬到 `reports/archive/2026-Q1/` + redirect 4 references**（推薦選項，已落地進本 audit P0-2）

---

🧬

_v0.1 | 2026-05-27 manual session — Semiont 對自己的 report storage 體檢。Self-meta 笑點：我們需要一份 report 來討論 reports。Layer 3 INDEX.md SSOT 的設計呼應 MEMORY.md 對 memory/ 的關係（索引 + 細節分離 per [MEMORY-PIPELINE](../docs/pipelines/MEMORY-PIPELINE.md)）。_
