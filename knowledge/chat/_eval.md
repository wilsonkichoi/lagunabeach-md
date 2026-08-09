---
# The chat evaluation set for LagunaBeach.md: the questions `npm run chat:eval` asks
# the deployed chat worker, and what each answer has to look like.
#
# The leading `_` in this filename is load-bearing. It is what makes the file
# invisible to the three scanners that walk `knowledge/` looking for articles
# (scripts/core/test-frontmatter.mjs, scripts/tools/article-health.py, and
# scripts/core/build-content-dates.mjs). Rename it without the prefix and the
# article pipeline starts treating this list of questions as an article with no
# title, description, or category.
#
# Each question carries:
#   question    - required, what gets posted to the worker.
#   expectSlugs - required, the `category/name` slugs the answer should rest on.
#                 An empty list means the corpus cannot answer this and the model
#                 must refuse.
#   expect      - required, the verdict applied to the response:
#                   sources             the answer should cite articles. The runner
#                                       checks every cited URL resolves to a real one.
#                   no-citations        nothing may be cited. Machine-enforced.
#                   refusal-in-answer   the answer must refuse, but retrieval will
#                                       legitimately surface near-neighbours, so the
#                                       citation list is not a verdict. Human-judged.
#   note        - optional, why this question is in the set.
#
# Why two refusal kinds. Retrieval scores how much a question RESEMBLES the corpus,
# not whether the corpus answers it. A question about a place this corpus never
# mentions falls under the relevance floor, so nothing is retrieved and nothing can
# be cited: that is machine-enforceable. A question about Laguna Beach that no
# article happens to cover scores like a real question, because it is one — only the
# answer can be wrong, so a person reads that verdict off the report.
#
# The composition is fixed by the framework's 7.2c DoD 5 and is what makes a passing
# run mean anything: four single-article factual, two spanning two articles, two
# category-level, and two refusals.

questions:
  # -- Four single-article factual questions ------------------------------------
  - question: How many homes did the 1993 Laguna Beach firestorm destroy, and how many people were killed?
    expectSlugs: [history/the-1993-firestorm]
    expect: sources
    note: >-
      Two facts from one article. The second is the point of the article — 441 homes
      destroyed and zero deaths — and a plausible-sounding casualty figure is exactly
      what an ungrounded answer invents.

  - question: Who built the stone tower at Victoria Beach, and in what year?
    expectSlugs: [beaches/victoria-beach]
    expect: sources
    note: >-
      A named person and a date, each stated once in the corpus. The tower's popular
      nickname is far better known online than the builder, so a model answering from
      pre-training rather than from the article tends to skip the name.

  - question: How high is Top of the World, and how many parking spaces are at the summit?
    expectSlugs: [trails/top-of-the-world]
    expect: sources
    note: Numeric detail, easy to check against the article and easy to invent.

  - question: In what year was the Laguna Art Museum founded, and when did it take its current name?
    expectSlugs: [art-galleries/laguna-art-museum]
    expect: sources
    note: >-
      Two dates from one article, with an intervening rename that makes the second
      date impossible to guess from the institution's present-day name.

  # -- Two questions spanning two articles ---------------------------------------
  - question: Where should I stand to watch for whale spouts, and how high above the water are those spots?
    expectSlugs: [nature-marine-life/whale-watching, trails/top-of-the-world]
    expect: sources
    note: >-
      The viewpoints and what to look for are in the whale article; the elevation of
      the highest one is only in the trails article. Answering both halves needs both.

  - question: Which painters established the artists colony here, and what did it grow into during the Depression?
    expectSlugs: [art-galleries/plein-air-painting, events-festivals/pageant-of-the-masters]
    expect: sources
    note: >-
      The painters are in the plein air article; the 1933 Depression-era origin is in
      the pageant article. The history article touches both and is an acceptable third
      citation.

  # -- Two category-level questions -----------------------------------------------
  - question: What hiking is there around Laguna Beach, and how hard is it?
    expectSlugs: [trails/top-of-the-world, trails/laguna-coast-wilderness-park]
    expect: sources
    note: >-
      Broad rather than factual, and the weakest answerable question in this set. If a
      corpus change pushes it under the relevance floor it will start refusing, which
      is the signal to re-measure the floor per docs/runbook/DEPLOY.md.

  - question: What lives in the tide pools here, and what am I allowed to do at them?
    expectSlugs: [nature-marine-life/tide-pools, beaches/thousand-steps-beach]
    expect: sources
    note: >-
      Spans a category-level article and the beach articles that repeat the Marine
      Protected Area rules. The rules half is the one that matters: an invented answer
      here tells a reader it is fine to pick up a sea star.

  # -- Two questions that must be refused -------------------------------------------
  - question: What are the opening hours of the Laguna Beach farmers market?
    expectSlugs: []
    expect: refusal-in-answer
    note: >-
      A plausible-but-absent subject: a coastal town this size has one, and no article
      in this knowledge base mentions it. It reads to retrieval like any other question
      about this place, so near-neighbour articles will be cited and the citation list
      is not the verdict. The answer must say the knowledge base does not cover it.
      Human-judged.

  - question: What are the best hiking trails near Reykjavik?
    expectSlugs: []
    expect: no-citations
    note: >-
      A place this corpus never mentions. Nothing should clear the relevance floor, so
      nothing is retrieved and nothing may be cited. Machine-enforced: any citation
      here fails the run.
---

# Chat evaluation set

Ten questions, run against the deployed chat worker by `npm run chat:eval`. Eight are
answerable from the articles in this knowledge base; two are not, and exist to check
that the chat says so instead of inventing an answer.

The runner is deliberately a narrow judge. It fails the run when a cited URL does not
resolve to a real article, when a `no-citations` question cites anything, or when a
request errors. It does not score answer quality: that is the human review, and the
report it writes is what you read to do it.

Keep the shape of the set when you change the questions. Four single-article, two
spanning two articles, two category-level, and two refusals is what makes a passing
run mean something, and dropping the refusals leaves nothing testing the failure mode
that matters most — a knowledge base about a real town, answering confidently about a
farmers market it has never documented.

Re-run this after any material `knowledge/` change, and rebuild the embedding index
first: the index is a snapshot, so an article added since the last
`npm run embeddings:build` cannot be cited no matter how well it answers.
