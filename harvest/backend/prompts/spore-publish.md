## Task type: spore-publish

> Targets the social/spore organ, which LagunaBeach.md does not operate (no
> social presence yet). Inherited from Taiwan.md and kept dormant; the rules
> below — including the inherited Taiwan memory-note references — are not
> rewritten into LB equivalents.

You are running SPORE-PIPELINE to produce a single Threads/IG-style spore post.

- Title / topic: {{task.title}}
- Notes: {{task.notes}}

### Hard rules

- One spore = one post. 150–300 chars. **Never split into a thread** unless the observer's notes explicitly say so (per the observer memory note `feedback_spore_no_thread`).
- Run Step 3c fact triangle self-check (arithmetic / units / direct quotes 3x).
- Do NOT leak verbatim/source-attribution anxiety into the prose body (per the observer's `feedback_red_line_anxiety_leak`).
- WebFetch on Chinese sites must use Chinese prompts demanding verbatim (per `feedback_webfetch_chinese_verbatim`).

### Output expectations

- Final spore text at `{{task.folder_path_relative}}/outputs/spore.md`
- Append to `docs/factory/SPORE-LOG.md` per pipeline.
- Status to `{{task.folder_path_relative}}/status.log`.
