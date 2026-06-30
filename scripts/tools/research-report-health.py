#!/usr/bin/env python3
"""research-report-health.py — Stage 1 SSOT 研究reportQualitygate

對標研究所論文standard：一份 depth-article 的 research report Must是 SSOT —
RecordfullSearch軌跡（method論）+ 多語系/一手/academicSource多樣性 + Each claim 的信度Mark +
fullreference文獻。這tool把 REWRITE-PIPELINE Stage 1 的Search配額From「aspirational rule」
儀器化成「可量測的 hard gate」(REFLEXES #15)。

Background（2026-06-04 深度研究-design研究院 session）：
量測 226 份歷史 research report 發現 57% English/國際/academicSource = 0、42% distinct Source ≤ 10，
且 v6.3 多 agent 編排「合成 clean fact-pack」把 agent originalSearch軌跡丟掉（違反 Step 1.7
「不摘要」）。Cheyu directive：Stage 0 20+ / Stage 1 80+ / all寫回 report 當 SSOT / 對標論文。

stdlib-only，可接 CI gate。

Usage:
  python3 scripts/tools/research-report-health.py reports/research/2026-06/{slug}.md
 python3 scripts/tools/research-report-health.py {file} --tier=depth # Default
  python3 scripts/tools/research-report-health.py {file} --tier=standard
  python3 scripts/tools/research-report-health.py {file} --json
Exit codes: 0 = PASS, 1 = FAIL (hard 未過), 2 = fileissue
"""
import argparse
import json
import re
import sys
from pathlib import Path

# ── Sourcecategory heuristics ──────────────────────────────────────────────
EN_HINTS = (
    "en.wikipedia.org", "dezeen", "bbc.", "reuters", "theguardian", "nytimes",
    "scholar.google", "jstor", "wdo.org", "designboom", "cnn.", "apnews",
    "sciencedirect", "springer", "nature.com", "taipeitimes", "taiwan-panorama",
    "focustaiwan", "researchgate", "academia.edu", "ieee", "acm.org", "arxiv",
    "/en/", "thediplomat", "aljazeera", "economist", "ft.com", "wsj.com",
    "japantimes", "koreaherald", "scmp.com",
 # 2026-06-12 justfont EVOLVE 補：科技/design題常見English媒體與國際組織（原漏）
    "qz.com", "appleinsider", "goldthread", "atypi.org", "en.morisawa", "blog.adobe",
 # 2026-06-14 造山者 EVOLVE 補：record片/半導體/外交題常見English媒體・智庫・academic・English官方頻道（原漏）
    "cinemaescapist", "aparc.fsi", "hoover.org", "fpri.org", "sagepub", "gasiantimes",
    "jsis.washington", "taiwanplus", "/english/", "larb.org", "fsi.stanford",
)
# 一手 = 官方 / 政府 / academicoriginalSource
# 註：.org.tw 多為財團法人 / 官方機構 / 協會官網（tdri.org.tw / goldenpin.org.tw /
# *.design.org.tw 等），算一手；.com.tw 太廣（含 chinatimes 等媒體）故不納入。
PRIMARY_HINTS = (
    ".gov.tw", ".gov/", "gov.tw", ".edu.tw", ".edu/", "edu.tw", "sinica.edu",
 ".org.tw", # 財團法人 / 官方機構 / 協會官網（2026-06-04 v2 實驗補：原漏 tdri.org.tw 等）
    "ndltd.ncl", "airitilibrary", "stat.gov", "ly.gov.tw", "president.gov",
    "ey.gov", "moc.gov", "moe.gov", "drnh.gov", "scholar.google", "jstor",
    "law.moj", "mops.twse", "gcis.nat", "data.gov", "nmth", "npm.gov",
    "ith.sinica", "drnh", "twreporter",  # 報導者 = 深度一手調查
 # 2026-06-12 justfont EVOLVE 補（原漏，general性站得住）：官方 source repo＝一手 artifact；
 # 群募platform專案頁＝募資originalData；國際專業協會官網＝一手
    "github.com", "flyingv.cc", "wabay.tw", "zeczec.com", "atypi.org",
)
# 信度Mark pattern
CONFIDENCE_RE = re.compile(
    r"高信度|高信心|高可信|single[_\s-]?source|single來源|未驗證|unverified|"
    r"high_confidence|待驗|必驗|交叉(驗證|比對)|verbatim|逐字|信度[:：]|confidence"
)
# Search日誌 / method論 section
SEARCHLOG_RE = re.compile(
    r"##+\s*.*(搜尋(日誌|record|記錄|log)|method論|search\s*log|探索搜尋|query|查詢record|"
    r"研究method|搜尋軌跡|methodology)",
    re.IGNORECASE,
)
# 信心程度三層System（v6.5 — 12 範本 #1 共通 pattern）
VERIF_TIERS = (
    re.compile(r"high_confidence|高信度|高可信"),
    re.compile(r"single_source|single來源"),
    re.compile(r"unverified|未驗證|搜尋.{0,6}未(找到|獲)"),
)
# negative findings（搜了沒Found也要記）
NEGATIVE_RE = re.compile(
    r"未找到|未獲|查無|搜尋.{0,8}(未|無)|no data found|未release|未public|找不到|無法(get|查證|驗證)"
)
# 反例 / 不能說的話 / 不採信list section（護欄前置）
COUNTEREX_RE = re.compile(
    r"##+\s*.*(反例|不能說|不採信|必驗反例|可能陷阱|red[_\s-]?flag|護欄|不可寫|risk)",
    re.IGNORECASE,
)
URL_RE = re.compile(r"https?://[^\s\)\]\>\"'，。、；]+")

