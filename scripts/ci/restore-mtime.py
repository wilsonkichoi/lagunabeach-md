#!/usr/bin/env python3
"""restore-mtime.py — restore each git-tracked file's mtime to its last commit time.

Why (reports/build-pipeline-audit-2026-06-10.md hotspot #1):
  git checkout sets all file mtimes to checkout time, breaking OG image incremental generation
  (generate-og-images.mjs compares source mtime vs cache jpg mtime).
  Before 2026-05-26 used chetan/git-restore-mtime-action (archive keeps 404-ing),
  then switched to apt git-restore-mtime (git-tools 2022.12) which internally calls
  `git whatchanged`. GitHub runner git >= 2.51 deprecated that command ->
  12,343/12,352 files mtime not restored -> every build regenerates all 3,325 OG images (+66s).

  This file is a zero-dependency in-house implementation (~60 lines, single-pass streaming parse
  of git log --name-only), no longer dependent on external action / apt package survival.

Usage:
  python3 scripts/ci/restore-mtime.py                      # restore + stats
  python3 scripts/ci/restore-mtime.py --verify-min-ratio 0.9
      # exit 1 if restored ratio < 90% — CI regression guard (mtime system silently broke once,
      # must not silently break again)

2026-06-10 | build pipeline audit hotspot #1 fix
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys

SENTINEL = "\x01"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--verify-min-ratio", type=float, default=None,
                    help="exit 1 if restored/tracked ratio falls below this")
    args = ap.parse_args()

    tracked = set(
        subprocess.run(["git", "ls-files", "-z"], capture_output=True, check=True)
        .stdout.decode("utf-8", "surrogateescape").split("\0")
    )
    tracked.discard("")

    # Single-pass scan newest-to-oldest; first occurrence of a path = its last modified time.
    # core.quotepath=off outputs CJK filenames as-is (not C-escape quoted).
    proc = subprocess.Popen(
        ["git", "-c", "core.quotepath=off", "log", "--no-renames",
         f"--format={SENTINEL}%ct", "--name-only"],
        stdout=subprocess.PIPE,
    )

    remaining = set(tracked)
    restored = 0
    ct = None
    assert proc.stdout is not None
    for raw in proc.stdout:
        line = raw.decode("utf-8", "surrogateescape").rstrip("\n")
        if not line:
            continue
        if line.startswith(SENTINEL):
            ct = int(line[1:])
            continue
        if ct is None or line not in remaining:
            continue
        remaining.discard(line)
        try:
            os.utime(line, (ct, ct))
            restored += 1
        except OSError:
            pass
        if not remaining:
            break
    proc.stdout.close()
    proc.terminate()

    total = len(tracked)
    ratio = restored / total if total else 1.0
    print(f"restore-mtime: {restored}/{total} restored ({ratio:.1%}), "
          f"{len(remaining)} not found in log")

    if args.verify_min_ratio is not None and ratio < args.verify_min_ratio:
        print(f"❌ restored ratio {ratio:.1%} < {args.verify_min_ratio:.0%} — "
              f"mtime incremental system may be broken again (see reports/build-pipeline-audit-2026-06-10.md #1)",
              file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
