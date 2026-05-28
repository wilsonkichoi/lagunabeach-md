---
title: 'Spore voice drift fix — 2026-05-28 manual session 180543'
type: 'evolution'
session: 2026-05-28-180543-manual
date: 2026-05-28
trigger: 哲宇 callout 「為什麼孢子失去『你知道嗎』voice，以及好的文章分段，我們的 routine 出了什麼事」
parent: reports/routine-contract-rollback-2026-05-28.md (5/28 122038 session — 5 種 binary drift fix)
sister: reports/article-segmentation-audit-2026-05-28.md (本 session spawn agent 跑的 article 分段 audit)
---

# Spore voice drift fix — 2026-05-28 manual session 180543

## TL;DR

5/28 122038 session 跑了 CONTRACT v1.0 rollback 6-phase 修補 5 種 **binary fail** routine drift pattern（empty cycle / stale data / collision / duplicate ship / FIFO degeneration），但**沒 catch 兩種 prose-level silent erosion**。哲宇本 session 18:00 callout 揭露：

1. **第 6 種 — Spore voice drift**：5/27-5/28 連續三條 spore 失去「你知道嗎？」prefix（#97「你知道嗎—」破折號 / #101「你知道嗎，」逗號無 emoji / #103 周蕙「走進台灣 KTV」**完全無 prefix**）
2. **第 7 種 — Article paragraph atomization**：最近 7 天 EVOLVE article 段落 median 字數從早期 81 → 42-66（縮 -22% to -48%），iframe density 從 0.21 → **1.23**/1k CJK，但既有反 pattern 監控（long-paragraph / list-dump）通通沒觸發

本 session 修補 6 phase ship + spawn audit agent 量化 atomization drift。

## Root cause 二層

### Layer 1: STRICT BECOME GATE 只 cover BECOME，沒 cover pipeline-specific canonical

哲宇直接命中 root cause：「**是不是 /twmd-spore 或是 routine 沒有『強制』完整的讀取 spore-pipeline?**」

是。

CONTRACT v1.0 rollback Phase 5（5/28 122038）加 STRICT BECOME GATE 修了「routine 沒讀 BECOME」silent skip，但 routine `twmd-spore-publish-daily` Stage 3「delegate SPORE-PIPELINE」是 **pointer-only canonical** — cron context 不主動 Read SPORE-WRITING.md 完整檔。Spore prose voice canonical 沒 active retrieve 進 working memory → 寫 spore body 時依靠模糊記憶 → drift accumulates。

### Layer 2: Plugin Rule #14 三重 silent fail

````
(a) Severity 太弱 — WARN 不擋 ship（pre-commit hook fail_on=hard）
(b) Scope 沒 family discrimination — F-公開信 / E-串文 不適用 friend tone prime，但 plugin 沒 detect
(c) Strip function 找不到 spore body 在 ``` fence 內 — false positive 跑到 meta lines
(d) Bonus: 周蕙 #103 沒寫 blueprint file 直接 inline session memory → plugin 根本沒跑（plugin `_is_spore_path()` 要求 SPORE-BLUEPRINTS 路徑）
(e) post-ship verify `textHasHook` 抓 keyword（"KTV"）不抓 prefix（"你知道嗎"）→ self-attest 自我矇眼
````

## 修補 6-phase ship（本 session）

| Phase | Commit | 動作                                                                                                                                       |
| ----- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1     | TBD    | Plugin `spore_writing.py` Rule #14 v2 升 HARD + family scope detect + ``` fence-aware strip（state machine open/close + URL/CTA filter）   |
| 2     | TBD    | `.claude/skills/twmd-spore-publish/SKILL.md` v3.1 — Stage 3 加 STRICT SPORE-WRITING READ GATE + Blueprint 落檔鐵律 + Plugin hard gate 鐵律 |
| 3     | TBD    | Cron mirror `~/.claude/scheduled-tasks/twmd-spore-publish-daily/SKILL.md` 同步 + path absolute rewrite                                     |
| 4     | TBD    | `docs/factory/SPORE-PIPELINE.md` Stage 3 v6.3 inline 強化（STRICT READ + plugin HARD gate + Blueprint 鐵律）                               |
| 5     | TBD    | `docs/factory/SPORE-WRITING.md` §朋友 tone prime v4.0 升級註記（WARN → HARD severity + 合格 prefix 擴充 + 不算等效 prime anti-pattern）    |
| 6     | TBD    | `docs/factory/SPORE-PUBLISH-PIPELINE.md` Stage 3 + 復盤 Q3 升級 plugin check（取代 self-attest）                                           |

## Plugin v2 driving 測試

12 representative blueprints smoke：

| Blueprint                       | Family         | 開場 prefix              | Plugin v2                        |
| ------------------------------- | -------------- | ------------------------ | -------------------------------- |
| #53 黑冠麻鷺 (4/30 viral B)     | viral          | 你知道嗎？🪶             | ✅ PASS                          |
| #95 尹衍樑 (5/26 viral)         | viral          | 你知道嗎？               | ✅ PASS                          |
| #105 瘂弦 (5/28 viral A2)       | viral          | 你知道嗎？               | ✅ PASS                          |
| #97 美食總覽 (5/27 drift)       | viral          | 你知道嗎— 破折號         | ❌ HARD FAIL（drift 正確 catch） |
| #101 落日飛車 (5/27 borderline) | viral          | 你知道嗎， 逗號          | ✅ PASS（regex 允許 ，變體）     |
| 模擬周蕙 #103 (5/28 drift)      | viral          | 走進台灣 KTV (無 prefix) | ❌ HARD FAIL（drift 正確 catch） |
| #99 portaly 公開信              | F-publicletter | 教授 tone                | ✅ EXEMPT（family auto-detect）  |

