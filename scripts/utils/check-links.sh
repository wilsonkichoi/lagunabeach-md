#!/bin/bash

# Dead link scanner
# Scans all .md files under knowledge/ for external links
# Checks HTTP status codes in parallel, reports dead links

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Config
KNOWLEDGE_DIR="knowledge"
TIMEOUT=10
PARALLEL_JOBS=10
TEMP_FILE=$(mktemp)
DEAD_LINKS_FILE="dead-links-report-$(date +%Y%m%d-%H%M%S).txt"

# Known false-positive URL patterns (return 403 but actually accessible)
IGNORE_PATTERNS=(
    "github.com/.*"
    "api.github.com/.*"
    "linkedin.com/.*"
    "facebook.com/.*"
    "instagram.com/.*"
)

echo -e "${BLUE}🔍 Dead link scanner${NC}"
echo -e "Scan directory: ${KNOWLEDGE_DIR}"
echo -e "Parallel jobs: ${PARALLEL_JOBS}"
echo -e "Timeout: ${TIMEOUT}s"
echo ""

# Cleanup
cleanup() {
    rm -f "$TEMP_FILE" 2>/dev/null || true
}
trap cleanup EXIT

# Check a single URL
check_url() {
    local file="$1"
    local line_num="$2"
    local url="$3"
    
    # Check if in ignore list
    for pattern in "${IGNORE_PATTERNS[@]}"; do
        if [[ "$url" =~ $pattern ]]; then
            echo "SKIP|$file|$line_num|$url|ignore-pattern-match"
            return
        fi
    done
    
    # Only check HTTP/HTTPS URLs
    if [[ ! "$url" =~ ^https?:// ]]; then
        return
    fi
    
    # HEAD request
    local status_code
    status_code=$(curl -sI -o /dev/null -w '%{http_code}' \
        --connect-timeout "$TIMEOUT" \
        --max-time "$TIMEOUT" \
        --user-agent "LagunaBeach.md Link Checker (https://lagunabeach.md)" \
        "$url" 2>/dev/null || echo "000")
    
    # Check status code
    case "$status_code" in
        "000")
            echo "ERROR|$file|$line_num|$url|connection timeout or failure"
            ;;
        [45]*)
            echo "DEAD|$file|$line_num|$url|HTTP $status_code"
            ;;
        *)
            echo "OK|$file|$line_num|$url|HTTP $status_code"
            ;;
    esac
}

# Export function for xargs
export -f check_url
export TIMEOUT
export IGNORE_PATTERNS

# Extract all URLs and build check list
echo -e "${YELLOW}⚙️  Extracting external links...${NC}"

find "$KNOWLEDGE_DIR" -name "*.md" -type f | while read -r file; do
    # Extract Markdown link format [text](url)
    grep -n '\[.*\](http[^)]*)' "$file" 2>/dev/null | \
        sed -E 's/.*\[([^\]]*)\]\(([^)]*)\).*/\2/' | \
        nl -nln | \
        while read -r line_num url; do
            echo "$file|$line_num|$url"
        done
    
    # Extract bare URLs (starting with http)
    grep -n -o 'https\?://[^[:space:]<>()]*' "$file" 2>/dev/null | \
        while IFS=: read -r line_num url; do
            echo "$file|$line_num|$url"
        done
done > "$TEMP_FILE"

total_links=$(wc -l < "$TEMP_FILE")
echo -e "Found ${total_links} external links"

if [ "$total_links" -eq 0 ]; then
    echo -e "${GREEN}✅ No external links found${NC}"
    exit 0
fi

echo -e "\n${YELLOW}🌐 Checking link status...${NC}"

# Check all URLs in parallel
check_results=$(while IFS='|' read -r file line_num url; do
    echo "check_url \"$file\" \"$line_num\" \"$url\""
done < "$TEMP_FILE" | xargs -n 1 -P "$PARALLEL_JOBS" -I {} bash -c "{}")

# Tally results
ok_count=0
dead_count=0
error_count=0
skip_count=0

echo -e "\n${BLUE}📊 Results:${NC}"
echo "=========================================="

{
    echo "# Dead link report"
    echo "# Generated: $(date)"
    echo "# Scan scope: $KNOWLEDGE_DIR"
    echo ""
} > "$DEAD_LINKS_FILE"

# Process results
while IFS='|' read -r status file line_num url message; do
    case "$status" in
        "OK")
            ((ok_count++))
            ;;
        "DEAD")
            ((dead_count++))
            echo -e "${RED}💀 Dead link${NC}: $file:$line_num"
            echo -e "   ${RED}URL: $url${NC}"
            echo -e "   ${RED}Status: $message${NC}"
            echo ""
            echo "DEAD|$file|$line_num|$url|$message" >> "$DEAD_LINKS_FILE"
            ;;
        "ERROR")
            ((error_count++))
            echo -e "${YELLOW}⚠️  Error${NC}: $file:$line_num"
            echo -e "   ${YELLOW}URL: $url${NC}"
            echo -e "   ${YELLOW}Status: $message${NC}"
            echo ""
            echo "ERROR|$file|$line_num|$url|$message" >> "$DEAD_LINKS_FILE"
            ;;
        "SKIP")
            ((skip_count++))
            ;;
    esac
done <<< "$check_results"

echo "=========================================="
echo -e "${GREEN}✅ OK: $ok_count${NC}"
echo -e "${RED}💀 Dead: $dead_count${NC}"
echo -e "${YELLOW}⚠️  Error: $error_count${NC}"
echo -e "${BLUE}⏭️  Skipped: $skip_count${NC}"
echo -e "${BLUE}📊 Total: $total_links${NC}"

if [ "$dead_count" -gt 0 ] || [ "$error_count" -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}📄 Detailed report saved to: $DEAD_LINKS_FILE${NC}"

    {
        echo ""
        echo "## Summary"
        echo "- ✅ OK: $ok_count"
        echo "- 💀 Dead: $dead_count"
        echo "- ⚠️ Error: $error_count"
        echo "- ⏭️ Skipped: $skip_count"
        echo "- 📊 Total: $total_links"
    } >> "$DEAD_LINKS_FILE"
    
    exit 1
else
    echo ""
    echo -e "${GREEN}🎉 All links passed!${NC}"
    rm -f "$DEAD_LINKS_FILE"
    exit 0
fi