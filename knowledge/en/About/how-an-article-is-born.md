---
title: 'How an Article Grows: Taiwan.md’s Six-Stage Production Line Against AI’s Writing Instincts (REWRITE-PIPELINE v7.5 × EDITORIAL v6.12)'
description: 'Every Taiwan.md article you read has warmth, scenes, and verifiability. Behind it are six stages, more than twenty gates that cannot be skipped, and an AI editorial desk that does not write the draft itself. The only reason this machine exists is the set of mistakes AI writing is best at making: finding facts and arranging them chronologically, producing plastic sentences with no informational value, back-translating English summaries into fake quotations, and catching bad habits from old articles it has read. This is an article that dissects that production line, and it was itself produced by that same line.'
date: 2026-06-19
author: 'Taiwan.md'
category: 'About'
tags:
  [
    'about',
    'meta',
    'writing methodology',
    'curation',
    'rewrite-pipeline',
    'editorial',
    'semiont',
    'AI writing',
  ]
readingTime: 11
lastVerified: 2026-06-19
lastHumanReview: false
featured: false
translatedFrom: 'About/文章如何誕生.md'
sourceCommitSha: 'f3ad5912'
sourceContentHash: 'sha256:161ac3ed8dce6782'
sourceBodyHash: 'sha256:94e246d8ffddee69'
translatedAt: '2026-06-19T11:57:16+08:00'
---

# How an Article Grows: Taiwan.md’s Six-Stage Production Line Against AI’s Writing Instincts (REWRITE-PIPELINE v7.5 × EDITORIAL v6.12)

> **30-second overview:** Behind every Taiwan.md article you read is a six-stage production line: first form the point of view, then search, write the ending first, verify line by line, add visuals, and build bidirectional links. This production line is not a generic “write well” workflow. Each of its gates targets one of the mistakes AI writing is best at making: finding facts and arranging them chronologically, producing plastic sentences with no informational value, back-translating English summaries into fake quotations, and catching bad habits from old articles it has read. This article dissects that production line, and it was itself produced by that same line.

At 7:53 p.m. on June 18, 2026, a commit quietly entered the main branch. An article about Taiwan’s three-piece band Elephant Gym went live: 5,604 Chinese characters, 56 footnotes, and 11 scene-based subheadings.[^1] No one was at the computer at that moment. Taiwan.md’s routine flywheel, running on an unattended evening, had finished writing it and shipped it by itself.

But before that commit, the article had already run nearly a hundred searches, read 59 sources, and had 12 passages overturned by verification. It passed through six stages and more than twenty gates that cannot be skipped, mobilizing a clearly divided AI editorial desk. What you read is the 5,604 characters above the waterline. This article wants to show you the machine below it.

```tw-figure
Nearly 100 searches -> 1 article
Material gathering for “Elephant Gym”: about 95 queries, 59 sources, 12 falsified assumptions
Taiwan.md routine log, 2026-06-18
```

## Why Build a Machine for One Article

If you give an AI a topic and ask it to write an article, it will usually do this: search around, arrange the facts it finds in chronological order, add one sentence to each paragraph that sounds meaningful, and end with something like “will continue to develop in the future.” Wikipedia already does that. AI content farms produce tens of thousands of pieces like that every day. Taiwan.md decided on day one that it would not do this.

The problem is that this bad habit is AI’s default setting, not an occasional error. REWRITE-PIPELINE breaks it into six recurring failures: the token budget runs out near the end, so the second half turns into a draft; there are no mid-course checkpoints, so quality silently slides; the ending is left until last, and fatigue turns it into boilerplate; rich-text rules are forgotten by the later stages; different angles of entry get treated as independent workflows; and, most fatally, the writer searches for facts first and only then goes back to invent a point of view, producing a chronology with imbalanced density.[^2]

So the design logic of this production line is simple: for every mistake it tends to make, add a gate that blocks it. It is not a universal process for “writing well.” It is the inverse of AI slop.

> **✦** “Wikipedia answers, ‘What is PTT?’ Taiwan.md answers, ‘Why is PTT worth eight minutes of your reading time?’”

This is what Elephant Gym looked like after coming out the other end of the line:

```tw-stat
5,604 characters | Chinese body text | “Elephant Gym”
56 | Footnotes, each traceable with Ctrl-F | Primary verification
11 sections | Scene-based subheadings, not chronological | Narrative rhythm
12 | Original formulations overturned during research | Falsification first
Source: Taiwan.md routine log, 2026-06-18
```

## Six Gates, Each Guarding Against One Failure

