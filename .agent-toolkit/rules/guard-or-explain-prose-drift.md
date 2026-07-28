---
tier: doctrine
---

# Correcting prose that drifted from code: guard it or explain why not

When a task's Objective is "a document says something about the code that is no longer
true", fixing the sentence is half the work. The DoD must also carry one of:

- **(a) a machine guard** that derives the documented value from the source and fails CI
  when they disagree, in the repo idiom (a node script asserting the contract and
  `process.exit(1)`, wired into the `postbuild` chain or the `test` job); or
- **(b) an explicit justification** for why a guard is infeasible or already exists,
  naming the guard and the path it covers.

Applies to any statement derived from code: scan roots, script names, flag defaults,
schema field lists, adopted versions, directory layouts. A reviewer treats a
drift-correction PR carrying neither (a) nor (b) as an incomplete DoD, not a nit.

**Why:** three of Phase 5's 24 tasks (LB-51, LB-53, LB-54) fixed the same defect class,
prose stating scan-root scope that had drifted from the `SCAN_ROOTS` arrays. Only LB-53
shipped a guard (`scripts/ci/check-scan-root-docs.mjs`), and that one made its slice of
the class non-recurring at zero marginal cost. The other two paid the fix cost without
buying the immunity. Two days after the Phase 5 close, `docs/ROADMAP.md` still claimed
LB had adopted `sekai-kb v1.0.6` while `FRAMEWORK-VERSION` read `v1.0.10` — the same
class again, in the very document that recorded the lesson. Fixing drift N times before
someone ships the guard is the failure mode this rule exists to stop.
