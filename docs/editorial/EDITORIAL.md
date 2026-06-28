---
title: 'EDITORIAL (English)'
description: 'How to turn research into a compelling Laguna Beach article'
type: 'editorial-canonical'
status: 'canonical'
current_version: 'v2.0'
last_updated: 2026-06-21
last_session: 'editorial-en-localization'
plugin_check: 'python3 scripts/tools/article-health.py {file} --profile=rewrite-stage-4'
sister_docs:
  - 'TERMINOLOGY.md'
  - 'CITATION-GUIDE.md'
  - 'RESEARCH.md'
  - 'QUALITY-CHECKLIST.md'
  - 'RATIONALE-SPEC.md'
---

# EDITORIAL — How to Turn Research Into a Laguna Beach Article With Some Warmth In It

> After reading this, the next time you sit down with raw material about Laguna Beach you should
> naturally ask: what's the one thing here a local would tell a friend? What's the concrete object
> or number a reader will remember? Is every quote and figure traceable to a real source? Does the
> opening earn the second sentence?
>
> The mechanical stuff — frontmatter shape, footnote format, word count, SEO length, wikilink
> syntax — is enforced by `scripts/tools/article-health.py`. Run it after writing:
>
> ```bash
> python3 scripts/tools/article-health.py knowledge/{Category}/{slug}.md --profile=rewrite-stage-4
> ```
>
> This document is for what the plugin can't catch: **craft, voice, judgment, warmth**.

