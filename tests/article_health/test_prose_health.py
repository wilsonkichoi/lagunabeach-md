"""Tests for prose_health plugin (Phase 4 — quality-scan + manifesto-11 consolidation)."""

import textwrap
from pathlib import Path

import pytest

from lib.article_health import registry
from lib.article_health.checks import prose_health
from lib.article_health.loader import load_target
from lib.article_health.types import Severity


def _make_article(
    tmp_path: Path,
    body: str,
    title: str = "測試文章",
    category: str = "Nature",
    last_human_review: bool = True,
    extra_frontmatter: str = "",
) -> Path:
    fm = (
        f"title: '{title}'\n"
        f"description: '描述 2026 anchor 1000'\n"
        f"date: 2026-05-04\n"
        f"tags: ['test']\n"
        f"category: {category}\n"
        f"lastHumanReview: {'true' if last_human_review else 'false'}\n"
    ) + extra_frontmatter
    d = tmp_path / "knowledge" / category
    d.mkdir(parents=True, exist_ok=True)
    f = d / "test.md"
    f.write_text(f"---\n{fm}---\n\n{body}\n", encoding="utf-8")
    return f


def _check(tmp_path: Path, body: str, **kwargs) -> list:
    f = _make_article(tmp_path, body, **kwargs)
    target = load_target(f)
    return list(prose_health.check(target, {}))


def _score(violations) -> int:
    """Extract numeric score from the score-summary violation."""
    for v in violations:
        if v.fix_suggestion and v.fix_suggestion.isdigit():
            return int(v.fix_suggestion)
    return 0


# ════════════════════════════════════════════════════════════════════════
# Skip cases
# ════════════════════════════════════════════════════════════════════════


def test_short_file_skipped(tmp_path):
    """File < 20 lines is skipped (matches legacy quality-scan early-exit semantics)."""
    f = tmp_path / "knowledge" / "Nature" / "stub.md"
    f.parent.mkdir(parents=True)
    f.write_text("---\ntitle: x\n---\n\nshort content\n", encoding="utf-8")
    target = load_target(f)
    violations = list(prose_health.check(target, {}))
    assert violations == []


def test_no_frontmatter_skipped(tmp_path):
    f = tmp_path / "knowledge" / "Nature" / "x.md"
    f.parent.mkdir(parents=True)
    f.write_text("\n".join(["plain text"] * 30), encoding="utf-8")
    target = load_target(f)
    violations = list(prose_health.check(target, {}))
    assert violations == []


# ════════════════════════════════════════════════════════════════════════
# Quality-scan dimension parity
# ════════════════════════════════════════════════════════════════════════


def test_year_count_low_scores_3(tmp_path):
    body = "\n".join(["這是一段散文，沒有任何年份提及"] * 22)
    score = _score(_check(tmp_path, body))
    assert score >= 3  # 缺乏年份 = +3


def test_year_count_normal_low_score(tmp_path):
    body = textwrap.dedent(
        """\
        這篇文章在 1916 年出版，記錄了 1994 年的事件。
        2026 年我們重新看 1995 年的紀錄[^1]。
        2024 年開始有更新研究。

        ## H2

        散文段落一段
        散文段落二段
        散文段落三段
        散文段落四段

        ## H3

        散文1
        散文2
        散文3
        散文4
        散文5

        [^1]: [來源](https://example.com) — desc 足夠長
        """
    )
    score = _score(_check(tmp_path, body))
    # 4+ years → no year penalty; URL=1 → +1; fn=1 → no citation desert
    assert score < 3


def test_no_url_scores_3(tmp_path):
    body = "\n".join(["這是純散文段落 1916 年沒有任何 URL"] * 25)
    score = _score(_check(tmp_path, body))
    assert score >= 3  # 無URL = +3


