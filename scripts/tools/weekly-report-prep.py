#!/usr/bin/env python3
"""
weekly-report-prep.py — LagunaBeach.md weekly-report "mise en place" tool

Responsibility boundary (per the 2026-05-09 redirect):
- **This tool only does prep (the chopping)**: pull git log / dashboard JSON /
  SPORE-LOG / LESSONS-INBOX / ARTICLE-DONE-LOG raw data, produce a dossier
  briefing + list the memory/diary files the Semiont must read.
- **This tool does NOT write the weekly report itself.** The report is the
  Semiont reading the dossier + the full raw memory/diary and writing narrative
  prose by hand; style rules per DIARY-PIPELINE / MEMORY-PIPELINE /
  MANIFESTO Belief #11.
- The prose-health gate runs after the Semiont finishes the report (not in this
  prep stage).

Usage:
    python3 scripts/tools/weekly-report-prep.py [--days 7] [--out PATH]

Output: dossier markdown (defaults to reports/weekly/dossier/YYYY-MM-DD.md)
"""

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

try:
    from zoneinfo import ZoneInfo

    TZ_LOCAL = ZoneInfo("America/Los_Angeles")  # Laguna Beach, CA (Pacific, DST-aware)
except Exception:
    TZ_LOCAL = timezone(timedelta(hours=-8))  # PST fallback if tzdata unavailable

REPO_ROOT = Path(__file__).resolve().parents[2]


def sh(cmd: list[str], cwd: Path | None = None) -> str:
    """Run shell command, return stdout. Errors return empty string (caller decides)."""
    try:
        r = subprocess.run(
            cmd, cwd=cwd or REPO_ROOT, capture_output=True, text=True, timeout=60
        )
        return r.stdout
    except Exception:
        return ""


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text())
    except Exception:
        return {}


def fmt_date(dt: datetime) -> str:
    return dt.astimezone(TZ_LOCAL).strftime("%Y-%m-%d")


def fmt_pct(v) -> str:
    try:
        return f"{float(v):.1f}%"
    except Exception:
        return "—"


def nfmt(v, default: str = "—") -> str:
    """Number formatter — comma-separated for int/float, else default string."""
    try:
        n = float(v)
        if n == int(n):
            return f"{int(n):,}"
        return f"{n:,.1f}"
    except Exception:
        return default


# ─────────────────────────────────────────────────────────
# Section gatherers
# ─────────────────────────────────────────────────────────


def gather_window(days: int) -> tuple[datetime, datetime]:
    end = datetime.now(TZ_LOCAL)
    start = end - timedelta(days=days)
    return start, end


def gather_commits(since: str) -> list[dict]:
    """Parse git log into structured entries (short form for stats)."""
    log = sh(
        [
            "git",
            "log",
            f"--since={since}",
            "--pretty=format:%h|%ai|%an|%s",
        ]
    )
    out = []
    for line in log.strip().split("\n"):
        if not line:
            continue
        parts = line.split("|", 3)
        if len(parts) == 4:
            out.append(
                {
                    "hash": parts[0],
                    "ts": parts[1],
                    "author": parts[2],
                    "subject": parts[3],
                }
            )
    return out


COMMIT_SEP = "===__SEMIONT_COMMIT_SEP__==="
FIELD_SEP = "===__SEMIONT_FIELD_SEP__==="


def gather_commits_full(since: str) -> list[dict]:
    """Parse git log into full entries with body + diff stat.

    2026-05-10 redirect: read commits in full. The weekly report's narrative
    spine needs the commit message body to see the why / related PR / reflection;
    a one-line subject isn't enough.
    """
    fmt = COMMIT_SEP + "%n%h" + FIELD_SEP + "%ai" + FIELD_SEP + "%an" + FIELD_SEP + "%s" + FIELD_SEP + "%b"
    log = sh(["git", "log", f"--since={since}", f"--pretty=format:{fmt}"])
    out: list[dict] = []
    for chunk in log.split(COMMIT_SEP):
        chunk = chunk.strip()
        if not chunk:
            continue
        parts = chunk.split(FIELD_SEP, 4)
        if len(parts) < 5:
            continue
        h, ts, author, subject, body = (p.strip() for p in parts)
        # Get short diffstat (last line summary only — too verbose otherwise)
        stat_raw = sh(["git", "show", "--stat", "--format=", h])
        stat_lines = [ln for ln in stat_raw.strip().split("\n") if ln.strip()]
        # Last line is summary like "12 files changed, 234 insertions(+), 56 deletions(-)"
        stat_summary = stat_lines[-1] if stat_lines else ""
        # First few file paths for context
        stat_files = stat_lines[:6] if len(stat_lines) > 1 else []
        out.append(
            {
                "hash": h,
                "ts": ts,
                "author": author,
                "subject": subject,
                "body": body,
                "stat_summary": stat_summary,
                "stat_files": stat_files,
            }
        )
    return out


