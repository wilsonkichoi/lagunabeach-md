#!/usr/bin/env python3
"""
lessons-distill.py — LESSONS-INBOX distill helper (instruments the process/analysis/archive workflow)

Codifies the manual workflow from the 2026-06-19 full distill (undigested 266->8) into
a reusable tool for future distills. Three subcommands match three labor-intensive stages:

  audit  — pre-distill "situation awareness": undigested count / structural integrity /
           Stage 0a housekeeping candidates / severity+vc ranking / cross-check inbox-signal threshold
  chunk  — "analysis" stage fan-out preparation: split undigested section into N line ranges
           for parallel read-only sub-agent clustering (few patterns x many instances)
  sweep  — "archive" stage: deterministic keeper-based sweep, remove already-distilled
           entries, merge multiple undigested sections, preserve consumed/Defer/archive verbatim

Design principles:
- Reads (analysis) parallelized, writes (archiving) deterministic. LLM judgment not
  outsourced to script, but cluster prep + mechanical sweep can be (REFLEXES "fan-out read +
  deterministic sweep").
- sweep dry-run by default, --apply to write; refuses if keep count = 0 (safety — impossible
  to legitimately drop entire batch).
- audit self-verifies ground truth grep count (REFLEXES #65), not trusting a single regex.

Canonical: docs/semiont/LESSONS-INBOX.md Distill SOP (6-stage) + REFLEXES #15 / #72.
"""
import argparse
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DEFAULT_LESSONS = REPO / "docs/semiont/LESSONS-INBOX.md"

