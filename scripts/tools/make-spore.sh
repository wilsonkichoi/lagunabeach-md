#!/usr/bin/env bash
# make-spore.sh — One-command spore image generation (+ auto-preview + print blueprint copy)
#
# Usage:
#   bash scripts/tools/make-spore.sh /art/festival-of-arts/              # default landscape + square
#   bash scripts/tools/make-spore.sh /history/art-colony/ --size vertical
#   bash scripts/tools/make-spore.sh /art/festival-of-arts/ --all        # all three sizes
#   bash scripts/tools/make-spore.sh /art/festival-of-arts/ --prod       # skip dev server
#   bash scripts/tools/make-spore.sh /art/festival-of-arts/ --title "..." --desc "..."
#
# Default behavior (2026-04-19 upgrade):
#   Produces landscape + square — landscape for X / Threads feed,
#   square for Threads preview without cropping. Use --size X for just one.
#
# After generation:
#   1. open -a Preview opens all produced PNGs
#   2. open -R highlights file location in Finder
#   3. If docs/factory/SPORE-BLUEPRINTS/*{slug}*.md exists, prints the copy block
#
# REFLEXES #26 v2: AI generates image + prints copy, posting is human-only.

set -euo pipefail

TARGET=""
EXPLICIT_SIZE=""     # if set, only produce this one
PRODUCE_ALL=0        # if set, produce landscape + square + vertical
USE_PROD=0
TITLE_OVERRIDE=""
DESC_OVERRIDE=""

# Parse args: first positional is target; --flag args pass through
while [[ $# -gt 0 ]]; do
  case "$1" in
    --size) EXPLICIT_SIZE="$2"; shift 2 ;;
    --all) PRODUCE_ALL=1; shift ;;
    --prod) USE_PROD=1; shift ;;
    --title) TITLE_OVERRIDE="$2"; shift 2 ;;
    --desc) DESC_OVERRIDE="$2"; shift 2 ;;
    landscape|square|vertical) EXPLICIT_SIZE="$1"; shift ;;  # backward compat: 2nd positional
    -h|--help)
      sed -n '1,20p' "$0" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *)
      if [[ -z "$TARGET" ]]; then TARGET="$1"; else
        echo "Unknown argument: $1" >&2; exit 2
      fi
      shift ;;
  esac
done

if [[ -z "$TARGET" ]]; then
  echo "Usage: bash $0 <article-path-or-url> [--size X] [--all] [--prod] [--title ...] [--desc ...]" >&2
  echo "Default: produces landscape + square" >&2
  echo "Example: bash $0 /art/festival-of-arts/          # landscape + square" >&2
  echo "         bash $0 /art/festival-of-arts/ --size vertical   # vertical only" >&2
  echo "         bash $0 /art/festival-of-arts/ --all             # all three" >&2
  echo "         bash $0 /art/festival-of-arts/ --prod            # skip dev server" >&2
  exit 2
fi

# Decide size list
if [[ -n "$EXPLICIT_SIZE" ]]; then
  SIZES=("$EXPLICIT_SIZE")
elif [[ $PRODUCE_ALL -eq 1 ]]; then
  SIZES=(landscape square vertical)
else
  SIZES=(landscape square)
fi

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

# ── Detect dev port from .claude/launch.json ────────────────────────────────
# launch.json is the SSOT for the dev server port. Hardcoding 4321 breaks when
# the dev server runs on a different port. Look for name=="taiwan-md" config
# and extract port; fallback to 4321.
DEV_PORT=4321
if [[ -f .claude/launch.json ]]; then
  detected=$(python3 -c '
import json, sys
try:
    cfg = json.load(open(".claude/launch.json"))
    for c in cfg.get("configurations", []):
        if c.get("name") == "taiwan-md" and c.get("port"):
            print(c["port"]); sys.exit(0)
except Exception:
    pass
' 2>/dev/null || true)
  [[ -n "$detected" ]] && DEV_PORT="$detected"
fi
DEV_BASE="http://localhost:${DEV_PORT}"

# ── Extract slug (shared across sizes) ──────────────────────────────────────
BASE_GEN_ARGS=()
if [[ "$TARGET" == http* ]]; then
  BASE_GEN_ARGS+=(--url "$TARGET")
  SLUG="$(echo "$TARGET" | sed -E 's|.*/([^/]+)/?$|\1|' | python3 -c 'import sys, urllib.parse; print(urllib.parse.unquote(sys.stdin.read().strip()))')"
else
  BASE_GEN_ARGS+=(--path "$TARGET")
  SLUG="$(echo "$TARGET" | sed -E 's|.*/([^/]+)/?$|\1|')"
fi
[[ $USE_PROD -eq 1 ]] && BASE_GEN_ARGS+=(--prod)
[[ $USE_PROD -eq 0 ]] && BASE_GEN_ARGS+=(--base "$DEV_BASE")
[[ -n "$TITLE_OVERRIDE" ]] && BASE_GEN_ARGS+=(--title "$TITLE_OVERRIDE")
[[ -n "$DESC_OVERRIDE" ]] && BASE_GEN_ARGS+=(--desc "$DESC_OVERRIDE")

# ── Check dev server is up (skipped when --prod) ────────────────────────────
if [[ $USE_PROD -eq 0 ]]; then
  if ! curl -sI -o /dev/null --max-time 3 "$DEV_BASE/"; then
    echo "⚠️  dev server not running ($DEV_BASE)" >&2
    echo "    Start in another terminal: npm run dev (or use --prod)" >&2
    exit 3
  fi
fi

# ── Run generator for each requested size ───────────────────────────────────
PRODUCED=()
for size in "${SIZES[@]}"; do
  OUT="public/spore-images/${SLUG}-${size}.png"
  echo "🎬 [$size] Generating..."
  node scripts/tools/generate-spore-image.mjs "${BASE_GEN_ARGS[@]}" --size "$size"
  if [[ -f "$OUT" ]]; then
    PRODUCED+=("$OUT")
  else
    echo "❌ $size not produced, expected at: $OUT" >&2
  fi
  echo ""
done

if [[ ${#PRODUCED[@]} -eq 0 ]]; then
  echo "❌ No images produced" >&2
  exit 1
fi

# ── Open Preview.app with all produced PNGs + highlight in Finder ───────────
echo "🖼  Opening ${#PRODUCED[@]} image(s) in Preview.app + Finder"
open -a Preview "${PRODUCED[@]}" 2>/dev/null || open "${PRODUCED[@]}"
open -R "${PRODUCED[0]}" 2>/dev/null || true

# ── Find & print blueprint copy if exists ───────────────────────────────────
BLUEPRINT="$(find docs/factory/SPORE-BLUEPRINTS -type f -name "*${SLUG}*.md" 2>/dev/null | head -1 || true)"
if [[ -n "$BLUEPRINT" ]]; then
  echo ""
  echo "📝 Found blueprint: $BLUEPRINT"
  echo "───────────────────────────────────────"
  cat "$BLUEPRINT"
  echo "───────────────────────────────────────"
else
  echo ""
  echo "ℹ️  No matching blueprint (docs/factory/SPORE-BLUEPRINTS/*${SLUG}*.md)"
  echo "   Provide your own copy."
fi

echo ""
echo "✅ Done. Produced:"
for p in "${PRODUCED[@]}"; do echo "   → $p"; done
echo ""
echo "Next steps:"
echo "   1. Check the images in Preview"
echo "   2. If OK, drag from Finder to Threads/X + paste copy + post"
echo "   3. After posting, register via spore-db.py add-spore (URL required)"