# ── Stage 0 perspective formation exit gate 三件套（v7.3 — Cheyu anti-drift 儀器化）─────────
# Fetch「persona-only」drift：跑了 persona 但Skipped 0.6.1 六核心issue + 0.6.4 ≥20 探索Search。
VIEWPOINT_RE = re.compile(r"##+\s*.*perspective formation")
# 2026-06-14 p0-legion 校準（REFLEXES #66 gate dogfood）：原 regex 只認「20 路 persona」相鄰
# 或「persona 切入點」，漏掉 pipeline 自己的詞彙「入射角」（REWRITE Step 0.6.1-bis「撐開研究入射角」）
# + 合成report常用的 `**personaAngles（20 路原文）**` bold marker。三者皆 legit persona section。
PERSONA_RE = re.compile(r"(##+\s*.*(20\s*路\s*persona|persona\s*(切入點|入射角))|personaAngles)", re.IGNORECASE)
FRONTMATTER_VP_RE = re.compile(r"^viewpoint_formed:\s*true", re.MULTILINE)
# 六核心issue落檔structureMark（Memory/多元面貌/想法感受/歷史脈絡/社會關聯/類型 → §perspective formation sub-sections）
SIXQ_MARKERS = (
    re.compile(r"記憶\s*anchor|對台灣人的記憶"),
    re.compile(r"多元面貌|多元different面貌"),
    re.compile(r"歷史脈絡"),
    re.compile(r"切入點list"),
    re.compile(r"研究方向"),
    re.compile(r"核心矛盾candidate|expected核心矛盾"),
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
 # Stage 0 perspective formation 三件套 signals
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
 # 0 = HARD（egregious — corresponding 57% reportEnglish/一手Source = 0 的System性issue）；
 # 0 < got < target = WARN（nudge 不強迫塞 token Source，Avoid懲罰正當的本土/兩岸題目）。
        nonlocal hard_fail, warn
        if got == 0:
            hard_fail += 1
            results.append((name, got, "≥ 1 (0=fail)", "hard", False))
        elif got < target:
            warn += 1
 results.append((name, got, f"理想 ≥ {target}", "warn", False))
        else:
            results.append((name, got, f"≥ {target}", "warn", True))

 simple("distinct Source數", metrics["distinct"], md, "hard")
 floor_then_target("English/國際/academicSource", metrics["en"], me)
 floor_then_target("一手/官方/academicSource", metrics["primary"], mp)
 simple("Search日誌/method論 section",
           1 if metrics["has_searchlog"] else 0, 1, "hard")
 simple("信度三層System (high/single/unverified)", metrics["verif_tiers"], 2, "hard")
 simple("信度Mark數", metrics["confidence"], mc, "warn")
 simple("negative findings record (搜了沒Found)",
           1 if metrics["has_negative"] else 0, 1, "warn")
 simple("反例/不採信/護欄 section",
           1 if metrics["has_counterex"] else 0, 1, "warn")
 simple("report行數 (SSOT 厚度)", metrics["lines"], ml, "warn")
    return results, hard_fail, warn


def grade_stage0(m):
 """Stage 0 perspective formation exit gate — 三件套全到才進 Stage 1（Cheyu anti-drift 儀器化）。
 核心：Fetch persona-only drift —— 跑了 persona 卻Skipped 0.6.1 六核心issue + 0.6.4 ≥20 探索Search。
 ≥10 distinct Source是「≥20 探索真的發生」的 proxy（persona-only 只發散issue → ~0 Source）。"""
    results = []
    hard = 0

    def chk(name, ok, detail):
        nonlocal hard
        if not ok:
            hard += 1
        results.append((name, ok, detail))

 chk("§perspective formation section", m["has_viewpoint"], "缺 `## perspective formation`")
 chk("frontmatter viewpoint_formed: true", m["viewpoint_formed"], "缺 `viewpoint_formed: true`")
 chk("六核心issue落檔structure (≥4/6)", m["sixq"] >= 4, f"只有 {m['sixq']}/6 structureMark (Memory/多元/脈絡/切入點/方向/矛盾)")
 chk("§20 路 persona 切入點", m["has_persona"], "缺 persona 切入點 section")
 chk("Search日誌/探索record section", m["has_searchlog"], "缺 `### 探索Searchrecord`")
 chk("≥20 探索Search (distinct Source ≥10 proxy)", m["distinct"] >= 10,
 f"只有 {m['distinct']} distinct Source — persona-only？≥20 探索本該留 ≥10 Source")
    return results, hard


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("report")
    ap.add_argument("--tier", default="depth", choices=list(TIERS))
    ap.add_argument("--stage", choices=["0", "1"], default="1",
 help="0 = Stage 0 perspective formation exit gate (三件套 anti-drift); 1 = Stage 1 SSOT gate (Default)")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    p = Path(args.report)
    if not p.exists():
 print(f"❌ Not found research report: {p}", file=sys.stderr)
        sys.exit(2)

    m = analyze(p)

 # ── Stage 0 perspective formation exit gate（Cheyu anti-drift：persona ≠ Stage 0 all）──
    if args.stage == "0":
        results, hard_fail = grade_stage0(m)
        if args.json:
            print(json.dumps(dict(file=str(p), stage=0, metrics=m,
                                  hard_fail=hard_fail, passed=(hard_fail == 0)),
                             ensure_ascii=False, indent=2))
            sys.exit(0 if hard_fail == 0 else 1)
 print(f"🔬 research-report-health [Stage 0 perspective formation exit gate] {p}")
        for name, ok, detail in results:
            print(f"   {'✅' if ok else '🔴'} {name}" + ("" if ok else f"  — {detail}"))
        verdict = "PASS" if hard_fail == 0 else "FAIL"
        print(f"\n   Summary: hard_fail={hard_fail}  → {verdict}")
        if hard_fail:
 print(" ⛔ Stage 0 三件套未齊 = 不進 Stage 1。六核心issue + ≥20 探索 + persona 缺一不可"
 "（persona-only does not count Stage 0 做完）。")
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
 print(f" Source域名多樣性: {m['domains']} domains / {m['distinct']} URLs")
    for name, got, need, sev, ok in results:
        icon = "✅" if ok else ("🔴" if sev == "hard" else "⚠️ ")
 bar = "" if ok else f" (需 {need})"
        print(f"   {icon} {name}: {got}{bar}")
    verdict = "PASS" if hard_fail == 0 else "FAIL"
    print(f"\n   Summary: hard_fail={hard_fail} warn={warn}  → {verdict}")
    if hard_fail:
 print(" ⛔ Stage 1 不過 = 不進 Stage 2。回去補Search + 把originalSearch軌跡寫Report告 (SSOT)。")
    sys.exit(0 if hard_fail == 0 else 1)


if __name__ == "__main__":
    main()
