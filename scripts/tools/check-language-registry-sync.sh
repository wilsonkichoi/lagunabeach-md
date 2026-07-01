#!/usr/bin/env bash
# check-language-registry-sync.sh
#
# Verify src/config/languages.ts and languages.mjs LANGUAGES lists are in sync.
# Both code lists must be identical. pre-commit hook should run this.
#
# Why two files: Vite SSR prerender chunks bundle .mjs but break filesystem
# relative paths, so readFileSync cannot read JSON. Most reliable approach is both files inline data.
set -uo pipefail
cd "$(dirname "$0")/../.."

# Extract codes from .ts (regex: code: '...')
TS_CODES=$(grep -oE "code: '[^']+'" src/config/languages.ts | sed "s/code: '//;s/'$//" | sort | tr '\n' ',' | sed 's/,$//')

# Extract codes from .mjs
MJS_CODES=$(grep -oE "code: '[^']+'" src/config/languages.mjs | sed "s/code: '//;s/'$//" | sort | tr '\n' ',' | sed 's/,$//')

if [[ "$TS_CODES" != "$MJS_CODES" ]]; then
  echo "❌ Language registry drift detected!"
  echo "   languages.ts codes:  $TS_CODES"
  echo "   languages.mjs codes: $MJS_CODES"
  echo ""
  echo "Both files must have the same code list. Edit BOTH when adding a language."
  exit 1
fi

echo "✅ Language registry in sync ($TS_CODES)"
