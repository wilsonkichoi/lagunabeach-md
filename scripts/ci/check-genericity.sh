#!/usr/bin/env bash
#
# check-genericity.sh — the genericity gate.
#
# Fails if any place-specific string leaks into framework-owned code (src/ or
# scripts/). Place identity must flow ONLY through place.config.ts, knowledge/,
# and public/media/ — never hardcoded in src/ or scripts/ (ADR 002, SPEC
# §Negative requirements, §G risk 2). This is the structural mitigation for the
# trap that motivated the whole rebuild.
#
# Scan scope: src/ and scripts/ only. place.config.ts (repo root), knowledge/,
# public/media/, and docs/ hold place identity legitimately and are outside the
# scan roots by construction; the denylist file itself is inside scripts/ and is
# excluded explicitly (it necessarily contains the forbidden terms).
#
# Usage: bash scripts/ci/check-genericity.sh   (run from anywhere; exit 1 on hit)

set -euo pipefail

# Unset CDPATH: with it set, `cd` echoes the resolved dir into the command
# substitution and corrupts ROOT.
unset CDPATH
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." >/dev/null 2>&1 && pwd)"
DENYLIST="$ROOT/scripts/ci/genericity-denylist.txt"

if [ ! -f "$DENYLIST" ]; then
  echo "genericity: denylist not found at $DENYLIST" >&2
  exit 2
fi

# Build an alternation pattern from the denylist (drop comments/blank lines, join
# with |). Avoids `mapfile` so the script runs on macOS bash 3.2 as well as CI.
PATTERN="$(grep -vE '^[[:space:]]*(#|$)' "$DENYLIST" | paste -sd '|' -)"
if [ -z "$PATTERN" ]; then
  echo "genericity: denylist is empty — nothing to check" >&2
  exit 0
fi

# Scan roots (skip any that don't exist yet — scripts/ arrives with this task).
SCAN_ROOTS=()
[ -d "$ROOT/src" ] && SCAN_ROOTS+=("$ROOT/src")
[ -d "$ROOT/scripts" ] && SCAN_ROOTS+=("$ROOT/scripts")
if [ "${#SCAN_ROOTS[@]}" -eq 0 ]; then
  echo "✓ genericity gate passed — no src/ or scripts/ to scan"
  exit 0
fi

# grep -I skips binary files; exclude node_modules and the denylist itself.
HITS="$(grep -rniIE "$PATTERN" "${SCAN_ROOTS[@]}" \
  --exclude-dir=node_modules \
  --exclude="genericity-denylist.txt" || true)"

if [ -n "$HITS" ]; then
  echo "❌ genericity gate FAILED — place-specific strings in framework-owned code:" >&2
  echo "$HITS" >&2
  echo >&2
  echo "Place identity belongs in place.config.ts / knowledge/ / public/media/, not src/ or scripts/." >&2
  exit 1
fi

echo "✓ genericity gate passed — no denylisted terms in src/ or scripts/"
