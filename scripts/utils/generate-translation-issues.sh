#!/bin/bash
# generate-translation-issues.sh — outputNeedTranslation/Update的Articleslist
# Usage: bash scripts/generate-translation-issues.sh
# Output: TRANSLATION-STATUS.md（社群可認領的Translation任務）

cd "$(dirname "$0")/.." || exit 1

echo "🔍 ScanTranslationstatus..."

# CalculateChineseArticles
ZH_COUNT=$(find knowledge/ -name "*.md" -not -path "*/en/*" -not -path "*/es/*" -not -path "*/ja/*" -not -path "*/ko/*" -not -name "_*" -not -name "PEOPLE-ROADMAP.md" | wc -l | tr -d ' ')

# Calculate各Language
EN_COUNT=$(find knowledge/en/ -name "*.md" -not -name "_*" 2>/dev/null | wc -l | tr -d ' ')
ES_COUNT=$(find knowledge/es/ -name "*.md" -not -name "_*" 2>/dev/null | wc -l | tr -d ' ')
JA_COUNT=$(find knowledge/ja/ -name "*.md" -not -name "_*" 2>/dev/null | wc -l | tr -d ' ')
KO_COUNT=$(find knowledge/ko/ -name "*.md" -not -name "_*" 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo "📊 TranslationDone度："
echo " Chinese: $ZH_COUNT (SSOT)"
echo " English: $EN_COUNT / $ZH_COUNT ($(( EN_COUNT * 100 / ZH_COUNT ))%)"
echo " 西班牙文: $ES_COUNT / $ZH_COUNT ($(( ES_COUNT * 100 / ZH_COUNT ))%)"
echo " 日文: $JA_COUNT / $ZH_COUNT ($(( JA_COUNT * 100 / ZH_COUNT ))%)"
echo " 韓文: $KO_COUNT / $ZH_COUNT ($(( KO_COUNT * 100 / ZH_COUNT ))%)"

# 找出缺English版的Articles
echo ""
echo "=== 缺English版的Articles ==="

python3 << 'PYEOF'
import os, json

with open('knowledge/_translations.json') as f:
    trans = json.load(f)

# allChineseArticles
zh_files = []
for root, dirs, files in os.walk('knowledge/'):
    if '/en/' in root or '/es/' in root or '/ja/' in root or '/ko/' in root:
        continue
    for f in files:
        if f.endswith('.md') and not f.startswith('_') and f != 'PEOPLE-ROADMAP.md':
            zh_files.append(os.path.join(root, f))

# 找出有映射但EnglishDoes not exist，或無映射的
missing_en = []
for zh in sorted(zh_files):
    en = trans.get(zh, '')
    if not en or not os.path.exists(en):
        cat = zh.split('/')[1] if len(zh.split('/')) > 2 else 'Other'
        title = os.path.splitext(os.path.basename(zh))[0]
        missing_en.append((cat, title, zh))

# 按category分組Output
from collections import defaultdict
by_cat = defaultdict(list)
for cat, title, path in missing_en:
    by_cat[cat].append((title, path))

for cat in sorted(by_cat.keys()):
    items = by_cat[cat]
 print(f"\n### {cat} ({len(items)} )")
    for title, path in items[:10]:
        print(f"- [ ] {title}")
    if len(items) > 10:
 print(f"- ... also {len(items)-10} ")

print(f"\n**total {len(missing_en)} 缺English版**")
PYEOF
