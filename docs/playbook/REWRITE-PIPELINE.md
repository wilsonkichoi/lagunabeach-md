# REWRITE-PIPELINE — Article Write/Rewrite

> All articles (new or rewrite) follow one linear pipeline. Mode is determined
> in Stage 0; Stages 1-5 are mode-agnostic. The editorial standard the pipeline
> enforces lives in [ARTICLE-PLAYBOOK.md](ARTICLE-PLAYBOOK.md); this document is
> the process contract the framework's writing skills execute.

Student reporters start with the [Student Reporting Guide](STUDENT-REPORTING-GUIDE.md).
Its preparation, interviewing, and drafting steps feed Stages 0-3 here.
The adult editor handles publication checks and keeps the private reporting records.

---

## Stage 0: Perspective

Determine scope before research begins.

1. **Mode**: new article or rewrite of existing?
2. **Angle**: what makes this topic relevant to this place specifically? What's
   the local memory, cultural context, or geographic connection?
3. **Existing material** (rewrite only): read the current `knowledge/` file,
   extract what to keep vs. what to rework.
4. **Editorial load**: the editor or writing agent reads [ARTICLE-PLAYBOOK.md](ARTICLE-PLAYBOOK.md) in full.
   Student reporters use the student guide first, then consult the playbook as needed.
   Its §2 research prompts help develop the angle; quotes, objects, and scenes are optional.

Output: mental model of what you're writing and why. No file written yet.

---

## Stage 1: Research

Gather facts. Every claim must be sourceable.

1. Gather evidence from relevant records, websites, interviews, and direct observations.
   Use existing articles to find leads, then check the evidence behind them.
2. Keep a claim log: claim, source, date, exact location in the record, and verification status.
   Keep unpublished records privately outside the repository, available to the editor.
3. Match the evidence to the claim. A person's confirmed name or a current official
   schedule can use one appropriate primary source. A dated observation supports what
   happened during that visit, not what always happens.
4. Attribute opinions and personal recollections to the speaker. An interview proves
   what was said; factual claims within it still need verification before stating them as fact.
5. Seek independent corroboration for disputed history, consequential claims, unexpected
   statistics, and claims such as first, only, largest, or best. Two sites repeating the
   same press release are one source. Record disagreements and resolve them with the editor.
6. Recheck changing information, including hours, prices, schedules, and access, near publication.
   If evidence remains insufficient, narrow the claim, clearly attribute a limited account,
   or omit it. Attribution alone does not justify publishing an unsupported accusation.

For interview planning, permission, question sets, and worksheets, follow the student guide.
For citations without public URLs, use [Article Playbook §4.6](ARTICLE-PLAYBOOK.md#original-reporting-without-a-public-url).

**Hard gate — no fabricated facts.** If `knowledge/` has no answer and research
can't confirm it, write nothing for that claim. A missing fact is a smaller
problem than an invented one.

---

## Stage 2: Draft

Write the article per [ARTICLE-PLAYBOOK.md](ARTICLE-PLAYBOOK.md) standards.

- Structure: frontmatter → opening paragraph → At a Glance → body → citations
  (playbook §4).
- Voice: a local friend, not a brochure and not an encyclopedia (playbook §6).
- Length: match depth to topic (playbook §1). No padding; no artificial brevity.
- Target: `knowledge/{Category}/{slug}.md`. Category folders come from
  `place.config.ts`; the filename is the article's slug (lowercase).

---

## Stage 3: Fact-check

Self-audit the draft against Stage 1 sources.

1. Every named date, number, person, or place: verify against research notes.
2. Any claim without a source: either source it or cut it.
3. For web sources, confirm the cited material is accessible and supports the claim.
   For unpublished sources, have the editor inspect the retained record and public citation.
4. Verify exact quotes, their context, and permission records. Do not upload private
   notes or recordings as part of the article or a pull request.

For anything beyond a quick self-audit (post-ship audits, contested claims), run
the full methodology in [FACTCHECK-PIPELINE.md](FACTCHECK-PIPELINE.md).

Machine assist for the prose side of this stage:

```bash
npm run article-health -- knowledge/{Category}/{slug}.md --profile=rewrite-stage-3
```

---

## Stage 4: Quality-checklist gate

Run the article through the quality gate in
[ARTICLE-PLAYBOOK.md §7](ARTICLE-PLAYBOOK.md) — the five-finger test, the
structure check, the plastic-language scan, and the automated verification.

There are two article-health bars here, and they are not the same gate:

**Mandatory ship gate — `ci-deploy`.** This is the bar every article must clear
to commit and deploy; it is the exact profile the instance's CI runs over the
whole corpus (`article-health --all --profile=ci-deploy`). It runs every check
and blocks on HARD violations only. A text-first article passes it.

```bash
npm run article-health -- knowledge/{Category}/{slug}.md --profile=ci-deploy
```

**Media-complete self-check — `rewrite-stage-4`.** This is the aspirational
depth-article self-check for long-form pieces once images are supplied. It runs a
media/structure-focused check list and HARD-promotes the depth checks
(`image-health` with a hero + scene images floor of ≥3 length-scaled,
`word-count`, `chronicle-lead`, `viz-health`). It is a self-check, **not** the
universal new-article gate, and it is **run in addition to `ci-deploy`, never
instead of it**: `ci-deploy` runs the full check set (`checks = "*"`) while
`rewrite-stage-4` runs only its named subset, so passing `rewrite-stage-4` does
**not** imply passing `ci-deploy` (e.g. `footnote-format` and `link-url-mangle`
are HARD in `ci-deploy` but don't run under `rewrite-stage-4`). The framework's
own demo corpus is text-first and clears `ci-deploy`, not `rewrite-stage-4`. Run
it when you have supplied media and want to hold a depth article to the stricter
media bar — after, not instead of, the `ci-deploy` gate above. Its image/media
thresholds are long-form-calibrated and tunable per instance — see
[ARTICLE-PLAYBOOK.md §8](ARTICLE-PLAYBOOK.md).

```bash
npm run article-health -- knowledge/{Category}/{slug}.md --profile=rewrite-stage-4
```

Check:

- Frontmatter complete and valid (`npm run test` validates all of `knowledge/`)
- No orphan wikilinks or broken link targets
- Word count appropriate for the topic's band
- No playbook violations (voice, structure, sourcing)

Fix any `ci-deploy` HARD failures before proceeding. **`ci-deploy` fail = don't
commit.** Do not fabricate images to satisfy `rewrite-stage-4`.

---

## Stage 5: Sync

Run the sync to project the new/updated `knowledge/` file into the build:

```bash
npm run sync
```

Then verify the article renders:

```bash
npm run build
```

`src/content/` is a derived, gitignored projection of `knowledge/` — never edit
it directly (the SSOT rule). Review the rendered article, citations, and image credits.
Commit the article and approved media through the repository's review process.
Keep the evidence privately so corrections can be checked after publication.
