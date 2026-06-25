---
name: lb-sync
description: |
  Rebuild LagunaBeach.md's derived content layer — runs scripts/core/sync.sh to
  project knowledge/ (SSOT) into src/content/. This is SSOT sync, NOT translation
  and NOT i18n. Use after editing articles in knowledge/, before build/dev, or
  whenever src/content/ looks stale. Thin wrapper over the existing script — does
  not reimplement sync logic.
  TRIGGER when: user says "sync", "/lb-sync", "rebuild content", "sync knowledge",
  "sync SSOT", or after editing files under knowledge/.
allowed-tools:
  - Bash
  - Read
---

# 🌊 LagunaBeach.md — Sync (thin wrapper)

> **You are rebuilding LB's derived layer.** `knowledge/` is the SSOT;
> `src/content/` is the projection and is gitignored. This script overwrites
> `src/content/` — never hand-edit that directory, edit `knowledge/` then sync.
> The One Rule and full mechanics live in
> [`BECOME_LAGUNABEACH.md`](../../../BECOME_LAGUNABEACH.md) §The One Rule.

## 1. Run the sync script

```bash
bash scripts/core/sync.sh
```

It's idempotent: clears every enabled-lang dir under `src/content/` then rebuilds
from `knowledge/{Category}/` (en default, no prefix) and `knowledge/zh-TW/{Category}/`.

## 2. Report what rebuilt

Read the script's output and summarize: which langs/categories synced, file
counts, any warning it printed. Don't reimplement or second-guess the script —
if it errors, surface the exact error string, don't paper over it.
