#!/bin/bash
# orphan-translation-check.sh — Orphan translation file detector
# Scans ja/ko/es translation directories, cross-references _translations.json
# Output: mapped / orphan (missing mapping) / duplicate (same target has multiple files)
# Purpose: HEARTBEAT Beat 1 language organ diagnostics
#
# Usage:
#   bash scripts/tools/orphan-translation-check.sh          # all languages
#   bash scripts/tools/orphan-translation-check.sh ja       # Japanese only
#   bash scripts/tools/orphan-translation-check.sh --json   # JSON output

set -uo pipefail

KNOWLEDGE_DIR="knowledge"
TRANSLATIONS="$KNOWLEDGE_DIR/_translations.json"

if [[ ! -f "$TRANSLATIONS" ]]; then
  echo "❌ _translations.json not found at $TRANSLATIONS"
  exit 1
fi

# Parse args
LANG_FILTER=""
JSON_MODE=false
for arg in "$@"; do
  case "$arg" in
    --json) JSON_MODE=true ;;
    ja|ko|es) LANG_FILTER="$arg" ;;
  esac
done

LANGS=("ja" "ko" "es")
if [[ -n "$LANG_FILTER" ]]; then
  LANGS=("$LANG_FILTER")
fi

# Counters
total_files=0
total_mapped=0
total_orphan=0
total_duplicate=0
orphan_list=()
duplicate_list=()

for lang in "${LANGS[@]}"; do
  lang_dir="$KNOWLEDGE_DIR/$lang"
  if [[ ! -d "$lang_dir" ]]; then
    continue
  fi

  # Get all .md files (exclude _Hub files)
  while IFS= read -r filepath; do
    # Relative path from knowledge/ root (e.g., "ja/Food/bubble-tea.md")
    rel_path="${filepath#$KNOWLEDGE_DIR/}"
    filename=$(basename "$filepath")

    # Skip Hub files
    if [[ "$filename" == _* ]]; then
      continue
    fi

    total_files=$((total_files + 1))

    # Check if this file has a mapping in _translations.json
    if grep -q "\"${rel_path}\"" "$TRANSLATIONS"; then
      total_mapped=$((total_mapped + 1))

      # Check for duplicates: does another file in same lang map to the same ZH target?
      zh_target=$(grep "\"$rel_path\"" "$TRANSLATIONS" | head -1 | sed 's/.*: *"\(.*\)".*/\1/')
      if [[ -n "$zh_target" ]]; then
        dup_count=$(grep "\"$zh_target\"" "$TRANSLATIONS" | grep "\"$lang/" | wc -l)
        if [[ ${dup_count// /} -gt 1 ]]; then
          total_duplicate=$((total_duplicate + 1))
          duplicate_list+=("$rel_path → $zh_target (${dup_count}x)")
        fi
      fi
    else
      total_orphan=$((total_orphan + 1))
      orphan_list+=("$rel_path")
    fi
  done < <(find "$lang_dir" -name "*.md" -type f | sort)
done

# Also check EN→ZH chain completeness for mapped files
chain_broken=0
chain_broken_list=()
for lang in "${LANGS[@]}"; do
  lang_dir="$KNOWLEDGE_DIR/$lang"
  if [[ ! -d "$lang_dir" ]]; then
    continue
  fi

  while IFS= read -r filepath; do
    rel_path="${filepath#$KNOWLEDGE_DIR/}"
    filename=$(basename "$filepath")
    if [[ "$filename" == _* ]]; then continue; fi

    # Get ZH target
    zh_target=$(grep "\"$rel_path\"" "$TRANSLATIONS" 2>/dev/null | head -1 | sed 's/.*: *"\(.*\)".*/\1/')
    if [[ -z "$zh_target" ]]; then continue; fi

    # Check if any EN file maps to this ZH target
    en_exists=$(grep "\"en/" "$TRANSLATIONS" | grep "\"$zh_target\"" | wc -l)
    if [[ ${en_exists// /} -eq 0 ]]; then
      chain_broken=$((chain_broken + 1))
      chain_broken_list+=("$rel_path → $zh_target (no EN→ZH)")
    fi
  done < <(find "$lang_dir" -name "*.md" -type f | sort)
done

if $JSON_MODE; then
  # JSON output
  echo "{"
  echo "  \"totalFiles\": $total_files,"
  echo "  \"mapped\": $total_mapped,"
  echo "  \"orphans\": $total_orphan,"
  echo "  \"duplicates\": $total_duplicate,"
  echo "  \"chainBroken\": $chain_broken,"
  echo "  \"orphanList\": ["
  for i in "${!orphan_list[@]}"; do
    comma=","
    if [[ $i -eq $((${#orphan_list[@]} - 1)) ]]; then comma=""; fi
    echo "    \"${orphan_list[$i]}\"$comma"
  done
  echo "  ],"
  echo "  \"chainBrokenList\": ["
  for i in "${!chain_broken_list[@]}"; do
    comma=","
    if [[ $i -eq $((${#chain_broken_list[@]} - 1)) ]]; then comma=""; fi
    echo "    \"${chain_broken_list[$i]}\"$comma"
  done
  echo "  ]"
  echo "}"
else
  # Human-readable output
  echo ""
  echo "🌐 orphan-translation-check v1.0 — Orphan translation detector"
  echo "   scanning: ${LANGS[*]}"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━���━━━━━━━━━"
  echo "📊 Total: $total_files translation files"
  echo "   ✅ Mapped: $total_mapped"
  echo "   ⚠️  Orphan (no mapping): $total_orphan"
  echo "   🔴 Duplicate (same target, multiple files): $total_duplicate"
  echo "   🔗 EN→ZH chain broken: $chain_broken"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━��━━━━"

  if [[ $total_orphan -gt 0 ]]; then
    echo ""
    echo "⚠️  Orphan translations (file exists but no _translations.json mapping):"
    for item in "${orphan_list[@]}"; do
      echo "   • $item"
    done
  fi

  if [[ $total_duplicate -gt 0 ]]; then
    echo ""
    echo "🔴 Duplicate translations (same source article has multiple translations):"
    for item in "${duplicate_list[@]}"; do
      echo "   • $item"
    done
  fi

  if [[ $chain_broken -gt 0 ]]; then
    echo ""
    echo "🔗 EN→ZH chain broken (mapping exists but no EN counterpart, JA/KO routes cannot generate):"
    for item in "${chain_broken_list[@]}"; do
      echo "   • $item"
    done
  fi

  if [[ $total_orphan -eq 0 && $total_duplicate -eq 0 && $chain_broken -eq 0 ]]; then
    echo ""
    echo "✅ All translation files healthy!"
  fi

  echo ""
fi
