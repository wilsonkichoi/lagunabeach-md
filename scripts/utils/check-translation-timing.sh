#!/bin/bash
# check-translation-timing.sh — Check translation file modification time differences
# Usage: bash scripts/utils/check-translation-timing.sh [threshold_hours]
# Default: show differences over 24 hours

THRESHOLD="${1:-24}"

echo "=== Translation timing stats ==="
echo "Threshold: ${THRESHOLD} hours"
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

print("=== Total ===")
print(f"Synced: {len(synced)} articles")
print(f"zh-TW newer: {len(stale_zh)} articles")
print(f"EN newer: {len(stale_en)} articles")
print()

if stale_zh:
    print(f"=== zh-TW newer by > {threshold} hours (priority) ===")
    thresholded = sorted([x for x in stale_zh if x[2] > threshold], key=lambda x: -x[2])
    if thresholded:
        for zh, en, hours in thresholded[:30]:
            print(f"     {zh} (behind {hours:.1f}h)")
        if len(thresholded) > 30:
            print(f"... {len(thresholded) - 30} more")
    else:
        print("(none over threshold)")

if stale_en:
    print()
    print(f"=== EN newer by > {threshold} hours (zh-TW may have been updated) ===")
    thresholded = sorted([x for x in stale_en if x[2] > threshold], key=lambda x: -x[2])
    if thresholded:
        for zh, en, hours in thresholded[:30]:
            print(f"     {zh} (EN ahead {hours:.1f}h)")
        if len(thresholded) > 30:
            print(f"... {len(thresholded) - 30} more")
    else:
        print("(none over threshold)")
EOF
