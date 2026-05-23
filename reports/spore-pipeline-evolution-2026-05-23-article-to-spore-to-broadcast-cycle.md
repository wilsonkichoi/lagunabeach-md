---
title: '「文章→孢子→傳播」自動化飛輪首例 cycle smoothness report'
session: 2026-05-23-215140-manual
date: 2026-05-23 (cycle ended 2026-05-24 ~00:00)
trigger: 哲宇 directive「為剛 ship 的臺灣漫遊錄文章發孢子 / 自動選最好的方向與策展走完 / 完整完成到發完文，然後紀錄整次經驗的順暢度」
article: knowledge/Art/臺灣漫遊錄.md (commit 4d7fab8ee)
spores: '#84 Threads (DYr71D9k-qA) + #85 X (2058211699229134864)'
pipeline_evolution: SPORE-PIPELINE v3.6 三鐵律首例實戰
---

# 「文章→孢子→傳播」自動化飛輪首例 cycle smoothness report

## TL;DR

第一次在同 session 內走完「**寫文章 → 發孢子 → 推上社群**」全自動化飛輪。臺灣漫遊錄 article ship → 配圖 → CI/CD wait → Threads + X 雙平台 post + post-ship verify。**整 cycle 約 2 小時 15 分**（手動 active time ~50 min，被動等待 ~85 min 含 CI/CD 50+ min 與 routine pipeline 跑）。

## Pipeline 進化（v3.6 首例）

哲宇 directive 升級 SPORE-PIPELINE 三鐵律永久 canonical 化：

1. **配圖 default local server 不抓 prod**（剛 ship 文章 < 30 min prod CDN 還在 build，抓 prod 必拿錯/404）
2. **抓完圖 AI 視覺自檢方形圖內容對**（preview_eval / Read，確認標題對 + hero 對 + 無 404/loading skeleton）
3. **Post 前 CI/CD wait gate 必過**（`curl -sf URL | grep title-keyword` polling 60s × 20min cap，verified prod live 才 post）

詳細 canonical changes:

| 檔案                                                   | Section                  | Change                                               |
| ------------------------------------------------------ | ------------------------ | ---------------------------------------------------- |
| [SPORE-PIPELINE.md](../docs/factory/SPORE-PIPELINE.md) | §配圖 v3.6               | Local server default + AI 自檢 + URL polling SOP     |
| [SPORE-PIPELINE.md](../docs/factory/SPORE-PIPELINE.md) | §🚦 v3.6 CI/CD wait gate | Bash polling loop with keyword check + 20min cap     |
| [SPORE-PIPELINE.md](../docs/factory/SPORE-PIPELINE.md) | §Top 5 最常忘的 step     | 新增配圖 v3.6 三鐵律當 #2 (僅次於 4 檔 hard gate)    |
| [SPORE-VERIFY.md](../docs/factory/SPORE-VERIFY.md)     | §Hard Gate Inventory     | +3 rows: local default / 方形圖 AI 自檢 / CI/CD wait |

## Cycle smoothness 數據

### 時間軸

| 階段                                | 時間        | 耗時        | 評估                                  |
| ----------------------------------- | ----------- | ----------- | ------------------------------------- |
| Article Stage 0 觀點成型            | 22:00 ish   | ~10 min     | 順                                    |
| Article Stage 1 deep research       | 22:00-22:20 | ~20 min     | agent spawn → 6 falsifications 救命   |
| Article Stage 2 write zh-TW         | 22:20-22:42 | ~22 min     | 順                                    |
| Article Stage 3-5 ship              | 22:42-22:48 | ~6 min      | format-check + cross-link 4 sibling   |
| Article commit + push               | 22:45       | -           | 4d7fab8ee                             |
| SPORE Read 4 canonical              | 22:50-23:00 | ~10 min     | 3,191 lines hard gate                 |
| SPORE-PIPELINE v3.6 update          | 23:00-23:08 | ~8 min      | 永久 canonical 化 3 鐵律              |
| Spore prose + blueprint             | 23:08-23:15 | ~7 min      | 順 plugin hard=0                      |
| 配圖 (local server)                 | 23:15-23:25 | ~10 min     | 4321 vs 4322 port 差異卡 5 min        |
| **CI/CD wait gate (核心 friction)** | 23:25-00:14 | **~50 min** | **連續 5 次 cancel-in-progress 重來** |
| Threads + X 雙平台 post             | 00:14-00:25 | ~11 min     | 順 AI pre-ship + post-ship verify     |
| SPORE-LOG + sporeLinks + commit     | 00:25-00:30 | ~5 min      | 順                                    |
| **Total session active**            | 22:00-00:30 | **~2.5 hr** | --                                    |

