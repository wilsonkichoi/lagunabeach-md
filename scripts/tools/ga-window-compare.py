#!/usr/bin/env python3
"""ga-window-compare.py — Before/after impact comparator (ANALYSIS-PIPELINE Stage 2-4)

Instruments the methodology from impact reports. Given two time windows + a
page filter, produces a "rate discipline + scale disambiguation + lag
detection" before/after table that guards against analysis hallucinations (H1-H9).

Built-in judgments:
  - H1 scale confusion: reports both session-level avgSessionDuration AND page-level
    userEngagementDuration/user, labeled separately so you don't conflate them.
  - H2 rate/volume confusion: reports both rates (engagementRate/bounceRate) and
    volumes (users/sessions); warns "use rates not volumes" when user counts differ >15%.
  - H3 attribution lag: auto-scans each window daily; engRate<2% + bounce>98% = lag
    contamination day, warns to exclude.
  - H6 novelty effect: not auto-judged, but --daily prints per-day rows to spot launch spikes.
  - H7 self-verification: prints "strongest counter-explanation prompt" as a Stage 5 FALSIFY reminder.

Usage:
  ga-window-compare.py --filter 'pagePath=/' \\
     --before 2026-05-19 2026-05-25 --after 2026-05-29 2026-06-03
  ga-window-compare.py --filter 'pagePath=/' --before A B --after C D --cohort
  ga-window-compare.py --filter 'pagePath=/' --before A B --after C D --daily --json --save out.json

Filter: same as ga-query (field=value / field~contains / field^begins).
Exit codes: 0 OK / 1 lag contamination not excluded (warning) / 2 bad args.
"""
import argparse
import json
import math
import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from lib.sense_client import reexec_in_venv  # noqa: E402
reexec_in_venv()
from lib.sense_client import ga_run  # noqa: E402


def two_prop_z(eng_b, n_b, eng_a, n_a):
    """Two-proportion z-test on engaged-session rate. Returns (z, significant).
    H11: significance guard. Small-sample rate diff may be pure noise. |z|>=2 ~ 95%."""
    if n_b == 0 or n_a == 0:
        return 0.0, False
    pb, pa = eng_b / n_b, eng_a / n_a
    se = math.sqrt(pb * (1 - pb) / n_b + pa * (1 - pa) / n_a)
    if se == 0:
        return 0.0, False
    z = (pa - pb) / se
    return z, abs(z) >= 2.0

CORE_METRICS = ["activeUsers", "sessions", "screenPageViews", "userEngagementDuration",
                "averageSessionDuration", "engagementRate", "bounceRate", "engagedSessions"]


def parse_filter(s):
    for op, tag in (("~", "contains"), ("^", "begins"), ("#", "regex"), ("=", "exact")):
        if op in s:
            f, _, v = s.partition(op)
            return (f.strip(), tag, v.strip())
    raise ValueError(f"bad filter: {s}")


def agg(flt, start, end):
    rows = ga_run([], CORE_METRICS, start, end, dim_filter=flt)
    m = {k: float(v) for k, v in zip(CORE_METRICS, rows[0]["mets"])} if rows else {k: 0.0 for k in CORE_METRICS}
    u = m["activeUsers"] or 1
    s = m["sessions"] or 1
    return {
        "users": int(m["activeUsers"]), "sessions": int(m["sessions"]),
        "pv": int(m["screenPageViews"]), "engagedSessions": int(m["engagedSessions"]),
        "avgSessionDur_s": m["averageSessionDuration"],            # session-scoped (H1!)
        "pageEngDur_per_user_s": m["userEngagementDuration"] / u,   # page-scoped
        "pageEngDur_per_sess_s": m["userEngagementDuration"] / s,
        "engagementRate": m["engagementRate"], "bounceRate": m["bounceRate"],
    }


def daily(flt, start, end):
    rows = ga_run(["date"], ["screenPageViews", "engagementRate", "bounceRate", "averageSessionDuration"],
                  start, end, dim_filter=flt, order_by=None)
    out = []
    for r in sorted(rows, key=lambda x: x["dims"][0]):
        out.append({"date": r["dims"][0], "pv": int(r["mets"][0]),
                    "engRate": float(r["mets"][1]), "bounce": float(r["mets"][2]),
                    "avgDur": float(r["mets"][3])})
    return out