def test_hollow_words_high_count(tmp_path):
    # ≥ 20 lines required (else early-exit). Need plenty of hollow density.
    body = (
        "這個產業蓬勃發展，逐步形成顯著的影響力，"
        "持續日益成長，全面深入大力推動。"
    )
    body_multi = "\n".join([body] * 25)  # 25 lines, ~75 hollow word hits
    body_multi += "\n\n散文 1916 年提及，1994 年確認[^1]。"
    body_multi += "\n\n[^1]: [src](https://e.com) — desc enough length"
    violations = _check(tmp_path, body_multi)
    score = _score(violations)
    # 75 hollow words is > 15 threshold → +3 score
    assert score >= 1, f"hollow words should trigger score, got {score}"


def test_plastic_phrase_detection(tmp_path):
    body = textwrap.dedent(
        """\
        台灣不僅是亞洲最重要的，更是全球科技中心。
        這展現了民主的精神，也體現了制度的決心。
        從南到北，從東到西，這座島嶼承載著無數的故事。
        台積電扮演著重要的角色，發揮著關鍵的作用。

        參考 https://example.com 提及 1986 年成立[^1]。

        ## H2 段落
        正文1
        正文2
        正文3
        正文4
        正文5

        [^1]: [Source](https://example.com) — long-enough description here
        """
    )
    body = body * 2
    violations = _check(tmp_path, body)
    score = _score(violations)
    # 4 plastic phrases × 2 = 8 → score +3 (3-4 range)
    assert score >= 2


def test_emdash_overuse(tmp_path):
    body = "這段——文字——有很多——破折號——濫用了——又一次——\n" * 5
    body += "\n".join(["正常一段散文 1916 年內容"] * 20)
    body += "\n\n[^1]: [src](https://e.com) — desc enough characters"
    score = _score(_check(tmp_path, body))
    # 6×5 = 30 em-dashes → +3 dash penalty
    assert score >= 3


def test_textbook_opening_scores_2(tmp_path):
    body = "台灣的半導體產業是亞洲重要的支柱。\n"
    body += "\n".join(["延伸內容 1916 年起步"] * 25)
    body += "\n\n[^1]: [src](https://e.com) — desc enough characters"
    score = _score(_check(tmp_path, body))
    assert score >= 2  # textbook opening = +2


def test_formulaic_ending_scores_2(tmp_path):
    body = "\n".join(["主文段落 1916 年內容"] * 22)
    body += "\n\n總之，這是一個值得我們深思的議題。"
    body += "\n\n[^1]: [src](https://e.com) — desc"
    score = _score(_check(tmp_path, body))
    assert score >= 2


def test_template_h2_count(tmp_path):
    body = textwrap.dedent(
        """\
        散文段落 1916 年起步引言

        ## 歷史背景

        段落

        ## 現況

        段落

        ## 未來展望

        段落

        ## 挑戰與展望

        段落
        """
    )
    body += "\n".join(["延伸 2024 年內容"] * 12)
    body += "\n\n[^1]: [src](https://e.com) — desc"
    score = _score(_check(tmp_path, body))
    assert score >= 3  # 4 template H2s = +3


def test_citation_desert_long_no_footnote(tmp_path):
    body = "\n".join(["長段散文 1916 年起點 2024 年現況"] * 50)
    score = _score(_check(tmp_path, body))
    # word count > 500, fn = 0, urls = 0 → +4 (extreme citation desert)
    assert score >= 4


def test_last_human_review_false_scores_1(tmp_path):
    body = textwrap.dedent(
        """\
        正常散文 1916 年內容 2024 年[^1]。

        ## 段落

        正文1
        正文2
        正文3

        [^1]: [Source](https://example.com) — desc enough chars
        """
    )
    body += "\n".join(["延伸"] * 15)
    score_with_review = _score(_check(tmp_path, body, last_human_review=True))
    score_without = _score(_check(tmp_path, body, last_human_review=False))
    assert score_without >= score_with_review + 1


# ════════════════════════════════════════════════════════════════════════
# Manifesto §11 tier checks
# ════════════════════════════════════════════════════════════════════════


