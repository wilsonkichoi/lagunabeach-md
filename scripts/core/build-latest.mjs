/**
 * build-latest.mjs — generate public/api/latest.json (時序主軸 client data)
 *
 * Why: the article-page "站上最新" rail is rendered CLIENT-SIDE (so the static
 * HTML of every article page never changes when a new article ships — avoids
 * crawl churn + the lastmod=now freshness anti-pattern killed in c1403e259).
 * The client can't read src/data/content-dates.json (not under public/), so we
 * emit a small per-language latest list here.
 *
 * Source of truth: knowledge/ frontmatter (title/description/readingTime) joined
 * with src/data/content-dates.json (git last-content-change time → accurate
 * "shipped" ordering, NOT hand-set frontmatter dates). Mirrors
 * src/utils/articles-index.ts getLatestArticles().
 *
 * Runs in the prebuild chain AFTER content-dates.json is generated; refresh-data
 * regenerates it via `npm run prebuild` (REFLEXES #43). Non-fatal on error.
 *
 * Design: reports/latest-articles-discoverability-design-2026-06-09.md §4 / WS1.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const LANGS = ['zh-TW', 'en', 'ja', 'ko', 'fr', 'es'];
const PER_LANG = 30;

// category slug (lowercase, matches URL + content-dates key) → knowledge/ folder
const CATEGORIES = {
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

// content-dates.json key: zh-TW → `/${cat}/${slug}/`, else `/${lang}/${cat}/${slug}/`
function urlKey(lang, cat, slug) {
  return lang === 'zh-TW' ? `/${cat}/${slug}/` : `/${lang}/${cat}/${slug}/`;
}
// reader-facing href (percent-encoded slug)
function href(lang, cat, slug) {
  const enc = encodeURIComponent(slug);
  return lang === 'zh-TW' ? `/${cat}/${enc}` : `/${lang}/${cat}/${enc}`;
}

async function main() {
  let dates = {};
  try {
    const raw = await readFile(
      resolve(ROOT, 'src/data/content-dates.json'),
      'utf-8',
    );
    dates = JSON.parse(raw).dates ?? {};
  } catch {
    // content-dates not built yet — emit empty buckets, never break the build
  }

  const byLang = {};
  for (const lang of LANGS) {
    const items = [];
    for (const [catSlug, folder] of Object.entries(CATEGORIES)) {
      const dir =
        lang === 'zh-TW'
          ? resolve(ROOT, 'knowledge', folder)
          : resolve(ROOT, 'knowledge', lang, folder);
      let files;
      try {
        files = await readdir(dir);
      } catch {
        continue; // missing category folder for this lang
      }
      for (const f of files) {
        if (!f.endsWith('.md') || f.startsWith('_')) continue;
        const slug = basename(f, '.md');
        const date = dates[urlKey(lang, catSlug, slug)];
        if (!date) continue; // no git date → skip (matches getLatestArticles)
        let fm = {};
        try {
          fm = matter(await readFile(join(dir, f), 'utf-8')).data ?? {};
        } catch {
          /* unreadable frontmatter — fall back to slug title */
        }
        items.push({
          title: fm.title || slug,
          desc: fm.description || '',
          category: catSlug,
          href: href(lang, catSlug, slug),
          date,
          readingTime: fm.readingTime || null,
        });
      }
    }
    items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    byLang[lang] = items.slice(0, PER_LANG);
  }

  const out = {
    _generated: new Date().toISOString(),
    perLang: PER_LANG,
    byLang,
  };
  await mkdir(resolve(ROOT, 'public/api'), { recursive: true });
  await writeFile(resolve(ROOT, 'public/api/latest.json'), JSON.stringify(out));
  const total = Object.values(byLang).reduce((s, a) => s + a.length, 0);
  console.log(
    `✓ latest.json: ${total} entries across ${LANGS.length} langs (top ${PER_LANG}/lang)`,
  );
}

main().catch((e) => {
  console.error('build-latest.mjs failed (non-fatal):', e.message);
});
