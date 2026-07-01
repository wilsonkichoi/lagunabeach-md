#!/usr/bin/env python3
"""cf-query.py — Cloudflare AI-crawler reception analysis CLI (ANALYSIS-PIPELINE mode F)

Answers the question GA/SC cannot: which AI models are reading us, how much,
and is it growing or shrinking. Measures whether first-person local voice is
penetrating the AI cognitive substrate.

Data source: fetch-cloudflare.py cache at
`~/.config/lagunabeach-md/cache/cloudflare-YYYY-MM-DD.json` (`ai_crawlers`
section, one file per day). Does not re-fetch; reads cache only.

Vendor bucketing:
  Western AI (OpenAI / Anthropic / Google / Microsoft / Apple / Meta / Amazon / Perplexity)
  PRC AI     (ByteDance / Huawei / Baidu / Alibaba / Tencent / Zhipu / Moonshot / 01.AI)
  Other

Usage:
  cf-query.py                         # latest snapshot crawler breakdown + buckets
  cf-query.py --date 2026-06-04       # specific day
  cf-query.py --trend 14              # last 14 daily files detected + Western/PRC trend
  cf-query.py --json
"""
import argparse
import json
import sys
from pathlib import Path

CACHE = Path.home() / ".config" / "lagunabeach-md" / "cache"

PRC_VENDORS = {"ByteDance", "Huawei", "Baidu", "Alibaba", "Tencent",
               "Zhipu", "Moonshot", "01.AI", "MiniMax", "InternLM"}
WESTERN_AI_VENDORS = {"OpenAI", "Anthropic", "Google", "Microsoft", "Apple",
                      "Meta", "Amazon", "Perplexity", "Cohere", "Mistral", "DuckDuckGo"}


def bucket(category):
    if category in PRC_VENDORS:
        return "🚩 PRC AI"
    if category in WESTERN_AI_VENDORS:
        return "🌐 Western AI"
    return "Other"


def load_day(date=None):
    f = CACHE / ("cloudflare-latest.json" if not date else f"cloudflare-{date}.json")
    if not f.exists():
        print(f"❌ No cloudflare cache: {f}", file=sys.stderr)
        sys.exit(2)
    return json.load(open(f))


def main():
    ap = argparse.ArgumentParser(description="Cloudflare AI-crawler reception (mode F)")
    ap.add_argument("--date", default=None, help="YYYY-MM-DD (default: latest)")
    ap.add_argument("--trend", type=int, default=0, help="Trend over last N daily files")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--save", default=None)
    a = ap.parse_args()

    if a.trend:
        files = sorted(CACHE.glob("cloudflare-2026-*.json"))[-a.trend:]
        trend = []
        for f in files:
            d = json.load(open(f))
            ac = d.get("ai_crawlers") or {}
            crs = ac.get("crawlers") or []
            west = sum(c["requests"] for c in crs if bucket(c["category"]) == "🌐 Western AI")
            prc = sum(c["requests"] for c in crs if bucket(c["category"]) == "🚩 PRC AI")
            det = (ac.get("totals") or {}).get("detectedRequests", 0)
            trend.append({"file": f.name.replace("cloudflare-", "").replace(".json", ""),
                          "detected": det, "western_ai": west, "prc_ai": prc})
        if a.json:
            print(json.dumps({"trend": trend}, ensure_ascii=False, indent=2))
            return
        print(f"{'date':<12}{'detected':>10}{'🌐West':>9}{'🚩PRC':>8}")
        for t in trend:
            print(f"{t['file']:<12}{t['detected']:>10}{t['western_ai']:>9}{t['prc_ai']:>8}")
        return

    d = load_day(a.date)
    ac = d.get("ai_crawlers") or {}
    crs = sorted(ac.get("crawlers") or [], key=lambda c: -c["requests"])
    totals = ac.get("totals") or {}

    buckets = {}
    for c in crs:
        b = bucket(c["category"])
        buckets.setdefault(b, {"requests": 0, "http200": 0, "names": []})
        buckets[b]["requests"] += c["requests"]
        buckets[b]["http200"] += c.get("http200", 0)
        buckets[b]["names"].append(c["name"])
    grand = sum(b["requests"] for b in buckets.values()) or 1

    payload = {
        "period": ac.get("period"), "totals": totals,
        "crawlers": crs,
        "sovereignty_buckets": {k: {**v, "share": round(v["requests"] / grand, 3)} for k, v in buckets.items()},
    }
    if a.save:
        Path(a.save).parent.mkdir(parents=True, exist_ok=True)
        json.dump(payload, open(a.save, "w"), ensure_ascii=False, indent=2)
        print(f"💾 {a.save}", file=sys.stderr)
    if a.json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return

    p = ac.get("period") or {}
    print(f"AI crawler reception — {p.get('start','?')[:10]}..{p.get('end','?')[:10]}  "
          f"(detected {totals.get('detectedRequests','?')} req)\n")
    print(f"{'crawler':<20}{'vendor':<14}{'req':>7}{'200%':>7}  bucket")
    print("-" * 62)
    for c in crs[:20]:
        rate = c.get("http200", 0) / c["requests"] * 100 if c["requests"] else 0
        print(f"{c['name']:<20}{c['category']:<14}{c['requests']:>7}{rate:>6.0f}%  {bucket(c['category'])}")
    print("\n=== Vendor buckets (who is reading our content) ===")
    for b in ("🌐 Western AI", "🚩 PRC AI", "Other"):
        if b in buckets:
            v = buckets[b]
            print(f"  {b:<14} {v['requests']:>6} req ({v['share']*100 if False else round(v['requests']/grand*100):>2}%)  "
                  f"{', '.join(sorted(set(v['names']))[:6])}")
    print("\n💡 Reading: Western AI reading us = first-person local voice entering cognitive substrate; "
          "PRC AI reading us with low 200% = possible content policy filtering. Use --trend for trends.")


if __name__ == "__main__":
    main()
