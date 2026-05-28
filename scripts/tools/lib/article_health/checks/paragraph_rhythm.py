"""paragraph_rhythm — 段落呼吸節奏 + iframe density gate (atomization drift).

2026-05-28 atomization drift 修補 Plugin (per [LESSONS-INBOX 第 7 種 drift pattern](../../../../docs/semiont/LESSONS-INBOX.md))：

5/28 manual session 180543 spawn audit agent 對讀 2 早期 viral (黑冠麻鷺 /
安溥) vs 3 recent EVOLVE (落日飛車 R2 / 半導體 R2 / 周蕙 R2) → 揭露 article
paragraph 漸進 **atomization drift** — drift 方向跟「段落過長 / list-dump /
事實堆疊」既有反 pattern 監控通通相反：

  | 指標                | 黑冠麻鷺(早期) | 周蕙 R2 (近期) | Delta              |
  | ------------------- | -------------: | -------------: | :----------------- |
  | 段落 median CJK     |             81 |             58 | -28%               |
  | 段落 mean CJK       |           84.9 |           68.7 | -19%               |
  | 段落數量            |             52 |            122 | +135%              |
  | iframe+img / 1k CJK |           0.21 |           1.23 | +486% (6 倍)       |
  | H2 含 visual        |            1/9 |           7/12 | +5x                |
  | 長段 >500 字 count  |              0 |              0 | 既有反 pattern 漏 |

Root cause hypothesis: REWRITE-PIPELINE Stage 4-5 sub-agent worktree spawn 時
新章 brief 只 200-400 字，agent 預設「一個事實=一段」最 safe；MEDIA 子
pipeline 主動加 iframe → visual 替代段落內邏輯轉折。

Rules:
  - **R1 paragraph median CJK < 55**：WARN — atomization drift signal。早期
    範本 median 80+，<55 開始進入 atomization zone
  - **R2 H2 prose 段落數 > 8**：WARN — H2 章節 over-fragmented，該 H2 拆或合段
  - **R3 iframe+image density > 0.8 / 1k CJK**：WARN — visual 倚賴上升 (周蕙
    R2 = 1.23/1k 是 worst case)。Visual 是輔助呼吸，不是替代敘事節奏。觀察
    者 directive override 允許上限 ≤ 1.0
  - **R3-HARD iframe+image density > 1.5 / 1k CJK**：HARD — 超過任何 directive
    合理範圍，必然 atomization drift

Skipped paths:
  - Hub pages (knowledge/{Category}/_*.md)
  - Translation files (knowledge/{en,ja,ko,es,fr}/)
  - Spore artifacts (docs/factory/SPORE-*)
  - Reports / memory / diary

Canonical:
  - docs/editorial/EDITORIAL.md §段落呼吸 + §媒體編織
  - docs/pipelines/REWRITE-PIPELINE.md Stage 4 Step 4.3.6 iframe baseline
  - reports/spore-voice-drift-fix-2026-05-28.md §第 7 種 pattern
"""

from __future__ import annotations
import os
import re
from statistics import median
from typing import Any, Iterator

from ..types import FileTarget, Severity, Violation


CHECK_NAME = "paragraph-rhythm"
DIMENSION = "depth"
DEFAULT_SEVERITY = Severity.WARN
EDITORIAL_REF = "EDITORIAL.md §段落呼吸 + REWRITE-PIPELINE.md §Step 4.3.6 + reports/spore-voice-drift-fix-2026-05-28.md"
APPLIES_TO = ["zh-TW"]

# Thresholds
PARA_MEDIAN_WARN = 55  # CJK chars — below this = atomization signal
H2_PARA_MAX = 8  # per-H2 prose paragraph soft cap
IFRAME_DENSITY_WARN = 0.8  # iframe+image / 1k CJK
IFRAME_DENSITY_HARD = 1.5  # 任何 directive override 都不該超這個


_RE_CJK = re.compile(r"[一-鿿㐀-䶿]")
_RE_H2 = re.compile(r"^##\s+(?!#)", re.MULTILINE)  # H2 only, not H3+
_RE_IFRAME = re.compile(r"<iframe\s", re.IGNORECASE)
_RE_IMAGE_MD = re.compile(r"!\[[^\]]*\]\([^\)]+\)")
_RE_HERO_IMAGE_FRONTMATTER = re.compile(r"^image:\s*['\"]?/", re.MULTILINE)
# Frontmatter delimiters
_RE_FRONTMATTER = re.compile(r"^---\s*\n.*?\n---\s*\n", re.DOTALL)
# Code fences
_RE_CODE_FENCE = re.compile(r"```.*?```", re.DOTALL)
# Footnote def lines
_RE_FOOTNOTE_DEF = re.compile(r"^\[\^[^\]]+\]:.*$", re.MULTILINE)


