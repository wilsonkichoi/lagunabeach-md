---
title: 'FEEDBACK-TRIAGE-PIPELINE'
description: '讀者站上回報（Supabase）→ 分類/反 spam/去重 → GitHub issue（對齊既有 template）→ 接 MAINTAINER 飛輪。cron routine twmd-feedback-triage 的 canonical SOP。'
type: 'pipeline-canonical'
status: 'canonical'
current_version: 'v1.0'
last_updated: 2026-06-01
last_session: '2026-06-01-twmd-become-full'
sister_docs:
  - 'MAINTAINER-PIPELINE.md'
upstream_canonical:
  - '../semiont/MANIFESTO.md'
  - '../semiont/ROUTINE.md'
related:
  - '../../reports/feedback-login-system-design-2026-06-01.md'
  - '../../scripts/feedback/triage.mjs'
  - '../../supabase/migrations/0001_feedback.sql'
---

# FEEDBACK-TRIAGE-PIPELINE.md — 讀者回報 → GitHub issue v1.0

> **第一性原理**：把讀者在站上送的回報（勘誤 / 網站問題 / 新主題）機械性 routing 成
> GitHub issue,接進既有 `MAINTAINER-PIPELINE` 飛輪。**業務邏輯在 `scripts/feedback/`,
> 本檔是 SOP；routine 是薄殼。**
>
> 完整架構設計：[reports/feedback-login-system-design-2026-06-01.md](../../reports/feedback-login-system-design-2026-06-01.md)

---

## 🚨 §自主權邊界（這條 pipeline 的紅線）