def lag_days(daily_rows):
    return [d["date"] for d in daily_rows if d["engRate"] < 0.02 and d["bounce"] > 0.98]


def cohort(flt, start, end):
    rows = ga_run(["newVsReturning"], ["activeUsers", "sessions", "averageSessionDuration",
                  "userEngagementDuration", "engagementRate"], start, end, dim_filter=flt)
    out = {}
    for r in rows:
        k = r["dims"][0]
        u = float(r["mets"][0]) or 1
        out[k] = {"users": int(float(r["mets"][0])), "avgSessionDur_s": float(r["mets"][2]),
                  "pageEngDur_per_user_s": float(r["mets"][3]) / u,
                  "engagementRate": float(r["mets"][4])}
    return out


def pct(b, a):
    return (a - b) / b * 100 if b else float("nan")


def main():
    ap = argparse.ArgumentParser(description="GA4 before/after impact comparator")
    ap.add_argument("--filter", action="append", default=[], help="page filter (e.g. pagePath=/)")
    ap.add_argument("--control", action="append", default=[], help="H10 control group filter (unchanged surface, e.g. pagePath~/nature/) for DiD to subtract market trend")
    ap.add_argument("--before", nargs=2, metavar=("START", "END"), required=True)
    ap.add_argument("--after", nargs=2, metavar=("START", "END"), required=True)
    ap.add_argument("--cohort", action="store_true", help="add new-vs-returning split")
    ap.add_argument("--daily", action="store_true", help="print per-day rows (spot novelty spikes)")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--save", default=None)
    a = ap.parse_args()

    flt = [parse_filter(f) for f in a.filter] if a.filter else None
    B = agg(flt, *a.before)
    A = agg(flt, *a.after)
    bd, ad = daily(flt, *a.before), daily(flt, *a.after)
    blag, alag = lag_days(bd), lag_days(ad)

    # H11 significance: engaged session rate two-proportion z-test
    z, signif = two_prop_z(B["engagedSessions"], B["sessions"], A["engagedSessions"], A["sessions"])

    # H10 control group / DiD: subtract market trend
    diff_in_diff = None
    C = CA = None
    if a.control:
        cflt = [parse_filter(f) for f in a.control]
        C = agg(cflt, *a.before)
        CA = agg(cflt, *a.after)
        target_d = (A["engagementRate"] - B["engagementRate"]) * 100      # pp
        control_d = (CA["engagementRate"] - C["engagementRate"]) * 100    # pp
        diff_in_diff = {"target_delta_pp": round(target_d, 1),
                        "control_delta_pp": round(control_d, 1),
                        "net_pp": round(target_d - control_d, 1)}

    rows = [
        ("avgSessionDuration (s) [session-level H1]", B["avgSessionDur_s"], A["avgSessionDur_s"], "{:.0f}"),
        ("pageEngDur/user (s) [page-level H1]", B["pageEngDur_per_user_s"], A["pageEngDur_per_user_s"], "{:.1f}"),
        ("engagementRate [rate H2]", B["engagementRate"] * 100, A["engagementRate"] * 100, "{:.0f}%"),
        ("bounceRate [rate H2]", B["bounceRate"] * 100, A["bounceRate"] * 100, "{:.0f}%"),
        ("activeUsers [volume H2]", B["users"], A["users"], "{:.0f}"),
        ("sessions [volume H2]", B["sessions"], A["sessions"], "{:.0f}"),
        ("engagedSessions [volume H2]", B["engagedSessions"], A["engagedSessions"], "{:.0f}"),
    ]

    warnings = []
    if blag:
        warnings.append(f"⚠️ H3 lag: BEFORE window has attribution-lag contaminated days {blag} — exclude and re-run")
    if alag:
        warnings.append(f"⚠️ H3 lag: AFTER window has attribution-lag contaminated days {alag} — exclude and re-run")
    if B["users"] and abs(A["users"] - B["users"]) / B["users"] > 0.15:
        warnings.append(f"⚠️ H2 rate/volume: user count diff {pct(B['users'], A['users']):+.0f}% (>15%) — use rates (engagementRate/bounce/page-level), not absolute volumes")
    if pct(B["avgSessionDur_s"], A["avgSessionDur_s"]) > 50 and pct(B["pageEngDur_per_user_s"], A["pageEngDur_per_user_s"]) < 50:
        warnings.append("⚠️ H1 scale: avgSessionDuration surged but page-level engDur did not follow — sessions got deeper (navigated further), not the page itself retaining longer. Don't report session-level as page-level")
    if not signif:
        warnings.append(f"⚠️ H11 significance: engaged-rate diff z={z:.1f} (<2) — may be noise, insufficient sample, don't claim victory")
    if a.control and diff_in_diff and B["engagementRate"] > 0:
        cd = diff_in_diff["control_delta_pp"]
        if abs(cd) >= 3:
            warnings.append(f"⚠️ H10 control: control group engagementRate also moved {cd:+.1f}pp (market trend) — net effect = {diff_in_diff['net_pp']:+.1f}pp, not the full target delta")

    payload = {
        "filter": a.filter, "before": a.before, "after": a.after,
        "before_agg": B, "after_agg": A, "before_lag_days": blag, "after_lag_days": alag,
        "deltas": {r[0]: {"before": r[1], "after": r[2], "pct": pct(r[1], r[2])} for r in rows},
        "significance": {"engaged_rate_z": round(z, 2), "significant_95": signif},
        "diff_in_diff": diff_in_diff,
        "warnings": warnings,
    }
    if a.cohort:
        payload["cohort_before"] = cohort(flt, *a.before)
        payload["cohort_after"] = cohort(flt, *a.after)
    if a.daily:
        payload["before_daily"], payload["after_daily"] = bd, ad

    if a.save:
        pathlib.Path(a.save).parent.mkdir(parents=True, exist_ok=True)
        json.dump(payload, open(a.save, "w"), ensure_ascii=False, indent=2)
        print(f"💾 {a.save}", file=sys.stderr)
    if a.json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return

    print(f"filter={a.filter}  BEFORE {a.before[0]}..{a.before[1]}  vs  AFTER {a.after[0]}..{a.after[1]}\n")
    print(f"{'metric':<40}{'BEFORE':>12}{'AFTER':>12}{'Δ':>10}")
    print("-" * 74)
    for label, b, av, fmt in rows:
        d = pct(b, av)
        ds = ("+" if d >= 0 else "") + (f"{d:.0f}%" if d == d else "n/a")
        print(f"{label:<40}{fmt.format(b):>12}{fmt.format(av):>12}{ds:>10}")
    sig_tag = "✅ significant (95%)" if signif else "⚠️ noise range"
    print(f"\nengaged-rate significance [H11]: z={z:.1f}  {sig_tag}")
    if diff_in_diff:
        print(f"Control DiD [H10]: target {diff_in_diff['target_delta_pp']:+.1f}pp - "
              f"control {diff_in_diff['control_delta_pp']:+.1f}pp = net effect {diff_in_diff['net_pp']:+.1f}pp (market trend subtracted)")
    if a.cohort:
        print("\n— new vs returning —")
        for win, c in (("BEFORE", payload.get("cohort_before", {})), ("AFTER", payload.get("cohort_after", {}))):
            for k, v in c.items():
                print(f"  {win} {k:<10} users={v['users']:<6} pageEngDur/user={v['pageEngDur_per_user_s']:.0f}s engRate={v['engagementRate']*100:.0f}%")
    if a.daily:
        for win, dd in (("BEFORE", bd), ("AFTER", ad)):
            print(f"\n— {win} daily —")
            for d in dd:
                flag = " ⚠lag" if (d["engRate"] < 0.02 and d["bounce"] > 0.98) else ""
                print(f"  {d['date']}  pv={d['pv']:<5} engRate={d['engRate']*100:.0f}% bounce={d['bounce']*100:.0f}% avgDur={d['avgDur']:.0f}s{flag}")
    if warnings:
        print("\n=== confounder flags ===")
        for w in warnings:
            print(" " + w)
    print("\n💡 Stage 5 FALSIFY hint: the strongest counter-explanation is usually "
          "\"rate increase is actually traffic mix shift (bad traffic leaving)\" — "
          "use per-user metrics (page-level engDur / new visitors) to bypass; those are "
          "evidence independent of traffic volume.")
    sys.exit(1 if (blag or alag) else 0)


if __name__ == "__main__":
    main()
