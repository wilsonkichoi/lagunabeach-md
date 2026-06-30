#!/usr/bin/env python3
"""prioritize-batch.py — Smart babel priority ordering + tier router

Design (2026-05-09 post-finale):

After Phase 6 Spore SSOT cleanup, first babel wave of 11 zero-coverage articles
succeeded (55/55 100% Tier 1 owl-alpha). Next: priority ordering for continued
babel + 20 articles/batch + smart tier routing + self-evolution.

## Priority schema

| Tier | Name           | Criteria                                                      |
| ---- | -------------- | ------------------------------------------------------------- |
| P0   | Gap            | status = missing (translation file doesn't exist)             |
| P1   | Major update   | status = stale + (added+removed) >= 50 lines OR added >= 30  |
| P2   | Minor update   | status = stale + (added+removed) < 50 lines                  |
| P2.5 | Footnote/meta  | status = metadata-stale (trailer / footnote URL changes)      |
| P3   | Old article    | status = fresh + translatedAt >= 60 days ago                  |

## Smart tier router

Per article, outputs suggested starting tier:

- **topic_sensitivity**: politics/cross-strait/sovereignty keywords in title/cat -> skip Tier 2 Hy3 (85% refusal on Taiwan content)
- **article_size**: zh body > 5KB -> Tier 1 owl-alpha (1M ctx) / < 5KB -> any cloud tier
- **prior_refusal_cache**: `.lang-sync-tasks/_refusal-cache.json` records which (slug, lang) were refused by which tier -> skip that tier

Output: 20 articles per batch, annotated with priority + tier; consumable by prepare-batch.py.

Usage:
    # List all priority classifications
    python3 prioritize-batch.py --lang en --report

    # Get next batch of 20 P0/P1 (output JSON for prepare-batch.py)
    python3 prioritize-batch.py --lang en --top-n 20 --priority P0,P1 --out /tmp/next-batch.txt
"""

import argparse
import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
LANGS = ["en", "ja", "ko", "es", "fr"]

# PRC-sensitive keyword pattern (title / category / tags hit → escalate)
SENSITIVE_KEYWORDS = re.compile(
    r"(政治|兩岸|台獨|國防|民主|主權|中華|統獨|228|二二八|戒嚴|白色恐怖|"
    r"反送中|香港|西藏|新疆|維吾爾|抗中|認知作戰|解放軍|國共|心戰|"
    r"民進黨|國民黨|時代力量|台灣民眾黨|台聯|新黨)"
)

OLD_THRESHOLD_DAYS = 60


def parse_diff_size(diff_str):
    """'+12 -3' -> (12, 3). Returns (0, 0) if not a stale row."""
    if not diff_str or not isinstance(diff_str, str):
        return 0, 0
    m = re.match(r"\+(\d+)\s+-(\d+)", diff_str.strip())
    if not m:
        return 0, 0
    return int(m.group(1)), int(m.group(2))


def days_since_translation(translated_at):
    """ISO timestamp -> days since now."""
    if not translated_at:
        return 999
    try:
        ts = datetime.fromisoformat(translated_at.replace("Z", "+00:00"))
        if ts.tzinfo is None:
            ts = ts.replace(tzinfo=timezone.utc)
        delta = datetime.now(timezone.utc) - ts
        return delta.days
    except (ValueError, TypeError):
        return 999


def classify_priority(row):
    """row from status.py JSON → priority string."""
    status = row.get("status", "")
    if status == "missing":
        return "P0"
    if status == "stale":
        added = row.get("added", 0)
        removed = row.get("removed", 0)
        if added + removed >= 50 or added >= 30:
            return "P1"
        return "P2"
    if status == "metadata-stale":
        return "P2.5"
    if status == "fresh":
        days = days_since_translation(row.get("translatedAt"))
        if days >= OLD_THRESHOLD_DAYS:
            return "P3"
    return "skip"


def is_sensitive(zh_path):
    """Test article path / title for PRC-sensitive keywords."""
    if SENSITIVE_KEYWORDS.search(zh_path):
        return True
    full = REPO / "knowledge" / zh_path
    if not full.exists():
        return False
    try:
        text = full.read_text(encoding="utf-8")
    except OSError:
        return False
    # Check first 1000 chars (title + frontmatter + opening)
    return bool(SENSITIVE_KEYWORDS.search(text[:1000]))


