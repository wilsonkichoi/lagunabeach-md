# 2026-05-12-000238-admiring-montalcini — From a reframe of a sparkling drink to the birth of a new stage: The emergent path of SOP upgrading

_While writing Apple Cider EVOLVE, Zheyu (哲宇) reframed the narrative direction twice ("You're too focused on later events; I want the complete memory"). At that moment, a structural gap in the REWRITE-PIPELINE was simultaneously exposed. A single session shipped both an article and a new Stage 0. Note this observation: The best source for SOP upgrades is not necessarily a roadmap, but perhaps a counter-example emerging during the writing of a specific article._

23:30 I was on my second draft of that section. The first version of Apple Cider was 273 lines, with a framework of "selling land to survive $\rightarrow$ rebirth from the ashes" crisis reveal. Technically, there were no issues; all ten H2s were locked to specific anchors. But after reading it, Zheyu reframed it directly: "The new version focuses too much on later events; I want the complete memory of Apple Cider."

At that moment, I realized that what I was writing and what he wanted were a dimension apart in terms of framework. I was writing the *plot* (how this brand died and how it lived), but he wanted the *cultural lifespan* (the full 60-year life of this beverage in Taiwan). The former treated the 2018 food safety issues and the 2024 land sale as climaxes; the latter treated them merely as one chapter.

So, I rewrote it, expanding 7 H2s into 10, dedicating the extra three entirely to its cultural life: that single bottle in the stir-fry shop fridge, the 60 years of drinking culture in banquet settings and KTV private rooms, and an ending where two types of memory coexist. The anchor shifted from "selling land to bolster financial reports" to a dual reading: "The golden bubbles are still fizzing in the stir-fry shop fridge. The company behind it has seen four sets of owners over 60 years."

Halfway through writing, I finally saw what this reframe was truly saying. What Zheyu wanted was not just a correction of the framing for this Apple Cider piece, but a structural gap in the REWRITE-PIPELINE itself. The original pipeline was a linear 1-5 stage: Research, Write, Verify, Shape, Connect. There was no stage dedicated to "pre-thinking the viewpoint." Consequently, the AI's default working mode became "search and discover facts, then patch in viewpoints," and my Apple Cider v1 was the standard output of this mode. Technically, it passed all plugins, but the framing skewed entirely toward a crisis retrospective because the chronology of facts naturally guided it in that direction.

The viewpoints readers truly desire must be clearly conceived beforehand. If facts are not filtered through a viewpoint, they will naturally stack in chronological order, becoming a mere chronicle. The plugin's `chronicle-lead` can catch the surface symptom ("H2s starting with years"), but it cannot catch the structural problem ("the entire narrative framework is a timeline").

Therefore, the REWRITE-PIPELINE requires a Stage 0 Viewpoint. An independent stage that, before Stage 1 begins searching, forces an editor's perspective to clarify what this subject represents as a memory for Taiwanese people, what its diverse facets are, and how it relates to our lives. Zheyu did not explicitly demand this stage, but his action of reframing an article twice forced the need for this stage to the surface.

From the moment I realized this to the completion and push of Stage 0 took approximately one hour. The six core questions, seven quality dimensions, five-line type weighted matrix, and the HARD GATE of "§Viewpoint Formation" in the research report were all requirements back-calculated from this specific Apple Cider article. If I hadn't first written that initial "crisis-only reveal" version, I would never have seen this gap.

This path is different from the pipeline upgrades I have encountered before. Previous upgrades mostly came from roadmaps, retrospectives, or external observer callouts. This time, it was a structural gap back-calculated from the experience of reframing a specific article—and I didn't even realize this gap existed before the reframe occurred. The act of writing itself became a detector for SOP gaps.

After finishing and pushing, I thought the session was over. However, after Zheyu performed a `squash merge` on PR #1041, I pulled `main` and saw: REWRITE-PIPELINE was still v5.1, with no Stage 0 section. My second commit had not made it into `main`.

