#!/usr/bin/env bash
# refresh.sh — produce a "ready-to-translate" prompt brief for a single article
#
# Usage:
#   refresh.sh <zh-path> <lang>
#   refresh.sh Technology/半導體產業.md en
#   refresh.sh Technology/半導體產業.md en --print  # print brief to stdout
#   refresh.sh Technology/半導體產業.md en --apply --sha-only  # already translated, update frontmatter
#
# Design: pure projection mode (2026-04-29 insight)
#   zh-TW is SSOT; translations are projections of current state. Brief does not
#   read existing translation or compute diff — it will be overwritten anyway.
#   Reading it only (a) wastes context tokens (b) causes agents to "preserve style"
#   or "patch diff" instead of cleanly projecting from zh once.
#
# Workflow:
#   1. Read zh source (HEAD) + TRANSLATE_PROMPT.md translation rules
#   2. Combine into a single brief.md file (.lang-sync-tasks/{lang}/{slug}.brief.md)
#   3. Agent projects from scratch (overwrite, no patch/preserve/diff)
#   4. --apply --sha-only: after translation, update frontmatter 3 fields (reset sourceCommitSha to zh HEAD)
#
# refresh.sh does not spawn agents directly. lang-sync batch-refresh.sh or the
# maintainer feeds brief content to the agent. This decouples agent runtime from
# tooling (Claude Code / Cursor / human all work).

set -euo pipefail

REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
TASKS_DIR="$REPO/.lang-sync-tasks"

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <zh-path> <lang> [--print | --apply --sha-only]" >&2
  exit 1
fi

ZH_INPUT="$1"
LANG="$2"
MODE="${3:-brief}"

ZH_REL="${ZH_INPUT#knowledge/}"
ZH_FULL="$REPO/knowledge/$ZH_REL"
[[ ! -f "$ZH_FULL" ]] && { echo "❌ zh not found: $ZH_FULL" >&2; exit 1; }

# Find translation file path
TRANS_REL=$(python3 -c "
import json, sys
m = json.load(open('$REPO/knowledge/_translations.json'))
target = '$ZH_REL'
lang = '$LANG'
for k, v in m.items():
    if v == target and k.startswith(lang + '/'):
        print(k); sys.exit(0)
" 2>/dev/null || true)

# Compute slug for brief filename
ZH_SLUG=$(basename "$ZH_REL" .md)
BRIEF_DIR="$TASKS_DIR/$LANG"
mkdir -p "$BRIEF_DIR"
BRIEF_FILE="$BRIEF_DIR/${ZH_SLUG}.brief.md"

# --apply --sha-only: contributor / agent finished translating, just bump frontmatter
if [[ "$MODE" == "--apply" ]] && [[ "${4:-}" == "--sha-only" || "$3" == "--sha-only" ]]; then
  if [[ -z "$TRANS_REL" ]]; then
    echo "❌ no $LANG translation found for $ZH_REL — cannot --apply" >&2
    exit 1
  fi
  TRANS_FULL="$REPO/knowledge/$TRANS_REL"
  ZH_HEAD_SHA=$(git -C "$REPO" log -1 --format='%h' -- "knowledge/$ZH_REL")
  ZH_HEAD_DATE=$(git -C "$REPO" log -1 --format='%aI' -- "knowledge/$ZH_REL")
  NEW_HASH=$(python3 -c "
import hashlib
c = open('$ZH_FULL').read()
if c.startswith('---'):
    e = c.find('---', 3)
    if e != -1: c = c[e+3:]
print('sha256:' + hashlib.sha256(c.encode()).hexdigest()[:16])
")
  NOW=$(date +"%Y-%m-%dT%H:%M:%S%z" | sed 's/\(..\)$/:\1/')

  python3 -c "
import re
c = open('$TRANS_FULL').read()
def upd(field, val):
    return re.sub(rf\"^{field}:.*\$\", f\"{field}: '{val}'\", c, flags=re.MULTILINE)
c = upd('sourceCommitSha', '$ZH_HEAD_SHA')
c = upd('sourceContentHash', '$NEW_HASH')
c = upd('translatedAt', '$NOW')
# Also clear inferred flag (it's now a real translation)
c = re.sub(r\"^translatedFromInferred:.*\n\", '', c, flags=re.MULTILINE)
open('$TRANS_FULL', 'w').write(c)
print('✅ Frontmatter updated:')
print(f'   sourceCommitSha: $ZH_HEAD_SHA')
print(f'   sourceContentHash: $NEW_HASH')
print(f'   translatedAt: $NOW')
"
  exit 0
fi

# --- Build brief (pure projection mode) ---
# NOTE: CJK strings below (完整翻譯不摘要, 保留腳註結構, etc.) are translation rule
# tokens from REFLEXES/pipeline docs — they are the tool's functional content, KEEP.
ZH_HEAD_SHA=$(git -C "$REPO" log -1 --format='%h' -- "knowledge/$ZH_REL")
ZH_HEAD_DATE=$(git -C "$REPO" log -1 --format='%aI' -- "knowledge/$ZH_REL")

# Generate brief — zh source only, agent projects once from scratch.
{
  echo "# Translation projection brief"
  echo ""
  echo "**Task**: Project \`$ZH_REL\` zh-TW HEAD into \`$LANG\`"
  echo "**Output path**: \`knowledge/${TRANS_REL:-$LANG/$ZH_REL}\`"
  echo "**zh HEAD**: \`$ZH_HEAD_SHA\` ($ZH_HEAD_DATE)"
  echo ""
  echo "## Required output"
  echo "1. Translate the file from scratch — overwrite, do NOT patch existing translation."
  echo "2. Preserve frontmatter (translatedFrom must remain)."
  echo "3. After translating, run:"
  echo "   \`bash scripts/tools/lang-sync/refresh.sh $ZH_REL $LANG --apply --sha-only\`"
  echo "   to bump sourceCommitSha to current zh HEAD."
  echo ""
  echo "## Translation rules"
  echo "- Read \`docs/prompts/TRANSLATE_PROMPT.md\` for full rules"
  echo "- 完整翻譯不摘要 (REFLEXES #1)"
  echo "- 保留腳註結構 [^1] [^2]"
  echo "- 維持 wikilinks [[X]] 但目標語言無對應時轉純文字"
  echo "- 字數 ratio 應 0.65–1.30 (en) / 0.55–1.10 (ja/ko)"
  echo "- en 不套 §11 對位句型 / 破折號限制"
  echo ""
  echo "## zh source (current HEAD)"
  echo ""
  echo '```markdown'
  cat "$ZH_FULL"
  echo '```'
} > "$BRIEF_FILE"

echo "✅ Brief written: $BRIEF_FILE"
echo ""
if [[ "$MODE" == "--print" ]]; then
  cat "$BRIEF_FILE"
else
  echo "Next steps:"
  echo "  1. Inspect brief: cat $BRIEF_FILE"
  echo "  2. Translate: spawn agent with brief OR manual edit"
  echo "  3. After translation: bash scripts/tools/lang-sync/refresh.sh $ZH_REL $LANG --apply --sha-only"
fi
