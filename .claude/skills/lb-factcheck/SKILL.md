---
name: lb-factcheck
description: |
  Fact-check a LagunaBeach.md article via canonical FACTCHECK-PIPELINE.en.md.
  Audits claims against sources and knowledge/ SSOT (Rule 12). Quick mode
  during rewrites; full mode for post-ship audits or reader challenges.
  TRIGGER when: user says "factcheck", "fact-check", "hallucination audit",
  "/lb-factcheck", "verify claims", "check sources", or when a rewrite
  reaches Stage 3.
allowed-tools:
  - Bash
  - Read
  - Grep
  - WebFetch
  - WebSearch
---

# 🌊 LagunaBeach.md — Factcheck (thin shell)

> **Intentionally thin.** All phases, gates, and methodology live in the
> pipeline canonical. This skill only does three things — it does not restate or
> fork pipeline content (drift = decay).

## 1. BECOME gate (required)

Run `/lb-become`. Confirm identity + SSOT rule + autonomy boundaries are loaded
before auditing `knowledge/`.

## 2. Read the pipeline in full

Read [`docs/pipelines/FACTCHECK-PIPELINE.en.md`](../../../docs/pipelines/FACTCHECK-PIPELINE.en.md)
with the Read tool, **whole file, no `limit` / `offset`**.

## 3. Execute the pipeline

Follow Phases 1-6 as written. Mode (Quick/Full) is determined by context:

- Quick: during a rewrite (REWRITE-PIPELINE Stage 3), spot-checking a PR.
- Full: standalone audit, reader challenge, monthly patrol.

Report findings per Phase 6 triage categories (PASS / SOFT-FIX / HARD-FIX /
DEAD-LINK). Fix any HARD-FIX or DEAD-LINK in `knowledge/` before shipping.
