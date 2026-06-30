#!/bin/bash
# 將 Wikimedia URL 替換為localcachepath
set -e
cd "$(dirname "$0")/.."

IMG_DIR="public/images/wiki"
REPLACED=0

echo "🔄 替換 Wikimedia URL → localpath"

# 遍歷all可能includesimage的file
find knowledge/ src/pages/ src/components/ -name "*.md" -o -name "*.astro" | while read -r FILE; do
 # 找出該file中的 Wikimedia URLs
  URLS=$(grep -o "https://upload.wikimedia.org/[^\"')* ]*" "$FILE" 2>/dev/null | sed "s/'$//" | sed 's/)$//' || true)
  
  [ -z "$URLS" ] && continue
  
  CHANGED=false
  
  echo "$URLS" | while IFS= read -r URL; do
    [ -z "$URL" ] && continue
    
    HASH=$(echo "$URL" | md5 | cut -c1-12)
    EXT=$(echo "$URL" | grep -oiE '\.(jpg|jpeg|png|svg|gif)' | tail -1 | tr '[:upper:]' '[:lower:]')
    [ -z "$EXT" ] && EXT=".jpg"
    LOCAL="/images/wiki/${HASH}${EXT}"
    
 # 確認localfileexists
    if [ -f "$IMG_DIR/${HASH}${EXT}" ]; then
 # macOS sed NeedEmpty備份後綴
      ESCAPED_URL=$(echo "$URL" | sed 's/[&/\]/\\&/g')
      ESCAPED_LOCAL=$(echo "$LOCAL" | sed 's/[&/\]/\\&/g')
      sed -i '' "s|$URL|$LOCAL|g" "$FILE" 2>/dev/null && CHANGED=true
    fi
  done
  
  [ "$CHANGED" = true ] && echo "  ✅ $FILE"
done

echo ""
echo "🎉 替換Done！allimage改用localcache"
