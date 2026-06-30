#!/usr/bin/env python3
"""
lessons-distill.py — LESSONS-INBOX distill 助手（把 distill 的handle/分析/歸檔儀器化）

把 2026-06-19 full distill（§undigested 266→8）的手工flow固化成tool，讓未來 distill
更方便、更精煉。三子指令corresponding distill 三吃力環節：

 audit — distill 前「現場Sensing」：§undigested count / structurefull性 / Stage 0a housekeeping
 candidate / severity+vc Sort / cross-check inbox-signal 門檻
 chunk — 「分析」環節 fan-out 準備：把 §undigested 切成 N 段 line range，餵給parallel
 read-only 子代聚類（few patterns × many instances）
 sweep — 「歸檔handle」環節：deterministic keeper-based sweep，Remove已 distill 的
 entry、Merge多 §undigested section、Keep §digested/§Defer/§歸檔 verbatim

Design principles：
- 讀（分析）parallel化、寫（歸檔）deterministic。LLM 判斷不外包給 script，但聚類 prep
 + 機械 sweep Can（REFLEXES「fan-out read + deterministic sweep」）。
- sweep dry-run by default，--apply 才寫；Keep數 0 會 refuse（防呆 — 不可能整批 drop）。
- audit 自己 cross-verify ground truth grep count（REFLEXES #65），不只信single regex。

canonical：docs/semiont/LESSONS-INBOX.md §Distill SOP（6-stage）+ REFLEXES #15 / #72。
"""
import argparse
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DEFAULT_LESSONS = REPO / "docs/semiont/LESSONS-INBOX.md"

UNMET_RE = re.compile(r"^## .*undigestedlist")        # 只配 content section（SOP 內無此 H2）
CONSUMED_RE = re.compile(r"^## ✅ digested")
ARCHIVED_RE = re.compile(r"^## ❌ 已歸檔")
ENTRY_RE = re.compile(r"^### ")
H2_RE = re.compile(r"^## ")
DONE_MARKERS = re.compile(
    r"✅ DISTILLED|✅ 已 distilled|resolved_by|status.*✅|已 instantiate|DISTILLED ✅"
)
VC_RE = re.compile(r"verification_count[:\s]*(\d+)|vc[:=]\s*(\d+)|vc=(\d+)")
STRUCTURAL_RE = re.compile(r"severity.{0,15}structural")


def load(path):
    return Path(path).read_text(encoding="utf-8").split("\n")


def find_all(lines, rx):
    return [i for i, l in enumerate(lines) if rx.match(l)]


def find_first(lines, rx):
    for i, l in enumerate(lines):
        if rx.match(l):
            return i
    return None


def entry_blocks(lines, start, end):
 """extract [start,end) inside的 entries：Each entry From ### 到下一 ### / ## before。"""
    seg = lines[start:end]
    idxs = [k for k, l in enumerate(seg) if ENTRY_RE.match(l)]
    blocks = []
    for n, k in enumerate(idxs):
        nxt = idxs[n + 1] if n + 1 < len(idxs) else len(seg)
        blocks.append((start + k, [seg[j] for j in range(k, nxt)]))
    return blocks  # list of (abs_line, [lines])


def unmet_spans(lines):
 """returns all §undigested section 的 (header_idx, end_idx)。end = 下一 ## 或 EOF。"""
    heads = find_all(lines, UNMET_RE)
    spans = []
    for h in heads:
        end = next((i for i in range(h + 1, len(lines)) if H2_RE.match(lines[i])), len(lines))
        spans.append((h, end))
    return spans


def all_unmet_entries(lines):
    out = []
    for h, end in unmet_spans(lines):
        out += entry_blocks(lines, h, end)
    return out


def vc_of(block):
    best = 0
    for l in block:
        for m in VC_RE.finditer(l):
            for g in m.groups():
                if g:
                    best = max(best, int(g))
    return best