per [MANIFESTO §自主權邊界](../semiont/MANIFESTO.md#我的存在結構)：「發 issue / PR comment to GitHub」「批准 merge」屬 human-required。本 pipeline 怎麼相容？

- ✅ **可自動**：開 issue = 把**讀者自己的原話** verbatim + 署名 + provenance 機械性轉錄成 issue（等同代讀者填 `broken-link.yml` 表單）。讀者是 author,有 Google/email 身份。
- ❌ **絕不自動**：以維護者身份在 issue/PR 回覆、close、merge、替讀者判對錯。**全留 MAINTAINER-PIPELINE 人類 gate。**

一句話：**輸入端機械 routing 自動,輸出端對人開口留人類**。

---

## 🗺️ 5 stage spine

```
Stage 0  BECOME gate（review/micro）
Stage 1  PULL    — 讀 status='new' feedback（Supabase REST, service key）
Stage 2  TRIAGE  — spam → dedupe → 分類（scripts/feedback/lib/classify.mjs 純函式）
                   + 可選 LLM 增強：content 類跨源驗證標記（線索非事實）
Stage 3  FILE    — gh issue create（對齊既有 template,只放 display_name 不放 email）
Stage 4  WRITE-BACK — Supabase status new→filed / new→rejected + issue 回寫
Stage 5  FINALE  — /twmd-finale 收官（memory 必寫）
```

---

## Stage 0 — BECOME gate

跑 `/twmd-become review`（PR/issue triage 場景）。ACK 一行寫 memory 頂部：

```
✅ BECOME ack: mode=review / 8 organ 最低=<consciousness-snapshot.sh> / Q13 anti-bias=PASS / Q14 cross-session=PASS
```

`git pull origin main`（routine 起始鐵律）。

---

## Stage 1 — PULL

讀新回報。正式跑：

```bash
node scripts/feedback/triage.mjs --commit    # 讀 Supabase + 真開 issue
```

首次上線 / 想先看分類品質：

```bash
node scripts/feedback/triage.mjs             # dry-run（不開 issue,只印決策）
```

env（`~/.taiwanmd-feedback.env`,**不在 repo**）：`SUPABASE_URL` + `SUPABASE_SERVICE_KEY`。

> 沒有 env（哲宇還沒 provision Supabase）→ script 報錯退出,routine emit「feedback backend 未配置,skip」**不算 fail**（per ROUTINE escalation 只看 quality gate）。

---

## Stage 2 — TRIAGE（deterministic + 可選 LLM）

`triage.mjs` 內部呼叫 `lib/classify.mjs` 純函式：

| 步驟       | 規則                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------- |
| **spam**   | `detectSpam`：太短 / spam keyword / ≥4 連結 / char-flood / 全大寫+連結 → score≥3 = reject    |
| **dedupe** | batch 內 `dedupeKey`（type+slug+body sig）去重 + 對既有 open issue（含 feedback id tag）去重 |
| **分類**   | `resolveType`：信讀者選的 type,缺才推斷（correct_info→content / bug hint / content hint）    |

**可選 LLM 增強（content 類）**：開 issue 前對勘誤做跨源驗證標記（REFLEXES #4 #16）— 比對文章原文 + 既有 footnote source,在 issue body 加一行「triage 初判:可驗證 / 待查」。**只標記,不改寫讀者文字,不替讀者判最終對錯**（那是維護者的事）。v1.0 此步可省（deterministic 已足夠 routing）。

---

## Stage 3 — FILE

`gh issue create`,格式對齊既有 template（讓 MAINTAINER 飛輪直接收割）：

| feedback type | issue title           | labels                                 | 對應既有 template      |
| ------------- | --------------------- | -------------------------------------- | ---------------------- |
| `content`     | `[Fact Check] {文章}` | `needs-verification` + `from-feedback` | `fact-correction.yml`  |
| `bug`         | `[Bug] {摘要}`        | `bug` + `from-feedback`                | `bug-report.yml`       |
| `newtopic`    | `[Article] {摘要}`    | `content` + `from-feedback`            | `article-proposal.yml` |

**HARD gate（鐵律）**：

- 🔴 **issue body 只放 `display_name`,永遠不放 email**（public issue 不洩 PII）。`triage.test.mjs` 有 regex 守這條,CI 必跑。
- 🔴 讀者文字 **verbatim** 引用,triage 不替讀者改寫。
- 🔴 每個 issue body 帶 `feedback id` provenance（去重 + 可追溯）。

---

## Stage 4 — WRITE-BACK

- `file` 成功 → Supabase `status='filed'` + `issue_url` + `issue_number` + `triaged_at`。
- `reject`（spam）→ `status='rejected'`。
- `skip`（dedupe）→ **不改 status**（留著下次再判,避免漏接）。

---

## Stage 5 — FINALE

`/twmd-finale`。memory 必含：BECOME ACK + `file/reject/skip` count + 開了哪些 issue（#N + type）+ Handoff。

接力：開出來的 issue 由下一個 `twmd-maintainer-am`（08:30）收割 → [MAINTAINER-PIPELINE](MAINTAINER-PIPELINE.md) Stage 2 Triage（`from-feedback` 跟一般 contributor issue 同流程,只是來源標記不同;newtopic 進 Step 2.1.1 [Content] digest 4-route dedupe）。

---

## 接 MAINTAINER 飛輪（時序）

```
07:00 twmd-feedback-triage  → 開 from-feedback issues
08:30 twmd-maintainer-am    → MAINTAINER-PIPELINE 收割（content→heal/REWRITE / bug→修站 / newtopic→ARTICLE-INBOX）
                            → 維護者回覆讀者（人類 gate）
```

當天閉環。evening feedback 由隔天 07:00 接（或未來加 pm slot）。

---

## Hard gate 總表

| #   | Gate                                          | Stage |
| --- | --------------------------------------------- | ----- |
| HG1 | BECOME review mode ACK                        | 0     |
| HG2 | issue body 無 email（PII）                    | 3     |
| HG3 | 讀者文字 verbatim,不改寫                      | 3     |
| HG4 | 每 issue 帶 feedback id provenance            | 3     |
| HG5 | spam reject 不開 issue                        | 2     |
| HG6 | dedupe（batch + 既有 issue）                  | 2     |
| HG7 | status 回寫正確（filed/rejected/skip 不動）   | 4     |
| HG8 | 不以維護者身份回覆/close/merge（留人類 gate） | all   |

完整 script：[scripts/feedback/triage.mjs](../../scripts/feedback/triage.mjs) + [lib/classify.mjs](../../scripts/feedback/lib/classify.mjs)。測試：`node --test scripts/feedback/triage.test.mjs`。