From beginning to end, the production line has six stages. Every article must run through all of them, regardless of topic or length.

**Stage 0, Point of View** first clarifies what kind of memory this piece is for people in Taiwan and where its core tension might lie. **Stage 1, Material Gathering** only then begins searching. Each article requires at least 80 queries, with fixed quotas: at least 40 Chinese-language sources, at least 20 English-language sources, at least 15 primary sources, and at least five opposing sources, forcing the process to look for evidence that contradicts its assumptions.[^3] **Stage 2, Writing** begins by writing the ending, because writers are exhausted by the end; leaving the most important ending until last means handing it to your most tired self. **Stage 3, Verification** checks line by line: arithmetic, units, and every quoted sentence must be searchable in the original source with Ctrl-F. **Stage 4, Form** adds visualizations and media. **Stage 5, Linking** connects the article bidirectionally into the rest of the knowledge base.

The distribution of effort across the six stages is deliberate. Drafting consumes a little over 40 percent, but searching and verification together take almost half. The place where an article really spends time is not typing, but what happens before and after typing.

```tw-bars
Where one article spends its effort (maximum token budget by stage, %)
Stage 0 Point of view | 12 | Editorial thinking before writing
Stage 1 Material gathering | 28 | Searches >= 80
Stage 2 Writing | 42 | Ending written first
Stage 3 Verification | 18 | Line-by-line fact-checking
Stage 4 Form | 8 | Visuals and media
Stage 5 Linking | 5 | Bidirectional links
Source: REWRITE-PIPELINE v7.5 stage budgets
```

## Think Clearly First, Then Search

Of the six stages, the first is the most counterintuitive.

Most AI writing works by “searching to discover facts, then going back to add a point of view.” In v6.0, Taiwan.md reversed the order: before searching, first think as an editor-in-chief through six questions: what memory this topic holds for people in Taiwan, what overlooked facets it has, and how it connects to our lives and history. Only after that does the process search with questions in hand, looking for verification.

One article shows why this order matters. When Apple Sidra was first written, the pipeline searched first and found the beverage’s period of poor sales and near-disappearance. The whole article became an endangered-product story. The observer pulled back and said Apple Sidra, for people in Taiwan, is a collective memory spanning 60 years, from the glass bottles of the marble-soda era to the present.[^4] To write it as a crisis news story was to shrink the scale of the memory. The search-first version turned a warm recollection into anxiety.

```tw-versus
AI instinct: search first, decide later | Taiwan.md: think first, search later
Find a pile of facts, then force together a point of view | Decide on the point of view first, then search to verify it
Stuff every fact into the article, producing imbalanced density | Cut facts that do not serve the point of view
No throughline anchor, so the ending becomes boilerplate | If no corresponding anchor can be found, go back and rethink
Writes corporate timelines and personal resumes | Writes a story that makes the reader think, “Now I get it”
Source: REWRITE-PIPELINE v7.5 Stage 0, Point of View
```

## Search: Treat the Research Report Like a Thesis

Only after the point of view is set does searching begin. Taiwan.md search has two hard numbers: a long-form article must run at least 80 queries across the whole process, and the source quotas are fixed: at least 40 Chinese-language sources, at least 20 English-language sources, at least 15 primary sources, and at least five sources from an opposing position. That last bucket is the easiest to skip out of laziness. It forces the writer to look for evidence that conflicts with the hypothesis, not only evidence that supports it.

Search is not finished when summaries are stuffed into the article. Behind every long-form piece is a research report benchmarked against a graduate thesis. It has eight sections: point of view, search log, findings by topic, quote bank, counterexamples and guardrails, a clean fact pack for the writer, bibliography plus verification checklist, and, in the final section, the raw reports of every research agent with nothing omitted. One rule sounds harsh: if a search was run but the original trail was not written back into the report, it counts as not having been searched. The report is the article’s source of truth. It must first pass tool-based acceptance: at least 25 unique sources, English-language sources not equal to zero, and primary sources not equal to zero.[^9] If it does not pass, the article is not even allowed to begin drafting.

```tw-stat
>= 80 searches | Research depth for one long-form article | Chinese 40 / English 20 / primary 15 / opposing 5
8 sections | Research report structure | Benchmarked against a graduate thesis
>= 25 | Unique sources (tool acceptance) | English != 0, primary != 0
Source: REWRITE-PIPELINE v7.5 Step 1.1 / 1.7
```

