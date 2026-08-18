# ROADMAP: LagunaBeach.md

**Approved 2026-07-07; consolidated 2026-07-26; scope split 2026-07-29 (LB-62).** This is
the delivery-plan SSOT **for this instance**. Milestones are Linear project milestones on
"LB Rebuild", one per phase. Every phase transition is a Wilson gate — `/dev:plan` for
phase n+1 runs only after Wilson confirms phase n closed. Estimates use
`AI implement+review | Human`.

> **Two roadmaps, one tracker.** The framework's own delivery plan — the phases 6-12 task
> blocks that `/dev:plan` converts framework packets from, their amendments, and the
> ordering rules that govern them — lives in
> [`sekai-kb/dev_docs/ROADMAP.md`](https://github.com/wilsonkichoi/sekai-kb/blob/main/dev_docs/ROADMAP.md),
> beside the code those phases build. This document keeps phases 0-5 (the rebuild and the
> framework cut, which happened here) and, for each later phase, the **instance-owned**
> work LB itself executes. A task block lives in exactly one repository; neither document
> restates the other's. The Linear tracker stays a single project spanning both.

**Status (2026-07-29):** Phases 0-5 are complete and Wilson-confirmed; the phase-5 close
gate ran in LB-52 on 2026-07-25. Phase 5 delivered the framework cut, the init wizard,
content skills, release discipline, LB re-based onto tagged releases, dual-harness
validation (LB-43), the dev-plugin migration (discovery-native rule loading), and the
scan-root scope guard: 24 tasks, 53 points, 14 days as of the close. A post-close release
workstream then shipped version-ownership separation, the `.agents/skills/` namespace
move, and end-to-end release automation across four further framework releases,
backfilled as LB-56 through LB-59. The adopted framework release, LB's own release, and
the pinned dev-plugin release are recorded in `FRAMEWORK-VERSION`, `VERSION`, and
`.agent-toolkit/dev.md` respectively; those files are the SSOT and this document does not
restate their values. Phase 6 plans next, from the framework roadmap.

**Pre-Phase 6 housekeeping (2026-07-26):** planning and architecture content was
consolidated into PRD/SPEC/ROADMAP/ADRs. LB's `CHANGELOG.md` was reconstructed as an
instance-only history and made instance-owned; framework release notes remain upstream.
Version ownership is also explicit: `VERSION` is LB's release, while
`FRAMEWORK-VERSION` is the adopted Sekai release. The private npm manifest mirrors
the repository's own release SSOT, and LB releases are explicit through `/sekai-release`,
not automatic on article merges (ADR 007, upstream).

## Phases 0-5: the rebuild and the framework cut (complete)

These phases executed in this repository and are LB's own delivery history.

| # | Milestone | Outcome | Scope (tasks) | Exit gate | Est |
|---|---|---|---|---|---|
| 0 | Fresh repo + CI | New repo scaffolded (Astro 6, place.config.ts, extracted styles), deployed preview, genericity gate live | 0.1 ✅ (done 2026-07-07, by hand) · 0.2 · 0.3 | CI genericity gate proven (a planted place name in src/ fails CI); Wilson phase confirm | AI 4.25h \| Human 1h |
| 1 | Core pages at design parity | Layout, home, article, category hub, explore/search, latest, about/contribute/changelog, `/kb/` + llms.txt, prebuild chain | 1.1a-c · 1.2a-c · 1.3 · 1.4 | **Wilson design sign-off on 1.1c side-by-side package**; phase confirm | AI 19.5h \| Human 1h |
| 2 | Visual features | Leaflet map with boundary overlay; D3 knowledge graph | 2.1 · 2.2 | Mobile map check on real device (2.1); Wilson phase confirm | AI 5h \| Human 0.25h |
| 3 | Content migration + cutover | Full corpus (16 articles + About + INBOX) on the new site; lagunabeach.md serves it | 3.1 · 3.2 | **Wilson domain cutover (3.2)**; v1 archived after 14 stable days; phase confirm | AI 1.25h \| Human 1h |
| 4 | Quality tooling | article-health, frontmatter tests, pre-commit, dashboard-lite, visual-regression baselines; `test_command` updated in `.agent-toolkit/dev.md` (4.1) | 4.1 · 4.2 | Health scores match fork baseline; `npm run visual:check` clean; Wilson phase confirm | AI 5h \| Human 0h |
| 5 | Framework cut (sekai-kb v1) — **blocks 6-7** | Template repo with demo place, init wizard, `/sekai-adopt` + `/sekai-seed-articles` + `/sekai-upgrade`, generic content skills (`/sekai-write` `/sekai-validate` `/sekai-factcheck` + router), playbook/runbook, release discipline, LB re-based on tags, SystemDiagram | 5.1 · 5.2a-c · 5.3 · 5.4 · 5.5 · 5.6 (amendment below) | **Wilson dana-point proof (5.2c: fresh clone → deployed < 1h)**; clean tag-merge via /sekai-upgrade (5.4); phase confirm | AI 21h \| Human 1.5h |

**Totals:** phases 0-5 AI ≈ 56h (implement + review) | Human ≈ 4.75h, including the Phase 5
amendment's 5.6 (AI 2.5h). Phases 0-4 ran ≈ 1.5-2 weeks at 2-4 tasks/day. The framework
phases 6-12 and the programme-wide totals are in the framework roadmap.

Linear retains phases 0-5's final task packets, work summaries, review findings, and
verification evidence. Their superseded pre-execution blocks and the retired `.handoff`
loop are intentionally not duplicated here; they remain recoverable from git history.

**Language policy for this instance (2026-07-11, scope fixed 2026-07-11 (b)):** LB ships
English-only — content, UI, and any instance-owned code. The framework's own English-only
requirement and the machine gates that enforce it (place-name denylist + CJK-codepoint
scan across every code tree, test fixtures included) are framework contracts; see the
framework SPEC's negative requirements. Multi-language support is a post-project revisit
after the framework's Phase 12 (`dev_docs/PRD.md` non-goals); the `lagunabeach-md-v1` archive
retains the fork's CJK implementations for reference.

---

## Phase 5 amendment — approved by Wilson 2026-07-11 at Phase-4 close

**Phase 5 close correction, approved 2026-07-19:** Phase 5's clean-upgrade acceptance
includes persistence of adopter dev-plugin state across framework tag merges. A wizard-
adopted instance with `.agent-toolkit/` stripped must stay stripped; an instance that
explicitly installed the dev workflow with `dev:setup` must retain its own config and
rules. Shared-history and unrelated-history merge topologies are both acceptance cases.
LB-44 implements this correction and blocks the LB-43 dual-harness close validation.

The packet-shaping notes amend the original 5.1-5.5 Steps/Acceptance detail with repo
realities the 2026-07-04 plan could not know.

**New task block:**
```
[5.6] Generic content-lifecycle skills: /sekai-write, /sekai-validate, /sekai-factcheck + router
  Effort: M | Model: Opus | Depends: 5.1, 5.3 (the playbook is the pipeline SSOT the
    skills reference)
  Est: AI 2h + 0.5h review
  Steps:
    1. Port from the v1 archive's write / validate / factcheck skills, genericized at
       port time: place identity + category set from place.config.ts, pipeline/editorial
       rules referenced from docs/playbook/ (never fork doc paths); land under
       .agents/skills/ with generic names — no instance prefix survives in any directory
       name, file name, or prose.
    2. Thin router skill (successor to the fork's router): lists the shipped skills
       + their triggers; probes semiont/config.json and no-ops gracefully when absent
       (organ substance arrives Phase 8).
    3. Extend both machine gates' scan scope to .agents/skills/ (agent-executed prose is
       code for doctrine purposes): check-genericity.sh SCAN_ROOTS and
       check-english-only.mjs SCAN_ROOTS.
    4. Document the skill ownership rule in SPEC + framework AGENTS.md: framework skills
       are framework-owned (upgrade-managed, same class as src/); adopters ADD new skills
       freely (new files never conflict on upgrade); overriding a framework skill =
       upstream to sekai-kb first, or accept a conflict-managed local fork that /sekai-upgrade
       flags each release.
  Acceptance: on the demo place, /sekai-write produces an article that passes /sekai-validate and
    article-health; both gates green with .agents/skills/ in scope; the router lists
    exactly the shipped skills; zero place-specific strings in any skill
  Downstream: 8.1 (router's semiont probe), 11.3/11.8 (maintainer + rewrite routines
    invoke the validate/sekai-write pipelines)
```

**Not ported** (ruling approved 2026-07-11): the fork's translate skill
(post-project, LB-24), its become skill (Phase 8.1), and its refresh/news-lens/peer/
media-audit skills (concepts return as Phase 11 routines 11.8/11.6/11.3); sync/search
became documented npm-command workflows in the 5.3 runbook.

**Packet-shaping notes for tasks 5.1-5.4** (recorded 2026-07-11; facts verified in-repo):

- **5.1 strip list additions** beyond the original list (knowledge/, public/media/, place.config,
  CNAME): `reports/`, `research/`, `.agent-toolkit/` (LB's tracker/process state — the
  template ships none), `public/data/boundary.geojson` (map overlay and 5.5's
  SystemDiagram both degrade gracefully without it — verified), LB visual baselines
  (recapture against the demo place), `dev_docs/baselines/article-health-fork.md` + the
  `article-health:baseline` fork-parity check (LB-specific; re-point to a demo-place
  baseline or drop the npm script in the template). `.claude/rules/` gets a split pass:
  framework-relevant engineering rules (astro-*, prebuild-*, gray-matter, shell
  portability, GH-Actions least-privilege, lockfile) ship in the template; LB-process
  rules (dod-is-the-scope, visual-parity target, fork-sweep, clean-rebuild) stay
  instance-side — executor proposes the split in the PR. **[Superseded 2026-07-19:**
  per ADR 006 and the dev-plugin 0.0.55 migration, ALL rules are dev-plugin state in
  `.agent-toolkit/rules/` (adopter-owned, `merge=ours`), the template ships none, and
  `.claude/rules/` no longer exists.**]**
- **5.1 build sanity on fresh history:** `build-dashboard-lite.mjs` computes immune
  dimensions from git log; on the template's single-init-commit history it must produce
  sane output (no crash, no degenerate scores) — acceptance-check it.
- **5.2a wizard scope grew beyond the original ~8 prompts:** must also cover `links`
  (repo/email/social — the LB-3 schema divergence) and the `home` block (~230 lines of
  home-page copy now lives in place.config). The wizard writes generic defaults
  for `home.*`; `/sekai-adopt` MAY draft place-specific copy behind the same human-approval
  gate as `/sekai-seed-articles`. The wizard also appends the adopter's place name to a new
  instance-owned `scripts/ci/genericity-denylist.local.txt`, read additively by
  check-genericity.sh — the framework denylist file stays framework-owned so upgrades
  never conflict.
- **5.3 doc scope additions:** runbook covers the Python toolchain (uv + Python ≥3.12;
  article-health and its pytest suite run via `uv run`; `pyproject.toml` + `uv.lock` ship
  in the template). A template **README** is a named deliverable (the "Use this template"
  landing surface: what this is, the <1h adopt path, links to playbook/runbook). Ship an
  **AGENTS.md** pointer so codex-cli and other agent CLIs boot the same
  instructions. State the language support boundary (see Language policy above).
- **5.4 instance-owned list extends** beyond the original five files: `dev_docs/baselines/**` and
  `scripts/ci/genericity-denylist.local.txt` (final `merge=ours` list minted in the
  packet). LB's squash-merge history makes the task's step-2 graft/subtree-merge choice
  load-bearing — document the chosen mechanics in the runbook as the task requires.

---

## Agent-toolkit migration amendment — approved by Wilson 2026-07-19

The rulings from the dev-plugin 0.0.55 migration (ADR 006 + addendum) that govern LB as
an instance: `AGENTS.md` is the agent-instruction SSOT and instance-owned (`merge=ours`);
`CLAUDE.md` is a byte-exact one-line `@AGENTS.md` shim, never content-bearing; all rules
are dev-plugin state in `.agent-toolkit/rules/`.

The same amendment's **packet-conversion deltas for framework phases 8-9** (the 8.1
organ-loader ruling, the 8.2 naming note, and the 9.3 corrections) govern blocks that now
live in the framework roadmap and are carried there; they are not restated here. The 5.1
rules-split note they also superseded is marked inline in the Phase 5 list above.

