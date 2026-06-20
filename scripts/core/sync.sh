#!/usr/bin/env bash
# LagunaBeach.md sync: knowledge/ SSOT -> src/content/ projection layer
#
# Design:
#   - SSOT: enabled lang codes from src/config/languages.mjs
#   - English (default): knowledge/{Category}/ -> src/content/en/{category-slug}/
#   - Idempotent: rm -rf all enabled lang dirs then rebuild
#
# Usage: bash scripts/core/sync.sh

set -euo pipefail

readonly REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

# Categories (must match knowledge/ directory names)
readonly CATEGORIES=(
  "History"
  "Art & Galleries"
  "Nature & Marine Life"
  "Food"
  "Beaches"
  "Trails"
  "Events & Festivals"
  "Neighborhoods"
)

# Read enabled languages from SSOT
ENABLED_LANGS=$(node -e "
  import('./src/config/languages.mjs')
    .then(m => console.log(m.ENABLED_LANGUAGE_CODES.join(' ')))
    .catch(e => { console.error(e.message); process.exit(1); });
" 2>&1) || {
  echo "ERROR: Cannot read ENABLED_LANGUAGE_CODES from src/config/languages.mjs" >&2
  echo "  Error: $ENABLED_LANGS" >&2
  exit 2
}

if [ -z "$ENABLED_LANGS" ]; then
  echo "ERROR: ENABLED_LANGUAGE_CODES is empty" >&2
  exit 2
fi

echo "LagunaBeach.md sync -- knowledge/ SSOT -> src/content/"
echo "======================================================="
echo "  Enabled langs: $ENABLED_LANGS"
echo ""

# Phase 1: Clean
echo "Phase 1: Clean src/content/{lang}/ (idempotent rebuild)..."
for lang in $ENABLED_LANGS; do
  if [ -d "src/content/$lang" ]; then
    rm -rf "src/content/$lang"
  fi
done
echo "  Done: $ENABLED_LANGS"
echo ""

# Phase 2: Sync
KNOWLEDGE_COUNT=$(find knowledge/ -name "*.md" | wc -l | tr -d ' ')
SYNCED_TOTAL=0

slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/ & /-/g; s/ /-/g'
}

sync_lang() {
  local lang="$1"
  local src_root dst_root count=0

  # Default language reads from knowledge/ root
  if [ "$lang" = "en" ]; then
    src_root="knowledge"
  else
    src_root="knowledge/$lang"
  fi
  dst_root="src/content/$lang"

  if [ ! -d "$src_root" ]; then
    echo "  SKIP $lang (no $src_root/)"
    return
  fi

  # Category subdirs
  for category in "${CATEGORIES[@]}"; do
    local src_dir="$src_root/$category"
    [ ! -d "$src_dir" ] && continue

    local cat_slug
    cat_slug=$(slugify "$category")
    local dst_dir="$dst_root/$cat_slug"
    mkdir -p "$dst_dir"

    for file in "$src_dir"/*.md; do
      [ ! -f "$file" ] && continue
      cp "$file" "$dst_dir/$(basename "$file")"
      count=$((count + 1))
    done
  done

  # Root-level .md files (e.g., INBOX.md)
  for file in "$src_root"/*.md; do
    [ ! -f "$file" ] && continue
    cp "$file" "$dst_root/$(basename "$file")"
    count=$((count + 1))
  done

  SYNCED_TOTAL=$((SYNCED_TOTAL + count))
  printf "  %-6s %4d files\n" "$lang" "$count"
}

echo "Phase 2: Sync (per lang)..."
for lang in $ENABLED_LANGS; do
  sync_lang "$lang"
done
echo ""

# Footer
CONTENT_FINAL=$(find src/content/ -name "*.md" 2>/dev/null | wc -l | tr -d ' ')

echo "======================================================="
echo "Sync complete"
echo "  knowledge/ source: $KNOWLEDGE_COUNT files"
echo "  src/content/ final: $CONTENT_FINAL files"
echo "  synced: $SYNCED_TOTAL files"
echo ""
echo "Next: npm run build"