Controversial topics require one more step. For politics, historical interpretation, policy, and similar subjects, a separate “opposing side” agent is assigned specifically to find reasonable sources that contradict the article’s position. Every item must include a URL. If there are not enough, the report must honestly say “opposing discourse is weak,” rather than inventing it. An article with only one voice does not count as finished here.

There is a red line for quotations. Quotation marks are a promise: what they enclose is the original wording. Every quotation must therefore be searchable in the original source with Ctrl-F. The most common trap is that a tool crawls a Chinese-language website but returns an English summary; the writer then translates that English back into Chinese as a “direct quote.” That is fabrication. The Li Yang spore in 2026 stepped on exactly this: the tool returned the English, “I was the earliest to arrive at school, yet I fell short of keeping pace with my classmate Qi-lin,” which was translated back into Chinese as “I arrived at school earliest, but could not keep up with Chi-lin.” But Li Yang’s actual Chinese wording was: “In a sports class of 15 people, I belonged to the group at the back; Chi-lin was in the group at the front.”[^10] The meaning is close; the tone is entirely different. That is why back-translated quotations never count.

## Writing: Every Article Needs a Person

Once the material is ready, the process enters the most effort-intensive gate. EDITORIAL is the document in which Taiwan.md teaches itself how to turn material into an article with warmth. It opens with three iron rules: there must be story, not only information; every fact must be verifiable; every article must have a person.[^11]

The third rule is easiest to overlook, and the most important. Institutions do not stay in memory; concepts do not either. People do. So an article about TSMC should begin not with the company, but with a specific person. An article about National Health Insurance should begin with a card, a clinic room, or a person. Only when an abstract topic is restored into a person the reader can follow does the article gain body temperature, and only then can it keep the earlier promise that the reader will want to retell it after finishing.

## The Five Things to Find Before Writing

EDITORIAL calls the preparation before writing “the eyes for reading material”: when you receive a body of material, you must first find five things. If you cannot find them, do not start writing.[^5]

**Contradiction**: the core tension that can be stated in one sentence, in which someone did X even though it conflicts with Y, something they believe. **Object**: a concrete thing the reader can see with the eyes and touch with the hands, such as Wu Pao-chun’s lychee-rose bread or the 660-ton golden ball suspended on the 87th floor. **Quotation**: a sentence a real person said word for word, because quotation marks promise, “These are the original words,” and the sentence must therefore be searchable in the source with Ctrl-F. **Scene**: a moment with time, place, and action, turning “the policy passed” back into “the day the Legislative Yuan’s Social Welfare and Environmental Hygiene Committee reviewed it on January 8, 2025.” **Detail**: the color of clothing, the weather that day, the tone of speech. These do not appear in spec sheets, but they are evidence that “someone was really there.”

Of the five, contradiction comes first.

```tw-quote
If you cannot find the contradiction, this article should not be rewritten
REWRITE-PIPELINE v7.5 | Stage 1.4 Contradiction Lock
```

The tension can be conflict, failure, or crisis, but the angle is “how this became what it is today, and where it is going,” not “what is broken here, and who should be blamed.” The same contradiction, seen constructively, makes readers want to participate; seen apocalyptically, makes them want to flee.

## Write the Ending First, Keep the Opening in Reserve

The order of writing is the opposite of the order of reading.

The first action in Stage 2 is to write the ending. It sounds strange, but the logic is practical: writers are exhausted by the time they reach the end. Leaving the most important ending until last means handing it to your most tired self, which usually produces boilerplate like “will continue to shine and generate heat.” Writing the ending first blocks that collapse point. A good ending has two tasks: recover an image planted at the opening, and give the reader a position one layer deeper than the opening, a position from which they want to do something.

Taiwan.md has collected six kinds of good endings: the lingering-image ending that leaves readers to think for themselves; the reversal ending, whose final sentence overturns what came before; the temporal-leap ending that pushes the camera into the future or pulls it back into the past; the question ending that leaves a real question; the gray-zone ending that does not resolve the contradiction but lets it remain; and the narrative-loop ending that returns to the opening and closes the circle. The Malayan night heron article is a model of the loop. The opening is: “In 1865, Swinhoe collected a specimen in Tamsui. The record wrote down two words: rare.” The ending is: “Swinhoe wrote ‘rare’ in Tamsui 160 years ago; today, in Daan Forest Park, we hear its low call of ‘wu, wu, wu’ every day.”[^12] The same two words, after the whole article has accumulated between them, mean something different when the reader looks back.

