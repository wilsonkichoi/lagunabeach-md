#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# build-parity-diff.sh — 兩 dist 樹的 HTML parity Compare
# ─────────────────────────────────────────────────────────────────
#
# Refactor Verifygate：normalize 掉 Astro 每次 build 合法變動的雜訊
# （asset hash filename / scope id），其餘Must byte-identical。
#
# Usage（典型 refactor A/B flow）：
# npx astro build && mv dist /tmp/dist-baseline # refactor 前
# <做 refactor>
# npx astro build # refactor 後
#   bash scripts/tools/build-parity-diff.sh /tmp/dist-baseline dist
#
# Output：Each content-diff file列前 3 + 總結 PARITY: PASS/FAIL。
# full diff filelist寫到 /tmp/parity-diff-files.txt。
#
# ⚠️ Compare前提：兩輪 build 的「input」Must凍結（knowledge/ + src/content/ +
# public/api/*.json 不變、git HEAD 不動）。parallel routine（babel 等）會寫
# knowledge/ — 處置 SOP 見 reports/article-template-refactor-2026-06-13.md §7.2
# （備份未 commit 變更 → checkout restore → build → 逐檔restore）。
#
# 誕生：2026-06-13 refactor-article session。第一版 sed 用 `|` 同時當
# delimiter 跟 alternation → Error時Output空檔 → 5,268 檔 empty-vs-empty
# 假 PASS。lesson「Verify器也會說謊」→ normalizer 自帶 self-test（樣本檔
# Output < 100 bytes 即 exit 2），這 guard 是本tool的可信度Source，不可Remove。
# ─────────────────────────────────────────────────────────────────
set -uo pipefail
if [ $# -ne 2 ]; then
  echo "Usage: $0 <dist-baseline> <dist-after>" >&2
  exit 1
fi
A="$1"; B="$2"
[ -d "$A" ] && [ -d "$B" ] || { echo "ERROR: 兩 dist directory都要exists" >&2; exit 1; }

norm() {
  sed -E \
    -e 's#/_astro/[A-Za-z0-9._-]+\.[A-Za-z0-9_-]{8,12}\.(css|js)#/_astro/ASSET.\1#g' \
    -e 's#astro-[a-zA-Z0-9]{6,10}#astro-SCOPE#g' \
    -e 's#data-astro-cid-[a-z0-9]{8,12}#data-astro-cid-X#g'
}

# Self-test：normalizer 在真實file上Mustoutput非空Output（防 sed 靜默Failed → 假 PASS）
sample=$(find "$A" -name "index.html" | head -1)
if [ -z "$sample" ] || [ "$(norm < "$sample" | wc -c)" -lt 100 ]; then
  echo "NORMALIZER SELF-TEST FAILED on ${sample:-<no html found>}" >&2
  exit 2
fi
echo "normalizer self-test ok ($(norm < "$sample" | wc -c | tr -d ' ') bytes from sample)"

fail=0
( cd "$A" && find . -name "*.html" | sort ) > /tmp/parity-files-a.txt
( cd "$B" && find . -name "*.html" | sort ) > /tmp/parity-files-b.txt
if ! diff -q /tmp/parity-files-a.txt /tmp/parity-files-b.txt > /dev/null; then
  echo "FILE SET DIFFERS:"
  diff /tmp/parity-files-a.txt /tmp/parity-files-b.txt | head -20 || true
  fail=1
fi

count=0; diffs=0
: > /tmp/parity-diff-files.txt
while IFS= read -r f; do
  count=$((count+1))
  if ! cmp -s <(norm < "$A/$f") <(norm < "$B/$f"); then
    diffs=$((diffs+1))
    echo "$f" >> /tmp/parity-diff-files.txt
    if [ "$diffs" -le 3 ]; then
      echo "DIFF: $f"
      { diff <(norm < "$A/$f") <(norm < "$B/$f") || true; } | head -10
    fi
  fi
done < /tmp/parity-files-a.txt

echo "---"
echo "checked=$count htmlfiles, content-diff=$diffs, fileset-fail=$fail"
if [ "$diffs" -eq 0 ] && [ "$fail" -eq 0 ]; then
  echo "PARITY: PASS"
else
 echo "PARITY: FAIL（diff list在 /tmp/parity-diff-files.txt）"
  exit 1
fi