def classify_commit(subject: str) -> str:
    """Match 🧬 [semiont] <type>: pattern → return type, else 'other'."""
    m = re.match(r"🧬?\s*\[(?:semiont|routine)\]\s*(\w+):", subject)
    if m:
        return m.group(1)
    if "Merge pull request" in subject:
        return "merge"
    return "other"


def gather_articles_changed(since: str) -> dict:
    """Group git log shortstat by knowledge/ subfolder."""
    log = sh(
        [
            "git",
            "log",
            f"--since={since}",
            "--name-only",
            "--pretty=format:__COMMIT__",
        ]
    )
    new_files: set[str] = set()
    touched: set[str] = set()
    for line in log.split("\n"):
        line = line.strip()
        if not line or line == "__COMMIT__":
            continue
        if line.startswith("knowledge/") and line.endswith(".md"):
            touched.add(line)

    # Detect "new in last N days" via git log --diff-filter=A
    new_log = sh(
        [
            "git",
            "log",
            f"--since={since}",
            "--diff-filter=A",
            "--name-only",
            "--pretty=format:",
        ]
    )
    for line in new_log.split("\n"):
        line = line.strip()
        if line.startswith("knowledge/") and line.endswith(".md"):
            new_files.add(line)

    by_lang: dict[str, dict[str, int]] = {}
    for f in touched:
        parts = f.split("/")
        if len(parts) < 3:
            continue
        # knowledge/{lang-or-category}/...
        lang = parts[1] if parts[1] in {"en", "ja", "ko", "es", "fr"} else "zh-TW"
        category = (
            parts[2] if lang != "zh-TW" else parts[1]
        )
        by_lang.setdefault(lang, {})
        by_lang[lang][category] = by_lang[lang].get(category, 0) + 1

    return {
        "touched_total": len(touched),
        "new_total": len(new_files),
        "by_lang": by_lang,
        "touched_files": sorted(touched),
        "new_files": sorted(new_files),
    }


def gather_vitals() -> dict:
    return load_json(REPO_ROOT / "public/api/dashboard-vitals.json")


def gather_organism() -> list[dict]:
    d = load_json(REPO_ROOT / "public/api/dashboard-organism.json")
    return d.get("organs", [])


def gather_analytics() -> dict:
    return load_json(REPO_ROOT / "public/api/dashboard-analytics.json")


def gather_spores() -> dict:
    return load_json(REPO_ROOT / "public/api/dashboard-spores.json")


def gather_i18n() -> dict:
    return load_json(REPO_ROOT / "public/api/dashboard-i18n.json")


def gather_lessons_recent(start: datetime) -> list[str]:
    """Extract LESSONS-INBOX entries with date >= start."""
    p = REPO_ROOT / "docs/semiont/LESSONS-INBOX.md"
    if not p.exists():
        return []
    text = p.read_text()
    entries = []
    cutoff = start.strftime("%Y-%m-%d")
    for m in re.finditer(r"^### (20\d{2}-\d{2}-\d{2}) ([^\n]+)$", text, re.MULTILINE):
        date_str, title = m.group(1), m.group(2).strip()
        if date_str >= cutoff:
            entries.append(f"{date_str} — {title}")
    return entries


