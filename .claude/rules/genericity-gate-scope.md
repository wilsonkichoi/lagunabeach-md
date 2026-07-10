# Genericity gate: what it actually checks (and what it doesn't)

`scripts/ci/check-genericity.sh` is a case-insensitive substring grep of a small place-name
denylist (`laguna`, `taiwan`, …) over `src/` and `scripts/`. Two consequences recur:

1. **It greps comments and doc-strings, not just code.** A cleanup comment that quotes the
   fork's place-named identifiers verbatim (e.g. "stripped the `laguna-beach-geocode.json`
   lookup") fails the gate exactly like live code. When documenting what you removed from a
   fork file, describe it generically ("the geocode lookup table") — never quote the
   place-named symbol.

2. **It does NOT check hex colors.** DoD prose like "zero hex colors in `src/`" means *no
   place/category palette baked into framework code* — marker/category colors come from
   `src/utils/categoryConfig.ts`. It does not forbid the design-system brand/theme hexes
   (e.g. brand navy `#0e3a5c`) used throughout `src/` templates; those are approved chrome,
   the gate does not flag them, and they are not review blockers nor candidates for
   abstraction.

**Why (LB-15):** (1) a doc-comment naming `laguna-beach-geocode.json` failed the gate and
forced a reword cycle; (2) review and verify both had to reason around DoD-3's literal "zero
hex colors" because brand `#0e3a5c` (in `categoryConfig.ts` + ~57 `src/` uses) is legitimate
chrome — the load-bearing intent (no place palette in framework code) was met (PR #16).