def _is_applicable_path(path: str) -> bool:
    """Only applies to zh-TW depth articles, not hub / translation / spore / reports.

    v2 (2026-05-28): accept both relative ("knowledge/...") and absolute
    ("/path/to/knowledge/...") paths — earlier "/knowledge/" check missed
    relative paths from runner.
    """
    p = str(path)
    if not p.endswith(".md"):
        return False
    base = os.path.basename(p)
    if base.startswith("_"):
        return False
    # Translation files (under knowledge/{lang}/)
    if re.search(r"(?:^|/)knowledge/(en|ja|ko|es|fr)/", p):
        return False
    # Only knowledge/ articles (relative or absolute)
    if not re.search(r"(?:^|/)knowledge/", p):
        return False
    # Skip spore / reports / memory / diary
    skip_substrings = (
        "SPORE-",
        "spore-blueprints/",
        "SPORE-HARVESTS/",
        "reports/",
        "memory/",
        "diary/",
    )
    if any(s in p for s in skip_substrings):
        return False
    return True


def _strip_for_prose_analysis(text: str) -> str:
    """Strip frontmatter, code fences, footnote definitions to get pure body."""
    text = _RE_FRONTMATTER.sub("", text)
    text = _RE_CODE_FENCE.sub("", text)
    text = _RE_FOOTNOTE_DEF.sub("", text)
    return text


def _count_cjk(s: str) -> int:
    return len(_RE_CJK.findall(s))


def _extract_h2_sections(body: str) -> list[tuple[str, str]]:
    """Return list of (h2_title, h2_body) tuples."""
    parts = re.split(r"^(##\s+(?!#)[^\n]+)\n", body, flags=re.MULTILINE)
    # parts[0] = pre-H2 lead; then alternating (title, body)
    sections = []
    for i in range(1, len(parts) - 1, 2):
        title = parts[i].strip().lstrip("#").strip()
        section_body = parts[i + 1] if i + 1 < len(parts) else ""
        sections.append((title, section_body))
    return sections


def _split_paragraphs(section_body: str) -> list[str]:
    """Split section body into prose paragraphs.

    Skip:
      - empty lines (used as paragraph delimiters)
      - blockquote-only paragraphs (start with `>` — usually callout meta)
      - bullet-list paragraphs (start with `- ` or `* ` or `\d.`)
      - HTML-only paragraphs (iframe div wrappers)
      - heading-like lines (`##`, `###`)
      - italic caption lines `_..._`
    """
    raw_paragraphs = re.split(r"\n\s*\n", section_body)
    paragraphs = []
    for p in raw_paragraphs:
        p_stripped = p.strip()
        if not p_stripped:
            continue
        first_line = p_stripped.split("\n", 1)[0].strip()
        # Skip blockquote callouts
        if first_line.startswith(">"):
            continue
        # Skip bullet / numbered list
        if re.match(r"^(?:[-*]\s|\d+\.\s)", first_line):
            continue
        # Skip headings (H3+)
        if first_line.startswith("#"):
            continue
        # Skip HTML / iframe wrappers
        if first_line.startswith("<") or first_line.startswith("</"):
            continue
        # Skip italic-only caption lines (e.g. _photo credit_)
        if (
            first_line.startswith("_")
            and first_line.endswith("_")
            and len(first_line) < 200
        ):
            continue
        # Skip image markdown
        if first_line.startswith("!["):
            continue
        # Skip if entirely just inline markdown (very short)
        cjk_count = _count_cjk(p_stripped)
        if cjk_count < 5:  # too short to count as prose paragraph
            continue
        paragraphs.append(p_stripped)
    return paragraphs


