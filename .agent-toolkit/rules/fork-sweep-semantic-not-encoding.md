# Fork-code sweep: semantic grep, not just codepoint grep

The CJK codepoint grep (`rg '[\x{3000}-\x{9fff}\x{ff00}-\x{ffef}]'`) proves CJK
codepoints are absent. It does NOT prove fork-era code is removed. ASCII-encoded fork
constructs pass the codepoint grep trivially:

- Path constants: `SPORE-BLUEPRINTS/`, `SPORE-HARVESTS/`, `/memory/`, `/diary/`, `/reports/`
- Language identifiers: `zh-TW`, `ja`, `ko`, `_LANG_DIRS`, `APPLIES_TO`
- Place-brand strings in fixtures: `Taiwan.md`, `taiwan-md`
- Dead dispatch machinery: `is_translation`, `target.lang` routing (when only `en` exists)

**After the codepoint grep, run a semantic sweep** for known fork constructs:

```sh
rg -ni 'SPORE|APPLIES_TO|_LANG_DIRS|zh-TW|taiwan\.md|is_translation' scripts/ tests/
```

Tailor the pattern list to what the fork file actually contained. Any hit is dead fork code
unless it is a negative assertion (`assert not hasattr(...)` confirming absence).

**The rule:** a "dead fork code removed" claim requires BOTH greps clean. A codepoint-only
clean is not evidence of semantic clean, and must not be presented as such in a work summary.

**Why (LB-20):** the executor claimed "Residual CJK/lang dead code removed" based solely on
`rg CJK scripts/` returning no matches. The review found `APPLIES_TO` plugin filters,
`_LANG_DIRS` sets, `SPORE-*` path-skip branches in ~10 check files, and `author: 'Taiwan.md'`
in test fixtures, all passing the codepoint grep because they are ASCII. Cost: a full second
review cycle (round 1 request-changes → round 2 approve) adding ~7 hours to the task.

**Enumerate the class once, then sweep — never grep-chase one spelling per round.**
Before the sweep, list the fork's artifact vocabulary by *shape class*, not just known
names: pre-cut doc filenames, fork script filenames (`*.sh`, `*.mjs`, repo-pathed `*.py`),
sub-step numbering (`Step/Stage/Phase N.N`), checklist-item numbers (`Stage N #M`), fork
issue numbers (`#NNN`), and names of docs the target tree does not ship (e.g. `ROADMAP`).
Sweep every code tree in the same pass — `scripts/` AND `tests/` (tests are code; the
LB-20 whole-project doctrine applies to sweep scope, not only gate scope).

**Reference-cleanup tasks ship a mechanical guard.** Fixing instances without closing the
class is half the task: add a test that scans the affected sources for the enumerated
shapes (LB-34's `_FORK_REF` gate in tests/article_health/test_editorial_refs.py is the
template — guard file excluded from its own scan, mutation-verified in every scanned
tree). Reviewers of cleanup tasks: state one complete acceptance-bar command in round 1;
"empty modulo named exceptions" is the verdict criterion for every later round.

**Re-pointing a reference requires a verified referent.** When rewriting a fork reference
to cite a current doc, verify the destination heading/content exists first — or drop the
attribution. Rewording provenance into a plausible-sounding current claim is worse than
the fork reference it replaces: it fabricates authority (PR #4 round 2: "Migrated from
cross-link.sh (Stage 5 ...)" became "REWRITE-PIPELINE Stage 5 cross-link analysis", but
the shipped Stage 5 is Sync and no playbook doc contains cross-link analysis).

**Why (LB-34):** one defect class — dead fork references — took 4 review rounds on
sekai-kb PR #4 because each fix pass swept only the spellings a hand-chosen grep matched:
`Step N.N` + `check-aspect.sh` (round 1), a false Stage 5 attribution introduced by the
fix itself (round 2), `Stage N #M` / `#884` / `ROADMAP` in tests/ (round 3). Enumerating
the vocabulary once, sweeping both trees, and shipping the guard on the first pass would
have made it one round.
