r"""spore_writing — SPORE-specific writing rules instrumentation.

Direction D from reports/spore-pipeline-evolution-plan-2026-05-08.md:
    Upgrades SPORE-WRITING.md prose rules from "reminder + trust AI self-discipline"
    to plugin gate (REFLEXES #15: memory is self-discipline, pipeline is the gate).

Rules implemented (regex-only, Wave 1 + Wave 2):
  Wave 1 (initial ship 2026-05-08):
  - Chronicle lead (Rule #15): first prose line shouldn't start with a date
    (news lead style). Triggers on `^\d{4}\s*年` or `^\d{4}\.`
  - Quote inversion (Rule #9): `「XXX」他說` style (scene-less quote inversion)
    should become `He said at [scene]: 'XXX'`

  Wave 2 (evolve 2026-05-08, validated from spore performance data):
  - Friend tone prime (Rule #14): first prose line must have friend-tone prefix
    or satisfy Tier 1b "concrete anchor + contrast hook" opening.
    Trigger: first line has no prefix + not a quote + not a concrete scene -> WARN.
    Skip: blueprint table (already covered) / harvest log meta (covered).

APPLIES_TO design:
  Path must be in docs/factory/SPORE-BLUEPRINTS/ or docs/factory/SPORE-HARVESTS/.
  Other articles can legitimately start with dates (timeline D-template), so this
  rule is not universally applicable.

Future extensions (deferred):
  - Rule #16 Scene-List-Scene structure (needs LLM-as-judge, not pure regex)
  - Rule #8 same-name repeated >=3 (token analysis, needs CJK tokenizer)
  - Reach x accuracy retroactive trigger (out of plugin scope, SPORE-VERIFY doc-level SOP)

Canonical:
  - docs/factory/SPORE-WRITING.md §進階寫作技術
  - docs/factory/SPORE-VERIFY.md §§11 書寫節制閘
"""

from __future__ import annotations
import re
from typing import Any, Iterator

from ..types import FileTarget, Severity, Violation


CHECK_NAME = "spore-writing"
DIMENSION = "spore-prose"
DEFAULT_SEVERITY = Severity.HARD
EDITORIAL_REF = "SPORE-WRITING.md §進階寫作技術"
APPLIES_TO = ["zh-TW"]  # spores are primarily Chinese prose


# ── Rule #15: Chronicle lead ────────────────────────────────────────────────
# First line should not start with "YYYY 年" / "YYYY.MM.DD" news lead style
_RE_CHRONICLE_LEAD = re.compile(
    r"^\s*(?:\d{4}\s*年|\d{4}[/.\-]\d{1,2}[/.\-]\d{1,2}|\d{4}-\d{2}-\d{2})",
    re.MULTILINE,
)

# ── Rule #9: Quote inversion ────────────────────────────────────────────────
# Matches「XXX」他說 / 她說 pattern (scene-less quote inversion)
# Should become: He left a line at [scene]: 'XXX'
_RE_QUOTE_INVERSION = re.compile(
    r"「[^」]{5,80}」[^\n。]{0,8}[他她][^\n。]{0,5}說",
)


# ── Rule #14: Friend-tone curiosity prime ───────────────────────────────────
# v2 (2026-05-28): WARN -> HARD severity inversion. Triggered by 3 consecutive
# spore drift incidents (#97/#101/#103) where friend-tone voice was lost.
# Diagnosis: CONTRACT v1.0 over-engineering -> plugin severity too weak + scope too narrow.
#
# Spore first line must have a "friend telling you gossip" curiosity prime, not
# news lead. Implements MANIFESTO "like introducing Taiwan to a friend" philosophy.
#
# Qualifying prefixes (friendly opening):
#   1. 「你知道嗎？」/「你知道嗎，」 (strongly recommended + emoji)
#   2. 「欸，」/「欸你」+ concrete event fragment
#   3. 「身為台灣人」/「想像」/「如果」/「當你」 second-person opening
#   4. Direct quote opening (「『...』」 — strong enough hook)
#   5. Pure emoji opening
#
# v2 upgrade: trigger changed from "news lead AND no prefix" to "no prefix -> HARD"
# (unless publicletter F-family / E-thread family / hook_tier=N/A exempt).
# No longer depends on looks_like_news_lead — scene immersion / second-person doesn't
# count as "equivalent prime"; must be literal prefix to pass gate.
_RE_FRIEND_PREFIX = re.compile(
    r"^\s*(?:你知道嗎[？，?,]|欸[，,]|欸你|身為台灣人|想像[一下你]|"
    r"如果(?:[你台]|[\d])|當[你你們]|"
    r"[「『\"]|[\U0001F300-\U0001F9FF\U0001F600-\U0001F64F])"
)
# Family scope detection — publicletter / E-thread / non-viral 不適用 friend-tone gate
_RE_PUBLICLETTER_FAMILY = re.compile(
    r"^(?:template:\s*F[-\s]|type:\s*station-announcement|hook_tier:\s*N/A)",
    re.MULTILINE,
)


