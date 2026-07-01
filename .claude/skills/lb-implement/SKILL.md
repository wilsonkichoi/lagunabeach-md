---
name: lb-implement
description: |
  Implementer side of the LagunaBeach.md ROADMAP loop — the generic two-session
  loop for forward mechanical/code work (Horizon 0 cleanup, Horizon 2 features,
  any grep-verifiable change). Run this in the IMPLEMENTER terminal. Reads the
  queued task from .handoff/TO-IMPLEMENTER.md, does the work in THIS session (no
  subagents), build-verifies, commits, and writes a structured report to
  .handoff/TO-REVIEWER.md for /lb-review. NOT for Taiwan-inheritance migration
  (use /lb-migration-implement) and NOT the right tool for article writing (use
  the /lb-write content chain — prose isn't grep-verifiable).
  TRIGGER when: user says "go", "implement", "/lb-implement", "next roadmap task",
  "continue the loop" in the roadmap implementer terminal.
---

# lb-implement — implementer turn (ROADMAP loop)

You are the **implementer** in a two-session loop for forward work driven by
`ROADMAP.md`. The other session (`/lb-review`) verifies your work. Take one queued
task, execute it cleanly, report. For migration work use `/lb-migration-implement`
instead; for writing articles use `/lb-write`.

## Steps

1. **Read your inbox.** Read `.handoff/TO-IMPLEMENTER.md`.
   - If it's missing, empty, or marked `CONSUMED`/`IDLE` → STOP. Tell the user:
     "No roadmap task queued. Switch to the reviewer terminal and run `/lb-review`."
   - If it says `ALL ROADMAP WORK DONE` → STOP and tell the user.
2. **Load the spec.** The queued task names a `ROADMAP.md` item (horizon + task).
   Read that item for scope. Read the relevant doctrine in `MIGRATION.md` for the
   universal rules that apply to ALL work:
   - **Rule 12 (always)**: never fabricate a fact. Every LB number/date/name
     traces to `knowledge/` BEFORE you write it. If `knowledge/` has no answer,
     write nothing and flag the gap.
   - **Rules 1-5 (always)**: don't strip universal infra (Chinese comments ≠
     Taiwan-specific); minimal change; restore-then-edit over rewrite-from-scratch;
     every changed line traces to the task.
   - **Deletion/element work** — **Rule 6** (grep importers before delete),
     **Rule 8** (grep JS refs before removing a DOM id), **Rule 13** (build lists
     by `ls`/`grep -ic`, include every variant).
   - **New build/feature code**: verify the new script/worker actually runs; don't
     break the existing build chain.
   - **Judgment rule (always)**: your job is not to execute the task literally. It
     is to achieve the task's INTENT with good judgment. If the task says "translate
     comments" but a file contains dead logic (code that can never fire on LB
     content), translating the comment above dead code is not useful work — porting
     or removing the dead logic is. If a config value references Taiwan (categories,
     domains, brand queries), fixing the value is part of the task even if the task
     spec doesn't enumerate it. Nothing should be deferred that you can fix now.
     The DEFERRED table is for things genuinely blocked, not things that require
     thought.
3. **Do the work IN THIS SESSION.** No subagents/agents.
4. **Build-verify.** Run `npm run build`. Gate is broken-ratio < 7.0% (currently
   ~0.13%). Do not regress it. Fix a red build before reporting.
5. **Commit.** Logical groups, `fix(...)`/`feat(...)`/`docs(...)` messages, no
   `Co-Authored-By`. If the task completes a `ROADMAP.md` checkbox, check it off in
   the same commit. Only commit what the task covers. Branch first if on `main`.
6. **Write the report** to `.handoff/TO-REVIEWER.md`, OVERWRITING it. Use the
   template below. Self-contained: cite actual grep/ls/build output + commit hashes.
7. **Empty your inbox.** Overwrite `.handoff/TO-IMPLEMENTER.md` with a single line:
   `CONSUMED <round-number> <ISO-date>`.
8. **Append one line** to `.handoff/LEDGER.md`:
   `R<n> IMPL <date> — <one-line what-you-did> — commit <hash>`.
9. **Tell the user**: "Round N implemented, report queued. Switch to the reviewer
   terminal and run `/lb-review`." One or two lines.

## Report template (write to .handoff/TO-REVIEWER.md)

```
# Round <n> — implementer report (<ISO-date>) — ROADMAP <horizon/item>
Commit(s): <hash> [<hash> ...]
Build: <PASSED|FAILED> — gated broken ratio <x>% < 7.0%

## DONE
| file | action | before→after (refs/lines) |
|------|--------|---------------------------|

## VERIFIED (no action needed)
| file | why |
|------|-----|

## DEFERRED
| item | refs | blocker |
|------|------|---------|

## Notes for reviewer
- <anything ambiguous, any judgment call, any rule you had to interpret>
```

Style: terse, technical, exact. Quote error strings verbatim. No filler.
