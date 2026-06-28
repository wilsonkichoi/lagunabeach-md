---
title: 'TERMINOLOGY'
description: 'Terminology standard — write the way locals say it / American-English register / canonical LB place-name forms / hard-gate violations'
type: 'editorial-canonical'
status: 'canonical'
current_version: 'v1.0'
last_updated: 2026-03-30
last_session: 'historical'
plugin_check: 'python3 scripts/tools/article-health.py {file} --check=terminology'
sister_docs:
  - 'EDITORIAL.md'
  - 'TRANSLATION-SYNC.md'
  - 'QUALITY-CHECKLIST.md'
upstream_canonical:
  - 'EDITORIAL.md'
  - '../semiont/MANIFESTO.md'
---

# Terminology standard — LagunaBeach.md should read like someone who knows the place wrote it

> This is not a style affectation; it is the authenticity of lived knowledge.
> What we preserve is how this place is actually named and described by people who live here — not the generic vocabulary an outsider or an AI would reach for.

## Layer 1: presentation rules

LagunaBeach.md articles use American English and the local, canonical name for each place. The rules below are explicit substitutions (Class A = always replace, no judgment of context needed).

### Class A: always replace

| Generic / wrong form          | Canonical LB form           | Type |
| ----------------------------- | --------------------------- | ---- |
| Highway 1 / Route 1           | Pacific Coast Highway (PCH) | A    |
| Sawdust Festival              | Sawdust Art Festival        | A    |
| the Pageant / Masters Pageant | Pageant of the Masters      | A    |
| TOW                           | Top of the World            | A    |
| tidepools / tide-pools        | tide pools                  | A    |
| colour / harbour / favourite  | color / harbor / favorite   | B    |
| towards / amongst / whilst    | toward / among / while      | B    |
| "the island" (of Laguna)      | Laguna Beach / the city     | A    |

**Canonical proper-noun forms** (spell these exactly):

- **Pacific Coast Highway** — spell out on first use, then `PCH` is acceptable. Never "Highway 1" in body prose.
- **The Village** — the established local name for the downtown core; capital-T when used as the proper name.
- **Top of the World** — always the full name. Never abbreviate to "TOW."
- **Sawdust Art Festival**, **Pageant of the Masters**, **Festival of Arts** — full official names; do not shorten.
- **greenbelt / bluebelt** — lowercase as common nouns (Laguna's protected open space and marine reserve), unless naming a specific program.

### Class B: judge by context

| Term               | Note                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| plein air          | Two words as a noun ("painted en plein air"); hyphenate as a compound adjective ("plein-air painting"). |
| downtown           | Fine in lowercase as a general descriptor; use **The Village** when naming the specific downtown core.  |
| artist colony      | Accurate historically; avoid as a present-tense cliché unless tied to a real, sourced fact.             |
| OC / Orange County | Spell out "Orange County" on first use; "OC" is acceptable casual shorthand thereafter.                 |

A full term store lives in `data/terminology/` (YAML, inherited from upstream and Taiwan-oriented; the LB term set is being grown incrementally).

---

# LagunaBeach.md naming-correction baseline

> Laguna Beach is a specific place. Article language should name it confidently — neither dissolving it into a generic "Southern California beach town" nor over-decorating it.

---

## ✅ Correct (keep)

### Literary register — natural rhetoric

- "the most photographed cove on this stretch of coast" → ✅ literary, natural
- "the city's most fiercely protected stretch of open space" → ✅ rhetorical variation, avoids repeating "Laguna Beach"
- "a town that takes its public art seriously" → ✅ concluding, evocative phrasing
- "the seven miles of coast Laguna has guarded for a century" → ✅ lyrical context

### Geographic context

- "Laguna Beach covers 8.84 square miles" → ✅ geographic fact (`knowledge/History/founding-and-early-history.md`; verify every figure against `knowledge/` before writing it — Rule 12)
- "coastal sage scrub ecosystem" → ✅ scientific term
- "Mediterranean climate" → ✅ climatology

---

## ❌ Needs correction

### Generic substitutes that erase the place

- "this coastal town" / "this seaside community" (standing in for Laguna Beach as a whole) → ❌ use "Laguna Beach" or "the city"
  - e.g. "this coastal town's economy" → "Laguna Beach's economy"
  - but: "the south end of the city" → fine, it names a real part

### Brochure evasion

- "a hidden gem on the California coast" → ❌ see [EDITORIAL.md](EDITORIAL.md) generic-language tells; name the specific thing
- "nestled between the hills and the sea" → ❌ brochure verb; state a concrete fact instead

### Common AI evasion patterns

- Calling Laguna Beach "the region" / "the area" instead of naming it → ❌
- Replacing a specific beach, gallery, or neighborhood with "a local spot" → ❌
- "something for everyone" in place of naming who, specifically → ❌
- Over-correcting every "Laguna Beach" into "this artist enclave" → ❌ over-substitution is its own tell

---

## 🎯 Correction principles

1. **Natural first**: it should read like a person wrote it, not like an AI swapping words.
2. **Literary variation is fine**: rhetorical synonyms for "Laguna Beach" are good, especially in closings and reflective passages.
3. **Name the specific place**: when you mean a beach, a gallery, a trail, name it — don't hide behind "a local spot."
4. **Geographic accuracy**: "The Village" beats "the downtown area" when you mean the specific core; "south Laguna" is fine.
5. **Don't over-correct**: not every "Laguna Beach" needs replacing with a flourish — that is equally unnatural.
6. **Verify every concrete claim**: a figure, a date, a count must trace to `knowledge/` before you write it (Rule 12).

---

## 📝 Proper-noun accuracy and local spelling

### Get the official names exactly right

- Correct: **Pageant of the Masters** — the official name of the living-pictures show.
- Wrong: "Masters Pageant" / "the Pageant of Masters" — non-canonical word order.
- Exception: keep an organization's or work's exact registered name even if it breaks a house rule.

### Local vs. official naming

- Correct: **The Village** — the local name for the downtown core; use it when locals would.
- Correct: **Pacific Coast Highway / PCH** — both the official and the everyday local name.
- Keep: **Heisler Park**, **Main Beach**, **Crystal Cove** — official proper nouns; spell exactly, do not paraphrase.
