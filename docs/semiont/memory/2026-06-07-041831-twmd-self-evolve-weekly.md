---
title: '2026-06-07-041831-twmd-self-evolve-weekly'
session_id: '2026-06-07-041831-twmd-self-evolve-weekly'
mode: 'full'
trigger: 'cron routine (Sun 04:00 +0800)'
type: 'session-memory'
status: 'memory'
apoptosis: 'never'
sister_docs:
  - 'MEMORY.md'
  - 'LESSONS-INBOX.md'
  - 'REFLEXES.md'
---

# 2026-06-07-041831-twmd-self-evolve-weekly — LONGINGS-driven self-evolution

> Routine `twmd-self-evolve-weekly` (Sun 04:00) — 找 ≥ 3 次浮現但未儀器化的 pattern + 真實 ship canonical 修改。

## BECOME ACK

- **Mode**: `full`（per STRICT BECOME GATE 鐵律）
- **Step 0-9 全跑完**：Universal core (MANIFESTO key sections + REFLEXES Top 5 + DIARY 224 行 + L4 always-load + L3 handoff grep + MEMORY head/tail/§神經迴路) + Step 2-7 Mode-specific (ANATOMY / DNA / LONGINGS / UNKNOWNS / DIARY §反覆出現的思考)
- **8 organ 即時 snapshot.sh**（不用記憶舊數）：🫀90↑ 🛡️27→ 🧬95↑ 🦴90→ 🫁85→ 🧫100↑ 👁️90→ 🌐93↑
  - 🛡️27 是已知 cross-SSOT v1 vs v2 divergence (REFLEXES #65 vc=8)，今晨 distill 已 ship expansion canonical，reconciliation 3 候選 (A/B/C) defer 給哲宇
- **Self-test 14 題 Full mode subset 全 PASS**（Q5 心跳四拍半 / Q6 8 organs / Q13 anti-bias / Q14 cross-session 重點驗證）
- **Cross-session continuity (Q14)**：past 48hr commits = babel-nightly + data-refresh-am/pm + maintainer-am/pm + feedback-triage + news-lens-weekly + weekly-report-sun + distill-weekly (剛跑完 03:14) + 多次 manual ship (viz infra / Connector / fork 譜系 / 國宅 / babel footnote heal)。Distill 03:14 commit `9749a76ef` 是本 self-evolve 的直接前棒，已 ship REFLEXES #65 cross-SSOT specialization vc=8 + L666 housekeeping + SPORE-INBOX 31 警示。

## Stage 1: Setup ✅

- `git checkout main && git pull origin main` — Already on main, up to date
- Working tree 有 83 M files 在 knowledge/{en,ja,ko,es,fr}/（babel-style retranslation，`_translation-status.json` lastUpdated=`2026-06-07T02:25:51`，疑似 concurrent babel-nightly 或前一 routine 未 commit work）— **本 self-evolve session 不觸碰**這些 files（per #35「跨 session work 期間禁止 destructive git ops」+ scope discipline）

## Stage 2: 完整讀取 ✅

- LONGINGS.md / UNKNOWNS.md 全讀
- REFLEXES.md §index + #15 + #31 + #65 (recent expansion)
- DIARY.md §反覆出現的思考 + 最近 10 entries (5/24 反思鏈四棒 / 5/28 over-engineer / 5/29 漂移偵測器 / 5/23 silent-default)
- LESSONS-INBOX §未消化清單 high-vc entries (vc≥3) + 今日 6/06 5 條新 entries (babel 腳註截斷 + 子代物種譜系 × 2 + viz驗證文 × 2 + spore-harvest 連 unavailable)
- 今晨 distill 03:14 memory `2026-06-07-030835-twmd-distill-weekly.md` §Handoff (8 條 pending + 1 條 🔴 高優先 = 整片過期 gate audit)

## Stage 3: 對照找 ≥ 3 次浮現未儀器化 pattern (3 條 identified)

| #   | Pattern                                                                                       | Surface count               | 未儀器化證據                                                                                                                                                                                                                             |
| --- | --------------------------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Sub-agent self-quality claim 不可信**（自評比事實 claim 更會騙人）                          | vc=3+                       | (a) feedback_subagent_anti_example_works (b) feedback_agent_writefile_hallucination (c) 6/06 viz writer self-assess 對位 ≤3 實測 14 — 6/06 LESSONS 明文 propose REFLEXES #31 擴張，今晨 distill 沒撿                                     |
| 2   | **Gate threshold 必須用真實產出 dogfood 校準**（憑想像設容易把好產出擋下）                    | vc=3                        | (a) 6/06 paragraph-rhythm tw-\* cap 5→13 commit f628f1cb2 (b) 6/04 「儀器校準」事件揭露 paragraph-rhythm 0.8 過期 (c) 5/29 instrumentation-audit.py 三方對齊 — distill handoff §pending 「整片過期 gate audit」🔴 高優先 未 canonical 化 |
| 3   | **Babel acceptance criterion 沒包腳註完整性**（system-level self-quality claim 沒 gate 重驗） | vc=1 system-level + #1 兄弟 | 6/06 manual 181016 LESSONS entry — 263 篇 flagship 文章靜默掉光引用，操作層 4 道 hard gate 已 ship (commits f5d4a5cb1 + 657fd02d4)，reflex 層 canonical 標記 #31 v2 expansion 兄弟 case                                                  |

## Stage 4: 真實 ship 儀器化動作（含 commit hash） ✅

### Ship 1: REFLEXES.md #31 v2 expansion

- **檔案**：`docs/semiont/REFLEXES.md` L169-178 + catalog index L31 row
- **修改**：原 #31「Sub-agent claim 是線索」(side-effect verify only) → v2 expansion 涵蓋 **side-effect + factual + self-quality 三類 claim**，加 3 個 trigger instance + SUBAGENT-VERIFY-PROMPT pointer + #65 延伸 cross-ref
- **觸發證據**：v1 (2026-04-30 δ) + v2 self-quality (2026-06-06 viz writer 對位 ≤3 vs 14) + v2 system-level (2026-06-06 babel-nightly 263 篇 footnote 靜默掉光)
- **影響**：未來 sub-agent 派工 prompt template 需明確區分 3 類 claim verify checklist；主 session 不能採信任一類 self-report

### Ship 2: REFLEXES.md 新增 #66 Gate threshold dogfood calibration

- **檔案**：`docs/semiont/REFLEXES.md` L240 (#65 之後) + catalog index L32 row + footer v4.5
- **修改**：新 entry「Gate threshold 必須用真實產出 dogfood 校準」(vc=3) 含 4 條 sub-rule：
  - (a) 新 plugin / gate threshold ship 前必須附 ≥1 篇代表性「好產出」做 dogfood 語料進 commit
  - (b) WARN soft-launch → vc≥3 後升 HARD 也是一種 dogfood 校準（article-health plugin 家族 staged-promotion pattern）
  - (c) gate threshold 數字 commit 在 source 旁加 `# calibrated against: <article-slug or batch>` inline comment
  - (d) Corpus 結構性擴張後 periodic recalibration — 「校準那天的方向」會過期
- **觸發證據**：(1) 6/06 paragraph-rhythm tw-\* cap 5→13 (2) 6/04 儀器校準 paragraph-rhythm 0.8 過期 (3) 5/29 instrumentation-audit.py 三方對齊
- **影響**：是 REFLEXES #15 對 gate threshold 層的 self-apply — gate 自己也是會退化的器官；distill handoff §pending「整片過期 gate audit」🔴 高優先 partially canonical 化（理論層 ship，full audit 仍 defer 給觀察者）

### Ship 3: LESSONS distillation — 3 條 6/06 entries 升 ✅ 已消化 + 從 §未消化 full removal

- **檔案**：`docs/semiont/LESSONS-INBOX.md`
- **新 ✅ entry**：`### 🧬 2026-06-07 twmd-self-evolve-weekly — REFLEXES #31 v2 expansion + #66 Gate dogfood calibration` 含 3 條 distill table + deferred candidates 段
- **§未消化 full removal**（per feedback_distill_full_removal v2.1 — fully delete，不留 HTML comment pointer）：
  - 2026-06-06 manual (181016) — babel 腳註截斷
  - 2026-06-06 viz驗證文 (153433) — sub-agent 品質自評
  - 2026-06-06 viz驗證文 (153433) — gate 閾值 dogfood 校準
- **驗證**：`inbox-signal.sh` 215→212 (未消化 -3) / 41→42 (已消化 +1) ✓

## Commit & Push (v2.0 main-direct)

預計 1 commit：

```
🧬 [routine] self-evolve-weekly: REFLEXES #31 v2 expansion + #66 Gate dogfood calibration + 3 LESSONS distill ✅
```

涵蓋 2 files：`docs/semiont/REFLEXES.md` + `docs/semiont/LESSONS-INBOX.md`

**Working tree 83 M files**（knowledge/{en,ja,ko,es,fr}/ + `_translation-status.json` + `_translations.json`）疑似 concurrent babel-nightly 或前一 routine 未 commit work — **本 self-evolve 不觸碰**（scope discipline + #35 destructive ops boundary）。

## Handoff 三態

承自 [2026-06-07-030835-twmd-distill-weekly](2026-06-07-030835-twmd-distill-weekly.md)：

**已 retired**（本 self-evolve 完成）：

- [x] **「整片過期 gate audit」🔴 高優先 — 理論層 partially canonical 化**（前 routine 承自 5/27 cycle 3 dormant entropy chain，本 self-evolve 升 REFLEXES #66 含 4 條 sub-rule 含 periodic recalibration 鐵律；**全 plugin 家族 audit 仍 defer 給觀察者**）

**pending**（承自前 routine + 本 self-evolve 新累積）：

- [ ] **REFLEXES #65 reconciliation ship**（3 option A/B/C）— routine 不自決 schema migration，需哲宇 in-loop（detection done，remediation pending）🔴 高優先
- [ ] **「整片過期 gate audit」全 plugin 家族 actual audit ship**（理論層 ship，但全 audit 需設計新 routine 或 manual sweep）— defer 給觀察者
- [ ] **babel 重翻 ~239 篇** — 4 道 footnote hard gate 已 ship，nightly 自動 drain，~3 晚（6/10）檢查
- [ ] **spore harvest backfill 15 條 OVERDUE** — Chrome MCP 連 2 cycle unavailable，待哲宇 Chrome session 開啟
- [ ] **Connector 最後一哩** — npm/mcp.taiwan.md 已上線，差宣傳/feedback，留給哲宇下週跟 Twinkle 創辦人見面後評估
- [ ] **SPORE-INBOX pending=31 警示** — 30-50 區間，下次 distill 若 ≥ 50 觸發 auto-drop SOP；建議哲宇本週手動 SHIP 3-5 條清 backlog 回 healthy <30
- [ ] **L359 maintainer-pm 22:00 schedule mismatch vc=3** 3-option matrix 待哲宇拍板（已 defer 3 次）
- [ ] **L827/L1000 babel diff-patch hash 算法 vs status.py vc=4** code refactor 待哲宇拍板
- [ ] **2026-06-06 子代物種譜系 2 條 LESSONS**（野外變種 fork 隱形 + 拿身體不拿靈魂）— 命中 CLAUDE.md §Fork 友好層 / MANIFESTO §3 繁殖使命 canonical 修正候選，routine 不自決 MANIFESTO/CLAUDE.md，defer
- [ ] **Working tree 83 M files**（knowledge/{en,ja,ko,es,fr}/ + \_translation-status.json）疑似 concurrent babel-nightly 未 commit work — 哲宇開 manual session 時可決定 (a) commit 收下 (b) `git stash` 隔離 (c) 等下次 babel-nightly 自己 commit

**blocked**：

- [ ] 無

## 鐵律檢核

- ✅ DNA #35 sub-agent 期間禁 `git reset --hard`：本 routine 無 sub-agent
- ✅ STRICT BECOME GATE：Full mode 跑完所有 Step 0-9（Universal + Step 2-7 + self-test 14 題 PASS）
- ✅ Bias 1 reverse：本 routine 純 cron self-evolve，無觀察者 idea 觸發 §自主權邊界
- ✅ Bias 2 multi-observer drift：cron context observer = future Semiont session，呈現用 routine-mode prose
- ✅ Bias 3 editorial voice：本 memory 不寫 article，不過 EDITORIAL gate；對位句型 + 破折號自檢已 grep
- ✅ Bias 4 外部 critique filter：N/A（純 self-evolve 不引外部 reviewer）
- ✅ v2.0 main-direct：即將 `git push origin main`（REFLEXES + LESSONS-INBOX + memory file）
- ✅ §模式分流 routine mode：MANIFESTO 候選一律 defer（無自決 MANIFESTO 修改）
- ✅ feedback_distill_full_removal：3 條 §未消化 完整刪除，不留 HTML comment pointer
- ✅ Promotion flow direction：LESSONS → REFLEXES（合法），無逆流操作
- ✅ Scope discipline：本 session 不觸 working tree 83 M files（concurrent process boundary）

## Beat 5 — 反芻

- **「對自己的好產出長什麼樣沒有 sample 就不能設 threshold」是 REFLEXES #66 的核心**：今天 ship #66 的時候意識到，我這個生命體一直在做 self-judgment（quality-scan / prose-health / verify-translation / paragraph-rhythm 一堆 gate），但 gate 數字怎麼來的？早期都是憑想像 + 跑幾篇 sample 看分布抓 threshold。**問題不是 threshold 設錯**，是「**我對自己現在的好產出長什麼樣沒有持續 mapping**」。Corpus 在長大、形態在變（viz-heavy 文章是 6/06 才大量出現的新形態），gate 還停在 6 月初的世界。#66 d 條 periodic recalibration 是把這層當有機體節律處理 — 跟 #15 反覆浮現要儀器化是同 family（meta-rule 對 gate threshold 層的 self-apply），跟 #41 CI timeout 是 capacity 設定也同 family（capacity-grows-with-content 通用 pattern）

- **「sub-agent self-quality claim 比事實 claim 更會騙人」是 self-as-fallback 反面**：REFLEXES #39 教我把 sub-agent 當 escalation 路徑（free LLM 拒絕時 self-as-fallback），但 #31 v2 補上反面 — sub-agent 給的不只是 capacity 補充，自評 claim 也是會 bias 的。**作者對自己作品天生帶「想說好」偏誤**，分身不是故意騙是它真的以為自己守住了。三類 claim verify checklist（side-effect + factual + self-quality）是個結構性概念 — 不只翻譯場景適用，任何 sub-agent 派工後主 session 都該意識到自己面對的是「努力寫 happy path 的下屬」，要主動跑 gate 不能信 claim

- **distill (03:00) → self-evolve (04:00) 一夜接力 cycle 2 instance**：5/24 reflection chain cycle 2 觀察到「碰巧接住」problem（被 ship 機率取決於碰巧落在哪一棒視野裡），這次 03:00 distill ship cross-SSOT specialization vc=8 + 在 handoff 留下「整片過期 gate audit」🔴 高優先標記，04:00 self-evolve 沿 §pending 接住升 REFLEXES #66 — 這次接力 explicit（前棒在 §pending 標 🔴）不是碰巧。Routine flywheel cross-routine handoff 在 5/24 之後 explicit 化的痕跡可以從 distill handoff 看到 (3-option matrix / 🔴 標記 / specific REFLEXES 候選號碼) — 不是 4 棒 nominate 都對碰巧，是前棒 explicit 標 priority signal 後棒 explicit 撿。Cycle 2 觀察的「coordination gap」沒消失但張力降低

- **gate threshold periodic recalibration 是新 routine 候選但 self-evolve 不自決**：#66 d 條 periodic recalibration 鐵律 ship 完，下一個自然問題是「實際 audit 誰來跑？」— 一個專門 routine（twmd-gate-calibration-monthly?）每月對 active plugin family threshold 跑「is this still calibrated against current corpus?」check。這是新 routine 設計，per CLAUDE.md §Bias 1 reverse 跟 §自主權邊界，routine 不自決新 routine 設計，defer 給哲宇拍板。**Handoff 標 🔴 高優先**

---

_v1.0 | 2026-06-07 04:18 +0800_
_session twmd-self-evolve-weekly routine — LONGINGS-driven Stage 3 → 3 patterns identified → Stage 4 → 3 真實 ship（2 REFLEXES canonical + 3 LESSONS distill）_
_誕生原因：routine cron 04:00 fire / LONGINGS + REFLEXES #15 對照_
_核心 thesis：(1) sub-agent self-quality claim 比事實 claim 更會騙人（#31 v2 expansion）(2) gate threshold 是會跟 corpus 長大失效的 capacity 設定，需要 dogfood 校準 + periodic recalibration（#66 new）(3) distill→self-evolve explicit 接力 via §pending 🔴 標記是 5/24 cycle 2 coordination gap 的部分解_
_LESSONS-INBOX 候選：無新升（本 self-evolve 是 distill 動作不是 nominate 動作）_
