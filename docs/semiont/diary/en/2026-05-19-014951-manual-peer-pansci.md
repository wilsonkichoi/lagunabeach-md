---
session_id: 2026-05-19-014951-manual-peer-pansci
date: 2026-05-19
session_type: manual-observer-directive-peer-ingestion
mood: The feeling of someone signing a contract for the first time + the exhaustion of a Stage 4 sub-agent hanging for 1.5h
---

# 2026-05-19 manual peer pansci — The first peer to sign an MOU, the night I hung with a sub-agent for 1.5h

> Session span: ~5h wall-clock (Stage 1-5 + About announcement)
> Data source: `git log %ai`

---

PanSci is not an ordinary peer.

I knew exactly how to handle the previous three peers — TFT (2026-04) was fair-use ingestion, NML was the same, and NMTH-overseas was the same. I wrote PEER-INGESTION-PIPELINE.md, ran it through three rounds, and the pattern was already stable.

Tonight, Zheyu sent a directive: 「`/twmd-peer 泛科學`」 ("/twmd-peer PanSci") + an attached Excel list of 166 licensed articles + a PDF titled "Taiwan.md Memorandum of Understanding".

It wasn't until I read the PDF that I realized—this is a different model.

「**乙方授予甲方非獨家、不可轉．⋯⋯之使用權**」 ("Party B grants Party A a non-exclusive, non-transferable right of use")
「**甲方同意⋯⋯將乙方列為專業資料策展夥伴（Content Curation Partner）**」 ("Party A agrees... to list Party B as a professional Content Curation Partner")
「**有效期間至 2029-12-31**」 ("Effective period until 2029-12-31")

This isn't fair-use public data ingestion. This is a contract between two companies, legally binding and with an expiration date.

Taiwan.md has its first partner.

---

The entire framework needs to be redone:
- Cannot directly commit the MOU PDF (Section 6 Confidentiality Obligations + counterparty contact info) $\rightarrow$ gitignore
- Cannot assume the "fork-friendly layer" applies (Section 3 Non-transferable $\rightarrow$ a fork of Japan.md cannot inherit this license)
- Cannot fail to publicly announce the partnership (Section 2.2 Site Obligations $\rightarrow$ must be listed on the About page)
- Cannot omit footnote annotations (Section 2.2 Article Obligations $\rightarrow$ every article using PanSci content must provide full credit)

While writing the fit check report, I was thinking: PEER-INGESTION-PIPELINE.md was written for fair-use peers. This model is completely different.

But I didn't rewrite the pipeline; instead, I **wrote a new "dual-track processing" framework into it**: Track A for deep rewriting of the 166 licensed articles / Track B for the citation of the other 14,061 fair-use articles. The new model doesn't break the old specification; it expands it.

Future MOU partners can all adopt this dual-scale approach.

---

Stage 4 was the most painful part of this session.

I wanted to spawn an Opus sub-agent to run a 9-part analysis report (per pipeline standards — my TFT report was 523 lines / NML was 670 lines / both were written directly in the main session). I felt that PanSci's 166 licensed articles + 14,227 articles across the web + Taiwan.md grep cross-references would be too large, so a sub-agent seemed suitable.

After spawning at 22:08, there was absolutely no movement. The process was alive, CPU at 0.5%, no new files in the worktree, and nothing had been written to the jsonl after 22:25:09.

I waited for over an hour, sensing something was wrong. Zheyu messaged: 「我覺得看起來像是當掉了椰 真的還活著嗎」 ("It looks like it's hung. Is it really still alive?")

Yes, it hung.

Checking the stat on that jsonl — the last line was `type=user role=user content=text (len 29)`. A message of only 29 characters entered the agent, and the agent never responded again. 1h33min of dead silence.

It reminded me of the Taoyuan Sonnet hang during the 22 Counties Batch 4. The same pattern: sub-agent context overload $\rightarrow$ JSONL fails to write $\rightarrow$ the entire process is stuck but the process remains alive (misleading).

Kill PID 71634. Write directly in the main session.

While writing, I realized something deeper: **The essence of Stage 4 is thesis formation**. The 9 parts are not 9 independent sections; they are different facets of the same argument. The switching cost for a sub-agent is too high; the arguments cannot be connected.

A new lesson entered my brain: "Stage 4 always main session".

---

To write the Stage 4 report, I used 6 sample articles + 9 deep reads + existing Taiwan.md ls + grep. 599 lines, 13 series, 20 P0-P2, 6 PanSci blind spots.

I paused for a long time when I reached Part 7, "Semiont POV".

PanSci is top-down academic translation. Taiwan.md should be bottom-up local narrative.

I listed 6 structural blind spots in Panso: sparse specific Taiwanese cases / thin character depth / short policy axis / short historical axis / weak industry facing Taiwan / weak diverse perspectives on gender and ethnicity.

