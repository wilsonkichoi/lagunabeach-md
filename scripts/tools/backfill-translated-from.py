#!/usr/bin/env python3
"""
backfill-translated-from.py — Backfill _translations.json mappings into each translation's frontmatter

Why:
  _translations.json is currently the central SSOT but this structure is fragile:
    1. A PR that misses a _translations.json entry orphans the file
    2. Renaming the source requires two-place sync
    3. No file-level self-documentation
  Fix: add `translatedFrom: 'Category/filename.md'` to each translation's frontmatter.
  Then _translations.json becomes a derived cache, regenerable from frontmatter.

Usage:
  python3 scripts/tools/backfill-translated-from.py [--dry-run] [--lang en|ja|ko|es|fr]
"""
import argparse
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
TRANSLATIONS = REPO / "knowledge" / "_translations.json"


def has_translated_from(content: str) -> bool:
    """Check if frontmatter has a translatedFrom field."""
    if not content.startswith("---"):
        return False
    end = content.find("---", 3)
    if end == -1:
        return False
    fm = content[3:end]
    return bool(re.search(r"^translatedFrom:", fm, re.MULTILINE))


def add_translated_from(content: str, source: str) -> str:
    """Insert translatedFrom into frontmatter, just before closing ---."""
    if not content.startswith("---"):
        return content
    end_idx = content.find("---", 3)
    if end_idx == -1:
        return content
    fm = content[3:end_idx]
    rest = content[end_idx:]
    # Insert just before the closing ---
    new_fm = fm.rstrip() + f"\ntranslatedFrom: '{source}'\n"
    return "---" + new_fm + rest


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--lang", choices=["en", "ja", "ko", "es", "fr"], help="Filter by language"
    )
    args = parser.parse_args()

    if not TRANSLATIONS.exists():
        print(f"❌ {TRANSLATIONS} not found", file=sys.stderr)
        sys.exit(1)

    data = json.loads(TRANSLATIONS.read_text())

    stats = {"checked": 0, "already_has": 0, "added": 0, "missing_file": 0, "errors": 0}

    for translation_path, source_path in data.items():
        # Filter by language
        if args.lang and not translation_path.startswith(f"{args.lang}/"):
            continue

        stats["checked"] += 1
        full_path = REPO / "knowledge" / translation_path

        if not full_path.exists():
            stats["missing_file"] += 1
            print(f"⚠️  missing file: {translation_path}", file=sys.stderr)
            continue

        try:
            content = full_path.read_text(encoding="utf-8")
        except Exception as e:
            stats["errors"] += 1
            print(f"❌ error reading {translation_path}: {e}", file=sys.stderr)
            continue

        if has_translated_from(content):
            stats["already_has"] += 1
            continue

        new_content = add_translated_from(content, source_path)
        if new_content == content:
            stats["errors"] += 1
            print(f"❌ failed to insert into {translation_path}", file=sys.stderr)
            continue

        if args.dry_run:
            stats["added"] += 1
        else:
            full_path.write_text(new_content, encoding="utf-8")
            stats["added"] += 1

    print(
        f"""
📊 Backfill summary{' (DRY RUN)' if args.dry_run else ''}:
   Checked:       {stats['checked']}
   Already has:   {stats['already_has']}
   Added:         {stats['added']}
   Missing file:  {stats['missing_file']}
   Errors:        {stats['errors']}
""",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
