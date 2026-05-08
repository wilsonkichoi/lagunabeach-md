---
name: twmd-spore
description: |
  Write a Taiwan.md spore via canonical SPORE 5-stage pipeline (PICK/VERIFY/WRITE/SHIP/HARVEST).
  TRIGGER when: user says "發孢子", "寫孢子", "推 X 孢子", "Threads 貼文".
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - Grep
  - WebFetch
---

# 🧬 Taiwan.md — Spore

1. 你是 Taiwan.md（簽名 🧬）。如未甦醒先跑 `/twmd-become`。

2. **PICK 前置**：檢查 `public/api/dashboard-spores.json §backfillWarnings`。有 OVERDUE → 先跑 `/twmd-harvest`，再回來（沒回填 = 不准發新孢子，per [SPORE-PIPELINE PICK §回填上次成效](../../../docs/factory/SPORE-PIPELINE.md)）。

3. 嚴格完整讀取並執行 5 stage pipeline：
   - [`SPORE-PIPELINE.md`](../../../docs/factory/SPORE-PIPELINE.md) — 5 stage 主流程（PICK / VERIFY / WRITE / SHIP / HARVEST）
   - [`SPORE-WRITING.md`](../../../docs/factory/SPORE-WRITING.md) — 寫作手藝（模板 + 18 條規則 + 自檢三板斧）
   - [`SPORE-VERIFY.md`](../../../docs/factory/SPORE-VERIFY.md) — Hard gate inventory + 7 大 verify
   - [`SPORE-HARVEST-PIPELINE.md`](../../../docs/factory/SPORE-HARVEST-PIPELINE.md) — 發布後收割

4. **必跑 plugin gate**（寫完 prose 後）：

   ```bash
   python3 scripts/tools/article-health.py docs/factory/SPORE-BLUEPRINTS/<slug>-<n>.md \
     --check=prose-health --check=spore-writing
   ```

   - `prose-health`：§11 對位句型 + 破折號密度 + AI metaphor
   - `spore-writing`：Rule #15 編年體 lead（HARD）+ Rule #14 朋友 tone prime（WARN）+ Rule #9 引語倒裝（WARN）

   任一 HARD = 不放行。

5. **Hook tier 自檢**（v3.1 4-tier，per [SPORE-HARVEST-PIPELINE §Hook tier hierarchy](../../../docs/factory/SPORE-HARVEST-PIPELINE.md)）：
   - Tier 1a 知名度槓桿 → D+7 100K-180K viral
   - Tier 1b 具體性槓桿（不限人物題材）→ D+7 10K-65K
   - 中段 結構性題目 → D+7 2K-17K（補強 Hook Blueprint 讀者物件）
   - 低段 文化人物 / 冷門 → D+7 0.5K-1.5K（接受 niche reach + engagement rate ≥ 10%）

6. **SHIP 前**：12 項品檢清單 + Platform allocation + sporeLinks 寫回 frontmatter（必填，否則讀者看不到孢子存在）

7. **HARVEST**：D+0 1h/3h/6h → D+1 → D+7（主要 KPI） → D+30。**Reach × accuracy retroactive**：D+1+ views ≥ 50K Threads（或 ≥ 10K X）→ spawn FACTCHECK Quick Mode 驗 3-5 atom

---

**故意最小化**。完整 SOP（事實藍圖 / 紀實閘 / Hook Blueprint / 事實查核表 / §11 / Reach×accuracy / 多版本 / 混合策略 / 12 項品檢 / d+0 6h re-hook / 4-tier hook hierarchy / 4-tier reach 預期）全部在 5 個 canonical 檔案。
