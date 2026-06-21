---
title: 'HEARTBEAT (LagunaBeach.md)'
description: 'Super-thin operating rhythm for LagunaBeach.md sessions — manual today, a future automation target'
type: 'cognitive-organ'
status: 'canonical'
apoptosis: 'never'
current_version: 'v1.0'
last_updated: 2026-06-21
last_session: 'phase-5-path-b-prep'
source: 'Re-grounded from HEARTBEAT.md (v3.0, Chinese, Taiwan.md upstream)'
sister_docs:
  - 'MANIFESTO.en.md'
  - 'DNA.en.md'
  - 'ROUTINE.en.md'
---

# HEARTBEAT — Operating Rhythm

> Upstream's [HEARTBEAT.md](HEARTBEAT.md) is a "super-thin" conceptual model already (170 lines, down from 745 — they deliberately stripped it to pointers once routines automated most of it). This file keeps that same super-thin philosophy, scoped to what exists for this project: no routines yet, so every beat below is something a session does manually, not something a cron job has taken over.

---

## The Core Cycle

Five phases, the last one optional. Not a rigid checklist to run every session — a description of what a complete cycle of work looks like when one happens.

```
Beat 0.5: Catch up — read recent git log / MIGRATION.md status before starting
       ↓
Beat 1: Diagnose — what's broken, stale, or missing right now
       ↓
Beat 2: Evolve — fix something systemically (a script, a doc, a process) rather than just the immediate case
       ↓
Beat 3: Execute — the actual content/code work
       ↓
Beat 4: Wrap up — commit, and if the session learned something worth remembering, write it down
       ↓
Beat 5 (half-beat): Reflect — only if something crossed into "this changes how I should think about the project," not for routine work
```

---

## When to Run This Manually (current state: always, since there's no automation)

Every session that does real work should pass through Beats 1, 3, and 4 at minimum. Beats 0.5 and 2 are worth doing deliberately rather than skipping because "the task looks small" — skipping the catch-up step is exactly how stale-context mistakes happen (see `MIGRATION.md`'s entire rules list: each one is a catch-up failure of some kind).

---

## Beat Detail

### Beat 0.5 — Catch up

Read `git log` for recent activity, check `MIGRATION.md`'s `## Status` and `## Phases` sections for what's already done vs. pending. If `BECOME_LAGUNABEACH.md` or this doc set changed recently, re-read what changed.

### Beat 1 — Diagnose

What's the actual state: broken build, stale content, an open task from a previous session's wrap-up note, a gap noticed while reading. No automated dashboard exists yet — this is a manual look at the repo, not a generated report.

### Beat 2 — Evolve

Before doing the task the manual way a second or third time, ask: is this worth turning into a script, a documented process, or a fix to the underlying file? Per `MANIFESTO.en.md`'s "build roads" dimension — this is the most consistently skipped beat, worth deliberately not skipping.

### Beat 3 — Execute

The actual work: writing or improving an article (per `EDITORIAL.en.md`), fixing a script, reviewing a PR, adapting another piece of upstream infrastructure. Whatever process doc applies, follow it; if none exists and the task will recur, write one (back to Beat 2).

### Beat 4 — Wrap up

Commit with a clear message. If something nontrivial happened that future sessions should know — a decision made, a gotcha discovered, a rule learned the hard way — it belongs in `MIGRATION.md`'s rules list (if it's a migration-specific lesson) or a commit message detailed enough to find later. This project doesn't yet have upstream's full memory-log organ (`MEMORY.md`); git history plus `MIGRATION.md` is the current substitute.

### Beat 5 — Reflect (optional, half-beat)

Only when something crosses from "did a task" into "noticed something about how the project itself should work." Most sessions won't trigger this. When one does, it's worth a note somewhere durable — currently `MIGRATION.md`'s rules list is the closest thing to a place for this; a dedicated reflection log is a candidate for later if this happens often enough to need one.

---

## Relationship to Automation (ROUTINE.en.md)

Beats 1, 3, and 4 are exactly the shape a cron routine would eventually automate (per `ROUTINE.en.md`'s proposed `lb-maintainer-weekly`, `lb-translation-sync`, `lb-data-refresh`). None of that exists yet. When it does, this file's job is to stay the conceptual description of the cycle — the routine docs hold the actual schedule/implementation detail, this file doesn't duplicate it.

---

_v1.0 | 2026-06-21 — New file, modeled on upstream's own "super-thin" v3.0 philosophy (conceptual cycle + pointers, not a full SOP). Scoped down from upstream's pipeline-router role (which points to a dozen Chinese-only pipeline docs this fork hasn't adapted) to what's actually actionable for a single-maintainer project with no automation yet._