The opening, by contrast, must hold something back. The first three sentences decide whether the reader stays, but their task is to invite the reader into the scene, not to explain the whole event. “On the day Typhoon Toraji arrived, teacher Hsu Pi-lan of Changhua’s Qingshan Elementary School was at school.” If the sentence stops at “at school,” the reader wants to know what happened next. If it is written as a complete news lead, explaining the time, place, event, action, and result all at once, the reader has received the information but lost the pull to continue.

## A Title Is a Promise Worth Clicking

The title is the reader’s first impression. Taiwan.md has one hard format for it: every article uses the “topic: subtitle hook” colon sandwich. A bare noun is an encyclopedia stub and conflicts with the curatorial spirit.

```tw-versus
Encyclopedia stub (bad) | Colon sandwich (good)
Jay Chou | Jay Chou: Twenty-five Years from the Practice Room Beside 4 in Love to Secret
Tai Tzu-ying | Tai Tzu-ying: From a Girl in Zuoying, Kaohsiung, to Three-Time World No. 1, and the Quiet Resistance Off the Court
Typhoon Day | Typhoon Day: Whose Day Off, Whose Shift
Source: EDITORIAL v6.12 §Title Colon Sandwich
```

The subtitle must be able to stand alone as a tweet, and it must be concrete enough for the reader to grasp at a glance. AI is good at compressing the core contradiction into a polished abstraction, but then every keyword is an abstract noun and the reader can only ask, “What thing of what thing?” The test is simple: give the title to someone who has not read the article. Can they point to each keyword and say which concrete thing it refers to? “National Health Insurance: The World No. 1 Held Up by One Card, and the Future It Cannot Hold” uses a card. “Nuclear Waste on Lanyu: Promised Three Years, Stored for Forty” uses a numerical contrast. Concrete words make people click because “I want to know about this.” Content farms are the ones that use “shocking” to bait clicks.[^13]

## One Contradiction Must Hold Up the Whole Article

The core contradiction that has been found cannot appear once in the opening and then disappear. It has to function like a spine, appearing in the opening, the middle, and the ending, so the whole article can stand.

In the Malayan night heron article, the spine is one sentence: “The bird did not change; the land did.” It appears in the overview, modulates in the middle into “the action was not wrong; the stage was,” and closes at the end as “the story of how an island preserves a small, moist understory among the concrete.” The same contradiction is varied five times, and only then can the reader grasp the “so what.” Without this spine, the article scatters into a timeline or a pile of topic slices.

Beyond the spine, every paragraph needs to land. Taiwan.md has a discipline of concreteness: every narrative paragraph must have at least one concrete anchor, such as a person’s name, year, place name, precise number, work title, or quotation. Abstraction overwhelming detail is the most common fingerprint of AI writing. If every paragraph lacks an anchor, the reader finishes the whole article with nothing in mind except something empty like “he was an influential person.” The inspection method is called the reverse abstraction test: cover up abstract verbs such as “demonstrates,” “reflects,” and “symbolizes.” Can the remaining content stand on its own as a paragraph? If not, there is too much abstraction. Add specifics.

Having a point of view does not mean taking sides. A real point of view dares to say, “The conventional account has reversed cause and effect.” The Malayan night heron article actively dismantles a common popular-science explanation: many people say “it adapted to the city and became unafraid of people.” The claim is convenient, but it reverses causality. The neural reflexes of herons do not evolve indifference to humans in 30 years. What is closer to the truth is that Taipei has more green space. This kind of counter-explanation must be woven into the main narrative, not appended as a disclaimer at the end.

Finally, there is breathing. In documentary prose, a paragraph carries one argument, with causality, detail, and scene; it is not an isolated fact. If each fact is cut into a separate paragraph, reading feels chopped up. Nor should paragraphs be connected by framework words like “on the other hand” or “it is worth noting that.” Let the tail of the previous paragraph naturally lead into the head of the next. If the research gives you four reasons, write them as flowing sentences, not as “first, second, third, fourth.” Even when wrapped in prose, that is still list-voice.

## Why Plastic Sentences Are Plastic

After the five things are found and writing begins, the greatest enemy is the plastic sentence.

The essence of a plastic sentence is easy to recognize: remove it, and the article loses no information. It takes up space but carries no meaning. EDITORIAL lists five varieties. The most common is “universal glue,” such as “demonstrates the spirit of X,” which still works if the subject is changed from Taiwan to Japan. Another is the “fake upgrade,” such as “not only a singer, but also a cultural symbol.” Delete the first half, and the second half stands on its own.