def test_tier1_dual_pattern_detected(tmp_path):
    body = "這不是科技問題，而是制度問題。\n" * 5
    body += "\n".join(["延伸 1916 年"] * 20)
    body += "\n\n[^1]: [src](https://e.com) — desc"
    violations = _check(tmp_path, body)
    tier1 = [v for v in violations if "Tier 1" in (v.editorial_ref or "")]
    assert len(tier1) >= 5


# ── 2026-05-09 brave-kirch: bare antithesis 「不是 X，是 Y」 patterns ────────


def test_tier1_bare_antithesis_with_comma(tmp_path):
    """「不是 X，是 Y」(no 而是/也是/更是) should be detected."""
    body = "Taiwan.md 不是百科全書，是一座策展空間。\n" * 5
    body += "\n".join(["延伸 1916 年"] * 20)
    body += "\n\n[^1]: [src](https://e.com) — desc"
    violations = _check(tmp_path, body)
    tier1 = [v for v in violations if "Tier 1" in (v.editorial_ref or "")]
    assert len(tier1) >= 5, "bare antithesis 『不是 X，是 Y』should trigger"


def test_tier1_busheng_more_pattern(tmp_path):
    """「不只 X，更 Y」variant should be detected."""
    body = "他不只是歌手，更是文化符號。\n" * 5
    body += "\n".join(["延伸 1916 年"] * 20)
    body += "\n\n[^1]: [src](https://e.com) — desc"
    violations = _check(tmp_path, body)
    tier1 = [v for v in violations if "Tier 1" in (v.editorial_ref or "")]
    assert len(tier1) >= 5


def test_tier1_bingfei_pattern(tmp_path):
    """「並非 X，而是 Y」variant should be detected."""
    body = "這並非偶然事件，而是結構性問題。\n" * 5
    body += "\n".join(["延伸 1916 年"] * 20)
    body += "\n\n[^1]: [src](https://e.com) — desc"
    violations = _check(tmp_path, body)
    tier1 = [v for v in violations if "Tier 1" in (v.editorial_ref or "")]
    assert len(tier1) >= 5


def test_tier1_no_false_positive_normal_negation(tmp_path):
    """普通 negation 不應該被誤抓 — 「不是 X 是 Y」 inside long sentence shouldn't trigger."""
    # 「不是」+ 後續結構但沒形成對位句型（X > 30 字 / 不在「，是」附近）
    body = "他在那段時間裡到處奔走，不是為了個人利益而是想要解決一個更深層的社會問題，這個問題他關注超過十年。\n"
    body += "\n".join(["延伸 1916 年"] * 25)
    body += "\n\n[^1]: [src](https://e.com) — desc"
    violations = _check(tmp_path, body)
    tier1 = [v for v in violations if "Tier 1" in (v.editorial_ref or "")]
    # 應該抓到「不是.{0,8}而是」(short distance)
    assert len(tier1) <= 2, f"long-X scenarios shouldn't over-trigger, got {len(tier1)}"


def test_tier1_docs_canonical_no_frontmatter_still_checked(tmp_path):
    """docs/ canonical files (no frontmatter) should still trigger prose-health.

    2026-05-09 brave-kirch: 原本 plugin `if not target.frontmatter: return`
    讓 EDITORIAL.md 自己漏抓 16+ 處對位句型。Fix: only skip if knowledge/ article.
    """
    # Simulate a docs/ canonical file (no frontmatter, but rich content)
    docs_dir = tmp_path / "docs" / "editorial"
    docs_dir.mkdir(parents=True)
    f = docs_dir / "TEST-CANONICAL.md"
    body = "# TEST CANONICAL\n\n"
    body += "這不是檢查清單，是一個會寫好文章的眼睛。\n" * 6
    body += "\n".join(["延伸 1916 年"] * 20)
    f.write_text(body, encoding="utf-8")
    target = load_target(f)
    assert not target.frontmatter, "test file should have no frontmatter"
    violations = list(prose_health.check(target, {}))
    tier1 = [v for v in violations if "Tier 1" in (v.editorial_ref or "")]
    assert len(tier1) >= 3, "docs/ canonical without frontmatter should still be checked"


