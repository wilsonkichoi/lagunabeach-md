#!/usr/bin/env python3
"""bootstrap-spore-ssot.py — One-time bootstrap of spore structured data into JSON SSOT (2026-06-10 flip).

Sources:
  docs/factory/SPORE-LOG.md publish table   -> spore-log.json (identity + template + highlight)
  src/data/spores.json history + metrics    -> spore-metrics.json (harvest events + seed events)

Run once and archive; kept in repo for fork / disaster recovery (same pattern as backfill-translated-from.py).
Idempotent: re-running rebuilds entire file (deterministic output).
"""
from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]


def _load_module(name, rel):
    spec = importlib.util.spec_from_file_location(name, REPO / rel)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main():
    gds = _load_module("gds", "scripts/tools/generate-dashboard-spores.py")

    # ── identity from SPORE-LOG publish table (with template / highlight columns) ──
    log_text = (REPO / "docs/factory/SPORE-LOG.md").read_text(encoding="utf-8")
    sections = gds.split_tables(log_text)
    raw = gds.parse_pipe_table(sections.get("發文紀錄", ""))
    pubs = gds.parse_publish_rows(raw)

    spores = []
    for p in sorted(pubs, key=lambda x: x["n"]):
        spores.append({
            "id": p["n"],
            "date": p["date"],
            "lang": (p["lang"] or "zh").lower(),
            "platform": p["platform"],
            "slug": p["article"],
            "category": p["category"],
            "template": p["template"],
            "url": p["url"],
            "highlight": p["highlight"],
        })

    # ── metric events from records (history = harvest events; seed metrics = synthetic events) ──
    records = json.loads((REPO / "src/data/spores.json").read_text(encoding="utf-8"))
    events = []
    for r in records["spores"]:
        for h in r.get("history", []):
            events.append({
                "spore": r["id"],
                "dPlus": h.get("dPlus"),
                "at": h.get("harvestDate"),
                "batch": h.get("batch"),
                "views": h.get("views"),
                "likes": h.get("likes"),
                "reposts": h.get("reposts"),
                "comments": h.get("comments"),
                "shares": h.get("shares"),
                "source": "harvest",
            })
        as_of = r.get("metricsAsOf") or {}
        if as_of.get("source") in ("frontmatter-seed", "preserved"):
            m = r.get("metrics", {})
            events.append({
                "spore": r["id"],
                "dPlus": None,
                "at": None,
                "batch": None,
                **{k: m.get(k) for k in ("views", "likes", "reposts", "comments", "shares")},
                "source": "frontmatter-seed-2026-06-10",
            })
        elif as_of.get("source") == "harvest+backfill":
            # Latest harvest row has missing fields backfilled from frontmatter seed — store as seed event
            m = r.get("metrics", {})
            last = (r.get("history") or [{}])[-1]
            fill = {k: m.get(k) for k in ("views", "likes", "reposts", "comments", "shares")
                    if m.get(k) is not None and last.get(k) is None}
            if fill:
                events.append({
                    "spore": r["id"],
                    "dPlus": None,
                    "at": None,
                    "batch": None,
                    "views": fill.get("views"),
                    "likes": fill.get("likes"),
                    "reposts": fill.get("reposts"),
                    "comments": fill.get("comments"),
                    "shares": fill.get("shares"),
                    "source": "frontmatter-seed-2026-06-10",
                })

    events.sort(key=lambda e: (e["spore"],
                               e["dPlus"] if e.get("dPlus") is not None else -1,
                               e.get("at") or ""))

    out_log = {"_meta": {"schemaVersion": 1,
                         "note": "Spore identity SSOT — writes via scripts/tools/spore-db.py add-spore; "
                                 "history <= #133 bootstrapped from SPORE-LOG.md publish table (2026-06-10 frozen)"},
               "spores": spores}
    out_metrics = {"_meta": {"schemaVersion": 1,
                             "note": "Spore metric event stream SSOT — writes via spore-db.py add-metrics; "
                                     "history bootstrapped from SPORE-HARVESTS parsing (2026-06-10)"},
                   "events": events}

    (REPO / "docs/factory/spore-log.json").write_text(
        json.dumps(out_log, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (REPO / "docs/factory/spore-metrics.json").write_text(
        json.dumps(out_metrics, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"✓ spore-log.json: {len(spores)} spores")
    print(f"✓ spore-metrics.json: {len(events)} events "
          f"({sum(1 for e in events if e['source'] == 'harvest')} harvest + "
          f"{sum(1 for e in events if e['source'] != 'harvest')} seed)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
