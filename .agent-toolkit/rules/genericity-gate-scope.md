---
tier: doctrine
---

# Genericity gate: what it actually checks (and what it doesn't)

Two machine gates run over the same code trees, wired into the `genericity` CI job and the
`npm run genericity` script:

- `scripts/ci/check-genericity.sh` — case-insensitive substring grep of a small place-name
  denylist (`laguna`, `taiwan`, …).
- `scripts/ci/check-english-only.mjs` — fails on any CJK-range codepoint
  (`U+3000–U+9FFF`, `U+FF00–U+FFEF`); the site is English-only (framework SPEC
  `Negative requirements`). U+2014 em dash and U+201C/U+201D curly quotes are below U+3000 and are
  not flagged.

**Scan scope — each gate derives and states its OWN root set.** In template mode (the
`.sekai-template` marker, absent in this adopted instance) both scan the whole
repository. In instance mode:

- **`check-genericity.sh`** — five roots: `src/`, `scripts/`, `tests/`, `workers/`,
  `.agents/skills/`.
- **`check-english-only.mjs`** — the same five roots: `src/`, `scripts/`, `tests/`,
  `workers/`, `.agents/skills/`.

The two lists agree as of `sekai-kb-v1.0.17`, but they are never merged into one claim —
either gate can gain a root without the other, so read each one's own array before
stating its scope.

The shell gate appends each root only if the directory exists; the Node gate filters a
fixed list the same way, so an absent root is skipped rather than an error. Scope grew
from the original `src/` + `scripts/`: `tests/` plus the CJK gate in LB-20, then
`.agents/skills/` with the framework skills in 5.6, then `workers/` on the denylist gate
in `sekai-kb-v1.0.17` (adopted in LB-74), which closed the window in which a denylisted
place string under `workers/` was unguarded on an instance. Test fixtures are code and so is
agent-executed prose — the English-only + genericity doctrine is whole-project, never
per-directory (framework SPEC `Negative requirements`; the earlier `scripts/`-only reading
let `author: 'Taiwan.md'` and zh-TW fixtures ship in `tests/`). Derived projections
`src/content/` and `src/data/` (gitignored, place-specific by nature) are excluded from both
gates by construction. Two consequences recur:

1. **They scan comments and doc-strings, not just code.** A cleanup comment that quotes the
   fork's place-named identifiers verbatim (e.g. "stripped the `laguna-beach-geocode.json`
   lookup") fails the gate exactly like live code. When documenting what you removed from a
   fork file, describe it generically ("the geocode lookup table") — never quote the
   place-named symbol. Likewise a CJK codepoint in a comment or a test fixture body fails the
   English-only gate; re-fixture in English rather than carrying fork CJK.

2. **They do NOT check hex colors.** DoD prose like "zero hex colors in `src/`" means *no
   place/category palette baked into framework code* — marker/category colors come from
   `src/utils/categoryConfig.ts`. It does not forbid the design-system brand/theme hexes
   (e.g. brand navy `#0e3a5c`) used throughout `src/` templates; those are approved chrome,
   the gate does not flag them, and they are not review blockers nor candidates for
   abstraction.

**Why (LB-15):** (1) a doc-comment naming `laguna-beach-geocode.json` failed the gate and
forced a reword cycle; (2) review and verify both had to reason around DoD-3's literal "zero
hex colors" because brand `#0e3a5c` (in `categoryConfig.ts` + ~57 `src/` uses) is legitimate
chrome — the load-bearing intent (no place palette in framework code) was met (PR #16).

**Why (LB-20):** the article-health review passed CI while `author: 'Taiwan.md'` and heavy
zh-TW fixtures shipped in `tests/`, because the gate scanned only `src/` + `scripts/` and had
no CJK check. Wilson's 2026-07-11 (b) ruling made the doctrine whole-project; the gate's scan
scope was extended to `tests/` and the CJK-codepoint gate added, both landing in LB-20 (PR #20).
