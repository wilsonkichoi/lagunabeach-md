#!/usr/bin/env python3
"""research-report-health.py — Stage 1 SSOT research report quality gate

Holds depth-article research reports to graduate-thesis standards: the report
must be SSOT, recording full search traces (methodology) + multilingual /
primary / academic source diversity + confidence marks for every claim +
complete references. This tool instruments the REWRITE-PIPELINE Stage 1
search quota from an aspirational rule into a measurable hard gate (REFLEXES #15).

Origin (2026-06-04 deep-research design-institute session):
Measuring 226 historical research reports found 57% had zero EN/intl/academic
sources and 42% had distinct sources <= 10. v6.3 multi-agent orchestration
"synthesized clean fact-packs" that discarded agent raw search traces (violating
Step 1.7 "no summarizing"). Directive: Stage 0 20+ / Stage 1 80+ / write all
back into report as SSOT / hold to thesis standard.

stdlib-only, CI-gate compatible.

Usage:
  python3 scripts/tools/research-report-health.py reports/research/2026-06/{slug}.md
  python3 scripts/tools/research-report-health.py {file} --tier=depth   # default
  python3 scripts/tools/research-report-health.py {file} --tier=standard
  python3 scripts/tools/research-report-health.py {file} --json
Exit codes: 0 = PASS, 1 = FAIL (hard gate not met), 2 = file problem
"""
import argparse
import json
import re
import sys
from pathlib import Path

# ── Source classification heuristics ──────────────────────────────────
EN_HINTS = (
    "en.wikipedia.org", "dezeen", "bbc.", "reuters", "theguardian", "nytimes",
    "scholar.google", "jstor", "wdo.org", "designboom", "cnn.", "apnews",
    "sciencedirect", "springer", "nature.com", "taipeitimes", "taiwan-panorama",
    "focustaiwan", "researchgate", "academia.edu", "ieee", "acm.org", "arxiv",
    "/en/", "thediplomat", "aljazeera", "economist", "ft.com", "wsj.com",
    "japantimes", "koreaherald", "scmp.com",
    # 2026-06-12 added: common EN media + intl orgs for tech/design topics (previously missed)
    "qz.com", "appleinsider", "goldthread", "atypi.org", "en.morisawa", "blog.adobe",
    # 2026-06-14 added: documentary/semiconductor/diplomacy EN media, think tanks, academia (previously missed)
    "cinemaescapist", "aparc.fsi", "hoover.org", "fpri.org", "sagepub", "gasiantimes",
    "jsis.washington", "taiwanplus", "/english/", "larb.org", "fsi.stanford",
)
# Primary = official / government / academic original sources
# Note: .org.tw mostly foundations / official orgs / association sites (tdri.org.tw /
#       goldenpin.org.tw / *.design.org.tw etc), counts as primary; .com.tw too broad
#       (includes media like chinatimes) so excluded.
PRIMARY_HINTS = (
    ".gov.tw", ".gov/", "gov.tw", ".edu.tw", ".edu/", "edu.tw", "sinica.edu",
    ".org.tw",  # foundations / official orgs / associations (2026-06-04 v2: previously missed tdri.org.tw etc)
    "ndltd.ncl", "airitilibrary", "stat.gov", "ly.gov.tw", "president.gov",
    "ey.gov", "moc.gov", "moe.gov", "drnh.gov", "scholar.google", "jstor",
    "law.moj", "mops.twse", "gcis.nat", "data.gov", "nmth", "npm.gov",
    "ith.sinica", "drnh", "twreporter",  # The Reporter = deep investigative primary
    # 2026-06-12 added (universally valid): official source repos = primary artifacts;
    # crowdfunding project pages = original fundraising data; intl professional associations = primary
    "github.com", "flyingv.cc", "wabay.tw", "zeczec.com", "atypi.org",
)
# Confidence mark pattern
CONFIDENCE_RE = re.compile(
    r"高信度|高信心|高可信|single[_\s-]?source|單一來源|未驗證|unverified|"
    r"high_confidence|待驗|必驗|交叉(驗證|比對)|verbatim|逐字|信度[:：]|confidence"
)
# Search log / methodology section
SEARCHLOG_RE = re.compile(
    r"##+\s*.*(搜尋(日誌|紀錄|記錄|log)|方法論|search\s*log|探索搜尋|query|查詢紀錄|"
    r"研究方法|搜尋軌跡|methodology)",
    re.IGNORECASE,
)
# Three-tier confidence system (v6.5 — common pattern from 12 templates #1)
VERIF_TIERS = (
    re.compile(r"high_confidence|高信度|高可信"),
    re.compile(r"single_source|單一來源"),
    re.compile(r"unverified|未驗證|搜尋.{0,6}未(找到|獲)"),
)
# Negative findings (searched but not found must also be recorded)
NEGATIVE_RE = re.compile(
    r"未找到|未獲|查無|搜尋.{0,8}(未|無)|no data found|未發布|未公開|找不到|無法(取得|查證|驗證)"
)
# Counter-examples / disallowed claims / rejection list section (guardrails)
COUNTEREX_RE = re.compile(
    r"##+\s*.*(反例|不能說|不採信|必驗反例|可能陷阱|red[_\s-]?flag|護欄|不可寫|風險)",
    re.IGNORECASE,
)
URL_RE = re.compile(r"https?://[^\s\)\]\>\"'，。、；]+")

