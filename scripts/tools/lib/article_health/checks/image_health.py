"""image_health — article image references + frontmatter coherence + count gate.

Migrated from `scripts/tools/article-image-health.sh` (REWRITE-PIPELINE
Stage 4.5f hard gate per REFLEXES #30).

Dimensions:
  1. inline `![alt](path)` references — `path` must exist on disk
  2. frontmatter `image:` — file must exist
  3. external hot-link detection — http/https URLs not under
     `/article-images/` or `https://upload.wikimedia.org/...`
     (canonical CC sources allowed)
 4. ## imageSource section presence (when CC images used)
 5. **image count gate (added 2026-05-11 kind-mirzakhani per Cheyu callout)** —
 depth article 理想 hero + 1-2 scene-mid = 2-3 ，min_images=3 Default
     soft-launch WARN（legacy heal），rewrite-stage-4 profile severity_override
 升 HARD。Trigger：NMTH Articles ship 後Cheyu callout「Whyimage用那麼少」揭露
 Step 4.3.1 三段敘事節奏沒儀器化進 article-health（REFLEXES #15 反覆浮現要儀器化
 第 N 次Verify）。

Severity: HARD for missing files / hot-links, WARN for missing imageSource section,
configurable WARN/HARD for min-count gate via options.
"""

from __future__ import annotations
import os
import re
from pathlib import Path
from typing import Any, Iterator

from ..types import FileTarget, Severity, Violation


CHECK_NAME = "image-health"
DIMENSION = "media"
DEFAULT_SEVERITY = Severity.HARD
EDITORIAL_REF = "REWRITE-PIPELINE Stage 1 Step 1.14 + Stage 4 Step 4.3 / REFLEXES #30"
APPLIES_TO = ["*"]

# Defaults — overridable via profile options
DEFAULT_MIN_IMAGES = 3
# Soft-launch WARN for both 0-image and 1-2-image cases (mirrors word-count
# pattern: legacy Articles下不到門檻不 hard-block pre-commit，Avoid改 typo 也被擋；
# rewrite-stage-4 profile severity_override 升 HARD 對 new article 強制達標)。
DEFAULT_MIN_IMAGES_SEVERITY = "warn"  # rewrite-stage-4 promotes to "hard"
DEFAULT_ZERO_IMAGES_SEVERITY = "warn"  # rewrite-stage-4 promotes to "hard"

# 2026-06-07 Cheyu directive「媒體full度低標提升 + length-scaled」(REWRITE v6.8)：
# depth article 媒體下限隨characters數縮放。effective_min = max(min_images, round(CJK / cjk_per_media))。
# 校準語料 (複雜生活節 13 媒體/10.4k=1.25 + 設研院 5/5.3k + 天下 6/6.4k + Blakiston fish owl 3/3.6k)：
# cjk_per_media=1200 → 4500→4 / 7000→6 / 9000→8 / 10440→9；named 富媒體範本全過、
# text-only (雜學校 0) 失格。length_scaled Default off，rewrite-stage-4 profile override on。
DEFAULT_LENGTH_SCALED = False
DEFAULT_CJK_PER_MEDIA = 1200
# 2026-06-21: English equivalent of cjk_per_media. This plugin is APPLIES_TO
# = ["*"] (runs on both zh-TW and English content), so the length-scaling
# unit must match the article's language — CJK char count for zh-TW, word
# count for English. Calibrated to media_richness.py's English ratio.
DEFAULT_WORDS_PER_MEDIA = 400

# Markdown image syntax: ![alt](src)
_RE_INLINE_IMAGE = re.compile(r"!\[([^\]]*)\]\(([^)\n]+)\)")
# 2026-06-04: count video iframe toward the media threshold (Cheyu「圖+video」directive).
_RE_IFRAME = re.compile(r"<iframe[\s>]", re.IGNORECASE)
_RE_IMAGE_SOURCES_H2 = re.compile(r"^##\s*(?:Image Sources|image來源)", re.MULTILINE)
_RE_CJK = re.compile(r"[一-鿿㐀-䶿]")
_RE_WORD = re.compile(r"[A-Za-z0-9'-]+")
# length-scaling 用 prose-CJK (strip referenceData footnote 段) — footnotes 可 inflate CJK ~25%
# → 過度request媒體。alignment paragraph_rhythm density 的 prose 基準 (校準Keep 設研院/天下/Blakiston fish owl)。
_RE_REF_SECTION = re.compile(r"^##\s*reference資料", re.MULTILINE)
# caption 渲染Check：HTML block (</div> / </iframe>) 緊接 markdown italic caption (_..._) 無空行
# → remark/markdown 不會 render italic (底線變characters面characters元)。2026-06-07 Cheyu directive (live review
# 複雜生活節 3 video caption 都缺空行)。working pattern (陳建年)：</div> 跟 _caption_ 之間有空行。
_RE_CAPTION_NO_BLANK = re.compile(r"</(?:div|iframe)>[ \t]*\n_")


