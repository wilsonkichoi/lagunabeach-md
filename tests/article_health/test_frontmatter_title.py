"""Tests for frontmatter_title plugin.

Covers both en and zh-TW paths (APPLIES_TO=["en","zh-TW"]).
"""

from pathlib import Path

import pytest

from lib.article_health import registry
from lib.article_health.checks import frontmatter_title
from lib.article_health.loader import load_target
from lib.article_health.types import Severity


def _make_article(
    tmp_path: Path,
    title: str,
    category: str = "Nature",
    lang_dir: str = "",
    description: str = "desc",
) -> Path:
    if lang_dir:
        d = tmp_path / "knowledge" / lang_dir / category
    else:
        d = tmp_path / "knowledge" / category
    d.mkdir(parents=True, exist_ok=True)
    f = d / "test.md"
    f.write_text(
        f"---\ntitle: '{title}'\ndescription: '{description}'\nsubcategory: 'test-sub'\n---\n\nbody.\n",
        encoding="utf-8",
    )
    return f


def _check(tmp_path: Path, title: str, category: str = "Nature", lang_dir: str = ""):
    f = _make_article(tmp_path, title, category, lang_dir)
    target = load_target(f)
    return list(frontmatter_title.check(target, {}))


# ════════════════════════════════════════════════════════════════════════
# HARD: half-width punct in CJK title (zh-TW path; inert on en)
# ════════════════════════════════════════════════════════════════════════


def test_halfwidth_colon_between_cjk_is_hard(tmp_path):
    violations = _check(tmp_path, "黃魚鴞:六公里溪流養一對", lang_dir="zh-TW")
    hard = [v for v in violations if v.severity == Severity.HARD]
    assert len(hard) >= 1
    assert any("：" in (v.fix_suggestion or "") for v in hard)


def test_halfwidth_comma_cjk_to_digit_is_hard(tmp_path):
    violations = _check(tmp_path, "六公里養一對,1800 公尺", lang_dir="zh-TW")
    hard = [v for v in violations if v.severity == Severity.HARD]
    assert len(hard) >= 1
    assert any("，" in (v.fix_suggestion or "") for v in hard)


def test_intra_number_comma_not_flagged(tmp_path):
    violations = _check(tmp_path, "海拔 1,800 公尺烏心石", lang_dir="zh-TW")
    hard = [v for v in violations if v.severity == Severity.HARD]
    assert hard == []


def test_english_comma_not_flagged(tmp_path):
    violations = _check(tmp_path, "Sun, Y. H. monograph")
    hard = [v for v in violations if v.severity == Severity.HARD]
    assert hard == []


def test_halfwidth_punct_inert_on_en(tmp_path):
    """CJK lookbehind means halfwidth punct check is inert on en articles."""
    violations = _check(tmp_path, "Hello: World")
    hard = [v for v in violations if v.severity == Severity.HARD and "Half-width" in v.message]
    assert hard == []


# ════════════════════════════════════════════════════════════════════════
# WARN: vague adjectives — zh-TW
# ════════════════════════════════════════════════════════════════════════


@pytest.mark.parametrize("adj", ["傳奇", "偉大", "優秀", "最強", "天后"])
def test_vague_adjective_zh_is_warn(tmp_path, adj):
    violations = _check(tmp_path, f"{adj}的故事和台灣味道", lang_dir="zh-TW")
    warns = [v for v in violations if v.severity == Severity.WARN and adj in v.message]
    assert len(warns) == 1


def test_unlisted_word_not_flagged_zh(tmp_path):
    violations = _check(tmp_path, "原住民神話之夜歌與祭典", category="Culture", lang_dir="zh-TW")
    vague_warns = [v for v in violations if "空泛形容詞" in v.message]
    assert vague_warns == []


# ════════════════════════════════════════════════════════════════════════
# WARN: vague adjectives — en
# ════════════════════════════════════════════════════════════════════════


@pytest.mark.parametrize("adj", ["iconic", "legendary", "world-class", "must-see", "hidden gem", "ultimate"])
def test_vague_adjective_en_is_warn(tmp_path, adj):
    violations = _check(tmp_path, f"The {adj} Laguna Beach Guide")
    warns = [v for v in violations if v.severity == Severity.WARN and "puffery" in v.message]
    assert len(warns) == 1


