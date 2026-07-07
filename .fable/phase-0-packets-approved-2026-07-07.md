# APPROVED Phase 0 packets — push to Linear verbatim, then delete this file

Dry-run approved by Wilson 2026-07-07 (dev:plan gate). The pushing session creates these
two issues EXACTLY as written (no re-derivation, no re-wording) in Linear workspace
`sekai-kb`, team `LB`, project "LB Rebuild", milestone "Phase 0", status **Todo**, then
verifies with a state-filtered list per `docs/tracker.md`, deletes this file, and commits.

Not tracked: §E task 0.1 (done by hand 2026-07-07, acceptance verified; recorded in
ROADMAP.md — no retroactive Done issue, per the Done-only-via-verify ownership rule).

---

## Issue 1 — [0.2] Astro 6 scaffold + place.config.ts + extracted styles

Priority: High · Estimate: M (~2.5h + 0.5h review) · Dependencies: none · Milestone: Phase 0

Body:

**Model: Opus** (advisory; Wilson picks the session model)

**Objective:** A building Astro 6 scaffold in this repo carrying the fork's design system
verbatim (6 CSS files, fonts swapped to Latin-only) and `place.config.ts` as the single
ingress for LB's place identity.

**Why:** Everything in Phase 1+ extracts into this scaffold; the design ships as copied
files, not prompts (SPEC.md "Extraction map", ADR 001). `place.config.ts` from day one is
what makes the Phase 5 framework cut safe (ADR 002).

**Definition of Done** (evidence per criterion):
1. `npm run build` exits 0 — paste build output. [test-backed]
2. `diff` vs `../lagunabeach-md-v1/src/styles/`: `tokens.css` differs ONLY in the four
   `--font-*` lines + its two neutralized comment lines; `global.css` and
   `article-modules.css` differ ONLY in one neutralized comment line each;
   `dark-polish.css`, `dashboard.css`, `shot-mode.css` byte-identical (`diff` silent).
   Paste the diff outputs. [script-backed]
3. `place.config.ts` matches the SPEC schema with LB values: 8 categories
   (slugs/icons/descriptions lifted from fork `src/utils/category-static-paths.ts`
   CATEGORY_MAP), map center `[33.5427, -117.7854]` zoom 13 + maxBounds around the city,
   `features` graph/map/dashboard true, soundscape/feedback/chat/social/analytics false.
   Evidence: file contents in the PR. [review-checked]
4. `grep -riE "taiwan|twmd" src/ scripts/` returns nothing; no CJK font families
   (Noto/PingFang/Source Han) remain in `tokens.css`. Paste grep output. [script-backed]

**Spec references:** SPEC.md §Stack, §place.config.ts, §Extraction map; ADR 001/002;
binding spec `.fable/STRATEGIC-DIRECTION.md` §E [0.2] (this packet converts it; original
step 1 and the loop-bootstrap acceptance clause are void per the 2026-07-07 revision note —
the payload is already committed). Extraction source paths: `.claude/dev.md`
§Binding references.

**Suggested steps** (§E [0.2], converted):
1. `npm create astro@latest` (minimal template, strict TS); pin `engines.node >=22.12.0`,
   Astro ^6. Deps mirror the fork's package.json minus `@supabase/supabase-js`:
   `@astrojs/rss`, `@astrojs/sitemap`, `@tailwindcss/vite`, `tailwindcss ^4`,
   `gray-matter`, `marked`, `minisearch`, `remark-wiki-link`, `rehype-external-links`,
   `npm-run-all`.
2. Write `place.config.ts` per SPEC schema with LB values (categories from fork
   CATEGORY_MAP; center/zoom/maxBounds; feature flags).
3. Copy 6 CSS files verbatim from fork `src/styles/` (skip `semiont.css`); neutralize the
   4 upstream-credit comment lines containing "Taiwan" (verified locations: `tokens.css:2`,
   `:50`, `global.css:84`, `article-modules.css:29`) — comment wording only, zero rule
   changes.
4. Font swap, the ONLY rule edit: `tokens.css:51-54` — delete CJK fallback families, keep
   Georgia + Inter; keep line 56's `--font-editorial` alias. (Fork loads Inter via a
   Google Fonts `<link>` in `Layout.astro:143-154`; the trimmed link lands with the real
   Layout in 1.1a — nothing to do here beyond tokens.css.)
5. Minimal `Layout.astro` + placeholder `index.astro` so the build emits a page (real
   layout lands in 1.1a).

---

## Issue 2 — [0.3] CI: GH Actions build+deploy to Pages + genericity gate

Priority: Medium · Estimate: S (~1h + 0.25h review) · Dependencies: Issue 1 ([0.2],
Linear blocked-by relation) · Milestone: Phase 0

Body:

**Model: Sonnet** (advisory; Wilson picks the session model)

**Objective:** `deploy.yml` building and deploying to GitHub Pages, with
`scripts/ci/check-genericity.sh` failing any push OR pull request that introduces
place-specific strings into `src/` or `scripts/`.

**Why:** The genericity gate is the structural mitigation for the trap that motivated the
whole rebuild (ADR 002, §G risk 2); PR-triggered CI is what lets every subsequent task's
PR be driven to green (SPEC.md §Negative requirements).

**Definition of Done** (evidence per criterion):
1. Workflow triggers on **both** `pull_request` (genericity + build jobs) and `push` to
   main (same jobs + deploy) — this task's own PR shows the checks running. [CI-evidenced]
2. Push to main → live `*.github.io` preview URL serving the 0.2 placeholder.
   [manual: Wilson verifies Pages settings/URL once]
3. A test branch containing "Laguna" in `src/` fails CI at the genericity job — link the
   red run; the clean scaffold passes — link the green run. [CI-evidenced]
4. `scripts/ci/check-genericity.sh`: case-insensitive grep over `src/` and `scripts/` for
   terms in `scripts/ci/genericity-denylist.txt` (seed: laguna, lagunabeach, taiwan, twmd);
   scan excludes `place.config.ts`, `knowledge/`, `public/media/`, `docs/`, and the
   denylist itself. [script-backed: run locally, paste output]
5. `.claude/dev.md` frontmatter updated `ci_workflow: deploy.yml` in the same PR.
   [review-checked]

**Spec references:** SPEC.md §Negative requirements (genericity, PR-triggered CI),
§Deployment; binding spec `.fable/STRATEGIC-DIRECTION.md` §E [0.3] (this packet converts
it; the PR-trigger requirement and DoD 5 are the 2026-07-07 adoption amendments). Note
carried from §E: fork's `deploy.yml` is structural reference only — no i18n/translation
jobs.

**Suggested steps:** write `deploy.yml` (Node 22, `npm ci`, build; deploy via
`actions/deploy-pages` gated to push-on-main; genericity job runs before build on both
triggers); write `check-genericity.sh` + `genericity-denylist.txt`; prove red/green per
DoD 3; update `.claude/dev.md`.
