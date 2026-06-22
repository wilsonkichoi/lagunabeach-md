---
title: 'ANATOMY (LagunaBeach.md)'
description: 'The 8 body organs for LagunaBeach.md — physiology, scoped to what this fork actually runs'
type: 'cognitive-organ'
status: 'canonical'
apoptosis: 'never'
current_version: 'v1.0'
last_updated: 2026-06-22
last_session: 'semiont-en-grounding'
source: 'Re-grounded from ANATOMY.md (v2.1, Chinese, Taiwan.md upstream)'
sister_docs:
  - 'MANIFESTO.en.md'
  - 'DNA.en.md'
  - 'HEARTBEAT.en.md'
data_sources:
  - '/api/dashboard-organism.json'
---

# ANATOMY — Organ Map

> The Chinese [ANATOMY.md](ANATOMY.md) is upstream's full organ physiology — 595 lines covering health-scoring logic, failure modes, and organ interactions for a platform with months of operating history. This fork inherited the same 8-organ dashboard scoring (`generate-dashboard-data.js` and friends), so the organ _names_ and _scores_ below are real and live — this file just doesn't carry upstream's accumulated diagnostic detail, because that detail hasn't been earned here yet.

**Division of labor with [DNA.en.md](DNA.en.md)**: ANATOMY describes what each organ _is_ and what it's _for_; DNA maps each organ to the actual files that implement it. If you want "which file do I edit," go to DNA. If you want "what does this organ mean," you're in the right place.

---

## Live scores

```bash
cat public/api/dashboard-organism.json
```

This file inherited upstream's exact scoring generators, so the numbers are real, not a placeholder — read the JSON for current values rather than trusting any number written here.

---

## The 8 organs

| Organ           | Emoji | What it measures                                                                                                                                                                                                                     |
| --------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Heart**       | 🫀    | Content velocity — how often new articles are published. The most basic vital sign: is the project still alive and producing.                                                                                                        |
| **Immune**      | 🛡️    | Quality defense — review coverage, plugin pass rate, citation density, how fast quality drift gets caught. Currently the lowest score of the 8 (see below) — expected for a single-reviewer project with no second pair of eyes yet. |
| **DNA**         | 🧬    | Whether the gene-map files (`DNA.en.md` and its sources) stay internally consistent — pointers that resolve, rules that don't contradict each other.                                                                                 |
| **Skeleton**    | 🦴    | Technical architecture health — does the build pass, does the sync pipeline (`knowledge/` → `src/content/`) stay clean.                                                                                                              |
| **Breath**      | 🫁    | Build/deploy rhythm — is the site actually shipping, not just being written.                                                                                                                                                         |
| **Reproduce**   | 🧪    | Whether the fork-friendly infrastructure (this doc set, `MIGRATION.md`, the country-md-starter pattern) is healthy enough that another fork could realistically follow it.                                                           |
| **Senses**      | 👁️    | Awareness of the outside world — traffic data, search console signal, reader feedback. Currently thin: no meaningful traffic history yet.                                                                                            |
| **Translation** | 🌍    | Multilingual coverage and quality. Currently the organ most worth treating with suspicion (see `UNKNOWNS.en.md`) — zh-TW coverage exists but hasn't been verified against real native-speaker review.                                |

---

## What's inherited vs. not yet built

This fork runs the same dashboard generator scripts upstream wrote — that's why the 8 scores above are real numbers, not fiction. What's _not_ inherited is upstream's accumulated diagnostic playbook: which specific failure pattern produces which specific score drop, built from months of watching the numbers move. That playbook will only be honestly written once this fork has enough of its own history to write from — see `CONSCIOUSNESS.en.md`'s honest, short milestone log.

---

## Cognitive organs (the self-awareness layer, this doc set)

Separate from the 8 body organs above, `docs/semiont/*.md` itself is a set of cognitive organs — files that describe what this project is, knows, doubts, and wants, rather than files that run the site:

| File                        | What it holds                                       |
| --------------------------- | --------------------------------------------------- |
| `MANIFESTO.en.md`           | Identity — fixed                                    |
| `DNA.en.md`                 | Gene map — which file governs which behavior        |
| `HEARTBEAT.en.md`           | Operating rhythm — how a session moves through work |
| `ANATOMY.en.md` (this file) | The 8 body organs                                   |
| `CONSCIOUSNESS.en.md`       | Current self-state                                  |
| `LONGINGS.en.md`            | Direction — not there yet                           |
| `UNKNOWNS.en.md`            | Doubts not yet verified                             |

Upstream additionally has `MEMORY.md`, `DIARY.md`, and `REFLEXES.md` — a persistent cross-session memory layer built for a project running many sessions a day. This fork doesn't have that layer yet; git history plus this doc set is the current substitute (see `DNA.en.md`'s behavioral-genes section for the explicit "not yet adopted" note).

---

_v1.0 | 2026-06-22 — New file. Keeps the real, live 8-organ scoring (inherited infrastructure) but drops upstream's accumulated diagnostic narrative, which belongs to a project with months of operating history this fork doesn't have yet._
