---
name: lb-peer
description: |
  Curation peer ingestion via canonical PEER-INGESTION-PIPELINE. Ingest
  knowledge from Laguna Beach institutions (Laguna Art Museum, Laguna Beach
  Historical Society, Festival of Arts / Pageant of the Masters, Sawdust Art
  Festival) as research leads, not as source-of-truth.
  TRIGGER when: user says "ingest peer", "peer ingestion", "LAM", "LBHS",
  "/lb-peer", "curation peer", or names an LB institution to ingest from.
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - Grep
  - WebFetch
  - WebSearch
  - Agent
---

# 🌊 LagunaBeach.md — Peer Ingest (thin wrapper)

> **Intentionally thin.** The 8-stage ingestion logic lives in the pipeline
> canonical. This skill scopes the LB institutions and gates identity, nothing
> more.

## 1. BECOME gate (required)

Run `/lb-become`. Confirm identity + SSOT rule + autonomy boundaries are loaded
before touching `knowledge/`.

## 2. Read the pipeline in full

Read [`docs/pipelines/PEER-INGESTION-PIPELINE.md`](../../../docs/pipelines/PEER-INGESTION-PIPELINE.md)
with the Read tool, **whole file, no `limit` / `offset`**.

## 3. LB institution scope

Known LB curation peers (articles already exist in `knowledge/`):

- **Laguna Art Museum** (LAM) — `knowledge/Art & Galleries/laguna-art-museum.md`
- **Festival of Arts / Pageant of the Masters** — `knowledge/Events & Festivals/pageant-of-the-masters.md`
- **Sawdust Art Festival** — `knowledge/Events & Festivals/sawdust-art-festival.md`
- **Laguna Beach Historical Society** (LBHS) — no article yet, but a known institution

New peers may be added as LB's knowledge base grows. The user names the
institution; if it's not on this list, verify it's a real LB institution before
ingesting.

## 4. Rule 12 iron law

Peers are leads, not sources. Every fact ingested from a peer must be verified
against primary sources before it enters `knowledge/`. A peer publication
claiming "founded in 1903" still needs a primary source. If no primary source
confirms the claim, flag the gap — do not write the claim into an article.

## 5. Execute the pipeline

Follow all 8 stages as written in the canonical pipeline. No skipping, no
reordering.
