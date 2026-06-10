#!/usr/bin/env python3
"""validate-spore-data.py — SSOT consistency checker for spore engagement data.

Checks 4 data layers (Phase 1 SSOT cleanup, 2026-05-08 laughing-goldstine):
  1. SPORE-LOG.md (canonical SSOT, rich-text Markdown)
  2. SPORE-HARVESTS/{batch}.md (frontmatter + body markdown table)
  3. knowledge/{lang}/{cat}/{slug}.md frontmatter sporeLinks (per-article view)
  4. public/api/dashboard-spores.json (generated derived)

Validates:
  - dashboard-spores.json mtime >= SPORE-LOG.md mtime (no stale dashboard)
  - Every spore in 發文紀錄 has matching parser-recognized harvest data
  - K/M suffix parser regression test (8 cases)
  - SPORE-HARVESTS body table parses cleanly across batch logs
  - SPORE-HARVESTS frontmatter key drift (`spore` singular legacy vs `spores` plural canonical)
  - SPORE-HARVESTS body data <-> SPORE-LOG struct cols cross-check (within tolerance)
  - knowledge sporeLinks identity-only guard (no metrics in frontmatter — v2 2026-06-10)
  - src/data/spores.json records layer present + fresh + complete

Exit code:
  0 = all green
  1 = warnings (informational, don't block)
  2 = errors (block CI / pre-commit)

Usage:
  python3 scripts/tools/validate-spore-data.py
  python3 scripts/tools/validate-spore-data.py --strict       # warnings -> errors
  python3 scripts/tools/validate-spore-data.py --audit-report PATH  # write detailed audit MD

Designed to be cheap (~ < 1 sec). Run on every refresh-data and pre-commit.
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
SPORE_LOG = REPO_ROOT / "docs/factory/SPORE-LOG.md"
HARVESTS_DIR = REPO_ROOT / "docs/factory/SPORE-HARVESTS"
DASHBOARD_JSON = REPO_ROOT / "public/api/dashboard-spores.json"
KNOWLEDGE_ROOT = REPO_ROOT / "knowledge"

# Tolerance for harvest body vs SPORE-LOG struct col cross-check (numbers can be approximate)
VIEWS_TOLERANCE_PCT = 5  # ±5% acceptable


def red(s):
    return f"\033[31m{s}\033[0m"


def green(s):
    return f"\033[32m{s}\033[0m"


def yellow(s):
    return f"\033[33m{s}\033[0m"


def parse_views_robust(text):
    """Robust K/M-aware views parser. Mirrors generate-dashboard-spores.py."""
    if not text:
        return None
    m = re.search(
        r"(\d+(?:\.\d+)?[KMkm]|\d{1,3}(?:,\d{3})+|\d+)\s+views?\b",
        text,
    )
    if not m:
        return None
    s = m.group(1)
    if s[-1] in "Kk":
        return int(float(s[:-1]) * 1000)
    if s[-1] in "Mm":
        return int(float(s[:-1]) * 1_000_000)
    return int(s.replace(",", ""))


def check_parser_regression():
    """Regression test for K/M suffix parser bug (objective-khorana day 2)."""
    cases = [
        ("**65.4K views**", 65400),
        ("**1.8K views**", 1800),
        ("180K views", 180000),
        ("**65,400 views**", 65400),
        ("**1,800 views**", 1800),
        ("65000 views", 65000),
        ("**300,000 views**", 300000),
        ("2.5M views", 2500000),
    ]
    failures = []
    for inp, expected in cases:
        got = parse_views_robust(inp)
        if got != expected:
            failures.append((inp, got, expected))
    return failures


def check_dashboard_freshness():
    """dashboard-spores.json mtime should be >= SPORE-LOG.md mtime."""
    if not DASHBOARD_JSON.exists():
        return [f"❌ {DASHBOARD_JSON.relative_to(REPO_ROOT)} missing"]
    if not SPORE_LOG.exists():
        return [f"❌ {SPORE_LOG.relative_to(REPO_ROOT)} missing"]
    log_mt = SPORE_LOG.stat().st_mtime
    dash_mt = DASHBOARD_JSON.stat().st_mtime
    issues = []
    if dash_mt < log_mt:
        delta = log_mt - dash_mt
        issues.append(
            f"⚠️  dashboard-spores.json is STALE "
            f"(SPORE-LOG.md was modified {delta:.0f}s after dashboard)\n"
            f"   Run: python3 scripts/tools/generate-dashboard-spores.py"
        )
    return issues


def parse_spore_log_rows():
    """Parse SPORE-LOG harvest table -> [{n, slug, platform, url, latest_views}].

    Returns rows where 'n' is parseable spore number.
    """
    if not SPORE_LOG.exists():
        return []
    rows = []
    in_metrics = False
    text = SPORE_LOG.read_text()
    for line in text.split("\n"):
        if "## 成效追蹤" in line:
            in_metrics = True
            continue
        if not in_metrics:
            continue
        if not line.startswith("| "):
            continue
        cells = [c.strip() for c in line.split("|")]
        if len(cells) < 11:
            continue
        n_str = cells[1]
        if not n_str.isdigit():
            continue
        rows.append({
            "n": int(n_str),
            "slug": cells[2],
            "platform": cells[3],
            "harvest_text": cells[10],
            "latest_views": parse_views_robust(cells[10]),
        })
    return rows


def check_unparsed_harvest():
    """Spores with harvest text but unparseable -> warning."""
    rows = parse_spore_log_rows()
    issues = []
    for row in rows:
        ht = row["harvest_text"]
        # Has harvest content but parser returns None?
        if ht and "views" in ht.lower() and row["latest_views"] is None:
            issues.append(
                f"⚠️  #{row['n']} {row['slug']} ({row['platform']}): "
                f"harvest text contains 'views' but parser returns None"
            )
    return issues


def check_dashboard_data_present():
    """Verify dashboard-spores.json has views_latest for spores with parsed harvest."""
    if not DASHBOARD_JSON.exists():
        return ["❌ dashboard-spores.json missing"]
    d = json.loads(DASHBOARD_JSON.read_text())
    recent_spores = {s["n"]: s for s in d.get("recent", []) if "n" in s}
    rows = parse_spore_log_rows()
    issues = []
    for row in rows:
        if row["latest_views"] is None:
            continue  # No harvest data, expected None in dashboard
        n = row["n"]
        if n not in recent_spores:
            continue  # Not in recent (older spore)
        dash_views = recent_spores[n].get("views_latest")
        if dash_views != row["latest_views"]:
            issues.append(
                f"❌ #{n} {row['slug']} ({row['platform']}): "
                f"SPORE-LOG parsed {row['latest_views']} but dashboard JSON has {dash_views}"
            )
    return issues


def check_sporelinks_consistency():
    """Spot-check article frontmatter sporeLinks URL matches SPORE-LOG URL."""
    issues = []
    rows = parse_spore_log_rows()
    log_urls = set()
    for row in rows:
        # Extract URL from harvest_text or from main 發文紀錄 (we don't have that here,
        # so skip URL extraction — just count rows)
        pass
    # Phase 1 SSOT cleanup: full sporeLinks frontmatter scan + cross-check moved to
    # check_sporelinks_vs_harvests() below
    sporelink_count = 0
    for md in KNOWLEDGE_ROOT.rglob("*.md"):
        try:
            text = md.read_text()
            if "sporeLinks:" in text:
                sporelink_count += 1
        except Exception:
            pass
    return issues, sporelink_count


# ───────────────────────────────── Phase 1 SSOT checks (2026-05-08) ─────────────────────────────────


def parse_harvest_frontmatter(md_path):
    """Parse YAML-lite frontmatter from harvest batch log. Returns dict or None.

    Handles BOTH legacy `spore: '#47'` (singular) and canonical `spores: '#47, #48'` (plural list).
    """
    try:
        text = md_path.read_text(encoding="utf-8")
    except Exception:
        return None
    if not text.startswith("---"):
        return None
    end = text.find("---", 3)
    if end == -1:
        return None
    fm_text = text[3:end].strip()
    fm = {}
    for line in fm_text.splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip().strip("'\"")
    return fm


def parse_harvest_body_table(md_path):
    """Parse the FIRST markdown pipe-table in a harvest batch log body.

    Returns: list of dicts keyed by NORMALIZED column name, or None if no parseable table.

    Column normalization (handles variation across batches):
      '#'                    → 'n'
      'Slug' / '文章'         → 'slug'
      'Platform' / '平台'     → 'platform'  (None if absent — batch log is single-platform)
      'D+N'                  → 'd_n'
      'Views' / 'Views (...)' → 'views'
      'Likes'                → 'likes'
      'Reposts'              → 'reposts'
      'Comments'             → 'comments'
      'Shares' / 'Shares/Bm' → 'shares'
      'Engagements'          → 'engagements'
      'Rate' / '互動率'       → 'rate'
      others                 → kept verbatim (lowercased)
    """
    try:
        text = md_path.read_text(encoding="utf-8")
    except Exception:
        return None
    # Strip frontmatter
    if text.startswith("---"):
        end = text.find("---", 3)
        if end != -1:
            text = text[end + 3:]

    # Find first markdown pipe-table block
    lines = text.splitlines()
    table_lines = []
    in_table = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("|") and stripped.endswith("|"):
            table_lines.append(stripped)
            in_table = True
        elif in_table and not stripped.startswith("|"):
            break

    if len(table_lines) < 3:  # need header + separator + ≥1 row
        return None

    # Parse header
    header_cells = [c.strip() for c in table_lines[0].strip("|").split("|")]
    header_norm = [_normalize_col(h) for h in header_cells]

    # Skip separator line (table_lines[1])
    rows = []
    for line in table_lines[2:]:
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) != len(header_norm):
            continue
        row = dict(zip(header_norm, cells))
        # Only count rows where 'n' is a digit
        n_str = row.get("n", "").strip()
        if not n_str.isdigit():
            continue
        rows.append(row)

    return rows if rows else None


def _normalize_col(col):
    """Normalize harvest body table column name to canonical key."""
    c = col.strip().lower()
    aliases = {
        "#": "n",
        "slug": "slug",
        "文章": "slug",
        "platform": "platform",
        "平台": "platform",
        "d+n": "d_n",
        "views": "views",
        "views (抓取時)": "views",
        "views (exact)": "views",
        "likes": "likes",
        "reposts": "reposts",
        "comments": "comments",
        "shares": "shares",
        "shares/bm": "shares",
        "engagements": "engagements",
        "rate": "rate",
        "互動率": "rate",
    }
    return aliases.get(c, c)


def _parse_int_loose(s):
    """Parse '8,130' / '65.4K' / '180K' / '12K' / 'D+10' → int or None."""
    if not s:
        return None
    s = s.strip().replace(",", "").replace("*", "").replace(" ", "")
    if not s or s in ("—", "-", "no-data", "n/a"):
        return None
    m = re.match(r"^([\d.]+)([KkMm]?)", s)
    if not m:
        return None
    try:
        n = float(m.group(1))
    except ValueError:
        return None
    suf = m.group(2).upper()
    if suf == "K":
        n *= 1_000
    elif suf == "M":
        n *= 1_000_000
    return int(n)


def check_harvests_body_parseable():
    """Check 1.1: every batch log in SPORE-HARVESTS/ has a parseable body table.

    Skip files whose body is non-metric tables (e.g. 33-草東沒有派對 has 留言分類 table only).
    Skip log files older than canonical schema introduction (heuristic: file name doesn't start with batch- or contains date < 2026-04-18).

    Returns: (issues, parsed_count, total_count)
    """
    issues = []
    parsed = 0
    total = 0
    for md in sorted(HARVESTS_DIR.glob("*.md")):
        total += 1
        rows = parse_harvest_body_table(md)
        if rows is None:
            # Could be intentional (留言分類 table, or no metrics table)
            issues.append(
                f"⚠️  {md.name}: no parseable body metrics table found"
            )
            continue
        parsed += 1
    return issues, parsed, total


def check_harvests_frontmatter_keys():
    """Check 1.2: detect frontmatter `spore` (singular legacy) vs `spores` (plural canonical).

    canonical: `spores: '#47, #48, ...'` (plural list)
    legacy:    `spore: '#47'` (single)
    Both are accepted by generator currently; flag legacy for migration.
    """
    issues = []
    legacy_count = 0
    canonical_count = 0
    for md in sorted(HARVESTS_DIR.glob("*.md")):
        fm = parse_harvest_frontmatter(md)
        if not fm:
            continue
        has_legacy = "spore" in fm and "spores" not in fm
        has_canonical = "spores" in fm
        if has_legacy:
            legacy_count += 1
            issues.append(
                f"⚠️  {md.name}: uses legacy 'spore' (singular) frontmatter key — "
                f"canonical is 'spores' (plural list)"
            )
        if has_canonical:
            canonical_count += 1
    return issues, legacy_count, canonical_count


def collect_harvests_by_spore():
    """Walk SPORE-HARVESTS/, return {spore_n: [{batch_path, harvest_date, d_n, views, ...}]}.

    Each spore_n maps to chronologically-ordered list of (batch_log, body_row) entries.
    For batches with `spores` (plural list), explode to one entry per spore #.
    """
    out = {}
    for md in sorted(HARVESTS_DIR.glob("*.md")):
        fm = parse_harvest_frontmatter(md)
        if not fm:
            continue
        body_rows = parse_harvest_body_table(md) or []
        body_by_n = {}
        for row in body_rows:
            try:
                n = int(row["n"])
                # Multiple D+N rows per # possible — keep latest D+N (highest)
                d_n_str = row.get("d_n", "").lstrip("D+").strip()
                d_n = int(d_n_str) if d_n_str.isdigit() else 0
                if n not in body_by_n or body_by_n[n].get("d_n_int", -1) < d_n:
                    row["d_n_int"] = d_n
                    body_by_n[n] = row
            except (ValueError, KeyError):
                continue

        # Frontmatter spore #s
        spore_str = fm.get("spores", fm.get("spore", "")).strip()
        spore_ns = []
        for tok in re.findall(r"#?(\d+)", spore_str):
            spore_ns.append(int(tok))

        for n in spore_ns:
            entry = {
                "batch_path": str(md.relative_to(REPO_ROOT)),
                "harvest_date": fm.get("harvest_date"),
                "body": body_by_n.get(n),
            }
            out.setdefault(n, []).append(entry)
    return out


def check_harvests_vs_log_consistency():
    """Check 1.3: SPORE-HARVESTS body data <-> SPORE-LOG struct cols cross-check.

    For each spore # found in SPORE-HARVESTS body table:
      - Find matching SPORE-LOG row by (n, platform)
      - Compare body row latest D+N views vs SPORE-LOG `7d 觸及` struct col
      - Flag mismatch outside ±VIEWS_TOLERANCE_PCT (allow some tolerance for D+3 vs D+7 timing)
    """
    issues = []
    log_rows = parse_spore_log_rows()
    log_by_key = {(r["n"], (r["platform"] or "").lower()): r for r in log_rows}

    harvests = collect_harvests_by_spore()
    for n, entries in harvests.items():
        for entry in entries:
            body = entry.get("body")
            if not body:
                continue
            platform = (body.get("platform") or "").lower()
            # If body has no platform col, try matching by n only
            if platform:
                key = (n, platform)
                log_row = log_by_key.get(key)
            else:
                # match any platform with same n
                log_row = next(
                    (log_by_key[(n, p)] for p in ("threads", "x") if (n, p) in log_by_key),
                    None,
                )

            if not log_row:
                # Spore exists in harvest but not in SPORE-LOG → orphan
                issues.append(
                    f"⚠️  #{n} {body.get('slug', '?')} ({platform or 'no-platform'}): "
                    f"in {entry['batch_path']} but missing from SPORE-LOG 成效追蹤 table"
                )
                continue

            body_views = _parse_int_loose(body.get("views"))
            log_views = log_row.get("latest_views")
            if body_views and log_views:
                pct_diff = abs(body_views - log_views) / max(log_views, 1) * 100
                if pct_diff > VIEWS_TOLERANCE_PCT:
                    issues.append(
                        f"⚠️  #{n} {log_row['slug']} ({platform}): "
                        f"SPORE-HARVESTS body {body_views:,} views vs SPORE-LOG narrative {log_views:,} "
                        f"(diff {pct_diff:.1f}%, tolerance ±{VIEWS_TOLERANCE_PCT}%)"
                    )
    return issues


def parse_sporelinks_from_md(md_path):
    """Extract sporeLinks YAML array from article frontmatter. Returns list of dicts."""
    try:
        text = md_path.read_text(encoding="utf-8")
    except Exception:
        return []
    if not text.startswith("---"):
        return []
    end = text.find("---", 3)
    if end == -1:
        return []
    fm_text = text[3:end]
    if "sporeLinks:" not in fm_text:
        return []
    # Naive parse: find sporeLinks block, extract list items
    lines = fm_text.split("\n")
    sl_start = next((i for i, l in enumerate(lines) if l.strip().startswith("sporeLinks:")), None)
    if sl_start is None:
        return []
    items = []
    cur = None
    for line in lines[sl_start + 1:]:
        if line.startswith("  - "):
            if cur:
                items.append(cur)
            cur = {}
            kv = line[4:].split(":", 1)
            if len(kv) == 2:
                cur[kv[0].strip()] = kv[1].strip().strip("'\"")
        elif line.startswith("    "):
            if cur is None:
                continue
            kv = line.strip().split(":", 1)
            if len(kv) == 2:
                cur[kv[0].strip()] = kv[1].strip().strip("'\"")
        else:
            if cur:
                items.append(cur)
            break
    if cur:
        items.append(cur)
    return items


METRIC_KEYS = ("views", "likes", "reposts", "comments", "shares")


def check_sporelinks_identity_only():
    """Check 1.4 v2 (2026-06-10 spore data decoupling): frontmatter sporeLinks
    must be IDENTITY ONLY (id/platform/date/url).

    Metric keys in any knowledge file (all langs) = ERROR regression — numbers
    live in src/data/spores.json (generate-spore-records.py); writing them back
    into articles re-pollutes git timestamps → content-dates → /latest +
    sitemap lastmod (reports/spore-data-architecture-2026-06-10.md).

    Keeps the zh-canonical URL ↔ SPORE-LOG cross-check as a warning.
    """
    errors = []
    warnings = []
    log_text = SPORE_LOG.read_text() if SPORE_LOG.exists() else ""
    log_urls = set(re.findall(r"\((https?://[^\)]+)\)", log_text))

    LANG_DIRS = {"en", "ja", "ko", "es", "fr", "zh-TW"}
    checked = 0
    for md in KNOWLEDGE_ROOT.rglob("*.md"):
        sl = parse_sporelinks_from_md(md)
        if not sl:
            continue
        rel = md.relative_to(REPO_ROOT)
        is_zh = md.relative_to(KNOWLEDGE_ROOT).parts[0] not in LANG_DIRS
        for link in sl:
            checked += 1
            leaked = [k for k in METRIC_KEYS if k in link]
            if leaked:
                errors.append(
                    f"❌ {rel}: sporeLinks carries metrics {leaked} — v2 is identity-only "
                    f"(id/platform/date/url); numbers belong in src/data/spores.json"
                )
            url = (link.get("url") or "").strip()
            if is_zh and url and url not in log_urls:
                warnings.append(
                    f"⚠️  {rel} sporeLinks URL not in SPORE-LOG: {url}"
                )
    return errors, warnings, checked


def check_spore_records():
    """Check 1.5 (2026-06-10): src/data/spores.json exists, parses, covers every
    發文紀錄 row, and is not older than its SSOT sources."""
    errors = []
    warnings = []
    records_path = REPO_ROOT / "src/data/spores.json"
    if not records_path.exists():
        errors.append("❌ src/data/spores.json missing — run generate-spore-records.py")
        return errors, warnings, 0
    try:
        data = json.loads(records_path.read_text())
    except json.JSONDecodeError as e:
        errors.append(f"❌ src/data/spores.json unparseable: {e}")
        return errors, warnings, 0

    n_records = len(data.get("spores", []))
    n_log = len(parse_spore_log_rows())
    if n_log and n_records != n_log:
        warnings.append(
            f"⚠️  spores.json has {n_records} records vs SPORE-LOG 發文紀錄 {n_log} rows "
            f"— regenerate (generate-spore-records.py)"
        )

    rec_mtime = records_path.stat().st_mtime
    sources = [SPORE_LOG]
    if HARVESTS_DIR.exists():
        sources.extend(HARVESTS_DIR.glob("*.md"))
    for src in sources:
        if src.exists() and src.stat().st_mtime > rec_mtime:
            warnings.append(
                f"⚠️  spores.json older than {src.name} — regenerate (generate-spore-records.py)"
            )
            break
    return errors, warnings, n_records


def write_audit_report(path, summary):
    """Write detailed audit report markdown to PATH. Phase 1 SSOT cleanup."""
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Spore Data SSOT Drift Audit",
        "",
        f"> Generated by `scripts/tools/validate-spore-data.py --audit-report` on {summary['timestamp']}",
        f"> Phase 1 of [reports/spore-ssot-pipeline-cleanup-2026-05-08.md](spore-ssot-pipeline-cleanup-2026-05-08.md)",
        "",
        "## Summary",
        "",
        f"- Errors:   **{summary['error_count']}**",
        f"- Warnings: **{summary['warning_count']}**",
        "",
        "## Layer 1: SPORE-HARVESTS body table parseability",
        "",
        f"- Total batch logs: {summary['harvest_total']}",
        f"- Parseable body tables: {summary['harvest_parsed']}",
        f"- No-table or non-metric body: {summary['harvest_total'] - summary['harvest_parsed']}",
        "",
    ]
    if summary["harvest_body_issues"]:
        lines.append("Files without parseable metrics body table:")
        lines.append("")
        for it in summary["harvest_body_issues"]:
            lines.append(f"- {it}")
        lines.append("")
    lines += [
        "## Layer 2: SPORE-HARVESTS frontmatter key drift",
        "",
        f"- Canonical (`spores` plural list): **{summary['fm_canonical']}**",
        f"- Legacy (`spore` singular): **{summary['fm_legacy']}**",
        "",
    ]
    if summary["fm_legacy_issues"]:
        lines.append("Legacy-key files (migration candidates):")
        lines.append("")
        for it in summary["fm_legacy_issues"]:
            lines.append(f"- {it}")
        lines.append("")
    lines += [
        "## Layer 3: knowledge/*.md sporeLinks <-> SPORE-HARVESTS latest D+N",
        "",
        f"- Articles checked: **{summary['sporelinks_checked']}**",
        f"- Mismatches: **{len(summary['sporelinks_issues'])}**",
        "",
    ]
    if summary["sporelinks_issues"]:
        for it in summary["sporelinks_issues"]:
            lines.append(f"- {it}")
        lines.append("")
    lines += [
        "## Recommendations",
        "",
        "Based on this audit, Phase 2+ migration plan should:",
        "",
        "1. **Frontmatter key migration** — convert legacy `spore` (singular) entries to `spores` (plural list) for canonical schema. Auto-migrate with sed if N is small.",
        "2. **Body table schema canonicalization** — define official columns (#/Slug/Platform/D+N/Views/Likes/Reposts/Comments/Shares/Rate) and migrate non-conforming batches OR keep parser tolerant via `_normalize_col` aliases.",
        "3. **knowledge sporeLinks regen** — Phase 3 `sync-spore-links.py` will regen sporeLinks from SPORE-LOG + SPORE-HARVESTS, eliminating drift.",
        "4. **Cross-check in CI** — `--strict` mode in pre-commit / refresh-data will fail loud on future drift.",
        "",
        "🧬",
    ]
    p.write_text("\n".join(lines), encoding="utf-8")
    return p


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--strict", action="store_true",
                        help="Treat warnings as errors")
    parser.add_argument("--audit-report", default=None,
                        help="Write detailed audit report markdown to this path")
    args = parser.parse_args()

    print("===== Spore data SSOT validation =====\n")
    print("(Phase 6: SPORE-LOG 成效追蹤 deprecated; SPORE-HARVESTS body is canonical)\n")

    all_warnings = []
    all_errors = []

    # 6 active checks: Phase 6 dropped 成效追蹤 cross-checks; 2026-06-10 spore data
    # decoupling replaced numeric frontmatter consistency with identity-only guard
    # + spore records layer freshness
    print("[1/6] Parser regression test (K/M suffix)...")
    parser_failures = check_parser_regression()
    if parser_failures:
        for inp, got, expected in parser_failures:
            all_errors.append(f"❌ Parser regression: '{inp}' -> {got} (expected {expected})")
    else:
        print(green("    ✅ 8/8 cases pass"))

    print("\n[2/6] Dashboard freshness (mtime check)...")
    fresh_issues = check_dashboard_freshness()
    if fresh_issues:
        all_warnings.extend(fresh_issues)
        for issue in fresh_issues:
            print(yellow(f"    {issue}"))
    else:
        print(green("    ✅ dashboard-spores.json is fresh"))

    print("\n[3/6] SPORE-HARVESTS body table parseability...")
    body_issues, body_parsed, body_total = check_harvests_body_parseable()
    print(f"    {body_parsed}/{body_total} batch logs have parseable body table")
    if body_issues:
        all_warnings.extend(body_issues)
        for it in body_issues[:5]:
            print(yellow(f"    {it}"))
        if len(body_issues) > 5:
            print(yellow(f"    ... ({len(body_issues) - 5} more)"))

    print("\n[4/6] SPORE-HARVESTS frontmatter key drift (spore vs spores)...")
    fm_issues, fm_legacy, fm_canonical = check_harvests_frontmatter_keys()
    print(f"    canonical: {fm_canonical} / legacy: {fm_legacy}")
    if fm_issues:
        all_warnings.extend(fm_issues)
        for it in fm_issues[:5]:
            print(yellow(f"    {it}"))
        if len(fm_issues) > 5:
            print(yellow(f"    ... ({len(fm_issues) - 5} more)"))

    print("\n[5/6] knowledge sporeLinks identity-only (no metrics in frontmatter)...")
    sl_errors, sl_warnings, sl_checked = check_sporelinks_identity_only()
    sl_issues = sl_errors + sl_warnings
    print(f"    {sl_checked} sporeLinks entries checked")
    all_errors.extend(sl_errors)
    all_warnings.extend(sl_warnings)
    if sl_issues:
        for it in sl_issues[:5]:
            print(yellow(f"    {it}"))
        if len(sl_issues) > 5:
            print(yellow(f"    ... ({len(sl_issues) - 5} more)"))
    else:
        print(green("    ✅ All sporeLinks identity-only (id/platform/date/url)"))

    print("\n[6/6] spore records layer (src/data/spores.json)...")
    rec_errors, rec_warnings, rec_count = check_spore_records()
    all_errors.extend(rec_errors)
    all_warnings.extend(rec_warnings)
    if rec_errors or rec_warnings:
        for it in (rec_errors + rec_warnings)[:5]:
            print(yellow(f"    {it}"))
    else:
        print(green(f"    ✅ spores.json fresh, {rec_count} records"))

    # Bonus stats
    sporelink_issues, sl_count = check_sporelinks_consistency()
    print(f"\n[bonus] Articles with sporeLinks frontmatter: {sl_count}")

    # Summary
    print(f"\n===== Summary =====")
    print(f"  Errors:   {len(all_errors)}")
    print(f"  Warnings: {len(all_warnings)}")

    # Audit report
    if args.audit_report:
        from datetime import datetime
        summary = {
            "timestamp": datetime.now().isoformat(timespec="seconds"),
            "error_count": len(all_errors),
            "warning_count": len(all_warnings),
            "harvest_total": body_total,
            "harvest_parsed": body_parsed,
            "harvest_body_issues": body_issues,
            "fm_canonical": fm_canonical,
            "fm_legacy": fm_legacy,
            "fm_legacy_issues": fm_issues,
            "sporelinks_checked": sl_checked,
            "sporelinks_issues": sl_issues,
        }
        path = write_audit_report(args.audit_report, summary)
        try:
            display = path.resolve().relative_to(REPO_ROOT)
        except ValueError:
            display = path
        print(f"\n📄 Audit report → {display}")

    if all_errors:
        print(red("\n❌ FAIL"))
        return 2
    if all_warnings and args.strict:
        print(red("\n❌ FAIL (strict mode, warnings = errors)"))
        return 2
    if all_warnings:
        print(yellow("\n⚠️  PASS with warnings"))
        return 1
    print(green("\n✅ ALL CLEAR"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
