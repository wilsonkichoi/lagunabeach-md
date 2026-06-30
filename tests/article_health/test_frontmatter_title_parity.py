"""Parity tests — canonical fixture counts for frontmatter_title plugin.

Post Phase-10: Python is sole canonical (JS title-format ripped). These
fixtures assert expected violation counts for both en and zh-TW paths.
"""

from pathlib import Path

import pytest

from lib.article_health.checks import frontmatter_title
from lib.article_health.loader import load_target
from lib.article_health.types import Severity


# Canonical fixtures: (title, category, lang_dir, expected_hard, expected_warn, label)
FIXTURES = [
    # zh-TW: Halfwidth punct → HARD
    ("黃魚鴞:六公里溪流養一對,1,800 公尺烏心石", "Nature", "zh-TW", 2, 0, "halfwidth-colon-comma"),
    ("台灣黑熊", "People", "zh-TW", 0, 1, "people-no-colon"),
    ("傳奇:故事與台灣味道", "Food", "zh-TW", 1, 1, "vague-adj+halfwidth"),
    ("黃魚鴞：六公里溪流養一對的夜行猛禽", "Nature", "zh-TW", 0, 0, "clean-zh-tw"),
    ("周杰倫", "People", "zh-TW", 0, 1, "people-no-colon-bare"),
    (
        "周杰倫：從 4 in Love 隔壁練團室到不能說的祕密的二十五年",
        "People",
        "zh-TW",
        0,
        0,
        "people-good-colon-sandwich",
    ),
    ("周杰倫：歌手", "People", "zh-TW", 0, 1, "people-short-subtitle"),
    (
        "黃魚鴞甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥東南西北春夏秋冬山水火木金土風雲雨雪霜天地",
        "Nature",
        "zh-TW",
        0,
        1,
        "title-too-long-zh",
    ),
    # en: clean titles
    ("Victoria Beach", "Beaches", "", 0, 0, "clean-en-short"),
    ("The Cliff Restaurant", "Food", "", 0, 0, "clean-en-normal"),
    # en: vague adjective
    ("The Iconic Tower at Victoria Beach", "Beaches", "", 0, 1, "en-vague-iconic"),
    ("Hidden Gem of South Laguna", "Beaches", "", 0, 1, "en-vague-hidden-gem"),
    # en: too long (> 60 chars)
    ("A" * 61, "Nature", "", 0, 1, "en-title-too-long"),
    # en: exactly 60 chars — no warn
    ("A" * 60, "Nature", "", 0, 0, "en-title-at-limit"),
]


def _check_via_python(title: str, category: str, lang_dir: str, tmp_path: Path):
    """Run the Python plugin and return (hard_count, warn_count)."""
    if lang_dir:
        d = tmp_path / "knowledge" / lang_dir / category
    else:
        d = tmp_path / "knowledge" / category
    d.mkdir(parents=True, exist_ok=True)
    f = d / "py.md"
    f.write_text(
        f"---\ntitle: '{title}'\ndescription: 'desc'\nsubcategory: 'parity-fixture'\n---\nbody.\n",
        encoding="utf-8",
    )
    target = load_target(f)
    violations = list(frontmatter_title.check(target, {}))
    hard = sum(1 for v in violations if v.severity == Severity.HARD)
    warn = sum(1 for v in violations if v.severity == Severity.WARN)
    return hard, warn


@pytest.mark.parametrize(
    "title,category,lang_dir,expected_hard,expected_warn,label", FIXTURES
)
def test_python_plugin_matches_expected(
    tmp_path, title, category, lang_dir, expected_hard, expected_warn, label
):
    """Python plugin's count matches the fixture's expected counts."""
    py_hard, py_warn = _check_via_python(title, category, lang_dir, tmp_path)
    assert py_hard == expected_hard, (
        f"[{label}] Python hard={py_hard}, expected {expected_hard}; title={title!r}"
    )
    assert py_warn == expected_warn, (
        f"[{label}] Python warn={py_warn}, expected {expected_warn}; title={title!r}"
    )
