#!/bin/bash

# LagunaBeach.md Translation Contribution Script
# One-line translation contribution automation
# Usage: bash scripts/translate.sh

set -euo pipefail

# Colors for better UX
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emoji for better visual feedback
INFO="📋"
SUCCESS="✅"
WARNING="⚠️"
ERROR="❌"
ROCKET="🚀"
MAGIC="✨"

# GitHub repo URL
REPO_URL="https://github.com/wilsonkichoi/lagunabeach-md"

# Function to print colored messages
print_info() {
    echo -e "${CYAN}${INFO} $1${NC}"
}

print_success() {
    echo -e "${GREEN}${SUCCESS} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}${WARNING} $1${NC}"
}

print_error() {
    echo -e "${RED}${ERROR} $1${NC}"
}

print_magic() {
    echo -e "${PURPLE}${MAGIC} $1${NC}"
}

# Function to check if jq is available, fallback to grep/sed if not
parse_json() {
    local json_file="$1"
    local key="$2"
    
    if command -v jq >/dev/null 2>&1; then
        jq -r "keys[]" "$json_file" 2>/dev/null || true
    else
        # Fallback: extract keys using grep and sed
        grep -o '"[^"]*":' "$json_file" | sed 's/"//g' | sed 's/://' | sort
    fi
}

# Function to check if we're in a Taiwan.md repository
check_repo() {
    if [[ -f "knowledge/_translations.json" && -d "knowledge/en" ]]; then
        return 0
    else
        return 1
    fi
}

# Function to clone repository if needed
setup_repo() {
    print_info "Checking repository environment..."

    if check_repo; then
        print_success "Already in project directory"
        return 0
    fi

    # Not in the right directory, try to clone
    print_warning "Not in project directory, preparing to clone repository..."

    # Check if git is available
    if ! command -v git >/dev/null 2>&1; then
        print_error "git is required. Please install git or clone the repository manually."
        exit 1
    fi

    # Clone to current directory if it's empty, or to a new directory
    if [[ -n "$(ls -A . 2>/dev/null)" ]]; then
        CLONE_DIR="lagunabeach-md"
        print_info "Cloning to $CLONE_DIR directory..."
        git clone "$REPO_URL" "$CLONE_DIR"
        cd "$CLONE_DIR"
    else
        print_info "Cloning to current directory..."
        git clone "$REPO_URL" .
    fi

    print_success "Repository ready"
}

# Function to get already translated files
get_translated_files() {
    local translations_file="knowledge/_translations.json"
    if [[ -f "$translations_file" ]]; then
        parse_json "$translations_file" | while read -r en_path; do
            echo "${en_path#en/}"
        done
    fi
}

# Function to find all Chinese markdown files
find_chinese_files() {
    find knowledge -name "*.md" -not -path "*/en/*" -not -name "_*" -not -path "*/About/*" | sort
}

# Function to get category priority
get_category_priority() {
    local category="$1"
    case "$category" in
        "Food") echo 1 ;;
        "Culture") echo 2 ;;
        "History") echo 3 ;;
        "Nature") echo 4 ;;
        "Art") echo 5 ;;
        "Technology") echo 6 ;;
        "Economy") echo 7 ;;
        "Society") echo 8 ;;
        "Geography") echo 9 ;;
        "Music") echo 10 ;;
        "Lifestyle") echo 11 ;;
        "People") echo 12 ;;
        *) echo 99 ;;
    esac
}

# Function to find untranslated files
find_untranslated_files() {
    local translated_list=$(mktemp)
    local chinese_files=$(mktemp)
    local untranslated=$(mktemp)
    
    get_translated_files > "$translated_list"
    find_chinese_files > "$chinese_files"
    
    # Compare and find untranslated
    while read -r file; do
        relative_path="${file#knowledge/}"
        if ! grep -Fxq "$relative_path" "$translated_list"; then
            category=$(echo "$relative_path" | cut -d'/' -f1)
            priority=$(get_category_priority "$category")
            echo "$priority|$file"
        fi
    done < "$chinese_files" | sort -n | cut -d'|' -f2 > "$untranslated"
    
    cat "$untranslated"
    
    # Cleanup
    rm -f "$translated_list" "$chinese_files" "$untranslated"
}

