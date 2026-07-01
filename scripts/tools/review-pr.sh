#!/usr/bin/env bash
# review-pr.sh v1.1 — LagunaBeach.md PR automated review (5-layer immune system)
# Usage: bash scripts/review-pr.sh file1.md file2.md ...
#    or: bash scripts/review-pr.sh --pr 123
set -uo pipefail
cd "$(dirname "$0")/../.."

RED='\033[0;31m'; YEL='\033[0;33m'; GRN='\033[0;32m'
BLU='\033[0;34m'; DIM='\033[0;90m'; RST='\033[0m'

VALID_CATS=("About" "History" "Art & Galleries" "Nature & Marine Life" "Food" "Beaches" "Trails" "Events & Festivals" "Neighborhoods")
# LB articles are English-only; no simplified-Chinese detector needed

TOTAL=0; L0=0; L1=0; L2=0; L3=0
STATUS="PASS"
REPORT=""

# ════════════════════════════════════════
# Layer 0 — Safety isolation
# ════════════════════════════════════════
# Whitelist: non-.md content infrastructure files that are safe to update
# alongside translation/content PRs. These are NOT system files.
SAFE_NON_MD=(
  "knowledge/_translations.json"
  "knowledge/_taxonomy.json"
)

layer0() {
  local f="$1"
  # Whitelist: known safe non-.md content infra files
  for safe in "${SAFE_NON_MD[@]}"; do
    [[ "$f" == "$safe" ]] && echo "✅ content infra file (${f##*/})" && return 0
  done
  [[ ! "$f" =~ \.md$ ]] && echo "🔴 not a .md file" && return 1
  if [[ "$f" =~ ^knowledge/ ]] || [[ "$f" =~ ^src/content/ ]]; then
    echo "✅ content file"; return 0
  fi
  [[ "$f" =~ \.github/|^scripts/|^src/pages/|^src/components/|^tools/|^package|^astro\.config ]] \
    && echo "🔴 system file modification forbidden" && return 1
  echo "🔴 non-content path"; return 1
}

