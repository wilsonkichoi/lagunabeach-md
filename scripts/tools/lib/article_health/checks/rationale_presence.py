"""rationale_presence — check that frontmatter rationale block has 4 required keys present.

Per RATIONALE-SPEC.md + issue #851 Cheyu Comment 8 Build 3:
  - rationale must contain 4 required keys: why_this_hook / whats_excluded /
    where_it_hedges / whos_pushing_back
  - which_framing is optional (5th key)
  - Plugin only checks key PRESENCE (existence + non-empty + not placeholder),
 NOT content depth — per 主人 5/23 awareness 哲學: 簡填 OK，不Check詳盡度

Strict vs advisory category split (per #851 Build 3 verbatim):
 「強制類別 (People / History / Society / Politics) → 新Articles ship before
 rationale 4 key 必填，warn 變強制Check (不過就不能 squash merge)」
 「suggestion類別 (Music / Food / Nature / Art) → warn 不擋 ship，但 dashboard
 display這類Articles的 rationale cover率」
 「分流理由：retrofit 200 填 rationale 太重 (短期inside做不到)，但新Articles
 Can strict。suggestion類別維持寬鬆，Avoid warn 變成噪音被作者Ignored」

Severity model:
 - HARD: rationale key 名拼錯 (e.g. `why_hook` instead of `why_this_hook`)
    — applies to any category, structural integrity issue
  - WARN: strict category missing rationale block / required key / empty value
    — release-pr profile (fail_on=warn) escalates to ship blocker
  - INFO: advisory category missing rationale — dashboard awareness only,
    never blocks ship

Auto-fix:
 None — rationale Content是 thinking 結果，不該 auto-generate。
"""

from __future__ import annotations

from typing import Any, Iterator

from ..types import FileTarget, Severity, Violation


CHECK_NAME = "rationale-presence"
DIMENSION = "rationale"
DEFAULT_SEVERITY = Severity.WARN
EDITORIAL_REF = "docs/editorial/RATIONALE-SPEC.md + REWRITE-PIPELINE.md Step 1.4.5"
APPLIES_TO = ["en"]


REQUIRED_KEYS = [
    "why_this_hook",
    "whats_excluded",
    "where_it_hedges",
    "whos_pushing_back",
]

OPTIONAL_KEYS = [
    "which_framing",
]

ALL_KNOWN_KEYS = set(REQUIRED_KEYS + OPTIONAL_KEYS)

# Strict categories — release-pr profile gates these. LagunaBeach.md's
# category set has no People/Society/Politics; History is the closest
# analog (factual/historical claims warrant rationale).
STRICT_CATEGORIES = {"History"}

# Placeholder values that count as "empty" / unfilled.
EMPTY_MARKERS = {"", "[TODO]", "[待填]", "TODO", "待填", "todo", "TBD", "tbd"}


def _missing_severity(target: FileTarget) -> Severity:
    """Strict category → WARN; advisory category → INFO."""
    if target.category in STRICT_CATEGORIES:
        return Severity.WARN
    return Severity.INFO


def check(target: FileTarget, config: dict[str, Any]) -> Iterator[Violation]:
    if target.category == "About":
        return

    rationale = target.frontmatter.get("rationale")
    missing_sev = _missing_severity(target)

    # Case 1: No rationale block at all
    if rationale is None:
        yield Violation(
            check=CHECK_NAME,
            severity=missing_sev,
            message=(
                f"frontmatter missing `rationale:` block — "
                f"add the 4 required keys ({' / '.join(REQUIRED_KEYS)}). A brief one-liner per key is fine."
            ),
            line=1,
            fix_suggestion=(
                "rationale:\n"
                "  why_this_hook: '...'\n"
                "  whats_excluded: '...'\n"
                "  where_it_hedges: '...'\n"
                "  whos_pushing_back: '...'\n"
                "  which_framing: '...'  # optional"
            ),
            editorial_ref=EDITORIAL_REF,
        )
        return

    # Case 2: rationale exists but is not a mapping (malformed YAML)
    if not isinstance(rationale, dict):
        yield Violation(
            check=CHECK_NAME,
            severity=Severity.HARD,
            message="frontmatter `rationale` must be a YAML mapping (nested keys)",
            line=1,
            fix_suggestion="Use `rationale:` with the 4 nested keys",
            editorial_ref=EDITORIAL_REF,
        )
        return

    # Case 3: Check each required key is present and non-empty
    for key in REQUIRED_KEYS:
        if key not in rationale:
            yield Violation(
                check=CHECK_NAME,
                severity=missing_sev,
                message=f"rationale missing required key `{key}` (a brief one-liner is fine)",
                line=1,
                fix_suggestion=f"Add `{key}: '...'`",
                editorial_ref=EDITORIAL_REF,
            )
            continue

        value = rationale.get(key)
        # Treat None / empty string / placeholder markers as unfilled
        value_str = "" if value is None else str(value).strip()
        if value_str in EMPTY_MARKERS:
            yield Violation(
                check=CHECK_NAME,
                severity=missing_sev,
                message=f"rationale `{key}` is empty or a placeholder (a brief one-liner is fine, but not empty)",
                line=1,
                fix_suggestion=f"Fill `{key}` with a one-line description",
                editorial_ref=EDITORIAL_REF,
            )

    # Case 4: Check for typo'd / unknown keys (HARD — structural integrity)
    # Underscore-prefixed sister keys (e.g. _rationale_meta) are allowed.
    for key in rationale.keys():
        if key in ALL_KNOWN_KEYS:
            continue
        if isinstance(key, str) and key.startswith("_"):
            continue
        yield Violation(
            check=CHECK_NAME,
            severity=Severity.HARD,
            message=(
                f"rationale key `{key}` is not a canonical name — typo?"
                f" canonical keys: {', '.join(REQUIRED_KEYS + OPTIONAL_KEYS)}"
            ),
            line=1,
            fix_suggestion=f"Check spelling, or prefix with underscore `_{key}` to mark it as a sister key",
            editorial_ref=EDITORIAL_REF,
        )