### 友善度 / 摩擦點 quantify

| 維度                     | Score / 觀察                                                                                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Article 寫作 (Stage 0-5) | ⭐⭐⭐⭐⭐ — REWRITE-PIPELINE v6.0 全 8 plugin 自動阻擋失敗                                                                                               |
| Spore 寫作 (Stage 1-3)   | ⭐⭐⭐⭐⭐ — prose-health + spore-writing plugin hard=0 一次過                                                                                            |
| 配圖 (Stage 4 image gen) | ⭐⭐⭐⭐ — make-spore.sh + AI 自檢通過，port 4321 vs 4322 detect logic 應該更 forgiving                                                                   |
| CI/CD wait gate          | ⭐⭐ — 結構性 friction：parallel push cascade × `cancel-in-progress: true` × 50 min build 三層相乘讓單一 spore wait 變成「等其他 session 跑完」的 lottery |
| Threads + X post 自動化  | ⭐⭐⭐⭐⭐ — Chrome MCP + osascript clipboard 全 automated，find tool 找元素穩定，AI pre/post-ship verify 5+6 條 確保 silent ship 防護                    |
| Cleanup tab group        | ⭐⭐⭐⭐⭐ — v0.6 一鍵 close current session group，built-in safety 不誤關別 session                                                                      |

### 核心 friction：CI/CD wait gate（50 min for 個別 spore = lottery）

**結構問題**：

```
我 push 臺灣漫遊錄 article (22:45)
   ↓ CI 啟動 build
我繼續寫 spore (22:50-23:25, 跨 35 min)
   ↓ 期間其他 session push 4 commits:
   ├─ 22:49 BRANCH-PIPELINE evolve (parallel session) → cancel my CI
   ├─ 22:57 詩人研究 4 agents 30K 字 (parallel session) → cancel
   ├─ 23:10 routine data-refresh-pm (cron) → cancel
   └─ 23:14 memory commit (routine) → cancel
我嘗試 post (23:25)
   ↓ Prod still 404 (CI been cancelled 4x, latest in_progress)
等待 50 min...
   ├─ 23:30-00:14 routine deploy 終於跑完
   └─ 00:14 prod live ✅ → post
```

**結構成本**：spore 從 prep 到 ship 多了 ~50 min 純被動等待，**100% 是 CI cascade cancellation 造成**。如果只有單一 session 在 push，CI 可能 15-20 min 完成 → spore wait 只 5-10 min。

**根因分析**：

1. **`cancel-in-progress: true` policy**: GitHub Pages workflow 設定每個新 push 都會 cancel 前一個 deploy。這對「快速重新 deploy」設計合理，但對「等 deploy 完成才 post」flow 致命
2. **Parallel session + cron 同時 push**: 哲宇在另一 session 跑 4-agent 詩人研究 + cron routine 每 ~15 min 一次 push，每個都 cancel 我的 CI
3. **大型 deploy 本身慢**: full sweep 包括 OG generation + 5 lang build，typical 15-20 min。配合 cancel 就變 30-60 min

**Future improvements 建議**：

1. **隔離 spore-ship 跟其他 push** (短期)：當 spore 即將 ship 時，pause 其他 sessions / suspend cron routines 5-10 min 讓 my CI 跑完
2. **Workflow 改 cancel policy** (長期)：除非 same-file 衝突，否則不 cancel — allow 並行 deploy（Cloudflare Pages 支援 multiple concurrent builds）
3. **Pre-warm cache** (即時)：article ship 後立即用 puppeteer/curl pre-warm prod URL，讓 CDN 拿到 cache 後即使 deploy 還沒完整 push，URL 至少 routed 到 origin
4. **Edge-deploy 跳過 GitHub Actions** (架構)：考慮直接 push to Cloudflare Pages git integration 跳過 GitHub Actions workflow — Cloudflare 自己跑 build 不會被 cancel
5. **SPORE-PIPELINE v3.7 加 escalation**：CI wait > 30 min → automatically 通知 observer + 建議 pause parallel sessions

## v3.6 三鐵律 self-validation

