#!/usr/bin/env bash
# footnote-scan.sh v1.0 — 全站引用密度掃描器
# 用法: bash scripts/tools/footnote-scan.sh [--json] [--worst N] [--category CAT]
#
# 掃描 knowledge/ (中文 SSOT) 每篇文章的：
#   - 正式腳註數（[^N]: 格式）
#   - 行內 URL 數（http/https）
#   - 總字數（中文字元 + 英文單詞）
#   - 引用密度（字數 / 腳註數，越低越好）
#   - 健康等級：A=優秀 B=有腳註 C=有URL D=少URL F=裸奔
#
# 輸出按引用健康度排序（最差的排最前），供心跳診斷使用。
#
# 造橋鋪路原則：這個腳本讓每次心跳都能自動掃描引用健康度，
# 而不是一篇篇手動檢查 448 篇文章。
#
# DEPRECATED 2026-05-04 SSOT Phase 10: canonical logic moved to
#   `python3 scripts/tools/article-health.py <file> --check=footnote-density`
# This shell script remains functional for back-compat. Will be removed
# 30 days after Phase 10 lands. See reports/article-health-ssot-design-2026-05-04.md.
#

set -uo pipefail
cd "$(dirname "$0")/../.."

# ── Colors ──
RED='\033[0;31m'
YEL='\033[0;33m'
GRN='\033[0;32m'
DIM='\033[0;90m'
CYN='\033[0;36m'
BLD='\033[1m'
RST='\033[0m'

# ── Args ──
JSON_MODE=false
WORST_N=0
FILTER_CAT=""
args=("$@")
i=0
while [[ $i -lt ${#args[@]} ]]; do
  case "${args[$i]}" in
    --json) JSON_MODE=true ;;
    --worst) i=$((i + 1)); WORST_N="${args[$i]}" ;;
    --category) i=$((i + 1)); FILTER_CAT="${args[$i]}" ;;
  esac
  i=$((i + 1))
done

# ── Temp file for results (bash 3 compatible — no associative arrays) ──
RESULT_FILE=$(mktemp)
CAT_SUMMARY=$(mktemp)
trap 'rm -f "$RESULT_FILE" "$CAT_SUMMARY"' EXIT

# ── Counters ──
total=0
has_footnotes=0
has_urls_only=0
naked=0

scan_file() {
  local f="$1"
  local rel="${f#knowledge/}"
  local fcat
  fcat=$(echo "$rel" | cut -d'/' -f1)

  # Category filter
  if [[ -n "$FILTER_CAT" ]] && [[ "$fcat" != "$FILTER_CAT" ]]; then
    return
  fi

  # Skip short files
  local flines
  flines=$(wc -l < "$f")
  flines=${flines//[[:space:]]/}
  [[ $flines -lt 10 ]] && return

  # ── Count footnote definitions [^N]: ──
  local fn_count
  fn_count=$(grep -cE '^\[\^[0-9a-zA-Z_-]+\]:' "$f" 2>/dev/null || echo "0")
  fn_count=${fn_count//[[:space:]]/}

  # ── Count inline footnote references [^N] (excluding definitions) ──
  local fn_ref_count
  fn_ref_count=$(grep -oE '\[\^[0-9a-zA-Z_-]+\][^:]' "$f" 2>/dev/null | wc -l | tr -d '[:space:]')
  [[ -z "$fn_ref_count" ]] && fn_ref_count=0

  # Use max of definitions and references
  local fn_effective=$fn_count
  [[ $fn_ref_count -gt $fn_effective ]] && fn_effective=$fn_ref_count

  # ── Count URLs ──
  local url_count
  url_count=$(grep -cE 'https?://' "$f" 2>/dev/null || echo "0")
  url_count=${url_count//[[:space:]]/}

  # ── Word count (content only, skip frontmatter) ──
  local content
  content=$(awk 'BEGIN{fm=0} /^---$/{fm++; next} fm>=2{print}' "$f")
  local zh_chars en_words word_count
  zh_chars=$(printf '%s' "$content" | perl -CSD -ne 'while(/\p{CJK}/g){$c++} END{print $c//0}' 2>/dev/null || echo "0")
  en_words=$(printf '%s' "$content" | grep -oE '[a-zA-Z]+' 2>/dev/null | wc -l | tr -d '[:space:]')
  word_count=$((zh_chars + en_words))

  # Skip stubs
  [[ $word_count -lt 50 ]] && return

  total=$((total + 1))

  # ── Citation density ──
  local density=999999
  if [[ $fn_effective -gt 0 ]]; then
    density=$((word_count / fn_effective))
    has_footnotes=$((has_footnotes + 1))
  elif [[ $url_count -gt 0 ]]; then
    has_urls_only=$((has_urls_only + 1))
  else
    naked=$((naked + 1))
  fi

  # ── Health grade ──
  local grade
  if [[ $fn_effective -ge 3 ]] && [[ $density -le 300 ]]; then
    grade="A"
  elif [[ $fn_effective -ge 1 ]]; then
    grade="B"
  elif [[ $url_count -ge 3 ]]; then
    grade="C"
  elif [[ $url_count -ge 1 ]]; then
    grade="D"
  else
    grade="F"
  fi

  # grade_num for sorting (F=0, D=1, C=2, B=3, A=4)
  local grade_num
  case "$grade" in
    F) grade_num=0 ;; D) grade_num=1 ;; C) grade_num=2 ;; B) grade_num=3 ;; A) grade_num=4 ;;
  esac

  # Write to temp file: grade_num | density | grade | fn | url | words | cat | file
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
    "$grade_num" "$density" "$grade" "$fn_effective" "$url_count" "$word_count" "$fcat" "$rel" \
    >> "$RESULT_FILE"
}

