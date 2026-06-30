#!/bin/bash

# LagunaBeach.md Featured Articles統一管控tool
# 管理 knowledge/ directory下Articles的 featured: true Config

set -euo pipefail

# 顏色define
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

KNOWLEDGE_DIR="knowledge"

# 使用說明
usage() {
 echo -e "${BLUE}🏆 LagunaBeach.md Featured Articles管控tool${NC}"
    echo ""
 echo "Usage: $0 <command> [arguments]"
    echo ""
 echo "指令:"
 echo " list - 列出all featured Articles"
 echo " set <Articlespath> - ConfigArticles為 featured"
 echo " unset <Articlespath> - 取消Articles的 featured status"
 echo " audit - Check featured 數量分佈"
    echo ""
 echo "Example:"
    echo "  $0 list"
 echo " $0 set knowledge/Culture/台灣夜市文化.md"
 echo " $0 unset knowledge/Music/台灣搖滾樂發展史.md"
    echo "  $0 audit"
}

# 列出all featured Articles
list_featured() {
 echo -e "${BLUE}📋 all Featured Articles列表${NC}"
    echo "======================================"
    
    local count=0
    local current_category=""
    
 # 按categorySortdisplay
    grep -r "featured: true" "$KNOWLEDGE_DIR" | \
        sort | \
        while IFS=':' read -r file _; do
            ((count++))
            
 # 提取category名稱
            local category=$(dirname "$file" | sed "s|$KNOWLEDGE_DIR/||" | sed 's|^en/||' | cut -d'/' -f1)
            
            if [[ "$category" != "$current_category" ]]; then
                echo -e "\n${YELLOW}📂 $category${NC}"
                current_category="$category"
            fi
            
 # 提取Articlestitle（Fromfilename）
            local title=$(basename "$file" .md)
            echo -e "  ✨ $title"
 echo -e " ${BLUE}file: $file${NC}"
    done
    
    local total=$(grep -r "featured: true" "$KNOWLEDGE_DIR" | wc -l)
    echo ""
 echo -e "${GREEN}📊 total: $total featured Articles${NC}"
}

# ConfigArticles為 featured
set_featured() {
    local file_path="$1"
    
    if [[ ! -f "$file_path" ]]; then
 echo -e "${RED}❌ fileDoes not exist: $file_path${NC}"
        exit 1
    fi
    
 # Check是否Already是 featured
    if grep -q "featured: true" "$file_path"; then
 echo -e "${YELLOW}⚠️ ArticlesAlready是 featured status: $file_path${NC}"
        return
    fi
    
 # 在 frontmatter 中加入 featured: true
    if grep -q "^---$" "$file_path"; then
 # 在第二 --- before插入 featured: true
        sed -i '' '/^---$/,/^---$/{
            /^---$/!{
                /featured:/d
            }
        }' "$file_path"
        
 # 在第二 --- before加入 featured: true
        awk '
        /^---$/ && NR==1 { print; next }
        /^---$/ && seen_first { print "featured: true"; print; next }
        /^---$/ { seen_first=1; print; next }
        { print }
        ' "$file_path" > "${file_path}.tmp" && mv "${file_path}.tmp" "$file_path"
        
 echo -e "${GREEN}✅ 已Config featured: $file_path${NC}"
    else
 echo -e "${RED}❌ file缺少 frontmatter: $file_path${NC}"
        exit 1
    fi
}

# 取消Articles的 featured status
unset_featured() {
    local file_path="$1"
    
    if [[ ! -f "$file_path" ]]; then
 echo -e "${RED}❌ fileDoes not exist: $file_path${NC}"
        exit 1
    fi
    
 # Check是否為 featured
    if ! grep -q "featured: true" "$file_path"; then
 echo -e "${YELLOW}⚠️ Articles本來就not featured status: $file_path${NC}"
        return
    fi
    
 # Remove featured: true 行
    sed -i '' '/^featured: true$/d' "$file_path"
    
 echo -e "${GREEN}✅ 已取消 featured: $file_path${NC}"
}

# 審計 featured Articles分佈
audit_featured() {
 echo -e "${BLUE}📊 Featured Articles分佈審計${NC}"
    echo "======================================"
    
    local total_featured=0
    local total_articles=0
    
 echo -e "${YELLOW}各category Featured Articlesstatistics：${NC}"
    echo ""
    
 # statistics各category的 featured Articles數量
    for category_dir in "$KNOWLEDGE_DIR"/*/ ; do
        if [[ -d "$category_dir" ]]; then
            local category=$(basename "$category_dir")
            
 # SkippedEnglishversion和特殊directory
            if [[ "$category" == "en" || "$category" == "About" ]]; then
                continue
            fi
            
            local featured_count=$(find "$category_dir" -name "*.md" -exec grep -l "featured: true" {} \; 2>/dev/null | wc -l)
            local total_count=$(find "$category_dir" -name "*.md" | wc -l)
            local percentage=0
            
            if [[ $total_count -gt 0 ]]; then
                percentage=$((featured_count * 100 / total_count))
            fi
            
            total_featured=$((total_featured + featured_count))
            total_articles=$((total_articles + total_count))
            
 # 根據比例給出顏色提示
            local color=""
            if [[ $featured_count -eq 0 ]]; then
                color="${RED}"
            elif [[ $featured_count -le 2 ]]; then
                color="${GREEN}"
            elif [[ $featured_count -le 5 ]]; then
                color="${YELLOW}"
            else
                color="${RED}"
            fi
            
            echo -e "${color}📂 $category: $featured_count/$total_count ($percentage%)${NC}"
        fi
    done
    
    echo ""
 echo -e "${BLUE}totalstatistics：${NC}"
    local overall_percentage=$((total_featured * 100 / total_articles))
 echo -e "📊 Featured Articles: $total_featured/$total_articles ($overall_percentage%)"
    echo ""
    
 echo -e "${YELLOW}suggestion：${NC}"
 echo "• suggestionEachcategory保持 1-2 featured Articles"
 echo "• featured ArticlesShould是該category最具represents性的Content"
 echo "• 總體 featured 比例suggestion控制在 5-10%"
    echo ""
    
    if [[ $overall_percentage -gt 15 ]]; then
 echo -e "${RED}⚠️ Featured Articles比例過高 ($overall_percentage%)，suggestion精簡${NC}"
    elif [[ $overall_percentage -lt 3 ]]; then
 echo -e "${YELLOW}⚠️ Featured Articles比例較低 ($overall_percentage%)，可適當增加${NC}"
    else
 echo -e "${GREEN}✅ Featured Articles比例適中 ($overall_percentage%)${NC}"
    fi
}

# 主program
main() {
    if [[ $# -eq 0 ]]; then
        usage
        exit 1
    fi
    
    case "$1" in
        "list")
            list_featured
            ;;
        "set")
            if [[ $# -ne 2 ]]; then
 echo -e "${RED}❌ Error：Need指定Articlespath${NC}"
 echo "Usage: $0 set <Articlespath>"
                exit 1
            fi
            set_featured "$2"
            ;;
        "unset")
            if [[ $# -ne 2 ]]; then
 echo -e "${RED}❌ Error：Need指定Articlespath${NC}"
 echo "Usage: $0 unset <Articlespath>"
                exit 1
            fi
            unset_featured "$2"
            ;;
        "audit")
            audit_featured
            ;;
        *)
 echo -e "${RED}❌ unknown指令: $1${NC}"
            usage
            exit 1
            ;;
    esac
}

# Execute主program
main "$@"