def article_size(zh_path):
    """zh body size in bytes."""
    full = REPO / "knowledge" / zh_path
    if not full.exists():
        return 0
    try:
        return full.stat().st_size
    except OSError:
        return 0


def suggest_tier(zh_path, prior_refusals=None):
    """Smart tier router: return suggested first tier (1-4) + reasoning.

    Prior refusal cache shape: {f"{lang}/{slug}": ["tier1","tier2"]}
    """
    sensitive = is_sensitive(zh_path)
    size = article_size(zh_path)
    reasons = []

    if sensitive:
        reasons.append("sensitive→skip-Hy3")
    if size > 5000:
        reasons.append(f"size={size}B→Tier1-1M-ctx")

    # Default: Tier 1 owl-alpha (proven 100% on last batch)
    suggested_tier = 1

    # If prior refusal cache says owl-alpha refused this lang, escalate to Tier 3
    # (skipping Hy3 because if owl-alpha refused, Hy3 almost certainly will too on Taiwan content)
    if prior_refusals and any("tier1" in v for v in prior_refusals.values()):
        suggested_tier = 3
        reasons.append("prior-Tier1-refuse→Tier3-Ollama")

    return suggested_tier, "; ".join(reasons) if reasons else "default-Tier1"


def get_status_data(lang):
    """Run status.py with --json to get fresh+stale+metadata-stale rows."""
    result = subprocess.run(
        ["python3", "scripts/tools/lang-sync/status.py", "--lang", lang, "--json", "--no-write"],
        capture_output=True,
        text=True,
        cwd=REPO,
    )
    if result.returncode != 0:
        # Fallback: try without --json (older versions)
        return []
    try:
        data = json.loads(result.stdout)
        return data.get("articles", []) if isinstance(data, dict) else data
    except json.JSONDecodeError:
        return []


