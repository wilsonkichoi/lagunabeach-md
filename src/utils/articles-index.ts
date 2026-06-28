/**
 * articles-index.ts — Module-level shared frontmatter cache for all [slug].astro
 *
 * Why: 6 [slug].astro pages (zh + en + ja + ko + es + fr) each page render
 * repeats "relatedArticles same-category scan + allArticles cross-category scan" =
 * readdir + readFile + matter() loop. Each article x N same-cat + N x 14 cross-cat = O(N^2)
 * duplicated work. 6950 article pages x this loop = major build-time hot path.
 *
 * This module builds the entire lang's article index on first call at module level;
 * all subsequent [slug].astro page renders share the same in-memory Map. Entire build
 * process only does readdir once + readFile once + matter once per file.
 */

import { readdir, readFile } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';
import matter from 'gray-matter';

export interface ArticleSummary {
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string; // category slug (lowercase)
  readingTime?: number; // frontmatter readingTime (minutes)
  tags?: string[]; // frontmatter tags
  footnotes?: number; // count of [^n]: footnote definitions (citation-depth signal)
}

const CATEGORY_MAPPING: Record<string, string> = {
  about: 'About',
  history: 'History',
  geography: 'Geography',
  culture: 'Culture',
  food: 'Food',
  art: 'Art',
  music: 'Music',
  technology: 'Technology',
  nature: 'Nature',
  people: 'People',
  society: 'Society',
  economy: 'Economy',
  lifestyle: 'Lifestyle',
  politics: 'Politics',
};

function safeMatter(fileContent: string): {
  data: Record<string, any>;
  content: string;
} {
  try {
    return matter(fileContent) as any;
  } catch {
    const stripped = fileContent.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
    return { data: {}, content: stripped };
  }
}

// Per-lang cache. 'zh-TW' reads knowledge/{Cat}/, others read knowledge/{lang}/{Cat}/
const _cache = new Map<string, Promise<Map<string, ArticleSummary[]>>>();

async function buildIndex(
  lang: string,
): Promise<Map<string, ArticleSummary[]>> {
  const result = new Map<string, ArticleSummary[]>();
  for (const [catSlug, folderName] of Object.entries(CATEGORY_MAPPING)) {
    const folderPath =
      lang === 'zh-TW'
        ? resolve(process.cwd(), 'knowledge', folderName)
        : resolve(process.cwd(), 'knowledge', lang, folderName);
    try {
      const files = await readdir(folderPath);
      const articles: ArticleSummary[] = [];
      for (const file of files) {
        if (!file.endsWith('.md') || file.startsWith('_')) continue;
        const articleSlug = basename(file, '.md');
        const filePath = join(folderPath, file);
        try {
          const fileContent = await readFile(filePath, 'utf-8');
          const { data: fm } = safeMatter(fileContent);
          // Footnote definitions ([^n]:) — citation-depth signal, same count
          // explore.template uses for its featured deep-dive cards.
          const footnotes = (fileContent.match(/^\[\^\d+\]:/gm) || []).length;
          articles.push({
            title: fm.title || articleSlug,
            slug: articleSlug,
            description: fm.description || '',
            image: fm.image || '',
            category: catSlug,
            readingTime:
              typeof fm.readingTime === 'number' ? fm.readingTime : undefined,
            tags: Array.isArray(fm.tags) ? fm.tags : undefined,
            footnotes,
          });
        } catch {
          // unreadable file — skip silently
        }
      }
      result.set(catSlug, articles);
    } catch {
      // missing category folder for this lang — skip
    }
  }
  return result;
}

/**
 * Get articles index for a language (zh-TW / en / ja / ko / es / fr).
 * First call: builds the index by reading all knowledge files; subsequent
 * calls within the same process return the cached Map.
 */
export function getArticlesIndex(
  lang: string,
): Promise<Map<string, ArticleSummary[]>> {
  let entry = _cache.get(lang);
  if (!entry) {
    entry = buildIndex(lang);
    _cache.set(lang, entry);
  }
  return entry;
}

/* ───────────────────────────────────────────────────────────────────────────
 * Semantic related articles (RAG Phase 1, 2026-06-14)
 *
 * src/data/related/{lang}.json maps `${cat}/${slug}` → up to 5 nearest-neighbour
 * `${cat}/${slug}` strings, pre-computed offline from bge-m3 embeddings on the
 * GPU fleet (scripts/core/build-embeddings.mjs → slimmed to slug-only). The
 * reader gets cross-topic semantic neighbours instead of same-category proximity,
 * with ZERO browser model: the links are baked into the article HTML at build.
 *
 * Graceful degrade: if the file is absent (CI build without a fleet rebuild) or
 * the article isn't in the map, getRelatedArticles falls back to the original
 * same-category behaviour.
 * ──────────────────────────────────────────────────────────────────────────*/

const _semanticRelated = new Map<string, Promise<Record<string, string[]>>>();
function loadSemanticRelated(lang: string): Promise<Record<string, string[]>> {
  let entry = _semanticRelated.get(lang);
  if (!entry) {
    entry = readFile(
      resolve(process.cwd(), 'src/data/related', `${lang}.json`),
      'utf-8',
    )
      .then((raw) => {
        try {
          return JSON.parse(raw) as Record<string, string[]>;
        } catch {
          return {};
        }
      })
      .catch(() => ({})); // no semantic index → category fallback
    _semanticRelated.set(lang, entry);
  }
  return entry;
}