UNMET_RE = re.compile(r"^## .*未消化清單")        # matches content section only (SOP has no such H2)
CONSUMED_RE = re.compile(r"^## ✅ 已消化")
ARCHIVED_RE = re.compile(r"^## ❌ 已歸檔")
ENTRY_RE = re.compile(r"^### ")
H2_RE = re.compile(r"^## ")
DONE_MARKERS = re.compile(
    r"✅ DISTILLED|✅ 已 distilled|resolved_by|狀態.*✅|已 instantiate|DISTILLED ✅"
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
    """Extract entries within [start,end): each entry runs from ### to the next ### or ##."""
    seg = lines[start:end]
    idxs = [k for k, l in enumerate(seg) if ENTRY_RE.match(l)]
    blocks = []
    for n, k in enumerate(idxs):
        nxt = idxs[n + 1] if n + 1 < len(idxs) else len(seg)
        blocks.append((start + k, [seg[j] for j in range(k, nxt)]))
    return blocks  # list of (abs_line, [lines])


def unmet_spans(lines):
    """Return all undigested section spans as (header_idx, end_idx). end = next ## or EOF."""
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
    print(f"   Undigested entries: {n} (threshold 200 -> {'⚠️ distill due' if n >= 200 else 'ok'})")

    # cross-verify ground truth grep count (REFLEXES #65 — don't trust single regex)
    raw = sum(
        1
        for i, l in enumerate(lines)
        if ENTRY_RE.match(l)
        and any(h < i < e for h, e in spans)
    )
    flag = "✅ aligned" if raw == n else f"⚠️ regex {n} vs grep {raw} mismatch"
    print(f"   ground-truth cross-check: {flag}")

    # Structural drift: multiple undigested sections
    if len(spans) > 1:
        hdrs = ", ".join(f"L{h+1}" for h, _ in spans)
        print(f"   🚨 Structural drift: {len(spans)} undigested sections ({hdrs}) -> sweep will auto-merge")
    else:
        print(f"   Undigested sections: 1 (no drift)")

    # Stage 0a: self-marked done but still in undigested (housekeeping candidates)
    done = [(ln, b) for ln, b in entries if any(DONE_MARKERS.search(x) for x in b)]
    print(f"\n   Stage 0a housekeeping candidates (self-marked done still in undigested): {len(done)}")
    for ln, b in done[: args.top]:
        print(f"     L{ln+1}  {b[0][4:][:64]}")

    # severity=structural + high vc priority (distill triage order)
    structural = [(ln, b) for ln, b in entries if any(STRUCTURAL_RE.search(x) for x in b)]
    ranked = sorted(entries, key=lambda t: vc_of(t[1]), reverse=True)
    print(f"\n   severity=structural: {len(structural)} entries")
    print(f"   High vc top (distill priority):")
    for ln, b in ranked[: args.top]:
        v = vc_of(b)
        if v >= 2:
            print(f"     vc={v}  {b[0][4:][:60]}")

    if n >= 200:
        print(f"\n   -> Suggestion: `lessons-distill.py chunk --agents N` for fan-out analysis (see Distill SOP)")
    return 0


# ---------------------------------------------------------------- chunk
def cmd_chunk(lines_or_args):
    args = lines_or_args
    lines = load(args.file)
    entries = all_unmet_entries(lines)
    if not entries:
        print("Undigested section has no entries, chunk not needed", file=sys.stderr)
        return 1
    k = args.agents
    per = max(1, (len(entries) + k - 1) // k)
    print(f"# fan-out {k}-agent analysis chunk (undigested {len(entries)} entries / ~{per} per chunk)")
    print(f"# Each chunk gets one read-only sub-agent reading line range, returning clusters (pattern x instances + disposition)")
    print(f"# disposition 6 buckets: promote / housekeeping-done / fold->reflex / already-covered / operational->pipeline / stale")
    for a in range(0, len(entries), per):
        chunk = entries[a : a + per]
        start = chunk[0][0] + 1
        # end = next chunk's first entry header, or last entry's end
        nxt_idx = a + per
        if nxt_idx < len(entries):
            end = entries[nxt_idx][0]
        else:
            end = chunk[-1][0] + len(chunk[-1][1])
        print(f"  agent {a//per+1}: read {Path(args.file).name} lines {start}-{end} ({len(chunk)} entries)")
    return 0


# ---------------------------------------------------------------- sweep
def cmd_sweep(args):
    path = Path(args.file)
    lines = load(path)
    spans = unmet_spans(lines)
    if not spans:
        print("Cannot find undigested section", file=sys.stderr)
        return 1
    i_consumed = find_first(lines, CONSUMED_RE)
    i_archived = find_first(lines, ARCHIVED_RE)
    if i_consumed is None or i_archived is None:
        print("Cannot find consumed or archived section (abnormal file structure)", file=sys.stderr)
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

    print(f"sweep: undigested {len(entries)} -> keep {len(kept)} / drop {dropped} (keeper substrings: {len(keepers)})")
    for b in kept:
        print(f"   KEEP  {b[0][4:][:64]}")

    if len(kept) == 0 and not args.force:
        print("\n🚫 Keep 0 entries — dropping entire batch is unreasonable (keeper allowlist may be wrong). Use --force to confirm", file=sys.stderr)
        return 2
    if not args.apply:
        print(f"\n(dry-run — use --apply to write. Will merge {len(spans)} undigested sections into 1)")
        return 0

    # rebuild: prefix + first undigested header+intro + kept entries + mid-section (consumed~Defer) + archived
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

    # Mid-section: consumed -> archived, but skip any extra undigested sections in between
    mid = []
    skip_until = None
    for i in range(i_consumed, i_archived):
        if any(i == h for h, _ in spans):  # extra undigested header -> skip entire span
            skip_until = next((e for h, e in spans if h == i), i + 1)
        if skip_until is not None and i < skip_until:
            continue
        mid.append(lines[i])
    out += mid

    # If --record specified, append distill traceability block into consumed section (before Defer)
    if args.record:
        rec = Path(args.record).read_text(encoding="utf-8").rstrip("\n")
        # Insert before Defer header in mid (first ## Defer in mid), or at end of mid
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
    print(f"\n✅ written — undigested {len(entries)}->{len(kept)}, {len(spans)} sections merged into 1")
    return 0


def main():
    base = argparse.ArgumentParser(add_help=False)
    base.add_argument("--file", default=str(DEFAULT_LESSONS), help="LESSONS-INBOX path")

    p = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter, parents=[base]
    )
    sub = p.add_subparsers(dest="cmd", required=True)

    a = sub.add_parser("audit", parents=[base], help="undigested structure + Stage 0a + triage ranking")
    a.add_argument("--top", type=int, default=12)
    a.set_defaults(fn=cmd_audit)

    c = sub.add_parser("chunk", parents=[base], help="fan-out analysis line-range splitting")
    c.add_argument("--agents", type=int, default=6)
    c.set_defaults(fn=cmd_chunk)

    s = sub.add_parser("sweep", parents=[base], help="deterministic keeper-based sweep (dry-run default)")
    s.add_argument("--keep", help="keeper allowlist file (one ### header substring per line; - = stdin)")
    s.add_argument("--record", help="distill traceability block file, appended to consumed section")
    s.add_argument("--apply", action="store_true", help="actually write (otherwise dry-run)")
    s.add_argument("--force", action="store_true", help="allow keeping 0 entries (dangerous)")
    s.set_defaults(fn=cmd_sweep)

    args = p.parse_args()
    sys.exit(args.fn(args))


if __name__ == "__main__":
    main()