def _is_local_path(src: str) -> bool:
    """Local image: starts with / or article-images/ or no scheme."""
    return not src.startswith(("http://", "https://"))


def _is_allowed_external(src: str) -> bool:
    """Allow Wikimedia / commons (canonical CC sources)."""
    allowed_prefixes = (
        "https://upload.wikimedia.org/",
        "https://commons.wikimedia.org/",
    )
    return src.startswith(allowed_prefixes)


def _is_excluded_from_count_gate(path_str: str) -> bool:
    """Skip min-count gate for hub / translations / spores / meta files.

    Mirrors word_count._is_excluded_path. Path patterns use substring match
    so both absolute and repo-relative paths are handled.
    """
    p = path_str.replace("\\", "/")
    if not p.endswith(".md"):
        return True
    # Translation files (knowledge/en|ja|ko|es|fr/...)
    for lang in ("en", "ja", "ko", "es", "fr"):
        if f"knowledge/{lang}/" in p:
            return True
    # Hub pages — knowledge/{Category}/_X.md
    if os.path.basename(p).startswith("_"):
        return True
    # Spore artifacts
    if "SPORE-BLUEPRINTS/" in p or "SPORE-HARVESTS/" in p:
        return True
    # Memory / diary / reports / research
    if "memory/" in p or "diary/" in p:
        return True
    if "reports/" in p:
        return True
    # Only apply to zh-TW knowledge articles
    if "knowledge/" not in p:
        return True
    return False


def _parse_severity(value: Any, fallback: Severity) -> Severity:
    if isinstance(value, Severity):
        return value
    if not value:
        return fallback
    try:
        return Severity(str(value).lower())
    except ValueError:
        return fallback


