"""chronicle_lead — chronicle-style subheading detection (REWRITE Stage 2 #4 + #11).

Ported from Taiwan.md. Most patterns were already language-agnostic (ISO
date formats); this port adds English-specific patterns (Month Year, Year:
Title) alongside them.

Rule:
    H2 subheadings must NOT be chronicle-style ("May 2016", "2020: Album
    Title", "2020.5.6") — these turn the article into a Wikipedia-style
    timeline instead of a scene / conflict / object-led structure.

Detected patterns (WARN, soft-launch):
    ## May 2016: the fire started      <- chronicle event with month
    ## 2020: Album Title                <- year + colon + title
    ## 2020.5.6                         <- date format
    ## 2020/5/6                         <- date format
    ## 2020-05-06                       <- ISO date

Allowed patterns (legitimate timeline / historical scope):
    ## 1949-1987 Martial Law Era         <- year range + description (historical)
    ## The 1990s                         <- decade reference
    ## Postwar Period                    <- named period (no specific year)

APPLIES_TO design:
    English articles under knowledge/{Category}/.
    Skip:
      - Hub pages (`_*.md`) — index pages legitimately use timeline structure
      - Translation files (knowledge/zh-TW/)
      - SPORE blueprints / harvests — handled by spore_writing.py
      - Memory / diary — timeline templates legitimate
      - reports/research/ — research notes legitimately use dates

Canonical:
  - docs/editorial/EDITORIAL.en.md §subheadings
"""

from __future__ import annotations
import re
from typing import Any, Iterator

from ..types import FileTarget, Severity, Violation


CHECK_NAME = "chronicle-lead"
DIMENSION = "subheading"
DEFAULT_SEVERITY = Severity.WARN
EDITORIAL_REF = "EDITORIAL.en.md §subheadings (no chronicle-style H2)"
APPLIES_TO = ["en"]


_MONTHS = (
    r"January|February|March|April|May|June|July|August|September|"
    r"October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec"
)

# ── HARD: chronicle subheading patterns ──────────────────────────────────────

# Month Year — most common AI failure mode (event date lead)
# e.g. ## May 2016: the fire started
_RE_MONTH_YEAR = re.compile(rf"^##\s+(?:{_MONTHS})\s+\d{{4}}", re.IGNORECASE)

# Year Month (reversed order) — e.g. ## 2016 May
_RE_YEAR_MONTH = re.compile(rf"^##\s+\d{{4}}\s+(?:{_MONTHS})", re.IGNORECASE)

# YYYY: Title / YYYY "Event" — year-prefixed event lead
# e.g. ## 2018: the award nomination
_RE_YEAR_EVENT = re.compile(r"^##\s+\d{4}\s*[:“\"]")

# YYYY.MM.DD / YYYY/MM/DD / YYYY-MM-DD — date format
# e.g. ## 2020.5.6 / ## 2020/5/6 / ## 2020-05-06
_RE_DATE_FORMAT = re.compile(r"^##\s+\d{4}[/.\-]\s*\d{1,2}[/.\-]\s*\d{1,2}")


# ── Allowed patterns (regex to detect legitimate timeline scope, returns True
#    to skip HARD violation) ────────────────────────────────────────────────────

# Year range: ## 1949-1987 ... / ## 1949–1987 ... / ## 1949 — 1987 ...
_RE_YEAR_RANGE = re.compile(r"^##\s+\d{4}\s*[—–\-]\s*\d{4}")

# Decade: ## The 1990s / ## 1990s
_RE_DECADE = re.compile(r"^##\s+(?:The\s+)?\d{4}s\b", re.IGNORECASE)


def _is_excluded_path(path: str) -> bool:
    """Skip non-English articles, hubs, spores, and historical artifact paths.

    Includes /tmp/ ad-hoc draft testing (any tmp file is treated as if it were
    a knowledge/ article for testing purposes).
    """
    import os
    p = str(path)
    # Translation files
    if "/knowledge/zh-TW/" in p:
        return True
    # Hub pages — knowledge/{Category}/_X.md hub pattern
    if os.path.basename(p).startswith("_") and p.endswith(".md"):
        return True
    # Spore artifacts (handled by spore_writing.py)
    if "/SPORE-BLUEPRINTS/" in p or "/SPORE-HARVESTS/" in p:
        return True
    # Memory / diary (timeline templates legitimate)
    if "/memory/" in p or "/diary/" in p:
        return True
    # Research reports (date prefixes + chronologies legit)
    if "/reports/research/" in p:
        return True
    # Allowed: knowledge/{Category}/ articles + /tmp/ for ad-hoc testing
    return False


def _is_legitimate_chronicle(line: str) -> bool:
    """Return True if subheading is a legitimate timeline scope (skip HARD)."""
    return bool(
        _RE_YEAR_RANGE.match(line)
        or _RE_DECADE.match(line)
    )


def _detect_chronicle_violation(line: str) -> str | None:
    """Return violation pattern name if line is a chronicle subheading, else None."""
    if _is_legitimate_chronicle(line):
        return None
    if _RE_MONTH_YEAR.match(line):
        return "month-year"
    if _RE_YEAR_MONTH.match(line):
        return "year-month"
    if _RE_YEAR_EVENT.match(line):
        return "year-event"
    if _RE_DATE_FORMAT.match(line):
        return "date-format"
    return None


def check(target: FileTarget, config: dict[str, Any]) -> Iterator[Violation]:
    """Detect chronicle-style H2 subheadings (REWRITE Stage 2 #4 / #11).

    HARD violation: any subheading matching chronicle date patterns.
    Skipped paths: translations / hubs / spores / memory / diary / research reports.
    """
    if _is_excluded_path(str(target.path)):
        return

    text = target.text
    if not text:
        return

    for line_no, line in enumerate(text.split("\n"), start=1):
        stripped = line.rstrip()
        if not stripped.startswith("## "):
            continue
        kind = _detect_chronicle_violation(stripped)
        if not kind:
            continue
        yield Violation(
            check=CHECK_NAME,
            severity=DEFAULT_SEVERITY,
            message=(
                f"Chronicle-style subheading: "
                f'"{stripped[:60]}" = Wikipedia-style timeline, use a scene / image / '
                "conflict / object / core-tension lead instead"
            ),
            line=line_no,
            snippet=stripped[:80],
            editorial_ref=EDITORIAL_REF,
            fix_suggestion=(
                'Examples: "The party ended" (scene) / "The dog named Spud" (object) / '
                '"The uncredited founder" (core tension). Year ranges like '
                '"1949-1987 Martial Law Era" are fine.'
            ),
        )
