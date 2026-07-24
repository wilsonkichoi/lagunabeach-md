---
tier: doctrine
---

# History-bearing PRs merge with a merge commit, never squash

Any PR whose branch history IS the deliverable must be merged with a real merge commit
(`gh pr merge <n> --merge`), as an explicit deviation from `merge_policy: squash`. That
class is:

- **Every framework-upgrade PR in this repo** — any branch containing a
  `git merge sekai-kb-vX.Y.Z` tag-merge commit. Each phase ≥ 6 exit gate produces one
  (the `/upgrade` pull into LB), so this recurs every phase.
- Any PR that establishes or extends the cross-repo merge base, or whose DoD names tags,
  merge parents, or ancestry.

Squash flattens the tag-merge commits: the framework tags drop out of `main`'s ancestry,
the next `/upgrade` fails with "refusing to merge unrelated histories", and every
framework-owned file re-conflicts on every release — the exact §G risk 4 outcome the
release discipline exists to prevent.

Mechanics:

- `dev:execute`: when opening such a PR, put a **Merge instructions** block at the top of
  the PR body (merge mode, order across paired PRs, why), so the deviation is documented
  where `dev:verify` reads it.
- `dev:verify`: honor the block, and after merging assert the property survived:
  `git merge-base --is-ancestor <tag-commit> origin/main` must succeed in both repos.
- Never "re-point tags to main" as an alternative: pushed release tags are immutable
  (CHANGELOG release rule 3), and instances that already merged the tag keep the original
  commits as merge parents, so re-pointing repairs nothing.

**Why (LB-33 review B1):** the packet, the executor, and the standing
`merge_policy: squash` all pointed at squash-merging the phase-5.4 PRs whose merge commits
carried the newly established merge base. Squash would have broken the very next
`/upgrade` (unrelated histories again, add/add `CHANGELOG.md` conflicts on every future
release). Caught in review round 1; both PRs merged `--merge` and the ancestry check
passed in both mains.
