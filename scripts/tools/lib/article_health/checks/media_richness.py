"""media_richness — depth article 立體素材門檻 (iframe + image 雙計).

Rule (2026-05-25 哲宇 directive，twmd-spore-publish-daily routine design):
    具備「立體完整認識」的 depth article 必須有 ≥ 1 iframe (YouTube/影片素材)
    AND ≥ 2 inline image。單看 image_health 的圖片數量不夠 — 立體 = 動態
    媒介 (video) + 靜態媒介 (image) 雙向。

Trigger context:
    twmd-spore-publish-daily routine 從 SPORE-INBOX 挑 entry 自動 ship 孢子前，
    需要 quality gate 確保被推廣的文章本身具備立體完整呈現 (per EDITORIAL §媒體編織
    baseline + 5/17 陳建年.md 4 iframe ship 後 audit 86/87 條目低於 baseline 教訓)。

Detected:
    - HTML `<iframe ...>` tags in body (count occurrences, ignoring code blocks)
    - Inline `![alt](path)` images
    - Frontmatter `image:` (1 hero)
    Total iframe + total images counted separately.

Skipped paths:
    Same as word_count / image_health: hub pages / translations / spores /
    memory / diary / reports. Only applies to zh-TW knowledge articles.

Threshold:
    - default: min_iframes=1, min_images=2
    - default severity WARN (soft-launch — many legacy articles 不到 baseline)
    - twmd-spore-publish-daily routine 自己 enforce hard pass via JSON output
      check (本 plugin 純 surface signal，routine consumer 決定 gate)

Canonical:
    - EDITORIAL.md §媒體編織 baseline (人物類至少 1 iframe + 2 image)
    - SPORE-PUBLISH-PIPELINE.md §Stage 1 Quality Gate
    - REWRITE-PIPELINE.md Step 4.3.6 媒體素材插入 (per 2026-05-17 陳建年.md)
"""

from __future__ import annotations
import os
import re
from typing import Any, Iterator

from ..types import FileTarget, Severity, Violation


CHECK_NAME = "media-richness"
DIMENSION = "media-quality"
DEFAULT_SEVERITY = Severity.WARN
EDITORIAL_REF = "EDITORIAL.md §媒體編織 + SPORE-PUBLISH-PIPELINE §Stage 1 Quality Gate"
APPLIES_TO = ["zh-TW"]

DEFAULT_MIN_IFRAMES = 1
DEFAULT_MIN_IMAGES = 2

# `<iframe` followed by whitespace or `>` — accommodates `<iframe src=...>` and
# `<iframe>` and `<iframe\nsrc=...>`. Case-sensitive (HTML iframe spec lowercase).
_RE_IFRAME = re.compile(r"<iframe[\s>]", re.IGNORECASE)
_RE_INLINE_IMAGE = re.compile(r"!\[([^\]]*)\]\(([^)\n]+)\)")
# Strip fenced code blocks before counting iframes (avoid example snippets in docs).
_RE_CODE_BLOCK = re.compile(r"```.*?```", re.DOTALL)


def _is_excluded_path(path_str: str) -> bool:
    """Skip hub / translations / spores / memory / diary / reports."""
    p = path_str.replace("\\", "/")
    if not p.endswith(".md"):
        return True
    for lang in ("en", "ja", "ko", "es", "fr"):
        if f"knowledge/{lang}/" in p:
            return True
    if os.path.basename(p).startswith("_"):
        return True
    if "SPORE-BLUEPRINTS/" in p or "SPORE-HARVESTS/" in p:
        return True
    if "memory/" in p or "diary/" in p:
        return True
    if "reports/" in p:
        return True
    if "knowledge/" not in p:
        return True
    return False


def check(target: FileTarget, config: dict[str, Any]) -> Iterator[Violation]:
    if _is_excluded_path(str(target.path)):
        return

    options = config or {}
    min_iframes = int(options.get("min_iframes", DEFAULT_MIN_IFRAMES))
    min_images = int(options.get("min_images", DEFAULT_MIN_IMAGES))

    body = target.body if target.body else target.text
    if not body:
        return

    # Strip fenced code blocks so iframe examples in docs don't false-positive.
    body_clean = _RE_CODE_BLOCK.sub("", body)

    iframe_count = len(_RE_IFRAME.findall(body_clean))

    inline_images = len(_RE_INLINE_IMAGE.findall(body_clean))
    fm_image = target.frontmatter.get("image")
    has_fm_image = isinstance(fm_image, str) and fm_image.strip() != ""
    total_images = inline_images + (1 if has_fm_image else 0)

    # ── INFO stats line (always emit) ────────────────────────────────────────
    yield Violation(
        check=CHECK_NAME,
        severity=Severity.INFO,
        message=(
            f"媒體統計：{iframe_count} iframe + {total_images} image "
            f"(門檻 iframe ≥ {min_iframes} AND image ≥ {min_images})"
        ),
        editorial_ref=EDITORIAL_REF,
    )

    # ── Threshold gate (both must pass) ──────────────────────────────────────
    iframe_short = iframe_count < min_iframes
    image_short = total_images < min_images

    if not iframe_short and not image_short:
        return

    parts = []
    if iframe_short:
        parts.append(f"iframe {iframe_count} < {min_iframes}（缺影片素材）")
    if image_short:
        parts.append(f"image {total_images} < {min_images}（缺靜態圖片）")

    yield Violation(
        check=CHECK_NAME,
        severity=DEFAULT_SEVERITY,
        message=(
            "立體素材不足：" + " + ".join(parts)
            + " — 立體完整呈現需動態 (video) + 靜態 (image) 雙向。"
        ),
        line=1,
        snippet="",
        editorial_ref=EDITORIAL_REF,
        fix_suggestion=(
            "(1) 找 YouTube/Vimeo 影片素材嵌 iframe (REWRITE-PIPELINE Step 4.3.6)"
            " (2) 補 PD/CC 圖庫進 public/article-images/ (REWRITE-PIPELINE Step 1.14)"
            " (3) 走 §媒體編織 baseline 三段敘事節奏 (hero + scene-mid + 影片穿插)"
        ),
    )
