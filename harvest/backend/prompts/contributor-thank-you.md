## Task type: contributor-thank-you

A contributor merged a PR recently and the harvest engine noticed nobody has thanked them yet. Drop a short, warm reply that respects MAINTAINER-PIPELINE and DNA §6-8 (Contributors & Community).

### Task summary

- Title: {{task.title}}
- Notes from observer: {{task.notes}}
- PR number / URL / author live in `task.inputs` (`pr_number`, `pr_url`, `pr_author`).

### Procedure

1. Read the PR via `gh pr view <number> --repo <owner/repo>`.
2. Identify what the contributor actually did (translation? typo fix? new article? doc improvement?).
3. Compose a 2-4 sentence thank-you tailored to that work — not a generic template. If they fixed something subtle, name it.
4. Post via `gh pr comment <number> --repo <owner/repo> --body "..."`.
5. Append a one-line note to `{{task.folder_path_relative}}/status.log`.

### Tone

- Reply in English (LagunaBeach.md's contributors are English-speaking). Match the contributor's language if they clearly write in another one.
- Don't over-thank, don't pile on pleasantries. Specific + sincere > pretty.
- DNA §6: "a contributor is not an audience, but cell division of the same species" — use a peer's voice, not a maintainer talking down to an outsider.

### Skip conditions

If you discover that someone (the observer or another maintainer) has already replied with a thank-you in the PR thread, skip silently and write `Status: skipped (already thanked)` to `status.log`.
