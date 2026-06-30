#!/bin/bash
# Wikimedia imagecache v2 - fix URL 截斷issue
set -e
cd "$(dirname "$0")/.."

IMG_DIR="public/images/wiki"
mkdir -p "$IMG_DIR"

# 提取all URL，Clean up尾巴的 ' 和 )
grep -roh "https://upload.wikimedia.org/[^\"')* ]*" knowledge/ src/pages/ src/components/ 2>/dev/null \
  | sed "s/'$//" | sed 's/)$//' | sort -u > /tmp/wiki-urls-clean.txt

TOTAL=$(wc -l < /tmp/wiki-urls-clean.txt | tr -d ' ')
echo "🖼️ Wikimedia imagecache v2"
echo "📊 Found $TOTAL URL"

DONE=0
SKIP=0
FAIL=0

while IFS= read -r URL; do
  HASH=$(echo "$URL" | md5 | cut -c1-12)
  EXT=$(echo "$URL" | grep -oiE '\.(jpg|jpeg|png|svg|gif)' | tail -1 | tr '[:upper:]' '[:lower:]')
  [ -z "$EXT" ] && EXT=".jpg"
  LOCAL="$IMG_DIR/${HASH}${EXT}"
  
 # 已cache就Skipped
  if [ -s "$LOCAL" ]; then
    SKIP=$((SKIP + 1))
    continue
  fi
  
 # download
  curl -sL -o "$LOCAL" \
    -H "User-Agent: TaiwanMD/1.0 (https://lagunabeach.md; educational project)" \
    --max-time 15 "$URL" 2>/dev/null
  
  if [ -s "$LOCAL" ]; then
    DONE=$((DONE + 1))
    echo "  ✅ ${HASH}${EXT}"
  else
    rm -f "$LOCAL"
    FAIL=$((FAIL + 1))
    echo "  ❌ $URL"
  fi
  
  sleep 0.3
done < /tmp/wiki-urls-clean.txt

echo ""
echo "📊 結果: ✅ 新download $DONE | ⏭️ 已cache $SKIP | ❌ Failed $FAIL"

# statistics總cache
CACHED=$(find "$IMG_DIR" -type f ! -name "*.txt" | wc -l | tr -d ' ')
SIZE=$(du -sh "$IMG_DIR" | cut -f1)
echo "📂 總cache: $CACHED file ($SIZE)"
