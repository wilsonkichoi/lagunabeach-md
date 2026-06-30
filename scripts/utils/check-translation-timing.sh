#!/bin/bash
# check-translation-timing.sh — CheckTranslationfile的Modify時間差
# Usage：bash scripts/utils/check-translation-timing.sh [threshold_hours]
# Default：displayexceeds 24 hours的diff

THRESHOLD="${1:-24}"

echo "=== Translation時差statistics ==="
echo "Check基準：${THRESHOLD} hours"
echo ""

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

print("=== total ===")
print(f"sync：{len(synced)} ")
print(f"Chinese較新：{len(stale_zh)} ")
print(f"English較新：{len(stale_en)} ")
print()

if stale_zh:
 print(f"=== Chinese較新exceeds {threshold} hours（priorityhandle） ===")
    thresholded = sorted([x for x in stale_zh if x[2] > threshold], key=lambda x: -x[2])
    if thresholded:
        for zh, en, hours in thresholded[:30]:
 print(f" {zh} (落後 {hours:.1f}h)")
        if len(thresholded) > 30:
 print(f"... also {len(thresholded) - 30} ")
    else:
 print("(無exceedsConfig時差的目)")

if stale_en:
    print()
 print(f"=== English較新exceeds {threshold} hours（Chinese可能又Update了） ===")
    thresholded = sorted([x for x in stale_en if x[2] > threshold], key=lambda x: -x[2])
    if thresholded:
        for zh, en, hours in thresholded[:30]:
 print(f" {zh} (English超前 {hours:.1f}h)")
        if len(thresholded) > 30:
 print(f"... also {len(thresholded) - 30} ")
    else:
 print("(無exceedsConfig時差的目)")
EOF
