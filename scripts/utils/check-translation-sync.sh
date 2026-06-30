#!/bin/bash
# check-translation-sync.sh — full的TranslationsyncCheck
# Usage：bash scripts/utils/check-translation-sync.sh [threshold_hours]
# Check目：
# 1. translations.json 映射status
# 2. fileModify時間差（mtime）
# 3. Git commit時間差

THRESHOLD="${1:-24}"

echo "=============================================="
echo "=== TranslationsyncCheck (${THRESHOLD} hours基準) ==="
echo "=============================================="
echo ""

# 1. Check translations.json
echo "【1】translations.json 映射status"
echo "----------------------------------------------"

python3 << 'EOF'
import os
import json

knowledge_dir = 'knowledge'

with open(os.path.join(knowledge_dir, '_translations.json')) as f:
    translations = json.load(f)

missing = 0
valid = 0

for en_rel, zh_rel in translations.items():
    zh_path = os.path.join(knowledge_dir, zh_rel)
    en_path = os.path.join(knowledge_dir, en_rel)

    if not os.path.exists(zh_path) or not os.path.exists(en_path):
 print(f" ❌ {zh_rel} ↔ {en_rel} (file缺失)")
        missing += 1
    else:
        valid += 1

print(f"\ntotal：{valid} Valid | {missing} 缺失")
EOF

echo ""
echo "【2】fileModify時間差（mtime）"
echo "----------------------------------------------"

THRESHOLD_ENV="$THRESHOLD" python3 << 'EOF'
import os
import json
from datetime import datetime

knowledge_dir = 'knowledge'
threshold = float(os.environ.get('THRESHOLD_ENV', 24))

with open(os.path.join(knowledge_dir, '_translations.json')) as f:
    translations = json.load(f)

stale_zh = []
stale_en = []
synced = []

for en_rel, zh_rel in translations.items():
    zh_path = os.path.join(knowledge_dir, zh_rel)
    en_path = os.path.join(knowledge_dir, en_rel)

    if not os.path.exists(zh_path) or not os.path.exists(en_path):
        continue

    zh_mtime = os.path.getmtime(zh_path)
    en_mtime = os.path.getmtime(en_path)
    diff_hours = (zh_mtime - en_mtime) / 3600

    if abs(diff_hours) < 1:
        synced.append((zh_rel, en_rel, 0))
    elif diff_hours > 1:
        stale_zh.append((zh_rel, en_rel, diff_hours))
    else:
        stale_en.append((zh_rel, en_rel, abs(diff_hours)))

print(f"sync：{len(synced)} ")
print(f"Chinese較新：{len(stale_zh)} ")
print(f"English較新：{len(stale_en)} ")
print()

if stale_zh:
 print(f"Chinese較新exceeds {threshold} hours（priorityhandle）:")
    thresholded = sorted([x for x in stale_zh if x[2] > threshold], key=lambda x: -x[2])
    if thresholded:
        for zh, en, hours in thresholded[:20]:
 print(f" 🔄 {zh} (落後 {hours:.1f}h)")
        if len(thresholded) > 20:
 print(f" ... also {len(thresholded) - 20} ")

if stale_en:
    print()
 print(f"English較新exceeds {threshold} hours（Chinese可能又Update了）:")
    thresholded = sorted([x for x in stale_en if x[2] > threshold], key=lambda x: -x[2])
    if thresholded:
        for zh, en, hours in thresholded[:20]:
 print(f" ⚠️ {zh} (English超前 {hours:.1f}h)")
        if len(thresholded) > 20:
 print(f" ... also {len(thresholded) - 20} ")
EOF

echo ""
echo "【3】Git commit時間差"
echo "----------------------------------------------"

python3 << 'EOF'
import os
import json
import subprocess

knowledge_dir = 'knowledge'

with open(os.path.join(knowledge_dir, '_translations.json')) as f:
    translations = json.load(f)

stale_zh = []
stale_en = []
synced = []

for en_rel, zh_rel in translations.items():
    zh_path = os.path.join(knowledge_dir, zh_rel)
    en_path = os.path.join(knowledge_dir, en_rel)

    if not os.path.exists(zh_path) or not os.path.exists(en_path):
        continue

    zh_result = subprocess.run(['git', 'log', '-1', '--format=%ct', '--', zh_path], capture_output=True, text=True)
    en_result = subprocess.run(['git', 'log', '-1', '--format=%ct', '--', en_path], capture_output=True, text=True)

    if zh_result.returncode != 0 or en_result.returncode != 0:
        continue

    zh_ts = int(zh_result.stdout.strip())
    en_ts = int(en_result.stdout.strip())
    diff_hours = (zh_ts - en_ts) / 3600

    if abs(diff_hours) < 1:
        synced.append((zh_rel, en_rel, 0))
    elif diff_hours > 1:
        stale_zh.append((zh_rel, en_rel, diff_hours))
    else:
        stale_en.append((zh_rel, en_rel, abs(diff_hours)))

print(f"Git sync：{len(synced)} ")
print(f"Chinese較新：{len(stale_zh)} ")
print(f"English較新：{len(stale_en)} ")
print()

if stale_zh:
 print("Chinese Git 較新exceeds 24 hours:")
    thresholded = sorted([x for x in stale_zh if x[2] > 24], key=lambda x: -x[2])
    if thresholded:
        for zh, en, hours in thresholded[:20]:
 print(f" 🔄 {zh} (落後 {hours:.1f}h)")
        if len(thresholded) > 20:
 print(f" ... also {len(thresholded) - 20} ")

if stale_en:
    print()
 print("English Git 較新exceeds 24 hours:")
    thresholded = sorted([x for x in stale_en if x[2] > 24], key=lambda x: -x[2])
    if thresholded:
        for zh, en, hours in thresholded[:20]:
 print(f" ⚠️ {zh} (English超前 {hours:.1f}h)")
        if len(thresholded) > 20:
 print(f" ... also {len(thresholded) - 20} ")
EOF

echo ""
echo "=============================================="
echo "=== 總結 ==="
echo "=============================================="
echo "suggestionpriorityhandle：Chinese較新的Articles（UpdateEnglishTranslation）"
echo "secondaryNote：English較新的Articles（確認Chinese是否已Update）"
