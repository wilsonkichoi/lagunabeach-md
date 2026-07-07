# Clean rebuild: dead fork-era code is a blocker, not a nit

This is a clean rebuild, not a fork maintenance project. Unreachable code carried from the
fork (dead language fallbacks, hardcoded strings for features that don't exist, comments
referencing the fork's context) is not "harmless residue" or "low priority." It is dirty code
that must be removed at extraction time.

**Review behavior:**

- Dead fork-era logic (unreachable branches, hardcoded strings for languages/features not in
  this site) is a BLOCKER, not a SUGGESTION or NIT.
- "Unreachable today" is not a defense. Unreachable means it should not exist.
- "Harmless" is not a defense. Clean means clean.
- The only exception is §C-verbatim stylesheets (shot-mode.css, dashboard.css,
  dark-polish.css, tokens.css) where the verbatim contract explicitly preserves fork content
  until phase-close triage resolves the §C-vs-§F tension.

**Extraction behavior:**

- Strip dead fork-era logic at extraction time, not as a follow-up.
- If uncertain whether something is dead vs load-bearing, ask, don't ship it with a "low
  priority" comment.

**Why (LB-3 review):** the first review classified dead zh-TW search strings and a '中' badge
as S1/SUGGESTION ("unreachable", "harmless", "low priority"), tried to approve without
requiring the fix. Wilson rejected: "unreachable means non-acceptable dirty code." Required a
second review cycle to land the cleanup that should have been a blocker on the first pass.
