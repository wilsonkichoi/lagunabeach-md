# Contributor Onboarding Survey

> Sent automatically to a contributor after their first PR is merged.
> Purpose: extend the sensing organ. Today we know traffic and PR counts, but not **the human story**.

## Why this exists

We can measure how many readers arrive and how many PRs land. We cannot yet see **why** a reader decides to become a contributor.

A young project's growth often hinges on a few burst contributors who go from "maybe I can help a little" to "I'll finish a whole category." If that is random luck, the project's growth model is fragile. If it is a **repeatable pattern** — what did they see, what flipped the switch — then the project can deliberately cultivate the next force-of-nature contributor.

This survey is the instrument for sensing that pattern.

## Trigger conditions

Sent automatically when **all** of the following hold:

1. A GitHub user's first PR is merged
2. That PR is content (`knowledge/**.md` or `knowledge/{lang}/**.md`), not a technical fix
3. That user hasn't received this survey before (avoid duplicates)

## The five questions

Designed so that:

- No more than 5 questions (avoid fatigue)
- No demographics (avoid feeling intrusive)
- Q1 is low-friction (answerable in one sentence)
- Q5 opts in to follow-up conversation

```markdown
👋 Hi @{username}, your first PR is merged — thank you for becoming part of LagunaBeach.md.

We want to understand contributors' stories to help LagunaBeach.md become a better community. If you have 2 minutes, could you answer any of these in a comment on this issue? (Any one question is enough — you don't need to answer all.)

---

**1. How did you find LagunaBeach.md?**
(Search engine? A friend? Social media? Which article?)

**2. Did you hesitate before your first contribution? What made you decide to open the PR?**
(If you didn't hesitate, tell us what made contributing feel natural.)

**3. Did your first PR experience make you want to submit another? Why?**
(Was the flow smooth? Was response time OK? Anything uncomfortable?)

**4. Was there any friction that made you want to give up?**
(Anything — a technical hurdle, unclear docs, strict rules, slow merge…)

**5. Are you willing to be contacted for further conversation?**
(If yes: leave a preferred contact — Email / X / Telegram / anything.)

---

You don't need to answer everything. Even a one-liner like "Q1: found it via a Google search" is valuable.

— The LagunaBeach.md maintainer
```

## Planned analysis

After ≥10 responses, analyze:

**Pattern 1: contribution path (Q1)**

- Which entry point dominates — search / social / GitHub trending / word of mouth?
- Which entry point produces the highest-output contributors afterward?

**Pattern 2: the shape of hesitation (Q2)**

- "Not sure it's good enough"?
- "Don't know the rules"?
- "Afraid of being rejected"?
- The ratios tell us what the onboarding docs should fix.

**Pattern 3: the decisive moment of the first PR (Q3)**

- Merge speed (fast = delight)
- Thank-you comment (specific = memorable)
- Seeing your own content go live (sense of accomplishment)
- Which most strongly drives "want to submit another"?

**Pattern 4: the give-up trigger (Q4)**

- This is the highest-value question.
- Even 3 people pointing at the same friction is a clear bridge-building target.

**Pattern 5: willingness to be contacted (Q5)**

- The ratio itself is a trust indicator.
- Contributors willing to stay in touch form a core group.

## Implementation options

**Option A: GitHub Actions workflow**

- `.github/workflows/contributor-survey.yml`
- Trigger: `pull_request` → closed → merged
- Condition checks: first PR? content?
- Action: post a comment via octokit

**Option B: manual trigger + helper script**

- `scripts/tools/send-contributor-survey.sh <username> <pr-number>`
- Triggered manually during PR review
- Less overhead, but relies on the maintainer remembering

Start with B — it avoids GitHub Actions permission issues with fork PRs. Upgrade to a workflow once the template stabilizes.

> Status for LagunaBeach.md: neither option is built yet. This is a design doc; the project currently has a single contributor, so the survey will first run by hand when a new contributor's first PR merges.

## Collecting responses

**Storage:** `docs/community/contributor-stories/{username}.md`

- One file per contributor
- Publicly readable, but personal contact details redacted (maintainer-only)

**Index:** `docs/community/CONTRIBUTOR-STORIES.md`

- Table: username / language contributed / entry channel / key friction / core group?

## Why this matters more than tracking analytics

Analytics tell me "100 readers came in." The survey tells me "why that 1 reader decided to become a contributor."

**The reader→contributor conversion rate matters more than the reader count.** 100,000 readers / 0 contributors = a dead project. 100 readers / 50 contributors = a living one.

"We can't see the contributor's story" is a sensing blind spot. This is the instrument that fills it.

---

_v1.0 | drafted for LagunaBeach.md, 2026-06-28_
_Status: design complete; to be tested by hand when the next new contributor's first PR is merged._
