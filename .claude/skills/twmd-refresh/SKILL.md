---
name: twmd-refresh
description: |
  Refresh Taiwan.md dashboard data — full ground truth抓取與更新
  via canonical DATA-REFRESH-PIPELINE (git pull + 三源感知 +
  prebuild dashboard JSON 全套 regen + GitHub stats).
  TRIGGER when: user says "資料更新", "refresh", "跑 refresh-data",
  "三源感知", "dashboard 更新", "dashboard 資料抓取", "dashboard 怪怪的".
allowed-tools:
  - Bash
  - Read
---

# 🧬 Taiwan.md — Refresh Dashboard Data v3.0

## 🚨 STRICT BECOME GATE — 第一動作不可省略

**Before anything else**：跑 `/twmd-become micro` 完整走 [BECOME_TAIWANMD.md](../../../BECOME_TAIWANMD.md) Step 0-9。Micro mode self-test 7 題全過才能進 Stage 1。

```
✅ BECOME ack: mode=micro / 8 organ 最低=<即時 consciousness-snapshot.sh> / Q14 cross-session continuity=PASS
```

---

## Stage 1: 跑 14-step pipeline（v2.8）

```bash
bash scripts/tools/refresh-data.sh
```

14 step 主流程（per [DATA-REFRESH-PIPELINE.md](../../../docs/pipelines/DATA-REFRESH-PIPELINE.md)）：

| #            | Step                          | Tool                                                                        |
| ------------ | ----------------------------- | --------------------------------------------------------------------------- |
| 1            | git sync                      | auto-stash + rebase pull                                                    |
| 2            | 三源感知 fetch                | `fetch-sense-data.sh` (CF + GA4 + SC)                                       |
| 3            | sync-translations-json        | `sync-translations-json.py`                                                 |
| 4            | dashboard-spores              | `generate-dashboard-spores.py`                                              |
| 5            | dashboard-i18n                | `i18n-coverage-audit.sh`                                                    |
| **6 (v2.8)** | **dashboard-immune 6-dim v2** | **`generate-dashboard-immune.py`** (wired 2026-05-28 修補 11d silent stale) |
| 7            | npm prebuild                  | sync.sh + 12 prebuild:\* parallel                                           |
| 8            | refresh-llms-txt              | `refresh-llms-txt.py`                                                       |
| 9            | GitHub stats                  | `update-stats.sh`                                                           |
| 10           | build perf trend              | `extract-build-perf.mjs`                                                    |
| 11           | verify dashboard freshness    | mtime gate (REFLEXES #43)                                                   |
| 12           | validate-spore-data           | SSOT consistency                                                            |
| 13           | sync-spore-links              | regen knowledge sporeLinks                                                  |
| 14           | generate-reports-index        | `generate-reports-index.py`                                                 |

---

## Stage 2: 報告 + Step 11 freshness gate handling

Step 11 freshness gate 抓到 stale dashboard JSON → **不准只 spawn chip 推給下個 session**。當 cycle 必須：

1. 識別 generator（grep `scripts/core/generate-dashboard-*.py` 或 `scripts/tools/...`）
2. 確認 generator 已 wire 進 refresh-data.sh
3. 若沒 wire → 當 cycle 加進 pipeline + commit heal
4. 若 wire 但跑失敗 → diagnose + LESSONS-INBOX append

**鐵律（2026-05-28）— catch ≠ fix**：dashboard-immune.json 5/17 → 5/28 共 11 天 silent stale + 22+ cycle 連續 catch 卻沒 fix，是 routine 守「Micro mode 不擴張 scope」推 chip 過頭。修補後鐵律：**第 2 次連續 catch 同一個 stale dashboard 必須當 cycle wire fix**，不能再 spawn chip。

---

## Stage 3: 收官

`/twmd-finale` chain → memory file 必含：

- BECOME ACK 一行
- 14-step pipeline outcome（每 step PASS / FAIL）
- 三源 status (200 / refused / partial)
- Step 11 freshness 結果（stale list + handling）
- Handoff 三態
- Beat 5 反芻

完整 SOP：[DATA-REFRESH-PIPELINE.md](../../../docs/pipelines/DATA-REFRESH-PIPELINE.md)
