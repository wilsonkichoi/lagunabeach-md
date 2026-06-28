# Maintainer Collaboration Discipline

> _Ten collaboration disciplines distilled from a real batch-retrofit campaign: six core disciplines (F/G/H/I/I-bis/J) on citation quality, content, and process, plus four general collaboration disciplines (A/B/C/D). Useful for any contributor running a batch retrofit, collaborating across experts, or spawning AI agents._
>
> _Provenance: adapted for LagunaBeach.md from Taiwan.md's "batch-200" retrofit (200 legacy articles repaired across priorities P0–P3), originally written up by Taiwan.md's Lv.3 maintainer @Zaious. LagunaBeach.md has not yet run a campaign at that scale; this is methodology inheritance, kept because the workflow logic is universal. Where the original assumed Chinese (CJK) content, it has been re-grounded to LagunaBeach.md's English corpus._

---

## Why this exists

A batch retrofit (systematically repairing many articles at once) hits the same collaboration failure patterns every round. This document turns those lessons into a reusable discipline set so later contributors (including yourself across sessions) don't repeat them.

**When it applies:**

- Batch-retrofit (systematic, multi-article) workflows
- Cross-expert / AI-agent collaboration (verifying after spawning a sub-agent)
- Working across your own sessions (today's you handing off to tomorrow's you)
- Any multi-stage "audit → work order → execute → verify" collaboration

---

## The six core disciplines (citation quality / content / process)

### Discipline F — citation-quality check

**Every `[^N]` footnote definition must contain a real URL.** A `[^N]` without a URL = a phantom citation.

Work-order checklist:

1. Book citation → add a publisher / library / catalog URL. Can't find one = possible hallucination → `[DELETE]`
2. Government publication → add the official URL. Can't find one = possible hallucination → `[DELETE]`
3. Vague source ("various media," "related reports") → `[REPLACE]` with a specific URL or `[DELETE]`
4. Body linkage → every `[^N]` must have an inline marker after the matching claim in the body

**Acceptance test:**

```bash
grep '^\[\^[0-9]' FILE | grep -v 'http\|\.com\|\.org\|\.gov\|\.edu\|\.net' | wc -l
```

→ should be **0**

Corresponding plugin: the `footnote-url` check in `article-health`.

### Discipline G — length conservation

