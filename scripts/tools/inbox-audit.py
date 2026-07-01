#!/usr/bin/env python3
"""inbox-audit.py — ARTICLE-INBOX ground-truth health check + safe distill executor.

Instruments "check current state": one command cross-references each ARTICLE-INBOX
Pending entry against `knowledge/` (article exists?) + ARTICLE-DONE-LOG (archived?),
classifies into ghosts, duplicates, genuine pending, and outputs a triage report.
--apply-safe removes only 100% unambiguous ghosts (self-declared done or exists+logged),
with line-conservation guarantee (not just entry count).

Origin: 2026-06-19-123909-inbox-distill session — manual distill 95->79 caught 16 ghosts
(completion-archive rule had no structural enforcement -> inbox drift). Directive: instrument
this process. Canonical SOP: docs/semiont/ARTICLE-INBOX.md Distill SOP
Design lessons: REFLEXES #15 (recurring patterns must be instrumented) + #38 (mixed-dimension
silent killer: count correct but content dropped)

Usage:
  inbox-audit.py                      # triage report (human markdown)
  inbox-audit.py --json               # machine-readable (routine / signal consumption)
  inbox-audit.py --apply-safe         # remove unambiguous ghosts only (done / exists+logged), line-conservation guaranteed
  inbox-audit.py --apply-safe --dry-run   # preview what would be removed, no write
Classification:
  🔴 DECLARED-DONE   status=done/dropped — completed but not moved out (rule violation), only class --apply-safe touches
  🟠 STALE-NEW       Type=NEW but article exists — NEW already satisfied, awaiting manual review
  🟣 PARTIAL-SHIP    prose-shipped-pending-media — prose shipped, media/babel pending (legitimate pending)
  🟡 EVOLVE-PENDING  Type=EVOLVE + article exists + pending — legitimate re-EVOLVE (article existing + possibly in DONE-LOG is prerequisite, not ghost)
  ✅ GENUINE-PENDING article doesn't exist + pending — true pending
  ⚪ SERIES          series umbrella / Tier / pick list — no auto-resolve, manual confirmation of entire batch
  🔁 DUP            >=2 entries resolve to same article
--apply-safe only touches DECLARED-DONE (status self-declared done = safest signal). All others left for manual review.
"""

from __future__ import annotations
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
INBOX = ROOT / "docs/semiont/ARTICLE-INBOX.md"
DONELOG = ROOT / "docs/semiont/ARTICLE-DONE-LOG.md"
KNOWLEDGE = ROOT / "knowledge"
LANG_DIRS = {"en", "ja", "ko", "es", "fr"}
CATEGORIES = {
    "About", "Art", "Culture", "Economy", "Food", "Geography", "History",
    "Lifestyle", "Music", "Nature", "People", "Politics", "Society", "Technology",
}
SERIES_MARKERS = ("系列", "batch", "umbrella", "series", "共通說明", "pick list",
                  "Tier", "Round 2", "P0×5", "P0x5", "候選）", "Peek")


def split_blocks(lines):
    """Line-walk into segments; EVERY line lands in exactly one segment (no drops).
    'block' starts at '### ' until next '### '/'## '. '## ' starts a 'pre' section.
    FENCE-AWARE: '###'/'##' inside ``` code fences are content, not boundaries
    (certain entries embed fenced markdown examples with ## / ### headers).
    Returns list of (kind, [lines]). Mirrors the proven distill segmentation."""
    segments, cur, kind, in_fence = [], [], "pre", False
    for l in lines:
        if l.lstrip().startswith("```"):
            in_fence = not in_fence
            cur.append(l)
            continue
        if not in_fence and l.startswith("### "):
            if cur:
                segments.append((kind, cur))
            cur, kind = [l], "block"
        elif not in_fence and l.startswith("## "):
            if cur:
                segments.append((kind, cur))
            cur, kind = [l], "pre"
        else:
            cur.append(l)
    if cur:
        segments.append((kind, cur))
    return segments


def field(block, name):
    pat = re.compile(r"^\s*-\s*\*\*" + re.escape(name) + r"\*\*[^:]*:\s*`?([^`\n]*)`?", re.M)
    m = pat.search("\n".join(block))
    return m.group(1).strip() if m else ""


def core_title(heading):
    """Strip '### ', leading emoji/symbols, and suffixes to get the article-ish core."""
    t = heading[4:].strip()
    # strip leading non-CJK/non-alnum decorations (emoji, icons, etc)
    t = re.sub(r"^[^\w一-鿿（(]+", "", t).strip()
    for cut in (" EVOLVE", " NEW", " SEO", " — ", "—", " (", "（", " batch", "：", ":"):
        i = t.find(cut)
        if i > 0:
            t = t[:i]
    return t.strip()


