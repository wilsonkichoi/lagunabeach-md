# LagunaBeach.md Sub-Category Taxonomy

> Informed by museum taxonomy and library classification practice.
> Goal: give every article a clear second-level grouping that supports knowledge-graph clustering, navigation, and search.

---

## Design principles

1. **MECE** (Mutually Exclusive, Collectively Exhaustive): each article belongs to exactly one subcategory.
2. **5-15 articles per subcategory**: merge if too few, split if too many.
3. **Reader-oriented**: organize by "what do I want to read" rather than academic classification.
4. **Extensible**: a new article should fall naturally into an existing subcategory.
5. **Frontmatter field**: `subcategory: 'Name'` written in every article.

Subcategories marked **(in use)** already appear on at least one article. The rest are reserved slots for articles still to come; add or rename them here before using a new value.

---

## Categories x Sub-Category

`About` is exempt: those pages explain the project itself and carry no subcategory.

### 🎨 Art & Galleries

| Sub-Category                        | Scope                                                        |
| ----------------------------------- | ------------------------------------------------------------ |
| Museums & Institutions **(in use)** | Laguna Art Museum, foundations, arts nonprofits              |
| Painting Traditions **(in use)**    | Plein air painting, watercolor, the early art colony's craft |
| Galleries & Art Walk                | Commercial galleries, First Thursdays Art Walk               |
| Public Art                          | Murals, sculpture, installations                             |
| Artists & Studios                   | Resident artists, studio culture, working spaces             |

### 🏖️ Beaches

| Sub-Category                 | Scope                                                   |
| ---------------------------- | ------------------------------------------------------- |
| Beaches & Coves **(in use)** | Thousand Steps, Victoria, Main Beach, the hidden coves  |
| Coastal Access & Landmarks   | Stairways, lookouts, piers, beachfront landmarks        |
| Surf & Water Sports          | Surfing, bodysurfing, diving, tide-dependent recreation |

### 🎭 Events & Festivals

| Sub-Category                      | Scope                                                          |
| --------------------------------- | -------------------------------------------------------------- |
| Summer Art Festivals **(in use)** | Pageant of the Masters, Sawdust Art Festival, Festival of Arts |
| Community Events                  | Parades, farmers markets, seasonal celebrations                |
| Music & Performance               | Concerts, theater, performing-arts events                      |

### 🍽️ Food

| Sub-Category                      | Scope                                                |
| --------------------------------- | ---------------------------------------------------- |
| Restaurants & Dining **(in use)** | Landmark restaurants, fine dining, oceanfront tables |
| Cafes & Casual                    | Coffee shops, bakeries, casual and counter eats      |
| Bars & Nightlife                  | Bars, breweries, evening spots                       |
| Local Flavors & Markets           | Markets, local producers, signature dishes           |

### 📜 History

| Sub-Category                      | Scope                                                     |
| --------------------------------- | --------------------------------------------------------- |
| Origins & Settlement **(in use)** | Acjachemen homeland, homesteaders, incorporation          |
| Art Colony Era                    | The early-1900s artists colony and its growth             |
| Fires & Disasters **(in use)**    | 1993 firestorm, floods, landslides, coastal hazards       |
| Civic & Development               | City growth, planning fights, preservation vs development |

### 🌊 Nature & Marine Life

| Sub-Category                         | Scope                                             |
| ------------------------------------ | ------------------------------------------------- |
| Tide Pools & Intertidal **(in use)** | Tide pools, intertidal species and ecology        |
| Marine Wildlife **(in use)**         | Whales, dolphins, sea lions, seabirds             |
| Marine Protected Areas               | Reserves, conservation zones, marine policy       |
| Coastal Ecology & Habitats           | Kelp forests, bluffs, beach and reef habitats     |
| Canyon & Hillside Ecology            | Inland canyons, chaparral, native flora and fauna |

### 🏘️ Neighborhoods

| Sub-Category                           | Scope                                                |
| -------------------------------------- | ---------------------------------------------------- |
| Neighborhoods & Districts **(in use)** | The Village, South Laguna, North Laguna, the canyons |
| Landmarks & Architecture               | Notable buildings, cottages, neighborhood landmarks  |

### 🥾 Trails

| Sub-Category                    | Scope                                                      |
| ------------------------------- | ---------------------------------------------------------- |
| Parks & Wilderness **(in use)** | Laguna Coast Wilderness Park, Aliso & Wood Canyons         |
| Trails & Overlooks **(in use)** | Named trails, ridgelines, viewpoints like Top of the World |
| Hiking & Mountain Biking        | Trail use, difficulty, recreation guidance                 |

---

## Frontmatter spec

```yaml
---
title: 'Article Title'
category: History
subcategory: 'Origins & Settlement' # ← required; must match a value in this file
tags: ['acjachemen', 'incorporation'] # ← cross-cutting links go here
# ...other fields
---
```

- `subcategory` is a string, **required** for all categories except `About`.
- The value must match one listed under that category in this file.
- Adding a new subcategory means updating this file first.

### Cross-cutting tags

Some themes cut across categories and should not be forced into one subcategory. Use `tags` to link them instead:

| Cross-cutting Tag | Spans                                          | Notes                                       |
| ----------------- | ---------------------------------------------- | ------------------------------------------- |
| `acjachemen`      | History / Neighborhoods / Nature & Marine Life | Indigenous Acjachemen presence and sites    |
| `plein-air`       | Art & Galleries / History / Events & Festivals | The plein air painting tradition            |
| `conservation`    | Nature & Marine Life / Trails / Beaches        | Habitat protection and environmental topics |
| `art-colony`      | History / Art & Galleries / Neighborhoods      | The town's identity as an art colony        |

> **Principle: subcategory = membership (one-to-one), tag = link (many-to-many).**
> An article belongs to exactly one subcategory but may carry several cross-cutting tags.

---

_Adapted for LagunaBeach.md from the upstream Taiwan.md taxonomy. References: museum classification, library decimal classification, Wikipedia category systems._
