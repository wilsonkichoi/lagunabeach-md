/**
 * build-related-tagoverlap.mjs — deterministic related-articles via tag overlap + wiki-link bonus.
 * Outputs same shape as build-embeddings.mjs slim related: { "slug": ["slug", ...] }
 * Usage: node scripts/core/build-related-tagoverlap.mjs [--out src/data/related-tagoverlap]
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';
import matter from 'gray-matter';

const CATEGORY_MAP = {
  about: 'About',
  'art-galleries': 'Art & Galleries',
  beaches: 'Beaches',
  'events-festivals': 'Events & Festivals',
  food: 'Food',
  history: 'History',
  'nature-marine-life': 'Nature & Marine Life',
  neighborhoods: 'Neighborhoods',
  trails: 'Trails',
};
const TOP_K = 8;
const WIKI_LINK_BONUS = 2;

const args = process.argv.slice(2);
const outDir = resolve(
  process.cwd(),
  args[args.indexOf('--out') + 1] || 'src/data/related',
);

async function scanArticles() {
  const docs = [];
  for (const [slug, folder] of Object.entries(CATEGORY_MAP)) {
    const dir = resolve(process.cwd(), 'knowledge', folder);
    let files;
    try {
      files = (await readdir(dir)).filter(
        (f) => f.endsWith('.md') && !f.startsWith('_'),
      );
    } catch {
      continue;
    }
    for (const file of files) {
      const raw = await readFile(join(dir, file), 'utf-8');
      const { data, content } = matter(raw);
      const name = basename(file, '.md');
      const wikiLinks = [...content.matchAll(/\[\[([^\]|]+)/g)].map(
        (m) => m[1],
      );
      docs.push({
        slug: `${slug}/${name}`,
        tags: (data.tags || []).map((t) => t.toLowerCase()),
        wikiLinks,
      });
    }
  }
  return docs;
}

function score(a, b) {
  let s = 0;
  const bTags = new Set(b.tags);
  for (const t of a.tags) {
    if (bTags.has(t)) s++;
  }
  const bName = b.slug.split('/')[1];
  if (a.wikiLinks.includes(bName)) s += WIKI_LINK_BONUS;
  const aName = a.slug.split('/')[1];
  if (b.wikiLinks.includes(aName)) s += WIKI_LINK_BONUS;
  return s;
}

const docs = await scanArticles();
const related = {};
for (const doc of docs) {
  const scores = docs
    .filter((d) => d.slug !== doc.slug)
    .map((d) => ({ slug: d.slug, s: score(doc, d) }))
    .filter((d) => d.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, TOP_K);
  related[doc.slug] = scores.map((d) => d.slug);
}

await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, 'en.json'), JSON.stringify(related, null, 2));
console.log(
  `✅ tag-overlap: ${Object.keys(related).length} articles → ${outDir}/en.json`,
);