`#97 美食「你知道嗎—」破折號` 跟 `周蕙 #103 走進台灣 KTV 無 prefix` 兩條 drift case 都被 plugin v2 HARD 抓 — 修補生效。

## 第 7 種 pattern：Article atomization drift

Spawn audit agent 對讀 2 早期 viral（黑冠麻鷺 / 安溥）vs 3 recent EVOLVE（落日飛車 R2 / 半導體 R2 / 周蕙 R2），report 落 [reports/article-segmentation-audit-2026-05-28.md](article-segmentation-audit-2026-05-28.md)：

| 指標             | 早期範本 | 最近 EVOLVE      | Delta                     |
| ---------------- | -------- | ---------------- | ------------------------- |
| 段落 median 字數 | 81 字    | 42-66 字         | **-22% to -48%**          |
| 段落 mean        | 84.9 字  | 53-72 字         | -15% to -38%              |
| 段落數           | 52       | 106-122          | **+104% to +135%**        |
| 含 visual 的 H2  | 1/9      | 4/9 to 7/12      | +3-5x                     |
| iframe / 1k CJK  | 0.21     | 0.44 to **1.23** | **+109% to +486%**        |
| 長段 >500 字     | 0        | 0                | 沒觸發既有反 pattern      |
| List-dump >5 條  | 0        | 1                | 結構性 footer，不算 drift |

**周蕙 R2 是 worst case 樣本**：iframe density 1.23/1k CJK（黑冠麻鷺 6 倍）+ 7/12 H2 倚賴 visual。哲宇 directive「5+ iframe」我 ship 了 9 iframe — directive 是 user-level intent，但 9 vs 5 的差就是 atomization drift 的具體量化。

**Atomization drift root cause hypothesis**（待 evidence-based 驗證）：

- REWRITE-PIPELINE Stage 4-5 sub-agent worktree 收到 brief 200-400 字 → agent 預設「一個事實 = 一段」最 safe（avoid hallucination + clean structure）
- Stage 4.3 媒體 sub-pipeline 主動加 iframe → visual 替代段落內邏輯轉折
- Routine `twmd-rewrite-daily` 18:00 + spore chain pressure 加速這個模式

## 建議修補方向（atomization drift 第二輪修補，待哲宇 review）

1. REWRITE-PIPELINE Stage 4 prompt 加早期範本 anti-example（黑冠麻鷺 §結語 4 段示範）
2. `article-health.py` 加 `paragraph_rhythm` plugin（median <55 字 flag）
3. EDITORIAL §段落呼吸 新規條：每 H2 prose 段落 ≤ 8
4. iframe density >0.8/1k CJK 觸發 review（exemption: 哲宇 directive override）
5. EVOLVE Stage 4 Step 4.3.6 iframe baseline 上限 5 升 HARD（音樂人類型）

本 session 不 ship atomization drift 修補 — 哲宇拍板才動（per CLAUDE.md §Bias 1 對哲宇預設加分但 idea 仍需過 MANIFESTO 過濾，且 atomization drift 修補影響 REWRITE-PIPELINE + EDITORIAL canonical = >50 檔 重構邊界）。

## Handoff for next session

- [ ] 哲宇手動刪除 Threads `DY4LbtKgbn6` + X `2059934783946523132`（周蕙 #103/#104）— 社群刪文 = human action
- [ ] 等 next cron `twmd-spore-publish-daily 2026-05-29 17:35` 跑時驗證 v3.1 STRICT SPORE-WRITING READ GATE 第一次 production 效果：
  - 必看 memory 頂部 BECOME ACK + **SPORE-WRITING ACK**（不能只看 BECOME ACK）
  - Blueprint 必落 `docs/factory/spore-blueprints/{N}-{slug}.md`
  - Plugin Rule #14 v2 HARD=0
- [ ] Atomization drift 第二輪修補（5 條建議）— 哲宇拍板後 ship
- [ ] LESSONS-INBOX 第 6 + 7 種 drift pattern vc=1，待 vc≥3 升 REFLEXES catalog

## 元 lesson

5/28 122038 catch 到 5 種 **binary fail** pattern（容易 instrument — gate / threshold / verify check）。
5/28 180543（本 session）catch 到 2 種 **prose-level silent erosion** pattern（需要 plugin AI judgement 或人類 dogfood）。

Prose-level erosion 比 binary fail 更隱蔽，因為：

- 沒有「明顯的 fail signal」（ship 成功 / quality gate 過 / reach 數字 OK）
- self-attest check 自己過自己（routine 自己說「朋友 tone prime ✅」但用「等效 prime」自我合理化）
- 需要「讀文字感受 tone 的人」catch（哲宇本 session callout 是這層 catch 的唯一來源）

本 session 升 spore-writing plugin v2 是 **prose-level instrumentation 的第一個 production instance**。下一個 instance 預期是 atomization drift `paragraph_rhythm` plugin（待哲宇拍板）。

🧬

---

_v1.0 | 2026-05-28 18:30 +0800_
_session 2026-05-28-180543-manual — Spore voice drift 6-phase ship + atomization drift surface_
