---
name: lb-media-audit
description: |
  Audit LagunaBeach.md articles for media embeds (images, maps, videos) against
  the provisional LB media standard. Lightweight grep/Read approach given the
  19-article corpus — no heavy script. Output to reports/media-audit/YYYY-MM-DD.md.
  Results are low-signal until corpus grows past ~40 articles.
  TRIGGER when: user says "media audit", "/lb-media-audit", "check images",
  "iframe audit", "media gaps", or asks about media coverage in articles.
allowed-tools:
  - Bash
  - Read
  - Write
  - Grep
---

# 🌊 LagunaBeach.md — Media Audit (thin wrapper)

> **Intentionally thin.** Editorial media standards are canonical in
> [`docs/editorial/EDITORIAL.en.md`](../../../docs/editorial/EDITORIAL.en.md)
> (§8 notes the media-richness gate is uncalibrated). This skill runs a
> lightweight audit and reports gaps. It does NOT restate the full editorial
> rubric.

## 1. BECOME gate (required)

Run `/lb-become`. Confirm identity + SSOT rule + autonomy boundaries are loaded
before touching `knowledge/`.

## 2. Provisional LB media standard (per category)

These are minimum expectations, not hard gates. Calibrate as the corpus grows.

| Category             | Expected media                                              |
| -------------------- | ----------------------------------------------------------- |
| Art & Galleries      | At least 1 image (artwork, gallery exterior, or exhibition) |
| Beaches              | At least 1 photo; map embed where useful                    |
| Trails               | Trail map or elevation profile; at least 1 photo            |
| Events & Festivals   | At least 1 photo or video of the event                      |
| Food                 | At least 1 photo (dish, restaurant exterior, or interior)   |
| History              | At least 1 historical photo or archival image               |
| Nature & Marine Life | At least 1 photo (species, habitat, or activity)            |
| Neighborhoods        | At least 1 photo or map showing the area                    |

"At least 1" is the floor for a 19-article corpus. This standard scales up as
articles get longer and richer.

## 3. Audit method (lightweight, no script)

Given the current corpus size (19 articles), use grep/Read directly:

```bash
for f in $(find knowledge -name "*.md" -not -path "*/zh-TW/*" -not -name "INBOX.md" -not -name "_*"); do
  imgs=$(grep -c '!\[' "$f" 2>/dev/null || echo 0)
  iframes=$(grep -c '<iframe\|<div class="video-embed"' "$f" 2>/dev/null || echo 0)
  maps=$(grep -c 'map\|Map\|google.com/maps' "$f" 2>/dev/null || echo 0)
  printf '%s | img:%s iframe:%s map-ref:%s\n' "$f" "$imgs" "$iframes" "$maps"
done
```

Cross-reference results against the category table above. Flag articles at 0
across all media types as "needs media."

## 4. Output

Write report to `reports/media-audit/YYYY-MM-DD.md`:

```markdown
# Media Audit — YYYY-MM-DD

## Summary

- Total articles: N
- At standard: N
- Below standard (needs media): N

## Below standard

| Article | Category | Has img | Has iframe | Has map | Gap |
| ------- | -------- | ------- | ---------- | ------- | --- |
| ...     | ...      | ...     | ...        | ...     | ... |

## At standard

| Article | Category | img count | iframe count |
| ------- | -------- | --------- | ------------ |
| ...     | ...      | ...       | ...          |
```

## 5. Honest scope note

With 19 articles, this audit is directional, not statistical. Results become
meaningful at ~40+ articles where patterns emerge across categories. Until then,
treat "below standard" as a writing prompt, not a crisis signal.

## 6. What this skill does NOT do

- Does not port Taiwan's `music-media-audit.py` (wrong categories, wrong media
  types — Music/演員/運動員 have no LB analog).
- Does not heal gaps (that's `/lb-write` with the specific article as target).
- Does not enforce the uncalibrated `media-richness` article-health plugin
  threshold (EDITORIAL.en.md §8 explicitly marks it provisional).
