#!/usr/bin/env python3
"""restore-mtime.py — 把Each git-tracked file的 mtime restore成它最後一次 commit 的時間。

Why (reports/build-pipeline-audit-2026-06-10.md 熱點 #1):
 git checkout 把allfile mtime 設成 checkout 當下，OG 圖incrementalGenerate
 （generate-og-images.mjs 比 source mtime vs cache jpg mtime）因此全失效。
 2026-05-26 before用 chetan/git-restore-mtime-action（archive 持續 404），
 after換 apt 版 git-restore-mtime（git-tools 2022.12）— 它inside部call
 `git whatchanged`，GitHub runner 的 git ≥ 2.51 已廢除該指令 →
 12,343/12,352 file mtime 沒restore → 每 build full重產 3,325 OG（+66s）。

 本檔是零Dependencies的自有implement（~60 行，git log --name-only 單趟流式Parse），
 不再Dependenciesexternal action / apt package的存活。

Usage:
 python3 scripts/ci/restore-mtime.py # restore + statistics
  python3 scripts/ci/restore-mtime.py --verify-min-ratio 0.9
 # restore比例 < 90% 時 exit 1 — CI 防回歸 guard（mtime 體系靜默全壞過一次，
 # 不准再靜默壞第二次）

2026-06-10 | build pipeline audit 熱點 #1 Fix
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
 help="restored/tracked 低於此比例時 exit 1")
    args = ap.parse_args()

    tracked = set(
        subprocess.run(["git", "ls-files", "-z"], capture_output=True, check=True)
        .stdout.decode("utf-8", "surrogateescape").split("\0")
    )
    tracked.discard("")

 # 新 → 舊單趟Scan；Eachpath第一次出現的 commit time = 它最後被改的時間。
 # core.quotepath=off 讓Chinesefilename以原樣Output（不被 C-escape 引號包裹）。
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
 f"mtime incremental體系疑似又壞了（見 reports/build-pipeline-audit-2026-06-10.md #1）",
              file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
