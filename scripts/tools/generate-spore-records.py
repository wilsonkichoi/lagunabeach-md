#!/usr/bin/env python3
"""generate-spore-records.py — 孢子完整記錄層 + 靜態 API 生成器。

Parse SPORE-LOG.md 發文紀錄 (identity SSOT) + SPORE-HARVESTS/*.md (event SSOT)
→ src/data/spores.json   (git tracked, build-time import for SporeFootprint join)
→ public/api/spores.json (gitignored, regenerated each prebuild, ships with the site)

Why (reports/spore-data-architecture-2026-06-10.md):
  Engagement numbers used to live in knowledge/*.md frontmatter sporeLinks, so
  every harvest backfill mutated article files → polluted content-dates.json →
  /latest ordering + sitemap lastmod + JSON-LD dateModified all faked freshness.
  This generator gives spores their own data home; articles keep only an
  immutable identity pointer (id/platform/date/url).

Record shape (per spore):
  id / slug / articlePath / articleUrl / lang / platform / date / url
  metrics      — latest snapshot {views, likes, reposts, comments, shares}
  metricsAsOf  — {dPlus, harvestDate, batch, source: harvest|seed|preserved}
  history      — every D+N snapshot found across SPORE-HARVESTS, ascending

Value-preservation chain (no number left behind):
  1. SPORE-HARVESTS body rows (primary, rebuilt每次)
  2. previous src/data/spores.json (preserve metrics that only exist there)
  3. --seed-frontmatter: one-time migration capture of current knowledge/*.md
     sporeLinks numbers BEFORE the frontmatter strip (run once, 2026-06-10)

Determinism: file is rewritten only when payload (minus _generated) changes,
so a no-op regen produces no git diff.

Usage:
  python3 scripts/tools/generate-spore-records.py                    # normal regen
  python3 scripts/tools/generate-spore-records.py --seed-frontmatter # migration only
  python3 scripts/tools/generate-spore-records.py --check            # exit 1 if stale

2026-06-10 | spore data architecture decoupling
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SPORE_LOG = REPO / "docs/factory/SPORE-LOG.md"
HARVESTS_DIR = REPO / "docs/factory/SPORE-HARVESTS"
KNOWLEDGE_ROOT = REPO / "knowledge"
OUT_DATA = REPO / "src/data/spores.json"
OUT_API = REPO / "public/api/spores.json"

TPE = timezone(timedelta(hours=8))
METRIC_KEYS = ("views", "likes", "reposts", "comments", "shares")
LANG_DIRS = {"en", "ja", "ko", "es", "fr", "zh-TW"}

# knowledge/ category dir (Capitalized) → URL slug (matches content-dates keys)
CAT_TO_SLUG = {
    "About": "about", "Art": "art", "Culture": "culture", "Economy": "economy",
    "Food": "food", "Geography": "geography", "History": "history",
    "Lifestyle": "lifestyle", "Music": "music", "Nature": "nature",
    "People": "people", "Politics": "politics", "Society": "society",
    "Technology": "technology",
}

# ────────────────── shared parsers (aligned with sync-spore-links.py) ──────────────────

_HARVEST_COL_ALIASES = {
    "#": "n", "slug": "slug", "文章": "slug",
    "platform": "platform", "平台": "platform",
    "d+n": "d_n",
    "views": "views", "views (抓取時)": "views", "views (exact)": "views",
    "likes": "likes", "replies": "comments", "reposts": "reposts",
    "comments": "comments",
    "shares": "shares", "shares/bm": "shares",
    "engagements": "engagements", "rate": "rate", "互動率": "rate",
}


def _normalize_col(c):
    return _HARVEST_COL_ALIASES.get(c.strip().lower(), c.strip().lower())


def _parse_int(v):
    if v is None:
        return None
    s = str(v).strip().replace(",", "").replace("*", "").replace(" ", "")
    if not s or s.lower() in ("—", "-", "no-data", "n/a", "?", "null"):
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


def _normalize_slug(slug):
    """Strip emoji prefix + parenthetical version markers from SPORE-LOG slug."""
    s = re.sub(r"^[\U0001F300-\U0001FAFF☀-➿\s]+", "", slug)
    s = re.sub(r"[（(].*?[）)]\s*$", "", s)
    return s.strip()


def _sections(text):
    sections, cur, buf = {}, None, []
    for line in text.splitlines():
        if line.startswith("## "):
            if cur:
                sections[cur] = "\n".join(buf)
            cur, buf = line[3:].strip(), []
        elif cur is not None:
            buf.append(line)
    if cur:
        sections[cur] = "\n".join(buf)
    return sections


def parse_publication_table():
    """SPORE-LOG 發文紀錄 → [{n, date, lang, platform, slug, url}] (all langs/platforms)."""
    if not SPORE_LOG.exists():
        return []
    pub = _sections(SPORE_LOG.read_text(encoding="utf-8")).get("發文紀錄", "")
    lines = [l for l in pub.splitlines() if l.strip().startswith("|")]
    if len(lines) < 3:
        return []
    headers = [c.strip() for c in lines[0].strip("|").split("|")]
    rows = []
    for line in lines[2:]:
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) != len(headers):
            continue
        row = dict(zip(headers, cells))
        n_str = row.get("#", "").strip()
        if not n_str.isdigit():
            continue
        m = re.search(r"\((https?://[^\)]+)\)", row.get("URL", ""))
        rows.append({
            "n": int(n_str),
            "date": row.get("日期", "").strip(),
            "lang": row.get("語言", "").strip().lower() or "zh",
            "platform": row.get("平台", "").strip().lower(),
            "slug": row.get("文章 slug", "").strip(),
            "url": m.group(1) if m else None,
        })
    return rows


def _parse_frontmatter_dict(md_path):
    text = md_path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return None
    end = text.find("---", 3)
    if end == -1:
        return None
    fm = {}
    for line in text[3:end].splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip().strip("'\"")
    return fm


def _parse_harvest_body(md_path):
    """ALL metric-bearing pipe-tables in body → rows with n + dPlus.

    A batch file often holds more than one table (summary + OVERDUE backfill +
    per-spore sections). sync-spore-links historically read only the first one,
    silently dropping snapshots (e.g. batch-2026-06-09: 4 of 12 spores in table
    one). A table qualifies when it has an `n`/`#` column AND ≥ 2 metric
    columns — this excludes reply-detail tables (# / Handle / Reply text).
    """
    text = md_path.read_text(encoding="utf-8")
    if text.startswith("---"):
        end = text.find("---", 3)
        if end != -1:
            text = text[end + 3:]

    tables, cur = [], []
    for line in text.splitlines():
        s = line.strip()
        if s.startswith("|") and s.endswith("|"):
            cur.append(s)
        elif cur:
            tables.append(cur)
            cur = []
    if cur:
        tables.append(cur)

    merged = {}  # (n, dPlus) → row (later tables fill nulls)
    for table in tables:
        if len(table) < 3:
            continue
        headers = [_normalize_col(h) for h in
                   (c.strip() for c in table[0].strip("|").split("|"))]
        if "n" not in headers:
            continue
        if sum(1 for h in headers if h in METRIC_KEYS) < 2:
            continue
        for line in table[2:]:
            cells = [c.strip() for c in line.strip("|").split("|")]
            if len(cells) != len(headers):
                continue
            row = dict(zip(headers, cells))
            n = row.get("n", "").strip()
            if not n.isdigit():
                continue
            dm = re.search(r"(\d+)", row.get("d_n", ""))
            row["dPlus"] = int(dm.group(1)) if dm else 0
            row["n"] = int(n)
            key = (row["n"], row["dPlus"])
            if key in merged:
                for k in METRIC_KEYS:
                    if _parse_int(merged[key].get(k)) is None and k in row:
                        merged[key][k] = row[k]
            else:
                merged[key] = row
    return list(merged.values())


def collect_history():
    """Walk all SPORE-HARVESTS batches → {n: [snapshot, ...]} ascending."""
    hist = defaultdict(list)
    if not HARVESTS_DIR.exists():
        return hist
    for md in sorted(HARVESTS_DIR.glob("*.md")):
        fm = _parse_frontmatter_dict(md)
        if not fm:
            continue
        spore_str = fm.get("spores") or fm.get("spore") or ""
        spore_ns = {int(t) for t in re.findall(r"#?(\d+)", spore_str)}
        if not spore_ns:
            continue
        harvest_date = fm.get("harvest_date", "")
        for row in _parse_harvest_body(md):
            if row["n"] not in spore_ns:
                continue
            snap = {"dPlus": row["dPlus"], "harvestDate": harvest_date,
                    "batch": md.stem}
            for k in METRIC_KEYS:
                snap[k] = _parse_int(row.get(k))
            # all-empty row carries no signal
            if all(snap[k] is None for k in METRIC_KEYS):
                continue
            hist[row["n"]].append(snap)
    for n in hist:
        hist[n].sort(key=lambda s: (s["dPlus"], s["harvestDate"]))
    return hist


# ────────────────── article resolution ──────────────────

def _article_lookup():
    """One walk of knowledge/ → {(lang, filename-stem): (path, category)}."""
    table = {}
    for md in KNOWLEDGE_ROOT.rglob("*.md"):
        rel = md.relative_to(KNOWLEDGE_ROOT)
        parts = rel.parts
        if parts[-1].startswith("_"):
            continue
        if parts[0] in LANG_DIRS:
            if len(parts) != 3:
                continue
            lang, cat = parts[0], parts[1]
        else:
            if len(parts) != 2:
                continue
            lang, cat = "zh", parts[0]
        if cat not in CAT_TO_SLUG:
            continue
        table[(lang, md.stem)] = (str(rel), cat)
    return table


def resolve_article(lookup, lang, slug):
    """→ (slug_norm, articlePath, articleUrl) — Nones when unresolved."""
    cand = [slug, _normalize_slug(slug)]
    lang_key = "zh" if lang in ("zh", "zh-tw", "") else lang
    for c in cand:
        if not c:
            continue
        hit = lookup.get((lang_key, c))
        if hit:
            rel, cat = hit
            cat_slug = CAT_TO_SLUG[cat]
            prefix = "" if lang_key == "zh" else f"/{lang_key}"
            return c, f"knowledge/{rel}", f"{prefix}/{cat_slug}/{c}/"
    return _normalize_slug(slug) or None, None, None


# ────────────────── frontmatter seed (one-time migration capture) ──────────────────

def seed_from_frontmatter():
    """Read current knowledge/**.md sporeLinks metric values → {url: metrics}."""
    seed = {}
    for md in KNOWLEDGE_ROOT.rglob("*.md"):
        try:
            text = md.read_text(encoding="utf-8")
        except OSError:
            continue
        if not text.startswith("---") or "sporeLinks:" not in text:
            continue
        end = text.find("---", 3)
        if end == -1:
            continue
        cur, in_block = None, False
        items = []
        for line in text[3:end].split("\n"):
            if line.strip().startswith("sporeLinks:"):
                in_block = True
                continue
            if not in_block:
                continue
            if line.startswith("  - "):
                if cur:
                    items.append(cur)
                cur = {}
                kv = line[4:].split(":", 1)
                if len(kv) == 2:
                    cur[kv[0].strip()] = kv[1].strip().strip("'\"")
            elif line.startswith("    ") and cur is not None:
                kv = line.strip().split(":", 1)
                if len(kv) == 2:
                    cur[kv[0].strip()] = kv[1].strip().strip("'\"")
            else:
                if cur:
                    items.append(cur)
                    cur = None
                if line.strip() and not line.startswith(" "):
                    in_block = False
        if cur:
            items.append(cur)
        for it in items:
            url = it.get("url")
            if not url:
                continue
            metrics = {k: _parse_int(it.get(k)) for k in METRIC_KEYS}
            if any(v is not None for v in metrics.values()):
                # zh canonical wins over translation mirrors (walk order: zh dirs
                # sort after lang dirs alphabetically, so explicit precedence):
                rel = md.relative_to(KNOWLEDGE_ROOT)
                is_zh = rel.parts[0] not in LANG_DIRS
                if url not in seed or is_zh:
                    seed[url] = metrics
    return seed


# ────────────────── build ──────────────────

def build_records(use_seed=False):
    pubs = parse_publication_table()
    history = collect_history()
    lookup = _article_lookup()
    seed = seed_from_frontmatter() if use_seed else {}

    prev = {}
    if OUT_DATA.exists():
        try:
            for r in json.loads(OUT_DATA.read_text(encoding="utf-8")).get("spores", []):
                prev[r["id"]] = r
        except (json.JSONDecodeError, OSError):
            pass

    records, by_article = [], defaultdict(list)
    for pub in sorted(pubs, key=lambda p: p["n"]):
        n = pub["n"]
        slug_norm, path, url_path = resolve_article(lookup, pub["lang"], pub["slug"])
        hist = history.get(n, [])

        metrics = {k: None for k in METRIC_KEYS}
        metrics_as_of = None
        fill = seed.get(pub["url"]) if (use_seed and pub["url"]) else None
        prev_metrics = prev.get(n, {}).get("metrics")
        if hist:
            latest = hist[-1]
            metrics = {k: latest[k] for k in METRIC_KEYS}
            source = "harvest"
            # Field-level backfill: a harvest row often carries only some
            # columns (e.g. views-only). A null there must not erase a value
            # already observed earlier (frontmatter seed / previous records).
            for k in METRIC_KEYS:
                if metrics[k] is None:
                    v = fill.get(k) if fill else None
                    if v is None and prev_metrics:
                        v = prev_metrics.get(k)
                    if v is not None:
                        metrics[k] = v
                        source = "harvest+backfill"
            metrics_as_of = {"dPlus": latest["dPlus"],
                             "harvestDate": latest["harvestDate"],
                             "batch": latest["batch"], "source": source}
        elif fill and any(v is not None for v in fill.values()):
            metrics = dict(fill)
            metrics_as_of = {"dPlus": None, "harvestDate": None, "batch": None,
                             "source": "frontmatter-seed"}
        elif n in prev and prev[n].get("metricsAsOf"):
            # preserve numbers whose only source was the previous records file
            metrics = prev[n].get("metrics", metrics)
            metrics_as_of = {**prev[n]["metricsAsOf"]}
            if metrics_as_of.get("source") != "harvest":
                metrics_as_of["source"] = "preserved"
            hist = prev[n].get("history", [])

        rec = {
            "id": n,
            "slug": slug_norm,
            "articlePath": path,
            "articleUrl": url_path,
            "lang": pub["lang"],
            "platform": pub["platform"],
            "date": pub["date"],
            "url": pub["url"],
            "metrics": metrics,
            "metricsAsOf": metrics_as_of,
            "history": hist,
        }
        records.append(rec)
        if path and slug_norm:
            by_article[slug_norm].append(n)

    payload = {
        "schemaVersion": 1,
        "counts": {
            "spores": len(records),
            "articles": len(by_article),
            "withMetrics": sum(1 for r in records if r["metricsAsOf"]),
        },
        "spores": records,
        "byArticle": {k: sorted(v) for k, v in sorted(by_article.items())},
    }
    return payload


def _stable(payload):
    return json.dumps(payload, ensure_ascii=False, sort_keys=True)


def write_if_changed(path, payload, compact):
    """Write only when payload (minus _generated) differs. Returns changed?"""
    old_core = None
    if path.exists():
        try:
            old = json.loads(path.read_text(encoding="utf-8"))
            old.pop("_generated", None)
            old_core = _stable(old)
        except (json.JSONDecodeError, OSError):
            pass
    if old_core == _stable(payload):
        return False
    out = {"_generated": datetime.now(TPE).isoformat(timespec="seconds"), **payload}
    path.parent.mkdir(parents=True, exist_ok=True)
    if compact:
        path.write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
    else:
        path.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n",
                        encoding="utf-8")
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed-frontmatter", action="store_true",
                    help="one-time: capture current frontmatter metrics before strip")
    ap.add_argument("--check", action="store_true",
                    help="exit 1 if regen would change src/data/spores.json")
    args = ap.parse_args()

    payload = build_records(use_seed=args.seed_frontmatter)

    if args.check:
        old_core = None
        if OUT_DATA.exists():
            try:
                old = json.loads(OUT_DATA.read_text(encoding="utf-8"))
                old.pop("_generated", None)
                old_core = _stable(old)
            except (json.JSONDecodeError, OSError):
                pass
        stale = old_core != _stable(payload)
        print(f"spores.json {'STALE' if stale else 'fresh'} "
              f"({payload['counts']['spores']} spores)")
        return 1 if stale else 0

    changed_data = write_if_changed(OUT_DATA, payload, compact=False)
    changed_api = write_if_changed(OUT_API, payload, compact=True)
    c = payload["counts"]
    print(f"✓ spore records: {c['spores']} spores / {c['articles']} articles / "
          f"{c['withMetrics']} with metrics"
          f" → src/data/spores.json{' (updated)' if changed_data else ' (unchanged)'}"
          f", public/api/spores.json{' (updated)' if changed_api else ' (unchanged)'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