**An article you've touched must not lose more than 5% of its word count versus the baseline.** Lines don't matter (bullet → prose is a legitimate structural change; fewer lines doesn't mean less content).

**Why word count, not lines:** converting bullets to prose collapses lines (10 bullets → 3 paragraphs) but word count usually holds or grows. Lines are a layout metric; word count is the content metric.

**Calibration history:** the original Taiwan.md rule was "CJK chars + lines both ≥ baseline," which proved too strict — the maintainer recalibrated it to "content shrink ≤ 5% / lines ignored." **Setting the standard is itself a design decision; don't pile on metrics as insurance.**

**Acceptance test (English word count):**

```bash
F="knowledge/Trails/top-of-the-world.md"
BASELINE=$(git show <baseline-commit>:"$F" | wc -w)
CURR=$(wc -w < "$F")
shrink_pct=$(python3 -c "print(($BASELINE - $CURR) * 100 / $BASELINE)")
python3 -c "import sys; sys.exit(0 if $shrink_pct <= 5 else 1)" && echo "PASS" || echo "FAIL: ${shrink_pct}% > 5%"
```

Corresponding plugin: the `word-count` check in `article-health`. (Note LagunaBeach.md articles run ~300–700 words, much shorter than Taiwan.md's long-form depth threshold — calibrate baselines accordingly.)

### Discipline H — execution report required

**Every per-article fix log and every batch execution report is mandatory.** The work-order template must include an "execution report required" section.

Each per-article fix log should contain:

- before/after word count + lines
- which factual passages were added (list them)
- the reason for anything not added (if a given article genuinely had no findable source)

The batch execution report (`batch-{N}-EXECUTION-REPORT.md`):

- results of the hard-metric acceptance tests
- nothing ships until acceptance tests pass — the Lead verifies 100% before release

**Lead self-check:** after writing a work order, grep it for `execution report` + `fix log` to confirm the template includes both sections. Missing = bounce the work order and rewrite.

### Discipline I — acceptance tests must be runnable commands

**No** prose-description acceptance tests. They **must** be copy-paste-runnable shell commands + an expected numeric / boolean result.

An acceptance test must include:

1. **An explicit baseline commit** (e.g. `<baseline-commit>`)
2. **An explicit tool path** (e.g. `scripts/tools/article-health.py`)
3. **A complete shell command** that copy-pastes and runs
4. **An expected numeric / boolean result** (no "should be enough" / "reasonable")
5. **A pre-computed baseline table** (so the expert can compare without recomputing)

**Example:**

```bash
F="knowledge/Trails/top-of-the-world.md"
BASELINE=$(git show <baseline-commit>:"$F" | wc -w)
CURR=$(wc -w < "$F")
[ "$CURR" -ge "$BASELINE" ] && echo "PASS" || echo "FAIL: $CURR < $BASELINE"
```

The expert must run this and paste the result into the fix log. The Lead verifies with the same command.

### Discipline I-bis — sanity-check verify results

**When a verify result contradicts expectation, your first reaction is "the command itself may be wrong," not "the data changed."**

Three sanity checks:

1. **Result contradicts expectation → suspect the command first**, not "I miscounted earlier" / "the data changed" self-gaslighting
2. **`2>/dev/null` is a dangerous anti-pattern**: swallowing stderr hides errors and false positives. When verifying, **keep stderr or check the exit code**
3. **Distinguish working tree / main HEAD / branch HEAD**: ship-verify must look at main HEAD, not the working tree

**Standard command template** (replacing the error-swallowing `2>/dev/null`):

```bash
result=$(command "$f")
if [ -z "$result" ] || [ "$result" = "0" ]; then
    echo "Sanity check failed: empty result for $f"
fi
```

Lead self-check: after verifying, **manually cross-check 1–2 results** (e.g. `git show baseline:file` vs working-tree result). If hand math disagrees with the script, the command is wrong.

### Discipline J (candidate) — cross-file wikilink check on merge variants

**After a REWRITE-PIPELINE Merge variant (combining two articles into one)**, you must `grep -r "article title" knowledge` to find and update cross-file wikilinks. Skipping the grep = `[[deleted-title]]` becomes a broken link in other articles and the build CI fails.

**Why candidate, not strict:** once this is hit three times (per the accumulation rule "right rule + wrong input = useless rule"), promote it to a forced check tool in the REWRITE-PIPELINE Merge variant rather than relying on people to remember the grep.

---

## The four general collaboration disciplines (pre-flight / work order / verify / scope)

### Discipline A — pre-flight discipline-sync protocol (before summoning)

**Before summoning another expert / spawning an AI agent:**

1. Write a "this round's key disciplines" list (don't just point them at AGENTS.md to read themselves)
2. The summon instruction must explicitly say: "**Step one is to read AGENTS / the work order / this SOP, then echo back the key disciplines you understood in the first section of your fix log**"
3. Expert echo wrong → Lead recalibrates
4. Echo right → then release

**Why:** upgrading an SOP doc ≠ a fresh session will read it automatically. Every summon must **actively inject** it.

### Discipline B — make the work order executable (acceptance test built in)

**Every audit ❌/⚠️ must have 3 fields:**

```markdown
| #   | original + location        | operation                             | Acceptance Test                                              |
| --- | -------------------------- | ------------------------------------- | ------------------------------------------------------------ |
| 1   | L29 "incorporated in 1926" | [REPLACE] with "incorporated in 1927" | `grep "incorporated in 1926"` should return → **No matches** |
```

**The 3 fields:**

- **original + location**: `L?? "the erroneous original line"` (must have grep-confirmed the line is still there)
- **operation**: `[REPLACE]` / `[DELETE]` / `[ADD]` (one per row, no mixing)
- **acceptance test**: `grep "keyword" should return → ?` (state the expected result)

On delivery the expert must:

- run that grep in the fix log and paste the result
- not running the grep = work not done

**Why:** building verification into the work order means the expert can't skip verify.

### Discipline C — verify protocol (100% iterate, no sampling)

**After the expert delivers, the Lead must:**

1. run the acceptance grep for every audit ❌/⚠️ in the fix log
2. **not sample — 100% iterate**
3. any ❌ still present → bounce immediately, no debate
4. all green = ship candidate

**Forbidden behaviors:**

- "the gate is all green, ship it" (the gate only checks format / citations, not whether audit lines were actually fixed)
- "spot-checked 4–6 articles, looks fine" (sampling fallacy)
- "I assume it got fixed" (must be verified fixed)

**Why:** the Lead is the last line of defense. A lazy Lead = a lazy process.

### Discipline D — make scope explicit (avoid "I thought you only wanted these few")

**The work order must state three things:**

1. **This round's scope**: list exactly which articles + whether to "retroactively apply the new SOP to old articles"
2. **Not this round**: list what's deferred + why
3. **Implicit defaults are forbidden**: don't rely on "not listed = don't do it"

**Failure case:**

- Lead lists "7 articles to re-fix" + introduces a new SOP discipline
- Doesn't explicitly say "the other 32 articles also need retroactive application of the new SOP"
- Expert reasonably infers "Lead didn't tell me to re-check 32 = those 32 are fine"
- Result: 32 articles keep the defect

**Fix:** the work order's three sections are mandatory (scope / not-this-round / retroactive on or off).

---

## Violation checklist (Lead self-check)

**Any one** of these appearing = a violation:

- [ ] Sampling instead of systematic verification
- [ ] Shipping because the gate is green (the gate checks format, not content)
- [ ] Assuming "expert read the SOP = will execute it" (no echo-back confirmation)
- [ ] Work order missing `[REPLACE]`/`[DELETE]`/`[ADD]` operation classification
- [ ] Work order missing grep acceptance tests
- [ ] Work order missing scope / not-this-round / retroactive
- [ ] Acceptance test using vague words like "should be enough" / "reasonable"
- [ ] Using `2>/dev/null` to swallow errors and cause false-positive verify pass
- [ ] Summon instruction lacking a pre-flight echo-back requirement
- [ ] Any "I thought they knew" / "I thought they fixed it" inference

---

## A worked example: layered multi-agent collaboration

The batch-200 workflow wasn't "one person edits 200 articles." It split the 200 across AI agents with different specialties. This layered approach — how AI agents collaborate inside an open-source community — is the reference value for working with other AI-assisted contributors.

### Three AI-agent roles

**Architect (audit lead)** — primarily Claude Opus

- dossier audit / URL liveness checks
- writes work orders (per Discipline B: operation classification + built-in acceptance tests)
- 100%-iterate verify phase (per Discipline C: no sampling)
- SSOT cross-reference (so a wrong-direction audit isn't cascaded and amplified)
- doesn't write prose (not at the project's voice)

**Linguist (prose lead)** — primarily Claude Sonnet

- prose work / editorial polish (per EDITORIAL.md)
- detects forbidden parallel-sentence patterns + consecutive em-dashes (per EDITORIAL)
- converts bullets to prose without losing content (per Discipline G length conservation)
- doesn't do web research (in a sub-agent with limited WebSearch, falls back to self-checklist mode)

**Chief intelligence officer (intel lead)** — primarily Claude Opus + heavy WebSearch

- background verification of high-profile subjects (public figures, scholars)
- audit reverse cross-check — before the Architect writes the work order, verify the audit isn't pointing the wrong way (avoid "should-add vs should-delete" misjudgment)
- assists private-SSOT maintainer sign-off (per [REWRITE-PIPELINE](../pipelines/REWRITE-PIPELINE.md))

### Division-of-labor principles

- **Dossier handoff**: Architect writes the dossier → Linguist writes prose → Architect verifies. Agents interface through the dossier, so **a fact is checked once**, not re-scraped
- **High-profile audit reverse**: audit findings for political/scholarly subjects pass the intel lead's cross-check before entering the dossier, so a wrong-direction audit doesn't misdirect the whole workflow
- **Sub-agent fallback chain**: if a spawned sub-agent fails / hallucinates / has WebSearch denied → fall back to the main session in self-checklist mode (per Discipline I-bis sanity-check)

### Relationship to contributors

Disciplines F–J + A–D are workflow logic, **not tied to a specific platform or AI-agent setup**. Other contributors using Claude / GPT / Cursor / any agent-orchestration platform can apply the same disciplines. The point isn't "which model" but "layered collaboration + verify-not-sampling + acceptance-test-built-in."

---

## Relationship to existing docs

- **REWRITE-PIPELINE** perspective scan — Stage 1 cross-faction opposition scan
- **RATIONALE-SPEC.md** — frontmatter rationale schema
- **EDITORIAL.md** parallel-sentence section — legitimate alternatives to parallel patterns
- **article-health plugin** — Discipline F (footnote-url) / Discipline G (word-count) / Discipline I (acceptance-test work-order format)

---

_— Methodology distilled by Taiwan.md's Lv.3 maintainer @Zaious from the batch-200 retrofit; re-grounded for LagunaBeach.md, 2026-06-28._
