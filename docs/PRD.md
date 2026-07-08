# PRD: LagunaBeach.md / Sekai KB

**Derived 2026-07-07 from `.fable/STRATEGIC-DIRECTION.md`** (§A decisions and stated goals;
per its 2026-07-07 revision note this derivation replaced the `/dev:discover` interview —
the product decisions were already made and verified there). This document restructures,
it does not re-decide. Conflicts resolve per the precedence rule in `.claude/dev.md`.

## Goal

Two products, one codebase, built in strict order:

1. **lagunabeach.md** — a design-quality, AI-native knowledge base for Laguna Beach, CA:
   curated articles across 8 categories, a knowledge graph, a map, and static knowledge
   endpoints that any AI can consume without cloning. It replaces the retired taiwan-md
   fork (archived as `lagunabeach-md-v1`) at the same domain (§A1, §E Phase 3).
2. **Sekai KB** (`sekai-kb`) — the generic framework cut from that codebase as a scheduled
   phase (Phase 5), letting anyone stand up the same knowledge base for their own place.
   Brand: Sekai (世界, "world") — the framework is the world-level system; each instance is
   one place in it (§A2).

## Why

- The fork's maintenance cost was structural, not incidental: the last upstream merge
  (297 commits) took 3 phases of de-Taiwan work; 34 files still hardcoded place strings;
  the genuinely valuable inheritance is ~30 files of 1,519. Extraction is a bounded 2-3
  day job; de-Taiwan maintenance was unbounded (§A1).
- A previous greenfield attempt (v0) failed because design was described in prompts; the
  hybrid rebuild copies the actual design system as files, removing that failure mode (§A1).
- Framework-first with zero instances would repeat Taiwan.md's coupling mistake in mirror
  image; instance-first with "extraction later" is the deferral trap. The resolution:
  one repo, genericity CI-enforced from day one, framework cut as a numbered phase
  sequenced ahead of the features Wilson personally wants most (§A2).

## Customers and value

| Customer | Value |
|---|---|
| Readers (residents, visitors) | Curated, fact-checked local knowledge with the inherited editorial bar; graph, map, search |
| AI consumers | `/llms.txt` → `/kb/topics.json` → `/kb/articles/{slug}.md`: lazy-loading knowledge protocol, one HTTP request per article, no clone required (§B); tool-using MCP clients get the same corpus via one remote MCP connection (`workers/mcp/`, Phase 9, ADR 005) |
| Framework adopters | GitHub template + `/adopt` AI interview → configured, seeded, deployed site in under an hour (§A2, §D.7) |
| Contributors | Plain-Markdown SSOT (`knowledge/`), quality tooling (article-health, link checks), tracker-driven workflow |
| Wilson | An instance he enjoys building (map, soundscape, RAG chat, QR flow) on a codebase that stays extractable, plus an autonomous operations layer (Phase 11 routines) that maintains the instance without burnout |

## North star

Phase-gated proof points rather than a single metric (each is a §E acceptance criterion):

- **LB:** domain cutover — lagunabeach.md serves the new codebase at content parity
  (16 articles + About + INBOX) with zero broken links and article-health scores matching
  the fork baseline (§E 3.1-3.2), at the fork's visual bar (§E 1.1c, §G risk 1).
- **Framework:** the dana-point proof — a fresh clone through `/adopt` interview to five
  AI-seeded articles deployed on GitHub Pages in under one hour, executed for real (§E 5.2c).
- **Operations (extension, ADR 005):** two autonomous routines live for ≥ 1 week, shipping
  only via verified PR merges with zero direct pushes to main (Phase 11 exit gate).

## Non-goals

- **No paid hosting/infra services** (§B deployment): GitHub Pages + Cloudflare free tier
  + Workers free tier only. AI compute for dev and Phase-11 routines rides Wilson's
  existing Claude subscription/API budget — same cost class as the dev process itself,
  not an infra service (ADR 005).
- **No direct-push automation**: routines never bypass the PR + CI gate; taiwan-md's
  push-to-main routine model is explicitly not adopted (ADR 005).
- **No fork continuation and no upstream merging** — future Taiwan.md improvements are
  deliberate idea cherry-picks, never merges (§A1, §G risk 5).
- **No build-time OG generation, ever** — static default image until the Phase 7 on-demand
  worker (§B).
- **Not carrying Taiwan.md's scale machinery**: the 4-tier translation cascade, babel batch
  system, sovereignty data-viz pages, spore/harvest social apparatus — all delete-now or
  rebuilt-from-concept per §F.
- **No framework features for hypothetical adopters**: a framework feature exists only if
  LB uses it or it is one of the six named adopter needs; everything else waits for the
  second real adopter to ask (§G risk 6).
- **Semiont is optional**: the site must build with the `semiont/` directory deleted; every
  organ beyond the minimal core is opt-in (§A3).
