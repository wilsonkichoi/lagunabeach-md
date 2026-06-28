---
title: 'RESEARCH'
description: 'Research-methodology SSOT — how to find reliable information / multi-source verification / verbatim-quote discipline'
type: 'editorial-canonical'
status: 'canonical'
current_version: 'v1.3'
last_updated: 2026-06-04
last_session: '2026-06-04-102449-deep-research'
sister_docs:
  - 'EDITORIAL.md'
  - 'CITATION-GUIDE.md'
  - 'RESEARCH-TEMPLATE.md'
upstream_canonical:
  - 'EDITORIAL.md'
  - '../pipelines/REWRITE-PIPELINE.md'
  - '../pipelines/FACTCHECK-PIPELINE.md'
---

# RESEARCH.md — research methodology

> Every article must finish its research before a word is written. Not "know a little and start writing" — "gather enough, then curate."
> This document answers: **how to search, how to judge, how to avoid the traps.**

---

## Division of labor (five documents, no overlap)

| Document                    | Answers what                                                                    |
| --------------------------- | ------------------------------------------------------------------------------- |
| **This file (RESEARCH.md)** | how to do research (search strategy, source judgment, data verification, traps) |
| **EDITORIAL.md**            | how to write the article (style, structure, voice, quality standard)            |
| **REWRITE-PIPELINE.md**     | process orchestration (Stage 0→1→2→3, crash safety, token budget)               |
| **RESEARCH-TEMPLATE.md**    | research-note fill-in template (Stage 1's output format)                        |
| **QUALITY-CHECKLIST.md**    | verification checklist (Stage 3 item-by-item)                                   |

⚠️ **EDITORIAL.md no longer contains the research process.** Everything "before you write" lives here.

---

## 1. The core belief about research

**LagunaBeach.md articles are "curated" from research material, not "generated" from memory.**

The biggest AI failure is "know a little and start inventing." LagunaBeach.md does the opposite: gather a lot of high-quality material first, then select, weave, and curate from it. A reader can feel the difference between an article written off Wikipedia alone and one written from 8 sources.

**Research isn't drudgery; it's treasure-hunting.** Good research makes you say "oh, so that's how it was" — if nothing in your research surprised you, you didn't dig deep enough.

---

## 2. The research process (five steps)

### Step 0: find your "counterintuitive core sentence"

**Before any research, force yourself to write one sentence: "What this article makes the reader is surprised by is \_\_\_\_."**

A good core sentence always contains **contradiction, contrast, or a violated expectation**:

| Contrast type     | Example                                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| Time contrast     | "A fire that destroyed 441 homes in a few hours ended up protecting the open space around the city"      |
| Scale contrast    | "A town of under 9 square miles runs the oldest continuously running art show in California"             |
| Status contrast   | "A volunteer standing perfectly still for 90 seconds is the centerpiece of a show that's run since 1933" |
| Survival contrast | "A festival started by artists who got rejected from another festival became an institution of its own"  |

❌ "Laguna Beach has a beautiful coastline" — no contrast = no pull.

Can't write one → research isn't deep enough; come back after Step 2. The core sentence surfaces naturally during research.

### Step 0.5: find your entry character

**Whose story can stand in for this topic?**

This person need not be famous — it can be a firefighter, a festival volunteer, a painter, a longtime resident. Find a person with a name (or at least a specific, real role) in a book, documentary, or report.

- Writing about the 1993 firestorm → don't start from "the fire destroyed 441 homes," start from a resident watching the ridgeline glow on the night of October 27.
- Writing about plein air painting → don't start from "Laguna was an artist colony," start from a painter set up at a specific cove at a specific hour of light.
- Writing about the Pageant of the Masters → don't start from "the Pageant began in 1933," start from a volunteer holding a pose inside a living tableau.

Once you have the entry character, gather their quotes too (during Step 2, watch for verbatim lines in interviews, documentaries, and books). **Do not invent a person, name, or quote — if `knowledge/` and your sources don't have one, use a real, unnamed role, not a fabricated individual (Rule 12).**

### Step 1: define the questions the article will answer

Before gathering anything, write down **3 questions a reader would ask**.

For "the Laguna greenbelt," for example:

1. How did the greenbelt actually come to be? Why did Laguna manage it?
2. How big is it, and what concrete facts back that up?
3. What real tensions does it face now (development pressure, fire risk)?

Those 3 questions are the article's skeleton. Don't force-write a question you can't answer.

### Step 2: search broadly (Research First, Write Later)

**⚠️ This is the most important step. Don't write from memory; write from what you found.**

#### Search quotas (depth article)

> Canonical numbers live in [REWRITE-PIPELINE Step 1.1](../pipelines/REWRITE-PIPELINE.md) (Stage 0 exploration ≥20 + Stage 1 ≥80 = whole article ≥100). This table is the depth-article source-diversity quota, checked by `research-report-health.py`.

| Source class                        | Minimum quota | Goal                                                                |
| ----------------------------------- | ------------- | ------------------------------------------------------------------- |
| Local / primary-language (English)  | 40+           | base facts, history, local perspective, community memory            |
| National / international / academic | **20+**       | broader perspective, scholarly sources, triangulation               |
| Primary sources                     | 15+           | government sites, official reports, records, statutes, papers       |
| Opposing / critical (perspective)   | 5+            | cross-camp counterarguments, recorded in `rationale.whats_excluded` |

> Short articles / Hub / minor updates don't need this scale — only depth articles (≥ 2,000 words / ≥ 10 footnotes) do.

#### Research-depth standard

Every depth article reaches at least:

- **25+ independent sources** (different sites/institutions)
- **Triangulation across source types ≠ 0** — don't write off local press alone; cross-check against national coverage, primary records, and academic work. A topic genuinely covered by only one source → state the reason explicitly in the research report's §search-log, don't silently skip it.
- **At least 5 primary sources** (official documents, firsthand interviews, original statistics, statutes, academic papers)
- **At least 1 "time-span" source** (how the same thing was viewed in different eras)
- **At least 1 "surprise finding"** — a fact you didn't know before searching. If nothing surprised you, research wasn't deep enough.
- **If you searched it, write it back to the report**: every query + source + one-line finding goes into the report's §search-log (SSOT, per [REWRITE-PIPELINE Step 1.7](../pipelines/REWRITE-PIPELINE.md)) — searched but not written back = not searched.

#### Why multiple layers of sources?

A strong article pulls from different layers — local press (community view), national/wire coverage (broader view), institutional records (primary view), and Wikipedia (an index starting point, never a citation). Each layer brings a different depth of understanding. For Laguna Beach specifically, the layers are typically: City of Laguna Beach records, the Laguna Beach Historical Society, the Laguna Art Museum and festival organizations, the Orange County Register / Los Angeles Times archives, and academic or environmental reports.

### Step 3: cross-referencing

**Every important fact needs confirmation from at least 2 independent sources.**

### Step 4: data verification

For every number you put in the article, ask yourself:

- [ ] What **institution** is the source of this number?
- [ ] What **year** does this statistic cover?
- [ ] Can I **find the original text** of this number in the primary source?
- [ ] If I can't find the precise number, would I rather write "about" — or not write it at all?

---

## 2b. The research report = SSOT (thesis-grade methodology)

> A depth article's research report is not a "fact compendium" — it's an **auditable, hand-off-able SSOT held to a graduate-thesis standard.** The full seven-section SSOT structure is in [REWRITE-PIPELINE Step 1.7](../pipelines/REWRITE-PIPELINE.md), checked by `research-report-health.py`.

### Confidence-level system (iron rule #1)

Before a claim enters the report body, tier it into three levels, **each with a basis for "why it's this tier"** (number of sources / can the original be retrieved directly / is it only a media paraphrase):

```yaml
verification:
  high_confidence: # ≥ 2-3 independent sources, verbatim-consistent
    - {claim} (sources A + B + C, multi-source verbatim agreement)
  single_source: # only one source, usable but flagged to backfill
    - {claim} (only X mentions it, need cross-check)
  unverified: # still not found after searching / contradicted → do NOT write into the article
    - {claim} (searched N times, not found / contradicts Y)
```

Promotion/demotion test: ≥3 sources agree → high / single source → single (flag need cross-check) / still not found after searching → **unverified (do not write into the article)**. You can layer finer notation: ★★★ primary DOI/statute verbatim / 🟢🟡🟠 inline / `confidence: high` + `Ctrl-F verifiable ✓` / `⚠️ must-verify` flag (backfill a primary source before the main draft).

### Shared methodology skeleton (10 rules)

1. **Tiered-confidence registry (YAML-first)** — tier before the body, with the source combination attached.
2. **Point of view forms before searching** — lock the core_contradiction (≤30 words) first; searching is **stress-testing the thesis**, not discovering a direction.
3. **The search process is part of the report** — record the budget in frontmatter; list queries one by one; **negative findings must be recorded** ("searched N times, not found").
4. **Triple-source numbers + proactive disclosure of disagreement** — when sources disagree, disclose the difference and how you handled it, don't silently pick one; keep different measures separate (transaction amount vs. realized gain vs. net profit).
5. **Verbatim quotes are a standalone asset** — each quote in the quote bank: word-for-word + URL + occasion + `Ctrl-F ✓`; mark reporter paraphrases separately; **can't find the original → switch to paraphrase without quotation marks**.
6. **Counterexamples up front as a guardrail** — **before** the fact list, write the "things you can't say / counterexamples to verify / do-not-trust list." `Source contradicts itself > both sides presented`.
7. **Core-contradiction candidates, pick one of several (2-3 + why)** — preserve the Stage 2 judgment; don't let the report replace the writing decision.
8. **The report = the Stage 2 operating manual** — hook-scene candidates + subheading candidates + must-not-miss correction points + **hallucination-candidate Ctrl-F checklist**.
9. **Surgical re-check of an existing article's red_flags (EVOLVE)** — a three-column log (original text / corrected version / source).
10. **Multi-round research** — Rounds 2/3 backfill unverified claims, add academic depth (DOI), add historical anchors; each round declares its budget + key breakthrough.

---

## 3. Judging source quality

### Source priority

| Tier         | Type                  | Note                                                                             | Example                                   |
| ------------ | --------------------- | -------------------------------------------------------------------------------- | ----------------------------------------- |
| 🟢 primary   | official original     | government statistics, official sites, statutes, annual reports                  | City of Laguna Beach, county records      |
| 🟢 primary   | academic/professional | academic papers, professional media, research reports                            | JSTOR, university studies                 |
| 🟡 secondary | news reporting        | mainstream media (watch recency; prefer the last 3 years)                        | Los Angeles Times, Orange County Register |
| 🟡 secondary | Wikipedia             | an index starting point to find the original source; don't cite Wikipedia itself | read the "References" section             |
| 🔴 avoid     | low quality           | blogs, content farms, untraceable "it's said" / "some believe"                   | —                                         |

### Good sources for Laguna Beach topics

| Domain                | Recommended source                                                              |
| --------------------- | ------------------------------------------------------------------------------- |
| City records          | City of Laguna Beach (official municipal site); county / state records          |
| History               | Laguna Beach Historical Society; California state archives                      |
| Art & galleries       | Laguna Art Museum; festival organizations (Festival of Arts, Sawdust)           |
| Nature / marine       | California Department of Fish and Wildlife; Crystal Cove / state-park resources |
| News (local)          | Orange County Register; [Los Angeles Times](https://www.latimes.com/) archive   |
| International / index | [Wikipedia](https://en.wikipedia.org/) (as an index to primary sources only)    |

> Name an institution as a recommended source — that is not a factual claim. Asserting a _fact_ from it (a year, a count) still requires Rule-12 verification against `knowledge/` before you write it.

### Common traps

| Trap                                  | How to spot it                                                                       | How to avoid it                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| **Content farm posing as real media** | URL contains generic words like `dailynews`, `life`, `news` but isn't a known outlet | Google the site name + "credibility"                       |
| **Wikipedia as the only source**      | every figure points to the same Wikipedia page                                       | trace from Wikipedia's "References" to the original source |
| **Stale government data**             | report dated 5+ years ago                                                            | find the same agency's latest version                      |
| **PR posing as news**                 | "the company said," "it is understood," no named byline                              | find reporting with a named byline, not a "press release"  |
| **AI-generated fake academic papers** | the DOI doesn't exist; the author can't be Googled                                   | verify the DOI and author on Google Scholar                |

### URL quality requirements

- A URL must point to a **specific page**, not just a homepage (❌ `https://www.lagunabeachcity.net/` / ✅ `https://www.lagunabeachcity.net/content_xxx`)
- A single website counts as at most 2 sources (5 Wikipedia links ≠ 5 sources)
- Labeling the source type next to it helps: `[City of Laguna Beach 2023 report](URL) (primary)`

---

## 4. Search-strategy field guide

### Keyword-construction technique

| Goal                    | Search-keyword pattern                                        | Example                                               |
| ----------------------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| Find quotes             | `"topic" interview OR documentary "said"`                     | `"1993 Laguna fire" survivor interview "said"`        |
| Find controversy        | `"topic" controversy OR criticism OR opposition`              | `"Laguna greenbelt" development controversy`          |
| Find primary            | `"topic" site:gov OR site:edu`                                | `Laguna Beach incorporation site:lagunabeachcity.net` |
| Find data               | `"topic" statistics OR report year number`                    | `"Pageant of the Masters" attendance statistics`      |
| Find international view | `"Laguna Beach" [topic] site:latimes.com OR site:nytimes.com` | `Laguna Beach art colony history`                     |
| Find time depth         | `"topic" before:2010` vs. the same query, no date limit       | see how it was described 10+ years ago                |
| Find documentaries      | `"topic" documentary`                                         | `Laguna Beach 1993 fire documentary`                  |
| Find books              | `"topic" book OR history OR published`                        | `Laguna Beach art colony history book`                |

### Tracing primary sources from Wikipedia

1. Search the relevant Wikipedia article.
2. **Don't cite Wikipedia itself** — look at its "References" section.
3. Open those references; those are your real sources.
4. If a reference is a dead link → find an archive with the [Wayback Machine](https://web.archive.org/).

### Finding academic sources with Google Scholar

1. Search the topic on `scholar.google.com`.
2. Prefer results with a PDF (directly readable).
3. Check citation count (>10 = influential).
4. For California / regional history, check university library archives and JSTOR.

### Quote-mining technique

**LagunaBeach.md can't interview, but it can mine voices from existing public material.**

| Source type                   | Priority                                              | How to find                                       |
| ----------------------------- | ----------------------------------------------------- | ------------------------------------------------- |
| Documentary / video interview | 🟢 best (most vivid voice)                            | search YouTube `"topic" interview`, read captions |
| Book / publication            | 🟢 good (fact-checked)                                | search Google Books, read preview pages           |
| News-report quotes            | 🟡 usable (watch for distortion in secondhand quotes) | search `"said" "person name"`                     |
| Social-media posts            | 🟡 use with care (confirm it's public and verifiable) | only quote a person's own public post             |
| Fabricated / AI-generated     | 🔴 forbidden                                          | —                                                 |

**What makes a good quote** (see EDITORIAL.md "quote-mining" section):

- has a voice, sounds spoken, reveals a stance, or is expert analysis ✅
- official-statement style, no voice, untraceable ❌

---

## 5. Common research mistakes (hard-won lessons)

### 🔴 Fatal mistakes

| Mistake                                    | Consequence                                                      | How to avoid                                                   |
| ------------------------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| **Writing off Wikipedia alone**            | shallow article, no surprise finding                             | at least 8 searches; Wikipedia is only a starting point        |
| **Treating a secondhand quote as primary** | news cites a study, you cite the news = secondhand of secondhand | trace to the original report/paper                             |
| **Fooled by AI-hallucinated fake data**    | fake book titles, fake stats, fake names enter the article       | Google-verify every figure an AI gives you                     |
| **Fabricating a specific number**          | "about $60 million in revenue" with no such statistic            | if you can't find the precise number, write "about" or nothing |
| **Misattribution**                         | crediting A's work to B                                          | cross-check; verify not just the fact but the attribution      |

### 🟠 Quality degraders

| Mistake                                                                      | Consequence                                                                                                                 | How to avoid                                                                                                  |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Time blind spot**                                                          | only recent coverage, no historical depth                                                                                   | at least 1 "time-span" source                                                                                 |
| **Single perspective**                                                       | only local coverage, no broader view                                                                                        | at least 1 national/international source                                                                      |
| **Ignoring controversy**                                                     | the article becomes a puff piece                                                                                            | search `"topic" controversy OR criticism`                                                                     |
| **URL only to the homepage**                                                 | the reader can't verify                                                                                                     | URL points to a specific page                                                                                 |
| **Not preparing the ending during research**                                 | you run out of gas at the end and the ending turns canned                                                                   | RESEARCH-TEMPLATE.md's last item = ending material                                                            |
| **A fetch tool returns a paraphrase, used as a "direct quote"** (added v1.1) | lifting a summarized/paraphrased line and presenting it as a verbatim quote = fabrication; violates EDITORIAL §quote-mining | demand verbatim text + verify it Ctrl-F in the original source (see §6)                                       |
| **Mixing up measures of an amount** (added v1.1)                             | conflating "total" with "individual share," mixing reported figures                                                         | when a number has multiple measures (gross vs. net vs. per-unit), keep them separate; cross-check ≥ 3 sources |

### 🟡 Efficiency drains

| Mistake                                     | Consequence                                                    | How to avoid                                              |
| ------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------- |
| **web_fetch the full text of every result** | burns tokens, research eats 70% of budget                      | read the snippet first to judge if it's worth a deep read |
| **Not checking existing articles first**    | finish writing, then find 80% overlap with an existing article | before research, `grep -r "keyword" knowledge/`           |
| **Unstructured research notes**             | can't find material while writing                              | organize with the RESEARCH-TEMPLATE.md format             |

---

## 6. The right way to fetch with a summarizing tool (verbatim discipline)

> **Inherited red line (origin: Taiwan.md, 2026-04-14).** This rule was written after a Taiwan.md incident where a WebFetch of a Chinese-language outlet returned an English paraphrase, and the AI translated that English summary back and used it as a "direct quote" — fabrication. The mechanic was language-specific; the lesson is universal and applies to LagunaBeach.md: **a fetch/LLM tool returns a paraphrase, not the source's words. Never lift a verbatim quote — or a specific scene detail — from a paraphrase.**

### Why it happens

WebFetch and similar tools run a page through markdown conversion + LLM processing. The LLM **paraphrases the page into a summary** rather than returning the source text word-for-word. The summary is a faithful gist, but it is not the original wording — so anything you take from it that pretends to be original wording is invented.

### Wrong prompt (you'll get a summary)

```
What does this source say about the resident's experience of the 1993 fire?
```

The reply will be a paraphrase. That phrasing is the LLM's, not the source's — using it inside quotation marks is fabrication.

### Right prompt

```
Quote the exact wording from the page verbatim. Do not paraphrase, summarize, or translate.
I'm looking for [specific passage feature, e.g.: the resident's own words about the night of the fire].
Return the verbatim text, including the complete original sentence and its quotation marks.
If you can't find that passage, say so explicitly — do not substitute a summary.
```

### Iron rules for fetching any source

1. **Ask explicitly for "verbatim," "do not paraphrase," "do not summarize"** — write it into the prompt.
2. **If the original can't be found, require an explicit "not found"** — fail rather than accept a summary substitute.
3. **After fetching, re-verify the quote at the original URL with a browser or curl** — run this before commit.
4. **A summary is research reference, not writing material.** Every concrete detail goes back to the original to be checked.

### If the tool still returns only a summary

Fallback order:

1. **Re-fetch + change the prompt**: try once more with a stronger verbatim demand.
2. **Switch to Bash + curl + grep**: bypass the tool's LLM layer and pull the original text from the HTML.
3. **WebSearch for the original fragment**: search a keyword from the quote to find another source carrying the original.
4. **Ask the observer for the original**: pasting the full text is faster than retrying a failed fetch.
5. **If none of the above works**: drop the direct quote, switch to a paraphrase (no quotation marks), or cut the material. **Better one fewer quote than a fabricated one.**

### Self-check (run before commit)

For every `"..."` direct-quote:

- [ ] Did I ask the fetch tool for verbatim text (not a summary)?
- [ ] Did the prompt explicitly require "do not paraphrase / translate"?
- [ ] Is the returned content the source's original wording (not a summary)?
- [ ] Can I Ctrl-F this sentence on the page at the original URL?
- [ ] Any box unchecked = no direct-quote format; switch to paraphrase.

### Red line, expanded: don't derive specific scene details from a summary either (added v1.2)

> Not just direct quotes. **Unquoted but reader-verifiable scene details** — a specific time, place, action, vehicle, route — must also be checked word-for-word against the original source, never derived from a summary.

#### Why this red line is especially easy to violate

A `"..."` direct quote at least carries an obvious "this is the original wording" promise. But **unquoted scene description** reads like "narration," not "quotation," so the AI fills in details more freely from a summary.

A summary is a highly compressed paraphrase. Compressing "got up at 5:30, mom drove him to the station, caught the first train, four transit lines" into "commuted three hours daily by transit," then expanding it back, the AI will:

- infer "left at 4-something" from "3-hour commute" (because 7am arrival makes a 4am departure "make sense")
- infer "studied waiting for dawn" from "before-dawn training"
- infer a convenience-store location from "convenience store" (near home? near school? the AI defaults to near home)

**Each step is a reasonable inference**, but together they are **a fabricated scene**.

#### Inherited case study: Taiwan.md retraction (2026-04-14)

A Taiwan.md piece derived a subject's morning-commute scene from an English summary: it wrote "4-something in the morning" when the original said "5:30," "took four transit lines from [town]" when the original said "mom drove him to the station to catch the first train," and a study location that was simply wrong. A reader caught the physical contradiction (the transit system's first train was 6:00 — you can't ride it at 4am) within about an hour, and the post was retracted. The lesson generalizes directly to LagunaBeach.md: anchor every concrete detail in the source, not in plausible inference.

#### Five expanded iron rules

1. **Specific times** (clock time, date) must be confirmed against the original; never derive a precise time from a vague "dawn / morning / late afternoon."
2. **Specific places** (station name, street, business location) must be confirmed; never derive a location relationship from a vague "convenience store / station / school."
3. **Specific actions** (studying / doing homework / waiting for dawn / training) must be confirmed; never derive from a vague verb.
4. **Specific vehicles and routes** (how many lines, who drove, what transport) must be confirmed.
5. **Specific numbers** (weight, distance, frequency) must be confirmed; never derive a precise number from "about / approximately / roughly."

#### The "specificity" test

If a reader could take a detail you wrote and verify it (e.g. "what time is the first train," "where is that store," "how late do they train"), it's "specific" and must be confirmed word-for-word against the original source.

#### Self-check (expanded version)

For every scene description in the article:

- [ ] Is this scene's **time** in the original source? (the original, not a summary)
- [ ] Is this scene's **place** in the original source?
- [ ] Is this scene's **action** in the original source?
- [ ] Did I derive a concrete detail from a vague word in a summary?
- [ ] Any "not written but I wrote it" = **invented scene** = red flag = switch to paraphrase (a non-specific description like "his commute was long") or delete.

**Core principle**: **a summary is research reference, not writing material. Every concrete detail must be checked back against the original.**

---

## 7. Duplicate-article detection (do before research)

**Before starting research, confirm whether an article on this topic already exists.**

```bash
# search existing related articles
grep -rl "keyword" knowledge/ | head -10

# see what articles are in the same subcategory
ls knowledge/[Category]/

# search frontmatter tags
grep -rl "tags:.*keyword" knowledge/ | head -10
```

**If you find overlap:**

| Situation                 | Action                                                                         |
| ------------------------- | ------------------------------------------------------------------------------ |
| Exactly the same topic    | don't create a new article; rewrite the existing one                           |
| 50%+ topic overlap        | merge into one (evolution mode), delete the duplicate                          |
| <30% topic overlap        | can stay separate, but wikilink to each other; no duplicated content           |
| General→specific relation | general article overviews + wikilink to the specific article for the deep dive |

**⚠️ Inherited lesson (Taiwan.md, 2026-03-29)**: three articles on overlapping music-scene topics shared 60%+ content and were eventually merged into two. Detecting before research avoids this waste entirely.

---

## 8. Material extraction in evolution mode (Stage 0)

> The full evolution-mode process is in REWRITE-PIPELINE.md. Here is only the extraction methodology.

**When you rewrite an existing article, the old article is a material store, not a skeleton.**

### Why not "edit" the old article in place?

An AI that reads a low-quality old article unconsciously mimics its voice, structure, and even its bad habits (list-dumping, plastic phrasing). Using the old article as a skeleton = letting the virus infect the new content. The correct approach: extract **only the facts** from the old article, then rewrite from scratch in a fresh structure.

### What to extract

1. **Fact list**: names, years, numbers, statistics, sourced real-person quotes, valid URLs
2. **Problem markers**: `[LIST-DUMP]` / `[THIN]` / `[STALE]` / `[PLASTIC]` / `[FLAT-END]`
3. **Gap list**: "what's missing from the old article? what does the next round of research need to backfill?"

**⚠️ After extraction, the old article is no longer referenced. Only the fact list enters Step 1.**

---

## Appendix: common AI hallucination types

| Hallucination type          | Example                                  | Verification method                                  |
| --------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| Fabricated revenue figure   | "about $60 million in revenue"           | search "[topic] revenue site:gov"                    |
| Fabricated company/org name | a studio or group that doesn't exist     | Google the name; no results = fake                   |
| Misattributed award         | crediting A's award record to B          | cross-check 2 independent sources                    |
| Invented book/paper         | citing a work that doesn't exist         | verify on Google Scholar or a library catalog        |
| Stale data as current       | citing 2015 data as "currently"          | confirm the statistic's year; flag if >3 years old   |
| Fabricated quote            | "he once said…" with no traceable source | search `"person name" "first few words of the line"` |

---

_current: v1.3 | 2026-06-04_

**Recent milestones** (full changelog → `git log docs/editorial/RESEARCH.md`):

- **v1.3** (2026-06-04 deep-research) — §2 search quotas raised to a thesis standard: local/primary-language 4+→40+ / national-international-academic 2+→20+ / primary 2+→15+ / opposing 5+; research depth 5+ sources→25+; added "if you searched it, write it back to the report §search-log (SSOT)." Canonical numbers in [REWRITE-PIPELINE Step 1.1](../pipelines/REWRITE-PIPELINE.md), checked by `research-report-health.py`.
- **v1.2** (2026-04-14) — §6 red line expanded: scene details can't be derived from a summary (inherited Taiwan.md lesson + EDITORIAL v4.4).
- **v1.1** (2026-04-14) — §6 "the right way to fetch with a summarizing tool" added + §5 +2 common mistakes (inherited Taiwan.md verbatim-quote lesson).
- **v1.0** (early) — split out from EDITORIAL.md v4 research section.

_Companions: EDITORIAL.md (quality) + REWRITE-PIPELINE.md (process) + RESEARCH-TEMPLATE.md (template) + QUALITY-CHECKLIST.md (verification)_