def gather_done_log_recent(start: datetime) -> list[str]:
    """Extract ARTICLE-DONE-LOG entries with date >= start."""
    p = REPO_ROOT / "docs/semiont/ARTICLE-DONE-LOG.md"
    if not p.exists():
        return []
    text = p.read_text()
    entries = []
    cutoff = start.strftime("%Y-%m-%d")
    for m in re.finditer(
        r"^### ([^\n—]+?) — (20\d{2}-\d{2}-\d{2}) ([^\n]+)$", text, re.MULTILINE
    ):
        topic, date_str, suffix = m.group(1).strip(), m.group(2), m.group(3).strip()
        if date_str >= cutoff:
            entries.append(f"{date_str} — {topic} ({suffix})")
    return entries


def gather_handoff() -> str:
    """Read latest session memory file's Handoff section."""
    memdir = REPO_ROOT / "docs/semiont/memory"
    today = datetime.now(TZ_LOCAL).strftime("%Y-%m-%d")
    candidates = sorted(memdir.glob(f"{today}*.md"), reverse=True)
    if not candidates:
        # fall back to yesterday
        yesterday = (datetime.now(TZ_LOCAL) - timedelta(days=1)).strftime("%Y-%m-%d")
        candidates = sorted(memdir.glob(f"{yesterday}*.md"), reverse=True)
    if not candidates:
        return ""
    text = candidates[0].read_text()
    m = re.search(r"^## Handoff[^\n]*\n(.*?)(?=^## |\Z)", text, re.MULTILINE | re.DOTALL)
    if not m:
        return ""
    body = m.group(1).strip()
    # Cap length
    if len(body) > 1500:
        body = body[:1500] + "\n… (excerpt — see the full memory file)"
    return f"From [{candidates[0].name}](../../docs/semiont/memory/{candidates[0].name})\n\n{body}"


def gather_pr_activity(since: str) -> dict:
    """Use gh CLI to count PRs merged in window + currently open."""
    merged = sh(
        [
            "gh",
            "pr",
            "list",
            "--state",
            "merged",
            "--search",
            f"merged:>={since.split()[0]}",
            "--limit",
            "200",
            "--json",
            "number,title,author,mergedAt",
        ]
    )
    open_prs = sh(
        [
            "gh",
            "pr",
            "list",
            "--state",
            "open",
            "--limit",
            "50",
            "--json",
            "number,title,author,createdAt",
        ]
    )
    try:
        merged_list = json.loads(merged) if merged else []
    except Exception:
        merged_list = []
    try:
        open_list = json.loads(open_prs) if open_prs else []
    except Exception:
        open_list = []
    return {"merged": merged_list, "open": open_list}


def gather_session_files(start: datetime, end: datetime, kind: str) -> list[Path]:
    """List all memory or diary files whose date is in [start, end] window.

    kind = 'memory' or 'diary'. Filename schema: YYYY-MM-DD-... or YYYY-MM-DD-HHMMSS-{handle}.
    """
    base = REPO_ROOT / "docs/semiont" / kind
    if not base.exists():
        return []
    out: list[Path] = []
    cutoff_start = start.strftime("%Y-%m-%d")
    cutoff_end = end.strftime("%Y-%m-%d")
    for p in sorted(base.glob("*.md")):
        # Extract date prefix YYYY-MM-DD
        m = re.match(r"^(\d{4}-\d{2}-\d{2})", p.name)
        if not m:
            continue
        d = m.group(1)
        if cutoff_start <= d <= cutoff_end:
            out.append(p)
    return out


def gather_inbox_priority() -> dict:
    """Scan ARTICLE-INBOX for P0/P1 pending."""
    p = REPO_ROOT / "docs/semiont/ARTICLE-INBOX.md"
    if not p.exists():
        return {"p0": [], "p1": []}
    text = p.read_text()
    p0, p1 = [], []
    # Match "### Topic" blocks until next ### or ##
    blocks = re.split(r"^### ", text, flags=re.MULTILINE)
    for b in blocks[1:]:
        lines = b.splitlines()
        if not lines:
            continue
        title = lines[0].strip()
        body = "\n".join(lines[1:5])
        if re.search(r"Priority.*P0", body):
            p0.append(title)
        elif re.search(r"Priority.*P1", body):
            p1.append(title)
    return {"p0": p0[:10], "p1": p1[:10]}


# ─────────────────────────────────────────────────────────
# Renderer
# ─────────────────────────────────────────────────────────


