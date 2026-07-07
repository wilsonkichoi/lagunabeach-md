# ROADMAP: LagunaBeach.md / Sekai KB

**Derived 2026-07-07 from `.fable/STRATEGIC-DIRECTION.md` §E.** Milestones = Linear
project milestones on "LB Rebuild", one per phase. Task packets are converted from §E's
blocks by `/dev:plan`, never re-derived; §E's Steps/Acceptance text governs packet detail.
Every phase transition is a Wilson gate — `/dev:plan` for phase n+1 runs only after Wilson
confirms phase n closed. Estimates carried from §E (`AI implement+review | Human`).

| # | Milestone | Outcome | Scope (§E tasks) | Exit gate | Est |
|---|---|---|---|---|---|
| 0 | Fresh repo + CI | New repo scaffolded (Astro 6, place.config.ts, extracted styles), deployed preview, genericity gate live | 0.1 ✅ (done 2026-07-07, by hand) · 0.2 · 0.3 | CI genericity gate proven (a planted "Laguna" in src/ fails CI); Wilson phase confirm | AI 4.25h \| Human 1h |
| 1 | Core pages at design parity | Layout, home, article, category hub, explore/search, latest, about/contribute/changelog, `/kb/` + llms.txt, prebuild chain | 1.1a-c · 1.2a-c · 1.3 · 1.4 | **Wilson design sign-off on 1.1c side-by-side package** (§G risk 1); phase confirm | AI 19.5h \| Human 1h |
| 2 | Visual features | Leaflet map with boundary overlay; D3 knowledge graph | 2.1 · 2.2 | Mobile map check on real device (2.1); Wilson phase confirm | AI 5h \| Human 0.25h |
| 3 | Content migration + cutover | Full corpus (16 articles + About + INBOX) on the new site; lagunabeach.md serves it | 3.1 · 3.2 | **Wilson domain cutover (3.2)**; v1 archived after 14 stable days; phase confirm | AI 1.25h \| Human 1h |
| 4 | Quality tooling | article-health, frontmatter tests, pre-commit, dashboard-lite, visual-regression baselines; `test_command` updated in `.claude/dev.md` (4.1) | 4.1 · 4.2 | Health scores match fork baseline; `npm run visual:check` clean; Wilson phase confirm | AI 5h \| Human 0h |
| 5 | Framework cut (sekai-kb v1) — **blocks 6-7** | Template repo with demo place, init wizard, `/adopt` + `/seed-articles` + `/upgrade`, playbook/runbook, release discipline, LB re-based on tags, SystemDiagram | 5.1 · 5.2a-c · 5.3 · 5.4 · 5.5 | **Wilson dana-point proof (5.2c: fresh clone → deployed < 1h)**; clean tag-merge via /upgrade (5.4); phase confirm | AI 18.5h \| Human 1.5h |
| 6 | Social + engagement | Feedback (Worker + D1 + widget + triage), snippet pipeline, soundscape | 6.1a-b · 6.2 · 6.3 | Live submission → D1 → GitHub issue; Wilson recordings (6.3); phase confirm | AI 9.5h \| Human 2.5h |
| 7 | Differentiators | On-demand OG worker, RAG chat (bge-m3 + Workers AI + Claude API), QR flow | 7.1 · 7.2a-c · 7.3 | Eval set answered with citations, no hallucinated places (7.2c); phase confirm | AI 12.25h \| Human 1.75h |
| 8 | Semiont plugin layer | Organ architecture in sekai-kb (config.json manifest, core organs); LB enables core + MANIFESTO | 8.1 · 8.2 | Site builds with `semiont/` deleted; organs toggle via config only; phase confirm | AI 4.25h \| Human 0h |

**Totals (§E):** AI ≈ 79h (implement + review) | Human ≈ 9h. Phases 0-4 ≈ 1.5-2 weeks at
2-4 tasks/day; full plan ≈ 4-6 weeks elapsed (3.2's 14-day archive wait overlaps Phases 4-5).

**Ordering rules (structural, not preference):** Phases 6 and 7 declare `Depends: 5.4` —
the framework ships before LB's fun features (§A2, §G risk 3). Reordering is a scope change
requiring Wilson's explicit call.
