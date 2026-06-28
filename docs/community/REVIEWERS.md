# 👀 Reviewers Guide — LagunaBeach.md collaborator guide

## Roles and permissions

LagunaBeach.md community collaboration has three roles:

| Role            | Permissions                                       | How to get it                      |
| --------------- | ------------------------------------------------- | ---------------------------------- |
| **Contributor** | Submit PRs, file Issues                           | Anyone (Fork → PR)                 |
| **Reviewer**    | Approve PRs, manage Issue labels, create branches | By invitation (see criteria below) |
| **Maintainer**  | Merge PRs, manage Settings                        | @wilsonkichoi only                 |

### Branch protection

The `main` branch is protected:

- ✅ All changes go through a Pull Request
- ✅ At least **1 Reviewer approval** required before merge
- ✅ Stale reviews are dismissed after a new commit
- ⚠️ Final merge rights rest with the Maintainer

---

## Current reviewers

None yet. LagunaBeach.md is a young fork, currently maintained solely by the founder ([@wilsonkichoi](https://github.com/wilsonkichoi)). As contributors meet the criteria below, they will be invited to the review team and listed here.

---

## Criteria for becoming a Reviewer

We proactively invite contributors who meet:

1. **At least 3 merged PRs** (content or technical)
2. **Consistent PR quality** (clear descriptions, passing build, edge cases considered)
3. **Active participation** (Issue replies, architecture suggestions, code-review comments)
4. **Respect for community norms** (see [CONTRIBUTING.md](../../CONTRIBUTING.md))

You don't apply yourself — we extend invitations publicly in an Issue, then grant collaborator rights once you confirm.

---

## Review process

### 1. You receive a review request

When you're assigned as a reviewer (or volunteer), check:

**Content PRs:**

- [ ] Are the facts correct? Are there verifiable sources?
- [ ] Is the tone neutral? (no bias, no over-promotion, no propaganda)
- [ ] Does the terminology follow [TERMINOLOGY.md](../editorial/TERMINOLOGY.md)?
- [ ] Does the structure follow [EDITORIAL.md](../editorial/EDITORIAL.md)?
- [ ] Any hollow modifiers? (vibrant / increasingly / actively / significantly / rich / comprehensive / diverse)

**Technical PRs:**

- [ ] Does `npm run build` pass?
- [ ] Does it break existing functionality?
- [ ] Is the code style consistent? (Prettier is configured)
- [ ] Any unnecessary large dependency introduced?

### 2. Give your review

- **Approve** ✅ — quality meets the bar, ready to merge
- **Request Changes** 🔄 — needs work; say specifically what
- **Comment** 💬 — suggestions that don't block merge

### 3. Merge

Only the Maintainer (@wilsonkichoi) merges. After a Reviewer approves, the Maintainer handles it promptly.

---

## Review principles

### What we encourage

- 🟢 Specific change suggestions ("line 15 says Laguna Beach incorporated in 1926, but it was 1927")
- 🟢 Proposing alternatives ("fetch API would be better than define:vars here, because...")
- 🟢 Affirming what's good ("nice abstraction here!")
- 🟢 Marking severity ("nit:" for minor, "blocking:" for must-fix)

### What we avoid

- 🔴 Vague criticism ("this isn't great" → say why and how to fix)
- 🔴 Style bikeshedding (Prettier exists; don't argue formatting)
- 🔴 Over-perfectionism ("make it exist first, then make it good" — don't block valuable contributions over small blemishes)

---

## Issue management

Reviewers can use these labels:

| Label                | Purpose                               |
| -------------------- | ------------------------------------- |
| `good-first-article` | Article topics suitable for newcomers |
| `content`            | Content-related (new/edited articles) |
| `bug`                | Bug fix                               |
| `enhancement`        | Feature improvement                   |
| `i18n`               | Translation-related                   |
| `discussion`         | Needs community discussion            |
| `duplicate`          | Duplicate Issue                       |
| `wontfix`            | Won't be addressed (state the reason) |

---

## Communication channels

- **GitHub Issues & PR comments** — primary discussion (public, traceable)
- **GitHub Discussions** — open-ended proposals and ideas

---

## FAQ

**Q: Do Reviewers get paid?**
A: No. LagunaBeach.md is a pure volunteer open-source project. We record every contributor with [All Contributors](https://allcontributors.org/).

**Q: Can I be both a Reviewer and a Contributor?**
A: Of course! You can keep submitting PRs, but you can't approve your own.

**Q: What if I'm too busy to review?**
A: Totally fine. There's no minimum activity requirement. Help when you can, rest when you can't.

**Q: How do I step down as a Reviewer?**
A: Just tell @wilsonkichoi anytime, or remove your own collaborator access on GitHub.

---

_Last updated: 2026-06-28_