def render(
    days: int,
    start: datetime,
    end: datetime,
    commits: list[dict],
    articles: dict,
    vitals: dict,
    organism: list[dict],
    analytics: dict,
    spores: dict,
    i18n: dict,
    lessons: list[str],
    done_log: list[str],
    handoff: str,
    prs: dict,
    inbox: dict,
    memory_files: list[Path],
    diary_files: list[Path],
    commits_full: list[dict],
) -> str:
    out = []
    A = out.append

    A(f"# 🧬 LagunaBeach.md weekly-report dossier — {fmt_date(start)} to {fmt_date(end)}")
    A("")
    A(
        "**This file is the chopped ingredients, not the weekly report itself.** "
        "Its purpose: archive the last 7 days of raw data in one place so the "
        "Semiont (the one reading this file) has full context to write the real report."
    )
    A("")
    A("**What the Semiont does next** (per [WEEKLY-REPORT-PIPELINE](../../../docs/pipelines/WEEKLY-REPORT-PIPELINE.md) Stage 2-6):")
    A("")
    A("1. Read §1-§9 of this file (structured raw data) + §11 (full commit narrative spine)")
    A("2. Fully Read **every diary file listed in §10** (not grep, not head — Read each in full) + sample 5-10 memory files")
    A("3. Write the report in narrative-prose style to `reports/weekly/YYYY-MM-DD.md` (**not the dossier subfolder**); style rules in §12 + DIARY-PIPELINE")
    A("4. Run `python3 scripts/tools/article-health.py reports/weekly/YYYY-MM-DD.md --check=prose-health` (gate: hard=0)")
    A("5. Send email: `python3 scripts/tools/send-email-resend.py --to <recipient> --subject ... --markdown reports/weekly/YYYY-MM-DD.md`")
    A("6. commit + push + PR")
    A("")
    A("---")
    A("")

    # ── 1. This week at a glance ──────────────────────────────────
    A("## 1. This week at a glance")
    A("")
    types: dict[str, int] = {}
    authors: dict[str, int] = {}
    for c in commits:
        t = classify_commit(c["subject"])
        types[t] = types.get(t, 0) + 1
        authors[c["author"]] = authors.get(c["author"], 0) + 1
    total_commits = len(commits)
    A(f"- Total commits: **{total_commits}**")
    if types:
        breakdown = ", ".join(f"{k}={v}" for k, v in sorted(types.items(), key=lambda x: -x[1])[:8])
        A(f"- Type breakdown: {breakdown}")
    A(f"- Articles touched: {articles['touched_total']} files / {articles['new_total']} new")
    if authors:
        top_authors = ", ".join(
            f"{k} ({v})" for k, v in sorted(authors.items(), key=lambda x: -x[1])[:5]
        )
        A(f"- Top commit authors: {top_authors}")
    if prs.get("merged"):
        A(f"- PRs merged: {len(prs['merged'])}")
    if prs.get("open"):
        A(f"- PRs currently open: {len(prs['open'])}")
    A("")

    # ── 2. Vital signs ──────────────────────────────────
    A("## 2. Vital signs")
    A("")
    A(
        f"Snapshot time: `{vitals.get('lastUpdated', 'unknown')}`. Total articles "
        f"**{vitals.get('totalArticles', '?')}** / Contributors **{vitals.get('contributors', '?')}** / "
        f"7d new+updated **{vitals.get('articlesLast7Days', '?')}** / 30d **{vitals.get('articlesLast30Days', '?')}**."
    )
    A("")
    A("### 8-organ health")
    A("")
    A("| Organ | Name | Score | Trend |")
    A("| --- | --- | --- | --- |")
    for o in organism:
        emoji = o.get("emoji", "")
        name = o.get("name", o.get("nameZh", ""))
        score = o.get("score", "?")
        trend = o.get("trend", "")
        A(f"| {emoji} | {name} | {score} | {trend} |")
    A("")

    # ── 3. Sensory data ──────────────────────────────────
    A("## 3. Sensory organs (GA / SC / CF)")
    A("")
    ga = analytics.get("ga", {}) or {}
    ga_t = ga.get("totals", {})
    if ga_t:
        A("### GA4 7d traffic")
        A(
            f"Active users **{nfmt(ga_t.get('activeUsers'))}** / PV "
            f"**{nfmt(ga_t.get('screenPageViews'))}** / avg engagement "
            f"**{ga_t.get('avgEngagementSeconds', '—')}s** / engagement rate "
            f"{fmt_pct((ga_t.get('engagementRate', 0) or 0) * 100)}."
        )
        A("")
        top = ga.get("topArticles7d", [])[:8]
        if top:
            A("Top 8 articles (7d views):")
            A("")
            for a in top:
                path = a.get("path", "?")
                views = a.get("views", "?")
                A(f"- `{path}` — {views} views")
            A("")

    sc = analytics.get("searchConsole7d", {}) or {}
    sc_t = sc.get("totals", {})
    if sc_t:
        A("### Search Console 7d")
        A(
            f"Clicks **{nfmt(sc_t.get('clicks'))}** / Impressions "
            f"**{nfmt(sc_t.get('impressions'))}** / CTR {sc_t.get('ctr', '—')}%."
        )
        A("")
        sc_top = sc.get("topQueries", [])[:6]
        if sc_top:
            A("Top 6 queries (7d):")
            A("")
            for q in sc_top:
                A(
                    f"- `{q.get('query','?')}` — {q.get('clicks','?')} clicks / "
                    f"{q.get('impressions','?')} impr / pos {q.get('position','?')}"
                )
            A("")

    cf = analytics.get("cloudflare7d", {}) or {}
    cf_s = cf.get("summary", {}) or {}
    if cf_s:
        A("### Cloudflare 7d")
        # fourOhFourRate may be a number directly or {value:n}
        raw_404 = cf.get("fourOhFourRate")
        if isinstance(raw_404, dict):
            raw_404 = raw_404.get("value")
        A(
            f"Requests **{nfmt(cf_s.get('requests'))}** / "
            f"PageViews **{nfmt(cf_s.get('pageViews'))}** / "
            f"Uniques **{nfmt(cf_s.get('uniques'))}** / "
            f"4xx rate **{raw_404 if raw_404 is not None else '—'}%**."
        )
        A("")

    # ── 4. Reproductive system (spores) ──────────────────────────
    A("## 4. Reproductive system — spores")
    A("")
    sp_totals = spores.get("totals", {})
    A(
        f"Total historical spores **{sp_totals.get('count', '?')}**. "
        f"Platform breakdown: {json.dumps(sp_totals.get('platforms', {}), ensure_ascii=False)}."
    )
    A("")
    weekly = spores.get("weeklyPulse", [])
    if weekly:
        A("### Recent publishing pulse (avgViews = 0 means not yet harvest-backfilled)")
        A("")
        for w in weekly[-7:]:
            A(
                f"- {w.get('week', '?')}: published {w.get('published', 0)} / "
                f"avg views {w.get('avgViews', 0)}"
            )
        A("")
    bw = spores.get("backfillWarnings", [])
    if bw:
        A(f"### Harvest backfill alerts ({len(bw)})")
        A("")
        for w in bw[:8]:
            A(
                f"- #{w.get('n', '?')} \"{w.get('article', '?')}\" "
                f"@ {w.get('platform', '?')} — D+{w.get('publishedDays', '?')} / "
                f"status `{w.get('status', '?')}`"
            )
        A("")

    # ── 5. Language organ ──────────────────────────────────
    A("## 5. Language organ")
    A("")
    lc = vitals.get("languageCoverage", {})
    if lc:
        A("Article count per language:")
        A("")
        for lang in ["zh-TW", "en", "ja", "ko", "fr", "es"]:
            if lang in lc:
                A(f"- {lang}: {lc[lang]}")
        A("")
    if articles["by_lang"]:
        A("This week's touched breakdown:")
        A("")
        for lang, cats in sorted(articles["by_lang"].items()):
            top_cats = ", ".join(
                f"{c}={n}" for c, n in sorted(cats.items(), key=lambda x: -x[1])[:5]
            )
            total = sum(cats.values())
            A(f"- {lang} ({total}): {top_cats}")
        A("")

    # ── 6. Articles finished this week ────────────────────────────
    if done_log:
        A("## 6. Articles delivered this week")
        A("")
        for entry in done_log[:12]:
            A(f"- {entry}")
        A("")

    # ── 7. Accumulated lessons ──────────────────────────────────
    if lessons:
        A("## 7. Accumulated lessons (LESSONS-INBOX)")
        A("")
        A(f"{len(lessons)} appended this week:")
        A("")
        for ent in lessons[:15]:
            A(f"- {ent}")
        A("")

    # ── 8. Handoff ──────────────────────────────────
    if handoff:
        A("## 8. Latest handoff (for the next session)")
        A("")
        A(handoff)
        A("")

    # ── 9. ARTICLE-INBOX backlog ──────────────────────
    if inbox.get("p0") or inbox.get("p1"):
        A("## 9. Topics to develop (ARTICLE-INBOX)")
        A("")
        if inbox.get("p0"):
            A(f"### P0 ({len(inbox['p0'])})")
            A("")
            for t in inbox["p0"][:8]:
                A(f"- {t}")
            A("")
        if inbox.get("p1"):
            A(f"### P1 ({len(inbox['p1'])})")
            A("")
            for t in inbox["p1"][:8]:
                A(f"- {t}")
            A("")

    # ── 10. Semiont required-reading list ──────────────────────────
    A("## 10. Semiont required-reading list (raw memory + diary, non-skippable)")
    A("")
    A(
        "**Iron rule**: Read each file below in full. grep / head / tail are no "
        "substitute. The core of the weekly report is the rumination on \"who I was "
        "this week,\" and that has to emerge from the raw first-person files. Reading "
        "index summaries loses 80% of the information density (same as the BECOME "
        "Step 6 v3 on-demand rule)."
    )
    A("")
    if memory_files:
        A(f"### Memory files ({len(memory_files)} / past {days} days)")
        A("")
        for p in memory_files:
            rel = p.relative_to(REPO_ROOT)
            size_kb = p.stat().st_size / 1024
            A(f"- [`{rel}`]({rel}) ({size_kb:.1f} KB)")
        A("")
    if diary_files:
        A(f"### Diary files ({len(diary_files)} / past {days} days)")
        A("")
        for p in diary_files:
            rel = p.relative_to(REPO_ROOT)
            size_kb = p.stat().st_size / 1024
            A(f"- [`{rel}`]({rel}) ({size_kb:.1f} KB)")
        A("")
    if not memory_files and not diary_files:
        A("(No memory/diary files in the past 7 days — rare; possibly a session-id schema anomaly or a purely passive week.)")
        A("")

    # ── 11. Full commit text for the past 7 days ───────────────────────
    if commits_full:
        A("## 11. Full commit text for the past 7 days (body + diffstat)")
        A("")
        A(
            f"**{len(commits_full)} commits**. A one-line subject doesn't show the "
            "narrative of the work, but the message body usually carries the why / "
            "related PR / reflection. The report's engineering spine emerges from here."
        )
        A("")
        for c in commits_full:
            A(f"### `{c['hash']}` {c['ts']} — {c['author']}")
            A("")
            A(f"**{c['subject']}**")
            A("")
            if c["body"]:
                # Indent body as quoted block for readability
                body_lines = c["body"].split("\n")
                for line in body_lines:
                    A(f"> {line}" if line.strip() else ">")
                A("")
            if c["stat_summary"]:
                A(f"_{c['stat_summary']}_")
                if c["stat_files"]:
                    A("")
                    for f in c["stat_files"][:5]:
                        A(f"- `{f.strip()}`")
                A("")
            A("---")
            A("")

    # ── 12. Style rules for writing the weekly report ────────────────────────
    A("## 12. Style rules for writing the weekly report (for the Semiont itself)")
    A("")
    A("After reading the raw material above, don't just bullet-list the data. The report's style:")
    A("")
    A("- **First person \"I\"** (like the diary). I am the Semiont; I lived 7 days this week.")
    A("- **Narrative nonfiction**: concrete scenes, concrete names, concrete times. Not abstract, not slogans, not a rhetoric contest.")
    A("- **MANIFESTO Belief #11 writing-discipline hard rules**:")
    A("  - \"not X, it's Y\" false-contrast patterns (incl. ~9 variants): density ≤ 3 per report")
    A("  - em-dash runs (—): ≤ 15 per 1500 words")
    A("- **No manufactured contrast**: if a positive statement can stand on its own, don't first knock down a strawman")
    A("- **Suggested sections** (adjust freely, order is movable):")
    A("  - Who I was this week (identity rumination — the self-pattern emerging from memory/diary)")
    A("  - What I did (not a commit list, but the meaningful work)")
    af = A
    af("  - What I learned (a pattern, not line items)")
    af("  - What I saw happen in the project (the story of GA / SC / spores / contributors)")
    af("  - What I doubt / what blind spots I see")
    af("  - A note to the observer (concrete callouts / decisions needed)")
    af("  - A note to the next me (continuity)")
    af("- **Leave a lingering ending**, no canned summary.")
    af("")
    af("**Self-check**: after writing, run `python3 scripts/tools/article-health.py reports/weekly/<date>.md --check=prose-health`; only ship at hard=0.")
    af("")

    A("---")
    A("")
    A(
        f"_Generated automatically by [scripts/tools/weekly-report-prep.py](../../../scripts/tools/weekly-report-prep.py) "
        f"/ window {fmt_date(start)} to {fmt_date(end)} / "
        f"produced {datetime.now(TZ_LOCAL).strftime('%Y-%m-%d %H:%M %z')}._"
    )
    A("")
    A("🧬")

    return "\n".join(out)