def parse_status_table(lang, status_cache=None):
    """Read rows for `lang` from cached _translation-status.json. Much faster than running status.py.

    Returns rows: {zh_path, status, lang, added, removed, translatedAt}
    Status values: missing | stale | metadata-stale | fresh
    """
    rows = []
    if status_cache is None:
        cache_path = REPO / "src" / "data" / "_translation-status.json"
        if not cache_path.exists():
            return rows
        status_cache = json.loads(cache_path.read_text())

    diff_re = re.compile(r"\+(\d+)\s+-(\d+)")
    for zh_path, art in status_cache["byArticle"].items():
        trans = art.get("translations", {})
        t = trans.get(lang)
        if t is None:
            # Translation file doesn't exist
            row = {"zh_path": zh_path, "status": "missing", "lang": lang}
            rows.append(row)
            continue
        row = {
            "zh_path": zh_path,
            "lang": lang,
            "status": t.get("status", "fresh"),
            "translatedAt": t.get("translatedAt", ""),
            "commitsBehind": t.get("commitsBehind", 0),
        }
        diff = t.get("diffSummary", "")
        m = diff_re.match(diff) if diff else None
        if m:
            row["added"] = int(m.group(1))
            row["removed"] = int(m.group(2))
        rows.append(row)
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", default="en", help="Lang to prioritize (or 'all' for cross-lang aggregate)")
    ap.add_argument("--top-n", type=int, default=20, help="Batch size per output")
    ap.add_argument("--priority", default="P0,P1,P2,P2.5,P3", help="Comma-separated priority filter")
    ap.add_argument("--out", default=None, help="Write zh paths (one per line) to file")
    ap.add_argument("--report", action="store_true", help="Show full priority histogram report")
    ap.add_argument("--json", action="store_true", help="Output JSON instead of table")
    ap.add_argument("--by-article", action="store_true",
                    help="Aggregate by zh article (one row per article with all needing langs) — pick top-N unique articles")
    args = ap.parse_args()

    priorities = set(args.priority.split(","))

    # Load prior refusal cache (optional)
    cache_path = REPO / ".lang-sync-tasks" / "_refusal-cache.json"
    prior_refusals_global = {}
    if cache_path.exists():
        try:
            prior_refusals_global = json.loads(cache_path.read_text())
        except Exception:
            pass

    langs = LANGS if args.lang == "all" else [args.lang]

    # For each lang, parse status, classify, sort
    all_rows = []
    for lang in langs:
        rows = parse_status_table(lang)
        for row in rows:
            row["priority"] = classify_priority(row)
            all_rows.append(row)

    # Filter by priority
    selected = [r for r in all_rows if r["priority"] in priorities]

    # Sort by priority order then by impact (added+removed desc) then alphabetical
    PRIO_ORDER = {"P0": 0, "P1": 1, "P2": 2, "P2.5": 3, "P3": 4, "skip": 99}
    selected.sort(
        key=lambda r: (
            PRIO_ORDER.get(r["priority"], 99),
            -(r.get("added", 0) + r.get("removed", 0)),
            r["zh_path"],
        )
    )

    # By-article aggregation: pick top-N unique zh articles, with all needing langs
    if args.by_article:
        by_zh = {}
        for r in selected:
            zh = r["zh_path"]
            if zh not in by_zh:
                by_zh[zh] = {
                    "zh_path": zh,
                    "priority": r["priority"],
                    "max_diff": r.get("added", 0) + r.get("removed", 0),
                    "langs_needed": [],
                }
            else:
                # Take highest priority (lowest order)
                if PRIO_ORDER.get(r["priority"], 99) < PRIO_ORDER.get(by_zh[zh]["priority"], 99):
                    by_zh[zh]["priority"] = r["priority"]
                by_zh[zh]["max_diff"] = max(by_zh[zh]["max_diff"], r.get("added", 0) + r.get("removed", 0))
            by_zh[zh]["langs_needed"].append(r["lang"])
        # Re-sort by aggregated priority
        agg = sorted(
            by_zh.values(),
            key=lambda r: (PRIO_ORDER.get(r["priority"], 99), -r["max_diff"], r["zh_path"]),
        )
        if args.json:
            print(json.dumps(agg[: args.top_n], ensure_ascii=False, indent=2))
        else:
            print(f"📋 Top {args.top_n} unique articles (by-article aggregate, filter={args.priority}):")
            print(f"{'Prio':6s} {'MaxDiff':>8s}  {'Langs':25s}  zh_path")
            print("-" * 100)
            for r in agg[: args.top_n]:
                print(f"{r['priority']:6s} {r['max_diff']:>8d}  {','.join(sorted(r['langs_needed'])):25s}  {r['zh_path']}")
            if args.out:
                Path(args.out).write_text("\n".join(r["zh_path"] for r in agg[: args.top_n]) + "\n")
                print(f"\n✅ Wrote {min(len(agg), args.top_n)} zh paths to {args.out}")
        return

    if args.report:
        print(f"📊 Babel priority report (lang={args.lang})")
        print(f"   Total candidates: {len(all_rows)}")
        from collections import Counter
        c = Counter(r["priority"] for r in all_rows)
        for p in ("P0", "P1", "P2", "P2.5", "P3", "skip"):
            print(f"   {p:5s}: {c.get(p, 0)}")
        print()
        print(f"📋 Top {args.top_n} (filter={args.priority}):")
        print(f"{'Prio':6s} {'Lang':4s} {'Status':16s} {'Diff':10s} {'Tier':5s} {'zh_path'}")
        print("-" * 100)
        for r in selected[: args.top_n]:
            cache_key = f"{r.get('lang','?')}/{r['zh_path']}"
            tier, _reason = suggest_tier(r["zh_path"], prior_refusals_global.get(cache_key))
            diff = f"+{r.get('added',0)} -{r.get('removed',0)}" if r.get("added") else ""
            print(f"{r['priority']:6s} {r.get('lang','?'):4s} {r['status']:16s} {diff:10s} T{tier:<4d} {r['zh_path']}")
        return

    if args.json:
        out = []
        for r in selected[: args.top_n]:
            tier, reason = suggest_tier(r["zh_path"], prior_refusals_global.get(f"{r.get('lang','?')}/{r['zh_path']}"))
            out.append({**r, "tier": tier, "tier_reason": reason})
        print(json.dumps(out, ensure_ascii=False, indent=2))
        return

    # Plain text output: zh paths (deduped, one per line) for prepare-batch.py --input
    seen = set()
    deduped = []
    for r in selected:
        zh = r["zh_path"]
        if zh not in seen:
            seen.add(zh)
            deduped.append(zh)
        if len(deduped) >= args.top_n:
            break

    if args.out:
        Path(args.out).write_text("\n".join(deduped) + "\n")
        print(f"✅ Wrote {len(deduped)} zh paths to {args.out}")
    else:
        print("\n".join(deduped))


if __name__ == "__main__":
    main()