# ── Stage 0 viewpoint-formation exit gate triplet (v7.3 — anti-drift instrumentation) ──
# Catch "persona-only" drift: ran persona but skipped 0.6.1 six core questions + 0.6.4 >=20 exploration searches.
VIEWPOINT_RE = re.compile(r"##+\s*.*觀點成型")
# 2026-06-14 p0-legion calibration (REFLEXES #66 gate dogfood): original regex only matched
# "20 路 persona" adjacent or "persona 切入點", missed pipeline's own term "入射角"
# (REWRITE Step 0.6.1-bis) + synthesis report's `**personaAngles**` bold marker. All three are legit.
PERSONA_RE = re.compile(r"(##+\s*.*(20\s*路\s*persona|persona\s*(切入點|入射角))|personaAngles)", re.IGNORECASE)
FRONTMATTER_VP_RE = re.compile(r"^viewpoint_formed:\s*true", re.MULTILINE)
# Six core question structure markers (memory/diverse facets/thoughts-feelings/historical context/social links/types)
SIXQ_MARKERS = (
    re.compile(r"記憶\s*anchor|對台灣人的記憶"),
    re.compile(r"多元面貌|多元不同面貌"),
    re.compile(r"歷史脈絡"),
    re.compile(r"切入點清單"),
    re.compile(r"研究方向"),
    re.compile(r"核心矛盾候選|預期核心矛盾"),
)

TIERS = {
    # tier: (min_distinct, min_en, min_primary, min_confidence, min_lines)
    "depth": (25, 5, 5, 8, 300),
    "standard": (15, 3, 3, 4, 150),
    "hub": (5, 1, 1, 0, 0),
}


def analyze(path: Path):
    txt = path.read_text(encoding="utf-8", errors="ignore")
    lines = txt.count("\n") + 1
    urls = [u.rstrip(".,;)。，、）]") for u in URL_RE.findall(txt)]
    distinct = sorted(set(urls))
    en = [u for u in distinct if any(h in u.lower() for h in EN_HINTS)]
    primary = [u for u in distinct if any(h in u.lower() for h in PRIMARY_HINTS)]
    confidence = len(CONFIDENCE_RE.findall(txt))
    has_searchlog = bool(SEARCHLOG_RE.search(txt))
    verif_tiers = sum(1 for r in VERIF_TIERS if r.search(txt))  # 0-3
    has_negative = bool(NEGATIVE_RE.search(txt))
    has_counterex = bool(COUNTEREX_RE.search(txt))
    # Stage 0 viewpoint-formation triplet signals
    has_viewpoint = bool(VIEWPOINT_RE.search(txt))
    has_persona = bool(PERSONA_RE.search(txt))
    viewpoint_formed = bool(FRONTMATTER_VP_RE.search(txt))
    sixq = sum(1 for r in SIXQ_MARKERS if r.search(txt))
    # domain diversity
    domains = set()
    for u in distinct:
        m = re.match(r"https?://([^/]+)", u)
        if m:
            domains.add(m.group(1).lower().lstrip("www."))
    return dict(
        lines=lines,
        distinct=len(distinct),
        en=len(en),
        primary=len(primary),
        domains=len(domains),
        confidence=confidence,
        has_searchlog=has_searchlog,
        verif_tiers=verif_tiers,
        has_negative=has_negative,
        has_counterex=has_counterex,
        has_viewpoint=has_viewpoint,
        has_persona=has_persona,
        viewpoint_formed=viewpoint_formed,
        sixq=sixq,
    )


def grade(metrics, tier):
    md, me, mp, mc, ml = TIERS[tier]
    results = []
    hard_fail = 0
    warn = 0

    def simple(name, got, need, sev):
        nonlocal hard_fail, warn
        ok = got >= need
        if not ok:
            if sev == "hard":
                hard_fail += 1
            else:
                warn += 1
        results.append((name, got, f"≥ {need}", sev, ok))

    def floor_then_target(name, got, target):
        # 0 = HARD (egregious — matches the systemic issue of 57% reports having zero EN/primary sources);
        # 0 < got < target = WARN (nudge without forcing token sources, avoid penalizing legitimate local topics).
        nonlocal hard_fail, warn
        if got == 0:
            hard_fail += 1
            results.append((name, got, "≥ 1 (0=fail)", "hard", False))
        elif got < target:
            warn += 1
            results.append((name, got, f"ideal ≥ {target}", "warn", False))
        else:
            results.append((name, got, f"≥ {target}", "warn", True))

    simple("distinct source count", metrics["distinct"], md, "hard")
    floor_then_target("EN/intl/academic sources", metrics["en"], me)
    floor_then_target("primary/official/academic sources", metrics["primary"], mp)
    simple("search log/methodology section",
           1 if metrics["has_searchlog"] else 0, 1, "hard")
    simple("confidence 3-tier system (high/single/unverified)", metrics["verif_tiers"], 2, "hard")
    simple("confidence mark count", metrics["confidence"], mc, "warn")
    simple("negative findings record (searched but not found)",
           1 if metrics["has_negative"] else 0, 1, "warn")
    simple("counter-example/rejection/guardrail section",
           1 if metrics["has_counterex"] else 0, 1, "warn")
    simple("report line count (SSOT depth)", metrics["lines"], ml, "warn")
    return results, hard_fail, warn


