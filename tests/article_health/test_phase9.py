"""Phase 9 tests: footnote_url / cross_reference plugins."""

from pathlib import Path

import pytest

from lib.article_health import registry
from lib.article_health.checks import (
    cross_reference,
    footnote_url,
)
from lib.article_health.loader import load_target
from lib.article_health.types import Severity


def _write_article(tmp_path: Path, body: str, name: str = "x.md") -> Path:
    f = tmp_path / "knowledge" / "Nature" / name
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(
        f"---\ntitle: x\ndescription: y\ndate: 2026-05-04\ntags: [t]\n---\n\n{body}",
        encoding="utf-8",
    )
    return f


# ════════════════════════════════════════════════════════════════════════
# footnote-url plugin
# ════════════════════════════════════════════════════════════════════════


def test_footnote_url_default_skipped(tmp_path):
    """Network-bound check skipped by default."""
    body = "段落[^1]\n\n[^1]: [src](https://example.com) — desc enough chars"
    target = load_target(_write_article(tmp_path, body))
    violations = list(footnote_url.check(target, {}))
    assert violations == []


def test_footnote_url_enabled_via_config(tmp_path, monkeypatch):
    """When config enables network, plugin attempts HEAD."""
    body = "段落[^1]\n\n[^1]: [src](https://this-domain-does-not-exist-12345.invalid) — desc"
    target = load_target(_write_article(tmp_path, body))
    violations = list(footnote_url.check(target, {"network": True}))
    # Invalid domain should yield a warning
    assert len(violations) >= 1
    assert violations[0].severity == Severity.WARN


def test_footnote_url_env_var_enables(tmp_path, monkeypatch):
    monkeypatch.setenv("ARTICLE_HEALTH_NETWORK", "1")
    body = "段落[^1]\n\n[^1]: [src](https://this-bad-12345.invalid) — desc enough"
    target = load_target(_write_article(tmp_path, body))
    violations = list(footnote_url.check(target, {}))
    assert len(violations) >= 1


# ════════════════════════════════════════════════════════════════════════
# cross-reference plugin
# ════════════════════════════════════════════════════════════════════════


def test_cross_ref_symmetric_passes(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    cross_reference._reset_cache()
    # A links to B, B links to A — symmetric
    a = tmp_path / "knowledge" / "Nature" / "A.md"
    a.parent.mkdir(parents=True)
    a.write_text(
        "---\ntitle: A\n---\n參考 [[B]] 結尾", encoding="utf-8"
    )
    b = tmp_path / "knowledge" / "Nature" / "B.md"
    b.write_text(
        "---\ntitle: B\n---\n參考 [[A]] 結尾", encoding="utf-8"
    )
    target = load_target(a)
    violations = list(cross_reference.check(target, {}))
    assert violations == []


def test_cross_ref_asymmetric_info(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    cross_reference._reset_cache()
    # A links to B, B doesn't link back
    a = tmp_path / "knowledge" / "Nature" / "A.md"
    a.parent.mkdir(parents=True)
    a.write_text(
        "---\ntitle: A\n---\n參考 [[B]] 結尾", encoding="utf-8"
    )
    b = tmp_path / "knowledge" / "Nature" / "B.md"
    b.write_text("---\ntitle: B\n---\n沒有連回", encoding="utf-8")
    target = load_target(a)
    violations = list(cross_reference.check(target, {}))
    assert len(violations) == 1
    assert violations[0].severity == Severity.INFO
    assert "[[B]]" in violations[0].message


# ════════════════════════════════════════════════════════════════════════
# Plugin registration
# ════════════════════════════════════════════════════════════════════════


def test_phase9_plugins_registered():
    registry.reset_registry()
    found = registry.discover_checks()
    assert "footnote-url" in found
    assert "cross-reference" in found
