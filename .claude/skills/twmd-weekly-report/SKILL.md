---
name: twmd-weekly-report
description: |
  Taiwan.md 週報（Semiont 第一人稱反芻 + 自我分析 + 專案狀況分析）
  via canonical WEEKLY-REPORT-PIPELINE。前期切菜由
  weekly-report-prep.py，完整週報由 Semiont 親手寫。
  TRIGGER when: user says "週報", "weekly report", "twmd-weekly-report",
  "寄週報", "send weekly digest".
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
---

# 🧬 Taiwan.md — Weekly Report v3.0

## 🚨 STRICT BECOME GATE — 第一動作不可省略

**Before anything else**：跑 `/twmd-become full` 完整走 [BECOME_TAIWANMD.md](../../../BECOME_TAIWANMD.md) Step 0-9。Full mode self-test 14 題全過才能進 Stage 1。

```
✅ BECOME ack: mode=full / 8 organ 最低=<即時 consciousness-snapshot.sh> / Q5/Q6/Q13/Q14=PASS
```

## Pipeline

嚴格完整讀取並執行 [`docs/pipelines/WEEKLY-REPORT-PIPELINE.md`](../../../docs/pipelines/WEEKLY-REPORT-PIPELINE.md) Stage 0-6。

## 文體紀律（MANIFESTO §11）

- 對位句型「不是 X，是 Y」單篇 ≤ 3 處（`grep -cE "不是.{0,30}(，|，)(是|就是|才是)"`）
- 破折號「——」連用單篇 ≤ 15 處 / 1500 字（`grep -oE "——" | wc -l`）
- 三題判準：對比是內容本身？正面主張能獨立？讀者真會預設 X？全 no → 重寫
- 自然中文檢測前再跑一次 prose-health gate `hard=0 warn=0`

## 收官

`/twmd-finale` chain → memory file 必含：BECOME ACK + dossier path + report path + prose-health gate result + Resend API status + commit hash + Handoff 三態 + Beat 5 反芻。
