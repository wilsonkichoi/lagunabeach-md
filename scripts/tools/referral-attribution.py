#!/usr/bin/env python3
"""referral-attribution.py — Traffic source forensics + masked-channel detection (ANALYSIS-PIPELINE mode B)

Many of the stickiest referral sources (forums, apps, link shorteners) use
rel="noreferrer" links, which wipe the referrer and record as "direct" in GA,
making the most engaged readers invisible (analysis hallucination H9: masked
channel blindness).

This tool:
  1. Breaks down pageReferrer + landingPage x source to find the real source structure
  2. Matches known "masked channel fingerprints" (forum ecosystems: mirror sites, apps, short URLs)
  3. Computes a repost signature score: heavy (direct) landing + ecosystem tail +
     geo-concentrated + mobile-heavy. All 4 signals lit = high probability of external
     forum repost with referrer wiped by noreferrer.

Usage:
  referral-attribution.py --filter 'pagePath~trails' --start 3daysAgo --end today
  referral-attribution.py --filter 'pagePath=/nature/trails/' --start 3d --end today --json

Exit codes: 0 OK / 1 repost signature detected (go check external sources) / 2 bad args.
"""
import argparse
import json
import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from lib.sense_client import reexec_in_venv  # noqa: E402
reexec_in_venv()
from lib.sense_client import ga_run  # noqa: E402

# Known masked-channel fingerprints (referrer or source substring -> human label).
# Extendable (reddit / nextdoor / other forum ecosystems).
MASKED_FINGERPRINTS = {
    "disp.cc": "PTT web mirror",
    "jptt": "JPTT (PTT Android app)",
    "ptt.cc": "PTT direct",
    "pttweb": "PTT web",
    "reurl.cc": "Short URL (common in forum posts)",
    "term.ptt": "PTT terminal web",
}


def parse_filter(s):
    for op, tag in (("~", "contains"), ("^", "begins"), ("#", "regex"), ("=", "exact")):
        if op in s:
            f, _, v = s.partition(op)
            return (f.strip(), tag, v.strip())
    raise ValueError(f"bad filter: {s}")


def norm_date(d):
    import re
    m = re.match(r"^(\d+)d$", d)
    return f"{m.group(1)}daysAgo" if m else d


def main():
    ap = argparse.ArgumentParser(description="Referral forensics + masked-channel detector")
    ap.add_argument("--filter", action="append", default=[], required=True)
    ap.add_argument("--start", default="3daysAgo")
    ap.add_argument("--end", default="today")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--save", default=None)
    a = ap.parse_args()
    flt = [parse_filter(f) for f in a.filter]
    start, end = norm_date(a.start), norm_date(a.end)

    referrer = ga_run(["pageReferrer"], ["screenPageViews", "activeUsers"], start, end,
                      dim_filter=flt, order_by="screenPageViews", limit=50)
    geo = ga_run(["country"], ["activeUsers"], start, end, dim_filter=flt,
                 order_by="activeUsers", limit=30)
    device = ga_run(["deviceCategory"], ["activeUsers"], start, end, dim_filter=flt,
                    order_by="activeUsers", limit=10)

    # blank / direct referrer volume (the masked bucket)
    blank_pv = sum(int(r["mets"][0]) for r in referrer if r["dims"][0].strip() == "")
    total_pv = sum(int(r["mets"][0]) for r in referrer) or 1
    blank_share = blank_pv / total_pv

    # ecosystem-tail fingerprints present?
    found = []
    for r in referrer:
        ref = r["dims"][0].lower()
        for fp, human in MASKED_FINGERPRINTS.items():
            if fp in ref:
                found.append({"referrer": r["dims"][0], "pv": int(r["mets"][0]), "channel": human})

    # geo concentration + mobile share
    geo_total = sum(int(r["mets"][0]) for r in geo) or 1
    top_country = (geo[0]["dims"][0], int(geo[0]["mets"][0]) / geo_total) if geo else ("?", 0)
    dev_total = sum(int(r["mets"][0]) for r in device) or 1
    mobile_share = sum(int(r["mets"][0]) for r in device if r["dims"][0] == "mobile") / dev_total

    # repost signature: 4 signals
    sig = {
        "blank_referrer_heavy": blank_share >= 0.30,
        "ecosystem_tail_present": len(found) > 0,
        "geo_concentrated": top_country[1] >= 0.70,
        "mobile_heavy": mobile_share >= 0.45,
    }
    score = sum(sig.values())
    verdict = ("🚨 High probability of external forum repost (referrer wiped by noreferrer)" if score >= 3
               else "⚠️ Partial signals, possible masked source" if score == 2
               else "— No clear repost signature")

    payload = {
        "filter": a.filter, "start": start, "end": end,
        "total_referrer_pv": total_pv, "blank_referrer_pv": blank_pv, "blank_share": round(blank_share, 3),
        "masked_fingerprints": found,
        "top_country": {"name": top_country[0], "share": round(top_country[1], 3)},
        "mobile_share": round(mobile_share, 3),
        "repost_signals": sig, "repost_score": score, "verdict": verdict,
        "referrer_breakdown": [{"referrer": r["dims"][0] or "(direct/blank)", "pv": int(r["mets"][0])} for r in referrer[:20]],
    }
    if a.save:
        pathlib.Path(a.save).parent.mkdir(parents=True, exist_ok=True)
        json.dump(payload, open(a.save, "w"), ensure_ascii=False, indent=2)
        print(f"💾 {a.save}", file=sys.stderr)
    if a.json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        sys.exit(1 if score >= 3 else 0)

    print(f"Page filter={a.filter}  {start}..{end}\n")
    print(f"(direct/blank) referrer: {blank_pv} pv ({blank_share*100:.0f}%) <- noreferrer-wiped traffic likely here")
    print(f"top country: {top_country[0]} {top_country[1]*100:.0f}%   mobile: {mobile_share*100:.0f}%\n")
    if found:
        print("Masked-channel fingerprints (leaked, traceable tail):")
        for f in found:
            print(f"  {f['referrer']:<40} {f['pv']:>4} pv  -> {f['channel']}")
    else:
        print("(no known masked-channel fingerprints)")
    print(f"\nRepost 4 signals: blank>=30%={sig['blank_referrer_heavy']} / ecosystem tail={sig['ecosystem_tail_present']} / "
          f"geo concentrated>=70%={sig['geo_concentrated']} / mobile>=45%={sig['mobile_heavy']}  -> score {score}/4")
    print(f"Verdict: {verdict}")
    if score >= 3:
        print("\n-> Search external forums to confirm the repost thread, then run ANALYSIS-PIPELINE mode D reception analysis")
    sys.exit(1 if score >= 3 else 0)


if __name__ == "__main__":
    main()
