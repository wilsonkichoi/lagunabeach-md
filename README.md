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

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/frank890417"><img src="https://avatars.githubusercontent.com/u/4727572?v=4" width="100px;" alt=""/><br /><sub><b>frank890417</b></sub></a><br />💻 🖋️ 🌍</td>
    <td align="center"><a href="https://github.com/idlccp1984"><img src="https://avatars.githubusercontent.com/u/271929436?v=4" width="100px;" alt=""/><br /><sub><b>idlccp1984</b></sub></a><br />🖋️</td>
    <td align="center"><a href="https://github.com/Link1515"><img src="https://avatars.githubusercontent.com/u/88765055?v=4" width="100px;" alt=""/><br /><sub><b>Link1515</b></sub></a><br />💻 🌍</td>
    <td align="center"><a href="https://github.com/dreamline2"><img src="https://avatars.githubusercontent.com/u/4657845?v=4" width="100px;" alt=""/><br /><sub><b>dreamline2</b></sub></a><br />💻 🖋️ 🌍</td>
    <td align="center"><a href="https://github.com/YenTingWu"><img src="https://avatars.githubusercontent.com/u/57777349?v=4" width="100px;" alt=""/><br /><sub><b>YenTingWu</b></sub></a><br />💻 🌍</td>
    <td align="center"><a href="https://github.com/Zaious"><img src="https://avatars.githubusercontent.com/u/128442444?v=4" width="100px;" alt=""/><br /><sub><b>Zaious</b></sub></a><br />💻 🖋️ 🌍</td>
    <td align="center"><a href="https://github.com/fredchu"><img src="https://avatars.githubusercontent.com/u/1243384?v=4" width="100px;" alt=""/><br /><sub><b>fredchu</b></sub></a><br />💻 🖋️ 🌍</td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/wilsonkichoi"><img src="https://avatars.githubusercontent.com/u/734468?v=4" width="100px;" alt=""/><br /><sub><b>Wilson Choi</b></sub></a><br />💻 🖋️ 🎨 🤔 🌍 📝</td>
    <td align="center"><a href="https://github.com/AgendaLu"><img src="https://avatars.githubusercontent.com/u/43836432?v=4" width="100px;" alt=""/><br /><sub><b>AgendaLu</b></sub></a><br />💻 🌍</td>
    <td align="center"><a href="https://github.com/eryet"><img src="https://avatars.githubusercontent.com/u/48248414?v=4" width="100px;" alt=""/><br /><sub><b>eryet</b></sub></a><br />💻 🌍</td>
    <td align="center"><a href="https://github.com/bugnimusic"><img src="https://avatars.githubusercontent.com/u/260387338?v=4" width="100px;" alt=""/><br /><sub><b>bugnimusic</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/BrianHuang813"><img src="https://avatars.githubusercontent.com/u/66238110?v=4" width="100px;" alt=""/><br /><sub><b>BrianHuang813</b></sub></a><br />💻 🌍</td>
    <td align="center"><a href="https://github.com/p3nchan"><img src="https://avatars.githubusercontent.com/u/5032148?v=4" width="100px;" alt=""/><br /><sub><b>p3nchan</b></sub></a><br />🌍</td>
    <td align="center"><a href="https://github.com/weilinlai719"><img src="https://avatars.githubusercontent.com/u/173038591?v=4" width="100px;" alt=""/><br /><sub><b>weilinlai719</b></sub></a><br />💻</td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/iigmir"><img src="https://avatars.githubusercontent.com/u/11061770?v=4" width="100px;" alt=""/><br /><sub><b>iigmir</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/hansai-art"><img src="https://avatars.githubusercontent.com/u/132933660?v=4" width="100px;" alt=""/><br /><sub><b>hansai-art</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/vaiskalivuan"><img src="https://avatars.githubusercontent.com/u/270533697?v=4" width="100px;" alt=""/><br /><sub><b>vaiskalivuan</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/ceruleanstring"><img src="https://avatars.githubusercontent.com/u/265435204?v=4" width="100px;" alt=""/><br /><sub><b>ceruleanstring</b></sub></a><br />🌍</td>
    <td align="center"><a href="https://github.com/tboydar"><img src="https://avatars.githubusercontent.com/u/169805?v=4" width="100px;" alt=""/><br /><sub><b>tboydar</b></sub></a><br />💻 🖋️ 🌍</td>
    <td align="center"><a href="https://github.com/gn00295120"><img src="https://avatars.githubusercontent.com/u/30173341?v=4" width="100px;" alt=""/><br /><sub><b>gn00295120</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/r000tmnt"><img src="https://avatars.githubusercontent.com/u/62630285?v=4" width="100px;" alt=""/><br /><sub><b>r000tmnt</b></sub></a><br />💻</td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Ray0907"><img src="https://avatars.githubusercontent.com/u/29456968?v=4" width="100px;" alt=""/><br /><sub><b>Ray0907</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/jessejs0202"><img src="https://avatars.githubusercontent.com/u/247524286?v=4" width="100px;" alt=""/><br /><sub><b>jessejs0202</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/siansiansu"><img src="https://avatars.githubusercontent.com/u/33391637?v=4" width="100px;" alt=""/><br /><sub><b>siansiansu</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/Lisa123wang"><img src="https://avatars.githubusercontent.com/u/103297468?v=4" width="100px;" alt=""/><br /><sub><b>Lisa123wang</b></sub></a><br />🖋️ 🌍</td>
    <td align="center"><a href="https://github.com/Johnwang860424"><img src="https://avatars.githubusercontent.com/u/43649946?v=4" width="100px;" alt=""/><br /><sub><b>Johnwang860424</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/jekyll530"><img src="https://avatars.githubusercontent.com/u/150101610?v=4" width="100px;" alt=""/><br /><sub><b>jekyll530</b></sub></a><br />🖋️</td>
    <td align="center"><a href="https://github.com/f312213213"><img src="https://avatars.githubusercontent.com/u/71749524?v=4" width="100px;" alt=""/><br /><sub><b>f312213213</b></sub></a><br />💻</td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Yo0GuitarIT"><img src="https://avatars.githubusercontent.com/u/118150842?v=4" width="100px;" alt=""/><br /><sub><b>Yo0GuitarIT</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/expectingshadowland-maker"><img src="https://avatars.githubusercontent.com/u/276374199?v=4" width="100px;" alt=""/><br /><sub><b>expectingshadowland-maker</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/jacky1822"><img src="https://avatars.githubusercontent.com/u/94786796?v=4" width="100px;" alt=""/><br /><sub><b>jacky1822</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/k66inthesky"><img src="https://avatars.githubusercontent.com/u/45890492?v=4" width="100px;" alt=""/><br /><sub><b>k66inthesky</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/kevinyay945"><img src="https://avatars.githubusercontent.com/u/17717808?v=4" width="100px;" alt=""/><br /><sub><b>kevinyay945</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/littlecabin-co"><img src="https://avatars.githubusercontent.com/u/269660511?v=4" width="100px;" alt=""/><br /><sub><b>littlecabin-co</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/luofreddy"><img src="https://avatars.githubusercontent.com/u/85281073?v=4" width="100px;" alt=""/><br /><sub><b>luofreddy</b></sub></a><br />💻</td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/number053"><img src="https://avatars.githubusercontent.com/u/269151044?v=4" width="100px;" alt=""/><br /><sub><b>number053</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/ro9er117911"><img src="https://avatars.githubusercontent.com/u/127029993?v=4" width="100px;" alt=""/><br /><sub><b>ro9er117911</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/sageotomo"><img src="https://avatars.githubusercontent.com/u/271172009?v=4" width="100px;" alt=""/><br /><sub><b>sageotomo</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/Rushyuheng"><img src="https://avatars.githubusercontent.com/u/15012940?v=4" width="100px;" alt=""/><br /><sub><b>Rushyuheng</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/yuweichen1008"><img src="https://avatars.githubusercontent.com/u/12914366?v=4" width="100px;" alt=""/><br /><sub><b>yuweichen1008</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/x1001000"><img src="https://avatars.githubusercontent.com/u/6036508?v=4" width="100px;" alt=""/><br /><sub><b>x1001000</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/simanglam"><img src="https://avatars.githubusercontent.com/u/90334583?v=4" width="100px;" alt=""/><br /><sub><b>simanglam</b></sub></a><br />💻</td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/assanges"><img src="https://avatars.githubusercontent.com/u/4113063?v=4" width="100px;" alt=""/><br /><sub><b>assanges</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/RayHsu1117"><img src="https://avatars.githubusercontent.com/u/105488123?v=4" width="100px;" alt=""/><br /><sub><b>RayHsu1117</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/TWjohnwang"><img src="https://avatars.githubusercontent.com/u/108091299?v=4" width="100px;" alt=""/><br /><sub><b>TWjohnwang</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/howieyoung"><img src="https://avatars.githubusercontent.com/u/12218074?v=4" width="100px;" alt=""/><br /><sub><b>howieyoung</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/chenyi-wu"><img src="https://avatars.githubusercontent.com/u/66383520?v=4" width="100px;" alt=""/><br /><sub><b>chenyi-wu</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/joe32140"><img src="https://avatars.githubusercontent.com/u/6942982?v=4" width="100px;" alt=""/><br /><sub><b>joe32140</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/chipohao"><img src="https://avatars.githubusercontent.com/u/61603468?v=4" width="100px;" alt=""/><br /><sub><b>chipohao</b></sub></a><br />💻</td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/brianhu-tw"><img src="https://avatars.githubusercontent.com/u/9028425?v=4" width="100px;" alt=""/><br /><sub><b>brianhu-tw</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/AndyWang505"><img src="https://avatars.githubusercontent.com/u/71600455?v=4" width="100px;" alt=""/><br /><sub><b>AndyWang505</b></sub></a><br />💻</td>
    <td align="center"><a href="https://github.com/Aaron2464"><img src="https://avatars.githubusercontent.com/u/31269964?v=4" width="100px;" alt=""/><br /><sub><b>Aaron2464</b></sub></a><br />💻</td>
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