// Flat `${cat}/${slug}` → ArticleSummary lookup, memoised per lang. Lets the
// semantic neighbour slugs resolve back to full summaries for the card render.
const _bySlug = new Map<string, Promise<Map<string, ArticleSummary>>>();
function getBySlugIndex(lang: string): Promise<Map<string, ArticleSummary>> {
  let entry = _bySlug.get(lang);
  if (!entry) {
    entry = getArticlesIndex(lang).then((index) => {
      const flat = new Map<string, ArticleSummary>();
      for (const [cat, articles] of index) {
        for (const a of articles) flat.set(`${cat}/${a.slug}`, a);
      }
      return flat;
    });
    _bySlug.set(lang, entry);
  }
  return entry;
}

/**
 * Related articles for the article-page footer. Prefers semantic neighbours
 * (cross-category, meaning-based) from the pre-computed index; falls back to
 * same-category proximity when the semantic index is absent or the article is
 * not indexed. Return shape is unchanged (ArticleSummary[]) so callers and the
 * shared ArticleCard (premium) need no changes.
 */
export async function getRelatedArticles(
  lang: string,
  category: string,
  excludeSlug: string,
  limit = 3,
): Promise<ArticleSummary[]> {
  const index = await getArticlesIndex(lang);

  // Semantic first.
  const semantic = await loadSemanticRelated(lang);
  const neighbours = semantic[`${category}/${excludeSlug}`];
  if (neighbours && neighbours.length) {
    const bySlug = await getBySlugIndex(lang);
    const out: ArticleSummary[] = [];
    for (const key of neighbours) {
      const art = bySlug.get(key);
      if (art && art.slug !== excludeSlug) out.push(art);
      if (out.length >= limit) break;
    }
    if (out.length) return out;
  }

  // Fallback: same-category proximity (original behaviour).
  const inCategory = index.get(category) ?? [];
  return inCategory.filter((a) => a.slug !== excludeSlug).slice(0, limit);
}

/**
 * Convenience: all articles across all categories (for "explore more" widgets).
 */
export async function getAllArticles(
  lang: string,
  excludeCategory?: string,
): Promise<ArticleSummary[]> {
  const index = await getArticlesIndex(lang);
  const out: ArticleSummary[] = [];
  for (const [cat, articles] of index) {
    if (cat === excludeCategory) continue;
    for (const a of articles) out.push(a);
  }
  return out;
}

/* ───────────────────────────────────────────────────────────────────────────
 * Latest articles (chronological axis) — joins the article index with
 * content-dates.json (git last-content-change times) so "latest" reflects when
 * an article was actually shipped, not a hand-set frontmatter date. Used by the
 * /latest page, the /explore section, the homepage strip, and (via
 * /api/latest.json) the client-side article-page rail.
 * ──────────────────────────────────────────────────────────────────────────*/

export interface DatedArticle extends ArticleSummary {
  date: string; // ISO 8601 git-ship timestamp
}

let _contentDates: Promise<Record<string, string>> | null = null;
function loadContentDates(): Promise<Record<string, string>> {
  if (!_contentDates) {
    _contentDates = readFile(
      resolve(process.cwd(), 'src/data/content-dates.json'),
      'utf-8',
    )
      .then((raw) => {
        try {
          return (JSON.parse(raw).dates as Record<string, string>) ?? {};
        } catch {
          return {};
        }
      })
      .catch(() => ({}));
  }
  return _contentDates;
}

// URL key aligned with content-dates.json: zh-TW → `/${cat}/${slug}/`,
// other langs → `/${lang}/${cat}/${slug}/` (raw, not percent-encoded).
function latestUrlKey(lang: string, cat: string, slug: string): string {
  return lang === 'zh-TW' ? `/${cat}/${slug}/` : `/${lang}/${cat}/${slug}/`;
}

/**
 * Latest articles across all categories for a language, newest-first by git
 * ship time. Articles without a content-dates entry, plus the `about` meta
 * folder, are excluded. `excludeSlug` drops the current article (for the rail).
 */
export async function getLatestArticles(
  lang: string,
  limit = 12,
  excludeSlug?: string,
): Promise<DatedArticle[]> {
  const [all, dates] = await Promise.all([
    getAllArticles(lang),
    loadContentDates(),
  ]);
  const out: DatedArticle[] = [];
  for (const a of all) {
    if (a.category === 'about') continue;
    if (excludeSlug && a.slug === excludeSlug) continue;
    const date = dates[latestUrlKey(lang, a.category, a.slug)] ?? '';
    if (!date) continue;
    out.push({ ...a, date });
  }
  // Newest first by epoch — robust even if content-dates mixes timezone
  // formats (lexicographic compare breaks on Z vs +08:00). Stable sort keeps
  // same-second batch entries in index order.
  out.sort((x, y) => Date.parse(y.date) - Date.parse(x.date));
  return out.slice(0, limit);
}