# ── Scan all articles ──
while IFS= read -r -d '' file; do
  scan_file "$file"
done < <(find knowledge -maxdepth 2 -name '*.md' ! -path 'knowledge/en/*' ! -path 'knowledge/ja/*' ! -path 'knowledge/es/*' ! -path 'knowledge/resources/*' ! -name '_*' ! -name 'index.md' -print0 | sort -z)

# ── Sort: worst first (grade_num asc, density desc) ──
SORTED_FILE=$(mktemp)
trap 'rm -f "$RESULT_FILE" "$CAT_SUMMARY" "$SORTED_FILE"' EXIT
sort -t$'\t' -k1,1n -k2,2nr "$RESULT_FILE" > "$SORTED_FILE"

# ── Apply --worst N limit ──
if [[ $WORST_N -gt 0 ]]; then
  head -n "$WORST_N" "$SORTED_FILE" > "${SORTED_FILE}.tmp"
  mv "${SORTED_FILE}.tmp" "$SORTED_FILE"
fi

# ── Build category summary ──
# Format: cat | total | has_fn | naked
awk -F'\t' '{
  cat=$7; grade=$3; fn=$4
  totals[cat]++
  if (fn > 0) fn_counts[cat]++
  if (grade == "F") naked_counts[cat]++
}
END {
  for (c in totals) {
    printf "%s\t%d\t%d\t%d\n", c, totals[c], fn_counts[c]+0, naked_counts[c]+0
  }
}' "$RESULT_FILE" | sort -t$'\t' -k1,1 > "$CAT_SUMMARY"

# ── Grade distribution ──
grade_A=0; grade_B=0; grade_C=0; grade_D=0; grade_F=0
while IFS=$'\t' read -r _gn _den g _rest; do
  case "$g" in
    A) grade_A=$((grade_A + 1)) ;; B) grade_B=$((grade_B + 1)) ;;
    C) grade_C=$((grade_C + 1)) ;; D) grade_D=$((grade_D + 1)) ;;
    F) grade_F=$((grade_F + 1)) ;;
  esac
done < "$RESULT_FILE"

