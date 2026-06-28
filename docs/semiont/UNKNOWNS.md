---
title: 'UNKNOWNS (LagunaBeach.md)'
description: 'Known unknowns for LagunaBeach.md — suspicions not yet verified, kept honest rather than padded'
type: 'cognitive-state'
status: 'canonical'
apoptosis: 'candidate'
current_version: 'v1.0'
last_updated: 2026-06-22
last_session: 'semiont-en-grounding'
source: 'Re-grounded from UNKNOWNS.md (v1.1, Chinese, Taiwan.md upstream)'
sister_docs:
  - 'MANIFESTO.md'
  - 'CONSCIOUSNESS.md'
---

# UNKNOWNS — Known Unknowns

> MEMORY (not yet built for this fork) would record what's known. DIARY (also not yet built) would record what's been thought about. **UNKNOWNS records what's suspected but not yet checked.**

The Chinese [UNKNOWNS.md](https://github.com/frank890417/taiwan-md/blob/main/docs/semiont/UNKNOWNS.md) in the upstream Taiwan.md repo holds its own list — dozens of specific, dated suspicions accumulated across months of audits on 500+ articles. This fork has 19 articles and three days of history; a long list here would mean inventing suspicions to look thorough. This file holds only what's genuinely true to suspect right now.

---

## Why this organ exists

The lesson upstream learned the hard way: errors that nobody is actively suspecting only surface when a reader stumbles into them. Keeping an explicit "I doubt this but haven't checked" list means at least one person (or session) is looking on purpose, instead of waiting to get burned.

---

## 🔴 High suspicion (worth checking soon)

| Suspicion                                                                                                                                  | How to check                                                                                | Opened     |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ---------- |
| Citation density on the 19 articles hasn't been swept with `article-health.py` as a batch — only checked ad hoc per article during writing | Run the tool's citation-density check across all of `knowledge/` in one pass                | 2026-06-22 |
| zh-TW translations may have been generated faster than they were verified for accuracy, not just fluency                                   | Have a native zh-TW reader (not the founder) spot-check a sample against the English source | 2026-06-22 |

## 🟡 Medium suspicion (worth exploring, not urgent)

| Suspicion                                                                                                                                                                                                                                                                                                   | Clue                                                                                                                          | Opened     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------- |
| The 8-category split (History, Art & Galleries, Nature & Marine Life, Food, Beaches, Trails, Events & Festivals, Neighborhoods) may not match how an actual visitor would browse the site — it was inherited from upstream's category-mapping pattern, not derived from Laguna Beach-specific user research | No traffic data yet to confirm or deny                                                                                        | 2026-06-22 |
| The feedback widget (newly wired to English defaults, GitHub Issues now enabled) hasn't received a single real reader submission yet — unclear if the flow actually works end-to-end for a non-technical visitor                                                                                            | Watch for the first real issue filed through it; if none arrives after meaningful traffic, the flow itself may be the problem | 2026-06-22 |

## 🟢 Light suspicion (background thought)

| Suspicion                                                                                                                                                                 | Opened     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Whether English-first, zh-TW-second is the right language priority for this specific audience, versus Spanish — a real decision, not yet made on data                     | 2026-06-22 |
| Whether the "friend showing you around" editorial voice (per `EDITORIAL.md`) actually reads as authoritative to a first-time visitor, or as too casual to trust for facts | 2026-06-22 |

---

## How to use this

When a suspicion is checked, don't delete the row — strike it through and note the resolution, keeping the evidence trail upstream's own version preserves. When a new suspicion arises during any session, it belongs here immediately, not "remembered for later" — that's exactly how upstream's own broken-wikilink incident happened.

---

_v1.0 | 2026-06-22 — New file. Intentionally short: padding this list to resemble upstream's depth would mean inventing problems instead of reporting real ones. Grow it honestly, one genuine suspicion at a time._