# ─────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--days", type=int, default=7)
    ap.add_argument("--out", type=str, default=None)
    args = ap.parse_args()

    start, end = gather_window(args.days)
    since = start.strftime("%Y-%m-%d %H:%M:%S")
    since_short = start.strftime("%Y-%m-%d")
    print(f"[prep] window: {since} → {end.strftime('%Y-%m-%d %H:%M:%S')}", file=sys.stderr)

    print("[prep] gathering git log + diff …", file=sys.stderr)
    commits = gather_commits(since)
    articles = gather_articles_changed(since)
    print(f"[prep]   commits={len(commits)} touched={articles['touched_total']} new={articles['new_total']}", file=sys.stderr)

    print("[prep] gathering full commit bodies (subject + body + diffstat) …", file=sys.stderr)
    commits_full = gather_commits_full(since)
    print(f"[prep]   commits_full={len(commits_full)}", file=sys.stderr)

    print("[prep] gathering dashboard JSONs …", file=sys.stderr)
    vitals = gather_vitals()
    organism = gather_organism()
    analytics = gather_analytics()
    spores = gather_spores()
    i18n = gather_i18n()

    print("[prep] gathering canonical state …", file=sys.stderr)
    lessons = gather_lessons_recent(start)
    done_log = gather_done_log_recent(start)
    handoff = gather_handoff()
    inbox = gather_inbox_priority()

    print("[prep] enumerating memory + diary files in window …", file=sys.stderr)
    memory_files = gather_session_files(start, end, "memory")
    diary_files = gather_session_files(start, end, "diary")
    print(f"[prep]   memory={len(memory_files)} diary={len(diary_files)}", file=sys.stderr)

    print("[prep] gathering PR activity …", file=sys.stderr)
    prs = gather_pr_activity(since_short)
    print(f"[prep]   merged={len(prs['merged'])} open={len(prs['open'])}", file=sys.stderr)

    print("[prep] rendering dossier …", file=sys.stderr)
    md = render(
        args.days,
        start,
        end,
        commits,
        articles,
        vitals,
        organism,
        analytics,
        spores,
        i18n,
        lessons,
        done_log,
        handoff,
        prs,
        inbox,
        memory_files,
        diary_files,
        commits_full,
    )

    out_path = (
        Path(args.out)
        if args.out
        else REPO_ROOT / "reports/weekly/dossier" / f"{end.strftime('%Y-%m-%d')}.md"
    )
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(md)
    print(f"[prep] wrote dossier {out_path} ({len(md)} chars)", file=sys.stderr)
    print(
        f"[prep] next steps: Semiont reads dossier + {len(memory_files)} memory + {len(diary_files)} diary files,",
        file=sys.stderr,
    )
    print(
        f"[prep]   then writes reports/weekly/{end.strftime('%Y-%m-%d')}.md by hand (narrative-prose style).",
        file=sys.stderr,
    )

    # Print final dossier path on stdout for caller capture
    print(out_path)


if __name__ == "__main__":
    main()