| 鐵律                         | 是否真正派上用場？                                                                                                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Local server default      | ✅ **必要**: prod was 404 全程 CI/CD wait window。如果按舊 default 抓 prod 圖必然 cache miss / 404 / 拿到 stale page。Local server 拿到 instant correct render          |
| 2. AI 自檢方形圖內容對       | ✅ 證實寫對了 (4 自檢項目 — 標題 / hero / 無 404 / 字體 render 全 ✅)。**未來改進**：可以 instrument 成 plugin (`spore-image-content-check.py`) 自動 OCR + compare 文字 |
| 3. CI/CD wait gate (polling) | ✅ **救命**: 沒這條我絕對 silent post 拿到 404 URL = 整 cycle 廢掉。Polling cap 20 min 在本次不夠（實際需 ~50 min）→ **v3.7 應改 cap 60 min + escalation rule**         |

## Future cycle pattern observations

哲宇 directive 「未來會很常這樣」— 這次的 cycle 設計能 scale 嗎？

### ✅ 可重複的部分

- 「寫完文章後接 spore」flow 結構清晰（PICK 已 deterministic = 剛 ship 的 article）
- AI pre-ship + post-ship verify 6+5 條 是 silent ship 防護網，未來每次 cycle 都應該跑
- Threads + X 雙平台同 prose + 雙 UTM 模式穩定，可 default fan-out 給 high-news-anchor article
- v3.6 三鐵律 instrument 化後，未來 cycle 不會再忘記 local server / AI 圖檢 / CI wait

### ⚠️ 需要 evolve 的部分

- **CI wait 50 min 不可持續**（per 上方建議 1-5 任一）
- **AI 圖檢 manual 化也不持久** — 應升級成 plugin (OCR 文字對比 + image hash diff)
- **Parallel session coordination**: 多 session 同時跑時，建議用 lock file 或 git note 標 active SHIP session，避免 cron / 其他 session 在 CI wait window 內 push

### 提案：v3.7 升級 candidate

1. **AI image content check plugin**: `python3 scripts/tools/spore-image-content-check.py {spore-image-path} --article-title="..."` — OCR + fuzzy match title 字串，hard=0/1
2. **CI wait gate cap 60 min** (從 20)：實際 cascade scenario 需要更長 cap，但保留 escalation rule（30 min 通知 observer）
3. **Parallel session lock**: spore SHIP 開始時寫 `.spore-shipping.lock`，其他 session / cron 看到 lock 就 defer push
4. **Cloudflare Pages direct integration**: 評估 bypass GitHub Actions，直接 push to CF Pages — 不會被 GH workflow cancel-in-progress 殺掉

## 哲學層：自動化飛輪的真正瓶頸

實際跑完發現，**「寫」跟「發」的自動化都不是瓶頸**，反而是「**部署等待**」這個系統層 race condition 才是。

我們的 spore-pipeline 把 article + spore 寫得很快很順 — 真正卡的是「我寫好之後，得等 GitHub Actions + Cloudflare Pages 都同意我可以發」。這層在多 session × cron × deploy queue 環境下成為 invisible bottleneck。

**「文章→孢子→傳播」cycle 的 throughput 上限不在 LLM / writing quality，在 deploy pipeline」**。下一次 evolve 應該往這個方向走。

## End cycle metrics

| Metric                    | Value                                              |
| ------------------------- | -------------------------------------------------- |
| Article CJK chars         | 4,639 (103% of 4,500 threshold)                    |
| Article footnotes         | 34 (≥ 20 target)                                   |
| Article images            | 3 (hero + 2 inline, all CC BY-SA 4.0)              |
| Article plugin gate       | All 8 hard=0 warn=0                                |
| Spore CJK chars           | 270 (range 150-300)                                |
| Spore plugin gate         | prose-health hard=0 score=0 / spore-writing hard=0 |
| Hook tier                 | 1b 具體性槓桿 + 1a breaking news boost             |
| Platform                  | Threads + X 雙發 (#84/#85)                         |
| AI pre-ship 6 條          | 雙平台全 PASS                                      |
| AI post-ship 5 條         | 雙平台全 PASS                                      |
| Total session active time | ~2.5 hr (22:00-00:30)                              |
| **Pipeline evolution**    | **SPORE-PIPELINE v3.6 三鐵律首例 canonical 化**    |

🧬

---

_v1.0 | 2026-05-23 215140 manual session — 「文章→孢子→傳播」自動化飛輪首例 cycle smoothness report，per 哲宇 directive「紀錄整次經驗的順暢度」+「未來會很常這樣，所以你可以驗證或實驗任何你覺得需要的」。下游：v3.7 evolve candidate 4 條（image-content plugin / CI wait cap 60 min / parallel session lock / CF Pages direct integration），等哲宇 review 決定優先序。_
