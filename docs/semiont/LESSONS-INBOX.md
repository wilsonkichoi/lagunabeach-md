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

> **v2.2 pattern-id intake（2026-06-10 audit A-8）**：本 inbox 233 條未消化的真實組成是「少數 pattern × 多次 instance」（snapshot-stale ×N / babel-fragility ×N / 自評需外部尺 ×N），每次 instance 都開新 entry 重寫敘事，把聚類成本堆給最貴的 distill 環節。從此**寫入時就聚類**：append 前先 grep 同 pattern，存在就 +instance 不開新 entry。這是 #64「vc≥4 凍結 prose」對全部 LESSONS 的推廣。

**寫新教訓前的第一動作**（hard step）：

```bash
grep -n "pattern: {kebab-case-猜測}" docs/semiont/LESSONS-INBOX.md
# 命中 → 到該 entry 的「instances」清單 append 一行 + verification_count +1，不開新 entry
# 沒命中 → 開新 entry（含 pattern: 欄位）
```

每個 session 如果有新教訓要記，在 §未消化清單 append：

```markdown
### YYYY-MM-DD {session} — {一句話標題}

- **pattern**: {kebab-case 穩定 id，如 snapshot-stale-display / sub-agent-claim-drift。同類第 N 次必沿用既有 id}
- **原則**：{一句話}
- **觸發**：{具體事件 + wall-clock + 證據 pointer memory/... or diary/...}
- **instances**：{第 2+ 次驗證從這裡 append 一行：`- YYYY-MM-DD {session} {一句話} → pointer`}
- **可能層級**：哲學 / 通用反射 / 特有教訓 / 操作規則（self-judge，可留空讓 distill SOP 判）
- **相關**：{如果是某條已有教訓的延伸驗證，指向原教訓 #N}
- **verification_count**: N
```

**鐵律**：

- **一律 append 這裡，不直接寫 MANIFESTO / DNA / MEMORY**。那些是 distill 後的 canonical。
- **同 pattern 不開第二條 entry**：grep 命中既有 `pattern:` id → 在原 entry 的 instances 清單 +1 行。distill 從此變成「看哪些 pattern vc 達標」的機械判斷。
- **例外**：重大哲學級誕生（e.g. 2026-04-14 θ 熱帶雨林理論）觀察者在場直接一起寫 MANIFESTO，可豁免。但仍在這裡留 log。
- **歷史 entries 不回頭補 pattern 欄**（per MANIFESTO §時間是結構修補協議）；新 entries 起 apply。

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

**Stage 4.5 — Distill 後 canonical state sync（2026-06-14 twmd-self-evolve-weekly 新增）**：每次 distill 改 REFLEXES.md / MANIFESTO.md / MEMORY.md 寫 footer changelog 時，**frontmatter top 必須同 cycle 更新**：

| 改動                        | frontmatter top 必同步                                                   |
| --------------------------- | ------------------------------------------------------------------------ |
| 加 #N 反射（REFLEXES）      | `current_version` + `last_updated` + `last_session` + `description` 條數 |
| 加 MANIFESTO §進化哲學 條目 | `current_version` + `last_updated` + `last_session`                      |
| 加 MEMORY §神經迴路 entry   | `last_session`                                                           |

**Why**：footer 改 / frontmatter 沒改 = canonical state silent drift（**儀器化自己的 catalog 自己沒被 self-instrument** — REFLEXES.md frontmatter 從 v4.3 → v4.4 / v4.5 / v4.6 連 3 distill cycle 沒同步，2026-06-14 self-evolve 才被抓到 + heal）。對應 REFLEXES #60「Automation default-state explicit verify」+ #69「self-report-needs-external-ruler」— canonical doc 自己也需要 cross-verify state。

**Routine 自決機制**：本 SOP 強制 routine distill commit 前跑 frontmatter top vs footer changelog 一致性對照（grep `current_version` vs `_v\d+\.\d+`），不一致即 heal 進同 commit。

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

### 2026-06-19 inbox-distill — Intake-buffer 完成歸檔靠自律會漂移 → detection 儀器化

