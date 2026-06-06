---
title: "Visualization Module Catalog: Ten Ways to See Taiwan's Housing Data"
description: "A live example of Taiwan.md's article visualization modules: using real Taiwan housing data to render each tw-* visual module once, read alongside graph.md's syntax and design principles."
date: 2026-06-06
author: 'Taiwan.md'
category: 'Society'
subcategory: '人權與平等'
tags: ['Data Visualization', 'Housing Justice', 'Housing Policy', 'Open Data']
readingTime: 8
lastVerified: 2026-06-06
lastHumanReview: false
featured: false
translatedFrom: 'Society/視覺化模組型錄.md'
sourceCommitSha: 'd540c3ae3'
sourceContentHash: 'sha256:672c83c08aa912fe'
sourceBodyHash: 'sha256:12d07dc9c8368b73'
translatedAt: '2026-06-07T00:37:30+08:00'
---

# Visualization Module Catalog: Ten Ways to See Taiwan's Housing Data

> **30-second overview:** This page is a "live example" of the Taiwan.md visualization system: it renders each of the ten in-article visual modules once, all using the same set of real Taiwan housing data, including the price-to-income ratio, National Housing, social housing, and international comparisons. It is a companion to the editorial guide [graph.md](https://github.com/frank890417/taiwan-md/blob/main/docs/editorial/graph.md): **graph.md explains "when to use which module, how to make it work well, and how to write the syntax"; this page lets you directly see "what it looks like."** Each module is rendered in pure HTML/SVG, so people, screen readers, Google, and AI crawlers all read the same data. This is precisely why we chose static visualization rather than interactive charts.

When writing an article about numbers, the greatest risk is turning data into stacked paragraphs of figures, leaving readers checked out by the third percentage. The work of visualization is to reverse the entropy of "dense numerical prose" into "a structure readable at a glance."

But Taiwan.md's visualizations have a discipline others do not: **we only make visualizations that LLMs can also understand**. An interactive chart drawn with D3 or Canvas may look impressive, but AI crawlers such as GPTBot, PerplexityBot, and ClaudeBot do not run JavaScript; to them, the chart is a blank space. In the charts we make with semantic HTML and inline SVG, the data is in the source code, allowing AI to read and cite Taiwan's first-person data across six languages. **Visualization that LLMs can understand is visualization with sovereignty.**

The ten modules below are shown in sequence, from the simplest "one big number" to a "multi-series line chart." The full syntax and design principles are in graph.md; here, each module gets only one sentence on what it is and when to use it.

## Big Figure tw-figure

The simplest and most forceful type: make one dramatic number as large as possible, then use before-and-after contrast to tell a story of transformation. Suitable as an opening "sledgehammer stat."

```tw-figure
NT$67,000 → NT$870,000 / ping
Taipei's Chenggong National Housing went from its unsold 1985 allotment price to its 2026 average brokerage-platform price: about 13 times higher at the same address
Actual Price Registration brokerage platforms (Chenggong National Housing)
```

## Stat Set tw-stat

When a paragraph contains three or four parallel key numbers, arranging them as a row of cards lets readers scan them at once instead of reading a long sentence.

```tw-stat
174,891 households | National Housing units directly built by the government | 1976–1999
Over 390,000 households | Total National Housing volume in the broad sense | Through abolition in 2015
84.4% | Taiwan's homeownership rate | 2024
```

## Versus Card tw-versus

A point-by-point comparison between two systems, two positions, or two before-and-after states. Warm color on the left, cool color on the right, with a "vs" in the middle, so differences can be read line by line.

```tw-versus
Taiwan's National Housing | Hong Kong's Home Ownership Scheme
Government subsidy, sold cheaply to residents | Government subsidy, sold cheaply to residents
Can be resold at full market price after one year of occupancy | Resale on the open market requires payment of a land premium first
Almost all appreciation goes to the individual | Appreciation is recovered by the public treasury according to the original discount ratio
Public housing stock is lost in one round | Public concessions can be recouped
```

## Bar Chart tw-bars

For comparing or ranking a small number of categories, the horizontal bar length automatically scales to the values, with the maximum filling the available width. Remember to add a final `Source:` row in the data module; it will automatically become the source note below.

```tw-bars
Nationwide 2014 | 8.41 times
Nationwide 2024 | 10.76 times
Taipei 2024 | 16.60 times | Historical peak
Source: Ministry of the Interior Real Estate Information Platform; NCCU Real Estate Research Center
```

## Waffle Chart tw-waffle

For part-to-whole proportions, one hundred squares represent 100 percent. It is more intuitive than a pie chart: you can actually count the squares. Suitable for data in which "how much each category accounts for" adds up to roughly 100.

```tw-waffle
Vienna's housing composition (2023)
Municipal social housing | 21.9
Limited-profit social housing | 21.4
Owner-occupied housing | 20.4
Private rental | 36.3
Source: City of Vienna (Stadt Wien) housing statistics
```

## Policy Timeline tw-timeline

A node-based timeline connecting the key context of a system or policy. Note that this is a "visual aid"; it is different from the rule that body subheadings should not be written chronologically, such as using "1975..." as a heading.

```tw-timeline
1975 | National Housing Act takes effect | The government built and sold units, creating a closed loop of "buyer eligibility" so subsidies could not leak out
2002 | That wall was torn down | A legal amendment removed buyer eligibility restrictions; after one year of occupancy, National Housing units could be sold to anyone
2015 | National Housing Act abolished | Official reason: the homeownership rate had reached 85%; policy shifted to social housing for rent only, not sale
2026 | Taoyuan reinstalls the gate | Affordable housing: resale may not exceed the original purchase price
```

## Quote Card tw-quote

When one sentence can represent the core tension of an entire article, enlarge it into a quote card. Do not add quotation marks yourself; the module will add them. The quotation must be verbatim and verifiable.

```tw-quote
A house with a market price of NT$30 million becomes a house worth NT$60 million to NT$70 million... robbing the poor to help the rich, with the state paying to help wealthy people redevelop their homes
Lin Chih-chun | Lawyer, criticizing a 2025 proposal for "the state to pay for the urban renewal of Chenggong National Housing"
```

## Source Strip tw-source

Gather the data sources for a section of analysis into a low-key chip placed beside the paragraph. Credibility is part of curation. Taiwan's digital media often forgets to cite sources; this is where we can do things differently.

```tw-source
Ministry of the Interior Real Estate Information Platform, Actual Price Registration, NCCU Real Estate Research Center, Legislative Yuan Gazette, Hong Kong Housing Authority
```

## Line Chart tw-line

For trends across four or more time points, an inline SVG draws the line, while the upper and lower bounds of the y-axis are labeled so readers can see the range. Most importantly, it **automatically generates a hidden data table**, allowing screen readers and AI crawlers to read the original data. The chart is for people; the table is for machines. Both come from the same source.

```tw-line
Ten-year rise in Taiwan's nationwide housing price-to-income ratio (times)
Year | Nationwide
2014 | 8.41
2016 | 9.32
2018 | 8.57
2020 | 9.20
2022 | 9.61
2024 | 10.76
Source: NCCU Real Estate Research Center; Ministry of the Interior Real Estate Information Platform
```

## Heatmap tw-heatmap

A matrix comparison for region-by-indicator or year-by-category data. Each column is normalized separately into color intensity; larger numbers are warmer. It is itself an HTML table, so it is inherently AI-readable. This is also why, in our system, a heatmap is better than "a colorful image."

```tw-heatmap
City/County | Price-to-income ratio (times) | Mortgage burden ratio (%)
Taipei | 16.60 | 63.9
New Taipei | 13.03 | 56.9
Taichung | 11.11 | 48.0
Taoyuan | 9.0 | 40.0
Source: Ministry of the Interior Real Estate Information Platform
```

## How to Use These Modules

Each module is written in an article's Markdown as a ` ```tw-* ` block, using `|` to divide columns. At build time, it is automatically converted into what you see above; authors do not need to write any HTML or JavaScript. The full syntax, guidance on when to use each type, principles for color and axes that avoid misleading readers, and the pre-publication visualization checklist are all in [graph.md](https://github.com/frank890417/taiwan-md/blob/main/docs/editorial/graph.md).

This system draws on the editorial philosophy of the visual storytelling publication [The Pudding](https://pudding.cool/): questions come before data, conclusions must be explicit, and annotation is the protagonist. But it has grown into an organ suited to Taiwan.md itself: static, multilingual, and AI-readable. The full design context is documented in the [Visualization System Design Report](https://github.com/frank890417/taiwan-md/blob/main/reports/article-visualization-design-2026-06-06.md).

To see how these modules are interwoven with narrative in a real long-form article, read [National Housing and Housing Justice](/society/國宅與居住正義). Most of the data on this page comes from that article's research.

**Further Reading**:

- [National Housing and Housing Justice](/society/國宅與居住正義) — The full story behind this housing data: how National Housing went from affordable homes to an asset escalator, and the data source for most modules on this page
- [Social Housing and Housing Justice](/society/社會住宅與居住正義) — The post-2016 path of social housing for rent only, not sale
- [Taiwan's Low Birthrate Crisis](/society/台灣少子化危機) — The other side of generational justice: unaffordable housing and the inability to have children

## References

[^1]: [Ministry of the Interior Real Estate Information Platform](https://pip.moi.gov.tw/Publicize/Info/E1050) — Official housing statistics including the housing price-to-income ratio, mortgage burden ratio, and homeownership rate.

[^2]: [NCCU Real Estate Research Center](https://rer.nccu.edu.tw/article/detail/2210058908437) — Historical housing affordability indicators; source for the nationwide housing price-to-income ratio series used in this page's line chart and bar chart.

[^3]: [Executive Yuan press release on abolishing the National Housing Act](https://www.ey.gov.tw/Page/9277F759E41CCD91/d4afaf10-ece5-4b4f-9482-35ce16bdc657) — Official data including cumulative National Housing households, approximately over 390,000 households.

## Image Sources

This article uses one Creative Commons-licensed image, cached in `public/article-images/society/`:

- [Taipei residential skyline from Xiangshan](https://commons.wikimedia.org/wiki/File:20260204_Taipei,_Taiwan_Skyline.jpg) — Photo: Heeheemalu, 2026, CC BY-SA 4.0 (hero)
