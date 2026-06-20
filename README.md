# 🏖️ LagunaBeach.md

> **Open-source, AI-friendly knowledge base about Laguna Beach, California.**

[🌐 Live Site](https://lagunabeach.md) · [🕸️ Knowledge Graph](https://lagunabeach.md/graph) · [🗺️ Map](https://lagunabeach.md/map) · [🤝 Contribute](https://lagunabeach.md/contribute)

[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](CONTRIBUTING.md)
[![Built on Taiwan.md](https://img.shields.io/badge/Built_on-Taiwan.md-blue.svg)](https://github.com/frank890417/taiwan-md)

---

## What is this?

A curated knowledge base about Laguna Beach. Not Wikipedia (we have perspective). Not a tourist brochure (we don't sell anything). A knowledgeable local showing you around.

Forked from [Taiwan.md](https://github.com/frank890417/taiwan-md), an open-source knowledge base framework that grew to 1,000+ stars and 900+ articles. We took the infrastructure and adapted it for a seven-mile stretch of Southern California coastline.

---

## 📊 Stats

| Metric          | Count               |
| --------------- | ------------------- |
| 📄 Articles     | 18+                 |
| 📂 Categories   | 8                   |
| 🌐 Languages    | 2 (English + zh-TW) |
| 👥 Contributors | 1                   |

---

## 🗂️ 8 Categories

|     | Category                                                          | What's inside                                            |
| --- | ----------------------------------------------------------------- | -------------------------------------------------------- |
| 📜  | [History](https://lagunabeach.md/history)                         | Founding, indigenous peoples, art colony, 1993 firestorm |
| 🎨  | [Art & Galleries](https://lagunabeach.md/art-galleries)           | Plein air tradition, Laguna Art Museum, public art       |
| 🌊  | [Nature & Marine Life](https://lagunabeach.md/nature-marine-life) | Tide pools, marine reserves, whale watching, wildlife    |
| 🍽️  | [Food](https://lagunabeach.md/food)                               | Restaurants, cafes, food history, local specialties      |
| 🏖️  | [Beaches](https://lagunabeach.md/beaches)                         | Coves, surf spots, tide pools, coastal access            |
| 🥾  | [Trails](https://lagunabeach.md/trails)                           | Canyon walks, coastal paths, Wilderness Park             |
| 🎭  | [Events & Festivals](https://lagunabeach.md/events-festivals)     | Pageant of the Masters, Sawdust, Art-A-Fair              |
| 🏘️  | [Neighborhoods](https://lagunabeach.md/neighborhoods)             | North Laguna, Village, South Laguna, Top of the World    |

---

## ✨ Features

- 🤖 **AI-native** — Markdown SSOT, `llms.txt`, `robots.txt` welcomes crawlers
- 🕸️ **Knowledge graph** — interactive D3.js visualization of article connections
- 🗺️ **Real map** — Leaflet + OpenStreetMap with neighborhood filtering
- 🔍 **Full-text search** — MiniSearch indexes all articles at build time
- 🛡️ **Quality gates** — pre-commit hooks enforce editorial standards
- 📐 **Editorial pipeline** — 6-stage process from research to publish
- 🌐 **Multilingual** — English default + zh-TW secondary
- 📡 **RSS feed** — subscribe at `/rss.xml`
- 🔓 **CC BY-SA 4.0** — free to cite, remix, share

---

## 🚀 Quick Start

```bash
git clone https://github.com/wilsonkichoi/lagunabeach-md.git
cd lagunabeach-md
npm install    # postinstall runs sync.sh automatically
npm run dev    # http://localhost:4321
```

**Build:** `npm run build` (~25s for 18 articles)

---

## 🏗️ Architecture

```
lagunabeach-md/
├── knowledge/       ← 📖 SSOT — 8 categories + About
├── src/             ← 🌐 Astro v5 site (pages, layouts, components, i18n)
├── scripts/         ← ⚙️ Build scripts (sync, search index, map markers, OG images)
├── docs/            ← 📚 Documentation (editorial, semiont, pipelines)
├── public/          ← 📁 Static assets (images, API JSON, llms.txt)
└── MIGRATION.md     ← 📋 Fork rules and anti-patterns
```

**Key principle:** All content lives in `knowledge/`. The site is a projection. `scripts/core/sync.sh` syncs to `src/content/` at build time. Never edit `src/content/` directly.

---

## 🤝 How to Contribute

No programming skills needed. The most valuable contributions are local knowledge:

| Path                    | For whom                                |
| ----------------------- | --------------------------------------- |
| 📝 **Write an article** | Anyone who knows Laguna Beach           |
| 🔍 **Fix an error**     | Spotted something wrong? Open an issue  |
| 📷 **Add photos**       | CC-licensed images of Laguna Beach      |
| 🔴 **Fork & PR**        | Developers — edit `knowledge/` directly |

👉 **[lagunabeach.md/contribute](https://lagunabeach.md/contribute)**

---

## 📐 Editorial Standards

Every article follows the principles in [EDITORIAL.en.md](./docs/editorial/EDITORIAL.en.md):

- **Story, not just information** — narrative arc, not bullet points
- **Every fact verifiable** — dates, names, sources must be checkable
- **Concrete details** — every paragraph has an anchor noun (name, year, place, number)
- **Find the tension** — no tension = no article
- **Friend-showing-you-around voice** — casual authority, not brochure speak

---

## 🔗 Relationship to Taiwan.md

This is a fork of [frank890417/taiwan-md](https://github.com/frank890417/taiwan-md) following the [country-md-starter](https://github.com/frank890417/taiwan-md/blob/main/docs/fork/COUNTRY-MD-STARTER.md) pattern.

**What we inherited:** build pipeline, i18n routing, quality gates, editorial philosophy, knowledge graph, AI-friendly format.

**What we changed:** categories (8 for LB), default language (English), map (Leaflet), all content, branding.

**What stays untouched:** Chinese code comments (infrastructure docs), Semiont cognitive layer (dormant), all npm scripts and devDependencies.

Upstream infrastructure updates flow in via `git fetch upstream && git merge upstream/main`. Content is protected by `.gitattributes merge=ours`.

See [MIGRATION.md](./MIGRATION.md) for the full rules and anti-patterns.

---

## 📜 License

- **Content:** [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — free to share and adapt
- **Code:** MIT

---

## 👥 Contributors

<!-- ALL-CONTRIBUTORS-LIST:START -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/wilsonkichoi"><img src="https://avatars.githubusercontent.com/u/wilsonkichoi?v=4" width="100px;" alt=""/><br /><sub><b>Wilson Choi</b></sub></a><br />💻 📝 🎨 🤔</td>
  </tr>
</table>
<!-- ALL-CONTRIBUTORS-LIST:END -->

### Taiwan.md Contributors

The upstream project's contributors whose infrastructure makes this possible:

See [taiwan-md contributors](https://github.com/frank890417/taiwan-md/graphs/contributors)

---

## 📢 Follow

- GitHub: [wilsonkichoi/lagunabeach-md](https://github.com/wilsonkichoi/lagunabeach-md)

---

_Built with ❤️ in Laguna Beach, on the shoulders of [Taiwan.md](https://taiwan.md)._