# ---------------------------------------------------------------- audit
def cmd_audit(args):
    lines = load(args.file)
    spans = unmet_spans(lines)
    entries = all_unmet_entries(lines)
    n = len(entries)

    print(f"📥 LESSONS-INBOX distill audit — {args.file}")
 print(f" §undigested entries: {n}（門檻 200 → {'⚠️ distill due' if n >= 200 else 'ok'}）")

 # cross-verify ground truth grep count（REFLEXES #65 — 不只信 regex span）
    raw = sum(
        1
        for i, l in enumerate(lines)
        if ENTRY_RE.match(l)
        and any(h < i < e for h, e in spans)
    )
 flag = "✅ alignment" if raw == n else f"⚠️ regex {n} vs grep {raw} 不一致"
    print(f"   ground-truth cross-check: {flag}")

 # structuredrift：多 §undigested section
    if len(spans) > 1:
        hdrs = ", ".join(f"L{h+1}" for h, _ in spans)
 print(f" 🚨 structuredrift：{len(spans)} §undigested section（{hdrs}）→ sweep 會automaticMerge")
    else:
 print(f" §undigested section: 1（無drift）")

 # Stage 0a：self-marked done 但仍在 §undigested（housekeeping candidate）
    done = [(ln, b) for ln, b in entries if any(DONE_MARKERS.search(x) for x in b)]
 print(f"\n Stage 0a housekeeping candidate（self-marked done 仍在 §undigested）：{len(done)}")
    for ln, b in done[: args.top]:
        print(f"     L{ln+1}  {b[0][4:][:64]}")

 # severity=structural + 高 vc priority（distill triage 順序）
    structural = [(ln, b) for ln, b in entries if any(STRUCTURAL_RE.search(x) for x in b)]
    ranked = sorted(entries, key=lambda t: vc_of(t[1]), reverse=True)
 print(f"\n severity=structural: {len(structural)} ")
 print(f" 高 vc top（distill 先看）：")
    for ln, b in ranked[: args.top]:
        v = vc_of(b)
        if v >= 2:
            print(f"     vc={v}  {b[0][4:][:60]}")

    if n >= 200:
 print(f"\n → suggestion：`lessons-distill.py chunk --agents N` 起 fan-out 分析（見 §Distill SOP §分析method）")
    return 0


