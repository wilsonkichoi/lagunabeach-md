#!/usr/bin/env python3
"""analysis-report-health.py — Analysis report honesty gate linter (ANALYSIS-PIPELINE Stage 6)

Turns "anti-analysis-hallucination" judgment from "I remembered to do it this time" into
"red light if not done". Mirrors research-report-health.py architecture (stdlib-only /
exit codes / --json / CI-compatible), but checks the honesty spine of **data analysis
reports**, not Stage 1 research report search traces.

Maps to design report Section 3 analysis-hallucination failure modes H1-H9:
  window-defined      -> no window/boundary defined = H4/H6 confusion wave/novelty decay
  confounder-section  -> no confounder listed = H2/H3/H8 not excluded
  raw-archived        -> no raw archived = not reproducible
  falsification       -> no falsification section = H7 self-verification bias
  scope-disambig      -> mentions dwell/avgSessionDuration without session/page scope = H1 (most fatal)
  rate-vs-count       -> no rate-vs-count discipline = H2
  verdict             -> no clear conclusion

Usage:
  analysis-report-health.py reports/homepage-redesign-impact-D+10-2026-06-05.md
  analysis-report-health.py {file} --tier=deep      # default, all 5 hard
  analysis-report-health.py {file} --tier=light     # only raw-archived hard
  analysis-report-health.py {file} --json
Exit codes: 0 PASS / 1 FAIL (hard gate not met) / 2 file problem.

Origin: 2026-06-05 ANALYSIS-PIPELINE (design Section 4 + Section 7.1 structural gate).
"""
import argparse
import json
import re
import sys
from pathlib import Path


def load(path):
    p = Path(path)
    if not p.exists():
        print(f"❌ File not found: {path}", file=sys.stderr)
        sys.exit(2)
    return p.read_text(encoding="utf-8")


def has(text, *patterns):
    return any(re.search(p, text, re.I) for p in patterns)


def check_window(t):
    ok = has(t, r"^windows:", r"\bBEFORE\b", r"\bAFTER\b", r"窗口", r"boundary",
             r"分界", r"before/after", r"D\+\d+") and \
        len(re.findall(r"20\d\d-\d\d-\d\d|\d{1,2}/\d{1,2}", t)) >= 2
    return ok, "Must define analysis window/boundary (two or more dates + BEFORE/AFTER or attribution boundary)"


def check_confounder(t):
    ok = has(t, r"confounder", r"混淆", r"但書", r"caveat", r"\bH[1-9]\b",
             r"排除", r"lag", r"attribution.lag", r"流量混入", r"爬蟲", r"crawler")
    return ok, "Must have confounder/caveat section (list and address confounders: at minimum attribution lag / traffic mixing / crawler)"


def check_raw(t):
    ok = has(t, r"reports/research", r"raw.*json", r"\.json", r"原始數據", r"附錄.*數據", r"raw dump")
    return ok, "Must point to archived raw query data (reports/research/*.json) to ensure reproducibility"


def check_falsify(t):
    # falsification can be framed as: explicit counter-explanation (impact reports)
    # OR anti-over-attribution / anti-bias self-check (attribution reports). Both guard H7.
    ok = has(t, r"反例", r"反解釋", r"證偽", r"falsif", r"自我驗證", r"最強反",
             r"無法.{0,6}排除", r"也可能是", r"counter", r"anti-bias", r"自檢",
             r"不要把.{0,8}(全給|講大|過頭)", r"別把.{0,12}(講大|講過頭|全給)",
             r"誠實的故事", r"把數據講準", r"不亂歸因", r"過度歸因", r"Q13")
    return ok, "Must have falsification/counter-explanation section (strongest counter-explanation + why it doesn't hold, or anti-over-attribution self-check, guards H7 self-verification bias)"


def check_scope(t):
    # only fires if the report talks about dwell / session duration
    mentions_dwell = has(t, r"avgSessionDuration", r"averageSessionDuration", r"停留",
                         r"session\s*dur", r"engagementDuration", r"dwell")
    if not mentions_dwell:
        return True, "(no dwell metrics mentioned, scope check not applicable)"
    disambig = has(t, r"session\s*級", r"page\s*級", r"user\s*級", r"session-scoped",
                   r"page-scoped", r"userEngagementDuration", r"每人", r"per.user",
                   r"session 變深", r"尺度")
    return disambig, "When discussing dwell/avgSessionDuration, must disambiguate session-level vs page-level (H1 most fatal: +334% session-level != page-level dwell)"


