# ROADMAP.md — LagunaBeach.md

> Forward plan now that the fork migration (Phases 0–7 in `MIGRATION.md`) is complete and the site is live at `lagunabeach.md`. This document is the strategic layer; `MIGRATION.md` Phase 8 is the parked-skill backlog that several items here unblock. Reassess after every ~10 new articles or any capability change.

_v1.0 | 2026-06-25 — Initial roadmap. Grounded in the current repo state plus the Taiwan.md architecture research (`../lagunabeach-md-v0/_research/taiwan-md-research.md`, `taiwan-md-llm-wiki.md`), which describes the upstream feature set this fork inherited and can selectively adopt._

---

## 1. Where we are (verified 2026-06-25)

- **Content:** 19 English articles across 8 content categories (History, Art & Galleries, Nature & Marine Life, Food, Beaches, Trails, Events & Festivals, Neighborhoods) plus 3 About pages. `knowledge/` is SSOT; `src/content/` derives via `scripts/core/sync.sh`.
- **Languages:** English-only in practice. `zh-TW` is enabled in `src/config/languages.mjs` but has zero translated articles; the 6 `/zh-TW` dead links in every build come from this empty-but-enabled locale.
- **Live infra:** GitHub Pages, `public/CNAME` = `lagunabeach.md`. Deploy via `.github/workflows/deploy.yml`.
- **Working inherited features:** client-side search (`/explore`, MiniSearch), knowledge graph (`/graph`), map with real LB geocode (`src/data/laguna-beach-geocode.json`), dashboard, changelog, related-articles (tag-overlap, `src/data/related/en.json`), `llms.txt` (already LB-grounded), MCP worker (`workers/mcp`).
- **Build health:** green, gated broken ratio 0.13% < 7.0%, en 0 broken.

### Live-site inheritance leaks found while writing this roadmap (these are bugs, not features)

These survived the Phase 4.5 / Phase 7 sweeps because those sweeps targeted content and dev-only files, not the third-party wiring in `src/layouts/`. They affect the **live** site and should be fixed before any new feature work.

