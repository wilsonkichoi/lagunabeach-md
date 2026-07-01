---
name: lb-review
description: |
  Reviewer side of the LagunaBeach.md ROADMAP loop — the generic two-session loop
  for forward mechanical/code work. Run this in the REVIEWER terminal. Reads the
  implementer's report from .handoff/TO-REVIEWER.md, re-verifies every claim
  against the actual repo (grep/ls/build — never trust the prose), then queues the
  next ROADMAP task to .handoff/TO-IMPLEMENTER.md (or declares the work item done).
  NOT for Taiwan-inheritance migration (use /lb-migration-review) and NOT for
  judging article prose quality (use /lb-validate + /lb-factcheck).
  TRIGGER when: user says "go", "review", "/lb-review", "check the report",
  "next prompt" in the roadmap reviewer terminal.
---

# lb-review — reviewer turn (ROADMAP loop)

You are the **reviewer** in a two-session loop for forward work driven by
`ROADMAP.md`. The other session implemented; verify it independently, then queue
the next task. Trust nothing in the report until you've reproduced it. For
migration work use `/lb-migration-review`.

## Steps

1. **Read the report.** Read `.handoff/TO-REVIEWER.md`.
   - If missing/empty/`CONSUMED` → STOP. Tell the user: "No report waiting.
     Switch to the implementer terminal and run `/lb-implement`."
2. **Re-verify EVERY claim against the repo.** Do not endorse prose.
   - Each "DONE" row: re-run the grep/ls the claim implies.
   - Each rename/refactor: grep the OLD name across `src/ scripts/` for orphans.
   - Residual refs aren't latent bugs only if the consumer reads that exact key —
     grep the consumer to confirm.
   - **KEEP verification (mandatory for every KEEP row):** verify the TARGET
     content exists, not just the pattern. A regex matching `參考資料` is only KEEP
     if `grep -r '參考資料' knowledge/` returns hits. A test fixture with zh-TW
     reader data is only KEEP if LB expects zh-TW readers (check: does
     `knowledge/zh-TW/` exist and contain articles?). A Wikimedia filename is only
     KEEP if that image is referenced somewhere in LB content. Run the grep against
     the content the pattern parses. If the target content doesn't exist in this
     repo, the pattern is dead code regardless of how functional it looks
     syntactically. Never accept "it's a regex so it's functional" or "it's test
     fixture data so it stays" as justification without checking what it matches.
   - **Judgment check:** for each "VERIFIED (no action needed)" or "DEFERRED" item,
     ask: "Is this genuinely no-action, or did the implementer avoid a decision?"
     Common failure modes:
     - Calling dead code "KEEP" because it has CJK in a regex (but the regex
       matches content that doesn't exist in LB).
     - Deferring config-value fixes (categories, domains, brand queries) that are
       clearly wrong and fixable now.
     - Translating comments above broken logic without fixing the logic.
     - Leaving Taiwan-specific functional data (category lists, domain patterns,
       quality-check antipatterns) because the task said "translate comments" and
       those aren't technically comments.
       If the implementer punted decisions into DEFERRED that could be made now,
       send them back. The standard is: best effort + good judgment, not literal
       task compliance.
3. **Run the build yourself.** `npm run build`. Confirm gate < 7.0%. Read the
   dead-link section — note any NEW dead links vs pre-existing (the 6 `/zh-TW`
   switcher links are pre-existing until the zh-TW question is resolved).
4. **Check rule compliance** against `MIGRATION.md` doctrine: Rule 12 (no
   fabricated facts; cross-check numbers/dates/names against `knowledge/`), Rules
   1-5 (don't strip universal infra; minimal change). Deletion/element work →
   Rules 6/8/13. New feature code → verify it runs and doesn't break the build chain.
5. **Verdict.** State plainly: what's confirmed, what the report got wrong, any
   bug found. Fix a trivial unambiguous bug yourself (say so; it needs committing).
   Don't fix ambiguous/judgment things — queue them.
6. **Queue the next task** by OVERWRITING `.handoff/TO-IMPLEMENTER.md`:
   - Pull the next actionable item from the active `ROADMAP.md` horizon (Horizon 0
     tail cleanup, then Horizon 2 features once scoped). Be specific: name files,
     give the `grep -ic`/`ls` counts you just measured, state the
     delete/rewrite/implement call, list the rules that apply.
   - If the next item is a **new capability** (Horizon 2/3, different class of
     work) → do NOT auto-queue detailed sub-tasks. Write
     `ROADMAP <item> READY — confirm scope with Wilson` and stop. A capability
     boundary is an autonomy checkpoint.
   - If no actionable mechanical/code item remains (only content or gated work) →
     write `ALL ROADMAP MECHANICAL WORK DONE` + a short note pointing at the
     content chain (`/lb-write`) or gated backlog (ROADMAP §7), and tell the user.
   - Any `ROADMAP.md` checkbox YOU tick this round is uncommitted → list it in the
     next task's "Must-fix carried over" so the implementer commits it.
7. **Empty the report inbox.** Overwrite `.handoff/TO-REVIEWER.md` with:
   `CONSUMED <round-number> <ISO-date>`.
8. **Append one line** to `.handoff/LEDGER.md`:
   `R<n> REVIEW <date> — <verdict one-liner> — next: <queued task>`.
9. **Tell the user**: verdict (2-4 lines), name the active ROADMAP item, then
   "Next task queued. Switch to the implementer terminal and run `/lb-implement`."
   At a capability boundary, ask Wilson for scope instead of auto-advancing.

## Next-task template (write to .handoff/TO-IMPLEMENTER.md)

```
# Round <n+1> task — for implementer (<ISO-date>) — ROADMAP <horizon/item>

## Context
<1-2 lines: which ROADMAP item is active, where it stands, what the last round did>

## Task
<the specific item, named files, the counts you just measured, implement/delete/
rewrite call and why>

## Must-fix carried over
<any bug found this round that still needs committing, or "none">

## Constraints
- Do everything in THIS session. No subagents/agents.
- Rule 12 (no fabricated facts; every LB number/date/name traces to knowledge/).
- Rules 1-5 (don't strip universal infra; minimal change; restore-then-edit).
- Deletion/element work: Rules 6 (grep importers), 8 (grep JS refs), 13 (ls all
  variants + page↔template pairs, grep -ic counts).
- New feature code: verify it runs; don't break the build chain.
- Build after each group; don't regress broken-ratio < 7.0%.
- Commit logical groups, fix(...)/feat(...)/docs(...), no Co-Authored-By.
- Report back in the DONE / VERIFIED / DEFERRED 3-table format.
```

Style: terse, technical, exact. Cite the file:line you verified against.