def build_knowledge_index():
    """stem -> [relpaths]; (category, stem) -> relpath for zh-TW SSOT."""
    by_stem, by_cat_stem = {}, {}
    for p in KNOWLEDGE.rglob("*.md"):
        rel = p.relative_to(ROOT)
        parts = rel.parts
        if len(parts) >= 2 and parts[1] in LANG_DIRS:
            continue  # skip translations
        stem = p.stem
        by_stem.setdefault(stem, []).append(str(rel))
        if len(parts) >= 2:
            by_cat_stem[(parts[1], stem)] = str(rel)
    return by_stem, by_cat_stem


def resolve_article(entry, by_stem, by_cat_stem):
    """Return (relpath_or_None, how)."""
    path = entry["path"]
    if path:
        path = path.replace("knowledge/", "knowledge/")
        if (ROOT / path).exists():
            return path, "Path-field"
    cat, core = entry["category"], entry["core"]
    if cat and (cat, core) in by_cat_stem:
        return by_cat_stem[(cat, core)], "cat+stem"
    if core in by_stem and len(by_stem[core]) == 1:
        return by_stem[core][0], "exact-stem"
    # fuzzy: a knowledge stem that contains the core (or vice-versa), len>=3 to avoid noise
    if len(core) >= 3:
        hits = [v for s, v in by_stem.items() if (core in s or s in core)]
        flat = [x for sub in hits for x in sub]
        if len(flat) == 1:
            return flat[0], "fuzzy-stem"
    return None, "none"


def classify(entry, donelog_text):
    """Conservative: only status-self-declared done is auto-removable. 'exists+logged'
    is NOT a ghost signal for EVOLVE entries — re-EVOLVE requires the article to exist
    and it may already be in DONE-LOG from a prior ship."""
    status = entry["status"].lower()
    typ = entry["type"].upper()
    art = entry["article"]
    is_series = any(m.lower() in entry["heading"].lower() for m in SERIES_MARKERS)
    declared_done = (
        bool(re.search(r"\b(done|dropped)\b", status))
        or "已完成" in entry["status"]
        or "✅" in entry["status"]
    ) and not ("pending" in status and "shipped" in status)
    partial = ("shipped" in status and "pending" in status)
    logged = bool(art) and (art in donelog_text or (len(entry["core"]) >= 3 and entry["core"] in donelog_text))
    note = " (in DONE-LOG, confirmed re-EVOLVE not ghost)" if logged else ""

    if declared_done:
        return "DECLARED-DONE", "🔴", "status self-declared done/dropped — completed but not moved out (rule violation), safe to remove"
    if is_series:
        return "SERIES", "⚪", "series umbrella / Tier — no auto-resolve, manual confirmation of batch completion"
    if partial:
        return "PARTIAL-SHIP", "🟣", "prose shipped, media/babel pending (legitimate pending)"
    if art and typ == "EVOLVE":
        return "EVOLVE-PENDING", "🟡", f"article exists({art}) + EVOLVE pending — legitimate re-EVOLVE{note}"
    if art:  # NEW (or unknown type) but article exists -> NEW already satisfied
        return "STALE-NEW", "🟠", f"NEW but article exists({art}) — NEW satisfied, awaiting manual review{note}"
    return "GENUINE-PENDING", "✅", "article doesn't exist + pending — true pending"


def parse_pending(text):
    """Return list of entry dicts for §Pending blocks that look like real entries."""
    lines = text.split("\n")
    segs = split_blocks(lines)
    in_pending, entries = False, []
    for kind, seg in segs:
        head = seg[0] if seg else ""
        if kind == "pre" and head.startswith("## "):
            in_pending = "Pending" in head or "📥" in head
            continue
        if kind != "block" or not in_pending:
            continue
        heading = next((l for l in seg if l.startswith("### ")), seg[0])
        block_text = "\n".join(seg)
        # real entry = has Type or Status field (skip schema example / Peek / fenced ### )
        if "**Type**" not in block_text and "**Status**" not in block_text:
            continue
        pm = re.search(r"knowledge/\S+\.md", field(seg, "Path") or "")
        cat = field(seg, "Category")
        entries.append({
            "heading": heading.strip(),
            "core": core_title(heading),
            "type": field(seg, "Type"),
            "category": cat.split()[0] if cat else "",
            "priority": field(seg, "Priority"),
            "status": field(seg, "Status"),
            "path": pm.group(0) if pm else "",
        })
    return entries