This is a re-grounded adaptation, not a line-by-line port. The upstream [`docs/editorial/EDITORIAL.md`](https://github.com/frank890417/taiwan-md/blob/main/docs/editorial/EDITORIAL.md) is Taiwan.md's canon — written in Chinese, for long-form journalism about Taiwan, and lives in the upstream Taiwan.md repo. The philosophical core (specificity discipline, scene-over-summary, anti-AI-slop rules, ending discipline) transfers. The depth assumptions, the footnote-heavy citation model, and the colon-sandwich titling convention do not — they were built for 1,000+ word journalism, and this fork's 18 articles run 277-773 words as a short locals-guide format. Where this document disagrees with the upstream canon's numbers, it's because the corpus is different, not because the upstream canon was wrong for Taiwan.md.

---

## 1. What LagunaBeach.md Is

LagunaBeach.md is a curated guide, not an encyclopedia and not a brochure.

We don't aim for comprehensive coverage. We aim for every article to leave the reader knowing one thing they didn't know — a fact, a parking trick, a piece of history that explains why the town looks the way it does. A good article is one you'd actually repeat to a friend before they visit: "Did you know the tower at Victoria Beach was a private staircase built in 1926, and you still can't go inside it?"

Wikipedia answers "What is Victoria Beach?" A travel blog answers "Top 10 Things to Do at Victoria Beach!" LagunaBeach.md answers **"Why the tower's worth knowing about before you stand in front of it."**

### Three Rules

1. **A reason to know this, not just a fact sheet.** Years, addresses, and hours are the skeleton. The one fact or angle that makes a reader care is the flesh.
2. **Every fact is checkable.** A claim with no source behind it is worse than no claim — list `source:` URLs in frontmatter; for a specific number or quote that needs sentence-level attribution, use a footnote.
3. **Specific, not generic.** "Famous for its 60-foot stone tower built in 1926" beats "a beautiful and popular spot." If a sentence would be equally true of any beach town on the California coast, it doesn't belong in a Laguna Beach article.

### Length: Match the Topic, Don't Pad or Compress

Not every topic needs the same depth. The corpus today runs 277-773 words; `word-count` gates a 250-word floor as a stub-catcher, not a target. Three rough bands, calibrated to what's actually here:

| Band           | Words   | Sources | Fits                                                                          |
| -------------- | ------- | ------- | ----------------------------------------------------------------------------- |
| **Quick Take** | 250-400 | 1-2     | A single beach, trail, or business with one clear angle                       |
| **Standard**   | 400-600 | 2-3     | Most articles — an institution, a neighborhood, a recurring event             |
| **Deep Dive**  | 600-900 | 3-5+    | Contested or layered topics: the 1993 firestorm, the founding/greenbelt fight |

Judgment call: if the topic needs origin + turning point + present-day state + an honest complication to make sense, it's Standard or Deep Dive. If two sections cover it completely, it's a Quick Take and padding it to hit a higher band produces filler, not depth.

---

## 2. Five Things to Find Before You Write

Sit with the research first. If you can't find these, you don't have an article yet — you have a fact sheet.

### 1. The Angle (a small tension, not a thesis)

One sentence. Not "the city has a complicated relationship with development" — that's a thesis a planning commission would write. A _tension_ is concrete: this exists, but that's also true, and the gap is interesting.

| Found it                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------- |
| The most photographed structure on the coastline, and you've never been allowed inside it                            |
| A 7,000-acre greenbelt that exists because residents voted to _not_ build on land they could have sold for a fortune |
| Zero deaths in a fire that destroyed 441 homes in a single afternoon                                                 |

No angle = the article is still a Wikipedia stub waiting to happen. Either the research isn't deep enough yet, or the topic genuinely is a two-sentence Quick Take and that's fine.

### 2. The Object

One concrete thing a reader could touch or photograph. Specification sheets don't stick in memory; objects do.

Examples already in the corpus: the La Tour staircase tower at Victoria Beach. The charred foundation stones still standing on an unrebuilt Emerald Bay lot. The 307 Cliff Drive Mission Revival building that's housed an art museum since 1929.

### 3. The Quote (when one genuinely exists)

Not mandatory for every article — a beach or a trail often has no one's words to quote, and that's fine. But History and Events & Festivals entries with named figures (a city council vote, a founding charter, a newspaper account of the fire) often _do_ have one, and it's worth digging for. A quote in quotation marks is a promise that these are the speaker's exact words, traceable to a source you can cite. Never paraphrase something and then put it in quotes.

### 4. The Scene

Turn an abstract fact into a person/moment/place/action. "The fire started in the morning and spread fast" is abstract. "The fire started around 11:30 AM in the wildland above Laguna Canyon; by evening, entire streets in Emerald Bay were gone" — already in the firestorm article — is a scene.

### 5. The Detail — this is where the warmth lives

The thing that isn't in a spec sheet but proves someone actually checked: that Victoria Beach's two public staircases are both on residential streets with no lot and no meters, so you should arrive early; that the tide pools south of the tower are only accessible at low tide; that the Sawdust Festival's lot is shaded by eucalyptus because the festival started as the artists who didn't get juried into the more formal show across the road. These details are the difference between a guide written by someone who's been there and one assembled from a press kit.

**All five found → write. One missing → go back to the source, don't fabricate it to fill the gap.**

---

## 3. The Opening: Earn the Second Sentence

**Banned**: opening with a vague claim that could describe any beach town — "Laguna Beach is known for its stunning coastline and vibrant arts scene." The first sentence has to contain a specific, checkable anchor: a year, a measurement, a proper noun, a number.

This does **not** mean banning "X is a Y" as a sentence shape — the existing corpus opens that way constantly, and it works because the very next clause carries a real anchor:

```
✅ "Victoria Beach is a narrow, rocky beach in South Laguna, famous for its La Tour
tower (commonly called the 'Pirate Tower'), a 60-foot stone staircase tower built
in 1926."
   — "X is a Y" shape, but the sentence is doing real work: name, nickname, height, year.

❌ "Victoria Beach is one of Laguna Beach's most picturesque and beloved coastal spots."
   — Same shape, zero anchors. Could be any beach in California.
```

The test isn't the grammar of the first sentence. It's whether a fact-checker could verify anything in it.

### Five Opening Patterns

| Pattern               | Example                                                                                                         | Fits                                      |
| --------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **Identify + anchor** | "Victoria Beach is a narrow, rocky beach... famous for its 60-foot tower built in 1926."                        | Most place/business entries (default)     |
| **Number shock**      | "441 homes destroyed in a matter of hours, and no one died."                                                    | Disasters, statistics-driven topics       |
| **Contrast**          | "A town that fought for decades to keep land undeveloped, on some of the most valuable coastline in the state." | Founding/greenbelt/policy topics          |
| **Scene**             | "On October 27, 1993, a wildfire driven by Santa Ana winds burned through Laguna Beach in a matter of hours."   | History, events with a clear start moment |
| **Object first**      | "The La Tour tower has stood on Victoria Beach since 1926, and no one but the owners has ever been inside."     | Landmarks, single-object features         |

---

## 4. Structure

### 4.1 The Opening Paragraph + At a Glance

Every article opens with a short prose paragraph (identify the subject, plant the anchor fact). Immediately after it, before the first `##` heading, add an **At a Glance** blockquote:

```markdown
> **At a glance:** One or two plain sentences — the single fact or tip you'd
> actually tell a friend before they go. Not a restatement of the opening
> paragraph, not a teaser, not a sales pitch.
```

`format-structure` checks for this on every article (WARN, soft-launch). On a 300-word Quick Take, the opening paragraph already does most of the "what is this" work — so the blockquote's job there is narrower: surface the one practical or surprising thing (a hidden access point, a seasonal closure, a number worth knowing) rather than re-summarizing what the reader just read. On a Standard or Deep Dive article, it can carry slightly more — the angle from §2.1 in a sentence.

```
✅ Victoria Beach: "> **At a glance:** Both public staircases are on
   residential streets with no parking lot — arrive early on summer
   weekends or plan to walk in from farther away."
   (Tells the reader something the opening paragraph didn't.)

❌ "> **At a glance:** Victoria Beach is a beach in South Laguna with a
   tower."
   (Just restates the title and the first sentence. Delete.)
```

### 4.2 Body Sections

Adapt to the topic; this isn't a fill-in-the-blank template. Common shapes already in use across the corpus:

- **Place/landmark**: identify → the one distinguishing feature, in depth → practical access details → (optional) ecology/context
- **Institution**: identify → collection/program → history → practical information
- **Event**: identify → history/origin → what the experience is actually like → season/schedule → practical information
- **History/disaster**: identify with the anchor fact → timeline of what happened → impact (numbers) → aftermath/legacy

### 4.3 Subheadings: No Date-Led Timeline Headers

The one hard rule the `chronicle-lead` plugin enforces: an H2 must never lead with a literal date — no `## May 2016`, no `## 2020: The Renovation`, no `## 2020.5.6`. That pattern turns the section into a Wikipedia timeline entry instead of a piece of the story.

Plain functional labels are fine at this format's scale and the corpus already uses them well: `## History`, `## Access`, `## Tide Pools`, `## Practical Information`, `## Aftermath`, `## Wildlife`. Taiwan.md's long-form canon bans these as too generic for a 1,500-word feature; at 300-700 words, a reader scanning the table of contents benefits more from knowing exactly what's in each section than from a clever hook on every header. Where a more specific or evocative header is genuinely available without straining for it — `## The Greenbelt Connection`, `## The Pirate Tower` — use it. Don't force one onto a section that's plainly just "the hours and the parking situation."

Year ranges (`## 1949-1993`) and decade references (`## The 1990s`) are allowed; they're describing historical scope, not chronicling an event-by-event timeline.

### 4.4 Practical Information

Most place and business entries end with a `## Practical Information` section — address, hours, parking, price range, what to bring. This is a legitimate, expected closing block for this format, not a cop-out. It does the job a brochure's footer does, and readers scanning on a phone before they leave the house want it predictably at the end.

### 4.5 Further Reading

For Standard and Deep Dive articles (roughly >1500 characters of body text — `format-structure`'s threshold), add a closing section:

```markdown
## Further Reading

- [[founding-and-early-history|Founding and Early History]]
- [[the-1993-firestorm|The 1993 Firestorm]]
```

This is different from an inline wikilink. An inline link (`[[thousand-steps-beach|Thousand Steps Beach]]`) belongs at the exact sentence where the cross-reference is relevant — that convention is already established across the corpus and should continue. Further Reading is a separate, curated "if this interested you, read these 2-4 articles next" list, useful for site navigation and the knowledge graph. Quick Takes can skip it if there's genuinely nothing closely related yet.

### 4.6 Citations: `source:` List First, Footnotes for Precision

The default citation mechanism for this fork is the frontmatter `source:` list — a flat list of the URLs that informed the article. This is sufficient for the large majority of entries (a city's own tourism page, a museum's own site, a Wikipedia article used as a factual backbone).

Reach for an inline footnote (`[^1]` … `## References`) only when a _specific sentence-level claim_ needs precise attribution — an exact casualty count, a verbatim quote, a contested figure someone might reasonably ask "says who?" about. When you do use a footnote, you must add a `## References` H2 at the end listing the definitions (`format-structure` flags footnote use without a References H2 as HARD — Astro won't render orphaned footnote markup correctly).

```markdown
The fire destroyed 441 homes and damaged 270 others[^1].

## References

[^1]: [LA Times archive, October 28, 1993](https://www.latimes.com/...)
```

If no footnotes are used, no `## References` H2 is needed — the frontmatter `source:` list already does that job.

### 4.7 Quote Fidelity

Anything inside quotation marks must be a real person's, organization's, or document's exact words, and it must be traceable to something in `source:` or a footnote. If you found a fact described in a secondary source's own words and want to use the phrasing, attribute it as reported speech without quotation marks, or find the primary statement. Never invent a "local saying" or a plausible-sounding remark to make a paragraph feel more alive — an unverifiable quote is worse than no quote.

### 4.8 Rationale Block (History: required; everywhere else: advisory)

Laguna Beach's History category covers contested ground — land taken from the Acjachemen and Tongva, development fights, the politics behind the greenbelt votes, who benefited and who didn't from the 1993 rebuild. For History articles, add a frontmatter `rationale` block with four keys (schema: [RATIONALE-SPEC.md](RATIONALE-SPEC.md)):

```yaml
rationale:
  why_this_hook: 'Brief note on why this is the angle, not some other one.'
  whats_excluded: 'What you deliberately left out and why.'
  where_it_hedges: 'Where the record is thin or disputed.'
  whos_pushing_back: 'Who would object to this framing, and why.'
```

A one-line answer per key is fine — the plugin checks presence, not depth. For every other category (Beaches, Food, Trails, Art & Galleries, Nature & Marine Life, Events & Festivals, Neighborhoods), the block is advisory: nice to have on anything with a real editorial judgment call buried in it, not required for "here are the hours and the parking situation."

---

## 5. SEO Metadata

Standard English SEO conventions, not Taiwan.md's CJK-character math:

- **Title**: ≤ 60 characters (Google SERP truncates around there). LagunaBeach.md titles are plain identifying names — `Victoria Beach`, `The Cliff Restaurant`, `Laguna Art Museum` — not Taiwan.md's colon-sandwich narrative hooks. The hook belongs in the description, not the title. Keep it that way; a fork-wide switch to hook-titles would be a bigger stylistic change than this localization should make unilaterally.
- **Description**: 50-160 characters. This is the SERP snippet — open with a concrete detail, not "This article covers..." or the site's own name. Don't simply repeat the title.
- One concrete anchor (a year or a number) in the description earns its space better than an adjective.

```
✅ "A secluded beach known for its distinctive 1926 stone tower and rocky tide pool areas."
❌ "Victoria Beach is a beautiful and popular beach in Laguna Beach, California."
```

---

## 6. Voice: A Local Friend, Not a Brochure and Not Wikipedia

Picture explaining the place to a friend who's visiting for the first time and asked a real question — not a tourist who wants to be sold something, not a student who wants a citation. You'd say where to park, when to skip it, and the one thing that makes it worth the trip.

### Wanted

- **Specific over general**: "60-foot stone tower built in 1926" beats "iconic historic landmark."
- **The locals'-knowledge layer**: parking realities, tide timing, seasonal closures, the access point most visitors miss. Victoria Beach's own entry already does this well: _"Both are residential streets with extremely limited parking. No lot, no meters. Arrive very early on summer weekends or walk from farther away."_ That sentence could only be written by someone (or something) that actually checked.
- **Honest about the downside**: parking is bad, the lot fills by 9am, the restaurant is better for the view than the food. A guide that only ever says nice things reads like an ad and loses trust fast.

### Not Wanted: Travel-Brochure Tells

These are the English-language equivalent of Taiwan.md's "plastic phrases" — words that could be glued onto a description of literally any beach town and the sentence would still parse:

| Tell                                                       | Why it's empty                                             | Fix                                              |
| ---------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------ |
| stunning / breathtaking / picturesque / charming / idyllic | Could describe any coastline anywhere                      | Name the specific thing that's actually striking |
| hidden gem / a true gem / best-kept secret                 | If it's in a public guide, it's not hidden                 | Say who actually knows about it and why          |
| nestled / boasts / offers visitors                         | Brochure verbs; nothing is being claimed                   | Use a plain verb and a concrete subject          |
| must-see / must-visit / bucket-list                        | Imperative with no specific reason attached                | State the actual reason it's worth the trip      |
| something for everyone / somewhere for everyone            | Vacuous; true of every place with more than one attraction | Name who, specifically, it's for                 |
| rich history / vibrant arts scene / unparalleled views     | Adjective doing the work a fact should do                  | Replace with the year, the name, the number      |
| Whether you're a local or a first-time visitor, ...        | Stock opener that adds nothing                             | Delete and start with the anchor fact            |

**Three-second test**: cover the sentence and ask if it would still be true with the place's name swapped for any other beach town in California. If yes, it's a tell — cut it or replace it with something specific to this place.

### The "Not Just X, It's Y" Pattern

The same AI fingerprint Taiwan.md flags in Chinese ("不是 X，是 Y") shows up in English travel writing as "isn't just a restaurant, it's an experience" / "more than a museum, it's a journey through California art." In nearly every case, the "X" half is a strawman the reader never assumed, manufactured purely to set up the "Y" half. Delete the setup and state "Y" directly — the sentence loses nothing and gains confidence.

```
❌ "The Cliff Restaurant isn't just a place to eat — it's a destination for the view."
✅ "The food is secondary to the setting for most visitors; this is a destination for the view."
   (Already the phrasing used in the actual article. Direct statement, no strawman.)
```

### Em Dash Discipline

Em dashes are normal, correct English punctuation — unlike Taiwan.md's CJK 「——」 dash, this isn't a borrowed mechanic. But AI-generated English prose reaches for them constantly as a tic, often where a period, semicolon, or parenthetical would read more naturally. If a paragraph has more than two or three, read it back and ask whether each one is doing something a period couldn't.

### Canned Endings

Same instinct as Taiwan.md's "will continue to shine" ban, translated:

- ❌ "Whether you're a local or just visiting, X is a must-see stop on your Laguna Beach itinerary."
- ❌ "X will continue to charm visitors for generations to come."
- ❌ "So next time you're in town, be sure to stop by."
- ❌ A summary of everything the article just said.

For most place/business entries, `## Practical Information` is the legitimate functional close (§4.4) — that's fine, it's doing real work. What's banned is a _prose_ sentence that tries to wrap up with a sales pitch instead of just stopping once the last useful fact has been delivered. The 1993 Firestorm article's actual closing line is a good model: _"A few destroyed lots were never rebuilt and remain empty as informal memorials."_ — a concrete image, no pitch, no summary.

---

## 7. Quality Self-Check (Read It Aloud)

Sixty seconds before you commit:

1. **The one thing**: could you tell a friend, in one sentence, the thing this article taught you?
2. **The anchor test**: pick any paragraph at random — does it contain at least one checkable specific (name, year, number, place)?
3. **The brochure test**: read it aloud. Does any sentence sound like it's trying to sell you something? Cut it.
4. **The swap test**: could the opening or closing sentence be true of a different beach town with the name swapped? If yes, rewrite with something only true here.
5. **The quote test**: is everything in quotation marks traceable to a real source in `source:` or a footnote?

Then run the plugin and fix what it catches:

```bash
python3 scripts/tools/article-health.py knowledge/{Category}/{slug}.md --profile=rewrite-stage-4
```

---

## 8. A Note on Two Uncalibrated Gates

Two checks ported alongside this localization — `paragraph-rhythm` and `media-richness` — carry numeric thresholds (paragraph length bands, image/video density per word count) that were calibrated against Taiwan.md's long-form, richly illustrated corpus. No LagunaBeach.md article today is long or media-rich enough to validate those numbers against this fork's actual content. Treat them as provisional placeholders, not settled doctrine, until there's a long or media-dense LagunaBeach.md article to calibrate against. If a violation from either check looks wrong for a short, sparse, locals-guide-format article, that's a signal to revisit the threshold — not necessarily a signal that the article is broken.

---

## 9. Sister Documents

| Task                                | Pointer                                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| Citation / footnote format          | [CITATION-GUIDE.md](CITATION-GUIDE.md)                                                         |
| Research methodology                | [RESEARCH.md](RESEARCH.md)                                                                     |
| Pre-commit quality checklist        | [QUALITY-CHECKLIST.md](QUALITY-CHECKLIST.md)                                                   |
| Rationale frontmatter schema        | [RATIONALE-SPEC.md](RATIONALE-SPEC.md)                                                         |
| In-language terminology conventions | [TERMINOLOGY.md](TERMINOLOGY.md)                                                               |
| Upstream Taiwan.md canon (Chinese)  | [EDITORIAL.md](https://github.com/frank890417/taiwan-md/blob/main/docs/editorial/EDITORIAL.md) |

---

_v2.0 (2026-06-21) — Full localization pass. Replaces the v1.0 shadow-translation draft (phase-4-shadow-translation, 2026-06-20), which ported the philosophical core (five things to find, opening/ending discipline, anchor-noun density) but kept Taiwan.md's long-form depth assumptions (200-300 line "flagship" grading) and didn't address the structural conventions the article-health plugins already check for (At a Glance, Further Reading, References, rationale block) or the English-specific anti-AI-slop tells (travel-brochure adjectives, "not just X it's Y", em dash overuse). This version recalibrates length bands to the actual 18-article corpus (277-773 words), defines all four structural conventions as canon, keeps titles as plain identifying names rather than adopting Taiwan.md's colon-sandwich hook convention, and flags `paragraph-rhythm` / `media-richness` as uncalibrated placeholders pending a longer, media-richer article to test against._