1. **GA4 is leaking to Taiwan.md's property (P0).** `src/layouts/Layout.astro:225,232` hardcodes `G-JGC5W00N7T` — Taiwan.md's Google Analytics 4 property (confirmed against the research doc's analytics table). Every LagunaBeach.md pageview and search event is currently being reported into frank890417's analytics, and LB has no data of its own. `src/scripts/feedback/track.ts` and `src/components/EventTracker.astro` reference the same ID.
2. **justfont premium Traditional-Chinese webfonts still wired site-wide.** `src/styles/global.css`, `shot-mode.css`, `ArticleHero.astro`, `HeadInlineScripts.astro` load and work around paid Taiwan Chinese typefaces (Lang Yang Hei, Rixingsong, etc.), including CDN rate-limit and malformed-woff workarounds for a glyph (`鴞`) that no English article contains. Dead weight on an English site, and a paid dependency.
3. **Protico community-chat widget still injected.** `src/components/ProticoScript.astro:10` points at `https://main.protico.io/api/v1/lagunabeach.md/protico-frame.js`. Taiwan ran this for a 57-contributor community; verify the endpoint even exists for LB and decide whether a solo-maintained local guide needs a community chat bubble at all.

---

## 2. Operating principle

Two rules govern everything below; both come directly from the project's own tenets and the conclusion of the Phase 8 scope discussion.

- **Content before infrastructure.** A 19-article knowledge base's binding constraint is breadth and depth of content, not tooling. Taiwan.md earned its 21 prebuild scripts, 16 cron routines, and analytics organs across 828 articles and real traffic. Cargo-culting that scaffolding onto 19 articles produces dead machinery.
- **Capability before skill.** The parked `lb-*` skills in Phase 8 are downstream of capabilities, not reasons to build them. Build a capability only when the project independently wants it (e.g. analytics because you want to know who reads the site, not "to unblock `lb-evolve`"). The skill port then falls out cheaply afterward.

The corollary: this roadmap sequences **capabilities**, and notes which parked skill each one unblocks as a side effect.

---

## 3. Horizon 0 — Fix the live leaks (do now, days not weeks)

Pure cleanup. No new capability, but the site is misrepresenting itself and leaking data while these stand.

| Item                    | Action                                                                                                                                                 | Unblocks                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| GA4 leak                | Register an LB-owned GA4 property (or a privacy-light alternative, see Horizon 2), swap `G-JGC5W00N7T` everywhere, or strip GA entirely until decided. | Honest analytics; precondition for `lb-analyze`/`lb-evolve`. |
| justfont                | Remove the justfont SDK + CSS workarounds; fall back to the already-loaded Noto/system stack. Drop the paid dependency.                                | Faster loads, simpler `<head>`.                              |
| Protico                 | Verify endpoint; either keep deliberately or remove the widget.                                                                                        | Cleaner page, one fewer third-party.                         |
| Chinese-comment cleanup | The Phase 8 cosmetic batch (~14 `src/` comment citations + Chinese comments in `shot-mode.css` etc.). Clean opportunistically when touching each file. | Closes Phase 8 cosmetic group.                               |

---

## 4. Horizon 1 — Content depth (the real growth axis)

This is where most effort should go. Everything that makes the inherited features (search, map, graph, related-articles) feel alive is a function of article count and interlinking.

- **Grow the corpus.** Use `/lb-news-lens` (scans verified LB outlets → `knowledge/INBOX.md`) and `/lb-peer` (Laguna Art Museum, LBHS, Festival of Arts, Sawdust) to source candidates, then `/lb-write`. Target the thin categories first (Food has 1 article; Beaches/Trails/Neighborhoods have 2 each). A practical near-term milestone: ~40 articles, the threshold at which `/lb-media-audit` and the related-articles graph become statistically useful rather than directional.
- **Interlink aggressively.** The knowledge graph and related-articles quality scale with `[[wikilink]]` density, not article count alone. Every new article should link 2–4 existing ones.
- **Media standard.** Adopt the provisional `/lb-media-audit` standard as articles grow; a beach/art/trails town is inherently visual, and the corpus is currently text-heavy.
- **Decide the zh-TW question.** Either translate a handful of flagship articles (Laguna's Chinese-speaking tourist segment is real) via `/lb-translate`, or disable the `zh-TW` locale in `languages.mjs` to clear the 6 standing dead links. Leaving it enabled-but-empty is the worst of both.

No new infrastructure required for this horizon. It is writing.

---

## 5. Horizon 2 — Reader-facing capabilities that fit a live local guide

Build these only when content depth justifies them. Ordered by value-to-effort for a tourist-facing Laguna Beach guide. The research docs' most LB-relevant ideas live here.

### 5a. Own analytics (cheap, high signal) — unblocks `lb-analyze`, `lb-evolve`

Replace the leaked GA property with either an LB-owned GA4 property or Cloudflare Web Analytics (privacy-friendly, no cookie banner, free, and the site likely already fronts through Cloudflare for the `.md` domain). Once real readership data exists, `lb-analyze`/`lb-evolve` become non-trivial and worth porting from Phase 8. Until then they stay parked.

### 5b. QR → AI chat "Laguna Beach guide" (the differentiated bet)

The strongest LB-specific opportunity in the research (`taiwan-md-research.md` §"QR code → AI chat flow" and §RAG chatbot). A tourist scans a QR at a beach/trailhead, a chat widget opens, and an AI answers using article content and points to the relevant page. Tourists won't have AI subscriptions, so the own-hosted-widget path wins:

- Cloudflare Worker at `/api/chat` + Cloudflare Vectorize for retrieval + a small LLM (Workers AI Llama for $0, or Claude Haiku at ~pennies/query for better answers).
- Build-time `build-rag-index.mjs` chunks articles (~300–500 tokens), embeds with `@cf/baai/bge-m3` (multilingual, free tier), upserts to Vectorize. ~19 articles × ~5 chunks ≈ 100 vectors today; trivially within free tier.
- This is the one capability where building slightly ahead of content is defensible, because it is the project's potential signature feature and the corpus is already large enough for a useful MVP. Start with the **retrieval-only** variant (suggest articles, no LLM generation) to ship at $0, then add generation.
- Unblocks nothing in Phase 8 directly; it is net-new and LB-native.

### 5c. OG image generation — adopt the simplification, skip the inheritance

If/when OG images are wanted, do **not** port Taiwan's Playwright-screenshot pipeline (12GB heap, 120-min build, per the research's own "Playwright is Overkill" note). Use the Cloudflare Worker + Satori + resvg-wasm on-demand approach: generate per-article OG on first social-crawler request, cache at the edge. ~$0 and no build-time cost.

### 5d. Map and graph polish

The map already has real LB geocode. A Laguna Beach municipal-boundary TopoJSON (Overpass Turbo query or OC GIS portal, per research §GIS notes) would replace any inherited Taiwan county shapes with the actual coastline/town outline. Low priority until content fills the map.

---

## 6. Horizon 3 — Autonomy organs (only at real scale)

This is the Path A → Path B leap (`docs/fork/COUNTRY-MD-STARTER.md`): turning the static site into a self-maintaining Semiont with cron routines and persistent memory. It is the bulk of Phase 8 and explicitly **not** justified at 19 articles and zero traffic. Revisit only when (a) the corpus is large enough that manual maintenance burns out a solo maintainer, and (b) there is traffic/feedback worth reacting to.

When that day comes, adopt incrementally, cheapest-value-first, each unblocking its parked skill:

| Capability to build                                             | Unblocks (Phase 8)                                               | Precondition                                                      |
| --------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------- |
| One nightly cron (start with article-health or related-rebuild) | `lb-routine`, `lb-routine-audit`                                 | A persistent host or CI cron + content worth re-checking          |
| Memory/diary organ files (`MEMORY.md` pipeline, diary)          | `lb-memory`, `lb-diary`, `lb-distill`, `lb-self-evolve`          | Enough session history that continuity matters                    |
| Heartbeat cycle                                                 | `lb-heartbeat`, `lb-finale`                                      | The above organs exist                                            |
| Supabase reader-feedback backend                                | `lb-feedback-triage`                                             | Traffic generating feedback                                       |
| Social presence (Threads/X/Instagram)                           | `lb-harvest`, `lb-spore*`; lets `twmd-become` finally be deleted | A decision that LB wants a public voice + capacity to maintain it |
| Release tagging cadence                                         | `lb-release`                                                     | LB starts cutting versioned releases                              |
| 3rd locale                                                      | `lb-language-birth`                                              | A second translation target is chosen                             |

`lb-maintainer` / `lb-pr-review` unblock on **PR/issue volume**, which can't be manufactured; they wait on adoption.

---

## 7. Explicit non-goals (inherited from Taiwan, deliberately not adopted)

Carrying these would be cargo-culting a different project's situation. Documented so a future session doesn't "restore" them.

- **Sovereignty-Bench / LLM benchmarking** (`/bench`, already deleted) — Taiwan-geopolitics-specific; no Laguna analog.
- **4-tier anti-censorship translation cascade + local Ollama "sovereignty backbone"** — existed because PRC models refuse Taiwan content. Irrelevant to Laguna Beach.
- **Multi-language-for-narrative-projection** (6 languages) — Taiwan's strategy was outward sovereignty projection. LB translation, if any, is for local tourist segments, not projection. Add languages reactively, not as a default posture.
- **justfont premium Chinese typefaces** — see Horizon 0; remove.
- **"Token donation" framing, Portaly financial-supporter tooling, 5-tier contributor progression** — built for a 57-contributor national project. Premature for a solo/small fork; revisit if a contributor community forms.
- **Soundscape** — Taiwan had a field-recording collection; not currently a LB feature and not proposed unless there's a clear local angle.

---

## 8. Cost reality

The static core is $0/month (GitHub Pages + Cloudflare free tier); only the `.md` domain (~$150/yr) is fixed. The QR→chat feature (Horizon 2b) is $0 on Cloudflare free tier at low traffic, or pennies/day if swapped to Claude Haiku for answer quality. Autonomy organs (Horizon 3) add Claude API compute (~$50–200/mo at Taiwan's cadence) and are the only material recurring cost; they are also the last thing to build.

---

## 9. Immediate next actions (this/next session)

1. **Fix the GA4 leak** (Horizon 0, P0) — register LB GA4 or Cloudflare Analytics, swap/strip `G-JGC5W00N7T`.
2. **Remove justfont** (Horizon 0) — drop SDK + workarounds, fall back to Noto/system fonts.
3. **Decide Protico** (Horizon 0) — keep or remove the chat widget.
4. **Resolve zh-TW** (Horizon 1) — translate flagship articles or disable the locale to clear the 6 dead links.
5. **Write articles** (Horizon 1) — `/lb-news-lens` + `/lb-peer` → `/lb-write`, fill thin categories toward the ~40-article milestone.

Horizon 2+ waits until Horizon 0 is clean and the corpus is deeper.