def grade_stage0(m):
    """Stage 0 viewpoint-formation exit gate — all three parts required before entering Stage 1.
    Core: catch persona-only drift — ran persona but skipped 0.6.1 six core questions + 0.6.4 >=20
    exploration searches. >=10 distinct sources is a proxy for ">=20 explorations actually happened"
    (persona-only diverges questions but yields ~0 sources)."""
    results = []
    hard = 0

    def chk(name, ok, detail):
        nonlocal hard
        if not ok:
            hard += 1
        results.append((name, ok, detail))

    chk("viewpoint-formation section", m["has_viewpoint"], "missing `## 觀點成型`")
    chk("frontmatter viewpoint_formed: true", m["viewpoint_formed"], "missing `viewpoint_formed: true`")
    chk("six core questions structure (>=4/6)", m["sixq"] >= 4, f"only {m['sixq']}/6 structure markers (memory/diverse/context/angles/direction/contradiction)")
    chk("20-persona angles section", m["has_persona"], "missing persona angles section")
    chk("search log/exploration record section", m["has_searchlog"], "missing `### 探索搜尋紀錄`")
    chk(">=20 exploration searches (distinct sources >=10 proxy)", m["distinct"] >= 10,
        f"only {m['distinct']} distinct sources — persona-only? >=20 explorations should yield >=10 sources")
    return results, hard


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("report")
    ap.add_argument("--tier", default="depth", choices=list(TIERS))
    ap.add_argument("--stage", choices=["0", "1"], default="1",
                    help="0 = Stage 0 viewpoint-formation exit gate (triplet anti-drift); 1 = Stage 1 SSOT gate (default)")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    p = Path(args.report)
    if not p.exists():
        print(f"❌ Research report not found: {p}", file=sys.stderr)
        sys.exit(2)

    m = analyze(p)

    # ── Stage 0 viewpoint-formation exit gate (anti-drift: persona != all of Stage 0) ──
    if args.stage == "0":
        results, hard_fail = grade_stage0(m)
        if args.json:
            print(json.dumps(dict(file=str(p), stage=0, metrics=m,
                                  hard_fail=hard_fail, passed=(hard_fail == 0)),
                             ensure_ascii=False, indent=2))
            sys.exit(0 if hard_fail == 0 else 1)
        print(f"🔬 research-report-health [Stage 0 viewpoint-formation exit gate]  {p}")
        for name, ok, detail in results:
            print(f"   {'✅' if ok else '🔴'} {name}" + ("" if ok else f"  — {detail}"))
        verdict = "PASS" if hard_fail == 0 else "FAIL"
        print(f"\n   Summary: hard_fail={hard_fail}  → {verdict}")
        if hard_fail:
            print("   ⛔ Stage 0 triplet incomplete = cannot enter Stage 1. Six core questions + >=20 "
                  "explorations + persona are all required (persona-only does not count as Stage 0 done).")
        sys.exit(0 if hard_fail == 0 else 1)

    results, hard_fail, warn = grade(m, args.tier)

    if args.json:
        print(json.dumps(
            dict(file=str(p), tier=args.tier, metrics=m,
                 hard_fail=hard_fail, warn=warn,
                 passed=(hard_fail == 0)),
            ensure_ascii=False, indent=2))
        sys.exit(0 if hard_fail == 0 else 1)

    print(f"🔬 research-report-health  {p}  (tier={args.tier})")
    print(f"   Source domain diversity: {m['domains']} domains / {m['distinct']} URLs")
    for name, got, need, sev, ok in results:
        icon = "✅" if ok else ("🔴" if sev == "hard" else "⚠️ ")
        bar = "" if ok else f"  (need {need})"
        print(f"   {icon} {name}: {got}{bar}")
    verdict = "PASS" if hard_fail == 0 else "FAIL"
    print(f"\n   Summary: hard_fail={hard_fail} warn={warn}  → {verdict}")
    if hard_fail:
        print("   ⛔ Stage 1 failed = cannot enter Stage 2. Go back, add searches, write raw search traces into report (SSOT).")
    sys.exit(0 if hard_fail == 0 else 1)


if __name__ == "__main__":
    main()
