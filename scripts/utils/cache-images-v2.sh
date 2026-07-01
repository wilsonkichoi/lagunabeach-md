#!/bin/bash
# Wikimedia image cache v2 - fixed URL truncation issue
set -e
cd "$(dirname "$0")/.."

IMG_DIR="public/images/wiki"
mkdir -p "$IMG_DIR"

# Extract all URLs, clean trailing ' and )
grep -roh "https://upload.wikimedia.org/[^\"')* ]*" knowledge/ src/pages/ src/components/ 2>/dev/null \
  | sed "s/'$//" | sed 's/)$//' | sort -u > /tmp/wiki-urls-clean.txt

TOTAL=$(wc -l < /tmp/wiki-urls-clean.txt | tr -d ' ')
echo "🖼️  Wikimedia image cache v2"
echo "📊 Found $TOTAL URLs"

DONE=0
SKIP=0
FAIL=0

while IFS= read -r URL; do
  HASH=$(echo "$URL" | md5 | cut -c1-12)
  EXT=$(echo "$URL" | grep -oiE '\.(jpg|jpeg|png|svg|gif)' | tail -1 | tr '[:upper:]' '[:lower:]')
  [ -z "$EXT" ] && EXT=".jpg"
  LOCAL="$IMG_DIR/${HASH}${EXT}"
  
  # Skip if already cached
  if [ -s "$LOCAL" ]; then
    SKIP=$((SKIP + 1))
    continue
  fi
  
  # Download
  curl -sL -o "$LOCAL" \
    -H "User-Agent: LagunaBeachMD/1.0 (https://lagunabeach.md; educational project)" \
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
echo "📊 Result: ✅ new $DONE | ⏭️ cached $SKIP | ❌ failed $FAIL"

# Total cache stats
CACHED=$(find "$IMG_DIR" -type f ! -name "*.txt" | wc -l | tr -d ' ')
SIZE=$(du -sh "$IMG_DIR" | cut -f1)
echo "📂 Total cache: $CACHED files ($SIZE)"
