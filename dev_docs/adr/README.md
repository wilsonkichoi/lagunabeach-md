# Decision records: LagunaBeach.md

Accepted architecture decisions for **this instance**. One numbered file each; numbers are
never reused, and a superseded record is marked superseded rather than deleted.

## In this repository

| ADR | Decision |
|---|---|
| [001](./001-hybrid-rebuild-in-fresh-repo.md) | Hybrid rebuild in a fresh repo — copy the fork's design system as files, rebuild the rest, retire the fork as the `lagunabeach-md-v1` archive. |
| [002](./002-framework-cut-as-scheduled-phase.md) | Cut the framework as a scheduled phase (Phase 5) with genericity CI-gated from day one, rather than framework-first or extraction-later. |

Both record how **lagunabeach.md** came to exist. They are LB's rebuild history and stay
here permanently.

## 003 through 008 moved to sekai-kb (2026-07-29, LB-62)

ADRs 003-007 governed framework code, not this instance, and they now live beside that
code in
[`sekai-kb/dev_docs/adr/`](https://github.com/wilsonkichoi/sekai-kb/tree/main/dev_docs/adr) at the
same numbers and filenames. ADR **008**, which records this ownership split itself, was
written there and never existed here.

| ADR | Decision | Where |
|---|---|---|
| 003 | Semiont as an opt-in plugin layer | [sekai-kb/dev_docs/adr/003-semiont-as-opt-in-plugin-layer.md](https://github.com/wilsonkichoi/sekai-kb/blob/main/dev_docs/adr/003-semiont-as-opt-in-plugin-layer.md) |
| 004 | Tagged-release upgrade discipline (instances merge immutable tags, never framework `main`) | [sekai-kb/dev_docs/adr/004-tagged-release-upgrade-discipline.md](https://github.com/wilsonkichoi/sekai-kb/blob/main/dev_docs/adr/004-tagged-release-upgrade-discipline.md) |
| 005 | Phases 9-12 extension (MCP delivery, analytics, operational automation, gated integrations) | [sekai-kb/dev_docs/adr/005-phases-9-11-extension.md](https://github.com/wilsonkichoi/sekai-kb/blob/main/dev_docs/adr/005-phases-9-11-extension.md) |
| 006 | Adopter-owned `AGENTS.md` and encapsulated dev-plugin state | [sekai-kb/dev_docs/adr/006-adopter-owned-agents-md-and-dev-plugin-encapsulation.md](https://github.com/wilsonkichoi/sekai-kb/blob/main/dev_docs/adr/006-adopter-owned-agents-md-and-dev-plugin-encapsulation.md) |
| 007 | Separate instance and framework version files | [sekai-kb/dev_docs/adr/007-separate-instance-and-framework-version-files.md](https://github.com/wilsonkichoi/sekai-kb/blob/main/dev_docs/adr/007-separate-instance-and-framework-version-files.md) |
| 008 | Framework maintainer-doc ownership split (and its upgrade addendum) | [sekai-kb/dev_docs/adr/008-framework-docs-ownership-split.md](https://github.com/wilsonkichoi/sekai-kb/blob/main/dev_docs/adr/008-framework-docs-ownership-split.md) |
| 009 | Dev docs as the maintainer-doc boundary | [sekai-kb/dev_docs/adr/009-dev-docs-as-the-maintainer-doc-boundary.md](https://github.com/wilsonkichoi/sekai-kb/blob/main/dev_docs/adr/009-dev-docs-as-the-maintainer-doc-boundary.md) |
| 010 | Framework-owned files warn rather than block | [sekai-kb/dev_docs/adr/010-framework-owned-warns-not-blocks.md](https://github.com/wilsonkichoi/sekai-kb/blob/main/dev_docs/adr/010-framework-owned-warns-not-blocks.md) |
| 011 | Phases 8 and 11 deferral and retrieval freshness | [sekai-kb/dev_docs/adr/011-phases-8-and-11-deferred.md](https://github.com/wilsonkichoi/sekai-kb/blob/main/dev_docs/adr/011-phases-8-and-11-deferred.md) |
| 012 | Ephemeral analytics at production build | [sekai-kb/dev_docs/adr/012-ephemeral-analytics-at-production-build.md](https://github.com/wilsonkichoi/sekai-kb/blob/main/dev_docs/adr/012-ephemeral-analytics-at-production-build.md) |
| 013 | Native routines decouple operations from Semiont | [sekai-kb/dev_docs/adr/013-native-routines-decouple-operations-from-semiont.md](https://github.com/wilsonkichoi/sekai-kb/blob/main/dev_docs/adr/013-native-routines-decouple-operations-from-semiont.md) |

Those eleven still bind this instance — LB is instance #1 and adopts every framework release
they govern. They are simply not LB's to amend: changing one is a `sekai-kb` decision that
reaches LB through a tagged release. Prose in this repository that cites "ADR 004" or
"ADR 006" means the upstream record.

The framework ADR files are maintained upstream; any pre-split copies that remain in this
checkout are historical and are not instance authority.
