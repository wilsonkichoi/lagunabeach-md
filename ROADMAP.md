# ROADMAP.md — LagunaBeach.md

> Actionable forward plan. The fork migration (Phases 0-9) is complete and logged
> in [MIGRATION-LOG.md](MIGRATION-LOG.md); migration doctrine + any in-flight
> upstream-merge plan live in [MIGRATION.md](MIGRATION.md). **This file is the
> live task list for forward work** (content + capabilities), checkbox-driven,
> each item tagged with the skill that executes it and the capability that gates
> it. Reassess after every ~10 new articles or any capability change.

_v2.0 | 2026-06-25 — Made actionable. Horizon 0 (live-leak fixes) closed by
Phase 9. Absorbed MIGRATION.md's Phase 8 parked backlog as the §7 gated-skill
table. v1.0 was strategic-only._

---

## How to use this file

- **Forward work is driven here, not in MIGRATION.md.** MIGRATION.md is only for
  re-running the Taiwan-inheritance sweep after an `upstream/main` merge.
- Each task lists its **executing skill** and (if blocked) its **gate**.
- Two execution loops exist:
  - **Content** (Horizon 1) → the content skill chain (`lb-write`, `lb-validate`,
    etc.), not a review loop. Article quality isn't grep-verifiable.
  - **Mechanical / code** (Horizon 0 cleanup, Horizon 2 build work) → the generic
    two-session loop `/lb-implement` + `/lb-review` (handoff:
    `.handoff/TO-IMPLEMENTER.md` / `TO-REVIEWER.md`). Distinct from the
    migration loop (`/lb-migration-implement` + `/lb-migration-review`).

---

## 1. Where we are (verified 2026-06-25)

- **Content:** 19 English articles across 8 categories (History, Art & Galleries,
  Nature & Marine Life, Food, Beaches, Trails, Events & Festivals, Neighborhoods)
  - 3 About pages. `knowledge/` is SSOT; `src/content/` derives via
    `scripts/core/sync.sh`.
- **Languages:** English-only. `zh-TW` was disabled (2026-06-25) in
  `src/config/languages.{mjs,ts}` — it had zero translated articles and caused 6
  `/zh-TW` dead links per build. Re-enable when flagship content is translated.
- **Live infra:** GitHub Pages, `public/CNAME` = `lagunabeach.md`, deploy via
  `.github/workflows/deploy.yml`.
- **Working inherited features:** client-side search (`/explore`, MiniSearch),
  knowledge graph (`/graph`), Leaflet map with real LB geocode
  (`src/data/laguna-beach-geocode.json`), dashboard, changelog, related-articles
  (tag-overlap, `src/data/related/en.json`), `llms.txt` (LB-grounded), MCP worker
  (`workers/mcp`).
