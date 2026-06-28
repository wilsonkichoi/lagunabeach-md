---
title: 'graph.md — LagunaBeach.md visualization editing guide'
description: 'DNA-layer canonical for in-article visualization: when to use which chart, how to do it well, module syntax, AI-readability, multilingual, visualization checklist.'
type: 'editorial-canonical'
status: 'canonical'
current_version: 'v2.0'
last_updated: 2026-06-12
last_session: '2026-06-12-225752-viz-evolution'
sister_docs:
  - 'EDITORIAL.md'
  - 'RESEARCH.md'
  - 'CITATION-GUIDE.md'
upstream_canonical:
  - '../semiont/MANIFESTO.md'
related:
  - '../../reports/viz-system-evolution-2026-06-12.md'
  - '../../reports/article-visualization-design-2026-06-06.md'
  - '../../src/styles/article-modules.css'
  - '../pipelines/REWRITE-PIPELINE.md'
  - '../factory/SPORE-IG-PIPELINE.md'
---

# graph.md — visualization editing guide

> **🖼️ Live examples (how the modules actually render)**: [Visualization module catalog](/about/visualization-catalog) (`knowledge/About/visualization-catalog.md`). This file covers "when / how / syntax"; the catalog page lets you see "what it looks like." The two are companions.
>
> This is the canonical for in-article "data visualization / visual comparison." Read it when writing via [REWRITE-PIPELINE](../pipelines/REWRITE-PIPELINE.md) Stage 2 ("visualization thinking") + Stage 4 ("visualization check").
>
> Design context (why these technical choices, The Pudding reference research): [reports/article-visualization-design-2026-06-06.md](../../reports/article-visualization-design-2026-06-06.md). Module styles: [src/styles/article-modules.css](../../src/styles/article-modules.css). Rendering: `article.template.astro` → `renderTwModule` in `src/utils/article-render.ts`.

> **Inherited-renderer note (flagged for a later code batch):** the module class prefix is `tw-*` (Taiwan.md heritage) and is the literal keyword the renderer dispatches on (`src/utils/article-render.ts`) — **do not rename it in articles; it must match the code.** A few in-block markers are also still Chinese-only in the renderer: the note-box kind (`說明`/`方法`/`註`/`更正`/`更新`), the isotype unit row (`單位：`), and the line-chart baseline row (`基準：`). The cross-module source row accepts English (`Source:` / `source:`). Until the renderer is de-Taiwaned, type the literal tokens shown in §4; English glosses are given alongside each.

---

## 1. Why visualize (it's not "a nice picture")

Visualization serves several missions at once for LagunaBeach.md:

- **Anti-entropy**: compress a dense paragraph of numbers into a structure readable at a glance.
- **Curation, not encyclopedia**: the soul of narrative visualization is **annotation (writing "why this matters" directly on the chart)** — Wikipedia gives a neutral chart; we give an annotated one with a point of view.
- **Accuracy / credibility**: honest axes, source labels, sampling-bias disclosure. This is a differentiator.
- **AI-SEO** (most critical): **"a visualization an LLM can read = a durable visualization."** Our charts use semantic HTML / inline SVG + a data-table fallback, so humans, screen readers, Google, and GPTBot/PerplexityBot/ClaudeBot can all read them, and translation tooling can localize them. Image-type and D3/Canvas viz are black holes to AI crawlers — **banned**.

**Iron rule in one line**: never write "as shown above / as shown below" — AI crawlers can't see the chart, so the phrase is meaningless to them. Key values always go into the prose too.

---

## 2. The catalog — when to use which (pick by "data relationship," not by "looks good")

Skeleton: the FT Visual Vocabulary nine families + big number + qualitative. **First ask: "what data relationship does this question need to answer?"**