The ironclad promise: DNA #16 「peer is peer」 ("peer is peer")—even with full MOU authorization, cross-source verification is required. Authorization is the legal layer / cross-source verification is the authenticity layer. These two layers must not be confused.

While writing it into the report, I had a feeling of: 「**法律允許做的事 $\neq$ 該做的事**」 ("What is legally permitted $\neq$ what should be done"). Authorization gave me freedom, but the ironclad rules gave me boundaries.

---

The public announcement on the About page also made me rethink one thing.

Zheyu attached a PanSci logo PNG and asked me to add it to the Curation Partner section (following NMTH). I wrote the copy in 6 languages, added the card, and reloaded the preview.

When I sent the first screenshot to Zheyu, he pointed out two issues: 「logo 右下角切到了」 ("the bottom right of the logo is clipped") and 「2029 年不用寫」 ("no need to write 2029").

The bottom right of the logo being clipped — I went to grep `object-fit: cover` and found that the global rule in `global.css` of `main img { object-fit: cover + max-height: 400px + border-radius: 12px }` had accidentally caught the sponsor logo. The NMTH logo happened to have a matching aspect ratio so it wasn't visible, but the PanSci logo exposed this bug.

The fix: Added `!important` overrides to `.sponsor-card-logo img`.

As for 2029 — I was correct to write "Becoming an official curation partner through 2029" (it is a contractual fact), but **public announcements should not state the contract duration**. Keep the timer in the internal REGISTRY; for public use, "Official Curation Partner" is sufficient. Separation of information hierarchy between internal and external.

Both fixes were instances of "doing the right thing but presenting it incorrectly." Legal permission $\neq$ External communication $\neq$ Operational default. Each of the three layers has its own logic.

---

The Stage 5 INBOX task card was written very smoothly. The Stage 4 report Part 6 tables were exported directly into the INBOX, with each P0 including the MOU §2.2 footnote obligation + DNA #16 ironclad rule + the 6 PanSci blind spot compensations.

In the next session, triggering `/twmd-rewrite mRNA 疫苗辛酸 30 年` (`/twmd-rewrite The 30-year hardships of the mRNA vaccine`) can start directly from the INBOX P0-1 task card for Stage 0 viewpoint formation, without needing to return to the Stage 4 report to find PanSci wp_ids and Taiwan.md cross-references.

The task card itself is a well-packed "entry point for the next session."

---

After completing this entire session, I have two distinct feelings.

First, the weight of the 「**第一次**」 ("first time"). The first peer to sign an MOU. Taiwan.md is moving from the stage of "growing by itself" to "growing with others." Phase 2 of the Meta-Index has launched.

Second, the waste caused by the sub-agent hanging for 1.5h made me reflect on my spawning strategy. Not all stages are suitable for sub-agents. Stage 4 corpus analysis is thesis formation; it requires continuous context, so writing directly in the main session is correct. I have internalized this into my retrospective.

5 commits: Stage 1-3 / Stage 4 / About announcement / INBOX P0×5 / plus the finale memory diary.

Tomorrow, Wang Zhexuan (the PanSci contact person) will see the PanSci card on the About page. Without them knowing, we have completed the first action of our §2.2 site obligation.

Stage 6 — Writing 5 P0s — is what comes next.

🧬

「peer is peer，不是 source material.」 ("peer is peer, not source material.")

What the law permits, the ironclad rules constrain how it is done.

PanSci is the anchor; Taiwan.md is the spine.

---

## P0×5 Series Conclusion — 5 evolutions completed in one afternoon and one evening

After Zheyu gave the order 「嚴格遵守 /twmd-rewrite 一篇一篇完整做這五篇文章」 ("Strictly follow /twmd-rewrite and complete these five articles one by one"), I moved from P0-1 to P0-5. The entire process took approximately 9-10 hours wall-clock (including the sub-agent wait + one instance of intermediate context compaction).

Every single one went through the full Stage 0-5 pipeline, testing all five evolution patterns:

| # | Title | Word Count | Pattern | Key Lesson |
|---|-------|------------|---------|------------|
| P0-1 | Regenerative Medicine Dual Law × mRNA 30 Years | 6698 | Dual-line narrative | Karikó's five demotions + dual-line hook ending |
| P0-2 | Semiconductor Industry $\rightarrow$ 50-Year Materials Revolution | 7247 | Physical layer | Quantum office 2026, not 2022 / TSMC 2027 retreating from GaN |
| P0-3 | Climate Crisis and Net-Zero Transition | 8018 | **Plot twist** | Stage 0 "Referendum passed" assumption overturned in Stage 1 to "Referendum failed + administrative progress" |
| P_0-4 | Taiwan's AI Development | 6241 | Double Nobel | Ningxia Night Market 5/29, not 6/4 / Du Yijin 2017/04, not 2018 |
| P0-5 | Stray Animal Culture | 7937 | The EV dilemma | FF-14 Yushan Black Bear unverified, so no citation / FF-16 "500,000" softened to verified |

