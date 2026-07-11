"""Tests for article_health.loader.

Critical regression cases (taken from real bugs):

- Markdown link `)` MUST NOT get caught by punct conversion
  (2026-05-04 黃魚鴞 incident: 5 wikilinks in 延伸閱讀 broken when
   `[name](/url)` got converted to `[name](/url）`)
- Frontmatter is separated from body
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


def test_path_derives_en_source(tmp_path):
    # LB is English-default: knowledge/{Category}/{slug}.md is the en SSOT source.
    knowledge = tmp_path / "knowledge" / "Nature"
    knowledge.mkdir(parents=True)
    f = knowledge / "tawny-fish-owl.md"
    f.write_text("---\ntitle: x\n---\nbody\n", encoding="utf-8")
    target = load_target(f)
    assert target.lang == "en"
    assert target.category == "Nature"
    assert target.slug == "tawny-fish-owl"


def test_link_url_does_not_eat_across_newlines(tmp_path):
    """REGRESSION: malformed link `](/url）` (fullwidth ）) must not cause
    `[^)]+` to eat across newlines into the next link's `)`.

    2026-05-04 黃魚鴞 incident discovered this: 5 lines of content got
    swallowed into a single 'protected' region.
    """
    body = (
        "- [文章 A](/cat/x） — desc one\n"
        "- [文章 B](/cat/y) — desc two\n"
        "- [文章 C](/cat/z) — desc three\n"
    )
    f = _write_tmp(tmp_path, body)
    target = load_target(f)
    # Each protected region must NOT contain newlines
    for start, end, kind in target.protected_regions:
        if kind == "link-url":
            seg = target.body[start:end]
            assert "\n" not in seg, (
                f"link-url region eats newlines: {seg!r}"
            )


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


def test_body_line_numbers_match_original_file(tmp_path):
    """Regression: checks reported line numbers off-by-(frontmatter line count).
    Fix: loader pads body with blank lines equal to frontmatter span, so any
    line N in body corresponds to line N in the original file.
    """
    content = textwrap.dedent(
        """\
        ---
        title: 'test'
        description: 'test desc'
        date: 2026-05-04
        tags: ['x']
        category: Nature
        ---

        First content line — this is line 9 in the file.

        A second content line for offset checking.
        """
    )
    f = _write_tmp(tmp_path, content)
    target = load_target(f)
    # body must have leading blank lines so body's line 9 matches file's line 9
    body_lines = target.body.split("\n")
    assert body_lines[8] == "First content line — this is line 9 in the file."
    # The following line must also align: file line 11
    assert body_lines[10] == "A second content line for offset checking."
