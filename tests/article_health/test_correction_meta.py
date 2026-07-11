"""Tests for correction_meta plugin (English errata-as-prose detection)."""

from pathlib import Path

import pytest

from lib.article_health import registry
from lib.article_health.checks import correction_meta
from lib.article_health.loader import load_target
from lib.article_health.types import Severity


def _write(tmp_path: Path, body: str, name: str = "x.md") -> Path:
    f = tmp_path / "knowledge" / "History" / name
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(
        f"---\ntitle: x\ndescription: y\ndate: 2026-05-04\ntags: [t]\n---\n\n{body}",
        encoding="utf-8",
    )
    return f


def _check(tmp_path: Path, body: str, name: str = "x.md"):
    target = load_target(_write(tmp_path, body, name))
    return list(correction_meta.check(target, {}))


@pytest.mark.parametrize(
    "phrase",
    [
        "The site is often confused with a nearby cove.",
        "Contrary to popular belief, the tower was built in 1926.",
        "The beach is not to be confused with its northern neighbor.",
        "Despite the common misconception, the festival predates the city.",
        "The founder is often wrongly credited to a later arrival.",
        "It is a common misconception that the trail is closed in winter.",
        "People often assume the colony started with a single painter.",
    ],
)
def test_correction_anxiety_phrases_flagged(tmp_path, phrase):
    violations = _check(tmp_path, phrase)
    assert len(violations) == 1
    assert violations[0].severity == Severity.WARN
    assert "Correction-anxiety pattern" in violations[0].message


def test_clean_positive_prose_not_flagged(tmp_path):
    body = (
        "The tower was built in 1926 by a local architect. "
        "The festival began in 1933 and runs every summer."
    )
    assert _check(tmp_path, body) == []


def test_protected_regions_not_matched(tmp_path):
    """Code / link URLs are masked, so a pattern inside them never false-matches."""
    body = "See `a common misconception` in code and [link](https://example.com/a-common-misconception)."
    assert _check(tmp_path, body) == []


def test_hub_pages_excluded(tmp_path):
    violations = _check(tmp_path, "This is often confused with something else.", name="_hub.md")
    assert violations == []


def test_plugin_metadata():
    assert correction_meta.CHECK_NAME == "correction-meta"
    assert correction_meta.DEFAULT_SEVERITY == Severity.WARN
    assert not hasattr(correction_meta, "APPLIES_TO")


def test_plugin_registered():
    registry.reset_registry()
    found = registry.discover_checks()
    assert "correction-meta" in found, list(found.keys())
