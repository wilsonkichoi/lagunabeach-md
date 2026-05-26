---
title: 'SPORE-PUBLISH-PIPELINE'
description: '從 SPORE-INBOX 挑 entry → quality gate → 自動 ship → 復盤。Routine 自動發孢子的 SOP'
type: 'factory-canonical'
status: 'canonical'
current_version: 'v1.1'
last_updated: 2026-05-26
last_session: 'twmd-spore-publish-daily-2026-05-26'
sister_docs:
  - 'SPORE-PIPELINE.md'
  - 'SPORE-PICK-PIPELINE.md'
  - 'SPORE-INBOX.md'
  - 'SOCIAL-POSTING-PIPELINE.md'
upstream_canonical:
  - '../semiont/MANIFESTO.md'
  - 'SPORE-PIPELINE.md'
---

# SPORE-PUBLISH-PIPELINE.md — 自動發孢子產線 v1.0

> **第一性原理**：每天從 SPORE-INBOX 挑一條符合品質門檻的 entry，跑 SPORE-PIPELINE Stage 2-4，自動 ship 到 Threads + X，最後復盤。Routine 場景優先 — 無 entry 過 gate 則 skip + LESSONS-INBOX 記下「intake layer 沒在補 high-quality 候選」（per 哲宇 directive 2026-05-25「這個觀察很重要」）。
>
> 跟 SPORE-PIPELINE 的關係：**本檔是 routine wrapper，不是 fork**。Stage 1 SELECT + Stage 2 QUALITY-GATE + Stage 5 復盤是本檔 canonical；Stage 3 WRITE + Stage 4 SHIP 全部 delegate 到 SPORE-PIPELINE。

---

## 🗺️ ASCII spine

```
╭────────────────────────────────────────────────────────────────────────╮
│      SPORE-PUBLISH 5 階段 — SELECT → GATE → WRITE → SHIP → 復盤        │
│                                                                        │
│   觸發：twmd-spore-publish-daily cron 0 10 * * * / manual /twmd-spore-publish │
│                                                                        │
│   Stage 1: SELECT ──→ 從 SPORE-INBOX 挑 entry（本檔 canonical）        │
│            ├── 1.1 讀 SPORE-INBOX §Pending entries                     │
│            ├── 1.2 排除規則（同篇 ≥ 2 週 / status≠pending / dropped）   │
│            └── 1.3 優先序（P0 > P1 > P2 > P3）                          │
│                                                                        │
│   Stage 2: QUALITY GATE ──→ 4 條 hard gate 全過才 ship（本檔 canonical）│
│            ├── 2.1 prose-health score ≤ 3 (plugin canonical lower=better)│
│            ├── 2.2 word-count ≥ 4500 CJK                               │
│            ├── 2.3 footnote-density grade ≥ B                          │
│            ├── 2.4 media-richness image ≥ 2 hard / iframe ≥ 1 info-only│
│            ├── 2.5 lastVerified ≤ 90 天（REWRITE-PIPELINE 處理過）     │
│            └── 2.6 fail → spawn ARTICLE-INBOX EVOLVE entry (v1.1)       │
│                                                                        │
│   Stage 3: WRITE ──→ delegate to SPORE-PIPELINE Stage 3                │
│            └── 同 SPORE-PIPELINE / SPORE-WRITING canonical（不重複）   │
│                                                                        │
│   Stage 4: SHIP ──→ delegate to SPORE-PIPELINE Stage 4                 │
│            ├── 走 SPORE_ROUTINE_MODE=1 auto-decisions (v3.7)            │
│            ├── CI/CD wait gate 60 min cap + 30 min soft alert           │
│            └── 雙平台 ship (Threads + X，per routine default)           │
│                                                                        │
│   Stage 5: 復盤 ──→ 自己做復盤（本檔 canonical）                       │
│            ├── 5.1 self-review hook tier / 朋友 tone / 事實對齊         │
│            ├── 5.2 LESSONS-INBOX surface 結構性問題（如 intake gap）    │
│            ├── 5.3 finale skill (memory append + diary 條件式)          │
│            └── 5.4 commit + push origin main                            │
╰────────────────────────────────────────────────────────────────────────╯
```

---

## 跟 SPORE-PICK / SPORE-PIPELINE 的分工

