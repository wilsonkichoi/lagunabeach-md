#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# build-parity-diff.sh — HTML parity comparison between two dist trees
# ─────────────────────────────────────────────────────────────────
#
# Refactor verification gate: normalizes out legitimate per-build noise from Astro
# (asset hash filenames / scope ids); everything else must be byte-identical.
#
# Usage (typical refactor A/B flow):
#   npx astro build && mv dist /tmp/dist-baseline     # before refactor
#   <do refactor>
#   npx astro build                                    # after refactor
#   bash scripts/tools/build-parity-diff.sh /tmp/dist-baseline dist
#
# Output: first 3 content-diff files + summary PARITY: PASS/FAIL.
# Full diff file list written to /tmp/parity-diff-files.txt.
#
# Warning: both builds must have frozen "input" (knowledge/ + src/content/ +
# public/api/*.json unchanged, git HEAD unchanged). Parallel routines (babel etc.) write
# knowledge/ — see reports/article-template-refactor-2026-06-13.md section 7.2 for SOP.
#
# Origin: 2026-06-13 refactor-article session. First sed version used `|` as both
# delimiter and alternation -> produced empty output on error -> 5,268 files empty-vs-empty
# false PASS. Lesson: "verifiers lie too" -> normalizer has self-test (sample file
# output < 100 bytes = exit 2). This guard is the credibility source; do not remove.
# ─────────────────────────────────────────────────────────────────
set -uo pipefail
if [ $# -ne 2 ]; then
  echo "Usage: $0 <dist-baseline> <dist-after>" >&2
  exit 1
fi
A="$1"; B="$2"
[ -d "$A" ] && [ -d "$B" ] || { echo "ERROR: both dist directories must exist" >&2; exit 1; }

norm() {
  sed -E \
    -e 's#/_astro/[A-Za-z0-9._-]+\.[A-Za-z0-9_-]{8,12}\.(css|js)#/_astro/ASSET.\1#g' \
    -e 's#astro-[a-zA-Z0-9]{6,10}#astro-SCOPE#g' \
    -e 's#data-astro-cid-[a-z0-9]{8,12}#data-astro-cid-X#g'
}

# Self-test: normalizer must produce non-empty output on real files (prevents sed silent failure -> false PASS)
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
  echo "PARITY: FAIL (diff list at /tmp/parity-diff-files.txt)"
  exit 1
fi