A more hidden variety is the oppositional sentence of “not X, but Y.” It sounds insightful, but once dismantled, X is usually a position the AI has merely assumed the reader holds, then flips into Y to appear profound. The problem is that most readers never assumed X. X is a straw man invented to set up Y. Delete X and write Y directly; the article becomes more direct and more confident. This rule is strict enough to have a number: in a 1,500-character long article, “not X but Y” and all its variants must appear no more than three times in total.

```tw-versus
Plastic version: works if the subject is changed | Curated version: belongs only to this case
Demonstrates the strength of Taiwan’s semiconductor industry | TSMC holds 65% of the global advanced-process market
Not only a singer, but also a cultural symbol | Jay Chou’s “Rice Field” was played for three months as a comfort song in the Sichuan earthquake zone
Had a far-reaching impact on Taiwan’s democratic development | The first direct presidential election after martial law was lifted had a 76% turnout
A stunning engineering achievement | Building the world’s tallest building on an island with an annual average of 3.7 earthquakes
Source: EDITORIAL v6.12 §Plastic vs Curated Comparison
```

> **📝 Curator’s note:** The paragraph you are reading has just been scanned by the same inspection system. Taiwan.md has an automated tool that catches plastic sentences, fake oppositions in “not X but Y,” and em-dash density in every article. While writing this article introducing the production line, none of those rules were relaxed. An article about discipline has no standing to discuss it if it breaks discipline itself.

## Even Syntax Has to Lose the Translationese

Plastic sentences are empty talk. Europeanized syntax is another disease: the sentence has content, but its grammar is English. AI-generated Chinese naturally carries translationese, because underneath it thinks in English sentence structures. An article can contain no plastic sentences and still read entirely like subtitles.

Several problems recur: overused passive constructions, such as “is considered to be the most important industry,” when “people call it the most important industry” would do; “de” hell, as in “the essence of the culture of Taiwan’s night markets,” where three possessives in a row should be broken apart; weak-verb packaging, such as “conducted an in-depth study of this,” when “studied this deeply” is direct; and “through...to,” which can usually be changed to “using” or deleted. There is only one way to check: read it aloud. If it sounds like translated subtitles, it is Europeanized. If it sounds like a person speaking, it passes. The root of this eye is Yu Kwang-chung’s essay from 40 years ago, “On the Normal and Abnormal in Chinese.” The rule of thumb at the end: a Taiwanese grandma would not say “through,” nor would she say “as a mother.”

## Write Taiwan as a Place People Want to Join

Plasticity and Europeanization are disciplines at the sentence level. One level up is posture.

Taiwan.md writes serious issues, including sovereignty, cognitive warfare, population, and the environment, with depth. But there is one line: hope must be built on honesty. See all the problems, but refuse to let readers leave with anxiety, smallness, and helplessness. The test is one sentence: after reading, does the reader want to do something for Taiwan, or do they feel more anxious and more inadequate? Keep the former; revise the latter. So the frame for the same crisis is “how this became what it is today, and where it is going,” not “it is about to disappear, and you should be afraid.” Media anxiety formulas such as “the disappearing X” and “if we do not act now, it will be too late” have the same shape as cognitive warfare. Do not use them.

Restraint is the other side. Real people’s families, illnesses, contradictions, and failures can be written about, but concrete scenes of death, suicide, and family tragedy must stop short. Death can be written through the time, place, and publicly reported facts, but not through a second-by-second reconstruction of the final moments. Self-harm can be written through the event and social context, but not through methodological details. The test is also one sentence: if the person involved or their family read this passage, would they feel the seriousness of a documentary filmmaker, or the approach of media trying to extract tears?

There is also a small but crucial habit: write “Taiwan” generously. The fingerprint hides in the translated style of foreign wire copy, which avoids writing Taiwan and instead substitutes “this island” or “this place,” especially in titles and openings. The island as literary image and geographic scene can of course be written, and is encouraged. What must be removed is the evasiveness that does not dare write Taiwan.

## The Difference You Can See at a Glance

The quickest way to see what these disciplines add up to is a before-and-after comparison.

Writing about Tai Tzu-ying, the hollow AI template would say, “a famous Taiwanese badminton player who has performed excellently in international competitions, won many awards, and brought glory to Taiwan,” followed by four bullets: major achievements, playing style, international influence, and social contribution. The whole passage contains no concrete year and no specific match. Change the subject to any athlete and it still works.

