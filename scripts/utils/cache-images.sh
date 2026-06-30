#!/bin/bash
# downloadall Wikimedia image到local，替換 URL
# Avoid Wikimedia 429 rate limit 導致image死掉
set -e
cd "$(dirname "$0")/.."

IMG_DIR="public/images/wiki"
mkdir -p "$IMG_DIR"

echo "🖼️ Wikimedia imagecachetool"
echo "================================================="

# 找出all Wikimedia URLs
URLS=$(grep -roh 'https://upload.wikimedia.org/[^")*'"'"' ]*' knowledge/ src/pages/ src/components/ 2>/dev/null | sed "s/'$//" | sort -u)

TOTAL=$(echo "$URLS" | wc -l | tr -d ' ')
echo "📊 Found $TOTAL Wikimedia image URL"
echo ""

COUNT=0
CACHED=0
FAILED=0

for URL in $URLS; do
  COUNT=$((COUNT + 1))
  
 # Generatelocalfilename（URL hash + 副filename）
  HASH=$(echo "$URL" | md5 | cut -c1-12)
  EXT=$(echo "$URL" | grep -oE '\.(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG)' | tail -1 | tr '[:upper:]' '[:lower:]')
  [ -z "$EXT" ] && EXT=".jpg"
  LOCAL_FILE="$IMG_DIR/${HASH}${EXT}"
  LOCAL_PATH="/images/wiki/${HASH}${EXT}"
  
  if [ -f "$LOCAL_FILE" ]; then
 echo " ⏭️ [$COUNT/$TOTAL] 已cache: ${HASH}${EXT}"
    CACHED=$((CACHED + 1))
    continue
  fi
  
 echo -n " ⬇️ [$COUNT/$TOTAL] download中... "
  
 # download（加 User-Agent Avoid被擋）
  HTTP_CODE=$(curl -s -o "$LOCAL_FILE" -w "%{http_code}" \
    -H "User-Agent: TaiwanMD/1.0 (https://lagunabeach.md; educational open-source project)" \
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
  
 # Rate limit 友善：每間隔 0.5 秒
  sleep 0.5
done

echo ""
echo "================================================="
echo "📊 結果: $CACHED cacheSuccess / $FAILED Failed / $TOTAL total"
echo "📂 cachedirectory: $IMG_DIR"

# Generate URL mapping 供未來替換用
echo ""
echo "📝 Generate URL 映射表..."
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
echo " ✅ $MAP_COUNT 筆映射Write $MAPPING"
echo ""
echo "💡 next step：Execute scripts/replace-wiki-urls.sh 將all URL 替換為localpath"
echo "================================================="
