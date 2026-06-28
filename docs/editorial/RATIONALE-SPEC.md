---
title: 'RATIONALE-SPEC'
description: 'article-level rationale metadata spec — 5 frontmatter keys recording the design reasons behind an article (an awareness trigger)'
type: 'editorial-canonical'
status: 'canonical'
current_version: 'v1.2'
last_updated: 2026-06-28
last_session: 'phase-d-batch3-editorial-deTaiwan'
sister_docs:
  - 'EDITORIAL.md'
upstream_canonical:
  - 'EDITORIAL.md'
  - '../pipelines/REWRITE-PIPELINE.md'
---

# RATIONALE-SPEC: article-level rationale metadata spec

> _Re-grounded for LagunaBeach.md (Phase D). Upstream origin: Taiwan.md issue #851 (No2+No3), shipped v1 2026-05-23 by maintainer @Zaious. The mechanism and schema transfer wholesale; the dogfood examples and the forced-category set are re-pointed at this fork's real categories and articles. Where this disagrees with upstream's numbers, it's because the corpus is different, not because upstream was wrong for Taiwan.md._

---

## 1. Why rationale metadata exists

article-level rationale is a block of 5 keys inside an article's frontmatter that records the author's design reasons for writing the piece — why they opened from this hook, which opposing accounts they left out, where the prose hedges, and who would push back.

**Purpose — an awareness trigger, not a due-diligence report**

> We're not interviewing the author (contributor); we shouldn't make writing harder. A one-line answer is fine. What we want is for the author to know they need to think across more dimensions — not to attach a compliance report to every article.

rationale exists to make the author **aware** that they should consider the opposing side, the reasons for exclusion, and the location of hedges — it is not a compliance check. A single-sentence answer is OK. The point is that the four dimensions ran through the author's head at all.

---

## 2. Schema — 5 keys

```yaml
---
title: '...'
# ... existing frontmatter fields ...
lastVerified: 2026-06-19
lastHumanReview: true
rationale:
  why_this_hook: '...' # required
  whats_excluded: '...' # required
  where_it_hedges: '...' # required
  whos_pushing_back: '...' # required
  which_framing: '...' # optional
---
```

### Key definitions

| Key                   | Use                                                                                                                                    | Required     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **why_this_hook**     | Why open from this angle / moment / framing (vs other possible hook alternatives)                                                      | required     |
| **whats_excluded**    | Which opposing accounts were left out + the reason (weak / length / out of scope)                                                      | required     |
| **where_it_hedges**   | Which spots in the prose are hedged (time-bounded / range estimate / observational causation / politically neutralized)                | required     |
| **whos_pushing_back** | A description of the main opposing camp, OR for a multi-perspective article the spots most likely to be misread + the response passage | required     |
| **which_framing**     | The source of the framing (issue-type: an academic framework anchor / person-type: curatorial narrative devices / or leave blank)      | **optional** |

### Value rules

- ✅ Free string — no required format, length, or enum
- ✅ Short fills OK — a one-liner or a short paragraph both accepted
- ✅ The plugin does not check thoroughness, only key presence + non-empty
- ✅ which_framing may be left blank when there's no framework to name
- ❌ Must not be blank / `[TODO]` / placeholder (per plugin rationale-presence WARN)

---

## 3. Short fills are OK — what the two density bands look like

Two writing densities are both legal:

### Light fill (simple article)

A simple beach/place article — for example [`knowledge/Beaches/victoria-beach.md`](../../knowledge/Beaches/victoria-beach.md) — needs only a one-liner per key (~one sentence each). The 60-foot tower has one clear angle; there isn't much to push back on, and `whats_excluded` can honestly say "no major opposing account."

### Thick fill (contested article)

A contested, multi-perspective article — for example [`knowledge/History/the-1993-firestorm.md`](../../knowledge/History/the-1993-firestorm.md), where the development-vs-conservation tension and the fire's role in fire-policy debate cut several ways — warrants thicker keys: where the causation language is observational, which neighborhoods' losses get foregrounded and why, who reads the greenbelt politics differently.

