import os
import re
import glob

def extract_title_from_content(content):
    """Extract title from content"""
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if line.startswith('# '):
            return line[2:].strip()
    return "Untitled article"

def extract_description_from_content(content):
    """Extract description (first blockquote)"""
    lines = content.split('\n')
    in_quote = False
    description_lines = []
    
    for line in lines:
        line = line.strip()
        if line.startswith('> **30 秒概覽：**') or line.startswith('> **30秒概覽：**') or line.startswith('> **At a glance:**'):
            desc = line.replace('> **30 秒概覽：**', '').replace('> **30秒概覽：**', '').replace('> **At a glance:**', '').strip()
            return desc
        elif line.startswith('> ') and not in_quote:
            in_quote = True
            description_lines.append(line[2:])
        elif line.startswith('> ') and in_quote:
            description_lines.append(line[2:])
        elif in_quote and not line.startswith('>'):
            break
    
    if description_lines:
        return ' '.join(description_lines)
    
    # Fallback: first non-heading content lines
    lines = content.split('\n')
    desc_lines = []
    for line in lines:
        line = line.strip()
        if line and not line.startswith('#') and not line.startswith('---') and not line.startswith('>'):
            desc_lines.append(line)
            if len(' '.join(desc_lines)) > 100:
                break
    
    desc = ' '.join(desc_lines)[:150]
    return desc if desc else "Laguna Beach knowledge article"

def fix_frontmatter(filepath):
    """Fix frontmatter for a single file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Already has correct frontmatter
    if re.search(r'^title:', content, re.MULTILINE):
        return False

    # Extract content
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            old_frontmatter = parts[1]
            body = parts[2]
        else:
            old_frontmatter = ""
            body = content
    else:
        old_frontmatter = ""
        body = content
    
    # Extract info
    title = extract_title_from_content(body)
    description = extract_description_from_content(body)
    
    # Extract tags from old frontmatter
    tags = ["Laguna Beach"]
    if old_frontmatter:
        tag_match = re.search(r'tags:\s*\[(.*?)\]', old_frontmatter)
        if tag_match:
            old_tags = [tag.strip().strip('"\'') for tag in tag_match.group(1).split(',')]
            tags.extend(old_tags)
    
    # Deduplicate and format
    unique_tags = []
    for tag in tags:
        if tag not in unique_tags:
            unique_tags.append(tag)
    
    tags_str = ', '.join([f'"{tag}"' for tag in unique_tags[:5]])

    # New frontmatter
    new_frontmatter = f'''---
title: "{title}"
description: "{description[:200]}..."
date: 2026-03-17T00:00:00Z
tags: [{tags_str}]
author: "lagunabeach.md"
difficulty: "beginner"
readingTime: 8
featured: false
---'''
    
    # Write file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_frontmatter + '\n' + body.lstrip('\n'))
    
    return True

# Process all markdown files
fixed_count = 0
for pattern in ['src/content/zh-TW/*/*.md', 'src/content/en/*/*.md']:
    for filepath in glob.glob(pattern):
        if not filepath.endswith('_Home.md') and 'Hub.md' not in filepath:
            if fix_frontmatter(filepath):
                print(f"Fixed: {filepath}")
                fixed_count += 1

print(f"✅ Fixed frontmatter in {fixed_count} files")
