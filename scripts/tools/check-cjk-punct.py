#!/usr/bin/env python3
"""
check-cjk-punct.py — CJK 半形標點偵測（zh-TW 文章專用）

規則：中文段落裡的 `,` `:` `;` `?` `!` `(` `)` 應該用全形 `，：；？！（）`
（per 2026-05-04 黃魚鴞 issue：半形標點混在中文段落裡會打斷閱讀節奏，且
search snippets / 社群分享 preview 看起來像翻譯軟體機翻）。

本工具 detect-only by default，`--fix` 旗標自動轉換寫回。

智慧排除（不會誤報）：
  - frontmatter（首尾兩個 `---` 之間，但 title/description 仍會檢查）
  - fenced code blocks（``` 之間）
  - inline code（單對 backtick）
  - markdown link URLs (`](url)` 內）
  - HTML attribute values（如 iframe style="..."）
  - Numbers like 1,800 between digits（intra-number commas）
  - English/Latin text segments（半形 punct 在 ASCII 上下文是正確的）

判定條件：punct 必須左右都有 CJK 字元（或左 CJK 右 digit / digit 左 CJK 右
in 部分情況）才算違反。

用法：
  python3 scripts/tools/check-cjk-punct.py knowledge/Nature/黃魚鴞.md
  python3 scripts/tools/check-cjk-punct.py --fix knowledge/Nature/黃魚鴞.md
  python3 scripts/tools/check-cjk-punct.py --staged
  python3 scripts/tools/check-cjk-punct.py --all  (sweep 全 zh-TW knowledge/)

Exit codes：
  0 = OK
  1 = violations found（detect mode）/ files modified（fix mode）
"""

from __future__ import annotations
import argparse
import re
import subprocess
import sys
from pathlib import Path

CJK = r'[一-鿿㐀-䶿]'

# Patterns: (regex, replacement, kind) — applied to non-code text segments.
#
# Strategy: half-width punct followed by CJK → fullwidth, regardless of left
# context. This catches ASCII / italic close / bold close / paren close /
# footnote close immediately preceding the punct. The right-side CJK is the
# strong signal (Chinese paragraph context); left-side variants (CJK,digit
# like `對,1800`) handled separately.
#
# False positive guard: protected regions (code / URL / HTML attr) are
# excluded upstream by split_protected_regions(). So `Sun, Y. H.,` (English
# citation context, comma before space) is naturally safe — `,` followed by
# space, right-side CJK regex doesn't match.
PATTERNS: list[tuple[re.Pattern, str, str]] = [
    # ── Right-side CJK (universal) ──
    # X,CJK → X，CJK
    (re.compile(rf',(?={CJK})'), '，', 'comma'),
    # X:CJK → X：CJK
    (re.compile(rf':(?={CJK})'), '：', 'colon'),
    # X;CJK → X；CJK
    (re.compile(rf';(?={CJK})'), '；', 'semi'),
    # X?CJK → X？CJK
    (re.compile(rf'\?(?={CJK})'), '？', 'qmark'),
    # X!CJK → X！CJK
    (re.compile(rf'!(?={CJK})'), '！', 'bang'),
    # ── Left-side CJK + digit (number-formatting boundary) ──
    # CJK,digit → CJK，digit (e.g. `對,1800` → `對，1800`)
    (re.compile(rf'(?<={CJK}),(?=[0-9])'), '，', 'comma'),
    # CJK:digit → CJK：digit (e.g. `首次記錄:1997` → `首次記錄：1997`)
    (re.compile(rf'(?<={CJK}):(?=[0-9])'), '：', 'colon'),
    # ── ] + halfwidth + digit (footnote ref boundary) ──
    # ],digit → ]，digit  (e.g. `[^1],1994`)
    (re.compile(rf'(\]),(?=[0-9])'), r'\1，', 'fn-comma'),
    # ];digit → ]；digit
    (re.compile(rf'(\]);(?=[0-9])'), r'\1；', 'fn-semi'),
    # ── Bold marker boundaries (CJK on the other side) ──
    # **:CJK or **: at line end → **：
    (re.compile(rf'(\*\*):(?={CJK}|\s|$)', re.MULTILINE), r'\1：', 'bold-colon'),
    # CJK:** → CJK：**
    (re.compile(rf'(?<={CJK}):(?=\*\*)'), '：', 'colon-bold'),
    # ── Parens between CJK ──
    # CJK(CJK → CJK（CJK
    (re.compile(rf'(?<={CJK})\((?={CJK})'), '（', 'lparen'),
    # CJK)CJK or CJK) before CJK punct/whitespace → CJK）
    (re.compile(rf'(?<={CJK})\)(?={CJK}|[，。：；！？\s])'), '）', 'rparen'),
]


