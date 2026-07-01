#!/usr/bin/env python3
"""ga-query.py — GA4 query CLI with working filters (ANALYSIS-PIPELINE Stage 1)

Why this exists: the ga4-analytics skill's runReport destructured filters but
never placed them into the request, so any filtered query silently returned
unfiltered site-wide numbers. This CLI's filters actually work.

Usage:
  # Homepage daily engagement
  ga-query.py --dims date --metrics screenPageViews,averageSessionDuration,engagementRate,bounceRate \\
              --filter pagePath=/ --start 2026-05-19 --end 2026-06-05

  # Page referrer breakdown (contains via ~)
  ga-query.py --dims pageReferrer --metrics screenPageViews,activeUsers \\
              --filter 'pagePath~trails' --start 3daysAgo --end today --order screenPageViews

  # Who's online right now (realtime)
  ga-query.py --realtime --dims unifiedScreenName --metrics activeUsers

Filter operators: field=value (exact) / field~value (contains) / field^value (begins) / field#regex
Dates: YYYY-MM-DD or GA4 relative format (today / 7daysAgo / 14daysAgo). --start NNd accepted.
Output: table by default; --json for JSON; --save FILE to write.
Exit codes: 0 OK / 2 bad args.
"""
import argparse
import json
import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from lib.sense_client import reexec_in_venv  # noqa: E402
reexec_in_venv()
from lib.sense_client import ga_run, ga_realtime  # noqa: E402


def parse_filter(s):
    for op, tag in (("~", "contains"), ("^", "begins"), ("#", "regex"), ("=", "exact")):
        if op in s:
            f, _, v = s.partition(op)
            return (f.strip(), tag, v.strip())
    raise ValueError(f"bad filter (need =/~/^/#): {s}")


def norm_date(d):
    # accept "7d" shorthand → "7daysAgo"
    import re
    m = re.match(r"^(\d+)d$", d)
    return f"{m.group(1)}daysAgo" if m else d


def main():
    ap = argparse.ArgumentParser(description="GA4 query CLI (filters actually work)")
    ap.add_argument("--dims", default="", help="comma-separated dimensions (e.g. date,pagePath). customEvent:foo allowed")
    ap.add_argument("--metrics", required=True, help="comma-separated metrics")
    ap.add_argument("--filter", action="append", default=[], help="field=value / field~contains / field^begins / field#regex (repeatable, AND)")
    ap.add_argument("--start", default="28daysAgo")
    ap.add_argument("--end", default="today")
    ap.add_argument("--order", default=None, help="metric name to sort desc by")
    ap.add_argument("--asc", action="store_true", help="sort ascending")
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--realtime", action="store_true", help="run a realtime report (ignores dates/filter)")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--save", default=None, help="write JSON to this path")
    a = ap.parse_args()

    dims = [d.strip() for d in a.dims.split(",") if d.strip()]
    mets = [m.strip() for m in a.metrics.split(",") if m.strip()]

    if a.realtime:
        rows = ga_realtime(dims, mets, limit=a.limit)
        meta = {"mode": "realtime", "dims": dims, "metrics": mets}
    else:
        flt = [parse_filter(f) for f in a.filter] if a.filter else None
        rows = ga_run(dims, mets, norm_date(a.start), norm_date(a.end),
                      dim_filter=flt, order_by=a.order, desc=not a.asc, limit=a.limit)
        meta = {"mode": "report", "start": norm_date(a.start), "end": norm_date(a.end),
                "dims": dims, "metrics": mets, "filter": a.filter}

    payload = {"meta": meta, "rowCount": len(rows), "rows": rows}
    if a.save:
        pathlib.Path(a.save).parent.mkdir(parents=True, exist_ok=True)
        json.dump(payload, open(a.save, "w"), ensure_ascii=False, indent=2)
        print(f"💾 {a.save} ({len(rows)} rows)", file=sys.stderr)

    if a.json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return

    # table
    hdr = dims + mets
    print("  ".join(hdr))
    print("  ".join("-" * len(h) for h in hdr))
    for r in rows:
        print("  ".join(r["dims"] + r["mets"]))
    print(f"\n({len(rows)} rows)", file=sys.stderr)


if __name__ == "__main__":
    main()
