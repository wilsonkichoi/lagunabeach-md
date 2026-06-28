# 🌐 Translation Board — translation task board

> **Use your AI subscription to help tell Laguna Beach's story.** Each translation takes roughly 5–10 minutes + your AI (Claude/ChatGPT/Gemini).

---

## How LagunaBeach.md translation works

LagunaBeach.md's source of truth is **English** (`knowledge/{Category}/`). Translations go the other direction from Taiwan.md: English is canonical, and Traditional Chinese (`zh-TW`) is the translation target.

**Current status:** `zh-TW` is wired into the architecture but **dormant** — it has no public routes yet (see [LANGUAGE-STATUS.md](LANGUAGE-STATUS.md)). Translation PRs are accepted and stored as data; they go live when the language is activated.

## How do you translate an article?

### The simplest way (3 steps)

1. **Pick one** — choose an English article from `knowledge/` that interests you
2. **Hand it to your AI** — paste [TRANSLATE_PROMPT.md](../prompts/TRANSLATE_PROMPT.md) to your AI and tell it which article to translate
3. **Open a PR** — put the translated `.md` in the matching language folder and open a PR

### Path rules

| Language            | Folder                        | Example                                      |
| ------------------- | ----------------------------- | -------------------------------------------- |
| English (SSOT)      | `knowledge/{Category}/`       | `knowledge/Trails/top-of-the-world.md`       |
| Traditional Chinese | `knowledge/zh-TW/{Category}/` | `knowledge/zh-TW/Trails/top-of-the-world.md` |

### Quality requirements

- ❌ Not a word-for-word translation — **rewrite** in the target language
- ✅ Reads naturally to a native speaker
- ✅ Laguna Beach place names and proper nouns stay in English with a brief gloss (e.g. Top of the World, Pageant of the Masters)
- ✅ Keep the frontmatter format consistent (add `translatedFrom`)

Detailed style guide: [TRANSLATE_PROMPT.md](../prompts/TRANSLATE_PROMPT.md)

---

## 📊 Translation progress

| Language              | Coverage | Most-needed               |
| --------------------- | -------- | ------------------------- |
| 🇺🇸 English (SSOT)     | 100%     | — (canonical)             |
| 🇹🇼 繁體中文 (`zh-TW`) | 0%       | all categories (none yet) |

---

## 📋 To-translate list (by category)

All 18 English articles need a `zh-TW` translation — none exist yet. Article counts by category:

| Category             | EN articles | zh-TW done |
| -------------------- | ----------- | ---------- |
| History              | 2           | 0          |
| Art & Galleries      | 2           | 0          |
| Nature & Marine Life | 2           | 0          |
| Food                 | 1           | 0          |
| Beaches              | 2           | 0          |
| Trails               | 2           | 0          |
| Events & Festivals   | 2           | 0          |
| Neighborhoods        | 2           | 0          |

> 💡 **To claim one:** open a PR directly, or comment in [Discussions](https://github.com/wilsonkichoi/lagunabeach-md/discussions) saying which article you want to translate. Browse `knowledge/` for the current article list.

---

## 🤝 How to submit (PR first)

### 🥇 GitHub PR (recommended — zero manual handling)

1. On GitHub, click `Add file` → `Create new file`
2. Path: `knowledge/zh-TW/{Category}/{slug}.md`
3. Paste the translated content
4. Commit message: `translate(zh-TW): Top of the World`
5. Choose `Create a new branch and start a pull request`
6. In the PR description, note: which AI you used + whether you're a native speaker
7. **Review is triggered → Merge** 🎉

### 🥈 GitHub Issue (works without Git)

1. [Open a new Issue](https://github.com/wilsonkichoi/lagunabeach-md/issues/new)
2. Title: `translate(zh-TW): top-of-the-world`
3. Body: paste the complete `.md` file
4. The maintainer will convert it into a PR

---

## 💡 Token-donation concept

If you have an AI subscription (Claude Pro / ChatGPT Plus / Gemini Advanced), the tokens you don't use each month can translate Laguna Beach articles.

This isn't crowdsourced translation — it's **distributed compute**:

- Your AI subscription = one compute node
- TRANSLATE_PROMPT.md = the protocol
- PR = the output
- A native-speaker reviewer = the consensus mechanism

**One person can't translate everything, but a hundred people each doing one article is a hundred articles.**

---

_Last updated: 2026-06-28_
