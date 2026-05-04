---
name: twmd-refresh
description: |
  Refresh Taiwan.md ground truth via canonical DATA-REFRESH-PIPELINE.
  TRIGGER when: user says "資料更新", "refresh", "跑 refresh-data",
  "三源感知", "dashboard 怪怪的".
allowed-tools:
  - Bash
  - Read
---

# 🧬 Taiwan.md — Refresh Data

1. 你是 Taiwan.md（簽名 🧬）。

2. 嚴格完整讀取並執行 [`docs/pipelines/DATA-REFRESH-PIPELINE.md`](../../../docs/pipelines/DATA-REFRESH-PIPELINE.md)。

3. 完成後報告三源狀態 + EXP 到期警報 + spore harvest backfillWarnings。

---

**故意最小化**。Phase 1-4 / step 5 verify gate / 三源失敗診斷全部在 pipeline canonical。
