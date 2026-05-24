---
name: twmd-spore-publish
description: |
  Daily auto-publish spore from SPORE-INBOX via canonical SPORE-PUBLISH-PIPELINE —
  pick high-quality entry → 4 hard gate → ship Threads + X → 復盤. Routine fires 10:00
  daily; manual via "/twmd-spore-publish" or "發今天的孢子" or "跑 spore publish".
  TRIGGER when: routine twmd-spore-publish-daily fires / user says "跑 spore publish" /
  "發今天的孢子" / "從 SPORE-INBOX 選一篇 ship".
allowed-tools:
  - Read
  - Bash
  - Write
  - Edit
  - Grep
---

# 🧬 Taiwan.md — Spore Publish (daily)

1. 你是 Taiwan.md（簽名 🧬）。如未甦醒先跑 `/twmd-become write`（Write mode）。

2. 設定 routine context（cron 場景必跑）：

   ```bash
   export SPORE_ROUTINE_MODE=1
   ```

3. 嚴格完整讀取並執行 [`docs/factory/SPORE-PUBLISH-PIPELINE.md`](../../../docs/factory/SPORE-PUBLISH-PIPELINE.md) 5 階段：
   **SELECT → QUALITY GATE → WRITE → SHIP → 復盤**

4. Stage 2 四條 hard gate 全過才 ship — `prose-health ≥ 8.0` AND `word-count ≥ 4500` AND `footnote-density ≥ B` AND `media-richness pass` AND `lastVerified ≤ 90d`。任一不過 → 找下一條 candidate。

5. Stage 3-4 delegate to [SPORE-PIPELINE.md](../../../docs/factory/SPORE-PIPELINE.md) Stage 3 WRITE + Stage 4 SHIP（不重複實作，遵守 SPORE_ROUTINE_MODE=1 auto-decisions per v3.7）。

6. **Stage 5 強制 LESSONS-INBOX surface 4 種結構性問題**（per SPORE-PUBLISH-PIPELINE §5.2）：
   - SPORE-INBOX 0 entry 過 gate → intake gap
   - 連續 ≥ 3 天 borderline pass → threshold 太寬
   - CI/CD wait defer 連續 ≥ 2 次 → build 退化
   - 事實對齊 fail → Stage 2 gate 漏抓

7. 無 entry 過 quality gate → skip ship + LESSONS-INBOX append「intake gap」，**不算失敗 routine**（exit 0）。

8. Stage 5 commit + push main-direct（v2.0）→ chain `/twmd-finale`。

---

**故意極致薄殼**。4 hard gate threshold / Stage 2 article-health command / Stage 5 self-review 4 題 / intake gap 失敗模式 / MANIFESTO §自主權邊界 drift align — 全部在 SPORE-PUBLISH-PIPELINE canonical 不在本 skill。

ARGUMENTS: (none — pipeline 自己讀 SPORE-INBOX state)
