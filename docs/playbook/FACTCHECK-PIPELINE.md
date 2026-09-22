# FACTCHECK-PIPELINE — Fact-Check Methodology

> **Core principle:** each factual claim needs inspectable evidence.
> Check four things: (1) the evidence is accessible to the editor,
> (2) the record is authentic, (3) the article identifies it accurately,
> and (4) the evidence supports the claim. A public URL is one form of evidence;
> interviews, emails, physical records, and dated observations also qualify.
>
> This document is the process contract the framework's fact-check skill
> executes. The editorial standard it protects lives in
> [ARTICLE-PLAYBOOK.md](ARTICLE-PLAYBOOK.md) (§4.6 citations, §4.8 quote
> fidelity).

---

Student reporters can use the [claim log and review checklist](STUDENT-REPORTING-GUIDE.md#6-organize-and-check-your-evidence).
This document supplies the editor's detailed audit method.

## Modes

| Mode      | Budget                        | Trigger                                                          |
| --------- | ----------------------------- | ----------------------------------------------------------------- |
| **Quick** | 15-30 min, 5-10 source checks | During [REWRITE-PIPELINE.md](REWRITE-PIPELINE.md) Stage 3 (every article before ship) |
| **Full**  | 60-90 min, 15+ source checks  | Post-ship audit, reader challenge, periodic patrol                |

These are planning estimates, not permission to skip unresolved claims.
Every new article receives the complete draft self-audit in the writing pipeline.
The sampling rules below apply to additional audits. Check every direct quote and
every challenged or consequential claim regardless of the sample size.

---

## Phase 1: Scope

1. **Classify article tier:**
   - A: People / sensitive / historical claims with citations (full audit)
   - B: General depth articles (10+ sourced claims)
   - C: Hub pages, food/trail soft features (spot-check only)
2. **Set sampling target:** A = all claims; B = 50%; C = 5-10 highest-risk.
3. **Identify the evidence:** `knowledge/` is the source of truth for what the site
   publishes, not proof that its claims are correct. Follow existing citations to
   their evidence. Select sources with direct knowledge of the claim being checked.
4. **Locate private records:** obtain the editor's retained interview notes, emails,
   permission records, or recordings when the article cites unpublished reporting.

---

## Phase 2: Break the Article Into Claims

Separate compound sentences into individual factual claims, called atoms in audit reports.
A sentence about a store's opening date, owner, and location contains three claims.

8 atom types: **date, place, action, quote, number, person, organization,
object**.

For each claim, record its text, source ID, URL or private record reference,
page or timestamp, date, and result. Apply all four gates using the source's actual format.

---

## Phase 3: Source Authority Audit

For each atom (or sampled subset per tier):

1. **Evidence accessible:** open the cited web material or inspect the retained record.
   A 403 means access was denied, not that the page is gone. Try a normal browser,
   a publisher copy, an archive, or another source. A 404 needs investigation or replacement.
   Never claim verification when the material could not be inspected.
2. **Record authentic:** confirm the publisher or interviewee and the record's origin.
   For an interview, confirm the date, method, reporter, and permission for attribution.
   Check a transcript against the recording or original notes, not just an AI transcription.
3. **Description accurate:** distinguish an official record, an owner's recollection,
   a reporter's observation, and an independent account. Identify interests relevant to the claim.
4. **Claim supported:** check the specific statement and its context. A homepage does
   not support an interview quotation. One visit does not establish a general pattern.

When new reporting conflicts with `knowledge/`, compare the underlying evidence,
including dates and scope. Neither version wins automatically. Record the disagreement
and have the editor resolve it, correct affected articles, or explain the uncertainty.
Do not preserve an error for consistency or quietly turn a disputed account into fact.

Choose authority by claim: league records for a result, the artist for their process,
and current official information for visiting hours. Archives and contemporaneous records
help test historical recollections. Independent reporting helps test promotional claims.
Two copies of one announcement are not independent sources. Apply the corroboration
rule in [Research Stage 1](REWRITE-PIPELINE.md#stage-1-research), not a universal source count.

---

## Phase 4: Verbatim Check

For every quoted passage or specific number:

1. **Quotes must be verbatim.** No paraphrasing inside quotation marks. If the
   source says X, the article must say X exactly, not a "cleaner" version.
2. **Numbers must trace to a specific source.** "About 23,000" needs a census
   or municipal record, not a guess.
   Check units, date, geographic scope, and whether a number is a count or an estimate.
3. **Over-citing detection:** if one source is used to back 5+ separate claims,
   verify each claim individually against that source.

---

## Phase 5: Cross-Claim Consistency

Check the article's internal consistency:

1. **Arithmetic:** do the parts add up to the stated total?
2. **Timeline:** are dates in the correct chronological order? Does "founded in
   1927" conflict with "by 1920, the town had..."?
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
- **ACCESS-BLOCKED** — the source could not be inspected, including an unresolved 403
  or a missing private record. Obtain access, replace the evidence, or omit the claim.
- **DEAD-LINK** — the cited page is confirmed unavailable. Find a working original,
  cite an accessible archive or replacement, or remove the unsupported claim.

**Hard gate:** no article ships with unresolved HARD-FIX, ACCESS-BLOCKED, or DEAD-LINK findings.
Fix them in `knowledge/` (the SSOT), then `npm run sync`.

Machine assist for the citation side:

```bash
npm run article-health -- knowledge/{Category}/{slug}.md --profile=rewrite-stage-3-5
```

---

## Output

Record findings in the fixing commit's message (Quick mode), or in a standalone
report file if your instance keeps an audit trail (Full mode). Minimum: list of
claims checked, pass/fail per claim, any fixes applied. Public reports reference private
record IDs without exposing contact details, unapproved quotations, or raw recordings.