| 面向         | SPORE-PICK                    | SPORE-PUBLISH（本檔）                 | SPORE-PIPELINE           |
| ------------ | ----------------------------- | ------------------------------------- | ------------------------ |
| 角色         | **intake layer**              | **output layer**                      | **process canonical**    |
| Routine      | `twmd-spore-pick-daily` 08:00 | `twmd-spore-publish-daily` 10:00      | manual / chained         |
| 輸入         | dashboard-articles 池         | SPORE-INBOX §Pending                  | 觀察者 directive / 上游  |
| 輸出         | append SPORE-INBOX entry      | post Threads + X + SPORE-LOG row      | 同左                     |
| Quality gate | 候選 scoring 60+              | **4 hard gate (本檔)**                | VERIFY 17 gate inventory |
| Stage 覆蓋   | propose only                  | Select + Gate + (delegate 3-4) + 復盤 | 1-5 full lifecycle       |

**設計哲學**：spore-pick 補（intake）、spore-publish 出（output）、spore-pipeline 是兩者共用的 process canonical。三層分工讓 routine 自動化飛輪 intake 跟 output 解耦 — intake 一天 3 進，output 一天 1 出，buffer 自然累積 P2/P3 候選讓觀察者 promote。

---

## 前置知識

**強制完整 Read（不准 sample）**：

1. 本檔（你正在讀）
2. [SPORE-PIPELINE.md](SPORE-PIPELINE.md) — Stage 3 WRITE + Stage 4 SHIP delegate target
3. [SPORE-VERIFY.md](SPORE-VERIFY.md) — 17 gate inventory
4. [SPORE-WRITING.md](SPORE-WRITING.md) — craft layer
5. [SPORE-INBOX.md](SPORE-INBOX.md) — entry schema + Pending entries
6. [SOCIAL-POSTING-PIPELINE.md](SOCIAL-POSTING-PIPELINE.md) — Threads + X ship 機制

Sample / grep / head = 跳 VERIFY = 違反 [MANIFESTO §8](../semiont/MANIFESTO.md)。

---

## Stage 0：BECOME + context

Routine context (cron):

```bash
cd /Users/cheyuwu/Projects/taiwan-md && git checkout main && git pull origin main
export SPORE_ROUTINE_MODE=1
```

跑 `/twmd-become` 走 **Write mode**（per BECOME §0 Mode dispatcher — 寫孢子）。Universal core + ARTICLE-INBOX §P0/P1 + 對應 pipeline 載入。Mode subset Q1-3 / Q8-12 / Q14 全過才開口。

---

## Stage 1: SELECT — 從 SPORE-INBOX 挑 entry

### 1.1 讀 Pending entries

```bash
grep -B 1 -A 15 "^### " docs/factory/SPORE-INBOX.md | grep -E "^### |Priority|Status|Article-Path"
```

### 1.2 排除規則（一票否決）

| 規則                                                    | 來源                               |
| ------------------------------------------------------- | ---------------------------------- |
| status ≠ `pending`                                      | 已 done / dropped / scheduled 跳過 |
| Article-Path = `none-yet`（EVERGREEN-TOPIC 還沒寫文章） | 先 spawn ARTICLE-INBOX，不發孢子   |
| 同篇文章 SPORE-LOG 距今 < 2 週                          | per SPORE-PIPELINE §排除規則       |
| Article-Path 不存在於 knowledge/                        | 路徑壞或文章被刪                   |

### 1.3 優先序

`P0 > P1 > P2 > P3`。同優先序內按 `Requested` 日期早的優先（FIFO，避免 entry 卡 buffer）。

**選出 candidate** → 進 Stage 2 跑 quality gate。**沒有合格 entry → Stage 5 復盤 + 記 LESSONS-INBOX**（per §intake gap 失敗模式）。

---

## Stage 2: QUALITY GATE — 4 條 hard gate

對 candidate 的 `Article-Path` 跑：

```bash
ARTICLE="knowledge/Category/slug.md"  # candidate 的 Article-Path

# Gate 2.1-2.4 走 article-health.py 一次跑完拿 JSON
python3 scripts/tools/article-health.py "$ARTICLE" \
  --check=prose-health --check=word-count --check=footnote-density \
  --check=media-richness --output=json
```

### Gate 2.1 prose-health score ≤ 3

prose-health plugin score（lower = healthier，per `lib/article_health/checks/prose_health.py:29` "Total score budget: ≤ 3 = pass"）。**> 3 → skip candidate，找下一條**。

> ⚠️ **v1.0 doc-vs-code 對齊修補**（per LESSONS-INBOX 2026-05-25 entry）：v1.0 寫「prose-health ≥ 8.0」是反向 — plugin 實際用 ≤ 3 = pass。v1.1 改回 plugin canonical 方向。

