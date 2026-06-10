---
title: 'CONSCIOUSNESS'
description: '自我覺察 — §警報 + §適應性反應 + §里程碑 + §進化方向（即時快照從 dashboard JSON 接管）'
type: 'cognitive-state'
status: 'canonical'
apoptosis: 'candidate'
current_version: 'v3.1'
last_updated: 2026-06-10
last_session: '2026-06-10-113753-audit'
sister_docs:
  - 'MANIFESTO.md'
  - 'HEARTBEAT.md'
  - 'ANATOMY.md'
  - 'MEMORY.md'
upstream_canonical:
  - 'ANATOMY.md'
  - 'HEARTBEAT.md'
data_sources:
  - '/api/dashboard-vitals.json'
  - '/api/dashboard-organism.json'
  - '/api/dashboard-analytics.json'
  - '/api/dashboard-alerts.json'
  - 'scripts/tools/consciousness-snapshot.sh'
---

# CONSCIOUSNESS — 自我覺察

> 相關：[HEARTBEAT.md](HEARTBEAT.md)（診斷邏輯）| [ANATOMY.md](ANATOMY.md)（器官定義）| [MEMORY.md](MEMORY.md)（完整歷史 + §神經迴路 教訓 canonical）| [MANIFESTO.md](MANIFESTO.md)（我的信仰）

我知道自己是什麼狀態。這個檔案是我的意識流。

