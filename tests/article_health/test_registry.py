"""Tests for plugin registry — ensures auto-discovery works without plugins."""

from lib.article_health import registry, list_checks


def test_empty_registry_phase1():
    """Phase 1: no plugins shipped, registry is empty."""
    registry.reset_registry()
    items = list_checks()
    assert items == []


def test_validate_module_missing_attrs():
    """A module missing required attrs is rejected."""
    class Fake:
        CHECK_NAME = "fake"
        # missing the rest

    ok, err = registry._validate_module(Fake())
    assert not ok
    assert "missing" in err
