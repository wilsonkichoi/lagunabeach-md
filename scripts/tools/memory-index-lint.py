#!/usr/bin/env python3
"""
memory-index-lint.py — MEMORY.md index row 150-char hard gate check

MEMORY-PIPELINE §Index row rules require "summary + lesson columns combined <= 150 chars",
but husky pre-commit only validates frontmatter, not index row length. This tool fills
that gap (REFLEXES #69: self-reported length estimates need external measurement).

Only hard-fails the newest row (just written); historical rows that exceed only warn
(per MANIFESTO time-is-structural-repair protocol, no retroactive fixes).

Usage: run `memory-index-lint.py` before memory wrap-up commit; can wire into husky pre-commit.
Exit 1 = newest row exceeds gate.
"""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DEFAULT = REPO / "docs/semiont/MEMORY.md"
GATE = 150
DATE_RE = re.compile(r"^\s*20\d\d-\d\d-\d\d\s*$")


def index_rows(lines):
    """Return (line_no, session, summary+lesson char count). Row format: | date | session | summary | lesson | [link] |"""
    rows = []
    for i, l in enumerate(lines):
        parts = l.split("|")
        # Leading/trailing empty cells -> ['', date, session, summary, lesson, link, ''] = 7 parts
        if len(parts) < 7 or not DATE_RE.match(parts[1]):
            continue
        session = parts[2].strip()
        n = len(parts[3].strip()) + len(parts[4].strip())
        rows.append((i + 1, session, n))
    return rows


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else str(DEFAULT)
    lines = Path(path).read_text(encoding="utf-8").split("\n")
    rows = index_rows(lines)
    if not rows:
        print("(no index rows found -- file structure issue?)", file=sys.stderr)
        return 0

    over = [(ln, s, n) for ln, s, n in rows if n > GATE]
    newest_ln = rows[-1][0]
    newest_over = next((r for r in over if r[0] == newest_ln), None)

    hist_over = len(over) - (1 if newest_over else 0)
    if not newest_over:
        note = f" ({hist_over} historical rows exceed gate = pre-2026-05-12 style, not retroactively fixed)" if hist_over else ""
        print(f"✅ Newest index row L{newest_ln} <= {GATE} chars{note}")
        return 0

    print(f"❌ Newest index row L{newest_ln} \"{rows[-1][1][:28]}\" exceeds {newest_over[2]} chars (gate {GATE})")
    print(f"   summary <=100 / lesson <=50, details belong in memory file. Rewrite before commit.")
    if hist_over:
        print(f"   ({hist_over} additional historical rows exceed gate, not retroactively fixed)")
    return 1


if __name__ == "__main__":
    sys.exit(main())