def check_rate(t):
    ok = has(t, r"engagementRate", r"bounceRate", r"看率", r"率.{0,4}量", r"不用.{0,4}絕對",
             r"跳出率", r"互動率", r"per-user", r"每人")
    return ok, "Must have rate-vs-count discipline (use engagementRate/bounce/page-level; don't use absolute counts when user volume changes)"


def check_verdict(t):
    ok = has(t, r"verdict", r"結論", r"判定", r"## .*結論", r"TL;DR", r"一句話結論")
    return ok, "Must have explicit verdict / conclusion"


def check_prereg(t):
    # v1.1: pre-registration discipline — does the report state its hypothesis + success/falsification criteria (counters H7 goalpost-moving)
    ok = has(t, r"假設", r"成功判準", r"證偽判準", r"預先註冊", r"pre.?reg",
             r"hypothesis", r"^windows:", r"成功/?證偽", r"判準")
    return ok, "(v1.1) Should declare hypothesis + success/falsification criteria (pre-registration, counters H7 post-hoc goalpost-moving)"


def check_mission(t):
    # v1.1: Goodhart / mission alignment — does optimization analysis ask "does this metric serve MANIFESTO or goodhart a proxy"
    optimization = has(t, r"改版", r"優化", r"轉換率", r"提升.{0,4}engagement", r"建議.{0,8}(上移|重設計|加)", r"feature")
    if not optimization:
        return True, "(not an optimization analysis, mission-alignment check not applicable)"
    ok = has(t, r"Goodhart", r"使命", r"代理指標", r"proxy", r"MANIFESTO", r"clickbait",
             r"靈魂", r"背叛", r"策展.{0,4}靈魂", r"局部.{0,2}最高")
    return ok, "(v1.1) Optimization analysis should ask: does this metric serve MANIFESTO, or goodhart a proxy (engagement up but soul down)"


CHECKS = [
    ("window-defined", "hard", check_window),
    ("confounder-section", "hard", check_confounder),
    ("raw-archived", "hard", check_raw),
    ("falsification", "hard", check_falsify),
    ("scope-disambig", "hard", check_scope),
    ("rate-vs-count", "warn", check_rate),
    ("verdict", "warn", check_verdict),
    ("pre-registration", "warn", check_prereg),
    ("mission-alignment", "warn", check_mission),
]

LIGHT_HARD = {"raw-archived"}  # light tier: only require reproducibility


def main():
    ap = argparse.ArgumentParser(description="Analysis-report honesty-gate linter")
    ap.add_argument("file")
    ap.add_argument("--tier", choices=["deep", "light"], default="deep")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    t = load(a.file)

    results = []
    hard_fail = 0
    for cid, sev, fn in CHECKS:
        ok, msg = fn(t)
        eff = sev
        if a.tier == "light" and sev == "hard" and cid not in LIGHT_HARD:
            eff = "warn"
        status = "PASS" if ok else ("FAIL" if eff == "hard" else "WARN")
        if not ok and eff == "hard":
            hard_fail += 1
        results.append({"check": cid, "severity": eff, "status": status, "detail": msg if not ok else ""})

    passed = hard_fail == 0
    if a.json:
        print(json.dumps({"file": a.file, "tier": a.tier, "passed": passed,
                          "hard_fail": hard_fail, "checks": results}, ensure_ascii=False, indent=2))
        sys.exit(0 if passed else 1)

    icon = {"PASS": "✅", "WARN": "⚠️ ", "FAIL": "❌"}
    print(f"🧬 analysis-report-health [{a.tier}] {a.file}")
    for r in results:
        line = f"   {icon[r['status']]} {r['check']:<20} {r['status']}"
        if r["detail"]:
            line += f" — {r['detail']}"
        print(line)
    print(f"\n{'✅ PASS' if passed else '❌ FAIL'}  (hard_fail={hard_fail})")
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