def check(target: FileTarget, config: dict[str, Any]) -> Iterator[Violation]:
    body = target.body
    repo_root = Path.cwd()
    public_root = repo_root / "public"
    options = config or {}

    # ── Pre-compute counts (used for stats INFO + min gate) ──────────────────
    inline_matches = list(_RE_INLINE_IMAGE.finditer(body))
    inline_count = len(inline_matches)
    fm_image = target.frontmatter.get("image")
    has_fm_image = isinstance(fm_image, str) and fm_image.strip() != ""
    total_images = inline_count + (1 if has_fm_image else 0)

    # ── 0. Stats INFO (always emit so users see count) ────────────────────────
    yield Violation(
        check=CHECK_NAME,
        severity=Severity.INFO,
        message=(
            f"Image stats: {inline_count} inline + "
            f"{1 if has_fm_image else 0} hero (frontmatter) = "
            f"{total_images} total"
        ),
        editorial_ref=EDITORIAL_REF,
    )

    # ── 1. inline image references — broken-path / hot-link HARD gate ────────
    for m in inline_matches:
        alt, src = m.group(1), m.group(2).strip()
        line_no = body.count("\n", 0, m.start()) + 1
        if not _is_local_path(src):
            if not _is_allowed_external(src):
                yield Violation(
                    check=CHECK_NAME,
                    severity=Severity.HARD,
                    message=(
                        "External image hot-link — cache to public/article-images/"
                        " and use src=`/article-images/...`"
                    ),
                    line=line_no,
                    snippet=src[:80],
                    editorial_ref=EDITORIAL_REF,
                )
            continue
        # Local: validate file exists (relative to public/ for absolute paths)
        if src.startswith("/"):
            local = public_root / src.lstrip("/")
        else:
            local = target.path.parent / src
        if not local.exists():
            yield Violation(
                check=CHECK_NAME,
                severity=Severity.HARD,
                message=f"Image file not found: {src}",
                line=line_no,
                snippet=src[:80],
                editorial_ref=EDITORIAL_REF,
            )

    # ── 2. frontmatter image — file existence HARD gate ──────────────────────
    if has_fm_image:
        src = fm_image.strip()
        if _is_local_path(src):
            local = public_root / src.lstrip("/")
            if not local.exists():
                yield Violation(
                    check=CHECK_NAME,
                    severity=Severity.HARD,
                    message=f"Frontmatter image file not found: {src}",
                    snippet=src[:80],
                    editorial_ref=EDITORIAL_REF,
                )

    # ── 3. ## Image Sources section when CC attribution exists ─────────────────
    has_attribution = (
        target.frontmatter.get("imageCredit")
        or target.frontmatter.get("imageLicense")
        or target.frontmatter.get("imageSource")
    )
    if has_attribution and not _RE_IMAGE_SOURCES_H2.search(body):
        yield Violation(
            check=CHECK_NAME,
            severity=Severity.WARN,
            message=(
                "Frontmatter has imageCredit/imageLicense/imageSource but missing "
                "`## Image Sources` section (CC images require source citation)"
            ),
            editorial_ref=EDITORIAL_REF,
        )

    # ── 3.5 caption render: HTML block immediately followed by _caption_ without blank line ──
    for m in _RE_CAPTION_NO_BLANK.finditer(body):
        line_no = body.count("\n", 0, m.start()) + 1
        yield Violation(
            check=CHECK_NAME,
            severity=Severity.WARN,
            message=(
                "Video/HTML caption missing blank line: `</div>`/`</iframe>` followed by "
                "`_caption_` without blank line — markdown won't render italic."
            ),
            line=line_no,
            snippet="</div>↵_caption_  (should be </div>↵↵_caption_)",
            editorial_ref="REWRITE-PIPELINE Step 4.3.6 iframe caption format",
            fix_suggestion="Add a blank line between </div> and _caption_.",
        )

    # ── 4. Min image count gate (depth article media rhythm) ──────────────────
 # Per REWRITE-PIPELINE Step 4.3.1 — depth article 理想 hero + 1-2 scene-mid
 # = 2-3 。default min_images=3, soft-launch WARN, rewrite-stage-4 升 HARD.
    if not _is_excluded_from_count_gate(str(target.path)):
        min_images = int(options.get("min_images", DEFAULT_MIN_IMAGES))
 # length-scaled 媒體下限 (v6.8)：長文Need更多媒體立體呈現。effective_min =
 # max(base, round(CJK/cjk_per_media))。校準 cjk_per_media=1200 → 4500→4 / 7000→6 /
 # 9000→8。base min_images 是短 depth 的 floor，length-scale 把長文往上拉。
        if options.get("length_scaled", DEFAULT_LENGTH_SCALED):
            ref_m = _RE_REF_SECTION.search(body)
            prose_body = body[: ref_m.start()] if ref_m else body
            if target.lang == "en":
                length_unit = len(_RE_WORD.findall(prose_body))
                per = int(options.get("words_per_media", DEFAULT_WORDS_PER_MEDIA)) or DEFAULT_WORDS_PER_MEDIA
            else:
                length_unit = len(_RE_CJK.findall(prose_body))
                per = int(options.get("cjk_per_media", DEFAULT_CJK_PER_MEDIA)) or DEFAULT_CJK_PER_MEDIA
            min_images = max(min_images, round(length_unit / per))
 # 2026-06-04 Cheyu directive「圖+video valued together」：門檻算「媒體」(圖+video)，
 # 不再只算圖。但Keep ≥1 靜態圖 floor (OG card / spore poster Need靜態圖，videoCannot derive)。
 # patch：video-rich 範本 Blakiston fish owl (1 圖+2 官方video=3 媒體) 原本被 image-only 門檻 hard-fail。
        iframe_count = len(_RE_IFRAME.findall(body))
        media_total = total_images + iframe_count
        if media_total >= min_images and total_images == 0:
            yield Violation(
                check=CHECK_NAME,
                severity=_parse_severity(
                    options.get("min_images_severity"),
                    Severity(DEFAULT_MIN_IMAGES_SEVERITY),
                ),
                message=(
                    f"No static images: {iframe_count} videos but 0 images — "
                    "add at least 1 hero image (OG card / poster needs a static image)"
                ),
                fix_suggestion="Add 1 hero image (frontmatter image:); videos still count toward media total.",
                editorial_ref=EDITORIAL_REF,
            )
        elif media_total < min_images:
            if media_total == 0:
                sev = _parse_severity(
                    options.get("zero_images_severity"),
                    Severity(DEFAULT_ZERO_IMAGES_SEVERITY),
                )
                msg_detail = (
                    f"0 media — depth article needs at least hero + scene-mid / video = "
                    f"{min_images} (per REWRITE-PIPELINE Step 4.3.1)"
                )
            else:
                sev = _parse_severity(
                    options.get("min_images_severity"),
                    Severity(DEFAULT_MIN_IMAGES_SEVERITY),
                )
                msg_detail = (
                    f"Insufficient media: images {total_images} + videos {iframe_count} = {media_total} "
                    f"< {min_images} minimum (depth article needs hero + 1-2 scene-mid / "
                    f"video, per REWRITE-PIPELINE Step 4.3.1)"
                )
            yield Violation(
                check=CHECK_NAME,
                severity=sev,
                message=msg_detail,
                fix_suggestion=(
                    "Follow REWRITE-PIPELINE Stage 1 Step 1.14 media research: "
                    "(1) cache PD/CC images to public/article-images/{category}/ "
                    "(2) pass check-aspect.sh hero 0.9-2.0 / inline 0.75-2.5 guardrails "
                    "(3) Stage 4 Step 4.3 insert into article (hero + scene-mid rhythm) "
                    "(4) ## Image Sources section with CC license + photographer. "
                    "No PD/CC available → fair use editorial commentary scope "
                    "(per Step 1.14.2)"
                ),
                editorial_ref=EDITORIAL_REF,
            )
