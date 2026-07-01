#!/bin/bash

# Featured article management tool
# Manages featured: true settings in knowledge/ articles

set -euo pipefail

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

KNOWLEDGE_DIR="knowledge"

# Usage
usage() {
    echo -e "${BLUE}🏆 Featured Article Management Tool${NC}"
    echo ""
    echo "Usage: $0 <command> [arguments]"
    echo ""
    echo "Commands:"
    echo "  list                    - List all featured articles"
    echo "  set <article-path>      - Set an article as featured"
    echo "  unset <article-path>    - Remove featured status from an article"
    echo "  audit                   - Check featured distribution across categories"
    echo ""
    echo "Examples:"
    echo "  $0 list"
    echo "  $0 set knowledge/History/laguna-beach-art-colony.md"
    echo "  $0 unset knowledge/Art/festival-of-arts.md"
    echo "  $0 audit"
}

# List all featured articles
list_featured() {
    echo -e "${BLUE}📋 All Featured Articles${NC}"
    echo "======================================"

    local count=0
    local current_category=""

    # Display sorted by category
    grep -r "featured: true" "$KNOWLEDGE_DIR" | \
        sort | \
        while IFS=':' read -r file _; do
            ((count++))
            
            # Extract category name
            local category=$(dirname "$file" | sed "s|$KNOWLEDGE_DIR/||" | sed 's|^en/||' | cut -d'/' -f1)

            if [[ "$category" != "$current_category" ]]; then
                echo -e "\n${YELLOW}📂 $category${NC}"
                current_category="$category"
            fi

            # Extract article title (from filename)
            local title=$(basename "$file" .md)
            echo -e "  ✨ $title"
            echo -e "     ${BLUE}File: $file${NC}"
    done

    local total=$(grep -r "featured: true" "$KNOWLEDGE_DIR" | wc -l)
    echo ""
    echo -e "${GREEN}📊 Total: $total featured articles${NC}"
}

# Set an article as featured
set_featured() {
    local file_path="$1"

    if [[ ! -f "$file_path" ]]; then
        echo -e "${RED}❌ File not found: $file_path${NC}"
        exit 1
    fi

    # Check if already featured
    if grep -q "featured: true" "$file_path"; then
        echo -e "${YELLOW}⚠️  Article is already featured: $file_path${NC}"
        return
    fi

    # Add featured: true to frontmatter
    if grep -q "^---$" "$file_path"; then
        # Insert featured: true before closing ---
        sed -i '' '/^---$/,/^---$/{
            /^---$/!{
                /featured:/d
            }
        }' "$file_path"
        
        # Add featured: true before second ---
        awk '
        /^---$/ && NR==1 { print; next }
        /^---$/ && seen_first { print "featured: true"; print; next }
        /^---$/ { seen_first=1; print; next }
        { print }
        ' "$file_path" > "${file_path}.tmp" && mv "${file_path}.tmp" "$file_path"
        
        echo -e "${GREEN}✅ Set featured: $file_path${NC}"
    else
        echo -e "${RED}❌ File missing frontmatter: $file_path${NC}"
        exit 1
    fi
}

# Remove featured status from an article
unset_featured() {
    local file_path="$1"

    if [[ ! -f "$file_path" ]]; then
        echo -e "${RED}❌ File not found: $file_path${NC}"
        exit 1
    fi

    # Check if article is featured
    if ! grep -q "featured: true" "$file_path"; then
        echo -e "${YELLOW}⚠️  Article is not featured: $file_path${NC}"
        return
    fi

    # Remove featured: true line
    sed -i '' '/^featured: true$/d' "$file_path"

    echo -e "${GREEN}✅ Removed featured: $file_path${NC}"
}

# Audit featured article distribution
audit_featured() {
    echo -e "${BLUE}📊 Featured Article Distribution Audit${NC}"
    echo "======================================"

    local total_featured=0
    local total_articles=0

    echo -e "${YELLOW}Featured articles per category:${NC}"
    echo ""

    # Count featured articles per category
    for category_dir in "$KNOWLEDGE_DIR"/*/ ; do
        if [[ -d "$category_dir" ]]; then
            local category=$(basename "$category_dir")
            
            # Skip language dirs and special dirs
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
            
            # Color based on ratio
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
    echo -e "${BLUE}Summary:${NC}"
    local overall_percentage=$((total_featured * 100 / total_articles))
    echo -e "📊 Featured articles: $total_featured/$total_articles ($overall_percentage%)"
    echo ""

    echo -e "${YELLOW}Guidelines:${NC}"
    echo "• Keep 1-2 featured articles per category"
    echo "• Featured articles should be the most representative content in each category"
    echo "• Overall featured ratio should stay between 5-10%"
    echo ""

    if [[ $overall_percentage -gt 15 ]]; then
        echo -e "${RED}⚠️  Featured ratio too high ($overall_percentage%), consider reducing${NC}"
    elif [[ $overall_percentage -lt 3 ]]; then
        echo -e "${YELLOW}⚠️  Featured ratio low ($overall_percentage%), consider adding more${NC}"
    else
        echo -e "${GREEN}✅ Featured ratio is healthy ($overall_percentage%)${NC}"
    fi
}

# Main
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
                echo -e "${RED}❌ Error: article path required${NC}"
                echo "Usage: $0 set <article-path>"
                exit 1
            fi
            set_featured "$2"
            ;;
        "unset")
            if [[ $# -ne 2 ]]; then
                echo -e "${RED}❌ Error: article path required${NC}"
                echo "Usage: $0 unset <article-path>"
                exit 1
            fi
            unset_featured "$2"
            ;;
        "audit")
            audit_featured
            ;;
        *)
            echo -e "${RED}❌ Unknown command: $1${NC}"
            usage
            exit 1
            ;;
    esac
}

main "$@"