def _is_publicletter_family(text: str) -> bool:
    """Detect F-publicletter / E-thread / non-viral family via frontmatter.

    Used to scope Rule #14 — friend-tone prime is only required for viral
    family (A/B/C/D templates). F-publicletter uses professor tone, not
    friend tone. E-thread may have different prime convention.
    """
    return bool(_RE_PUBLICLETTER_FAMILY.search(text[:2000]))


# News lead pattern (legacy from v1, retained as INFO-only diagnostic — not the
# HARD trigger in v2): catches "institution + verb" objective narrative opening
_RE_NEWS_LEAD = re.compile(
    r"^\s*[一-鿿]{2,8}(?:宣布|表示|簽下|公布|成立|頒布|通過|裁決|"
    r"發表|主張|強調|指出|呼籲|批評|證實|否認|聲明|警告)"
)


def _is_spore_path(path: str) -> bool:
    """Check if file is a SPORE blueprint, harvest log, or ad-hoc draft.

    Path conventions:
      - docs/factory/SPORE-BLUEPRINTS/ (production blueprints)
      - docs/factory/SPORE-HARVESTS/ (production harvest logs)
      - /tmp/spore-* (ad-hoc draft testing — any tmp file with `spore-` prefix)
      - /tmp/...spore... (other ad-hoc paths containing "spore")
    """
    p_lower = str(path).lower()
    return (
        "SPORE-BLUEPRINTS" in path
        or "SPORE-HARVESTS" in path
        or "/spore-" in p_lower  # /tmp/spore-anything.md
        or p_lower.startswith("spore-")
        or p_lower.endswith("/spore.md")
    )


_RE_NUMBERED_LIST = re.compile(r"^\s*\d+\.\s")  # `1. `, `2. ` ordered list items


def _strip_frontmatter_and_meta(text: str) -> tuple[str, int]:
    """Return (body_text, body_start_line).

    v2 (2026-05-28): fixed false-positive where Rule #14 mistakenly treated
    numbered list (self-check questions) as spore body first line. Real spore
    body lives inside ``` ``` code fence (per blueprint convention).
    Strategy: find first ``` fence start, take first line from inside fence.
    Fallback: no fence found -> use v1 strip logic (skip headings/blockquotes/
    tables/bullets/bold-meta/numbered-lists).

    Strips frontmatter (--- ... ---) and tries to locate the actual spore body:
      Priority A: first ``` ``` code fence content (production blueprint convention)
      Priority B: strip leading meta lines (legacy fallback for ad-hoc drafts)
    """
    lines = text.split("\n")
    i = 0
    # Skip frontmatter
    if i < len(lines) and lines[i].strip() == "---":
        i += 1
        while i < len(lines) and lines[i].strip() != "---":
            i += 1
        if i < len(lines):
            i += 1  # skip closing ---

    # Priority A: locate the spore body code fence content via proper open/close
    # state machine (v2 2026-05-28 fix bug — previous version treated fence-close
    # as new fence-open, picking up bogus content like "## 配圖" heading after a
    # closed fence).
    candidate_fences: list[tuple[int, str]] = []  # (line_idx, first_prose_line)
    in_fence = False
    k = i
    while k < len(lines):
        if lines[k].strip().startswith("```"):
            if in_fence:
                in_fence = False  # closing
            else:
                in_fence = True  # opening — capture first prose line
                j = k + 1
                while j < len(lines) and not lines[j].strip():
                    j += 1
                if j < len(lines) and not lines[j].strip().startswith("```"):
                    candidate_fences.append((j, lines[j].strip()))
        k += 1

    # Filter: real spore body has CJK char + length ≥ 50 + no URL signal in line.
    # URL signals (`https://`, `👉`, `完整故事`) indicate self-reply / inline URL
    # meta fence (e.g. #59 黃魚鴞 / #93 國家人權博物館 first fence is self-reply
    # URL not the body). Skip these → pick next body fence.
    def _is_real_body_fence(content: str) -> bool:
        # Threshold 5: friend prefix line can be very short
        # (e.g. #93 國家人權「你知道嗎？🧬」6 chars on its own line, real spore
        # body continues after blank). URL-only / meta fences filtered by other
        # rules below — `#` markdown comment / `http` URL / 「完整故事」CTA /
        # 「👉」emoji marker. Earlier 30+ threshold was too strict (rejected
        # short hook lines), 5 catches all real body openers.
        if len(content) < 5:
            return False
        if content.startswith("#") or content.startswith("http"):
            return False
        # URL-bearing line = self-reply / inline link meta, not body
        if "https://" in content or "http://" in content:
            return False
        # 「👉 完整故事」style CTA prefix = self-reply
        if "👉" in content or content.startswith("完整故事"):
            return False
        return bool(re.search(r"[一-鿿]", content))

    body_fences = [(idx, c) for idx, c in candidate_fences if _is_real_body_fence(c)]
    if body_fences:
        # Use first qualifying fence (production spore = first body fence)
        body_line_idx = body_fences[0][0]
        return ("\n".join(lines[body_line_idx:]), body_line_idx)

    # Priority B: legacy strip fallback — used only for ad-hoc / planning-stage
    # blueprints (e.g. early #33 草東 v2.1 era no fence yet). Rule #14 caller
    # will see the legacy-strip first line; planning-stage blueprints whose
    # body isn't yet written may yield false-positive HARD — acceptable per
    # 「未 finalize 的 blueprint 本就該被閘攔」principle (forces writer to put
    # body in fence convention before plugin pass).
    while i < len(lines) and (
        not lines[i].strip()
        or lines[i].strip().startswith("#")
        or lines[i].strip().startswith(">")
        or lines[i].strip().startswith("|")  # blueprint table rows
        or lines[i].strip().startswith("- ")  # bullet
        or lines[i].strip().startswith("**")  # bold inline meta like **Angle**: ...
        or bool(_RE_NUMBERED_LIST.match(lines[i]))  # ordered list `1. `
    ):
        i += 1
    return ("\n".join(lines[i:]), i)


