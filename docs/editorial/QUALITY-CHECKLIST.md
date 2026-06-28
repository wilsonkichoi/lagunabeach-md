---
title: 'QUALITY-CHECKLIST'
description: 'Article quality-verification checklist — REWRITE-PIPELINE Stage 3 runbook'
type: 'editorial-canonical'
status: 'canonical'
current_version: 'v1.1'
last_updated: 2026-05-09
last_session: 'laughing-goldstine'
plugin_check: 'python3 scripts/tools/article-health.py {file} --profile=rewrite-stage-4'
sister_docs:
  - 'EDITORIAL.md'
  - 'CITATION-GUIDE.md'
  - 'TERMINOLOGY.md'
upstream_canonical:
  - 'EDITORIAL.md'
  - '../pipelines/REWRITE-PIPELINE.md'
  - '../pipelines/REWRITE-PIPELINE.md'
---

# QUALITY-CHECKLIST.md — article quality-verification checklist

> This is the runbook for REWRITE-PIPELINE Stage 3.
> Every article must pass every item on this checklist before commit.
> **Fail = don't commit. Fix, then re-verify.**

---

## 1. Five-finger test (manual, 60 seconds)

Answer each one; don't skip:

| #   | Test                    | Ask yourself                                                   | Pass standard                                        |
| --- | ----------------------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| 🫵  | **Surprise point**      | Where will the reader say "huh, didn't know that"?             | You can point to a specific sentence                 |
| ✌️  | **Two turns**           | How many real turns does the story have?                       | ≥ 2 (not fake "however"/"but" pivots)                |
| 🤟  | **Curation line**       | Is there a sentence that conveys understanding, not just info? | ≥ 1 (a 📝 callout or a breathing line)               |
| 🖐️  | **Read the ending**     | Read the closing aloud — does it resonate?                     | You want to pause 3 seconds after = pass             |
| ✊  | **One-sentence retell** | Can you tell a friend the gist in one sentence?                | You can naturally say "hey, did you know [one line]" |

---

## 2. Structure verification (check each box)

### People and quotes (EDITORIAL v4)

- [ ] The first name that appears is a **specific person** (not an institution, not a concept)
- [ ] At least **2 real-person quotes**, each with an attributed source
- [ ] Quotes have a voice (not official-statement boilerplate)

### Opening (first 3 sentences)

- [ ] The first three sentences carry **concrete facts** (year/number/name — at least 2 kinds)
- [ ] Not a textbook opener like "Laguna Beach is a town that…" or "As … developed, …"
- [ ] The opening fits one of five modes: scene entry / number shock / contrast / question hook / contradictory figures

### Body

- [ ] Every turn has a **causal chain** (who → because of what → leading to what)
- [ ] Challenges/controversy are **woven into the story** (not a tacked-on "however, it also faces challenges" paragraph)
- [ ] **Not an encyclopedia list** (not a linear A→B→C→D pile-up)
- [ ] There's a narrative arc (the reader feels the story "moving forward")

### Ending (last 3-5 lines)

- [ ] No canned phrases: "will continue to shine," "worth looking forward to," "a must-see on your itinerary," "an endless conversation," "still being written"
- [ ] **No "the story is still being written" family** (added 2026-05-09): "and the story goes on," "the story isn't over," "still being written," "to be continued" — this family of soft hand-waving endings is the same anti-pattern as "will continue to shine": the writer can't produce concrete closure and retreats to "story-as-meta-narrative" cliché. Rewrite strategy: replace the abstract "story" with a concrete event (the most recent show / the latest work / this week), or cut the section and end on the last useful fact.
- [ ] The ending fits one of five modes: resonance / reversal / time jump / question / gray area
- [ ] Read alone, the ending is interesting even to someone who didn't read the whole article

### Rich text

- [ ] At least **2 📝 callouts** (curatorial point of view)
- [ ] At least **1 stat block or pull quote**
- [ ] At least **2-3 wikilinks** (internal `[[]]` links)

### Frontmatter completeness

- [ ] `subcategory` is filled in and matches that category's subcategory table in `docs/taxonomy/SUBCATEGORY.md`
- [ ] Cross-topic articles share a unified tag (e.g. fire-related → `wildfire`)
- [ ] `featured: true/false` is set

### Source citation (Footnote-First, added v2.9)

- [ ] **5+ footnote definitions** (`[^n]: [source](URL) — full description`) at the bottom of the article
- [ ] **Footnote-format standard**: link + dash + 20-30-word description (publication background, content, historical value)
- [ ] **No bare links**: `[^1]: [URL]` or `[^1]: URL` is not acceptable
- [ ] **No "ibid."**: when citing the same source again, still write a full description (shorter is fine, blank is not)
- [ ] Contains at least **2 primary sources** (government / academic / official report)
- [ ] Contains at least **1 recognized-authority source** (museum, historical society, peer-reviewed work)
- [ ] **Citation density**: ≥ 1 `[^n]` per 300 words (an A-tier 150-line article ≈ at least 5)
- [ ] Every `[^n]` reference has a matching definition (verify with `grep`)
- [ ] Data and quotes in the body are each followed by a footnote
- [ ] **The `## References` heading exists**, after Further reading and before the footnote definitions

**Footnote-format example:**

```markdown
[^1]: [City of Laguna Beach — 1993 Laguna Fire after-action report](URL) — official municipal report (1994); documents the 16,000 acres burned, 441 homes destroyed, and the evacuation that produced zero fatalities.
```

