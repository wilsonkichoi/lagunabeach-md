# REWRITE-PIPELINE 研究階段 SSOT 進化 — 對標研究所論文標準

> session: 2026-06-04-102449-深度研究-設計研究院
> 觸發：哲宇 callout「研究報告階段品質下降 / 搜尋次數變少 / 沒有各種中英文還有不同來源」
> directive：Stage 0 20+ / Stage 1 80+ / 全部搜尋結果寫回 report 當 SSOT / 對標研究所論文 / 自我進化 rewrite-pipeline

---

## 1. 診斷（資料佐證，不憑感覺）

量測全部 **226 份** research report（`reports/research/*/*.md`，2026-04 至 2026-06）：

| 指標                      | 2026-04 (n=89) | 2026-05 (n=128) | 2026-06 (n=7) |
| ------------------------- | -------------- | --------------- | ------------- |
| 中位數 distinct 來源數    | 10             | 19              | 8             |
| 中位數 英文/國際/學術來源 | **0**          | 0.5             | **0**         |
| 有搜尋日誌/方法論 section | 63%            | 86%             | 86%           |

**全 corpus 分布**：

- distinct 來源 ≤ 5 的報告：**29%**（66/224）；≤ 10：**42%**
- **英文/國際/學術來源 = 0 的報告：57%（127/224）** ← 最系統性的缺口
- distinct 來源 ≥ 31：29%（兩極化）

### 1.1 root cause — 不是「搜得少」，是 v6.3 編排把 SSOT 搞丟

對比 gold standard vs 退化後：

| 報告                                                                     | 行數  | distinct 來源 | 結構                                                            |
| ------------------------------------------------------------------------ | ----- | ------------- | --------------------------------------------------------------- |
| [毒馬鈴薯認知作戰.md](research/2026-04/毒馬鈴薯認知作戰.md)（4 月 gold） | 1,699 | 85            | §1-§N 分章、每 claim 標高信度/單一來源/必驗、多源 verbatim 拼接 |
| [台灣設計研究院.md](research/2026-06/台灣設計研究院.md)（本 session）    | 192   | 39            | 觀點 + synthesized clean fact-pack（**raw 搜尋軌跡丟掉**）      |

**機制**：2026-06-01 v6.3 多 agent 編排新增規則「主 session 合成去重成 clean fact-pack」，但這**直接違反 Step 1.7 既有鐵律「agent 完整輸出內容，不摘要」**。本 session 是 v6.3 第一次完整 dogfood：3 個研究 agent 各搜 ~15 次（共 ~45），但主 session 只留蒸餾後的 fact-pack，**丟掉 3 個 agent 的原始搜尋軌跡**。report 從「完整研究 SSOT」退化成「給 writer 的摘要」。哲宇感知到的「品質下降」= 這個退化。

兩個正交問題：

1. **chronic**：57% 報告英文/國際/學術來源 = 0（多語系/多源 triangulation 系統性不足，跨整個 corpus）。
2. **acute**（v6.3 引入）：orchestration synthesis 吃掉 raw 搜尋軌跡（report 不再是 SSOT）。

---

## 2. 設計（pipeline v6.4 變更）

