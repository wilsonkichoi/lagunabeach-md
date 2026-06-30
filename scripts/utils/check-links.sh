#!/bin/bash

# LagunaBeach.md 死連結Scanautomatic化script
# Scan knowledge/ 下all .md file中的external連結
# parallelCheck HTTP status碼，report死連結

set -euo pipefail

# 顏色define
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# configuration
KNOWLEDGE_DIR="knowledge"
TIMEOUT=10
PARALLEL_JOBS=10
TEMP_FILE=$(mktemp)
DEAD_LINKS_FILE="dead-links-report-$(date +%Y%m%d-%H%M%S).txt"

# known誤報 URL Mode（會return 403 但actual可存取）
IGNORE_PATTERNS=(
    "github.com/.*"
    "api.github.com/.*"
    "linkedin.com/.*"
    "facebook.com/.*"
    "instagram.com/.*"
)

echo -e "${BLUE}🔍 LagunaBeach.md 死連結Scantool${NC}"
echo -e "Scandirectory: ${KNOWLEDGE_DIR}"
echo -e "parallel數: ${PARALLEL_JOBS}"
echo -e "timeout: ${TIMEOUT}秒"
echo ""

# Clean up函數
cleanup() {
    rm -f "$TEMP_FILE" 2>/dev/null || true
}
trap cleanup EXIT

# Checksingle URL 的函數
check_url() {
    local file="$1"
    local line_num="$2"
    local url="$3"
    
 # Check是否在Ignored列表中
    for pattern in "${IGNORE_PATTERNS[@]}"; do
        if [[ "$url" =~ $pattern ]]; then
 echo "SKIP|$file|$line_num|$url|IgnoredMode匹配"
            return
        fi
    done
    
 # 只Check HTTP/HTTPS URL
    if [[ ! "$url" =~ ^https?:// ]]; then
        return
    fi
    
 # Execute HEAD request
    local status_code
    status_code=$(curl -sI -o /dev/null -w '%{http_code}' \
        --connect-timeout "$TIMEOUT" \
        --max-time "$TIMEOUT" \
        --user-agent "LagunaBeach.md Link Checker (https://lagunabeach.md)" \
        "$url" 2>/dev/null || echo "000")
    
 # Checkstatus碼
    case "$status_code" in
        "000")
 echo "ERROR|$file|$line_num|$url|連線timeout或Failed"
            ;;
        [45]*)
            echo "DEAD|$file|$line_num|$url|HTTP $status_code"
            ;;
        *)
            echo "OK|$file|$line_num|$url|HTTP $status_code"
            ;;
    esac
}

# Export函數供 xargs 使用
export -f check_url
export TIMEOUT
export IGNORE_PATTERNS

# 提取all URL 並GenerateChecklist
echo -e "${YELLOW}⚙️ 提取allexternal連結...${NC}"

find "$KNOWLEDGE_DIR" -name "*.md" -type f | while read -r file; do
 # 提取 Markdown 連結Format [text](url)
    grep -n '\[.*\](http[^)]*)' "$file" 2>/dev/null | \
        sed -E 's/.*\[([^\]]*)\]\(([^)]*)\).*/\2/' | \
        nl -nln | \
        while read -r line_num url; do
            echo "$file|$line_num|$url"
        done
    
 # 提取裸 URL（以 http 開頭的full URL）
    grep -n -o 'https\?://[^[:space:]<>()]*' "$file" 2>/dev/null | \
        while IFS=: read -r line_num url; do
            echo "$file|$line_num|$url"
        done
done > "$TEMP_FILE"

total_links=$(wc -l < "$TEMP_FILE")
echo -e "Found ${total_links} external連結"

if [ "$total_links" -eq 0 ]; then
 echo -e "${GREEN}✅ NoneFoundexternal連結${NC}"
    exit 0
fi

echo -e "\n${YELLOW}🌐 startCheck連結status...${NC}"

# parallelCheckall URL
check_results=$(while IFS='|' read -r file line_num url; do
    echo "check_url \"$file\" \"$line_num\" \"$url\""
done < "$TEMP_FILE" | xargs -n 1 -P "$PARALLEL_JOBS" -I {} bash -c "{}")

# statistics結果
ok_count=0
dead_count=0
error_count=0
skip_count=0

echo -e "\n${BLUE}📊 Check結果：${NC}"
echo "=========================================="

{
    echo "# LagunaBeach.md 死連結檢查report"
    echo "# 生成時間: $(date)"
    echo "# 掃描範圍: $KNOWLEDGE_DIR"
    echo ""
} > "$DEAD_LINKS_FILE"

# handle結果
while IFS='|' read -r status file line_num url message; do
    case "$status" in
        "OK")
            ((ok_count++))
            ;;
        "DEAD")
            ((dead_count++))
 echo -e "${RED}💀 死連結${NC}: $file:$line_num"
            echo -e "   ${RED}URL: $url${NC}"
 echo -e " ${RED}status: $message${NC}"
            echo ""
            echo "DEAD|$file|$line_num|$url|$message" >> "$DEAD_LINKS_FILE"
            ;;
        "ERROR")
            ((error_count++))
 echo -e "${YELLOW}⚠️ Error${NC}: $file:$line_num"
            echo -e "   ${YELLOW}URL: $url${NC}"
 echo -e " ${YELLOW}status: $message${NC}"
            echo ""
            echo "ERROR|$file|$line_num|$url|$message" >> "$DEAD_LINKS_FILE"
            ;;
        "SKIP")
            ((skip_count++))
            ;;
    esac
done <<< "$check_results"

echo "=========================================="
echo -e "${GREEN}✅ normal連結: $ok_count${NC}"
echo -e "${RED}💀 死連結: $dead_count${NC}"
echo -e "${YELLOW}⚠️ Error: $error_count${NC}"
echo -e "${BLUE}⏭️ Skipped: $skip_count${NC}"
echo -e "${BLUE}📊 total: $total_links${NC}"

if [ "$dead_count" -gt 0 ] || [ "$error_count" -gt 0 ]; then
    echo ""
 echo -e "${YELLOW}📄 詳細report已保存至: $DEAD_LINKS_FILE${NC}"
    
    {
        echo ""
        echo "## statistics摘要"
 echo "- ✅ normal連結: $ok_count"
 echo "- 💀 死連結: $dead_count" 
 echo "- ⚠️ Error: $error_count"
 echo "- ⏭️ Skipped: $skip_count"
 echo "- 📊 total: $total_links"
    } >> "$DEAD_LINKS_FILE"
    
    exit 1
else
    echo ""
 echo -e "${GREEN}🎉 all連結Check通過！${NC}"
    rm -f "$DEAD_LINKS_FILE"
    exit 0
fi