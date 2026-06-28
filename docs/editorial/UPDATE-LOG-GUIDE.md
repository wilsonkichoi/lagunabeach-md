---
title: 'UPDATE-LOG-GUIDE'
description: 'How to write an update log — the changelog voice for community releases, without the textbook tone'
type: 'editorial-canonical'
status: 'canonical'
current_version: 'v2.0'
last_updated: 2026-06-28
last_session: 'phase-d-batch3-editorial-deTaiwan'
sister_docs:
  - 'EDITORIAL.md'
  - 'TERMINOLOGY.md'
upstream_canonical:
  - 'EDITORIAL.md'
  - '../pipelines/RELEASE-PIPELINE.md'
---

# UPDATE-LOG-GUIDE.md — How LagunaBeach.md writes update logs

> Before posting any community update, whoever's writing it (human or AI) reads this first.
> The update log is the project's face. Written well, readers become contributors. Written badly, readers scroll past.
>
> Re-grounded for LagunaBeach.md (Phase D). The voice principles port directly from Taiwan.md; the examples are re-pointed at this fork's real situation. This fork doesn't publish to social channels yet (no accounts), so treat the platform notes below as the standard for when it does.

---

## Core belief

**An update log is a development diary, not a changelog.**

What readers want to know is "what are you all doing, and why this way" — not a commit list.
A good update log, read to the end, leaves someone thinking "these people are doing real work; I want in."

---

## Voice calibration

### ✅ Want

- **First-person "we"**: reads like a team diary, not a press release
- **Admit problems**: "honestly, half of these were AI-first-draft quality" beats "we continuously optimize content quality" by 100x
- **Explain the reasoning behind a decision**: not just what you did, but why this way
- **Have rhythm**: open up the big event in paragraphs, dispatch the small ones in a line
- **Concrete numbers**: "501 lines → 134 lines" is more convincing than "significantly trimmed"

### ❌ Don't want

- **Plastic sentence patterns** (same blacklist as EDITORIAL.md):
  - ~~not X, but rather Y~~
  - ~~not only X, but also Y~~
  - ~~continuously optimize~~, ~~significantly improve~~, ~~comprehensively upgrade~~
  - ~~thanks for everyone's support~~ (unless you're actually thanking a specific person)
- **Changelog format**: don't just list commit messages
- **Self-congratulation**: let the facts talk; don't gild yourself
- **Number bombing**: not every number needs to appear; pick the ones with a story

### Self-test

Read it out loud when you're done. If it sounds like:

- a press release → rewrite
- GitHub release notes → add a story
- talking to a friend → ✅ about right

---

## Structure template

Not a hard rule, but this order usually works best:

### 1. Opening: one line setting today's theme

Find the single most important thing today and sum it up in one line.

- ✅ "Today we spent half a day re-grounding the editorial docs from Taiwan to Laguna."
- ❌ "Today's biggest change isn't a new article, but rather a re-grounding of the editorial docs." (plastic pattern)

### 2. Main story: open up the most important 1-2 things

Use 2-3 paragraphs to make it clear: what you did → why this way → how it turned out.
Room for a before/after comparison, concrete numbers, the decision process.

### 3. Other updates: one paragraph, dispatched

Community PRs, technical fixes, new articles — none of these need to be opened up.
Use a "@who did what" format, short and sharp.

### 4. Close: number snapshot + links

Current stars / forks / contributors / article count.
GitHub + site links.

---

## Before/After example

### ❌ Bad (changelog style)

```
📋 LagunaBeach.md update

✅ Added:
- Re-grounded EDITORIAL.md
- 6 editorial methodology docs de-Taiwaned
- contributor-onboarding docs regrounded

🔄 Changed:
- map markers updated
- changelog feed regenerated

📊 18 articles / 8 categories
```

### ✅ Good (dev-diary style)

```
🌊 LagunaBeach.md — Phase D update

Today we didn't add a single new article. We spent the day pulling Taiwan out of
the editorial docs.

This site is a fork of Taiwan.md — a 1,000-star knowledge base — and most of its
quality machinery is exactly what we wanted to keep. But the docs that teach you how
to write a good article were still full of Taipei night markers and semiconductor
fabs. Honestly, we'd been booting off them for weeks and just paving over the Taiwan
examples in our heads each time.

Today we stopped paving. Six methodology docs now reground every example in real
Laguna facts — the 1927 incorporation, the 1933 Pageant of the Masters, the 8.84
square miles ringed by 20,000 acres of greenbelt. The methodology shape is untouched;
only the substance changed.

Other updates: research-notes and rationale specs re-pointed at this fork's own
categories and articles. The translation-sync report now reflects our actual state
(18 English articles, zero translations — translation is dormant until the corpus is
bigger).

📊 18 articles / 8 categories / fork of Taiwan.md
```

**Where's the difference?**

- ❌ version: reads like it's for a machine, no human in it
- ✅ version: has the decision context, the self-criticism, a concrete contrast, real facts

> Note: the snapshot line (stars / forks / contributors) is a template slot. This fork doesn't publicize those counts yet and is mostly solo work, so fill it honestly or leave it off — don't invent numbers to look bigger. The "@who did what" format is for when there are real contributors to name.

---

## Platform notes (for when channels exist)

### Threads / Instagram

- 500-character cap, needs more compression
- The first 2 lines decide the expand rate
- Can be split into multiple posts (1/2, 2/3)

### Facebook

- Can run longer, but the first 3 lines matter most (that's all you see before expanding)
- Tagging specific people increases reach

### Discord

- Upload a .txt file + a one-line summary
- Don't paste a wall of text into the chat

### GitHub Discussions / Release

- Can be the most complete, technical details included
- Link to the specific PRs and commits

---

## Frequency

- **Daily update**: only when there's a story worth telling. No story, no forced post
- **Milestone update**: 100 ⭐, 1000 ⭐, a major feature shipping
- **Community-response update**: someone shipped a good PR, someone found a bug, a media mention

---

_This doc, like EDITORIAL.md, keeps evolving._
_Last updated: 2026-06-28 (re-grounded from Taiwan.md's UPDATE-LOG-GUIDE for LagunaBeach.md, Phase D batch 3)._
