---
title: 'ROUTINE (English Shadow Translation)'
description: 'Comprehension guide to Taiwan.md automated routine system for English-speaking contributors'
type: 'editorial-canonical'
status: 'canonical'
current_version: 'v1.0'
last_updated: 2026-06-20
last_session: 'phase-4-shadow-translation'
source: 'ROUTINE.md (v2.12, 902 lines, Chinese)'
---

# Routine System: English Comprehension Guide

> **Shadow translation** of `ROUTINE.md` for comprehension and future adoption.
> The Chinese original (902 lines) is the source of truth; this file summarizes
> the architecture, design principles, and routine inventory so English-speaking
> contributors can understand (and eventually adopt pieces of) the automation system.

---

## What Is the Routine System?

The "flywheel": automated cron tasks that clear entropy (broken links, stale data, missing translations, unprocessed feedback) so humans focus on strategy, not maintenance.

Taiwan.md runs 16 active routines. They commit directly to main, write memory after each run, and follow a strict 5-stage lifecycle.

---

## Design Principles

1. **Routine = thin shell.** Each routine is just "at time X, call skill Y" + quality gate + failure escalation. Business logic lives in the skill/pipeline, never in the routine definition. Fix the pipeline once, all routines benefit.

2. **Main-direct.** Routines commit and push directly to main (no PRs). Quality gate + pre-commit hook + CI protect correctness. No exceptions.

3. **Mandatory finale.** Every routine ends with `/twmd-finale` (memory write = what happened). Unfinished routine = invisible work = broken self-evolution loop.

4. **No budget framing.** No "stop after X minutes" or "partial ship." Let routines finish naturally. Claude's internal session limit is the only ceiling.

5. **Start with git pull.** Working on a stale base causes merge conflicts and duplicated work.

6. **Hour-aligned cron.** Minutes field is always `0` or `30`. System adds 3-9 min jitter automatically. Humans can audit at a glance.

---

## 5-Stage Lifecycle (Every Routine)

```
Stage 0: Boot/become (load identity + editorial standards)
Stage 1: git pull (never work on stale base)
Stage 2: Run skill (the actual work, governed by its pipeline doc)
Stage 3: Commit + push to main
Stage 4: Finale (write memory, optionally diary if reflective)
```

---

## Routine Inventory (16 Active)

### Daily Chain

| Time  | Routine             | Model  | Purpose                                      |
| ----- | ------------------- | ------ | -------------------------------------------- |
| 00:30 | babel-nightly       | Sonnet | Push multilingual sync toward 100% (5 langs) |
| 05:00 | embeddings-nightly  | Sonnet | Rebuild semantic index (bge-m3 vectors)      |
| 06:00 | data-refresh-am     | Sonnet | Pull analytics, rebuild dashboard JSON       |
| 06:30 | spore-harvest-am    | Opus   | Harvest social engagement metrics + replies  |
| 07:00 | feedback-triage     | Sonnet | Process reader reports into GitHub issues    |
| 08:00 | spore-pick-daily    | Sonnet | Propose 3 social post candidates             |
| 08:30 | maintainer-am       | Opus   | Review PRs, broken links, build health       |
| 17:30 | spore-publish-daily | Opus   | Ship 1 social post from inbox                |
| 19:00 | rewrite-daily       | Opus   | Write/improve one article per day            |
| 22:00 | maintainer-pm       | Opus   | Evening PR + build health pass               |
| 23:00 | data-refresh-pm     | Sonnet | Second daily analytics pull                  |

### Sunday Reflection Chain (Weekly)

| Time  | Routine              | Model  | Purpose                                       |
| ----- | -------------------- | ------ | --------------------------------------------- |
| 01:00 | news-lens-weekly     | Sonnet | Scan news, generate article candidates        |
| 02:00 | weekly-report-sun    | Opus   | Weekly health/progress report                 |
| 03:00 | distill-weekly       | Opus   | Distill lessons, audit spore inbox capacity   |
| 04:00 | self-evolve-weekly   | Opus   | Find uninstrumented gaps, evolve pipelines    |
| 21:00 | routine-audit-weekly | Opus   | Cross-routine pattern detection, 7-day window |

### Paused

- `music-media-audit-weekly` (Sat 10:00, disabled 2026-05-25)

---

## Failure Escalation Pattern

All routines follow the same escalation ladder:

1. 1x fail: silent retry next cycle
2. 2x consecutive fail: append LESSONS-INBOX + alert
3. 3x consecutive fail: pause routine + notify observer (human)

Some routines have additional gate-specific fallbacks (e.g., swap a candidate, skip a category).

---

## Key Concepts for Adoption

### What LagunaBeach.md Could Adopt (Future)

- **Data refresh** (once content and analytics grow)
- **Maintainer** (once contributors submit PRs)
- **Translation sync** (once zh-TW content exists alongside en)
- **Weekly reflection** (for project health checks at any scale)
- **Feedback triage** (once a reader feedback backend exists)

### Adapting a Routine

To create a routine for this project:

1. Write the pipeline doc (the business logic)
2. Create the skill (thin wrapper that calls the pipeline)
3. Define the routine (cron + skill + quality gate + escalation)
4. The routine itself should be ~20 lines of config, not logic

### Collision Handling

When routines overlap (e.g., babel runs 4+ hours on heavy days), Taiwan.md uses:

- Detached subprocess mode
- Selective `git add` (exclude paths being written by sibling routine)
- Time-shifted scheduling with buffer windows

---

## Relationship to Other Docs

- `HEARTBEAT.md`: the pipeline router (routines are one beat)
- `ANATOMY.md`: maps all organs including the routine system
- `DNA.md`: the invariant rules routines must respect
- Pipeline docs (`docs/pipelines/`): where business logic lives
- Skill docs (`.claude/skills/`): thin wrappers that invoke pipelines

---

_This shadow translation covers ROUTINE.md v2.12 (2026-06-14). Update if the source diverges significantly._
