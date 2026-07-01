#!/usr/bin/env python3
"""
generate-reports-index.py — auto-generate reports/INDEX.md

Reads reports/*.md (top-level only), classifies by 9 type buckets x month,
outputs INDEX.md. Generates a status summary for reports/ subdirectories
(research / probe / weekly / visual / archive / harvest / ab-tests /
music-media-audit / translation-research).

SSOT: reports/reports-archival-audit-2026-05-27.md §4 Layer 3
Trigger: docs/semiont/ROUTINE.md twmd-reports-index-daily (cron pending)

Design principles:
- No file moves, only re-presentation (per audit Layer 3 high-leverage-no-relocate)
- Type bucket names extracted from existing corpus regex (per audit §2.3)
- INDEX.md is fully overwritten by this script; manual edits will be lost

Usage:
    python3 scripts/tools/generate-reports-index.py
    python3 scripts/tools/generate-reports-index.py --dry-run  # print only, no write
"""

from __future__ import annotations

import argparse
import re
import subprocess
from collections import defaultdict
from datetime import datetime
from pathlib import Path

# 9 type buckets extracted from audit §2.3 corpus regex
# Order matters: earlier patterns match first (e.g. routine-audit / homepage-evolution
# goes into audit-routine, not audit / evolution)
TYPE_BUCKETS: list[tuple[str, str]] = [
    ("audit-routine",
     r"^(routine-audit|sense-|heartbeat-|self-evolve-weekly-|homepage-evolution-)"),
    ("semiont",
     r"(-semiont-analysis-)|^(NMTH|TFT|PanSci|NML|ThinkingTaiwan)"),
    ("proposal",     r"-proposal-|-strategy-"),
    ("evaluation",   r"-test-|-ab-test-|-fit-check-|-poc-"),
    ("evolution",    r"-evolution-|-evolve-|-roadmap-|-spec-"),
    ("design",       r"-design-|-design$"),
    ("plan",         r"-plan-|-plan$|-planning-|-orchestration-"),
    ("analysis",
     r"-analysis-|-analysis$|-investigation-|-deep-research-|-evaluation-|-discussion-"),
    ("audit",        r"-audit-|-audit$|-snapshot-|-hygiene-"),
]

# Subdir status descriptions (per audit §2.1 + §2.2)
SUBDIR_STATUS: dict[str, str] = {
    "research":            "REWRITE-PIPELINE Stage 1 canonical (year-month buckets)",
    "probe":               "BECOME §Step 7 probe reports",
    "weekly":              "Self-evolve weekly digest",
    "visual":              "Visual smoke test baseline (partial gitignored)",
    "ab-tests":            "Editorial v6 A/B test",
    "music-media-audit":   "Music article media audit (json + md)",
    "translation-research": "Multi-language research",
    "harvest":             "Harvest engine records",
    "archive":             "Archive location (per audit Layer 4)",
    "scratch":             "POC / scratch (per audit Layer 1, gitignored)",
}

DATE_RE = re.compile(r"(20\d{2}-\d{2}-\d{2})")
MONTH_RE = re.compile(r"(20\d{2}-\d{2})")
TITLE_RE = re.compile(r"^title:\s*['\"]?([^'\"]+?)['\"]?\s*$", re.MULTILINE)


def find_repo_root() -> Path:
    """Locate repo root via `git rev-parse`."""
    result = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        capture_output=True, text=True, check=True,
    )
    return Path(result.stdout.strip())


def classify(filename: str) -> str:
    """Map a filename to one of the 9 type buckets, or 'ops' fallback."""
    for tag, pattern in TYPE_BUCKETS:
        if re.search(pattern, filename):
            return tag
    return "ops"  # unmatched → ops (one-off operational reports)


def extract_date(filename: str) -> str | None:
    """Extract YYYY-MM-DD from filename suffix; None if absent."""
    matches = DATE_RE.findall(filename)
    return matches[-1] if matches else None


def extract_month(filename: str) -> str | None:
    match = MONTH_RE.search(filename)
    return match.group(1) if match else None


def extract_title(filepath: Path) -> str | None:
    """Pull frontmatter `title:` from first 20 lines; None if absent."""
    try:
        with filepath.open(encoding="utf-8") as f:
            head = "".join(f.readline() for _ in range(20))
    except Exception:
        return None
    match = TITLE_RE.search(head)
    return match.group(1).strip() if match else None


def subdir_inventory(reports_dir: Path) -> list[tuple[str, int, str, str]]:
    """Return [(subdir_name, file_count, size_human, description)] sorted by count desc."""
    rows: list[tuple[str, int, str, str]] = []
    for sub in sorted(reports_dir.iterdir()):
        if not sub.is_dir():
            continue
        files = list(sub.rglob("*"))
        file_count = sum(1 for f in files if f.is_file())
        total_bytes = sum(f.stat().st_size for f in files if f.is_file())
        if total_bytes >= 1_048_576:
            size_human = f"{total_bytes / 1_048_576:.1f} MB"
        elif total_bytes >= 1024:
            size_human = f"{total_bytes / 1024:.1f} KB"
        else:
            size_human = f"{total_bytes} B"
        description = SUBDIR_STATUS.get(sub.name, "—")
        rows.append((sub.name, file_count, size_human, description))
    rows.sort(key=lambda r: -r[1])
    return rows


