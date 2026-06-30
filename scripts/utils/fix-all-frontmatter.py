import os
import re
import glob

def extract_title_from_content(content):
 """FromContent中提取title"""
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if line.startswith('# '):
            return line[2:].strip()
 return "未命名Articles"

def extract_description_from_content(content):
 """FromContent中提取description（第一引用塊）"""
    lines = content.split('\n')
    in_quote = False
    description_lines = []
    
    for line in lines:
        line = line.strip()
        if line.startswith('> **30 second overview：**') or line.startswith('> **30second overview：**'):
 # 提取這行的descriptionpartial
 desc = line.replace('> **30 second overview：**', '').replace('> **30second overview：**', '').strip()
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
    
 # If沒Found，返回前幾行非titleContent
    lines = content.split('\n')
    desc_lines = []
    for line in lines:
        line = line.strip()
        if line and not line.startswith('#') and not line.startswith('---') and not line.startswith('>'):
            desc_lines.append(line)
            if len(' '.join(desc_lines)) > 100:
                break
    
    desc = ' '.join(desc_lines)[:150]
 return desc if desc else "台灣related知識Articles"

def fix_frontmatter(filepath):
 """Fix單file的 frontmatter"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
 # Check是否已有correct的 frontmatter
    if re.search(r'^title:', content, re.MULTILINE):
 return False # Alreadycorrect，不需Fix
    
 # 提取Content
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
    
 # 提取資訊
    title = extract_title_from_content(body)
    description = extract_description_from_content(body)
    
 # From舊 frontmatter 提取 tags
 tags = ["台灣"]
    if old_frontmatter:
        tag_match = re.search(r'tags:\s*\[(.*?)\]', old_frontmatter)
        if tag_match:
            old_tags = [tag.strip().strip('"\'') for tag in tag_match.group(1).split(',')]
            tags.extend(old_tags)
    
 # 去重並Format化
    unique_tags = []
    for tag in tags:
        if tag not in unique_tags:
            unique_tags.append(tag)
    
 tags_str = ', '.join([f'"{tag}"' for tag in unique_tags[:5]]) # 限制5標籤
    
 # 新的 frontmatter
    new_frontmatter = f'''---
title: "{title}"
description: "{description[:200]}..."
date: 2026-03-17T00:00:00Z
tags: [{tags_str}]
author: "lagunabeach.md 社群"
difficulty: "beginner"
readingTime: 8
featured: false
---'''
    
 # Writefile
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_frontmatter + '\n' + body.lstrip('\n'))
    
    return True

# handleall markdown file
fixed_count = 0
for pattern in ['src/content/zh-TW/*/*.md', 'src/content/en/*/*.md']:
    for filepath in glob.glob(pattern):
        if not filepath.endswith('_Home.md') and 'Hub.md' not in filepath:
            if fix_frontmatter(filepath):
 print(f"Fix: {filepath}")
                fixed_count += 1

print(f"✅ Fix了 {fixed_count} file的 frontmatter")