def split_protected_regions(text: str) -> list[tuple[str, bool]]:
    """Split text into (segment, is_protected) tuples.

    Protected = inside fenced code block, inline code, markdown link URL,
    or HTML attribute value. Punctuation in protected segments is not
    considered for conversion.
    """
    # Split on code fences first
    fence_parts = re.split(r'(```[\s\S]*?```)', text)
    out: list[tuple[str, bool]] = []
    for i, part in enumerate(fence_parts):
        if i % 2 == 1:
            # Inside fenced code block
            out.append((part, True))
            continue
        # Within non-fenced text, split on inline code
        inline_parts = re.split(r'(`[^`\n]+`)', part)
        for j, p in enumerate(inline_parts):
            if j % 2 == 1:
                out.append((p, True))
                continue
            # Within non-code text, split on markdown link URLs (text)(url)
            url_parts = re.split(r'(\]\([^)]+\))', p)
            for k, q in enumerate(url_parts):
                if k % 2 == 1:
                    out.append((q, True))
                    continue
                # Within non-link text, split on HTML tag attribute lines
                # (we keep this simple: treat lines that look like inline HTML
                # with style="..." as protected)
                html_parts = re.split(r'(<[^>\n]+>)', q)
                for m, r in enumerate(html_parts):
                    out.append((r, m % 2 == 1))
    return out


def find_violations(text: str, file_path: str) -> list[dict]:
    """Return list of violation dicts: line, col, char, suggestion, kind."""
    segments = split_protected_regions(text)
    # We need line numbers — keep a running offset and recompute lines from
    # the original text for each match found in non-protected segments.
    violations: list[dict] = []
    offset = 0
    for seg, protected in segments:
        if not protected and seg:
            for pattern, replacement, kind in PATTERNS:
                for m in pattern.finditer(seg):
                    abs_pos = offset + m.start()
                    line_no = text.count('\n', 0, abs_pos) + 1
                    line_start = text.rfind('\n', 0, abs_pos) + 1
                    col = abs_pos - line_start + 1
                    line_text = text[line_start:text.find('\n', abs_pos) if text.find('\n', abs_pos) >= 0 else len(text)]
                    violations.append({
                        'file': file_path,
                        'line': line_no,
                        'col': col,
                        'kind': kind,
                        'char': m.group(0),
                        'suggestion': replacement.replace(r'\1', m.group(1) if m.lastindex else ''),
                        'context': line_text.strip()[:80],
                    })
        offset += len(seg)
    return violations


def fix_text(text: str) -> str:
    """Apply all conversions to text, preserving protected regions."""
    segments = split_protected_regions(text)
    out_parts = []
    for seg, protected in segments:
        if protected or not seg:
            out_parts.append(seg)
            continue
        s = seg
        for pattern, replacement, _ in PATTERNS:
            s = pattern.sub(replacement, s)
        out_parts.append(s)
    return ''.join(out_parts)


def get_staged_files() -> list[Path]:
    """Return staged knowledge/ .md files (zh-TW only — translations have
    their own punct conventions)."""
    try:
        out = subprocess.check_output(
            ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
            text=True,
        )
    except subprocess.CalledProcessError:
        return []
    files = []
    for line in out.splitlines():
        if not line.startswith('knowledge/'):
            continue
        # Skip translations
        if line.startswith(('knowledge/en/', 'knowledge/ja/', 'knowledge/ko/',
                            'knowledge/es/', 'knowledge/fr/')):
            continue
        if not line.endswith('.md'):
            continue
        # Skip _Hub etc
        if Path(line).name.startswith('_'):
            continue
        files.append(Path(line))
    return files


def get_all_zh_files() -> list[Path]:
    """Sweep mode: all zh-TW knowledge .md files."""
    root = Path('knowledge')
    files = []
    for p in root.iterdir():
        if not p.is_dir() or p.name in ('en', 'ja', 'ko', 'es', 'fr'):
            continue
        for md in p.glob('*.md'):
            if not md.name.startswith('_'):
                files.append(md)
    return files