def test_tier2_metaphor_density(tmp_path):
    body = "這篇文章的軌跡承載著 DNA，鏡子般的張力，光譜的縮影。\n"
    body += "\n".join(["散文 1916 年"] * 22)
    body += "\n\n[^1]: [src](https://e.com) — desc"
    violations = _check(tmp_path, body)
    tier2 = [v for v in violations if "Tier 2" in (v.editorial_ref or "")]
    assert len(tier2) == 1
    # Should be ≥ 5 metaphor occurrences (test phrase has 軌跡 / 承載著 / DNA /
    # 鏡子 / 張力 / 光譜 / 縮影 = 7 distinct words)
    import re
    m = re.search(r"累計 (\d+) 處", tier2[0].message)
    assert m and int(m.group(1)) >= 5, tier2[0].message


def test_tier3_ritual_phrases(tmp_path):
    body = "在這個意義上，這個議題不容忽視，值得我們深思。\n"
    body += "\n".join(["散文 1916 年"] * 22)
    body += "\n\n[^1]: [src](https://e.com) — desc"
    violations = _check(tmp_path, body)
    tier3 = [v for v in violations if "Tier 3" in (v.editorial_ref or "")]
    assert len(tier3) == 1


# ════════════════════════════════════════════════════════════════════════
# Phase 4b dims: LIST-DUMP / THIN / QUALITY-DECAY
# ════════════════════════════════════════════════════════════════════════


def test_list_dump_back_half_bullet_heavy(tmp_path):
    """Back half bullet ratio > 40% AND > 2x front → +3 score."""
    front = "\n".join([
        "這是 1916 年的一段散文敘述",
        "1994 年另一段研究發現",
        "2024 年最近的紀錄",
        "更多的散文敘述",
    ] * 4)  # 16 lines, 0 bullets
    back = "\n".join([
        "- bullet item 1",
        "- bullet item 2",
        "- bullet item 3",
        "- bullet item 4",
    ] * 4)  # 16 lines, 100% bullets
    body = front + "\n\n" + back
    body += "\n\n[^1]: [src](https://e.com) — desc enough chars"
    score = _score(_check(tmp_path, body))
    assert score >= 2, f"LIST-DUMP should add ≥ +2 score, got {score}"


def test_thin_blocks_detected(tmp_path):
    body = textwrap.dedent(
        """\
        > **30 秒概覽**: x

        ## 段落一

        只有一行散文 1916 年。

        ## 段落二

        只有一行散文 1994 年。

        ## 段落三

        只有一行散文 2024 年。

        [^1]: [src](https://e.com) — desc enough chars
        """
    ) + "\n".join(["延伸"] * 8)
    score = _score(_check(tmp_path, body))
    # 3 thin blocks → at minimum +1 score on top of other dims
    assert score >= 2


def test_thin_blocks_exempt_structural_sections(tmp_path):
    """Regression: 2026-05-04 audit found 黃魚鴞 falsely flagged as thin
    because `## 圖片來源` (image attribution section, 1 line by design) was
    counted. Structural sections (參考資料 / 延伸閱讀 / 圖片來源) are
    exempted from the THIN check.
    """
    # 3 healthy prose H2s + a 1-line 圖片來源 + a 1-line 參考資料.
    # Without the exemption the structural sections would fire 2 thin counts.
    body = textwrap.dedent(
        """\
        > **30 秒概覽**: x

        ## 段落一

        散文一行。
        散文兩行。
        散文三行。

        ## 段落二

        散文一行。
        散文兩行。
        散文三行。

        ## 段落三

        散文一行。
        散文兩行。
        散文三行。

        ## 圖片來源

        本文使用 1 張 CC 授權圖片。

        ## 參考資料

        [^1]: [src](https://example.com) — description with enough characters
        """
    )
    # Pad to clear the < 20 line short-file early-exit
    body += "\n" + "\n".join(f"延伸{i}" for i in range(20))
    from lib.article_health.checks import prose_health
    body_thin = prose_health._count_thin_blocks(body)
    assert body_thin == 0, (
        f"Expected 0 thin blocks (圖片來源 / 參考資料 should be exempt), "
        f"got {body_thin}"
    )


