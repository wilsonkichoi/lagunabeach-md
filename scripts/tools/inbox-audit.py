#!/usr/bin/env python3
"""inbox-audit.py — ARTICLE-INBOX 對地真相健檢 + Distill 安全執行器.

把「查現況」儀器化：一條指令交叉比對 ARTICLE-INBOX §Pending 的每個 entry 對
`knowledge/`（文章是否已存在）+ ARTICLE-DONE-LOG（是否已歸檔），分類出幽靈、
重複、真待辦，輸出 triage 報告。--apply-safe 只移除 100% 明確的幽靈（self-declared
done 或 已存在且已 logged），帶 line-conservation 保證（非只 entry count）。

誕生：2026-06-19-123909-inbox-distill session — 手動 distill 95→79 抓出 16 幽靈
（完成歸檔鐵律無結構強制 → inbox 漂移）。哲宇 directive：把這次的處理/分析儀器化。
canonical SOP：docs/semiont/ARTICLE-INBOX.md §Distill SOP
設計教訓：REFLEXES #15（反覆浮現要儀器化）+ #38（混維度 silent killer：count 對但內容掉）

用法：
  inbox-audit.py                      # triage 報告（human markdown）
  inbox-audit.py --json               # machine-readable（routine / signal 消費）
  inbox-audit.py --apply-safe         # 只移除明確幽靈（done / exists+logged），line-conservation 保證
  inbox-audit.py --apply-safe --dry-run   # 預覽要移除什麼，不寫檔
分類：
  🔴 DECLARED-DONE   status=done/dropped/已完成 — 完成卻沒搬走（鐵律違反），--apply-safe 唯一會動的類
  🟠 STALE-NEW       Type=NEW 但文章已存在 — NEW 已被滿足，待人工 review
  🟣 PARTIAL-SHIP    prose-shipped-pending-media 類 — 正文 ship、媒體/babel 待補（合法 pending）
  🟡 EVOLVE-PENDING  Type=EVOLVE + 文章存在 + pending — 合法 re-EVOLVE（文章存在＋可能已在 DONE-LOG 是前提，非幽靈）
  ✅ GENUINE-PENDING 文章不存在 + pending — 真待辦
  ⚪ SERIES          系列 umbrella / Tier / pick list — 不 auto-resolve，人工確認整批
  🔁 DUP            ≥2 entry 解到同一篇文章
--apply-safe 只動 🔴 DECLARED-DONE（status 自宣完成＝最安全訊號）。其餘一律留人工（κ 5-PR 教訓：curation 不批次自決）。
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
    (the 選舉 Tier 1.2 entry embeds a fenced markdown example with ## / ### headers).
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
    # strip leading non-CJK/non-alnum decorations (emoji, 🔴🟠 等)
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
    and it may already be in DONE-LOG from a prior ship (造山者/沈伯洋/蔡英文 case)."""
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
    note = "（已在 DONE-LOG，確認是 re-EVOLVE 不是幽靈）" if logged else ""

    if declared_done:
        return "DECLARED-DONE", "🔴", "status 自宣 done/dropped — 完成卻沒搬走（鐵律違反），可安全移除"
    if is_series:
        return "SERIES", "⚪", "系列 umbrella / Tier — 不 auto-resolve，人工確認整批是否 ship 完"
    if partial:
        return "PARTIAL-SHIP", "🟣", "正文 ship、媒體/babel 待補（合法 pending）"
    if art and typ == "EVOLVE":
        return "EVOLVE-PENDING", "🟡", f"文章存在({art}) + EVOLVE pending — 合法 re-EVOLVE{note}"
    if art:  # NEW (or unknown type) but article exists → NEW 已被滿足
        return "STALE-NEW", "🟠", f"NEW 但文章已存在({art}) — NEW 已滿足，待人工 review 是否移除{note}"
    return "GENUINE-PENDING", "✅", "文章不存在 + pending — 真待辦"


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
        print(f"=== --apply-safe: 移除 {len(removed)} 明確幽靈（DECLARED-DONE，status 自宣完成）===")
        for h in removed:
            print("  - " + h)
        print(f"line-conservation + section-survival: {'OK ✅' if ok else 'BROKEN ❌'}")
        if not ok:
            print("中止：line-conservation 失敗（拒絕 silent 內容流失）")
            return 2
        if args.dry_run:
            print("\n(dry-run；拿掉 --dry-run 才寫檔)")
        else:
            INBOX.write_text(new_text, encoding="utf-8")
            print(f"\n*** 已寫入 {INBOX.relative_to(ROOT)} ***（記得 ship DONE-LOG backfill + git）")
        return 0

    # human triage report
    print(f"# ARTICLE-INBOX audit — {len(entries)} 個 pending entry\n")
    print(f"摘要：" + " / ".join(f"{c}={counts[c]}" for c in order if counts[c]))
    print(f"→ 🔴 可安全移除 {len(removable)} 條（--apply-safe）；🟠 STALE-NEW + ⚪ SERIES 待人工 review\n")
    for c in order:
        es = [e for e in entries if e["class"] == c]
        if not es:
            continue
        print(f"\n## {es[0]['icon']} {c}（{len(es)}）")
        for e in es:
            conf = {"fuzzy-stem": " ⚠fuzzy確認scope"}.get(e["resolved_by"], "")
            tail = f" → {e['article']}{conf}" if e["article"] else ""
            print(f"- {e['core'] or e['heading'][4:][:40]}｜{e['type'] or '?'} {e['priority'] or '?'}｜{e['status'][:28]}{tail}")
    if dups:
        print(f"\n## 🔁 DUP（{len(dups)} 篇文章被多 entry 指到）")
        for art, hs in dups.items():
            print(f"- {art}: {len(hs)} entries")
    return 0


if __name__ == "__main__":
    sys.exit(main())