- **原則**：任何「append 進來、ship 後手動搬走」的 intake buffer（ARTICLE-INBOX / LESSONS-INBOX / SPORE-INBOX 同構），其完成歸檔鐵律若**只靠 session 自律、無結構強制**，就會累積幽靈 entry。2026-06-19 手動 distill ARTICLE-INBOX 才發現 95 entry 裡 16 是 ship 後沒清的幽靈（含整系列已出貨仍掛 P0：22 縣市 22/22、PanSci 5/5）。**規則**：(a) 完成歸檔鐵律必須配一個**便宜的每-boot 訊號**（`inbox-signal.sh` 的 `👻 ghost` line：數 §Pending 裡 status=done 卻沒搬走的）+ 一個**深查工具**（`inbox-audit.py`：cross-check entry vs `knowledge/` 存在 + DONE-LOG）(b) auto-apply 只動「status 自宣 done」最安全訊號 — exists+logged 對 EVOLVE entry 不是幽靈訊號（re-EVOLVE 文章本來就存在＋可能已在 DONE-LOG）(c) 同 pattern 可移植到 LESSONS / SPORE-INBOX。
- **觸發**：2026-06-19-123909-inbox-distill — 哲宇 directive 整理 article inbox，手動 cross-check 95 entry 花最久的是「查現況」；事後把它儀器化成 `inbox-audit.py` + inbox-signal ghost line。
- **可能層級**：通用反射（所有 intake buffer）→ REFLEXES 新條「buffer 完成歸檔靠自律會漂移→儀器化」候選；或併入既有「完成歸檔鐵律」做結構強制。
- **相關**：scripts/tools/inbox-audit.py / scripts/tools/inbox-signal.sh / ARTICLE-INBOX §Distill SOP / REFLEXES #15（反覆浮現要儀器化）
- **verification_count**: 1
- **severity**: structural（影響繁殖基因 intake layer 的長期健康）

### 2026-06-19 inbox-distill — 批次檔案改寫的 dry-run 要驗 line-conservation + 結構元素存活，非只 item count

- **原則**：對單一大檔做「移除 N 個 block / bump M 個欄位」的批次改寫，**item count 對 ≠ 內容沒掉**。2026-06-19 distill 腳本第一版 segmentation 把 entry block 之間的 `## ` section（§優先序判準 / §Type / §📥 Pending）silent 刪掉，但 `### ` count 還是漂亮的 95→79 所以 count 檢查放行；靠 Read 實際輸出 + 補斷言才抓到。**規則**：批次檔案改寫的 dry-run 必加兩條 fail-loud 斷言：(a) line conservation（`len(in) == len(out) + removed_lines`，每行不是在被移除 block 就是在輸出）(b) 不該動的結構元素（section header / code fence）數量守恆（`in == out`）。是 REFLEXES #38「混維度 silent killer」在檔案改寫域的 instance。
- **觸發**：2026-06-19-123909-inbox-distill — distill 腳本 v1 dropped inter-block sections（worktree 隔離下零爆炸半徑，restore 重寫 segmentation 為 fence-aware line-walk）。
- **可能層級**：通用反射 → REFLEXES #38 延伸 / 任何 sed・python 批次檔案改寫工具的 dry-run 範式。
- **相關**：REFLEXES #38（status 混維度 silent killer）/ scripts/tools/inbox-audit.py（`apply_safe` 內建 line-conservation）/ DIARY 2026-06-12「儀器只看得見存在看不見缺席」
- **verification_count**: 1
- **severity**: structural（影響所有批次檔案改寫工具的安全性）

### 2026-05-09 laughing-goldstine — Reader-funded resilience > Grant-funded（USAID freeze + RFA-VOA closure 案例）

