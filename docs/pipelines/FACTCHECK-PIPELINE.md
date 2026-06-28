---
title: 'FACTCHECK-PIPELINE (English / LB)'
description: 'Fact-checking methodology for LagunaBeach.md — 6 phases, Quick/Full mode, grounded in Rule 12'
type: 'pipeline-canonical'
status: 'canonical'
current_version: 'v1.0'
last_updated: 2026-06-25
last_session: '2026-06-25-r8-impl'
sister_docs:
  - 'REWRITE-PIPELINE.md'
  - '../editorial/EDITORIAL.md'
  - '../editorial/QUALITY-CHECKLIST.md'
---

# FACTCHECK-PIPELINE.md — Fact-Check Methodology v1.0

> **Core principle (Rule 12):** every date, number, name, and quoted claim must
> pass four gates: (1) source URL resolves, (2) source actually published the
> content, (3) description is accurate, (4) the article's claim matches the
> source verbatim. Any gate failed = trust leak.

---

## Modes

| Mode      | Budget                        | Trigger                                            |
| --------- | ----------------------------- | -------------------------------------------------- |
| **Quick** | 15-30 min, 5-10 source checks | During REWRITE Stage 3 (every article before ship) |
| **Full**  | 60-90 min, 15+ source checks  | Post-ship audit, reader challenge, monthly patrol  |

---

## Phase 1: Scope

1. **Classify article tier:**
   - A: People / sensitive / historical claims with citations (full audit)
   - B: General depth articles (10+ sourced claims)
   - C: Hub pages, food/trail soft features (spot-check only)
2. **Set sampling target:** A = all claims; B = 50%; C = 5-10 highest-risk.
3. **Identify SSOT:** for LB facts, the ground truth is `knowledge/`. For
   external facts, identify the authoritative source (city records, historical
   societies, gallery archives, news outlets).

---

## Phase 2: Atomic Decomposition

Extract verifiable atoms from the article. Each atom is one factual claim.

8 atom types: **date, place, action, quote, number, person, organization, object**.

For each atom, record: the claim text, its source (footnote/URL or `knowledge/`
file), and which of the 4 gates apply.

---

## Phase 3: Source Authority Audit

For each atom (or sampled subset per tier):

1. **URL resolves** — fetch the source; 404/403 = dead link.
2. **Source is real** — the publication exists and published this content.
3. **Description accurate** — the article's characterization of the source
   matches what the source actually says.
4. **Claim matches source** — the specific fact in the article is supported by
   the source, not just thematically related.

For LB-specific claims (dates, building names, population, geography): cross-check
against `knowledge/` SSOT. If `knowledge/` and the article disagree, the article
is wrong until proven otherwise.

LB-appropriate source types: City of Laguna Beach records, Orange County
archives, Laguna Beach Historical Society, local news (Coastline Pilot, OC
Register), gallery/museum pages, California state records.

---

## Phase 4: Verbatim Check

For every quoted passage or specific number:

1. **Quotes must be verbatim.** No paraphrasing inside quotation marks. If the
   source says X, the article must say X exactly, not a "cleaner" version.
2. **Numbers must trace to a specific source.** "About 23,000" needs a census
   or city record, not a guess.
3. **Over-citing detection:** if one source is used to back 5+ separate claims,
   verify each claim individually against that source.

---

## Phase 5: Cross-Claim Consistency

Check the article's internal consistency:

1. **Arithmetic:** do the parts add up to the stated total?
2. **Timeline:** are dates in the correct chronological order? Does "founded in
   1927" conflict with "by 1920, the city had..."?
3. **Cross-reference:** if article A cites article B, does B actually say what A
   claims it says? Check both `knowledge/` files.

---

## Phase 6: Triage and Fix

Classify each finding:

- **PASS** — source supports the claim, all 4 gates clear.
- **SOFT-FIX** — minor wording adjustment (description slightly off, but claim
  is supported). Fix the description.
- **HARD-FIX** — claim not supported by source. Either find a better source or
  cut the claim.
- **DEAD-LINK** — source URL is 404/403. Find replacement source or cut.

**Hard gate:** no article ships with unresolved HARD-FIX or DEAD-LINK findings.
Fix them in `knowledge/` (SSOT), then run `/lb-sync`.

---

## Output

Append findings to the article's commit message or a `reports/factcheck/` file
(for full audits). Minimum: list of atoms checked, pass/fail per atom, any
fixes applied.

---

_v1.0 | 2026-06-25 — LB factcheck pipeline (method extracted from upstream FACTCHECK-PIPELINE.md v2.0; Taiwan-specific framing dropped, LB source types substituted, Rule 12 grounding added)._
