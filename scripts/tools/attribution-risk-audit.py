#!/usr/bin/env python3
"""attribution-risk-audit — Cross-article "attribution-dense x citation-sparse x unreviewed x featured" risk ranking.

Instruments REFLEXES #15: upgrades the manual "pending re-review queue" heredoc run after
the 2026-06-01 film-score reader callout into a re-runnable tool. Previous ad-hoc python
was retyped each time with non-traceable results; this tool lets the queue be regenerated
anytime and fed to ARTICLE-INBOX.

Risk model (attribution-dense topics are high AI-hallucination risk, per 2026-06-01 lesson):
    surface  = work-title count (attribution surface area)
    risk     = surface
             + 40            if fns==0 and surface>=8      # zero footnotes + dense = red flag
             + min(surface/max(fns,1), 10) * 3   otherwise  # claims-per-citation
             + 15            if early batch (2026-03, pipeline least mature)
             + 12            if featured (amplifies harm)
    Only counts articles where lastHumanReview != true (already human-reviewed = low priority).

Tier:
    T1  early batch + featured + (zero footnotes or surface>=40), or zero footnotes + surface>=15
    T2  early batch + featured, or surface>=60, or zero footnotes + surface>=10
    T3  remaining queue entries

Usage:
    python3 scripts/tools/attribution-risk-audit.py                 # print summary + Tier1/2
    python3 scripts/tools/attribution-risk-audit.py --out FILE.md   # write full markdown queue
    python3 scripts/tools/attribution-risk-audit.py --json          # JSON for routine/dashboard
    python3 scripts/tools/attribution-risk-audit.py --min-works 10  # entry threshold (default 10)

Canonical: reports/reader-callout-pipeline-diagnosis-2026-06-01.md §5 + REWRITE-PIPELINE.md §Step 0.2-bis
"""

from __future__ import annotations
import argparse
import glob
import json
import os
import re
import sys

LANG_DIRS = {"en", "ja", "ko", "es", "fr"}
ROOT = "knowledge"


def is_zh(path: str) -> bool:
    parts = path.split(os.sep)
    return len(parts) > 1 and parts[1] not in LANG_DIRS


def parse(path: str) -> dict | None:
    try:
        t = open(path, encoding="utf-8").read()
    except Exception:
        return None
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", t, re.S)
    if not m:
        return None
    head, body = m.group(1), m.group(2)

    def g(k):
        mm = re.search(rf"^{k}:\s*(.*)$", head, re.M)
        return mm.group(1).strip().strip("'\"") if mm else None

    works = len(re.findall(r"《[^》]+》", body)) + len(re.findall(r"〈[^〉]+〉", body))
    fns = len(re.findall(r"^\[\^\d+\]:", body, re.M))
    return dict(
        path=path,
        date=g("date") or "",
        rev=g("lastHumanReview"),
        featured=(g("featured") == "true"),
        category=g("category") or "?",
        works=works,
        fns=fns,
        is_hub=os.path.basename(path).startswith("_"),
    )


def early(d: str) -> bool:
    return d[:7] == "2026-03"


def score(r: dict) -> float:
    s = float(r["works"])
    if r["fns"] == 0 and r["works"] >= 8:
        s += 40
    else:
        s += min(r["works"] / max(r["fns"], 1), 10) * 3
    if early(r["date"]):
        s += 15
    if r["featured"]:
        s += 12
    return round(s, 1)


def tier(r: dict) -> str:
    if early(r["date"]) and r["featured"] and (r["fns"] == 0 or r["works"] >= 40):
        return "T1"
    if r["fns"] == 0 and r["works"] >= 15:
        return "T1"
    if early(r["date"]) and r["featured"]:
        return "T2"
    if r["works"] >= 60 or (r["fns"] == 0 and r["works"] >= 10):
        return "T2"
    return "T3"


def build_queue(min_works: int):
    files = [f for f in glob.glob(f"{ROOT}/**/*.md", recursive=True) if is_zh(f)]
    rows = [r for r in (parse(f) for f in files) if r]
    unrev = [r for r in rows if r["rev"] != "true"]
    queue = [r for r in unrev if r["works"] >= min_works or (r["fns"] == 0 and r["works"] >= 8)]
    for r in queue:
        r["score"] = score(r)
        r["tier"] = tier(r)
    queue.sort(key=lambda r: -r["score"])
    return rows, unrev, queue


def main():
    ap = argparse.ArgumentParser(description="Cross-article attribution risk ranking -> pending re-review queue")
    ap.add_argument("--min-works", type=int, default=10, help="entry threshold (work-title count, default 10)")
    ap.add_argument("--out", default=None, help="write full markdown queue to this path")
    ap.add_argument("--json", action="store_true", help="output JSON (for routine/dashboard)")
    ap.add_argument("--top", type=int, default=0, help="only print top N (0=print Tier1+Tier2)")
    args = ap.parse_args()

    rows, unrev, queue = build_queue(args.min_works)
    tiers = {"T1": 0, "T2": 0, "T3": 0}
    for r in queue:
        tiers[r["tier"]] += 1

    if args.json:
        print(json.dumps({
            "total_zh": len(rows),
            "unreviewed": len(unrev),
            "queue_size": len(queue),
            "tiers": tiers,
            "queue": [{k: r[k] for k in ("tier", "score", "works", "fns", "date",
                                         "featured", "category", "path", "is_hub")}
                      for r in queue],
        }, ensure_ascii=False, indent=2))
        return

    def md_table(items):
        lines = ["| tier | score | works | fns | date | feat | hub | category | file |",
                 "|------|------:|------:|----:|------|:----:|:---:|----------|------|"]
        for r in items:
            fe = "★" if r["featured"] else ""
            hub = "_" if r["is_hub"] else ""
            lines.append(f"| {r['tier']} | {r['score']} | {r['works']} | {r['fns']} | "
                         f"{r['date']} | {fe} | {hub} | {r['category']} | "
                         f"{os.path.basename(r['path'])} |")
        return "\n".join(lines)

    header = (f"# Pending Re-Review Queue (attribution-risk-audit)\n\n"
              f"Site-wide {len(rows)} zh SSOT articles; {len(unrev)} not human-reviewed.\n"
              f"Queued (work-titles >= {args.min_works} or zero footnotes >=8 and unreviewed) = **{len(queue)} articles**.\n"
              f"Tier1={tiers['T1']} / Tier2={tiers['T2']} / Tier3={tiers['T3']}.\n"
              f"(`_*.md` = internal Hub/scaffold, excluded from re-review.)\n\n"
              f"Risk score = attribution surface + zero-footnote penalty(+40) or claims/footnote ratio + early batch(+15) + featured(+12).\n")

    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(header + "\n" + md_table(queue) + "\n")
        print(f"WROTE {args.out}  ({len(queue)} rows; T1={tiers['T1']} T2={tiers['T2']} T3={tiers['T3']})")
        return

    print(header)
    show = queue[:args.top] if args.top else [r for r in queue if r["tier"] in ("T1", "T2")]
    print(md_table(show))
    if not args.top:
        print(f"\n(Showing Tier1+Tier2 only: {len(show)} articles; full {len(queue)} articles via --out FILE.md or --top N)")


if __name__ == "__main__":
    main()