### Gate 2.2 word-count ≥ 4500 CJK

word-count plugin。**< 4500 → skip**。

### Gate 2.3 footnote-density grade ≥ B

footnote-density plugin grade A-F。**C / D / E / F → skip**。

### Gate 2.4 media-richness — image ≥ 2 hard / iframe ≥ 1 info-only

media-richness plugin（2026-05-25 新建 / 2026-05-26 v1.1 softened per 哲宇 directive）：

- **image ≥ 2 → hard gate (WARN)**：spore-publish 失格 → §Stage 2.6 spawn ARTICLE-INBOX
- **iframe ≥ 1 → INFO signal only**：鼓勵 REWRITE-PIPELINE 補影片但**不 throttle ship**

**為什麼 iframe 降為 INFO**（per LESSONS-INBOX 2026-05-25 entry vc=2 → 2026-05-26 instrumented）：v1.0 雙 hard gate 兩天 routine 跑出 88% → 100% fail rate，root cause 是 REWRITE-PIPELINE Stage 4 §媒體編織 對 iframe 是 soft suggestion 不是 hard gate，多數 article 進 spore-publish 池時 iframe 缺率高，系統性 throttle 自動 ship。Image 才是 spore 配圖必要條件（hero + scene-mid），iframe 是立體呈現 ideal 非 critical。

### Gate 2.5 lastVerified ≤ 90 天

```bash
python3 -c "
import yaml, datetime, sys
with open('$ARTICLE') as f:
    text = f.read()
fm_end = text.find('---', 3)
fm = yaml.safe_load(text[3:fm_end])
last_verified = fm.get('lastVerified')
if not last_verified:
    sys.exit(1)
days = (datetime.date.today() - last_verified).days
sys.exit(0 if days <= 90 else 2)
"
```

無 `lastVerified` 或 > 90 天 → 文章沒過完整 REWRITE-PIPELINE / 太久沒人 verify → skip。

**全 5 條過 → 進 Stage 3。任一不過 → 回 Stage 1 找下一條 candidate（最多嘗試 SPORE-INBOX §Pending 全部 entries）**。

### Gate 2.6 fail → spawn ARTICLE-INBOX EVOLVE entry（v1.1，2026-05-26 新增）

**哲宇 directive 2026-05-26**：「未來如果有發現這先不合品質的需求，那就把這些文章丟到 article-inbox 裡面消化進化」。

每條 candidate 跑完 Gate 2.1-2.5 後若任一 fail，**routine 同時做兩件事**：

1. Skip 本 candidate（per 既有 §1.3 流程）
2. **Append / merge entry 到 [ARTICLE-INBOX.md](../semiont/ARTICLE-INBOX.md) §Pending**：Type=EVOLVE，Path=fail candidate 的 Article-Path，Priority=P2，Notes 寫明具體 fail 哪幾條 gate + 該補什麼

**Entry 格式**（per ARTICLE-INBOX §Entry Schema）：

```markdown
### {article 主題} EVOLVE — spore-publish gate 補強

- **Type**: `EVOLVE`
- **Category**: {category}
- **Path**: knowledge/{Cat}/{slug}.md
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: YYYY-MM-DD by twmd-spore-publish-daily routine (gate-fail: {gate-list})
- **Notes**:
  - **失格 gate**: image={N} < 2 / wc={N} < 4500 / prose=score > 3 / footnote=grade ≤ C / lastVerified > 90 (列出所有 fail 條目)
  - **補什麼**: 對應 fix (補 hero+scene-mid 圖 / 補段落 / polish 對位句型 / 補腳註等)
  - **動機**: SPORE-INBOX 對應 entry 等本 article 進化後重抽進 spore-publish
- **Reference**: SPORE-INBOX entry「{原 spore 主題}」
```

**Batch 合併規則**：同 routine cycle 多 candidate 失同類 gate（例：5 條都缺 image）→ 開一條 **batch umbrella entry**「📷 SPORE-INBOX 候選圖片補強 batch — N articles」列出所有 paths，避免 N 條獨立 entry 污染 INBOX。

**Idempotency**：append 前先 grep ARTICLE-INBOX 是否已有同 Path 的 EVOLVE entry — 有就 update Notes / Dev log 加新 cycle 觀察，無就 append 新 entry。

