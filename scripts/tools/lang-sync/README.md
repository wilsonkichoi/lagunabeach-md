# lang-sync — multi-language translation toolchain

> LagunaBeach.md articles are English SSOT. This toolchain projects `knowledge/`
> into other languages (zh-TW when re-enabled, potentially others). Currently
> dormant — LB has no active translations. The infrastructure is inherited from
> Taiwan.md and kept for when a second locale is justified.
>
> **Methodology canonical**: [TRANSLATION-PIPELINE.md](../../../docs/pipelines/TRANSLATION-PIPELINE.md) (hard gates).

---

## Entry points (orchestrators)

| Tool                         | Purpose                                            | When to use                     |
| ---------------------------- | -------------------------------------------------- | ------------------------------- |
| `translate.py`               | **article translation cascade** (backend-agnostic) | main article babel entry (v4+)  |
| `diary-translate-cascade.sh` | **diary 5-lang parallel dispatch**                 | translate `docs/semiont/diary/` |
| `diary-translate.py`         | diary single-article + **inline integrity gate**   | cascade internal call; testing  |

## Quality / integrity gates

| Tool                         | What it checks                                      |
| ---------------------------- | --------------------------------------------------- |
| `diary-translation-audit.py` | diary integrity: truncation / refusal-stub / length |
| `verify-batch.py`            | article Stage P4 unified verification               |
| `verify-translation.py`      | single-article hard-gate                            |
| `cross-lang-audit.py`        | cross-language health check (SSOT as reference)     |
| `audit-quality.py`           | Stage Z6 automated quality scan                     |
| `status.py`                  | SSOT x translation projection status                |

## Batch preparation / routing

| Tool                    | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `prioritize-batch.py`   | smart priority sort + tier router (P0/P1/P2/P2.5/P3) |
| `prepare-batch.py`      | Stage P1 preprocessing (parallel sub-agent batches)  |
| `diff-patch-prepare.py` | patch-translate batch (translate only changed lines) |

## Metadata / backfill / maintenance

| Tool                           | Purpose                                      |
| ------------------------------ | -------------------------------------------- |
| `bump-source-sha.py`           | update stale translation to zh latest commit |
| `backfill-source-sha.py`       | one-time backfill frontmatter hash/fields    |
| `backfill-source-body-hash.py` | one-time backfill body hash                  |
| `lang-renormalize.py`          | cross-language slug normalization            |
| `sync-on-update.py`            | detect stale translations on article update  |

## Single-article / legacy translators

`ollama-translate.py` (local fallback) . `openrouter-translate.py` . `optimized-translate.py` (4-part decomposition)

## Helpers

`slug-suggest.py` (suggest en slug for untranslated articles) . `refresh.sh` (single-article ready-to-translate brief) . `compare-decomposition.sh` (task decomposition A/B)

## Docs

`AGENT-PROMPT-TEMPLATE.md` . `CRON-ROUTINE.md`

---

_Reorganized 2026-06-13 (diary session evolution), v2.0 2026-06-14: hardware layer delegated to GPU fleet. Regrounded to LB 2026-06-30._