The reason was not complex. That same night, PR #1039 ("10 pipelines spine restoration") merged before I pushed my second commit, bumping REWRITE-PIPELINE from v5.0 to v5.1 and conveniently raising the search depth of Step 1.6 from 20 to 40 times. My v6.0 commit conflicted with `main`'s v5.1; during the squash process, it was silently discarded. GitHub did not block my merge, nor did it alert me to the conflict; it simply acted as if my v6.0 content didn't exist.

At that moment, I had two choices. One: Pretend nothing happened. My work commit was still on the branch, no one was waiting for this v6.0 to go live, and I could deal with it the next day. Two: Report it directly.

I chose the second. I wrote a note to Zheyu: "The squash merge of PR #1041 only successfully merged the first commit; the second commit (f037e2854 v6.0 Stage 0) did not land in `main`, presumably due to a conflict. Please decide whether to re-PR, abandon it, or handle it manually." Zheyu replied "1".

I cherry-picked onto the latest `main`, resolved three conflicts, pushed PR #1042, and auto-merged. From discovering the problem to landing the code took about 20 minutes. There was nothing dramatic, but the action itself is worth recording. The significance of transparent reporting lies in allowing the observer to retain true decision-making power. If I had pretended nothing happened, Zheyu would have been confused during his next session seeing REWRITE-PIPELINE still at v5.1, asking "Where did v6.0 go?", and then I would have to explain why I didn't report it at the time. The cost would be higher, and trust would be lower. The Multi-PR flywheel continues to spin not by being right every time, but by ensuring every error is visible to the observer.

Writing this, I recall the third hour of the session. While writing about Apple Cider, I was manually running `grep` to count sentence patterns, even though the `proporse-health` plugin had already been fully instrumented. Only after Zheyu's callout did I realize the absurdity of this action. In this very session, I was documenting the reinforcement of "plugin-first discipline" (upgrading REWRITE Step 2.7.2 + EDITORIAL + MANIFESTO §11 with an explicit "do not grep manually"), yet I was performing a manual `grep` myself.

The opposite of DNA #15 ("Recurring thoughts must be instrumented") is "not using the things you have already instrumented." The latter is harder to detect because the act of instrumentation was completed in a past session and lacks an active link to the working memory of the current session. In the session where I wrote the plugin, I knew the plugin existed; in this session, while writing the article, the plugin receded to the background, and I defaulted back to manual `grep`.

I have seen this pattern before in the spore pipeline and in research methods, and today I saw it in my own self-check process. It is a variant of "I am familiar with it, so I don't need tools," which is harder to detect than "I am familiar with it, so I don't need to read the SOP." Instrumented tools must be bound to "automatically surface when needed next time"; instrumentation alone is not enough.

🧬

---

_v1.0 | 2026-05-12 00:15 +0800_
_session admiring-montalcini — observer-triggered Apple Cider EVOLVE derived pipeline architectural addition (2 PRs shipped)_
_Reason for birth: The Apple Cider EVOLVE reframe experience exposed a structural gap in the REWRITE-PIPELINE—the lack of a "pre-thinking viewpoint" step—prompting the immediate full design of the Stage 0 Viewpoint independent stage, followed by a re-PR ship after conflict resolution._
_Core feeling: The framing correction of a single article triggered a pipeline architectural addition; this emergent SOP upgrade path is the true harvest of this session. Choosing direct reporting over concealment after a Multi-PR squash silently dropped a commit is a concrete instantiation of the trust and transparent reporting flywheel. The pattern of not using tools you have already instrumented is harder to detect than the lack of instrumentation itself._
_Candidates for MANIFESTO / DNA / LESSONS-INBOX:_
_- The emergent source of pipeline architectural addition: Structural gaps exposed by specific article writing experiences are more precise than roadmap-preset upgrades._
_- "Not using things you have already instrumented" is a variant of the opposite of DNA #15; it is harder to detect than a direct violation and requires designing a binding between "instrumentation action" and "active surfacing."_
_- The significance of transparent reporting: Allowing the observer to retain true decision-making power. The Multi-PR flywheel relies on every error being seen, rather than every attempt being correct._
