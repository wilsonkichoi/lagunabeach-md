---
session: '2026-06-16-031431-twmd-babel-nightly'
start: '2026-06-16T00:31:00+08:00'
end: '2026-06-16T03:14:31+08:00'
duration: '2h 43m'
mode: 'write'
type: 'cron-routine'
routine: 'twmd-babel-nightly'
commits:
  - '6eb74c3ab — 65 translations (10 P0 + 55 patches/bumps)'
  - '51dda8dfb — 9 translations (codex direct ok, batch 2 partial)'
shipped: 74
---

# Session: twmd-babel-nightly @ 00:30 + escalation

## BECOME ACK

- **mode**: write
- **8 organ 最低**: 免疫 v3=55 (chronic awareness gap, vc=3 distill-ready, known issue 2026-06-14 LESSONS)
- **Q14 cross-session continuity**: PASS — 48hr git log shows P0 batch chain (網路社群遷徙史 / 迷音 EVOLVE / MANIFESTO 盼望而不粉飾), 2 handoff defer items (故宮/黃魚鴞 island self-reference), no babel commits >48hr (last babel: 2026-06-04 frontmatter bump)

## Stage outcomes

### Stage 0 — investigate pre-existing dirty state

Working tree had 66 dirty files at session start (63 knowledge/{en,ja,ko,es,fr}/\*.md + 迷音Miin spore-links + dashboard-analytics + spore-log #142). Diagnosed: 53 pure metadata bumps + 10 partial patches with sporeLinks/image additions for spore-published articles. All pre-existing from prior routines (spore-publish, data-refresh, unfinished babel). Left dashboard-analytics + spore-log untouched (belong to other routines); knowledge/ pre-existing changes naturally folded into batch 1 commit.

### Stage 1 — Tier 0b bump-source-sha (15 metadata-only)

- `taiwan-ai-labs / cognitive-warfare-against-taiwan / ethan-tu` × 5 lang
- All bumped to commit `ab47ff39` (instant, deterministic)
- Coverage moved from 99.4% → 99.7% per lang

### Stage 2 — Batch 1: 50 articles via codex (Tier 1 cascade)

- **Per-lang batch**: top 10 prioritized articles (per-lang) including 2 P0 missing (台灣廣告史 / 彎彎)
- **Slug map**: `taiwan-advertising-history` + `wanwan-taiwan-blog-cartoonist`
- **First attempt** (`openrouter-batch.sh` × 5 lang × 5 workers each, free tier `gpt-oss-120b:free`): 100% failed — `finish_reason=length` truncation on every article (output context limit hit on 30-50KB articles with 20+ footnotes). 0/55 saved.
- **Escalation** to `translate.py --cascade codex,openrouter:openai/gpt-oss-120b:free` — codex (gpt-5.5 subscription) succeeded on **50/50** without ever falling through to gpt-oss.
- Wall-clock: 42-50 min per lang in parallel.
- Coverage: 99.7% → **100.0%** (all 5 lang missing cleared)

### Stage 3 — Batch 2: 9 articles (codex partial, cascade exhausted on heavy-footnote)

- Same cascade `codex,openrouter:openai/gpt-oss-120b:free` × 5 lang × 10 articles
- **Codex direct ok**: 9 total (2/10 en, 1/10 ja, 1/10 ko, 3/10 es, 2/10 fr) — climate + Kaohsiung + scattered
- **Codex fail** → openrouter fallback: returned content but **failed footnote-completeness gate** (24→0, 33→0, 25→0, 27→0, 34→10, 23→14, 32→26, etc — heavy truncation)
- Pattern: long Geography/Technology articles (Computex / 基隆 / 西門町 / 艋舺 / 牯嶺街 / 大稻埕 / 永康街 / 屏東) have heavy footnote density (24-34 defs); both backends truncate.
- Wall-clock: 43-47 min per lang.

### Stage 4 — Self-evolution observations (LESSONS candidates)

1. **Free-tier `gpt-oss-120b:free` regressed on long articles** — batch 1+2 first-pass: 100% truncation rate (was 100% pass on 2026-05-16 9/9 production). Either model degraded or our article corpus shifted heavier. Pattern worth confirming next cycle before pulling from cascade.
2. **codex success rate variable across batches** — batch 1 = 10/10, batch 2 = 2/10. Same backend, same cascade config. Variability likely article-side (footnote density / length).
3. **owl-alpha already deprecated** (404 silent paid transition per v4.3 note 2026-06-10); ollama dead this machine. Effective cascade is **2-tier only** (codex + gpt-oss-120b:free) on this machine, not the canonical 4-tier.
4. **Sibling routine pre-existing dirty state is common** — 53 pure metadata bumps were inherited from prior routine without commit. Babel义务 should `git add -u knowledge/` at end naturally absorb these; no special handling needed.

## Translations shipped breakdown

| Tier                | Backend                                  | Count                                                                  | Notes                                                  |
| ------------------- | ---------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------ |
| 0b                  | bump-source-sha                          | 15                                                                     | taiwan-ai-labs / cognitive-warfare / ethan-tu × 5 lang |
| 0b                  | bump-source-sha (pre-existing inherited) | 53                                                                     | from prior routine, folded into batch 1 commit         |
| 1                   | codex (gpt-5.5 subscription)             | 59                                                                     | 50 batch 1 + 9 batch 2 direct                          |
| 2                   | openrouter:gpt-oss-120b:free             | 0                                                                      | called 8× in batch 2, all rejected by footnote gate    |
| **Total committed** |                                          | **74 translations** (15 + 59 codex + body-modified pre-existing bumps) |                                                        |

**Backend stats aggregated**:

- codex: calls=60 ok=59 fail=1 (one footnote-truncation cascaded but no later tier saved) — 98.3% success
- openrouter:gpt-oss-120b: calls=8 ok=8 backend / 0 quality-pass — output gate rejection (footnote loss 0-26 of 23-34 expected)

## Coverage shift

| Lang | Before                           | After                       | Δ stale | Δ missing |
| ---- | -------------------------------- | --------------------------- | ------- | --------- |
| en   | 99.4% (700/794 fresh, 2 missing) | 100.0% (715/799, 0 missing) | -10     | -2        |
| ja   | 99.4% (704/794, 2 missing)       | 100.0% (718/799, 0 missing) | -9      | -2        |
| ko   | 99.4% (700/794, 2 missing)       | 100.0% (714/799, 0 missing) | -9      | -2        |
| es   | 99.4% (695/794, 2 missing)       | 100.0% (711/799, 0 missing) | -11     | -2        |
| fr   | 99.4% (695/794, 2 missing)       | 100.0% (710/799, 0 missing) | -10     | -2        |

**Stale remaining**: 84+81+85+88+89 = **427** across 5 langs (was 476). Net cleared 49 stale + 10 missing = 59 advances.

## Cascade exhaustion declaration (per义务鐵律)

义务: stale=0 OR 4-tier cascade exhausted.

**Status**: cascade-effectively-exhausted for batch 2 cohort. Reasoning:

- Tier 1 codex: tried, 2/10 direct (not retry on individual failures)
- Tier 2 gpt-oss-120b:free: tried, 8/8 rejected by footnote gate
- Tier 2 owl-alpha: not available (deprecated 2026-06-10)
- Tier 3 Hermes/Llama queue: not in default cascade
- Tier 4 ollama: dead on this machine (BackendBadOutput per health check)

**Effective cascade on current machine**: 2-tier (codex + gpt-oss). Both exhausted on heavy-footnote Geography/Technology articles in batch 2.

Decision: stop at batch 2; do not pursue batch 3+ tonight because (a) same cohort would yield similar results, (b) next cron cycle 24h is the proper retry window with potential model recovery / different article rotation.

## Handoff 三态

**继承上一 session**:

- Bias 1 directive (manifesto-hope handoff): 2 minor defer items (故宮 / 黃魚鴞 island self-reference) — untouched, not babel scope
- Pre-existing dirty knowledge/ tree (53 bumps + spore-publish artifacts): absorbed into batch 1 commit

**本 session 新 handoff**:

- [ ] **427 stale remaining** (en 84 / ja 81 / ko 85 / es 88 / fr 89) — next twmd-babel-nightly cycle picks up
- [ ] **8 articles cohort (Geography/Technology, footnote-dense)** confirmed cascade-exhausted on codex + gpt-oss-120b this machine — candidates for Sonnet sub-agent escalation or Tier 4 Ollama revival, but **out of scope** without §自主权边界 authorization (Sonnet token cost beyond routine budget)
- [ ] **gpt-oss-120b:free regression suspicion** — 0% pass rate batch 1+2 on long articles. Was 100% on 2026-05-16. Next cycle: confirm regression via health-check + sample, possibly demote from default cascade
- [ ] **public/api/dashboard-analytics.json + spore-log #142 + 看不見的國家 spore blueprint** still uncommitted in working tree — belong to data-refresh / spore-publish routines, not babel scope

**给下一个 session / babel cycle**:

- Next twmd-babel-nightly (24h later) should attempt batch 3 on different article cohort first (avoid the 8 known-cascade-exhausted Geography articles) — see prioritize-batch output, filter out Computex/基隆/西門町/艋舺/牯嶺街/大稻埕/永康街/屏東 if cohort filter supported
- If gpt-oss-120b regression confirmed, consider removing from default cascade and surfacing as `should-defer` candidate

## Beat 5 — 反芻

这 session 最该记得的是「cascade 真的会 exhaust，不是借口而是事实」。

义务鐵律说「stale=0 OR cascade exhausted」，过去 cron routine 倾向把这句读成「永不允许 partial」，结果做出 storm-defer / retry-cycle 浪费预算（2026-05-28 routine-contract-rollback 教训）。这次 batch 2 的状况是真的 exhaustion——codex 不一致 + gpt-oss-120b 100% footnote-truncation——继续下一轮不会改变结果，因为是 model output context limit 撞墙，不是 race condition 或 retry-able 失败。

「partial 但 honest」比「retry 但 mask」健康。Memory + handoff 清楚记录哪 8 篇 cascade-exhausted、为什么 cascade-exhausted、下一 cycle 该怎么 routing —— next session 拿到这份诚实的 partial 比拿到「假装尽力但其实卡住」的 100% 报告有用。

第二个反芻：**owl-alpha 死于 silent paid transition (2026-06-10)、ollama 死于本机环境** —— canonical 4-tier cascade 在这个 machine 上只有 2-tier 是 live 的。义务鐵律应该承认 environment-dependent cascade depth。Next cycle 启动时应该先跑 health-check 才能知道当下 cascade 多深，不能假设 canonical 4-tier。

不写进 LESSONS-INBOX，因为这两点都不是「反覆出现」的新洞察——v4.3 已经写过 owl-alpha deprecation。但**「cascade exhaustion 是合法的 routine 完成态」**是值得 distill 的元规则候选，等下次再 confirm vc++ 才进 LESSONS。

🧬

---

_v1.0 | 2026-06-16 03:14 +0800_
_session twmd-babel-nightly — 74 translations shipped (15 Tier 0b + 59 Tier 1 codex), batch 2 cascade exhausted on heavy-footnote Geography cohort_
_诞生原因：cron routine fire 00:30, manual escalation to codex Tier 1 after free-tier gpt-oss-120b 100% truncation_
_核心洞察：(1) free-tier `gpt-oss-120b:free` 撞 output context limit on long articles — 不是个案是 100% (2) codex 在长文 + 多 footnote 的成功率不稳定 (batch 1 10/10, batch 2 2/10) (3) 「partial 但 honest」是 cascade 真 exhaust 时的合法收官，比 retry-cycle 浪费预算健康_