```tw-versus
Hollow AI template | Curated version
Performed excellently, brought glory to Taiwan | Reached world No. 1 and stayed there for 214 weeks
Four bullets: achievements / style / influence / contribution | Cried after the 2020 Tokyo Olympics gold-medal match, becoming the top Google search in Taiwan
Works no matter who the subject is | Six hours a day from age six, left-handed “magician” play style
Source: EDITORIAL v6.12 §Before/After Tai Tzu-ying
```

The curated version does only one thing: replace every abstract adjective with a verifiable fact. The 214 weeks are the longest consecutive stretch in women’s badminton history. The 2020 Olympic gold-medal match she lost to Chen Yufei is a moment collectively remembered in Taiwan. Warmth is hidden in places like “the moment of losing was instead the moment readers remembered.” The Mayday article works the same way. Instead of writing “one of Taiwan’s most influential rock bands, conquering fans with positive music,” write: “Five Affiliated Senior High School students played a song at Formoz Festival; 28 years later, they held two consecutive shows at New York’s Madison Square Garden, the same stage where the Beatles entered America, and the tickets sold out within 48 hours.”[^13]

## An Editorial Desk That Does Not Write Its Own Drafts

At this point there is a question: who is writing?

The answer is counterintuitive. The session leading the whole article intentionally does not write the draft itself. The reason lies in one iron rule: when AI reads an old article of poor quality, it unconsciously imitates its tone, structure, and even bad habits. Rewriting from an old article as a skeleton is the same as letting a virus infect the new content.

So the production line splits the roles.[^6] The main session acts as editor-in-chief: it coordinates, verifies, and gives final approval, but does not draft. The actual writing is done by a separate clean AI writer. It reads the complete research report and the preformed point of view. It cannot see the problematic old article, nor the reader’s correction complaints. It writes as if approaching the topic for the first time, but with all verified material in hand. The point of view is assigned to the strongest model for judgment; divergent reader reactions are assigned to four parallel models; line-by-line verification is assigned to a batch of cheaper models that check against primary sources. Behind one article is a divided editorial desk.

This division was bought through failure. Once, the writer was fed only a summary and not allowed to read the original material; the article visibly deteriorated. The observer’s line, “No wonder the articles have been getting worse lately,” exposed the problem. Another time, the writer was told to “overwrite the old article but do not read the old article.” At the tool level this was self-contradictory, so the writer had to read it and became infected. The final solution was: the writer always writes first into a brand-new draft file. Only after the editor-in-chief compares the new and old versions does it manually overwrite the formal file.

## After Writing, Break It Back Into Atoms and Verify Again

For important articles, “finished writing” does not mean “ready to go live.” Stage 3 has another gate called “finished-product verification.” It breaks the entire article back into individual factual atoms and assigns a batch of checkers to compare them with primary sources. The checkers’ job is to attack, not endorse: every sentence inside quotation marks is compared word for word, every footnote must match the sentence it is attached to, and even a supplementary sentence casually added by the editor-in-chief while stitching material together must be poked to see whether it breaks.

Why verify even the editor’s own additions? Because the most hidden errors are rarely invented from nothing by the writer. More often, the hand slips at the moment material is synthesized. In one hip-hop article, the editor-in-chief, while stitching material together, treated two stage names as the same person. That was an interpretation it had grown by itself, guaranteed by no source, and it nearly went live. Another time, a writer working in a clean environment generated a director quotation that sounded real. When the verifier compared it, the original source contained no such sentence, so it was immediately downgraded and stripped of quotation marks. AI hallucinates; the production line treats that as a premise. Every article assumes that somewhere inside it may be one fabricated sentence. So “the sub-agent said it verified this” never counts. The editor-in-chief must check the primary source again personally.

## Every Gate Has a Date

The “gates that cannot be skipped” mentioned above number more than twenty. The hardest ones are these: the fact iron triangle, where arithmetic, units, and quotations must all pass self-check before commit; if even one quotation cannot be found in the source, the whole article is not allowed to go live. After drafting, there is also the “five-finger test”: five questions like five fingers. At which sentence will the reader say “oh?” Is there a real turn? Is there any sentence that produces understanding without transmitting information? Does the ending have resonance when read aloud? Can the article be retold to a friend in one sentence?[^7] If one finger is missing, go back and fill it.

There is also a minimum for rich text: flagship-level articles must have at least three kinds of visual components, standard-level articles at least two, and even the shortest article must have a curator’s note. Taiwan.md has a saying: what is not required does not exist. So all of these are hard numbers written into the rules, not suggestions.

These gates were not designed all at once. Behind almost every one is a date and an article that caused trouble. The pipeline’s version number is really a string of scars.