def apply_safe(text, removable_headings):
    """Remove blocks whose heading is in removable_headings, with line-conservation.
    Reattach trailing comment/blank lines to the next block so dividers travel correctly."""
    lines = text.split("\n")
    segs = split_blocks(lines)
    # reattach trailing separators of each block to the next segment
    def is_sep(l):
        return l.strip() == "" or l.strip().startswith("<!--")
    for i in range(len(segs) - 1):
        kind, seg = segs[i]
        if kind != "block":
            continue
        j = len(seg)
        while j > 1 and is_sep(seg[j - 1]):
            j -= 1
        tail = seg[j:]
        if tail:
            segs[i] = (kind, seg[:j])
            nk, nseg = segs[i + 1]
            segs[i + 1] = (nk, tail + nseg)
    out, removed_lines, removed = [], 0, []
    for kind, seg in segs:
        if kind == "block":
            heading = next((l for l in seg if l.startswith("### ")), seg[0]).strip()
            if heading in removable_headings:
                removed.append(heading)
                removed_lines += len(seg)
                continue
        out.extend(seg)
    conserved = len(lines) == len(out) + removed_lines
    sec_ok = sum(l.startswith("## ") for l in lines) == sum(l.startswith("## ") for l in out)
    return "\n".join(out), removed, conserved and sec_ok


def main():
    ap = argparse.ArgumentParser(description="ARTICLE-INBOX ground-truth audit + safe distill")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    ap.add_argument("--apply-safe", action="store_true",
                    help="remove DECLARED-DONE + GHOST-LOGGED (unambiguous), line-conservation guaranteed")
    ap.add_argument("--dry-run", action="store_true", help="with --apply-safe: preview, don't write")
    args = ap.parse_args()

    text = INBOX.read_text(encoding="utf-8")
    donelog_text = DONELOG.read_text(encoding="utf-8")
    by_stem, by_cat_stem = build_knowledge_index()
    entries = parse_pending(text)

    for e in entries:
        art, how = resolve_article(e, by_stem, by_cat_stem)
        e["article"], e["resolved_by"] = art, how
        cls, icon, why = classify(e, donelog_text)
        e["class"], e["icon"], e["why"] = cls, icon, why

    # dup detection by resolved article
    seen = {}
    for e in entries:
        if e["article"]:
            seen.setdefault(e["article"], []).append(e["heading"])
    dups = {k: v for k, v in seen.items() if len(v) > 1}

    order = ["DECLARED-DONE", "STALE-NEW", "PARTIAL-SHIP",
             "EVOLVE-PENDING", "GENUINE-PENDING", "SERIES"]
    counts = {c: sum(1 for e in entries if e["class"] == c) for c in order}
    removable = [e["heading"] for e in entries if e["class"] == "DECLARED-DONE"]

    if args.json:
        print(json.dumps({
            "total": len(entries), "counts": counts,
            "removable": len(removable), "dups": dups,
            "entries": [{k: e[k] for k in ("heading", "class", "type", "priority",
                                           "status", "article", "why")} for e in entries],
        }, ensure_ascii=False, indent=2))
        return 0

    if args.apply_safe:
        new_text, removed, ok = apply_safe(text, set(removable))
        print(f"=== --apply-safe: removing {len(removed)} unambiguous ghosts (DECLARED-DONE, status self-declared done) ===")
        for h in removed:
            print("  - " + h)
        print(f"line-conservation + section-survival: {'OK ✅' if ok else 'BROKEN ❌'}")
        if not ok:
            print("Aborted: line-conservation failed (refusing silent content loss)")
            return 2
        if args.dry_run:
            print("\n(dry-run; remove --dry-run to actually write)")
        else:
            INBOX.write_text(new_text, encoding="utf-8")
            print(f"\n*** Written to {INBOX.relative_to(ROOT)} *** (remember to ship DONE-LOG backfill + git)")
        return 0

    # human triage report
    print(f"# ARTICLE-INBOX audit — {len(entries)} pending entries\n")
    print(f"Summary: " + " / ".join(f"{c}={counts[c]}" for c in order if counts[c]))
    print(f"-> 🔴 Safe to remove {len(removable)} entries (--apply-safe); 🟠 STALE-NEW + ⚪ SERIES await manual review\n")
    for c in order:
        es = [e for e in entries if e["class"] == c]
        if not es:
            continue
        print(f"\n## {es[0]['icon']} {c}（{len(es)}）")
        for e in es:
            conf = {"fuzzy-stem": " ⚠fuzzy-confirm-scope"}.get(e["resolved_by"], "")
            tail = f" → {e['article']}{conf}" if e["article"] else ""
            print(f"- {e['core'] or e['heading'][4:][:40]}｜{e['type'] or '?'} {e['priority'] or '?'}｜{e['status'][:28]}{tail}")
    if dups:
        print(f"\n## 🔁 DUP ({len(dups)} articles referenced by multiple entries)")
        for art, hs in dups.items():
            print(f"- {art}: {len(hs)} entries")
    return 0


if __name__ == "__main__":
    sys.exit(main())