| Category (data relationship)                              | Use                                                                                   | Don't use                                             | Module                                                                        |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Comparison** how different are these?                   | bar / dot plot / **slope (exactly two points)** / qualitative two-system              | line for time series; dot plot for >20 categories     | `tw-bars` / `tw-slope` / `tw-versus`                                          |
| **Ranking** who's biggest / what place?                   | sorted horizontal bars / sorted table / dot strip                                     | when the point is the value gap, not the rank         | `tw-bars` (sorted) / `tw-dot`                                                 |
| **Deviation ±** how far from a baseline?                  | diverging bars (0 on the center line) / Likert stack                                  | a truncated-axis plain bar                            | `tw-bars` (auto-diverges with negatives) / `tw-stack`                         |
| **Part-to-whole** how do parts compose the whole?         | pie (≤5 categories) / **stacked bar (cross-row compare)** / **waffle (single whole)** | pie for >5 categories; when precise reading is needed | `tw-waffle` (one whole) / `tw-stack` (cross-row composition)                  |
| **Distribution** how is the data spread?                  | **dot strip (shared axis)** / pyramid (back-to-back) / histogram                      | —                                                     | `tw-dot` / `tw-pyramid`; histogram is v3                                      |
| **Correlation** are two variables related?                | scatter / bubble / **heatmap matrix**                                                 | thousands of overlapping points                       | `tw-heatmap`; scatter is v3                                                   |
| **Trend / time** how does it change over time?            | **line (with baseline)** / slope (exactly two points) / area                          | <5 points and single series → use bars                | `tw-line` (multi-series + `基準：`) / `tw-slope`                              |
| **Humanize magnitude** make a big number land?            | **isotype (1 symbol = N)** / big-number card                                          | half a symbol for a fraction                          | `tw-iso` / `tw-figure`                                                        |
| **Flow** how does it move / convert?                      | Sankey / funnel                                                                       | side-by-side comparison                               | (v3; use `tw-stack` or a table for now)                                       |
| **Geography** geographic distribution?                    | tile cartogram (equal tiles, needs normalized rates) / choropleth                     | raw counts, not normalized                            | `tw-tiles` (**inherited Taiwan 22-county layout — no LB analog yet; see §9**) |
| **Hierarchy / network** structure / relationships?        | tree / network                                                                        | hairball graph (filter first)                         | (rare, v3)                                                                    |
| **Single key number** is this number important?           | big-number card (always with context)                                                 | a bare number with no context                         | `tw-figure` / `tw-stat`                                                       |
| **Qualitative / annotation** which sentence matters most? | pull quote / annotated timeline / **note box**                                        | ~~word cloud~~                                        | `tw-quote` / `tw-timeline` / `tw-source` / `tw-note`                          |

### 🚫 Banned (never)