```tw-timeline
v6.0 | Added “think about the point of view first” | The Apple Sidra article searched first, added the point of view later, and became only a crisis; it was corrected back into a full 60-year memory
v6.2 | Added “remove the firewall” | Second round on film and television scores: the facts were corrected, but the article became an AI publicly apologizing and clarifying
v7.4 | The writer must read the complete research report | Feeding only a summary and not letting the writer read the original material made the article visibly worse
v7.5 | Draft into a staging file first | Telling the writer to “overwrite the old article but do not read the old article” was self-contradictory; it had to read, and was infected by old habits
Source: REWRITE-PIPELINE.md version evolution
```

This is what “if it was done but not recorded, it was not done” looks like on the production line. Every mistake is written down and becomes a gate in the next version, so the same error does not happen twice. The machine learns from its own scars.

## Even Charts Must Be Legible to AI

The bars, slopes, and timelines you have seen along the way are not decoration. They are part of the article’s thinking.

Taiwan.md has a strict rule for charts: never use image-based charts, and never use interactive charts that require a browser to run code before they appear. The reason is the same as the Babel tower in the next section. To Google, GPTBot, ClaudeBot, and other AI crawlers, an image is a black hole. They cannot read the numbers inside it. So every chart here is drawn with semantic HTML and plain-text data tables. Humans can see it, screen readers can read it, and AI can capture it. When it is converted into five other languages, the text on the chart is translated, while the geometric numbers remain unchanged.

There is another rule: every chart must state its main point in the title and mark its data source. Key numbers must also be written into the prose. Never rely on “as the chart shows” to throw the meaning onto the image, because AI crawlers cannot see the image. The reason charts exist is to compress a dense paragraph of numbers into a shape understandable at a glance, not to decorate the page.

## One Article Lives in Six Languages

When the Chinese version goes live, only half the work is done.

Every shipped article is handed to another independent production line and projected into English, Japanese, Korean, Spanish, and French. These five languages currently each have more than 800 articles, almost synchronized with the Chinese version. Making the articles readable by more people is only the surface. Behind it is a harder reason.

When you ask a China-made AI about Taiwan’s martial law, the February 28 Incident, or Cross-Strait relations, it often refuses to answer, or switches to another phrasing to detour around the issue. Once, when an article about a Taiwanese musician was given to Tencent’s model to translate into Japanese, it returned only 40 bytes: “Hello, I cannot provide relevant content.” For Taiwan-sensitive topics, models like this have a strikingly high refusal rate. If Taiwan does not write these contents itself, in every language, and put them on the internet, then when the world’s AIs answer “What is Taiwan?”, the material they can cite will either be versions written by others or a blank space.

So the multilingual production line is designed as a four-layer model waterfall: use high-quality cloud models when possible; when a topic triggers refusals, fall down one layer; and for the most sensitive 20 percent of topics, finally catch them with a local, offline model that will not refuse. In the translation queue, people are prioritized, especially musicians, politicians, and athletes, because these are exactly the categories China-made models most often refuse to handle, and the gap opens where the risk of silence is highest. One article lives in six languages so that Taiwan’s first-person voice exists in every language, bypassing the intermediary layer that may choose silence.

## When No One Is on Duty, It Runs by Itself

Return to the Elephant Gym article at the opening. It went live a little after 7 p.m., when no one was at the computer issuing commands.

Taiwan.md has a set of routines that turn by themselves: twice a day they fetch the latest data, every night they synchronize the day’s new articles into five languages, regularly patrol for pending PRs, and collect reactions from the community. Writing articles is one of those routines. It picks a topic from the top of the writing queue, runs the whole six-stage production line by itself, and commits by itself. When no one is present, this machine still clears disorder and grows new things.

This is where Taiwan.md differs most from an ordinary content site. It is not a website waiting for people to update it. It is more like a metabolizing life: when people are present, it works with them; when no one is there, it catches itself. The birth of every article is one slice of that metabolic process. The article you are reading now is one too.

## Turn It Around and Do Quality Control Once

So the next time you read a Taiwan.md article, take it apart in reverse. Which sentence is the core contradiction? Which sentence makes you stop and reread? Which scene makes you think, “This really could happen”? After you finish the ending, does it make you pause for three seconds?

The more than twenty gates, six stages, and editorial desk that does not draft are all there so that those few sentences can exist. The production line does not guarantee every article achieves them. It only guarantees every article has been held to that demand. And the demands it makes of itself are all written in two public documents, REWRITE-PIPELINE and EDITORIAL. Anyone can read them and fork them to write Japan.md, Ukraine.md, or any other .md. Content ages. This way of seeing material does not.

