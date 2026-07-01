# ALL ROADMAP MECHANICAL WORK DONE

Horizon 0.6 Groups 1-8 all [x]. The de-Taiwan CJK sweep for `scripts/` is
complete. All remaining CJK in scripts/ (93 files) is verified functional KEEP:
translation prompts, regex patterns matching zh-TW content, i18n language display
names, content-matching keys.

## What's next

**Horizon 1 (content depth)** is the active growth axis, entirely content-writing
via `/lb-write` + `/lb-validate` + `/lb-factcheck`. No mechanical/code work
needed. Priority: grow corpus toward ~40 articles, filling thin categories
(Food 1 article, Beaches/Trails/Neighborhoods 2 each).

**Horizon 2+ (capabilities)** are autonomy checkpoints requiring Wilson scope
confirmation before work begins.

## Forward observation (not a bug, not queued)

`scripts/utils/download-wiki-images.mjs` IMAGE_MAP contains 13 Taiwan-subject
Wikimedia entries (Beef Noodle Soup, Gay Pride Parade, Presidential Office, etc.)
with zero references anywhere in LB content. The script is reusable infra but all
its data is dead. Not a Horizon 0.6 miss (entries have romanized filenames, not
CJK code). Worth clearing when LB adds its own Wikimedia images.
