> **Taiwan-inheritance reference** (methodology kept for LB skill ports) — not LB content.

# Taiwan.md 研究方法論統合 — 從 12 份 thesis-grade 報告萃取

> session: 2026-06-04-102449-深度研究-設計研究院
> 觸發：哲宇 directive「多讀 >10 篇之前做的好的，統合出一套完整的方法論再自我進化一番」+「之前的 research report 還有信心程度之類的，詳細調查」
> 方法：3 個 Explore agent 完整讀 12 份最高分歷史 report，萃取共通方法論 DNA

## 樣本（composite score 排名前 12，跨類別）

| 報告              | 來源 | 行   | 類別    | 代表性 pattern                        |
| ----------------- | ---- | ---- | ------- | ------------------------------------- |
| 毒馬鈴薯認知作戰  | 85   | 1699 | 認知戰  | ★信度系統 / 多 Round / 反例 list      |
| 沈伯洋            | 132  | 1114 | People  | 🟢🟡🟠 emoji 信度 / negative findings |
| 吳哲宇            | 81   | 1239 | People  | `confidence: high` / 引語逐字核對     |
| 雷亞遊戲          | 76   | 908  | Tech    | 三源記法 / 不採信清單 / Round 2       |
| 認知作戰          | 124  | 503  | 認知戰  | 搜尋次數 header / 視角分佈表          |
| 臺灣前途決議文    | 33   | 512  | History | 42 query 逐條 / 引語庫 Ctrl-F 欄      |
| 聶永真            | 57   | 928  | People  | red_flags 16 條 / Stage 2 寫作建議    |
| 蘋果西打          | 36   | 689  | Food    | red_flags + verification log 三欄     |
| 海底電纜          | 44   | 798  | Tech    | §9 三源 audit 表 / 數字分歧揭露       |
| 巴拉圭與台灣      | 74   | —    | Intl    | 三語來源 40-50% / 引語找不到改摘要    |
| taiwan-ai-academy | 63   | 720  | Tech    | budget 記錄 / PTT 反方 critique       |
| brian-tseng       | 58   | 771  | People  | reserved scope / 幻覺候選 Ctrl-F 清單 |

---

## 一、信心程度系統（哲宇記得的那個 — #1 共通 pattern，12/12 都有）

**核心 = 三層 `verification:` frontmatter**，每個 claim 進報告主體前先分層，每條附「為什麼是這層」的基礎：

```yaml
verification:
  high_confidence: # ≥2-3 獨立來源 verbatim 一致
    - 國台辦 2026-04-29「毒馬鈴薯」框架（自由時報、Newtalk、大公文匯、ETtoday 多源 verbatim 一致）
  single_source: # 僅單一來源，可用但標待補
    - 1 個 40 呎貨櫃約 15 萬顆馬鈴薯（吳典蓉專欄引藍委羅廷瑋計算，僅一手）
  unverified: # 搜尋無果 / 有反證 → 不寫進文章
    - 沈伯洋是否在美國國會作證（多次搜尋未獲記錄，可能與德國國會混淆）
```

**升降層判準**：≥3 來源一致 → high；單源 → single（標 need cross-check）；搜尋後仍無 → unverified（**不寫進文章**）。

**更細的 notation（依題型選用，疊在三層上）**：

- **學術文獻 ★ 系統**（毒馬鈴薯 R3）：★★★ 一手 DOI/法規 verbatim ／ ★★ 權威 secondary（PMC/LII）／ ★ 媒體二手
- **inline emoji**（沈伯洋）：🟢 一手/多源 ／ 🟡 二手/單源 ／ 🟠 caution，Notes 欄寫降級原因
- **inline `confidence:`**（前途決議文 / 吳哲宇）：`confidence: **high**` / `medium-high` + `可 Ctrl-F 驗證：是 ✓（個別措辭需二次查核）`
- **必驗升旗**：`⚠️ 必驗：原始公告` = 主稿落筆前必須補一手文件

**鐵律**：信度不是「有沒有引用」，是「這個 claim 憑什麼是這個信度」——來源數量、原文能否直接取得、是否只是媒體轉述。

---

## 二、共通方法論骨架（10 條，跨 12 份收斂）

