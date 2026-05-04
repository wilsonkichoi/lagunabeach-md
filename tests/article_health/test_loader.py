"""Tests for article_health.loader.

Critical regression cases (taken from real bugs):

- Markdown link `)` MUST NOT get caught by punct conversion
  (2026-05-04 黃魚鴞 incident: 5 wikilinks in 延伸閱讀 broken when
   `[name](/url)` got converted to `[name](/url）`)
- Frontmatter is separated from body
- Section detection for 延伸閱讀 / 參考資料 / 圖片來源
"""

import textwrap
from pathlib import Path

from lib.article_health.loader import load_target


def _write_tmp(tmp_path: Path, content: str, name: str = "test.md") -> Path:
    f = tmp_path / name
    f.write_text(content, encoding="utf-8")
    return f


def test_frontmatter_separated_from_body(tmp_path):
    f = _write_tmp(
        tmp_path,
        textwrap.dedent(
            """\
            ---
            title: '黃魚鴞'
            category: Nature
            ---

            內文第一段。
            """
        ),
    )
    target = load_target(f)
    assert target.frontmatter.get("title") == "黃魚鴞"
    assert target.frontmatter.get("category") == "Nature"
    assert "title:" not in target.body
    assert "內文第一段" in target.body


def test_no_frontmatter(tmp_path):
    f = _write_tmp(tmp_path, "# 沒有 frontmatter\n\n內文。\n")
    target = load_target(f)
    assert target.frontmatter == {}
    assert target.body == target.text


def test_path_derives_zh_tw(tmp_path):
    knowledge = tmp_path / "knowledge" / "Nature"
    knowledge.mkdir(parents=True)
    f = knowledge / "黃魚鴞.md"
    f.write_text("---\ntitle: x\n---\nbody\n", encoding="utf-8")
    target = load_target(f)
    assert target.lang == "zh-TW"
    assert target.category == "Nature"
    assert target.slug == "黃魚鴞"


def test_path_derives_translation(tmp_path):
    knowledge = tmp_path / "knowledge" / "en" / "Nature"
    knowledge.mkdir(parents=True)
    f = knowledge / "tawny-fish-owl.md"
    f.write_text("---\ntitle: x\n---\nbody\n", encoding="utf-8")
    target = load_target(f)
    assert target.lang == "en"
    assert target.category == "Nature"
    assert target.slug == "tawny-fish-owl"
    assert target.is_translation


def test_protected_regions_includes_md_link_url(tmp_path):
    """CRITICAL — regression test for 黃魚鴞 wikilink incident.

    The half-width `)` closing a markdown link URL must be inside a
    protected region so punctuation rules don't touch it.
    """
    f = _write_tmp(
        tmp_path,
        "- [福爾摩沙鳥類學](/nature/福爾摩沙鳥類學) — 黃魚鴞 1916 年才被命名\n",
    )
    target = load_target(f)
    # Find the link URL
    body = target.body
    url_start = body.index("](/nature")
    url_end = body.index(")", url_start) + 1  # +1 to include the )
    # Assert this exact range is protected
    matched = any(
        s <= url_start and e >= url_end and kind == "link-url"
        for s, e, kind in target.protected_regions
    )
    assert matched, (
        f"link URL `]({body[url_start+1:url_end]}` not protected: "
        f"regions={target.protected_regions}"
    )


def test_protected_regions_includes_fenced_code(tmp_path):
    f = _write_tmp(
        tmp_path,
        "前文\n```python\ncode,with,commas\n```\n後文\n",
    )
    target = load_target(f)
    has_fence = any(kind == "fenced-code" for _, _, kind in target.protected_regions)
    assert has_fence


def test_protected_regions_includes_inline_code(tmp_path):
    f = _write_tmp(tmp_path, "前文 `code,with,comma` 後文\n")
    target = load_target(f)
    has_inline = any(kind == "inline-code" for _, _, kind in target.protected_regions)
    assert has_inline


def test_body_without_protected_blanks_regions(tmp_path):
    """body_without_protected() preserves char positions but blanks protected."""
    f = _write_tmp(
        tmp_path,
        "abc [link](/foo) xyz\n",
    )
    target = load_target(f)
    out = target.body_without_protected()
    # `](url)` segment becomes blanks; abc/xyz stay intact
    assert "abc" in out
    assert "xyz" in out
    assert "/foo" not in out  # blanked
    assert len(out) == len(target.body)  # length preserved


def test_section_detection_further_reading(tmp_path):
    """Detect 延伸閱讀 section so plugins can exempt or treat specially."""
    f = _write_tmp(
        tmp_path,
        textwrap.dedent(
            """\
            前文段落。

            **延伸閱讀**：

            - [文章 A](/cat/a) — 描述
            - [文章 B](/cat/b) — 描述

            ## 參考資料

            [^1]: [來源](https://example.com) — 描述足以辨識
            """
        ),
    )
    target = load_target(f)
    assert "further-reading" in target.sections
    assert "references" in target.sections
    fr_start, fr_end = target.sections["further-reading"]
    fr_slice = target.body[fr_start:fr_end]
    assert "延伸閱讀" in fr_slice
    assert "文章 A" in fr_slice
    # Should end before 參考資料 starts
    assert "參考資料" not in fr_slice


def test_section_detection_image_sources(tmp_path):
    f = _write_tmp(
        tmp_path,
        textwrap.dedent(
            """\
            正文。

            ## 圖片來源

            本文使用 1 張 CC 授權圖片：
            - [圖片名](https://example.com)

            ## 參考資料
            """
        ),
    )
    target = load_target(f)
    assert "image-sources" in target.sections
    img_start, img_end = target.sections["image-sources"]
    assert "圖片來源" in target.body[img_start:img_end]


def test_section_detection_no_sections(tmp_path):
    f = _write_tmp(tmp_path, "純內文，沒有 section markers。\n")
    target = load_target(f)
    assert target.sections == {}
