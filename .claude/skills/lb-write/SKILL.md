---
name: lb-write
description: |
  Write or rewrite a LagunaBeach.md article via canonical REWRITE-PIPELINE.en.md.
  Handles both new articles and rewrites (one skill, one pipeline). Thin shell:
  loads identity via lb-become, reads the pipeline, executes it.
  TRIGGER when: user says "write X", "rewrite X", "lb-write", "new article",
  "rewrite article", or asks to write/improve any knowledge/ article.
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - WebFetch
  - WebSearch
---

# 🌊 LagunaBeach.md — Write / Rewrite (thin shell)

> **Intentionally thin.** All stages, gates, and editorial standards live in the
> pipeline canonical. This skill only does three things — it does not restate or
> fork pipeline content (drift = decay).

## 1. BECOME gate (required)

Run `/lb-become`. Confirm identity + SSOT rule + autonomy boundaries are loaded
before touching `knowledge/`.

## 2. Read the pipeline in full

Read [`docs/pipelines/REWRITE-PIPELINE.en.md`](../../../docs/pipelines/REWRITE-PIPELINE.en.md)
with the Read tool, **whole file, no `limit` / `offset`**.

## 3. Execute the pipeline

Follow Stages 0-5 as written. No skipping, no reordering, no adding stages.