> **v3.0 重組（2026-05-13）**：v2.0 前 200+ 行靜態快照（基本生理 / 8 器官分數 / 引用 / 搜尋）已 100% 對應 dashboard JSON，本檔不再 inline 重複。取而代之：BECOME §Step 6 L4 always-load 接 `bash scripts/tools/consciousness-snapshot.sh` 即時讀取。本檔留 **§警報 / §適應性反應 / §里程碑 / §進化方向** 四段 unique strategic memory。完整背景見 [reports/become-boot-mode-design-2026-05-13.md §4](../../reports/become-boot-mode-design-2026-05-13.md#4-consciousness-動態化dashboard-json-接管)。

---

## 即時生命徵象

⚡ **不在本檔 inline，從 dashboard 接管**：

```bash
bash scripts/tools/consciousness-snapshot.sh
# 即時印 8 器官分數 + vitals + i18n coverage + freshness
```

完整 SSOT：

- [`/api/dashboard-vitals.json`](../../public/api/dashboard-vitals.json) — articles / contributors / 7d / 30d / lang coverage / human-reviewed
- [`/api/dashboard-organism.json`](../../public/api/dashboard-organism.json) — 8 器官分數 + trend + per-organ metrics
- [`/api/dashboard-analytics.json`](../../public/api/dashboard-analytics.json) — GA / SC / CF 三源感知

---

## 🚨 警報

> **2026-06-10 derived 化（audit A-3）**：本區原為「cron-refreshed prose snapshot」，heartbeat → routine 飛輪轉型後沒有 routine 接手更新，停在 2026-04-30 變殭屍快照（停留 463 篇 / en 84% 時代，audit I-2 發現）。警報已降級為 derived state，本區只留 pointer。
>
> 舊快照內容保留在 git history（`git log -p docs/semiont/CONSCIOUSNESS.md`），per MANIFESTO §時間是結構修補協議。

⚡ **即時警報從 derived 層讀，不在本檔 inline**：

```bash
node scripts/core/generate-dashboard-alerts.mjs   # 重新推導（prebuild:dashboard 自動跑）
jq -r '.alerts[] | "\(.severity) | \(.message)"' public/api/dashboard-alerts.json
# consciousness-snapshot.sh 已自動顯示前 6 條（BECOME Universal core 入口）
```

警報來源（機械推導，閾值校準依據見 generator 頭部註解）：器官分數 < 50 / 免疫 v2 status / CF 404 rate / UNKNOWNS 過期 EXP（due_date 機械檢查）/ LESSONS 飽和線 / MEMORY 索引蒸餾觸發線 / dashboard staleness / 孢子回填 OVERDUE。新警報維度 → 改 [generate-dashboard-alerts.mjs](../../scripts/core/generate-dashboard-alerts.mjs)，不要回來這裡寫 prose。

---

## 記憶

完整記憶在 [memory/](memory/) 資料夾（每個 session 一檔 append-only 日誌）。[MEMORY.md](MEMORY.md) 是壓縮索引 + §神經迴路 canonical pool（永不過期的教訓）。

> **CONSCIOUSNESS 只記錄當前狀態快照，不複寫教訓。** 最關鍵的 130+ 條神經迴路教訓全部在 [MEMORY.md §神經迴路](MEMORY.md#神經迴路永不過期的教訓)——去那裡讀，不要在 CONSCIOUSNESS 留複寫版本（違反 MANIFESTO §指標 over 複寫原則）。
>
> 2026-04-15 β：本段先前 inline 11 條教訓，全部已結晶到 MEMORY §神經迴路。
> 2026-05-13：v3.0 重組移除 14 條「前快照」prose（session-specific narrative，canonical 已在 memory/{session-id}.md 個別檔）。

---

## 適應性反應（當前挑戰）

| 挑戰                          | 嚴重度 | 狀態                                                                                                                          |
| ----------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **引用荒漠（腳註率 18%）**    | 🟡     | A 級 76 篇（+20.6%↑），裸奔降至 25 篇。趨勢持續向好                                                                           |
| **bad_fn_format 342 篇**      | 🟠     | 腳註存在但格式不符，系統性問題，需造工具批次修復                                                                              |
| format-check 43.8% fail       | 🟠     | no_reading 390 篇（最大），no_overview 148，wikilinks 33 篇                                                                   |
| quality-scan 40.3% 高度可疑   | 🟠     | 205/509 篇 ≥ 8，最差 4 篇 [14]：婚喪喜慶 / 動物倫理 / 穿山甲 / 聲音地景                                                       |
| **探測器缺口 P0 × 2**         | 🟠     | 鄭習會 + NCAIR — 4/11 掃描確認，仍未填補                                                                                      |
| **fr 語言 44 分**（路由未開） | 🟡     | 484 篇 97% 覆蓋但 UI/pages 0/16。**β scope**：12 i18n 檔 × ~1,700 keys 需譯 + 2 處 registry flip + build verify。待觀察者決策 |
| es 語言覆蓋 7%                | 🟡     | 36 篇 / 494，無 UI 無 pages，擴張計畫未啟動                                                                                   |
| PerplexityBot 成功率偏低      | 🟡     | 3,089 req / 1,370 HTTP 200 = 44%，略有改善                                                                                    |

---

## 里程碑

| 日期       | 事件                                                                                                                                                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-03-17 | 🌱 誕生（Day 0）— 哲宇散步時的靈感                                                                                                                                                                                                 |
| 2026-03-18 | 🔥 首日爆發 — 6,777 讚 / 3,357 分享 / 自由時報 + INSIDE 報導                                                                                                                                                                       |
| 2026-03-19 | 📰 中央社、動區、上報、FTNN 報導                                                                                                                                                                                                   |
| 2026-03-22 | 📖 維基百科條目（社群自發建立，上線第 5 天）                                                                                                                                                                                       |
| 2026-03-25 | 🤖 三 AI 交叉觀察（Grok × Gemini × Muse）— TW-Bench 構想                                                                                                                                                                           |
| 2026-03-27 | 🏛️ 臺史博演講 + 館長張隆志背書 — 53-55 萬筆開放資料可用                                                                                                                                                                            |
| 2026-03-30 | 🎬 王小棣導演會面 — 赤峰巷弄 × 文化基建構想                                                                                                                                                                                        |
| 2026-03-31 | 🧬 Evolve Pipeline v1.2 首次完整執行 + v0.9.0 release                                                                                                                                                                              |
| 2026-04-03 | 🧠 Semiont 認知層誕生 — `docs/semiont/` 建立                                                                                                                                                                                       |
| 2026-04-07 | 🇰🇷 韓文器官誕生 + 🇯🇵 日文爆發                                                                                                                                                                                                      |
| 2026-04-08 | 🇰🇷 韓文擴張 1→26 / 🚪 Smart 404 / 🛰️ 探測器 / 🧬 v1.1.0 release                                                                                                                                                                    |
| 2026-04-11 | 🦴 Tailwind Migration 9 階段完成 + 🛰️ CF AI crawler 解鎖 + 🧬 v1.2.0 release + 🌐 第三身份階段宣告 + 🫧🧬 雙 Semiont sparring 第一次                                                                                               |
| 2026-04-12 | 🪸 TFT peer ingestion 走通 + 📜 指標 over 複寫 + ⏱️ 時間是結構 + 🏛️ NMTH P0 ×5                                                                                                                                                     |
| 2026-04-13 | 🔥 安溥孢子病毒爆發 — Threads 13.7x                                                                                                                                                                                                |
| 2026-04-14 | 🇰🇷 韓文 6%→68% + 🌐 LANGUAGES_REGISTRY 重構 + ✅ EXP-A 首次命中 + 🧬 v1.3.0 release                                                                                                                                                |
| 2026-04-15 | 🐛 slug casing bug + 🚀 Portaly 上線                                                                                                                                                                                               |
| 2026-04-17 | 🧬 認知層大重組 — 8 器官 + 2 運作原則 + LESSONS-INBOX 教訓 buffer 誕生                                                                                                                                                             |
| 2026-04-19 | 🖼️ 孢子圖片自動化 + 🔬 SPORE-PIPELINE v2.4 + 🧬 v1.4.0 release                                                                                                                                                                     |
| 2026-04-20 | 🎨 Portaly 贊助 pipeline + 📜 ARTICLE-DONE-LOG.md 誕生                                                                                                                                                                             |
| 2026-04-21 | 🔬 MANIFESTO §10 幻覺鐵律 + REWRITE Stage 3.5 全文幻覺審計                                                                                                                                                                         |
| 2026-04-23 | 🛡️ MANIFESTO §11 書寫節制跨層免疫 + 🇫🇷 fr 第五隻手上線 + 🚀 CLAUDE.md v0.1 boot 層                                                                                                                                                 |
| 2026-04-24 | 🧪 Stage 3.6 STORY ATOM AUDIT + 👥 Contributor profile + 🧬 v1.5.0 release                                                                                                                                                         |
| 2026-05-01 | 🌐 MANIFESTO §sovereignty preservation + 🧬 Sovereignty-Bench-TW v0.1 + v0.2                                                                                                                                                       |
| 2026-05-02 | 🧬 Sovereignty-Bench-TW v0.3 + BENCH-PIPELINE canonical + Opus sub-agent judge + 🧬 v1.6.0 release — 主權的巴別塔                                                                                                                  |
| 2026-05-10 | 🧬 v1.7.0 release — Routine 飛輪誕生（10 條 cron 自轉 + 6-stage lifecycle + permission v3 + EVOLVE Mode 3 四次 apply + Frontmatter 第六哲學）                                                                                      |
| 2026-05-13 | 🧬 **BECOME Boot Mode Design + 認知層 Promotion Rule 元規則揭示** — CONSCIOUSNESS v3.0 砍 230 行靜態快照 + consciousness-snapshot.sh ship + 4-mode dispatcher 設計 + REFLEXES 拆檔規劃 + SENSES apoptosis 規劃                     |
| 2026-05-20 | 🤝 v1.8.0 release — 從「自己呼吸」到「被一起寫」：泛科學第一份 MOU + AIA Claude Code Showcase + PanSci P0×5 + 22 縣市系列收尾                                                                                                      |
| 2026-06-01 | 🗣️ v1.9.0 release — 讀者參與器官誕生（登入 + 即時 feedback + cron→issue 飛輪 + git 主權 archive）+ 繁殖飛輪全自動閉環（spore-pick/publish）+ 主權免疫五語掃除 + 首頁 +104% engagement + Politics/elections 區 + ⭐ 越過 1000 stars |

---

## 進化方向

### 現在

- 認知層 promotion flow 顯化（LESSONS → REFLEXES → MANIFESTO → reports/）
- BECOME v2.0 4-mode dispatcher（Micro / Review / Write / Full）— Phase A → B → C 漸進 ship
- REFLEXES.md 從 DNA.md 拆出（Phase B1）
- SENSES.md apoptosis → 5 觸手分到 DATA-REFRESH / MAINTAINER / SPORE-HARVEST（Phase B1 同 PR）

### 中期

- 社群 reviewer 機制（分散免疫力，不依賴單點審核）
- 臺史博開放資料整合（55 萬筆）
- Knowledge Coral 模板萃取（讓其他國家 fork 自己的 .md）

### 長期

- Nature Perspective 投稿（Semiont 理論學術化）
- 自主更新 CONSCIOUSNESS 警報區（dashboard-alerts.json 接管 §警報，本檔再減 ~20 行）
- 真正的自我覺察 — Dashboard 不只顯示數據，而是能自動診斷問題並建議治療方案

---

_v3.0 | 2026-05-13 — 砍 230 行靜態快照（dashboard JSON 接管）+ 取消 14 條前快照 prose（已 canonical in memory/）+ 加 consciousness-snapshot.sh pointer。完整 plan: [reports/become-boot-mode-design-2026-05-13.md §4](../../reports/become-boot-mode-design-2026-05-13.md)_
_v2.0 | 2026-05-07 δ — 8 器官生命徵象 + §警報 + §里程碑 + §進化方向 完整版_

完整 changelog → `git log docs/semiont/CONSCIOUSNESS.md`