# Function to display file list with numbers
display_file_list() {
    local files=("$@")
    local count=1

    echo ""
    print_info "Articles awaiting translation:"
    echo ""
    
    for file in "${files[@]}"; do
        # Extract category and filename
        relative_path="${file#knowledge/}"
        category=$(echo "$relative_path" | cut -d'/' -f1)
        filename=$(basename "$file" .md)
        
        # Color code by category
        case "$category" in
            "Food") color="$RED" ;;
            "Culture") color="$GREEN" ;;
            "History") color="$YELLOW" ;;
            "Nature") color="$BLUE" ;;
            "Art") color="$PURPLE" ;;
            *) color="$CYAN" ;;
        esac
        
        echo -e "${color}${count}.${NC} ${category}/${filename}"
        ((count++))
    done
    
    echo ""
}

# Function to get user selection
get_user_selection() {
    local max_num="$1"
    local selection
    
    echo -e "${YELLOW}Select article numbers to translate (space-separated, e.g.: 1 3 5)${NC}"
    echo -e "${YELLOW}Or press Enter to translate the first 3:${NC}"
    
    read -r selection
    
    if [[ -z "$selection" ]]; then
        # Default: first 3 files
        if [[ $max_num -ge 3 ]]; then
            echo "1 2 3"
        else
            seq 1 "$max_num" | tr '\n' ' '
        fi
    else
        echo "$selection"
    fi
}

# Function to generate slug from Chinese filename
generate_slug() {
    local filename="$1"
    # Remove .md extension and convert to kebab-case
    # This is a simple version; might need more sophisticated handling
    echo "$filename" | sed 's/\.md$//' | tr '[:upper:]' '[:lower:]' | sed 's/[[:space:][:punct:]]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g'
}

# Function to copy to clipboard (cross-platform)
copy_to_clipboard() {
    local content="$1"
    
    if command -v pbcopy >/dev/null 2>&1; then
        echo "$content" | pbcopy
        return 0
    elif command -v xclip >/dev/null 2>&1; then
        echo "$content" | xclip -selection clipboard
        return 0
    else
        return 1
    fi
}