# ════════════════════════════════════════════════════════════════════════
# Score budget
# ════════════════════════════════════════════════════════════════════════


def test_clean_article_passes_budget(tmp_path):
    body = textwrap.dedent(
        """\
        1994 年的某一天，研究員在花蓮太魯閣的溪畔找到了一個巢[^1]。
        2026 年 4 月，研究團隊在武陵的烏心石老樹洞裡找到全台最高巢位[^2]。
        2024 年最新統計顯示族群在易危等級之間波動[^3]。

        ## 砂卡礑那年

        三十年前的研究是現在所有後續定位的起點。
        孫元勳教授團隊持續追蹤了 91 個領域。
        每對黃魚鴞需要 6.2 公里溪流維持領域。
        天然林比例 44.6% 是維持族群的關鍵變數。

        ## 武陵的新發現

        最新的紀錄改寫了高度上限。
        1,800 公尺的烏心石樹洞是台灣最高巢位。
        雪霸國家公園推出 24 小時育雛直播。

        [^1]: [Sun et al. 1997](https://example.com) — 砂卡礑首次定位巢位完整紀錄
        [^2]: [公視 2026](https://example.com) — 武陵最高巢位記錄
        [^3]: [紅皮書 2024](https://example.com) — 易危等級評估報告
        """
    )
    score = _score(_check(tmp_path, body))
    # Clean article should be ≤ 3 (canonical pass threshold)
    assert score <= 3, f"clean article scored {score}, should be ≤ 3"


# ════════════════════════════════════════════════════════════════════════
# §盼望而不粉飾 (2026-06-15): 島嶼自稱密度 / PUA 體 / 媒體焦慮體
# ════════════════════════════════════════════════════════════════════════


def _hope(violations, key):
    return [v for v in violations if key in (v.message or "")]


def test_island_euphemism_overuse_detected(tmp_path):
    """島嶼自稱密度 ≥ 3 觸發 WARN。"""
    body = "這座島嶼歷史很長。這座島曾被殖民。這個島嶼的人努力生活。\n" * 2
    body += "\n".join(["延伸 1916 年 1994 年 2024 年內容"] * 20)
    body += "\n\n[^1]: [src](https://e.com) — desc enough chars"
    island = _hope(_check(tmp_path, body), "島嶼自稱密度")
    assert len(island) >= 3, "島嶼自稱密度 ≥ 3 應觸發 WARN"


def test_island_literary_single_use_not_flagged(tmp_path):
    """單次島嶼文學用法 + 多次直稱台灣 → 不 WARN (balance, not ban)。"""
    body = textwrap.dedent(
        """\
        台灣在 1949 年後快速工業化[^1]。
        台灣的半導體 2024 年領先全球。
        這座島嶼曾被低估，但台灣人持續前進。
        台灣的民主在 1996 年首次直選。

        ## 段落

        台灣社會多元包容。
        台灣經濟韌性十足。
        台灣文化層次豐富。

        [^1]: [src](https://e.com) — desc enough chars
        """
    )
    body += "\n".join(["台灣延伸 2020 年"] * 8)
    island = _hope(_check(tmp_path, body), "島嶼自稱密度")
    assert island == [], f"單次島嶼 + 多次台灣不該 WARN，got {len(island)}"


def test_pua_body_detected(tmp_path):
    body = "如果你還不知道這段歷史，你就沒資格說自己愛台灣。我們都欠他一個道歉。\n"
    body += "\n".join(["延伸 1916 年 1994 年 2024 年"] * 22)
    body += "\n\n[^1]: [src](https://e.com) — desc enough chars"
    pua = _hope(_check(tmp_path, body), "PUA 體")
    assert len(pua) >= 2, f"PUA 句法應觸發，got {len(pua)}"