def check(target: FileTarget, config: dict[str, Any]) -> Iterator[Violation]:
    """Run SPORE-WRITING-specific regex checks.

    Skipped when file is not in SPORE-BLUEPRINTS / SPORE-HARVESTS path
    (returning early so normal articles don't false-trigger Rule #15 timeline templates).
    """
    if not _is_spore_path(str(target.path)):
        return

    body_text, body_start = _strip_frontmatter_and_meta(target.text)

    # ── Rule #15: Chronicle lead ──
    # Only the very first prose line is checked — mid-body dates are fine
    first_line = body_text.split("\n", 1)[0] if body_text else ""
    if first_line and _RE_CHRONICLE_LEAD.match(first_line):
        yield Violation(
            check=CHECK_NAME,
            severity=Severity.HARD,
            message=(
                "編年體 lead 病 (Rule #15): "
                "第一行不該是日期開頭，改用人物動作 / 引語"
            ),
            line=body_start + 1,
            snippet=first_line[:80],
            editorial_ref="SPORE-WRITING.md §避免編年體 lead 病",
            fix_suggestion=(
                "改成「[人物] 在 [場景] 說：『[引語]』」或「[人物] 做了 [動作]」開頭"
            ),
        )

    # ── Rule #9: Quote inversion ──
    for m in _RE_QUOTE_INVERSION.finditer(body_text):
        # Compute approximate line number (offset from body_start)
        prefix = body_text[: m.start()]
        line_offset = prefix.count("\n")
        yield Violation(
            check=CHECK_NAME,
            severity=Severity.WARN,
            message=(
                "引語倒裝 (Rule #9): "
                "改為「他在 [場景] 留了一句話：『XXX』」給讀者場景感"
            ),
            line=body_start + line_offset + 1,
            snippet=m.group(0)[:80],
            editorial_ref="SPORE-WRITING.md §禁止清單",
        )

    # ── Rule #14 v2: Friend tone prime — HARD gate ──
    # v2 (2026-05-28) inversion: WARN -> HARD + removed looks_like_news_lead dependency.
    # Scene immersion / second-person / casual feel don't count as "equivalent prime".
    # Scope: viral family only (F-publicletter / E-thread / hook_tier=N/A exempt).
    is_publicletter = _is_publicletter_family(target.text)
    has_friend_prefix = bool(_RE_FRIEND_PREFIX.match(first_line)) if first_line else False
    if (
        first_line
        and len(first_line) >= 8
        and not is_publicletter
    ):
        if not has_friend_prefix:
            looks_like_news_lead = bool(_RE_NEWS_LEAD.match(first_line))
            extra_hint = (
                "（且開場像新聞 lead）" if looks_like_news_lead else ""
            )
            yield Violation(
                check=CHECK_NAME,
                severity=Severity.HARD,  # v2: WARN → HARD
                message=(
                    f"朋友 tone prime 缺失 (Rule #14 v2 HARD){extra_hint}: "
                    "viral spore 第一行必須有友善開場 prefix —「你知道嗎？」/"
                    "「欸，」/「身為台灣人」/「想像」/「當你」/「『引語』」/"
                    "emoji 之一。場景代入 / 第二人稱化不算等效 prime。"
                ),
                line=body_start + 1,
                snippet=first_line[:80],
                editorial_ref=(
                    "SPORE-WRITING.md §朋友 tone prime + MANIFESTO §我怎麼說話"
                ),
                fix_suggestion=(
                    "改第一行：「你知道嗎？{emoji} {反差 hook}」"
                    "或「欸，{具體事件}」"
                    "或直接引語「『XXX』{說話者} 在 {場景} 留下這句」開場。"
                    "若本 spore 屬 F-公開信 / E-thread / 非 viral family，"
                    "frontmatter 加 `template: F-...` 或 `hook_tier: N/A` exempt。"
                ),
            )

    # ── Rule #14.A v3: Standalone hook line — WARN gate ──
    # v3 (2026-05-28): canonical spore format requires hook as standalone first line
    # (<=15 chars) + blank line + story paragraph. Inline hook (hook + story content
    # on one line) doesn't block ship but surfaces drift signal — visual breathing +
    # thumb-scroll pause + emoji anchor all get diluted.
    #
    # Trigger condition (WARN):
    #   has_friend_prefix=True AND
    #   first_line length > 15 chars (inline with story content)
    #   AND not publicletter family
    if has_friend_prefix and not is_publicletter and first_line:
        first_line_len = len(first_line)
        if first_line_len > 15:
            yield Violation(
                check=CHECK_NAME,
                severity=Severity.WARN,
                message=(
                    f"Hook 未獨立第一行 (Rule #14.A v3 WARN): "
                    f"first_line={first_line_len} chars inline 與故事段落混在一起，"
                    "標準格式「你知道嗎？{emoji}」獨立短行 (≤15 chars) + 空白行 + 故事段落"
                ),
                line=body_start + 1,
                snippet=first_line[:60],
                editorial_ref="SPORE-WRITING.md §標準孢子格式",
                fix_suggestion=(
                    "拆「你知道嗎？{emoji}」獨立第一行 + 空白行 + 故事段落 1 開頭。"
                    "視覺呼吸 + thumb-scroll 停留 + emoji 錨點都需要 hook 獨立成行。"
                    "若極短 spore (<200 chars 主貼) 或觀察者拍板 inline，可接受 WARN。"
                ),
            )

    # ── Rule #14.B v3: Paragraph block count — WARN gate ──
    # Standard spore format has 4-7 paragraphs (hook standalone + 3-5 story + optional URL).
    # < 4 = monolithic prose (collapsed state); > 6 = staccato pattern (Twitter thread
    # style, not narrative paragraphs).
    #
    # Scope: viral family only. F-publicletter / E-thread frontmatter signal exempt.
    if not is_publicletter and body_text.strip():
        paragraphs = [
            p.strip() for p in body_text.split("\n\n") if p.strip()
        ]
        para_count = len(paragraphs)
        # Short spore (main post < 200 chars) can have 3 paragraphs; standard 4-7
        body_total_len = sum(len(p) for p in paragraphs)
        min_para = 3 if body_total_len < 200 else 4
        if para_count < min_para:
            yield Violation(
                check=CHECK_NAME,
                severity=Severity.WARN,
                message=(
                    f"段落呼吸不足 (Rule #14.B v3 WARN): "
                    f"only {para_count} paragraph blocks (body_total={body_total_len} chars), "
                    f"標準 spore 4-5 段呼吸 (hook standalone + 3-5 story + optional URL)。"
                ),
                line=body_start + 1,
                snippet=body_text[:80].replace("\n", "⏎"),
                editorial_ref="SPORE-WRITING.md §標準孢子格式",
                fix_suggestion=(
                    "拆 monolithic prose 成 4-5 paragraph：時間軸 cut 處切段 + "
                    "場景轉換處切段 + 引語前後切段。"
                    "對應 SOCIAL-POSTING-PIPELINE pre-ship check 7 (compose block ≥ 4)。"
                ),
            )