# Function to read translation prompt template
get_translation_prompt() {
    local article_content="$1"
    local style_content="$2"

    # Check if TRANSLATE_PROMPT.md exists
    if [[ -f "docs/prompts/TRANSLATE_PROMPT.md" ]]; then
        # Use existing template and replace placeholder
        sed "s|{ARTICLE_CONTENT}|$article_content|g" docs/prompts/TRANSLATE_PROMPT.md
    else
        # Generate prompt inline (fallback)
        cat << EOF
# LagunaBeach.md Translation Prompt

Paste this into ChatGPT / Claude / Gemini to translate an article.

## Your role
You are a translation volunteer for LagunaBeach.md, an open-source Markdown
knowledge base about Laguna Beach, California. Your task is to rewrite an
English article into the target language — not word-for-word translation, but
natural, fluent prose a native speaker would enjoy reading.

## Translation rules

### Core principles
- **Rewrite-style translation**: reads like a native speaker wrote it
- **Proper nouns**: keep English place names + local explanation where needed
- **Cultural context**: add brief explanation for unfamiliar concepts
- **Curator voice**: maintain opinionated, warm tone
- **Length**: may be slightly longer than source (cultural explanation), max 120%

### Format requirements
- Keep frontmatter (\`---\` block), translate title and description
- Keep all emoji, translate the text after them
- Keep all URL reference links
- Keep Markdown formatting (heading levels, bold, tables)

### Filename
- Use kebab-case (e.g. \`crystal-cove-tide-pools.md\`)

$style_content

## Article to translate

$article_content

## Output format
Output the complete Markdown file (including frontmatter) with no preamble or explanation.
EOF
    fi
}

# Function to process translation for a single file
process_translation() {
    local file="$1"
    local index="$2"

    print_info "Processing article #$index: $(basename "$file")"
    
    # Read original article
    local article_content=$(cat "$file")
    
    # Read style guide
    local style_content=""
    if [[ -f "i18n/en/STYLE.md" ]]; then
        style_content=$(cat "i18n/en/STYLE.md")
    fi
    
    # Generate prompt
    local prompt=$(get_translation_prompt "$article_content" "$style_content")
    
    # Try to copy to clipboard
    local prompt_file="/tmp/translate-prompt-$index.txt"
    echo "$prompt" > "$prompt_file"
    
    if copy_to_clipboard "$prompt"; then
        print_success "📋 Prompt copied to clipboard!"
    else
        print_warning "Cannot copy to clipboard. Prompt saved to: $prompt_file"
    fi

    echo ""
    echo -e "${YELLOW}Paste the prompt into ChatGPT/Claude/Gemini, then paste the translation back here.${NC}"
    echo -e "${YELLOW}Options:${NC}"
    echo -e "${YELLOW}1. Paste translation content directly${NC}"
    echo -e "${YELLOW}2. Enter a file path (e.g.: /tmp/translation.md)${NC}"
    echo -e "${YELLOW}3. Enter 'skip' to skip this article${NC}"
    echo ""

    # Get translation from user
    print_info "Paste translation result:"
    
    local translation=""
    local input_line
    
    # Check if input is a file path
    read -r input_line
    
    if [[ "$input_line" == "skip" ]]; then
        print_warning "Skipping this article"
        return 0
    elif [[ -f "$input_line" ]]; then
        translation=$(cat "$input_line")
        print_success "Read translation from file"
    else
        # Read multi-line input
        translation="$input_line"
        echo -e "${CYAN}Continue pasting content, press Ctrl+D when done:${NC}"
        while IFS= read -r line; do
            translation="${translation}${line}"$'\n'
        done
    fi
    
    if [[ -z "$translation" ]]; then
        print_warning "No translation content received, skipping"
        return 0
    fi
    
    # Determine English file path
    local relative_path="${file#knowledge/}"
    local category=$(echo "$relative_path" | cut -d'/' -f1)
    local filename=$(basename "$file" .md)
    local slug=$(generate_slug "$filename")
    local en_path="knowledge/en/$category/$slug.md"
    
    # Create directory if needed
    mkdir -p "$(dirname "$en_path")"
    
    # Write translation
    echo "$translation" > "$en_path"
    print_success "Translation saved to: $en_path"
    
    # Update translations.json
    update_translations_json "en/$category/$slug.md" "$relative_path"
    
    echo ""
}

# Function to update translations.json
update_translations_json() {
    local en_path="$1"
    local zh_path="$2"
    local translations_file="knowledge/_translations.json"
    
    # Create backup
    cp "$translations_file" "${translations_file}.bak"
    
    if command -v jq >/dev/null 2>&1; then
        # Use jq for proper JSON manipulation
        jq --arg en "$en_path" --arg zh "$zh_path" '. + {($en): $zh}' "$translations_file" > "${translations_file}.tmp" && mv "${translations_file}.tmp" "$translations_file"
    else
        # Fallback: manual JSON editing (basic)
        # Remove the last } and add the new entry
        local temp_file=$(mktemp)
        sed '$d' "$translations_file" > "$temp_file"
        echo "  \"$en_path\": \"$zh_path\"," >> "$temp_file"
        echo "}" >> "$temp_file"
        mv "$temp_file" "$translations_file"
        
        # Fix potential comma issues
        sed -i.bak 's/,}/}/' "$translations_file" && rm -f "${translations_file}.bak"
    fi
    
    print_success "Translation record updated"
}

# Function to create git branch and commit
create_git_branch_and_commit() {
    local translated_count="$1"
    local categories="$2"
    
    # Check if git is available
    if ! command -v git >/dev/null 2>&1; then
        print_warning "Git not installed, skipping auto-commit"
        return 0
    fi

    # Create branch
    local date=$(date +%Y%m%d)
    local branch_name="translate/${date}-en"

    print_info "Creating Git branch: $branch_name"
    git checkout -b "$branch_name" 2>/dev/null || git checkout "$branch_name" 2>/dev/null || true
    
    # Add files
    git add knowledge/en/ knowledge/_translations.json
    
    # Commit
    local commit_message="feat(en): translate $translated_count articles — [$categories]"
    git commit -m "$commit_message"
    
    print_success "Commit created: $commit_message"

    # Ask if user wants to push and create PR
    echo ""
    print_info "Push and create a Pull Request? (y/N)"
    read -r push_answer
    
    if [[ "$push_answer" =~ ^[Yy]$ ]]; then
        # Check if gh CLI is available
        if command -v gh >/dev/null 2>&1; then
            print_info "Pushing branch and creating PR..."
            git push origin "$branch_name"

            local pr_title="🌐 Translate $translated_count articles to English"
            local pr_body="Automated translation contribution via translate.sh script.

Categories: $categories
Files translated: $translated_count

Created by LagunaBeach.md Translation Automation System."

            gh pr create --title "$pr_title" --body "$pr_body" --head "$branch_name" --base "main"
            print_success "🎉 Pull Request created!"
        else
            print_warning "GitHub CLI (gh) not installed"
            git push origin "$branch_name"
            print_info "Branch pushed. Please create a Pull Request manually:"
            echo -e "${BLUE}$REPO_URL/compare/$branch_name${NC}"
        fi
    else
        print_info "Branch ready. You can push later:"
        echo -e "${BLUE}git push origin $branch_name${NC}"
    fi
}

# Main function
main() {
    echo ""
    echo -e "${PURPLE}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${NC}"
    echo -e "${PURPLE}${MAGIC}                                                           ${MAGIC}${NC}"
    echo -e "${PURPLE}${MAGIC}     LagunaBeach.md Translation Automation 🌐               ${MAGIC}${NC}"
    echo -e "${PURPLE}${MAGIC}                                                           ${MAGIC}${NC}"
    echo -e "${PURPLE}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${MAGIC}${NC}"
    echo ""
    
    # Setup repository
    setup_repo

    # Find untranslated files
    print_info "Scanning for untranslated articles..."
    
    local untranslated_files=()
    while IFS= read -r line; do
        [[ -n "$line" ]] && untranslated_files+=("$line")
    done < <(find_untranslated_files)
    
    local total_count=${#untranslated_files[@]}
    
    if [[ $total_count -eq 0 ]]; then
        print_success "🎉 All articles already translated!"
        exit 0
    fi

    print_success "Found $total_count articles awaiting translation"
    
    # Display file list
    display_file_list "${untranslated_files[@]}"
    
    # Get user selection
    local max_display=$(( total_count > 10 ? 10 : total_count ))
    local display_files=("${untranslated_files[@]:0:$max_display}")
    
    echo -e "${CYAN}Showing first $max_display of $total_count untranslated${NC}"
    echo ""
    
    local selection=$(get_user_selection $max_display)
    
    # Process selected files
    local processed_count=0
    local categories=""
    
    for num in $selection; do
        if [[ $num -gt 0 && $num -le $max_display ]]; then
            local file_index=$((num - 1))
            local file="${display_files[$file_index]}"
            
            process_translation "$file" "$num"
            
            # Track categories
            local category=$(echo "${file#knowledge/}" | cut -d'/' -f1)
            if [[ ! "$categories" =~ $category ]]; then
                categories="${categories}${category} "
            fi
            
            ((processed_count++))
        fi
    done
    
    categories=$(echo "$categories" | xargs) # trim whitespace
    
    if [[ $processed_count -gt 0 ]]; then
        print_success "🎉 Completed $processed_count article translations!"

        # Create git branch and commit
        create_git_branch_and_commit "$processed_count" "$categories"

        echo ""
        print_magic "Thank you for contributing translations!"
        print_info "More info: $REPO_URL"
    else
        print_warning "No articles processed"
    fi
}

# Run main function
main "$@"