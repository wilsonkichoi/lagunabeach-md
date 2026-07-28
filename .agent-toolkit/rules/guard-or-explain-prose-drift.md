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
  naming the guard and the path it covers; or
- **(c) removal of the restatement**, replacing the duplicated value with a pointer to
  the file that owns it, so the sentence carries no derived value and cannot drift.

**Which one: ask what changes the value next time.** If the value moves only when a human
deliberately edits code, choose (a): the guard fires in the same PR as the edit, and the
person who tripped it is already in the file. If the value moves on an automated cadence
(a release skill, a bump script, a scheduled job), (a) is the wrong shape. The process that
changes the value cannot also fix the prose, so the guard reduces to a recurring red check
plus a manual doc edit on every cycle. Choose (c) there.

Applies to any statement derived from code: scan roots, script names, flag defaults,
schema field lists, adopted versions, directory layouts. A reviewer treats a
drift-correction PR carrying none of (a), (b), or (c) as an incomplete DoD, not a nit.

**Why:** three of Phase 5's 24 tasks (LB-51, LB-53, LB-54) fixed the same defect class,
prose stating scan-root scope that had drifted from the `SCAN_ROOTS` arrays. Only LB-53
shipped a guard (`scripts/ci/check-scan-root-docs.mjs`), and that one made its slice of
the class non-recurring at zero marginal cost. The other two paid the fix cost without
buying the immunity. Two days after the Phase 5 close, `docs/ROADMAP.md` still claimed
LB had adopted `sekai-kb v1.0.6` while `FRAMEWORK-VERSION` read `v1.0.10` — the same
class again, in the very document that recorded the lesson. Fixing drift N times before
someone ships the guard is the failure mode this rule exists to stop.

**Why (c), added 2026-07-28:** LB-60 applied this rule to that ROADMAP version statement
and shipped `check-adopted-version-docs.mjs`, asserting three version numbers in prose
against `FRAMEWORK-VERSION`, `VERSION`, and `.agent-toolkit/dev.md`. It went red on the
next release. Adopting `sekai-kb-v1.0.11` writes one file (`/sekai-upgrade` step 9 is
`printf 'vX.Y.Z\n' > FRAMEWORK-VERSION`) and `/sekai-release` writes `VERSION`; neither
skill touches ROADMAP, both are framework-owned, and no instance step could be added to
either. The guard was therefore unsatisfiable by the only process that trips it, and it
demanded planning-document churn on a release cadence. The original rule offered only
(a) and (b), so the executor picked (a) correctly and still shipped a recurring failure.
Version numbers were removed from the ROADMAP status paragraph and the guard deleted; the
scan-root case that motivated this rule keeps its guard (`scripts/ci/check-scan-root-docs.mjs`),
because `SCAN_ROOTS` moves only by human edit. That contrast is the test above.