def test_vague_adjective_en_case_insensitive(tmp_path):
    violations = _check(tmp_path, "The ICONIC Tower at Victoria Beach")
    warns = [v for v in violations if v.severity == Severity.WARN and "puffery" in v.message]
    assert len(warns) == 1


def test_clean_en_title_no_vague_warn(tmp_path):
    violations = _check(tmp_path, "Victoria Beach")
    warns = [v for v in violations if v.severity == Severity.WARN and "puffery" in v.message]
    assert warns == []


# ════════════════════════════════════════════════════════════════════════
# WARN: People colon-sandwich (zh-TW only)
# ════════════════════════════════════════════════════════════════════════


def test_people_without_colon_warns(tmp_path):
    violations = _check(tmp_path, "周杰倫", category="People", lang_dir="zh-TW")
    warns = [v for v in violations if "colon-sandwich" in v.message]
    assert len(warns) == 1


def test_people_with_colon_and_long_subtitle_passes(tmp_path):
    title = "周杰倫：從 4 in Love 隔壁練團室到不能說的祕密的二十五年"
    violations = _check(tmp_path, title, category="People", lang_dir="zh-TW")
    relevant = [
        v for v in violations
        if "colon-sandwich" in v.message or "too short" in v.message
    ]
    assert relevant == []


def test_people_short_subtitle_warns(tmp_path):
    violations = _check(tmp_path, "周杰倫：歌手", category="People", lang_dir="zh-TW")
    warns = [v for v in violations if "too short" in v.message]
    assert len(warns) == 1


def test_non_people_without_colon_no_colon_warn(tmp_path):
    violations = _check(tmp_path, "黃魚鴞", category="Nature", lang_dir="zh-TW")
    warns = [v for v in violations if "colon-sandwich" in v.message]
    assert warns == []


def test_people_colon_not_checked_for_en(tmp_path):
    """People colon sandwich is zh-TW convention only; en is exempt."""
    violations = _check(tmp_path, "John Smith", category="People")
    warns = [v for v in violations if "colon-sandwich" in v.message]
    assert warns == []


# ════════════════════════════════════════════════════════════════════════
# WARN: title length — zh-TW (effective > 45) and en (raw > 60)
# ════════════════════════════════════════════════════════════════════════


def test_long_title_zh_warns(tmp_path):
    # 46 CJK chars → effective 46 > 45 threshold
    long_title = "黃魚鴞甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥東南西北春夏秋冬山水火木金土風雲雨雪霜天地"
    violations = _check(tmp_path, long_title, lang_dir="zh-TW")
    warns = [v for v in violations if "過長" in v.message]
    assert len(warns) == 1


def test_normal_title_zh_passes_length(tmp_path):
    violations = _check(tmp_path, "黃魚鴞：六公里溪流養一對的夜行猛禽", lang_dir="zh-TW")
    warns = [v for v in violations if "過長" in v.message]
    assert warns == []


def test_long_title_en_warns(tmp_path):
    # 61 chars > 60 threshold
    long_title = "A" * 61
    violations = _check(tmp_path, long_title)
    warns = [v for v in violations if "too long" in v.message.lower()]
    assert len(warns) == 1


def test_normal_title_en_passes_length(tmp_path):
    violations = _check(tmp_path, "Victoria Beach")
    warns = [v for v in violations if "too long" in v.message.lower()]
    assert warns == []


# ════════════════════════════════════════════════════════════════════════
# Lang filter: APPLIES_TO=["en","zh-TW"] — translations skipped
# ════════════════════════════════════════════════════════════════════════


def test_translation_files_skipped_at_runner_level(tmp_path):
    """Non-en/zh-TW translations don't run this plugin (APPLIES_TO filter)."""
    from lib.article_health import config as cfg_mod
    from lib.article_health.runner import run_checks

    f = _make_article(tmp_path, "Some Japanese Title!", lang_dir="ja")
    target = load_target(f)
    cfg = cfg_mod.Config()
    report = run_checks(target, cfg, check_name="frontmatter-title")
    assert report.results == []


# ════════════════════════════════════════════════════════════════════════
# Per-violation severity precedence (Phase 3 runner change)
# ════════════════════════════════════════════════════════════════════════


