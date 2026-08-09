---
# The chat contexts for LagunaBeach.md: the physical places this knowledge base puts
# a QR code, and how `/chat?ctx=<slug>` greets a reader who scans one.
#
# The leading `_` in this filename is load-bearing. It is what makes the file
# invisible to the three scanners that walk `knowledge/` looking for articles
# (scripts/core/test-frontmatter.mjs, scripts/tools/article-health.py, and
# scripts/core/build-content-dates.mjs). Rename it without the prefix and the
# article pipeline starts treating this list of greetings as an article with no
# title, description, or category.
#
# A context requires `slug`, `label`, `greeting`. A context also accepts optional
# `hint`, `article`:
#
#   slug     - required, the `ctx` query value. Lowercase letters, digits, and single
#              hyphens only: it gets printed inside a URL, so it may not be a string
#              that needs percent-encoding.
#   label    - required, the place's name as it reads on the printed card.
#   greeting - required, the opening message. Write it for somebody standing there
#              holding a phone, not for a reader at a desk.
#   hint     - optional, a short phrase that biases RETRIEVAL toward this location.
#              It is appended to the embedded text of the reader's first question and
#              is never shown to the model as an instruction, so a hint can steer
#              which articles are found and cannot talk the answer into anything.
#              Capped at 200 characters, the longest the chat worker accepts.
#   article  - optional, a site-root-absolute route this build produces. It renders as
#              a link under the greeting. A route that does not resolve drops the whole
#              context with a build-time warning.
#
# Contexts are dropped one at a time, never as a set: a duplicate slug, a missing
# required field, an unusable slug, and an unresolvable `article` each take out that
# one entry with a named warning and leave every other code working.
#
# Five placements, chosen because each is a spot where somebody is already standing
# still and looking at something they cannot identify. Every one has an article
# behind it; a context pointing at a subject this knowledge base has not documented
# would greet a reader and then have nothing to say.

contexts:
  - slug: heisler-park
    label: Heisler Park Tide Pools
    greeting: >-
      You are above the Heisler Park tide pools. Ask what lives down there, when the
      tide is low enough to walk out, or what the Marine Protected Area rules mean
      for what you can touch.
    hint: Heisler Park tide pools, intertidal species, and Marine Protected Area rules
    article: /nature-marine-life/tide-pools

  - slug: victoria-beach
    label: Victoria Beach
    greeting: >-
      You are at Victoria Beach. Ask about the stone tower on the sand, the reef and
      tide pools south of it, or how the beach changes with the tide.
    hint: Victoria Beach, its 1926 stone tower, the reef and the sea cave
    article: /beaches/victoria-beach

  - slug: thousand-steps
    label: Thousand Steps Beach
    greeting: >-
      You are at the top of the Thousand Steps stairway. Ask how many steps there
      actually are, what the surf does off the south end, or what you will find in
      the tide pools at the bottom.
    hint: Thousand Steps Beach, the staircase, the reef break and the tide pools
    article: /beaches/thousand-steps-beach

  - slug: top-of-the-world
    label: Top of the World Overlook
    greeting: >-
      You are at Top of the World. Ask what you are looking at out there, which
      trails drop off this ridge, or when the air is clear enough to see Catalina.
    hint: Top of the World overlook, the view, and the trails leaving the ridge
    article: /trails/top-of-the-world

  - slug: festival-grounds
    label: Festival of Arts Grounds
    greeting: >-
      You are at the Festival of Arts grounds. Ask how the Pageant of the Masters
      turns people into paintings, how it started, or what else is running across
      the canyon this summer.
    hint: Pageant of the Masters, the Irvine Bowl, and the summer festivals in Laguna Canyon
    article: /events-festivals/pageant-of-the-masters
---

# Chat contexts

Five places, five codes. `npm run qr:sheet` turns this list into a printable sheet:
one card per context, each carrying the code that opens `/chat?ctx=<slug>`, the
place's name, and the URL in plain text for anyone who would rather type it.

The point of a context is that somebody standing at the Victoria Beach tower has no
app, no account, and no reason to search. A code on the sign is the whole onboarding,
and the greeting is what tells them the thing they just opened knows where they are.

Keep the list short. Every context is a physical sign somebody has to print, mount,
and eventually take down, and a slug that outlives its sign is a code that quietly
falls back to the ordinary chat page — which is the intended failure, not a bug.
