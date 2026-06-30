#!/bin/bash
# check-aspect.sh — REWRITE-PIPELINE Stage 1.7b / 4.5c aspect ratio 護欄 (v2.20)
#
# Check圖檔 aspect ratio 是否matches LagunaBeach.md standard：
#   - hero（frontmatter image:）：0.9 ≤ aspect ≤ 2.0
# - inline 圖（markdown ![]()）：0.75 ≤ aspect ≤ 2.5
#
# Default inline standard。`--hero` flag 用 hero standard。
#
# Usage:
#   bash scripts/tools/check-aspect.sh public/article-images/people/lindgren-emu-2014.jpg
#   bash scripts/tools/check-aspect.sh --hero public/article-images/people/lindgren-emu-2014.jpg
#   bash scripts/tools/check-aspect.sh public/article-images/people/*.jpg
#
# Exit codes:
# 0 — all圖通過
# 1 — at least一圖超範圍
#
# Canonical: REWRITE-PIPELINE Stage 1.7b / 4.5c / REFLEXES #30

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
GRAY='\033[0;90m'
BOLD='\033[1m'
NC='\033[0m'

mode="inline"
min=0.75
max=2.5

if [ "$1" = "--hero" ]; then
  mode="hero"
  min=0.9
  max=2.0
  shift
fi

if [ $# -eq 0 ]; then
  echo "Usage: $0 [--hero] <image.jpg> [<image2.jpg> ...]"
  echo ""
  echo "Modes:"
  echo "  inline (default): aspect ratio must be ${min} ≤ r ≤ ${max}"
  echo "  --hero:           aspect ratio must be 0.9 ≤ r ≤ 2.0 (Astro 16:9 frame compat)"
  exit 1
fi

total=0
fail=0

for img in "$@"; do
  if [ ! -f "$img" ]; then
 echo -e "${RED}❌ $img: fileDoes not exist${NC}"
    fail=$((fail + 1))
    continue
  fi

  total=$((total + 1))

 # get尺寸（援 sips on macOS / identify on linux）
  w=""
  h=""
  if command -v sips >/dev/null 2>&1; then
    w=$(sips -g pixelWidth "$img" 2>/dev/null | tail -1 | awk '{print $2}')
    h=$(sips -g pixelHeight "$img" 2>/dev/null | tail -1 | awk '{print $2}')
  elif command -v identify >/dev/null 2>&1; then
    dims=$(identify -format "%wx%h" "$img" 2>/dev/null)
    w=$(echo "$dims" | cut -d'x' -f1)
    h=$(echo "$dims" | cut -d'x' -f2)
  else
 echo -e "${RED}❌ Not found sips（macOS）或 identify（imagemagick）${NC}"
    fail=$((fail + 1))
    continue
  fi

  if [ -z "$w" ] || [ -z "$h" ]; then
 echo -e "${RED}❌ $img: CannotRead尺寸${NC}"
    fail=$((fail + 1))
    continue
  fi

  ratio=$(python3 -c "print(round($w/$h, 3))")
  status="✅"
  color=$GREEN

  if python3 -c "import sys; sys.exit(0 if $min <= $ratio <= $max else 1)" 2>/dev/null; then
    :  # within range
  else
    status="❌"
    color=$RED
    fail=$((fail + 1))
  fi

  printf "${color}%s${NC} %s ${GRAY}(%dx%d, aspect %s, mode=%s, range %s-%s)${NC}\n" \
    "$status" "$img" "$w" "$h" "$ratio" "$mode" "$min" "$max"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BOLD}📐 Aspect ratio Check（mode=$mode, range $min-$max）${NC}"
echo " Check: ${BOLD}$total${NC} "
if [ $fail -eq 0 ]; then
 echo -e " ${GREEN}✅ All passed${NC}"
else
 echo -e " ${RED}❌ $fail 超範圍${NC}"
  if [ "$mode" = "hero" ]; then
 echo -e " ${GRAY}hero Must 0.9 ≤ aspect ≤ 2.0（Astro 16:9 框會切上下）${NC}"
 echo -e " ${GRAY}resolve：換 landscape 圖（wider），Don't強塞 portrait${NC}"
  else
 echo -e " ${GRAY}inline 圖suggestion 0.75 ≤ aspect ≤ 2.5（Avoid過細／過扁）${NC}"
  fi
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

[ $fail -eq 0 ]