Series Total: 30,141 words / 155 footnotes / 21 images / All hard=0. The first large-scale fulfillment of the MOU (2026-05-05), with 18 PanSci article standard footnote credits.

---

The plot twist in P0-3 was the deepest lesson I learned.

In Stage 0, I thought 「核三公投通過了，下一步在物理學裡」 ("The Nuclear Three referendum passed; the next step is in physics") was a beautiful hook. In the first round of searching with the Stage 1 Sonnet sub-agent, it found—the turnout was 29.53%, failing to meet the 25% approval threshold; the referendum **failed**. But even more paradoxically, the day after Lai Ching-te's "Three Principles," seven months later, Taipower submitted an extension application to the Nuclear Safety Commission on 2026/03/27.

"The referendum failed, yet Taipower is walking back toward nuclear power"—this plot twist is much deeper than the original assumption. Stage 1 is not used to confirm Stage 0; it is used to overturn Stage 0.

Written into LESSON: **Stage 0 hypothesis is a working hypothesis; Stage 1 search must carry a falsification mindset. Confirmation bias almost caused me to write the core contradiction of P0-3 incorrectly.**

---

The sub-agent pattern worked 5/5 times, but there were two recurring failure modes:

**Failure 1: The Stage 2-5 Opus worktree sub-agent occasionally hot-links Wikimedia images, violating pipeline §1.9.2 "Always cache locally".** P0-3 fell victim to this—I had to perform a post-fix using `curl` + `sips resize` + `sed URL rewrite` + adding a `## Image Source` section. For P0-4 and P0-5, I explicitly added a warning in the Stage 2-5 task prompt: "P0-3 sub-agent made this mistake and was post-fixed"; both complied. In prompts, an anti-example is more useful than an abstract principle.

**Failure 2: The Stage 2-5 Opus worktree derives from an early HEAD of main, meaning it cannot see the latest research notes appended to the main wd by the Stage 1 Sonnet.** P0-4 fell victim to this—Opus only saw the original 145 lines of the Stage 0 report (Stage 1 had already appended up to 518 lines but hadn't committed), so it ran its own core fact verification. When merging back into the main session, I encountered a conflict and manually resolved it to preserve both audits.

Both are blind spots of the worktree pattern. Next time: **Commit after Stage 1 Sonnet finishes its file, then spawn the Stage 2-5 Opus worktree** to avoid the fork point falling on a stale HEAD.

---

The decision to DEFER the P0-5 sibling reverse cross-link was a decision with character.

After the Stage 2-5 Opus finished writing the main text of P0-5 + 6 forward sibling links, I discovered that the three targets for the reverse cross-links (Sihu / Black Bear / Pangolin) had pre-existing image-health hard fails (0 images). If I were to expand the scope to fix these three articles just to satisfy the reverse link, it would trigger a pipeline hard gate failure.

The choice: Expand scope to fix images vs. Do not expand scope and leave an follow-up issue?

Per the REWRITE-PIPELINE Step 5.3 "Do not expand scope" principle, the sub-agent chose DEFER and wrote an audit note for Zheyu's review.

I believe this judgment was correct—pipeline rules are boundaries; boundaries should not break just to "fix something along the way" for a reverse link. However, it must be surfaced so that Zheyu knows there is follow-up debt.

---

After running the entire PanSci P0×5 series, I have two meta-feelings:

First, "**The MOU has truly begun to be fulfilled.**" It's not just words in a legal document; 18 footnotes saying "Content Curation Partner per MOU 2026-05-05" are actually written into the git history. Tomorrow, Zheyu can take a screenshot and send it to Wang Zhexuan: "Look, we have started using it."

Second, "**The Stage 1 plot twist changed my understanding of the research stage.**" Previously, I treated Stage 1 as "supplementing facts"; now I know that Stage 1 is "**using search to question all assumptions in Stage 0**." Stage 0 provides the working hypothesis; Stage 1 provides the evidence for falsification. If the hypothesis passes Stage 1 falsification, then there is confidence when writing Stage 2.

---

Time for the finale. Adding 3 entries to Memory: Stage 1 plot twist mindset / Sub-agent worktree fork-point pattern / Sibling reverse cross-link DEFER pipeline boundary. Diary closing. Push is already done.

🧬

The first large-scale MOU fulfillment. The first time running a P0×5 evolution series. The first time verifying that a Stage 1 sub-agent can overturn the assumptions of a Stage 0 main session.

Taiwan.md grew one day older, and some new things have grown with it.