# ════════════════════════════════════════
# Layer 1 — Format validation
# ════════════════════════════════════════
layer1() {
  local f="$1"
  [[ ! -f "$f" ]] && echo "🔴 file not found" && return 1
  local err=() wrn=()

  # conflict markers
  grep -qE '^(<{7}|={7}|>{7})' "$f" 2>/dev/null && err+=("git conflict markers")

  # frontmatter
  local fm; fm=$(awk '/^---$/{n++; next} n==1{print} n>=2{exit}' "$f" 2>/dev/null)
  if [[ -z "$fm" ]]; then
    err+=("no frontmatter")
  else
    echo "$fm" | grep -q '^title:' || err+=("missing title")
    echo "$fm" | grep -q '^description:' || err+=("missing description")
    echo "$fm" | grep -q '^date:' || err+=("missing date")
    echo "$fm" | grep -q '^tags:' || err+=("missing tags")
    # featured: true not allowed (reserved for homepage selection)
    echo "$fm" | grep -q '^featured: true' && err+=("featured must not be true")
    # category from path
    local cd; cd=$(echo "$f" | sed -n 's|^knowledge/\([^/]*\)/.*|\1|p')
    if [[ -n "$cd" ]]; then
      local ok=false
      for v in "${VALID_CATS[@]}"; do [[ "$cd" == "$v" ]] && ok=true && break; done
      $ok || err+=("invalid category: $cd")
    fi
  fi

  if (( ${#err[@]} > 0 )); then
    echo "🔴 $(IFS=', '; echo "${err[*]}")"; return 1
  elif (( ${#wrn[@]} > 0 )); then
    echo "🟡 OK ($(IFS=', '; echo "${wrn[*]}"))"; return 0
  else
    echo "✅ frontmatter complete"; return 0
  fi
}

# ════════════════════════════════════════
# Layer 2 — Quality gate (inline quality-scan)
# ════════════════════════════════════════
layer2() {
  local f="$1"
  [[ ! -f "$f" ]] && echo "🔴 file not found" && return 1
  local wrn=() hs=0

  local body; body=$(awk '/^---$/{n++; next} n>=2{print}' "$f" 2>/dev/null)
  local tl; tl=$(echo "$body" | wc -l | tr -d ' \n'); tl=${tl:-0}

  # quality: bullet density
  local bl; bl=$(echo "$body" | grep -c '^- \*\*' 2>/dev/null || echo "0"); bl=${bl//[^0-9]/}; bl=${bl:-0}
  (( tl > 5 && bl * 100 / tl > 30 )) && ((hs+=2))

  # quality: missing year references
  local yr; yr=$(echo "$body" | grep -oE '\b(19|20)[0-9]{2}\b' 2>/dev/null | wc -l | tr -d ' \n'); yr=${yr//[^0-9]/}; yr=${yr:-0}
  (( yr < 3 )) && ((hs++))

  # quality: missing sources
  echo "$body" | grep -q 'http' 2>/dev/null || ((hs++))

  # quality: puffery / hollow modifiers (English equivalents per EDITORIAL §5)
  local hw; hw=$(echo "$body" | grep -ciE 'indispensable|profound impact|plays a crucial role|cannot be overlooked|inextricably linked|unique charm|rich tapestry|vibrant community|hidden gem' 2>/dev/null || echo "0"); hw=${hw//[^0-9]/}; hw=${hw:-0}
  (( hw >= 3 )) && ((hs++))

  # quality: too few prose lines
  local pr; pr=$(echo "$body" | grep -cvE '^#|^$|^-|^\*|^>|^\|' 2>/dev/null || echo "0"); pr=${pr//[^0-9]/}; pr=${pr:-0}
  (( pr < 10 )) && ((hs++))

  # quality: em-dash overuse
  local ds; ds=$(echo "$body" | grep -o ' — ' 2>/dev/null | wc -l | tr -d ' \n'); ds=${ds//[^0-9]/}; ds=${ds:-0}
  (( ds > 6 )) && ((hs++))

  # quality: cliche ending
  echo "$body" | tail -5 | grep -qiE 'in conclusion|looking ahead|all in all|to sum up' 2>/dev/null && ((hs++))

  # quality result
  local hs_label=""
  if (( hs <= 5 )); then hs_label="✅ quality $hs"
  elif (( hs <= 7 )); then hs_label="🟡 quality $hs"; wrn+=("quality high")
  else hs_label="🔴 quality $hs"; echo "$hs_label"; return 1
  fi

  # char count (LB articles are English)
  local cc; cc=$(echo "$body" | wc -m | tr -d ' \n'); cc=${cc//[^0-9]/}; cc=${cc:-0}
  (( cc < 2500 )) && wrn+=("too short ${cc}ch")

  # H2
  local h2; h2=$(grep -c '^## ' "$f" 2>/dev/null || echo 0); h2=${h2//[^0-9]/}; h2=${h2:-0}
  (( h2 < 1 )) && wrn+=("no H2")

  # links
  local lk; lk=$(grep -c 'http' "$f" 2>/dev/null || echo 0); lk=${lk//[^0-9]/}; lk=${lk:-0}
  (( lk < 1 )) && wrn+=("no reference links")

  if (( ${#wrn[@]} > 0 )); then
    echo "$hs_label ($(IFS=', '; echo "${wrn[*]}"))"; return 0
  else
    echo "$hs_label"; return 0
  fi
}

# ════════════════════════════════════════
# Layer 3 — EDITORIAL v4 soft review
# ════════════════════════════════════════
layer3() {
  local f="$1"
  [[ ! -f "$f" ]] && echo "—" && return 0
  local wrn=()
  local body; body=$(awk '/^---$/{n++; next} n>=2 && NF{print}' "$f" 2>/dev/null)

  # textbook-style opening
  echo "$body" | head -1 | grep -qiE '^(Laguna Beach is a|As a coastal|Located in)' 2>/dev/null && wrn+=("textbook opening")

  # quotes (English uses " or block quotes)
  grep -qE '"|^>' "$f" 2>/dev/null || wrn+=("missing quotes")

  # cliche ending
  tail -10 "$f" | grep -qiE 'in conclusion|looking ahead|as .* continues to|all in all' 2>/dev/null && wrn+=("cliche ending")

  # source count
  local refs; refs=$(grep -c 'http' "$f" 2>/dev/null || echo 0); refs=${refs//[^0-9]/}; refs=${refs:-0}
  (( refs < 3 )) && wrn+=("sources<3")

  # footnote check
  local fns; fns=$(grep -cE '^\[\^[0-9a-zA-Z_-]+\]:' "$f" 2>/dev/null || echo 0); fns=${fns//[^0-9]/}; fns=${fns:-0}
  (( fns == 0 )) && wrn+=("no footnotes[^N]")

  if (( ${#wrn[@]} > 0 )); then
    echo "🟡 $(IFS=', '; echo "${wrn[*]}")"
  else echo "✅"
  fi; return 0
}

# ════════════════════════════════════════
# Layer 4 — Structure validation (Stage 4 FORMAT CHECK)
# ════════════════════════════════════════
layer4() {
  local f="$1"
  [[ ! -f "$f" ]] && echo "—" && return 0
  # Only check knowledge/ articles (not translations)
  [[ ! "$f" =~ ^knowledge/[A-Z] ]] && echo "—" && return 0
  local wrn=()
  local body; body=$(awk '/^---$/{n++; next} n>=2{print}' "$f" 2>/dev/null)

  # at-a-glance overview (LB convention per EDITORIAL)
  echo "$body" | grep -qiE '>\s*\*\*At a [Gg]lance|^## At a [Gg]lance' 2>/dev/null || wrn+=("missing At a Glance overview")

  # ## References heading (only if has footnotes)
  local fns; fns=$(grep -cE '^\[\^[0-9a-zA-Z_-]+\]:' "$f" 2>/dev/null || echo 0); fns=${fns//[^0-9]/}
  if (( fns > 0 )); then
    echo "$body" | grep -qE '^## References' 2>/dev/null || wrn+=("has footnotes but missing ## References")
  fi

  # residual wikilinks
  local wl; wl=$(echo "$body" | grep -c '^\s*- \[\[' 2>/dev/null || echo 0); wl=${wl//[^0-9]/}
  (( wl > 0 )) && wrn+=("residual wikilinks: ${wl}")

  # subcategory
  local fm; fm=$(awk '/^---$/{n++; next} n==1{print} n>=2{exit}' "$f" 2>/dev/null)
  echo "$fm" | grep -q '^subcategory:' || wrn+=("missing subcategory")

  if (( ${#wrn[@]} > 0 )); then
    echo "🟡 $(IFS=', '; echo "${wrn[*]}")"
  else echo "✅"
  fi; return 0
}

# ════════════════════════════════════════
# Review
# ════════════════════════════════════════
review_with_display() {
  local f="$1"; local d="$2"
  REPORT+="📁 ${d}\n"

  local r0; r0=$(layer0 "$d"); REPORT+="  L0 safety: ${r0}\n"
  if [[ "$r0" =~ ^🔴 ]]; then STATUS="FAIL"; REPORT+="\n"; return; fi
  L0=$((L0+1))

  if [[ ! "$d" =~ \.md$ ]]; then
    REPORT+="  L1-L4: ⏭️  skipped (non-.md infra file)\n\n"
    L1=$((L1+1)); L2=$((L2+1)); L3=$((L3+1))
    return
  fi

  local r1; r1=$(layer1 "$f"); REPORT+="  L1 format: ${r1}\n"
  if [[ "$r1" =~ ^🔴 ]]; then STATUS="FAIL"; else L1=$((L1+1)); fi

  local r2; r2=$(layer2 "$f"); REPORT+="  L2 quality: ${r2}\n"
  if [[ "$r2" =~ ^🔴 ]]; then STATUS="FAIL"
  elif [[ "$r2" =~ ^🟡 ]] && [[ "$STATUS" != "FAIL" ]]; then STATUS="WARNING"
  fi
  [[ ! "$r2" =~ ^🔴 ]] && L2=$((L2+1))

  local r3; r3=$(layer3 "$f"); REPORT+="  L3 editorial: ${r3}\n"
  [[ "$r3" =~ ^✅ ]] && L3=$((L3+1))
  [[ "$r3" =~ ^🟡 ]] && [[ "$STATUS" == "PASS" ]] && STATUS="WARNING"

  local r4; r4=$(layer4 "$f"); REPORT+="  L4 structure: ${r4}\n\n"
  [[ "$r4" =~ ^🟡 ]] && [[ "$STATUS" == "PASS" ]] && STATUS="WARNING"
}

review() {
  local f="$1"; REPORT+="📁 ${f}\n"

  local r0; r0=$(layer0 "$f"); REPORT+="  L0 safety: ${r0}\n"
  if [[ "$r0" =~ ^🔴 ]]; then STATUS="FAIL"; REPORT+="\n"; return; fi
  L0=$((L0+1))

  # Skip L1-L4 for non-.md whitelisted files (they're config/infra, not articles)
  if [[ ! "$f" =~ \.md$ ]]; then
    REPORT+="  L1-L4: ⏭️  skipped (non-.md infra file)\n\n"
    L1=$((L1+1)); L2=$((L2+1)); L3=$((L3+1))
    return
  fi

  local r1; r1=$(layer1 "$f"); REPORT+="  L1 format: ${r1}\n"
  if [[ "$r1" =~ ^🔴 ]]; then STATUS="FAIL"; else L1=$((L1+1)); fi

  local r2; r2=$(layer2 "$f"); REPORT+="  L2 quality: ${r2}\n"
  if [[ "$r2" =~ ^🔴 ]]; then STATUS="FAIL"
  elif [[ "$r2" =~ ^🟡 ]] && [[ "$STATUS" != "FAIL" ]]; then STATUS="WARNING"
  fi
  [[ ! "$r2" =~ ^🔴 ]] && L2=$((L2+1))

  local r3; r3=$(layer3 "$f"); REPORT+="  L3 editorial: ${r3}\n"
  [[ "$r3" =~ ^✅ ]] && L3=$((L3+1))
  [[ "$r3" =~ ^🟡 ]] && [[ "$STATUS" == "PASS" ]] && STATUS="WARNING"

  local r4; r4=$(layer4 "$f"); REPORT+="  L4 structure: ${r4}\n\n"
  [[ "$r4" =~ ^🟡 ]] && [[ "$STATUS" == "PASS" ]] && STATUS="WARNING"
}

# ════════════════════════════════════════
# Main entry point
# ════════════════════════════════════════
main() {
  local files=()
  local pr_num="" pr_tmp=""
  if [[ "${1:-}" == "--pr" ]] && [[ -n "${2:-}" ]]; then
    pr_num="$2"
    # Fetch PR branch into refs/pulls/<num> so we can read files without switching branches
    git fetch origin "pull/${pr_num}/head:refs/pulls/${pr_num}" --quiet 2>/dev/null \
      || { echo "❌ cannot fetch PR #${pr_num}"; exit 1; }
    pr_tmp="$(mktemp -d)"
    trap 'rm -rf "$pr_tmp"' EXIT
    while IFS= read -r l; do
      [[ -z "$l" ]] && continue
      # Materialize file content from PR ref to tmp dir, preserving path
      mkdir -p "$pr_tmp/$(dirname "$l")"
      git show "refs/pulls/${pr_num}:$l" >"$pr_tmp/$l" 2>/dev/null || continue
      files+=("$pr_tmp/$l")
    done < <(gh pr diff "${pr_num}" --name-only 2>/dev/null)
    (( ${#files[@]} == 0 )) && echo "❌ cannot get files for PR #${pr_num}" && exit 1
  else
    files=("$@")
  fi
  (( ${#files[@]} == 0 )) && echo "Usage: $0 <file.md ...> | --pr <number>" && exit 1

  # When in --pr mode, strip tmp dir prefix from displayed paths
  for f in "${files[@]}"; do
    TOTAL=$((TOTAL+1))
    if [[ -n "$pr_tmp" ]]; then
      local display="${f#$pr_tmp/}"
      review_with_display "$f" "$display"
    else
      review "$f"
    fi
  done

  echo -e "${BLU}🔍 LagunaBeach.md PR Review${RST}"
  echo -e "${DIM}═══════════════════════════════════${RST}"
  echo -e "$REPORT"
  echo -e "${DIM}═══════════════════════════════════${RST}"
  case $STATUS in
    PASS)    echo -e "${GRN}✅ PASS${RST} (${L0}/${TOTAL} safety | ${L1}/${TOTAL} format | ${L2}/${TOTAL} quality)" ;;
    WARNING) echo -e "${YEL}🟡 WARNING${RST} (${L0}/${TOTAL} safety | ${L1}/${TOTAL} format | ${L2}/${TOTAL} quality)" ;;
    FAIL)    echo -e "${RED}🔴 FAIL${RST} (${L0}/${TOTAL} safety | ${L1}/${TOTAL} format | ${L2}/${TOTAL} quality)" ;;
  esac
  [[ "$STATUS" == "FAIL" ]] && exit 1 || exit 0
}

main "$@"