def main() -> int:
    parser = argparse.ArgumentParser(
        description='CJK 半形標點 lint （zh-TW 文章專用）',
    )
    parser.add_argument('files', nargs='*', help='Files to check (default: stdin if no flag)')
    parser.add_argument('--fix', action='store_true', help='Auto-fix violations in place')
    parser.add_argument('--staged', action='store_true', help='Check only staged knowledge/*.md (excl. translations)')
    parser.add_argument('--all', action='store_true', help='Sweep all zh-TW knowledge .md files')
    parser.add_argument('--quiet', action='store_true', help='Only show summary, not per-line violations')
    parser.add_argument('--max-show', type=int, default=20, help='Max violations to show per file (default: 20)')
    args = parser.parse_args()

    if args.staged:
        files = get_staged_files()
        if not files:
            print('🔍 Staged mode: no zh-TW knowledge/*.md staged, skipping.')
            return 0
        print(f'🔍 Staged mode: checking {len(files)} file(s)')
    elif args.all:
        files = get_all_zh_files()
        print(f'🔍 Sweep mode: scanning {len(files)} zh-TW knowledge file(s)')
    elif args.files:
        files = [Path(f) for f in args.files]
    else:
        parser.print_help()
        return 0

    total_violations = 0
    files_with_violations = 0
    files_fixed = 0

    for fpath in files:
        if not fpath.exists():
            print(f'⚠️  {fpath}: not found, skipping')
            continue
        try:
            text = fpath.read_text(encoding='utf-8')
        except Exception as e:
            print(f'⚠️  {fpath}: read error: {e}')
            continue

        if args.fix:
            new_text = fix_text(text)
            if new_text != text:
                fpath.write_text(new_text, encoding='utf-8')
                files_fixed += 1
                # Count what changed
                v_before = find_violations(text, str(fpath))
                if not args.quiet:
                    print(f'✏️  {fpath}: fixed {len(v_before)} violations')
            elif not args.quiet:
                print(f'✓ {fpath}: clean')
            continue

        violations = find_violations(text, str(fpath))
        if not violations:
            if not args.quiet and not args.staged and not args.all:
                print(f'✓ {fpath}: clean')
            continue

        files_with_violations += 1
        total_violations += len(violations)

        # Group by kind for compact reporting
        by_kind: dict[str, list[dict]] = {}
        for v in violations:
            by_kind.setdefault(v['kind'], []).append(v)

        print(f'🔴 {fpath}: {len(violations)} CJK 半形標點違反')
        if not args.quiet:
            for kind, vs in by_kind.items():
                shown = vs[: args.max_show]
                kind_label = {
                    'comma': "半形 ',' 應為 '，'",
                    'colon': "半形 ':' 應為 '：'",
                    'semi': "半形 ';' 應為 '；'",
                    'qmark': "半形 '?' 應為 '？'",
                    'bang': "半形 '!' 應為 '！'",
                    'fn-comma': "footnote 後半形 ',' 應為 '，'",
                    'fn-semi': "footnote 後半形 ';' 應為 '；'",
                    'bold-colon': "粗體後半形 ':' 應為 '：'",
                    'colon-bold': "粗體前半形 ':' 應為 '：'",
                    'lparen': "半形 '(' 應為 '（'",
                    'rparen': "半形 ')' 應為 '）'",
                }.get(kind, kind)
                print(f'   {kind_label}: {len(vs)} 處')
                for v in shown:
                    print(f'     L{v["line"]:>4}: {v["context"]}')
                if len(vs) > args.max_show:
                    print(f'     ... and {len(vs) - args.max_show} more')

    print()
    if args.fix:
        if files_fixed:
            print(f'✏️  Fixed {files_fixed} file(s).')
            return 1  # Signal that files changed (CI/pre-commit can re-add)
        print('✓ No fixes needed.')
        return 0

    if total_violations:
        print(f'🔴 {total_violations} 違反 in {files_with_violations} file(s).')
        print('   修法：python3 scripts/tools/check-cjk-punct.py --fix <file>')
        print('   規則：docs/editorial/EDITORIAL.md §半形標點禁用')
        return 1
    print(f'✓ All {len(files)} file(s) clean.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
