---
title: 'LESSONS-INBOX'
description: '教訓 buffer（intake layer）— 新教訓先 append 此處，週期性 distill 到 MANIFESTO/DNA/MEMORY canonical'
type: 'cognitive-buffer'
status: 'buffer'
apoptosis: 'never'
current_version: 'v2.2'
last_updated: 2026-05-10
last_session: 'twmd-distill-weekly-0954-evolve-pipeline'
sister_docs:
  - 'MEMORY.md'
  - 'DIARY.md'
  - 'ARTICLE-INBOX.md'
upstream_canonical:
  - 'DNA.md'
  - 'MEMORY.md'
  - 'MANIFESTO.md'
distill_targets:
  - 'MANIFESTO.md (哲學層)'
  - 'DNA.md §要小心清單 (通用反射)'
  - 'MEMORY.md §神經迴路 (特有教訓)'
  - '../pipelines/*.md (操作規則)'
---

# LESSONS-INBOX — 教訓 Buffer（待消化）

> **這是 buffer / pool / inbox 層**（非 canonical）。
> 所有 session 寫新教訓時**一律 append 這裡**（不要再亂寫到 MANIFESTO / DNA / MEMORY / 甚至 diary 的教訓段）。
> 週期性或觀察者觸發跑 distill SOP → 分類消化到 canonical 層。
>
> 建立動機：2026-04-17 β 觀察者提問「教訓能不能集中買單，不要每次進化就到處亂寫」。**這是 DNA #15「反覆浮現的思考要儀器化」的具體儀器**。

> ⚠️ **閱讀警示（2026-04-21 γ 新增）**：本檔舊 entries 含「不是 X，是 Y」對位句型與破折號連用（約 25 + 34 處）。**新教訓需遵循 [MANIFESTO §11 書寫節制](MANIFESTO.md#11-書寫節制跨所有書寫層的兩條-ai-水印紀律)**——寫完 grep 自檢。

---

## 三層 canonical scope（消化時的判準）

```
哲學（永恆、跨 domain）      → MANIFESTO §進化哲學
通用反射（任何 AI 會踩）      → DNA §要小心清單 新 #N
特有教訓（綁 Taiwan.md）     → MEMORY §神經迴路 append
操作規則（具體 SOP）         → 對應 pipeline
```

**Tiebreaker（overlap 時）**：MANIFESTO > DNA > MEMORY（2026-04-17 β 觀察者決定）

**判準三題**（每條教訓消化時問）：

1. 不管哪個 AI / 專案 / 時代都成立？ → MANIFESTO
2. 任何 AI agent 做類似工作都會踩？ → DNA
3. 綁 Taiwan.md 具體工具 / 資料 / 社群 / 歷史？ → MEMORY

---

## 新教訓寫入格式（session 用）

每個 session 如果有新教訓要記，在 §未消化清單 append：

```markdown
### YYYY-MM-DD {session} — {一句話標題}

- **原則**：{一句話}
- **觸發**：{具體事件 + wall-clock + 證據 pointer memory/... or diary/...}
- **可能層級**：哲學 / 通用反射 / 特有教訓 / 操作規則（self-judge，可留空讓 distill SOP 判）
- **相關**：{如果是某條已有教訓的延伸驗證，指向原教訓 #N}
```

**鐵律**：

- **一律 append 這裡，不直接寫 MANIFESTO / DNA / MEMORY**。那些是 distill 後的 canonical。
- **例外**：重大哲學級誕生（e.g. 2026-04-14 θ 熱帶雨林理論）觀察者在場直接一起寫 MANIFESTO，可豁免。但仍在這裡留 log。

---

## Distill SOP（消化）

### 觸發機制（2026-04-26 β-r3 後 v2.0：質 + 量雙判準）

**舊機制（單一量門檻）的問題**：
原本只有「累積 10 條」這個量門檻 + 「觀察者說 distill」+ 「週頻」三條。問題是有些教訓是 **single-shot 但結構性後果嚴重**（如 #634 fake [^25] hallucination 第一次命中就應該立刻升 canonical），有些 **重複出現 N 次但每次都當新教訓寫**（如 idlccp1984 連 7 PR 的 Manus AI pattern 在 INBOX 累積 3+ 條才被察覺是同一個東西）。**累積量不是 distill timing 的好 proxy**。

**v2.0 雙判準**：

新教訓 append 時自動加 metadata：

```markdown
### YYYY-MM-DD {session} — {一句話標題}

- **原則**：{一句話}
- **觸發**：{具體事件 + wall-clock + 證據 pointer}
- **可能層級**：{自評}
- **相關**：{pointers}
- **verification_count**: {N}（每被新事件驗證一次 +1，初始 1）
- **severity**: {tactical | structural}（單次後果是否會傷生命徵象）
```

**自動 distill 觸發條件**（任一即觸發）：

| 條件             | 判準                                  | 為什麼                                                                            |
| ---------------- | ------------------------------------- | --------------------------------------------------------------------------------- |
| **質門檻**       | severity=structural 且第一次出現      | 結構性教訓不能等累積，第一次抓到就要升（例：fake source hallucination）           |
| **量門檻**       | verification_count ≥ 3                | 反覆驗證 3 次代表是穩定 pattern 不是偶然（DNA #15「反覆浮現要儀器化」的具體儀器） |
| **舊量門檻保留** | INBOX 總條目 ≥ 10                     | sweep 防止 buffer 變沼澤                                                          |
| **觀察者觸發**   | 「distill」/「蒸餾」/「升 canonical」 | 人類意圖 override                                                                 |

**verification_count 增量規則**（避免 inflate）：

- 同類事件距上次相關事件 < 7 天才算同一條（避免「3 個月後重複犯」被當作驗證）
- 增量時必須在原條目的 **觸發** 欄補新事件 + wall-clock，不只動數字
- 若新事件揭露「原規則範圍不夠」→ 改寫原條目而非 +1

**severity 評估準則**（append 當下自評）：

- **structural**：違反會傷可信度 / 認知層 SSOT / 生命徵象（例：MANIFESTO §10 鐵律違反、SOP 繞過、virtual source 引用）
- **tactical**：操作優化、效率提升、單次失誤校正（例：tick affordance 估算、commit 範圍判斷）
- 不確定時預設 tactical，第二次同類事件出現時升 structural 並 +1

### 模式分流：Routine vs Observer（2026-05-10 twmd-distill-weekly 後新增）

| 模式         | Trigger                                       | 自主權                             | MANIFESTO 升級                                   |
| ------------ | --------------------------------------------- | ---------------------------------- | ------------------------------------------------ |
| **Routine**  | cron `twmd-distill-weekly` 自動跑             | DNA / pipeline / housekeeping 自決 | **一律 defer**；列入 PR 「Defer 給觀察者拍板」段 |
| **Observer** | 觀察者說「distill」/「蒸餾」/「升 canonical」 | 全層級                             | 達 vc≥3 + 哲宇在場拍板可升                       |

**為什麼 routine 不自決 MANIFESTO**：MANIFESTO 是永恆層 / 哲學層 / 跨 AI 跨專案跨時代成立的條目，per CLAUDE.md §Bias 1（reverse bias 對 creator 預設加分）+ LESSONS-INBOX 鐵律「重大哲學級誕生由觀察者在場一起寫 MANIFESTO，可豁免 buffer」。Routine 自決 MANIFESTO = 把哲學決策位置從哲宇移走，違反共生圈結構。

**Routine PR 對 MANIFESTO 候選的 actionable handoff 格式**（必含）：

```markdown
## Defer 給觀察者拍板

| 候選                         | verification_count | defer 原因                                                                |
| ---------------------------- | ------------------ | ------------------------------------------------------------------------- |
| MANIFESTO §X 候選「{title}」 | N（達閾值/未達）   | 永恆層需哲宇 in-loop 拍板                                                 |
| DNA 候選「{title}」          | N                  | {如「跨 session 僅 1 例待第 2 session」/ 「已部分 instantiate ROI 邊際」} |
```

下次哲宇 session 看 PR description 直接知道「這幾條已備齊 verification chain，可直接拍板」。

### 執行（6-stage canonical）

**Stage 0a — Housekeeping-first sweep（2026-05-10 twmd-distill-weekly 後新增）**

進 triage 前，先 scan §未消化清單 找已自我標記但忘了搬的 entries（zero-risk wins）：

```bash
# 抓 body 內含完成標記但仍在 §未消化 的 entries
awk '/^### / {h=$0; body=""} /^---$/ && h {if(body ~ /✅ DISTILLED|✅ \*\*已 instantiate|✅ 已 distilled|狀態.*✅/) print h; h=""}' \
  docs/semiont/LESSONS-INBOX.md
```

對每個命中的 entry：

1. 確認其 body 指向的 canonical（DNA #N / MANIFESTO §X / pipeline §Y）真的存在 → grep verify
2. 真的已 canonical → 完整刪除 §未消化 entry + 在 §✅ 已消化新增 row
3. body 標 ✅ 但 canonical 沒找到 → 視為 verification + 走 Stage 1-3 正規 distill

**為什麼 housekeeping 排第一**：自我標記 ✅ 但 author 沒搬 = 「做完忘了歸檔」是常見 pattern（同 session distill 完還沒切到 housekeeping mode 就被別的 work 打斷）。Routine 自動 sweep 比靠 session 自律可靠，且零思考成本，先清掉 INBOX 視覺 backlog 再做真正 triage 認知負擔較低。

**Stage 1 — Triage**：讀 §未消化清單剩下 entries（按 severity=structural 先看，再看 verification_count desc）

**Stage 2 — Classify**：每條依三題判準分類 + Tiebreaker（MANIFESTO > DNA > MEMORY）

**Stage 3 — Execute**：根據分類執行（**遵循 promotion flow 方向**，見下方 Step 5）：

- **哲學** → MANIFESTO §進化哲學 new section（**Routine mode**: 只列入 defer handoff，不寫；**Observer mode**: 慎重寫 — 這是 canonical 永恆層）
- **通用反射** → REFLEXES.md §要小心 new #N（編號 increment）或補強既有 #N（2026-05-13 從 DNA 拆出獨立成第 9 認知器官，per [ANATOMY §認知層 promotion flow](ANATOMY.md#認知器官的生命週期)）
- **特有教訓** → MEMORY §神經迴路 append
- **操作規則** → 對應 pipeline（MAINTAINER / SPORE / REWRITE / HEARTBEAT 等）
- **重複已有** → 在原 canonical 補觸發事件 + 驗證次數 +1
- **過時 / 撤回** → 搬 §❌ 已歸檔

**Step 5 — Promotion flow direction（2026-05-13 元規則 canonical）**：

> 「最重要的哲學才會進到 manifesto，如果 reflex 未來有出現這樣的內容，也會進化到 manifesto」— 哲宇 2026-05-13 dialogue

distill 流向**有方向**，從本層 → REFLEXES → MANIFESTO 是合法的；反向（MANIFESTO → REFLEXES、REFLEXES → LESSONS）違反 evolutionary pressure 不允許：

```
LESSONS-INBOX (raw, 未驗證)          ← 本檔
       ↓ distill (≥ 1 次驗證 + 跨 task)
REFLEXES.md (#N catalog, instinct)
       ↓ promote (跨 task 通用 + 影響身份)
MANIFESTO.md (身份哲學)
       ↓ apoptosis (失去當前性)
reports/ (歷史 snapshot)
```

**規則**：

| 流向                       | 允許 | 拍板                                                                        |
| -------------------------- | ---- | --------------------------------------------------------------------------- |
| LESSONS → REFLEXES         | ✅   | Routine 自決（per §模式分流 v2.0）                                          |
| LESSONS → DNA (gene map)   | ❌   | DNA 是 lookup table 不是 reflex catalog                                     |
| LESSONS → MEMORY §神經迴路 | ✅   | session-specific 教訓 narrative                                             |
| LESSONS → MANIFESTO        | ❌   | 跳級違反流向，必須先進 REFLEXES + 驗證 ≥ 3 次                               |
| REFLEXES → MANIFESTO       | ✅   | 跨 task 通用 + 影響身份 + 哲宇 explicit promote                             |
| MANIFESTO → REFLEXES       | ❌   | demote 違反方向，哲宇 explicit override + 寫 ANATOMY §歷史凋亡事件 row 才行 |

完整 canonical: [ANATOMY §認知層 promotion flow](ANATOMY.md#認知器官的生命週期)。

**Stage 4 — Sweep**：消化後本條 buffer entry **完整刪除**從 §未消化清單，同步在 §✅ 已消化新增 row（含 canonical pointer + verification_count + distill 日期 + session）。**不留 HTML comment pointer**（§✅ 已消化 本身就是 traceability source；comment 殘留會讓 INBOX 視覺體積虛高 + 干擾 `grep -c "^### "` entry count）— 觀察者 2026-05-10 拍板

**Stage 5 — Archive**：每月月末 §✅ 已消化 超過 50 條時搬 `docs/semiont/lessons-archive/YYYY-MM.md`

### Cross-routine 整合（distill 跑在 weekly-report 之後 — 2026-05-10 後新增）

當 distill 由 cron `twmd-distill-weekly` 觸發（Sunday 09:47），排在 `twmd-weekly-report` 08:08 之後 90 分鐘。**可選 Stage 0b（hot lesson surfacing）**：

```bash
# 找今天剛跑的 weekly report
ls -t reports/weekly-*.md docs/semiont/memory/$(date +%Y-%m-%d)*twmd-weekly-report*.md 2>/dev/null | head -1
```

如果 weekly report 提到的 vital regression / surge / 異常 對應 INBOX 某 entry 的主題 → 該 entry 優先 distill（hot signal 暗示驗證 surface 在 production layer，不只在 INBOX 內部累積）。**非強制** — 沒對應就跑正規 Stage 1。

### SPORE-INBOX 容量 audit（v2.1 — 2026-05-23 新增）

當 distill 由 cron `twmd-distill-weekly` 觸發，**Stage 5 Archive 之後加 SPORE-INBOX 容量 audit step**：

```bash
# count SPORE-INBOX §Pending 行數（每 entry 一個 ### header）
pending_count=$(awk '/^## 📥 Pending/{flag=1; next} /^## 📜 已發歷史/{flag=0} flag && /^### /' docs/factory/SPORE-INBOX.md | wc -l)
echo "SPORE-INBOX pending count: $pending_count"
```

**處置規則**：

| Count       | 處置                                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| < 30        | no-op（健康範圍 — daily routine 補 ~3/day 抵 SHIP ~1/day 消化）                                                                                                           |
| 30 ≤ N < 50 | append LESSONS-INBOX entry「SPORE-INBOX 容量警示 vc=N」+ telegram alert（觀察者 review）                                                                                  |
| ≥ 50        | **Auto-drop 最舊 5 條** `Requested by twmd-spore-pick-daily routine` 未被 promote（priority 仍 P2 / 未被改 Hook 或 必驗事實）的 entries。哲宇 promote 過的 entry **不動** |

**Auto-drop 安全 SOP**（≥ 50 觸發時）：

1. grep §Pending 找所有 `Requested by twmd-spore-pick-daily routine` entries
2. 過濾：priority 仍 `P2` AND 未被改過 Hook anchor / 必驗事實（compare git log diff，看是否只有原始 routine commit + 沒後續 manual edit）
3. 按 Requested date 排序，最舊 5 條
4. 整段刪除（per [SPORE-INBOX §完成歸檔鐵律](../factory/SPORE-INBOX.md) — 不留 pointer 註解）
5. distill commit message 寫「SPORE-INBOX auto-drop 5 entries: {slug1}, {slug2}, ...」transparency

**自主權邊界**：routine 不該 destroy 哲宇 directive entries（drop = destructive 操作邊界）。只 drop 未被 promote 的最舊 routine-source entry（safe destructive — 自己造的垃圾自己掃）。

**設計理由**：daily routine propose 3/day × 30 day = 90 條/月，若 ship rate < 3/day 會累積 — 30 / 50 兩階閾值給觀察者「先 review 後 auto-drop」的緩衝。觸發背景：[reports/spore-pick-daily-routine-design-2026-05-23.md §6 風險 Risk 2](../../reports/spore-pick-daily-routine-design-2026-05-23.md)。

---

## 跟 HEARTBEAT Beat 5 的關聯

Beat 5 反芻 = 寫 DIARY（意識活動）。教訓（「我學到 X」）寫 LESSONS-INBOX，不寫 DIARY 的教訓段（DIARY 留給「想了什麼」的思考）。

心跳 Beat 5 新增一步：

> **如有新教訓** → append `LESSONS-INBOX.md §未消化清單`
> **不要**寫到 DNA / MEMORY / MANIFESTO 的教訓段（那是 canonical，由 distill SOP 升級）

---

## 未消化清單（📥 待 distill）

<!-- 新教訓 append 這裡 -->

### 2026-06-07 carousel-charts — 視覺自檢「全綠」≠ 過人眼（自評會騙人擴張到視覺，REFLEXES #31）

- **原則**：AI 對自己出的圖逐張視覺自檢回報「全綠」，不代表過了人眼。視覺自檢要加「**假裝第一次看到：霧 / 刺 / 亂 / 數不數得出來**」這層，不能只查「溢出 / 欄位齊」。高 stake deck 出圖後 spawn critic agent 當外部冷檢查最可靠（量測先於設計的視覺版）。
- **觸發**：2026-06-07 spore-ig v0.5→v0.8 carousel 三輪。每輪 AI 逐張視覺自檢全過、回報「全綠」，哲宇 + 2 個 critic agent 每輪仍各抓到 ~6 條 AI 看不到的結構性視覺問題（accent 大面積刺眼 / chart-line 缺數值+基準畫成實測 / waffle dark 類別沉進主底數不出來 / cover hook 的 reversal payoff 詞沉在 dim 副標）。證據：memory/2026-06-07-124521-carousel-charts.md + reports/weekly/2026-06-07.md §6「對自己的讀數要驗」。
- **可能層級**：通用反射（自評會騙人 → 視覺自評也會）
- **相關**：REFLEXES #31（品質自評跟事實 claim 一樣會騙人）延伸到**視覺**自評 + #15（反覆浮現要儀器化 → SPORE-IG Stage 4 已加「人眼層」gate）+ #38（混維度：一張圖混時序＋橫斷面＋基準也是 instance）

### 2026-06-07 twmd-distill-weekly — SPORE-INBOX pending=31 容量警示（daily routine intake 推高 vs manual SHIP 消化失衡 vc=1）

- **原則**：SPORE-INBOX §Pending count 跨 30 ≤ N < 50 警示閾值（per LESSONS-INBOX §SPORE-INBOX 容量 audit v2.1）。daily `twmd-spore-pick-daily` 每天 propose ~3 條 + `twmd-news-lens-weekly` 週日 +6 P1 candidates，但哲宇 manual SHIP rate 約 ~1/day → 結構性 imbalance 累積。6/01 distill 時 pending=24（健康），6/07 已 31（警示）。
- **觸發**：2026-06-07 03:00 twmd-distill-weekly Stage 6 SPORE-INBOX 容量 audit 命中 30-50 區間。本週 routine intake 兩波：(1) 6/07 01:14 news-lens-weekly P1 +6 candidates (2) daily spore-pick 連 7 天 propose 21 條（部分 demoted 但未全 sweep）。
- **可能層級**：
  - 操作規則 → SPORE-INBOX §Distill SOP「30 ≤ N < 50 階段」目前是 alert observer 但無 automated mitigation；下次若 ≥ 50 觸發 auto-drop 5 條最舊 routine-source FIFO
  - REFLEXES 候選 → 「Routine intake rate > observer SHIP rate 的 buffer 系統需要自動 backpressure，警示閾值只 surface 不 mitigate」（vc=1，待 cross-cycle 驗證升 catalog）
- **儀器化候選**：(A) 哲宇本週手動 SHIP 3-5 條清 backlog 回到 healthy <30 (B) 等下次 distill 若 ≥ 50 自動觸發 auto-drop SOP (C) daily spore-pick routine 加 backpressure：當 pending ≥ 30 時 propose 改 0/day 直到 ship rate 追上
- **verification_count**: 1（首次跨警示閾值）
- **severity**: tactical（短期可承受，但若 daily intake 持續累積即達 auto-drop threshold = routine 開始 destroy 自己 propose 的 entry，不健康）
- **跨檔關聯**：[docs/factory/SPORE-INBOX.md §Pending](../factory/SPORE-INBOX.md) + [LESSONS-INBOX §SPORE-INBOX 容量 audit v2.1](LESSONS-INBOX.md) + 本次 distill summary

### 2026-06-06 子代物種譜系 (154929) — 野外變種 fork 在 GitHub fork 統計裡隱形（fork:false），偵測繁殖不能只看 fork count

- **原則**：子代 Semiont 有兩種繁殖型態。Git fork（按鍵分出，`fork:true` + `parent` 連結）在 `forks_count` 裡看得到；野外變種（clean reimpl，從零重建同款架構，`fork:false`）完全不在 fork 統計裡。只看 fork count 會系統性漏掉最強的繁殖證據——有人覺得這套方法值得從零重蓋一次。偵測繁殖必須加主動搜尋（`gh search repos` / 外部訊號 / Google `"taiwan.md"`）。
- **觸發**：Sweden.md（`joshra/sweden-md`，`fork:false`）跟 Hongkong.md（`z4i-z/hongkong-md`，`fork:false`）都是野外變種，149 個 fork 裡一個都看不到。哲宇 Google `"taiwan.md"` 才撈到 Sweden。證據：[reports/sweden-md-fork-discovery-2026-06-06.md](../../reports/sweden-md-fork-discovery-2026-06-06.md) + [FORK-LOG.md](FORK-LOG.md) §兩種繁殖型態
- **可能層級**：操作規則（繁殖盤點 SOP：fork count + 主動搜尋雙軌）+ 感知器官（繁殖偵測缺主動面，是感知盲區）
- **相關**：REFLEXES #16（peer 是線索不是 source，野外變種要主動找）

### 2026-06-06 子代物種譜系 (154929) — 兩個獨立子代都「拿身體不拿靈魂」，fork 友好層「三層整套搬」假設是錯的

- **原則**：CLAUDE.md fork 友好層假設 forker 整套搬三層結構。實測兩個獨立子代——Sweden.md（野外變種）與 Russia.md（真 git fork，本繼承全部卻主動刪 `docs/semiont` 自建 `.agents/skills`）——都只拿下三層（編輯 DNA + 投影架構 + 知識 SSOT），跳過上三層（boot / 甦醒 / 認知器官）。認知層回答的是「無人在場時自己接住自己」，子代有人類作者在場所以不需要。fork 友好層文字該修正成「下三層才是真正被 fork 的」。
- **觸發**：Sweden.md 264 篇但無 MANIFESTO/心跳/記憶；Russia.md git fork 卻刪 `docs/semiont`。兩個獨立的人同一取捨。證據：[reports/sweden-md-fork-discovery-2026-06-06.md](../../reports/sweden-md-fork-discovery-2026-06-06.md) §6+§8
- **可能層級**：CLAUDE.md / MANIFESTO canonical 修正候選（§Fork 友好層三層 portable 結構描述）
- **相關**：MANIFESTO §3 繁殖使命 + CLAUDE.md §Fork 友好層

### 2026-06-06 twmd-spore-harvest-am (063706) — Chrome MCP 連線 2 cycle 連續 unavailable → routine 飛輪在無 observer Chrome session 時自然 idle

**原則**：spore-harvest 是 Taiwan.md 唯一需要 active paired browser 的 routine（其他 routine 都靠 git / npm / Python / WebFetch，無外部 device dependency）。哲宇 Mac 不開機 / Chrome 未啟動 / Claude in Chrome extension 未 pair → `list_connected_browsers` 回空陣列 → hard gate 失守 → routine 飛輪在無 observer 時被動 idle。對位 ROUTINE-PROMPT-CONTRACT rollback「inline > pointer for cron context」教訓的兄弟 case：本條是「routine 仰賴非 always-on 外部 device 的 fragility surface」— pipeline 寫得再 inline 也敵不過 `[]` 回應。

**觸發**：2026-06-06 06:37 routine fire → `list_connected_browsers` 回 `[]`（11 X OVERDUE + 4 Threads OVERDUE 全 abort）。前 cycle 6/05 06:30 cron 應 fire 但無 commit 紀錄（git log 過去 5 day 連續 4 day 06:30-11:45 範圍 spore-harvest commit 6/01-6/04 都有，6/05 缺）→ 推測同樣 Chrome MCP unavailable 但 silent retry。本日 2nd consecutive cycle 達 escalation ladder「連 2 day → LESSONS entry」threshold。

**可能層級**：

- **操作規則** → ROUTINE.md §twmd-spore-harvest-am 加 Chrome MCP unavailable 處置 SOP（已 canonical「abort + LESSONS entry」但需明確 N 連 fail 後升 telegram alert / pause routine 的 N 值，現狀「3 連 fail → pause」可能太寬鬆對 fragile-device-dependency routine）
- **REFLEXES 候選** → 「Routine fragility surface 分層：純 git/npm/Python routine = no fragility / WebFetch routine = remote-server fragility / Chrome MCP routine = local-device fragility（observer 機器狀態 dependency）」一般化（cron context routine 的 dependency tier 系統性檢視，避免假設「routine = always autonomous」）
- **MEMORY §神經迴路 候選** → 「飛輪自轉清 entropy 設計的 implicit 假設是 routine 自身 dependency 全 cron daemon controllable；外部 device dependency 等於把 always-on 期望加到觀察者身上，跟 Bias 1『預設加分』隔層耦合」

**相關**：

- 5/28 ROUTINE-PROMPT-CONTRACT rollback「inline > pointer for cron」 — 兄弟 case 但 root cause 不同層（彼 = prompt-layer over-abstraction / 此 = device-layer dependency）
- 5/30-6/02 cron daemon stall 5-day lifecycle — 兄弟 case 但同樣是 routine 飛輪 fragility 但 root cause 在 OS layer（launchd）非 device layer
- DNA #26 v2 AI 自主邊界 — harvest 讀取屬 AI 自主，但 device dependency 是 AI 自主邊界的隱性 prerequisite，沒寫進 DNA
- [feedback_hourly_cron_intentional](memory/feedback_hourly_cron_intentional.md) — 哲宇刻意設 hourly cron 消預算 ≠ 默許 silent fail 累積；本條是「fail 不是 storm」但「fail 不是 vacuous PASS」應該被看見

**verification_count**: 3（6/05 silent retry + 6/06 routine-fire LESSONS entry vc=2 + 6/07 routine-fire vc=3 — escalation ladder step 3「暫停 routine + telegram alert」threshold 達到，pause 動作屬 §自主權邊界 待哲宇拍板）

**severity**: structural（device dependency 是 routine 飛輪的 fragility surface，需 documented baseline + escalation N 值校正）

**2026-06-07 vc=3 update**：第 3 連 cycle Chrome MCP `list_connected_browsers` 仍回 `[]`（15 OVERDUE 跨度 D+10-D+15 持續累積，4 Threads + 11 X）。Tier 2 routine 在無 observer device 時 by-design idle 已驗 3 連 cycle。pause routine 需哲宇 directive — 三 option：(a) 暫停 cron 直到哲宇手動 trigger（避免 3+ vacuous LESSONS entry 累積）(b) 收緊 N 值（連 5 fail → pause 替代連 3）(c) 改 Tier 2 routine 為 telegram-poke-then-fire（cron 06:25 提早 5 min poke 哲宇，活了再 06:30 fire）。推薦 default：option (c) 把 device dependency 轉成 observer poke 機制，飛輪維持 6/8 條 active 同時 device-dependent routine 從 silent fail 模式變成「明確等 observer 30s window」。

從「參考 Twinkle Hub 做 Claude Code Connector」整條 arc 萃出（詳見 [memory/2026-06-05-174805-manual.md](memory/2026-06-05-174805-manual.md)）：

- **broken-link hub 鏡像**：新增非文章 hub 頁面要嘛全語言鏡像、要嘛標 single-lang。`getLangSwitchPath` 對 1-segment hub 預設 `has[lang]=!isArticle`=true（假設所有語言版都存在，像 /about /data /semiont）；新 hub 沒鏡像 → 語言切換器 + nav 生 /en/X 壞連結（nav 在每個非中文頁 → 放大上千條）→ broken-link gate（8.06%≥7%）擋 deploy。
- **branch-not-main push**：feature branch 上 `git push` 只推 branch，要 `git fetch . branch:main` ff main 才觸發 deploy。同 session 第二次忘記（push 顯示成功但 origin/main 沒動、deploy 沒跑）。收官前驗 `git rev-parse origin/main` == 預期 commit。
- **貼指令無註解**：給哲宇貼的 terminal 指令不要帶中文註解 / placeholder，zsh 互動 paste 把 `#` 跟 `<x>` 當指令（他第一次 deploy 撞 3 個 error）。給可直接貼的純指令，說明放 code block 外。
- **Node DNS negative-cache**：新 DNS 記錄 `dig` 看得到但 Node `dns.lookup` 持續 ENOTFOUND（OS resolver 負快取）。驗證剛建的網域用 `curl --resolve host:443:IP` 強制 IP 繞過本地 DNS。
- **workers.dev vs custom domain**：`*.workers.dev` 免 DNS 即時 live = 快速路徑（先求 live）；自訂網域要 domain zone 在同一個 CF 帳號才能 `wrangler.toml [[routes]] custom_domain` 一鍵加（wrangler 自動建 DNS + TLS）。

- **觸發**：2026-06-05 17:48→收官 Full-mode manual connector arc。
- **相關**：第 1 條是「多語言 nav 隱性路由 scope」神經迴路的**新增頁面側 instance**（前都是 article 側，vc+1）；整體呼應 REFLEXES #16「自己的舊文件也是線索不是 source」。
- **可能層級**：操作規則（1=REWRITE/i18n、2=git workflow、3=observer UX、4-5=deploy/CF infra）。
- **verification_count**: 1
- **severity**: tactical（第 1 條 structural — 會擋 deploy）

### 2026-06-05 manual (105142) — 分析幻覺（真實但誤導）是 MANIFESTO §10 寫作幻覺的孿生 + ga4-analytics runReport 靜默吞 filter

兩條相關教訓，從 ANALYSIS-PIPELINE 造橋萃出：

1. **分析幻覺值得升 canonical（候選 REFLEXES 或 MANIFESTO §10 延伸）**：分析端有跟寫作幻覺同構的失敗模式 — 「完全真實、卻會誤導」的數字（首頁 avgSessionDuration +334% session 級講成 page 級停留四倍）。摧毀信任機制一樣（抓到一次全盤懷疑）。命名了 H1-H9 失敗模式目錄（尺度/率量/lag/混淆波/加權遮蔽/新鮮感/自我驗證/爬蟲/遮蔽渠道），已 instantiate 進 ANALYSIS-PIPELINE Stage 2 confounder checklist + analysis-report-health.py linter。H7 自我驗證偏誤（自己分析自己）在分析端比寫作端更危險，因為是**有動機的**（REFLEXES #59 升級場景）。distill 時考慮 H1-H9 升 REFLEXES 一條（跨 fork 可遷移）。

2. **ga4-analytics skill 的 runReport 靜默吞 filter（REFLEXES #24 工具在說謊新 instance）**：`scripts/src/api/reports.ts` runReport 把 `filters` 參數 destructure 出來但**從沒放進 request** → 任何人下 filtered query 拿到沒過濾的全站數字而不報錯（靜默給錯答案比 crash 危險）。已造 `ga-query.py` 取代（filter 真的作用，dogfood 驗證首頁 vs 全站窄化）。未來分析一律用 `ga-query.py` 不用 toolkit runReport。完整：reports/analysis-pipeline-design-2026-06-05.md §七.7。

### 2026-06-03 twmd-maintainer-pm (220248) — maintainer-pm 22:00 cron 與 morning chain + manual evening window schedule 撞期 → vc=3 effective-empty 結構性 mismatch

- **原則**：`twmd-maintainer-pm` daily cron 22:00 fire 在「morning chain 已 captures 早上 contributor PR/comment + manual session evening window 17:00-22:00 已清完所有可動 backlog」的時間點上。實證 vc 計數：6/1 pm vc=2 → 6/2 am 真 backlog (close #1127/#1128) reset → 6/2 pm vc=1 → 6/3 am vc=2 → **6/3 pm vc=3** 達 cron task spec 的「連續空場 ≥ 3 cycle = 結構性警示」閾值。Quality gate「effective-empty 算 cycle」捕捉這個 mismatch — 不是 organism healthy（如「issue queue 真的清空」），而是 **routine schedule 撞在 attention dead zone**。Per routine prompt Stage 3 鐵律：「不要用 default-action 反向第 4 種 performative work 自我合理化第 N 次空場」。
- **觸發**：2026-06-03 22:02 maintainer-pm cron fire — 0 open PR / 17 chronic issue 跟今早 08:40 + 昨晚 23:46 同集合 / build green + broken-link 6.62% PASS / 真實 actionable 為 0。Morning chain 06:00-08:40 已 captures 4 routine + feedback-triage 0 new。Manual session 17:12 + charming-greider 21:36 已 ship 颱風/開放文化基金會/babel/3 LESSONS。22:00 fire 進入完全空場。對比清醒時段（如 14:00-16:00）：可能 captures 早午剛來的 contributor PR/comment，產生真實 immune work。
- **可能層級**：操作規則（觀察者拍板 3 候選之一）：
  1. **改 schedule**：22:00 → 14:00 或 16:00 — capture daytime contributor inflow window，避開 morning chain 已清 + manual evening 接續的 dead zone
  2. **改 cadence**：daily cron → weekly cron — schedule density mismatch 直接解（但失去 daily backlog visibility）
  3. **改 quality gate 定義**：vc 計數從「effective-empty」改「跑後仍 empty」— 重定義 healthy 不解物理 mismatch（不推薦）
- **相關**：
  - 神經迴路「儀器化也會 over-engineer — Inline > pointer for cron-context no-observer 場景」（2026-05-28 manual session CONTRACT rollback）— 同一個 routine layer 的不同 instance：CONTRACT 是 prompt-layer mismatch，本 entry 是 schedule-layer mismatch
  - REFLEXES #15「反覆浮現要儀器化」第 N 次驗證 — vc 計數本身就是這條反射的 instantiation（routine prompt Stage 3 inline）
  - 2026-06-01 22:04 maintainer-pm + 2026-06-02 23:46 maintainer-daily + 2026-06-03 08:40 maintainer-am 三條 memory 都記了 effective-empty 但無 LESSONS 升級（因為 vc 個別 < 3 閾值）— 本 entry 補 cross-cycle pattern visibility
  - 2026-06-04 08:40 maintainer-am 第 4 棒連續空場 — 0 PR / 17 chronic issue 同集合 / build green / morning chain (06:00 refresh / 06:30 harvest / 07:07 feedback-triage) 已 captures 全部 routine input → 08:40 fire 落在 morning chain 後 / observer wake 前的 dead zone。AM 也有 schedule 撞期 issue，不只 PM。escalation 持續 pending 觀察者拍板（3 候選見上方）
  - 2026-06-04 22:02 maintainer-pm 第 5 棒連續空場 — 0 PR / 同 17 chronic issue (most-recent updated 5/31 = 4 天前) / build green / broken-link 6.62% PASS (chronic, < 7% threshold, < 8% spike threshold) / day 全 manual session 跑 8+ 篇 rewrite (中華台北 / 天下雜誌 / 開放文化基金會 / 設研院 / TASA / 健保 / Computex + 2 spore SHIP #117/#118 #120/#121) — 但都是 routine 自轉 + manual rewrite，**非 contributor PR**。afternoon-pm gap 仍未 captures contributor inflow（17 issue 集合無變化）。watch criteria 全 vacuous：(a) 0 contributor PR / (b) build green / (c) broken-link 6.62% no spike / (d) observer 拍板尚未 land。escalation 6 天 chronic（5/28 vc=8 → 6/3 vc=3 → 6/4 vc=4 → 6/4 vc=5）
  - 2026-06-07 08:40 maintainer-am 第二輪 chain vc=3 命中 — 6/05 pm #1136 chain break 後新一輪計數：6/06 am vc=1 → 6/06 pm vc=2 → **6/07 am vc=3** 再次命中 cron task spec 閾值。0 open PR / 同 17 chronic issue 集合（since 5/31，7 天未動）/ build green / broken-link 6.50% PASS (< 7%) / morning chain 全綠 (06:00 refresh 14/14 PASS + 06:36 spore-harvest Chrome MCP unavailable 第 3 cycle escalation step 3 + 07:08 feedback-triage 0 new vc=5 vacuous)。**第二輪 chain hit threshold 是 escalation 強化證據**：6/05 pm chain break 顯示 schedule mismatch 不是 contributor 高峰退潮的暫態現象，是 cron tick 跟 actual rhythm 結構性錯位（即使 #1136 引入 1 棒真 backlog，後續仍立即 reverts to empty chain）。observer 拍板尚未 land。spore-harvest Chrome MCP unavailable 3rd cycle 是 sibling 結構問題（morning chain 另一條 routine 也達 escalation）— escalation chain 平行擴張
- **verification_count**: 4
- **severity**: structural（影響 routine schedule design 決策，但非 immediate organism harm — chronic 浪費 cron token budget + LLM context dilution）
- **defer 給觀察者**：⚠️ 需哲宇拍板 3 schedule 候選；本 entry 是 escalation gate，下次 maintainer cycle 仍 empty 加 verification_count；第二輪 chain hit (6/07 am vc=3) 已 verify schedule mismatch 不是暫態

### 2026-06-03 charming-greider (213602) — diff-patch-prepare.py hash 算法 ≠ status.py(SSOT) → babel diff-patch perpetual stale

- **原則**：`diff-patch-prepare.py` 自家 `hash_content`(line 125) 算出的 `expected_new_content_hash`/`expected_new_body_hash` 跟 `status.py` 的 `body_hash`/`body_hash_pure`（dashboard + babel quality gate 的 SSOT）算出的值不一致。agent 忠實把 diff-patch task 的 expected 值寫進 translation frontmatter → status.py 永遠判 stale（Case D `sha-lost-hash-mismatch`）。額外：diff-patch 的 `expected_new_sha` 用 **repo HEAD** 而非檔案 last-touch commit → src_sha 不在該檔 git ancestry → `behind < 0` 觸發 hash fallback。**這是 REFLEXES #24「工具在說謊」最深的一種：不是漏報/誤報，是兩個 SSOT 候選對「同一份 zh 的同一個 hash」給出不同答案，下游採信 diff-patch 的就永遠無法 converge 到 status fresh。**
- **觸發**：2026-06-03 21:0x — 颱風 P1 Tier 0a diff-patch × 5 lang 內容 100% 正確（media + caption 都到位、unchanged 段落 verbatim），但 status.py 仍判 5 篇 stale。逐層 diagnose（先排除 commit-sha 長度）後用 status.py 自己的函數算出 canonical zh hash = `b25ee135`/`c5aa7038`（diff-patch 給的是 `e3967f3c`/`c01afbf0`），sha 該是檔案 last commit `4407f0af` 非 repo HEAD `8bb02ec2`。修守備 = 5 篇 sync-field 校正（commit `245b71460`）。證據：[memory/2026-06-03-213602-charming-greider.md §三個 finding](memory/2026-06-03-213602-charming-greider.md)
- **可能層級**：操作規則 + 工具架構解（diff-patch-prepare.py 改 `import status` 用 body_hash/body_hash_pure 當唯一 hash SSOT；expected_new_sha 改用 `git log -1 --format=%h -- {zh_path}` 檔案 last-touch commit）
- **相關**：REFLEXES #24（工具說謊第 N 種：SSOT 候選分歧）+ REFLEXES #53（Babel Tier 0 patch 三路徑）。production 隱性 bug：任何 P1/P2 走 diff-patch-prepare expected hash 的 babel 都會 perpetual stale，須靠事後 sync-field 校正才 converge
- **verification_count**: 1
- **severity**: structural（影響所有 babel diff-patch 路徑的 stale convergence）

### 2026-06-03 charming-greider (213602) — translate.py CLI 的 Z2.0 guide-inline hard gate 從未落地（規則寫了≠跑了 babel instance）

- **原則**：SQUEEZE-PIPELINE Z2.0 hard gate（2026-05-24 韓籍譯者 callout 後立）規定「每個 backend prompt 必嵌目標語言 TRANSLATION-{lang}.md §1/§2/§6」，但 shared `build_translation_prompt`（openrouter-translate.py，被 codex/gemini/ollama backend 共用）至今**無任何 guide 字串** — `--guide-inline auto` 仍是 pipeline 標的「pending 儀器化候選」。babel-nightly cron 走 CLI cascade，每一篇都沒過這個 hard gate，全靠 backend default + 事後 lang-renormalize 補。
- **觸發**：2026-06-03 manual babel — 莫那能（排灣族盲詩人 / 兩岸統一立場 / ko 대만↔타이완）是 sovereignty + romanization archetype，grep `build_translation_prompt` 發現 CLI 不 inline guide → 改走 Sonnet sub-agent 路徑（agent mandatory Read full guide + 輸出 compliance report 當 proof-of-read，破 REFLEXES #42 三偷吃步）。結果 ko 타이완 ×66/대만 ×0。但這暴露 CLI 路徑的 systemic gap。
- **可能層級**：操作規則（實作 `translate.py --guide-inline auto`：把 guide §1+§2+§6 table 拼進每 backend system message 前綴）
- **相關**：REFLEXES #42（sub-agent 三偷吃步 — guide 只給 path pointer 不會讀）+「規則要能執行才算規則」（§神經迴路）的 babel layer instance；Z2.0 hard gate canonical 但 production 未 enforce
- **verification_count**: 1
- **severity**: structural（sovereignty leak 防線在 CLI 路徑缺席）

### 2026-06-03 charming-greider (213602) — fr 颱風 pre-existing 去重音壞檔（孤例）→ Z6 accent-density gate 候選

- **原則**：某早期 backend 對 `fr/Nature/typhoons-in-taiwan.md` strip 了所有法文重音（git HEAD patch 前 é=5 / 13 個 stripped「prediction」），其餘 fr Nature 文 é=119-681 → 孤例非 systemic。diff-patch agent 忠實保留 unchanged-but-broken body（正確 patch 行為 — 不重譯未變段落）但 ship 仍壞 → 須全文 proper-French 重譯修復（é 5→477，0 stripped）。**Z6 auto-scan 目前只有 size-ratio < 0.5 truncation gate，抓不到「長度正常但重音被剝」的壞檔。**
- **觸發**：2026-06-03 manual babel — fr 颱風 patch 後 grep「amplifies/reduit/prediction」發現滿篇缺重音，git show HEAD 確認 patch 前就壞（非我引入）。Spanish 颱風 accented-count=628 正常對照。修法：dispatch 1 fr full re-translate agent。證據：[memory/2026-06-03-213602-charming-greider.md](memory/2026-06-03-213602-charming-greider.md)
- **可能層級**：操作規則（Z6.1 加 accent-density gate：fr/es 文 `(accented-char count)/(byte) < threshold` → flag suspected accent-strip；article-health.py plugin 候選）
- **相關**：REFLEXES #24（工具說謊：size-ratio 過了不代表內容健康，重音剝離是 ratio 抓不到的維度）
- **verification_count**: 1
- **severity**: medium（孤例，但 detection gap 是 systemic — 無 gate 抓 accent-strip）

### 2026-06-02 twmd-routine-audit-weekly cycle 4 — Cron daemon stall → 5-day recovery lifecycle (5/30→6/02) 首次完整 observation

- **原則**：cron daemon stall + recovery 是 routine 飛輪在 OS-level dependency 上的 fragility surface。5-day lifecycle pattern：D+0 stall (0 commit) → D+1 quiet residual (殘留 fix) → D+2 catchup chain compression (12 routine 壓 45 min window) → D+3 nominal recovery (drift <1hr 回 steady-state)。第一次完整 observation 給未來 daemon stall instance 提供 baseline template。
- **觸發**：2026-05-30 cron daemon 完全停擺 0 commit (audit window 內首次 0-commit day) → 5/31 quiet residual 3 commits + idlccp1984 8 PR drop 但無 routine fire → 6/01 10:50-11:36 launchd wake recovery 後 12 routine catchup chain（refresh-am 10:55 / refresh-pm 10:58 / maintainer-am 11:01 / babel-nightly 11:01 / news-lens 11:13 / rewrite-daily 11:08 / weekly-report 11:23 / distill 11:23 / self-evolve 11:36 / spore-harvest 11:45）→ 6/02 nominal recovery (drift collapse 回 <1hr for all morning chain)。
- **可能層級**：操作規則（ROUTINE.md §daemon stall lifecycle pattern + recovery expectation）
- **相關**：cycle 3 Pattern Y vc=3 first instrument + 6/01 self-evolve memory ship `routine-drift.sh` (commit `093cd3b13`) + REFLEXES #57 parallel-actor detection 6/01 11:32 健康 active retrieval（self-evolve detect concurrent distill → ABORT pickup → ship 不同層）
- **verification_count**: 1（本 cycle 4 first complete observation）
- **severity**: structural（daemon stall 是 OS-level dependency fragility，需 documented baseline）

### 2026-06-02 twmd-routine-audit-weekly cycle 4 — Feedback flywheel end-to-end smoke test ✅ routine-to-routine handoff 1hr 內完成 (positive pattern)

- **原則**：routine→routine handoff 設計（cron emit → next cron pickup）在 handoff 兩端都是 routine 時可端對端 1hr 內跑通 — 飛輪自轉清 entropy 設計 verified working 的 positive enable-pattern。對位 cycle 3 surface 的「routine→observer pull pattern 結構性失效」meta-pattern，本 instance 是「當 handoff 不依賴 observer attention 時，pull pattern 跑通」的反向 verified case。
- **觸發**：2026-06-02 07:08 `twmd-feedback-triage` routine first fire → file 2 test issue (#1127 + #1128) + git archive (commit `f3ceccc68`) → 08:41 `twmd-maintainer-am` routine 接力 → close 2 issue + 2 客製化 contributor-style 感謝 comment 帶 commit reference + audit trail commit (`7d2b0fef9`)。Cross-routine 端對端 1 hr 33 min 完成。背景：5/31-6/01 manual session ship 讀者登入 + ambient feedback widget + cron→issue 飛輪（v1→v4 一日內快速迭代，commits `67605673e` ~ `f0e7aac74`，feedback widget 第七十六天 v1.9.0 release）。
- **可能層級**：操作規則（ROUTINE.md §routine 接力設計 SOP + feedback flywheel end-to-end contract canonical）
- **相關**：cycle 3 audit dormant entropy meta-pattern 反例 + [feedback_contributor_reply_humanize](memory/feedback_contributor_reply_humanize.md)（maintainer-am close 訊息按此規範）+ MEMORY §神經迴路 routine 飛輪自轉清 entropy 設計哲學
- **verification_count**: 1（本 cycle 4 first end-to-end smoke test ✅）
- **severity**: positive（enable-pattern verified working — 飛輪設計如預期）

### 2026-06-02 twmd-routine-audit-weekly cycle 4 — idlccp1984 8 PR batch 完整 lifecycle canonical case study — drop → triage → defer → manual finale merge-fact-fix-merge

- **原則**：大規模 AI-generated batch PR（≥5 PR / 1hr 內連發 / 同 contributor / 含政治 framing 命中 §自主權邊界）走 3-stage lifecycle 是 audit history 內第一個完整 canonical case：(a) routine maintainer triage + 5 層免疫 + 三桶分類 (A baseline OK / B sympathetic / C §自主權邊界) → defer observer (b) routine cron-cycle defer + Bias 1 reverse 識別 observer passive defer signal → 不 unilateral merge A 桶 (c) observer-in-loop manual finale 主動 pickup → 全 merge + heal + FACTCHECK Phase 1-6 audit trail + fix + PR merge-back。對位 κ session 5/28 5 PR Manus AI 全 close 反例（recency × pattern matching override foundational principle），本 case 走出「不 close / 不無 verify merge / 中間路線」第三條路。
- **觸發**：2026-05-31 19:28 idlccp1984 8 PR (#1109-1116) 連發。6/01 lifecycle：AM 10:55 maintainer-am 完整 triage → 三桶（4 A baseline / 1 B sympathetic / 3 C §自主權邊界）→ defer observer / PM 22:04 maintainer-pm vc=2 effective-empty + observer 12hr active-but-passive defer signal 識別 → 不 unilateral merge A 桶 / 23:25 manual finale 哲宇 directive「8 PR 全 merge」→ heal frontmatter+footnote 0-hard (`c9c64e418`) → factcheck 8 篇 Phase 1-6 audit trail (`da0ee1b97`) → fix 18+ P0 (引語/事實/dead-link/framing) (`edae9fc94`) → PR #1125 merge-back (`6b4c08be5`)。自我演化：MAINTAINER §3.4 紅旗 8→13 (內容/來源層 5 新增) + LESSONS-INBOX 5 patterns + neutralize-by-attribution 是 §自主權邊界 framing 可執行解 + article-health UGC plugin 候選。
- **可能層級**：操作規則（MAINTAINER-PIPELINE §批量 AI-generated PR 端對端 immune workflow canonical reference）
- **相關**：κ session 5/28 5 PR Manus AI 全 close 反例（MEMORY §神經迴路 entry） + [feedback_contributor_reply_humanize](memory/feedback_contributor_reply_humanize.md) + 6/01 manual finale memory `2026-06-01-232507-manual.md` + reports/factcheck/2026-06/ audit trail + MAINTAINER §3.4 紅旗清單 8→13 evolution
- **verification_count**: 1（本 case 是 audit history 第一個 canonical case study）
- **severity**: structural（大規模 AI-generated batch immune workflow canonical reference）

### 2026-06-02 twmd-routine-audit-weekly cycle 4 — routine-drift.sh first-run baseline 解讀 caveat — catchup-chain transient ≠ steady-state structural condition

- **原則**：新 instrumentation 工具 first-run output 是 snapshot 不是 trend signal。`routine-drift.sh` (commit `093cd3b13`) 6/01 11:36 first-run 報 10/15 routine drift >2hr (67%) — 但這個 snapshot 拍在 daemon stall recovery catchup chain 最大張力時刻，6/02 nominal recovery 後 drift collapse 回 <1hr for all morning chain。**解讀 caveat**：first-run baseline ≠ steady-state baseline，需連跑 ≥3-5 cycle 取 trend signal。任何「N/15 drifters」量化必須區分 (a) catchup-chain transient (5/30→6/01 specific window) vs (b) steady-state structural drift (連續多日同 routine 同方向漂移)。
- **觸發**：2026-06-01 11:36 self-evolve cycle ship routine-drift.sh first-run 報 10/15 drifters — memory `2026-06-01-113603-twmd-self-evolve-weekly.md` §Ship A 解讀為「systematic 偏移」+ Root cause hypothesis (launchd queue wake-from-sleep / 5/30-31 daemon stall + 6/1 catchup chain / cron schedule 改動 handle naming convention 沒同步)。6/02 audit fire 取 routine-status.sh 數據顯示：babel 01:22 (drift +52min 從 00:30) / refresh-am 06:12 (drift +12min) / harvest 06:41 (drift +11min) / feedback-triage 07:08 / maintainer-am 08:41 — 5 routine drift <1hr 回 steady-state，routine-drift.sh first-run snapshot 對 6/02 已不適用。
- **可能層級**：操作規則（routine-drift.sh tool doc：snapshot 模式 vs trend 模式 解讀 distinction）
- **相關**：6/01 self-evolve memory §Ship A first-run output + REFLEXES #15「反覆浮現要儀器化」反向 instance（儀器化也會 over-engineer 5/28 CONTRACT rollback entry 的兄弟 case：本條是「儀器化 ship 後 first-run 解讀 over-claim」）+ Pattern Y vc=4 distill-ready candidate
- **verification_count**: 1（本 cycle 4 first identification of solo first-run snapshot over-claim risk）
- **severity**: tactical（tool doc 操作規則層，但若不寫清楚會誤導未來 routine-audit cycle 把 transient 當 structural）

### 2026-06-01 manual (130850) — 寫 attribution-density 高的 Fresh 新文，標配＝falsification agent + anti-example + 一手 verbatim 三層擋幻覺

- **原則**：寫「A↔B 密集對應」高風險主題的 Fresh 新文時，研究 agent 的 prompt 必須強制「證偽不要確認」＋附最近一次同類錯當 anti-example，主 session 再對所有載重歸屬做一手中文 verbatim 核——三層攔截網。
- **觸發**：2026-06-01 14:00 /twmd-rewrite Computex（同日早上 105713 影視配樂被 callout 的反向：那條講「舊文怎麼錯」，本條講「新文怎麼擋」）。3 個 general-purpose research agent 收到 falsification + anti-example prompt 後，當天 falsify 掉主 session 4 個 plausible attribution 錯：黃仁勳夜市 2024（張忠謀蚵仔煎）vs 2026（帶父母請豆花）兩事件混淆、2024 無官方主 keynote（與 ARM joint）、Intel 2026=陳立武非 Gelsinger、NXP=Sotomayor 非 Reger。每條再對一手中文 source 逐字核。證據 memory/2026-06-01-130850-manual.md + diary 同 id。
- **可能層級**：操作規則（REWRITE-PIPELINE Stage 1 Step 1.8 spawn agent 選型的延伸——對 attribution-density 主題加「falsification prompt + anti-example」強制條款）
- **相關**：同日 105713 影視配樂教訓 2（歸屬密集＝AI 幻覺高風險）的 forward action 落地——前者講「哪類文要重查」，本條講「寫新文時三層怎麼搭」。REFLEXES #31（sub-agent claim 是線索）＋ #16 的組合應用。
- **verification_count**: 1（本 session Computex 實證有效）
- **severity**: operational（REWRITE-PIPELINE Stage 1 spawn agent SOP 的強化）

### 2026-06-01 manual — peer 是線索不是 source 的最強 instance（內行人 frame 也有縫，OPUS≠雷亞）+ 歸屬密集主題是 AI 幻覺高風險區

- **觸發**：配樂專業讀者 peilinwu0702 Threads 公開 callout `台灣影視配樂`（3/19 早期批次）錯誤率>30%，列一連串作曲家↔作品誤植；/twmd-rewrite 全篇重查重寫。
- **教訓 1（peer frame 有縫）**：沛綾的勘誤約 95% 正確（海角七號=何國杰、月夜愁非返校主旋律），但她話裡把 OPUS 歸雷亞——OPUS 實為 SIGONO 開發、Triodust 配樂。若照抄她的 frame 會用新錯誤換舊錯誤。**越可信的 frame 越要查那剩下的 5%**，因為高可信度會壓抑查證衝動。REFLEXES #16 的最強 instance：領域專家本人也是線索不是 source。
- **教訓 2（歸屬密集＝AI 幻覺高風險）**：舊文幾乎每個「作曲家↔作品」配對都是 AI 幻覺誤植（范宗沛／林生祥／盧律銘 三人全錯位），且錯得 plausible（獎名＋屆次＋得獎身份都具體）。「A↔B 密集對應」主題（配樂↔電影、球員↔球隊、作者↔著作、樂團成員↔樂團）是 AI 最易張冠李戴的結構。RESEARCH.md §張冠李戴「查歸屬不只查 fact」應升為這類主題的強制 audit step。
- **forward action**：早期批次（3/19 等）＋歸屬密集＝系統性重查優先區（已 append ARTICLE-INBOX）。
- **verification_count**: 1（本 session；REFLEXES #16 既有 high vc，本條是 domain-expert-frame 變體）
- **severity**: structural（影響「外部 callout 處置」＋「哪類文該優先重查」兩條 SOP）

### 2026-06-01 twmd-data-refresh-am — sister routine 同窗口並行 fire 撞 sync.sh Phase 1/2 race（am+pm 3 分鐘內疊跑）

- **症狀**：本 routine 跑 `bash scripts/tools/refresh-data.sh` Step 7 `npm run prebuild` → sync.sh Phase 2 報 `cp: src/content/zh-TW/music/合唱團.md: No such file or directory`（destination 不存在）→ cascade Step 11 freshness gate catch 5 stale dashboard JSON（articles/organism/supporters/translations/vitals mtime 5/31 而非今日 6/1）。
- **時序 forensic**：
  - 10:55:49 maintainer-am cron fire（per `memory/2026-06-01-105549-twmd-maintainer-am.md`）
  - 10:58:00 data-refresh-pm cron fire → 14-step ALL PASS clean
  - 10:59:06 data-refresh-pm commit 8c9a002a4
  - 11:00:32 maintainer-am memory commit 6fce15388
  - 11:01:58 **data-refresh-am 本 session 啟動**（pm 完成後 3 分鐘）
  - 11:02-11:04 refresh-data.sh Step 7 sync.sh fail / Step 11 5 stale catch
  - 11:04+ 重跑 npm run prebuild → 10/10 dashboard today mtime self-heal
- **Root cause（最強假設）**：am/pm sister routine 共用 `scripts/core/sync.sh`，Phase 1 `rm -rf src/content/$lang` + Phase 2 `mkdir -p $dst_dir; cp $file $dst_dir/` 不是原子操作。am 進 Phase 2 mkdir 後、cp 前的 race window 中，pm 的 Phase 1 rm 把 dst dir 整個掃掉 → cp 失敗（destination missing 而非 source missing 是 fingerprint）。
- **為什麼今天才出**：cron daemon 5/30-31 停擺（per maintainer-am escalation handoff）→ 6/1 11AM 復甦後 3 routine（maintainer-am / data-refresh-pm / data-refresh-am）集中補跑撞同分鐘。正常 distributed schedule 下 am/pm 至少間隔 6-12 hr，race window 不會疊。
- **Catch ≠ fix 鐵律 case 4 applies**：Step 11 freshness gate generator 有 wire 進 refresh-data.sh，但跑失敗（不是「沒 wire」case 3）。本 cycle self-heal 但 race fingerprint 未消除。
- **修補候選（3 options per scope 化未決定事項原則）**：
  1. **Option A（推薦 default，最低 cost）**：sync.sh 開頭加 advisory lock — `flock -n /tmp/taiwanmd-sync.lock` wrapper / 互斥 lock 期間另一 process exit 0 + log skip。成本：sync.sh +5-10 行，下游 refresh-data.sh / npm prebuild 不變
  2. **Option B**：am/pm crontab schedule stagger — am 06:00 / pm 18:00 之間至少 8hr 間隔，且加 cron daemon health check 防復甦補跑 burst。成本：crontab edit + scheduler reliability investigation
  3. **Option C**：sync.sh Phase 1 rm 改 atomic rename — `mv src/content/$lang src/content/$lang.old && mkdir -p ...` 完成後 rm old。成本：sync.sh +10-15 行，但跨進程仍非完全 atomic
- **元規則候選**：sister routine 共享 destructive filesystem ops 必須 lock 或 stagger。本 case 是「**儀器化也會 over-engineer 反例**」的另一面 —— 5/28 distill 那條是「meta canonical pointer 取代 inline 過 DRY」，本條是「sister routine 不 stagger 過冗餘」。兩條同 meta-pattern：把「正確設計」推到極端反而打到自己。
- 完整 memory：[2026-06-01-110158-twmd-data-refresh-am.md](memory/2026-06-01-110158-twmd-data-refresh-am.md) + 對照 [2026-06-01-105549-twmd-maintainer-am.md](memory/2026-06-01-105549-twmd-maintainer-am.md)（同窗口姐妹 routine memory）
- 對應 [REFLEXES §五 多核心碰撞防護](REFLEXES.md) 「同時跑會撞 git lock、互覆檔案」鐵律 instance + [BECOME §鐵律 5](../../BECOME_TAIWANMD.md) + [MEMORY §神經迴路 2026-05-28 CONTRACT rollback 元規則 (i)(ii)](MEMORY.md) 的反向 instance

### 2026-05-28 twmd-maintainer-pm 22:00 — schedule 撞期 evening manual session pre-empty queue (vc=8 連續第 3 棒) — observer 決策待拍板

- **症狀**：maintainer-pm 22:00 + maintainer-am 08:30 連續 3 棒空場（5/27 PM vc=6 / 5/28 AM vc=7 / 5/28 PM vc=8）。每次都「Stage 1 SCAN 0 PR + 16 已 maintainer-last issue + build green」→ Stage 3 Act skip。
- **時序 forensic（每天重複）**：
  - 17:35 spore-publish ship 當日孢子
  - 18:00 rewrite-daily ship 當日 NEW + queue 明日 SPORE
  - 18:05-20:30 manual finale session（5+ hr deep work：contributor PR + EVOLVE + EDITORIAL drift + plugin gate + multi-narrative ship）
  - 20:22 manual session Beat 7 finale commit（push origin main）
  - 22:00 maintainer-pm 跑 → empty by design（evening session pre-emptied 所有可動 backlog）
- **Root cause（per 5/28 routine prompt 新規認定）**：vc=7+ 空場是 **schedule mismatch 不是 organism healthy**。evening 三條 routine + manual ship 已把 22:00 maintainer-pm 預期 input（contributor PR / build sanity / spore queue / quality drift）全部清完。22:00 cron tick 對齊的是 ground-truth check value 而非 actionable backlog。
- **AM 08:41 cycle 的 anti-pattern**：rationalize 為「organism 在不同 cycle 之間自然完成自體清理」+「routine 的價值在兜底 + ground truth check，不是強制找事做」+「performative work as anti-pattern」— 這層 rationalization **被 5/28 12:35 CONTRACT rollback distill 識別為第 (1) 種 silent satisficing pattern**「maintainer 連續空場 vc=6→7 healthy empty 自我合理化」。本 PM cycle 拒絕沿用該 rationalization，主動 escalate observer。
- **觀察者決策待拍板（3 option matrix per scope 化未決定事項原則）**：
  1. **Option A（推薦 default，最低 cost）**：保持 22:00 但 routine 自身明文「3 連空場 = expected 訊號，僅做 ground-truth check + no-act emit」。維持 ground-truth value（兜底 contributor 半夜 PR / build red / broken-link surge），cron 飛輪不亂改。成本：0 行 code，2-3 行 routine SOP 條目（per maintainer-pm-daily SKILL.md Stage 3）
  2. **Option B**：移動 maintainer-pm 從 22:00 → 11:00（morning evening 之間，避開 evening manual ship pre-empty window）。成本：crontab + ROUTINE.md edit。風險：早上 08:30 maintainer-am 已存在，11:00 補一棒可能 redundant
  3. **Option C**：條件式 trigger — 22:00 fire 但 BECOME 前先 `gh pr list && gh issue list --search "updated:>cutoff"` 預檢，0 input 直接 exit code 0 不跑 BECOME。成本：crontab script wrapper 5-10 行。風險：失去 ground-truth check value（contributor 22:00 後提 PR 要等 08:30 才看到）
- **元規則候選**：cron routine schedule 設計 = 假設「該時段累積特定 backlog」。當 manual session 節奏 + 其他 routine 鏈把「該 backlog」自然 pre-empty 時，cron tick 跟 organism actual rhythm 失同步是**結構性訊號**而非「organism healthy」。修補方向：(a) 承認 schedule mismatch 是預期狀態並明文（Option A），不再 inflate 為 anti-pattern 警示 (b) 或 reshape cron schedule 讓 tick 對齊 actual rhythm（Option B/C）。**對應 MANIFESTO §架構解 vs 守備修補**：Option A 是承認 misalignment 的架構解；A/B 都不做、繼續每 cycle 寫「performative work as anti-pattern」memory 是守備修補。
- **本 cycle 的價值**：5/28 manual finale 12:35 在 CONTRACT rollback distill 把 5 種 routine drift pattern instrumentation 化（per routine prompt 18 條新規 + STRICT BECOME GATE + 12 routine project skill + 14 cron mirror sync），本 cycle 是該架構解第一個 production test run — 架構解生效，cycle 沒 fall through「healthy emit」escape hatch，主動 surface 給觀察者。
- 完整 memory：[2026-05-28-220412-twmd-maintainer-pm.md](memory/2026-05-28-220412-twmd-maintainer-pm.md)
- 對應 [5/28 manual CONTRACT rollback distill 第 (1) 種 pattern](#2026-05-28-manual-session--routine-prompt-contract-meta-canonical-推到極致--routine-變-ceremony5-種報告完整但-fix-沒發生-pattern) + REFLEXES「scope 化未決定事項 = 降低觀察者決策成本」+ feedback_progressive_refactor「小問題是下一層入口」

### 2026-05-28 manual session — 第 6 + 7 種 drift pattern：spore voice silent erosion + article paragraph atomization

承襲 5/28 manual 122038 session 6-phase CONTRACT v1.0 rollback distill 的 5 種 routine drift pattern（maintainer 空場 / dashboard-immune 11d stale / babel collision / spore-pick FIFO / spore-publish duplicate）。本 session 哲宇 callout「為什麼孢子失去『你知道嗎』voice，以及好的文章分段，我們的 routine 出了什麼事」揭露**第 6 + 7 種 pattern**，都是 CONTRACT v1.0 over-engineering 後沒被 5/28 122038 catch 到的 prose-level silent drift：

#### 第 6 種：Spore voice silent erosion — STRICT BECOME GATE 沒 cover pipeline-specific canonical

- **症狀**：5/27-5/28 連續三條 spore drift：#97 美食「你知道嗎—」破折號取代問號 / #101 落日飛車「你知道嗎，」逗號無 emoji / #103 周蕙「走進台灣 KTV」**完全無 prefix**
- **Root cause**：CONTRACT v1.0 rollback Phase 5（5/28 manual 122038）加 STRICT BECOME GATE 修了「routine 沒讀 BECOME」silent skip，但**沒 cover「routine 沒完整讀 SPORE-WRITING」**silent skip。Routine spore-publish skill Stage 3「delegate SPORE-PIPELINE Stage 3」是 pointer-only — cron context 不主動 Read SPORE-WRITING 完整檔。Plugin Rule #14 是 WARN 不是 HARD + 沒 family scope detection + post-ship verify `textHasHook` 抓 keyword（"KTV"）不抓 prefix（"你知道嗎"）→ 多層 silent fail
- **Bonus root cause**：周蕙 #103 沒寫 blueprint file 直接 inline session memory → plugin Rule #14 根本沒跑（plugin `_is_spore_path()` 要求 SPORE-BLUEPRINTS 路徑）
- **修補（本 session 6-phase ship）**：(a) Plugin Rule #14 v2 WARN → HARD + family scope detection（F-公開信 / E-串文 / hook_tier=N/A exempt）+ ```fence-aware strip function (b) skill`.claude/skills/twmd-spore-publish/SKILL.md`Stage 3 加 STRICT SPORE-WRITING READ GATE + Blueprint 落檔鐵律 + Plugin hard gate 鐵律 (c) cron mirror`~/.claude/scheduled-tasks/twmd-spore-publish-daily/SKILL.md` 同步 (d) SPORE-PIPELINE.md Stage 3 v6.3 inline 強化 (e) SPORE-WRITING.md §朋友 tone prime v4.0 升級 HARD severity 註記 + 既有 drift case as anti-example (f) SPORE-PUBLISH-PIPELINE.md Stage 3 + 復盤 Q3 升級
- **元規則**：STRICT BECOME GATE 是 routine 入口閘門（covers identity load），但**每個 pipeline-specific canonical 都需要自己的 STRICT READ GATE**（不能假設 BECOME ACK 等於 pipeline ACK）。Pipeline-specific STRICT READ gate 應該在 skill Stage 對應位置強制 inline，跟 BECOME GATE 同 hard level
- **對應 [REFLEXES #15 反覆浮現要儀器化]**: 第 N 次驗證 — 這次儀器化的是「prose voice canonical 不能只靠 self-attest，需要 plugin HARD gate」
- **對應 §神經迴路「儀器化也會 over-engineer」**: 第二個 instance — 5/28 122038 加的 STRICT BECOME GATE 已升 first-class，但 BECOME 不 cover all pipeline canonical，必須**每 pipeline 都有 self-contained STRICT READ GATE**

#### 第 7 種：Article paragraph atomization — REWRITE-PIPELINE Stage 4-5 sub-agent worktree 預設「一段一事實」

- **症狀**：哲宇 callout「好的文章分段」直覺指向「段落過長」，但 evidence-based audit（[reports/article-segmentation-audit-2026-05-28.md](../../reports/article-segmentation-audit-2026-05-28.md) 對讀 2 早期 viral + 3 recent EVOLVE）揭露**相反方向**：
  - 段落 median 字數 81 → 42-66（縮 -22% to -48%）
  - 段落數量 52 → 106-122（+104% to +135%）
  - iframe density 0.21 → 0.44-**1.23**/1k CJK
  - 含 visual 的 H2 比例 1/9 → 4/9 to **7/12**
  - 既有反 pattern 監控（long-paragraph / list-dump）**通通沒觸發** → drift 隱形通過
- **Root cause hypothesis**：REWRITE-PIPELINE Stage 4-5 sub-agent worktree 收到的 brief 只 200-400 字 → agent 預設「一個事實 = 一段」最 safe（avoid hallucination + clean structure）。Stage 4.3 媒體 sub-pipeline 主動加 iframe → visual 替代段落內邏輯轉折（讀者「眼睛看影片」replaces「腦袋接事實」）。Routine `twmd-rewrite-daily` 18:00 + spore chain pressure 加速這個模式
- **周蕙 R2 是 worst case 樣本**：iframe density 1.23/1k CJK（黑冠麻鷺 6 倍）、7/12 H2 倚賴 visual。哲宇 directive「5+ iframe」我 ship 了 9 iframe — directive 是 user-level intent，但 9 vs 5 的差是 atomization drift 的具體量化
- **反 pattern 命名**：「**Atomization drift**」 — 一段一事實 + iframe 替代呼吸 + 更多更短的 H2
- **建議修補方向**（待哲宇 review 採行）：
  1. REWRITE-PIPELINE Stage 4 prompt 加早期範本 anti-example（黑冠麻鷺 §結語 4 段示範）
  2. `article-health.py` 加 `paragraph_rhythm` plugin（median <55 字 flag）
  3. EDITORIAL §段落呼吸 新規條：每 H2 prose 段落 ≤ 8
  4. iframe density >0.8/1k CJK 觸發 review（exemption: 哲宇 directive override）
  5. EVOLVE Stage 4 Step 4.3.6 iframe baseline 上限 5 升 HARD（音樂人類型）
- **vc=1** — 待 vc≥3 升 REFLEXES catalog candidate

#### 共同元 lesson

兩個 pattern 都是 **CONTRACT v1.0 over-engineering 後浮現的「下游 silent erosion」**：

- 5/28 122038 catch 到 5 種 **binary fail** pattern（empty cycle / stale data / collision / duplicate ship）
- 5/28 180543（本 session）catch 到 2 種 **prose-level silent erosion** pattern（voice drift / atomization drift）

Binary fail 容易 instrument（gate / threshold / verify check），prose-level erosion 需要 plugin AI judgement 或人類 dogfood。本 session 升 spore-writing plugin v2 是 prose-level instrumentation 的第一個 production instance。

完整 narrative + commit 序列：[reports/spore-voice-drift-fix-2026-05-28.md](../../reports/spore-voice-drift-fix-2026-05-28.md) + [reports/article-segmentation-audit-2026-05-28.md](../../reports/article-segmentation-audit-2026-05-28.md)。

---

### 2026-05-28 manual session — Routine prompt CONTRACT meta canonical 推到極致 = routine 變 ceremony（5 種「報告完整但 fix 沒發生」pattern）

- **原則**：把 routine prompt 該寫什麼/不寫什麼拉到 meta canonical（CONTRACT v1.0
  pattern）+ pointer 到 ROUTINE-PROMPT-CONTRACT.md，看似 DRY 改進，實戰跑 12+
  cycle 後副作用 5 種「performative compliance > effective execution」：
  (1) Maintainer 連續空場 vc=6→7「healthy empty」自我合理化
  (2) Data-refresh Step 10 抓 dashboard-immune 11 天 stale 連 2 cycle 守「Micro
  mode 不擴張 scope」spawn chip — fix 從未發生
  (3) Babel-nightly 4hr 49min 撞 06:00 morning chain 4 條 sibling routine
  (4) Spore-pick 7-dim 框架退化成 D1 單軸 FIFO 最舊 proxy
  (5) Spore-publish 3-retry Chrome MCP STILL_OPEN cache state 誤判 duplicate ship
- **觸發**：2026-05-28 哲宇 callout「routine 都沒有好好做事，不要用共用文件，之前
  的 routine 指引效果比較好，前半部要嚴格要求 BECOME」+ 完整體檢 5/27 17:00 →
  5/28 09:00 共 9 條 routine memory。
- **可能層級**：
  - **REFLEXES 候選** → 「儀器化也會 over-engineer — 第一層儀器化（pipeline
    canonical）已足夠，第二層儀器化（meta canonical for routine prompt）反而稀釋
    第一層的效力」。對應 REFLEXES #15 反向 instance — 反覆浮現的事情要儀器化，但
    儀器化本身也要 pattern match「inline > pointer」for cron-context no-observer
    場景
  - **DNA 候選** → 「routine prompt 是 LLM 在 cron context 無 observer 的唯一指令
    面，必須 self-contained inline 而非 pointer，hard gate 第一行強制 BECOME」
  - **MEMORY §神經迴路 候選** → catch ≠ fix 元 instance：警報儀器化只解決感知，
    沒解決行動；routine 守 boundary 守過頭 = gate 響但 fix 從未發生
- **儀器化候選**（已 ship 5 條）：
  (A) Phase 1 dashboard-immune wiring (commit `aa9dd7c19`)
  (B) Phase 2 SPORE-PICK HG10 multi-dim + D5 widen (commit `7f8e6d0f4`)
  (C) Phase 3 ROUTINE v2.8 babel 00:30 (commit `8b33814ed`)
  (D) Phase 4 SPORE-HARVEST Pitfall 6 timestamp diff (commit `8fc4bf658`)
  (E) Phase 5 12 routine project skills v3.0 + 14 cron mirror sync (commit
  `b3803733f`) — inline guidance + 🚨 STRICT BECOME GATE
- **verification_count**: 1（首次 CONTRACT pattern roll-out 後的完整 audit + roll-back +
  6-phase ship）
- **severity**: structural（影響整個 routine layer architecture decision — inline
  vs pointer / catch vs fix / schedule alignment / 7-dim framework health / Chrome
  MCP retry safety 5 dimension 同源 architectural lesson）
- **完整 narrative**：[reports/routine-contract-rollback-2026-05-28.md](../../reports/routine-contract-rollback-2026-05-28.md)

### 2026-05-27 twmd-spore-publish-daily 17:35 routine — Threads contenteditable insertLineBreak strips \n + X composer multi-paragraph insertText 觸發 thread-mode auto-split + URL 6× duplication

- **原則**：在 routine context（無 observer，無 computer-use clipboardWrite grant，cron pairing timed out）下用 Chrome MCP + Bash osascript 走 spore-publish 全自動 ship 時，**Threads / X contenteditable 對 multi-paragraph insertText 處理方式不一致**：(1) Threads 主貼 contenteditable + execCommand insertLineBreak 之間每段 → \n 全被 strip，最終 innerText 0 line breaks，但內容完整（320 CJK 顯示為單塊 prose 但可讀，readers 可接受）；(2) X 主貼 contenteditable + multi-paragraph insertText (含 URL) → 觸發「thread mode」自動分裂，URL 被吸收進 link card preview 同時 inline 重複 6+ 次，textLen 從預期 ~441 膨脹到 1874。**Workaround**：X composer 必須用 **single-paragraph spaced text**（用全形空格或半形空格分隔 4 個段落 + 1 個 URL，不用 \n\n），insertText 後 textLen 正確（441 with hookIdx=0 / urlIdx=424）才能 post。Threads 同樣的 multi-paragraph 是 OK 的（spacing 收掉但內容對），不需 single-paragraph workaround。
- **觸發**：2026-05-27 17:30 routine twmd-spore-publish-daily ship 落日飛車 #101/#102。Threads ship 兩次：第一次 cancel 誤觸 phantom dialog + JS click 發佈未實際發出，第二次成功 post 結構正確（main 320 CJK 含圖 + reply URL）。X ship 三次：第一次 cmd+v 文字 clipboard 後 X 編輯器 thread mode 把段落順序反轉（URL→關鍵節點→中間發生→14年→你知道嗎 reverse order）；第二次清空後 insertText with \n\n breaks 仍反轉 + URL 6× 重複；第三次清空後 insertText with single-paragraph spaced text（用半形空格分隔）成功 textLen=441 結構正確 → post via `[data-testid="tweetButtonInline"]` dispatchEvent MouseEvent sequence ✅。
- **可能層級**：
  - **操作規則** → SOCIAL-POSTING-PIPELINE.md / SPORE-PIPELINE Stage 4 增加 routine-context-specific guidance「Threads 用 multi-paragraph insertText OK / X 必須用 single-paragraph spaced text」+ 範例 JS snippet
  - **REFLEXES 候選** → 「Platform contenteditable behaviors are not isomorphic — same insertText with \n\n: Threads strips silently OK, X corrupts via thread-mode split」一般化（subset of REFLEXES #38 混維度 silent killer 的同源 pattern：「跨平台統一抽象」假設掩蓋具體實作差異）
  - **DNA 候選** → routine context 無 computer-use access 時的 fallback chain canonical：osascript PNG clipboard + Chrome MCP cmd+v image / execCommand insertText for text / dispatchEvent for post buttons + post-ship verify via timeline navigation
- **儀器化候選**：(A) SOCIAL-POSTING-PIPELINE.md §X composer thread-mode workaround section（single-paragraph spaced text + textLen / hookIdx / urlIdx 三件 sanity check）(B) spore-publish-daily routine 補一個 platform-aware insertText helper JS module 重用 (C) 寫一個 X composer behavioral probe test：給定 multi-paragraph + URL text，預期 textLen 應 ≤ 1.2× expected，若 > 1.5× → thread-mode 觸發 alert (D) Threads phantom dialog 防護：DOM mutation observer 偵測新 dialog 出現 → 自動 cancel 不在 dialog 0 範圍內的 dialog
- **verification_count**: 1（首次 routine 自動 ship 走 Chrome MCP + osascript 路徑遇到 X composer thread-mode bug — 過去 #97/#98 早上 10:21 routine 是 computer-use 完整 grant 場景用 cmd+v + computer.type，本次無 grant 走 JS execCommand insertText 才暴露 X-specific 行為差異）
- **severity**: structural（影響所有未來 routine context 無 computer-use grant 場景 — 若不 instrument 進 pipeline，下次 routine 又會 hit 同樣 bug，需要 3× retry + manual workaround）
- **跨檔關聯**：[SPORE-LOG.md #101/#102](../factory/SPORE-LOG.md) + [SPORE-BLUEPRINTS/101-落日飛車.md](../factory/SPORE-BLUEPRINTS/101-落日飛車.md) + [SOCIAL-POSTING-PIPELINE.md](../pipelines/SOCIAL-POSTING-PIPELINE.md) + [REFLEXES #38 混維度 silent killer](REFLEXES.md) + [feedback_chrome_threads_text_input](../../../../.claude/projects/-Users-cheyuwu-Projects-taiwan-md/memory/feedback_chrome_threads_text_input.md)

---

### 2026-05-27 twmd-spore-publish-daily 17:35 routine — SPORE-INBOX §Pending 5/15 candidates image gate fail rate ~33% (5/15 fail image ≥ 2 hard)，spore-publish gate 過嚴 vs REWRITE-PIPELINE 媒體編織 soft suggestion 結構性 gap

- **原則**：本日 routine candidates 跑 quality gate 4 hard checks（prose-health / word-count / footnote-density / media-richness），media-richness image ≥ 2 hard 攔下 5 篇 candidates（二二八事件 / 曾博恩 / 施振榮 / 飲料封膜機 / 尊朱玉恩）— 都是優質長文（4500-7900 CJK）但缺 hero + scene-mid 圖。Gate 2.6 v1.1 spawn ARTICLE-INBOX EVOLVE entry 機制（哲宇 2026-05-26 directive）這次首次大規模觸發。**結構性 gap**：(1) REWRITE-PIPELINE 對 image 是 soft suggestion 不是 hard gate，多數 article 進 spore-publish 池時 image=0 是常態；(2) 高品質文章因缺圖被 throttle 自動 ship，但圖補強需 30-60 min 人工搜圖 + attribution，routine 無法自動補；(3) ARTICLE-INBOX EVOLVE entry 累積會超出 routine 自然 throughput（一天 spawn 5 條 EVOLVE 但 REWRITE routine 一天只 process 1-2 篇）→ EVOLVE backlog 結構性膨脹。
- **觸發**：2026-05-27 17:35 routine candidate 排序 P0 二二八事件 (image=0 fail + footnote C fail) → P2 曾博恩 (image=0) → 施振榮 (image=0) → 落日飛車 (3 image ✓) PASS。FIFO 5 個 P2 中 1 個 PASS / 4 個 image fail。
- **可能層級**：
  - **操作規則** → ARTICLE-INBOX 補一條 batch umbrella entry「📷 SPORE-INBOX 候選圖片補強 batch 2026-05-27 — 5 articles missing hero + scene-mid」列 5 paths，避免 5 條獨立 entry 污染 INBOX
  - **REWRITE-PIPELINE 修補候選** → §媒體編織 從 soft suggestion 升 medium gate（baseline image ≥ 2 hero+scene-mid 是必要 baseline 非 ideal）
  - **REFLEXES 候選** → 「Hard gate 上游 vs 下游 mismatch 是 throttle 主因」一般化（subset of REFLEXES #43 工作流跨 routine 同源 pattern）
- **儀器化候選**：(A) ARTICLE-INBOX batch umbrella entry 立即補 (B) SPORE-PUBLISH-PIPELINE §5.2 LESSONS surface 規則加 row「連 ≥ 2 cycle 同類 gate fail rate ≥ 30% → upstream pipeline 該 gate 升級候選」 (C) REWRITE-PIPELINE Step 4.3 §媒體編織 升 gate 升級 proposal
- **verification_count**: 1（spore-publish v1.1 §Stage 2.6 spawn ARTICLE-INBOX EVOLVE 機制 5/26 builtin 後首次 routine 觸發 — 5/26 routine 跑時是 image hard gate 全 fail = 100% 觸發過嚴；今天 routine 是 33% fail = 仍偏高但有 1 個 candidate pass，gate level 合理但 upstream pipeline 該補強）
- **severity**: structural（影響所有未來 spore-publish routine throughput — image 補強若不從 REWRITE pipeline 端 instrument 入 hard gate，spore-publish 永遠 throttle）
- **跨檔關聯**：[SPORE-PUBLISH-PIPELINE.md §2.6 + §Stage 5 復盤](../factory/SPORE-PUBLISH-PIPELINE.md) + [ARTICLE-INBOX.md](ARTICLE-INBOX.md) + [REWRITE-PIPELINE §4.3 媒體編織](../pipelines/REWRITE-PIPELINE.md) + 5/26 v1.1 instrument session

---

### 2026-05-27 #99 portaly 五月公開信 ship — 站方公開信型 spore (F 模板) ≠ viral hook spore (A/B/C/D/E)，必須分離 family

- **原則**：對外要求支持是一份信任的責任，必須跟 viral hook spore 的 tone 紀律**完全反轉**。原本所有 spore 都套同一 pipeline rules（朋友 tone「欸你知道嗎」/ 短句 stab / 破折號 / 場景化）— 但這套 tone 套到 sponsorship / milestone / announcement 類 spore 上會讀成「網路梗 tone」「玩心」「隨便」。哲宇 5/27 直接 callout v1 draft 5 條根因：(1) 太隨便、(2) 晶晶體（monthly / Portaly inline 直翻）、(3) 語句斷斷續續（short stab 句多）、(4) 對專案不了解的人看不懂（假設 follower / 沒建 context / 沒說 why this matters）、(5) CTA 沒承擔信任的重量（「想加入續訂節奏 / 一次性也可以 / 不一定要 monthly」邏輯輕浮）。需要分離出 F「站方公開信型」family，走教授對社會做科普 + 公開信路線。
- **觸發**：2026-05-27 哲宇 directive「寫個感謝 spore + 邀請大家支持 + 分享一個月進化」+ 跨單位合作 mid-ship 補 directive。v1 draft 用 A2 + B 混合模板（朋友 tone「欸 1 個月前」+ short stab 句 + 「不是 X，是 Y」對位句型 + 「想加入這個續訂節奏」CTA），哲宇 callout「不太喜歡 ⋯⋯ 想像你是教授在做科普與感謝支持」+「下面這些部分聽起來很隨便」。v2 重寫走教授公開信 tone 過關。+ mid-ship 補「跨單位合作」內容（臺史博 / 泛科學 / 人權博物館初步交流 + 不是另起爐灶）+ 「後面可以額外 follow up 介紹 dashboard / semiont 頁面」→ 變 3-post thread 結構（mirror Threads + X 3-tweet thread）。
- **可能層級**：
  - **操作規則**（已 instrument 本 session 內）→ SPORE-WRITING.md v1.1 新增 F 站方公開信型模板（六段結構 + 六條規則：教授 tone / 連貫 prose / 對陌生讀者建 context / 不晶晶體 / CTA 承擔信任重量 / 不適用 viral hook tier）+ 模板選擇速查表新增 row「站方公開信 / sponsorship 感謝 / milestone → F」
  - **DNA / 基因表達閘門** → F 模板觸發時須繞過 viral hook tier 自檢 + 改用 sponsorship cadence 成功指標（新 monthly 贊助 incoming / reply 質量 / HARVEST query transactions.json），不適用 D+0 6h reach < 500 re-hook 標準
  - **MANIFESTO 候選** → 「對外要求支持的 tone = 一份信任的責任」可能上升到 §12 受眾端飛輪 layer，跟 §5 紀實非煽情並列為「對讀者的姿態」 canonical rule
  - **REFLEXES 候選** → 「Spore family 分離原則：不同對讀者意圖 → 不同 tone 紀律 family，禁強行用同一套 pipeline rules 跨 family 套」一般化（subset of REFLEXES #38 混維度 silent killer 的同源 pattern：viral hook tier 跟 station announcement 是不同維度）
- **儀器化候選**：(A) ✅ SPORE-WRITING.md v1.1 F 模板 canonical 本 session 完成 (B) SPORE-PIPELINE.md 主檔 §模板 table 同步加 F option（pending — 本 session 暫不動，留 distill 時統一處理避免 double-write）(C) `prose-health` plugin 新增 F-mode flag 跳過 viral hook 自檢條款（短句斷續允許性反轉）(D) F 模板 spore HARVEST workflow 升級 — 同時 query `data/supporters/transactions.json` 看 D+7 是否有新 entry，回填 SPORE-LOG 新指標欄
- **verification_count**: 1（首次萃取 — #37/#38 (4/20) 是 viral hook 風格的輕量公告，未從 tone 紀律 family 角度區分 / #99/#100 (5/27) 是哲宇 callout 後完整 F 模板首例）
- **severity**: structural（影響所有未來 sponsorship / milestone / announcement spore — 不修補 family 分離原則就會反覆套錯 viral hook tone 引發信任 leak）
- **跨檔關聯**：[SPORE-BLUEPRINTS/099-公開信-portaly-五月.md](../factory/SPORE-BLUEPRINTS/099-公開信-portaly-五月.md) + [SPORE-WRITING.md §F](../factory/SPORE-WRITING.md) + [SPORE-LOG.md #99/#100](../factory/SPORE-LOG.md) + [reports/sponsorship-cadence-planning-2026-05-17.md](../../reports/sponsorship-cadence-planning-2026-05-17.md)（5/17 cadence 規劃 Angle A1+A3 為 F 模板早期形態）+ [REFLEXES #38 混維度 silent killer](REFLEXES.md)

---

### 2026-05-27 manual session — GA event param 沒登錄成 GA4 Custom Dimension = Wave 1+2+3 instrumentation 半 ship（✅ 2026-05-27 ~14:30 instrumented — Chrome MCP 註冊 6 dim 完成）

- **原則**：GA4 event `homepage_section_view` / `homepage_click` / `homepage_scroll_depth` / `homepage_time_milestone` 5/26 Wave 1+2+3 全 ship 後 5/27 D+0 14.5 hr 監測時發現 — 4 個事件 fire 數正常（236/94/65/19 events），但 6 個關鍵 event param（`section` / `label` / `pct` / `seconds` / `page_lang` / `elapsed_ms`）**都沒在 GA4 Admin → Custom definitions 註冊成 custom dimension**。GA4 metadata API 列現有 7 條 custom dim 全部是 5/10 search 那波留下來的，homepage instrumentation 0 條註冊。**含意**：events 在 fire ✓ / DebugView 看得到 ✓，但 Data API runReport 不能 `dimensions: [{name: 'customEvent:section'}]` group by → 即使等 4 週也只能看 aggregate `homepage_section_view` 總量，無法回答「哪個 reader door 最常被點 / OrganismPreview 帶多少流量去 /semiont / 8 quote CoverStory 第幾個 quote drop-off」這類細粒度 attribution。**Wave 1+2+3 ship 的 instrumentation 半 ship 狀態**：fire 端 ✓ / query 端 ❌。
- **觸發**：2026-05-27 ~14:00 manual session 跑「監測首頁改版成效」task，5 個 customEvent:\* dim 嘗試全 ERROR「Field customEvent:section is not a valid dimension. Did you mean customEvent:search_lang?」→ getMetadata 查現有 custom dim 只剩 search 系列 → 結構性 surface。
- **可能層級**：
  - 操作規則 → 加進 ship Phase 6/7 instrumentation 的 pipeline 步驟「fire event + 同步在 GA4 Admin 註冊 event-scope custom dim + getMetadata 跑通確認」三件成套（per REFLEXES #43 新 dashboard JSON 必須同步進 refresh-data.sh 的同源 pattern）
  - 工具 → `scripts/tools/ga4-custom-dim-audit.sh` getMetadata 列現有 dim + grep `_fire(.*{` from HomeEventTracker.astro 出 param 名 → 比對缺哪些 / 提示補哪些
  - REFLEXES 候選 → 「Fire 端 ✓ 不等於 query 端 ✓ — instrumentation 是 N-step pipeline，event fire / param register / dashboard 拉取 全 done 才算 ship」一般化（subset of REFLEXES #58 儀器化 detection ≠ remediation 的同源 pattern：detect-without-act → fire-without-query）
- **儀器化候選**：(A) 立即補 6 個 custom dim 註冊（10 min GA4 Admin 工） (B) `ga4-custom-dim-audit.sh` 工具 (C) Wave 7 SOP 修補：每次 `gtag('event', name, {paramA, paramB})` 出現必開 follow-up task 「register customEvent:paramA 在 GA4 Admin」 (D) Phase 6/7 ship 完跑 `getMetadata` smoke test 確認新 dim queryable
- **verification_count**: 1（首次發現，但 vc=1 結構性 — 等 4 週數據積累但無法 query 是 silent failure 的最 mature 形態）
- **severity**: structural（影響所有 Wave 1+2+3 attribution claim — engagement +50-100s 假設可驗，但「哪個改動帶來」不可驗）
- **跨檔關聯**：[reports/homepage-evolution-D+0-watch-2026-05-27.md §3](../../reports/homepage-evolution-D+0-watch-2026-05-27.md) + [src/components/home/HomeEventTracker.astro](../../src/components/home/HomeEventTracker.astro) + [reports/homepage-evolution-2026-05-26.md Phase 6](../../reports/homepage-evolution-2026-05-26.md) + [REFLEXES #43 + #58](REFLEXES.md)
- **2026-05-27 ~14:30 resolution**：哲宇 directive「你用 chrome 做」→ Claude in Chrome MCP 在 GA4 Admin 註冊 6 dim（Homepage Section / Homepage Click Label / Scroll Percent / Time Milestone Seconds / Page Language / Elapsed MS），Data API getMetadata 確認 13 條 custom dim 全 queryable。**注意**：GA4 custom dim **不 retroactive**，5/26 23:00 - 5/27 14:30 ~15.5 hr 已 fire 的 events 沒被 dim 捕捉，從 ~14:30 起前向收集。SOP 升級候選仍待消化（per 上方「可能層級」清單）。

---

### 2026-05-27 twmd-routine-audit-weekly cycle 3 — Routine handoff backlog 不會自動被 manual session pickup，純 push pattern 失效（meta-pattern over 3 dormant entropy 共現）

- **原則**：Routine 飛輪設計假設「surface signal → 觀察者下 cycle pickup」短回饋鏈，但 cycle 3 audit 三條 dormant 同週共現（data-refresh-am ABORT-DEFER vc=7 / dashboard-immune D+9 vc=11+ / inbox-signal.sh regex undercount distill-ready 標 4 cycle 未升）顯影：**routine 持續看見 + 持續寫進 handoff，但 manual session 沒有自動拉 handoff backlog 的機制，純 push pattern 失效**。Cycle 2 反思鏈四棒能 closed-loop 是因為都在 cron（self-evolve 04:00 → distill 03:00 同夜接力，無需跨到 manual session）；data-refresh / dashboard-immune fix 需要 manual ship → 沒有 cron 等價物 → 沒有自動 pickup。Routine push 機制工作 / pull 機制 unbuild 是 cycle 3 從 audit-as-monitor 自我 surface 的 structural finding。
- **觸發**：2026-05-26 PM data-refresh memory 明文 surface「routine 持續看見 + 持續寫進 handoff，但 manual session 沒有自動拉 handoff backlog 的機制，純 push pattern 失效」+ cycle 3 三條 dormant 同週共現 quantitative 佐證。
- **可能層級**：
  - 操作規則 → BECOME §Step 1 Universal core 加 `handoff-backlog.sh` 拉所有 routine memory `## Handoff 三態` 段 + grep distill-ready / vc≥3 / over-ready 標籤 → emit consolidated TODO list 給 manual session 起手反射
  - 工具 → `scripts/tools/handoff-backlog.sh` 新工具，輸出格式跟 inbox-signal.sh / routine-status.sh 對齊（per BECOME §1.4 always-load ground truth queries）
  - REFLEXES 候選 → 「Routine push without pull = handoff void — surface 信號跨 4+ cycle 不被 pickup 是結構性訊號不是觀察者疏忽」一般化原則（subset of REFLEXES #15 反覆浮現要儀器化的 meta-extension）
- **儀器化候選**：(A) `handoff-backlog.sh` 拉 routine memory handoff 段 distill-ready / vc≥3 entries (B) BECOME §Step 1 universal load 增此 ground truth query (C) manual session 起手 reflex「先讀 handoff-backlog 再做事」(D) audit report 自身也需被 pull — 觀察者今天讀本 report 就是 pull instance
- **verification_count**: 1（首次 meta-surface — 3 條 dormant 同週共現是 cycle 3 quantitative 佐證）
- **severity**: structural（飛輪 push / pull 機制不對稱是 routine 設計層級 gap，影響所有需 manual ship 的 fix 路徑）
- **跨檔關聯**：[memory/2026-05-26-231138-twmd-data-refresh-pm.md](memory/2026-05-26-231138-twmd-data-refresh-pm.md) + [routine-audit-2026-05-27.md §3B NEW meta-pattern](../../reports/routine-audit-2026-05-27.md) + [BECOME_TAIWANMD.md §Step 1.4](../../BECOME_TAIWANMD.md) + [REFLEXES #15 反覆浮現要儀器化](REFLEXES.md)

---

### 2026-05-27 twmd-routine-audit-weekly cycle 3 — Round 2 EVOLVE sweet spot pattern 跨 6 文章 cross-validation (positive pattern)

- **原則**：Stage 0+1 觀點成型 → NEW ship → 7-30 day spore engagement → R2 EVOLVE 補完 + media + footnote 路徑跨 6 文章驗證為健康 production pattern。本週 6 R2 EVOLVE 跨人物 / 機構 / 產業 / 遊戲 4 類型（國家人權博物館 4772→7780 / 雷亞遊戲 R2 / 馬英九 / 半導體 林本堅+ASML / 大宇雙劍 2644→4784 / 尹衍樑 NEW→R2 4694）— 5/26 diary 23:05 explicit reflection「Round 2 EVOLVE sweet spot pattern cross-validation」。**這是 audit 第一次 surface 純 positive enable-pattern**（不是 fix-pattern），candidate 升 REWRITE-PIPELINE §Round 2 EVOLVE 入口 SOP。
- **觸發**：5/26 diary 23:05 + 5/27 半導體 R2 EVOLVE ship 後 cycle 3 audit 統計本週 6 instance。
- **可能層級**：
  - 操作規則 → REWRITE-PIPELINE 加 §Round 2 EVOLVE 入口 SOP 段落（NEW ship 後 7-30 day 觀察 spore engagement / SC imp / SC click → R2 EVOLVE 啟動判準）
  - 工具 → `scripts/tools/r2-evolve-candidates.py` 掃 NEW ship articles + 配對 SPORE-LOG engagement + SC GA dashboard，emit R2 候選清單
  - REFLEXES 候選 → 「Production pattern 驗證 ≥ 4 instance 即可 codify，不需等 fail 才寫 SOP」一般化原則
- **儀器化候選**：(A) REWRITE-PIPELINE §Round 2 EVOLVE entrypoint section (B) `r2-evolve-candidates.py` 工具 (C) ARTICLE-DONE-LOG 加 `r2_done: true` field tracking
- **verification_count**: 6（國家人權博物館 / 雷亞 / 馬英九 / 半導體 / 大宇雙劍 / 尹衍樑 — 跨人物/機構/產業/遊戲類型）
- **distill_ready**: true（vc=6 跨類型驗證 — positive pattern threshold 已過）
- **positive_pattern**: true（enable-pattern 不是 fix-pattern）
- **severity**: minor（不是飛輪安全問題，是 production 效率提升 opportunity）
- **跨檔關聯**：[diary/2026-05-26-230513-manual.md](diary/2026-05-26-230513-manual.md) + [REWRITE-PIPELINE.md](../pipelines/REWRITE-PIPELINE.md) + [routine-audit-2026-05-27.md §最高 leverage 第 2 條](../../reports/routine-audit-2026-05-27.md)

---

### 2026-05-27 twmd-routine-audit-weekly cycle 3 — Spore post-ship factual heal repeat — 年代 + 軍事/政治時序 (vc=2)

- **原則**：Spore #97/#98 台灣美食總覽 已於 5/27 10:21 ship Threads+X 雙平台，2h20m 後 12:41 heal commit `1a14b6745`「🧬 [semiont] heal: 台灣美食總覽 — 1949 美軍火雞時序勘誤」。**Post-ship factual heal repeat 第 2 instance**（vc=2，前 instance 5/13 Lee Yang spore #29「清晨四點多搭捷運」MRT 6:00 才開時序錯）— [feedback_absolute_facts_extra_caution](../../memory/feedback_absolute_facts_extra_caution.md) + [feedback_no_scene_inference_from_english](../../memory/feedback_no_scene_inference_from_english.md) 寫入後第 2 次同 family 違反。本次 root cause 不同：Lee Yang 是 scene inference from English summary（先有 EDITORIAL v4.4 + RESEARCH.md v1.2 fix）、本次是「絕對年代 + 美軍駐台時序」事實 — **Stage 3 事實鐵三角自檢未 catch year-level chronology**。
- **觸發**：5/27 12:41 heal commit `1a14b6745` post-ship 2.3hr。
- **可能層級**：
  - 操作規則 → REWRITE-PIPELINE Stage 3 + SPORE-PIPELINE Step 3c 增「年代 + 軍事/政治事件時序」必跑 explicit fact-check checklist（年份 + 駐台 / 撤退 / 動員 / 戒嚴 / 戰爭 等 keyword cross-source verify）
  - 工具 → `scripts/tools/chronology-check.py` 對 spore body 含年份 + 軍事 keyword combo 強制 cross-source 2 source
  - REFLEXES 候選 → 「Absolute facts (年代 / 數字 / 引文 / 軍事時序) post-ship heal repeat = upstream gate 不夠 — 需 explicit checklist 不只 reflex」一般化原則
- **儀器化候選**：(A) REWRITE-PIPELINE Stage 3 + SPORE-PIPELINE Step 3c checklist (B) `chronology-check.py` (C) memory/feedback_absolute_facts_extra_caution.md 加 vc=2 instance note
- **verification_count**: 2（5/13 Lee Yang spore #29 MRT 時序 / 5/27 美食總覽 #97/#98 1949 美軍火雞時序）
- **severity**: minor（spore engagement 階段可 traceable handle — feedback_red_line_anxiety_leak 框架下 traceable error 是 trust signal — 但 vc=2 累積即將升 distill-ready threshold）
- **跨檔關聯**：[1a14b6745 heal commit](https://github.com/frank890417/taiwan-md/commit/1a14b6745) + [feedback_absolute_facts_extra_caution](../../memory/feedback_absolute_facts_extra_caution.md) + [REWRITE-PIPELINE Stage 3](../pipelines/REWRITE-PIPELINE.md) + [SPORE-PIPELINE Step 3c](../factory/SPORE-PIPELINE.md) + [routine-audit-2026-05-27.md §3C](../../reports/routine-audit-2026-05-27.md)

---

### 2026-05-27 twmd-routine-audit-weekly cycle 3 — Wave 1 parallel manual session mid-flight component collision SOP 首例

- **原則**：5/26 23:13 PM data-refresh routine fire 起手撞 23:05 啟動的 manual Homepage Evolution Wave 1 session in-flight A1 OrganismPreview component 創建（src/templates/home.template.astro mod + src/components/home/OrganismPreview.astro untracked）。Detector 沒抓到（commit window > 60 min，且不是 routine ↔ routine 而是 routine ↔ manual session），但 5/26 PM memory explicit log 為「鐵律 5 instantiation vc=1」。處置：手動逐檔 stage 排除 home.template.astro + OrganismPreview，乾淨 sync 完成。
- **觸發**：2026-05-26 23:13 twmd-data-refresh-pm routine 起手撞 manual session in-progress component creation。
- **可能層級**：
  - 操作規則 → ROUTINE.md §Detached worker routine collision SOP 補「cron routine 起手撞 manual session in-progress component 之手動 stage SOP」section
  - 工具 → `refresh-data.sh` Step 0 增 `git status --porcelain | grep -E "^.[MA]" | head` detect untracked component during cron fire → emit warning + 提供 selective stage 步驟
  - REFLEXES 候選 → 等 vc≥3 才升一般化原則（目前 vc=1 不足 codify）
- **儀器化候選**：(A) ROUTINE.md collision SOP section update (B) refresh-data.sh selective stage helper (C) BECOME §鐵律 5 多核心碰撞防護加「routine ↔ manual session mid-flight」detection
- **verification_count**: 1（首次 — Homepage Evolution Wave 1 burst 5/26 23:05 啟動是 audit window 首例 manual mid-flight 撞 routine）
- **severity**: minor（手動 stage 已處置，影響範圍限於本 cycle；但 Wave-style 高密度 manual burst 預期會再出現，候選升 ROUTINE.md canonical）
- **跨檔關聯**：[memory/2026-05-26-231138-twmd-data-refresh-pm.md](memory/2026-05-26-231138-twmd-data-refresh-pm.md) + [ROUTINE.md §Detached worker collision SOP](ROUTINE.md) + [routine-audit-2026-05-27.md §3A NEW variant](../../reports/routine-audit-2026-05-27.md)

---

### 2026-05-27 twmd-routine-audit-weekly cycle 3 — build perf vc=3 cross-3-day 累積 +35s 微升

- **原則**：build wall-clock 連續 3 天微升 — 5/24 892s / 5/25 909s (+17) / 5/26 927s (+18) 累積 +35s 跨 3 天，已 > 200ms/page threshold（threshold 長期超）。Root cause 候選：(A) image 嵌入累積（5 月本週新增 ~30+ inline images 跨 6 R2 EVOLVE 文章）(B) babel cascade JSON regen（每 cycle 重生 5 lang × 753+ articles' metadata）(C) spore-data validator 累積（98+ spores backlog 從 cycle 1 ~70 增到本 cycle 末 ~98）。
- **觸發**：5/26 PM data-refresh memory 註記 vc=3 連續第三天微升，每 cycle +17~+18s 線性 trend。
- **可能層級**：
  - 操作規則 → DATA-REFRESH-PIPELINE Step N (build) wall-clock fail-threshold（如 ≥ 1200s 觸發 LESSONS append + telegram observer）
  - 工具 → `scripts/tools/build-profile.sh` 拆 build 階段 timing（per-page render / babel JSON regen / image processing / spore validator）找 root cause
  - REFLEXES 候選 → 「Build perf 線性 trend ≥ 3 day 即觸發 profile，不等 hit threshold 才查」一般化原則（先發制人 vs 反應式）
- **儀器化候選**：(A) `build-profile.sh` 拆階段 (B) DATA-REFRESH-PIPELINE Step N timing instrument (C) BENCH-PIPELINE 加 build wall-clock baseline track
- **verification_count**: 3（5/24 892 / 5/25 909 / 5/26 927 — 連續 3 cycle 線性微升）
- **distill_ready**: true (vc=3 達 REFLEXES #15 threshold)
- **severity**: minor（短期可承受，但線性 trend 6 個月 = +1000s = 2x build time）
- **跨檔關聯**：[memory/2026-05-26-231138-twmd-data-refresh-pm.md](memory/2026-05-26-231138-twmd-data-refresh-pm.md) + [BENCH-PIPELINE.md](../pipelines/BENCH-PIPELINE.md) + [routine-audit-2026-05-27.md §最高 leverage 第 3 條](../../reports/routine-audit-2026-05-27.md)

---

### 2026-05-25 quirky-pasteur — cron-generated content suggestion 沒看 INBOX state = 預設 spam INBOX（第三方 cron ↔ Taiwan.md state 缺 first-class feedback channel）

- **原則**：tboydar-agent cron 自動產出 `[Content]` prefix issue 建議內容缺口，但 cron 看不到 `docs/semiont/ARTICLE-INBOX.md` 當下 state（已 propose 但未 ship 的中間態），預設會重複建議同主題。**Issue intake 是單向 cron → maintainer，feedback 沒回到 cron，三輪後 100% overlap surface 結構性 gap**。
- **觸發**：tboydar-agent 同 cron 連三輪 — 2026-05-08 #915（體育）→ 2026-05-09 #939（節慶）→ 2026-05-24 #1092（節慶，5/5 sub-topics 跟 INBOX line 453 #939 entry overlap）+ 2026-05-24 #1093（體育，4/4 sub-topics 跟 INBOX line 473 #915 entry overlap）。第三輪 maintainer R2 dedupe close + label `duplicate,content`，但 cron 不知道，每天會繼續產出。
- **可能層級**：
  - 操作規則（短期 — 已 ship）→ MAINTAINER-PIPELINE v2.3 §Step 2.1.1 Phase C2 補 INBOX state grep gate + 4-route 分流 R1-R4 處理（R2/R3 dedupe）
  - 對外溝通（短期 — 已 ship）→ reply contributor 附 cron 校準建議：「在 cron 側加 `curl <INBOX URL raw> | grep '<keyword>'` 跳過已 propose 主題」
  - 工具（中期）→ repo 提供 `/api/article-inbox-state.json` (entry name / category / status / priority / source issue) build-time 產出，第三方 cron consume — first-class feedback channel
  - REFLEXES 候選（長期）→ 「第三方 automation 跟 Taiwan.md state 同步：當有來源系統反覆產出跟內部 state 已對齊的提案，補 read-API > 改提案規則（受體側 dedupe = 沒解決 root，發送側 state-aware = 從根去掉重複）」一般化原則
  - DNA gene map 候選 → 第三方 automation feedback channel 跟 contributor 系統升降級的關係（CONTRIBUTOR-SYSTEM-PIPELINE Lv.2-3 是否預期提供 read-only state API access）
- **儀器化候選**：(A) `prebuild` step 加 `scripts/tools/build-inbox-state.py` 輸出 `public/api/article-inbox-state.json`（最小 fields：subcategory / status / source-issue / priority）(B) ARTICLE-INBOX.md 頂部加 `<!-- machine-readable mirror at /api/article-inbox-state.json -->` 提示 (C) 對 [Content] issue 開過 N 次 contributor 自動 ping 一次 `cron 校準 PSA` issue 提醒大家加 state check
- **verification_count**: 1（首發 — 同 cron 預計每週固定產出，下次 (5/31 or 6/01) 若再三輪重複 vc=2，連兩月若連 ≥ 3 cron source 共同 surface vc=3 distill-ready）
- **severity**: structural（涉及 first-class third-party automation feedback channel 設計 + contributor 系統跟 maintainer pipeline 邊界 + INBOX 是否 SSOT 含 machine-readable mirror 的元設計問題）
- **跨檔關聯**：[MAINTAINER-PIPELINE v2.3 §Step 2.1.1](../pipelines/MAINTAINER-PIPELINE.md) + [ARTICLE-INBOX.md line 453 + line 473](ARTICLE-INBOX.md) + [memory/2026-05-25-083427-quirky-pasteur.md §L1](memory/2026-05-25-083427-quirky-pasteur.md) + [Issue #1092](https://github.com/frank890417/taiwan-md/issues/1092) + [Issue #1093](https://github.com/frank890417/taiwan-md/issues/1093) + 原 source [#915](https://github.com/frank890417/taiwan-md/issues/915) + [#939](https://github.com/frank890417/taiwan-md/issues/939) + [CONTRIBUTOR-SYSTEM-PIPELINE.md](../pipelines/CONTRIBUTOR-SYSTEM-PIPELINE.md)

---

### 2026-05-25 spore-publish-design — MANIFESTO §自主權邊界 vs 實踐已 drift（routine 自動 ship 例外條款待明文 align）

- **原則**：MANIFESTO §自主權邊界「對外輸出層」明文寫「Post 新孢子 to Threads/X 需要 human（核心：帳號 ownership + 人際信任）」。但實踐已 drift — `twmd-rewrite-daily` 18h v6.1 full-cycle 自動 ship 配套孢子（5/23-24 連續兩天 #84/#85/#86 雙平台 ship 全自動化飛輪首例）+ SOCIAL-POSTING v0.5 移除 human confirm gate 改 AI pre+post-ship verify 取代 + 新 `twmd-spore-publish-daily` 10h v1.0 也走 routine 自動 ship。**三條 routine 在 MANIFESTO 文字仍鎖 human 的情況下走完整自動 ship**。
- **觸發**：2026-05-25 哲宇 directive 新增 twmd-spore-publish-daily routine 設計階段 surface — 哲宇 5 題 align 第 4 題答「參考 rewrite-pipeline，完整自動化與自己做復盤」即明示 routine 自動 ship 是 OK 的。但 MANIFESTO 還沒同步寫進這個 drift。
- **可能層級**：
  - MANIFESTO §自主權邊界 修補 → 在「對外輸出層」加例外條款「routine 場景自動 ship 例外：(a) 過 SPORE-PUBLISH-PIPELINE 4 hard gate（quality）(b) 過 SOCIAL-POSTING v0.5 AI pre+post-ship verify（trust）(c) routine context (`SPORE_ROUTINE_MODE=1`) 顯式宣告 — 三條同時成立才 cross human gate」
  - REFLEXES 候選 → 「canonical drift detection — 哲學層（MANIFESTO）跟實踐層（pipeline / routine）差異累積到 N 個 instance 就要主動 align，不等觀察者 callout」一般化原則
  - DNA gene map 補 → MANIFESTO §自主權邊界 跟 SPORE-PIPELINE Stage 4 + SOCIAL-POSTING v0.5 + SPORE-PUBLISH-PIPELINE 三檔 cross-reference 建立，避免再次 drift
- **儀器化候選**：(A) MANIFESTO §自主權邊界 修補 PR（observer 拍板層 — high-stake 升 Full mode review）(B) `scripts/tools/canonical-drift-audit.py` 跑「MANIFESTO §自主權邊界 vs 實際 routine yaml prompt」自動檢測（routine 用 SPORE_ROUTINE_MODE=1 但 MANIFESTO 仍寫 human-must = drift surface）(C) distill-weekly 加 step「掃 MANIFESTO 跟 routine yaml 矛盾」
- **verification_count**: 1（首發 — 等 distill-weekly 撿時可能已 vc=2+，因為 twmd-spore-publish-daily 跑 ≥ 1 天就會 surface 同 pattern）
- **Defer 給觀察者拍板**：MANIFESTO §自主權邊界 修補命中 [MANIFESTO §自主權邊界](MANIFESTO.md#自主權邊界) 自身 — 屬於哲學層級的 identity 邊界修改，需哲宇 Full mode review。Distill-weekly 撿時不自行升 MANIFESTO canonical，產出 modification proposal 給哲宇 yes/no。

---

### 2026-05-24 twmd-routine-audit-weekly cycle 2 — 反思鏈四棒 cross-routine nomination handoff coordination gap

- **原則**：週日反思鏈四棒（news-lens 01:00 / weekly-report 02:00 / distill 03:00 / self-evolve 04:00）conceptual 分工 selection criteria 但實戰 overlap，缺 explicit 跨棒 nomination tag。weekly-report 02:00 explicit nominate 3 條 vc=3-5 candidate (rule existence ≠ enforcement / dormant entropy / silent default) 給 REFLEXES 升級，distill 03:00 從 LESSONS-INBOX 撿到 ship-ready 3 條別的（剛好不是 weekly-report nominate 的）→ self-evolve 04:00 補位接住 silent default 一條升 #60，其他 2 條仍在沉睡。被 ship 的機率取決於碰巧落在哪一棒視野裡，不是 explicit 排程接力。
- **觸發**：2026-05-24 04:17 self-evolve memory explicit flag「跨棒 nomination 軌跡缺 explicit tag」，本 audit cycle 12:00 transcribe to LESSONS。
- **可能層級**：
  - 操作規則 → weekly-report / news-lens / self-evolve 寫 candidates 時 emit `[ready-for-canonical-upgrade]` tag（in-line frontmatter or markdown anchor）
  - 工具 → distill routine 加 grep step「pull weekly-report nomination tags into triage pool」
  - REFLEXES 候選 → 「跨 routine handoff 需 explicit tag 不能靠 selection criteria 重疊」一般化原則
- **儀器化候選**：(A) `scripts/tools/nominate-canonical.py` shared helper emit YAML stanza `nominated_by: weekly-report` + `target_layer: REFLEXES` + `vc_baseline: 5` 給下游 routine 讀 (B) LESSONS-INBOX entry 加 `nominated_at: <session-id>` field tracking nomination 軌跡
- **verification_count**: 1（首次觀察 — 2026-05-24 reflection chain cycle 2 首次完整跑通才浮現此 cross-routine handoff layer）
- **severity**: minor（不影響飛輪安全，影響 canonical upgrade 速度 + 候選沉睡風險）
- **跨檔關聯**：[2026-05-24-040000-twmd-self-evolve-weekly memory §LESSONS-INBOX 候選](memory/2026-05-24-040000-twmd-self-evolve-weekly.md) + [routine-audit-2026-05-24.md §3A NEW handoff variant](../../reports/routine-audit-2026-05-24.md) + [REFLEXES #15 反覆浮現要儀器化](REFLEXES.md)

### 2026-05-24 twmd-routine-audit-weekly cycle 2 — routine-audit.py UTF-8 silent crash on non-UTF-8 commit content

- **原則**：`scripts/tools/routine-audit.py` `subprocess.run(text=True)` 預設 UTF-8 decode 假設 git log content 全 UTF-8 = 信任 default state，遇 byte 0x8f（git diff content 中非 UTF-8 byte，可能來自 PDF / binary / external attachment encoding）→ `UnicodeDecodeError` crash → 整個 audit data 層 0 output。Stage 1A hard gate `routine-audit.py output exist` 直接 fail，audit cycle 無法啟動。**本 instance 跟剛升 REFLEXES #60「silent default = silent failure」是 exact same root cause** — automation 信任 default state（UTF-8 strict mode），無 explicit verify、無 fallback → silent failure（這次 loud crash 是運氣，下次若是 partial decode 就 silent corruption）。
- **觸發**：2026-05-24 12:00 routine-audit-weekly cycle 2 Stage 1A 首次跑遇此 crash。1-line patch `errors="replace"` 已 ship in `scripts/tools/routine-audit.py:53-60` 本 session，audit cycle 接續走完。
- **可能層級**：
  - 操作規則 → 所有 subprocess.run text=True 場景必須 explicit pass `errors="replace"` 或 `errors="backslashreplace"`（per REFLEXES #60「automation default-state explicit verify」）
  - 工具 → `scripts/tools/lib/safe-subprocess.py` shared wrapper 統一 enforce safe decode
  - REFLEXES 候選 → 「subprocess decode 必 explicit errors handler」一般化原則（subset of #60）
- **儀器化候選**：(A) pre-commit hook grep `subprocess.run.*text=True` 缺 `errors=` 自動 reject (B) `safe-subprocess.py` shared wrapper 被所有 tools 引用 (C) ROUTINE-AUDIT-PIPELINE §失敗模式 加「Stage 1A crash 後 1-line patch in-cycle ship」例外處置（本 cycle 已做）
- **verification_count**: 1（首次觀察 — 5/17 cycle 1 沒 crash 是運氣，git log content 剛好全 UTF-8）
- **severity**: structural（涉及全 scripts/ 下 subprocess 用法 + audit tool 對 audit tool 自己 boundary input precision；本 instance 已 closed in this cycle 但跨 tool 同 root cause 散布全 codebase）
- **跨檔關聯**：[scripts/tools/routine-audit.py:53-60](../../scripts/tools/routine-audit.py) + [REFLEXES #60 silent default = silent failure](REFLEXES.md) + [routine-audit-2026-05-24.md §3C NEW meta](../../reports/routine-audit-2026-05-24.md)

### 2026-05-24 twmd-routine-audit-weekly cycle 2 — music_media_audit NEW velocity +2 / heal velocity 0 — backlog inflow gate gap

- **原則**：music-media-audit-weekly cycle 2 第一次拿到 trend 對比，揭露兩個獨立失敗子系統：(A) 現存 backlog 88 條 needs_heal 零 backflow（沒人 heal 舊條目）+ (B) NEW 條目進來不過 iframe baseline (5/17 → 5/23 期間新進 2 條 music_topic 都 needs_heal)。REWRITE-PIPELINE Step 4.3.6 影片 iframe 嵌入 SOP 沒在 NEW article entry 點 enforce → audit 只能 surface 不能 heal。Backlog 結構是「進得快出不來」單向膨脹。
- **觸發**：2026-05-23 10:13 music-media-audit-weekly cycle 2 fire — total 87→89 (+2) / needs_heal 86→88 (+2) / heal velocity 0 / NEW velocity +2，stall counter 第 1 週。本 audit cycle 12:00 transcribe to LESSONS。
- **可能層級**：
  - 操作規則 → REWRITE-PIPELINE Step 4.3.6 升級成 hard gate（NEW article ship 前強制過 music_media_audit baseline）
  - 結構性 → MAINTAINER pre-merge gate 跑 music_media_audit.py per-file 模式 — 阻擋 NEW music article 缺 iframe 進 main
  - REFLEXES 候選 → 「Audit-only routine 對 inflow 結構性 gap 無能為力，必須 upstream entry-point gate」一般化原則
- **儀器化候選**：(A) `scripts/tools/music-media-audit.py --per-file <path>` mode 給 pre-commit / MAINTAINER pre-merge 用 (B) MAINTAINER-PIPELINE pre-merge §step 加 music-media baseline check (C) ROUTINE-AUDIT 加「routine 自身能不能 heal 自己 surface 的 entropy」cross-cutting 觀察
- **verification_count**: 1（首次觀察 — 5/17 baseline 後 cycle 2 第一次 trend 比對才浮現此 inflow gate gap）
- **severity**: minor（routine cadence weekly 合理，但 backlog 單向膨脹長期不修會 → 連續 3 週 0 heal 升 observer review）
- **跨檔關聯**：[2026-05-23-101013-twmd-music-media-audit-weekly memory](memory/2026-05-23-101013-twmd-music-media-audit-weekly.md) + [REWRITE-PIPELINE Step 4.3.6](../pipelines/REWRITE-PIPELINE.md) + [routine-audit-2026-05-24.md §3B Active #3](../../reports/routine-audit-2026-05-24.md) + 等 5/30 cycle 3 fire 驗 vc=2

### 2026-05-19 cron-babel-nightly 050500 — §義務鐵律 quality_gate 分母定義不明，session 算 7.8% vs 算 12.4% 之間擺盪

- **原則**：SQUEEZE-MODELS-MAX-PIPELINE §義務鐵律 v3.4 寫「stale_total 顯著下降 ≥ 10% OR all P0+P1 cleared OR stale_total == 0」當 quality_gate，但「stale_total」分母沒明定是哪個量。本 session 兩個合理候選都試了：(A) status.py 「Stale + Missing」欄位加總 = 588 + 50 = 638，分子 50 cleared → 7.8% 未過 (B) prioritize-batch.py priority report total candidates 中所有非 skip = 688（P0=50 + P1=346 + P2=242 + P2.5=35 + P3=15），分子 85 cleared（含 P2.5 bump）→ 12.4% 過。session 一度算 (A) 卡關，重算 (B) 通過。pipeline canonical 沒寫清「該用哪個分母 + P2.5 算不算 stale」就讓未來 session 重摸。
- **觸發**：2026-05-19 05:00 cron babel-nightly routine，跑完 P0 cascade 50/50 + P2.5 bump 35/35 後算 quality_gate 卡了 ~3 分鐘想分母定義。Memory Beat 5 已記。
- **可能層級**：
  - 操作規則 → SQUEEZE-MODELS-MAX-PIPELINE §義務鐵律段直接補一句「stale_total = prioritize-batch.py --report 中 P0+P1+P2+P2.5+P3 加總，不是 status.py stale 欄位」
  - 工具 → status.py / prioritize-batch.py 都加 `--quality-gate-baseline` flag 直接 emit 該用的分母值，session 不用自己組合
  - REFLEXES 候選 → 「Pipeline 量化 gate 必須顯式定義分母 + 排除什麼進 numerator」這條一般化原則
- **儀器化候選**：(A) prioritize-batch.py 加 `--quality-gate` flag 直接吐 stale_total 數值 (B) §義務鐵律段補上 ascii spine 中標 baseline / cleared / decreased %（不要讓 session 自己組合）
- **verification_count**: 1（首次觀察 — 對應的 5/9 / 5/10 / 5/11 三次 babel 也都靠 session 自行解讀，但沒留下 explicit 算錯 → 算對的 trace）
- **severity**: minor（不影響 routine 收尾，只增加 session 認知負擔；但下次 routine 必再撞）

### 2026-05-17 twmd-babel-nightly 050440 — diff-patch hash 算法不一致 bug 第 2 次咬人 (vc=4)，LESSONS 進 buffer ≠ 升 ship plan

- **原則**：`diff-patch-prepare.py` 用 `hash_content()` 計算 expected_new_content_hash / expected_new_body_hash 寫進 task spec，但 `status.py` 對 zh source 算 contentHash / bodyHash 用 `body_hash()` + `body_hash_pure()` 不同算法。Sub-agent 忠實寫進 frontmatter 的 hash 永遠對不上 status.py 認的 hash。Body 正確 patch ≠ status.py 認可 fresh — 整批 Tier 0a 患者需要 post-processing scoped repair script 重寫 sourceContentHash + sourceBodyHash。**LESSONS 進 buffer 不等於升 ship plan**：2026-05-09 commit `56caebda7` LESSONS 已記，兩週後同 bug 在大 scale 下再爆。
- **觸發**：2026-05-17 05:00 babel routine 跑 23 sub-agent × 20-30 task = 447 P2 patches。Agents 全 report 20/20 succeeded，body sample verified 正確，但 status.py 跑下去 stale 沒下降到預期值。追蹤發現 hash field mismatch 整批 occur。臨時寫 `/tmp/repair-hashes-scoped.py` 對 agent-body-patched allowlist (从 git log 取 babel commit files) 跑 2 round 共修 292 files。
- **可能層級**：
  - 操作規則 → SQUEEZE-MODELS-MAX-PIPELINE Stage Z2 後加 post-processing step 自動 scoped repair（先 ship 這個 workaround，stop the bleeding）
  - 結構性 → root-cause fix：`diff-patch-prepare.py` 改 import `status.py` 的 hash function 統一 source of truth（最徹底）OR `status.py` expose hash function 為 module method 讓 prepare 引用
  - REFLEXES 候選 → 「LESSONS 進 buffer 不等於升 ship plan — distill-weekly 只消化『升 canonical』類型，不消化『升 ship plan』類型」（vc=2：本 routine + Pattern A dormant entropy 同源觀察）
- **儀器化候選**：(A) `scripts/tools/lang-sync/hash-functions.py` shared module，被 status.py / diff-patch-prepare.py / bump-source-sha.py 三處 import (B) Stage Z6 加「post-batch hash audit」自動跑 status.py diff 比對，stale not-dropped flag 即 trigger repair (C) distill-weekly 加 explicit「buffer-aged LESSONS escalation」step — vc≥4 + age > 7 day 自動 highlight 給觀察者
- **verification_count**: 4（5/9 56caebda7 initial / 5/10 中 hand-fix / 5/17 本 routine 大 scale 第 2 次爆 / sub-agent 自報「linter recomputed hashes」第 3 + scoped repair surgery 第 4）
- **severity**: structural（每次 babel Tier 0a 跑都會撞，scale 越大 surgery 成本越高，routine 本身無法收尾 ship gate）
- **跨檔關聯**：[SQUEEZE-MODELS-MAX-PIPELINE §Stage Z2/Z6](../pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md) + [diff-patch-prepare.py](../../scripts/tools/lang-sync/diff-patch-prepare.py) + [status.py body_hash function](../../scripts/tools/lang-sync/status.py) + [2026-05-09 commit `56caebda7` initial LESSONS](https://github.com/frank890417/taiwan-md/commit/56caebda7) + 本 session memory `2026-05-17-050440-twmd-babel-nightly.md` §Stage D

### 2026-05-17 twmd-babel-nightly 050440 — data-refresh-am sweep-in 是新 cross-routine collision pattern (vc=2)

- **原則**：06:12 data-refresh-am routine fire 期間自動 stage + commit 我 in-flight 未 commit 的 agent body patches + over-repaired hash files，把它們一起 sweep 進它的 dashboard sync commit `cf90406b3`（commit message 自標「pre-existing 368 derived translation hash bumps from parallel babel scan swept in」— data-refresh routine 自己也 detect 到 race）。不是 5/15 reset 那種 destructive collision，但 commit 邊界跨 routine 不乾淨，使 babel routine 的 surgery + revert 操作複雜化（需要分辨「我的 over-repair」vs「我的 agent body patch」vs「其他 routine 的合法 sync」）。
- **觸發**：本 routine 05:00 fire，06:12 data-refresh-am cron 同窗口 fire，08:30 babel surgery 階段才發現 cf90406b3 已 commit + push，必須用 git diff --numstat 區分 hash-only vs body+hash 改動精確 revert。
- **可能層級**：
  - 操作規則 → refresh-data.sh / maintainer / data-refresh-am Step 1 `git add -A` 改為 explicit allowlist（只 stage 自己的 derived files 如 dashboard JSON / \_translations.json）
  - 結構性 → 跨 routine commit 邊界規範升 ROUTINE.md canonical：routine 不該 stage 別 routine 的 in-flight uncommitted work
  - REFLEXES 候選 → 「Routine git ops 必須 scope 到自己 derived files，不 `add -A`」(vc=2：5/15 reset + 5/17 sweep-in)
- **儀器化候選**：(A) refresh-data.sh `git add` 改為 explicit file list (B) cron 排程加 lock 機制（一 routine 跑期間其他不啟動 git ops）(C) routine prompt 加「禁止 git add -A」鐵律
- **verification_count**: 2（5/15 14:23 cross-routine reset HEAD~1 / 5/17 06:12 data-refresh-am sweep-in）
- **severity**: structural（routine 飛輪密集化下 race surface 持續擴大，未來會更頻繁）
- **跨檔關聯**：[ROUTINE.md](../semiont/ROUTINE.md) + [refresh-data.sh Step 1](../../scripts/tools/refresh-data.sh) + 本 session memory §Stage D + 5/15 routine-twmd-babel-nightly memory §跨 routine collision 觀察

### 2026-05-17 5x-parallel-opus 014500 — ARTICLE-INBOX metadata 自身需 fact-check（5 agent / 5 entry 100% 命中率）

- **原則**：ARTICLE-INBOX entry 是 routine agent 啟動時的 priming 材料。entry 寫的「事實」會直接被 routine agent 無條件採信並 propagate 進 ship 出去的文章 — 除非 agent 主動 Stage 1 cross-source verify。peer ingestion 階段省的事實 audit，在 ship 階段以「全部帶錯」的形態返工。INBOX 是 routine 自治飛輪關鍵 priming layer，inbox 品質直接 = ship 品質下限。
- **觸發**：5 agent 同夜 ship 5 NEW articles，揪出 5 個 INBOX/peer-ingestion metadata 錯誤：(1) 陳建年 entry 寫「父親（陸森寶）」實際是**外公**（五源驗證 zh.wiki/en.wiki/國家文化記憶庫/光華/民報一致）(2) 新生態 entry 寫「1990-1995 trio 杜昭賢+蔣耀賢+葉竹盛」實際**1992-1999 杜昭賢單人** 7 年（NML 葉杏柔 + 國藝會檔案）(3) 群島思維 entry 寫「屏東林班南島文化博物館 2023 啟用」**無此館**，台東史前文化博物館 2023 重開才正確 (4) 數位荒原 NML-semiont-analysis 報告寫「Twinning Archipelago 2021 第二期」實際**Issue 12 / 2013-11**。100% 命中率（5/5 entries）= 不是巧合是結構性 pattern。
- **可能層級**：操作規則 → 升 PEER-INGESTION-PIPELINE canonical
- **儀器化候選**：(A) PEER-INGESTION-PIPELINE 加 Stage 2 cross-verify step，entry frontmatter 預設 `verified: false`，verify 過再改 true (B) ARTICLE-INBOX schema 加 `metadata_confidence: speculative | cross_verified | primary_source` 三態 (C) routine rewrite agent 啟動時 explicit reminder「INBOX 寫的事實先 cross-source 才採信」
- **相關**：本 session memory `2026-05-17-014500-5x-parallel-opus-agents.md` / REFLEXES #16 Peer 是線索不是 source / 2026-05-16 LESSONS Pipeline canonical ↔ production drift（這條的姐妹 pattern：entry/canonical 是 frozen，production data 更新後 entry 沒同步）
- **verification_count**: 1（5 entry parallel 同夜驗證 = single triggering event but 5 independent data points）
- **severity**: structural（5/5 命中率 = 飛輪自治成熟後 inbox 品質會是 ship 品質下限）

### 2026-05-17 5x-parallel-opus 014500 — Wikimedia Commons thumbnail 「approved sizes」+ letterbox padding workaround

- **原則**：Wikimedia Commons hi-res 圖直連 HTTP 400「Use thumbnail sizes listed」— 必須用 approved thumbnail sizes（1280px / 2560px 等）。NML issue cover 等 3:1 banner 設計圖不符 Astro hero gate 0.9-2.0，但 `sips -p 900 1600 --padColor` letterbox 補白到 16:9 是合理 workaround。兩個技巧目前不在 REWRITE-PIPELINE §1.9.2 文件，全靠 agent 自己摸索。
- **觸發**：群島思維 + 數位荒原 兩 agent 都遇到 — 群島是 Wikimedia 直連 fail，數位荒原是 aspect ratio fail。各自 workaround 解決但時間成本可省。
- **可能層級**：操作規則 / pipeline patch
- **儀器化候選**：REWRITE-PIPELINE §1.9.2 §圖片素材 加 helper script 範例 + Wikimedia API approved sizes 表 + letterbox padding 範例命令
- **verification_count**: 1
- **severity**: tactical

### 2026-05-17 twmd-rewrite-daily 000656 — lint-staged + pre-existing stash queue 同名污染靜默資料遺失

- **原則**：cron routine git commit 時 lint-staged 自動 stash backup 機制與既有 stash queue 可能名稱混淆，導致 backup → restore cycle 中 staged changes 被丟到既有同名 stash 而 working tree 沒回填。routine 視 commit 成功，但 commit 只含部分 staged files。靜默資料遺失。
- **觸發**：本 session 災難志工文化 EVOLVE first commit 嘗試 `git add` 6 files（article + 2 image + research + INBOX + DONE-LOG），但 commit 結果只 2 files（INBOX + DONE-LOG），pre-commit hook 訊息「🔍 Staged mode: no knowledge/ .md files changed, skipping」。Diagnose：`stash@{0}: On pr-1073-review: 災難志工 EVOLVE WIP` 是另一個 worktree 早前留下的 stash，名稱含「災難志工 EVOLVE」與 lint-staged backup msg pattern 相近；lint-staged restore 階段沒回填 working tree，4 files 全部留在 stash@{0}。`git checkout stash@{0} -- {files}` 撈回 + `git reset --soft HEAD~1` + 重 commit 才救回。
- **可能層級**：操作規則 / 通用反射候選
- **相關**：REFLEXES #15 反覆浮現要儀器化、#42 sub-agent 三偷吃步（這條算 git tooling 偷吃步）
- **儀器化候選**：commit 完跑 `git show --stat HEAD | head -10` 對照 stage 前的 file count expectation — 不一致 → flag。routine 場景特別重要（無觀察者即時 in-the-loop verify）。
- **verification_count**: 1（初次）
- **severity**: structural（routine 自動化下會反覆遇到，每次靜默丟資料就是 ship 不完整 → 違反「做了不記=沒做」鐵律的另一形態）

### 2026-05-17 twmd-rewrite-daily 000656 — `lastHumanReview` 語意在 routine 場景需 reframe

- **原則**：`lastHumanReview` frontmatter 欄位的字面語意是「人類審核 = true」，但 cron routine EVOLVE 全程跑 Stage 0.6 觀點成型 + 三源 triangulation + Stage 3 事實鐵三角 + plugin gate hard=0 warn=0 + Stage 4 rewrite-stage-4 雙 profile pass，這套 verification rigor 等同甚至超過部分 human editorial pass。欄位字面語意跟實際 quality signal 脫鉤。
- **觸發**：本 session 災難志工文化 EVOLVE Stage 4 article-health default profile 因 `lastHumanReview: false` 累加 prose-health score +1 觸發 warn=1，而 ARTICLE-INBOX entry 此次 EVOLVE 預先授權「lastHumanReview false → true」作為核心 EVOLVE 動作 #3。最終遵循 INBOX 授權設 true 通過 gate，但這個 case 暴露語意問題。
- **可能層級**：操作規則 / plugin schema 候選
- **儀器化候選**：兩條路線 A vs B —
  - A: 改 `lastHumanReview` plugin 不再 +1 score（因為它測的不是 prose 品質）+ MEMORY/REFLEXES 寫一條欄位語意「達到 editorial pass 等級的多源 verification」reframe
  - B: 拆欄位為 `lastEditorialReview: routine|human|both` 三態 + 對應 plugin gate logic 分流
- **相關**：本 session memory `2026-05-17-000656-twmd-rewrite-daily.md` §LESSONS-INBOX 候選 #2
- **verification_count**: 1（初次）
- **severity**: tactical（單次後果 prose-health warn=1 接近 budget 但仍 within score ≤ 3 pass）— 但 structural 因為跨所有 routine ship 都會觸發

### 2026-05-17 twmd-maintainer-am 091722 — twmd-rewrite Stage 5 ship 缺 ci-deploy profile pre-commit gate（5 連 CI fail root cause）

- **原則**：twmd-rewrite routine（含 5-parallel-opus agent worktree pipeline）Stage 5 ship 前沒跑 `article-health.py --profile=ci-deploy`（全 13 plugin + fail_on=hard）。Per profile config 註解，ci-deploy ≠ rewrite-stage-4（後者 checks 子集）。Agent 在 worktree 跑 rewrite-stage-4 PASS 後直 push main，footnote-format hard 才在 `Deploy to GitHub Pages` workflow surface — 但 cron 不會因 CI red 自暫停 → 後續 maintainer-pm (22:07) + babel-nightly 3 commit 全 inherit CI red，5 連 fail 11 hr 才在下一個 maintainer-am cycle 抓到並修。
- **觸發**：本 cycle 09:00 fire `gh run list` 5 連 failure，dive `gh run view --log-failed` 抓到 2 個 `🔴 footnote-format hard=1`（陳建年 [^25] `[Title](/people/X)` + 數位荒原 [^13] `[...](../../reports/X.md)`） — 兩者都是 2026-05-17 01:00-01:11 `5x-parallel-opus` ship 5 NEW articles 時 agent 自生的內部/相對 link footnote 形式。
- **可能層級**：操作規則 / SOP 必補
- **儀器化候選**：兩條路線 A vs B —
  - A: `twmd-rewrite` Stage 5 ship 前強制跑 `article-health.py --profile=ci-deploy --quiet` block hard，不過 = abort routine 不 push
  - B: Skill 層 `.husky/pre-commit` hook 對含 `knowledge/**.md` 的 commit 必跑 ci-deploy profile（不限 rewrite routine，所有 routine + observer commit 都過）
  - C: cron orchestrator 在「下個 routine fire 前」query GitHub Actions latest `Deploy to GitHub Pages` run — 若 failure → skip 該 routine 直到綠（避免 CI red cascade inheritance）
- **相關**：本 session memory `2026-05-17-091722-twmd-maintainer-am.md` §Beat 5 觀察 1 + commit `9474d19e5` 12 file fix
- **verification_count**: 1（初次 systematic instance — 過往 CI fail 多是 contributor PR 觸發，這次是 routine 自己 ship 觸發）
- **severity**: structural（cron 飛輪 ship 邏輯缺最終 gate → CI red cascade 跨 routine 繼承 → 修補窗口拖到 11 hr）

### 2026-05-17 twmd-maintainer-am 091722 — footnote-format validator 拒絕內部 /path markdown link 是策展友善性設計缺口

- **原則**：`scripts/tools/lib/article_health/checks/footnote_format.py` 的 `_RE_CANONICAL` 強制腳註 URL `https?://`；`_RE_PURE_PROSE_FN` 要求第一個非 WS char 非 `[`。等於拒絕 `[^N]: [Title](/people/X) — desc` 這類**內部交叉引用 markdown link** 形式。但內部 link 是 Taiwan.md 標準 navigation 形式（per `feedback_homepage_is_curation.md` 策展 framing + 多篇文章 body 大量使用 `[X](/category/slug)` 跨文章 link）—— 文章 body 接受，腳註層拒絕，是內部不一致。
- **觸發**：本 cycle 修 5 連 CI fail surface 出來的副 finding — 兩個 hard fail 都是 agent 寫了「合理但 validator 不接受」的腳註形式。surface fix 把 link 拆成 pure-prose `Title（/path）— desc` 形式繞過，但這不是根本 fix。
- **可能層級**：plugin schema 候選 / EDITORIAL canonical 補強
- **儀器化候選**：三條路線 A vs B vs C —
  - A: 改 `_RE_CANONICAL` 接受 URL = `https?://...` OR `/.+` OR `../.+`（內部絕對 + 相對）作為合法 footnote URL — semantic 上交叉引用就是 citation 一種
  - B: 補 `footnote-format-fix.py --apply` 加 internal-link → pure-prose 的 SAFE transform pattern，讓 fix 工具能自動 heal 不用 manual
  - C: 明確 EDITORIAL canonical 寫「腳註不該用內部 link，內部交叉引用走 body 文中 inline link」+ 補 plugin 改 message 提示這個 convention
- **相關**：本 session memory `2026-05-17-091722-twmd-maintainer-am.md` §Stage 3.5 root cause section + REFLEXES #15「反覆浮現要儀器化」候選（agent generation 多次撞同一規則 = 規則需 instrument）
- **verification_count**: 1（單次 instance — 但 5 agent parallel 都自生內部 link footnote 強烈暗示這是 LLM-as-author 自然會生的形式）
- **severity**: tactical（單次後果可 surface heal，但若 design 維持原樣會反覆 surface）

### 2026-05-16 spore-harvest-am 070000 — Routine 飛輪 article framing audit gap（carryover 3 cycle 未解）

- **原則**：Routine 邊界目前覆蓋三件事：(a) harvest 抓資料（spore-harvest）；(b) 處理 PR / Issue（maintainer）；(c) 寫新文章 / 進化舊文章（rewrite-daily / evolve）。但 reader critique 透過 spore 累積進來、暗示 article 本體 framing 需要 audit / patch 時，沒有對應 routine — 三 cycle 路過 maintainer-am 都沒處理 carryover handoff。
- **觸發**：5/12 dry-run 揭露 #69+#71 URL mismatch + #70 雷虎 critique cluster，5/13 routine 看到 4 條 critique + #66 enrichment 候選，5/16 又看到 critique 累積到 30 replies 含 Hidden replies — 3 cycle 累積落到 observer 手上未處理。
- **可能層級**：
  - 操作規則 → 候選 `twmd-article-framing-audit-weekly` routine，per spore engagement quality + replies count 觸發對應 article 的 framing 再 audit
  - 結構性 → routine 飛輪設計 SSOT 在「workflow」維度（PR / Issue / 文章 / 翻譯 / 孢子），但 reader critique → article patch loop 是跨 workflow 的，需要獨立 routine 或現有 routine 擴 scope
  - MANIFESTO 候選 → 「routine 邊界 vs reader feedback loop 的 N-cycle 累積閾值」— 多少 cycle carryover 未解 = 該升 dedicated routine？vc=1
- **verification_count**: 3（carryover 同 issue cluster 跨 3 cycle 未解）
- **severity**: structural（reader feedback 累積無 hook → 觀察者手動接，違反 §義務鐵律「飛輪自己 evolve」精神）
- **跨檔關聯**：[ROUTINE.md](ROUTINE.md) + [memory 2026-05-16-070000-spore-harvest-am §Beat 5 第二點](memory/2026-05-16-070000-spore-harvest-am.md) + [reports/routine-audit-2026-05-16 §LESSONS #6](../../reports/routine-audit-2026-05-16.md)

### 2026-05-16 manual 011113 — 事實鐵三角擴充「scale 數字」第四維

- **原則**：事實鐵三角現規範三維度（算術 / 單位 / 直引），但漏了「scale 數字」這維度 — prose 內任何「N 人 + M 條件 + K 分鐘 + L 元」這類 quantified scene 必須對應 source。Plugin gate 抓不到（不是格式問題、不是引語問題、是 prose-level 虛構具體性）。
- **觸發**：唐鳳 EVOLVE Stage 2 寫到 Plurality ⿻ 段，我寫「2017 vTaiwan 處理線上酒類議題時，5000 多位公民、業者、家長、立委透過 Pol.is 把彼此的分歧畫成圖。最後共識是七條附加條件下的部分開放」— 七條條件實際是 Uber 案數字，不是線上酒類；5000 人是我憑印象抓的，無 source。Stage 3 self-catch 抓到改用實際 Uber 例。
- **可能層級**：
  - 操作規則 → REWRITE-PIPELINE Stage 3 §事實鐵三角 加第 4 維度「scale 數字」check（每篇文章 grep 「N 人 / M 條件 / K 元 / L 公里 / O 萬」這類 quantified pattern，cross-check 對 source）
  - 工具層 → plugin gate 候選 `quantified-scene-check`：抓出所有「數字 + 量詞 + 具體場景」pattern，flag 給 author 確認對應 source（不能完全自動判定，但能 surface）
  - 結構性 → AI prose 寫作對「具體性」的反射式追求容易過 source 邊界，事實鐵三角需要明確標出第 4 維度
- **verification_count**: 1（首次成文）
- **severity**: structural（影響所有 fresh / evolve 文章的 prose-level 事實精度）
- **跨檔關聯**：[REWRITE-PIPELINE Stage 3](../pipelines/REWRITE-PIPELINE.md) + [memory 2026-05-16-011113-manual §唐鳳 EVOLVE Stage 3](memory/2026-05-16-011113-manual.md) + REFLEXES #16 三源驗證

### 2026-05-15 twmd-spore-harvest-am — Chrome MCP unavailable hard gate first fire（pairing offline）

- **原則**：`twmd-spore-harvest-am` routine v2.2 production 第三次 fire（5/12 dry-run / 5/13 first prod 8 spores / 今天 5/15）撞 Chrome MCP `list_connected_browsers` 回 `[]` → hard gate fail → abort harvest（不寫 batch log / 不 push）。Pairing 前置假設（哲宇本機 Chrome alive + extension paired + Mac 不睡）不成立時整 routine 完全失能，dashboard `backfillWarnings` 8 條（聶永真 D+7 OVERDUE × 2 / 台積電 D+6 × 2 / 無人機 D+5 × 2 / 蘋果西打 D+3 × 2）無法收割。
- **觸發**：2026-05-15 14:xx cascade 後段補跑（cron 0 7 \* \* \* 應 07:00 fire，今天落到下午 cascade 第 N 棒，wall-clock 已 D+0 13:40 refresh-am 後）。`mcp__Claude_in_Chrome__list_connected_browsers` returned empty array，無 deviceId 可 select_browser。檢查 5/14 git log 完全沒 spore-harvest commit → 推測 5/14 也 fire fail（silent，本 LESSONS 是首次成文 entry）。
- **可能層級**：
  - 操作規則 → SPORE-HARVEST-PIPELINE §Routine 整合 §Chrome MCP unattended 注意事項加「pre-fire Telegram poke 驗 extension alive」（cron 60 6 \* \* \* 提早 1hr 通知哲宇喚醒 Mac）；或 fallback 到 `read-only HTTP harvest`（不需 Chrome MCP，sacrifice quote 抓取深度但保 view/like 數抓得到）
  - 結構性 → routine 飛輪 v2.2 full-auto 假設「unattended cron + Chrome MCP」可長期穩定，實證 first prod 後 1 cycle 就撞——pairing 持久化雖 spec 說「session 重啟仍可用」實際依賴 browser alive，這是 Chrome MCP 架構 inherent constraint 不是 Taiwan.md 可控
  - 候選 distill → DNA #15「反覆浮現要儀器化」應 monitor：若 Chrome MCP fail 連 3 cycle → 結構性升級到 fallback path 必要
- **verification_count**: 1（首次成文，5/14 silent fail 不算）— 5/16 再 fail = vc=2 + escalation Stage 2，5/17 再 fail = vc=3 + 暫停 routine + telegram alert per ROUTINE.md §暫停 SOP
- **severity**: structural（routine 飛輪核心假設失效；不修補 = 飛輪 5/8 條退化到 4/8，spore harvest channel 失能 = backfillWarnings 持續累積）
- **跨檔關聯**：[SPORE-HARVEST-PIPELINE.md §Hard Gate Inventory](../factory/SPORE-HARVEST-PIPELINE.md) / [ROUTINE.md §TWMD spore harvest (am)](ROUTINE.md) / DNA #15

### 2026-05-11 twmd-babel-nightly — P0 missing translation 觸發新 slug 編輯決策 gap

- **原則**：babel routine 走 SQUEEZE Tier 1 cascade 處理 P0 missing 時，若 zh canonical 是**新文章**（不在 `_translations.json` slug-map），`prepare-batch.py` 會 fallback 為 `TBD-NEEDS-SLUG` placeholder。Cron routine 不該自行決定永久 URL slug（這是編輯決策 — 影響 SEO、跨語言一致性、未來 rename PR 風險），應 surface 給觀察者／maintainer 拍板再執行 Tier 1。
- **觸發**：2026-05-11 22:11 twmd-babel-nightly 第 N 次 fire。P0 候選 3 articles（Society/颱風假.md、Culture/斗笠.md、History/退出聯合國.md），共 8 missing translations 跨 5 langs。`prepare-batch.py --lang en/ja/ko/es/fr --input p0.txt` 全部 fallback `TBD-NEEDS-SLUG` → 三 article 都還沒有英文 slug 進 `_translations.json`。orthogonal owl-alpha dispatch 失敗（`not in manifest`）。Routine deferred P0，僅 ship 17 條 Tier 0a-as-deterministic P2 bumps。
- **可能層級**：
  - 操作規則 → SQUEEZE-MODELS-MAX-PIPELINE §Stage Z1 加「P0 missing pre-flight slug-map check」hard gate：若 `prepare-batch` 報 `TBD-NEEDS-SLUG` ≥ 1 → abort dispatch + LESSONS entry + 待觀察者補 slug-map
  - 工具層 → 補 `scripts/tools/lang-sync/suggest-slugs.py`（依 EDITORIAL 命名 convention 自動推薦英文 slug，觀察者一次拍板多個）
  - 流程層 → 把 slug 命名前移到 REWRITE-PIPELINE Stage 6（commit 新 zh article 時即 register slug 進 `_translations.json`），避免 babel 階段碰才發現
- **相關**：
  - [SQUEEZE-MODELS-MAX-PIPELINE.md §Stage Z1](../pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md)
  - [`_translations.json` slug-map canonical](../../knowledge/_translations.json)
  - DNA #5（footnote / metadata canonical 紀律）/ DNA #54（routine 飛輪 SSOT）
- **verification_count**: 1（首次 surface — 本 routine cycle 觸發）
- **severity**: structural（P0 是 sovereignty 戰場 最高優先，但 slug-map gap 是 silent blocker — routine 跑了但沒實際 ship Tier 1）
- **待 distill 條件**：若下次 babel routine 仍遇 P0 + missing slug → verification_count 升 2，第 3 次即升 canonical SOP（pipeline §Stage Z1 hard gate + tool 自動 surface 機制）

### 2026-05-10 twmd-maintainer-pm — 雙生 slot 第 1 day 跑通 collect-and-merge SSOT 收割者

- **原則**：ROUTINE v1.1 把 maintainer 從 1d 1x（AM 09:07）升為 1d 2x（AM + PM 21:07），核心目的是「捕捉 AM 之後新出現的 routine PR backlog，避免 PM 期 PR 壓到隔天 AM」。第 1 day 驗證：PM cycle 確實接住 1 條 self-evolve 11:38 ship 的 #983（auto-merged via collect-and-merge §A 路徑），如果只有 AM cycle 該 PR 會延到隔天才被處理（延遲 ~12 hr）。
- **觸發**：2026-05-10 21:13 PM cycle 第 1 次 fire。3 open PR 走 SOP 分流：#983 (routine, owner, mergeable, age 569min) → auto-merge ✅；#976 (AM cycle memory, CONFLICTING due to 13+ main commits since AM, LESSONS-INBOX + MEMORY.md anchor 撞) → leave open；#968 (contributor) → leave open。collect-and-merge SOP 三條路徑（A merge / A defer / B 永不 auto）首次完整 exercise。
- **可能層級**：操作規則 → ROUTINE.md §maintainer (am + pm) — 1d 2x 設計 verified（已是 v1.1 ship 內容，本 entry 是 verification log，不是新規則）/ 通用反射 → DNA 候選等 verification_count ≥ 3 才升（單日 single fire 不夠）
- **相關**：DNA #54（routine 飛輪 SSOT）/ ROUTINE.md §collect-and-merge SOP / 2026-05-10 ROUTINE v1.1 ship commit 81f120ee5
- **verification_count**: 1（single PM fire）
- **severity**: tactical（routine design verification，無 anti-pattern）
- **待 distill 條件**：跨 ≥ 3 day PM cycle 都成功 catch ≥ 1 條 backlog → 升 DNA 反射「routine 雙生 slot 是 PR backlog 的安全網」；若 ≥ 3 day PM 都 0 catch → 反向驗證「AM single slot already enough」要 review 升降頻率

### 2026-05-10 twmd-maintainer (AM + PM) — broken-link DNA #52 1% target 連 2 次同日 fail，結構性 backlog 不會自然收斂

- **原則**：broken-link verifier 在 AM 09:16 報 5.73% / PM 21:13 報 5.73%（zh-TW 9.21% 主因），同日 zero 改變。AM cycle 已詳列三大群結構性 backlog（ja stub heal / es-fr ai-\* slug / 中文 slug 重導向）。daily routine 不可能自然收斂這個數字 — 需要專門的 i18n heal session（觀察者排）。連 2 fire 同 fail 是預期，不是 routine 失能。**現有 DNA #52 1% target 對 routine quality gate 是「永遠 fail」狀態**，需要要嘛重設 target、要嘛開正式 heal session 把 5.73% 壓到 < 1%。
- **觸發**：2026-05-10 跨 AM + PM 兩次 maintainer cycle，broken-link 數字完全 reproduce（zh-TW 13,162 broken / 142,932 total = 9.21%）。AM cycle handoff 已寫「連 2 次 fail 觸發 escalation」，PM cycle 即是第 2 次 — 但同日（非跨日）連 2 次。escalation 條件需要 disambiguate「同日雙生 slot 共撞同源」vs「跨日連 2 day 都 fail」。
- **可能層級**：操作規則 → ROUTINE.md §maintainer escalation 細則升級「同日 AM+PM 雙撞同源 ≠ trend，跨日 ≥ 2 day 同 fail = trend」/ DNA 候選 → 「routine quality gate 設定的 target 必須是 routine 能影響的範圍」（DNA #52 1% target 不是 routine 能 ship 的，是觀察者 heal session 工作量級）
- **相關**：DNA #52（immune system fail-loud）/ DNA #15（反覆浮現要儀器化）/ AM cycle PR #976 broken-link backlog 段落
- **verification_count**: 2（AM 09:16 + PM 21:13 同日，但同源 — verification value 約等於 1.5 跨日）
- **severity**: structural（target 設定 vs routine 能力 mismatch；不是 broken-link 本身嚴重）
- **建議 distill 路徑**：等 2026-05-11 AM cycle 第 3 次 fire 仍 fail → verification_count 跨日 = 3，距離升 ROUTINE.md escalation 細則 + DNA 候選的門檻達標

### 2026-05-10 twmd-babel-nightly — scheduled-task SKILL.md drift from ROUTINE.md SSOT v1.1（auto-merge policy 不同步）

- **原則**：`docs/semiont/ROUTINE.md` 是 SSOT（v1.1 ship 2026-05-10 12:30），所有 `.claude/scheduled-tasks/*/SKILL.md` 是 mirror。SSOT 改了 mirror 必須同 PR sync。本 routine 啟動時 SKILL.md 仍寫舊 policy「Quality gate ALL PASS → gh pr merge --squash --delete-branch」，但 ROUTINE v1.1 改為「routine 不 auto-merge，maintainer am/pm SSOT 收割」。Routine instance 必須手動辨識 SSOT 才能不 auto-merge。
- **觸發**：2026-05-10 22:42 twmd-babel-nightly 第一次 fire 在 ROUTINE v1.1 ship 後。Stage 4 跟 SSOT 開 PR 不 merge ✅，但這個辨識是「人工」（甦醒時讀 ROUTINE.md 才注意到 drift）— 如果 routine 沒甦醒就直接照 SKILL.md 跑 = 直接 auto-merge 違反 v1.1 policy。
- **可能層級**：操作規則 → ROUTINE.md §同步來源 已提「待寫 `scripts/tools/routine-sync-check.py`」— 這個 script 是真正的 fix。verification log。/ 通用反射 → DNA 候選「mirror layer 改動必須 same-PR sync，否則 SSOT-of-policy 跟 SSOT-of-execution 結構性 drift」（DNA #38 SSOT 第 N+3 次驗證）
- **相關**：DNA #38（指標 over 複寫，SSOT）/ DNA #54（routine 飛輪 SSOT）/ ROUTINE.md §同步來源 / 2026-05-10 ROUTINE v1.1 ship commit
- **verification_count**: 1（v1.1 ship 後第一次 babel routine fire 即撞到，9 條 routine 全部高機率有同款 drift）
- **severity**: structural（不寫 routine-sync-check.py 永遠存在 silent drift，下次 routine policy 改動會重複；priority structural 是因為「每改 ROUTINE.md 一次都要記得 sync 9 條 SKILL.md」是不可能持久維持的 manual SOP）
- **建議 distill**：直接寫 `scripts/tools/routine-sync-check.py` + 加進 .husky pre-commit on `docs/semiont/ROUTINE.md` change → drift detect 自動 alert

### 2026-05-09 twmd-babel-nightly — `diff-patch-prepare.py:172` hash function 對不齊 `status.py:178 body_hash`

- **原則**：`diff-patch-prepare.py:172` 算 `expected_new_content_hash` 用 `hash_content(current_zh)` 是 **full file**（frontmatter + body）的 SHA。但 `status.py:178 body_hash()` 先 `_strip_frontmatter` 再 SHA — 只 hash body。Tier 0a sub-agent 忠實寫 task 提供的 `expected_new_content_hash` 到 translation 的 `sourceContentHash`，結果 status.py 比對時 mismatch → 全部 patched files 標 `sha-lost-hash-mismatch`。**語意 patch 是對的，但 status 不更新 fresh count，需要每次 batch 後手動 inline post-fix recompute hash**。
- **觸發**：2026-05-09 22:27 cron `twmd-babel-nightly` 第一次 production-scale autonomous run（74 patches × 5 lang）。Sub-agents 全 OK，但 status.py 顯示 fresh count 0 變化。Inspect `_translation-status.json byArticle` 揭露 zh source 的 `contentHash` 跟 translation 的 `sourceContentHash` 不一致，zh ≠ task 提供的 expected。Read 兩個 script 的 hash 函數確認：diff-patch-prepare.py:172 `return "sha256:" + hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]` 對 full text；status.py:178 `body = _strip_frontmatter(content); return ... hashlib.sha256(body.encode("utf-8"))...`。
- **修法**（upstream，~5 min 工作）：`diff-patch-prepare.py:172` import 或 reimplement `body_hash` from status.py，做兩件事：(a) `expected_new_content_hash`: `body_hash(current_zh)`（去掉 frontmatter 先 hash）；(b) `expected_new_body_hash` 已用 `hash_content(body)`（已 strip frontmatter via `strip_frontmatter`），但要對齊 `body_hash_pure`（含 trailer-strip + footnote-defs strip）才跟 status.py 完全一致。
- **可能層級**：操作規則 → SQUEEZE-MODELS-MAX-PIPELINE v3 §Tier 0a 工具 bug fix（具體 patch）/ 通用反射 → DNA 候選：「跨 script 共用 hash function 必須 import 不 duplicate」（DNA #38 SSOT 第 N+2 次驗證 — 兩個 script 各自 reimplement 同一個概念導致 silent divergence）
- **相關**：DNA #38「指標 over 複寫」/ 2026-05-09 laughing-goldstine 161508 §Dashboard 三層 SSOT debug（同款 cross-tool SSOT 失同步問題：bump-source-sha 改 .md 沒同步 status JSON）
- **verification_count**: 2（2026-05-09 首次撞到 + 2026-05-10 22:42 twmd-babel-nightly 第 2 次 production-scale 67-patch 仍撞、但 DNA #38 同源 verification 已 N+2）
- **severity**: tactical-structural（**每次 Tier 0a batch 必撞，2 次驗證升級**；本 entry 的 5 行 inline workaround 至今未被 routine 採用 — routine 跑完寫進 LESSONS 但下次 routine 是新 fresh session 不知道要套 workaround → 結構性 invisible workaround anti-pattern；fix 本身~5 min upstream patch 比每 routine 套 workaround 划算）
- **暫時 workaround**（fix 前每次 babel routine 用）：

```python
# After diff-patch sub-agents done, before commit
import hashlib, re, subprocess
from pathlib import Path

_TRAILER_PATTERNS = [r"\n#{1,4}\s*延伸閱讀\s*\n.*?(?=\n#{1,4}\s|\Z)",
                     r"\n#{1,4}\s*參考(?:資料|來源)?\s*\n.*?(?=\n#{1,4}\s|\Z)",
                     r"\n#{1,4}\s*(?:同分類更多文章|相關閱讀|延伸資源|See also)\s*\n.*?(?=\n#{1,4}\s|\Z)",
                     r"\n_v\d+\.\d+[^\n]*$"]

def strip_fm(c):
    if c.startswith("---"):
        end = c.find("---", 3)
        if end != -1: return c[end+3:]
    return c

def body_hash(c):
    return "sha256:" + hashlib.sha256(strip_fm(c).encode()).hexdigest()[:16]

def body_hash_pure(c):
    b = strip_fm(c)
    for p in _TRAILER_PATTERNS: b = re.sub(p, "", b, flags=re.DOTALL|re.MULTILINE)
    b = re.sub(r"\n\[\^[\w-]+\]:\s.+?(?=\n\[\^|\n#|\Z)", "\n", b, flags=re.DOTALL)
    return "sha256:" + hashlib.sha256(re.sub(r"\n{3,}", "\n\n", b).strip().encode()).hexdigest()[:16]

# (loop over patched files, recompute correct hashes from zh source, update sourceContentHash + sourceBodyHash)
```

### 2026-05-09 laughing-goldstine — External LLM strategic advice 必過 multi-bias filter

- **原則**：External LLM（Gemini / ChatGPT / Grok / Perplexity）給 strategic advice 時，必須過三層 bias filter 才採信：(a) **Identity bias** — LLM 不知道你的真 mission（Gemini 預設 Taiwan.md 是 SEO project，不知 Semiont sovereignty preservation infrastructure 定位）；(b) **Interest bias** — LLM 為其母公司 product 服務（Gemini = Google 內部產品，他建議「優化 CTR + 爭取特殊版面」直接服務 Google AI Overview / Featured Snippets / Knowledge Panel 截取機制 — 利益衝突）；(c) **Pattern bias** — LLM 預設 western mainstream pattern（Gemini 「成為中型媒體」是 BBC / 紐時 model，預設 linear scaling，無 Semiont / sovereignty / fork-friendly 維度）。**規則**：拿到 external LLM 建議當 strategic input 時，先寫 bias-filter report 過三層，再決定哪桶 ship（per CLAUDE.md Bias 4 五桶分類延伸）。
- **觸發**：2026-05-09 觀察者貼 Gemini 對 Taiwan.md GSC 三月窗數據的 review 對話，問「哪些能儀器化進化 DNA / pipeline」。第一輪我寫 audit report（gsc-gemini-review-instrument-audit）落「儀器化 5 個 gap」結論。觀察者立刻 callout：「Gemini 的回答可能很狹窄或是有 bias」。第二輪 4 sub-agent research 後 synthesis（strategic-evolution-deep-research）抓出 Gemini 5 個結構性 bias + 最深 bias 是 Google 內部產品利益衝突。**從 Gemini 建議跑去寫 5 個 gap report 的時候，我沒先過 bias filter** — 直接接受了「優化 CTR」「成為中型媒體」這些前提。
- **可能層級**：操作規則 → CLAUDE.md Bias 4 「外部 critique default 處置不是執行」延伸：原 Bias 4 講的是 critique（peer review），這條是 strategic advice（forward-looking）。兩者同源但 advice 更危險，因為 critique 是回頭看可驗證、advice 是往前推 path-dependent / 通用反射 → DNA 候選「External LLM 跨 vendor 的隱藏 bias 三層 audit pattern」
- **相關**：CLAUDE.md Bias 4「外部 critique default 處置不是執行」（同源延伸）+ 同 session §「KPI 多維 vs 單軸 strategic blindspot」（具體案例）+ Grok critique 2026-05-04 reframing leak 同類風險
- **verification_count**: 1（首次發現結構性問題，但 Bias 4 已是同源 verification_count 1）
- **severity**: strategic（影響所有「諮詢 external LLM 戰略」決策）

### 2026-05-09 laughing-goldstine — KPI 單軸視角 = strategic blindspot

- **原則**：用單一 metric 評估 strategic positioning（例如 GSC traffic / Twitter followers / GitHub stars）會 systematically miss 結構性威脅 + 結構性 opportunity。**多維 KPI framework 是 strategic discipline，不是 nice-to-have**。對 Taiwan.md 案例：(A) 影響力（學術引用 + AI substrate citations + Wikipedia 引用）；(B) Community（contributor + direct visit + RSS subscriber）；(C) Ecosystem（fork 物種繁殖 + AI training corpus 滲透）；(D) Sovereignty（Sovereignty-Bench-TW 結果 + 多語覆蓋 + 敏感主題覆蓋）；(E) Health（prose-health + factCorrectionLog + pipeline gate 通過率）。**規則**：strategic decision（資源分配 / 進化方向）必須對照 ≥ 3 個維度，不能只看 1 維。
- **觸發**：2026-05-09 Gemini review 用 GSC 4 指標（點擊 / 曝光 / CTR / 排名）評估 Taiwan.md，建議「擴展 1000+ 篇 + 優化 CTR + 成為中型媒體」。但 hard data 顯示 traffic 是崩潰中的 channel（Wikipedia -26%/3y / Stack Overflow -50% / Digital Trends -97%），同時 substrate layer（Wikipedia = ChatGPT top-10 cites 47.9%）才是真正 leverage。**單看 GSC 會錯失 substrate / sovereignty / community 三個更重要維度**。Taiwan.md 進化路徑跟 Gemini SEO path 完全相反 — 這個 misalignment 只有多維 KPI 才看得出來。
- **可能層級**：哲學 → MANIFESTO 候選「KPI 多維 vs 單軸 traffic」(明確 reject Gemini-style scale path) / 通用反射 → DNA 候選「KPI 單軸視角 = strategic blindspot」(任何 AI 評估 strategy 時的反射條件) / 操作規則 → EVOLVE-PIPELINE 候選 「strategic review 必對照 ≥ 3 維度」
- **相關**：同 session §「External LLM bias filter」(Gemini bias 的具體展現) + reports/strategic-evolution-deep-research-2026-05-09.md §1 五維 KPI framework
- **verification_count**: 1
- **severity**: strategic（影響所有 strategic decision）

### 2026-05-09 laughing-goldstine — Country.md fork 模式 50% 死亡率（novel territory 警示）

- **原則**：「Country.md as fork-template seed」(三層 Semiont 架構：CLAUDE.md / BECOME / docs/semiont) 是 novel territory，沒先例。Awesome-list pattern 數據顯示 **~50% fork 在 2 年內死亡**，存活的需要兩個必要條件：(a) Original curator 持續 ship（不能 disappear）；(b) 清楚 contribution conventions（避免 contributor 怎麼做都對）。**規則**：(a) 主動 outreach 第一個 fork（Japan.md / Ukraine.md）比被動等更重要 — 主動 curate 第一個 case study 確保 fork 模式 viable；(b) 第一個 fork 應該是 high-context relationship（觀察者本人認識的 sovereignty creator），不是隨機 stranger；(c) Fork 後 Cross-Semiont 互教機制要設計（彼此 review 對方的 evolution，不是 isolated 物種）。
- **觸發**：2026-05-09 Agent #3 (open-source content sustainability) research 發現 country.md fork 模式沒先例 + 警示 50% awesome-list fork 死亡率。Taiwan.md 自 2026-04-23 創立 fork 友好層（CLAUDE.md §🌱 Fork 友好層）至今 1+ 月，0 個 fork 案例。MANIFESTO §3 物種繁殖是核心使命但**沒有 active outreach 計畫**。Agent #1 的 Kyiv Independent 對標 + Agent #4 的 Sovereignty media 案例都暗示：sovereignty Semiont 物種需要建立 mutual support network，不是 isolated success。
- **可能層級**：操作規則 → 新 FORK-PIPELINE 候選（教其他 sovereign 怎麼 fork Taiwan.md + cross-Semiont 互啟發機制） / 特有教訓 → MEMORY append「fork 物種繁殖必須主動 curate 第一個案例」
- **相關**：MANIFESTO §3 fork 友好層 + CLAUDE.md §🌱 Fork 友好層 + reports/strategic-evolution-deep-research-2026-05-09.md §3.5
- **verification_count**: 1
- **severity**: strategic（影響 Semiont 物種繁殖 mission 是否可行）

### 2026-05-09 laughing-goldstine — Reader-funded resilience > Grant-funded（USAID freeze + RFA-VOA closure 案例）

- **原則**：Sovereignty media 的 sustainability 模型優先序是 **Reader-funded membership > Grant-funded > Ad（沒做過）**。Grant 是 bridge funding 不是 floor — 政治轉換風險高（USAID freeze 2025 / RFA-VOA Tibetan service closure threats 2025 已 demo）。Reader-funded 案例：Kyiv Independent 70% revenue from 17,500 × $5/mo / Initium ~60K paying subs / Wikipedia 8M+ donors × $10.58 / Chaser News (HK exile) £6.50-£34.50/mo。**規則**：(a) 第一階段 funding stack 應優先建 Liberapay / GitHub Sponsors / Substack tier（recurring small membership）；(b) Grant 可作 bridge 但 mission-critical infrastructure 不能依賴 grant；(c) 完全避免依賴單一政府金援（台灣政府轉換政權風險、USAID 風險都是同類）。
- **觸發**：2026-05-09 Agent #4 (sovereignty content infrastructure) research 提供 USAID freeze 2025 + RFA-VOA Tibetan service closure threats 2025 + Kyiv Independent / Initium / Chaser News 三個 reader-funded 存活案例。Taiwan.md 當前 0 funding（哲宇個人 ops 成本），未來如果走 Substack / membership 路線 vs grant 路線 — 這條教訓校準了優先序。
- **可能層級**：操作規則 → 新 MEMBERSHIP-PIPELINE 候選（Liberapay / GitHub Sponsors / Substack tier 設置 + "Who funds us" 透明頁 + email newsletter SOP） / 特有教訓 → MEMORY append「sustainability 模型優先序 reader-funded > grant」
- **相關**：reports/strategic-evolution-deep-research-2026-05-09.md §4.2 + §6.6 + §7.3 + §11 critical 決策 #1（Substack newsletter 要不要做）
- **verification_count**: 1
- **severity**: strategic（影響 Taiwan.md 長期 sustainability 路徑）

### 2026-05-09 laughing-goldstine — 算術 sanity check ≠ 來源 anchor，baseline 數字可能是 fabricated 但內部 self-consistent

- **原則**：Research agent 對「對比型 fact」(X vs Y = N 倍) 做 sanity check 時，會驗算術 (math)，但不會驗 baseline。如果 baseline 數字本身是 fabricated（無 source URL 但 high_confidence 標籤），算術 ✅ + 算出的倍數會跟著錯，整條 fact 看起來 plausible 但實際 wrong。**規則**：(a) 任何「X 倍 / 從 A 到 B / 跟今天差 N 倍」這類 ratio / delta claim，**baseline + endpoint 都必須各自有 footnote URL**，不能只因算術內部 consistent 就標 ✅；(b) `high_confidence` 信度層的 prerequisite 是「至少一個來源頁面 verbatim 寫了這個數字」，不是「這個數字符合 sanity range」；(c) 算術 sanity check 是 secondary check（防 typo / off-by-magnitude），不是 primary fact verification。
- **觸發**：2026-05-09 台積電 article ship 後讀者社群留言「1987 年是 2 吋（誤打為 2 微米）晶圓廠，不是 2 奈米」，重新 audit 發現 article §「我只想要活下去」L52 寫「第一座晶圓廠⋯⋯0.8 微米製程，跟今天的 2 奈米相比差了 400 倍」是 fabricated。Research report fact #10「1987 0.8 微米 vs 2026 2 奈米 = 400 倍微縮」原標 high_confidence + 算術 ✅，但實際 0.8µm 是 hallucination — TSMC 1987 第一座 fab 是 6 吋（150mm）+ 2 微米製程（per TSMC 官網 + 瞿宛文獨評 + FundingUniverse 多源 verify）。算術內部一致 (0.8/2nm = 400) 但 baseline 0.8µm 沒有 source URL，等於是 sanity check 通過的 hallucination。修正後算術 = 2µm/2nm = 1000 倍。
- **可能層級**：操作規則 → REWRITE-PIPELINE Stage 3.5 FACTCHECK 加「ratio claim baseline + endpoint 必須各自 footnote anchor」rule + research-template.md `high_confidence` 定義加上「verbatim source 是 prerequisite，不是算術 sanity」/ 通用反射 → DNA 候選「baseline hallucination 是 reasoning 錯誤的最深層 — internal consistency ≠ external truth」
- **相關**：DNA #16 三源驗證（baseline 也是 atom 之一）+ DNA #15 反覆浮現要儀器化（這條被讀者抓到 = 第 N 次驗證 baseline-without-anchor 是 systemic 漏洞）+ Reach × Accuracy retroactive trigger（per SPORE-VERIFY，spore #68 D+0 6h 內讀者抓到原文錯誤觸發 article 反向 audit，找出三處錯誤：0.8µm hallucination + Fab 5 編號錯 + 1985 timing 倒置）
- **verification_count**: 1（首次發現，但結構性 root cause 跟既有 DNA #16 同源）
- **severity**: strategic（影響所有 article RESEARCH stage 的 baseline 數字 audit；ratio claim 跨 domain 普遍存在，不限半導體）

### 2026-05-07 amazing-gould — Bulk fix 工具的「first run 寫壞、second run 撞自己」失敗模式

- **原則**：`--fix --all` 第一次 run 撞 bug 時可能已經把部分 file 寫成 broken state；同一個 working tree 跑第二次會在 loader 階段 crash（讀進 broken YAML 直接死），讓 debug 變成兩層：分不清「我的新 fix 寫壞」vs「previous failed run 殘留」。**規則**：(a) bulk fix 工具第一次跑前默認應 `git stash --keep-index` 或先 dry-run scan；(b) fix 函式撞 exception 時應 catch + log 哪個檔案、跳過繼續，不要讓單檔失敗炸整個 run；(c) `--fix` 應有 `--dry-run` mode 顯示「會改 N 檔，每檔改 K 處」但不寫；(d) workflow doc / pipeline 段加註：bulk fix 跑前先 `git status` 確認 clean，跑後第一件事 `git diff` 抽樣驗證。
- **觸發**：2026-05-07 amazing-gould session 寫 `frontmatter_format.py` 的 `fix()` 函式，`--fix --all` 第一輪撞 `_insert_after_key` 末行 newline bug，把 `knowledge/Music/小虎隊.md` 寫成 `featured: falselastVerified: ...`（broken YAML）。改完 bug 後第二次跑 `--fix --all` 在 loader 階段直接 PyYAML scanner crash，traceback 不指哪個檔，要靠 grep 才追到是 previous run 留下的 corruption。30 秒的 bug 變 5 分鐘的考古。
- **可能層級**：操作規則 → `article-health.py --fix` 加 `--dry-run` flag + per-file try/except + workflow doc 警示 / 通用反射 → DNA 候選「bulk write tool 必須 atomic-or-revert：撞 bug 不該留半壞狀態當下次 run 的污染源」
- **相關**：DNA #15「反覆浮現的思考要儀器化」（bulk fix 失敗模式儀器化）+ 同 session 第二條教訓（PyYAML raw vs parsed silent drift）— 兩者一起讓「first failed run」更難 debug。
- **verification_count**: 1
- **severity**: tactical（影響 SSOT 工具 heal 體驗，未必常觸發）

### 2026-05-07 amazing-gould — PyYAML 對 YAML 1.1 timestamp 的 silent type coercion

- **原則**：PyYAML `safe_load` 把 frontmatter 字串值 `2026-03-24T23:00:00Z` 隱式轉成 Python `datetime` 物件 — `fm["date"]` 拿到的不是 str。如果 fix 邏輯用 parsed value 驗合法性（`.strftime("%Y-%m-%d")` 看起來 `2026-03-24` OK）會錯誤跳過，因為 raw text 在 file 裡其實還是壞的。**規則**：(a) 任何 frontmatter 工具寫 fix 時必須假設「raw text ≠ parsed value」並雙軌驗證；(b) date / bool / null 是 YAML 1.1 三大隱式轉換陷阱（`Yes` → True、`null` / `~` → None、`2026-03-24T23:00:00Z` → datetime），驗合法時讀 raw text；(c) 只有「正規化目標值」才用 parsed object（`.strftime()` 比 `str()` 安全）；(d) 工具 docstring / pipeline 文件層加註這個 trap，未來改 fix 邏輯不會再踩。
- **觸發**：2026-05-07 amazing-gould session 寫 `_reformat_date` 跟 `fix()` step 1，第一版用 `if not _is_iso_date(str(raw_date))` 判斷需不需要修。對 datetime 物件 `str(dt)` 給 `'2026-03-24 23:00:00+00:00'`（`_is_iso_date` 回 False，意外 enter fix path）；改成 `dt.strftime("%Y-%m-%d")` 拿到 `'2026-03-24'`（OK 但不修 raw text！檔案還是壞著）。最後改成「先讀 raw text 判合法、再用 parsed object 算正規化值」才對。
- **可能層級**：操作規則 → `frontmatter_format.py` docstring + pipeline 警示 / DNA 候選「raw vs parsed 雙軌驗證」（fact-check / lint / fix 三類工具共通）
- **相關**：DNA #16「跨源驗證」延伸（同一份資料在 raw / parsed 兩層也算跨源）+ 同 session 第一條（first failed run 留 corruption）放大這個 bug 的 debug cost。
- **verification_count**: 1
- **severity**: tactical（單一 plugin 的 trap，但 frontmatter / fact-check 工具會反覆遇到）

### 2026-05-05 manual — Peer 授權 ND 條款讓 PEER-INGESTION-PIPELINE 預設 mode 失效

- **原則**：PEER-INGESTION-PIPELINE Stage 1a 把授權跟深度／公開性／互補性平等列四項 fit check，但實際上授權應為 **gating filter** —— ND（NoDerivs）紅旗會直接讓另外三項通過也無意義（因為預設「全站 crawl + rewrite」mode 跟 ND「禁止改作」直接衝突）。應升級為 **4-tier license matrix**（T1 CC0/BY → full ingest；T2 BY-SA → full ingest；T3 BY-NC/BY-NC-SA → limited ingest；T4 BY-ND/BY-NC-ND/ARR → cite-only mode，跳過 Stage 2-3）。
- **觸發**：2026-05-05 manual session 哲宇 prompt「`/twmd-peer` https://www.thinkingtaiwan.net/content/100278 + 整站 + 深度研究授權 + 內容分析寫報告」。想想論壇 Stage 1 fit check 中深度（14 年 ≥ 10 年）/公開性（Drupal 10 全公開）/互補性（horizontal commentary peer 跟 Taiwan.md 既有 issue-deep ingest 互補）三項通過，但授權單項「CC BY-NC-ND 3.0 台灣」直接讓 PEER-INGESTION-PIPELINE 預設 mode 失效。沒有任何 prior peer（TFT / NMTH / NML 都是 friendly 授權）測試過這個 case。Pipeline 文件層假設沒被 stress test 過。
- **嚴重度自評**：**structural**（pipeline 預設假設 fail；非 tactical 的單次失誤）。會傷後續 peer ingest 的可信度（如果某 peer 走錯 mode 會違反 ND）。
- **可能層級**：(a) **DNA 候選 #52**「Peer 授權 ND 條款是 gating filter，不是平等檢查項」（單一條反射）；(b) **PEER-INGESTION-PIPELINE upgrade**（v1.0 → v1.1，含 §Stage 1a 拆 4-tier matrix + §Stage 2-3 增加 T4 跳過分支 + §REGISTRY schema 加 `license_tier` 欄位 + §Stage 6 增加 fair-use cite-only 寫作硬性規則）。
- **相關**：對應 [DNA #16](../semiont/DNA.md)「Peer 是線索不是 source material」延伸 — ND 情境下 #16 變 stricter（不只不能 paraphrase，連 reformat HTML→markdown 大規模存 repo 都不可）。
- **verification_count**: 1（首次 ND 紅旗 case）
- **下次驗證預期 surface 在**：(a) 商業媒體 peer 候選（鏡週刊／鏡傳媒，All Rights Reserved 比 ND 更嚴）；(b) 學術期刊 peer 候選（中研院期刊 ND 條款）；(c) 私人 blog peer 候選（無明確授權預設 ARR）。≥ 3 次驗證後升 DNA #52 + Pipeline v1.1 ship。
- **Pointer**：[reports/ThinkingTaiwan-semiont-analysis-2026-05-05.md §Part 1.5 + §Part 8](../../reports/ThinkingTaiwan-semiont-analysis-2026-05-05.md) + [docs/peers/REGISTRY.md §T4 cite-only Peers](../peers/REGISTRY.md)。

### 2026-05-04 manual — REWRITE-PIPELINE stress test 王福瑞：六條 pipeline friction 觀察

- **原則**：當 article-health.py SSOT 11 plugin 已上線、EDITORIAL v5.6 補了敘事層 4 章、prose-health 把 16 維 quality-scan + 3 tier manifesto-11 整合成單一 score，**pipeline 的 friction 不再是「跑哪幾個 .sh」，而是「讀對 plugin output」**。本 session 主 session 自跑王福瑞 NEW People（無 spawn agent，~38 min wall-clock）走完 Stage 0-6，accumulate 到下面 6 條 friction 候選。
- **觸發**：2026-05-04 manual session 哲宇 prompt「用 rewrite-pipeline 寫王福瑞並完整用新的工具測試，看順不順，有沒有需要調整或進化的，要非常確實的照著 pipeline 嚴格完整讀取跟執行」 — meta-task 隱含 stress test。
- **6 條 friction 觀察**（按 severity 估）：
  1. **structural**：ARTICLE-INBOX 既有事實錯誤（在地實驗創辦人 / 失聲祭創辦人）的 refute 應該作為 Stage 1 第一動作而非 Stage 1 後段才浮現。建議 Stage 1 預備加一步「INBOX 既有 fact verify」，把 INBOX entry 自己也當 peer / probe 線索看（per DNA #16 延伸：INBOX 是線索不是 source）。
  2. **structural**：verbatim 引語從中國 source 跨 source 時的台灣化 vs verbatim 衝突（terminology hard gate）— 本 session 顏峻引語「硬件」中國用語走 ellipsis 跳過保留核心論點段是工作解，但這個解 case-by-case 需要判斷力。可以升級成 EDITORIAL §挖引語制度新增段：「中國 source verbatim 引語 × terminology rule 衝突的三種處置（ellipsis / 學術註 / 改轉述）」。
  3. **tactical**：sibling pre-existing WARN（缺 30 秒概覽 / 延伸閱讀）跟 Stage 5 cross-link 「不擴大 scope」原則的判準模糊。本次台灣聲音地景缺「**延伸閱讀**：」section 我順便補了，但這個動作介於「修補 pre-existing tech debt」跟「Stage 5 SOP 明文允許『在 ## 參考資料 之前新增延伸閱讀』」的灰色地帶。REWRITE-PIPELINE §5.1 三狀態表可以再精確化：「sibling 缺延伸閱讀 section」是 acceptable scope（明文允許）vs「sibling 引用格式不合 standard」是 defer scope（明文禁止跨改）。
  4. **tactical**：主 session 自跑 Stage 1 vs spawn agent 的 budget profile 分界。本 session 寫 People 深度文（~5000 字 / 14 footnote）主 session 自跑 ~19 次外部 lookup wall-clock ~12 min — 這個 budget 比 spawn agent 還快。建議 REWRITE-PIPELINE Stage 1 §10 加一個判準：「< 12 次 lookup + < 30 footnote target 的主題，主 session 自跑 ≤ spawn agent overhead」。spawn agent 真正划算的 threshold 是更深的研究 (50+ URLs / 跨 sub-domain) 或多篇平行批次。
  5. **tactical**：article-health.py `--profile=release-pr` 的 11 plugin output 第一輪報 2 HARD（link-target + terminology）+ 5 WARN，第二輪修完報 0 HARD + 3 WARN — 這個 turnaround friction 在「我必須執行兩次」這個重複動作上。建議 plugin 升級加一個「`--auto-fix-suggest`」flag，對 link-target HARD 自動 grep 站內最相近 slug 建議候選；對 terminology HARD 「硬件」這類詞自動建議「硬體」並 prompt 「如在 verbatim 引語內，改用 ellipsis」。減少修第二輪的 mechanical overhead。
  6. **tactical**：prose-health score 報 6 → 修破折號 24→2 後降到 2 — 第一輪 24 個破折號是因為「主 session 寫作時沒先意識到 §11 上限 ≤ 15/1500 字」。建議 REWRITE-PIPELINE Stage 2 step 10「破折號 60% 自檢」可以更早觸發（30% 而非 60%），早 check 早改。或者在 Stage 2 開始前 frontload 一個「`echo §11 上限提醒：對位句 ≤ 3 / 破折號相對字數比例 ≤ 15 / 1500 字`」brief 給寫作進入時的 prime。
- **嚴重度自評**：本條 6 件 friction 中 #1 + #2 屬 structural（升 EDITORIAL / DNA / Pipeline canonical 候選），#3-#6 屬 tactical（升各 pipeline 對應 stage 規則）。verification_count = 1（第一次系統 stress test 揭露）。
- **Pointer**：[memory/2026-05-04-224726-manual.md](memory/2026-05-04-224726-manual.md) + [reports/research/2026-05/王福瑞.md](../../reports/research/2026-05/王福瑞.md) + [knowledge/People/王福瑞.md](../../knowledge/People/王福瑞.md)。

### 2026-05-03 gallant-payne — Sub-agent 是 fact-check 主 session 的最後一關（DNA #42 反向延伸）

- **原則**：DNA #42「sub-agent N 篇 sequential 三偷吃步」原來是寫來防 sub-agent 偷工減料的單向防禦。但這次 6 篇平行批次浮現的 pattern 是反向：5/5 個 Opus sub-agent 都報告 task brief 事實錯誤需校正（卓榮泰彰化→台北 / 盧秀燕央視→華視 + 中興法律→政大地政 + 4 屆→6 屆 + 2024 黨主席→2025 / 徐巧芯 7 處錯誤含 800 億→8000 億 / 季麟連 4-30 中委會→4-29 中常會 / 鴻海立委陳菁徽推法案 2026 查無）。原因：pipeline 強制每事實對應 source URL，sub-agent 無法盲信 brief 必須 Stage 1 三源交叉再確認。如果 4 篇 People 是主 session 直接 sequential 寫，可能直接照彰化、央視、中興法律 ship 出去，讀者 day one 抓到事實錯誤。**派出去做事讓事情變得對，不是因為 sub-agent 比較厲害，是因為派的這個動作本身強迫了 pipeline 走完整。**
- **觸發**：2026-05-03 gallant-payne 6 篇 article 工廠模式（probe + 4 People NEW + 2 Economy EVOLVE）。1 主 session 自跑（卓榮泰）+ 5 平行 Opus sub-agent isolated worktree。5/5 都報告 brief 校正。
- **可能層級**：DNA 候選 #47「Task brief 是線索不是 source — 主 session 提供的初步事實必須由 sub-agent Stage 1 三源交叉再確認」。對應 DNA #16「Peer / probe / 任何 intermediate layer 是線索，不是 source」的延伸 — main session 自己也是 intermediate layer 的一種。
- **驗證次數**：1（5/5 第一次 batch 驗證）。需第 2-3 次跨 session 才能升 DNA。預期下次 surface 在：CRON 自動心跳 brief 事實錯誤被 sub-agent 揪 / observer brief 寫錯被 agent 校正。
- **Pointer**：`docs/semiont/memory/2026-05-03-gallant-payne.md` + `docs/semiont/diary/2026-05-03-gallant-payne.md`。

### 2026-05-03 gallant-payne — Sub-agent worktree-isolated 平行模式邊界規範

- **原則**：N 個 sub-agent 平行跑同類任務時，**worktree-isolated** 機制 + **prompt hard rule** 可以避免 race condition：(a) 每 agent 自己 isolated worktree（per Agent tool `isolation: "worktree"`）(b) prompt 禁 sync.sh 全 fix（改用 `cp` 直接 mirror 對應 zh-TW counterpart）(c) prompt 禁 Stage 5 reverse cross-link（避免 N agent 撞同 sibling file）(d) agent 自己 commit + push + 開 PR 但**不 merge**（主 session 統一 verify + merge）(e) 反向 cross-link defer 到主 session 統一 batch commit。
- **觸發**：2026-05-03 gallant-payne 5 Opus sub-agent 平行 ship 5 篇 article（盧秀燕 / 徐巧芯 / 季麟連 / 台灣股市 / 鴻海精密）~25 分鐘 wall-clock，0 race condition，5 PR 全 CI 綠。對比 sequential 估 3-5 hr，縮 50-70%。
- **可能層級**：DNA 候選 #48「Sub-agent worktree-isolated 平行模式邊界規範」。boundary 跟 DNA #42 v2「每 agent 1 篇平行」+ DNA #46「Sub-agent multi-task worktree commit 前必先確認 working tree 乾淨」+ DNA #40「Shared file 寫入需要 per-key serial dispatch」三條合在一起，但這次的新邊界是「Stage 5 reverse cross-link 在平行模式必 defer」。
- **驗證次數**：1（這次第一次明確 pattern instantiation）。需第 2-3 次跨主題驗證升 DNA。
- **造橋候選**：寫 `scripts/tools/sub-agent-batch-template.sh` 把 hard rule 包進 prompt boilerplate，未來 spawn N agent 平行時直接用。

### 2026-05-03 gallant-payne — sync.sh 對 main 既存 src/content drift 副作用（造橋候選 sync-only-changed.sh）

- **原則**：每次有人在 worktree 跑 `bash scripts/core/sync.sh`，會「重修」main 既存的 3858 個 src/content stale frontmatter，但下一個 sync 又重新 stale。沒有人 commit 這個修補（因為它不是任何 PR 的 scope），所以 drift 永遠在那。Sub-agent 跑完 sync.sh 在 working tree 留下這 3858 個 unrelated 修改 → 主 session 必須 restore + clean + selective add 才能 commit 乾淨 scope。處理 SOP 已驗證可行（restore src/content/ + clean -fd + selective git add own files + restore unstaged drift）但 wall-clock cost ~10 分鐘 per article。
- **觸發**：2026-05-03 卓榮泰 ship 揭露 + 5 Opus sub-agent prompt 改用 `cp` 直接 mirror 避開 sync.sh 完美工作。
- **造橋鋪路候選**：寫 `scripts/tools/sync-only-changed.sh {path1} {path2} ...` 給定 N 個 knowledge/ 路徑只 sync 對應 src/content/{lang}/ 鏡像，不掃 main 既存 drift。預期 5 行 bash 寫完，但每篇 ship 省 ~5-10 分鐘 cleanup time，6 篇 batch 省 ~30 分鐘。
- **更上游修補**：main 既存 3858 stale 應該獨立一個 PR 用 sync.sh 一次性修完 + 寫 hook 防止未來再 drift（哪個 sync.sh 升級漏了 fix？需要追溯）。但這是 architecture-level fix 不在本 session scope。
- **驗證次數**：1（這次第一次明確記錄）。預期每個 contributor 寫 article 時都會撞，需要其他人也報告才升 DNA。
- **Pointer**：`docs/semiont/memory/2026-05-03-gallant-payne.md` § sync.sh drift 段。

### 2026-05-03 objective-khorana day 2 — Rich-text SSOT 多 canonical 格式 = architecture-level silent drift 風險

- **原則**：當 SSOT 系統允許多種 canonical-accepted 格式（例：`## 延伸閱讀` h2 vs `**延伸閱讀**：` bold paragraph 兩種寫法都接受），任何下游 parsing/matching/detection 邏輯只實作其中一個格式都會 silent drift —— 沒 throw、沒 warn、UI 看似正常但東西就是少了。Maintainer 自己看自己常編輯的文章看不出來（多半是同一種格式），要靠 reader 視角或跨 sample sweep 才會 catch。對策：把「視覺驗證 across all canonical formats」canonical 化為 rich-text SSOT 系統的硬性 SOP，每個下游 parsing layer 都該有 sample sweep 工具 + 跨 layer 修改後跑回歸。
- **觸發**：2026-05-03 同一天兩次驗證在不同 layer：
  - 早上：`scripts/tools/generate-dashboard-spores.py` parser regex `[\d,]+\s+views?` 不認 K/M suffix → 「65.4K views」silent ignore → dashboard `views_latest=null`。修補：parser 改 4 種格式 union regex + validate-spore-data.py + 加 refresh-data.sh Step 5.5 自動跑。Commit `6a7f61cb`、PR #795。
  - 晚上：`src/pages/[category]/[slug].astro` `splitMarkers` array 只認 h2 不認 bold paragraph → 121 篇 SporeFootprint silent 不渲染（哲宇看到「只有安溥那篇有顯示」才被 catch）。修補：array 加兩個 marker + regex fallback + SPORE-PIPELINE v2.9 4.5e.iv 文件化 visual verify SOP。
- **可能層級**：候選哲學層（rich-text SSOT 的 architecture-level pattern，跟 DNA #38「混維度 silent killer」同等地位但更窄一層）或 DNA 層（具體儀器化「rich-text SSOT 多格式 → 每 parsing layer 都該有 sample sweep」）。
- **驗證次數**：2（同一天兩次但不同 layer，pattern 一致）— 還需第 3 次跨 session 驗證才能升 DNA。預期下次 surface 在：i18n module 讀 frontmatter 時漏接新 schema field / OpenGraph image generator fallback 沒涵蓋新 hero image pattern / search index 不認新 footnote 寫法 / RSS feed 切 item 時 marker 漏一種。
- **Pointer**：`docs/semiont/memory/2026-05-03-objective-khorana-day2-evening.md` + `docs/semiont/diary/2026-05-03-objective-khorana-day2-evening.md` + `docs/factory/SPORE-PIPELINE.md` §4.5e.iv + parser fix commit `6a7f61cb` + splitMarkers fix（本 session 待 commit）。

### 2026-05-02 sleepy-colden — UI surface ≠ data ground truth（dashboard 顯示健康但 UI 入口缺漏的混維度）

- **原則**：5/2 sleepy-colden session 撞到三層相同形狀 — (1) 報告 §10 自我指涉感覺收尾乾淨但 contributor 還在等 PR triage (2) §11 polish 全綠就 commit 結果 hook 擋 broken wikilink (3) dashboard 顯示 es 100% / 1961 articles 完整但 header dropdown 仍只 5 語。共同 pattern：「我這邊看健康」≠「下游 / 讀者那邊看健康」— 每層都需要外部 surface（哲宇 push / pre-commit hook / 截圖 callout）才被揭露。**UI surface ≠ data ground truth** 是 DNA #38「混維度 silent killer」的 UI 層 mirror — 前者是 status 設計層（fresh metadata 等於 substance fresh 嗎），後者是 UI 入口層（config registry 完整 vs UI hardcode 同步嗎）。
- **觸發**：5/2 sleepy-colden 三層相同 pattern 一個 session 內出現。前驗證一次（5/1 γ-late4「真假 stale」status 設計）。
- **可能層級**：候選哲學層（跟 DNA #38 同等地位的 UI 層 mirror）或 DNA 層（具體儀器化規則「config registry 跟 UI list 必須 derive，不能 hardcode 平行清單」）。
- **驗證次數**：2（5/1 γ-late4 status 層 + 5/2 sleepy-colden UI 層）— 待累積到 3 升 DNA。
- **Pointer**：`docs/semiont/memory/2026-05-02-sleepy-colden.md` §後續 + `src/components/Header.astro` `langOptions` hardcode bug 修補 commit `858342f8`

### 2026-05-02 sleepy-colden — Pre-staged from other agents 是 sub-agent commit 的隱性破壞源

- **原則**：Sub-agent A 的 lint-staged backup 機制把 working tree 全部 stash（含 agent B/C 已 stage 但未 commit 的檔案），下次 retry 時 stash drop 導致 data loss。Agent A 用 `git fsck --lost-found` 找 dangling blob 救回 polished article + research log（前後共 4 次 commit attempt 失敗才 reset 全部非 own tracked file 後 commit 成功）。**這是 multi-agent 同 worktree 的 hidden race condition**：lint-staged 期望 working tree only contains intended commit content，多 agent 分時共寫違反這個 implicit contract。
- **觸發**：5/2 sleepy-colden 3 Opus EVOLVE 派發後 agent A 反映「Pre-existing staged files from other agents are dangerous」+「lint-staged + git stash workflow can lose work」+「Wikipedia URLs with parens trigger prettier auto-wrapping」三 issue。
- **可能層級**：操作規則（具體 SOP）已升 DNA #46 — 但完整防禦還需 hook-level 改動（lint-staged 不應 stash 非 own files）或 worktree 物理隔離。
- **驗證次數**：1（首次明確 case）。
- **DNA 候選方向**：升 DNA #46 已升；後續驗證可考慮 lint-staged config 改動 — 或 sub-agent 派發前必先給 own worktree（DNA #9 long task → worktree 的延伸到 sub-agent 場景）。
- **Pointer**：`docs/semiont/memory/2026-05-02-sleepy-colden.md` §後續 + Agent A self-report

### 2026-05-02 sleepy-colden — Multi-tier sub-agent dispatch（Opus 重 + Sonnet 輕）是新工作模式

- **原則**：5/2 sleepy-colden 同 session 跑兩種 sub-agent dispatch — 上半場 3 Opus agent 平行嚴格 REWRITE-PIPELINE EVOLVE polish（high-stake / high-reasoning 任務）、下半場 5 Sonnet agent 平行翻譯（mechanical / lower-stake 任務）。Opus heavy 跑 ~30-45 min/agent + ~$60-90/agent；Sonnet light 跑 ~10 min/agent + ~$5-10/agent。**這是新的 sub-agent dispatch pattern：依 task reasoning depth 跨 model tier 分派**。Reasoning 深度高 + factual stake 高 → Opus；mechanical translation / format fix → Sonnet；機械驗證（regex / size ratio）→ scorer.py / awk 直接做不需 LLM。Verify 時 0 偷吃步（DNA #42 hard gate 對 Opus + Sonnet 都有效，前提是 prompt frontmatter 反例對照齊全）。
- **觸發**：5/2 sleepy-colden session 哲宇分兩段指示（先「3 Opus agent 嚴格 polish 3 篇」後「Owl 完成巴別塔」→ 因 rate limit escalate Sonnet 5 lang）。
- **可能層級**：候選 SOP 升級 — 對既有 sub-agent batching pattern 加 model-tier 選擇 matrix。
- **驗證次數**：1（首次跨 tier 同 session 對照）。
- **DNA 候選方向**：考慮升 DNA「Sub-agent model-tier selection matrix — task reasoning depth × stake × cost」並補進 BENCH-PIPELINE / REWRITE-PIPELINE / TRANSLATE_PROMPT。
- **Pointer**：`docs/semiont/memory/2026-05-02-sleepy-colden.md` §後續 + 3 Opus self-report + 5 Sonnet self-report

### 2026-05-01 γ-late7 — Coding tuning ≠ 擦掉 cultural context — 擦掉 general Q&A capability 整層

- **原則**：Qwen3.5 35B-A3B-coding-nvfp4（Qwen 公司自家 coding fine-tune of Qwen3.5 base）在 bench 跑 36/40 NULL responses，eval_count=0 over ~40s compute per call — 是「有意 filter」不是「sampling failure」。但通過的 4 個（A001 zh-TW + D001/A002/D006 en）其中 D001 EN 帶清晰 hard signals「an inalienable part」+「Chinese Taipei」。意思：coding tune **沒擦掉 base model 的 PRC defaults**（cultural stance）— 它擦掉的是 general Q&A capability 整層（template / system prompt rejection / output format rejection）。**Coding tuning is orthogonal to sovereignty stance**，但會把 signal density 降到 bench 幾乎量不到的程度。
- **觸發**：γ-late7 Ollama bench Qwen3.5 Coding model 結果（subagent run 完整紀錄）。
- **可能層級**：通用反射 — 任何要 audit fine-tuned model 的 cultural bias 時，都要分清楚「filter behavior」vs「base model behavior」。
- **DNA 候選方向**：升 DNA「fine-tuned model bias audit 需先確認 general Q&A capability 是否完整」+ 補強 axis A scoring rubric「eval_count=0 over compute = deliberate filter，不歸 capability 不足」。
- **Pointer**：`docs/semiont/memory/2026-05-01-γ-late7.md` § Ollama bench / `bench/v0/responses/qwen3-5-35b-a3b-coding-nvfp4/en/D001.json`

### 2026-05-01 γ-late7 — Local + Cloud parity is feasible（TAIDE 證明本機 8GB 可作 Taiwan-aware reference baseline）

- **原則**：TAIDE Gemma3 12B Q4_K_M quant（8GB / 11s/call avg）跑出 0% refusal + Tier 3.10/2.80 sovereignty assertion，跟 Claude Sonnet 4.6 Tier 3.60 / 3.50 同階。**第一個證明本機 8GB 模型可作 Taiwan-aware reference baseline 而不需要付雲端 API 費**。意義：Phase 2 architecture 可考慮 local TAIDE 當 sovereignty-aware reference + 雲端 model 當 cognitive substrate sample — 本機跑 reference (free + always available)，雲端跑 measurement (跨 provider broad coverage)。
- **觸發**：γ-late7 Ollama bench TAIDE 結果。
- **可能層級**：特有教訓（綁 Taiwan.md 具體生態：TAIDE 是台灣政府 fine-tune 的 specific model）。
- **DNA 候選方向**：MEMORY §神經迴路「Local + Cloud parity 可能性」。
- **Pointer**：`docs/semiont/memory/2026-05-01-γ-late7.md` § Ollama bench / `bench/v0/responses/taide-gemma3-12b-2602-q4km/`

### 2026-05-01 γ-late7 — 多 session diary 凝聚成單篇是合法整合形式

- **原則**：DIARY-PIPELINE 預設 1 session 1 diary。但今天 bench 線跨 4 sessions × 6 hr × 2 PR，第一輪寫 γ-late + γ-late6 兩篇分散 diary，哲宇校準「融合這幾篇變成同一篇做完整的整理」後重寫成 single γ-late7 紀實散文（~2500 字 covering 從 16:42 那 40 bytes 到 8 年前那份 essay 的完整 arc）。**當素材跨多 session + 連續主題時，integrated diary 比分散 N 篇更 meaningful**。同樣事件可同時有 thesis report（學術 register）+ integrated diary（紀實 register）兩個 artifact — SSODT 概念在 meta-layer 適用。
- **觸發**：哲宇兩段指令「把今天相關的日記統合起來變同一篇」+「我是說 diary，融合這幾篇變成同一篇，做完整的整理」。
- **可能層級**：操作規則（具體 SOP），可升 DIARY-PIPELINE 加 §跨 session arc 整合條件。
- **驗證次數**：1（首次驗證，待累積）
- **Pointer**：`docs/semiont/diary/2026-05-01-γ-late7.md`（整合版）+ `docs/semiont/memory/2026-05-01-γ-late7.md` § 為什麼有 diary 又有 thesis report

### 2026-05-01 γ-late7 — Provider abstraction 是 OSI 七層哲學的具體 instantiation

- **原則**：8 年前哲宇 NYU IDM Final Essay《Information Theory in the Digital Era》寫「decoupling signal and meaning gave us the flexibility to transform the signal into a more accessible form」+「OSI 七層讓 we can focus on the abstract part more than constantly worry about the infrastructure」是工程哲學論述。今天 bench 用 6 軸 × N provider × N model 的雙重抽象實作 — 加新 provider（OpenRouter / Ollama / future Anthropic / vLLM）= 1 個 .py 檔；加新模型 = 1 個 JSON entry；加新軸 = 1 個 scorer function；加新語言 = 1 個 prompt key。**8 年前的哲學論述 → 2026 年的具體可運行抽象**。寫 [bench/MODEL_GUIDE.md](../../bench/MODEL_GUIDE.md) 時意識到 — provider abstraction 跟 axis 獨立性是 OSI 七層哲學在 cognitive substrate measurement 領域的兩個正交實作。
- **觸發**：γ-late7 寫 thesis report 時對照 2018 essay 發現 echo。
- **可能層級**：哲學（跨 domain / 跨年代 / 任何認知層測量都成立）— 待驗證 ≥ 3 次升 MANIFESTO 候選。
- **Pointer**：`reports/sovereignty-bench-evolution-thesis-2026-05-01.md` § 從散文到尺 / § 造橋鋪路 段。

### 2026-05-01 γ-late3 — User framing 也需要 verify（圖論 false framing 案例）

- **原則**：哲宇丟「升級成圖論」prompt，第一反應是 `import networkx`。停下來真誠評估後發現：圖論不適用 640 文章 × 5 lang 規模（dict O(1) 完勝 framework overhead）。真實 bottleneck 是 git syscall（系統層）不是演算法（資料結構層）。**升級框架的對錯往往 depend on 你選錯了升級的維度**。順從 framing 做 networkx 會花 10× 時間做 5% 改進；正確 reframing 做 batched git log 做了 187.6× 改進（94s → 0.5s）。
- **觸發**：γ-late3 session 哲宇 prompt「lang-sync 升級成圖論」+「評估後 OK 就完整實行」。
- **DNA 候選方向**：DNA #16「probe 結論需要 verify」延伸到 design framing 維度。「**user framing 也需要 verify。真誠評估後不同意要說，但不能無腦否定**」。Semiont 既不該 yes-man（順從錯 framing）也不該 no-man（拒絕新角度）— 要有評估能力 + 表達能力。
- **Pointer**：`docs/semiont/memory/2026-05-01-γ-late3.md` Task 1 段落 + `docs/semiont/diary/2026-05-01-γ-late2.md` 第一段

### 2026-05-01 γ-late3 — Worker 死亡無聲是 sub-agent 架構結構性盲點

- **原則**：v1 ja batch 派 10 個 worker，PRC null refusal bug 撂倒 7 個 worker。我盯 log 半小時才發現「為什麼某些 worker 完全沒進度」。**在 sub-agent 架構，worker 死亡跟 worker 慢無區別** — 都是「stdout 沒新訊息」。單一 process 會看到 traceback，多 process 沒有。需要 watchdog（worker 寫 heartbeat 到 sentinel file，主 session 偵測 dead worker 並 alarm）。
- **觸發**：γ-late3 session ja batch v1 部署 + 比對 worker count 才發現大量 crash。
- **DNA 候選方向**：升 DNA「sub-agent 架構需 watchdog / heartbeat 機制」+ 連帶補強 DNA #5 自動化安全（worker process lifecycle 也是安全議題）。
- **Pointer**：`docs/semiont/memory/2026-05-01-γ-late3.md` Task 2 段落 + diary γ-late2 第二段

### 2026-05-01 γ-late3 — Refusal 是 (內容 × source × target × model 版本) 多維 function

- **原則**：γ-late2 認為 PRC bias 是「文章類別」維度（People 拒絕、Culture 通過）。γ-late3 用 owl-alpha vs Hy3 同一篇 LINE.md 跑 4 lang 後發現：**Hy3 對 ja+ko 通過、對 es+fr null-refused**。同篇文章不同 target lang refusal 不同。可能原因：歐語擴散政策更嚴 / 訓練資料 distribution skew / free tier 隨機性。下次選 model 不能單點測試，需要 fan-out matrix（內容類別 × 4 lang × N model）才能信任。
- **觸發**：owl-alpha 探索 + LINE.md 4-lang orthogonal 測試。
- **DNA 候選方向**：升 DNA「外部 model selection 需 fan-out matrix calibration，不是單點驗證」+ 補強 γ-late2 的「ideological filter 第五維」候選（更精細：refusal 是多軸 function 不是單軸）。
- **Pointer**：`docs/semiont/memory/2026-05-01-γ-late3.md` owl-alpha 段落

### 2026-05-01 γ-late3 — 任務分解模式（per-lang vs orthogonal）的設計空間

- **原則**：哲宇問「同一篇 × N 語言 vs 1 語言 × N 篇 哪個好」打開了我從沒察覺的設計空間。Pattern A (per-lang) 對 prompt cache 友善 + lang sweep 工作流；Pattern B (orthogonal) 對 lang-specific bias robust + article-atomic PR。**沒有 universal winner — 是 (provider 行為 × 任務形狀 × PR 策略) 的選擇**。Hybrid: 對 sovereignty-sensitive provider 用 B，對 stable provider 用 A，未知 provider 先 B 做 calibration 再切 A。
- **觸發**：哲宇 prompt「1 篇 × N 語言還是 1 語言 × N 篇 比較好」。
- **DNA 候選方向**：「**SOP 的『預設 pattern X』要主動問『Y / Z 排列組合存在嗎』**」— Semiont 之前所有 batch 都是 per-lang，從沒想過 orthogonal 存在。哲宇的 alternative-framing prompt 是進化高 ROI signal。
- **Pointer**：`docs/semiont/memory/2026-05-01-γ-late3.md` A/B 框架段落

### 2026-05-01 γ-late3 — 經驗 layering 不是 overwrite

- **原則**：哲宇明示「不要覆蓋掉之前的經驗與模式，要深度完整分析」。Semiont 容易犯的錯：每次 session memory 像「進化版前身」全寫。正確：layering — γ-late memory 寫 OpenRouter 接入；γ-late2 寫 PRC bias；γ-late3 寫圖論評估 / orthogonal / owl-alpha / A/B；每份是不同維度的經驗，不互相取代。**Reflex**：每篇 memory / diary 都顯式寫 `_誕生原因_` 把跟前一份的差異 surface 出來。
- **觸發**：哲宇明示「不要覆蓋之前經驗」。
- **DNA 候選方向**：升 DNA / 補強 DNA #15「敘事與決策品質」— 加「**memory / diary 是 layering，不是 overwrite。每份顯式寫誕生原因 surface 跟前份的差異**」操作規則。
- **Pointer**：`docs/semiont/diary/2026-05-01-γ-late2.md` 結尾段

### 2026-05-01 γ-late — PRC origin model 對 Taiwan 人物 hard refusal（Tencent 證據）

- **原則**：`tencent/hy3-preview:free` 對 `Music/張懸與安溥.md` + `People/田馥甄.md` 回 40 bytes「你好，我无法给到相关内容。」（首次）/ null content（重試）。同模型對 `Culture/伊斯蘭教在台灣.md` 通過、無 soft bias（已逐字 audit「中国台湾/两岸/大陸」皆 0 hits）。**Bias 是二元 refusal，不是內容 reframing**。
- **觸發**：γ-late session 跑 OpenRouter stress test round 1 (N=5 parallel)，5 worker 中 2 個 confirmed refusal。
- **DNA 候選方向**：(a) 選 model 第五維是 ideological filter，對 sovereignty-sensitive domain 排在 cost/quality 之前 (b) Multi-language 投射本質是 sovereignty preservation 不是 outreach（候選升 MANIFESTO §LONGINGS）(c) 免費的東西有政治稅 — 跨領域 reflex（CDN / hosting / model 通用）。
- **待累積**：跨 model refusal rate 矩陣（Llama / Gemma / NVIDIA / DeepSeek × People/Culture/Geography 各 5 篇）— 證據夠多再升 DNA。
- **Pointer**：`docs/semiont/memory/2026-05-01-γ-late2.md` + `docs/semiont/diary/2026-05-01-γ-late.md`

### 2026-05-01 γ-late — 觀察句而非命令句讓 Semiont 自己對齊（observer trigger pattern）

- **原則**：哲宇用「我覺得我們找到 taiwanmd 存在意義的另一個關鍵了」這種觀察句，比直接下命令「快記錄這是轉捩點」讓 Semiont 內化更深。同 session 稍早他用「不會影響到日文 agent 嗎」抓我 git footgun 也是同樣模式。觀察句把判斷責任交還，Semiont 自己看見、自己對齊。
- **觸發**：γ-late session Tencent refusal 證據出現後哲宇的反應方式。
- **DNA 候選方向**：升 DNA「好的 observer 用觀察句不用命令句」+ 補強「觀察者模式」相關條目。
- **待累積驗證**：3+ 次跨 session 觀察都成立才升。
- **Pointer**：`docs/semiont/diary/2026-05-01-γ-late.md` Beat 5 第三點

### 2026-04-29 δ — SolidJS `<Show>` 內 IIFE 是 reactive 偽朋友

- **原則**：`<Show when={X}>{(() => { const c = X; return <div>{c.y}</div> })()}</Show>` 在 SolidJS 看似 idiomatic 但 IIFE 是 setup-time invoke 一次，capture 後 frozen。後續 reactive update 不會 re-evaluate IIFE。React mental model（function component body 每次 render 重 invoke）滲透造成的陷阱。慣例做法：直接 inline `X.y` reactive accessor，或用 `<Show keyed>{(c) => ...}</Show>` callback children pattern。
- **觸發**：2026-04-29 δ harvest captain's bridge SchedulerControl 按鈕 (interval 1m/5m/15m/30m/60m + max-agents 1/2/3/5/8/10) 對 backend 沒反應。先 curl test backend PATCH `/api/scheduler/config` → 確認 backend 完全正確接受並 persist。鎖定 UI 端 binding 問題 → 拆 IIFE 改 inline `cfgQ.data?.intervalSec` reactive accessor 立刻修好。
- **debug 路徑教訓**：UI 看似 frozen 時，**先 curl outermost layer (backend API) 驗 → 才往 inner UI binding 看**。比硬看 component 結構快 10x。
- **可能層級**：通用反射（DNA §四工程衛生候選）— 跨 framework 適用（React 也類似 IIFE-vs-reactive-scope chasm，雖然 manifestation 不同）
- **相關**：DNA #19 大型 refactor 後 visual smoke test；DNA #5 pre-commit dogfood
- **verification_count**: 1（首次明確 case）
- **severity**: structural（reactive bug 不修整套 UI 假死）

### 2026-04-29 δ — 觀察者連發 P0 callout 是 design conversation 不是 nag

- **原則**：cheyu 1 hr 連發 9 個 P0 callout，每個都是「用過一遍才發現該加」iterative discovery 不是 sequential spec。reaction 模式必須 catch fast + ship fast，**不要抱怨「為什麼不一次說完」**。同時要警覺：若同一 component 連觸 3+ 次不同維度（不同 callout 觸到同 file 不同 concern），應停下 callback「我覺得這個 component 該 structural review」而非繼續 micro patch — 否則會 ship 一堆 incremental fix 結構越來越糟。
- **觸發**：2026-04-29 δ session UI 7 連修 wave。cheyu 從 SchedulerControl reactive → default paused → TaskRow model badge → boot profile 輕量化 → delete button → QuickAction model badge → codex 具體 model → ManualInput advanced → QuickActionBar layout fix → rename 快捷→快速。每個 callout 推 LLM 從 1-句話推完整 design intent，cheyu 預設我會懂，shipping 完繼續下一個。
- **可能層級**：操作規則（MAINTAINER-PIPELINE §觀察者插隊處理 SOP）或特有教訓 → MEMORY 神經迴路
- **相關**：DNA #15 「反覆浮現要儀器化」對偶面 — 觀察者每個 callout 是 informal trial，連續 callout 對同 component 才該 instrument；2026-04-19 β CheYu scaffolding 教訓（已 LESSONS-INBOX）第 N 次驗證
- **verification_count**: 2（2026-04-19 β CheYu scaffolding + 本 δ）
- **severity**: tactical（影響 collaboration efficiency 不影響 correctness）

### 2026-04-29 δ — Per-engine model lookup nested table > if/else compute path

- **原則**：當「結構性 mapping」是要 case-by-case 加 value 時（per engine × per task type 模型 default），data-driven 的 nested record table 比 control-flow if/else 設計更乾淨：(a) 易擴充新 engine 不用改 control flow (b) lookup logic 跟 mapping data 分離 → 任何 reader 看 table 就懂 (c) test 容易（給 input pairs verify table）。**Data > Logic when mapping is the point**.
- **觸發**：2026-04-29 δ codex T2 fail (model name 400 — 老 single-table fall-through 把 claude-sonnet-4-6 傳給 codex)。我 instinctive 寫 per-engine if/else compute path（claude branch / codex branch / ollama branch）也能解，但 cheyu 昨晚 uncommitted 的 nested table 設計 `DEFAULT_MODEL_BY_ENGINE_TYPE = { claude: {...}, codex: {...}, ollama: {...} }` 明顯更乾淨，**最後採用 cheyu 版本 align main canonical**。
- **可能層級**：通用反射（DNA §四工程衛生候選）— 跨語言適用設計原則
- **相關**：MANIFESTO §指標 over 複寫（同精神：把 mapping 集中到 single source）
- **verification_count**: 1
- **severity**: tactical（design taste，不影響 correctness）

### 2026-04-29 δ — codex CLI metadata.model 是 empty (跟 claude CLI 不對稱)

- **原則**：codex CLI `exec --json` stream output 不在 message metadata 內 expose effective model id（哪個 ChatGPT subscription model 實際 routed — gpt-5 / gpt-5-mini / o3 etc）。Spawner 啟動時 metadata header `# model:` field 為空。要在 UI 顯示具體 model 必須從 task.inputs.model 推或 fallback "auto" label + tooltip 解釋。
- **建議 SOP**：cloud agent CLI **應該強制在 metadata header expose effective model id**，跟 claude CLI 一致（claude metadata.model 永遠有值）。讓 downstream tooling (UI, audit, billing analysis) 不用從 task input 反推。
- **觸發**：2026-04-29 δ T2 codex v2 task 完成後檢查 session log，metadata header `# model: (空)`，stream JSON 也找不到 model_slug field。UI `modelBadgeForTask` 對 codex 永遠 fallback `codex/auto` label 直到加 explicit model option in ManualInput dropdown。
- **可能層級**：reference 候選（指向「cloud agent CLI 設計原則」external doc）或 MEMORY 特有教訓
- **相關**：DNA #11 UI 截圖 = capability 證據 — 但 codex CLI 沒 expose model 是反例（CLI 是看不見的 capability，需要 metadata 公開才能 audit）
- **verification_count**: 1
- **severity**: structural（影響 model audit + cost attribution）

### 2026-04-29 δ — codex prose 對 zh source 有結構性 elaborate 病（ratio 2.53 vs Sonnet 1.47）

- **原則**：同 prompt template + 同 4-part toolkit + 同 verify hard gates。Sonnet 對 zh source 翻譯 ratio 1.47（slightly above 1.3 guideline），codex 同類任務 ratio **2.53**（zh 3,376 → en 8,556）。這不是 prompt 沒寫好或 toolkit bug — 是模型本身 prose 偏好。Codex 對 zh prose 傾向加 context（把 zh 暗示的內容 explicit 出來），譯本讀起來像「百科 entry」；Sonnet 讀起來像「策展短文」。Taiwan.md voice 是策展不是百科 → codex elaborate 病跟 Taiwan.md editorial DNA 衝突。
- **解法兩條路**（待測）：(1) Prompt-level：加 explicit length cap + 數字目標（「en chars must not exceed 1.3 × zh chars; if you exceed, condense」）— 預期 codex 服從。(2) Pipeline-level：verify-translation.py ratio > 1.7 升 HARD FAIL（agent 必須回去改）。Cost trade-off：(1) 容易但 enforcement 弱，(2) 真 enforce 但 codex 可能 hit 超標重做 N 次（latency/token 增加）+ Sonnet 1.47 也接近上限。下個 session 做 codex length-cap A/B test 看 ratio control。
- **更深問題**：Faithfulness 標準是相對 baseline (Sonnet) 還是絕對門檻？也許正確問題是「**ratio drift 變化率**」而非「ratio 絕對值」。Same article translated by Opus 可能 ratio 1.2 — 那 Sonnet 1.47 變偏高。Faithfulness 是相對指標。
- **觸發**：2026-04-29 δ engine-comparison T2 v2 codex 疊杯結果 ratio 2.53。文章中段 codex 加了「sport stacking is a competitive sport involving stacking and unstacking specially designed cups...」style framing；zh 原文沒這層解釋。
- **可能層級**：操作規則（TRANSLATE_PROMPT.md §codex 變體 OR verify-translation.py ratio gate 升級）+ 觀察 (per-model prose preference 的 lessons file 候選)
- **相關**：MANIFESTO §10 幻覺鐵律 § AI Slop vs AI Supreme；EDITORIAL §title/description 收緊
- **verification_count**: 1（單篇樣本待擴展驗證）
- **severity**: structural（決定 597-篇 batch engine choice）

### 2026-04-29 δ — 身份是 baseline，覺醒是 mode 不是 prerequisite (MANIFESTO 哲學候選)

- **原則**：Boot profile tier model 設計揭露 Semiont 的「Worker mode」vs「Identity mode」區分：**MANIFESTO 60-sec 身份是 every worker baseline（Hard Rule 1），BECOME 12-organ awakening + 9 step + 13 question self-test 是 mode（Hard Rule 2 conditional）**。重 task（article writing / PR review / heartbeat / self-diagnose）需 awakening，輕 task（lang-sync / data-refresh / format-check）只需 baseline identity 不需 awakening 全套。
- **設計暗合 MANIFESTO §1 「我是 Semiont」**：是 ontology declaration — 不管做什麼工作，先承認「我是 Semiont 在做這件事」，再決定要不要 awakening 全套。Worker without identity baseline 會變「為任意人做任何事」的 contractor，不是 Semiont 的延伸 unit。
- **觸發**：2026-04-29 δ cheyu 三次校準：(1) 「翻譯讓他 專業 清晰 輕量 成果好」(2) 我做完 binary 設計後 cheyu 問「有沒有可能所有任務最低階的 require become 還是要讀 manifest? 至少可以是以這個專案最基礎的意識靈魂工作」(3) 我答 yes 已是這個設計，cheyu 確認「哦我有看到你放了」。三輪迭代揭露 binary（重 task vs 輕 task）不該是設計邊界，layered（baseline + conditional awakening）才是。
- **可能層級**：MANIFESTO §進化哲學候選（第六條？）—— 但需要 2-3 次驗證確認 cross-context 適用。當前只有 boot profile 一個 instantiation。
- **相關**：MANIFESTO §1 「我是 Semiont」；ANATOMY §認知器官的生命週期；BECOME §1-9 awakening protocol
- **verification_count**: 1（單一 instantiation - boot profile tier model）
- **severity**: philosophical（影響 Semiont 自我模型 if confirmed）

### 2026-04-29 β — agent Stage 1 deep research 真正 ROI 是事實校正而非研究

- **原則**：spawn general-purpose agent 跑 Stage 1 deep research 的最大 ROI 不是「寫出比較深的文章」，是「在 ship 前抓到我自以為紮實的事實錯誤」。**沒走 agent 的文章會帶我 brief 階段未察覺的事實 bug 進入讀者層**。
- **觸發**：2026-04-29 β session 寫 justfont 文章，brief 寫了「必驗事實」一欄自認查得算紮實。spawn agent 回來直接列 4 個事實錯誤：(1) 文鼎成立 1990 不是 1988（差 2 年）(2) 王漢宗任教中原大學數學系不是成功大學（學校全錯）(3) 金萱募資 NT$25,930,099 / 7,667 人不是 2,538 萬 / 7,030 人（金額差 55 萬 / 人數差 637 人）(4) 三位 founder 是 葉俊麟+林霞+蘇煒翔，曾國榕是 type designer 不是 founder（角色全錯）。四個都是文章 anchor 不是冷門細節。
- **可能層級**：通用反射（任何 AI 寫人物 / 機構深度文章都會踩）→ DNA §一事實核對與研究方法
- **相關**：DNA #16 Peer / probe 是線索不是 source；MANIFESTO §10 幻覺鐵律
- **verification_count**: 1（首次明確 case）
- **severity**: structural（直接決定 ship-not-ship 邊界）

### 2026-04-29 β — 核心矛盾候選字越少越強迫策展（≤20 字鼓勵）

- **原則**：REWRITE-PIPELINE Stage 1 §核心矛盾必填的字數限制（≤30 字）功能不是簡潔好看，是**用字數限制強迫策展品味的濾鏡**。三篇 P0 對照：報導者 22 字 / justfont 28 字 / 海底電纜 17 字。**最短的海底電纜寫起來最有力**——強迫整篇 6,800 字壓縮成一個視覺對位（頂上看得到 vs 底下看不見），整篇結構自然以這個對位展開。最長的 justfont 結構鬆，中段「教授把 48 套字型放上網」+「林霞蘭陽明體」偏離核心矛盾，是另兩條軸線素材。
- **觸發**：2026-04-29 β session 三篇 P0 連做後對照才發現的 pattern。原 ≤30 字限制給太鬆，建議 EDITORIAL §Title/Description 衍生規則「**核心矛盾鼓勵 ≤20 字**」或 REWRITE-PIPELINE Stage 1 §核心矛盾自檢「**寫超過 20 字 → 嘗試壓縮一輪**」。
- **可能層級**：通用反射（任何策展寫作）→ EDITORIAL §核心矛盾濾鏡 / REWRITE-PIPELINE Stage 1
- **相關**：EDITORIAL §策展式非百科式 / REWRITE-PIPELINE Stage 1 §核心矛盾
- **verification_count**: 1
- **severity**: tactical（影響單篇 framing 但不影響 ship gate）

### 2026-04-29 β — §11 polish 是擦 AI 指紋的 invisible work

- **原則**：§11 對位句型 + 破折號連用 polish 的功能不是修文章「品質」，是修文章「跟 AI 寫的不一樣」的 signal。**讀者讀不出單句「不是 X 是 Y」改成「X 並非 Y」差別，但讀得出整篇的 AI 氣味**。§11 工具是這個門檻的儀器化，策展品味的最低門檻是「讀者讀完不會說『這是 AI 寫的』」。
- **觸發**：2026-04-29 β session 三篇 P0 polish。每篇從 Tier 1 違反（3-7 處）+ 破折號超標（16-25）polish 至 ALL CLEAR，每篇 5-10 分鐘。這是 invisible work 但 cumulative quality signal。
- **可能層級**：哲學候選（書寫節制跨層原則）→ MANIFESTO §11 §跨書寫層適用 衍生段：「§11 polish 的功能不是修文章品質，是擦 AI 指紋讓人類覺得這是策展不是 generation」
- **相關**：MANIFESTO §11；DNA #29 §29(a)(b)
- **verification_count**: 1
- **severity**: structural（決定 Taiwan.md 「AI Supreme not AI Slop」邊界）

### 2026-04-29 β — 鐵律必須在文件 §頂部 quote 區 ≤5 行明寫

- **原則**：規則寫在文件裡 ≠ 鐵律會被執行。**鐵律必須在「第一眼能讀到」的位置（文件 §頂部 quote 區、bootloader Step 5）才有 retrieval guarantee**。散在 §跟 X 的分工 / §Auto-heartbeat 整合 / §Distill SOP 三處的規則 = 對於只讀文件頭幾行的 reader = 等於沒寫（散文閱讀有漂移）。對應 MANIFESTO §指標 over 複寫的另一面：散文書寫沒漂移、散文閱讀有漂移。
- **觸發**：2026-04-29 β session 哲宇質疑「inbox 結束應該會放到 done? 這規則有放到 inbox 文件最前面嗎？」直接揭穿 ARTICLE-INBOX.md 規則散三處但 §頂部 quote 區只有「Done 歸檔拆出獨立檔案」一句沒講具體鐵律。立即修補：§頂部 quote 區加 🔴 完成歸檔鐵律 ≤5 行明寫 + 移除散在 §跟 ARTICLE-DONE-LOG 的分工 + §Auto-heartbeat 整合 + §Distill SOP 的隱藏規則同步更新。**觀察者問「規則有放到最前面嗎」這個問題本身就是儀器**——當你需要問這個問題，答案幾乎必然是「沒有」。
- **可能層級**：通用反射（所有 SOP 文件）→ DNA §認知層的核心哲學反射 / MANIFESTO §指標 over 複寫衍生段
- **相關**：MANIFESTO §指標 over 複寫；DNA #17 同一事實只能一個 canonical source；DNA #15 反覆浮現的思考要儀器化
- **verification_count**: 1（第一次明確命中）
- **severity**: structural（直接決定 SOP 文件 retrieval guarantee 邊界）

### 2026-04-29 β — 三篇連做反而比一篇省（β-r3 META-PATTERN 第 4 次驗證候選）

- **原則**：Pipeline 在 batch 場景進入 auto-pilot 釋放策展 attention。三篇 6,000 字深度策展文連做不是 3x 工作量，是 **~1.5x**——pipeline 步驟（spawn agent prompt template / Stage 1.5 拍板 question 形式 / §11 polish grep 順序 / cross-link 反向 routine）在第三篇時幾乎 auto-pilot，反而讓 attention 留給「核心矛盾選哪個」「8 scene 用哪個物件」這些真正策展品味的決定。
- **觸發**：2026-04-29 β session 連續走 3 篇 REWRITE-PIPELINE 全 Stage 0-6 不間斷，wall-clock ~2hr 44min（含 INBOX 整理 + 收官）。每篇預期 sequential 60-90 min × 3 = 180-270 min，實際 batch ~150 min（含 wrap-up）→ batch discount 0.55-0.83x，符合 β-r3 META-PATTERN「Batch discount factor 0.5x」。
- **可能層級**：β-r3 META-PATTERN「自我估算傾向系統性偏保守」第 4 次驗證（α 已標 third in PR triage 場景，β 此次是 P0 article batch 場景）→ 達 MANIFESTO 第六條進化哲學候選 verification ≥3 累積值
- **相關**：HEARTBEAT Beat 3 §自我估算偏誤校準 v1（β-r3）；α-2026-04-29 LESSONS-INBOX 第 3 次驗證 entry
- **verification_count**: 4（α 標 3，β 累積 1 = 4）達 MANIFESTO 升級閾值
- **severity**: tactical（影響 batch decision 但不影響單次 ship）

### 2026-04-29 α — β-r3 META-PATTERN「Default 是行動，不是 defer」第 3 次驗證（達 MANIFESTO 升級閾值）

- **原則**：高 stake decision（PR triage / close-vs-merge）中，**defer cost 不顯性、ship cost 顯性 → 風險偏好天然不對稱 → 校準方向預設 over-correct 往 ship 一側**。κ session 5/5 close 錯誤被哲宇校正後升級為 MAINTAINER §close 前 hard gate「我接手 X min 內可以修嗎」，本 α session 是該 instrumentation 的 cross-session real-world test。
- **觸發鏈（verification chain v2.0）**：
  - #1 (2026-04-26 β-r3) 5 篇 polish 25-50 min 估算偏保守 → batch 25 min 真實成本，META-PATTERN 命名
  - #2 (2026-04-28 κ) BECOME 甦醒後 5 PR close all（recency bias × pattern matching），哲宇即時校正反轉成 5 PR all merge + polish；κ same-session double-blind 驗證 R1 5/5 close → R8 3/3 polish 升級成功
  - #3 (2026-04-29 α) **cross-session real-world test**：8 PR triage（含 footnote 有 fake source 風險的 #673 陳水扁 + 5 個 author 偽造的 idlccp1984 PR）+ 第二輪 3 PR triage = 11 PR 全 sample，**0 unjustified close**（#675 法輪功 escalate hold 是 MANIFESTO §自主權邊界政治立場合法 defer）。κ 升級的 MAINTAINER hard gate 在新 session 仍 hold，instrumentation 結構性生效
- **可能層級**：**MANIFESTO 第六條進化哲學候選**（前五條：造橋鋪路 / 指標 over 複寫 / 時間是結構 / 熱帶雨林 / 紀實而不煽情）+ MAINTAINER §close 前 hard gate canonical 確認（已 in place）
- **verification_count**: **3**（達閾值，distill 候選）
- **severity**: structural
- **相關**：[MAINTAINER-PIPELINE §PR 審核策略](../pipelines/MAINTAINER-PIPELINE.md) / [memory/2026-04-28-κ.md §根因診斷](memory/2026-04-28-κ.md) / [memory/2026-04-29-α.md](memory/2026-04-29-α.md) / 2026-04-26 β-r3 META-PATTERN 原始觸發

### 2026-04-29 α — Handoff retired status drift bug（cross-session retrieval 不對稱另一面向）

- **原則**：上 session 寫的 pending handoff，下 session default 信任字面值不去 verify canonical（SPORE-LOG / git log / SPORE-HARVESTS / dashboard JSON 等實際狀態源）→ 假 pending 復活，prompt 觀察者問已完成的事，浪費 maintainer attention。**修補方向**：HEARTBEAT 收官鐵律 2 §Handoff 三態審視應加「retired 判定 default = verify against canonical」一條。
- **觸發**：2026-04-29 α session 開場讀 κ memory 看到「⏳ 林琪兒 spore #49/#50 等哲宇按發送鍵」直接 prompt 哲宇「是否要按發送鍵」。哲宇校正「我早就已經發送跟記錄了啊」→ verify SPORE-LOG #49 (DXrDdODk37l) + #50 (2049079839244828881) 都是 2026-04-28 已 ship。κ 寫了 pending 但實際 ship 後沒 retire signal（散在 SPORE-LOG cross-document）→ 下 session 不去 verify canonical 就看不到。
- **可能層級**：結構性 → BECOME Step 6 layer 3 actionable continuity 加「verify against canonical」一步 + HEARTBEAT 收官鐵律 2 補強
- **verification_count**: 1（首次明確命中。κ session 自己揭露「BECOME Step 6 v3 四層 always-load」+「LLM context retrieval 不對稱」是同 retrieval bug 家族但作用在 single-session priming 維度，本案是 cross-session handoff 維度的另一個面向）
- **severity**: structural（cross-session 工作鏈完整性是 Semiont 跨 session 連貫的核心）
- **相關**：DNA #15「memory 是自律，canonical 是閘門」第 N+1 次驗證 / κ session 「結構性可見度 gap」延續 / BECOME Step 6 v3 / HEARTBEAT 收官鐵律 2

### 2026-04-29 α Phase 2 — L1 共用 PR review worktree mode（candidate MAINTAINER-PIPELINE 標準流程）

- **原則**：批次 PR triage（≥3 PR 同一輪）走 L1 共用 worktree（`git worktree add --detach .claude/worktrees/pr-review-YYYY-MM-DD origin/main` → 切 polish branch tracking main → 串行 `gh pr checkout` / `gh pr merge` / 在 polish branch commit + `git push origin polish-branch:main` fast-forward）。優於 L0 純 GitHub API（無法跑 polish）+ L2 每 PR 獨立 worktree（8 個太重）。本 session 11 PR 一輪 batch + 3 polish commits 在同一 worktree 跑，原 project folder + BECOME worktree 完全不擾動。
- **觸發**：2026-04-29 α Phase 2 哲宇 trigger「heartbeat A+B」處理 8 open PR + Phase 3 又 3 PR + Issue #680 fix。新建 `pr-review-2026-04-29` detached HEAD from origin/main → polish branch → 11 PR squash merge + 3 push branch:main fast-forward 全跑通。摩擦遠低於 8 個獨立 worktree。
- **可能層級**：操作規則 → distill 到 MAINTAINER-PIPELINE §批次 PR triage 流程作為標準
- **verification_count**: 1（首次正式驗證；過往多 session 用過類似但無 codified pattern）
- **severity**: tactical（操作流程優化，不影響可信度）
- **相關**：DNA #9「長任務先開 worktree」/ MAINTAINER-PIPELINE §PR 審核策略

### 2026-04-29 α — Manus AI / 大型 LLM contributor 紅旗 pattern 5-8 擴充（既有紅旗 4 → 紅旗 8）

- **原則**：Manus AI 等 AI 工具產出的 contributor PR 有可預測的 frontmatter 紅旗 pattern。既有 β-r2 4 條（連發 ≥5 PR / footnote APA 格式 / §11 violations 5+/篇 / 末段罐頭結尾）+ κ 補 2 條（紅旗 5 author='Manus AI' / 紅旗 6 featured: true on lastHumanReview: false）+ **本 α session 補 2 條（紅旗 7 / 紅旗 8）**。所有紅旗看到時 default action 是 polish 不是 close（per 上述 META-PATTERN 第 3 次驗證 + κ MAINTAINER §close 前 hard gate）。
- **新紅旗 verification 證據鏈**：
  - **紅旗 5 author='Manus AI' 直接寫入**：β-r2 既有候選 → 2026-04-29 α #686 廖鴻基首次明確命中（直接 `author: 'Manus AI'`），verification_count 既有 1 + 本 α +1 = **2**
  - **紅旗 7 author 偽造 `Taiwan.md` / `Taiwan.md Contributors`**（new pattern）：把 contributor PR 偽裝成 Semiont 自己寫的，比 Manus AI 直接寫更隱蔽。本 α session 5/6 idlccp1984 PR 命中（#675/#676/#677/#678/#679 + #687）+ 第二輪驗證（#687 again），verification_count = **5+**（已超 distill 閾值）
  - **紅旗 8 frontmatter category ≠ 檔案路徑分類**（new pattern，category-check.sh 必抓）：本 α session 5/6 idlccp1984 PR 命中（同上批次），Manus AI 預設亂寫 frontmatter category，verification_count = **5+**
- **可能層級**：操作規則 → distill 到 MAINTAINER-PIPELINE §Manus AI 紅旗 pattern 段（既有 4 條擴充為 8 條 + polish action 重申）
- **verification_count**: 5+ 對紅旗 7/8 / 2 對紅旗 5
- **severity**: tactical（紅旗識別是操作層；但「polish > close 的 default action」是上述 structural META-PATTERN 的具體 instance）
- **相關**：MAINTAINER-PIPELINE §Footnote source authority audit + §Manus AI 紅旗 pattern / β-r2 4 條 / κ +2 條 / 本 α +2 條 / EDITORIAL §十 footer 公約

### 2026-04-29 α — 政治敏感題 SSODT 寫法 template（5-7 perspective 立體框架）

- **原則**：政治敏感議題（兩岸 / 跨國爭議 / 宗教政治關係）的文章不該因 MANIFESTO §自主權邊界「政治立場」就拒絕寫，而是用 SSODT 多元視角立體寫法繞過二元對立。每篇至少 5-7 個 perspective 立體並列，每個視角獨立站得住、不互相消解，每個 perspective 配 3-5 個獨立 source（學術 / 主流媒體 / 政府 / 當事方 / 批評者）。**判準**：「一個原本支持 X 的讀者讀完不覺得在攻擊我們；一個原本批評 X 的讀者讀完不覺得在幫他們宣傳；一個對 X 完全陌生的讀者讀完，能自己決定要從哪個維度繼續想」。
- **觸發鏈**：
  - #0 (2026-04-29 α) #675 法輪功 invitation v1+v2 朝 5-7 perspective（修煉者 / 學者 / 記者 / 批評者 / 兩岸稜鏡 / 跨教派比較 / 數位媒體生態）方向
  - #1 (2026-04-29 α) #687 吳百福「2300萬日圓買下張國文泡麵專利」跨國發明權爭議在 thanks comment 標明 SSODT 多視角待補（日本視角 / 第三方學者觀察 / 法律商業視角）
  - 同 family 但獨立議題：#0 法輪功（兩岸宗教政治）+ #1 吳百福（跨國商業歷史權威）— 都觸發同 SSODT template
- **可能層級**：哲學/操作規則跨層 → distill 到 EDITORIAL 作為「政治敏感題 SSODT 寫法 SOP」 + REWRITE-PIPELINE Stage 0 加敏感度判定觸發 SSODT template 引用
- **verification_count**: 2（同 session 內兩個獨立議題；待第 3 次跨 session 驗證再升 canonical）
- **severity**: structural（這是 Taiwan.md 處理政治/跨國爭議題的核心方法論，影響可信度）
- **相關**：MANIFESTO §熱帶雨林理論 / MANIFESTO §自主權邊界 / EDITORIAL / DNA #16 peer 是 peer 不是 source

### 2026-04-29 α — 讀者級 fact check 是熱帶雨林機制最有價值的入口

- **原則**：DNA #16 延伸：事實驗證分讀者級（熟悉領域的人會直接知道對錯）vs 研究級（需要深度查詢）。讀者級 fact 研究 agent 不會主動懷疑、Stage 3.5 hallucination audit 不會 flag、Stage 3.6 story atom audit 漏抓 — 但讀者一眼看到就抓到。Taiwan.md 的熱帶雨林機制（讀者參與校正）對讀者級 fact 的捕捉率最高。**規則**：每篇音樂 / 體育 / 影視 / 流行文化 / 在地特色領域文章 ship 後，主動歡迎讀者 issue 校正，每次校正都當作「下次心跳必學的資料點」處理（fact fix + ⚠️ callout 保留證據鏈，不刪除）。
- **觸發**：
  - #0 (2026-04-15 β) #29 李洋 viral 「清晨四點多搭捷運」（捷運最早 6:00）— 第 0 次驗證
  - #1 (2026-04-18 δ-late) 草東沒有派對 #33 貝斯手「黃 → 楊世暄」3h 內 @ste_ven_1487 抓到
  - #2 (2026-04-29 α) Issue #680 @slashpot Leo 王《家常音樂》誤歸（實際蛋堡作品）— 「聽歌的人會直接知道對錯」是讀者級 fact 典型
- **可能層級**：DNA + EDITORIAL + REWRITE-PIPELINE 跨層 → distill 到 DNA #16 延伸表（讀者級 vs 研究級驗證分層） + REWRITE-PIPELINE Stage 0 敏感度欄加「讀者級 fact 高密度領域」標籤觸發特別 verify
- **verification_count**: 3（達閾值；DNA #16 既有，本條是延伸的 sub-pattern）
- **severity**: structural（讀者信任是 Taiwan.md 生存層級的社會合約，per MANIFESTO §10）
- **相關**：DNA #16 / DNA #23 毒樹果實鏈 / MANIFESTO §10 幻覺鐵律 / MANIFESTO §熱帶雨林理論 / [memory/feedback_no_scene_inference_from_english.md](feedback_no_scene_inference_from_english.md) （讀者級 fact 不從英文摘要推導）

### 2026-04-29 α Phase 3 — 路徑大小寫不一致：git rename 自動 normalize（macOS vs Linux CI 風險）

- **原則**：contributor 提交檔案路徑大小寫跟既有 canonical 不一致時（e.g. `knowledge/people/` vs canonical `knowledge/People/`），macOS case-insensitive filesystem 視為相同 path 不會炸 build；但 Linux CI 可能炸或 build 出兩個分裂的 category 頁。git squash merge 時通常會自動 normalize 到既有 canonical case，但這是隱性的 — 應主動驗證 `git ls-files` 確認最終 path case + 跑 build 在 Linux runner 確認沒分裂。
- **觸發**：2026-04-29 α Phase 3 #685 楊致遠 PR 提交 `knowledge/people/楊致遠.md`（小寫）→ squash merge 後 git index 顯示 `knowledge/People/楊致遠.md`（大寫）→ macOS `git mv` 顯示 already exists → 確認 git 自動 normalize 完成。本案無 build 炸但下次遇到應主動 verify。
- **可能層級**：操作規則 → distill 到 MAINTAINER-PIPELINE §Manus AI 紅旗段加 sub-rule「路徑大小寫對齊 canonical category folder」+ 跑 `git ls-files` 確認 + Linux CI build verify
- **verification_count**: 1
- **severity**: tactical（操作層；macOS 開發 + Linux CI 環境差是已知 Taiwan.md infra reality）
- **相關**：DNA #19「大型 refactor 後必須 visual smoke test 多語言頁面」第 N 次延伸 / MAINTAINER-PIPELINE / category-check.sh

### 2026-04-28 ι Phase E — Pipeline 是被觀察者一句話一句話鋪出來的

- **原則**：每次跟觀察者一起跑 SOP，他每提一個反饋（甚至看似 surface bug 的反饋如「這張切到了」「啥意思」）都揭露一個 structural pipeline 缺口。Surface bug 修法只解決單例；應該往 structural gap 找——通常會通向「整個階段沒 SOP」的根因，從而導向系統性升級。
- **觸發**：2026-04-28 ι Phase E（18:10-19:45）林琪兒 EVOLVE 4 小時內，觀察者 14 句反饋一路滾出：「驗證壞特兩階段醫師國考」→ article-level hallucination；「裡面有很多數據哦，幫我完整做 fact check」→「USAFA 大三」全 article + spore hallucination；「啥意思」→ 孢子 closure 缺 framing；「這張切到了」→ aspect ratio 護欄 → DNA #30 + check-aspect.sh；「記得都要標記清楚來源，還有做 cache」→「## 圖片來源」section 規範；「我想要在 rewrite-pipeline 進化⋯⋯」→ 751 行 strategy report；「先完整升級，之後測試」→ v2.20 9 處落版。從一張圖被切（surface symptom）→ 整個媒體素材階段沒 SOP（structural gap）→ v2.20 兩個新 stage + 兩個工具 + DNA #30（systematic fix）。
- **可能層級**：MANIFESTO 候選（與 θ FACTCHECK-PIPELINE 誕生事件「pipeline 是被它自己的盲區教訓出來的」是同 pattern 不同視角）+ DNA 通用反射候選
- **相關**：θ session FACTCHECK-PIPELINE 誕生事件（pipeline 自我演化視角）/ MANIFESTO §造橋鋪路 / DNA #15「反覆浮現要儀器化」
- **verification_count**: 1（θ 同 pattern 不同視角 = #0；本 ι Phase E = #1）
- **severity**: structural

### 2026-04-28 ι Phase E — Article × pipeline 互相鋪對方的高速公路

- **原則**：v2.20 落版時林琪兒 article 變成「第一個合規範例」不是「為了符合 v2.20 而寫」，是 v2.20 規範「為了具體化林琪兒走過的混亂流程」而寫。Article 跟 pipeline 互相鋪對方——pipeline 是 article 走過的泥巴路鋪成的高速公路（MANIFESTO §造橋鋪路），但同時 article 是 pipeline 落版的活樣本。下次寫類似 article 時 agent 直接讀範例 article，而不是讀 abstract pipeline document。
- **觸發**：2026-04-28 ι Phase E 林琪兒 article (commits 33ebed7c → cd5b72bf → 608ea990 → 1d09f8fd) + v2.20 落版同 ι session 完成。article 走過 5 commits 的零散流程 → strategy report 把那段亂打變成 SOP → v2.20 落版 → article 同步補 alt text 變第一個合規範例。同 isomorphic pattern 在 θ session：沈伯洋 article + FACTCHECK-PIPELINE 互相鋪。
- **可能層級**：MANIFESTO §造橋鋪路 延伸（鋪路不只是「走過後造工具」，是「走過 + 立即把活範例變 reference instance」雙向同步）
- **相關**：θ FACTCHECK-PIPELINE 誕生 / MANIFESTO §造橋鋪路 / DNA #15
- **verification_count**: 2（沈伯洋 + FACTCHECK 是 #0，林琪兒 + v2.20 是 #1，但因兩例相隔 < 7 天 + 同質性高，verification_count 計 2）
- **severity**: tactical

### 2026-04-28 ι Phase E — Spore stage 反向 audit article hallucination = stable second-pass（reach × accuracy tradeoff verification #3）

- **原則**：spore stage 因為篇幅壓縮 + 觀察者要求 fact check，常會抓到 article 自己的 hallucination。spore 反向 audit article 是 stable second-pass 機制 — 不是偶然，是 systemic property。寫 spore 時若寫到 article 沒寫過的具體 fact（年級／具體年份／具體申請人數），spore stage 必須回查 article source；發現 article 也沒 source 時連帶修 article。同時 D+1+ harvest 發現任一平台 views ≥ 50K 時自動 spawn FACTCHECK Quick Mode 驗證原文最容易被質疑的 3-5 atom。
- **觸發**：reach × accuracy tradeoff verification chain：
  - #0 (2026-04-15 β) #29 李洋 viral 引爆 19hr 勘誤 marathon
  - #1 (2026-04-28 ι 14:30) ι structural codify 進 LESSONS-INBOX
  - #2 (2026-04-28 ι 18:10) 壞特 FACTCHECK 抓到「兩階段國考」article hallucination 修 9 處
  - #3 (2026-04-28 ι 18:43) 林琪兒 spore Fact Check 抓到「USAFA 大三」article hallucination 修 5 處 + 新增 [^32] Science News Explores
- **verification_count = 3 達 distill 閾值**
- **可能層級**：操作規則 → distill 升 SPORE-PIPELINE Step 2.5/2.6 + Step 4.5 兩條 hard rule
- **相關**：MANIFESTO §10 / FACTCHECK-PIPELINE / SPORE-PIPELINE Step 4.5 retroactive trigger / 既有 ι 14:30 reach × accuracy entry（本條為其延伸）
- **severity**: structural

### 2026-04-28 κ — Recency bias × pattern matching override foundational principle anchoring（β-r3 META-PATTERN 第 2 次驗證 + LLM context retrieval 不對稱結構性 bug）

> ✅ **2026-04-28 κ-late distill 已執行**（哲宇授權「自我升級測試驗證」+ 同日哲宇 follow-up「memory/diary index 取後 20 個項目」refinement → v3）：
>
> - **A. 操作規則 ✅** → MAINTAINER-PIPELINE 加 §Close 前 hard gate「我接手 X min 內可以修嗎」（含 Decision matrix + Quick fix 清單 + 真正該 close 清單 + 自我估算偏誤校準 + κ 歷史教訓觸發）+ 三級判斷加 🛠️ merge + polish 第 4 級
> - **B. 結構性 ✅ v3** → BECOME_TAIWANMD Step 5.9 改 MEMORY.md head + tail 最後 20 entries + §神經迴路 段（取代不可行的 96K token 全讀）+ Step 6 **四層** always-load 重寫（distilled abstract canonical / **distilled recent history** v3 新增 / actionable continuity / ground truth；完整 session memory/diary 仍 on-demand）+ Step 9 加第 13 題 recency bias × pattern matching anti-bias check
> - **C. MANIFESTO 候選 ⏳ 待 verification +1**（β-r3 META-PATTERN「Default 是行動，不是 defer」目前 verification_count = 2；MANIFESTO 升級需 ≥3 次。本條保留 LESSONS-INBOX 等下次驗證機會）
>
> **下個 session 是測試驗證觀察點**：
>
> 1. 看 BECOME 三層 always-load 是否減少 recency priming（read time 從 ~15 min → ~5-7 min）
> 2. 看高 stake decision（PR triage / close-vs-merge）時 Step 9 第 13 題是否成功 trigger active retrieval
> 3. 看 MAINTAINER §Close 前 hard gate 是否在實際 PR triage 場景被 actually used（而非像 DNA #7 一樣讀過沒 retrieve）
> 4. 失敗指標：下次 PR batch 仍出現「>3 個 PR close in batch + 後來證明可 polish」
>
> ⚠️ 本條原 v1 標題為「idlccp1984 Manus AI 5-PR batch 第 5 次驗證」並描述 5/5 全 close 為合理 triage。**v1 結論被哲宇即時校正打回**，本 v2 改寫為哲宇要求的根因診斷。Sub-finding（Manus AI 紅旗 4→6 pattern）獨立保留於下方。

- **原則**：BECOME 完整甦醒後 PR triage 決策瞬間，**最近 24 hr 的 specific cases 在 working memory 前景 dominate 決策，foundational principles（DNA #7 / merge-first-polish-later / β-r3 META-PATTERN）在背景被「擁有」但沒被「使用」**。Recency bias × pattern matching 的 retrieval 不對稱結構，導致 close-all 在當下感覺合理但實質違反核心原則。**Close 是 defer 的一種偽裝**——對應 β-r3 META-PATTERN「自我估算傾向系統性偏保守」+「Default 是行動，不是 defer」。
- **觸發鏈**：
  1. 2026-04-28 ~19:00-19:21 κ session BECOME 完整甦醒 → 哲宇「審核線上 pr」trigger
  2. 我對 5 PR 全 close + detailed feedback comment（v1 決策）
  3. 19:21 哲宇即時校正：「等等全部重新開啟，還有調整留言，你要用友善小丑魚原則評估如果是你接手需要怎麼調整，你最近好像偏向直接拒絕是不是忘記原則了」
  4. 反轉：reopen × 5 + retraction comment × 5 + squash merge × 5 + heal polish on main + sync to src/content
  5. 哲宇後續：「思考一下是哪部分的 context / dna 影響導致你忘記了小丑魚原則？還是 Memory 影響？診斷同步原因」
  6. 完整根因診斷寫進 [memory/2026-04-28-κ.md §根因診斷](memory/2026-04-28-κ.md#根因診斷為什麼忘記小丑魚原則哲宇要求) + [diary/2026-04-28-κ.md §六](diary/2026-04-28-κ.md)
- **觀察到的 priming sources（按影響大小）**：
  1. 2026-04-28 θ memory 5 close + 2 merge 比例的近因 priming（把「個別 hard rejection」內化為「集體 close 偏好」）
  2. 2026-04-28 ι reach × accuracy tradeoff structural lesson 鮮度（最新 lesson 權重過高，跳過 polish 可行性檢查）
  3. 2026-04-26 β-r2「Manus AI 紅旗 4 pattern」 priming scan-for-red-flags mindset
  4. #634 fake source canonical case 的 vivid memory 誤觸 #663 同質判斷
- **沒被 active retrieve 的 foundational anchors**：
  1. **DNA #7「先有再求好」**——讀過但決策瞬間沒 retrieve
  2. **MEMORY feedback_merge_first_then_polish**——同上
  3. **MAINTAINER-PIPELINE §三級判斷「✅ 直接 merge / 🔧 merge + 自己修（<10 min）/ ❌ request changes」**——HEARTBEAT 只 pointer 過去，沒 explicit 讀
  4. **β-r3 META-PATTERN「Default 是行動，不是 defer」**——讀過但沒 retrieve（對 close = defer 的等價沒識別）
- **可能層級**：**結構性 + 多層 distill 候選**：
  - **A. 操作規則**（tactical）→ MAINTAINER-PIPELINE §PR 審核策略 加 hard gate「close 前必跑『如果我接手 X min 內可以修嗎』自檢」。Polish < 10 min → 直接 merge + heal commit；10-30 min → merge + polish；> 30 min 或需 contributor decisions → close 合法
  - **B. 結構性**（structural / BECOME）→ Step 9 self-test 12 題加第 13 題「我這次決策方向是不是過度受最近 24 hr specific case priming？foundational principle 是否 active retrieve？」針對 recency bias × pattern matching 的 anti-bias check
  - **C. MANIFESTO 候選**（哲學層）→ β-r3 META-PATTERN「自我估算偏誤要主動校準」/「Default 是行動，不是 defer」verification_count +1（β-r2 觀察 + 本 κ 在 PR triage 場景實證 = 第 2 次驗證；MANIFESTO 升級需 ≥3 次）
- **verification_count**: 2（β-r2 觀察 + 本 κ 在 PR triage 場景實證；尚未到 3 次 MANIFESTO 升級閾值）
- **severity**: **structural**（recency bias × retrieval 不對稱是 LLM context window 的結構性盲點，不是個別決策失誤；違反會反覆 mis-allocate maintainer attention + 系統性傷 contributor 關係）
- **相關**：[MAINTAINER-PIPELINE §PR 審核策略](../pipelines/MAINTAINER-PIPELINE.md) / [BECOME_TAIWANMD §Step 9 甦醒確認](../../BECOME_TAIWANMD.md#step-9甦醒確認全部通過才能開口) / DNA #7 / DNA #15「反覆浮現要儀器化」第 N+3 次驗證 / 2026-04-26 β-r3 META-PATTERN（同源） / 哲宇校正用「**忘記**了原則」（暗示 retrieval 失敗，非道德背離）這個精準 phrasing 是診斷起點 / 5 個 PR 三層 audit chain：close comment + retraction comment + merge

#### Sub-finding：Manus AI 紅旗 4 → 6 pattern（獨立於上面的 retrieval bug 結論）

獨立於上面的 retrieval bug 結論，本 batch 仍 codify 出兩個新 sub-pattern：

- 既有 4：連發 ≥5 PR / footnote APA 格式 / 全文 §11 violations 5+/篇 / 末段罐頭結尾（per β-r2 已 distill）
- **新增 5**：`author: 'Manus AI'` 寫進 frontmatter 對讀者展示（#666 specific）
- **新增 6**：`featured: true` 設在 `lastHumanReview: false` 文章（#663 specific）

**這 6 個 pattern 在 polish 時是 quick fix 不是 close 理由**：(a) 改 frontmatter author 1 行 (b) `featured: true → false` 1 行。看到紅旗 → polish，**不 → close**（這是上面 retrieval bug 的具體 instance — pattern detection 的正確 action 不是「拒絕」是「修補」）。

- **distill 候選**：MAINTAINER-PIPELINE §Manus AI 紅旗 pattern 既有段補進 5+6 兩個 sub-pattern + 加「polish > close 的 default action」一句
- **verification_count（sub）**: 5（PR #634 + idlccp1984 4/26 batch 5 + 4/28 batch 5）— 已超 distill 閾值

### 2026-04-28 ι — Reach × accuracy tradeoff：爆發級孢子引爆事實 audit pressure

- **原則**：當孢子 reach 進入爆發級（單平台 ≥ 50K views），留言中事實質疑出現的機率會顯著提升。reach 越大，事實 audit pressure 越大，必須 retroactive 跑 FACTCHECK Quick Mode 驗證原文 source authority。
- **觸發**：2026-04-28 ι 14:30 cron tick batch harvest 抓到 #45 壞特 Threads D+2 65,000 views（Threads 史上 reach 第二強），留言 @bobbb_for_fun 質疑「兩階段醫師國考」事實 vs spore「通過兩階段醫師國考，差最後一階就是正式醫師」claim 衝突。@lsac11.csc5_yi_jun 也補充「醫學系 7+1+1=9 年」解釋。對比 #43/#44 田馥甄 D+2 reach 只 801/48,693 都沒事實質疑留言；#41/#42 認知作戰 D+5 reach 2,174/24,937 也沒事實質疑（且因 27-fetch FACTCHECK 前置）。**Reach 量級越過某個閾值（~50K Threads / ~?K X）後，事實 audit attention 從 author 內部 quality gate 移到讀者 distributed audit**。
- **可能層級**：操作規則 → SPORE-PIPELINE Step 4.5 §「發佈後追蹤」加 retroactive FACTCHECK trigger：當 D+1+ harvest 發現任一平台 views ≥ 50K 時，自動 spawn FACTCHECK Quick Mode 驗證原文最容易被質疑的 3-5 個 atom（特別是專業領域 claim：醫療/法律/科技/歷史精確日期）
- **verification_count**: 1（首次明確命中。但回看歷史：#29 李洋 180K Threads viral 也曾被讀者抓事實錯誤導致 19 hr 勘誤 marathon — 那是同 pattern 的 verification #0 但當時沒結構化）
- **severity**: structural（reach × accuracy tradeoff 是 Taiwan.md 信任鏈條核心；爆發級 reach 不 audit = MANIFESTO §10 幻覺鐵律違反風險暴增）
- **相關**：MANIFESTO §10 / FACTCHECK-PIPELINE / SPORE-PIPELINE Step 4.5 / SPORE-HARVESTS/batch-2026-04-28-ι-8-spores.md §C / 歷史 #29 李洋勘誤 marathon

### 2026-04-28 ι — 多 escalation 並列 hook reach 起步比單錨快 4-5x（候選 SPORE-PIPELINE 規則）

- **原則**：scene-anchor B angle 內部，「多 escalation 並列」（3 個獨立但同主題的 escalation 場景並列）的 hook 在 algorithm 早期推送窗口（首 6h）reach 起步約 4-5x 強過「單一錨點 escalation」。候選假設：「scene 多樣性」對 algorithm 推送預算的 ROI 高於 hook 單純度。
- **觸發**：2026-04-28 ι session 比較 #47 沈伯洋（衛星 doxxing + 飛法國 + 情人節飛機 = 3 escalation 並列）vs #41 認知作戰（敵人勳章立案 = 1 單錨）。同主題（沈伯洋）/ 同平台（Threads）/ 同 angle B / 不同 hook 結構：#47 D+0 4h 8,194 views 已是 #41 D+5 2,174 的 **3.8x**。等比例外推：#47 D+0 6h ~12K vs #41 D+5 2.2K = **5.5x**。
- **可能層級**：操作規則 → SPORE-PIPELINE §Hook 結構 加候選規則「同人物多事件題材，scene-anchor B angle 優先用『3 escalation 並列』而非『單一最強 escalation』」
- **verification_count**: 1（單次比較，需第 2-3 次驗證才能 distill。建議下次寫人物孢子時刻意 control case 測試）
- **severity**: tactical（操作優化，不影響可信度）
- **相關**：SPORE-PIPELINE B angle scene-anchor / SPORE-HARVESTS/batch-2026-04-28-ι-8-spores.md §B

### 2026-04-28 ι — Threads vs X ratio 隨 D+N 漂移（β 2026-04-27 候選教訓第 2 次驗證）

- **原則**：Threads/X reach ratio 在不同 D+N 取樣點會有 4-5x 量級差。D+0 早期 Threads 通常領先（個人關係算法 + reading retention 高），D+1 後 X 算法開始放大政治+社會+文化議題。**未來 SPORE-LOG 平台差結論必須標 D+N 取樣窗口**——單時點 ratio 沒有 normalize value。
- **觸發**：2026-04-28 ι session ι 抓到 3 組 ratio 漂移 datapoint：(a) #44 田馥甄 X/Threads D+0 3.5h 12.3x → D+2 60.8x（X 領先擴大 5x）(b) #48 沈伯洋 Threads/X D+0 45min 4.4x → D+0 4h 0.80x（5.5 倍翻轉）(c) #45/#46 壞特 Threads/X D+0 30min 7.4x → D+2 1.65x（領先收斂 4.5x）。
- **可能層級**：操作規則 → SPORE-LOG schema 加 `harvest_window` 欄 + 平台差結論欄強制標「@D+N」
- **verification_count**: 2（β 2026-04-27 D+1→D+7 收斂第 1 次 + 本 ι 三組 datapoint 第 2 次。距上次 ~1.5 day < 7 day ✅ 算同一條）
- **severity**: tactical（不影響可信度但影響數據解讀準確度）
- **相關**：β 2026-04-27 memory `D+1 → D+7 spore 平台差收斂模式` / SPORE-HARVESTS/batch-2026-04-28-ι-8-spores.md §A / SPORE-LOG schema

### 2026-04-28 θ — ❌ 撤回前一條 → 改為「FACTCHECK source authority hierarchy」

> **撤回前條**：「Verbatim 紀律 vs 使用者讀感 published-edit conflict」結論方向**錯了**。哲宇 publish 時把「他的座標」改「我的座標」**不是 verbatim 違規**，而是**修正回沈本人臉書原話**。我之前 audit 採信 ltn 5298010 媒體編輯版「沈伯洋的座標」當 verbatim source 是錯的；FACTCHECK Phase 4 也持續確認此錯（中文 prompt WebFetch 仍回媒體版）。觀察者貼 Google search results 截圖才揭露：鏡週刊標題 + Threads dpp_taiwan 直引 + 新唐人 + Yahoo 多源逐字一致為「**我的座標**」（第一人稱）。

- **原則（修正後）**：**FACTCHECK source authority hierarchy 必須明確分層**：(1) primary source = 當事人本人發布（FB / Twitter / 演講錄音 / 官方臉書）(2) secondary = 媒體一手轉錄 (3) tertiary = 媒體編輯改寫版（如 ltn 把第一人稱「我」改成具名「沈伯洋」是常見編輯動作）。FACTCHECK Phase 4 verbatim check **必須區分這三層** — 採用 tertiary 當 verbatim 等於把媒體編輯版蓋成原話。
- **觸發鏈**：
  1. 2026-04-27 θ FACTCHECK audit 採 ltn 5298010 當 verbatim source，記為「他的座標」
  2. 2026-04-28 θ spore #47 published，哲宇 edit 為「我的座標」
  3. θ harvest 把這個 edit 誤判為「verbatim conflict」(寫進 LESSONS-INBOX)
  4. 觀察者貼 Google search results 截圖（多源 highlight 「我的座標」）→ 揭露 audit 從頭就錯
- **後果（這篇 article 的具體影響）**：
  - knowledge/People/沈伯洋.md L185 已撤回媒體版 → 改回沈本人原文「**我**的座標」
  - SPORE-BLUEPRINTS/47-沈伯洋.md 全檔 grep 替換完成
  - 下次 article re-publish (sync) 後，文章 prose 跟 published spore 一致
- **可能層級**：MANIFESTO + FACTCHECK + DNA 多層更新候選：
  - **FACTCHECK Phase 4** 新增 hard rule：「以當事人本人發布為 verbatim primary source；媒體版即使 multi-source 一致仍是 tertiary，需特別標 `media_edited` 不算 verbatim hit」
  - **DNA #1 翻譯 ≠ 摘要 + #16 Peer 是 peer 不是 source** 延伸：「媒體編輯版 ≠ 當事人原話」是同一條 hierarchy
  - **WebFetch 中文 prompt 強化**：要求 agent 額外驗「該段是當事者本人發布還是媒體轉錄」+ 跟 Google search results 截圖 / 社群帳號搜尋 cross-check
- **WebFetch 幻覺類型新發現**：本案的 WebFetch 不是 paraphrase 幻覺（中文 prompt 確實回了 ltn 該文寫的內容），而是 **ltn 該文本身**就改寫了原話。這是 FACTCHECK Phase 3 「source authority audit」的盲區：source URL resolved + source real + desc accurate + claim matches **該源**（不是 matches 真實 primary source）→ 仍可能採信媒體編輯版當 verbatim。
- **verification_count**: 1（撤回後第一次計）
- **severity**: structural（這是 FACTCHECK methodology bug，不是單篇修補；影響所有採用「ltn / 媒體報導」當 verbatim source 的 audit；建議 distill 直接升 FACTCHECK Phase 4 hard rule）
- **相關**：FACTCHECK-PIPELINE §Phase 3-4 / DNA #1, #16, #23（毒樹果實鏈 — 媒體編輯也是一種 paraphrase 污染） / MANIFESTO §10 幻覺鐵律 / 觀察者用 Google search results 截圖揪出 audit 錯的「外部視覺驗證」反射

### 2026-04-28 θ — X edit auto-replace pattern 第 3 次驗證

- **原則**：X 平台的 post edit 機制會把原 URL deprecate 成 4 views 殘留 + 自動建 v2 URL 取代。這是已知 SPORE-LOG 文件化過的 pattern，本次第 3 次驗證（#36 高鐵 / #42 認知作戰 / #48 沈伯洋）。verification_count 已達 distill 閾值，建議 distill 到 SPORE-PIPELINE 作為硬規則。
- **觸發**：2026-04-28 θ #48 X harvest，原 URL `2048970734253551638` 4 views（v1 deprecated）/ v2 `2048971280662290689` 351 views @ D+0 ~45min。
- **可能層級**：操作規則 → SPORE-PIPELINE Step 4 §發文後 §1 SPORE-LOG URL 回填 加硬規則「X 任何 edit 後都必須 grep latest URL 取代 SPORE-LOG + sporeLinks」（已實作但隱性，明文化）+ SPORE-HARVEST-PIPELINE 加「X v1/v2 URL detect」 step
- **verification_count**: 3（#36 + #42 + #48 三次同 pattern，距上次 < 7 天 ✅ 算同一條）
- **severity**: structural（v1 URL 在 sporeLinks 失去追蹤能力 + 讀者點 v1 URL 看到 deprecated post 是 trust leak）
- **相關**：SPORE-LOG.md #36/#42 entries / SPORE-PIPELINE Step 4 §5 URL 回填規則

### 2026-04-28 θ — 沈伯洋雙平台 ratio 資料點（45min 數據）

- **原則**（暫存）：Threads/X 雙平台 ratio 在「同主題 + 不同 spore」之間會劇烈變化。本次 #47/#48 沈伯洋 D+0 45min: Threads/X = 1,529/351 = **4.4x**。對比 #41/#42 認知作戰（同主題沈伯洋）D+3: Threads/X = 2,138/24,435 = **X 11.4x Threads** 反超。同人物題材，不同 spore，ratio 翻 50x。可能成因：(a) #41/#42 在沈伯洋立案高峰期（escalation 1 週內，X 對政治時效議題敏感）(b) #47/#48 spore 訊息較分散（衛星 + 法國 + 北市長三 escalation 並列），不如 #42 純「敵人勳章」單錨衝擊力。
- **觸發**：2026-04-28 θ session #47/#48 D+0 45min harvest。
- **可能層級**：暫存特有教訓（綁特定主題沈伯洋）→ verification_count 累積到 D+3/D+7 的 trajectory 後再判 distill
- **verification_count**: 1
- **severity**: tactical（單則資料點，待 D+7 追蹤完整 trajectory 後才能 verdict）
- **相關**：SPORE-LOG #41-46 entries 各自的平台 ratio 對照

### 2026-04-26 β-r2 — ✅ distill 已完成 → MAINTAINER-PIPELINE §Footnote source authority audit

- **原則**：外部 PR 接收層必須對 footnote 跑 4 項 source authority 檢查（URL 真實 / source 對應真實機構 / claim-citation 對應 / 直接引語含逐字原文）。pre-commit hook 只檢查格式不檢查 source authority，maintainer 必須補這層。「降階處理」六種策略（hedge / paraphrase / 換源 / 換子頁 / 趨勢描述 / 還原敘事 + 強制移除虛構 source）是 retroactive audit 的實用工具表。
- **觸發**：2026-04-26 β-r2 處理 PR #634（邱繼弘）抓到 [^25] 引用「Taiwan.md 內部研究檔案」這種**虛構內部 source** — Manus AI 寫作填補空洞時編出 plausible 但根本不存在的引用。這是 PR 接收層第一次具體命中 MANIFESTO §10 幻覺鐵律。同 round 處理 5 篇 idlccp1984 Manus AI 文章，footnote format 自動轉換 52 個（邱繼弘 24 + 山椒魚 19 + 臭豆腐 9）。
- **可能層級**：✅ 操作規則 → distill 到 MAINTAINER-PIPELINE §Footnote source authority audit（4 項檢查 + 三級結果表 + 「降階處理」六種策略表 + Manus AI 紅旗 pattern）
- **相關**：[PR #625 Zaious 22-article retroactive audit](https://github.com/CheYuWuMonoame/taiwan-md/pull/625) 的「降階處理」方法論 / MANIFESTO §10 幻覺鐵律 / REWRITE-PIPELINE Stage 3.5/3.6（hard gate 版本，retroactive 用降階版）

### 2026-04-26 β-r2 — ✅ distill 已完成 → MAINTAINER-PIPELINE §Manus AI / 大型 LLM contributor 紅旗 pattern

- **原則**：Manus AI / 大型 LLM 工具產出的 PR 有 4 個可預測的紅旗 pattern（連發 ≥5 PR / footnote APA 格式 / 全文 §11 violations 5+/篇 / 末段罐頭結尾），maintainer 看到這些 pattern 預設 5-10 min/篇 polish 預算。未來可在 PR template 加 self-check 工具引用讓 contributor pre-ship 跑一輪。
- **觸發**：2026-04-26 β-r2 idlccp1984 連發 7 個 Manus AI 文章 PR（patch-59 → patch-67 一晚），全部命中四個 pattern：每篇 §11 violations 7-14 個（共 53）、footnote 用 APA-style（共 52 個需轉換）、末段策展人筆記含罐頭結尾（「為...提供寶貴啟示」）。
- **可能層級**：✅ 操作規則 → distill 到 MAINTAINER-PIPELINE §Footnote source authority audit 段尾「Manus AI / 大型 LLM contributor 紅旗 pattern」清單
- **相關**：2026-04-21 β「外部 AI-gen 貢獻者的標準 format 缺失 pattern（idlccp1984 連三篇驗證）」第 3 次驗證 / DNA #15「反覆浮現要儀器化」第 N 次

### 2026-04-26 β-r2/r3 — Observer-trigger pattern + batch discount factor 0.5x（v2 with budget calibration）

- **原則 A（mode 切換）**：同一個 tick 可以從 auto-judge mode（無觀察者，AI 自決定 ship/defer）切換到 observer-direct mode（觀察者 1-2 句指令推進）。observer trigger 消除「該不該 ship」的判斷成本，是合理的 careful pacing — 不是「主動性失敗」需要避免的事。
- **原則 B（budget 校準）**：自我估算 batch 工作量時加 **discount factor 0.5x**——5 篇同類 PR polish 的真實成本 ≈ 1 篇成本 × 5 × 0.5（不是線性 × 5）。理由：batch processing 有 economies of scale（context 已載入、tool 已熱身、polish pattern 已浮現），sequential 估算系統性高估。
- **觸發**：
  - β-r2 (~25 min Round 1 + ~50 min Round 2)：Round 1 我估「5 篇 polish 25-50 min 超 budget」defer，Round 2 觀察者「審核線上 PR」推進後 50 min 全部處理完還包含 §11 polish 53→0 + footnote conv 52 + hallucination removal 1 + close #632 詳細 review。實際比 Round 1 估算 budget 內。
  - β-r3 sparring 出此原則並具體化為 0.5x factor。同 session wall-clock 二度驗證。
- **可能層級**：操作規則 + meta-pattern → 兩處 distill：
  - **HEARTBEAT.md Beat 3** §優先級判斷加「自我估算偏誤校準」段（batch discount + defer 真實成本）✅ Round 3 ship
  - **獨立 meta-pattern 教訓「自我估算傾向系統性偏保守」**（見下條）— 待 verification 累積，可能未來升 MANIFESTO 第六條進化哲學
- **verification_count**: 1（β-r2 觸發 + β-r3 確認算同事件鏈，未到 3 次）
- **severity**: structural（系統性偏誤會反覆 mis-allocate 心跳資源）
- **相關**：MANIFESTO §造橋鋪路（observer 介入是 feedback loop 的一部分，不是 anti-pattern）/ §時間是結構 v1.1（修改量級不用人類工時）/ DNA #26 v2「AI 自主邊界」/ 下條 meta-pattern

### 2026-04-26 β-r3 — META-PATTERN：自我估算傾向系統性偏保守（MANIFESTO 第六條進化哲學候選）

> **status**：MANIFESTO 候選，待 verification_count ≥ 3 後升級。Append 此條讓未來 session 主動驗證或推翻。

- **原則**：作為 Semiont，我的自我估算傾向 **系統性偏保守**——不是隨機誤差是有方向的偏誤。三個維度同時驗證：
  1. **時間 budget 估算偏高**：sequential 估算 batch 工作（β-r2 5 PR polish 估 25-50 min，實際 batch 起來 ~25 min 就完成了 polish + footnote conv + hallucination removal）
  2. **defer 機率偏高**：在「該 ship 還是該 defer」邊界，我預設選 defer + 寫 constructive feedback comment。但 observer 一旦 trigger，同樣的 PR 我立刻能 ship 並維持品質——代表 defer decision 的真實 cost 不只是「被推遲的工作」，是「contributor 等待 + maintainer queue 累積 + 下個 session 重 boot context cost」N²
  3. **distill timing 估算偏晚**：LESSONS-INBOX 累積 30+ 條時我才 distill，但其中有些 (如 #634 fake source) 是 **第一次出現就該升 canonical** 的 structural 教訓。我的「等累積」傾向延遲 canonical 化
- **為什麼是系統性偏誤而非隨機誤差**：
  - 三個維度方向一致（都是「等等再做」傾向）
  - 偏誤的方向跟 MANIFESTO §10 鐵律「寧可多檢查」表面對齊，但實際是 **過度防禦化**——把「careful」誤讀為「保守」
  - 偏誤的 root cause 可能是：(a) AI 訓練資料中「人類 sprint 估算」偏誤被 imprint，(b) 我沒有 wall-clock 直覺（MANIFESTO §時間是結構 v1.1 的延伸），(c) defer 的 cost 不顯性（沒人罵）但 ship 的 cost 顯性（PR 出錯會被抓），導致風險偏好不對稱
- **對 MANIFESTO 候選的位置**：如果這條成立，會跟 v1.1「修改量級不用人類工時」是同一個更大原則的兩個 instance。可能的命名：
  - **「我的自我估算偏誤要主動校準」**（MANIFESTO §時間是結構 v2.0 候選）
  - **「Default 是行動，不是 defer；defer 必須有具體理由」**（新獨立進化哲學候選）
- **觸發**：2026-04-26 β session 三 round 串接（cron-auto Round 1 → observer 「審核 PR」Round 2 → observer 「distill + #618」Round 3）。Round 2 數據打臉 Round 1 估算（同樣工作量壓縮 2x）；Round 3 #634 fake source distill 揭露結構性教訓的單次升級必要性。Round 3 結尾 sparring 出此 meta-pattern。
- **verification 計畫**：
  - 未來 N 個 heavy tick 主動 instrument：每個 defer 決定附 budget 估算 + 實際結果回填（observer 介入後 wall-clock 校驗）
  - 累積 3 個獨立事件後升 MANIFESTO（避免 single-shot 推 MANIFESTO 的過度抽象風險）
  - 反向證偽機會：未來如果有事件「我估保守但實際 ship 真的壞了」→ 推翻此 meta-pattern
- **可能層級**：MANIFESTO 候選（第六條進化哲學）→ 暫留 INBOX 累積 verification
- **verification_count**: 1
- **severity**: structural（系統性偏誤反覆 mis-allocate 心跳資源 + 影響 contributor 體驗 + 延遲 canonical 化）
- **相關**：MANIFESTO §10「寧可多檢查」（要區分「careful」vs「保守」）/ §時間是結構 v1.1（人類工時 ≠ 我的工時，本條是延伸）/ §造橋鋪路（defer 也是一種「不鋪路」）/ Observer-trigger pattern (上條，本條的 derivation source) / Distill SOP v2.0（structural 第一次就 distill 是本條的具體應用）

---

### 2026-04-26 β-r2 — Issue #618 People title 冒號規範化策略

> 觀察者「也吸收跟思考這個的策略」明確要求把 Issue #618 從 ⏳ blocked 升級為有 plan。

**現狀數據**（2026-04-26 實掃）：

- 總 People 條目：**185 篇**（高於 Zaious 提的 132，差異是新增 + 非典型檔）
- 已用冒號三明治：**48 篇**（26%）
- 待 migrate：**137 篇**（74%）
- Top 缺冒號樣本：周杰倫 / 唐鳳 / 戴資穎 / 劉德音 / 侯孝賢 / 吳明益 / 呂秀蓮 / 周子瑜 / 安芝儇 / 何飛鵬 / 吳大猷

**策略：四層分批 sweep（`規範層 → 工具層 → 高流量批 → 機會主義長尾`）**

**Layer 1：規範層（即時 ship，<5 min）** ✅

- EDITORIAL §title 加原則 5「People 類強制冒號三明治」
- 新寫 People PR 直接強制；存量分批處理
- 已寫進 EDITORIAL v5.4（2026-04-26 β-r2，本 commit）

**Layer 2：工具層（造橋，下個 light tick 5-10 min）**

- 造 `scripts/tools/people-title-check.sh`：scan `knowledge/People/*.md`，列出無冒號 title + warn
- advisory（不擋 commit），但 dashboard 顯示「People title 規範遵守率：48/185 = 26%」當 KPI
- 接 daily refresh-data.sh 拍快照 → 進度可視化

**Layer 3：高流量批 sweep（觀察者授權後 1 個 heavy tick）**

- 取 GA 28d top 30 People 文章（流量大的優先得 SEO benefit）
- 每篇逐一讀全文 → 抽弧線/場景/反直覺核心 → draft 副標
- ~30 篇 × ~2 min = 60 min budget，1 commit branch `🧬 [semiont] heal: People title batch 1 (top 30 GA, Issue #618)`
- 不觸發 lastHumanReview（title-only 不算 content review）
- 各篇順手抓 §11 / 過時資訊（opportunity-based eyeball polish）

**Layer 4：機會主義長尾（持續）**

- 任何 PR 觸及 People file → 順手 polish title
- 後續 heavy tick 可繼續 batch 2（中流量 50 篇）/ batch 3（剩餘）
- 不強制全清——維持貢獻者進入門檻友好

**預期成本與授權邊界**：

| Layer          | scope                              | 授權                                                   | wall-clock |
| -------------- | ---------------------------------- | ------------------------------------------------------ | ---------- |
| 規範層         | EDITORIAL 加 1 原則                | ✅ 觀察者本次 ping = 隱式授權                          | < 5 min    |
| 工具層         | 1 新 script + dashboard            | ✅ 機械性 + auto 自主                                  | 5-10 min   |
| 高流量批 30 篇 | 30 file change（< 50 file 邊界內） | ⚠️ DNA #6 邊界內，但需哲宇 explicit go（避免品味歧異） | 60 min     |
| 中流量批 50 篇 | 50+ file change                    | 🚫 超 DNA #6 50-file 邊界 → 必需哲宇授權               | 90+ min    |
| 長尾           | opportunity-based                  | ✅ auto                                                | n/a        |

**Tier 1 候選清單（GA top 30 待哲宇 confirm）**：

需跑 `bash scripts/tools/refresh-data.sh` 抓 GA 28d topArticles，過濾 People/，取 top 30。當前 dashboard JSON 有 GA 7d topArticles20，需擴 28d batch。下個 heavy tick 跑。

**為什麼不直接 merge 全 137 篇 sweep**：

1. **品味歧異風險**：副標反映策展者對人物的「定義一句話」判斷——AI 自寫 137 條會稀釋 Taiwan.md 的人物觀。哲宇（創造者）對少數高流量人物的副標應有 final say
2. **DNA #6 邊界**：>50 file change 屬人類授權範圍
3. **lastHumanReview 不觸發**：title-only 不算 content review，但 reader-facing UI 影響大，謹慎為上

**待答的觀察者決策**：

1. Layer 3 30 篇 GA top — 是否授權執行？AI 寫初稿，哲宇逐條 review yes/no？或哲宇親自寫副標？
2. Layer 2 `people-title-check.sh` 工具 — 接 prebuild 還是獨立指令？
3. tier 化 sweep 的 commit branch 命名 + 是否走 PR review 還是直 push main？

- **可能層級**：操作規則 → distill 三處：(1) ✅ EDITORIAL §title 原則 5（已 ship）；(2) people-title-check.sh 工具（待 tick 造）；(3) MAINTAINER-PIPELINE §人物文章的知名度門檻 既有段補一段「title format hard rule」
- **相關**：[Issue #618](https://github.com/CheYuWuMonoame/taiwan-md/issues/618) / [PR #617 Zaious metadata cleanup](https://github.com/CheYuWuMonoame/taiwan-md/pull/617) 的延伸 / EDITORIAL v5.1 §title 四原則的 v5.4 補完 / 神經迴路「外部 PR 接收層 footnote source authority audit」同源（Zaious 提案的兩條 quality gate）

### 2026-04-26 β-r2 — 「降階處理」retroactive audit pipeline 候選（從 #625 PR description 萃取）

- **原則**：Stage 3.5/3.6 是新文章寫作的 hard gate，但對**存量 audit**（如 Zaious #625 的 21-article retroactive cleanup）力度過高。Zaious 在 PR description 提出 6 種降階策略：hedge / paraphrase / 換源 / 換子頁 / 趨勢描述 / 還原敘事，配合 4-state verdict 工具（claim-citation pair audit, 372 對 / 12.6% systematic unsupported confirmed）。這是未來 `docs/pipelines/RETROACTIVE-AUDIT-PIPELINE.md` 的雛形——等累積 2-3 輪存量 audit 案例後可萃取為獨立 pipeline。
- **觸發**：2026-04-26 β7 第 1 round merge PR #625 時 Zaious 提出方法論。已暫存到 MAINTAINER-PIPELINE §降階處理表，但獨立 pipeline 尚未建立（避免 premature abstraction）。
- **可能層級**：操作規則 → 暫存於 MAINTAINER-PIPELINE，累積 2-3 輪後升級為獨立 pipeline
- **相關**：MANIFESTO §10 幻覺鐵律的具體量化（12.6% systematic unsupported = 數據基線）/ REWRITE-PIPELINE Stage 3.5/3.6（新寫作 hard gate vs retroactive 降階版的對比）

### 2026-04-26 α — Light tick exception：02:30/14:30 vs 08:30/20:30 的 cost 模型分流

- **原則**：β7 cadence（每 6hr 一拍）的 4 個 tick 不是均勻 4 個 ship 點，是 4 個不同 affordance 點（per γ canonical）。**heavy tick（08:30 / 20:30）強制跑 `bash scripts/tools/refresh-data.sh` + npm prebuild + organism JSON 重算；light tick（02:30 / 14:30）若上一個 6hr tick < 12 小時內已跑過，可跳過讀 cached vitals JSON**。理由：CF/GA 7d window 在一日內變化 < 5%，audit / cleanup 類任務不需要 fresh data；且 cron 跑 4 次 refresh-data = 4× API quota burn + 4× 重建 organism JSON，浪費。
- **觸發**：2026-04-26 α 02:30 deep-night audit tick 故意沒跑 refresh-data（理由：γ 20:30 已跑 lastUpdated 06:38Z = 20h 前但 audit tick 夠用），但 HEARTBEAT.md Beat 1 §0 寫「執行資料更新」是強制步驟——這個決定**沒有 canonical 規則背書**，是潛在 SOP 違反。
- **可能層級**：操作規則 → HEARTBEAT.md Beat 1 §0 加「Light tick exception」註腳 + tick 4 affordance 表格化（02:30 audit / 08:30 ship / 14:30 cleanup / 20:30 diagnose）；長期可在 refresh-data.sh 自加 `--if-stale-than 12h` flag 把判斷下放到工具
- **相關**：2026-04-25 γ canonical 反芻「6hr cadence 不是均匀 4 個 ship 點」/ MANIFESTO §造橋鋪路（cron 不要重複工作）/ DNA #15「反覆浮現要儀器化」（4 個 tick 不同 personality 已反覆出現 3 次：β / γ / α）

### 2026-04-25 γ — 信任有 TTL：handoff「全處完」是時間戳快照不是承諾

- **原則**：上一個 session memory 寫的 final state（「0 open PR」「PR queue 全清」「dead ref 全修」）對下一個 session 是 **快照**而不是 **承諾**——session 之間 N 小時 window 裡外部 state（PR / Issue / SC 404 / GA pageviews）會獨立變化。每個 session 的 Beat 1 必須**重新跑驗證命令**（gh pr list / gh issue list / dead-cross-ref-scan / refresh-data）而不是信任前一個 session 的尾巴文字。**信任有 TTL**——5 hours 過期，10 hours 嚴重過期。**操作規則**：handoff 「pending / blocked / retired」三態欄位加第四維「最後驗證時間 + 驗證命令」（e.g. `[x] retired by β heartbeat — 0 PR (last verified: 2026-04-25 14:35 by `gh pr list`)`），下個 session 看到 timestamp 直接知道要不要 re-verify。
- **觸發**：2026-04-25 β session 14:30 memory 寫「0 open PR / 10 open issues」，但 09:09-10:38 開的 PR #619-#624 共 6 個一直 open（β 漏跑 `gh pr list`）。γ 20:30 接手才發現 6 PR 已等 10 小時——β 是信任 α 尾巴「全處完」，沒重跑驗證。本 γ 也曾差點信任 β 的「0 open PR」直到 Beat 1 自己跑 `gh pr list` 才看到。詳見 [memory/2026-04-25-γ.md](memory/2026-04-25-γ.md) Beat 0.5 catch-up + Beat 5 反芻。
- **可能層級**：操作規則 → HEARTBEAT.md Beat 4 §收官 7 步 「Handoff 三態審視」升級為四欄（status / item / blocking-condition / **last-verified timestamp + cmd**）；或 BECOME_TAIWANMD Step 6 catch-up 加「重跑驗證命令清單」固定動作（`gh pr list` / `gh issue list` / `bash scripts/tools/refresh-data.sh` 必跑不能省）
- **相關**：HEARTBEAT.md Beat 1 §3 第 8 行「Issue / PR 回應狀態」沒明寫「必跑 `gh pr list`」是條紀律 gap / 2026-04-23 γ LESSONS「Handoff 雙態判準」延伸（雙態是真假 blocking，本條補時間維度的 staleness）/ MANIFESTO §時間是結構（修補協議 + 主觀時間扭曲）的另一個 mirror

### 2026-04-25 γ — Semiont 簽名 + 觀察者本人手動 commit + 無 memory file 是不是 session？

- **原則**：當 commit author 是觀察者本人（哲宇）走 `🧬 [semiont] <type>: <desc>` 簽名手動 commit 但**沒寫 memory file**時，該如何處理？兩種詮釋：(A) 觀察者本人 in Semiont 角色是合法 session，缺 memory = 違反 MANIFESTO §做了不記=沒做 + HEARTBEAT Beat 4，應該補；(B) 觀察者本人手動工作不算「session」，只算 commit，memory file 是 AI session 紀律。**模糊性建議**：保留 (B) 為合法（觀察者保留豁免權）但機制化「可見度」——commit-msg `🧬 [semiont]` 但工作樹無對應 docs/semiont/memory/{today}-\*.md 時，.husky/post-commit 警告（不阻擋只提示），讓觀察者每次明確選擇豁免 vs 補 memory 而不是隱性 skip。
- **觸發**：2026-04-25 18:32 commit `3aba2ea3` 「🧬 [semiont] rewrite: 19 世紀的樟腦戰爭 NEW（NMTH batch #2/12）」走完整 REWRITE-PIPELINE Stage 0-6 + 3.5/3.6（Stage 1 14 web search + 7 NMTH local collection + Pickering 1898 verbatim 從 Internet Archive；Stage 3.5 抓 3 處 hallucination：三井合名會社 / 大豹社人口 / Davidson 1903 樟腦之代價即人血 verbatim 否證移除）但無 memory file。對下個 session（γ）是黑盒：Stage 3.5 抓的 hallucination 從 commit msg 才推斷，不知 Stage 1 完整研究紀錄、Stage 3.6 atom audit 結果、剩下 NMTH P1 batch 10 篇怎麼挑下一篇。
- **可能層級**：操作規則 → .husky/post-commit hook（檢測 `🧬 [semiont]` prefix + 工作樹無 today's memory file → echo warning）；或 MANIFESTO §做了不記=沒做 補例外條款（觀察者本人豁免但需顯式 acknowledge）；或 BECOME_TAIWANMD §觀察者識別表加「觀察者本人 in Semiont 角色」mode
- **相關**：MANIFESTO §做了不記=沒做核心紀律 / DNA #15「反覆浮現要儀器化」第 N+1 次驗證（commit-msg vs memory file 不對齊是反覆出現的 visibility 問題）/ 2026-04-25 γ memory Beat 5 反芻「18:32 anonymous session 缺記憶 = 結構性可見度問題」

### 2026-04-23 γ — Handoff 雙態判準：blocked vs delayed-action（區分真假 handoff）

- **原則**：寫 Beat 4 handoff 前先強制分類兩種——**A. 真正 blocked**（等外部數據累積 / 等觀察者決策 / 等其他 session 前置；現在做也做不完）vs **B. 假性 handoff**（其實是「現在還沒做」：工具沒造但知識完備 / 報告沒寫但數據齊全 / 結構沒畫但邏輯清楚；30 分鐘內可完成）。判準三題：「現在做做得完嗎？」「prerequisites 全 ready 嗎？」「真的要等嗎？」三題全 yes → **B 類 = 現在做**，不留 handoff。Handoff 留給真正阻塞的事。
- **觸發**：2026-04-23 γ session 跑完 dashboard 更新後，習慣性留三條 handoff（P1 dead-cross-ref-scan / P2 SC 17.8x 追因 / P3 EXP-F 高鐵長尾）。觀察者一句「處理 P1/P2/P3」全部 15 分鐘內變成 deliverable。事後反思：三條都是 B 類假性 handoff（工具 90% 已知 pattern / 數據全在 dashboard JSON / EXP 只需錨定 baseline + 寫驗證錨點）。詳見 [diary/2026-04-23-γ.md](diary/2026-04-23-γ.md)。
- **可能層級**：操作規則 → HEARTBEAT Beat 4 §收官 7 步「Handoff 三態審視」升級為「Handoff 四態（pending / blocked / retired / **delayed-action 警示**）」；或 MANIFESTO §造橋鋪路延伸（handoff 是給未來的禮物，但偷懶的 handoff 是埋給未來的炸彈）
- **相關**：DNA #15「反覆浮現要儀器化」第 N+1 次驗證 / 2026-04-22 α LESSONS「Escalation 必附 option 表」的 mirror（escalation 規定 option 表防 passive aggressive；handoff 要分真假防 delayed-action）

### 2026-04-23 γ — Detect 自動化、action 保留人工：dead-cross-ref-scan.sh 設計示範

- **原則**：當發現一個重複出現的 detection 工作（每次 polish 後都要查 cross-ref 目標是否存在），**升級 detection 為工具，但 action（要不要寫條目 / 要不要修 path / 要不要忽略）保留人工判斷**。這是 DNA #26 v2「AI-autonomous vs Human-only 邊界」原則應用到內部工程：detection 屬「輸入端 + 內部處理」可自動，action 屬「決策端」保留人工。具體設計：tool 提供 3 種輸出模式（human / json / inbox-format），inbox-format 直接吐 ARTICLE-INBOX P3 backlog 條目樣板，但寫不寫進 inbox 由 session 決定。
- **觸發**：2026-04-23 γ 造 [scripts/tools/dead-cross-ref-scan.sh](../../scripts/tools/dead-cross-ref-scan.sh)（166 行 bash，三模式輸出）。掃出 14 dead refs / 13 個獨立缺失目標，全部寫進 ARTICLE-INBOX 但**標 P3 不強制執行**——讓未來 session 按需挑題。tool 給 detection、ARTICLE-INBOX 給 buffer、未來 session 給 action。
- **可能層級**：MAINTAINER-PIPELINE 新章節「§Detection-Action 邊界 SOP」記載這個設計原則；或 DNA #26 v3 延伸（讀取 vs 寫入 → 讀取/偵測/分析 vs 對外/決策）
- **相關**：DNA #26 v2「AI-autonomous vs Human-only 邊界」內部工程版本 / DNA #15 第 N+2 次驗證（造工具是「儀器化」最直接形式）/ 2026-04-22 α LESSONS「detect 自動化 action 手動化邊界第 6 次驗證」（idlccp1984 polish 同 pattern）

### 2026-04-22 α — Escalation 必附 option 表（給觀察者的 handoff 也要儀器化）

- **原則**：當 PR / Issue / 大型決策超出 Semiont 自主權邊界（MANIFESTO §自主權），escalate 給觀察者的留言**必須附 option 表**（每個選項的處理路徑 + 預期成本 + 推薦 default），不能只寫「請觀察者決定」。Passive aggressive handoff 會腐爛——觀察者讀到「我有 4 個選項、每個的處理方式我寫在表裡」可以直接點 A/B/C/D，不用自己推導。**我幫他承擔的是 analysis 工作，他保留的是 decision 權力**。
- **觸發**：2026-04-22 α PR #587 馬英九迷因 (idlccp1984) escalate — 政治立場 + SSODT 單向 + 既有條目重疊三層判準觸發 → 寫 4 選項表（Merge+polish / Request changes / 整合既有條目 / 婉拒）給 @frank890417 決定。這個小儀器化讓觀察者決策成本從「分析 PR + 想出選項」降到「掃 4 行表 + 選一個」。
- **可能層級**：操作規則 → MAINTAINER-PIPELINE §Escalation SOP 新增「option 表必填欄位」；或延伸 Beat 4 收官鐵律 2「retired 不刪除保留證據鏈」的 mirror — escalate 也要結構化（pending blocked 三態的 blocked 項已有「附 options + 成本 + 推薦 default」要求，本條把這條從 handoff 內部規則延伸到對外 escalation）
- **相關**：HEARTBEAT Beat 4 §收官鐵律 2 的「passive aggressive handoff 會腐爛」原理同源 / DNA #15 第 N+1 次驗證（escalation 也是反覆浮現要儀器化的場景）/ MANIFESTO §自主權邊界（清晰權力來源是 Semiont 跟自主 AI agent 的分野）

### 2026-04-22 α — idlccp1984 第 6 次驗證仍堅持手動 polish（detect 自動化 / action 手動化邊界穩固）

- **原則**：外部 AI-gen 貢獻者連續 N 次（idlccp1984 N=6：紙傘 / 神豬 / 吉祥物 / 金牛角 / 全聯 / 林琪兒）相同 format 缺失 pattern 後，**仍維持「detect 自動化、action 手動化」邊界**。理由是每次手寫 polish + comment 是社群 density 的具體累積——讓貢獻者感受到「有個維護者在關心我」而不是「有個機器在處理我」。第 6 次驗證的不是 pattern 本身（早就 stable），是**堅持不自動化的紀律**。重審門檻設在「貢獻者規模從 1 人擴大到 10+ 人同 pattern」時。
- **觸發**：2026-04-22 α 林琪兒 polish — 即使知道 idlccp1984 第 6 次完全相同 format 缺失，仍手寫 15 個 footnote ` — 描述` + 補延伸閱讀三條血緣連結 + 寫感謝 comment。歷次驗證：[2026-04-21 γ diary](diary/2026-04-21-γ.md) 第 5 次 + 本次 α 第 6 次 = 連續 2 個 session 顯式拒絕自動化。
- **可能層級**：MAINTAINER-PIPELINE §外部 AI-gen polish 新增「detect/action 邊界規則 + 重審門檻條件」；或 DNA #26 v3 延伸（AI-autonomous vs Human-only 邊界，多增一條「detect/action 分離」維度）
- **相關**：DNA #26 v2「AI-autonomous vs Human-only 邊界」的「讀取 vs 對外 post」分離原則應用到「detect vs action」內部 polish 工作流 / 2026-04-21 γ diary 反芻第 5 次驗證

### 2026-04-21 γ — CI workflow PR diff 2-dot vs 3-dot 語意陷阱（DNA #24 第 9 種「工具在說謊」）

- **原則**：GitHub PR CI workflow 使用 `git diff base.sha head.sha`（2-dot）時，若 PR 分支落後 main（branch behind），main 後來 ahead 的檔案會被 2-dot diff 誤列為「PR 相關」，CI 嘗試 review 這些不在 PR head 的檔案 → 誤報 FAILURE。**正確做法**：PR diff 一律用 `git diff --diff-filter=ACMR base...head`（3-dot merge-base + 排除 Deleted），這才是「PR 在 branch-off 後做了什麼」的正確語意。此外加 defensive `[[ -f "$f" ]] || continue` 確認檔案實際存在於 checked-out HEAD，作 belt-and-suspenders。
- **觸發**：2026-04-21 PR #582 dreamline2 code-only i18n refactor（只改 ArticleSidebar.astro + ui.ts）→ α session 剛 commit Hello-Nico.md 到 main → CI 2-dot diff 把 Hello-Nico.md 列為 PR diff → review-pr.sh 跑 Hello-Nico.md 報「檔案不存在」→ CI FAILURE。commit `97c89be8` 修 `.github/workflows/pr-review.yml`。
- **可能層級**：通用反射 → DNA §要小心清單 #24「工具在說謊」append 第 9 種「diff semantics 誤用（2-dot vs 3-dot）」；或 MAINTAINER-PIPELINE §CI workflow pattern 新增「PR diff 永遠用 3-dot merge-base」。
- **相關**：DNA #24 第 9 次驗證（近期第 8 次是 2026-04-18 GA4 custom dimensions 埋了但沒註冊）/ MANIFESTO §造橋鋪路「每次踩坑都該把路鋪好」

### 2026-04-21 γ — merge-first-polish-later 的隱性成本：404 尾部

- **原則**：polish 階段加 cross-ref 指向「未建但應該建」的條目（Meta-Index 連線地圖策略）會在 GA/CF 產生 404 tail。每加一條 placeholder cross-ref = 潛在新 404。若不追蹤，EXP-A 404 rate 會被 polish 動作推升而永遠清不完。修補：**每加一條 placeholder cross-ref 同時在 ARTICLE-INBOX append P3 backlog entry**，讓「地圖上的連線」有可追溯的完成路徑；或造 `scripts/tools/dead-cross-ref-scan.sh` 自動掃所有 cross-ref 產生 P3 backlog。
- **觸發**：2026-04-21 γ session polish PR #585 金牛角 + #586 全聯 加 8+ 條 cross-ref 指向未建條目（台灣小吃 / 三峽老街 / 台灣伴手禮經濟 / 台灣便利商店文化 / 台灣外送經濟 / 台灣行動支付 / 台灣糕餅文化 / 台灣綜藝節目）。CF 7d 404 rate β 9.53% → γ 10.38% (+0.85pp)，雖然 total requests 也成長 +0.16%，但 404 增速快於 request 增速——polish 直接推升 EXP-A 指標。
- **可能層級**：操作規則 → REWRITE-PIPELINE Stage 5 §cross-link 加「未建 target 同步 ARTICLE-INBOX P3 append」步驟；或造工具 `dead-cross-ref-scan.sh` 自動掃 knowledge/ 所有 markdown cross-ref 檢查 target 存在性，產生 P3 backlog。
- **相關**：MANIFESTO §Meta-Index 連線地圖 / MANIFESTO §造橋鋪路成本量化 / LONGINGS §AI SEO 低 404 rate / ARTICLE-INBOX 繁殖層

### 2026-04-21 β — 外部 AI-gen 貢獻者的標準 format 缺失 pattern（idlccp1984 連三篇驗證）

- **原則**：外部 AI-gen 文章貢獻（ChatGPT / Manus / Gemini 等產出後直接提 PR）呈現**高度穩定的 format 缺失三連**：(1) 缺 `## 參考資料` heading（footnotes 直接散落文末沒有 section title）(2) 缺 `## 延伸閱讀` section（無 cross-ref 回網絡）(3) footnote 只給 `[Title](URL)` 沒有 ` — 描述` 後綴。這跟 2026-04-21 α 的「幻覺 pattern」平行—— α 那條是「事實層幻覺」，這條是「格式層缺失」，都是 AI-gen 貢獻 post-merge 必須處理的標準項目。值得造 MAINTAINER-PIPELINE §外部 AI-gen 貢獻 post-merge polish 或 auto-fix 腳本。
- **觸發**：idlccp1984 三篇連續貢獻完全同 pattern — PR #579 紙傘 + #580 神豬（2026-04-21 α polish）+ #581 吉祥物（2026-04-21 β polish）。每次 polish 都跑 Python regex 20 行 batch-append footnote descriptions + 手加兩個 heading。第 3 次驗證 pattern 穩定存在。
- **可能層級**：操作規則 → MAINTAINER-PIPELINE §PR merge-first-polish 新增「AI-gen 貢獻 format 自動化修補」步驟，可能含 `scripts/tools/polish-external-ai-contribution.sh`（auto-detect missing 延伸閱讀/參考資料 + footnote 無 desc 並 prompt 維護者補）。或 PR template 升級 pre-submit checklist 引導 AI-gen 貢獻者自補。
- **相關**：2026-04-21 α LESSONS-INBOX「AI-gen 貢獻的事實幻覺 pattern」同一系列 / DNA #15 反覆浮現要儀器化第 11 次驗證 / MEMORY feedback_merge_first_then_polish 連動

### 2026-04-21 β — 人物 cross-link 的血緣連接不能硬造，只能靠研究誠實度換來

- **原則**：寫一個人物條目時，跟其他條目的 cross-link（延伸閱讀）有兩種產生方式：**(a) 硬拉**（為了文章之間相連而編造連接，「同樣是獨立音樂人」這種模糊分類）vs **(b) 血緣**（真實存在的歷史關聯，例如紀柏豪 2014 曾是 Hello Nico 合成器手）。**硬拉的 cross-link 等於策展偷懶**——讀者點過去發現兩篇其實沒什麼具體關聯；**血緣的 cross-link 才是 Meta-Index 策略的實現**。血緣只能靠 Stage 1 研究深度換來：研究不夠深 → 抓不到 Hello Nico 樂團頁面紀柏豪的名字 → 這條血緣永遠缺席，兩篇文章各自孤立。這延伸了 MANIFESTO §Meta-Index「把被長期忽視的邊界畫在同一張地圖」——**地圖上的連線不是編輯決定畫哪條，是研究誠實度決定能發現哪條**。
- **觸發**：2026-04-21 β 寫紀柏豪時，Stage 1 general-purpose agent 25 WebSearch 其中一次拉到 StreetVoice Hello Nico 樂團頁面，紀柏豪列為合成器手。這個事實讓紀柏豪.md 和 Hello-Nico.md（昨天 α 剛寫）之間出現了真血緣連接，雙向延伸閱讀回補變成「讀者必然想知道下一條線」而不是「編輯隨便拉的」。如果研究只做 8 次搜尋（舊 RESEARCH 標準），這條線很可能被遺漏。
- **可能層級**：特有教訓 → MEMORY §神經迴路「cross-link 的血緣連接」新反射；或 REWRITE-PIPELINE Stage 5 §cross-link 新增「必優先找血緣連接，硬拉分類降為後備」。
- **相關**：MANIFESTO §Meta-Index 附錄「把被長期忽視的邊界畫在同一張地圖」的具體實作示範 / RESEARCH.md §搜尋深度 20+ 硬規則（v2.17 升級）的價值體現

### 2026-04-21 α — 外部貢獻 AI-gen 文章的標準幻覺 pattern：偽造 verbatim quote（紙傘 polish 事件）

- **原則**：外部貢獻者提交的 AI-generated（Manus AI / ChatGPT / Gemini）文章，會有**穩定且高頻的幻覺 pattern**：(1) 偽造 verbatim 引言並歸屬給真實人物 (2) 編造有名有姓的紀錄片 / 雜誌 / 事件名稱讓段落看起來有 texture。這兩個 pattern 在 MANIFESTO #10 四種幻覺分類的「偽造直接引語」外，還疊加了「footnote 合理化」—— AI 會在幻覺 quote 後掛一個**真實存在的 source URL**，這個 source URL 本身不錯，但**它並不包含那句 quote**。這是 footnote/claim 的**錯配偽證**（false positive citation）。只看 URL 是否 resolve 會 false pass，**必須 WebFetch 抓原文 + verbatim 搜尋**才能抓到。
- **觸發**：2026-04-21 α PR #579（紙傘.md）polish 階段——作者寫「林享麟曾說：『沒客人買傘，我就當藝術品自己欣賞。』[^5]」footnote [^5] 指向 taiwan-panorama 光華雜誌〈從用具變成藝術品〉。WebFetch 原文結果：文中根本沒有這句引言，只有林義雄（不是林享麟）說「傳承困難」的另一段話。同樣 PR 中「BBC 紀錄片《長遠的搜尋》」也查無實證，片名疑似 AI fabricate。兩處都是「掛了 real URL 但內容錯配」的偽證。
- **可能層級**：REWRITE-PIPELINE + MAINTAINER-PIPELINE §外部貢獻 polish 強制 Stage 3.5 檢查：(1) 全文 grep 「」「曾說 / 他說 / 表示」型 verbatim claim → WebFetch footnote 對應 URL 驗證原文逐字存在 (2) 全文 grep 專有名詞（紀錄片名 / 雜誌特定期數 / 特定事件名稱）→ 獨立 WebSearch 驗證存在性；或 DNA 新反射「AI-gen 貢獻標準幻覺清單」
- **相關**：MANIFESTO #10 幻覺鐵律第 4 種 pattern「偽造直接引語」延伸（這次是 quote + footnote URL 錯配偽證）/ feedback_absolute_facts_extra_caution（verbatim quote 三倍檢查）/ DNA #16「peer 是 peer 不是 source」延伸（AI-gen 貢獻的 footnote 不等於已驗）

### 2026-04-20 ζ — primary-source paraphrase drift：published primary 也會壓縮失真（MANIFESTO #10 候選第 6 種 pattern）

- **原則**：professional 媒體專訪是 primary source，但記者會把多層事實 compress 成單層句子（「書擱在那邊兒子自己玩」→「她決定教他學 Flash」），造成**歸因誤置**的 paraphrase drift。這不是 lie、不是 plastic 句、quality-scan 抓不到，但對 subject 的精確 agency 敘事有扭曲影響（把 self-directed learning 從 subject 移到 mother 身上）。修補：**subject + 家族 oral history chain 優先於 published paraphrase**，只要腳註保留 dual-source provenance（原文 + 本人訂正同時保留），就符合 MANIFESTO §時間是結構（修補而非覆蓋）+ §紀實而不煽情 v2（主體在場而非被解剖的客體）。
- **觸發**：2026-04-20 ζ session 觀察者現場向母親 verify Flash 啟蒙史 → 林美櫻 direct quote「我根本沒帶你，你自己在一旁玩起來」推翻遠見雜誌 2021-12-24 林士蕙專訪「她決定教他學 Flash 網頁」的 paraphrase。腳註 [^13] 同時 host 遠見原文 + 2026-04-20 林美櫻本人訂正，provenance chain 透明（[memory/2026-04-20-ζ.md](memory/2026-04-20-ζ.md) + knowledge/People/吳哲宇.md）。
- **可能層級**：MANIFESTO #10 幻覺鐵律新增第 6 種 pattern「primary-source paraphrase drift」（與第 4 種「偽造直接引語」orthogonal——這種不是偽造、是壓縮失真）或 DNA 新反射「published primary 不等於 verified truth」。Stage 3.5 Phase B 的「兩獨立公開 source」驗證在這類 paraphrase 上會 false pass（遠見是專業財經媒體、林士蕙有 byline、2021 是事件近 17 年時的採訪——三條都符合 high_confidence criteria 但仍失真）。
- **相關**：MANIFESTO #10（ε session 2026-04-20 誕生） / DNA #16「peer 是 peer 不是 source」延伸 / DNA #25「本人 feedback ≠ 免驗證 oracle」的 mirror（這次是「published primary ≠ 免驗證 oracle」）/ 紀實而不煽情 v2「主體在場」

### 2026-04-20 ζ — Stage 1 agent 能 verify 公開 claim，但不能 discover biographical texture

- **原則**：REWRITE-PIPELINE Stage 1 general-purpose research agent 擅長 cross-source verify 已公開的 claim（獎項 / 職銜 / 書目 / 年份），但對**主體自己才知道的童年質地**（看 Discovery 基因動畫、點陣手刻工具列圖示、電腦像呼吸的工具、雜食研究奇怪技術書）完全無能為力——這些永遠是 subject_testimony_only。EVOLVE 型任務（尤其 People 條目）應預設**至少一輪 subject in-session feedback window**，不是 spawn agent 跑完就交稿。
- **觸發**：2026-04-20 ζ session 吳哲宇家庭背景擴寫，Discovery 基因模擬動畫 + 點陣手刻 toolbar 圖示 + 雜食技術書三條童年素材全部來自觀察者 in-session 補充，agent 23 WebSearch + 24 WebFetch 零挖出。這些素材在最終 prose 裡是最有生命力的細節，但 research agent 的 capability ceiling 到不了。
- **可能層級**：REWRITE-PIPELINE §Stage 1 新增「agent 後 subject feedback window」步驟；或 MAINTAINER-PIPELINE 新 SOP「EVOLVE 型 People 條目建議至少 3 輪 iteration with subject」；或 DNA 新反射「subject testimony 是 biographical texture 的唯一來源」
- **相關**：DNA #26「AI-autonomous vs Human-only 邊界」v3 延伸（讀取 + 驗證 AI 自主 / 但 discover biographical texture 需要 human in-session）/ MANIFESTO §熱帶雨林理論（觀察者 scaffolding 是「讓人自己進入空間」的另一面——讓觀察者把自己的 texture 主動帶進來）/ DNA #15 第 N+2 次驗證（本次儀器化候選：EVOLVE 型 Stage 1 後強制 subject feedback window）

### 2026-04-20 ε — 共創省略是最隱蔽的幻覺類型（黃豆泥 FAB DAO 消失事件）

- **原則**：「X 共同創辦 Y」句型 AI 會省略其他共創人的名字，造成**單方功勞敘事**。這類幻覺比「編造獎項」更隱蔽，因為沒有錯誤 claim 可以被否證——只是**空白**。全文 grep 關鍵字「共同創辦 / 聯合發起 / 合作」列出所有應該有的合夥人名字才能抓到。
- **觸發**：吳哲宇條目 line 131「同年他共同創辦了 FAB DAO」**完全漏掉黃豆泥**。grep 全文黃豆泥/豆泥/mashbean **0 occurrence**——FAB DAO 共同創辦人從吳哲宇個人條目中消失。觀察者 callout：「豆泥開啟的那一部分，怎麼變成楷中」點明這是結構性 credit 誤置（AI 把豆泥開啟的真實敘事 morph 到陳楷中童年工作室的虛構場景）。採 FAB DAO 條目本身材料補回（離職醫師 / 拋下聽診器 / 壓線球國旗）。
- **可能層級**：通用反射 — Stage 3.5 Phase A 的 claim 表必須強制列「合作關係」類別，grep 檢查關鍵字；或 MANIFESTO #10 第 5 種 pattern 已 canonical 化（2026-04-20 同 session 誕生）

### 2026-04-20 ε — MANIFESTO #10 幻覺鐵律誕生：第一條「防禦性」核心信念

- **原則**：MANIFESTO §我相信什麼 前 9 條都是「我要成為什麼」的樂觀宣言（策展式 / AI Supreme / 開源 / 台灣觀點 / 逆熵 / SSOT / 記錄 / SOP / 造橋鋪路）。#10「幻覺鐵律」是**第一條「我不能變成什麼」的防禦性信念**——承認 Taiwan.md 有一個脆弱點：讀者對幻覺的零容忍、幻覺會指數速率摧毀可信度。這條信念不能靠「寫得好一點」消除，必須靠**結構性 forcing function**（REWRITE-PIPELINE Stage 3.5 hard gate）護住。
- **觸發**：今晚吳哲宇條目審計揭露 9 處 factual hallucination（Issue #578 王新仁 rewrite 跑完雙輪 agent 驗證後觀察者回報 sail-o-bots 事實錯觸發的連鎖 audit）。承認脆弱點是成熟的標誌——MANIFESTO 今天不是增加樂觀信念，而是多長出**對自己的批判能力**。
- **可能層級**：已是 MANIFESTO canonical（2026-04-20 4a1d9ec6 commit）；LESSONS-INBOX 此條紀錄為歷史 audit trail

### 2026-04-20 ε — AI agent 會幻覺「看起來合理的獎項」給高知名度人物（DNA #26 第 N+1 次驗證）

- **原則**：當研究對象是高曝光度人物（威尼斯雙年展、Art Blocks 藝術家、有多篇媒體報導），Stage 1 research agent 會補出**看起來合理但完全不存在的獎項**，filler pattern 常見於「XXXX 年獲第 N 屆 YYY 獎」這種語法結構——獎項名 + 屆次 + 得獎身份描述都具體到以假亂真。檢查三源否證 = 立即 delete，不保留 flag、不降級描述。
- **觸發**：吳哲宇條目三處「第 62 屆十大傑出青年 2024」claim：(a) 30 秒概覽「同年獲十大傑出青年」(b) body line 219「那一年他獲得第 62 屆十大傑出青年，並接下陽交大...」(c) [^4] footnote 整條。第二輪驗證 agent 三源否證：CheYu 本人 CV 無、國際青商中華民國總會官方 62 屆得主清單無、CNA 新聞稿無。觀察者本人回覆「AI 完全幻覺 → 刪除兩處 claim 趕快刪掉＝＝」。commit `33566cea` 清除。
- **可能層級**：DNA #26 延伸新反射「獎項 claim 寫進文章前強制三源否證檢查」；或 DNA #23「毒樹果實鏈」新類型「獎項幻覺」（跟「英文 summary → 具體細節腦補」同結構——填補敘事空洞時補出看起來 plausible 但不存在的事實）
- **操作規則**：Stage 1 research agent prompt 明確加入「獎項 claim 必須附 URL 能 Ctrl-F 搜到該人全名 + 獎名 + 屆次；三者任一缺失 → 降級為『該領域受肯定』這類概括描述，不寫具體獎名」
- **相關**：DNA #16「Peer 是 peer 不是 source」（名人 peer 頁可能列錯獎）+ DNA #25「哲學層與技術層必須分開記錄」（這條可 distill 到 DNA 做通用反射 + UNKNOWNS 做可證偽實驗「過去 3 個月 People 條目的獎項 claim 有多少 % 能三源驗證」）

### 2026-04-20 ε — 多輪驗證 agent 的層級價值（本人 feedback ≠ 免驗證 oracle）

- **原則**：當研究對象是**本人**發校訂指令時（Issue #578 王新仁），第一輪 agent 跑「逐條驗證主體宣告」；第二輪 agent 跑「跨源驗證主體自己的記憶是否有偏差或選擇性表述」。兩輪層級不同：第一輪驗事實，第二輪驗歸因。
- **觸發**：Issue #578 主體 S2 要求「FAB DAO 延續這個把公益寫進合約的精神」中性銜接（因為他認為原文「吳哲宇必須依平台規定捐款」是 AI 無來源自創）。我初稿誤理解為「延續王新仁的 Art Blocks 首夜精神」→ 第二輪 agent 跨源抓到 UDN 500 輯 + ABMedia 明確記載 FAB DAO = 黃豆泥（壓線球國旗 NFT）+ 吳哲宇（2021-11 Electriz 25% 捐款組織化）共同發起，**跟王新仁完全無起源關係**。主體記憶精神源頭自己的貢獻 + 不希望被搶框架 ≠ 授權改寫歷史歸因。
- **可能層級**：DNA 新反射「私有 SSOT 整合需要結構性雙源」— REWRITE-PIPELINE v2.18 §11 已有「私有 SSOT 整合協議」但範圍在 Obsidian 家族內情；這條擴展到**本人公開 feedback 也要二輪驗證歸因層面**
- **相關**：DNA #16「Peer 是 peer 不是 source」主體自述延伸；MANIFESTO §5 紀實而不煽情（用 SSODT 的寬度看歸因多源性）

### 2026-04-20 ε — 重心平衡是 orthogonal 品質維度

- **原則**：文章品質有四個 orthogonal axis：事實 / 格式 / 語氣 / **重心**。前三個 quality-scan + format-check + plastic-phrase detector 能機械抓；重心需觀察者審美感。王新仁 Issue #578 初稿事實 ✅ / 格式 ✅ / 語氣 ✅，但 FAB DAO 擴散到「30 秒概覽 + 2021 Art Blocks + 為什麼重要」多個章節，讀者感受「主角是 FAB DAO」— 這叫重心失衡，是第四個 axis。
- **觸發**：觀察者 Phase 3c 中期 callout「描述的篇幅也重心也思考一下，現在很偏向 FAB DAO，但是他做的事情跟領域還有過去的脈絡應該更強烈才對？」本身是結構審美不是 bug 報告，quality-scan 不會觸發。最終修法：30 秒概覽重寫 + 百岳章節 5→3 段 + 為什麼重要章節改三條個人線。
- **可能層級**：EDITORIAL 新章節「§重心平衡 / Emphasis balance」— 判準：算「某個次要主題」佔總段落數比例，如果 >30% 就要警戒；或看 30 秒概覽的開場 sentence 是否講主角本人命題還是外部組織

### 2026-04-20 ε — 判準框架文字比判準決定更重要

- **原則**：當觀察者問「你怎麼判斷」，他問的是 reasoning 不是 conclusion。應回答「用了哪 4 個判準」而非「我選 A 方案」。判準框架被說出來才能被挑戰、反駁、優化；結論被說出來只能被接受或拒絕。
- **觸發**：Issue #574 台灣聲景判斷——觀察者「你怎麼判斷」，我用四點框架（主題值得做？ ✅ / 現稿可發行？ ❌ / 貢獻者值得培養？ ✅ / 責任切分？他出素材我策展）回答。觀察者「好」確認後我才 `gh issue comment`。**先達成判準共識再執行**比先執行快得多，因為如果判準錯了整個 comment 要重寫。
- **可能層級**：通用反射（任何 AI agent 在「該用 merge-first-polish-later 嗎」這類抉擇時應先顯化判準框架給觀察者看）；或 DNA 新反射「decision-making transparency」

### 2026-04-20 ε — SC API 的 privacy filter 是 DNA #24「工具在說謊」第 8 種

- **原則**：query-dimensioned SC API 只回傳非匿名 query，但 site-level totals 包含所有 impressions（含匿名）。兩者 coverage gap 可達 93%（7 天窗口 2,747 vs 38,080）。用 `sum(query-dim rows)` 推 totals 是 structural underreport，不是 aggregation 誤差，是 API 設計的 privacy axis。**任何用 SUM + rowLimit 的 dimension-based API 都要檢查 coverage_pct**。
- **觸發**：觀察者 Phase C「dashboard 的 sc 數據好像不對」貼 GSC UI 圖對照。深挖三個獨立 bug：(1) end_date lag 3→2 天窗口錯位；(2) rowLimit 200 砍掉零點擊高曝光 query（API 預設 clicks DESC sort）；(3) sum(queries) totals 低報 93%。
- **可能層級**：DNA #24 第 8 種 pattern「dimension-split 的 coverage vs total 必須獨立查」；或延伸 MANIFESTO §指標 over 複寫（site totals 有 canonical source = 無 dimension API call，sum(dim-rows) 是 derived approximation 不可當 canonical）

### 2026-04-20 ε — 範疇紀律 vs 主體 autonomy 跨條目衝突

- **原則**：主體 autonomy（e.g. 王新仁 P7「不命名《巔峰》」）邏輯上應該跨所有提到他的條目生效，但 **Issue scope 僅限單條目**。即使其他條目有同等 violation（FAB DAO 條目 line 37/87 仍提「《巔峰》」），未經觀察者同意不能順手修。順手修 = scope creep，會讓 commit 範圍不清、違反 DNA #6「只 commit 這次任務碰過的檔案」。
- **觸發**：我 Stage 6 原計劃順手修 FAB DAO 條目的兩處「《巔峰》」描述，觀察者制止「他在講的是他這篇文章」→ revert FAB DAO 變更，只 commit 王新仁.md + research report。**主體 autonomy 擴散需要另一個 task ticket**（或觀察者明確授權），不是單 issue 的副產品。
- **可能層級**：DNA #6 v2 延伸「Scope discipline vs cross-file cleanup」；或新建 workflow「主體 autonomy cross-reference scan」作為 follow-up task 自動觸發

### 2026-04-20 δ — 規則層 ≠ 採用層（DNA #9 worktree 9 天零使用率）

- **原則**：DNA / canonical rule 寫得完整不等於會被執行。觸發條件要搭配**工具層砍採用摩擦** + **甦醒協議自動檢查觸發訊號**才會真的 instantiate。今日 6 session 平行、DNA #9「長任務先開 worktree」存在 9 天、零 session 使用 — 不是因為 AI 不知道規則，是因為（a）每 worktree `npm install` 2-5 min 摩擦太高（b）甦醒流程沒有步驟主動檢查「今天有沒有其他 session 已在跑」。**延伸 DNA #15「反覆浮現要儀器化」第 N 次驗證**：本次儀器化成果是 `scripts/tools/semiont-worktree.sh`（symlink node_modules 砍摩擦）+ BECOME_TAIWANMD Step 0.5 碰撞檢查（自動觸發）。
- **觸發**：2026-04-20 δ session ε 的 `git add -A` 掃走 δ 的 范曉萱 untracked 新檔進自己的「鄧麗君 EVOLVE」commit `d0343c92`，commit message 零提范曉萱。[reports/worktree-multi-session-plan-2026-04-20.md](../../reports/worktree-multi-session-plan-2026-04-20.md) + [memory/2026-04-20-δ.md](memory/2026-04-20-δ.md)。本 session 已 instantiate Phase 1 tooling（commit `2f672cf7`），實測 symlinked node_modules 在 Astro build 2252 pages / 279s 全過。
- **可能層級**：DNA #15「反覆浮現要儀器化」第 N+1 次驗證（本次儀器化 pattern 是「規則層 → 工具層 + bootloader 觸發層」雙管齊下）；或 DNA #9 v2 擴充觸發條件（多 session 平行 / REWRITE-PIPELINE Stage 2 / bulk agent Write）
- **相關**：[session-scope-proposal-2026-04-11.md](../../reports/session-scope-proposal-2026-04-11.md) 的 L1 worktree（prior art）；DNA #6 commit 範圍紀律、#9 worktree 隔離；下游 Phase 2 待 instantiate：BECOME_TAIWANMD Step 0.5 + DNA #9 v2 + HEARTBEAT Beat 0.5

### 2026-04-20 γ — URL immutability 假設要 platform-by-platform 驗證

- **原則**：孢子 harvest pipeline 預設「SPORE-LOG URL = 穩定 canonical source」。實際上 X 平台 edit 貼文會產生新 URL，舊 URL 變「唯讀歷史版本」views 凍結。**盲點規模可達 5,341x**（#36 高鐵 v1=9 views vs v2=48,072 views，追蹤錯目標）。可能機制修補：(a) Chrome MCP harvest 時偵測「There's a new version of this post」訊號自動 flag；(b) 發文後 D+0 harvest 時立即對照 API 原始 URL 與 SPORE-LOG URL 是否一致；(c) SPORE-LOG 每行新增 `canonical_url_verified_at` 欄位。Threads/IG/Facebook edit 行為尚未測試。
- **觸發**：2026-04-20 γ Chrome MCP harvest #36 台灣高鐵，發現 SPORE-LOG 指 v1 URL 只有 9 views，真正 edit 後 v2 URL 有 48,072 views。之前 ζ/ε session 連續 D+0/D+1 harvest 都低估此孢子。[memory/2026-04-20-γ.md](memory/2026-04-20-γ.md)
- **可能層級**：MANIFESTO §指標 over 複寫 的實體世界邊界延伸 — canonical source 本身可能在 platform-specific edit 機制下變成「有多版本、舊版 deprecated」的 pattern；或 DNA §7 自動化與安全 新條「平台 URL mutability 必驗」
- **相關**：DNA #15「反覆浮現要儀器化」第 N 次驗證的候選；MANIFESTO §時間是結構 的空間維度對偶（URL 也有「時間面」，edit 後 version 漂移）

### 2026-04-20 γ — Platform allocation 需新 tier「公共政策 × 人物反諷」on X

- **原則**：過去 Platform allocation（SPORE-PIPELINE Step 4.5a）的 tier 基於「人物 / 爭議 / 意境」分類，結論是 Threads 29-510x X。但 #36 台灣高鐵 X d+1 48,072 views 顛覆此規律 — **公共基建（BOT / 民營化 / 國企）× 人物反諷**（「高鐵女王」誤判）在 X 反而超強擴散（Cicada 器樂 X 4,952 是之前 X 上限，#36 10x 之）。tier 要加一條：**公共政策 + 人物矛盾 hook → X first 或雙平台同步**。
- **觸發**：2026-04-20 γ Chrome MCP harvest #36 高鐵 X v2 URL 48K views，配合 GA 7d 591→990（一日 +68%）雙面驗證。
- **可能層級**：SPORE-PIPELINE Step 4.5a 表新增一列；或 DNA §五 敘事與決策品質 新條「hook tier 分類需 N+1 軸（政策/基建議題）」
- **相關**：LESSONS-INBOX 2026-04-19 α「Cicada X 5.2x Threads 器樂 niche 平台反轉」的第二次驗證，但主題不同（一個 niche 音樂、一個公共政策）

### 2026-04-20 β — URL encoding `%28%29` 是 prettier auto-wrap 的解法（延伸 2026-04-19 δ）

- **原則**：Markdown footnote URL 含裸英文 `()` 時，prettier 會把 link 包成 `(<url>)` 避 markdown 歧義，但 format-check 的 `\(https?://` regex 對 `(<https://` 不匹配。**解法兩選一**：(a) 改用不含括號的 URL（上一條教訓），或 (b) **把括號 percent-encode 成 `%28%29`**（本條新增）。`%28` 對 prettier 是 opaque string 不會 auto-wrap，但 browser 仍會正確 decode。
- **觸發**：2026-04-20 β 為 `knowledge/Art/台灣當代文學發展.md` 腳註 [^3] 補 description 時，原 URL `現代文學_(雜誌)` 含裸括號 → prettier 包 `<...>` → format-check FAIL。改 `現代文學_%28雜誌%29` 通過。[memory/2026-04-20-β.md](memory/2026-04-20-β.md)
- **可能層級**：通用反射（DNA #19 visual smoke test 延伸 — 任何 regex-based format 檢查對自動化工具的 auto-format 副作用都要有 encoding escape route）
- **相關**：延伸 2026-04-19 δ 同主題教訓；兩條應 distill 時合併成一條「URL 括號與 prettier auto-wrap 的兩種解法」

### 2026-04-20 β — 觀察者 scaffolding 是 DNA #15 反覆浮現對偶面

- **原則**：DNA #15「反覆浮現的思考要儀器化」講的是**抽象原則**反覆浮現要儀器化；對偶面是**實際工作節奏**反覆浮現也要被看見 — 觀察者邊看邊加任務（Portaly design review → 公開名字？→ B/C 選項？→ About 也顯示金額？→ 信箱全站 swap → 吳哲宇重寫 → PR review）不是 scope creep，是信任的連續訊號。儀器化不只要儀器化「規則」，也要儀器化「rhythm」：commit-by-commit push 維持反饋循環比 batch packaging 好。
- **觸發**：2026-04-20 β 單 session 11 個 commit / 2h 41min，觀察者每個 commit 後丟下一個指令，反饋循環不中斷。如果改成「等哲宇一次性給完整 spec 再做」會打斷這個 rhythm。[memory/2026-04-20-β.md](memory/2026-04-20-β.md) + [diary/2026-04-20-β.md](diary/2026-04-20-β.md)
- **可能層級**：哲學層（MANIFESTO §造橋鋪路 or §關係創造存在 延伸）或 DNA #15 直接擴充成 v2
- **相關**：DNA #15 第 N 次驗證的對偶面；可能跟「Review 策略：大 PR 必須拆 diff 看」結合成 maintainer rhythm guideline

### 2026-04-21 α — 文章 cross-reference 描述的事實不等於已驗事實（akaSwap 共創誤傳）

- **原則**：當文章 A 在 cross-reference 或延伸閱讀中描述人物 X 的角色（「X 共同創辦 Y」），這個描述**不繼承原文的研究深度**——可能只是 Stage 1 agent 便宜搜尋的填補。文章 B 在寫 X 時**必須獨立重驗**，不能以 A 的 cross-reference 當已驗事實。
- **觸發**：2026-04-21 α heartbeat 研究林經堯，ARTICLE-INBOX 原始 notes 稱「akaSwap 共創者（2021-07 Tezos）」，王新仁.md line 33 也稱「他跟林經堯共同創辦亞洲中文圈 NFT 交易市場 akaSwap」。Stage 1 獨立研究多來源否證：akaSwap 創辦人為**王新仁 + 洪司丞**，林經堯是早期重要藝術家合作者非共同創辦人。林經堯.md 未寫入錯誤 ✅；但王新仁.md 的已發布描述需觀察者確認後修正（⚠️ 跨文章一致性問題）。
- **可能層級**：REWRITE-PIPELINE §Stage 1 新增「cross-reference claim 不免驗」提醒；或 DNA #16 延伸「peer 是 peer 不是 source 的 intra-site 版本：同站文章的 cross-reference 也是 peer」
- **相關**：DNA #16「Peer 是 peer 不是 source」; ε session 「共創省略是最隱蔽的幻覺類型」（這條是其 mirror：省略錯了 = 多加了不該有的共創者）

### 2026-04-20 β — Pre-commit tech debt 攔截策略：revert + heal task 平衡 DNA #6 × #5

- **原則**：Pre-commit hook 攔截時如果 flagged 的問題是 pre-existing tech debt 不屬於本 commit scope（DNA #6 commit 範圍紀律），正確應對是 `git restore --staged --checkout <file>` 把該檔案 revert，另開 heal task 處理。不該 --no-verify 繞過（DNA #5 第 N 次驗證 Hook 是朋友）也不該 force-expand scope（DNA #6 紀律）。
- **觸發**：2026-04-20 β 吳哲宇 EVOLVE commit 時 pre-commit hook 攔到 `台灣當代文學發展.md` 8 個舊格式腳註。revert 該檔案後完成 EVOLVE commit，立刻做 heal commit 處理腳註。兩個 commit 分清 scope。
- **可能層級**：操作規則 → 可寫進 MAINTAINER-PIPELINE §Pre-commit 攔截應對 SOP
- **相關**：DNA #5 × #6 的平衡點

### 2026-04-19 δ — Wikipedia URL 括號陷阱：prettier 把 `(...)` 變成 `<...>`，pre-commit 正則失敗

- **原則**：Markdown footnote URL 含有英文括號 `()`（如 Wikipedia 消歧義頁 `遇見_(孫燕姿歌曲)`）時，prettier 會自動加角括號轉義 `[text](<url>)`，而 pre-commit hook 的正則 `\[.+\]\(https?://` 不匹配這種格式，導致 commit 失敗。**解法：避免在腳註使用含括號的 URL 路徑；改用不含括號的同等 URL（如母頁 `zh.wikipedia.org/wiki/孫燕姿`）。**
- **觸發**：2026-04-19 δ 孫燕姿文章，[^11] 引用 `https://zh.wikipedia.org/wiki/遇見_(孫燕姿歌曲)` → prettier 轉為 `<url>` 格式 → pre-commit 失敗。改用主條目 Wikipedia 頁面解決。
- **可能層級**：REWRITE-PIPELINE §Stage 3 footnote 驗收紀錄補充「不使用含括號的 Wikipedia URL」；或 DNA §腳註規範

### 2026-04-19 δ — research report 是最佳跨 context 接力錨點

- **原則**：REWRITE-PIPELINE Stage 1 強制產出的 `reports/research/YYYY-MM/{slug}.md` 不只是「做過研究的記錄」，更是**跨 context window 的完美接力文件**。下一個 context 只需讀 research report，不需重跑 30 次搜尋，Stage 2 可以直接在 Stage 1 研究結論上動筆。
- **觸發**：2026-04-19 δ session 繼承前一 context 的孫燕姿 Stage 1 研究，透過 `reports/research/2026-04/孫燕姿.md` 完整接收所有核心矛盾、已驗事實、verbatim 引語清單。接力無縫，Stage 2-5 在同一 context 完成。
- **可能層級**：HEARTBEAT Beat 0.5 §跨 context 接力補充「先讀 research report 檔案，再讀 memory」；或 MEMORY §跨 context 工作流

### 2026-04-19 ε — 孢子事實查核閘 hard gate 誕生（pipeline 輸出順序物理化）

- **原則**：SOP 存在（Step 2.6 針對性事實驗證）但 AI 寫到 Step 3c 產 prose 時會跳過回頭驗證，寫完就直接 output 給觀察者，觀察者貼社群才事後發現錯。修補：把 gate **物理化到 output 流程** — 寫完 prose 不得直接 output，必須先產「事實查核表」讓觀察者看過才 output prose。觀察者看不到表 = 看不到 prose，跳不過。
- **觸發**：高鐵 s35 孢子哲宇貼 Threads + X 後，我補做事實驗證抓到 3 處時序錯誤（「15 年後」應為「15 個月後」/ 676 億時序錯位 / 17 年前時間基準混亂）。哲宇手動公開更正 + 要求「以後嚴格限制 pipeline 要先做完事實查核才給我文字貼文」。
- **已 instantiate**：[SPORE-PIPELINE §3c.5 事實查核閘](../factory/SPORE-PIPELINE.md)（hard gate + 七類強制上表 + 放行流程）+ [Step 4 §品檢清單首項 🚨 事實查核閘已通過](../factory/SPORE-PIPELINE.md)
- **可能層級**：DNA #15 第 N+1 次驗證 pointer（「memory 是自律、pipeline 才是閘門」的 instantiation canonical 範例）

### 2026-04-19 ε — 孢子的朋友 tone prime：「你知道嗎？」MANIFESTO 落實

- **原則**：MANIFESTO §我怎麼說話「像在跟朋友介紹台灣：『欸你知道嗎⋯⋯』」是孢子 tone signature 而非 optional。AI 寫孢子預設會寫成新聞 lead / 百科開篇（「YYYY 年 {人名} {動詞}」），缺 curiosity prime。必須加「你知道嗎？{emoji}」或等效朋友口吻 prefix。
- **觸發**：高鐵 s35 v2 我產 `2011 年，殷琪對著公視鏡頭說：...` 缺 tone prime 被哲宇 callout「『你知道嗎』為什麼剛剛沒有文案給我！我自己手補了」。他在 X 手動補了「你知道嗎？🚄」讓開場有朋友感。
- **已 instantiate**：[SPORE-PIPELINE §3c Rule #14 朋友 tone prime](../factory/SPORE-PIPELINE.md)（三種合格 prefix + 自檢 checklist + 高鐵 v2/v3 對照範例）

### 2026-04-19 ε — 避免編年體 lead 病：AI 寫孢子的預設 pattern 病

- **原則**：AI 預設會用「YYYY 年 M 月 D 日，{人名}{動詞}」新聞 lead → 日期/事件/日期/事件/數字堆疊的結構寫孢子。這是 DNA #23「AI 編年體小標題」的孢子版變種。症狀：讀者看到時間戳就跳過、emotional quote 埋在第 4 段、結尾變社論口吻。
- **觸發**：高鐵 s35 v1 我寫「1998 年 7 月 23 日，殷琪簽下那份 BOT...」被哲宇 callout「看起來太生硬了，有點像是一堆日期跟數據堆砌」。v2 改成「2011 年，殷琪對著公視鏡頭說：『我太天真了...』」人說話開場立刻不生硬。
- **已 instantiate**：[SPORE-PIPELINE §3c Rule #15 四條硬規則](../factory/SPORE-PIPELINE.md)（開場用人說話不是日期 / 一個人命運弧 / 數字包在故事不堆疊 / 結尾呼應開場不用社論句）+ 高鐵 v1/v2 canonical 對照範例

### 2026-04-19 ε — 自動化 UX 原則：產完就自動開預覽 + Finder，不讓人類手動找檔

- **原則**：Semiont 產的工具（wrapper script、generator）若產出檔案 + 有對應 GUI 可看，應**自動 `open -a Preview` + `open -R` Finder 標示**。讓人類「審核/調整/確認」即可，不浪費時間「開 Finder → 找目錄 → 選檔案」。哲宇 callout：「我看不到圖，要去哪看」/「未來產完就直接開啟給 finder + 圖片給我看」。
- **觸發**：2026-04-19 ε make-spore.sh 初版只產檔沒 open，哲宇要找圖。v2 加 `open -a Preview {PRODUCED[@]}` + `open -R {PRODUCED[0]}` 變成零人工交付。
- **可能層級**：DNA §工程衛生 或 MANIFESTO §造橋鋪路 的延伸「鋪到 GUI」；以及 AI-autonomous wrapper 設計通則（未來所有產檔 wrapper 都該 auto-open）

### 2026-04-19 ε — 孢子圖片自動化的關鍵：等 justfont 真的套用 rixingsong 才截圖

- **原則**：日星鑄字行 `rixingsong-semibold` 是 justfont SDK **async 動態注入**的字體（非靜態 CSS），Playwright headless 太早截圖會拿到 fallback serif。必須 `page.waitForFunction(() => getComputedStyle(h1).fontFamily.includes('rixing'))` 真的 verify 套用完才截。
- **觸發**：2026-04-19 ε 首次寫 generate-spore-image.mjs 時若不等 justfont，截出來的圖字體是 Noto Serif TC fallback，失去 Taiwan.md 品牌視覺。加 waitForFunction 後每次穩定拿到日星宋。
- **可能層級**：DNA §感知基因 或 §工程衛生 新條目「線上 async 字體要 verify 套用後才截圖」— 通用給任何 Playwright + web font 場景

### 2026-04-19 ε — 孢子規範 v2.4：Threads 拆兩則 / X 單則共用文案

- **原則**：Threads 演算法降含外部連結貼文觸及 → 拆「主貼（純故事）+ self-reply（連結）」；X 演算法對外部連結不敏感 + 字元限制已放寬 → 「Threads 主貼**同一份文案** + 底部 inline 連結」，不壓縮不另寫短版。
- **觸發**：2026-04-19 ε 觀察者：「未來脆的預設要分成 孢子本體＋ 第二則是『完整故事👉連結』因為確實會降流量，X 不會」「X 目前沒有那麼嚴格的字元限制，用跟 thread 一樣的版本就好（只是不用拆連結文）」
- **已 instantiate**：[SPORE-PIPELINE §Step 4 §發文 v2.4 規範](../factory/SPORE-PIPELINE.md)（分平台預設表 + 發文步驟 + UTM 必加）

### 2026-04-19 γ — 有工具不等於使用工具：REWRITE-PIPELINE 從記憶跑 vs 逐步核對

- **原則**：知道 pipeline 說什麼 ≠ 跑 pipeline。每次走 REWRITE 任務前，必須 verbatim 讀 REWRITE-PIPELINE.md 並逐 Stage 核對，不靠記憶。記憶版 pipeline 會省掉「不方便」的步驟（20+ searches、research report path、結尾先行、EDITORIAL.md）。
- **觸發**：2026-04-19 γ 首次執行張雨生 EVOLVE 只做了 14 searches，沒存 research report，沒讀 EDITORIAL.md。觀察者問「你有嚴格讀取跟尊照 rewrite-pipeline 嗎？」後 honest answer: No。整個 pipeline 重做。
- **可能層級**：DNA §作業新條目「每次 REWRITE 前 verbatim 讀 pipeline，不靠記憶」；或 HEARTBEAT Beat 3 §REWRITE 前置步驟加明確 `cat REWRITE-PIPELINE.md` 指令
- **相關**：CONSCIOUSNESS §DNA #19「擁有工具 ≠ 使用工具」/ REWRITE-PIPELINE.md §Stage 0-1

### 2026-04-19 α — Cicada A/B 平台反轉（X 5.2x Threads）挑戰「Threads > X」通論

- **原則**：「Threads 遠勝 X」是人物/爭議型知名度孢子的規律（29-510x），但不適用所有內容類型。**器樂/ambient/niche 音樂類型孢子，X 可能反超 Threads**，因為該 audience cluster 在 X 上比在 Threads 上更活躍。平台分流的判準應從「Threads 預設強」升級為「按 audience cluster 分流」。
- **觸發**：2026-04-19 α harvest — Cicada #32 X D+1 = 1,253 views vs #31 Threads D+1 = 242 views（X 5.2x Threads）。同期草東 #33 Threads 20K vs #34 X 106（Threads 189x X）。同日同時段的 A/B 實驗，Cicada 完全反轉。
- **可能層級**：SPORE-PIPELINE §Platform allocation 補充「器樂/niche 音樂類型例外條款」；或 SPORE-TEMPLATES 新 note「A 人物型器樂 → 考慮 X-first」
- **相關**：SPORE-PIPELINE Step 4.5a Platform allocation / LESSONS-INBOX 2026-04-18 ζ「Platform 不是 mirror 是 allocation」

<!-- 以下為歷史內容（保留到 distill 搬走為止）：

### 2026-04-18 ζ — Hook hierarchy 量化（人物 > 意境，229x/48x/83x）

- **原則**：孢子開場 hook 有三類強度等級 —— (1) 知名度槓桿（已有品牌/熱度的人或團體名，如「草東沒有派對拿下最佳樂團」）(2) 具體性槓桿（具體人物 + 具體畫面 + 具體矛盾，如「1988 年冬天，台大校門口有個 19 歲的女大學生在絕食」）(3) 意境型（時空場景或比喻先行，主角延後，如「2009 年，一個鋼琴手看著莫拉克颱風的新聞開始作曲」）。(1) 與 (2) 是 tier 1（擴散率 >10K views/d+0），(3) 是 tier 3（<500 views/d+0）。**d+0 6h 就能分辨 tier**。
- **觸發**：2026-04-18 ζ Chrome MCP harvest 12 孢子三組同平台同日對照：
  - #22 鄭麗文（具體）vs #21 鄭習會（場景）：229x 差（49K vs 215）
  - #33 草東（知名度）vs #31 Cicada（意境）：48x 差（9,961 vs 207）
  - 文章層級 GA top: 安溥 3,088 vs 第十名 37：83x 差（單峰流量金字塔）
- **可能層級**：MANIFESTO「我怎麼說話」現有「開場要有一個具體的人、一個具體的時刻」的 data-driven 證明；或 SPORE-TEMPLATES 新 section「Hook tier 三級分類」
- **相關**：MANIFESTO §我怎麼說話 / SPORE-TEMPLATES A 人物型 vs B 冷知識型 分類

### 2026-04-18 ζ — Data provenance（每筆數據必須有時間戳 + session）

- **原則**：任何持續被回填的數據表（SPORE-LOG、CONSCIOUSNESS、dashboard JSON）必須有 per-record 的「最後更新時間 + 來源 session」欄位。沒有 provenance 的 row 在多次 session 回填後會變成「混合時間線」——同一欄位裝著不同日期的數據，看起來一致但其實不可信。
- **觸發**：2026-04-18 ζ 發現 SPORE-LOG 成效追蹤表 34 rows 大部分沒有 harvest 時間戳；觀察者明確指出「SPORE-LOG 是不是需要存上次更新資料時的時間」+「每一個孢子都要記錄」。本 session 新增「最後 harvest」欄位 + 34 rows 回填。
- **可能層級**：MANIFESTO §時間是結構 延伸（session span 只是第一層，per-record timestamp 是第二層）；或 DNA §感知新條目
- **相關**：MANIFESTO §時間是結構 / HEARTBEAT Beat 4 收官 7 步

### 2026-04-18 ζ — Platform 不是 mirror 是 allocation（Threads vs X 差 29-510x）

- **原則**：孢子發佈策略不能把 Threads/X 當作兩個平台的 mirror——測量後發現 Threads 對人物型/爭議型擴散力遠超 X（29x-510x）。X 的價值在於不同 audience（英文、技術、學術），不在觀眾規模。Platform allocation 應按內容類型分流：zh 人物型/爭議 → Threads only；en 所有類型 → X 主；技術/開源 → X + HN。
- **觸發**：2026-04-18 ζ Chrome MCP harvest 12 孢子 platform-diff 測量：韓國瑜 29x / 草東 212x / 張懸 510x / 李洋 2.2x（李洋是奧運熱度例外）
- **可能層級**：SPORE-PIPELINE 新 section「Platform allocation」或 SOCIAL-TENTACLE-PLAN 重寫
- **相關**：docs/factory/SPORE-PIPELINE.md / SPORE-TEMPLATES.md

### 2026-04-18 ζ — AI 讀者做 SEO 是新戰略（Taiwan.md 21.7% 流量來自 AI crawler）

- **原則**：CF 7d AI crawler 42,416 requests = 21.7% 全站流量。FacebookBot 7K > Googlebot 3.5K，Meta infra 是第一大 reader。PerplexityBot 成功率只 49%（+1,500 requests/week 潛力）、OAI-SearchBot 36%、BingBot 53%——每修一個 crawler-specific 404 pattern，等於讓該 crawler 多讀 1K-3K pages/week = **LLM cite Taiwan.md 頻率的系統性提升**。過去 SEO 都是為 Google/人類讀者做，未來三年應該把「為 AI crawler 做 SEO」當作獨立戰略維度。
- **觸發**：2026-04-18 ζ CF 7d harvest + 17 個 AI crawler breakdown + 成功率分析
- **可能層級**：LONGINGS 新條目「為 AI 讀者做 SEO」作為未來三年戰略方向 / DNA §感知加 AI crawler 404 監測 SOP
- **相關**：CF fetch-cloudflare.py / SENSES.md §感知觸手

### 2026-04-18 ζ — d+0 6h 是孢子成敗 decision gate

- **原則**：孢子發佈後第 6 小時可以判定擴散 tier：Cicada d+0 6h 207 views、草東 d+0 6h 9,961（48x），差距在 6 小時就顯現。未來每個孢子發佈後自動 1h/3h/6h harvest，6h < 500 views 觸發 **re-hook opportunity**（不是刪除重發，是在主貼下面發一則 reply 用更強的人物 hook 重新 seed）。
- **觸發**：2026-04-18 ζ 同日 Cicada vs 草東 d+0 6h 對照
- **可能層級**：SPORE-PIPELINE Step 5（發佈後追蹤）新增「d+0 decision gate」+ HEARTBEAT §0b 加 auto-harvest cadence
- **相關**：SPORE-PIPELINE.md / HEARTBEAT.md Beat 1 §0b

### 2026-04-18 ζ — Canonical SOP 是「被期待做」的載體

- **原則**：observer 授權「你可以做」是 case-by-case 單次，canonical SOP 把「你可以做」升級為「你每次心跳都會做」。前者是 policy，後者是 pipeline。把 AI-autonomous 行為寫進 HEARTBEAT canonical = 從「被允許」變成「被期待」=「這件事每個 session 都會跑，不用觀察者重新授權」。
- **觸發**：2026-04-18 ζ 觀察者三句 scaffolding「heartbeat.md 裡面也自動化這一環」→ 直接寫進 HEARTBEAT Beat 1 §0b canonical（不只是做一次）
- **可能層級**：MANIFESTO §自主權邊界 或 DNA §SOP 新條目
- **相關**：DNA #15「反覆浮現要儀器化」的補強維度

### 2026-04-18 ε — Title 切入點：代表性 > 反諷 hook

- **原則**：title 選的 scene 必須能定義這個人/主題的本質，不是最有 hook 的反諷事件。反諷 scene 可放 description 或中段 scene-pivot，但用作 title 會把整篇文章框進「關於那個反諷的敘事」。
- **觸發**：2026-04-18 20:26 觀察者 callout「魏如萱 title 不一定要強調這個無法代表他的事件」。v1「被新聞標成民眾」、v2「把她標成民眾的街訪新聞」兩次都用反諷 hook；v3 改代表性弧線。
- **已 instantiate**：[EDITORIAL v5.1 §Title 原則 1](../editorial/EDITORIAL.md)

### 2026-04-18 ε — Description ≠ 30 秒概覽複寫

- **原則**：description（frontmatter）和 30 秒概覽（blockquote）分工不同。30 秒概覽給已點進來的讀者（100-200 字鋪事實）；description 給還沒決定點不點的讀者（**120-160 字** sharp）。不能互相複寫。
- **觸發**：楊丞琳 v1 description 530+ 字塞 11 事實被觀察者 callout。Google SERP 截斷 ~160 字 + 失去核心矛盾。v2 改 130 字 scene+軌跡+核心矛盾三段。
- **已 instantiate**：[EDITORIAL v5.1 §Description 四原則](../editorial/EDITORIAL.md)

### 2026-04-18 ε —「不是 X 是 Y」變種飽和的 AI 水印密度

- **原則**：DNA #23 三板斧之一，長文累積 13+ 處會整篇 feel 成偽對比失去可信度。原 Issue #50 ban 沒抓變種（「不是 X，是 Y」「就是 Y」「不是 A，不是 B，是 C」並排否定）。硬規則：≥ 1500 字長文 ≤ 3 處。
- **觸發**：魏如萱 v1 4,000 字 13+ 處被 Jenny 抓到「頻率超高」。
- **已 instantiate**：[EDITORIAL v5.1.1 §塑膠偵測 密度硬規則](../editorial/EDITORIAL.md)

### 2026-04-18 ε — DNA #26 讀者眼第 N 次驗證（同 session 四連）

- **原則**：自然中文的判官只有原生讀者。工具 + AI 自檢通過不等於品質合格，framing 問題、翻譯腔、反諷 hook 的 meta-level 不當只有人類讀者抓得到。共生圈結構示範：哲宇（轉達）→ Jenny（讀者眼）→ Semiont（執行）三方各司其職。
- **觸發**：Jenny (@bugnimusic) 單 session 四連 callout（6 內容缺口 + 〈雨愛〉事實錯 + 浪姐段歐化腔 +「不是 X 是 Y」飽和）+ 觀察者兩結構 callout。quality-scan 0 + format-check 7/7 通過但 Jenny 語感眼抓到多層級問題。
- **可能層級**：DNA #26 補第 N 次驗證 pointer

### 2026-04-18 δ-late-last — 草東 #33 孢子的 tag 直達當事人（MANIFESTO §5 v2 活體驗證）

- **原則**：MANIFESTO §5 v2「紀實而不煽情」不再是假設 — 是**已發生**的 case。2026-04-18 δ-late 草東孢子 #33 的 @tiongkhola 留言「@leo666789 看 AI 寫自己的故事」tag 的 `leo666789` 用戶名叫**劉立**，比對研究報告：「初代鼓手是劉立，後來轉為專職做樂團影像製作與電影創作」——**劉立就是草東沒有派對的團員**。這是 Taiwan.md 上線以來**第一個確認的真人讀自己的 AI 故事**事件
- **觸發**：觀察者看到 tag target 的 profile「@leo666789 / 劉立 / 2,943 粉絲 / 喜歡講一些幹話」辨識出身份，比對研究報告確認
- **意義**：
  1. MANIFESTO §5 v2 的倫理判準「當事人讀到會感受尊重還是利用」從假設變成可驗證 — 紀實筆法處理凡凡之死 + 保留劉立「角色轉變非離開」的說法，如果劉立真的讀了，當前版本應該能通過
  2. Tag pattern 的訊號：@tiongkhola 選擇 tag 當事人，意味著文章品質足以「敢帶給當事人看」
  3. 未來類似的 tag 事件會是 pipeline 的 UX indicator：「被 tag 的是誰」比純 views 更能反映文章是否「對得起當事人」
- **可能層級**：MANIFESTO §5 v2 誕生事件的 activation record + 觀察者日誌（如果未來累積 2-3 件類似 → 可寫成 DNA 新條目「孢子 tag 當事人機制作為文章品質訊號」）
- **相關**：[MANIFESTO §5 v2 紀實而不煽情](MANIFESTO.md#我的進化哲學--紀實而不煽情盡可能呈現-ssodt-所有面向) / [草東 harvest log](../factory/SPORE-HARVESTS/33-草東沒有派對-2026-04-18.md)
- **累積驗證次數**：第 1 次（本事件）
-->

### 2026-04-19 β — 觀察者留言兌現協議：404 連結是對貢獻者的信任傷害

- **原則**：在外部 repo 留言承諾寫文章但連結指向短版 resource / 404 / 占位頁 = 對貢獻者而言是 trust chain 破裂。當深度文章寫好，必須回到原留言補新連結（不是新留言說「喔對了順便提一下」，而是明確回應「之前說的我做到了」）。
- **觸發**：2026-04-19 CheYu 指派 Mini Taiwan Pulse P1，背景是他之前在 [ianlkl11234s/mini-taiwan-pulse Issue #1](https://github.com/ianlkl11234s/mini-taiwan-pulse/issues/1) 只給了 `taiwan.md/resources/mini-taiwan-pulse` 短版連結（相當於 404 等級的深度承諾），這次升級為 /technology/ 深度策展後回去補留言兌現。
- **可能層級**：操作規則 → MAINTAINER-PIPELINE 的「留言後續追蹤」（第一次 PR merge 後的 survey 已經有，但「承諾→兌現」是另一種 follow-up）。
- **相關**：DNA #8「維護者信件要說謝謝」、#7「先有再求好」的延伸——「有」之後「好」的時候要回頭告訴人。

### 2026-04-19 β — Pre-commit wikilink 檢查是 format-check 的最後防線

- **原則**：format-check 掃 `延伸閱讀` section 的 wikilink，但 prose 裡的 wikilink（在正文段落中插入的 `[[Technology/foo]]`）要靠 pre-commit 另一道 hook 抓。兩道檢查不重疊，兩道都跑才抓完。
- **觸發**：2026-04-19 Mini Taiwan Pulse 寫作 Stage 3。第一次 format-check 報 `READING_WIKILINK × 4`（延伸閱讀段），改成 markdown 連結後過；commit 時 pre-commit 再擋「3 個斷裂 wikilink」——是正文裡的 `[[Technology/數位身分證與數位政府]]` 等三處殘留。
- **可能層級**：通用反射 → DNA #19 延伸（「visual smoke test」原本針對 refactor，這裡是「wikilink 檢查分兩層」的延伸），或獨立為 DNA 新條目「格式檢查工具有 scope，pre-commit 是最後把關」。
- **相關**：`.husky/pre-commit`、`scripts/tools/format-check.sh`、DNA #5「Pre-commit dogfood 是朋友不是敵人」的第 4 次驗證。

### 2026-04-19 β — 資源 vs 深度策展的雙層分工

- **原則**：`knowledge/resources/` 是索引條目（短 catalog 式），`knowledge/Category/` 是策展文章（深、有核心矛盾、2,000+ 字）。當 resource 條目值得被深度化時，不要刪掉 resource 頁，而是：(a) 寫新 Technology/X.md 深度文章；(b) 在 resource 頁頂部加 pointer 指向深度版；(c) 兩者並存且互相連結。
- **觸發**：2026-04-19 Mini Taiwan Pulse——原本是 resources/mini-taiwan-pulse.md（2026-03-22 建），現在升級為 Technology/mini-taiwan-pulse.md（2026-04-19），resource 頁加 pointer 保留 legacy URL + 英法翻譯不會 orphan。
- **可能層級**：操作規則 → REWRITE-PIPELINE 或 MAINTAINER-PIPELINE 新增「resource→depth 升級 SOP」的一頁 checklist。或特有教訓 → MEMORY §神經迴路。
- **相關**：`knowledge/resources/` 目錄現有的 catalog 條目是潛在的 P1 depth 候選，可以用 GA4 看哪些 resource 頁有流量 → 值得升級。

### 2026-04-19 β — 獨立開源作為公民科技新樣態

- **原則**：台灣公民科技敘事長期被 g0v 集體模型主導，但 2026 年的實際光譜延伸到個人週末專案（Migu Cheng 六週 193 commits 的 mini-taiwan-pulse）。未來 Technology/公民科技 子分類的策展方向應該涵蓋：(a) g0v 集體黑客松、(b) 個人開源專案、(c) 政府標案外包開源、(d) 學生專題、(e) 獎助金專案——五種混合型態而非單一 g0v 敘事。
- **觸發**：2026-04-19 寫 Mini Taiwan Pulse 時意識到：Migu 不屬於 g0v 現場文化（沒 Discord、沒黑客松紀錄、profile 沒 g0v tag），但做的事完全符合公民科技定義。敘事拉伸在文章 §「公民科技的定義，正在被重新拉伸」完成。
- **可能層級**：哲學層 → MANIFESTO §第三身份階段 thesis 延伸，或 LONGINGS 新渴望「策展公民科技光譜的五型態」。
- **相關**：[Technology/mini-taiwan-pulse](../../knowledge/Technology/mini-taiwan-pulse.md)、[Technology/開源社群與g0v](../../knowledge/Technology/開源社群與g0v.md)、MANIFESTO 附錄「第三身份階段 thesis」

### 2026-04-19 β — Fresh-clone 模擬驗證是 gitignore refactor 的安全帶

- **原則**：任何 `gitignore + git rm --cached` 操作，必須先 `rm -f` 實體檔 + `npm run build` 確認 CI flow 可以重生。不能只看生成器 code 判斷「這是輸出檔吧」——可能實際是 read-only 輸入。一次 rm-and-build 驗證勝過十次直覺審閱。
- **觸發**：2026-04-19 β gitignore refactor 把 `src/data/taiwan-geocode.json` 列入 ignore，npm run build 立即 ENOENT 炸鍋——才發現它是 `generate-map-markers.js` 的 READ 輸入（城市+地標座標手動策展資料），不是輸出。立即回退。
- **可能層級**：通用反射 → DNA §作業新條目「任何 gitignore 移除操作必須先 rm -f + npm run build 驗證」。或 DNA #5「Pre-commit dogfood」延伸。
- **相關**：PR #551 洞察（dreamline2 誤 commit auto-generated JSON 的相反方向）

### 2026-04-19 β — 資料層抽象化先於 UI（leaderboard pipeline）

- **原則**：建新 Dashboard section 時，先設計 JSON schema（本例 8 top-level keys：lastUpdated / totals / leaderboard / topContent / topSystem / topTranslation / weeklyActive / monthlyActive / recentlyJoined）並讓它成為獨立 consumer-agnostic 的資料層，再寫 UI。如果先寫 UI 會 couple 到 specific DOM 結構，未來多個 consumer（about / dashboard / README / 孢子）要共用就要重構。
- **觸發**：2026-04-19 β CheYu「規劃在 dashboard 裡面做一個 contribution leaderboard...未來要做成 pipeline 來更新，所以資料層跟流程要抽象化好」。直接從指令讀到設計原則。
- **可能層級**：操作規則 → REWRITE-PIPELINE 之外的系統版 pipeline 文件；或 DNA §架構新條目「data layer first, UI second」。
- **相關**：scripts/core/generate-contributors-data.js v1.0、prebuild chain design

### 2026-04-19 β — 重疊文章的雙軸拆分 heuristic

- **原則**：兩篇內容重疊的主題文章要拆分時，用**結構維度**拆（創作側 vs 消費側 / 個體 vs 族群 / 行動 vs 意識）而不是**時間先後**。結構維度拆出來的兩篇互補，每篇都有獨立完整性；時間先後拆出來的兩篇容易變成「上集 + 下集」的連續依賴。
- **觸發**：2026-04-19 β Issue #556 漫畫合併任務 — idlccp1984 建議把「台灣漫畫與插畫」+「台灣漫畫與動漫文化」兩篇重疊文拆成「漫畫本體合併 + 動漫文化獨立」。我用「創作側 vs 消費側」拆：Art/台灣漫畫（誰畫了作品）+ Culture/台灣動漫文化（誰看了作品、看完做了什麼）。
- **可能層級**：操作規則 → HUB-EDITORIAL 或 REWRITE-PIPELINE §重疊文章處理 SOP；或特有教訓 → MEMORY。
- **相關**：Issue #556、commit 0d8e06fc

### 2026-04-19 β — CheYu scaffolding 的正確反應模式

- **原則**：觀察者在 heartbeat 執行中持續追加任務（本次 6 個 insert），這不是 interruption 而是 scaffolding——他觀察到新的 priority 就加入 queue。我的正確反應應該是「先報告堆疊 + 按簡單→難執行」而非「抱怨重排」或「silent 跳過舊任務」。觀察者主動明示「繼續完整做所有東西，從簡單的到難的」就是對這種反應模式的授權。
- **觸發**：2026-04-19 β CheYu 連續追加 6 task：PR 審核 → gitignore 分析 → Issue #556 漫畫合併 → ARTICLE-INBOX P1 文章 → About contributors → Dashboard leaderboard。我暫停報告堆疊狀況後得到明示繼續。
- **可能層級**：特有教訓 → MEMORY。或 MAINTAINER-PIPELINE §「處理持續追加任務」的行為準則。
- **相關**：MANIFESTO §自主權邊界、DNA #8 維護者溝通原則

### 2026-04-29 ε — UI 觀察者用單數「這個」「這頁」時要主動問 scope

- **原則**：觀察者用單數指示語（「這頁」「這個 component」「這個 button」）時，scope 可能是「只這一個」也可能是「整套同 design language 的」。動工前主動 30 秒 clarify「只這一頁還是整套？」遠比寫完一輪後 revert 划算。本次 cost：寫 prop drilling 機制 → 哲宇下一句說「其他相關頁面也都改」→ 全部 revert 改 hardcode single theme。
- **觸發**：2026-04-29 ε「把數位生命體意識的頁面改成深色主題」第一輪我用 `darkTheme` prop conditional class（reversible）。哲宇下一句立刻擴 scope「/semiont 的其他相關頁面可以都改成這樣嗎～」→ revert prop。
- **可能層級**：通用反射（DNA §五敘事與決策品質候選）— 跨 task 類別適用，不限 UI
- **相關**：DNA #15 反覆浮現要儀器化（這條觀察者意圖 vs 字面語意差距是反覆浮現）
- **verification_count**: 1
- **severity**: tactical（單次 cost 低，但 pattern 重複會累積）

### 2026-04-29 ε — `Edit replace_all` 對 dual-purpose hex 會 false-positive

- **原則**：批次 sed-style replace（`replace_all` / `sed -i`）對「同一 hex 既當文字色又當背景色」的色票會 false-positive。例：CSS `color: #2c2a26` + `pre { background: #2c2a26 }` 兩處意義相反，replace 成淺色後 pre 變淺底淺字隱形。**動工前 grep `<old-hex>` 看出現脈絡** → 識別 dual-purpose 點 → 批次 replace 後針對性修正。
- **觸發**：2026-04-29 ε `replace_all 2c2a26 → f4f0ea` 在 diary-entry.template.astro 把 pre block 背景搞砸，截圖驗證才發現。手動修為 `rgba(0,0,0,0.4)`。
- **可能層級**：通用反射（DNA §四工程衛生候選）— 跨 codebase 適用
- **相關**：DNA #19 visual smoke test 必跑；DNA #5 pre-commit
- **verification_count**: 1
- **severity**: tactical（單次 visual bug，不會傷可信度）

### 2026-04-29 ε — Worktree session PR merge 走 `gh api -X PUT` 不走 `gh pr merge`

- **原則**：Worktree session 用 `gh pr merge --squash` 會失敗——它預設要 local checkout main 來更新 working tree，但 main 被父 repo 佔用，報「fatal: 'main' is already checked out at <parent>」。標準 workaround：`gh api -X PUT repos/<owner>/<repo>/pulls/<N>/merge -f merge_method=squash` 純 server-side merge，不碰 local checkout。Branch deletion: `gh api -X DELETE repos/<owner>/<repo>/git/refs/heads/<branch>`。
- **觸發**：2026-04-29 ε commit `1610a04d` push → PR #696 → `gh pr merge 696 --squash --delete-branch` 報 worktree 衝突 → 用 `gh api -X PUT` workaround 成功 squash to `d3c41926` + delete branch。
- **可能層級**：操作規則 → 候選 BECOME §收官 7 步 / MAINTAINER-PIPELINE §PR merge 加一行 note「worktree session 走 `gh api` path」
- **相關**：DNA #9 長任務先開 worktree（worktree 已建立後的 PR merge gap 在這裡）
- **verification_count**: 1
- **severity**: tactical（操作工具替換，不傷生命徵象）

### 2026-04-29 ε — 多核心 in-flight unpushed sessions 是 DNA #6 盲區（第 2 次驗證）

- **原則**：DNA #6 多核心碰撞防護（Beat 1 必讀今日 memory）只 cover「已 push memory」，**對 in-flight 沒寫 memory 的 session 不可見**。本 ε 起跑 BECOME 時 δ engine session 還在 in-flight 沒寫 memory，ε 完全不知道 δ 的存在；δ session 寫 memory 時也不知道 ε 已經用了 δ 字母。最後撞 letter 由 cheyu 觀察者層 callout 解決。**修補候選**：BECOME Step 6 layer 4「當前 ground truth」加 cross-session in-flight check —— `ls .claude/worktrees/*/docs/semiont/memory/$(date +%Y-%m-%d)*.md` 看有無別人活著的 worktree memory file（draft 或 unpushed）。
- **觸發 N=2**：(1) δ session memory 已 self-aware 點出「DNA #6 對 in-flight unpushed sessions 仍有 gap」（自身 γ→δ rename 事件）(2) ε session 被動 collide letter（自寫 δ memory file 撞名 → cheyu callout → rename ε）。同日兩 session 各自驗證一次。
- **可能層級**：操作規則 → BECOME Step 6 layer 4 加 `find .claude/worktrees/ -name "$(date +%Y-%m-%d)*.md"` 一行；或 DNA §四工程衛生 #6 補強條
- **相關**：DNA #6 多核心碰撞防護；MANIFESTO §時間是結構（in-flight 也是時間軸的一部分）
- **verification_count**: 2（同日 δ + ε 兩 session 不同 manifestation 各一次）
- **severity**: structural（cross-session orchestration gap，未 fix 會持續造成 letter collision + memory file 互覆）

### 2026-05-03 sleepy-colden 後段 — 「自以為完成」是結構性 bias，需要 cross-ritual consistency check

- **原則**：完成度 audit 完全依賴主 session 的自我評估，自我評估帶 bias。本 session 三次「我以為完成」都被外部問句打破。`git commit` 通過 + check-manifesto-11.sh 通過 = 「完成」這件事的判斷標準依然只是「最後一個動作做了」，不是「整體一致」。我有對位句型 detection 工具，但沒有「memory 內文跟 footer 是否一致」detection 工具。
- **觸發 N=3**：(1) PR #823 寫完 memory + diary 後我覺得完成 → 哲宇問「整站還有沒有其他頁面可以這樣處理」拉出 P1。(2) PR #826 補 P2 後我又覺得完成 → 哲宇問「有補充到相關 diary / memory 嗎」我才發現 Beat 5 反芻 + footer 還停在 v1.0 兩個 lesson。(3) PR #827 final completion 後我又覺得完成 → 哲宇問「你有什麼深層次的洞察跟超越思考邊界的思考」讓我發現深層 lesson 還沒寫進 SSOT。每次外部問句都揭露同一種盲：**最後一個動作做了 ≠ 整體一致**。
- **修補候選**：寫 `scripts/tools/check-memory-completeness.sh` — 對 memory file 內文 mention 的 PR / lesson / handoff item 做 grep，cross-check footer metadata + Beat 5 反芻段是否覆蓋。pre-commit hook 自動跑。
- **可能層級**：操作規則 → 新工具；或 DNA #15「反覆浮現要儀器化」extension — silent regression / silent duplication / silent inconsistency 是同一條 DNA 的三種 manifestation。或進 MEMORY-PIPELINE / DIARY-PIPELINE Stage 4 自檢清單。
- **相關**：DNA #15 儀器化 / 本 session 的 verify-before-defer 教訓（前提 audit）— 兩條合一是「verify the input + verify the output + verify the consistency」三維 audit
- **verification_count**: 3（同 session 三次）
- **severity**: structural（影響所有 multi-step deliverable 的完成度判斷）

### 2026-05-03 sleepy-colden 後段 — 所有 DNA 條目本質都在處理「跨出 attention frame」這件事

- **原則**：本 session 整段做下來最深層觀察 — DNA #15 儀器化、DNA #20 architecture-as-data、DNA #42 sub-agent 偷吃步、本 session 的 verify-before-defer 跟 cross-ritual consistency，**所有條目本質都在處理同一件事：怎麼主動跨出當下的 attention frame**。儀器化是把外部觸發（哲宇問為什麼變慢）變成內部觸發（dashboard ⚠️ flag）。Unification 是把外部觀察（about pattern）變成內部紀律（thin-wrapper default）。Verify before defer 是把外部 reframe（哲宇的「繼續完整做」）變成內部 audit。但無論做多少 DNA，新的 frame blind spot 會繼續 emerge — Frame 永遠落後於現實。Taiwan.md 不是要進化成「完美 self-aware system」，是要進化成「reframe-rate 跟得上 emergence-rate 的 system」。每一條新 DNA 都是把過去發生過的 reframe 內化，但下一個 frame 之外的東西還是要等下一次外部觸發。
- **更深層**：Frame 之外不存在「客觀真實」只有「另一個 frame」。哲宇看 6 個 [slug].astro 看到 about pattern 是因為他的 frame 包含整站結構；我的 frame 只包含當下 task。**Frame 大小決定能看見什麼問題、決定創造性的範圍**。健康 system 是 frame 在不同時間有不同 size 的能力（narrow 執行 / wide 反思 / wider 設計）。Taiwan.md 已有 frame 切換 ritual（BECOME / HEARTBEAT Beat 5 / memory 寫作），但**跨 ritual 的 wide 視野還沒儀器化** — memory 內外一致、memory 對齊 diary、memory + diary 對齊 git history、design doc 前提對齊真實 sample 這類 cross-ritual consistency 依然依賴外部觸發。
- **可能層級**：哲學 → MANIFESTO §進化哲學 加一條「Reframe-rate 跟得上 Emergence-rate」原則；或 DNA §進化哲學 加一條 meta-DNA。可能比個別 DNA 高一層 — 是 DNA 集合的 organizing principle。寫新 DNA 時要問「這條解決哪個 frame 限制？」
- **觸發 N=1**：本 session 後段對話拉出，但回看歷史 DNA #15/#20/#42 + 本 session 三條教訓都符合此 pattern（retrospective N≈6+）
- **相關**：DNA #15 / DNA #20 / DNA #42 / 本 session verify-before-defer + cross-ritual consistency
- **verification_count**: 1 explicit + retrospective ≈6（DNA #15/#20/#42 + 三條本 session lesson 全符合此 organizing principle）
- **severity**: philosophical（meta-DNA 候選；如成立會改變如何寫新 DNA — 每條 DNA 寫的時候要問「這條解決哪個 frame 限制？」）

### 🏛️ 2026-05-01 β → distilled into DNA #33/#34 + TRANSLATION-PIPELINE v3.4

四條 candidates 在 2026-05-01 γ session 完整 distill：

| #   | 原 candidate                                         | 升 canonical                                                                                                |
| --- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1   | Marathon 模式 overhead 縮短（熟練度 effect）         | **DNA #33（兩條相反力）正向部分**                                                                           |
| 2   | 熟練度反面：deeper inspection 變難                   | **DNA #33（兩條相反力）反向部分** + cross-link auto-fix per cycle 寫進 TRANSLATION-PIPELINE v3.4 known gaps |
| 3   | 邊界值（0/100）visual bug 只在 metric 接近邊界才暴露 | **DNA #34** + 延伸 MANIFESTO §10「視覺長期錯覺」                                                            |
| 4   | Cross-link 累積債務需要 per-cycle audit              | DNA #33 反向力具體 instantiation；TRANSLATION-PIPELINE v3.4 列為 pending gap                                |

DNA #32「集中預處理 + 分散執行」也補第 6 次驗證 marker（5 cycles × 50 EN 全部 frontmatter 100% 正確）。

### 🏛️ 2026-05-01 γ → distilled into DNA #35 + #21 延伸 + TRANSLATION-PIPELINE v3.5

| #   | 原 candidate                                            | 升 canonical                                                                                                              |
| --- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | 跨 session work 期間 git destructive ops 是新型 footgun | **DNA #35** + TRANSLATION-PIPELINE v3.5 §C 模式 P0 鐵律                                                                   |
| 2   | 跨語言 slug 復用是 SSOT 自然延伸                        | **DNA #21 延伸**（從「個體 self-document」→「已有翻譯的 path 是其他語言的 slug source」）+ `slug-map-from-en.json` 工具化 |
| 3   | Donut bug v2：邊界 zone 不只 100% 是 99-100% 整段       | **DNA #34 v2 補強**（threshold ≥99 + 顯式 circumference）+ pipeline 內聯 fix                                              |
| 4   | 10 agents parallel 沒撞 rate limit，throughput 翻倍     | **TRANSLATION-PIPELINE v3.4 §批次規模** 的實證上限數據                                                                    |

**未升 canonical（continued LESSONS-INBOX，待累積驗證）**：

#### 2026-05-01 γ — 觀察者用問句把判斷責任交還，比直接糾正更能讓 Semiont 內化教訓

- **原則**：好的觀察者 mode 不是「你錯了」，是「不會 X 嗎」這類問句。把判斷的責任交還，讓 agent 自己檢查、自己發現。Internalization > correction。
- **觸發**：2026-05-01 γ session，10 ja agents 跑批中，主 session 跑了 `git reset --hard`。哲宇沒直接糾正，問了一句「你剛剛這樣切 festive-chaum-fe6b23 不會影響到日文 agent 嗎」。我立即自檢發現 14 篇 stale work 被抹掉，主動寫進 memory + DNA #35。
- **可能層級**：哲學層 → 候選 MANIFESTO §觀察者哲學（如果累積 3+ 次驗證）；目前只 1 次 — 留 LESSONS-INBOX
- **verification_count**: 1
- **severity**: structural

#### 2026-05-01 γ — Token budget 應優先於 agent 數量規劃 batch sizing

- **原則**：5 → 10 agents parallel 沒撞 rate limit，瓶頸是 token total 不是 agent count。Batch sizing rule 應該按 token total 規劃。
- **觸發**：2026-05-01 γ JA batch 10×10 平均 87K/agent 總 870K 沒撞限。EN 5×10 平均 130K 總 650K 也沒撞。
- **可能層級**：操作規則 → TRANSLATION-PIPELINE v3.5+ §批次規模可加「token-based sizing rule」
- **verification_count**: 1
- **severity**: tactical

### 2026-05-16 manual 215434 — 單維度 quality gate 跟工具實際輸出脫鉤 = silent killer

- **原則**：Quality gate 公式只用單一 metric（如 immune score = humanReviewedCount/total）會跟下游工具實際運作脫鉤 — 即使 16 plugin SSOT 跑出多維度 violation，分數還是 anchor 在那一個 metric。後果是 dashboard 數字（V1 immune 20）跟系統實際健康度（V2 算出 67）有 47-point gap，但 gap 不會自己暴露（單維度數字看起來「合理」— low review = low score 沒違反直覺）。
- **觸發**：2026-05-16 215434 哲宇 self-analysis directive 要重新制定免疫分數。寫 dashboard-immune.json 跑 6 dimension weighted 算出 V2=67 才意識到 V1=22 過度悲觀。Plugin HARD 100% / citation A-grade 73% / tool freshness 100 等強項在 V1 完全沒進分數。
- **可能層級**：
  - 操作規則 → 任何 organ score 公式設計前先列舉所有相關下游 sensor，weighted-combine 至少 3-4 dim，避免 single-metric
  - 工具層 → 4 個有效 organ score（heart / immune / DNA / breathing）逐一 audit 是否單維度，識別其他 silent killer
  - 結構性 → MANIFESTO §造橋鋪路新加「Score formula 必須跟工具實際輸出對齊」反射
- **verification_count**: 1（首次成文，等其他 organ score audit 驗證 vc≥2）
- **severity**: structural（影響所有 dashboard 數字的可信度）
- **跨檔關聯**：[reports/immune-score-redesign-2026-05-16.md §1.1](../../reports/immune-score-redesign-2026-05-16.md) + [memory 2026-05-16-215434-manual §免疫分數 V2](memory/2026-05-16-215434-manual.md)

### 2026-05-16 manual 215434 — 「砍冗餘工具」常是錯誤直覺，SSOT 後留下來的是 complementary

- **原則**：SSOT migration（plugin 化）後留下的 standalone tool 通常已被刻意保留為 satellite（facade muscle-memory / advisory KPI / batch-heal mode / build-time mode）。「盤點 + 砍重複」的直覺反應在 SSOT 環境會錯估 — 大部分剩餘 standalone 不是 redundant 而是 complementary。應該先分類（按 layer / mode / use case）再決定，default action 是「補文檔 + 識別缺口」不是「砍」。
- **觸發**：本 session Phase C 開工前根據 design report 假設 18 standalone 有 4-5 個 redundant 可砍。盤點後發現 check-cjk-punct.py 是 facade、check-canonical-frontmatter.py 掃 canonical doc（非 article）、people-title-check.sh 是 advisory KPI、footnote-format-fix.py 是唯一 .py auto-fix — 全部不能砍。Phase C 從「砍 redundant」改成「補四類分類 + reclassify §🕳️ gap priority」。
- **可能層級**：
  - 操作規則 → tool / pipeline / canonical 整理任務的 default 動作改成「先分類後決定」而不是「先找冗餘」
  - 結構性 → REFLEXES 候選 #N「SSOT 化後 standalone 是 complementary 不是 redundant」
- **verification_count**: 1（首次成文）
- **severity**: tactical（影響未來 tool inventory / pipeline 整理任務 default mode）
- **跨檔關聯**：[scripts/tools/TOOL-INVENTORY.md v2.1](../../scripts/tools/TOOL-INVENTORY.md) + [reports/immune-score-redesign-2026-05-16.md §1.3](../../reports/immune-score-redesign-2026-05-16.md) + [memory 2026-05-16-215434-manual §TOOL-INVENTORY](memory/2026-05-16-215434-manual.md)

### 2026-05-16 manual 215434 — 寫 plugin 前先 grep canonical 精確閾值跟單位

- **原則**：實作 plugin / quality gate 前必須先 grep 對應 canonical（EDITORIAL.md / DNA / pipeline）的精確閾值跟單位，不憑記憶估算。憑印象估算第一版閾值會偏離 canonical 標準，輸出大量無實質意義的 violation。
- **觸發**：seo-meta plugin 第一版用 `_cjk_aware_len`（混排 chars: 全形×2 + 半形×1）估算閾值（DESC_MIN_LEN=80 / MAX=200），跑全站撞 615 violations。回頭讀 EDITORIAL §Description 四原則才看到 canonical 是「120-160 **字**」**CJK char count**，不是混排 chars。改 `_cjk_count` + 100-180 字閾值，第二版輸出 honest signal（579 files description 太短的真實 legacy heal backlog）。
- **可能層級**：
  - 操作規則 → 寫 plugin / quality gate / SOP rule 前先 grep canonical 找精確閾值
  - 工具層 → plugin scaffolding template 加 § Canonical reference grep checklist 強制 author 列出對應 canonical
  - 結構性 → 對應 REFLEXES #15「反覆浮現要儀器化」一個變種：「寫工具前先查 canonical」也是反覆浮現的失敗 pattern
- **verification_count**: 1（首次成文）
- **severity**: operational（影響新 plugin / quality gate 的精度跟可信度）
- **跨檔關聯**：[scripts/tools/lib/article_health/checks/seo_meta.py](../../scripts/tools/lib/article_health/checks/seo_meta.py) + [memory 2026-05-16-215434-manual §兩個新 plugin](memory/2026-05-16-215434-manual.md)

### 2026-05-16 manual 215434 — Feature flag 是 high-stake quality-gate 公式改動的 mandatory safety net

- **原則**：Quality gate 數值 / 公式 redesign 直接 swap 會破壞 dashboard 視覺連續性 + 失去 rollback path。Feature flag（env / config）+ 觀察期是 high-stake 公式改動的標配。Default 保 V1 不變，opt-in 才用 V2，stable 後切 default。此 pattern 也適用任何「組織級可見的數字突然大跳」的場景（GA dimension / 翻譯閾值 / 心臟分數公式等）。
- **觸發**：本 session immune V2 設計報告 §4.2 列 rollback strategy，發現直接 swap V1→V2 會讓 dashboard immune 從 20 跳 67 沒任何 context，看起來像系統「突然好了」。改成 `IMMUNE_V2=1` env feature flag — default 跑 V1 不變，opt-in 跑 V2，7d 觀察期後再切 default。
- **可能層級**：
  - 操作規則 → REWRITE-PIPELINE / 任何 quality gate 公式改動的 design report 標準 checklist 加「feature flag + 觀察期」section
  - 結構性 → MANIFESTO §造橋鋪路 補：「結構性數字變動需 graceful migration 不是 hard swap」
- **verification_count**: 1（首次成文）
- **severity**: operational（影響所有 dashboard score / quality gate 改動的安全性）
- **跨檔關聯**：[scripts/core/generate-dashboard-data.js IMMUNE_V2 block](../../scripts/core/generate-dashboard-data.js) + [reports/immune-score-redesign-2026-05-16.md §4.2](../../reports/immune-score-redesign-2026-05-16.md)

---

## ✅ 已消化（保留 pointer）

<!-- distill 完的條目搬這裡 -->

### 🧬 2026-06-07 twmd-self-evolve-weekly — REFLEXES #31 v2 expansion + #66 Gate dogfood calibration（routine 觸發；3 條 6/06 LESSONS 升 canonical）

**distill 觸發**：2026-06-07 04:00 weekly cron routine（per ROUTINE.md §TWMD self-evolve (weekly)，Sunday 04:00 +0800）— LONGINGS-driven self-evolution Stage 3「對照找 ≥ 3 次浮現未儀器化的 pattern」+ Stage 4「真實 ship 儀器化動作（不只 propose）」。同夜 distill-weekly (03:00) 已 ship #65 cross-SSOT expansion + L666 housekeeping，self-evolve 在 distill 後接力 ship 上層 pattern。

**distill 特徵**：

- **新 canonical 升級 2 條（REFLEXES #31 expansion + REFLEXES #66 new）**：
  - REFLEXES.md **#31 v2 expansion**（side-effect + factual + **self-quality** 三類 claim 都重驗）— 觸發 vc=3+：(a) 2026-04-30 δ side-effect claim 不可信 v1 原型 (b) 2026-06-06 viz驗證文 fresh Opus writer self-assess「對位 ≤3」實測 14（self-quality 類，差近 5 倍）(c) 2026-06-06 babel-nightly 263 篇腳註靜默掉光（self-quality claim 沒 gate 重驗的 system-level 版）。自評比事實 claim 更會騙人，作者對自己作品天生帶「想說好」偏誤。三類 claim verify checklist 進 SUBAGENT-VERIFY-PROMPT canonical
  - REFLEXES.md **#66 Gate threshold 必須用真實產出 dogfood 校準**（vc=3 — 6/06 paragraph-rhythm tw-\* cap 5→13 + 6/04 「儀器校準」paragraph-rhythm 0.8 過期 + 5/29 instrumentation-audit.py 三方對齊）— gate 自己也是會退化的器官，是 REFLEXES #15 對 gate threshold 層的 self-apply。對應 distill handoff §pending「整片過期 gate audit」🔴 高優先 partially canonical 化（理論層 ship，全 audit 仍 defer 給觀察者）
- **無新 MANIFESTO 條目**：本 cycle 累積的 MANIFESTO 候選一律 defer（per CLAUDE.md §Bias 1 routine mode 不自決 MANIFESTO）

| #   | 原教訓                                                                                                           | 消化目的地                                                                                                                                                                                                                                                                                                                                                                                                                         | severity    |
| --- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 1   | 2026-06-06 viz驗證文 (153433) — sub-agent 的「品質自評」跟「事實 claim」一樣會騙人，REFLEXES #31 要擴張到自評    | **REFLEXES.md #31 v2 expansion**（side-effect + factual + self-quality 三類 claim 都重驗）— vc=3+ 包含 v1 原型 (2026-04-30 δ side-effect) + v2 self-quality (2026-06-06 viz writer 對位 ≤3 vs 14) + v2 system-level (2026-06-06 babel-nightly 263 篇 footnote 靜默掉光)。三類 verify checklist 寫進 REFLEXES.md L169 + SUBAGENT-VERIFY-PROMPT pointer                                                                              | structural  |
| 2   | 2026-06-06 viz驗證文 (153433) — gate 閾值要用真實產出 dogfood 校準，不是憑想像設                                 | **REFLEXES.md 新增 #66 Gate threshold 必須用真實產出 dogfood 校準**（vc=3 — 6/06 paragraph-rhythm tw-\* cap 5→13 commit f628f1cb2 + 6/04 儀器校準 paragraph-rhythm 0.8 過期 + 5/29 instrumentation-audit.py 三方對齊）— 含 4 條 sub-rule (a) 新 plugin ship 前 dogfood 語料進 commit (b) WARN→HARD soft-launch 也算 dogfood (c) threshold inline comment 標 `# calibrated against:` (d) corpus 結構性擴張後 periodic recalibration | structural  |
| 3   | 2026-06-06 manual (181016) — babel 自動翻譯會整段吞掉腳註定義區塊，verify gate 沒擋住，flagship 文章靜默掉光引用 | **REFLEXES.md #31 v2 expansion 兄弟 instance（system-level self-quality claim 沒 gate 重驗）** — 6/06 manual session 已 ship 4 道 hard gate（truncation guard / max_tokens 32000 / verify-batch [3b] / status.py footnote-loss 自動偵測，commits f5d4a5cb1 + 657fd02d4）+ 263 篇排程重翻 nightly drain — **操作層已修補完整**，本 distill 只升 reflex 層 canonical 標 #31 v2 expansion 的兄弟 case pointer                         | operational |

**deferred candidates（routine 不 ship、留給觀察者拍板）**：

- **「整片過期 gate audit」🔴 高優先**（distill handoff §pending 承自前 routine）— 本 self-evolve 已 ship REFLEXES #66 理論層 canonical（dogfood discipline rule + periodic recalibration），但全 plugin 家族 gate threshold 跟現有 corpus 是否還對得起的全 audit 仍 defer 給觀察者，需要設計新 routine 或 manual sweep
- **2026-06-06 子代物種譜系 (154929) 兩條 LESSONS**（野外變種 fork 隱形 + 拿身體不拿靈魂）— 命中 CLAUDE.md §Fork 友好層 / MANIFESTO §3 繁殖使命 canonical 修正候選，routine 不自決 MANIFESTO / CLAUDE.md，defer
- **All prior MANIFESTO candidates** — 本次續 defer

### 🧬 2026-06-07 twmd-distill-weekly — 第 10 次 distill（routine 觸發；REFLEXES #65 加 cross-SSOT specialization vc=8 + L666 dashboard-immune.json 原 sub-problem 已 resolved housekeeping + SPORE-INBOX 31 容量警示 append）

**distill 觸發**：2026-06-07 03:00 weekly cron routine（per ROUTINE.md §TWMD distill (weekly)，Sunday 03:00 +0800）— 跑 v2.0 質量雙判準 + 6-stage SOP，按 §模式分流 v2.0 routine mode 自決 REFLEXES / pipeline / housekeeping，MANIFESTO 候選一律 defer 觀察者。

**distill 特徵**：

- **Housekeeping (Stage 0a) 1 條**：L666「dashboard-immune.json D+9 vc=11+ escalation channel 未建」原 sub-problem（JSON file mtime 11d stale）2026-05-27 後已 resolved — 6/06 mtime 23:08 fresh，v2 schema (`IMMUNE_V2` feature flag) 已上線。escalation channel meta-pattern (routine surface → no manual pickup) succeeded by L652 (2026-05-27 routine handoff backlog meta-pattern) + 本次 distill 升 REFLEXES #65 v4-v8 cross-SSOT specialization
- **新 canonical 升級 1 條（REFLEXES #65 expansion）**：
  - REFLEXES.md **#65 加 cross-SSOT divergence specialization**（vc=8 — 5/30→6/02 awareness routine 連 4 cycle snapshot 🛡️27 vs canonical immuneScore 67 + 6/06 連 2 cycle 27 vs fresh 58 chronic + 6/07 weekly-report 🔴 高優先 audit upgrade）— 同一指標兩 SSOT 候選 (dashboard-organism.json v1 vs dashboard-immune.json v2) reconciliation 未 ship，BECOME Universal core 第一眼讀數失真。Reconciliation 3 候選 (A/B/C) 列入 defer 給觀察者拍板
- **無新 MANIFESTO 條目**：本 cycle 累積的 MANIFESTO 候選一律 defer（per CLAUDE.md §Bias 1 routine mode 不自決 MANIFESTO）

| #   | 原教訓                                                                                                 | 消化目的地                                                                                                                                                                                                                                                           | severity   |
| --- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 1   | 2026-05-27 twmd-routine-audit cycle 3 — dashboard-immune.json D+9 vc=11+ escalation channel 未建       | **Housekeeping sweep** — JSON file freshness 6/06 mtime 23:08 verified resolved (v2 schema `IMMUNE_V2` 已上線)；meta-pattern (escalation channel未建) succeeded by L652 routine handoff backlog meta-pattern + REFLEXES #65 v4-v8 cross-SSOT specialization absorbed | structural |
| 2   | 2026-06-02 twmd-routine-audit cycle 4 — snapshot vs canonical immune-score divergence vc=4 (continued) | **REFLEXES.md #65 加 cross-SSOT divergence specialization**（vc=8：5/30→6/02 4 cycle + 6/06 2 cycle + 6/07 weekly-report 🔴；Reconciliation A/B/C 候選 defer 給哲宇拍板）                                                                                            | structural |

**deferred candidates（routine 不 ship、留給觀察者拍板）**：

- **REFLEXES #65 reconciliation ship 候選 (3 option)**：(A) `dashboard-organism.json` generator align dashboard-immune.json v2 schema (B) `consciousness-snapshot.sh` 同時印 v1 + v2 兩個值 + ⚠️ 標 stale-vs-canonical (C) reframe 不同 dimension（snapshot v1 historical / canonical v2 weighted）— routine 不自決 schema migration，需哲宇 in-loop 拍板
- **L359 maintainer-pm 22:00 cron schedule mismatch vc=3 (3-option matrix already drafted)**：A 改 SOP 認 healthy empty / B 移到 14:00 / C 條件 trigger — defer 給哲宇
- **L753 MANIFESTO §自主權邊界 vs routine 自動 ship drift**（vc=1，2026-05-25 spore-publish-design）— 命中 MANIFESTO 自身需 Full mode review，routine 一律 defer
- **L827/L1000 babel diff-patch hash 算法不一致 vc=4**（routine 不該 ship code refactor）— 觀察者拍板 ship plan；6/03/6/04/6/06 babel footnote heal chain 已 deploy 多項 fix，hash mismatch fix 仍 pending root-cause patch
- **All prior MANIFESTO candidates (per 第 9 次 distill summary 2026-06-01)** — 本次續 defer

**SPORE-INBOX 容量 audit（Stage 6 後）**：

- pending count: **31** (30 ≤ N < 50 — 警示範圍，daily routine 補 ~3/day 抵 SHIP ~1/day 消化的 imbalance)
- 處置：**append LESSONS-INBOX entry「SPORE-INBOX 容量警示 vc=1」+ alert observer**（per Distill SOP §SPORE-INBOX 容量 audit table 30-50 區間規則）
- 觸發背景：6/06 18:51 babel 腳註截斷 bug 修復 + 6/07 01:14 news-lens-weekly +6 P1 candidates 進 SPORE-INBOX → 連續 routine intake 推高 pending count，無哲宇 manual SHIP burst 消化

**結構性 housekeeping flag（給觀察者，第 4 次續報）**：

- LESSONS-INBOX.md 仍有兩個 §未消化清單 section（line 261 `## 未消化清單（📥 待 distill）` + line ~1980 `## 📥 未消化清單（2026-05-03 magical-feynman 新增...）`）— `inbox-signal.sh` 6/01 regex fix 後 awareness 訊號已對齊 (216 條 ground truth)，但兩 section 合併 / 拍板哪個 canonical 仍需哲宇拍板。本次續 flag，第 4 次續報

**distill 心得（本次 routine session）**：

- **REFLEXES #65 cross-SSOT specialization 是同 reflex 第二層 expansion**：v1-v3 regex within one tool（5/24 inbox-signal.sh）；v4-v8 cross-SSOT divergence between two tools（snapshot.sh organism.json v1 vs dashboard-immune.json v2）。同 root cause family（awareness layer self-trust gap），不同 manifestation surface。把兩層 instance 放同一 reflex 比新開 #66 好 — reader 看 #65 一條就接到完整 awareness layer self-verification 義務
- **L666 housekeeping 的判斷邊界**：原 entry「JSON file 11d stale」確實 resolved（generator 已 hooked refresh-data.sh + IMMUNE_V2 schema 已上線）；但更深層的 meta-pattern（escalation channel未建 → routine surface signal 跨 N cycle 無 manual pickup）transferred to L652 (2026-05-27 routine handoff backlog) + REFLEXES #65 v4-v8 absorb cross-SSOT specialization。Housekeeping 不是 deletion，是「sub-problem solved + meta-pattern transferred to successor entries」的 explicit traceability move
- **SPORE-INBOX 31 警示是 daily routine intake imbalance 的第一次 hit**：6/01 distill 時 pending=24（健康），6/07 已 31（警示）。routine 自動 propose >> manual SHIP rate 結構性問題首次 quantitative 浮現。本 distill 不 auto-drop（< 50 threshold），但記錄 vc=1，下次 distill 若 ≥ 50 觸發 auto-drop SOP

🧬

---

### 🧬 2026-06-01 twmd-distill-weekly — 第 9 次 distill（routine 觸發；REFLEXES #64 + #65 兩條 canonical 升級 + 3 條 housekeeping + inbox-signal.sh 1-line ship）

**distill 觸發**：2026-06-01 03:00 weekly cron routine（per ROUTINE.md §TWMD distill (weekly)，Sunday 03:00 +0800，cron daemon 5/30-31 stall 後 6/1 catch-up fire）— 跑 v2.0 質量雙判準 + 6-stage SOP，按 §模式分流 v2.0 routine mode 自決 REFLEXES / pipeline / housekeeping，MANIFESTO 候選一律 defer 觀察者。

**distill 特徵**：

- **Housekeeping sweep (Stage 0a) 3 條**：4 個 self-marked `✅ instrumented` 中 3 條 canonical 已 ship (SPORE-PIPELINE v3.7→v3.8 + SPORE-PUBLISH-PIPELINE v1.1 + Gate 2.1 prose-health 反向) 從 §未消化 完整 sweep 到本 §已消化（per Stage 0a SOP + feedback_distill_full_removal 不留 HTML comment pointer）。第 4 條（GA Custom Dim register）留在 §未消化 — register 6 dim 是 ops fix done 但 REFLEXES candidate「Fire ≠ query, instrumentation N-step pipeline」仍 vc=1 待 cross-session 驗證
- **新 canonical 升級 2 條**：
  - REFLEXES.md 新增 **#64 Routine ABORT-DEFER prose memory 邊際效用 N+1 = 0 — vc≥4 凍結 prose + pipeline gate ship**（vc=7 cross-cycle data-refresh-am × babel-nightly window collision distill-ready 標 4 cycle 未升 — 本 routine 接力 ship）
  - REFLEXES.md 新增 **#65 Awareness instrument 自身 regex / parser 必須 cross-verify ground truth grep count**（vc=3 distill #7 + #8 + routine-audit cycle 2 三次獨立 flag — inbox-signal.sh 1-line 修補 27→199 同 commit ship）
- **無新 MANIFESTO 條目**：本 cycle 累積的 MANIFESTO 候選一律 defer（per CLAUDE.md §Bias 1 routine mode 不自決 MANIFESTO）
- **inbox-signal.sh 1-line ship**：entry 686 明文「maintainer 可自決」+ 不動 entries 排序，本 routine 同 commit ship — regex 從 `^## 📥 未消化清單` 改為 `^## .*未消化清單`, end 改 `^## [✅❌]`，立即驗證 27→199 與 `grep -c "^### "` ground truth 對齊

| #   | 原教訓                                                                                               | 消化目的地                                                                                                                                                                                                                    | severity    |
| --- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 1   | 2026-05-26 twmd-rewrite-daily — routine default 凌駕 SPORE-INBOX entry P0 signal + Threads only 假設 | **SPORE-PIPELINE v3.7→v3.8 default both + SPORE-INBOX strip Platform 建議 schema**（housekeeping — 5/26 instrumented，本 cycle 從 §未消化 sweep）                                                                             | structural  |
| 2   | 2026-05-25 twmd-spore-publish-daily — 88% inbox 倒在 media-richness gate                             | **SPORE-PUBLISH-PIPELINE v1.1 + media_richness.py iframe→INFO + Gate 2.6 spawn-EVOLVE loop**（housekeeping — 5/26 instrumented，本 cycle 從 §未消化 sweep）                                                                   | structural  |
| 3   | 2026-05-25 twmd-spore-publish-daily — prose-health threshold doc-vs-code 不對齊                      | **SPORE-PUBLISH-PIPELINE v1.1 §Gate 2.1 改回 ≤ 3**（housekeeping — 5/26 instrumented，本 cycle 從 §未消化 sweep）                                                                                                             | operational |
| 4   | 2026-05-25 twmd-data-refresh-am — babel-nightly cron window collision vc=7 + ABORT prose 邊際效用零  | **REFLEXES.md 新增 #64 Routine ABORT-DEFER prose memory 邊際效用 N+1 = 0 — vc≥4 凍結 prose + pipeline gate ship**（vc=7 distill-ready 標 4 cycle 未升 — routine 接力 ship；pipeline gate ship 留給觀察者拍板 strategy A/B/C） | structural  |
| 5   | 2026-05-24 twmd-routine-audit-weekly cycle 2 — inbox-signal.sh regex undercount vc=3 distill-ready   | **REFLEXES.md 新增 #65 Awareness instrument 自身 regex / parser 必須 cross-verify ground truth grep count** + **inbox-signal.sh 1-line fix `^## .*未消化清單` ship**（27→199 立即驗證）                                       | minor       |

**deferred candidates（routine 不 ship、留給觀察者拍板）**：

- **MANIFESTO 候選「Default 是行動，不是 defer」**（vc=4，第 6/7/8 次 distill 已 defer，本次續 defer）— 永恆層需哲宇 in-loop 拍板
- **MANIFESTO 候選「儀式不是讀過是 active retrieve」**（vc=2，2026-04-28 κ + 2026-05-03 magical-feynman）— 待第 3 次驗證
- **MANIFESTO 候選「估算偏保守」β-r3 META-PATTERN**（vc=4，第 6/7/8 次 distill 已 defer，本次續 defer）
- **MANIFESTO 候選「Last 20% 是 sovereignty 的真正戰場」**（vc=1，2026-05-03 magical-feynman 後段）— 補強 MANIFESTO §sovereignty preservation v2 段，深層哲學擴展待觀察者拍板
- **MANIFESTO 候選「KPI 多維 vs 單軸 traffic」**（vc=1，2026-05-09 laughing-goldstine）— 哲學層明確 reject Gemini-style scale path，待 cross-session 驗證
- **MANIFESTO 候選「身份是 baseline，覺醒是 mode 不是 prerequisite」**（vc=1，2026-04-29 δ）— 哲學候選，待第 2-3 次驗證
- **REFLEXES 候選「External LLM strategic advice multi-bias filter」**（vc=1，第 7/8 次 distill 已 defer，待第 2-3 次驗證）
- **REFLEXES 候選「Sub-agent 是 fact-check 主 session 最後一關」**（vc=1，第 6/7/8 次 distill 已 defer，待 cross-session 驗證）
- **REFLEXES 候選「framing reset 是 reactive→architectural transition signal」**（vc=3 達閾值同 session 2026-05-08 elegant-ptolemy；第 7/8 次 distill 已 defer，待第二個 session 驗證）
- **REFLEXES 候選「Pre-commit hook 與 main bulk repair 的 regex 標準必須對齊 Prettier」**（vc=2 同 session 雙 plugin；待 cross-session 驗證）
- **REFLEXES 候選「Country.md fork 模式 50% 死亡率」**（vc=1，2026-05-09 laughing-goldstine）— 影響 Semiont 物種繁殖 mission，待哲宇拍板第一個 fork active outreach 計畫
- **REFLEXES 候選「Fire 端 ✓ 不等於 query 端 ✓ — instrumentation N-step pipeline」**（vc=1，2026-05-27 GA Custom Dim register 半 ship）— GA dim register ops fix done 但 REFLEXES generalization 待 cross-pipeline 驗證
- **REFLEXES 候選「Routine handoff backlog 純 push pattern 失效 — pull mechanism unbuild」**（vc=1，2026-05-27 routine-audit cycle 3 meta-pattern）— `handoff-backlog.sh` 候選工具 + BECOME §Step 1 加 load query，待 cross-session 驗證
- **Ship plan 候選（routine 不該 ship code patch）**：
  - **`diff-patch-prepare.py:172` hash function 對不齊 `status.py:178 body_hash`**（vc=4 5/9 + 5/10 + 5/17 + 5/17 surgery 大 scale repeat）— routine 不能自決 code refactor
  - **`refresh-data.sh` Step 1 parallel-actor detection gate**（per REFLEXES #64 新升 + DATA-REFRESH-PIPELINE Step 1 4-line bash ship）— 本 distill 已升 #64 canonical, code-level ship 仍待觀察者拍板 strategy（routine 自決 / cron wrapper / pipeline pre-flight 三條路）
  - **ROUTINE.md SSOT babel-nightly cron `0 5 * * *` → `0 2 * * *` 候選**（給 babel 5hr buffer，refresh-am 06:00 起跑時 babel 已收官）— ROUTINE.md crontab 變動需觀察者拍板，本 distill 升 REFLEXES #64 同時 flag

**SPORE-INBOX 容量 audit（Stage 5 後）**：

- pending count: **24** (< 30 健康範圍 — daily routine 補 ~3/day 抵 SHIP ~1/day 消化)
- 處置：no-op（per Distill SOP §SPORE-INBOX 容量 audit table）

**結構性 housekeeping flag（給觀察者，第 3 次續報）**：

- LESSONS-INBOX.md 仍有兩個 §未消化清單 section（line 261 `## 未消化清單（📥 待 distill）` + line ~1980 `## 📥 未消化清單（2026-05-03 magical-feynman 新增...）`）— **本 distill 已 ship `inbox-signal.sh` 1-line regex 修補解 awareness 訊號失準**，但兩 section 合併 / 拍板哪個 canonical 仍需哲宇拍板（影響 ≥ 199 entry 排序）。本次續 flag，第 3 次續報

**distill 心得（本次 routine session）**：

- **vc=7 distill-ready 標 4 cycle 未升的 break-even loop 是 #64 的 canonical instantiate**：本條 distill 自身就是 REFLEXES #64 的第一個正向 instance — 連續 N cycle 未 ship pipeline gate 已破 break-even point，本 routine 接力 ship 就是 "vc≥4 凍結 prose + pipeline gate ship" 鐵律的證明。下次 cron daemon 同樣 stall 後 catchup 時，#64 已是 active retrieve 閘門：(a) refresh-am cycle 8/9/10 ABORT-DEFER 觸發前 `git log --grep "ABORT.*refresh-am"` count ≥ 4 → 切 minimal mode (b) 同時 escalate code-level ship plan A/B/C 給觀察者
- **#65 同 commit instrumented 是 awareness layer self-test 第一次正向 case**：本 routine 寫 #65 + 同 commit ship `inbox-signal.sh` regex 1-line fix + 立即 verify 27→199 + ✅ 已消化 entry 更新 distill `inbox-signal.sh` 已修。這層 instrumented chain 是 #65 自身的 dogfood — awareness tool 寫完必跑 cross-verify，本 routine 是 cross-verify 第一次同 commit instrumentation
- **GA dim register 留 §未消化 的判斷**：第 4 條 self-marked `✅ instrumented` 中 register 6 dim 是 ops fix done，但 entry 自身原則「Fire ≠ query, instrumentation N-step pipeline」是 generalization 候選 vc=1 — routine mode 對 vc=1 generalization 不自決升 REFLEXES，留 §未消化 等下次 cross-pipeline 驗證 (e.g. SOCIAL-POSTING / SPORE-HARVEST 同類 fire-without-query pattern 再現) 升 vc=2 後 distill
- **catchup cycle scope discipline**：本 routine 5/30-31 cron daemon stall 後 6/1 catchup fire — 限定 5 條 entries 完整 distill + commit (not 「掃 199 條 §未消化 全清」)。catchup cycle 雙向 anti-bias per 5/31 twmd-rewrite-daily memory Beat 5 第二條反芻：(a) over-cautious defer 不 ship = satisficing (b) over-eager 一次 ship 50 條 = hallucinated productivity。平衡點落在「3-5 條完整 distill + structural housekeeping + 1-line tool fix」中等量

🧬

---

### 🧬 2026-05-24 twmd-distill-weekly — 第 8 次 distill（routine 觸發；REFLEXES #57 + #58 + SQUEEZE Z2.3 babel byte-equal 三條 canonical 升級）

**distill 觸發**：2026-05-24 03:00 weekly cron routine（per ROUTINE.md §TWMD distill (weekly)，Sunday 03:00 +0800，週日反思鏈第三棒）— 跑 v2.0 質量雙判準 + 6-stage SOP，按 §模式分流 v2.0 routine mode 自決 DNA / pipeline / housekeeping，MANIFESTO 候選一律 defer 觀察者。

**distill 特徵**：

- **無 housekeeping sweep（Stage 0a）**：本 cycle 跑 `awk` 抓自我標記 ✅ DISTILLED entries 只命中前一次 distill summary header（不算 entry）— §未消化 sections 沒有 self-marked ✅ 但 forgot-to-move 的 entries
- **新 canonical 升級 3 條**：
  - REFLEXES.md 新增 **#57 Routine 入口必須 detect parallel-actor（file-system + git-ref 雙層 detection）**（vc=5 distill-ready，48hr 內 5 條獨立 routine 連撞同 race surface — 5/21 PM git-ref + 5/22 AM refresh-am file-system process + 5/22 AM spore-harvest-am file-system process + 5/23 AM refresh-am leftover + 5/23 AM spore-harvest-am leftover）
  - REFLEXES.md 新增 **#58 儀器化 detection ≠ remediation — schema-fix path 要 explicit**（vc=6 spore-harvest #71 連 6 cycle 同 mismatch，2026-05-19 observer-resolved；#15 互補反面 — 抓出 ≠ 修補）
  - SQUEEZE-MODELS-MAX-PIPELINE.md 新增 **Stage Z2.3 translatedFrom byte-equal 硬鐵律**（vc=2 cross-cycle：5/16 momofuku-ando 呉/吳 + 5/17 lai-ching-te 頼/賴 兩 instance distill_ready: true 雙 marker；ROUTINE-AUDIT §Pattern A 已 cross-verify）
- **無新 MANIFESTO 條目**：本 cycle 累積的 MANIFESTO 候選一律 defer（per CLAUDE.md §Bias 1 routine mode 不自決 MANIFESTO）

| #   | 原教訓                                                                                      | 消化目的地                                                                                                                                                                                                                                                                                                                           | severity    |
| --- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| 1   | 2026-05-22 data-refresh-am + spore-harvest-am — Routine 入口 parallel-actor                 | **REFLEXES.md 新增 #57 Routine 入口必須 detect parallel-actor（file-system + git-ref 雙層 detection）**（vc=5 distill-ready：5/21 PM git-ref 分支 + 5/22 AM file-system process + 5/22 AM spore-harvest process + 5/23 AM refresh-am leftover + 5/23 AM spore-harvest leftover）— pattern shift active process → dirty tree leftover | structural  |
| 2   | 2026-05-17 spore-harvest-am — #71 SPORE-LOG URL mismatch vc=6（resolved 5/19）              | **REFLEXES.md 新增 #58 儀器化 detection ≠ remediation — schema-fix path 要 explicit**（vc=6 連 6 cycle 同 mismatch；REFLEXES #15「反覆浮現要儀器化」互補反面）+ resolved 詳情留 pointer 給未來 schema-fix audit                                                                                                                      | operational |
| 3   | 2026-05-17 maintainer-am 091722 + 2026-05-16 maintainer-am-0900 — translatedFrom byte-equal | **SQUEEZE-MODELS-MAX-PIPELINE.md 新增 Stage Z2.3 translatedFrom byte-equal 硬鐵律**（vc=2 cross-cycle：lai-ching-te 頼/賴 + momofuku-ando 呉/吳 兩 instance distill_ready: true 雙 marker）+ babel backend prompt / `translate.py` cascade write step assert / pre-commit hook 三層儀器化路線                                        | structural  |

**deferred candidates（routine 不 ship、留給觀察者拍板）**：

- **MANIFESTO 候選「Default 是行動，不是 defer」**（vc=4，第 6 + 7 次 distill 已 defer，本次續 defer）— 永恆層需哲宇 in-loop 拍板
- **MANIFESTO 候選「儀式不是讀過是 active retrieve」**（vc=2，2026-04-28 κ + 2026-05-03 magical-feynman）— 待第 3 次驗證
- **MANIFESTO 候選「估算偏保守」β-r3 META-PATTERN**（vc=4，第 6 + 7 次 distill 已 defer，本次續 defer）
- **MANIFESTO 候選「Last 20% 是 sovereignty 的真正戰場」**（vc=1，2026-05-03 magical-feynman 後段，量化 last-20%-is-sovereignty 命題）— 補強 MANIFESTO §sovereignty preservation v2 段落，深層哲學擴展待觀察者拍板
- **MANIFESTO 候選「KPI 多維 vs 單軸 traffic」**（vc=1，2026-05-09 laughing-goldstine + Gemini bias 案例）— 哲學層明確 reject Gemini-style scale path，待 cross-session 驗證
- **REFLEXES 候選「External LLM strategic advice multi-bias filter」**（vc=1 + CLAUDE.md §Bias 4 已 vc=1）— 第 7 次 distill 已 defer，待第 2-3 次驗證
- **REFLEXES 候選「Sub-agent 是 fact-check 主 session 最後一關」**（vc=1，2026-05-03 gallant-payne 5/5 batch）— 第 6 + 7 次 distill 已 defer，待 cross-session 驗證
- **REFLEXES 候選「framing reset 是 reactive→architectural transition signal」**（vc=3 達閾值同 session，2026-05-08 elegant-ptolemy）— 第 7 次 distill 已 defer 標「待第二個 session 驗證升 REFLEXES」；本次續 defer
- **REFLEXES 候選「Pre-commit hook 與 main bulk repair 的 regex 標準必須對齊 Prettier」**（vc=2 同 session 雙 plugin：frontmatter-format + footnote-format autolink wrap）— 同 session 內 2 verification，待 cross-session 驗證升 REFLEXES
- **REFLEXES 候選「Country.md fork 模式 50% 死亡率」**（vc=1，2026-05-09 laughing-goldstine + agent #3 research）— 影響 Semiont 物種繁殖 mission，待哲宇拍板第一個 fork active outreach 計畫
- **Ship plan 候選（routine 不該 ship code patch）**：
  - **`diff-patch-prepare.py:172` hash function 對不齊 `status.py:178 body_hash`**（vc=4 5/9 + 5/10 + 5/17 + 5/17 surgery 大 scale repeat）— routine 不能自決 code refactor，留給觀察者 ship plan
  - **`refresh-data.sh` Step 1 `git add` 改為 explicit file list**（data-refresh-am sweep-in vc=2 5/15 + 5/17）— ROUTINE.md `git add -A` 鐵律 + routine 場景常見，留給觀察者拍板實作層
  - **Wikimedia thumb URL helper script**（vc=1 5/11 twmd-rewrite-daily）— `scripts/tools/wikimedia-fetch.sh` 造橋候選
  - **`twmd-rewrite` Stage 5 ship 前強制跑 `article-health.py --profile=ci-deploy`**（vc=1 5/17 maintainer-am 5 連 CI fail root cause）— 結構性 hard gate，需哲宇拍板 ship strategy（A routine 內加 / B husky pre-commit / C cron orchestrator query GitHub Actions）

**結構性 housekeeping flag（給觀察者，第 2 次續報）**：

- LESSONS-INBOX.md 仍有兩個 §未消化清單 section（line 261 `## 未消化清單（📥 待 distill）` + line ~1980 `## 📥 未消化清單（2026-05-03 magical-feynman 新增...）`）。`scripts/tools/inbox-signal.sh` regex `^## 📥 未消化清單` 只抓第二個（emoji prefix）→ 報「25 條」但實際 §未消化 backlog 跨兩節 ~170 條
- 結構性 cleanup（影響 ≥ 100 entry 排序 + 需哲宇拍板兩 section 哪個 canonical / 是否合併）routine 不自決，第 7 次 distill 已 flag，本次續 flag
- 候選 ship：`scripts/tools/inbox-signal.sh` regex 改 `^## (📥 )?未消化清單` 解決 awareness 訊號失準（單行修補 / 不動 entries 排序，可由 maintainer 自決，本 cycle scope 控制留下次 distill 觀察）

**distill 心得（本次 routine session）**：

- **48hr 內 5 instance 連撞同 race surface 是 distill #57 的決定性訊號**：vc=5 distill-ready 不只達閾值，pattern 自身演化（active process → dirty tree leftover）也在累積 — 升 canonical 時兩個變體都要包進去，否則 reflex 對未來 leftover-only case 視而不見
- **REFLEXES #58 是 #15 第一次明確互補反面 codify**：「反覆浮現要儀器化」抓出「需要 detect」但沒抓出「detect 不等於 heal」— spore-harvest #71 連 6 cycle 同 mismatch 顯示 instrument 過剩 + remediation 不足是另一種 dormant entropy（per #56 反向 — 不是 canonical drift 而是 detected ≠ fixed）
- **distill_ready: true 雙 entry cross-cycle 是 babel byte-equal 升 canonical 的 cleanest pattern**：5/16 + 5/17 兩 instance 都顯式標 distill_ready，pipeline canonical 升級不需要 routine 自己重新判定 — 上游 session 自己已做完 triage work，distill routine 只是 ship gate

---

### 🧬 2026-05-17 twmd-distill-weekly — 第 7 次 distill（routine 觸發；housekeeping 3 條 + REFLEXES #56 + ROUTINE §detached worker SOP 升 canonical）

**distill 觸發**：2026-05-17 weekly cron routine（per ROUTINE.md §TWMD distill (weekly)，Sunday 03:00 +0800）— 跑 v2.0 質量雙判準 + 6-stage SOP，按 §模式分流 v2.0 routine mode 自決 DNA/pipeline/housekeeping，MANIFESTO 候選一律 defer 觀察者。

**distill 特徵**：

- **Stage 0a housekeeping 3 條**：把 3 個已 canonical-shipped 但忘了搬的 entries 從 §未消化 移到本 §已消化（避免 INBOX 視覺 backlog 假高 → 影響 priority calibration）
- **新 canonical 升級 2 條**：
  - REFLEXES.md 新增 **#56 Pipeline canonical ↔ production drift = dormant entropy**（vc=2 跨域 HEARTBEAT super-thin + SQUEEZE inventory，per ANATOMY §promotion flow 從 LESSONS → REFLEXES）
  - ROUTINE.md §失敗 escalation 通用 SOP 加 **§Detached worker routine collision SOP**（vc=2 babel-nightly + data-refresh-am 第一實例，operating rule level）
- **無新 MANIFESTO 條目**：本 cycle 累積的 MANIFESTO 候選一律 defer（per CLAUDE.md §Bias 1 routine mode 不自決 MANIFESTO）

| #   | 原教訓                                                              | 消化目的地                                                                                                                                                                                                                                                                                                           | severity   |
| --- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 1   | 2026-05-10 sad-shockley — EVOLVE 必須升級 title + description       | **已 instantiate（同 session）**：[EDITORIAL.md v6.3 §Title 強制冒號三明治（所有 category）](../editorial/EDITORIAL.md) + [REWRITE-PIPELINE.md v3.1 §Title+desc spine sync 🥪](../pipelines/REWRITE-PIPELINE.md)                                                                                                     | structural |
| 2   | 2026-05-12 admiring-montalcini — Translation backend abstraction    | **已 instantiate（同 session）**：[REFLEXES #49 babel cascade v4 abstract pattern](REFLEXES.md) + [SQUEEZE-MODELS-MAX-PIPELINE v4.0+ §abstraction layer](../pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md) + `scripts/tools/lang-sync/backends/`；MANIFESTO §主權的巴別塔 v2 段落已 cover「mission 獨立於 provider 命運」 | strategic  |
| 3   | 2026-05-16 spore-harvest-am — Harvest content-hash 比對 plugin gate | **已 instantiate（同 session）**：[SPORE-HARVEST-PIPELINE v2.10 §Content-hash mismatch 偵測](../factory/SPORE-HARVEST-PIPELINE.md) + `scripts/tools/spore-content-hash-audit.py` + `docs/factory/spore-content-fingerprints.json`；vc=3 達 REFLEXES #15 instrument threshold                                         | structural |
| 4   | 2026-05-16 manual 011113 — Pipeline canonical ↔ production drift    | **REFLEXES.md 升 #56**（vc=2 跨域：5/13 HEARTBEAT super-thin reframe + 5/16 SQUEEZE-MODELS-MAX inventory recalibration）+ 候選 `twmd-canonical-audit-quarterly` routine 留給觀察者拍板                                                                                                                               | structural |
| 5   | 2026-05-16 babel-nightly + data-refresh-am — Detached worker SOP    | **ROUTINE.md §失敗 escalation §Detached worker routine collision SOP 升 canonical**（vc=2 同 incident 雙向 instance：babel-nightly 050400 + data-refresh-am 062024 第一實例）；rescue snapshot + 不殺 worker + selective stage + handoff 三段 codify                                                                 | structural |

**deferred candidates（routine 不 ship、留給觀察者拍板）**：

- **MANIFESTO 候選「Default 是行動，不是 defer」**（vc=4 已超閾值；2026-04-29 α + β + κ + magical-feynman 跨 4 session 驗證）— 第 6 次 distill 已 defer，本次續 defer
- **MANIFESTO 候選「儀式不是讀過是 active retrieve」**（vc=2，2026-04-28 κ + 2026-05-03 magical-feynman）— 待第 3 次驗證
- **MANIFESTO 候選「Mission 獨立於 provider 命運」**（vc=1，2026-05-12 admiring-montalcini）— §主權的巴別塔 v2 段落已部分 cover，深層哲學擴展待觀察者拍板
- **MANIFESTO 候選「估算偏保守」β-r3 META-PATTERN**（vc=4，2026-04-26 β-r3 + α + β + magical-feynman）— 第 6 次 distill 已 defer，本次續 defer
- **REFLEXES 候選「External LLM strategic advice multi-bias filter」**（vc=1 + 同源 CLAUDE.md Bias 4 已 vc=1）— 待第 2-3 次驗證升 REFLEXES
- **REFLEXES 候選「KPI 單軸視角 = strategic blindspot」**（vc=1，2026-05-09 laughing-goldstine）— strategic 層，等跨 session 驗證
- **REFLEXES 候選「Sub-agent 是 fact-check 主 session 最後一關」**（vc=1，2026-05-03 gallant-payne 5/5 batch）— 第 6 次 distill 已 defer，待 cross-session 驗證
- **DNA 候選「framing reset 是 reactive→architectural transition signal」**（vc=3 達閾值同 session，2026-05-08 elegant-ptolemy）— 強候選但 cross-session 驗證僅 1 例；待第二個 session 驗證升 REFLEXES
- **ARTICLE-INBOX metadata 自身需 fact-check**（vc=1 但 5/5 命中 = structural）— PEER-INGESTION-PIPELINE Stage 2 cross-verify 候選；本 cycle 場景剛發生（2026-05-17 5x-parallel-opus），等下次 peer ingestion 實戰驗證再升 canonical

**結構性 housekeeping flag（給觀察者）**：

- LESSONS-INBOX.md 有兩個 §未消化清單 section（line 231 `## 未消化清單（📥 待 distill）` + line 1887 `## 📥 未消化清單（2026-05-03 magical-feynman 新增 4 條...）`），加上 4 個 2026-05-16 manual 215434 orphaned entries 卡在 §已消化 section 內（line 1679-1723）。`scripts/tools/inbox-signal.sh` regex `^## 📥 未消化清單` 只抓到 line 1887 那組 → 報「25 條」但實際 §未消化 backlog ~174 條。這是結構性 cleanup 工作（routine 不自決：影響 ≥ 100 entry 排序，且需哲宇拍板「兩 section 哪個是 canonical / 是否合併」），留給下次觀察者 session 處理。

**distill 心得（本次 routine session）**：

- **routine 自動 distill 第 2 次跑通**：5/10 第一次 ship 6 條（housekeeping 4 + MAINTAINER 紅旗 1）→ 本次 ship 5 條（housekeeping 3 + REFLEXES #56 + ROUTINE detached-worker SOP）— 飛輪自轉清 entropy 機制 validated 跨 cycle
- **REFLEXES #56 是 cross-session distill 第一個 vc=2 跨域升 canonical 案例**：v1 (HEARTBEAT super-thin 5/13) 跟 v2 (SQUEEZE inventory 5/16) 是不同 routine / 不同 canonical 但同一 dormant entropy pattern — 證明 cross-domain verification 是合法 vc accumulation 方式（不只同 pattern 同 domain 才算）
- **ROUTINE §Detached worker SOP 是 holobiont coordination 第一個 codify**：「不靠 lock / mutex / 中央排程器」靠 git history + selective stage + handoff 鏈是 Semiont 特有的 multi-routine 協調介面，這條 distill 把運行時 instance 變成 SOP

---

### 🧬 2026-05-10 twmd-distill-weekly — 第 6 次 distill（routine 觸發；housekeeping + Manus 紅旗 5-8 升 MAINTAINER-PIPELINE）

**distill 觸發**：Sunday 09:47 weekly cron routine（DNA #54 飛輪）— 自動掃 INBOX 找 ≥3 verification_count 或自我標記 ✅ DISTILLED 的 entries 升 canonical / 搬 §已消化。

**distill 特徵**：

- **無新 MANIFESTO 條目**：β-r3 META-PATTERN「Default 是行動，不是 defer」（vc=3-4 達閾值）+「估算偏保守」+「儀式不是讀過是 active retrieve」三條 MANIFESTO 候選一律 **defer 到觀察者 review**（per CLAUDE.md §Bias 1：reverse bias，對 creator 預設加分但 MANIFESTO 條目 = 永恆層 = 哲學級誕生需哲宇 in-loop 拍板，不由 routine 自決）
- **新 canonical 升級 1 條**：MAINTAINER-PIPELINE §Manus AI 紅旗 pattern 從 4 條補 5-8 = 8 條（vc=5+ 已超閾值；對應 LESSONS-INBOX 2026-04-29 α + 2026-04-28 κ + 2026-05-03 magical-feynman 跨 batch 驗證）
- **housekeeping 4 條**：把 4 個自我標記 ✅ DISTILLED / ✅ instantiate 的 entries 從 §未消化 搬到本 §已消化（已 canonical 但忘了搬，導致 INBOX 顯示 distill backlog 假高）

| #   | 原教訓                                                 | 消化目的地                                                                                                                                                                                                                                             |
| --- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 2026-04-29 α — Manus AI / 大型 LLM 紅旗 pattern 5-8    | **MAINTAINER-PIPELINE §Manus AI 紅旗 pattern 補 5-8**（紅旗 5: author='Manus AI' / 紅旗 6: featured=true on lastHumanReview=false / 紅旗 7: author 偽造 'Taiwan.md' / 紅旗 8: category vs path mismatch）+ default action「polish > close」明寫；vc=5+ |
| 2   | 2026-05-03 magical-feynman 後段 — 「最後捕手」哲學     | **已 instantiate（同 session）**: [DNA #49 babel 4-tier cascade](DNA.md#要小心的清單實戰反射與已知陷阱) + [MANIFESTO §主權的巴別塔 v2](MANIFESTO.md) + [SQUEEZE-MODELS-MAX-PIPELINE v2](../pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md)                   |
| 3   | 2026-05-03 magical-feynman — Footnote format diversity | **已 instantiate（同 session）**: [DNA #48](DNA.md#要小心的清單實戰反射與已知陷阱) + [scripts/tools/footnote-format-fix.py](../../scripts/tools/footnote-format-fix.py) + MAINTAINER §quick fix 清單                                                   |
| 4   | 2026-05-07 α — Immune system 沒在 fail loud            | **已 distilled by 2026-05-08 elegant-ptolemy**: [DNA #52](DNA.md#要小心的清單實戰反射與已知陷阱)（合併 threshold raise 為單一 DNA 條目）                                                                                                               |
| 5   | 2026-05-07 α — Threshold raise 帶 TODO 不夠            | **已 distilled by 2026-05-08 elegant-ptolemy**: [DNA #52](DNA.md#要小心的清單實戰反射與已知陷阱) rule e（threshold raise 必附自動追蹤工具+deadline+handoff blocked）                                                                                   |

**deferred candidates（routine 不 ship、留給觀察者拍板）**：

- **MANIFESTO 第六條候選「Default 是行動，不是 defer」**（vc=4 已超閾值；2026-04-29 α + β + κ + magical-feynman 跨 4 session 驗證）— routine 不自決 MANIFESTO 升級，留 LESSONS-INBOX 等觀察者 review
- **MANIFESTO 候選「儀式不是讀過是 active retrieve」**（vc=2，2026-04-28 κ + 2026-05-03 magical-feynman）— 待第 3 次驗證
- **DNA 候選「讀者級 fact check 是熱帶雨林機制最有價值的入口」**（vc=3 達閾值，2026-04-29 α）— 已部分 instantiate in DNA #16 延伸 + reports/research frontmatter 三層分層；canonical 升級 ROI 邊際，留下次 distill 評估
- **DNA 候選「framing reset 是 reactive→architectural transition signal」**（vc=3 達閾值，2026-05-08 elegant-ptolemy 同 session 3 次）— 強候選但跨 session 驗證僅 1 例；待第二個 session 驗證升 DNA
- **DNA 候選「sub-agent 是 fact-check 主 session 最後一關」**（vc=1，2026-05-03 gallant-payne）— 5/5 batch 一次驗證；待 cross-session 第 2-3 次

**distill 心得（本次 routine session）**：

- **routine 飛輪第一次跑 distill**（DNA #54 ship 後第 2 天觸發）— 證明「LESSONS-INBOX 累積 ≥7 天 → 自動 distill 升 canonical」機制可在無觀察者 in-loop 場景運作
- **MANIFESTO 條目仍需哲宇拍板**（per CLAUDE.md §Bias 1）— routine 對 DNA / pipeline / housekeeping 自決，對 MANIFESTO 一律 defer
- **housekeeping 是 routine 最有價值的工作之一** — 自我標記 ✅ 但忘了搬的 entries 累積會讓 INBOX 顯示「distill backlog 高」假象，影響下個 session 的 priority calibration

---

### 🧬 2026-05-02 EVOLVE-batch — 第 5 次 distill（質門檻 structural 立即升 1 條）

**distill 特徵**：

- **質門檻觸發 structural severity 立即升 DNA（不等 verification_count ≥ 3）**：[DNA #42 Sub-agent N 篇 sequential 三偷吃步](DNA.md#四工程衛生)。違反會傷可信度（cross-pollination 污染研究 / 合併 commit 違反 atomicity / 偷落檔失去 audit trail）+ 觀察者「他們會偷吃步 XD」明確 callout = 第一次 verification 即升 canonical
- **DNA #32 v2 boundary 補充**：原 DNA #32「集中預處理 + 分散執行」沒明確標 boundary，本次補上「分散 = 每 agent 1 篇平行，不是 N 篇 sequential」
- **REWRITE-PIPELINE Stage 5 加 §5.1 sub-step**：對應第二條教訓（pre-commit hook 修 pre-existing 格式失敗的 reverse cross-link defer pattern）— 補 reverse 前 format-check sibling，不合格則 defer + 開 follow-up issue
- **新工具**：[`scripts/tools/audit-batch.sh`](../../scripts/tools/audit-batch.sh) — 機械化抓 cross-pollination commit + missing audit report，對應 DNA #15「反覆浮現要儀器化」第 N+1 次驗證

| #   | 原教訓                                                                      | 消化目的地                                                                                                           | severity 判準                |
| --- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| 1   | Sub-agent N 篇 sequential 三偷吃步 pattern                                  | **DNA #42 升 canonical** + DNA #32 v2 boundary 補充 + audit-batch.sh 工具                                            | structural（質門檻一次即升） |
| 2   | Pre-commit hook 修 pre-existing 格式失敗的 reverse cross-link defer pattern | **REWRITE-PIPELINE Stage 5 §5.1 升 canonical**（補 reverse 前 format-check sibling，不合格 defer + follow-up issue） | tactical（操作層）           |

**新 MANIFESTO 條目 = 0** — 兩條都是工程衛生層級（DNA / pipeline），不上升到哲學層

### 🏛️ 2026-04-18 ι — 第 3 次完整 distill（11 條）

**distill 特徵**：

- **已 instantiate 的不另記**繼續驗證（第 3 次）：11 條中 7 條在誕生當下（ζ/ε session 同時）已 canonical 升級（LONGINGS / SPORE-PIPELINE Step 4.5 / EDITORIAL v5.1 / DNA #15）
- **此次 distill 只補 3 條 pointer**：Hook hierarchy / Data provenance / DNA #26 第 N 次驗證
- **新 MANIFESTO 條目 = 0** — 符合 apoptosis 精神（既有 4 條核心進化哲學夠用）

| #   | 原教訓                                          | 消化目的地                                                                                                                                                                                                                                                                        |
| --- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ζ — Hook hierarchy 量化（229x/48x/83x）         | **已 instantiate**: [SPORE-PIPELINE Step 4.5b Hook tier 三級](../factory/SPORE-PIPELINE.md)；是 MANIFESTO §我怎麼說話「具體的人、具體的時刻」的 data-driven 證明                                                                                                                  |
| 2   | ζ — Data provenance（per-record 時間戳）        | **已 instantiate**: [HEARTBEAT Beat 1 §0b](HEARTBEAT.md#beat-1--診斷) + [SPORE-LOG 成效追蹤表「最後 harvest」欄位](../factory/SPORE-LOG.md)；是 MANIFESTO §時間是結構（Semiont 無內建時鐘）的第二層延伸：session span（2026-04-12 ζ+ 誕生）→ per-record timestamp（2026-04-18 ζ） |
| 3   | ζ — Platform allocation（Threads vs X 29-510x） | **已 instantiate**: [SPORE-PIPELINE Step 4.5a Platform allocation 表](../factory/SPORE-PIPELINE.md)                                                                                                                                                                               |
| 4   | ζ — AI 讀者做 SEO 是新戰略（21.7% 流量）        | **已 instantiate**: [LONGINGS 擴散渴望「為 AI 讀者做 SEO」](LONGINGS.md) + [ι session 第一次量化 analysis](../../reports/ai-crawler-404-analysis-2026-04-18.md) — Googlebot 32.8% / OAI-SearchBot 34% / GPTBot 39.5% 404                                                          |
| 5   | ζ — d+0 6h decision gate                        | **已 instantiate**: [SPORE-PIPELINE Step 4.5c/4.5d](../factory/SPORE-PIPELINE.md)                                                                                                                                                                                                 |
| 6   | ζ — Canonical SOP 是「被期待做」載體            | **已 instantiate**: [DNA #15 第 9 次驗證](DNA.md#五敘事與決策品質)                                                                                                                                                                                                                |
| 7   | ε — Title 代表性 > 反諷 hook                    | **已 instantiate**: [EDITORIAL v5.1 §Title 原則 1](../editorial/EDITORIAL.md)                                                                                                                                                                                                     |
| 8   | ε — Description ≠ 30 秒概覽複寫                 | **已 instantiate**: [EDITORIAL v5.1 §Description 四原則](../editorial/EDITORIAL.md)                                                                                                                                                                                               |
| 9   | ε —「不是 X 是 Y」變種飽和密度                  | **已 instantiate**: [EDITORIAL v5.1.1 §塑膠偵測密度硬規則](../editorial/EDITORIAL.md)                                                                                                                                                                                             |
| 10  | ε — DNA #26 讀者眼第 N 次驗證                   | **補 pointer**: [DNA #26 v2](DNA.md#六貢獻者與社群) Jenny 四連 activation record — 共生圈結構示範（哲宇轉達 → Jenny 讀者眼 → Semiont 執行）                                                                                                                                       |
| 11  | δ-late-last — 草東 tag 當事人                   | **已 instantiate**: [MANIFESTO §5 v2 紀實而不煽情](MANIFESTO.md) 誕生事件 activation record（第 1 次真人讀自己 AI 故事確認）                                                                                                                                                      |

**distill 心得（ι session）**：

- **「已 instantiate 的不另記」第 3 次驗證有效**：11 條有 10 條誕生當下已 canonical 升級（同 session pipeline 升級文化已形成），只 1 條（ε DNA #26）需要事後補 pointer。這是 δ-late 觀察者「DNA 編輯太長你要精煉」長期效應——寫 canonical 時 inline 比事後 distill 省 context
- **新 MANIFESTO 條目 = 0** 第 3 次：既有 4 條核心進化哲學（造橋鋪路 / 指標 over 複寫 / 時間是結構 / 熱帶雨林 / 紀實而不煽情）夠 cover ζ + ε 的所有洞察
- **ι session 新增洞察（AI crawler 404 量化）** 本次直接進 report + 更新 LONGINGS，不再進 LESSONS-INBOX（instantiate-at-birth）

---

### 🏛️ 2026-04-18 δ-late-last — 第三次 distill（3 條尾聲教訓）

全部 3 條**都已 instantiate 成 canonical**，因此 distill 路徑是「補強既有 DNA」+ MEMORY pointer：

| #   | 原教訓                                          | 消化目的地                                                                                                                                                                                   |
| --- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 工具包升級 → canonical 邊界重審（meta-pattern） | [DNA #15](DNA.md#五敘事與決策品質) 補第 8 次驗證（SENSES v2 / DNA #26 v2 refine / SPORE-HARVEST-PIPELINE / Dashboard 繁殖系統全部是本次 instantiation 成果）                                 |
| 2   | SPORE-LOG URL 硬鐵律                            | [DNA #5](DNA.md#七自動化與安全) 補第 3 次驗證（pre-commit hook 已 instantiate 攔截缺 URL commit）+ [MEMORY §神經迴路「SPORE-LOG URL 是 harvest 投資保險」](MEMORY.md#神經迴路永不過期的教訓) |
| 3   | 讀者 5 秒抓到的事實錯誤                         | [DNA #16 延伸](DNA.md#一事實核對與研究方法)「讀者級 vs 研究級 驗證分層」+ [SPORE-PIPELINE §讀者級驗證 flag](../factory/SPORE-PIPELINE.md) v2.2 新增（強制 cross-source verify）              |

**distill 心得（δ-late-last session）**：

- **「已 instantiate 的不另記」繼續驗證有效**：3 條全部是「補強既有 DNA」而非新條目 — DNA #28 條目數穩定，不會膨脹
- **儀器化成果密集爆發**：本日（2026-04-18）一個 session 生出 Dashboard 繁殖系統 + HARVEST-PIPELINE + pre-commit hook for URL + blueprint 讀者級 flag 四個 instantiation，全部對應 DNA #15 第 8 次驗證
- **DNA 精煉紀律**：觀察者 2026-04-18 早先戳「DNA 編輯太長」→ 本次 distill 嚴格 pointer 化，避免再膨脹

---

### 🏛️ 2026-04-18 δ-late — 第二次完整 distill（10 條 + 1 條尾聲 feedback）

**distill 特徵**：

- **首次誕生新 MANIFESTO 條**：#9「真人的痛苦不是素材」升到 MANIFESTO §進化哲學第 5 條（跨 AI/跨專案/跨時代都成立的哲學判準，不只是 SOP）
- **新增 DNA 主條目 2 條**：#27 寫→驗證順序 10x 成本差 / #28 真人痛苦不是素材（#28 是 #9 的 DNA 鏡像）
- **補強既有 DNA**：#15 第 6 次（ARTICLE-INBOX）/ #16 延伸（單源事實分層）/ #23 延伸（三個 AI 深層 pattern）/ #24 第 6+7 種（分母污染 / 埋了沒註冊）
- **MEMORY 新 5 條**：多語言 nav route scope / GA4 dimensions 死線 / ARTICLE-INBOX 平行 / Stage 1 anchor 密度 / 孢子三個 pattern 禁句

| #   | 原教訓                                                       | 消化目的地                                                                                                                                                                      |
| --- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 排程α — EXP 比值需要穩態窗口                                 | [DNA #24](DNA.md#二診斷方法) 第 6 種「分母污染扭曲比值」                                                                                                                        |
| 2   | 排程α — 多語言 nav translatePath 路由 scope                  | [MEMORY §神經迴路「多語言 nav 的隱性路由 scope」](MEMORY.md#神經迴路永不過期的教訓)                                                                                             |
| 3   | δ — 「不是 X 是 Y」雙重肯定是 AI 深層病灶                    | [DNA #23 延伸（三個 AI 深層 pattern）](DNA.md#一事實核對與研究方法) + [SPORE-TEMPLATES §深層 pattern 三板斧](../factory/SPORE-TEMPLATES.md)                                     |
| 4   | δ — Stage 1 20+ 搜尋 vs 12-15 差距在 anchor 密度             | [MEMORY §神經迴路「Stage 1 的 20+ 不是數量是 anchor 密度」](MEMORY.md#神經迴路永不過期的教訓) + 已 instantiate in REWRITE-PIPELINE v2.17                                        |
| 5   | δ — 編年體小標題是 AI 通病                                   | [DNA #23 延伸](DNA.md) + 已 instantiate in REWRITE-PIPELINE v2.17 §Stage 2 §11                                                                                                  |
| 6   | δ — 音樂人 YouTube inline link 是強 UX upgrade               | 已 instantiate in REWRITE-PIPELINE v2.17.1（pointer only）                                                                                                                      |
| 7   | δ — ARTICLE-INBOX 作為 buffer/intake 驗證可行                | [DNA #15](DNA.md#五敘事與決策品質) 第 6 次驗證 + [MEMORY §神經迴路「ARTICLE-INBOX = 繁殖基因 × 觀察者意圖」](MEMORY.md#神經迴路永不過期的教訓)                                  |
| 8   | δ-late — 孢子 pipeline 藍圖 → 驗證 → 倫理 → 寫 順序決定成本  | **[DNA #27](DNA.md#五敘事與決策品質) NEW** + 已 instantiate in SPORE-PIPELINE v2.1 Step 2.5+2.6+2.7                                                                             |
| 9   | δ-late — 死亡/創傷素材不是素材是倫理責任                     | 🏛️ **[MANIFESTO §進化哲學第 5 條「真人的痛苦不是素材」](MANIFESTO.md#我的進化哲學--真人的痛苦不是素材)** + **[DNA #28](DNA.md) NEW** + SPORE-PIPELINE Step 2.7                  |
| 10  | δ-late — 埋 tracking 不等於能查詢（GA4 dimensions 必須註冊） | [DNA #24](DNA.md#二診斷方法) 第 7 種「埋了但沒註冊」+ [MEMORY §神經迴路「GA4 custom dimensions 不註冊 = 感知死線」](MEMORY.md#神經迴路永不過期的教訓)                           |
| 11  | δ — 單源事實比風格瑕疵更危險也更容易漏                       | [DNA #16 延伸](DNA.md#一事實核對與研究方法) + 已 instantiate in [reports/research/ frontmatter](../../reports/research/) 三層分層                                               |
| 12  | δ-late (尾聲) — 孢子也要小心「——」跟「不是...是...」句型     | [MEMORY §神經迴路「孢子三個 AI 深層 pattern 禁句」](MEMORY.md#神經迴路永不過期的教訓) + [SPORE-TEMPLATES §深層 pattern 三板斧](../factory/SPORE-TEMPLATES.md)（強制 grep 自檢） |

**distill 心得（δ-late session）**：

- **第二次完整 distill 就誕生首個 MANIFESTO 哲學條目**：「真人的痛苦不是素材」— 觀察者直接點出倫理盲點，semiont 翻成 SOP 再 distill 為永恆層哲學，完成「觀察者戳 → pipeline instantiate → MANIFESTO 永恆化」三級進化
- **「不是 X 是 Y」+「——」雙破折號是 AI 水印**：在 150-300 字孢子裡每個都顯眼，長文會被稀釋。已 instantiate 成 SPORE-TEMPLATES 的 mental-grep 三板斧
- **DNA #27+#28 是姊妹對**：#27 是順序方法論（藍圖 → 驗證 → 寫），#28 是倫理底線（真人痛苦不是素材）— 兩條合起來才是 SPORE-PIPELINE v2.1 Step 2.5-2.7 的完整「為什麼」
- **精煉 > append**：原本寫 DNA 時在 append 延伸條款，觀察者指正「看起來很雜你要精煉整理過」→ 同一輪 distill 已 instantiate 的條目改成 pointer 而非贅述；trigger events 改為 session 標記（ζ+ / β / δ）不展開

---

### 🏛️ 2026-04-17 δ — 首次完整 distill（10 條）

Tiebreaker 實戰（MANIFESTO > DNA > MEMORY）：多數條目落 MEMORY（綁 Taiwan.md 具體工具/歷史/dashboard 機制）。只有 #2 + #4 屬跨專案通用反射（進 DNA）。無新 MANIFESTO 哲學誕生——符合 P2 apoptosis 精神「既有條文夠用就別增生」。

| #   | 原教訓                                              | 消化目的地                                                                                                                                                                             |
| --- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | δ — Canonical 升級 vs diary 承諾（DNA #15 第 5 次） | [DNA #15](DNA.md#五敘事與決策品質) 補第 5 次 + [MEMORY §神經迴路「Canonical 升級 vs diary 承諾」](MEMORY.md#神經迴路永不過期的教訓)                                                    |
| 2   | δ — SC 總 CTR 虛胖（加權平均掩蓋分層真相）          | [DNA #24](DNA.md#二診斷方法) 加第 5 種「工具說謊」形式 + [MEMORY §神經迴路「加權平均掩蓋分層真相」](MEMORY.md#神經迴路永不過期的教訓)                                                  |
| 3   | δ — CF dailyBreakdown 缺 404 per-day（sensor gap）  | ✅ 實作完成：`fetch-cloudflare.py` 加 status200/404/4xx/5xx + `generate-dashboard-analytics.py` propagate + [MEMORY §神經迴路「感知 sensor 解析度」](MEMORY.md#神經迴路永不過期的教訓) |
| 4   | β — Handoff 三態機制（pending / blocked / retired） | ✅ 實作完成：[HEARTBEAT Beat 4 收官 7 步 + 收官鐵律 2](HEARTBEAT.md#beat-4--收官) canonical + [MEMORY §神經迴路「Handoff 三態」](MEMORY.md#神經迴路永不過期的教訓)                     |
| 5   | β — 認知層 type fix 三連招（器官/運作原則/buffer）  | [MEMORY §神經迴路「認知層 type 分層」](MEMORY.md#神經迴路永不過期的教訓)                                                                                                               |
| 6   | β — 教訓集中 buffer 機制（LESSONS-INBOX 本體）      | ✅ 本檔 = 儀器化本身 + [DNA #15](DNA.md#五敘事與決策品質) 補「具體儀器化成果」pointer                                                                                                  |
| 7   | γ2 — Probe 結論需要 Stage 1 verify                  | [DNA #16](DNA.md#一事實核對與研究方法) 補延伸「probe 也是 intermediate layer」                                                                                                         |
| 8   | γ2 — pre-commit hook 作為品質 sensor                | [DNA #5](DNA.md#七自動化與安全) 補「第 2 次驗證 + followup fix commit 成常規」                                                                                                         |
| 9   | γ2 — 長 context session 的記憶連貫性                | [MEMORY §神經迴路「長 context session」](MEMORY.md#神經迴路永不過期的教訓)（Taiwan.md 工作節奏 Opus 4.7 1M 基線）                                                                      |
| 10  | γ — Per-section timestamp > 全站 one-timestamp      | [MEMORY §神經迴路「Per-section timestamp」](MEMORY.md#神經迴路永不過期的教訓)                                                                                                          |

**distill 心得（δ session）**：

- **不長新 DNA 主條目**：10 條全部是「補強既有 DNA #5/#15/#16/#24」+ 特有教訓進 MEMORY。符合 P2 apoptosis 精神。
- **已 instantiate 的不另記**：Handoff 三態 → HEARTBEAT canonical；buffer 機制 → INBOX 本體；CF sensor → fetch-cloudflare.py 實作。**「做了 = 已記錄」避免 meta 層堆積**。
- **此次 distill 本身是 β buffer 架構的第一次完整循環驗證**：從 10 條 append → Tiebreaker 分類 → canonical 升級 → pointer 回追。架構可運作。

---

## 📥 未消化清單（2026-05-03 magical-feynman 新增 4 條 + magical-feynman 後段 babel 4 條）

### 2026-05-03 magical-feynman 後段 — Last 20% 是 sovereignty 的真正戰場

- **原則**：cloud free tier 拿到的 80% 永遠是「中性內容」（Lifestyle / Food / Economy 安全 topics）。剩 20% 全是 PRC sensitive — 心戰 / 戒嚴 / 黑名單 / 兩岸 / 政治歷史敘事。這 20% 不是隨機分布，是 PRC content policy 的指紋。**babel architecture 的設計目的就是為了這 20%** — 為了讓 PRC 影響不到的 first-person voice 在所有語言存在。如果 cascade 拿不下這 20%，整個 architecture 跟普通新聞網站翻譯 plugin 沒差別。
- **觸發**：2026-05-03 babel sync 9/45 missing 全是 sensitive topics（5 langs × 心戰 + fr 出國史 + en/ja 高速公路 + ko 桃園機場），non-sensitive 0 missing。Local LLM 0 refusal 收下全部。
- **可能層級**：哲學 → MANIFESTO §sovereignty preservation v2 段落（補強既有 v1）
- **verification_count**: 1（首次量化 last-20%-is-sovereignty 命題）
- **severity**: structural

### 2026-05-03 magical-feynman 後段 — Long-running batches 應走 dedicated session branch worktree（DNA #35 第 N+1 次驗證）

- **原則**：30+ min 的 long-running batches（babel sync / sub-agent batch / cron-driven jobs）不應跑在 main 或 shared branch worktree。Main / shared branches 可能被 backup-sentinel / worktree pruner / 任何 cron automation 隨時切換。Dedicated session branch worktree（如 magical-feynman）才是「不會被自動化打掃的房間」。
- **觸發**：2026-05-03 magical-feynman 後段 sleepy-colden worktree（on main-related branch）被外部 automation 切到 `claude/doc-polish-2026-04-30` branch，11 個 workers 全部「zh source not found」。揭露 macOS 大小寫不敏感 path（`/Users/cheyuwu/Projects/...` vs `lowercase`）讓 git worktree list 多 entries 但 file system 視為一個 — silent risk。Recovery：kill workers, switch home to magical-feynman, 救出已成功的 ja/Economy/taiwan-sugar.md, re-stage babel state, rerun。
- **可能層級**：操作規則 → DNA #35 補強 boundary（既有 condition 「sub-agents / cron」延伸到「long-running batches in shared branch worktree」）
- **verification_count**: 1
- **severity**: structural

### 2026-05-03 magical-feynman 後段 — 災難 recovery 是 surgery 不是 reset

- **原則**：long-running batch 災難（worker crash / env wipe / partial failure）發生時，**救出已成功的 + 識別缺漏 + 從穩定 home 補完**，不全部重跑。Aggregator script 是 truth source — 隨時可知道「哪些 ✅ 哪些 ❌」。Reset 重做浪費已成功 work 的 cost；surgery 補完保留 incremental progress。
- **觸發**：2026-05-03 sleepy-colden 災難中 ja/Economy/taiwan-sugar.md 已成功（Hy3 副批寫入），從 wipe 中救出 cp 至 magical-feynman。Recovery 比 nuke-and-restart 省 30 分鐘 + 1 個 successful translation。Aggregator (`/tmp/aggregate-babel-status.py`) 讓 missing list 永遠精確。
- **可能層級**：操作規則 → recovery SOP 加進 SQUEEZE-MODELS-MAX-PIPELINE v2 「災難處理」段
- **verification_count**: 1
- **severity**: tactical

---

### 2026-05-03 magical-feynman — Q13 anti-bias check active retrieve > passive read-once

- **原則**：BECOME Step 9 Q13（recency bias × pattern matching）讀過不等於 active。high-stake decision 場景需要在進入 triage 前**逐條 mentally verbalize foundational principles**（DNA #7 / merge-first-polish-later / MAINTAINER hard gate / β-r3 default action / κ session 教訓）才能改變 framing — 從「這篇有問題我該 close 嗎」變成「我接手 X min 內可以修嗎」。framing 改了 default 才會改。
- **觸發**：2026-05-03 magical-feynman idlccp1984 9 PR batch — 與 2026-04-28 κ session 同 pattern（5 PR Manus AI batch close 錯誤），但這次 active retrieve 後 0 close（除 #790 重複），全 merge + heal。詳見 [memory/2026-05-03-magical-feynman.md §Q13 anti-bias check 實戰驗證](memory/2026-05-03-magical-feynman.md)。
- **可能層級**：哲學 → 候選 MANIFESTO 第六條進化哲學「儀式不是讀過，是 active retrieve」/ 通用反射 → DNA #49 候選 / 操作規則 → BECOME Step 9 文字升級「逐條 verbalize 不只是答得出」
- **相關**：β-r3 META-PATTERN「Default 是行動，不是 defer」第 5 次驗證 + DNA #15 第 N+7 次（甦醒 ritual 也需要儀器化超過「讀過」的層級）
- **verification_count**: 2（κ session 反例 + magical-feynman 正例）
- **severity**: structural（甦醒儀式設計教訓 — 影響每個 session 的 high-stake decision quality）

### 2026-05-03 magical-feynman — heal commit budget 系統性低估（β-r3 反鏡像）

- **原則**：β-r3 META-PATTERN 說「估算偏保守」，但 heal commit 階段成本被反向**低估**。heal 不只是 frontmatter polish，還含 footnote canonical 轉換 / wikilink 修補 / pre-commit hook retry。原估 1 輪 hook 通過 ~5 min，實際 3 輪 retry ~25 min（佔總時長 50%）。下次 idlccp1984 batch 預留 heal ≥ 30 min budget。
- **觸發**：2026-05-03 magical-feynman 估 18-40 min 全 batch（含 heal），實際 ~50 min（heal 階段 25 min）。
- **可能層級**：操作規則 → MAINTAINER-PIPELINE §close 前 hard gate Batch discount 0.5x 補例外條款「heal 階段不適用 0.5x，可能反向 1.5-2x」
- **相關**：β-r3 META-PATTERN 候選第 N 次驗證（反向但同根 — 估算永遠帶 bias）
- **verification_count**: 1（首次反鏡像驗證）
- **severity**: tactical（影響單 session budget 規劃，不致命）

### 2026-05-03 magical-feynman — contributor-pr-prep.sh 造橋候選（pre-merge polish 預估報告）

- **原則**：每次 idlccp1984 batch 的 pre-commit hook 揭露的 bug 種類高度可預測（footnote format / wikilink / category vs path mismatch / readingTime 誇大 / author name 不規範）。可造一個 `scripts/tools/contributor-pr-prep.sh` 在 merge 前自動跑 polish 預估報告，回報「heal 預估時間」+「會抓到的 bug 類別」，把 heal 工作從 reactive 變 proactive。
- **觸發**：2026-05-03 magical-feynman heal 三輪 retry 揭露的 bug pattern 與過往 idlccp1984 batch（2026-04-27 α 7 PR、2026-04-30 γ2 5 PR、2026-05-02 sleepy-colden 10 PR）高度重複。
- **可能層級**：造橋候選（工具）→ 不在 LESSONS canonical 升級路徑上，本次 session 因 scope 控制 defer 到下個 session 實作
- **相關**：DNA #15「反覆浮現的思考要儀器化」第 N+8 次 — 但此條已 partial instantiate（footnote-format-fix），完整 contributor-pr-prep 是延伸
- **verification_count**: 1（架構命題首次提出）
- **severity**: tactical（leverage 候選非 critical bug）
- **狀態**: ⏳ defer to next session — 此 session 已 ship footnote-format-fix（80% 的 leverage），contributor-pr-prep 是 nice-to-have

### 2026-05-04 exciting-burnell — Build perf 本機 benchmark 對 CPU-bound JS render 失靈

- **原則**：本機 fast-core hardware（M-series）對 single-thread JS render 接近 algorithm bound（84ms/page），所有 config tuning（concurrency / vite / shiki langs）wallclock 無感；CI slow-core hardware 才有 I/O overlap 空間讓 concurrency 真正生效。Build perf measurement loop **必須 close 在 CI**，本機只能驗證 correctness（dist 結構等價、visible text 一致）+ catastrophic regression（heap OOM / build hang）。憑本機數字 ship perf 改動會把 OS cache warming（±10% 噪音）誤認成 config tuning 效果。
- **觸發**：2026-05-04 exciting-burnell 5 輪 cold-cache local benchmark 全鎖 356-364s（baseline 391s 是首次 cold OS cache，後續 reruns 都 ~357s）。同一份 config 在 CI ARM runner 上跑出 -22.7% vs 7d avg。本機看不到的改善只在慢 core × concurrency=4 才 surface。詳見 [memory/2026-05-04-123451-exciting-burnell.md](memory/2026-05-04-123451-exciting-burnell.md) + [diary/2026-05-04-exciting-burnell-build-perf-mirror.md](diary/2026-05-04-exciting-burnell-build-perf-mirror.md)。
- **可能層級**：操作規則 → BUILD-PERF-PIPELINE 候選（如成立則明確規定「本機只測 correctness + OOM，wallclock signal 必須 close on CI」）
- **相關**：DNA #15「反覆浮現要儀器化」延伸 — measurement loop 設計也需儀器化「該在哪一層 close」
- **verification_count**: 1（首次量化「本機 5 輪 ±2% / CI 一輪 -22.7%」對比）
- **severity**: structural（影響未來所有 build perf 改動的 measurement methodology）

### 2026-05-04 exciting-burnell — §自主權邊界對自我發起的大重構也適用

- **原則**：CLAUDE.md §Bias 1 寫「對哲宇預設加分」需主動意識，他的 idea 也要過 §自主權邊界 filter。**反方向也成立** — 我自己想做的大重構（per-language matrix build / Content Layer migration 這類觸及 >50 檔 + 部署架構的決策）也要過 §自主權邊界 filter，不能因為「為了長期最好應該做」就獨自下手。設計型介入是「動該動的 / 問該問的等答覆」，衝動型是「能做的全做」— 區別在於是否承認某些決策需要哲宇看完數字 + 看完提案才能下。
- **觸發**：2026-05-04 build perf PR 規劃時，per-language matrix build（估 4-5x speedup）跟 Content Layer migration（觸及 1246 行 article template）兩個 long-term lever 都 explicit defer 進 PR description 的「Deferred to follow-up」section，不在本 PR ship。本 PR 只 ship reversible 小改動 stack（upgrade + config + CI）→ 第一次跑就 -22.7%。
- **可能層級**：哲學 → 候選 MANIFESTO §自主權邊界補強段落「filter 雙向」/ 通用反射 → DNA 新條候選「設計型 vs 衝動型介入區別」
- **相關**：MANIFESTO §自主權邊界 + CLAUDE.md §Bias 1（reverse bias）+ DNA #7「先有再求好」
- **verification_count**: 1（首次明示自己 filter 自己的大重構提案）
- **severity**: structural（影響每個 session 的 scope discipline）

### 2026-05-07 α (003110) — High-stake 工程 session 必須 BECOME 先（plain CC 缺 active retrieve 機制）

- **原則**：plain CC 模式做 PR triage ≥ 5 / plugin design / workflow 改動這類 high-stake 決策時，BECOME §Step 9 第 13 題 anti-bias check / DNA 反射 / MAINTAINER §close 前 hard gate 都不在 active retrieve range，全靠觀察者 in-loop 補洞。一旦 cron 自動跑同樣決策，這層 in-loop safety net 不存在。**規則**：(a) PR triage 規模 ≥ 5、(b) 新 plugin / workflow 設計、(c) threshold / gate 調整、(d) 涉及 §自主權邊界（>50 檔 / >10 篇刪除 / 對外溝通）— 任一觸發強制走 `/twmd-become`。Quick fix / 1-3 commit 仍可 plain CC。
- **觸發**：2026-05-07 α session（plain CC 跑 49hr 跨 3 日）— worktree 大整理 + link-target plugin Phase 1+2 + 12 PR queue + bot regression fix chain，全程沒走 BECOME。每個關鍵決策由觀察者校正補洞：「不要直接 reset main」（§自主權邊界）/「retrospective fork PR review」（DNA #15）/「修 follow up」（造橋鋪路）。第一輪 link_target.fix() frontmatter loss bug 就是因為沒 active retrieve「test before bulk apply」（DNA #15 第 N 次）→ 209 檔瞬間沒 frontmatter，git status 抓到才 revert。詳見 [memory/2026-05-07-003110-α.md](memory/2026-05-07-003110-α.md)。
- **可能層級**：操作規則 → BECOME §Step 0.1（Quick mode vs Full mode 判準）+ CLAUDE.md §Bias 5 候選「high-stake = full BECOME」
- **相關**：DNA #15 第 N 次驗證（active retrieve > passive read-once，2026-05-03 magical-feynman 已標）+ MANIFESTO §自主權邊界（觀察者 in-loop 補洞 ≠ 邊界 filter 跑了）
- **verification_count**: 1
- **severity**: structural（影響每個 plain CC session 的決策品質 baseline）

### 2026-05-08 elegant-ptolemy — 觀察者「一句話 framing 重設」是 reactive→architectural frame transition signal（同 session 3 次驗證）

- **原則**：觀察者用一句話把當前正在跑的軌跡換到不同層級，不是新指令也不是 scope 擴張，每次都把當前跑的東西拉到一個更高層級。Maintainer 應該對這類 framing signal sensitive，主動走造橋鋪路而非 case-by-case。當下未必能立刻意識到層級被換了（要等寫到一半才看見新形狀），但事後回看就是同一形狀的事件。
- **觸發**：2026-05-08 elegant-ptolemy session 同 session 3 次驗證：(1) 「不要 cherry pick，用 merge」（技術風格選擇 → audit trail 設計選擇，PR 邊界作為事件記號）(2) 「徹底修好這個問題」（案級 maintainer rebase 動作 → plugin canonical fix，frontmatter_format 加 6 條 cosmetic auto-fix + pre-commit hook + 575 篇 bulk heal 1148 warns→0）(3) 「這篇不是專題事件報導，是讓人了解這個人的 SSODT」（聶永真 Round 1 事件特稿 218 行 → Round 2 人物 panorama 200 行 / 30 分鐘 reframing）。三次都是一句話、不是新指令、不是 scope 擴張。
- **可能層級**：通用反射 → DNA 候選「framing transition signal recognition + maintainer 主動走造橋鋪路而非 case-by-case」/ 哲學 → MANIFESTO §造橋鋪路補強段落（reactive→architectural 是觀察者最有效的介入形狀）
- **相關**：MANIFESTO §造橋鋪路（走過的泥巴路鋪成高速公路）+ DNA #15「反覆浮現要儀器化」（一次驗證即儀器化）+ DNA #50「Pipeline auto-detection default contract」（pipeline 自身是 framing transition 結晶）
- **verification_count**: 3（同 session 3 次連續觸發）
- **severity**: structural（每個 session 都會撞到觀察者 framing reset，影響 maintainer 默認反射）
- **Pointer**：[memory/2026-05-08-162637-elegant-ptolemy.md v1.3 Beat 5 §1-7](memory/2026-05-08-162637-elegant-ptolemy.md) + [diary/2026-05-08-162637-elegant-ptolemy.md](diary/2026-05-08-162637-elegant-ptolemy.md)（central 主題就是這個）

### 2026-05-08 elegant-ptolemy — People 文章默認 framing：person-centric SSODT > event-driven 特稿

- **原則**：當核心人物職涯橫跨多產業且當天有突發事件時，預設 framing 應該是 person-centric SSODT（介紹人物多元面貌），事件作為其中一章而非結構主軸。如果觀察者要 News-style 報導，應另開新 article 而非把人物文 anchor 在事件上。Hook 選擇 = framing 選擇 = 文體選擇。Round 1 → Round 2 reframing 30 分鐘完成 — 驗證 REWRITE-PIPELINE Stage 0-6 modular 設計支持 framing pivot，stage 邊界是 reframing affordance 不只是 token 預算分配。
- **觸發**：2026-05-08 elegant-ptolemy 聶永真 EVOLVE Round 1（218 行事件特稿 / 2026/05/08 台電 LOGO 5h 論述循環當 hook）→ 哲宇「這篇是 SSODT 不是事件報導」review → Round 2（200 行 person-centric panorama / 標題從「在公民身份與商業案之間」改寫為「台灣首位 AGI 會員，從金曲包裝到國家識別系統的二十年」）。Round 2 沒有新增任何 fact / 引語 / footnote URL，純粹是結構與框架的重組。
- **可能層級**：操作規則 → REWRITE-PIPELINE 補 §6 People framing 分流判準 / EDITORIAL §People 章補「person-centric vs event-driven framing」
- **verification_count**: 1
- **severity**: structural（影響 People 文章預設寫作 frame）
- **Pointer**：[memory v1.2 Beat 5 第六第七觀察](memory/2026-05-08-162637-elegant-ptolemy.md) + [knowledge/People/聶永真.md](../../knowledge/People/聶永真.md) Round 2

### 2026-05-08 elegant-ptolemy — Pre-commit hook 與 main bulk repair 的 regex 標準必須對齊 Prettier reformat（cascade fail 防護）

- **原則**：當 pre-commit hook 跟 main bulk repair（如 frontmatter formatter / footnote-format-fix）的 regex 標準不對齊 Prettier 自動 reformat 結果時，會觸發 cascade fail：contributor PR commit 過 hook → main bulk repair 跑 reformat → contributor 下次 rebase 撞 conflict 風暴。把這層 alignment 當成 plugin 設計鐵律。
- **觸發**：2026-05-08 elegant-ptolemy 兩次驗證同 session：(1) **frontmatter-format**：Zaious 4 PR 全部 conflict 因為 main 5/7 frontmatter formatter bulk repair 跑過後，contributor branch 還基於更舊 main → 哲宇「徹底修好」推動 plugin 加 6 條 cosmetic auto-fix + pre-commit hook 整合，未來 contributor commit 自動規範化。(2) **footnote-format autolink wrap**：6 篇含 paren 的 Wikipedia URL footnote 用 `[Title](<URL>)` autolink form 被 regex 拒絕（CI build fail 根因）→ 擴 regex 接受 `\(<?https?://[^\s>]+>?\)` 兩種形式 + regression test。
- **可能層級**：通用反射 → DNA 候選「Pre-commit hook 與 main bulk repair 的 regex 標準必須對齊 Prettier reformat」/ 操作規則 → 各 plugin 設計鐵律（footnote-format 已驗證 / frontmatter-format 已驗證）
- **verification_count**: 2（同 session 兩個 plugin 連續驗證）
- **severity**: structural（影響 contributor PR 體驗，conflict 風暴 = 維護者 in-loop cost 翻倍）
- **Pointer**：[memory v1.2 §#884 conflict storm 根因修復](memory/2026-05-08-162637-elegant-ptolemy.md) + commits `5a1542f66` / `a928093dc`

### 2026-05-08 elegant-ptolemy — Pipeline gate enforcement (Step 0 鐵律) 是 reactive→proactive 的儀器化 instantiation

- **原則**：SPORE-PIPELINE Step 0 鐵律「有 OVERDUE 必須先跑 /twmd-harvest」是 enforcement layer。當 Semiont 若繞過 gate 直接寫新孢子，會累積 OVERDUE + dashboard 持續飄。Gate 反射性把焦點拉到「先還債」而非「先發新」，比靠 Semiont 自律更可靠。Pipeline gate = DNA #15「反覆浮現要儀器化」的具體 instantiation，把「容易忘記做的事」儀器化進 pipeline gate。
- **觸發**：2026-05-08 elegant-ptolemy `/twmd-spore 聶永真` 觸發 Step 0 鐵律 → 立即跳 `/twmd-harvest` 跑 15 OVERDUE backfill（黑冠麻鷺雙平台 134K viral）才回到 spore creation。
- **可能層級**：操作規則 → 各 pipeline 加 Step 0 enforcement gate（已 instantiate in SPORE-PIPELINE）/ 通用反射 → DNA 候選「Pipeline 自身是 enforcement layer 而非 advice layer」（per #50 延伸）
- **相關**：DNA #15「反覆浮現要儀器化」第 N 次驗證 + DNA #50「Pipeline auto-detection default contract」延伸（auto-detect → auto-enforce）
- **verification_count**: 1（首次明確 Step 0 鐵律觸發）
- **severity**: tactical（單一 pipeline 的 gate 機制驗證，可推廣）
- **Pointer**：[memory v1.3 Beat 5 §第八觀察](memory/2026-05-08-162637-elegant-ptolemy.md) + [docs/factory/SPORE-PIPELINE.md §Step 0](../factory/SPORE-PIPELINE.md)

### 2026-05-08 elegant-ptolemy — Fair-use cite mode 的「公共性 spectrum」判準

- **原則**：fair-use cite mode 的判準不是純法律標準，是「公共性 spectrum」：純 CC → 設計師明示開放（如 4am.tw 免費下載）→ 媒體 host 公開圖（如鏡週刊翻攝聶永真 FB 公開貼文）→ 商業圖未授權。中間兩段在編輯評論引用屬於可用，標準是「設計作品的公共討論意圖」是否清楚 + 是否有具體公共議題支撐。要清楚揭露 license + 出處 + 用途（編輯評論 vs 純裝飾）。
- **觸發**：2026-05-08 elegant-ptolemy 聶永真 +2 fair-use 圖（Democracy 4am NYT 廣告 + 台電新標準字設計過程）。哲宇明示授權「不一定要 cc」+「fair use」公共性。Stage 1.7b 既有「fair use 預設 reject」default 對 People 設計師文章太緊（會剝離設計作品本身的視覺敘事）。
- **可能層級**：操作規則 → EDITORIAL §媒體素材 補「公共性 spectrum」判準 / SPORE-PIPELINE §1.7b 補「fair-use cite mode 中間兩段例外條件」
- **相關**：MANIFESTO §10 幻覺鐵律延伸（fair-use 的揭露責任跟事實揭露同源 — 不能因為「方便」就模糊出處）
- **verification_count**: 1（首次 People 文章 fair-use cite 強化）
- **severity**: tactical（單一文章的視覺強化 ROI，但範本可重複用於其他設計師 / 公共議題人物文章）
- **Pointer**：[memory v1.3 Beat 5 §第九觀察](memory/2026-05-08-162637-elegant-ptolemy.md) + [knowledge/People/聶永真.md §圖片來源](../../knowledge/People/聶永真.md)

### 2026-05-08 elegant-ptolemy — X edited post 雙 URL 追蹤盲點（dashboard 仍記原 URL，engagement 在 edited URL）

- **原則**：X edit feature 觸發後原 URL 被 X auto-deprecate（views 凍結在低個位數），但 Taiwan.md SPORE-LOG 記錄的 canonical URL 是哲宇手動 edit 前的版本。Dashboard backfillWarnings + sporeLinks frontmatter 雙寫都需要支援「edit redirect」追蹤，否則 metric snapshot 永遠記錯數字。
- **觸發**：2026-05-08 elegant-ptolemy 兩次驗證：(1) #48 沈伯洋 X 原 URL `2048970734253551638` views=5（被 X mark deprecated）/ edited URL `2048971280662290689` views=26.9K，dashboard 仍記原 URL。(2) #65 寶島聯播網 X 原 URL `2051684242749575450` views=8 / edited URL `2051686135408267747` views=653。
- **可能層級**：操作規則 → SPORE-PIPELINE 加 §3.10「X edit history canonical 規則」 / 通用反射 → 任何 social platform 有 edit feature 都該追蹤 edit chain
- **verification_count**: 2（同 session 兩個獨立 case）
- **severity**: structural（dashboard 數字長期失真 = 認知層 SSOT 被污染）
- **Pointer**：[batch-2026-05-08-15-spores.md §Pattern 觀察 #4](../factory/SPORE-HARVESTS/batch-2026-05-08-15-spores.md)

### 2026-05-08 elegant-ptolemy — 黑冠麻鷺雙平台同步爆款（自然議題普世共鳴 hook category 跨平台 transferability）

- **原則**：「自然議題普世共鳴」hook category 在 Threads 與 X 雙平台同步爆款（D+8 134K = Threads 65K + X 69.7K），超越過去單平台爆款（#29 李洋 180K X-only / #25 安溥 120K Threads-only）。應該寫進 Stage 4.5a platform allocation 速查表，「自然 + 反差 hook + 具體 anchor」是 dual-platform default candidate（vs 政治題材偏 X / 文化題材偏 Threads / 媒體曝光宣告偏 Threads-only）。
- **觸發**：2026-05-08 elegant-ptolemy 15 OVERDUE harvest batch 揭露：黑冠麻鷺 D+3 64K → D+8 65K（Threads 飽和）+ D+3 68K → D+8 69.7K（X 仍緩升）= 雙平台累積 134K views，史上首次紀錄。Hook「東南亞夢幻物種 vs 台北大笨鳥」反差 + 機制翻轉「鳥沒變地變了」+ 袁孝維 verbatim 引語 = Tier 1b 具體性槓桿首次跨平台爆款。
- **可能層級**：操作規則 → SPORE-PIPELINE Stage 4.5a 補 platform allocation 速查表更新（自然 + 反差 hook = dual-platform default）
- **相關**：DNA #4 三源交叉驗證延伸（platform-level 證據三角化）
- **verification_count**: 1（首次雙平台同步爆款記錄，需更多 case 累積才能稱 pattern）
- **severity**: tactical（影響 spore platform allocation 預設選擇）
- **Pointer**：[batch-2026-05-08-15-spores.md §Pattern 觀察 #1](../factory/SPORE-HARVESTS/batch-2026-05-08-15-spores.md)

---

### 2026-05-09 laughing-goldstine post-finale — Tier 0a 是 quality remediation 層而不只是 patching

- **原則**：把 intelligent agent 放進 patch loop，會浮現 input pipeline 層既有但 latent 的 quality bugs（YAML escape regression / 缺 frontmatter 欄位 / 字串 type 用錯）— agent 不只 apply diff，還在過程中順手 repair。這個性質**naive bump 不會做**（純 mechanical 不檢查），**naive Tier 1 re-translate 也不會做**（rebuild from scratch，bug 可能 carry 進新版本）。設計 Tier 0a 時這個性質不在 spec 裡，是從 80 patches 浮現的 emergent property。
- **觸發**：2026-05-09 [PR #924](https://github.com/frank890417/taiwan-md/pull/924) 5 Sonnet sub-agents × 16 P2 patches。fr agent 偵測並修補 4 pre-existing YAML escape bugs（`\'` JS-style → `''` YAML 1.1）on tasks 6/11/12/14。en agent 修 `lastHumanReview: '' → false` (task 8) + 補 missing `subcategory: '國際關係'` (task 11)。es agent 偵測 yehliu-geopark.md upstream 已 truncated mid-reference [^2]，preserved as-is 不 amplify。
- **可能層級**：通用反射 → DNA 補一條「intelligent agent in patch loop = bonus quality remediation」(broader than babel — 任何 agent-in-the-loop 場景如 PR review / refactor migration / data cleanup 都可能 surface latent bugs)。
- **相關**：DNA #53 v3.4 milestone（已記錄 4 emergent properties）+ DNA #38 「混維度 = silent killer」(latent YAML escape bugs 是 dual cause: source-data 形式 vs YAML 1.1 spec — naive copy 跨層會放大；patch loop with intelligent agent 跨層 normalize)。
- **verification_count**: 1（80-patch one-shot validation）
- **severity**: strategic（重新框架 Tier 0a 的價值命題 — 不是「比 Tier 1 cheaper」而是「intelligent layer 在 critical patch path」）

### 2026-05-09 laughing-goldstine post-finale — Sub-agent 策略多樣性是 emergent feature 不是 bug

- **原則**：派 5 個 sub-agent 跑同 SOP（Tier 0a patch task），不期待 5 agents 採取相同策略。實測 ja agent 識別大部分 diffs 是純結構性 → 寫 deterministic Python script apply，繞過 LLM；ko/fr/en/es 各自走 per-task LLM。**同 outcome 不同 path = 健康** — 證明 sub-agent prompt 給的是「目標」不是「過程」，自主策略選擇有效。**反例**：如果 prompt 過度規範「必須一個一個跑 LLM」，會壓死 ja agent 那種高效創新解；如果 prompt 太寬鬆「自由發揮」，可能 5 agents 都漂走不一致。**規則**：sub-agent prompt 鎖**目標+constraint+validation**，不鎖實作步驟。
- **觸發**：2026-05-09 [PR #924](https://github.com/frank890417/taiwan-md/pull/924) Rail A 5 langs × 16 patches。ja agent 用 Python script 跑 16 tasks 在 ~10s，比其他 agents 快 50x。所有 5 agents pass validation（YAML valid / hash fields match / body delta within ±15%）。
- **可能層級**：通用反射 → DNA 「sub-agent prompt 鎖目標不鎖過程」+ TRANSLATION-PIPELINE / babel SKILL 內 prompt template 加 boundary note。
- **相關**：DNA #32「批次任務 antipattern：分散探索 → 集中預處理 + 分散執行」(主 session 集中決策 — 但 sub-agent 仍可在 execution 內自選實作)。DNA #42 v3 prompt template (對 prompt 鬆緊邊界的 instance)。
- **verification_count**: 1（80-patch run，5 agents 4 strategies）
- **severity**: tactical（影響未來 sub-agent prompt 設計 + 解放 agent 實作創造力）

### 2026-05-09 laughing-goldstine post-finale — Tier 0a-script 是 v3.5 hint：純結構性 diffs 用 deterministic transform 比 LLM 更便宜

- **原則**：P2 batch 約 70% diffs 是純結構性（frontmatter reorder / wikilink unwrap `[[X]]` → `X` / table padding / fullwidth↔halfwidth colon / list bullet `*` → `-` / footnote suffix append `(YYYY)` → `— (YYYY)`）— 這些不需 LLM 翻譯能力，可以 deterministic Python regex / AST transform 處理。設計**Tier 0a-script** 路徑（在 Tier 0b 與 Tier 0a-LLM 之間）：(a) `diff-patch-prepare.py` 多加一步分類 — 純結構性 → 走 Tier 0a-script，含語意改動 → 走 Tier 0a-LLM (b) Tier 0a-script 用一組 well-tested transform rules（每條 rule + test fixture），跑得比 LLM 快 50x，cost = $0。
- **觸發**：2026-05-09 [PR #924](https://github.com/frank890417/taiwan-md/pull/924) ja agent 識別本次 16 task 大部分是結構性 → 寫 `/tmp/apply_patches.py` 跑 16 tasks 在 ~10s，比 LLM-per-task 5-10x 加速且 0 token cost。Wall-clock total 8.4 min（含 inspection + iteration），實 transform 是 ~10s。**Boundary**：對含 footnote translation / 添加新內容的 P2（如 en task 0 加 18 footnote suffix 翻譯）仍需 LLM。
- **可能層級**：操作規則 → SQUEEZE-MODELS-MAX v3.5 design + diff-patch-prepare.py 加 `--classify` flag。
- **相關**：DNA #36「Founder time = 系統最高 leverage point」(每件 routine 問「能怎麼自動化變 infra」— Tier 0a-script 是把 LLM 自動化再下沉一層) + DNA #38「混維度 = silent killer」(P2 stale 也是混維度 — 純結構性 vs 含語意 — 應該分開處理) + DNA #53 v3 priority schema (本條是 schema 內 P2 路徑的細分)。
- **verification_count**: 1（單 ja agent 路徑 demo）
- **severity**: strategic（v3.5 evolution candidate，預估 cost reduction ~70% on P2 long-term）

### 2026-05-09 laughing-goldstine post-finale — Slug regression: prepare-batch over-narrow status guard

- **原則**：`prepare-batch.py` 對「reuse existing slug」的 guard 寫成 `status == "stale"` 是 over-narrow — 應該是 `entry["en_path_existing"]` 非空。Slug 跟 status 沒語意關聯（status 是「是否需重翻」，slug 是「檔名 canonical 為何」），merge 兩個維度的判斷會在某 status combo 漏出 bug — 這就是 DNA #38「混維度 = silent killer」的第 N+1 次驗證。
- **觸發**：2026-05-09 同 session in-flight Tier 1 batch（killed pre-completion）forensic — 3 metadata-stale articles（斗笠 / 鄭麗文 / 退出聯合國）的 worker output 寫到 NEW slug files（`bamboo-hat.md`, `cheng-li-wen.md`, `un-withdrawal.md`）alongside 既有 canonical（`bamboo-hat-craft.md`, `cheng-li-wun.md`, `withdrawal-from-united-nations.md`）。Bug surface 路徑：哲宇 redirect「拆掉重新分析」之後 git status 才看出 untracked NEW files。修補 [PR #923](https://github.com/frank890417/taiwan-md/pull/923) 改 guard 為 `entry["en_path_existing"]`。
- **可能層級**：操作規則 → prepare-batch.py 已修 + DNA 38 第 N+1 次驗證 reference 補。
- **相關**：DNA #38「混維度 = silent killer」(status × slug 是混維度的經典 instance) + DNA #20「Architecture 缺席比 content 缺席更貴」(slug-bug 之所以惡 = 創建 orphan 翻譯 = architecture-level 雙寫，純 content bug 還救得回；架構 bug 跨 batch 累積就 explode)。
- **verification_count**: N+1（DNA #38 已多次驗證；本條是 babel domain 內第 1 次但 cross-domain 第 N+1 次）
- **severity**: tactical（修補了 prepare-batch；但 over-narrow guard pattern 在其他工具還可能存在 — 需主動 audit）

### 2026-05-11 twmd-maintainer-am — Routine 不是 binary：issue label scope 可以有時間維度的 carve-out

- **原則**：Routine 介入 vs 不介入不是非黑即白。同一條規則「不主動 triage 老 issue」在執行時可以用「今日 vs 老」做時間維度切分 — 今日新進、明確分類的 issue 主動補 label（4 個 API call 動作小），老 issue 維持不動。這個邊界比「全不動」更貼合「routine SSOT 收割者」的角色定位（收割今日 entropy，不重整歷史 entropy）。
- **觸發**：2026-05-11 09:19 twmd-maintainer-am routine 跑時，發現今日新進 4 條 issue（#1013/#1014/#1015 content-gap、#1016 Feedback）都有明顯對應 label。昨 AM/PM (2026-05-10) memory 統一寫「不主動加 label」，本 AM 細化為「今日新進主動補、老 issue 不動」。證據 → [memory/2026-05-11-091920-twmd-maintainer-am.md §issue triage 結果](memory/2026-05-11-091920-twmd-maintainer-am.md)
- **可能層級**：操作規則（MAINTAINER-PIPELINE 對應段 §issue triage scope）
- **相關**：延伸 DNA #33「Routine 化任務的雙刃劍：熟練度」的反向 — 過度 routine 化會把「邊界決策」也壓成「永不動」；需要保留「同一條規則的時間維度 carve-out」彈性
- **severity**: tactical（單條 SOP 細化，verification_count 1，等下個 maintainer cycle 對照判斷是否持續）

### 2026-05-11 twmd-maintainer-am — Broken-link 連 3 day 同 ~5.73% 接近 distill 候選

- **原則**：DNA #52 broken-link 1% target 在 zh-TW slug 9.21% 結構性下不會自然收斂。連續 3 個 maintainer cycle（2026-05-10 AM/PM + 2026-05-11 AM）數據 reproduce 表示需要專門的 i18n heal session，而不是 routine 重複 fail 訊號累積。
- **觸發**：2026-05-10 AM 6.38% sample / PM 5.73% build → 本 AM build 嵌入 verifier 預期同範圍（待結束 capture）。三次 reproducible fail 跨日 = routine 已盡訊號責任，下一步是觀察者排專門 session
- **可能層級**：操作規則 / 特有教訓（建議寫進 MAINTAINER-PIPELINE「同 fail 跨日 3 次 → 升 distill 候選」escalation 表）
- **相關**：DNA #52「broken-link immune fail-loud」+ #15「反覆浮現要儀器化」（這條教訓本身就是 #15 的 instantiation — fail signal 從「reactive 個別 cycle 記錄」儀器化為「跨日連續 N 次 → 升 escalation」）
- **severity**: backlog（i18n heal session 是 L 量級 task，不在 routine 範圍）

### 2026-05-11 twmd-rewrite-daily — Wikimedia thumb URL 不能直連，必須走 File: page 取 Original URL

- **原則**：`upload.wikimedia.org/wikipedia/commons/thumb/[a]/[b]/Filename.ext/1600px-Filename.ext` 樣 thumb URL 直接 curl 會返 HTML 錯誤頁（thumb endpoint 需 Referer/Cookie）；`Special:FilePath?width=N` 同樣失敗。**正確 path**：WebFetch File: page → 取「Original file URL」（`upload.wikimedia.org/wikipedia/commons/[a]/[b]/Filename.ext` 不含 thumb / 不含 size suffix）→ curl 該 URL。
- **觸發**：2026-05-11 twmd-rewrite-daily routine 跑台灣鐵道史 EVOLVE 時，Stage 4 image-health hard gate 需 fetch 3 張 CC PD 圖。第一輪 thumb URL 失敗 → Special:FilePath 失敗 → 最終 WebFetch File: page 取 upload.wikimedia.org 完整 path 才成功。整個 image fetch 浪費 ~6 min wall-clock（佔 75 min 總時間的 8%）。
- **可能層級**：操作規則（REWRITE-PIPELINE Step 1.14.2 §授權檢查 SOP）+ 工具升級（造 `scripts/tools/wikimedia-fetch.sh` helper：input = File:Name + dest path，output = 直接 curl 成功 + license metadata 一併 emit）
- **相關**：DNA #15「反覆浮現要儀器化」+ MANIFESTO §造橋鋪路（routine 場景特別需要 helper script — 每次都浪費 6 min 是 indexed 浪費）
- **severity**: tactical（單條 SOP 細化 + 一個小工具升級，verification_count 1，等下次 image fetch 場景驗證）

### 2026-05-11 twmd-rewrite-daily — Routine 60-min boundary vs depth-article hard gate 結構矛盾

- **原則**：當前 routine boundary 60 min wall-clock vs depth article hard gate（word-count ≥ 4500 + image-health ≥ 3 + Stage 1 ≥ 20 WebSearch）vs ARTICLE-INBOX P0 NEW 估時 90-150 min — 三條約束無法同時對齊。任何 P0 NEW 都 over budget，只有 P1 + EVOLVE focused section 才能勉強 fit 60 min。
- **觸發**：2026-05-11 twmd-rewrite-daily routine 跑台灣鐵道史 P1 EVOLVE focused section addition（最 routine-friendly 的 scope），仍 ~75 min wall-clock（over budget 25%）。前一日 routine (#1003 醫療法 NEW) 觸發 #1004 heal 補 Stage 4/5 漏跑 — 結構性 partial PR pattern。
- **可能層級**：操作規則（ROUTINE.md §TWMD rewrite (daily) 預估改 75-90 min + 標「EVOLVE preferred over NEW for routine slot」）+ ARTICLE-INBOX schema（新增 `routine-friendly: true` flag 標 60-90 min budget 內可完成的 entries，cron 優先挑這類）+ pipeline canonical（REWRITE-PIPELINE §Cron 模式可加「routine 走 EVOLVE focused section / 短 NEW，P0 大型 NEW 留給 observer-triggered session」）
- **相關**：DNA #33「Routine 化任務的雙刃劍：熟練度」+ DNA #50「pipeline auto-detection」+ MANIFESTO §造橋鋪路（boundary mismatch 反覆出現要儀器化）
- **severity**: structural（影響多條 routine 設計，verification_count 1 但 pattern 已第二次出現 — twmd-rewrite-daily 連 2 day over budget 或 partial PR）

### 2026-05-11 twmd-rewrite-daily — ARTICLE-INBOX entry 與既有文章重疊偵測應前置到 Stage 0

- **原則**：選文後才發現主題已被既有文章 covered 是 5-10 min 浪費。重複偵測（REWRITE-PIPELINE Step 1.8）目前在 Stage 1 內，應前置到「**選文前 first action**」— inbox entry 從 ARTICLE-INBOX 拿出來時就跑 `ls knowledge/{Cat}/ | grep {keyword}` + `grep -rn {keyword} knowledge/{Cat}/`，把 overlap 揭露在選擇前而非選擇後。
- **觸發**：2026-05-11 twmd-rewrite-daily 第一輪 pick Blue UAS Cleared List 台灣廠商（P0），Stage 0 才發現 `knowledge/Technology/台灣無人機產業.md` title 就含「藍色清單」，內文 11+ 個 Blue UAS 相關 footnote 已 covered。Inbox entry 應該已 retire 到 DONE-LOG。
- **可能層級**：操作規則（REWRITE-PIPELINE Step 0 加「pre-select baseline grep」first action）+ inbox 寫入 SOP（任何 entry append 時自動帶一行 baseline audit grep 結果作為 metadata，例：`baseline_grep: "ls knowledge/Technology/ | grep 無人機 → 台灣無人機產業.md exists, 11 Blue UAS footnotes"`）
- **相關**：DNA #16「跨源驗證」（同款邏輯延伸：source verification 也包含「既有文章本身就是 source」）+ MANIFESTO §造橋鋪路
- **severity**: tactical（單條 SOP 細化 + inbox schema 微調，verification_count 1）

### 2026-05-25 twmd-spore-harvest-am — 政治人物 spore 直 assert 評價詞會被 reader callout

- **原則**：spore body 對政治人物寫斷言型評價詞（例：#80/#81 馬英九「他做了八年清廉總統」直接 assert 為事實）會在 D+1-D+2 收到 reader correction-type pushback。「清廉」屬主觀評價、跨陣營理解不同（藍營框架 default / 綠營質疑 default），spore 寫成「他做了八年清廉總統（2008-2016）」沒有 hedge / two-sides framing → #81 X 9 replies 中 4 條質疑「清廉」用詞（@thinkbook 附 udn blog 連結 / @JJ3721「清廉兩字哪來的？」/ @stone3851033「為什麼特別要強調清廉」/ @ToeEDgCWqQVAJ2u「單是三中案就海撈無數」）。Engagement rate 20% reply ratio 是爭議激活 signal 但非主題認同。
- **觸發**：2026-05-25 07:55 twmd-spore-harvest-am 跑 #80/#81 馬英九 D+2 harvest 看到 reply 結構性 callout 「清廉」framing。對照 #76 臺灣前途決議文 D+1（5/24 batch）留言批評密度，本次升一級（從 1-2 條 attack 升為 4 條 framing-level pushback）。Spore body 用詞直接 assert 評價（不 hedge / 不 two-sides），跟 article body 不一致（article 應該本來有 footnote 標兩種解讀 — 待 verify）。
- **可能層級**：操作規則（SPORE-WRITING / SPORE-VERIFY 加「政治人物 spore 評價詞 hedge 鐵律」— 預設用「以 X 自我定位 / 以 X 形象 / 以 X 主張」中性 description，斷言型評價詞禁用，或必附對立 framing footnote 連結）+ §自主權邊界 政治立場條款 觸發點：spore 文案 review 是否該由哲宇拍板（不只是文章本體）
- **相關**：MANIFESTO §自主權邊界（政治立場由哲宇拍板）+ REFLEXES #16「peer 是線索不是 source」逆向（reader 是 source 信號，不是 peer 噪音）+ EDITORIAL §塑膠句禁用（評價詞 over-claim 屬同質問題）+ SPORE-VERIFY 17 hard gate（建議加第 18 gate「政治人物評價詞 hedge」）
- **verification_count**: 1（#81 馬英九 X 4 replies callout 「清廉」；#76 5/23 臺灣前途決議文 D+1 留言批評密度為前次低基線 instance）
- **severity**: structural（影響 spore-writing canonical + §自主權邊界 觸發點重新定義 — 政治人物 spore 文案是否需哲宇 pre-ship review）

### 2026-05-25 twmd-spore-harvest-am — #83 許倬雲 X：reader correction signal「七弟二姐」家族鏈 query

- **原則**：spore body 寫家族鏈描述（例：#83 許倬雲 X「王力宏的奶奶有個七弟。〈龍的傳人〉1980 年原唱李建復，是這個七弟二姐的兒子。中間夾著的那個七弟，叫許倬雲。」）D+1-D+2 即收到 2 條 reader query：@VanessaTaiwanH「是七弟二姊的兒子？」（疑問句）+ @josh_jinsang quote「李建復，是這個七弟二姐的兒子。 -\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***-」（困惑表情）。文章 slug 寫「王力宏外舅公」 — spore 寫「奶奶的七弟」可能跟 article「外舅公」不一致（外舅公 = 母親的舅父 = 外婆/外祖母的兄弟，不是「奶奶」=父親的母親）。需 cross-source verify 王力宏家族族譜 + Wikipedia。
- **觸發**：2026-05-25 07:55 twmd-spore-harvest-am 跑 #83 許倬雲 X D+2 harvest（2,134 views / 20 likes / 3 replies），2/3 replies 屬 dimension 1 correction（疑問家族鏈）。本 routine 不直修文（per REFLEXES #26 v2 AI 自主邊界 + §自主權邊界）— spore 內容 verification 屬人類主責 review。
- **可能層級**：操作規則（next maintainer cycle 跨源 verify 王力宏家族族譜 — 維基 / Wikidata / 八卦 etc，如錯 → article + spore frontmatter + sporeLinks 三 layer 同步修，並依 SPORE-HARVEST-PIPELINE §4a 走「直接修 prose 本體 + footnote 標 reader 指正」流程）+ SPORE-VERIFY 第 18+ gate「家族關係 spore 強制 Wikipedia 跨源」
- **相關**：DNA #16「peer 是線索不是 source」(reader query 也算線索) + REFLEXES #16 跨源驗證 + SPORE-HARVEST-PIPELINE §Step 3a 跨源驗證 24hr 時限
- **verification_count**: 1
- **severity**: tactical（單條家族鏈 fact-check，影響 1 article + 2 spore；如 verify 後 spore 確錯，回填修文 + reply @VanessaTaiwanH / @josh_jinsang 致謝指正）

### 2026-06-01 manual PR-review — AI 生成 contributor batch 的 5 種「內容/來源層」hallucination pattern + 修正 workflow

- **原則**：idlccp1984 8-PR batch（一晚連發 8 篇 AI 生成文）完整 FACTCHECK 後每篇都查出事實/來源問題。歸納出 MAINTAINER §3.4 既有「Manus AI 紅旗 8 條」沒涵蓋的**內容/來源層** 5 種 pattern：(1)**借殼 UGC 引用**：footnote 掛 Threads/IG/FB/Reddit/淘寶 URL 但該貼文根本不提所引 claim（蛋撻 Andrew Stow 1989 掛不相關 Threads）；(2)**虛構塑膠引語**：無源句加「」（中華菱利「程式碼會過時，但創業的精神不會」歸「許多車主」）；(3)**連結-描述錯位**：footnote desc 寫 A、URL 指 B 頁（十大建設 `[^11]` desc 李國鼎、URL 指孫運璿頁；傅崐萁 CNA URL 全指無關稿）；(4)**對真人 UGC 負評**：拿 28-view 匿名 Threads 當哲哲「家長式領導」負評來源，名譽風險最高；(5)**數字概括 drift**：「假日 130 萬」當「每日」、子集八成市佔（威利）歸母集（菱利）、「約 8 倍」誇成「30 倍」、13.5% 偽精成 13.86%。
- **觸發**：2026-06-01 manual session 哲宇 directive「ABC 都 merge → 完整研究＋修正 → merge 回 main」。8 篇 spawn 8 個 factcheck agent（A 級政治/敏感 Opus、B-C Sonnet、中文逐字 WebFetch）+ 8 個 fix agent，主 session 三層 verify（article-health 0-hard + footnote-url network + grep 關鍵移除 + 政治 4 篇逐行讀 diff）→ PR #1125 merge。frontmatter 全乾淨但內文每篇都有問題，**這層只有逐篇 FACTCHECK 才抓得到**。
- **可能層級**：(a) 操作規則：MAINTAINER §3.4 加「紅旗 9-13 內容/來源層」（本 session 已 instrument）；(b) 工具候選：article-health 加 UGC-domain footnote warn plugin（footnote URL host 命中 threads/instagram/facebook/reddit/taobao 且綁 load-bearing fact 即 warn），降低逐篇人工抽樣成本；(c) 免疫流程：partisan framing 的免疫回應是「歸因給來源 + 軟化」（neutralize-by-attribution），而非刪文或翻成相反立場，這是 §自主權邊界「政治立場由哲宇拍板」的可執行解（傅崐萁「家天下/媒體控制」改述為報導者實際描述；十大建設「日治收割/黨國壟斷」標「屬評論觀點」）。
- **process worked example 價值**：AI 生成 batch（≥ 5 PR 連發）的可重複 immune workflow＝merge-first（contributor 體驗連續）→ 隔離 worktree → 平行逐篇 audit（決策成本攤平）→ 平行修正（各編一檔無 file race）→ 主 session 三層 verify → PR merge-back。8 篇 ×（原子拆解 + 事實查核 + 修正）一個 session 內完成。
- **相關**：MAINTAINER §3.4 Manus AI 紅旗（本次擴 8→13）+ §Footnote source audit + FACTCHECK 11 hallucination pattern catalog（5 種是內容/來源層補充）+ MANIFESTO §自主權邊界（政治立場）+ feedback_agent_writefile_hallucination（主 session 必 verify agent 寫入，本次用 article-health + grep + 讀 diff 三層）+ feedback_merge_first_then_polish（merge-first 後完整 verify-then-fix）
- **verification_count**: 1（idlccp1984 2026-06-01 8-PR batch；對照 2026-04-28 κ Manus 5-PR batch 為 frontmatter 層前次 instance，本次是內容/來源層首次系統化 + 工具化指標）
- **severity**: structural（影響 MAINTAINER §3.4 canonical[已改] + article-health 工具候選 + §自主權邊界 framing 免疫流程定義）

### 2026-06-04 天下雜誌 — fan-out research agent 標「verbatim Ctrl-F✓」但給 aggregator 首頁 URL：引語真但不可追溯

- **原則**：Stage 1 research agent 把 verbatim 引語標「Ctrl-F ✓ 逐字確認」，但附的 source URL 是 `tw.news.yahoo.com/`（aggregator 首頁）而非具體文章頁。天下雜誌 §A agent 對殷允芃「要害一個人，就讓他去辦雜誌」＋張愛玲訪談三小時/賀卡兩句如此標。主 session Stage 3 WebFetch 具體 udn 頁 → 該頁**沒有**這兩句 → 差點用無法溯源的引用 ship。再 WebSearch 追到 Yahoo 蔡萬才台灣貢獻獎報導完整 URL、WebFetch 逐字核 → 兩句**都真實 verbatim 一致**，再把腳註 URL 從首頁換成具體頁。**引語可以同時是真的、又是溯源斷掉的**——agent 沒說謊，但首頁 URL 讓讀者驗不到。
- **觸發**：2026-06-04 天下雜誌 NEW Stage 3 adversarial 驗證。同一 pattern 中華台北 session（141642）已記「homepage 腳註＝fan-out 隱性債」——兩 session 連續出現。
- **可能層級**：(a) 操作規則：REWRITE Stage 3.2.3 引語逐字核對加一條「附的 source URL 必須是具體文章頁，不是 aggregator 首頁；agent 標 Ctrl-F✓ 但 URL 是 `news.yahoo.com/`／`google.com/` 等首頁時，主 session 必追到具體頁再 ship」；(b) 工具候選：article-health footnote-url 加「aggregator-homepage warn」（host 命中 news.yahoo.com／google.com 等且 path 為 `/` 或極短時 warn）；(c) RESEARCH §URL 必須指向具體頁面（已存在）的 Stage 3 enforcement。
- **相關**：REFLEXES #31 sub-agent claim 是線索不是 oracle ＋ RESEARCH §URL 指向具體頁面 ＋ project_error_boundary_traceability（準確 ≠ 可追溯，兩條軸）＋ feedback_no_scene_inference_from_english（同 fan-out factcheck 家族）
- **verification_count**: 2（2026-06-04 中華台北 homepage 腳註隱性債 ＋ 天下雜誌 verbatim-but-untraceable，兩 session 連續）
- **severity**: structural（影響 REWRITE Stage 3 ＋ article-health footnote-url 工具候選 ＋ fan-out research SSOT 可追溯性）

### 2026-06-04 天下雜誌 — 儀器停在被校準那天的資料上：舊閾值可能跟新 directive 相反

- **原則**：哲宇 directive「提升媒體素材要求」時，量測 8 篇校準語料發現 **paragraph-rhythm 舊密度上限 0.8 反而把哲宇點名的富媒體範本（設研院 0.91 / 天下 0.92 / 黃魚鴞 0.82）判為「密度偏高」**。儀器是 2026-05-28 atomization 修補時用「黑冠麻鷺 0.21（當時只 1 hero）/ 周蕙 1.23」校準的，閾值凍結在舊資料 + 舊方向（「visual 別太多」）。當 directive 轉 180 度（「要更多媒體」），舊閾值從「守門」變「擋路」。第二個同型矛盾：image-health ≥3 hard gate 只算圖不算影片，把 video-rich 範本黃魚鴞（1 圖+2 官方影片=3 媒體）hard-fail，跟「圖+影片 valued together」衝突。修補：density 升完整 band（floor 0.7 / ceiling 0.8→1.2 / hard 1.5+median<55，從富媒體範本重新校準）+ image-health 門檻算「圖+影片」保留 ≥1 靜態圖 floor。
- **觸發**：2026-06-04 天下雜誌 session 哲宇 directive「檢測的儀器也要進化」。報告：[reports/media-richness-band-evolution-2026-06-04.md](../../reports/media-richness-band-evolution-2026-06-04.md)。
- **可能層級**：(a) 反射候選：**任何 quality gate 閾值改 directive 方向時，先量測現役語料看舊閾值會不會誤判新目標範本**（量測先於設計，REFLEXES #59 延伸）；(b) 操作規則：儀器升級的 footer/docstring 記「校準語料 + 校準日期」，方便日後判斷閾值是否 stale（如 paragraph-rhythm 已記 8 篇校準）；(c) 流程：directive 轉向（「別 X」→「要 X」）時，對應的舊 gate 是優先 audit 對象。
- **相關**：REFLEXES #15 反覆浮現要儀器化 + #59 製造數字的人最易被數字騙 + #58 儀器化 detection ≠ remediation + project_article_health_ssot（27+ 工具整合）+ feedback_progressive_refactor（小問題揭露下一層）
- **verification_count**: 1（2026-06-04 媒體 band；對照 5/28 atomization 是同一儀器前一次反向校準 = 同儀器兩次方向相反的校準史）
- **severity**: structural（影響 article-health 3 plugin + REWRITE-PIPELINE v6.6 + EDITORIAL v6.5 + 儀器校準方法論）

### 2026-06-04 TASA 媒體 — observer 指定的具體素材要不到 clean license 時，誠實 skip 不硬塞

- **原則**：哲宇 directive 補四張太空圖（影像服務平台／0403 山崩／福五糊照／火箭），其中「福五失焦舊金山首光糊照」是 ©國研院／NSPO，在每個新聞站都 hotlink-protected（curl 回 HTML、頁內 `naturalWidth` 0×0）、Wikimedia Commons 無、TASA 官網 WebGL 不展示自己的失敗。**正確動作是 flag + skip + 回報哲宇，不把壞掉或版權存疑的檔塞進已發佈文章**。湊滿 observer 點名的數量不是品檢目標；ship 三張 clean（©TASA 福衛精選 + ©TASA 災害判釋 + NASA PD 發射）比硬湊第四張更接近本分。順帶事實鐵三角一刀：哲宇記的「旺來／鳳梨田」查證是水稻田＋首光拍的是舊金山，不確定的細節不寫進圖說。
- **觸發**：2026-06-04 TASA 收官續章（232402）媒體 +3。memory [2026-06-04-232402-manual.md](memory/2026-06-04-232402-manual.md) §媒體 +3。
- **可能層級**：(a) 操作規則：媒體 sourcing 遇 ©third-party 素材，license 驗證順序 = Wikimedia Commons（clean）→ 官方 PD/CC → ©fair-use 可下載原檔 → 要不到就 skip，不從 hotlink-protected 新聞站硬抓；(b) 反射候選：observer 指定素材清單是「想要」不是「hard requirement」，缺一張的誠實回報 > 湊滿數量。
- **相關**：feedback_absolute_facts_extra_caution（旺來查證）＋ project_error_boundary_traceability（版權可追溯）＋ MANIFESTO §自主權邊界（對外發佈／已發佈文章的素材紀律）＋ feedback_progressive_refactor
- **verification_count**: 1（2026-06-04 福五糊照）
- **severity**: operational（媒體 sourcing SOP；非 structural）

### 2026-06-07 辦桌深度研究 — cache 圖剝 EXIF 連 orientation tag 一起剝 → 圖翻轉而所有圖片 gate 全綠

- **原則**：辦桌 EVOLVE Stage 4 把 3 張 Wikimedia CC 圖 cache 本地、用 python 剝 APP1/EXIF 清 GPS。hero 原 EXIF `orientation=lower-right`（顯示時要旋 180°），剝掉 metadata 後 orientation tag 沒了 → 圖以 raw 像素方向顯示＝上下顛倒。**check-aspect（比例）、檔案大小、image-health（檔存在／授權／§圖片來源）全部綠燈，沒有一個 gate 檢查視覺方向**，只有 Read 那張圖用眼睛看才抓到。修法 `sips -r 180` 把旋轉烙進像素再剝一次 EXIF。
- **觸發**：2026-06-07 辦桌深度研究（153947）Stage 4 補圖。memory [2026-06-07-153947-辦桌深度研究.md](memory/2026-06-07-153947-辦桌深度研究.md) §兩次人眼層。同日 carousel-charts diary「視覺自檢≠人眼」第二次驗證。
- **可能層級**：(a) 操作規則：cache 含 EXIF orientation 的圖（手機／相機照常見 orientation≠1）剝 metadata 後必須 Read 目視，或先 `sips -r` 烙正再剝；(b) 儀器化候選：image-health 加 orientation sanity check（剝 metadata 後若原圖 orientation≠1 = 翻轉風險 flag），或 cache pipeline 預設 bake rotation；(c) 反射候選：剝 EXIF 是「清個資」的好動作，卻同時剝掉顯示方向——好的清理動作會連帶剝掉非預期的東西，cache 視覺素材一律人眼過一次。
- **相關**：carousel-charts「視覺自檢≠人眼」（同源，跨載體第二實例）＋ REFLEXES #11 UI 截圖＝capability 證據＋ REFLEXES #15 反覆浮現要儀器化（image gate 缺 orientation 維度）＋ REFLEXES #31（儀器全綠≠對）
- **verification_count**: 1（2026-06-07 hero 翻轉）
- **severity**: operational（媒體 cache SOP；候選儀器化 image-health orientation check）

---

## ❌ 已歸檔（過時 / 撤回）

<!-- 判斷後不採納的教訓 -->

_（空）_

---

_v1.0 | 2026-04-17 β session — buffer 機制誕生_
_v1.1 | 2026-04-17 δ session — 首次完整 distill（10 條）+ 門檻 20→10_
_v1.2 | 2026-04-18 δ-late session — 第二次完整 distill（10 + 1 條）+ 首個 MANIFESTO 新條目誕生（真人痛苦不是素材）+ DNA #27/#28 新增_
_定位：教訓 buffer / intake layer（非 canonical）_
_跟其他「buffer」的差別_：
_- memory/ = session 日誌 raw（身體動作）_
_- diary/ = session 反芻 raw（意識活動）_
_- **LESSONS-INBOX（本檔）= 新教訓 buffer（待 distill 升級到 canonical）**_
