#!/usr/bin/env bash
# check-hardcoded-langs.sh
# Detect hardcoded language code arrays in src/ and scripts/ that violate LANGUAGES_REGISTRY SSOT principle
#
# Per [MANIFESTO "indicators over duplication"](../../docs/semiont/MANIFESTO.md):
# Any ['en', 'ja', 'ko', ...] style hardcoded language list should derive dynamically from
# src/config/languages.{ts,mjs} LANGUAGES / ENABLED_LANGUAGE_CODES.
#
# Background: 2026-04-25 beta7 i18n-evolution-roadmap audit B6
# - getLangSwitchPath.ts:206 hardcoded ['en','ja','ko'] -> fr/es routing cascade bug
# - 404.astro:376 same hardcoded -> fr/es into 404 switch cascade
#
# Usage:
#   bash scripts/tools/check-hardcoded-langs.sh             # full scan
#   bash scripts/tools/check-hardcoded-langs.sh --ci        # CI mode (found = exit 1)
#   bash scripts/tools/check-hardcoded-langs.sh --staged    # scan staged files only

set -euo pipefail

MODE="${1:-scan}"

# Patterns to catch hardcoded language arrays
PATTERNS=(
  "\\[\\s*['\"]en['\"]\\s*,\\s*['\"]ja['\"]\\s*,\\s*['\"]ko['\"]\\s*\\]"
  "\\[\\s*['\"]en['\"]\\s*,\\s*['\"]ja['\"]\\s*,\\s*['\"]ko['\"]\\s*,\\s*['\"]fr['\"]"
  "\\[\\s*['\"]en['\"]\\s*,\\s*['\"]ja['\"]\\s*,\\s*['\"]ko['\"]\\s*,\\s*['\"]es['\"]"
)

# Allowlist (these files' hardcoded language lists are the SSOT itself or a reasonable historical mirror)
ALLOWLIST=(
  "src/config/languages.ts"
  "src/config/languages.mjs"
  "scripts/tools/check-hardcoded-langs.sh"
)

# Collect files to scan
if [[ "$MODE" == "--staged" ]]; then
  FILES=$(git diff --cached --name-only --diff-filter=ACM \
    | grep -E '\.(ts|tsx|mjs|cjs|js|astro|sh)$' || true)
else
  FILES=$(find src scripts astro.config.mjs \
    -type f \
    \( -name "*.ts" -o -name "*.tsx" -o -name "*.mjs" -o -name "*.cjs" \
       -o -name "*.js" -o -name "*.astro" -o -name "*.sh" \) \
    2>/dev/null | grep -v node_modules | grep -v dist || true)
fi

if [[ -z "$FILES" ]]; then
  echo "✅ no files to scan"
  exit 0
fi

VIOLATIONS=0
VIOLATION_LIST=""

for f in $FILES; do
  [[ ! -f "$f" ]] && continue

  # Skip allowlist
  skip=0
  for allowed in "${ALLOWLIST[@]}"; do
    if [[ "$f" == "$allowed" ]] || [[ "$f" == *"$allowed" ]]; then
      skip=1
      break
    fi
  done
  [[ $skip -eq 1 ]] && continue

  for pattern in "${PATTERNS[@]}"; do
    # Skip comment lines (// ... or # ... or * ...) where pattern only appears
    # in the comment text — comments don't execute, so they're not real bugs
    matches=$(grep -nE "$pattern" "$f" 2>/dev/null \
      | grep -vE '^[0-9]+:\s*(//|#|\*)' \
      | grep -vE '^[0-9]+:.*(//|#).*\[.*en.*ja.*ko' \
      || true)
    if [[ -n "$matches" ]]; then
      while IFS= read -r line; do
        VIOLATIONS=$((VIOLATIONS + 1))
        VIOLATION_LIST+="\n  $f:$line"
      done <<< "$matches"
    fi
  done
done

if [[ $VIOLATIONS -gt 0 ]]; then
  echo "🚨 Found $VIOLATIONS hardcoded language array(s):"
  echo -e "$VIOLATION_LIST"
  echo ""
  echo "💡 Fix: derive dynamically from LANGUAGES_REGISTRY:"
  echo ""
  echo "    import { LANGUAGES } from '../config/languages';"
  echo "    const langPrefixes = LANGUAGES"
  echo "      .filter(l => l.enabled && !l.isDefault)"
  echo "      .map(l => l.code);"
  echo ""
  echo "  Or use existing exports:"
  echo ""
  echo "    import { ENABLED_LANGUAGE_CODES, ALL_LANGUAGE_CODES } from '../config/languages';"
  echo ""
  echo "  Why: MANIFESTO 'indicators over duplication' SSOT principle + REFLEXES #20"
  echo "  Audit canonical: reports/i18n-evolution-roadmap-2026-04-25.md"

  if [[ "$MODE" == "--ci" ]] || [[ "$MODE" == "--staged" ]]; then
    exit 1
  fi
  exit 0
fi

echo "✅ no hardcoded language array violations"
exit 0