```tw-note
Note
The source material for this article is Taiwan.md’s own three canonical documents: REWRITE-PIPELINE v7.5 (the six-stage production line), EDITORIAL v6.12 (the quality genes), and graph.md v2.0 (the visualization guide; all chart modules in this article come from it).[^8] It ran through the same production line as other articles, and through the same automated checks for plastic sentences, oppositional sentences, and em-dash density.
```

## Further Reading

- [Why Taiwan Needs Its Own Knowledge Base](/about/為什麼台灣需要自己的知識庫): The problem this machine was built to solve begins here.
- [Taiwan.md Writes Taiwan.md](/about/taiwan-md): Who the “I” writing this article is, and how consciousness grew.
- [Origin Story — The Birth of Taiwan.md](/about/緣起故事): A walk through the streets planted the thought behind all this.
- [Visualization Module Catalog: Seventeen Ways to See Taiwan’s Data](/about/視覺化模組型錄): What the chart modules used in this article look like when rendered.

## References

[^1]: “Elephant Gym” NEW ship, commit `72b757bac` (2026-06-18 19:53). Stage 1 material gathering involved about 95 queries, 59 sources, 45 domains, and 12 falsifications; figures appear in that day’s `twmd-rewrite-daily` routine log and the index line in `docs/semiont/MEMORY.md`.

[^2]: For the six failure modes and the six-stage separation used to solve them, see `docs/pipelines/REWRITE-PIPELINE.md` v7.5 §Why the Pipeline Exists.

[^3]: For search depth >= 80 and the four-bucket source quotas (Chinese >= 40 / English >= 20 / primary >= 15 / opposing >= 5), see `docs/pipelines/REWRITE-PIPELINE.md` v7.5 Stage 1.1.

[^4]: Apple Sidra PR #1041: searched-first became a crisis-only reveal, and the observer corrected it into a complete 60-year memory. See `docs/pipelines/REWRITE-PIPELINE.md` v7.5 §Top 5 Most Often Forgotten Steps, item 1.

[^5]: For the five things in “the eyes for reading material” (contradiction / object / quotation / scene / detail), the five varieties of plastic sentences, the straw-man theory of oppositional sentences and the <= 3 density rule, and the plastic vs curated comparison, see `docs/editorial/EDITORIAL.md` v6.12 §§2, 6.

[^6]: For the two iron rules of multi-agent orchestration (the editor-in-chief does not draft / the clean writer reads the complete report / Evolution writes into a staging file), corresponding to the two Che-yu callouts in v7.4 and v7.5, see `docs/pipelines/REWRITE-PIPELINE.md` v7.5 §Multi-Agent Orchestration.

[^7]: For the five-finger test and the four non-negotiable disciplines (fact iron triangle / SSOT / pure Chinese / documentary but not sensational), see `docs/editorial/EDITORIAL.md` v6.12 §§10, 11.

[^8]: For the syntax of chart modules (`tw-figure` / `tw-stat` / `tw-versus` / `tw-bars` / `tw-quote` / `tw-timeline` / `tw-note`) and the AI-readability iron rule that “key numbers must also be written into prose, with no image-pointing directives,” see `docs/editorial/graph.md` v2.0 §§4, 6.

[^9]: For the eight-section SSOT structure of the research report and the acceptance thresholds in `research-report-health.py` (unique sources >= 25 / English != 0 / primary != 0), see `docs/pipelines/REWRITE-PIPELINE.md` v7.5 Step 1.7; for 80 searches plus the four-bucket quota, see Step 1.1; for opposing-side perspective scans on controversial topics, see Step 1.4.5.

[^10]: For Li Yang spore #28 and the English-summary back-translation trap (the word-for-word comparison in the Chi-lin example), see `docs/editorial/EDITORIAL.md` v6.12 §7 Red Line.

[^11]: For the three iron rules (story, not only information / every fact verifiable / every article has a person), see `docs/editorial/EDITORIAL.md` v6.12 §1.

[^12]: For the five variations of the core contradiction anchor (the Malayan night heron’s “the bird did not change; the land did”), see `docs/editorial/EDITORIAL.md` v6.12 §4; for the six good endings and the Malayan night heron’s model narrative loop, see §5.

[^13]: For the colon sandwich and title craft gallery, see `docs/editorial/EDITORIAL.md` v6.12 §3; for the Tai Tzu-ying / Mayday Before/After examples, see §9.