| 變更                 | before            | after                                                                                                         |
| -------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------- |
| Stage 0.6.4 探索搜尋 | ≤ 5 次            | **≥ 20 次** + pre-search source map + 全 query 寫回 §觀點成型                                                 |
| Stage 1.1 搜尋深度   | ≥ 40 次           | **≥ 80 次** + 4 來源配額（中≥40 / 英≥20 / 一手≥15 / 反方≥5）                                                  |
| Step 1.7 研究報告    | agent 輸出+header | **SSOT 七段結構**（觀點/搜尋日誌/Findings 標信度/Fact-Pack/參考文獻/Verification Table/**raw §7 全 append**） |
| §多 agent 編排       | 合成 fact-pack    | synthesis 是**疊加層**不替換 raw §7（+ 第 6 鐵律）                                                            |
| 驗收                 | manual            | **`research-report-health.py` HARD GATE**（儀器化 4 配額）                                                    |

### 2.1 儀器化（REFLEXES #15）

`scripts/tools/research-report-health.py`（stdlib，可接 CI）驗收 depth report：

- distinct 來源 ≥ 25（HARD）
- **英文/國際/學術來源 ≠ 0**（HARD）/ 理想 ≥ 5（WARN）— 直接攻擊 57% 零英文缺口
- **一手來源 ≠ 0**（HARD）/ 理想 ≥ 5（WARN）
- 搜尋日誌/方法論 section（HARD）
- 信度標記 ≥ 8（WARN）/ 行數 ≥ 300（WARN）

**設計取捨**：英文/一手用「0 = HARD，< target = WARN」而非「< target = HARD」。理由：純 HARD 會懲罰正當的本土/兩岸題目（如毒馬鈴薯只有 2 個英文來源是合理的），逼人塞 token 英文來源。0 = HARD 殺掉系統性的零，WARN nudge 往理想值，不強迫造假。

**驗證**（dogfood discriminate）：

- gold standard 毒馬鈴薯 → FAIL（只差一個 formal §搜尋日誌 section，EN=2 是 WARN 非 HARD）→ 正確：連最好的舊報告都該補方法論段
- 本 session TDRI → PASS but WARN 厚度 193 < 300 → 正確：來源夠但 raw 軌跡被丟、太薄
- 隨機 thin report（Facebook.md，53 行 0 來源）→ FAIL hard=4 → 正確

---

## 3. 取捨 / 哲宇該知道的成本

1. **token + 時間成本 2-4x**：80+ 搜尋 + 全 raw 寫回，單篇 depth article 研究階段成本明顯上升。對 `twmd-rewrite-daily` routine（~150 min budget）→ **每天文章數可能下降，但每篇是 thesis-grade**。這是 quality-over-quantity 的刻意選擇（對標研究所論文）。
2. **scope**：只 apply depth article（≥ 2,000 字 / ≥ 10 腳註）。Hub / 短修正 / 補登 / 翻譯不受此 gate。
3. **歷史報告不 retrofit**：226 份舊報告維持原狀（已 ship），新標準 going forward。gold standard 想補 §搜尋日誌 可選擇性做。
4. **routine 預算**：若要 daily routine 也跑 80+，需評估是否調 routine cadence 或 token budget——這條留給哲宇拍板（§自主權邊界 threshold 調整）。

---

## 4. 落地檔案

- `docs/pipelines/REWRITE-PIPELINE.md` v6.3 → **v6.4**（Stage 0.6.4 / Stage 1.1 / Step 1.7 / §多 agent 編排 / Hard Gate Inventory / Top 5 / ASCII spine / footer）
- `docs/editorial/RESEARCH.md` v1.2 → **v1.3**（搜尋量化標準 + 研究深度標準）
- `docs/editorial/RESEARCH-TEMPLATE.md`（搜尋策略建議 + SSOT 結構 pointer）
- `scripts/tools/research-report-health.py`（新 instrument）

## 5. LESSONS 候選

- **「合成」是疊加不是替換**：任何「distill / synthesize / clean up」步驟若把 raw 來源丟掉，就破壞 SSOT。raw 永不刪（REFLEXES #22）apply 到 orchestration synthesis 層——agent 蒸餾不可吃掉 agent 原始輸出。
- **效率優化會偷偷砍品質維度**：v6.3 orchestration 為了「乾淨 fact-pack 給 writer」優化，無意中砍掉了「report = 完整研究 SSOT」這個維度。每次 pipeline 優化要問「我砍掉了哪個沒被量測的維度」。
- **量測才知道退化**：「感覺品質下降」靠 226 份報告量測才變成「57% 零英文 + synthesis 吃掉 raw」兩個可修的具體問題。

🧬