def test_pua_no_false_positive_neutral(tmp_path):
    """中性用法不該誤報：有資格參賽 / 沒有人知道(敘事)。"""
    body = textwrap.dedent(
        """\
        他 1994 年取得參賽資格，當時沒有人知道這會改變台灣體壇[^1]。
        他有資格代表台灣出國比賽，2024 年拿下金牌。
        台灣的運動員 1986 年就開始接受系統訓練。

        ## 段落

        台灣體育發展史很長。
        基層訓練長年耕耘。
        國際賽事屢創佳績。

        [^1]: [src](https://e.com) — desc enough chars
        """
    )
    body += "\n".join(["台灣延伸 2020 年"] * 8)
    pua = _hope(_check(tmp_path, body), "PUA 體")
    assert pua == [], f"中性敘事不該被當 PUA，got {[v.snippet for v in pua]}"


def test_media_anxiety_detected(tmp_path):
    body = "你不知道的五個真相。台灣記憶正在快速消失。再不關注就來不及了。\n"
    body += "\n".join(["延伸 1916 年 1994 年 2024 年"] * 22)
    body += "\n\n[^1]: [src](https://e.com) — desc enough chars"
    anx = _hope(_check(tmp_path, body), "媒體焦慮體")
    assert len(anx) >= 2, f"媒體焦慮句法應觸發，got {len(anx)}"


def test_media_anxiety_no_false_positive_neutral_disappear(tmp_path):
    """中性「正在消失」(無 intensifier) 不該誤報成焦慮框架。"""
    body = textwrap.dedent(
        """\
        台語正在消失，這是 1994 年以來語言學界的觀察[^1]。
        2024 年調查顯示年輕世代使用率下降。
        台灣推動本土語言復振 2026 年見成效。

        ## 段落

        母語教育納入課綱。
        社區開設台語課程。
        媒體增加台語節目。

        [^1]: [src](https://e.com) — desc enough chars
        """
    )
    body += "\n".join(["台灣延伸 2020 年"] * 8)
    anx = _hope(_check(tmp_path, body), "媒體焦慮體")
    assert anx == [], f"中性『正在消失』不該誤報，got {[v.snippet for v in anx]}"


def test_hope_checks_are_warn_not_score(tmp_path):
    """島嶼/PUA/焦慮 是 WARN 級，不計入 score budget（跟 §11 tier 一致）。"""
    # crutch body：5 島 + 0 直稱台灣 → 觸發島嶼 WARN；但 prose 乾淨 → score ≤ 3。
    body = textwrap.dedent(
        """\
        這座島嶼在 1994 年迎來轉變[^1]。這座島經歷殖民。這座島曾被遺忘。這個島嶼站起來。這座島嶼記得 1986 年。
        2026 年研究確認[^2]。2024 年最新統計[^3]。

        ## 段落一

        歷史延伸內容 2020 年發展演進。
        基層力量長年累積成形。
        公民參與日趨成熟穩定。

        [^1]: [a](https://e.com) — 描述足夠長度的來源說明文字
        [^2]: [b](https://e.com) — 描述足夠長度的來源說明文字
        [^3]: [c](https://e.com) — 描述足夠長度的來源說明文字
        """
    )
    body += "\n".join(["歷史延伸內容 2020 年"] * 10)
    violations = _check(tmp_path, body)
    island = _hope(violations, "島嶼自稱密度")
    assert len(island) >= 3, "crutch (5 島 / 0 台灣) should fire island WARN"
    assert _score(violations) <= 3, f"island WARN 不該推高 score，got {_score(violations)}"


# ════════════════════════════════════════════════════════════════════════
# Plugin metadata
# ════════════════════════════════════════════════════════════════════════


def test_plugin_metadata():
    assert prose_health.CHECK_NAME == "prose-health"
    assert prose_health.DEFAULT_SEVERITY == Severity.WARN
    assert "MANIFESTO" in prose_health.EDITORIAL_REF
    assert "zh-TW" in prose_health.APPLIES_TO
    assert callable(prose_health.check)


def test_plugin_registered():
    registry.reset_registry()
    found = registry.discover_checks()
    assert "prose-health" in found, list(found.keys())
