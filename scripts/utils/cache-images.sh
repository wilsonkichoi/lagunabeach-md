#!/bin/bash
# Download all Wikimedia images locally to avoid 429 rate limits
set -e
cd "$(dirname "$0")/.."

IMG_DIR="public/images/wiki"
mkdir -p "$IMG_DIR"

echo "🖼️  Wikimedia image cache tool"
echo "================================================="

# Find all Wikimedia URLs
URLS=$(grep -roh 'https://upload.wikimedia.org/[^")*'"'"' ]*' knowledge/ src/pages/ src/components/ 2>/dev/null | sed "s/'$//" | sort -u)

TOTAL=$(echo "$URLS" | wc -l | tr -d ' ')
echo "📊 Found $TOTAL Wikimedia image URLs"
echo ""

COUNT=0
CACHED=0
FAILED=0

for URL in $URLS; do
  COUNT=$((COUNT + 1))
  
  # Generate local filename (URL hash + extension)
  HASH=$(echo "$URL" | md5 | cut -c1-12)
  EXT=$(echo "$URL" | grep -oE '\.(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG)' | tail -1 | tr '[:upper:]' '[:lower:]')
  [ -z "$EXT" ] && EXT=".jpg"
  LOCAL_FILE="$IMG_DIR/${HASH}${EXT}"
  LOCAL_PATH="/images/wiki/${HASH}${EXT}"
  
  if [ -f "$LOCAL_FILE" ]; then
    echo "  ⏭️  [$COUNT/$TOTAL] cached: ${HASH}${EXT}"
    CACHED=$((CACHED + 1))
    continue
  fi
  
  echo -n "  ⬇️  [$COUNT/$TOTAL] downloading... "

  # Download (with User-Agent to avoid blocks)
  HTTP_CODE=$(curl -s -o "$LOCAL_FILE" -w "%{http_code}" \
    -H "User-Agent: LagunaBeachMD/1.0 (https://lagunabeach.md; educational open-source project)" \
    -L --max-time 15 "$URL" 2>/dev/null)
  
  if [ "$HTTP_CODE" = "200" ] && [ -s "$LOCAL_FILE" ]; then
    SIZE=$(wc -c < "$LOCAL_FILE" | tr -d ' ')
    echo "✅ ${HASH}${EXT} (${SIZE} bytes)"
    CACHED=$((CACHED + 1))
  else
    echo "❌ HTTP $HTTP_CODE"
    rm -f "$LOCAL_FILE"
    FAILED=$((FAILED + 1))
  fi
  
  # Rate limit friendly: 0.5s between downloads
  sleep 0.5
done

echo ""
echo "================================================="
echo "📊 Result: $CACHED cached / $FAILED failed / $TOTAL total"
echo "📂 Cache directory: $IMG_DIR"

# Generate URL mapping for future replacement
echo ""
echo "📝 Generating URL mapping..."
MAPPING="$IMG_DIR/url-mapping.txt"
> "$MAPPING"

for URL in $URLS; do
  HASH=$(echo "$URL" | md5 | cut -c1-12)
  EXT=$(echo "$URL" | grep -oE '\.(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG)' | tail -1 | tr '[:upper:]' '[:lower:]')
  [ -z "$EXT" ] && EXT=".jpg"
  LOCAL_PATH="/images/wiki/${HASH}${EXT}"
  
  if [ -f "$IMG_DIR/${HASH}${EXT}" ]; then
    echo "$URL → $LOCAL_PATH" >> "$MAPPING"
  fi
done

MAP_COUNT=$(wc -l < "$MAPPING" | tr -d ' ')
echo "  ✅ $MAP_COUNT mappings written to $MAPPING"
echo ""
echo "💡 Next: run scripts/replace-wiki-urls.sh to replace all URLs with local paths"
echo "================================================="
