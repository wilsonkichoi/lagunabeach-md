# Re-review after fix mode, before verify merges

After `/dev:review-pr <n> fix` pushes changes, the approving review on record targets the
pre-fix commit. `dev:verify` must confirm the approving review's `commit_id` equals the
current PR HEAD before merging — a review predating the fix commit is stale and the fix
(which modified the reviewed files) is unreviewed. Stale → run a fresh `/dev:review-pr <n>`
first.

Check: `gh api repos/{owner}/{repo}/pulls/<n>/reviews --jq '.[].commit_id'` vs
`gh pr view <n> --json headRefOid`.

**Why:** In LB-2 the approve verdict was on 9fcb26f; the S1/S2 fix (9d5357f, deploy.yml) had
no review pass. Merging then would have shipped an unreviewed change to the workflow's
permission model. Caught manually at verify.