def check(target: FileTarget, config: dict[str, Any]) -> Iterator[Violation]:
    """Detect atomization drift signals."""
    if not _is_applicable_path(str(target.path)):
        return

    text = target.text
    body = _strip_for_prose_analysis(text)
    total_cjk = _count_cjk(body)

    # Only check depth articles (≥ 3000 CJK — short articles have different rhythm)
    if total_cjk < 3000:
        return

    # Collect prose paragraphs across all H2 sections
    sections = _extract_h2_sections(body)
    all_paragraphs_cjk: list[int] = []
    per_section_counts: list[tuple[str, int]] = []  # (title, paragraph_count)

    # Also include pre-H2 lead paragraphs
    if sections:
        # Use part before first H2 as "lead"
        first_h2_match = re.search(r"^##\s+(?!#)", body, flags=re.MULTILINE)
        if first_h2_match:
            lead_body = body[: first_h2_match.start()]
            lead_paragraphs = _split_paragraphs(lead_body)
            for p in lead_paragraphs:
                cjk = _count_cjk(p)
                if cjk >= 5:
                    all_paragraphs_cjk.append(cjk)
            if lead_paragraphs:
                per_section_counts.append(("[lead]", len(lead_paragraphs)))

    for title, section_body in sections:
        paragraphs = _split_paragraphs(section_body)
        per_section_counts.append((title, len(paragraphs)))
        for p in paragraphs:
            cjk = _count_cjk(p)
            if cjk >= 5:
                all_paragraphs_cjk.append(cjk)

    if not all_paragraphs_cjk:
        return

    para_median = int(median(all_paragraphs_cjk))
    para_count = len(all_paragraphs_cjk)

    # ── R1: paragraph median CJK ──
    if para_median < PARA_MEDIAN_WARN:
        yield Violation(
            check=CHECK_NAME,
            severity=Severity.WARN,
            message=(
                f"段落原子化 (atomization drift R1): "
                f"段落 median CJK {para_median} 字 < {PARA_MEDIAN_WARN} 字門檻 "
                f"(early viral 範本如黑冠麻鷺 median 81 字)。"
                f"全文 {para_count} 段 / {total_cjk} CJK chars。"
            ),
            line=1,
            snippet=f"para_median={para_median} para_count={para_count}",
            editorial_ref="EDITORIAL.md §段落呼吸 (新規條 2026-05-28)",
            fix_suggestion=(
                "合段：把 1 事實 1 段 → 1 論點 1 段（含因果鏈 + 細節 + 場景）。"
                "目標 median 75-90 字 / stdev 40-50 = 早期範本節奏。"
                "或：每 H2 prose 段落 ≤ 8（per EDITORIAL §段落呼吸）。"
            ),
        )

    # ── R2: per-H2 prose paragraph count > 8 ──
    over_h2 = [(t, c) for t, c in per_section_counts if c > H2_PARA_MAX]
    if over_h2:
        names = ", ".join(f"§{t}({c})" for t, c in over_h2[:3])
        more = f" +{len(over_h2) - 3} more H2" if len(over_h2) > 3 else ""
        yield Violation(
            check=CHECK_NAME,
            severity=Severity.WARN,
            message=(
                f"H2 過度切碎 (atomization drift R2): "
                f"{len(over_h2)} 個 H2 章節超過 {H2_PARA_MAX} 段 prose: {names}{more}。"
            ),
            line=1,
            snippet=f"over_h2_count={len(over_h2)}",
            editorial_ref="EDITORIAL.md §段落呼吸 (新規條)",
            fix_suggestion=(
                f"H2 過度切碎可能是 (a) 該 H2 應拆兩個 (b) 段落太多應合併 "
                f"(c) 結構性 footer / callout 不應算入 prose 段落數。"
            ),
        )

    # ── R3: iframe+image density / 1k CJK ──
    iframe_count = len(_RE_IFRAME.findall(text))
    image_count = len(_RE_IMAGE_MD.findall(text))
    # Hero image from frontmatter counts as 1 if present
    has_hero = bool(_RE_HERO_IMAGE_FRONTMATTER.search(text))
    visual_count = iframe_count + image_count + (1 if has_hero else 0)
    density = (visual_count * 1000) / total_cjk if total_cjk > 0 else 0

    # HARD only when BOTH high visual density AND atomized paragraphs.
    # High visual density alone may be observer-directive driven (e.g. 5+ iframe
    # directive on music person) and acceptable if prose rhythm is healthy.
    # Combined signal (density + atomization) indicates true drift.
    if density >= IFRAME_DENSITY_HARD and para_median < PARA_MEDIAN_WARN:
        yield Violation(
            check=CHECK_NAME,
            severity=Severity.HARD,
            message=(
                f"Combined atomization drift HARD: "
                f"density {density:.2f}/1k > {IFRAME_DENSITY_HARD} AND "
                f"para median {para_median} < {PARA_MEDIAN_WARN}。"
                f"Visual 倚賴 + 段落原子化雙信號。"
            ),
            line=1,
            snippet=f"density={density:.2f} para_median={para_median}",
            editorial_ref="EDITORIAL.md §媒體編織 + §段落呼吸",
            fix_suggestion=(
                "(a) 合段恢復 prose rhythm 到 median 75-90 字 "
                "(b) 砍 iframe 到 ≤ 1.0/1k CJK "
                "(c) 兩條至少滿足一條才能 ship"
            ),
        )
    elif density >= IFRAME_DENSITY_WARN:
        yield Violation(
            check=CHECK_NAME,
            severity=Severity.WARN,
            message=(
                f"Visual density 偏高 (atomization drift R3-WARN): "
                f"{visual_count} visual / {total_cjk} CJK = {density:.2f}/1k > "
                f"{IFRAME_DENSITY_WARN}/1k 建議上限。"
                f"早期範本如黑冠麻鷺 0.21/1k = 6 倍以下。"
            ),
            line=1,
            snippet=f"density={density:.2f}",
            editorial_ref="EDITORIAL.md §媒體編織",
            fix_suggestion=(
                "考慮：(a) 文字段落自己承擔節奏不要 outsource 給 iframe "
                "(b) 觀察者 directive override 允許上限 ≤ 1.0/1k "
                "(c) 移除次要 iframe，留代表性 3-5 個"
            ),
        )
