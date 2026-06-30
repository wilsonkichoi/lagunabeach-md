"""correction_meta — errata-as-prose detection (REWRITE Stage 3.2-bis).

Detects "correction anxiety" patterns: sentences that exist solely to correct
a previous version's mistake rather than stating facts positively. These leak
into AI-rewritten articles when old body + old callout are in session context.

Self-check: "If the article were right the first time, would this sentence
exist? If it only exists to respond to a past error or clarify a confusion, delete."

DEFAULT WARN (dual-use patterns + legacy soft-launch).
"""

from __future__ import annotations
import os
import re
from typing import Any, Iterator

from ..types import FileTarget, Severity, Violation


CHECK_NAME = "correction-meta"
DIMENSION = "editorial-voice"
DEFAULT_SEVERITY = Severity.WARN
EDITORIAL_REF = "REWRITE-PIPELINE.md §Step 3.2-bis correction-anxiety scan"
APPLIES_TO = ["en", "zh-TW"]


# ── zh-TW errata patterns ────────────────────────────────────────────────────
_PATTERNS_ZH: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"[把將][^，。！？\n]{0,40}(掛|記|算)(在|到)[^，。！？\n]{0,20}名下"),
     "misattribution-correction frame"),
    (re.compile(r"反而(抹掉|蓋掉|掩蓋|蓋過)"),
     "wrong-attribution-erasure frame"),
    (re.compile(r"(常|容易|經常|往往)(被|會被)?(誤記|誤認|誤植|搞混|混淆|叫錯)"),
     "often-mistaken frame"),
    (re.compile(r"誤記(成|為)"), "misremembered-as frame"),
    (re.compile(r"(別|不要|不該)[^，。！？\n]{0,6}(搞錯|弄錯|搞混|叫錯|認錯)"),
     "don't-confuse frame"),
    (re.compile(r"(搞錯|叫錯|認錯|弄錯)[^，。！？\n]{0,6}(名字|了名|人|對象)"),
     "wrong-name frame"),
    (re.compile(r"[把將][^，。！？\n]{0,24}(跟|和|與|同)[^，。！？\n]{0,24}(搞混|混為|弄混|混淆)"),
     "confused-X-with-Y frame"),
    (re.compile(r"(值得|得|要|需要)[^，。！？\n]{0,10}(說|講|分|釐|弄)清楚"),
     "clarification frame"),
    (re.compile(r"[把將][^，。！？\n]{0,30}分(清楚|開)"),
     "distinguish-X frame"),
    (re.compile(r"順帶[^，。！？\n]{0,12}(分清楚|說清楚|釐清|澄清)"),
     "incidental-clarification frame"),
]

# ── English errata patterns ──────────────────────────────────────────────────
_PATTERNS_EN: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\boften\s+(?:mistaken|confused|misattributed|misremembered)\b", re.IGNORECASE),
     "often-mistaken frame"),
    (re.compile(r"\bcontrary\s+to\s+(?:popular|common)\s+belief\b", re.IGNORECASE),
     "contrary-to-belief frame"),
    (re.compile(r"\bnot\s+to\s+be\s+confused\s+with\b", re.IGNORECASE),
     "not-to-be-confused frame"),
    (re.compile(r"\bdespite\s+(?:the\s+)?common\s+(?:belief|misconception)\b", re.IGNORECASE),
     "despite-misconception frame"),
    (re.compile(r"\bis\s+(?:often|sometimes)\s+wrongly\b", re.IGNORECASE),
     "often-wrongly frame"),
    (re.compile(r"\ba\s+common\s+misconception\b", re.IGNORECASE),
     "common-misconception frame"),
    (re.compile(r"\bpeople\s+often\s+(?:think|assume|believe)\b", re.IGNORECASE),
     "people-often-think frame"),
]


def _is_excluded_path(path: str) -> bool:
    p = str(path)
    if any(f"/knowledge/{lg}/" in p for lg in ("en", "ja", "ko", "es", "fr")):
        return True
    if os.path.basename(p).startswith("_") and p.endswith(".md"):
        return True
    if "/SPORE-BLUEPRINTS/" in p or "/SPORE-HARVESTS/" in p:
        return True
    if "/memory/" in p or "/diary/" in p:
        return True
    if "/reports/" in p:
        return True
    return False


def check(target: FileTarget, config: dict[str, Any]) -> Iterator[Violation]:
    """Detect errata-as-prose (correction anxiety) — REWRITE Stage 3.2-bis backstop.

    Scans body with protected regions (code / link-url / html) masked so URLs
    and code never false-match. Line numbers align with file (body is padded).
    """
    if _is_excluded_path(str(target.path)):
        return

    masked = target.body_without_protected()
    if not masked.strip():
        return

    patterns = _PATTERNS_EN if target.lang == "en" else _PATTERNS_ZH

    for line_no, line in enumerate(masked.split("\n"), start=1):
        if not line.strip():
            continue
        for rx, label in patterns:
            m = rx.search(line)
            if not m:
                continue
            yield Violation(
                check=CHECK_NAME,
                severity=DEFAULT_SEVERITY,
                message=(
                    f"Correction-anxiety pattern ({label}): '{m.group(0)[:30]}' — "
                    f"self-check: if the article were right the first time, "
                    f"would this sentence exist?"
                ),
                line=line_no,
                snippet=line.strip()[:90],
                editorial_ref=EDITORIAL_REF,
                fix_suggestion=(
                    "Rewrite as a positive statement (state the correct fact directly, "
                    "don't frame it as correcting someone else's mistake)."
                ),
            )
            break  # one violation per line is enough signal
