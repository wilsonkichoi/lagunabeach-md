#!/usr/bin/env bash
# LagunaBeach.md 統一syncscript：knowledge/ SSOT → src/content/ 投影層
#
# design：
#   - SSOT: enabled lang codes from src/config/languages.mjs
#   - zh-TW (default): knowledge/{Category}/ → src/content/zh-TW/{category}/
# - other lang: knowledge/{lang}/{Category}/ → src/content/{lang}/{category}/
#   - Resources:       knowledge/resources/ (zh-TW) + knowledge/{lang}/resources/ → src/content/{lang}/resources/
#   - Root files:      knowledge/{lang}/*.md (root level) → src/content/{lang}/*.md
# - 冪等：先 rm -rf all enabled lang dirs 再Rebuild
#
# Usage：bash scripts/core/sync.sh
#
# 2026-05-12 admiring-montalcini-post-finale refactor:
# - From 217 行 5x repeat → module化 sync_lang() function
# - patchexisting bug:
# (a) fr/es 加進 rm list（清 336 zombie articles）
# (b) 各 lang 都跑 resources/ sync（原本只跑 zh-TW + en）
# (c) 各 lang 的 root-level .md 也搬（原本只搬 zh-TW _Home.md，
# knowledge/en/{root.md} 等被略過 → 8 silent missing 根因）
# - SSOT 驅動：active lang list From src/config/languages.mjs Read
#
# corresponding：reports/sync-architecture-evolution-2026-05-12.md v2.0 Ship 1

set -euo pipefail

# ────────────────── Config ──────────────────
readonly REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

# Categories（跟 knowledge/ directorystructurealignment；addcategory時這裡 + knowledge/ 一起加）
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

# Enabled lang codes From SSOT Read
ENABLED_LANGS=$(node -e "
  import('./src/config/languages.mjs')
    .then(m => console.log(m.ENABLED_LANGUAGE_CODES.join(' ')))
    .catch(e => { console.error(e.message); process.exit(1); });
" 2>&1) || {
 echo "❌ CannotFrom src/config/languages.mjs Read ENABLED_LANGUAGE_CODES" >&2
 echo " Error：$ENABLED_LANGS" >&2
  exit 2
}

if [ -z "$ENABLED_LANGS" ]; then
 echo "❌ ENABLED_LANGUAGE_CODES 為空" >&2
  exit 2
fi

# ────────────────── Header ──────────────────
echo "🚀 LagunaBeach.md sync — knowledge/ SSOT → src/content/ 投影層"
echo "═══════════════════════════════════════════════════════"
echo "  Enabled langs: $ENABLED_LANGS"
echo ""

# ────────────────── Phase 1: 清空 ──────────────────
echo "🧹 Phase 1: 清空 src/content/{lang}/ (冪等Rebuild)..."
for lang in $ENABLED_LANGS; do
  if [ -d "src/content/$lang" ]; then
    rm -rf "src/content/$lang"
  fi
done
echo "  ✅ Cleaned: $ENABLED_LANGS"
echo ""

# ────────────────── Phase 2: sync sync_lang() ──────────────────
KNOWLEDGE_COUNT=$(find knowledge/ -name "*.md" | wc -l | tr -d ' ')
SYNCED_TOTAL=0

# sync_lang LANG_CODE — 把 knowledge/{lang}/ (或 zh-TW 的 knowledge/ root) sync到 src/content/{lang}/
sync_lang() {
  local lang="$1"
  local src_root dst_root count=0

 # zh-TW 特例：source 在 knowledge/ root（not in knowledge/zh-TW/）
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

 # 2b. resources/ subdir (各 lang 都有，原本 bug：只跑 zh-TW + en)
  if [ -d "$src_root/resources" ]; then
    mkdir -p "$dst_root/resources"
    for file in "$src_root/resources"/*.md; do
      [ ! -f "$file" ] && continue
      cp "$file" "$dst_root/resources/$(basename "$file")"
      count=$((count + 1))
    done
  fi

  # 2c. Root-level .md files (knowledge/{lang}/*.md → src/content/{lang}/*.md)
 # 原本 bug：只搬 knowledge/_Home.md，other lang root 的 .md 被略過 → silent missing
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

# ────────────────── Phase 3: Frontmatter Fix (legacy) ──────────────────
# Note：fix-all-frontmatter.py 只在缺 `title:` 時Rebuild frontmatter (99% file no-op)
# 留著是 legacy migration safeguard，未來 contributor 直丟到 src/content/ 不再可能（gitignore 後）
echo "🔧 Phase 3: Frontmatter Fix (legacy fallback)..."
if [ -f "scripts/utils/fix-all-frontmatter.py" ]; then
  python3 scripts/utils/fix-all-frontmatter.py 2>&1 | tail -2
else
 echo " ⚠️ scripts/utils/fix-all-frontmatter.py Does not exist，Skipped"
fi
echo ""

# ────────────────── Phase 4: imageHealthCheck ──────────────────
echo "🖼️ Phase 4: imageHealthCheck..."
if [ -f "scripts/utils/check-images.mjs" ]; then
 node scripts/utils/check-images.mjs 2>&1 | tail -5 || echo " ⚠️ imageCheckReportWarning（非致命）"
else
 echo " ⚠️ scripts/utils/check-images.mjs Does not exist，Skipped"
fi
echo ""

# ────────────────── Footer ──────────────────
CONTENT_FINAL=$(find src/content/ -name "*.md" | wc -l | tr -d ' ')

echo "═══════════════════════════════════════════════════════"
echo "✨ Sync Done"
echo "   📊 knowledge/ source: $KNOWLEDGE_COUNT files"
echo "   📊 src/content/ final: $CONTENT_FINAL files"
echo "   📊 synced: $SYNCED_TOTAL files"
echo ""
echo "▶️ next step：npm run build"