---

## Phases 6-12: what LB does when a framework phase ships

The framework roadmap owns these phases' task blocks, effort estimates, exit gates, and
ordering rules. Every code task in them executes in `sekai-kb` and ships as a tagged
release. LB's side of each phase is the same short, instance-owned sequence, and it is
part of that phase's exit gate:

1. **Adopt the release** — `/sekai-upgrade` against the phase's `sekai-kb-vX.Y.Z` tag,
   per [`docs/runbook/UPGRADE.md`](./runbook/UPGRADE.md). The PR carrying that merge is
   history-bearing and merges with a real merge commit, never a squash
   (`.agent-toolkit/rules/upgrade-prs-merge-commit-never-squash.md`).
2. **Opt in to what the release added** — flip the relevant `features.*` key in
   `place.config.ts`. New framework keys are absent-safe (a missing key means the feature
   is off), so adopting a release never *requires* a config edit; enabling is LB's call.
3. **Supply what only LB has** — content, media, credentials, and account setup.
4. **Verify and record** — the LB `test_command` and CI green on the merged tree, then
   `FRAMEWORK-VERSION` records the adopted tag.

Per phase, step 2's flags and step 3's LB-only inputs are:

| Framework phase | LB flips | LB supplies |
|---|---|---|
| 6 — Social + engagement | `features.feedback`, `features.soundscape` | Cloudflare account + wrangler auth, D1 database and secrets, the first three soundscape recordings |
| 7 — Differentiators | `features.chat` (OG worker flag per its packet) | Claude API key, Workers AI binding, review of the 10-question evaluation answers, printed QR placements |
| 8 — Semiont plugin layer | organs in `semiont/config.json`: memory, reflexes, manifesto on; diary, introspection off | MANIFESTO prose, salvaged by hand from the v1 archive |
| 9 — MCP + AI delivery | `features.mcp` | wrangler route for the MCP endpoint, a real MCP-client connection test against `lagunabeach.md` |
| 10 — Perception (analytics) | `features.analytics` | GA4 property, Search Console verification, Cloudflare Web Analytics token, fetcher API credentials as Actions secrets |
| 11 — Operational automation | native Claude Code cloud Routine registrations for content review, maintenance, trends, and rewrite; GitHub Actions analytics schedule | repository and connector/environment setup named by `AUTOMATION.md`, first Routine registration, merge approval on the first rewrite PR |
| 12 — Gated integrations | no default opt-in; enable only after the framework's human-approval and real-account gates are satisfied | feedback-triage approval session, selected social account and adapter credentials, first live integration verification |

Two instance-owned items are LB's own work rather than an adoption step, and enter the
tracker through `/dev:plan` or `dev:backlog` like any other task:

- **Phase 7.3 QR placements** — which physical Laguna Beach locations get codes, and the
  `ctx` slug each maps to, is instance content even though the mechanism is framework.
- **Phase 11 routine selection** — which native Routines LB actually registers, on which
  schedule, with which connector/environment allowlist. The framework supplies the skills
  and runbook; the account-owned registrations are LB's.
- **Phase 12 integration readiness** — the feedback approval session and the real social
  account and adapter are LB-owned gates. The framework cannot satisfy them through config
  defaults.
