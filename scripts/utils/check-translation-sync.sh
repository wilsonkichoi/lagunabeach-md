#!/bin/bash
# check-translation-sync.sh — Full translation sync check
# Usage: bash scripts/utils/check-translation-sync.sh [threshold_hours]
# Checks:
#   1. translations.json mapping status
#   2. File modification time difference (mtime)
#   3. Git commit time difference

THRESHOLD="${1:-24}"

echo "=============================================="
echo "=== Translation sync check (${THRESHOLD}h threshold) ==="
echo "=============================================="
echo ""

# 1. Check translations.json
echo "[1] translations.json mapping status"
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
        print(f"   ❌ {zh_rel} ↔ {en_rel} (file missing)")
        missing += 1
    else:
        valid += 1

print(f"\nTotal: {valid} valid | {missing} missing")
EOF

echo ""
echo "[2] File modification time difference (mtime)"
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

print(f"Synced: {len(synced)} articles")
print(f"zh-TW newer: {len(stale_zh)} articles")
print(f"EN newer: {len(stale_en)} articles")
print()

if stale_zh:
    print(f"zh-TW newer by > {threshold} hours (priority):")
    thresholded = sorted([x for x in stale_zh if x[2] > threshold], key=lambda x: -x[2])
    if thresholded:
        for zh, en, hours in thresholded[:20]:
            print(f"   🔄 {zh} (behind {hours:.1f}h)")
        if len(thresholded) > 20:
            print(f"   ... {len(thresholded) - 20} more")

if stale_en:
    print()
    print(f"EN newer by > {threshold} hours (zh-TW may have been updated):")
    thresholded = sorted([x for x in stale_en if x[2] > threshold], key=lambda x: -x[2])
    if thresholded:
        for zh, en, hours in thresholded[:20]:
            print(f"   ⚠️   {zh} (EN ahead {hours:.1f}h)")
        if len(thresholded) > 20:
            print(f"   ... {len(thresholded) - 20} more")
EOF

echo ""
echo "[3] Git commit time difference"
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

print(f"Git synced: {len(synced)} articles")
print(f"zh-TW newer: {len(stale_zh)} articles")
print(f"EN newer: {len(stale_en)} articles")
print()

if stale_zh:
    print("zh-TW Git newer by > 24 hours:")
    thresholded = sorted([x for x in stale_zh if x[2] > 24], key=lambda x: -x[2])
    if thresholded:
        for zh, en, hours in thresholded[:20]:
            print(f"   🔄 {zh} (behind {hours:.1f}h)")
        if len(thresholded) > 20:
            print(f"   ... {len(thresholded) - 20} more")

if stale_en:
    print()
    print("EN Git newer by > 24 hours:")
    thresholded = sorted([x for x in stale_en if x[2] > 24], key=lambda x: -x[2])
    if thresholded:
        for zh, en, hours in thresholded[:20]:
            print(f"   ⚠️   {zh} (EN ahead {hours:.1f}h)")
        if len(thresholded) > 20:
            print(f"   ... {len(thresholded) - 20} more")
EOF

echo ""
echo "=============================================="
echo "=== Summary ==="
echo "=============================================="
echo "Priority: articles where zh-TW is newer (update EN translation)"
echo "Secondary: articles where EN is newer (verify zh-TW is up to date)"
