# 🏖️ LagunaBeach.md

> **Open-source, AI-friendly knowledge base about Laguna Beach, California.**

[🌐 Live Site](https://lagunabeach.md) · [🗺️ Map](https://lagunabeach.md/map) · [🕸️ Graph](https://lagunabeach.md/graph) · [💬 Chat](https://lagunabeach.md/chat) · [🔊 Soundscape](https://lagunabeach.md/soundscape) · [🤝 Contribute](https://lagunabeach.md/contribute)

[![Deploy](https://github.com/wilsonkichoi/lagunabeach-md/actions/workflows/deploy.yml/badge.svg)](https://github.com/wilsonkichoi/lagunabeach-md/actions/workflows/deploy.yml)
[![Content: CC BY-SA 4.0](https://img.shields.io/badge/Content-CC_BY--SA_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![Code: MIT](https://img.shields.io/badge/Code-MIT-green.svg)](./LICENSE)
[![Built on Sekai KB](https://img.shields.io/badge/Built_on-sekai--kb-blue.svg)](https://github.com/wilsonkichoi/sekai-kb)

---

## What is this?

A curated knowledge base about Laguna Beach. Not Wikipedia (we have perspective).
Not a tourist brochure (we don't sell anything). A knowledgeable local showing you
around.

Every article is written and fact-checked by hand against primary sources, with
footnotes you can follow and verification dates you can see. Eight categories cover
the full spectrum of a seven-mile stretch of Southern California coastline: history,
art, nature, food, beaches, trails, events, neighborhoods.

This is a fresh codebase, not the site's first one. It replaced a Taiwan.md fork at
the same domain, and it is **instance #1** of
[Sekai KB](https://github.com/wilsonkichoi/sekai-kb) — the framework cut out of it,
so anyone can stand up the same knowledge base for their own place.

---

## 🗂️ Eight categories

|     | Category                                                          | What's inside                                              |
| --- | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| 📜  | [History](https://lagunabeach.md/history)                         | Founding, indigenous peoples, artists colony, historical events |
| 🎨  | [Art & Galleries](https://lagunabeach.md/art-galleries)           | Plein air painting, galleries, public art, art festivals    |
| 🌊  | [Nature & Marine Life](https://lagunabeach.md/nature-marine-life) | Tide pools, coastal ecology, marine protected areas, wildlife |
| 🍽️  | [Food](https://lagunabeach.md/food)                               | Restaurants, cafes, food history, local specialties         |
| 🏖️  | [Beaches](https://lagunabeach.md/beaches)                         | Individual beaches, access, conditions, surfing             |
| 🥾  | [Trails](https://lagunabeach.md/trails)                           | Hiking, coastal walks, trail conditions, views              |
| 🎭  | [Events & Festivals](https://lagunabeach.md/events-festivals)     | Pageant of the Masters, Sawdust Art Festival, seasonal events |
| 🏘️  | [Neighborhoods](https://lagunabeach.md/neighborhoods)             | Top of the World, Village, South Laguna, Canyon areas       |

Live article and category counts are always on
[the dashboard](https://lagunabeach.md/dashboard) and in
[`/kb/topics.json`](https://lagunabeach.md/kb/topics.json).

---

## ✨ What's here

- 📖 **Markdown SSOT** — every article is a plain `.md` file under `knowledge/`. The
  site is a projection of it, and the raw source is served back at
  [`/kb/articles/`](https://lagunabeach.md/kb/topics.json).
- 🤖 **AI-native by design** — [`/llms.txt`](https://lagunabeach.md/llms.txt),
  [`/kb/agent.md`](https://lagunabeach.md/kb/agent.md), and a lazy-loading knowledge
  protocol that costs one HTTP request per article, no clone required.
- 🔌 **Remote MCP endpoint** — tool-using clients connect once and query the whole
  corpus. See [For AI clients](#-for-ai-clients).
- 💬 **[Chat](https://lagunabeach.md/chat)** — retrieval-grounded answers over the
  knowledge base, backed by a Cloudflare Worker and a build-time embeddings index.
- 🕸️ **[Knowledge graph](https://lagunabeach.md/graph)** — interactive visualization
  of how articles connect.
- 🗺️ **[Map](https://lagunabeach.md/map)** — Leaflet + OpenStreetMap, markers derived
  from article frontmatter.
- 🔍 **Full-text search** — MiniSearch, indexed at build time, no server.
- 🔊 **[Soundscape](https://lagunabeach.md/soundscape)** — the place as it actually
  sounds.
- 📊 **[Dashboard](https://lagunabeach.md/dashboard)** and
  **[system page](https://lagunabeach.md/system)** — article health, coverage, and
  build provenance, in public.
- 🖼️ **On-demand OG images** — generated per article by a Worker, never at build time.
- 📣 **Reader feedback** — in-page widget writing to D1, triaged into GitHub issues.
- 📡 **[RSS](https://lagunabeach.md/rss.xml)** — plus a
  [changelog](https://lagunabeach.md/changelog) of what the knowledge base learned.
- 🛡️ **Quality gates** — `article-health` editorial linting, frontmatter schema
  tests, internal-link and graph checks, all enforced in CI.

---

## 🤖 For AI clients

The knowledge base is meant to be read by machines, not just crawled. Start here:

```
https://lagunabeach.md/llms.txt
```

That file points at everything else: the agent boot file (`/kb/agent.md`), the topic
index (`/kb/topics.json`), the search index, and the per-article raw Markdown at
`/kb/articles/{category}/{slug}.md`. One request per article, no scraping, no clone.

Tool-using clients can connect to the remote MCP server (Streamable HTTP) instead:

```
https://lagunabeach-mcp.d3v-m0nk3y.workers.dev
```

There is also a human-readable [`/ai`](https://lagunabeach.md/ai) page explaining
what is exposed and why.

---

## 🚀 Quick start

```bash
git clone https://github.com/wilsonkichoi/lagunabeach-md.git
cd lagunabeach-md
npm ci --force
uv sync
npm run dev
```

Then open <http://localhost:4321>.

`npm ci --force` is deliberate: the flag works around an npm lockfile validation
issue with optional native sub-dependencies ([npm#7758](https://github.com/npm/cli/issues/7758)),
and it is the same flag CI uses. All non-optional dependencies still install at
exact locked versions. `uv sync` creates the local `.venv` that powers the
`article-health` editorial linter — never invoke `pip` yourself.

Before committing:

```bash
npm run test && npm run build
```

Full toolchain and deployment steps are in
[`docs/runbook/DEPLOY.md`](./docs/runbook/DEPLOY.md).

---

## 🏗️ How it's built

```
lagunabeach-md/
├── knowledge/        ← 📖 SSOT — the articles, as plain Markdown
├── place.config.ts   ← 🪪 place identity: name, categories, map, features, links
├── public/media/     ← 🖼️ instance-owned images
├── src/              ← 🌐 Astro site (pages, layouts, components)
├── scripts/          ← ⚙️ build, prebuild, CI, and editorial tooling
├── workers/          ← ☁️ Cloudflare Workers: chat, mcp, feedback, og
├── docs/             ← 📚 playbook (editorial) + runbook (operations)
└── dev_docs/         ← 📐 PRD, SPEC, ROADMAP, ADRs, diagrams
```

The pipeline, in one line:

```
knowledge/ → sync.sh → parallel prebuild (index, search, dates, git info, related, changelog, map, dashboard) → astro build → post-build contract checks
```

**Key principle:** all content lives in `knowledge/`. `src/content/` and `src/data/`
are derived, gitignored projections written by the sync step. Never edit them
directly.

---

## 📐 Editorial standards

Every article follows
[`docs/playbook/ARTICLE-PLAYBOOK.md`](./docs/playbook/ARTICLE-PLAYBOOK.md):

- **Story, not just information** — narrative arc, not bullet points.
- **Every fact verifiable** — dates, names, and sources must be checkable.
- **Concrete details** — every paragraph has an anchor noun: a name, year, place, or number.
- **Find the tension** — no tension, no article.
- **Friend-showing-you-around voice** — casual authority, not brochure speak.

The writing and rewriting stages are in
[`REWRITE-PIPELINE.md`](./docs/playbook/REWRITE-PIPELINE.md); claim verification is
in [`FACTCHECK-PIPELINE.md`](./docs/playbook/FACTCHECK-PIPELINE.md).

---

## 🤝 How to contribute

No programming skills needed. The most valuable contributions are local knowledge.

| Path                    | For whom                                     |
| ----------------------- | -------------------------------------------- |
| 📝 **Write an article** | Anyone who knows Laguna Beach                |
| 🔍 **Fix an error**     | Spotted something wrong? Open an issue       |
| 📷 **Add photos**       | CC-licensed images of Laguna Beach           |
| 🔴 **Fork & PR**        | Developers — edit `knowledge/` directly      |

👉 **[lagunabeach.md/contribute](https://lagunabeach.md/contribute)**

Edit only `knowledge/{Category}/*.md`. Run the applicable
`npm run article-health -- <file> --profile=...` gate, then `npm run test` and
`npm run build` before opening a PR. The pre-commit hook enforces a subset; don't
rely on it as your first check.

---

## 🌐 Built on Sekai KB

This repository is an **instance** of
[sekai-kb](https://github.com/wilsonkichoi/sekai-kb), the framework that was cut out
of it. The split is what keeps both maintainable:

- **Instance-owned** — `place.config.ts`, `knowledge/`, `public/media/`, `docs/`,
  `dev_docs/`, and this README. Laguna Beach identity lives here and only here.
- **Framework-owned** — `src/`, `scripts/`, `workers/`, and `.agents/skills/`. These
  arrive as tagged `sekai-kb-vX.Y.Z` releases and are merged in wholesale by
  `/sekai-upgrade`. Never framework `main`, only tags.

Two version markers, two different things: `VERSION` is LagunaBeach.md's own release,
and `FRAMEWORK-VERSION` records the adopted Sekai release. Mechanics are in
[`docs/runbook/UPGRADE.md`](./docs/runbook/UPGRADE.md); instance releases are in
[`docs/runbook/RELEASE.md`](./docs/runbook/RELEASE.md); the full agent-facing rules
are in [`AGENTS.md`](./AGENTS.md).

### Genericity

The split is machine-enforced, not a convention. Place identity may enter code only
through `place.config.ts`, `knowledge/`, and `public/media/` — zero place-specific
strings and zero non-English code paths anywhere in the code trees.
`npm run genericity` enforces it with a place-name denylist and an English-only
codepoint gate. Each gate states its own roots; both scan `src/`, `scripts/`,
`tests/`, `workers/`, and `.agents/skills/` today, and either can gain a root without
the other.

### Language support

UI strings and editorial tooling are English-calibrated. Latin-script content largely
works, though article-health thresholds can need per-instance tuning. CJK content is
unsupported until the planned multi-language revisit.

---

## 📜 License

Dual-licensed (see [`LICENSE`](./LICENSE)):

- **Content** (`knowledge/`, `public/media/`) — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/):
  free to share and adapt with attribution, share-alike.
- **Code** (everything else) — MIT.

---

## 🔗 Lineage

The site's design system was extracted from the archived `lagunabeach-md-v1`, which
was a fork of [Taiwan.md](https://github.com/frank890417/taiwan-md) by
[@frank890417](https://github.com/frank890417). Credit for the original design
language and the editorial philosophy behind it belongs there. This is a fresh
codebase with no upstream merge relationship — nothing flows in from that fork any
more, and everything it inherited was rewritten to be place-agnostic.

---

_Built with ❤️ in Laguna Beach._
