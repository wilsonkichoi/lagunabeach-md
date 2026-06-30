#!/usr/bin/env bash
# LagunaBeach.md unified sync script: knowledge/ SSOT → src/content/ projection layer
#
# Design:
#   - SSOT: enabled lang codes from src/config/languages.mjs
#   - en (default): knowledge/{Category}/ → src/content/en/{category}/
#   - Other langs:  knowledge/{lang}/{Category}/ → src/content/{lang}/{category}/
#   - Resources:    knowledge/resources/ (en) + knowledge/{lang}/resources/ → src/content/{lang}/resources/
#   - Root files:   knowledge/{lang}/*.md (root level) → src/content/{lang}/*.md
#   - Idempotent: rm -rf all enabled lang dirs then rebuild
#
# Usage: bash scripts/core/sync.sh
#
# 2026-05-12 admiring-montalcini-post-finale refactor:
#   - From 217 lines 5x repeat → modular sync_lang() function
#   - Fixed existing bugs:
#     (a) fr/es added to rm list (cleared 336 zombie articles)
#     (b) All langs run resources/ sync (previously only zh-TW + en)
#     (c) All langs sync root-level .md (previously only zh-TW _Home.md,
#         knowledge/en/{root.md} etc. were skipped → 8 silent missing root cause)
#   - SSOT-driven: active lang list read from src/config/languages.mjs
#
# Reference: reports/sync-architecture-evolution-2026-05-12.md v2.0 Ship 1

set -euo pipefail

# ────────────────── Config ──────────────────
readonly REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

# Categories (must match knowledge/ directory names; add here + knowledge/ together)
readonly CATEGORIES=(
  "History"
  "Art & Galleries"
  "Nature & Marine Life"
  "Food"
  "Beaches"
  "Trails"
  "Events & Festivals"
  "Neighborhoods"
  "About"
)

# Read enabled lang codes from SSOT
ENABLED_LANGS=$(node -e "
  import('./src/config/languages.mjs')
    .then(m => console.log(m.ENABLED_LANGUAGE_CODES.join(' ')))
    .catch(e => { console.error(e.message); process.exit(1); });
" 2>&1) || {
  echo "❌ Cannot read ENABLED_LANGUAGE_CODES from src/config/languages.mjs" >&2
  echo "   Error: $ENABLED_LANGS" >&2
  exit 2
}

if [ -z "$ENABLED_LANGS" ]; then
  echo "❌ ENABLED_LANGUAGE_CODES is empty" >&2
  exit 2
fi

# ────────────────── Header ──────────────────
echo "🚀 LagunaBeach.md sync — knowledge/ SSOT → src/content/ projection layer"
echo "═══════════════════════════════════════════════════════"
echo "  Enabled langs: $ENABLED_LANGS"
echo ""

# ────────────────── Phase 1: Clean ──────────────────
echo "🧹 Phase 1: Clean src/content/{lang}/ (idempotent rebuild)..."
for lang in $ENABLED_LANGS; do
  if [ -d "src/content/$lang" ]; then
    rm -rf "src/content/$lang"
  fi
done
echo "  ✅ Cleaned: $ENABLED_LANGS"
echo ""

# ────────────────── Phase 2: Sync via sync_lang() ──────────────────
KNOWLEDGE_COUNT=$(find knowledge/ -name "*.md" | wc -l | tr -d ' ')
SYNCED_TOTAL=0

# sync_lang LANG_CODE — sync knowledge/{lang}/ (or knowledge/ root for en) to src/content/{lang}/
sync_lang() {
  local lang="$1"
  local src_root dst_root count=0

  # en is default: source is knowledge/ root (not knowledge/en/)
  if [ "$lang" = "en" ]; then
    src_root="knowledge"
  else
    src_root="knowledge/$lang"
  fi
  dst_root="src/content/$lang"

  if [ ! -d "$src_root" ]; then
    echo "  ⚠️  $lang: SKIP (no $src_root/)"
    return
  fi

  # 2a. Category subdirs (knowledge/{Cat}/*.md → src/content/{lang}/{cat-slug}/*.md)
  for category in "${CATEGORIES[@]}"; do
    local src_dir="$src_root/$category"
    [ ! -d "$src_dir" ] && continue

    local cat_lower
    # slugify: lowercase, replace " & " with "-", replace " " with "-"
    cat_lower=$(echo "$category" | tr '[:upper:]' '[:lower:]' | sed 's/ & /-/g; s/ /-/g')
    local dst_dir="$dst_root/$cat_lower"
    mkdir -p "$dst_dir"

    for file in "$src_dir"/*.md; do
      [ ! -f "$file" ] && continue
      cp "$file" "$dst_dir/$(basename "$file")"
      count=$((count + 1))
    done
  done

  # 2b. resources/ subdir (all langs; previously bugged: only ran for zh-TW + en)
  if [ -d "$src_root/resources" ]; then
    mkdir -p "$dst_root/resources"
    for file in "$src_root/resources"/*.md; do
      [ ! -f "$file" ] && continue
      cp "$file" "$dst_root/resources/$(basename "$file")"
      count=$((count + 1))
    done
  fi

  # 2c. Root-level .md files (knowledge/{lang}/*.md → src/content/{lang}/*.md)
  # Previously bugged: only synced knowledge/_Home.md, other lang root .md skipped → silent missing
  for file in "$src_root"/*.md; do
    [ ! -f "$file" ] && continue
    cp "$file" "$dst_root/$(basename "$file")"
    count=$((count + 1))
  done

  SYNCED_TOTAL=$((SYNCED_TOTAL + count))
  printf "  ✅ %-6s %4d files\n" "$lang" "$count"
}

echo "📁 Phase 2: sync (per lang)..."
for lang in $ENABLED_LANGS; do
  sync_lang "$lang"
done
echo ""

# ────────────────── Phase 3: Frontmatter fix (legacy) ──────────────────
# Note: fix-all-frontmatter.py only rebuilds frontmatter when `title:` is missing (99% files no-op)
# Kept as legacy migration safeguard; contributors can no longer write directly to src/content/ (gitignored)
echo "🔧 Phase 3: Frontmatter Fix (legacy fallback)..."
if [ -f "scripts/utils/fix-all-frontmatter.py" ]; then
  python3 scripts/utils/fix-all-frontmatter.py 2>&1 | tail -2
else
  echo "  ⚠️  scripts/utils/fix-all-frontmatter.py not found, skipping"
fi
echo ""

# ────────────────── Phase 4: Image health check ──────────────────
echo "🖼️  Phase 4: Image health check..."
if [ -f "scripts/utils/check-images.mjs" ]; then
  node scripts/utils/check-images.mjs 2>&1 | tail -5 || echo "  ⚠️  Image check reported warnings (non-fatal)"
else
  echo "  ⚠️  scripts/utils/check-images.mjs not found, skipping"
fi
echo ""

# ────────────────── Footer ──────────────────
CONTENT_FINAL=$(find src/content/ -name "*.md" | wc -l | tr -d ' ')

echo "═══════════════════════════════════════════════════════"
echo "✨ Sync complete"
echo "   📊 knowledge/ source: $KNOWLEDGE_COUNT files"
echo "   📊 src/content/ final: $CONTENT_FINAL files"
echo "   📊 synced: $SYNCED_TOTAL files"
echo ""
echo "▶️  Next: npm run build"
