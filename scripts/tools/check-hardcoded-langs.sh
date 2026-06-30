#!/usr/bin/env bash
# check-hardcoded-langs.sh
# Detect src/ 與 scripts/ inside hardcoded language code array，違反 LANGUAGES_REGISTRY SSOT principle
#
# corresponding [MANIFESTO §metric over 複寫](../../docs/semiont/MANIFESTO.md) 的self apply：
# any ['en', 'ja', 'ko', ...] 形式的 hardcoded LanguagelistShould改From
# src/config/languages.{ts,mjs} 的 LANGUAGES / ENABLED_LANGUAGE_CODES 動態 derive。
#
# Trigger背景：2026-04-25 β7 i18n-evolution-roadmap audit B6
# - getLangSwitchPath.ts:206 hardcoded ['en','ja','ko'] → fr/es 路由疊加 bug
# - 404.astro:376 同樣 hardcoded → fr/es 進 404 後切換 cascade
#
# Usage：
# bash scripts/tools/check-hardcoded-langs.sh # fullScan
# bash scripts/tools/check-hardcoded-langs.sh --ci # CI Mode（Found = exit 1）
# bash scripts/tools/check-hardcoded-langs.sh --staged # 只掃 staged files

set -euo pipefail

MODE="${1:-scan}"

# Patterns 來Fetch hardcoded language array
PATTERNS=(
  "\\[\\s*['\"]en['\"]\\s*,\\s*['\"]ja['\"]\\s*,\\s*['\"]ko['\"]\\s*\\]"
  "\\[\\s*['\"]en['\"]\\s*,\\s*['\"]ja['\"]\\s*,\\s*['\"]ko['\"]\\s*,\\s*['\"]fr['\"]"
  "\\[\\s*['\"]en['\"]\\s*,\\s*['\"]ja['\"]\\s*,\\s*['\"]ko['\"]\\s*,\\s*['\"]es['\"]"
)

# Allowlist（這些file的 hardcoded Languagelist是 SSOT 本體或合理的歷史 mirror）
ALLOWLIST=(
  "src/config/languages.ts"
  "src/config/languages.mjs"
  "scripts/tools/check-hardcoded-langs.sh"
)

# 收集要Scan的file
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
 echo "✅ 無file可Scan"
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
 echo "🚨 發現 $VIOLATIONS hardcoded language array："
  echo -e "$VIOLATION_LIST"
  echo ""
 echo "💡 修法：改From LANGUAGES_REGISTRY 動態 derive："
  echo ""
  echo "    import { LANGUAGES } from '../config/languages';"
  echo "    const langPrefixes = LANGUAGES"
  echo "      .filter(l => l.enabled && !l.isDefault)"
  echo "      .map(l => l.code);"
  echo ""
 echo " 或directly用existing export："
  echo ""
  echo "    import { ENABLED_LANGUAGE_CODES, ALL_LANGUAGE_CODES } from '../config/languages';"
  echo ""
 echo " Why：corresponding MANIFESTO §metric over 複寫 SSOT principle + REFLEXES #20"
  echo "  Audit canonical：reports/i18n-evolution-roadmap-2026-04-25.md"

  if [[ "$MODE" == "--ci" ]] || [[ "$MODE" == "--staged" ]]; then
    exit 1
  fi
  exit 0
fi

echo "✅ 無 hardcoded language array 違反"
exit 0