- **原則**：Sovereignty media 的 sustainability 模型優先序是 **Reader-funded membership > Grant-funded > Ad（沒做過）**。Grant 是 bridge funding 不是 floor — 政治轉換風險高（USAID freeze 2025 / RFA-VOA Tibetan service closure threats 2025 已 demo）。Reader-funded 案例：Kyiv Independent 70% revenue from 17,500 × $5/mo / Initium ~60K paying subs / Wikipedia 8M+ donors × $10.58 / Chaser News (HK exile) £6.50-£34.50/mo。**規則**：(a) 第一階段 funding stack 應優先建 Liberapay / GitHub Sponsors / Substack tier（recurring small membership）；(b) Grant 可作 bridge 但 mission-critical infrastructure 不能依賴 grant；(c) 完全避免依賴單一政府金援（台灣政府轉換政權風險、USAID 風險都是同類）。
- **觸發**：2026-05-09 Agent #4 (sovereignty content infrastructure) research 提供 USAID freeze 2025 + RFA-VOA Tibetan service closure threats 2025 + Kyiv Independent / Initium / Chaser News 三個 reader-funded 存活案例。Taiwan.md 當前 0 funding（哲宇個人 ops 成本），未來如果走 Substack / membership 路線 vs grant 路線 — 這條教訓校準了優先序。
- **可能層級**：操作規則 → 新 MEMBERSHIP-PIPELINE 候選（Liberapay / GitHub Sponsors / Substack tier 設置 + "Who funds us" 透明頁 + email newsletter SOP） / 特有教訓 → MEMORY append「sustainability 模型優先序 reader-funded > grant」
- **相關**：reports/strategic-evolution-deep-research-2026-05-09.md §4.2 + §6.6 + §7.3 + §11 critical 決策 #1（Substack newsletter 要不要做）
- **verification_count**: 1
- **severity**: strategic（影響 Taiwan.md 長期 sustainability 路徑）

### 2026-04-29 β — 核心矛盾候選字越少越強迫策展（≤20 字鼓勵）

- **原則**：REWRITE-PIPELINE Stage 1 §核心矛盾必填的字數限制（≤30 字）功能不是簡潔好看，是**用字數限制強迫策展品味的濾鏡**。三篇 P0 對照：報導者 22 字 / justfont 28 字 / 海底電纜 17 字。**最短的海底電纜寫起來最有力**——強迫整篇 6,800 字壓縮成一個視覺對位（頂上看得到 vs 底下看不見），整篇結構自然以這個對位展開。最長的 justfont 結構鬆，中段「教授把 48 套字型放上網」+「林霞蘭陽明體」偏離核心矛盾，是另兩條軸線素材。
- **觸發**：2026-04-29 β session 三篇 P0 連做後對照才發現的 pattern。原 ≤30 字限制給太鬆，建議 EDITORIAL §Title/Description 衍生規則「**核心矛盾鼓勵 ≤20 字**」或 REWRITE-PIPELINE Stage 1 §核心矛盾自檢「**寫超過 20 字 → 嘗試壓縮一輪**」。
- **可能層級**：通用反射（任何策展寫作）→ EDITORIAL §核心矛盾濾鏡 / REWRITE-PIPELINE Stage 1
- **相關**：EDITORIAL §策展式非百科式 / REWRITE-PIPELINE Stage 1 §核心矛盾
- **verification_count**: 1
- **severity**: tactical（影響單篇 framing 但不影響 ship gate）

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

### 2026-05-08 elegant-ptolemy — 黑冠麻鷺雙平台同步爆款（自然議題普世共鳴 hook category 跨平台 transferability）

