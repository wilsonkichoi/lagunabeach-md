"""frontmatter_title — title format checks.

Migrated from `scripts/core/test-frontmatter.mjs::checkTitleFormat`
(2026-05-04 SSOT Phase 3).

Canonical: docs/editorial/EDITORIAL.md §5 SEO Metadata + §6 Voice

Yields multiple violations (different severities) from a single check:
  - HARD: half-width punct in CJK title context (silent rendering issue) [zh-TW]
  - WARN: vague adjective in title [en + zh-TW, lang-specific lists]
  - WARN: title length [en: raw chars > 60; zh-TW: effective length > 45]
 - WARN (People only): missing colon sandwich (per EDITORIAL §principle 5) [zh-TW]
 - WARN (People only): post-colon part < 8 weight (per EDITORIAL §principle 4) [zh-TW]
  - HARD: missing subcategory [both]
"""

from __future__ import annotations
import re
from typing import Any, Iterator

from ..types import FileTarget, Severity, Violation


CHECK_NAME = "frontmatter-title"
DIMENSION = "frontmatter"
DEFAULT_SEVERITY = Severity.WARN  # most checks are warn; HARD ones override per-violation
EDITORIAL_REF = "EDITORIAL.md §5 SEO Metadata"
APPLIES_TO = ["en", "zh-TW"]

# zh-TW vague adjectives (EDITORIAL §principle 3)
TITLE_VAGUE_ADJECTIVES_ZH: list[str] = [
 "傳奇",
 "偉大",
 "優秀",
 "最強",
 "天后",
]

# en vague adjectives (EDITORIAL §6 Voice — conservative subset)
TITLE_VAGUE_ADJECTIVES_EN: list[str] = [
    "iconic",
    "legendary",
    "world-class",
    "must-see",
    "hidden gem",
    "ultimate",
]

_EN_VAGUE_RE = re.compile(
    r"\b(?:" + "|".join(re.escape(a) for a in TITLE_VAGUE_ADJECTIVES_EN) + r")\b",
    re.IGNORECASE,
)

CJK_RE = re.compile(r"[一-鿿㐀-䶿]")

# Half-width punctuation in CJK title context — HARD violations.
# CJK lookbehind means inert on en articles, live on zh-TW.
_HALFWIDTH_PUNCT: list[tuple[re.Pattern, str, str]] = [
    (re.compile(r"(?<=[一-鿿㐀-䶿]),(?=[一-鿿㐀-䶿]|[0-9])"), ",", "，"),
    (re.compile(r"(?<=[一-鿿㐀-䶿]):(?=[一-鿿㐀-䶿]|[0-9])"), ":", "："),
    (re.compile(r"(?<=[一-鿿㐀-䶿]);(?=[一-鿿㐀-䶿])"), ";", "；"),
    (re.compile(r"(?<=[一-鿿㐀-䶿])\?(?=[一-鿿㐀-䶿])"), "?", "？"),
    (re.compile(r"(?<=[一-鿿㐀-䶿])!(?=[一-鿿㐀-䶿])"), "!", "！"),
]


def _effective_length(s: str) -> float:
    """CJK chars count as 1, others as 0.5 (matches the .mjs original)."""
    n = 0.0
    for ch in s:
        n += 1.0 if CJK_RE.match(ch) else 0.5
    return n


def check(target: FileTarget, config: dict[str, Any]) -> Iterator[Violation]:
    title = target.frontmatter.get("title")
    if not isinstance(title, str) or not title.strip():
        return

    is_en = target.lang == "en"

    # 1. Half-width punct in title (HARD) — CJK lookbehind makes it inert on en
    for pattern, half, full in _HALFWIDTH_PUNCT:
        for m in pattern.finditer(title):
            yield Violation(
                check=CHECK_NAME,
                severity=Severity.HARD,
                message=(
                    f"Half-width '{half}' in CJK title context (use '{full}')"
                    f" — run `python3 scripts/tools/article-health.py --check=cjk-punct --fix`"
                ),
                snippet=title,
                fix_suggestion=full,
 editorial_ref="EDITORIAL.md §half-width標點禁用",
            )

    # 2. Vague adjectives (WARN) — lang-specific lists
    if is_en:
        for m in _EN_VAGUE_RE.finditer(title):
            yield Violation(
                check=CHECK_NAME,
                severity=Severity.WARN,
                message=(
                    f"Title contains puffery adjective '{m.group(0)}'"
                    " (EDITORIAL §6 Voice — avoid brochure-style tells in titles)"
                ),
                snippet=title,
                editorial_ref="EDITORIAL.md §6 Voice",
            )
    else:
        for adj in TITLE_VAGUE_ADJECTIVES_ZH:
            if adj in title:
                yield Violation(
                    check=CHECK_NAME,
                    severity=Severity.WARN,
                    message=(
 f"title 含空泛形容詞「{adj}」"
 f" (EDITORIAL §principle 3 Forbidden「傳奇/偉大/最強/天后」等空泛詞)"
                    ),
                    snippet=title,
 editorial_ref="EDITORIAL.md §principle 3",
                )

    # 3. People category: colon sandwich (WARN) — zh-TW convention only
    if not is_en and target.category == "People":
        has_colon = ":" in title or "：" in title
        if not has_colon:
            yield Violation(
                check=CHECK_NAME,
                severity=Severity.WARN,
                message=(
                    "People title missing colon-sandwich structure"
 " (EDITORIAL §principle 5: 'Name: representative arc' format required)"
                ),
                snippet=title,
 editorial_ref="EDITORIAL.md §principle 5",
            )
        else:
            m = re.match(r"^[^:：]+[:：]\s*(.+)$", title)
            if m:
                after = m.group(1).strip()
                weight = _effective_length(after)
                if weight < 8:
                    yield Violation(
                        check=CHECK_NAME,
                        severity=Severity.WARN,
                        message=(
                            f"People title post-colon description too short"
                            f" (\"{after}\", weight {weight:.1f} < 8)"
 " — subtitle should stand alone (EDITORIAL §principle 4)"
                        ),
                        snippet=title,
 editorial_ref="EDITORIAL.md §principle 4",
                    )

    # 4. Length (WARN) — en: raw chars > 60 (SERP truncation);
    # zh-TW: effective weighted length > 45
    if is_en:
        if len(title) > 60:
            yield Violation(
                check=CHECK_NAME,
                severity=Severity.WARN,
                message=(
                    f"Title too long ({len(title)} chars > 60)"
                    " — Google SERP truncates around 60 characters"
                ),
                snippet=title,
                editorial_ref="EDITORIAL.md §5 SEO Metadata",
            )
    else:
        length = _effective_length(title)
        if length > 45:
            yield Violation(
                check=CHECK_NAME,
                severity=Severity.WARN,
                message=(
 f"title 過長 (effective length {length:.1f} > 45)"
 " — EDITORIAL suggestion ≤ 35"
                ),
                snippet=title,
 editorial_ref="EDITORIAL.md §Title 五principle",
            )

    # 5. Subcategory required (HARD) — non-About articles must declare
    # subcategory per docs/taxonomy/SUBCATEGORY.md.
    sub = target.frontmatter.get("subcategory")
    if target.category != "About" and (not isinstance(sub, str) or not sub.strip()):
        yield Violation(
            check=CHECK_NAME,
            severity=Severity.HARD,
            message=(
                f"Missing 'subcategory' in frontmatter"
                f" — {target.category} articles require a subcategory per docs/taxonomy/SUBCATEGORY.md"
            ),
            snippet=str(sub) if sub is not None else "(missing)",
            editorial_ref="docs/taxonomy/SUBCATEGORY.md",
        )