# ══════════════════════════════════════════════════════
# OUTPUT: Human-readable
# ══════════════════════════════════════════════════════
if [[ "$JSON_MODE" == false ]]; then
  echo ""
  echo -e "${BLD}📋 footnote-scan v1.0 — 全站引用密度報告${RST}"
  echo "   掃描 knowledge/ (中文 SSOT)"
  echo -e "   等級: ${GRN}A${RST}=優秀 ${GRN}B${RST}=有腳註 ${YEL}C${RST}=有URL ${YEL}D${RST}=少URL ${RED}F${RST}=裸奔"
  echo ""

  echo -e "${BLD}── 逐篇報告（最差排最前）──${RST}"
  echo ""
  while IFS=$'\t' read -r _gn _den grade fn url words fcat rel; do
    case "$grade" in
      F) gc="${RED}" gi="🔴" ;; D) gc="${YEL}" gi="🟡" ;; C) gc="${YEL}" gi="🟡" ;;
      B) gc="${GRN}" gi="🟢" ;; A) gc="${GRN}" gi="🟢" ;;
    esac
    density_str="$_den"
    [[ $_den -ge 999999 ]] && density_str="∞"
    printf "${gc}${gi} [%s] %-50s fn:%-3s url:%-3s words:%-5s density:%s${RST}\n" \
      "$grade" "$rel" "$fn" "$url" "$words" "$density_str"
  done < "$SORTED_FILE"

  # Category summary
  echo ""
  echo -e "${BLD}── 分類摘要 ──${RST}"
  echo ""
  printf "  %-15s %6s %8s %8s %10s\n" "分類" "總篇數" "有腳註" "裸奔(F)" "腳註率"
  printf "  %-15s %6s %8s %8s %10s\n" "───────────" "──────" "────────" "────────" "──────────"
  while IFS=$'\t' read -r cname ctot cfn cnak; do
    rate="0%"
    [[ $ctot -gt 0 ]] && rate="$((cfn * 100 / ctot))%"
    printf "  %-15s %6s %8s %8s %10s\n" "$cname" "$ctot" "$cfn" "$cnak" "$rate"
  done < "$CAT_SUMMARY"

  # Global summary
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "📊 全站引用健康度"
  echo -e "   總篇數:   ${BLD}${total}${RST}"
  fn_pct=0; url_pct=0; naked_pct=0
  [[ $total -gt 0 ]] && fn_pct=$((has_footnotes * 100 / total))
  [[ $total -gt 0 ]] && url_pct=$((has_urls_only * 100 / total))
  [[ $total -gt 0 ]] && naked_pct=$((naked * 100 / total))
  echo -e "   ${GRN}有腳註:   ${has_footnotes} (${fn_pct}%)${RST}"
  echo -e "   ${YEL}僅URL:    ${has_urls_only} (${url_pct}%)${RST}"
  echo -e "   ${RED}裸奔:     ${naked} (${naked_pct}%)${RST}"
  echo ""
  echo -e "   等級分布:"
  echo -e "   ${GRN}A (優秀):   ${grade_A}${RST}"
  echo -e "   ${GRN}B (有腳註):  ${grade_B}${RST}"
  echo -e "   ${YEL}C (有URL):   ${grade_C}${RST}"
  echo -e "   ${YEL}D (少URL):   ${grade_D}${RST}"
  echo -e "   ${RED}F (裸奔):    ${grade_F}${RST}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

# ══════════════════════════════════════════════════════
# OUTPUT: JSON
# ══════════════════════════════════════════════════════
if [[ "$JSON_MODE" == true ]]; then
  cat <<JSONHEAD
{
  "version": "1.0",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "summary": {
    "total": $total,
    "has_footnotes": $has_footnotes,
    "has_urls_only": $has_urls_only,
    "naked": $naked,
    "footnote_rate_pct": $(( total > 0 ? has_footnotes * 100 / total : 0 )),
    "grades": {"A": $grade_A, "B": $grade_B, "C": $grade_C, "D": $grade_D, "F": $grade_F}
  },
  "categories": {
JSONHEAD
  first_cat=true
  while IFS=$'\t' read -r cname ctot cfn cnak; do
    [[ "$first_cat" == true ]] && first_cat=false || printf ',\n'
    printf '    "%s": {"total": %s, "has_footnotes": %s, "naked": %s}' \
      "$cname" "$ctot" "$cfn" "$cnak"
  done < "$CAT_SUMMARY"
  cat <<JSONMID

  },
  "articles": [
JSONMID
  first=true
  while IFS=$'\t' read -r _gn _den grade fn url words fcat rel; do
    [[ "$first" == true ]] && first=false || printf ',\n'
    printf '    {"file": "%s", "category": "%s", "grade": "%s", "footnotes": %d, "urls": %d, "words": %d, "density": %d}' \
      "$rel" "$fcat" "$grade" "$fn" "$url" "$words" "$_den"
  done < "$SORTED_FILE"
  cat <<JSONEND

  ]
}
JSONEND
fi