1. **信度三層登記制（YAML-first）** — claim 進主體前先分層 + 附來源組合，不是事後補標。
2. **觀點成型先於搜尋** — core_contradiction（≤30 字）先鎖；搜尋是**壓力測試論點**不是發現方向（`[hypothesis — Stage 1 驗證]` → 搜後打 `✅ verified` / `⚠️ 修正`）。
3. **搜尋過程本身是報告的一部分** — frontmatter 記 `budget: N WebSearch + M WebFetch`；query 逐條列（前途決議文列出全 42 條，分中/英/一手）；**negative finding 必記**（「搜尋 42 次未找到」「DoubleThink Lab 未發布專題」）。
4. **數字三源驗證 + 主動揭露分歧** — 數字 claim ≥3 源；多源不一致時**揭露差異 + 怎麼處理**（「報導者 50 天 / 自由近 3 月 → 用 50 天，腳註 50-60 天區間」），不靜默取一個；多口徑數字明確分開（交易金額 vs 處分利益 vs 淨利）。
5. **Verbatim 引語是獨立資產** — 引語庫每條：逐字原文 + URL + 場合 + `Ctrl-F 可驗證 ✓`；記者轉述分開標（「此為記者敘述，非直接引語」）；**找不到原文 → 改轉述不加引號**（binary 可用/不可用，不是光譜）。
6. **反例前置作為護欄（不能說的話 / 必驗反例 / 不採信清單）** — 出事實清單**之前**先列「這些推論錯誤要主動防範」（毒馬鈴薯 §12「不能說的話」10 條 / 雷亞「不採信清單」/ 認知作戰「可能陷阱」分高中低風險）。這是 thesis-grade 跟一般報告最大分野。
   6.5 **政府/來源自身矛盾 > 正反並陳** — 最強論證是「同一個食藥署跨 10 年立場自相矛盾」，不必選邊（毒馬鈴薯 R2.4）。
7. **核心矛盾候選多選一（2-3 候選 + 為什麼）** — 保留 Stage 2 寫作者判斷，不以研究報告代替寫作決策（「建議 (c)，最 SSODT」但不鎖死）。
8. **研究報告 = Stage 2 操作規範書** — 含 hook scene 候選（附時間軸）、5-8 小標題候選、「不可忽略的校正點」、**幻覺候選 Ctrl-F 清單**、給 polish 的具體補強指示。
9. **既有文章 red_flags 外科核查（EVOLVE）** — frontmatter 列可驗可反錯誤；三欄 verification log（原文章 / 正確版 / 來源）；精準識別「可信保留 / 需修正 / 該刪」。
10. **multi-round 研究** — Round 2/3 補 unverified、加學術深度（DOI）、加歷史錨點；每輪宣告 budget + 關鍵突破 + verbatim 引語累計計數。

---

## 三、v6.4 漏掉、v6.5 要補的

v6.4 我做的 SSOT 七段抓到「搜尋日誌 / 信度 / 參考文獻 / raw」，但**漏掉這些 thesis-grade 差異化 pattern**：

| v6.4 已有                                      | v6.5 要補（從 12 份萃取）                                        |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| verification frontmatter（提了沒強制三層判準） | **三層信度判準 + 基礎** 強制 + 細 notation（★/🟢🟡🟠/Ctrl-F 欄） |
| 搜尋日誌 section                               | **negative findings 必記** + budget 計數                         |
| —                                              | **數字分歧揭露** 規則（多源不一致不靜默取一）                    |
| —                                              | **反例 / 不能說的話 / 不採信清單**（護欄前置）                   |
| Clean Fact-Pack                                | **Stage 2 操作規範**（hook/小標題/校正點/幻覺 Ctrl-F 清單）      |
| Verification Table                             | **引語庫**（逐字 + URL + 場合 + Ctrl-F 欄，記者轉述分開）        |

---

## 四、落地（v6.5）

- `docs/editorial/RESEARCH.md` → 新增 §研究報告 SSOT 方法論（信度三層 + 10 骨架）canonical
- `docs/pipelines/REWRITE-PIPELINE.md` Step 1.7 → SSOT 結構嵌入信度判準 / negative findings / 數字分歧 / 反例 list / 引語庫 / Stage 2 操作規範
- `scripts/tools/research-report-health.py` → 加查 verification 三層 frontmatter + negative-findings + 反例 section

🧬
