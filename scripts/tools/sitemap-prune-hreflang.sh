#!/bin/bash
# sitemap-prune-hreflang.sh — 後備Verify：掃 dist/sitemap-0.xml + dist/ structure
# Remove指向Does not exist .html 的 hreflang alternate（雙保險，Astro serialize hook 為主解）
#
# Usage：
# bash scripts/tools/sitemap-prune-hreflang.sh # 跑Verify + patch
# bash scripts/tools/sitemap-prune-hreflang.sh --check # 只report，不修
# bash scripts/tools/sitemap-prune-hreflang.sh --json # JSON Output
#
# Trigger位置：
# 1. npm run build after（manual或 CI）
# 2. Heartbeat Beat 1 sync.sh after（If有 dist/）
#
# 邏輯：
# 1. Parse dist/sitemap-0.xml 抽出all <xhtml:link rel="alternate" hreflang="X" href="URL"/>
# 2. 對Each URL 推 dist/{path}/index.html 是否exists
# 3. Does not exist → Mark為 fake hreflang
# 4. 若非 --check：重寫 sitemap-0.xml Remove fake alternate

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

MODE="fix"
case "$1" in
    --check) MODE="check" ;;
    --json) MODE="json" ;;
esac

SITEMAP="dist/sitemap-0.xml"
DIST="dist"

if [ ! -f "$SITEMAP" ]; then
 echo -e "${RED}❌ $SITEMAP Does not exist。請first run npm run build${NC}"
    exit 1
fi

# 抽出all hreflang URLs
TMP=$(mktemp)
trap "rm -f $TMP $TMP.fix $TMP.fakes" EXIT

grep -oE '<xhtml:link rel="alternate" hreflang="[^"]+" href="https://taiwan\.md[^"]+"' "$SITEMAP" \
  | sed -E 's|.*hreflang="([^"]+)".*href="https://taiwan\.md([^"]+)".*|\1\t\2|' \
  > "$TMP"

total=$(wc -l < "$TMP" | tr -d ' ')
fake_count=0
> "$TMP.fakes"

while IFS=$'\t' read -r lang path; do
    [ -z "$path" ] && continue
 # path Example：/en/people/吳Cheyu/
 # dist corresponding：dist/en/people/吳Cheyu/index.html
 # URL decode 不Need—dist/ 已是 UTF-8 filename
    target="${DIST}${path}index.html"
 # handle結尾無 / 的情況
    if [ "${path: -1}" != "/" ]; then
        target="${DIST}${path}/index.html"
    fi
    if [ ! -f "$target" ]; then
        fake_count=$((fake_count + 1))
        echo -e "${lang}\t${path}" >> "$TMP.fakes"
    fi
done < "$TMP"

# statistics
real=$((total - fake_count))
if [ "$total" -gt 0 ]; then
    fake_pct=$(awk -v f="$fake_count" -v t="$total" 'BEGIN { printf "%.1f", f * 100 / t }')
else
    fake_pct="0.0"
fi

case "$MODE" in
    json)
        echo "{"
        echo "  \"total_hreflang\": $total,"
        echo "  \"real\": $real,"
        echo "  \"fake\": $fake_count,"
        echo "  \"fake_pct\": $fake_pct,"
        echo "  \"fakes_by_lang\": {"
        awk -F'\t' '{print $1}' "$TMP.fakes" | sort | uniq -c | sort -rn | \
            awk 'BEGIN{first=1} {if(!first)print ","; printf "    \"%s\": %d", $2, $1; first=0} END{print ""}'
        echo "  }"
        echo "}"
        ;;

    check)
 echo "📋 sitemap hreflang Verifyreport"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "  Total hreflang: $total"
        echo -e "  ${GREEN}✅ Real: $real${NC}"
        if [ "$fake_count" -eq 0 ]; then
 echo -e " ${GREEN}🎉 無 fake hreflang，sitemap Health${NC}"
        else
            echo -e "  ${RED}❌ Fake: $fake_count ($fake_pct%)${NC}"
            echo ""
 echo " 各Language fake count:"
            awk -F'\t' '{print "    " $1}' "$TMP.fakes" | sort | uniq -c | sort -rn | head -10
            echo ""
 echo " 抽樣 fake URL（前 10 ）："
            head -10 "$TMP.fakes" | awk -F'\t' '{print "    https://lagunabeach.md" $2 "  (lang=" $1 ")"}'
            echo ""
 echo -e " ${YELLOW}patch：bash scripts/tools/sitemap-prune-hreflang.sh${NC}"
        fi
        ;;

    fix|*)
 echo "📋 sitemap hreflang patch"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "  Total hreflang: $total"
        echo -e "  ${GREEN}✅ Real: $real${NC}"
        if [ "$fake_count" -eq 0 ]; then
 echo -e " ${GREEN}🎉 無 fake hreflang，無需patch${NC}"
            exit 0
        fi
 echo -e " ${RED}❌ Fake: $fake_count ($fake_pct%) — Remove中...${NC}"

 # 重寫 sitemap：對Each fake (lang, path) pair，Remove整 <xhtml:link .../>
        cp "$SITEMAP" "$SITEMAP.bak"
        cp "$SITEMAP" "$TMP.fix"
        while IFS=$'\t' read -r lang path; do
            [ -z "$path" ] && continue
 # 構造 fake link tag pattern
            # <xhtml:link rel="alternate" hreflang="LANG" href="https://lagunabeach.md/PATH"/>
            tag_pattern="<xhtml:link rel=\"alternate\" hreflang=\"${lang}\" href=\"https://lagunabeach.md${path}\"/>"
 # 用 python handle (sed 不適合handle UTF-8 + 特殊characters元)
            python3 -c "
import sys
p = '$TMP.fix'
content = open(p).read()
tag = '''$tag_pattern'''
content = content.replace(tag, '')
open(p, 'w').write(content)
"
        done < "$TMP.fakes"

 # Compare前後 hreflang 數量
        before_count=$(grep -o "hreflang=" "$SITEMAP.bak" | wc -l | tr -d ' ')
        after_count=$(grep -o "hreflang=" "$TMP.fix" | wc -l | tr -d ' ')
        removed=$((before_count - after_count))

        # Atomic rename
        mv "$TMP.fix" "$SITEMAP"

 echo -e " ${GREEN}✅ patchDone${NC}"
        echo "    Before: $before_count hreflang"
        echo "    After:  $after_count hreflang"
        echo "    Removed: $removed fake hreflang"
        echo "    Backup: $SITEMAP.bak"
        ;;
esac

if [ "$fake_count" -gt 0 ] && [ "$MODE" = "check" ]; then
    exit 1
fi
exit 0