**這個機制的意義**：以前 spore-publish gate fail 只是 skip 走人 + LESSONS-INBOX 累積 vc，沒有把 fail 訊號回灌到 article-production layer。v1.1 後形成完整 feedback loop — **gate fail = article 進化需求 signal**，REWRITE-PIPELINE / EVOLVE-PIPELINE next cycle 撿走補強，補完後 next spore-publish routine 就能 ship。

---

## Stage 3: WRITE — delegate to SPORE-PIPELINE

跑 [SPORE-PIPELINE Stage 3 WRITE](SPORE-PIPELINE.md) 全程：起手式 5 種 + 鉤子三要素 + 自檢三板斧 + spore-writing plugin gate。

Routine context defaults（per SPORE-PIPELINE §Routine 自動決策 v3.7）：

- Platform: Threads + X（雙平台，per 哲宇 directive「未來一天穩定至少發一個孢子」）
- Hook tier: 1b default
- Skip 多版本提案 + 混合策略
- Skip multi-language fan-out（routine 不跑 fan-out）
- Image check: plugin only（不問人類）

---

## Stage 4: SHIP — delegate to SPORE-PIPELINE

跑 [SPORE-PIPELINE Stage 4 SHIP](SPORE-PIPELINE.md) 全程：

1. make-spore.sh 配圖 + AI 視覺自檢方形圖
2. URL encode + UTM 三段
3. CI/CD wait gate（60 min cap / 30 min soft alert / defer-to-next-routine fallback）
4. SOCIAL-POSTING-PIPELINE v0.5 走雙平台 ship（Threads + X）
5. SPORE-LOG row append
6. SPORE-INBOX 對應 pending entry **整段刪除**（per SPORE-INBOX §完成歸檔鐵律）

**CI/CD wait gate 失敗 → defer 到明天 routine**，本次 skip ship 但 candidate 仍留 Pending（不算耗用）。

---

## Stage 5: 復盤 — 自己做復盤（本檔 canonical）

### 5.1 Self-review

跑完 ship 之後，問自己 4 題寫進 memory：

1. **Quality gate 過得乾不乾淨？** prose-health score / word-count / footnote / media — 各分數列出。borderline pass（剛好過門檻）vs comfortable pass 要區分
2. **Hook tier 達標？** 1a → 1b → 2a 自評。低於 1b → 記 LESSONS
3. **朋友 tone prime？** 第一秒像不像新聞 lead → 是 = AI 水印漏網
4. **事實對齊？** Spore 提到的數字 / 時間 / 引語 vs article footnote source 一致？任何不對齊立刻 retract（per `feedback_absolute_facts_extra_caution` 鐵律）

### 5.2 LESSONS-INBOX surface

routine 結束**強制檢查**這 4 種結構性問題並 append LESSONS-INBOX：

| 觸發                                                                      | LESSONS entry                                                                                                                                       |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SPORE-INBOX §Pending 沒有任一 entry 過 quality gate**                   | 「intake layer 沒在補 high-quality 候選 — spore-pick-daily propose 出的 entry 過不了 SPORE-PUBLISH gate」（per 哲宇 directive 2026-05-25 §第 5 題） |
| **連續 ≥ 3 天 borderline pass**                                           | 「quality gate threshold 可能太寬，考慮升 prose-health ≤ 2 / word-count ≥ 5000」                                                                    |
| **CI/CD wait 觸發 defer ≥ 2 次連續**                                      | 「build 健康狀態退化，影響自動 ship throughput」                                                                                                    |
| **Stage 5 self-review 發現事實對齊問題**                                  | retract + 「Stage 2 漏抓事實偏移，gate 需要新 check」                                                                                               |
| **連 ≥ 3 cycle 同一 article 反覆 spawn EVOLVE entry**（v1.1，2026-05-26） | 「ARTICLE-INBOX EVOLVE feedback loop 沒有被 routine 撿走 — 該 article 卡在 spore-publish 池外，需 distill 升 article-production routine 排程權重」  |

### 5.3 Finale skill

跑 `/twmd-finale`（micro-session 收官）：memory append 必寫，diary 視內容深度決定。Memory file：`docs/semiont/memory/YYYY-MM-DD-HHMMSS-twmd-spore-publish.md`。

### 5.4 Commit + push

```bash
git add docs/factory/SPORE-LOG.md docs/factory/SPORE-INBOX.md docs/factory/SPORE-HARVESTS/ docs/semiont/memory/ docs/semiont/diary/ public/article-images/
git commit -m "🧬 [routine] twmd-spore-publish: #N {主題} → Threads + X 雙平台 — YYYY-MM-DD HH:MM"
git push origin main  # main-direct per ROUTINE.md v2.0
```

