# Phase 5: Related-Articles Experiment — bge-m3 vs tag-overlap (2026-06-24)

## Setup

- **Corpus**: 18 en articles across 9 categories
- **bge-m3**: Ollama localhost, 1024-dim Int8 quantized, TOP_K=8 cosine neighbours
- **tag-overlap**: shared frontmatter `tags` count + wiki-link bonus (2 per link), TOP_K=8, threshold > 0

## Results

| Article                      | bge-m3 (count) | tag-overlap (count) | Agreement |
| ---------------------------- | -------------- | ------------------: | --------: |
| how-an-article-is-born       | 8              |                   2 |         2 |
| lagunabeach-md               | 8              |                   2 |         2 |
| visualization-catalog        | 8              |                   2 |         2 |
| laguna-art-museum            | 8              |                   5 |         3 |
| plein-air-painting           | 8              |                   5 |         4 |
| thousand-steps-beach         | 8              |                   3 |         3 |
| victoria-beach               | 8              |                   3 |         3 |
| pageant-of-the-masters       | 8              |                   4 |         4 |
| sawdust-art-festival         | 8              |                   3 |         3 |
| the-cliff-restaurant         | 8              |                   0 |         0 |
| founding-and-early-history   | 8              |                   5 |         4 |
| the-1993-firestorm           | 8              |                   3 |         3 |
| tide-pools                   | 8              |                   3 |         2 |
| whale-watching               | 8              |                   2 |         2 |
| south-laguna                 | 8              |                   3 |         3 |
| the-village                  | 8              |                   1 |         1 |
| laguna-coast-wilderness-park | 8              |                   2 |         1 |
| top-of-the-world             | 8              |                   2 |         1 |
| **Totals**                   | **144**        |              **50** |    **43** |

Agreement rate: 43/144 = 29.9% (where tag-overlap produces a result, it overlaps with bge-m3 86% of the time: 43/50).

## Analysis

### Where bge-m3 is better

- Always produces TOP_K=8 neighbours (semantic similarity fills sparse-tag gaps).
- `the-cliff-restaurant` has 0 tag-overlap neighbours (unique tags: restaurants, oceanfront, landmark, fine-dining, no overlap with any other article). bge-m3 correctly links it to nearby topics via textual semantics (trails/top-of-the-world for "ocean view" content similarity).
- Cross-category links are richer: e.g., `the-village` → `laguna-art-museum` via shared "downtown cultural" semantics, not captured by tags.

### Where tag-overlap is better

- Precision for strongly-tagged pairs: `plein-air-painting` ↔ `laguna-art-museum` share 3 tags + wiki-link = guaranteed top-rank. bge-m3 agrees but ranks them among 8 total, sometimes lower.
- Deterministic, reproducible, zero-cost. No model dependency.
- Wiki-link bonus directly encodes author intent (editorial links = deliberate relatedness signal).

### Failure modes

- **bge-m3 at 18 articles**: cosine distance between unrelated articles is still relatively high (corpus too small for good discrimination). Every article gets 8 neighbours even when many are weak. Some noise: `top-of-the-world` → `the-cliff-restaurant` likely from shared "ocean/view" vocabulary, not topical relatedness.
- **Tag-overlap at 18 articles**: sparse tags cause many articles to have 0-3 neighbours. Some categories have no tag overlap at all with others (`Food` is isolated). Coverage incomplete.

## Recommendation

**Ship tag-overlap for `src/data/related/` at 18-article scale.** Reasons:

1. Higher precision, lower noise. At 18 articles, "no recommendation" is better than a weak one.
2. Zero runtime dependency (no Ollama needed in CI or dev).
3. Wiki-links encode deliberate editorial connections.
4. Deterministic; reproducible in any environment.

**Keep bge-m3 for**:

- The future RAG chatbot (needs dense vectors regardless of corpus size).
- Switch to bge-m3 for related-articles when corpus grows past ~50-80 articles (where tag sparsity becomes a real problem and semantic density makes cosine more discriminating).
- The RAG artifacts (`public/api/rag/`) are already gitignored, so no CI cost.

**Current committed state**: `src/data/related/en.json` = bge-m3 output (18 keys, 8 neighbours each). If we want to swap to tag-overlap for production, replace with the tag-overlap output. Neither is wired into prebuild; both are manual-run.