- **word cloud** (looks intuitive, analytically weak; importance ≠ frequency)
- **3D charts, 3D pie, exploded pie** (chartjunk)
- **dual Y-axis** (the reader can't tell which line maps to which axis)
- **truncated-Y bar charts** (systematically exaggerate differences; even when told about the truncation, readers still overestimate — Correll CHI 2020)
- **pie with more than 5 slices** / **un-normalized choropleth** (large-area regions dominate but have few people)
- **image-type charts / D3 / Canvas** (AI-crawler black holes; have to be re-made per language)

---

## 3. How to do it well (each rule has a good/bad pair)

1. **Title states the point, not the label**: ✅ "LAM, founded 1918, is the oldest cultural institution in Orange County" ❌ "Laguna Art Museum timeline." A reader who reads only the title should walk away with the takeaway.
2. **Direct labels > legend**: label the line endpoint directly (`tw-line` does this automatically); don't make the eye jump between legend and line.
3. **Three color rules**: ① semantic color (red = danger, green = good) but 8% of men are red-green colorblind → ② use a colorblind-friendly palette (the modules use a warm-orange / cool-cyan / green Okabe-Ito set) ③ **color must never be the only encoding** (pair with text/shape). Meet WCAG contrast (graphics 3:1, text 4.5:1).
4. **Sort**: almost always sort (large → small), unless the category is fixed (months / ages / years keep their natural order).
5. **Honest axes**: bars **always start at 0**; lines need not start at 0, but `tw-line` marks the y-axis min/max so the reader sees the range.
6. **data-ink**: cut 3D / shadows / redundant gridlines / duplicate legends (Tufte). The modules are clean by default.
7. **Narrative-type, five layers** (LagunaBeach.md uses narrative, not exploratory viz): author picks the takeaway / **one chart, one point** (a chart saying two things gets split into two) / **annotation is a first-class citizen** / progressive disclosure / text and chart collaborate (chart isn't decoration).
8. **Accessibility + credibility**:
   - Charts (`tw-line`/`tw-slope`/`tw-stack`/`tw-tiles`/`tw-heatmap`) carry an automatic **data-table fallback** + `aria-label`.
   - **Every data module labels its source**: add a `Source: institution, year` row inside the fenced block (auto-becomes the source caption; works on all modules).
   - Disclose sampling bias; warn at N<30, don't draw a trend line at N<10; disclose uncertainty where you can.
9. **Visible-by-default**: don't hide important info behind hover / click / scroll triggers. The NYT graphics desk's conclusion: "if you made a tooltip, assume no one will see it"; Datawrapper refuses to ship dropdowns. We're a static site, so this holds for free — treat it as an iron rule, don't find a way around it.
10. **Emphasis + gray context**: when a chart tells the story of "one of them," highlight that row with `*` (supported by `tw-bars`/`tw-slope`/`tw-dot`); the rest auto-dim into context. This speaks more clearly than "color everything" (Datawrapper: context grey + 1-2 highlighted).
11. **Note and correction convention** (error boundary = traceability): explain a data section's calculation method with `tw-note` (`說明` = explanation / `方法` = method); keep a post-publication correction in place with (`註` = note / `更正` = correction) rather than erasing it. The reader seeing how you calculated and what you missed is a trust signal, not a blemish.
12. **Leave breathing room for labels**: if this content is ever translated, label lengths differ across languages. SVG endpoint-label bounds are computed dynamically, but when writing, keep series names short and category names (tiles/stacks) concise.

---

## 4. Module syntax (17 modules, ` ```tw-* ` fenced block, `|` separates columns)

> **Shared conventions (v2.0, consistent across all modules):**
>
> 1. **Source row**: any row `Source: …` / `source: …` (Chinese `來源：` / `資料來源：` also accepted) is extracted into the module's source caption below it (**all 17 modules support it**).
> 2. **Title row**: for data modules (bars/stat/versus/timeline/heatmap/slope/dot/stack/pyramid/tiles/iso), a first row **with no `|`** is treated as the module title — write it as an assertion per §3.1.
> 3. **Emphasis row**: in `tw-bars` / `tw-slope` / `tw-dot`, a label beginning with `*` highlights that row and dims the rest.
> 4. Modules read tokens.css → dark mode / responsive / fonts are automatic.

### 📐 Editorial modules (semantic HTML, natively AI-readable)

**`tw-figure` big number** — one dramatic figure / before→after:

````
```tw-figure
441 homes
destroyed in the 1993 Laguna firestorm, October 27, 1993
City of Laguna Beach after-action report
```
````

line1 the big number (a `→` makes it before→after); line2 caption; line3 source. **When to use**: one figure that can act as a "sledgehammer stat."

**`tw-stat` stat group** — 2-4 key numbers side by side:

````
```tw-stat
441 | homes destroyed | 1993 firestorm
270 | homes damaged | 1993 firestorm
0 | fatalities | evacuation succeeded
```
````

each row `value | label | note`. **When to use**: a paragraph crammed with 3-4 parallel numbers.

**`tw-versus` comparison card** — two systems / two routes side by side:

````
```tw-versus
Sawdust Art Festival | Pageant of the Masters
Founded 1966, artist-run, hand-built booths | Running since 1933, living-pictures show
Open, come-as-you-are aesthetic | Volunteers recreate famous artworks
```
````

line1 `left title | right title`; the rest `left | right`. **When to use**: a point-by-point contrast of two systems / positions / before-and-after.

**`tw-bars` proportion bars** — horizontal bars (comparison / ranking, auto-scaled by value):

````
```tw-bars
Homes destroyed | 441 | total loss
Homes damaged | 270
Source: City of Laguna Beach
```
````

each row `label | value | note`. **When to use**: value comparison or ranking across a few categories.

**`tw-waffle` waffle chart** — 100-cell part-to-whole:

````
```tw-waffle
Laguna's land vs. its protected open space
City area (sq mi) | 8.84
Surrounding wilderness (thousand acres) | 20
```
````

optional title (no `|`) + each row `category | percent`. **When to use**: proportional composition (sums to ≈ 100). _(Use real, sourced percentages — the row above mixes units for illustration only.)_

**`tw-timeline` timeline** — node timeline (a visual aid, **not** the body's chronological subheads):

````
```tw-timeline
1918 | Laguna Beach Art Association founded | becomes the oldest cultural institution in Orange County
1929 | Cliff Drive building opens | the Mission Revival structure at 307 Cliff Drive
1996 | renamed Laguna Art Museum | to reflect a broader California-art scope
```
````

each row `year | title | description`. **When to use**: the key nodes of an institution's or policy's development.

**`tw-quote` quote card** — an enlarged key quote:

````
```tw-quote
Before the fire and after the fire is how we date everything now.
Long-time resident | recalling the 1993 firestorm
```
````

line1 the quote (don't add quotation marks; the module adds them); line2 `name | role/occasion`. **When to use**: a verbatim quote that captures the core tension (the quote must be Ctrl-F verifiable per [CITATION-GUIDE](CITATION-GUIDE.md)).

**`tw-source` source chip** — a standalone source / method chip:

````
```tw-source
City of Laguna Beach, Laguna Beach Historical Society, Los Angeles Times archive
```
````

the whole block is the source. **When to use**: the concentrated source statement for a section of analysis.

**`tw-note` note box** — method explanation / correction (inherited Reporter-style convention; error boundary = traceability):

````
```tw-note
說明
Acreage figures are reported burn area, not the area within city limits.
```
````

line1 can be `說明` (explanation) / `方法` (method) / `註` (note) / `更正` (correction) / `更新` (update) — _these markers are still Chinese-only in the renderer; type the literal token (omit = `說明`)_; each remaining line is a paragraph. `註` / `更正` get a warm marker. **When to use**: explain a calculation or sampling scope; leave a post-publication correction in place (per §3.11).

### 📊 Chart modules (inline SVG / matrix, ship with a data-table fallback → AI-readable)

**`tw-line` line chart** — trend (single or multi-series, auto y-axis label + data-table fallback):

````
```tw-line
Festival founding years on the Laguna arts calendar
Year | Festivals running
1933 | 1
1966 | 2
Source: knowledge/Events & Festivals
```
````

line1 title; line2 `x-axis name | series1 | series2…`; the rest `x-value | y1 | y2…`. **When to use**: a trend over ≥4 time points. **Auto-generates a `<table class="tw-sr-only">` for AI / screen readers.** _(Use a real sourced series; the two-point example above is illustrative.)_

Advanced: add a row `基準：label | value` to draw a **baseline** (dashed, no endpoints, single label) — _the `基準：` marker is still Chinese-only in the renderer._ Area fill is drawn only for a single series (overlapping areas hide each other). Keep series ≤ 3; split the chart beyond that (§3.7 one chart, one point).

**`tw-slope` slope chart** — change between exactly two time points (leaner than a line, more expressive than before→after text):

````
```tw-slope
Pageant of the Masters: a wartime pause
1941 | 1946
*Annual run | 1 | 1
Source: knowledge/Events & Festivals/pageant-of-the-masters.md
```
````

line1 title (optional); header `left time | right time` (exactly 2 columns); rows `label | left value | right value`, `*` to emphasize. Ships with a data-table fallback + endpoint-label de-overlap. **When to use**: exactly two time points, comparing which items rose or fell. _(Illustrative; supply a real sourced series.)_

**`tw-dot` dot plot** — dot strip / range (all rows share one ruler):

````
```tw-dot
Homes affected by the 1993 firestorm
*Destroyed | 441 | total loss
Damaged | 270
Source: City of Laguna Beach
```
````

each row `label | value | (note)` or `label | start | end | (note)` (two values draw a range arrow). **When to use**: see distribution and outliers (the shared axis is what distinguishes it from bars); the multi-item version of before→after.

**`tw-stack` stacked bar** — 100% composition, compared across rows:

````
```tw-stack
Pageant vs. Sawdust: founding era
Festival | Pre-1950 | Post-1960
Pageant of the Masters (1933) | 100 | 0
Sawdust (1966) | 0 | 100
Source: knowledge/Events & Festivals
```
````

header `row-name column | cat1 | cat2…`; each row auto-normalizes to 100%, segments ≥10% wide are labeled in place. Ships with a data-table fallback. **When to use**: comparing "composition" across years / places / groups (waffle can only draw one whole); binary oppositions. Categories ≤ 5. _(Illustrative composition.)_

**`tw-pyramid` pyramid** — back-to-back bars (left/right comparison):

````
```tw-pyramid
1993 firestorm: destroyed vs. damaged
Category | Destroyed | Damaged
Homes | 441 | 270
Source: City of Laguna Beach
```
````

header `group-column name | left name | right name`; left and right share one scale (honest comparison). **When to use**: population pyramids, male/female, imports/exports — any "two camps compared group by group."

**`tw-tiles` tile cartogram** — **inherited Taiwan 22-county tile cartogram.** The layout is hardcoded in the renderer to Taiwan's counties; **it has no LagunaBeach.md analog** (Laguna Beach is a single city, not a set of counties) and is unused by LB content. Kept as inherited infrastructure; see §9. If a future LB fork needs a geographic cartogram (e.g. neighborhoods), that's a renderer change, not an article-syntax change. Documented here only so the module isn't mistaken for missing.

**`tw-iso` isotype** — 1 symbol = N:

````
```tw-iso
The toll of the 1993 firestorm
單位：● = 50 homes
Destroyed | 441 | 1993
Source: City of Laguna Beach
```
````

optional config row `單位：symbol = count unit-name` (_this `單位：` marker is still Chinese-only in the renderer_; omit = ●, 1:1); each row `label | value | (note)`. Symbol count is rounded to a whole number (FT rule: no half-symbols for fractions); the exact value sits alongside as text. **When to use**: turn an abstract big number into countable units. Keep the symbol count within ~30 (tune `單位：`).

**`tw-heatmap` heatmap** — matrix (each column normalized to a shade; it's a table itself → AI-readable):

````
```tw-heatmap
Festival | Year founded | Decades running
Pageant of the Masters | 1933 | 9
Sawdust Art Festival | 1966 | 6
Laguna Art Museum | 1918 | 10
Source: knowledge/Events & Festivals, Art & Galleries
```
````

line1 `corner label | col1 | col2…`; the rest `row label | v1 | v2…`. **When to use**: region × metric, year × category matrix comparison.

---

## 5. Multilingual (three-layer separation; translation never touches geometry)

```
viz text
├── geometry (coordinates/scale/color) → lives with the data in the fenced block's number columns → language-independent, not translated
├── contextual text (labels/title/annotation/source) → the fenced block's text columns, part of the .md → translated naturally
└── format (months / thousands separators) → i18n automation
```

When writing, put "text that will be read" (labels, titles, notes, sources) in natural language; translation tooling sees text columns while geometry (numbers) stays as-is. **This is a structural advantage over Datawrapper (which needs a duplicate per language).**

---

## 6. AI-readability (self-check item by item)

1. **Data is in the initial HTML** (modules are build-time semantic HTML, ✅).
2. **Charts ship a data-table fallback** (`tw-line`/`tw-slope`/`tw-stack`/`tw-tiles` auto `<table class="tw-sr-only">`; `tw-heatmap` is itself a table; the values in `tw-dot`/`tw-pyramid`/`tw-iso` are DOM text, ✅).
3. **`tw-figure` caption / chart title carries the full interpretation**, not "Figure 1." aria-label formula (Datawrapper/Cesal): chart type + data content + takeaway.
4. **Never write "as shown above / below"**; key values go into the prose so an LLM can extract them.
5. **No image-type viz / D3 / Canvas** (AI black holes).
6. **Translation safety net**: a module's text columns are part of the .md (translated naturally), geometry numbers stay as-is.

---

## 7. Pre-publish visualization checklist (7 layers, runs in REWRITE-PIPELINE Stage 4)

**① Data accuracy**: numbers triple-checked (every figure traces to `knowledge/`, Rule 12) / bars start at 0 / percentages sum correctly / time range fair, not selectively truncated / sampling bias disclosed.
**② Chart-type choice**: is this the best chart for the question? Is there a simpler way? Does it match the reader's visual literacy?
**③ Title and text**: does the title state the takeaway (an assertion, not a noun label)? Is the source labeled? Do key points have annotation? Is all important info visible by default (not hidden behind interaction)?
**④ Visual design**: any chartjunk to cut? WCAG contrast met? Colorblind-readable (not color alone)? Sorted?
**⑤ Accessibility**: data-table fallback present? aria-label? Readable at 200% zoom?
**⑥ Mobile**: legible on a phone (text not tiny or cramped)? (modules are responsive, still preview them)
**⑦ Overall narrative**: one chart, one point? Text and chart collaborate without repeating? Can the reader walk away with the correct takeaway from chart + title alone? No element that could be misread as misleading?

**Automated gate**: `python3 scripts/tools/article-health.py {file} --check=viz-health` (source labeling / "as shown above" AI-blind phrasing / chart table fallback). Part of the `rewrite-stage-4` profile.

**Pixel gate** (instrumented 2026-06-12): `node scripts/tools/viz-shot.mjs` (with the dev server running, screenshots every `tw-*` module on the page per component, in light/dark/mobile variants; module list auto-detected). The output PNGs must be **looked at by a human, one by one**, before verification counts as done. Why it's an iron rule: markup existing ≠ visually correct — in v1.0 the quote/heatmap modules were broken in production for six days while curl verification was all green, because only class-name existence was checked, not pixels. **Run it on any module-style / renderer / site-wide prose-CSS change** (site-wide style changes cascade into modules; only the pixel layer catches it).

---

## 8. Anti-pattern gallery (like EDITORIAL's banned phrases — flag these on sight)

| ❌ Anti-pattern                                  | Why it's wrong                                                            | ✅ Fix                                                                                                         |
| ------------------------------------------------ | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| truncated-Y bar chart                            | systematically exaggerates differences                                    | start Y at 0; to stress a gap use a dot plot + sorting                                                         |
| pie with 8 slices                                | the eye compares angles poorly                                            | `tw-bars` sorted, or `tw-waffle`                                                                               |
| word cloud                                       | importance ≠ frequency, analytically weak                                 | `tw-bars` of term frequency, or pick key terms as annotation                                                   |
| "as shown below, X is highest"                   | AI crawlers can't see the chart                                           | "X is highest at N (see table below)" + values in prose                                                        |
| red/green to show +/-                            | 8% of men are colorblind                                                  | warm-orange / cool-cyan + text labels                                                                          |
| rainbow scale for continuous values              | no semantics, misleading                                                  | single hue light→dark (`tw-heatmap` already does this)                                                         |
| chart with no source                             | credibility collapses                                                     | add a `Source: …` row in the fenced block                                                                      |
| large area in one saturated highlight color      | harsh + adjacent categories blur (highlight color is for small areas)     | dim large areas; separate categories on both lightness and saturation                                          |
| dark category sinks into dark background         | a waffle/heatmap category lacks contrast with the base = uncountable      | every category must read clearly against both its neighbors and the base                                       |
| baseline drawn as a measured series              | endpoint dots + per-point labels make a constant threshold look measured  | draw the baseline with `tw-line`'s `基準：` row (dashed, no dots)                                              |
| one chart mixing time + cross-section + baseline | after sorting, the reader can't tell what's comparable (mixed dimensions) | one chart, one dimension; make the baseline a dashed ref or move it to annotation                              |
| two-hue continuous scale (cool→warm)             | the midpoint muddies + implies diverging semantics on continuous data     | continuous values always single-hue light→dark; use two-hue only for genuinely diverging data (white midpoint) |
| tile/map showing raw counts                      | populous regions are always darkest; the map just draws population        | normalize to a rate first (per-capita / per-household / %)                                                     |
| grouped bars used to compare totals              | the reader can't eyeball the sum                                          | compare totals with single bars; compare composition with `tw-stack`                                           |
| legend separate from the data                    | the eye ping-pongs between legend and chart (legend-hunting)              | direct labels (built in: line endpoints, in-segment stack values, numbers on tiles)                            |
| multi-series line all area-filled                | areas overlap into a blob, you can't tell which covers which              | area fill only for a single series (built in); for multi-series use small multiples                            |
| SVG text scaling with the container              | a 320px design at 720px column width balloons axis labels to 25px         | chart SVG capped at 520px centered (built in)                                                                  |

---

## 9. Boundaries + v3 candidates

- **Not every article needs a chart.** If there's no suitable data, honestly add none (avoid chartjunk). REWRITE-PIPELINE Stage 2 only asks that you **evaluated** visualization candidates, not that you force one in.
- **Hub pages / short corrections / pure-profile reflective pieces**: may use none.
- **`tw-tiles` (Taiwan county cartogram)**: inherited and unused — Laguna Beach is one city, so the 22-county geographic module has no LB content. Left in place as infrastructure; a future LB geographic cartogram (neighborhoods, beaches) would be a renderer change. Flagged for the code-layer de-Taiwan work, not an article-writing concern.
- **Complex needs outside the modules**: fall back to prose + a data table; don't hand-roll heavy JS. Every HARD type has an EASY substitute:

| What you want   | Substitute (existing module)                                          |
| --------------- | --------------------------------------------------------------------- |
| Sankey / chord  | `tw-stack` (two-stage flow) or `tw-heatmap` (flow matrix)             |
| scatter plot    | `tw-heatmap` (binned matrix) or prose + table; v3 candidate           |
| histogram       | `tw-bars` (after binning); v3 candidate                               |
| network graph   | prose relationship description + `tw-versus`; rare                    |
| small multiples | repeat the same module (chart-pack structure: one section, one chart) |

- **v3 roadmap** (per [reports/viz-system-evolution-2026-06-12.md](../../reports/viz-system-evolution-2026-06-12.md)): scrollytelling-lite (CSS scroll-driven progressive disclosure) + DualChannel sticky (CSS sticky, zero JS) for 1-2 flagship features; scatter / histogram grow when a real article needs them.

---

_v2.0 | 2026-06-12 viz-evolution — modules 10→17 (+slope/dot/stack/pyramid/tiles/iso/note); shared conventions (title row / source row on all modules / `*` emphasis / `基準：` line); §3 +4 principles (visible-by-default / gray context / note convention / multilingual labels); §8 +6 anti-patterns (two-hue muddy midpoint / tile raw counts / legend-hunting / multi-series area / SVG text bloat / grouped bars for totals); fixed three v1.0 cascade leaks (quote frame / heatmap text color / source row on three modules). Visual verification 51 screenshots + external research: reports/viz-system-evolution-2026-06-12.md._
_v1.0 | 2026-06-06 — 10 modules + catalog + design principles + AI-readability + multilingual + checklist. Design research: reports/article-visualization-design-2026-06-06.md (referenced The Pudding, grew our own organ)._