def test_mixed_severities_in_one_check(tmp_path):
    """A title with BOTH halfwidth punct AND vague adjective should yield
    one HARD + one WARN violation (zh-TW)."""
    violations = _check(tmp_path, "傳奇:故事與台灣", lang_dir="zh-TW")
    hard = [v for v in violations if v.severity == Severity.HARD]
    warn = [v for v in violations if v.severity == Severity.WARN]
    assert len(hard) >= 1  # halfwidth :
    assert len(warn) >= 1  # 傳奇 vague adj


def test_runner_preserves_per_violation_hard(tmp_path):
    """Even with profile override default→warn, plugin's HARD violations
    stay HARD."""
    from lib.article_health import config as cfg_mod
    from lib.article_health.runner import run_checks

    f = _make_article(tmp_path, "黃魚鴞:六公里", lang_dir="zh-TW")
    target = load_target(f)
    cfg = cfg_mod.Config()
    cfg.profiles["test"] = cfg_mod.ProfileConfig(
        name="test",
        checks=["frontmatter-title"],
        severity_overrides={"frontmatter-title": Severity.WARN},
    )
    report = run_checks(target, cfg, profile_name="test")
    hard_violations = [v for r in report.results for v in r.violations if v.severity == Severity.HARD]
    assert len(hard_violations) >= 1, "halfwidth punct HARD must survive profile override"


# ════════════════════════════════════════════════════════════════════════
# Plugin metadata
# ════════════════════════════════════════════════════════════════════════


def test_plugin_metadata():
    assert frontmatter_title.CHECK_NAME == "frontmatter-title"
    assert frontmatter_title.DEFAULT_SEVERITY == Severity.WARN
    assert "en" in frontmatter_title.APPLIES_TO
    assert "zh-TW" in frontmatter_title.APPLIES_TO
    assert callable(frontmatter_title.check)


def test_plugin_registered():
    registry.reset_registry()
    found = registry.discover_checks()
    assert "frontmatter-title" in found, list(found.keys())


# ════════════════════════════════════════════════════════════════════════
# Subcategory HARD (both en and zh-TW)
# ════════════════════════════════════════════════════════════════════════


def _make_article_no_subcategory(tmp_path: Path, title: str, category: str, lang_dir: str = "") -> Path:
    if lang_dir:
        d = tmp_path / "knowledge" / lang_dir / category
    else:
        d = tmp_path / "knowledge" / category
    d.mkdir(parents=True, exist_ok=True)
    f = d / "test.md"
    f.write_text(
        f"---\ntitle: '{title}'\ndescription: 'desc'\n---\n\nbody.\n",
        encoding="utf-8",
    )
    return f


def test_missing_subcategory_is_hard(tmp_path):
    f = _make_article_no_subcategory(tmp_path, "Victoria Beach", "Beaches")
    target = load_target(f)
    violations = list(frontmatter_title.check(target, {}))
    sub_hard = [
        v for v in violations
        if v.severity == Severity.HARD and "subcategory" in v.message
    ]
    assert len(sub_hard) == 1


def test_missing_subcategory_zh_is_hard(tmp_path):
    f = _make_article_no_subcategory(tmp_path, "黃魚鴞：六公里溪流養一對", "Nature", lang_dir="zh-TW")
    target = load_target(f)
    violations = list(frontmatter_title.check(target, {}))
    sub_hard = [
        v for v in violations
        if v.severity == Severity.HARD and "subcategory" in v.message
    ]
    assert len(sub_hard) == 1


def test_about_category_subcategory_exempt(tmp_path):
    f = _make_article_no_subcategory(tmp_path, "About LagunaBeach.md", "About")
    target = load_target(f)
    violations = list(frontmatter_title.check(target, {}))
    sub_violations = [v for v in violations if "subcategory" in v.message]
    assert sub_violations == []


def test_present_subcategory_passes(tmp_path):
    d = tmp_path / "knowledge" / "Beaches"
    d.mkdir(parents=True)
    f = d / "test.md"
    f.write_text(
        "---\ntitle: 'Victoria Beach'\ndescription: 'desc'\nsubcategory: 'South Laguna'\n---\n\nbody.\n",
        encoding="utf-8",
    )
    target = load_target(f)
    violations = list(frontmatter_title.check(target, {}))
    sub_violations = [v for v in violations if "subcategory" in v.message]
    assert sub_violations == []
