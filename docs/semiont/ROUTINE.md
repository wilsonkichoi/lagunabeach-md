---
title: 'ROUTINE (LagunaBeach.md)'
description: 'Automation design principles + current (inactive) routine plan for LagunaBeach.md — re-grounded from Taiwan.md ROUTINE.md'
type: 'cognitive-organ'
status: 'canonical'
apoptosis: 'never'
current_version: 'v2.0'
last_updated: 2026-06-21
last_session: 'phase-5-path-b-prep'
source: 'Re-grounded from ROUTINE.md (v2.12, 902 lines, Chinese, Taiwan.md upstream)'
---

# Routine System: LagunaBeach.md

> The Chinese [ROUTINE.md](https://github.com/frank890417/taiwan-md/blob/main/docs/semiont/ROUTINE.md) is Taiwan.md's own cron-routine SSOT, describing 16 active production routines. It lives in the upstream Taiwan.md repo. **None of those routines run for this project.** This file documents the design principles worth keeping and proposes a minimal, currently-inactive routine plan sized to this project's actual scale.

---

## What the Routine System Is

The "flywheel" concept: automated tasks that clear entropy (broken links, stale data, missing translations, unprocessed feedback) on a schedule, so a human maintainer spends time on judgment calls instead of repetitive upkeep.

Taiwan.md runs this at production scale: 16 routines, committing directly to main, each writing a memory note after every run. LagunaBeach.md is a single-maintainer project with no scheduled automation yet — this file exists so that when automation becomes worth building, it follows a sound design instead of an improvised one.

---

## Design Principles (kept from upstream, all universal)

1. **A routine is a thin shell.** Each routine is just "at time X, run process Y" plus a quality gate plus a failure-escalation rule. The actual logic lives in a documented pipeline/process, never inline in the routine's own definition — fix the process once, every routine that uses it benefits.

2. **Commits go straight to the default branch.** No PRs for routine work. Quality gates, pre-commit hooks, and CI are what protect correctness, not a review step. (This assumes those gates are solid — see Rule 3 below.)

3. **Every routine run ends with a record of what happened.** An unfinished routine run is invisible work — if nothing logs what it did, the next session can't tell whether it ran, what it changed, or whether it needs follow-up.

4. **No artificial time budgets.** Don't cap a routine at "stop after N minutes" or accept partial results as success. Let it finish the unit of work it started, bounded only by the underlying session's own limits.

5. **Always start with a pull.** Working from a stale base causes merge conflicts and duplicated work — the first step of any routine should be syncing with the remote.

6. **Predictable scheduling.** If/when cron schedules exist, keep minute fields at round values (`:00` or `:30`) so a human glancing at the schedule can audit it without parsing arbitrary offsets.

---

## 5-Stage Lifecycle (the shape any future routine should follow)

```
Stage 0: Boot (load identity — BECOME_LAGUNABEACH.md + relevant editorial doc)
Stage 1: Pull latest (never work on a stale base)
Stage 2: Run the actual task (governed by its own documented process)
Stage 3: Commit + push
Stage 4: Record what happened (memory note, minimum)
```

---

## LagunaBeach.md Routine Status: NOT YET ACTIVE

No cron routines are configured or running for this project. The three below are proposed templates, written so that whoever builds the first real one doesn't have to design the shape from scratch — they're not running, and referencing them doesn't imply they are.

| Proposed routine       | Trigger condition for activating it                                         | What it would do                                                                                       |
| ---------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `lb-maintainer-weekly` | Once external contributors are submitting PRs regularly                     | Review open PRs and issues, check broken links, run the build-health checks already in `scripts/core/` |
| `lb-translation-sync`  | Once zh-TW content exists in meaningful volume alongside English            | Check English/zh-TW article pairs for drift, flag orphaned translations                                |
| `lb-data-refresh`      | Once analytics (GA4/Search Console/Cloudflare) are wired up for this domain | Pull traffic data, rebuild whatever dashboard exists, surface anomalies                                |

Each of these, if built, should follow the 5-stage lifecycle above and get its own pipeline doc describing the actual logic — the routine definition itself should stay near the ~20-line "config, not logic" size upstream uses.

---

## What Upstream Runs at Full Scale (reference only)

Listed for design inspiration, not as something active here. Taiwan.md's daily chain covers multilingual sync, semantic-search index rebuilds, analytics pulls, social-engagement harvesting, reader-feedback triage, PR/issue review, and one article rewrite per day — running on Sonnet/Opus depending on task complexity, with a Sunday reflection chain (news scanning, weekly reporting, lesson distillation, pipeline self-evolution, cross-routine pattern audit). All of it assumes infrastructure this project doesn't have yet: a contributor base large enough to generate PR volume, analytics accounts, and social accounts with engagement worth harvesting. Build toward that infrastructure first; the routine design above will still apply when it exists.

---

## Failure Escalation Pattern (worth adopting whenever the first routine exists)

1. First failure: silent retry next cycle.
2. Second consecutive failure: log it somewhere a human will see (an issue, a note file) and flag it.
3. Third consecutive failure: pause the routine and notify the maintainer directly — don't let it keep failing silently.

---

## Relationship to Other Docs

- [`HEARTBEAT.md`](HEARTBEAT.md): the manual operating rhythm this project actually uses today (routines are what happens when a beat gets automated).
- [`DNA.md`](DNA.md): the gene map — which file governs which behavior.
- [`BECOME_LAGUNABEACH.md`](../../BECOME_LAGUNABEACH.md): identity and the rules that exist because they were violated once.

---

_v2.0 | 2026-06-21 — Re-grounded from comprehension-guide status. Replaced the 16-routine Taiwan production inventory (kept as a labeled reference section, not claimed as active) with an explicit "not yet active" status and three proposed, scale-appropriate routine templates per `MIGRATION.md` Phase 5's todo._
_v1.0 | 2026-06-20 — Original shadow translation (comprehension guide). See git history for that version._
