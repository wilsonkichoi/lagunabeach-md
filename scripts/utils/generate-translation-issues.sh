#!/bin/bash
# generate-translation-issues.sh — Generate list of articles needing translation/update
# Usage: bash scripts/generate-translation-issues.sh
# Output: TRANSLATION-STATUS.md (translation tasks for contributors)

cd "$(dirname "$0")/.." || exit 1

echo "🔍 Scanning translation status..."

# Count zh-TW articles
ZH_COUNT=$(find knowledge/ -name "*.md" -not -path "*/en/*" -not -path "*/es/*" -not -path "*/ja/*" -not -path "*/ko/*" -not -name "_*" -not -name "PEOPLE-ROADMAP.md" | wc -l | tr -d ' ')

# Count per language
EN_COUNT=$(find knowledge/en/ -name "*.md" -not -name "_*" 2>/dev/null | wc -l | tr -d ' ')
ES_COUNT=$(find knowledge/es/ -name "*.md" -not -name "_*" 2>/dev/null | wc -l | tr -d ' ')
JA_COUNT=$(find knowledge/ja/ -name "*.md" -not -name "_*" 2>/dev/null | wc -l | tr -d ' ')
KO_COUNT=$(find knowledge/ko/ -name "*.md" -not -name "_*" 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo "📊 Translation coverage:"
echo "  zh-TW: $ZH_COUNT articles (SSOT)"
echo "  EN: $EN_COUNT / $ZH_COUNT ($(( EN_COUNT * 100 / ZH_COUNT ))%)"
echo "  ES: $ES_COUNT / $ZH_COUNT ($(( ES_COUNT * 100 / ZH_COUNT ))%)"
echo "  JA: $JA_COUNT / $ZH_COUNT ($(( JA_COUNT * 100 / ZH_COUNT ))%)"
echo "  KO: $KO_COUNT / $ZH_COUNT ($(( KO_COUNT * 100 / ZH_COUNT ))%)"

# Find articles missing EN version
echo ""
echo "=== Articles missing EN version ==="

python3 << 'PYEOF'
import os, json

with open('knowledge/_translations.json') as f:
    trans = json.load(f)

# All zh-TW articles
zh_files = []
for root, dirs, files in os.walk('knowledge/'):
    if '/en/' in root or '/es/' in root or '/ja/' in root or '/ko/' in root:
        continue
    for f in files:
        if f.endswith('.md') and not f.startswith('_') and f != 'PEOPLE-ROADMAP.md':
            zh_files.append(os.path.join(root, f))

# Find mapped-but-missing or unmapped
missing_en = []
for zh in sorted(zh_files):
    en = trans.get(zh, '')
    if not en or not os.path.exists(en):
        cat = zh.split('/')[1] if len(zh.split('/')) > 2 else 'Other'
        title = os.path.splitext(os.path.basename(zh))[0]
        missing_en.append((cat, title, zh))

# Group output by category
from collections import defaultdict
by_cat = defaultdict(list)
for cat, title, path in missing_en:
    by_cat[cat].append((title, path))

for cat in sorted(by_cat.keys()):
    items = by_cat[cat]
    print(f"\n### {cat} ({len(items)} articles)")
    for title, path in items[:10]:
        print(f"- [ ] {title}")
    if len(items) > 10:
        print(f"- ... {len(items)-10} more")

print(f"\n**Total: {len(missing_en)} articles missing EN version**")
PYEOF