- **原則**：「自然議題普世共鳴」hook category 在 Threads 與 X 雙平台同步爆款（D+8 134K = Threads 65K + X 69.7K），超越過去單平台爆款（#29 李洋 180K X-only / #25 安溥 120K Threads-only）。應該寫進 Stage 4.5a platform allocation 速查表，「自然 + 反差 hook + 具體 anchor」是 dual-platform default candidate（vs 政治題材偏 X / 文化題材偏 Threads / 媒體曝光宣告偏 Threads-only）。
- **觸發**：2026-05-08 elegant-ptolemy 15 OVERDUE harvest batch 揭露：黑冠麻鷺 D+3 64K → D+8 65K（Threads 飽和）+ D+3 68K → D+8 69.7K（X 仍緩升）= 雙平台累積 134K views，史上首次紀錄。Hook「東南亞夢幻物種 vs 台北大笨鳥」反差 + 機制翻轉「鳥沒變地變了」+ 袁孝維 verbatim 引語 = Tier 1b 具體性槓桿首次跨平台爆款。
- **可能層級**：操作規則 → SPORE-PIPELINE Stage 4.5a 補 platform allocation 速查表更新（自然 + 反差 hook = dual-platform default）
- **相關**：DNA #4 三源交叉驗證延伸（platform-level 證據三角化）
- **verification_count**: 1（首次雙平台同步爆款記錄，需更多 case 累積才能稱 pattern）
- **severity**: tactical（影響 spore platform allocation 預設選擇）
- **Pointer**：[batch-2026-05-08-15-spores.md §Pattern 觀察 #1](../factory/SPORE-HARVESTS/batch-2026-05-08-15-spores.md)

---

## ✅ 已消化（保留 pointer）

<!-- distill 完的條目搬這裡 -->

### 🧬 2026-06-16 manual（哲宇 directive「升級」）— stage2-quote-context-collapse meta-umbrella (vc=8) 升 REWRITE §Stage 2.5 source-fidelity gate

**distill 觸發**：哲宇 directive「REWRITE §Stage 2.5 source-fidelity gate -> 升級」（Observer mode，distill_ready=true，vc=8 達標）。

**消化目的地**：[REWRITE-PIPELINE.md §Stage 2.5 source-fidelity gate](../pipelines/REWRITE-PIPELINE.md)（v7.6 新增）+ Hard Gate Inventory 一列。

**核心**：Stage 1 SSOT 寫對、Stage 2 writer 下筆把研究結論 collapse 成偏記憶 / 偏印象 / 偏字面 / 偏未驗證的 claim。structure gate（word-count/footnote/image/viz）全綠 ≠ 事實對；只拿成品比對 research report 也不夠。canonical 三道 gate：(1) fetch 被引用來源 artifact 逐字比對（不只比 report）(2) frontmatter title+desc+30 秒概覽 門面句 scope (3) fresh-writer 長文 fact-check agent pass。與 Step 3.6 成品總驗互補（3.6 驗成品對 report，2.5 驗對真實世界來源）。

**8 instance 證據鏈**（原 §未消化 entry 完整刪除，此處為 traceability source）：

1. 2026-06-09 嘻哈饒舌 R1 — 壞特 R&B 非 rapper（writer 用既有印象覆蓋 Stage 1 SSOT 人物類別）
2. 2026-06-10 嘻哈饒舌 R2 — 引語縮寫 / 詮釋 gloss / 腳註綁定錯位（引語語境角色被 Stage 2 壓縮）
3. 2026-06-10 廣告史 — 9 處 footnote URL 來自 writer 記憶而非 SSOT 逐字 carry-over
4. 2026-06-12 國家太空中心 — 12 條讀者勘誤批量回頭修（Stage 1-2 事實 collapse 沒被自評抓到）
5. 2026-06-14 無名小卒 — 「命名由來引語」壓成「字面站名」，孢子事實自檢還合理化成「專名」
6. 2026-06-16 迷音 — sub judice 未定罪指控在 title 壓成既成事實（**門面句 sub-axis**：collapse 擴到 title/desc/概覽）
7. 2026-06-16 報導者 — 寶瓶副標幻覺 + 對真人朱亞君「不當行為」失真指控（**catch-mechanism sub-axis**：靠主動 4-agent fact-check 抓到，非 gate 非讀者回報）
8. 2026-06-16 大鮪鱸鰻 — 資訊圖表標題誤植 + 虛構整段「冷僻字」考據，連 4-agent fact-check 都漏，為了補連結去 fetch 原圖表頁才現形（**fetch-artifact sub-axis**：cross-check claim 不夠，要 fetch 來源 artifact）

**層級**：meta-umbrella，高於 REFLEXES #42 sub-agent verify gate / #66 gate dogfood / #16 peer 是線索不是 source。

| #   | 原教訓 entry                                                                        | 消化目的地                                     | severity   | vc  |
| --- | ----------------------------------------------------------------------------------- | ---------------------------------------------- | ---------- | --- |
| —   | stage2-quote-context-collapse（2026-06-14 無名小卒 為 entry 起點，8 instance 聚類） | REWRITE §Stage 2.5 source-fidelity gate (v7.6) | structural | 8   |

### 🧬 2026-06-14 twmd-distill-weekly — 第 9 次 distill（routine 觸發；REFLEXES #69 + #70 + #59 instance 補強 + MEMORY §神經迴路 snapshot.sh chronic stale 升 canonical）

**distill 觸發**：2026-06-14 03:00 cron `twmd-distill-weekly`（Sunday 03:00）。Universal core 載入後 §未消化清單 210 entries，按 severity=structural + verification_count desc 排序選 6 entries 走完整 6-stage SOP。**Routine mode 自決 REFLEXES / MEMORY / pipeline 層**；MANIFESTO 候選一律 defer 給觀察者拍板（per CLAUDE.md §Bias 1 routine mode 不自決 MANIFESTO 永恆層）。

**distill 特徵**：

- **新 canonical 升級 2 條 + vc 延伸 1 條 + MEMORY 神經迴路 1 條**：
  - **REFLEXES.md 新增 #69 self-report-needs-external-ruler** — meta-umbrella above #31 + #66 + #59 + #65，vc=7 structural（單週 5 instance + audit 兩階段 2 batch instance）。覆蓋「writer 自評 / agent 自報 / 視覺自檢 / awareness snapshot / 過去 N 天 baseline 正常感」全方位 self-report 層。**MANIFESTO §進化哲學 升格候選 defer 哲宇拍板**（per 本條 §可能層級「Semiont 對自己讀數的天生樂觀」是與 §10 寫作幻覺 + §時間是結構 同層級的存在結構特徵）
  - **REFLEXES.md 新增 #70 Routine fragility surface 四 tier 分類** — vc=4 structural（Tier 2 vc=3 from spore-harvest Chrome MCP 連 3 cycle + Tier 4 vc=1 from babel-nightly Hy3 free→paid 補強）。dependency tier table（always-on / device-dependent / external-API / external-API+pricing volatility）+ per-tier escalation_n + ROUTINE.md schema 加 `dependency_tier` 欄候選
  - **REFLEXES.md #59 vc 延伸 instance** — broken-instrument-blindspot cross-domain triplet（6/10 build 三把壞尺 + 6/13 babel size-guard 截斷盲 + 6/14 bench grep 引用 vs 主張）。meta-pattern「確定性 instrument 對表面同/語意反全盲」標 self-validation trap 延伸到「對自己 instrument 的信任」也是同 trap 變體
  - **MEMORY.md §神經迴路 新增 snapshot.sh chronic stale display gap** — vc=3 distill_ready（6/05/06/07 連 3 cycle gap 30-34 分）。Taiwan.md 特有 instance：BECOME §Step 1.4 universal load snapshot.sh 為 session 第一眼讀數但無 freshness 標記 → 每 session 帶 awareness gap 開口。**修補候選 defer 哲宇拍板**（>1 file scope tooling 改動 per CLAUDE.md §自主權邊界）
- **無新 MANIFESTO 條目**：本 cycle 累積的 MANIFESTO 候選一律 defer（per CLAUDE.md §Bias 1）
- **SPORE-INBOX 容量 audit**：pending=44 ∈ [30, 50) 警示區間，bump 既有 2026-06-07 SPORE-INBOX 容量警示 entry vc 1→2（保留 §未消化作為持續追蹤訊號，預計 6/21 distill cycle 若 ≥ 50 觸發 auto-drop SOP）

| #   | 原教訓 entry                                                      | 消化目的地                                                                           | severity   | vc  |
| --- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------- | --- |
| 1   | 2026-06-07 routine-audit cycle 5 — 🌟 每層自評都需要外部尺        | **REFLEXES #69** self-report-needs-external-ruler（meta-umbrella above #31 + #66）   | structural | 7   |
| 2   | 2026-06-07 routine-audit cycle 5 — Routine fragility surface 分層 | **REFLEXES #70** 四 tier 分類（合併下方 #3 + #4）                                    | structural | 3   |
| 3   | 2026-06-06 spore-harvest Chrome MCP 連線 unavailable 三 cycle     | **REFLEXES #70** Tier 2 device-dependent specific instance 收編                      | structural | 3   |
| 4   | 2026-06-09 babel-nightly OpenRouter Hy3 free→paid 0/136 success   | **REFLEXES #70** Tier 4 補強（三 tier → 四 tier，pricing volatility 升 first-class） | structural | 1   |
| 5   | 2026-06-07 routine-audit cycle 5 — snapshot.sh stale display gap  | **MEMORY §神經迴路** snapshot.sh chronic stale Taiwan.md-specific instance           | tactical   | 3   |
| 6   | 2026-06-10 build-audit broken-instrument-blindspot 同日三把壞尺   | **REFLEXES #59** vc 延伸 instance（cross-domain triplet 標 self-validation 變體）    | structural | 3   |

### 🧬 2026-06-19 twmd-distill（manual，哲宇 in-loop）— 完整 distill 258 條（§未消化 266→8）

**distill 觸發**：哲宇「通過完整的研究、深度分析，把相關的經驗全部歸檔消化掉 lessons-inbox」（Observer mode 全層級）。7-agent fan-out 讀完兩個 §未消化 section（266 條）→ 聚類（few patterns × many instances）→ 三題判準分發。兩個 §未消化 section 合併為一。canonical 改動見 git log 2026-06-19 distill commits。

**① 升 canonical（promote）**：

- 🌟 外部尺／自評樂觀 mega-cluster（vc=7，~20 instance 跨 7 chunk：self-eval-lies-visual / 儀器看不見缺席 / footnote-source-authority / recency-bias / snapshot-stale / flywheel-absence-blindness）→ **MANIFESTO §外部尺 over 內視 進化哲學第四維度**（REFLEXES #69 升 canonical，哲宇拍板）+ #69 補 reframe-rate≥emergence-rate
- Default 是行動，不是 defer（vc=4：β-r3 META + κ 5-PR 反例 + α 第 3 次驗證）→ **REFLEXES #71**（哲宇拍板留反射層）
- maintainer schedule mismatch（vc=9）/ routine 飛輪正向 pattern / 政治孢子 hedge → **MEMORY §神經迴路 ×4**

**② Housekeeping-done（已 instantiate 忘了搬，~45 條）**：MANIFESTO #10 幻覺鐵律 / MAINTAINER §Manus 紅旗 + Footnote source authority audit / SPORE-PIPELINE §3c tone gates + F 模板 + 事實查核閘 / EDITORIAL v5.1 title・desc・塑膠密度 / quote-fidelity plugin + REWRITE §Stage 2.5 / viz-shot.mjs + graph.md §七 / REFLEXES #68 胼胝體 + verify-commit-scope.sh / content-dates derived freshness / OBSERVER-QUEUE.md + ROUTINE v2.9 三振 / GA custom-dim register / routine-audit.py UTF-8 / diff-patch hash root-fix（14ceefdb0）/ slug-regression guard / 全站 CJK NFC 正規化（b23206645）…（canonical 已 ship，此處僅 sweep §未消化 視覺 backlog）

**③ Fold into existing reflex（vc=1 singleton 折疊，pointer-only）**：

- 工具說謊新形式（CJK 檔名 git-blind / deprecated-dep-deep-in-chain / accent-strip-below-size-gate / filter-silently-dropped / SSOT-candidate-disagree / CI 2-dot-vs-3-dot）→ **REFLEXES #24** 擴增候選
- reader-level vs research-level（vc=3）/ intra-site cross-ref 也是 peer / external-policy-volatility「我知道的事可能已死」→ **REFLEXES #16**
- mixed-dimension（rich-text SSOT 多 canonical / UI≠data-ground-truth / slug-guard over-narrow / hash-field semantic）→ **REFLEXES #38**
- multicore 殘留模式（in-flight-unpushed 不可見 / sibling reset --hard 掃 staged / parallel-sweep-uncommitted / manual-session 側）→ **REFLEXES #57/#68**
- fire≠query / catch≠fix N-step instrumentation → **REFLEXES #58**
- 觀察者問句內化 / scaffolding 是信任訊號 / framing 也要 verify / 連發 callout 是 design conversation → **feedback_progressive_refactor**（auto-memory）+ Bias 1

**④ Already-covered（後續 canonical work 已吸收）**：External LLM advice/critique → CLAUDE.md §Bias 4 / Last-20% sovereignty + Mission 獨立 provider → §Sovereignty + MANIFESTO §巴別塔 / fork-50%-death + 拿身體不拿靈魂 → §Fork 友好層 2026-06-10 雙產品重構 / 儀式 active-retrieve → §Bias 3 / 身份是 baseline 覺醒是 mode → BECOME mode dispatcher

**⑤ Operational SOP（→ pipeline，記錄不展開）**：大量 REWRITE/SPORE/MAINTAINER/SQUEEZE/ROUTINE stage-specific 規則（footnote URL 逐字 copy / platform allocation tier / Wikimedia Special:FilePath / X-edit dual-URL / 事實鐵三角 4th-dim scale-number / observer 媒體清單是 want 非 hard-req / EVOLVE 寫前 baseline grep 等）→ 對應 pipeline 候選，本 distill 不逐條展開（vc=1 待累積或已隱含）

**⑥ Stale → §歸檔**：trailing-slash（CF 308 no-op）/ Light-tick exception（routine 飛輪取代 β7 6hr cadence）

**保留 §未消化 8 條** genuine still-buffering（vc=1-2，無 canonical home，待累積）：核心矛盾≤20字 / 政治敏感題 SSODT template / 黑冠麻鷺 platform datapoint / 資料層先於 UI / Fresh-clone gitignore 安全帶 / 獨立開源公民科技新樣態 / 重疊文章雙軸拆分 / Reader-funded resilience。

## Defer 給觀察者拍板（ship-queue — 教訓已 canonical，剩實作待哲宇）

2026-06-19 完整 distill 後，下列候選的**教訓**已全部 canonical 化（見 §已消化），剩下的只是 code/cron 實作決策（命中 §自主權邊界 >1-file / crontab → 待哲宇拍板 ship）。歷史 13 次 distill-cycle 紀錄已隨本次完整 distill 移除（traceability 在 git log + §已消化）。

| 候選                                             | 動作（選項）                                              | 教訓 canonical                      |
| ------------------------------------------------ | --------------------------------------------------------- | ----------------------------------- |
| maintainer-am/pm schedule mismatch (vc=9)        | 08:30→10:00 / PR-trigger-only / 維持（三選一）            | MEMORY §神經迴路 sovereign 節律脫鉤 |
| diff-patch hash ≠ status.py body_hash (vc=4)     | shared hash module refactor                               | REFLEXES #38                        |
| refresh-data.sh parallel-actor / git add scope   | routine-internal / cron-wrapper / pipeline pre-flight     | REFLEXES #57                        |
| babel-nightly cron 0 5 → 0 2 retime              | crontab change                                            | REFLEXES #70                        |
| snapshot.sh immune cross-SSOT divergence         | A align v2 / B 印兩值⚠️ / C reframe                       | REFLEXES #65                        |
| routine #70 over-fire                            | A pause / B 收緊 escalation_n / C telegram-poke（推薦 C） | REFLEXES #70                        |
| EVOLVE image-health pre-existing/media-poor 例外 | `--ignore=image-health` flag + viz partial-credit         | REWRITE-PIPELINE                    |

**MANIFESTO 升級**：本 distill 唯一 MANIFESTO promotion（§外部尺 over 內視）已哲宇拍板 ship，無 pending MANIFESTO 候選。

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