**The contributor picks the density that fits.** Light is OK, thick is OK.

> Note (LB reality, 2026-06-28): none of this fork's 18 articles carry a rationale block yet. That is the expected starting state — see the legacy-retrofit policy in §5. New articles written through REWRITE-PIPELINE can fill it from the start; older articles get it opportunistically.

---

## 4. Stage connections

| Stage / Doc                                                           | Relationship to rationale                                                                                                                            |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| REWRITE-PIPELINE Stage 0.6 angle-forming                              | The result of forming the angle lands, structured, in `why_this_hook`                                                                                |
| REWRITE-PIPELINE Step 1.4.5 perspective scan                          | The perspective-scan result lands in `whats_excluded`                                                                                                |
| EDITORIAL §2 find the contradiction / object / quote / scene / detail | Lands naturally in `why_this_hook`                                                                                                                   |
| EDITORIAL §6 counterpoint-sentence taboo                              | `whats_excluded` gives a legal place for "I considered Y before choosing Z" (the oppositional thinking moves out of the prose and into the metadata) |

---

## 5. Plugin: `rationale-presence`

### Check logic

| Condition                                                 | Severity                                           |
| --------------------------------------------------------- | -------------------------------------------------- |
| frontmatter missing the `rationale:` block                | WARN (forced category) / INFO (suggested category) |
| any of the 4 required keys missing / empty / `[TODO]`     | WARN (forced category) / INFO (suggested category) |
| a key is misspelled (e.g. `why_hook` not `why_this_hook`) | HARD (any category)                                |
| `which_framing` missing OR empty                          | 0 violations (optional key)                        |
| content thoroughness                                      | **not checked** — short fills OK                   |

### Forced vs suggested split

| Determination                                                                                                                       | Strictness                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `category` ∈ {History} (and any future judgment-heavy / contested category)                                                         | **forced** — release-pr profile raises WARN to fail; a new article must fill the 4 keys before ship |
| `category` ∈ others (Art & Galleries / Beaches / Events & Festivals / Food / Nature & Marine Life / Neighborhoods / Trails / About) | **suggested** — INFO does not block ship; dashboard shows coverage                                  |

**Why split** (upstream rationale, per issue #851): retrofitting a whole back-catalogue is too heavy to do at once, but new articles can be strict. Keep the suggested tier loose so the warning doesn't turn into noise the author learns to ignore.

> Re-grounding note: upstream forced the split on {People, History, Society, Politics} — the categories where editorial judgment is most contested in a Taiwan knowledge base. This fork has no People/Society/Politics categories; History is the one category that already carries contested topics (the firestorm, the greenbelt/development fight, the founding-era pro-development vs conservation tension). The set widens automatically as the corpus adds contested categories.

### Legacy article retrofit policy

Older articles without rationale do not block deploy (ci-deploy profile fail_on=hard; rationale-presence WARN does not block). Fill it opportunistically as an article is polished or rewritten.

---

## 6. Relationship to related docs

- **Adding rationale**: go through [REWRITE-PIPELINE Step 1.4.5](../pipelines/REWRITE-PIPELINE.md) perspective scan; the scan result lands in `whats_excluded` and the other keys
- **Counterpoint sentence → rationale**: [EDITORIAL §6](EDITORIAL.md) counterpoint-sentence taboo provides the cross-ref — the "I considered Y before choosing Z" trade-off thinking goes into `whats_excluded`, not into the prose
- **Plugin check**: [scripts/tools/lib/article_health/checks/rationale_presence.py](../../scripts/tools/lib/article_health/checks/rationale_presence.py)

---

_— Upstream origin: Taiwan.md issue #851 No2+No3 ship / v1 2026-05-23 / maintainer @Zaious. Re-grounded for LagunaBeach.md 2026-06-28 (Phase D batch 3)._