- **Build health:** green, gated broken ratio 0.13% < 7.0%, en 0 broken.
- **Live-leak fixes (was Horizon 0): DONE.** Phase 9 (2026-06-25) swapped the GA4
  property (`G-JGC5W00N7T` → LB's `G-GP9LN8026H`), removed the justfont SDK, and
  removed the dead Protico widget. See [MIGRATION-LOG.md](MIGRATION-LOG.md) Entry 1
  Phase 9.

---

## 2. Operating principle

Two rules govern everything below.

- **Content before infrastructure.** A 19-article knowledge base's binding
  constraint is breadth and depth of content, not tooling. Taiwan.md earned its
  21 prebuild scripts, 16 cron routines, and analytics organs across 828 articles
  and real traffic. Cargo-culting that scaffolding onto 19 articles produces dead
  machinery.
- **Capability before skill.** The parked `lb-*` skills (§7) are downstream of
  capabilities, not reasons to build them. Build a capability only when the
  project independently wants it (analytics because you want to know who reads the
  site, not "to unblock `lb-analyze`"). The skill port falls out cheaply after.

The corollary: this roadmap sequences **capabilities**, and §7 notes which parked
skill each one unblocks as a side effect.

---

## 3. Horizon 0 — Live-leak fixes ✅ DONE (Phase 9, 2026-06-25)

Kept here as the closed baseline; detail in [MIGRATION-LOG.md](MIGRATION-LOG.md).

- [x] **GA4 leak** — swapped `G-JGC5W00N7T` → `G-GP9LN8026H` (LB-owned property,
      Stream 15153167292). `grep -rn "G-JGC5W00N7T" src/` = 0. GA-dashboard hygiene
      (disable Google Signals, enable IP anonymization) is a Wilson manual step, not
      code.
- [x] **justfont** — removed SDK + FOUC fallback + CSS workarounds (-237 lines);
      zh-TW headings fall back to Noto Serif TC. Paid Taiwan-typeface dependency dropped.
- [x] **Protico** — endpoint returned HTTP 404; removed the widget component +
      3 template imports.
- [x] **Chinese-comment cleanup** — superseded by Horizon 0.5 below. The old
      "~14 cosmetic citations, opportunistic" framing was upgraded (2026-06-27,
      Wilson) to a deliberate full de-Taiwaning of the app layer: make the repo
      _truly LB_, production-ready for outside contributors, run as real work now
      (not opportunistically) in parallel with content.

---

## 3.4. Horizon 0.4 — Toolchain correctness on English content ✅ DONE (2026-06-29)

**Decision (2026-06-29, Wilson):** the de-Taiwan work kept feeling bottomless
because `grep zh` was the unit. It conflates cosmetic prose with **load-bearing
Taiwan assumptions in the build/validate scripts** — checks that silently no-op
or misfire on English articles. Those are bugs, not comments, and they're a
finite set. Fix them before more cosmetic cleanup.

**Method:** don't grep for Chinese. Run the toolchain that executes on every
build against the 18 English articles, and classify each script:
_works on English / structurally dead on English / misfires on English / cosmetic-only._
The dead + misfire set is the real backlog.

**Scope (finite):** the `scripts/` build chain — ~25 `prebuild:*` scripts
(`sync.sh`, `article-health.py`, `generate-*`, the link verifier) + the 24
`scripts/tools/lib/article_health/checks/*` plugins + `src/utils/article-render.ts`.
Excludes anything that doesn't run on `npm run build` / `article-health.py`
(harvest engine, lang-sync zh→en worker, social organs — those are Horizon 0.5
readiness or deferred activation, not build-path correctness).

**Known seeds (found while scoping):**

- `viz_health.py` — `APPLIES_TO = ["zh-TW"]`; the check never fires on LB English
  articles. Decide: port to English (regex for "as shown above/below", source-label
  logic) or accept it's zh-TW-only and dormant.
- `image_alt.py` — `body.rfind("## 圖片來源", …)` never matches LB's English
  headings → the "skip alt-check inside an image-credits section" guard never
  fires. Latent false-positive. Depends on pinning LB's image-credit heading
  convention in EDITORIAL.md first, then re-anchoring.

- [x] **Phase 1 — audit (done 2026-06-29).** Ran `article-health.py --all` on the
      18 en articles. **Finding: 9 of 24 health checks are hardcoded
      `APPLIES_TO=["zh-TW"]`** → structurally dead on every LB article. Split:
  - **6 holes** (should run on en, currently dead): `prose-health` (the worst —
    quality dashboard reports false-green because nothing is scanned),
    `frontmatter-format`, `frontmatter-title`, `image-alt`, `viz-health`,
    `correction-meta`.
  - **3 legitimately N/A**: `terminology` (deleted — cross-strait, see commit
    `873473961`), `cjk-punct` (Chinese punctuation), `spore-writing` (social
    organ — keep, ports when social activates).
  - The other 15 checks are lang-agnostic and run fine on en.
- [x] **Phase 2 — pin conventions (done 2026-06-29).** Pinned in EDITORIAL.md:
      title ≤60 chars + puffery-ban list (§5), `## Image Sources` heading (§4.7),
      viz source-label format + AI-blind cross-ref to graph.md.
- [x] **Phase 3 — fix the dead/misfire set (done 2026-06-29).** All 5 checks
      (`frontmatter-title`, `image-alt`, `viz-health`, `correction-meta`,
      `image_health`) ported to `APPLIES_TO=["en","zh-TW"]` with lang-branched
      logic. English messages. Tests rebuilt (229 pass, 0 fail). Build 0.00%.

### Horizon 0.4 DONE summary

All 6 dead checks ported to `APPLIES_TO=["en","zh-TW"]`: prose-health (R24),
frontmatter-format (bucket 2), frontmatter-title, image-alt, viz-health,
correction-meta (R28). 229 tests pass, 0 fail, build 0.00%. Conventions pinned
in EDITORIAL §5 (title ≤60 + puffery ban) and §4.7 (`## Image Sources`).

**Test harness note:** run the suite WITH PyYAML or results are degraded —
`uvx --with pyyaml pytest tests/article_health -q` (the loader prefers PyYAML;
without it, wrapped-flow-array frontmatter mis-parses and adds false failures).

Three-organ-state doctrine (active / dormant-but-kept / dormant-discarded) is
codified in MIGRATION.md Rule 1.

---

## 3.45. Horizon 0.45 — Delete Taiwan-specific dead code ✅ DONE (2026-06-30)

Removed Taiwan-only files/tools with zero LB reuse potential (reassessed per file):

- `data/terminology/` (2,339 cross-strait YAML files, 11MB)
- `scripts/deprecated/` (4 files integrated into sync.sh long ago)
- 4 terminology tools, 4 Taiwan peer-content crawlers, extract-22-counties,
  validate-china-fp-tsv, twinkle-hub-crawl/verify
- `prebuild:china-terms` removed from build pipeline
- `src/data/feedbacks.ts` emptied (Taiwan testimonials)
- `src/utils/article-render.ts` Taiwan 22-county cartogram deleted
- `scripts/twmd.mjs` → ported to `scripts/lb.mjs` (English LB CLI)

---

## 3.5. Horizon 0.5 — Full LB ownership of the app layer ✅ DONE (2026-06-29)

**Decision (2026-06-27, Wilson):** stop being a shadow of Taiwan.md at the code
layer. Hard-fork the app layer, de-Taiwan every LB-owned source file, and make
the repo onboard-able by a contributor who doesn't read Chinese. Runs in parallel
with Horizon 1 — `src/` work and `knowledge/` content don't collide.

**Upstream posture: hard-fork the app layer.** `.gitattributes` now carries
`src/** merge=ours` (+ `docs/semiont/**`, `MIGRATION.md`, `ROADMAP.md`). On a
future `git merge upstream/main` these auto-resolve to ours — the migration-loop
conflict tax is gone for the app layer. Upstream infra improvements are taken
**deliberately** via `git checkout upstream/main -- <path>`, never auto-merged.
This means the `lb-migration-*` loop's app-layer scope shrinks to near-zero; it
stays relevant only for unprotected paths (`scripts/`, `public/`, root configs).

**Scope:** ~686 Chinese-comment lines across ~60 `src/` files. Excludes zh-TW
i18n _string values_ (`i18n/*.ts`) — those are content, not comments, and stay.

- [x] **Phase B — de-Taiwan the active app layer (~40 files, 2026-06-28).** Translate Chinese
      code-comments → English in templates, pages, utils, `SEO.astro`,
      `Layout.astro`, styles, config. Comment-only edits, no logic touched.
      **Skill:** `/lb-implement` + `/lb-review`, batched, build-verified per batch.
- [x] **Phase C — rebrand the Semiont organs (~15 files, 2026-06-28).** `spore*` /
      `SporeFootprint`, `diary` / `DiaryTeaser` / `RelatedDiaries`, `semiont/*`,
      `Perspectives`, `LifeTree`, `timeline/*`. Taiwan refs → LB, comments → EN.
      **Do not delete; defer only activation, not translation** — these are adopted
      Semiont organs (LB is Path A→B by design). Their prose is regrounded to
      English/LB now (per `MIGRATION.md` Operating doctrine); only switching them on
      is deferred until their capability lands (heartbeat for diary; social accounts
      for spore; identity layer for semiont/\* is live now).
- [x] **Phase D — contributor readiness (done 2026-06-29).** `CONTRIBUTING.md`
      re-grounded (0 CJK; 7 `taiwan`/`frank890417` hits are intentional
      lineage/upstream-remote pointers). `docs/community/*`, `docs/prompts/*`,
      `docs/README.md` audited — remaining CJK is translation-example content
      (language names, target-language glosses), not stale Taiwan workflow. A
      non-Chinese reader can onboard end to end.
- [x] **Phase E — retire the `.en.md` shadow (2026-06-27).** Promoted all 12
      `*.en.md` canon files to `*.md` (English first-class), deleted the upstream
      Chinese originals (decision A — they remain in the upstream repo), repointed
      47 live reference files, reconciled the shadow-header prose in all 12 docs +
      the boot file + `MIGRATION.md` + the About article + `/about` page, fixed the
      loader's `相關` vestige, and added `merge=ours` for `EDITORIAL.md` + the 3
      pipelines (semiont already covered by `docs/semiont/**`). zh-TW locale strings
      in `about.ts` still mention "影子翻譯" — left per the zh-TW-content rule, to
      fix when/if that locale is re-enabled.

**Tracking:** seeded into `.handoff/TO-IMPLEMENTER.md`; execute via the roadmap
loop. Each batch commits separately and lists the files it de-Taiwaned. Phase E
was executed directly (it had to be atomic — a half-renamed tree breaks the build).

---

## 3.6. Horizon 0.6 — English-only codebase (scripts/ comment translation)

**Decision (2026-06-30, Wilson):** at this point, only English content and logic
should exist. All CJK in code that isn't legitimate i18n data must be translated.

**Done (2026-06-30):**

- [x] All non-i18n CJK in `src/` translated (17 files)
- [x] All `scripts/core/` comments/docstrings translated (16 files)
- [x] All build-path `scripts/tools/` translated (14 files)
- [x] `~/.config/taiwan-md` paths regrounded to `lagunabeach-md` (17 files)

**Remaining (163 files, ~3,200 CJK comment/docstring lines):**

All are developer tools NOT in the build path. Build is green, user-facing output
is English, contributor onboarding works. These are cosmetic-readability for devs
reading tool source. Execute via `/lb-implement` + `/lb-review`, batched by group.

- [x] **Group 1: lang-sync/ translation infra** (25 files, ~400 lines)
      `scripts/tools/lang-sync/` — OpenRouter/Ollama/Gemini backends, batch prep,
      verification, audit, slug-suggest, diary-translate, diff-patch.
- [x] **Group 2: article-health checks** (17 files, ~350 lines)
      `scripts/tools/lib/article_health/` — plugin docstrings + inline comments.
      CJK in regex patterns (matching zh-TW content markers) is KEEP.
- [x] **Group 3: analytics + sensing tools** (~15 files, ~400 lines)
      fetch-cloudflare, fetch-ga4, fetch-search-console, fetch-search-events,
      fetch-sense-data, cf-query, ga-query, ga-window-compare, sc-query,
      sense-diff, converter-analytics, converter-demand, register-ga4-custom-dims,
      generate-dashboard-analytics, referral-attribution.
- [x] **Group 4: spore + social tools** (~15 files, ~350 lines)
      spore-db, bootstrap-spore-ssot, generate-spore-image, make-spore,
      spore-content-hash-audit, validate-spore-data, migrate-spore-log-to-harvests,
      sync-spore-links (partial done), manage-featured.
- [x] **Group 5: content/editorial tools** (~20 files, ~400 lines)
      footnote-format-fix, research-report-health, analysis-report-health,
      image-ingest, land-media-batch, migrate-images-webp, generate-carousel-slides,
      check-freshness, cross-link, dead-cross-ref-scan, wiki-fetch, inbox-audit,
      lessons-distill, music-media-audit, attribution-risk-audit.
- [x] **Group 6: shell tools + CI + infra** (~25 files, ~400 lines)
      review-pr.sh, refresh-data.sh, consciousness-snapshot.sh, routine-status.sh,
      audit-batch.sh, build-parity-diff.sh, check-\* shells, translate.sh,
      worktree-gc, session-id, ci/restore-mtime.
- [x] **Group 7: feedback + utils + visual** (~20 files, ~300 lines)
      feedback/classify, feedback/archive, feedback/triage.test, triage-consolidate,
      scripts/utils/_, scripts/visual/_.
- [ ] **Group 8: dormant/niche tools** (~25 files, ~600 lines)
      instrumentation-audit, routine-audit, routine-sync-check, memory-index-lint,
      compress-memory, dna-split-audit, send-email-resend, send-contributor-survey,
      check-canonical-frontmatter, orphan-translation-check, people-title-check,
      backfill-translated-from, i18n-fill-gaps, i18n-translate, generate-reports-index.

**Method per file (not a blind find-and-replace):**

1. **Read and understand** what the script does, what data it operates on, and
   whether its logic is LB-relevant or Taiwan-only dead code.
2. **Decide disposition per element** (not just per file):
   - **Translate** comments/docstrings/UI strings to English.
   - **Port** logic that serves a valid LB purpose but has Taiwan-specific values
     (e.g. brand-query patterns matching "taiwan.md" -> "lagunabeach.md"; category
     lists matching Taiwan's 13 categories -> LB's 8; quality-check regexes detecting
     Chinese antipatterns -> equivalent English antipatterns).
   - **Delete** logic that detects a problem impossible in LB content and has no
     English equivalent (e.g. simplified-Chinese detector on English-only articles).
   - **Keep CJK** ONLY in patterns that parse actual zh-TW content that exists in
     this repo (e.g. regex matching a `knowledge/` markdown heading that is still
     in Chinese). If the content those patterns match does not exist in LB, the
     pattern is dead code, not a "KEEP".
3. **Reground** Taiwan-specific references (taiwan.md domain, @taiwandotmd handles,
   CheYu name refs, Taiwan categories) to LB equivalents.
4. **Verify** no syntax errors (`python3 -c "import py_compile; ..."` for .py,
   prettier for .mjs/.js, `bash -n` for .sh). Build-verify after each group.

Do NOT do a mechanical dictionary substitution (the 2026-06-30 attempt broke 43
files by corrupting indentation inside docstrings). Each file needs contextual
reading — a Chinese sentence is not a bag of replaceable words.

**The judgment test for every CJK line:** "Will this code ever fire on LB content
as it exists or will exist?" If no, it's dead code — port or delete. "CJK in
regex" is not automatically KEEP; it depends on whether the regex has a job to do.

**What counts as legitimate remaining CJK:**

- `displayName: '中文'` and other i18n language display names
- Regex patterns matching zh-TW content THAT STILL EXISTS in `knowledge/` (e.g.
  `r"延伸閱讀"` matching a heading in a zh-TW article file we actually ship)
- Column headers in `row.get("日期")` matching actual data table columns in files
  that are still zh-TW formatted
- `nameZh` data properties for dashboard organ rendering
- Translation prompts/examples that describe how to translate FROM Chinese (the
  translation toolchain's job IS to process Chinese content)

---

## 4. Horizon 1 — Content depth (the real growth axis) ⬅ DO THIS

This is where most effort should go. Everything that makes the inherited features
(search, map, graph, related-articles) feel alive is a function of article count
and interlinking. **No new infrastructure required — it is writing.**

- [ ] **Grow the corpus toward ~40 articles** (the threshold at which
      `/lb-media-audit` and the related-articles graph become statistically useful).
      Fill thin categories first: **Food (1 article)**, then Beaches / Trails /
      Neighborhoods (2 each).
      **Skill chain:** `/lb-news-lens` + `/lb-peer` → `knowledge/INBOX.md` →
      `/lb-write` → `/lb-validate` → `/lb-factcheck` → `/lb-sync`.
- [ ] **Interlink aggressively.** Every new article links 2-4 existing ones via
      `[[wikilink]]`. Graph + related-articles quality scale with link density, not
      article count alone. **Skill:** `/lb-write` (enforce at draft), `/lb-embeddings`
      (rebuild related index after).
- [ ] **Adopt the media standard as the corpus grows.** A beach/art/trails town is
      inherently visual; the corpus is currently text-heavy. **Skill:**
      `/lb-media-audit` (low-signal until ~40 articles).
- [x] **zh-TW question resolved (2026-06-25): disabled the locale.** Set
      `enabled: false` on zh-TW in `src/config/languages.{mjs,ts}`; removed the now-false
      `LanguageStatement` home section (+ orphan component and dead `home.lang.*` i18n
      keys) that linked to `/zh-TW`. Cleared all 6 standing dead links (build broken
      ratio 6→0). Re-enable when there's flagship content worth translating via
      `/lb-translate`.

---

## 5. Horizon 2 — Reader-facing capabilities (build only when content justifies)

Ordered by value-to-effort for a tourist-facing Laguna Beach guide. Each is
**code work → use `/lb-implement` + `/lb-review`** once scoped.

### 5a. Own analytics — unblocks `lb-analyze`, `lb-evolve`

- [ ] GA4 is now LB-owned (Phase 9), so basic readership data will accrue. Decide
      whether that's enough or whether to add Cloudflare Web Analytics (privacy-light,
      no cookie banner, free, site likely already fronts Cloudflare for the `.md`
      domain). Once real readership data exists, port `lb-analyze` / `lb-evolve` from §7.
      **Gate:** weeks of accumulated GA4 data.

### 5b. QR → AI chat "Laguna Beach guide" (the differentiated bet)

- [ ] The strongest LB-specific opportunity. Tourist scans a QR at a
      beach/trailhead → chat widget answers from article content + links the page.
      Own-hosted-widget path (tourists won't have AI subscriptions):
  - Cloudflare Worker at `/api/chat` + Cloudflare Vectorize + a small LLM (Workers
    AI Llama for $0, or Claude Haiku at ~pennies/query for better answers).
  - Build-time `build-rag-index.mjs` chunks articles (~300-500 tokens), embeds with
    `@cf/baai/bge-m3`, upserts to Vectorize. ~19 articles × ~5 chunks ≈ 100 vectors;
    trivially within free tier.
  - **Ship the retrieval-only variant first** (suggest articles, no LLM
    generation) at $0, then add generation.
  - This is the one capability where building slightly ahead of content is
    defensible (potential signature feature, corpus already large enough for an MVP).
    **Gate:** none hard; sequence after Horizon 1 has depth. Net-new, LB-native.

### 5c. OG image generation — adopt the simplification, skip the inheritance

- [ ] If/when wanted, do **not** port Taiwan's Playwright-screenshot pipeline (12GB
      heap, 120-min build). Use Cloudflare Worker + Satori + resvg-wasm on-demand:
      generate per-article OG on first social-crawler request, cache at edge. ~$0, no
      build-time cost. **Gate:** want social-share previews.

### 5d. Map and graph polish

- [ ] Add a Laguna Beach municipal-boundary TopoJSON (Overpass Turbo / OC GIS
      portal) to outline the actual coastline/town. **Gate:** low priority until
      content fills the map.

---

## 6. Horizon 3 — Autonomy organs (only at real scale)

The Path A → Path B leap (`docs/fork/COUNTRY-MD-STARTER.md`): turning the static
site into a self-maintaining Semiont with cron routines and persistent memory.
**Explicitly not justified at 19 articles and zero traffic.** Revisit only when
(a) the corpus is large enough that manual maintenance burns out a solo maintainer,
and (b) there is traffic/feedback worth reacting to. The build order and the skills
each capability unblocks are in §7.

---

## 7. Gated skill backlog (absorbed from MIGRATION.md Phase 8)

Every skill here is blocked on a **capability that does not exist yet** — not on
implementer effort. Each is a `lb-* ← twmd-*` port that falls out cheaply once its
gate lands. Build the capability (Horizon 2/3) first, then port the skill. Do
**not** build these speculatively (no dead skills).

| Gate (capability to build first)                        | Unblocks (skill port)                                                                     | Horizon     |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------- |
| Analytics data (GA4 accruing / Cloudflare)              | `lb-evolve` ← `twmd-evolve`, `lb-analyze` ← `twmd-analyze`                                | 2a          |
| PR / issue volume (can't be manufactured)               | `lb-maintainer` ← `twmd-maintainer`, `lb-pr-review` ← `twmd-pr-review`                    | on adoption |
| One nightly cron (article-health or related-rebuild)    | `lb-routine`, `lb-routine-audit`                                                          | 3           |
| More cron/automation organs                             | `lb-heartbeat`, `lb-finale`, `lb-probe`, `lb-babel`, `lb-batch-audit`, `lb-weekly-report` | 3           |
| Memory / diary / LESSONS-INBOX / Supabase organs        | `lb-memory`, `lb-diary`, `lb-distill`, `lb-self-evolve`, `lb-feedback-triage`             | 3           |
| Social presence (Threads/X/IG) — port-first-then-delete | `lb-harvest` ← `twmd-harvest`, `lb-spore{,-pick,-publish}` ← `twmd-spore*`                | 3           |
| LB starts tagging releases                              | `lb-release` ← `twmd-release`                                                             | conditional |
| A 3rd locale chosen                                     | `lb-language-birth` ← `twmd-language-birth`                                               | conditional |

**`twmd-become` HELD:** still the shared gate for 25 dormant `twmd-*` skills.
Delete only after all 25 dependents either port to `lb-become` or are deleted.
The 4 social-gated `twmd-*` originals (`harvest`, `spore`, `spore-pick`,
`spore-publish`) stay dormant as reference until their `lb-*` port is built, then
`git rm`.

---

## 8. Explicit non-goals (inherited from Taiwan, deliberately not adopted)

Documented so a future session doesn't "restore" them.

- **Sovereignty-Bench / LLM benchmarking** (`/bench`, deleted) — Taiwan-geopolitics-specific.
- **4-tier anti-censorship translation cascade + local Ollama "sovereignty backbone"** — existed because PRC models refuse Taiwan content. Irrelevant to Laguna.
- **Multi-language-for-narrative-projection** (6 languages) — Taiwan's outward sovereignty projection. LB translation, if any, is for local tourist segments. Add languages reactively.
- **justfont premium Chinese typefaces** — removed (Phase 9).
- **"Token donation" framing, Portaly financial-supporter tooling, 5-tier contributor progression** — built for a 57-contributor national project. Premature for a solo/small fork.
- **Soundscape** — Taiwan field-recording collection; no current LB angle.

---

## 9. Cost reality

Static core is $0/month (GitHub Pages + Cloudflare free tier); only the `.md`
domain (~$150/yr) is fixed. QR→chat (5b) is $0 on Cloudflare free tier at low
traffic, or pennies/day if swapped to Claude Haiku for answer quality. Autonomy
organs (Horizon 3) add Claude API compute (~$50-200/mo at Taiwan's cadence) and
are the only material recurring cost; also the last thing to build.

---

## 10. Immediate next actions (this / next session)

1. **Write articles** (Horizon 1) — `/lb-news-lens` + `/lb-peer` → `/lb-write`,
   fill **Food** first, then Beaches/Trails/Neighborhoods, toward ~40.

Horizons 0.4 and 0.5 are closed. Horizon 2+ waits until Horizon 1 has depth.