# ---------------------------------------------------------------- chunk
def cmd_chunk(lines_or_args):
    args = lines_or_args
    lines = load(args.file)
    entries = all_unmet_entries(lines)
    if not entries:
 print("§undigested 無 entry，不需 chunk", file=sys.stderr)
        return 1
    k = args.agents
    per = max(1, (len(entries) + k - 1) // k)
    print(f"# fan-out {k}-agent 分析 chunk（§undigested {len(entries)} entries / ~{per} 每段）")
    print(f"# 每段派一個 read-only 子代讀 line range，return cluster（pattern × instances + disposition）")
    print(f"# disposition 六桶：promote / housekeeping-done / fold→reflex / already-covered / operational→pipeline / stale")
    for a in range(0, len(entries), per):
        chunk = entries[a : a + per]
        start = chunk[0][0] + 1
 # end = 下一 chunk 第一 entry header，或最後 entry 結尾
        nxt_idx = a + per
        if nxt_idx < len(entries):
            end = entries[nxt_idx][0]
        else:
            end = chunk[-1][0] + len(chunk[-1][1])
 print(f" agent {a//per+1}: 讀 {Path(args.file).name} 行 {start}-{end}（{len(chunk)} entries）")
    return 0


# ---------------------------------------------------------------- sweep
def cmd_sweep(args):
    path = Path(args.file)
    lines = load(path)
    spans = unmet_spans(lines)
    if not spans:
 print("Not found §undigested section", file=sys.stderr)
        return 1
    i_consumed = find_first(lines, CONSUMED_RE)
    i_archived = find_first(lines, ARCHIVED_RE)
    if i_consumed is None or i_archived is None:
 print("Not found §digested 或 §歸檔 section（filestructureabnormal）", file=sys.stderr)
        return 1

    keepers = []
    if args.keep:
        src = sys.stdin if args.keep == "-" else open(args.keep, encoding="utf-8")
        keepers = [l.strip() for l in src if l.strip() and not l.startswith("#")]

    def keep(block):
        return any(k in block[0] for k in keepers)

    entries = all_unmet_entries(lines)
    kept = [b for _, b in entries if keep(b)]
    dropped = len(entries) - len(kept)

 print(f"sweep: §undigested {len(entries)} → keep {len(kept)} / drop {dropped}（keeper substrings: {len(keepers)}）")
    for b in kept:
        print(f"   KEEP  {b[0][4:][:64]}")

    if len(kept) == 0 and not args.force:
 print("\n🚫 Keep 0 — 整批 drop 不合理（keeper allowlist 可能寫錯）。確定請加 --force", file=sys.stderr)
        return 2
    if not args.apply:
 print(f"\n(dry-run — 加 --apply 才Write。會Merge {len(spans)} §undigested section 為 1)")
        return 0

 # rebuild: prefix + 第一 §undigested header+intro + kept entries + 中段(§digested~§Defer) + §歸檔
    h0, e0 = spans[0]
    seg0 = lines[h0:e0]
    first_e = next((k for k, l in enumerate(seg0) if ENTRY_RE.match(l)), len(seg0))
    intro = seg0[:first_e]
    while intro and intro[-1].strip() == "":
        intro.pop()

    def strip_blanks(b):
        b = list(b)
        while b and b[-1].strip() == "":
            b.pop()
        return b

    out = lines[:h0] + intro + [""]
    for b in kept:
        out += strip_blanks(b) + [""]

 # 中段：§digested → §歸檔，但Skippedany夾在中間的other §undigested section
    mid = []
    skip_until = None
    for i in range(i_consumed, i_archived):
 if any(i == h for h, _ in spans): # 額外 §undigested header → skip 整段
            skip_until = next((e for h, e in spans if h == i), i + 1)
        if skip_until is not None and i < skip_until:
            continue
        mid.append(lines[i])
    out += mid

 # 若指定 --record，把 distill traceability block append 進 §digested（在 §Defer before）
    if args.record:
        rec = Path(args.record).read_text(encoding="utf-8").rstrip("\n")
 # 插在 mid 的 §Defer header before（mid inside第一 ## Defer），Otherwise mid 結尾
        insert_at = None
        for j, l in enumerate(out):
            if j >= (len(lines[:h0]) + len(intro) + 1) and l.startswith("## Defer 給觀察者拍板（"):
                insert_at = j
                break
        block = rec.split("\n") + [""]
        if insert_at is not None:
            out = out[:insert_at] + block + out[insert_at:]
        else:
            out += [""] + block

    out += lines[i_archived:]
    path.write_text("\n".join(out), encoding="utf-8")
 print(f"\n✅ written — §undigested {len(entries)}→{len(kept)}，{len(spans)} section Merge為 1")
    return 0


def main():
    base = argparse.ArgumentParser(add_help=False)
    base.add_argument("--file", default=str(DEFAULT_LESSONS), help="LESSONS-INBOX path")

    p = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter, parents=[base]
    )
    sub = p.add_subparsers(dest="cmd", required=True)

 a = sub.add_parser("audit", parents=[base], help="§undigested structure + Stage 0a + triage Sort")
    a.add_argument("--top", type=int, default=12)
    a.set_defaults(fn=cmd_audit)

 c = sub.add_parser("chunk", parents=[base], help="fan-out 分析 line-range 切段")
    c.add_argument("--agents", type=int, default=6)
    c.set_defaults(fn=cmd_chunk)

    s = sub.add_parser("sweep", parents=[base], help="deterministic keeper-based sweep（dry-run default）")
 s.add_argument("--keep", help="keeper allowlist 檔（每行一 ### header substring；- = stdin）")
 s.add_argument("--record", help="distill traceability block 檔，append 進 §digested")
 s.add_argument("--apply", action="store_true", help="Actually write（Otherwise dry-run）")
 s.add_argument("--force", action="store_true", help="AllowKeep 0 （危險）")
    s.set_defaults(fn=cmd_sweep)

    args = p.parse_args()
    sys.exit(args.fn(args))


if __name__ == "__main__":
    main()