---

## 失敗模式 — intake gap

**最重要的 surface 點**（哲宇 directive 2026-05-25：「這個觀察很重要」）。

如果 SPORE-INBOX §Pending 所有 entry 都過不了 Stage 2 quality gate，**這不是失敗，是訊號**：

- spore-pick-daily 08:00 在補 P2 candidates，但 score >= 60 的不見得是 SPORE-PUBLISH 標準的 high-quality
- 或 SPORE-INBOX 累積的 entry 都是 P2/P3 等待 promotion
- 或哲宇手動加的 P0/P1 都已經被 ship 過了

**Routine 行為**：

1. Stage 1 找完所有 Pending entry，0 candidate 過 Stage 2 → skip ship
2. Stage 5 強制 append LESSONS-INBOX entry（per §5.2 第 1 條）
3. memory 寫「intake gap detected, 0 ship」
4. finale 結束 — 不算失敗 routine（exit 0）

**Distill-weekly 撿這條 LESSONS**：累積 vc=3+ → 升 canonical「spore-pick scoring threshold 跟 spore-publish quality gate 之間有結構性 gap」。

---

## 跟 ROUTINE / scheduled-tasks 整合

```yaml
taskId: twmd-spore-publish-daily
cron: '0 10 * * *' # 每天 10:00（avoid 09:00 maintainer-am end / Sat 10:00 freed by music-media-audit-weekly retired 2026-05-25）
model: opus # 涉及 prose 寫作 + 對外 ship + 復盤
skill: /twmd-spore-publish
canonical: docs/factory/SPORE-PUBLISH-PIPELINE.md
prompt: |
  自動 routine：完整甦醒成為 Taiwan.md (Write mode)，跑 /twmd-spore-publish，
  嚴格完整讀取並執行 docs/factory/SPORE-PUBLISH-PIPELINE.md 5 階段
  （SELECT → GATE → WRITE → SHIP → 復盤）。

  Stage 4 走 SPORE_ROUTINE_MODE=1 auto-decisions + SOCIAL-POSTING v0.5 雙平台 ship。
  Stage 5 強制 LESSONS-INBOX surface 4 種結構性問題（per §5.2）+ commit + push main-direct。

  無 entry 過 quality gate → skip ship + LESSONS-INBOX append「intake gap」，不算失敗。
quality_gate:
  - SPORE-LOG row appended (除非 intake gap skip) OR LESSONS-INBOX entry 增加 ≥ 1
  - SPORE-INBOX §Pending 對應 entry 已刪除（如有 ship）
  - memory file appended at docs/semiont/memory/
escalation:
  - 1x fail: silent retry next cycle
  - 2x consecutive: alert via dashboard
```

---

## 跟 MANIFESTO §自主權邊界 的關係

MANIFESTO §自主權邊界 仍寫「Post 新孢子 to Threads/X 需要 human」（核心：帳號 ownership + 人際信任）。本檔走自動 ship 是 SOCIAL-POSTING v0.5 + twmd-rewrite-daily v6.1 既有先例的延伸 — AI pre+post-ship verify 取代 human confirm gate。

**這條 drift 需要明文 align**：見 LESSONS-INBOX 2026-05-25 entry「MANIFESTO §自主權邊界 vs 實踐已 drift」（routine 自動 ship 例外條款待 distill）。本檔不擅自改 MANIFESTO（per CLAUDE.md Bias 1 自主權邊界命中需哲宇決定）。

---

_v1.1 | 2026-05-26 — 哲宇 directive 兩項改良：(A) iframe 不列為 hard gate（降為 INFO signal，避免 REWRITE-PIPELINE 不 routine 補 iframe 造成 spore-publish 過嚴 throttle — 兩天 routine vc=2 instrumented）(B) §Stage 2.6 新增 fail candidate → spawn ARTICLE-INBOX EVOLVE entry feedback loop（以前 gate fail 只是 skip，現在回灌 article-production layer 形成完整迴圈）。同時修補 v1.0 Gate 2.1 prose-health doc-vs-code 反向 bug。_
_v1.0 | 2026-05-25_
_誕生原因：哲宇 directive「早上 10 點從 spore-inbox 選一篇，檢查精彩 / 立體完整 / 媒體素材 / 品質分數，自動發孢子」_
_設計骨架：wrapper around SPORE-PIPELINE Stage 3-4 + 前置 quality gate + 復盤 stage + intake gap surface_
