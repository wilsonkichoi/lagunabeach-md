# ADR 007: Separate instance and framework version files

**Status:** Accepted (2026-07-26, Wilson-approved)
**Deciders:** Wilson Choi

## Context

Sekai releases originally used `package.json.version`, while LB used the same field for
its own package identity. Every Sekai version bump therefore changed a line LB also
owned, producing a `package.json` conflict during `/upgrade`. The npm manifest also mixed
three concepts: Node tooling metadata, the adopter's release, and the framework release.

An adopter and its framework have independent release trains. LB can release without
changing Sekai, and LB can adopt a Sekai release without releasing LB. One field cannot
represent both versions.

## Options

| Option | Pros | Cons | Cost |
|---|---|---|---|
| Keep both versions in `package.json` | One JSON file | Mixed ownership remains; framework upgrades require semantic JSON merging | Permanent merge complexity |
| Add `package.json.framework_version` and keep `FRAMEWORK-VERSION` | Familiar field | Two SSOTs for the same value; drift is inevitable | Rejected duplication |
| Use `VERSION` and `FRAMEWORK-VERSION` files | One SSOT per release train; trivial shell and CI access; `merge=ours` protects adopter state | Two small files | Minimal |

## Decision

- `VERSION` is the adopter's own v-prefixed semantic release version. LB initializes it
  to `v0.0.0`. It is instance-owned and carries `merge=ours`.
- `FRAMEWORK-VERSION` is the exact v-prefixed Sekai release integrated by the instance.
  Sekai release tags use `sekai-kb-${FRAMEWORK-VERSION}`. During `/upgrade`, the merge
  preserves the old file; only a verified upgrade bumps it.
- `package.json` is a private Node manifest for package identity, scripts, dependencies,
  and engine requirements. It contains no `version` field and is not a release SSOT.
- Init writes adopter-specific package name and description, initializes `VERSION`, and
  carries forward the checked-out `FRAMEWORK-VERSION`.
- CI validates both version-file formats, private-package status, lockfile identity, and
  framework tag agreement.

## Consequences

- Framework upgrades never change or describe the adopter's release.
- Adopter releases never imply a framework upgrade.
- Routine Sekai releases no longer conflict with an adopter's npm package version.
- The first framework release adopting this decision performs a one-time migration from
  `package.json.version`; subsequent upgrades have no version-line conflict.