**Non-acceptable examples:**

| Not acceptable           | Fix                                                                                                                                                                        |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[^1]: [Wikipedia](URL)` | `[^1]: [Wikipedia: 1993 Laguna Beach fire](URL) — overview of the firestorm's timeline, the 16,000 acres burned, and the $528 million in damages, with sourced citations.` |
| `[^2]: ibid.`            | `[^2]: [same source](URL) — covers the 441 homes destroyed and 270 damaged, and the city's post-fire building-code changes.`                                               |

### Length

- [ ] A-tier article: 120-200 lines
- [ ] B-tier article: 80-120 lines
- [ ] C-tier article: 40-80 lines

### Terminology standard (TERMINOLOGY.md)

- [ ] Class A terms use the canonical LB form (Highway 1 → Pacific Coast Highway, Sawdust Festival → Sawdust Art Festival, TOW → Top of the World…)
- [ ] Class B terms judged by context (American-English register; spell out then abbreviate)
- [ ] Full standard in [TERMINOLOGY.md](./TERMINOLOGY.md)

---

## 3. Plastic-language scan (manual, 90 seconds)

1. **Read only the second half** (start at the 60% mark)
2. For each sentence ask: "if I cut this, what information does the article lose?"
3. If the answer is "nothing" → it's a plastic sentence → **replace it with a fact or delete it**
4. Watch especially for the five species of plastic (see EDITORIAL.md):
   - 🔴 Empty modifiers ("profound impact," "important role," "indispensable")
   - 🔴 "Not just, but more" constructions ("not just X, it's Y," "from X to Y, from A to B")
   - 🔴 All-purpose endings ("will continue to shine," "worth looking forward to")
   - 🔴 Causal leaps ("business then took off," "gradually grew")
   - 🔴 Official-statement quotes ("we will continue to promote…")

---

## 4. Automated verification (must run)

```bash
# 0. SSOT sync (⚠️ required! edit knowledge/ only, sync to src/content/)
bash scripts/core/sync.sh

# 1. Hollow-score check (HARD = 0, WARN ≤ 3)
python3 scripts/tools/article-health.py knowledge/<Cat>/<file>.md --check=prose-health --output=json 2>&1 | \
  python3 -c "import json,sys; d=json.load(sys.stdin); \
  v=d.get('violations',[]); h=sum(1 for x in v if x['severity']=='HARD'); w=sum(1 for x in v if x['severity']=='WARN'); \
  print(f'HARD: {h} / WARN: {w}')"

# 2. Build verification (must not break)
npx astro build 2>&1 | tail -3
```

| Result                | Action                             |
| --------------------- | ---------------------------------- |
| hollow ≤ 3 + build OK | ✅ proceed to commit               |
| hollow > 3            | ❌ go fix plastic sentences, rerun |
| build fails           | ❌ fix frontmatter/syntax, rerun   |

---

## 5. Commit + Push

Run only after everything above passes:

```bash
git add -A
git commit -m "rewrite: [article name] — EDITORIAL v4 + Pipeline v2.11"
git push
```

---

## 6. Format verification (Stage 4: FORMAT CHECK)

After commit, check that the structure matches the template (Stage 3 checks quality, Stage 4 checks format):

- [ ] Frontmatter fields complete (title/description/date/category/tags/subcategory/author/featured/lastVerified/lastHumanReview)
- [ ] 30-second overview exists (blockquote, `> **30-second overview:**`)
- [ ] Body subheadings are not questions
- [ ] **Further reading** block exists:
  - [ ] Standard Markdown link format (not `[[wikilink]]`)
  - [ ] Each item has a sentence or two of description
  - [ ] 3-5 items
- [ ] `## References` heading exists, before the footnote definitions
- [ ] Footnote format: `[^n]: [source name](URL) — full description`
- [ ] No leftover old format (no `- [source](URL)` bullet list under `## References`)

---

## 7. Cross-link (Stage 5: CROSS-LINK)

After format passes, build bidirectional Further reading:

- [ ] Every article this one's Further reading points to actually exists (`ls knowledge/{Category}/{article}.md`)
- [ ] Reverse check: the related articles' Further reading links back to this one
- [ ] If not → add a link to this article (with description) in the related article's Further reading block
- [ ] If the related article has no Further reading block → add one before `## References`
- [ ] Commit every modified article (`cross-link: build bidirectional Further reading for "{article}"`)
- [ ] Touch only the Further reading block; don't edit other content while you're in there

---

## Quick version (for the practiced)

```
□ Five-finger test (surprise/turns/curation/ending/one-sentence)
□ First name is a person? 2 quotes? causal chain?
□ Opening has facts? ending isn't canned?
□ 2 callouts + 1 stat/quote + 2 wikilinks + 5 URLs?
□ Plastic scan of the second half?
□ subcategory correct? cross-topic tag added?
□ hollow ≤ 3? build OK?
→ commit
□ Format template passes item by item? (30-sec overview / Further reading / ## References / footnote format)
□ Bidirectional Further reading built? (do related articles link back?)
→ done
```

---

_Version: v1.2 | 2026-04-04_
_v1.1→v1.2: added §6 Format verification (Stage 4) + §7 Cross-link (Stage 5); restored the `## References` heading_
_Companions: RESEARCH.md (research methodology) + REWRITE-PIPELINE.md (process) + EDITORIAL.md (quality standard) + RESEARCH-TEMPLATE.md (research template)_