def build_index(repo_root: Path) -> str:
    reports_dir = repo_root / "reports"
    top_level_md = sorted(
        p for p in reports_dir.glob("*.md")
        if p.is_file() and p.name != "INDEX.md"
    )

    by_type: dict[str, list[Path]] = defaultdict(list)
    by_month: dict[str, list[Path]] = defaultdict(list)
    for p in top_level_md:
        t = classify(p.stem)
        by_type[t].append(p)
        m = extract_month(p.name) or "undated"
        by_month[m].append(p)

    # Sort each bucket by descending date (newer first)
    for bucket in (by_type, by_month):
        for files in bucket.values():
            files.sort(key=lambda p: extract_date(p.name) or "", reverse=True)

    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    total = len(top_level_md)

    lines: list[str] = [
        "---",
        "title: 'reports/ INDEX — auto-generated'",
        "description: 'Top-level *.md indexed by 9 type buckets x month + subdir status summary'",
        f"last_generated: {now}",
        "generator: scripts/tools/generate-reports-index.py",
        "ssot: reports/reports-archival-audit-2026-05-27.md §4 Layer 3",
        "type: auto-index",
        "---",
        "",
        "# reports/ INDEX — auto-generated",
        "",
        f"> **This file is fully overwritten by `scripts/tools/generate-reports-index.py`.**",
        f"> Do not edit manually (will be overwritten by next cron run).",
        f">",
        f"> Last generated: **{now}** · top-level *.md: **{total}** files · "
        f"SSOT: [reports-archival-audit-2026-05-27.md §4 Layer 3](reports-archival-audit-2026-05-27.md)",
        "",
        "## 📦 Subdir status",
        "",
        "| Subdir | Files | Size | Purpose |",
        "| ------ | ----: | ---- | ------- |",
    ]
    for name, count, size, desc in subdir_inventory(reports_dir):
        lines.append(f"| `{name}/` | {count} | {size} | {desc} |")

    lines.extend([
        "",
        "## 🏷️ By type (top-level *.md only)",
        "",
        "9 type buckets extracted from existing corpus (per [audit §2.3 + §4 Layer 2](reports-archival-audit-2026-05-27.md)). "
        "New reports should follow `{type}-{topic}-{YYYY-MM-DD}.md` naming.",
        "",
    ])

    type_order = [
        "design", "plan", "evolution", "analysis", "audit",
        "audit-routine", "evaluation", "proposal", "semiont", "ops",
    ]
    for type_name in type_order:
        files = by_type.get(type_name, [])
        if not files:
            continue
        lines.append(f"### {type_name} ({len(files)})")
        lines.append("")
        for p in files:
            date = extract_date(p.name) or "????"
            stem = p.stem
            title = extract_title(p)
            display = f"[{stem}]({p.name})"
            if title:
                lines.append(f"- `{date}` {display} — {title}")
            else:
                lines.append(f"- `{date}` {display}")
        lines.append("")

    lines.extend([
        "## 📅 By month (descending)",
        "",
    ])
    for month in sorted(by_month.keys(), reverse=True):
        files = by_month[month]
        # type breakdown per month
        type_counts: dict[str, int] = defaultdict(int)
        for p in files:
            type_counts[classify(p.stem)] += 1
        type_breakdown = " / ".join(
            f"{t}: {c}" for t, c in sorted(type_counts.items(), key=lambda x: -x[1])
        )
        lines.append(f"### {month} ({len(files)} files)")
        lines.append("")
        lines.append(f"- Type breakdown: {type_breakdown}")
        lines.append("")
        for p in files:
            date = extract_date(p.name) or "????"
            lines.append(f"  - `{date}` [{p.stem}]({p.name})")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("🧬 _Auto-generated by `scripts/tools/generate-reports-index.py`. "
                 "Edit the generator, not this file._")

    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Print to stdout without writing reports/INDEX.md",
    )
    parser.add_argument(
        "--output", type=Path, default=None,
        help="Override output path (default: <repo>/reports/INDEX.md)",
    )
    args = parser.parse_args()

    repo_root = find_repo_root()
    content = build_index(repo_root)

    if args.dry_run:
        print(content)
        return 0

    output = args.output or (repo_root / "reports" / "INDEX.md")
    output.write_text(content, encoding="utf-8")
    line_count = content.count("\n")
    print(f"✅ Wrote {output.relative_to(repo_root)} ({line_count} lines)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
