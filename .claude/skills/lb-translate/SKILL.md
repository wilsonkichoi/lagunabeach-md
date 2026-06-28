---
name: lb-translate
description: |
  Translate a LagunaBeach.md article (EN→zh-TW) via canonical TRANSLATION-PIPELINE.md.
  Handles both new translations and updates to existing ones. Source must be a
  validated EN article in knowledge/; output goes to knowledge/zh-TW/{Category}/.
  TRIGGER when: user says "translate", "translate X", "翻譯", "add zh-TW",
  "/lb-translate", "translate to Chinese", or asks to translate any knowledge/ article.
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - Grep
---

# 🌊 LagunaBeach.md — Translate (thin shell)

> **Intentionally thin.** All phases, gates, and methodology live in the
> pipeline canonical. This skill only does three things — it does not restate or
> fork pipeline content (drift = decay).

## 1. BECOME gate (required)

Run `/lb-become`. Confirm identity + SSOT rule + autonomy boundaries are loaded
before writing to `knowledge/zh-TW/`.

## 2. Read the pipeline in full

Read [`docs/pipelines/TRANSLATION-PIPELINE.md`](../../../docs/pipelines/TRANSLATION-PIPELINE.md)
with the Read tool, **whole file, no `limit` / `offset`**.

## 3. Execute the pipeline

Follow Phases 1-5 as written. The source is always an EN article in
`knowledge/{Category}/`; the output always lands in `knowledge/zh-TW/{Category}/`.

After Phase 4 verification passes, commit and run `/lb-sync` per Phase 5.
