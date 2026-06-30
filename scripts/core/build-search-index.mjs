/**
 * Build-time search index generator.
 *
 * Reads all markdown articles from knowledge/, tokenizes title/description/tags
 * with CJK bigrams + Latin words, builds serialized MiniSearch indexes.
 *
 * Output (2026-06-13 RAG Phase 0 — per-lang shards):
 *   public/api/search-minisearch-{lang}.json   per language (client fetches its
 *     own shard by <html lang> — fixes ja/ko/es/fr readers getting zero native
 *     results, see reports/research/2026-06/rag-design-research-2026-06-13.md Phase 0)
 *   public/api/search-minisearch.json          legacy combined default+en
 *     (back-compat: deployed/cached pages with old client still fetch this URL)
 *
 * Language list read from src/config/languages.mjs SSOT (REFLEXES #20
 * architecture-as-data: zero changes needed here when a new language is born).
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';
import matter from 'gray-matter';
import MiniSearch from 'minisearch';
import {
  ENABLED_LANGUAGE_CODES,
  DEFAULT_LANGUAGE,
} from '../../src/config/languages.mjs';

const CATEGORY_MAP = {
  history: 'History',
  'art-galleries': 'Art & Galleries',
  'nature-marine-life': 'Nature & Marine Life',
  food: 'Food',
  beaches: 'Beaches',
  trails: 'Trails',
  'events-festivals': 'Events & Festivals',
  neighborhoods: 'Neighborhoods',
};

// ── CJK bigram tokenizer ──

const isCJK = (cp) =>
  (cp >= 0x4e00 && cp <= 0x9fff) ||
  (cp >= 0x3400 && cp <= 0x4dbf) ||
  (cp >= 0xf900 && cp <= 0xfaff) ||
  (cp >= 0x3100 && cp <= 0x312f) ||
  // 2026-06-13 Phase 0: ja kana + ko hangul also use bigram (previously only
  // CJK ideographs — ja/ko shard native queries couldn't hit, ko shard 421KB vs 1.2MB+ exposed the gap)
  (cp >= 0x3040 && cp <= 0x30ff) || // Hiragana + Katakana
  (cp >= 0x31f0 && cp <= 0x31ff) || // Katakana phonetic extensions
  (cp >= 0xac00 && cp <= 0xd7a3); // Hangul syllables

const LATIN_RE = /[a-z0-9][a-z0-9-]*[a-z0-9]|[a-z0-9]/g;

function bigramTokenize(text) {
  if (!text) return '';
  const normalized = text.toLowerCase().normalize('NFKC');
  const tokens = [];

  // Latin words (2+ chars)
  for (const m of normalized.matchAll(LATIN_RE)) {
    if (m[0].length >= 2) tokens.push(m[0]);
  }

  // CJK bigrams (ja kanji/kana mix and ko hangul use NFKC then Latin/CJK dual path;
  // when kana/hangul fall outside isCJK range, MiniSearch prefix match catches
  // romanized queries; CJK ideograph bigrams of native titles remain the primary recall path)
  const chars = [...normalized];
  for (let i = 0; i < chars.length - 1; i++) {
    const cp1 = chars[i].codePointAt(0);
    const cp2 = chars[i + 1].codePointAt(0);
    if (isCJK(cp1) && isCJK(cp2)) {
      tokens.push(chars[i] + chars[i + 1]);
    }
  }

  return tokens.join(' ');
}

// ── Scan one language's articles ──

async function scanLang(lang, startId) {
  const docs = [];
  let id = startId;
  const isDefault = lang === DEFAULT_LANGUAGE.code;

  for (const [slug, folder] of Object.entries(CATEGORY_MAP)) {
    const dirPath = isDefault
      ? resolve(process.cwd(), 'knowledge', folder)
      : resolve(process.cwd(), 'knowledge', lang, folder);
    try {
      const files = (await readdir(dirPath)).filter(
        (f) => f.endsWith('.md') && !f.startsWith('_'),
      );
      for (const file of files) {
        try {
          const { data } = matter(await readFile(join(dirPath, file), 'utf-8'));
          const name = basename(file, '.md');
          const title = data.title || name;
          const description = data.description || '';
          const tags = Array.isArray(data.tags)
            ? data.tags
            : data.tags
              ? [data.tags]
              : [];
          docs.push({
            id: id++,
            t: title,
            d: description,
            u: isDefault ? `/${slug}/${name}` : `/${lang}/${slug}/${name}`,
            tags,
            lang,
            title_bigram: bigramTokenize(title),
            desc_bigram: bigramTokenize(description),
            tags_bigram: bigramTokenize(tags.join(' ')),
          });
        } catch {
          console.warn(`[search] skipped ${lang}/${file}: YAML parse error`);
        }
      }
    } catch (err) {
      if (err.code !== 'ENOENT')
        console.warn(`[search] error reading ${dirPath}:`, err.message);
    }
  }

  return docs;
}

// ── Build one serialized MiniSearch index from docs ──

function buildIndex(docs) {
  const miniSearch = new MiniSearch({
    idField: 'id',
    fields: ['title_bigram', 'desc_bigram', 'tags_bigram'],
    storeFields: ['t', 'd', 'u', 'tags', 'lang'],
    tokenize: (text) => text.split(/\s+/).filter(Boolean),
    searchOptions: {
      boost: { title_bigram: 6, tags_bigram: 4, desc_bigram: 2 },
      prefix: true,
    },
  });
  miniSearch.addAll(docs);
  return JSON.stringify(miniSearch);
}

// ── Main ──

const apiDir = resolve(process.cwd(), 'public', 'api');
await mkdir(apiDir, { recursive: true });

const docsByLang = new Map();
let nextId = 0;
for (const lang of ENABLED_LANGUAGE_CODES) {
  const docs = await scanLang(lang, nextId);
  nextId += docs.length;
  docsByLang.set(lang, docs);
}

// Per-lang shards ×6
for (const [lang, docs] of docsByLang) {
  const serialized = buildIndex(docs);
  await writeFile(
    join(apiDir, `search-minisearch-${lang}.json`),
    serialized,
    'utf-8',
  );
  console.log(
    `[search] shard ${lang}: ${docs.length} docs, ${(serialized.length / 1024).toFixed(0)} KB → search-minisearch-${lang}.json`,
  );
}

// Legacy combined default+en (back-compat: old client / cached HTML still fetches this URL)
// Use Set to avoid duplicate IDs when DEFAULT_LANGUAGE.code === 'en'
const legacyLangs = new Set([DEFAULT_LANGUAGE.code, 'en']);
const legacyDocs = [...legacyLangs].flatMap(
  (lang) => docsByLang.get(lang) || [],
);
const legacySerialized = buildIndex(legacyDocs);
await writeFile(
  join(apiDir, 'search-minisearch.json'),
  legacySerialized,
  'utf-8',
);
console.log(
  `[search] legacy combined zh+en: ${legacyDocs.length} docs, ${(legacySerialized.length / 1024).toFixed(0)} KB → search-minisearch.json`,
);

// Plain-array fallback for Layout.astro's indexOf path (used only when
// MiniSearch fails to load). 2026-06-13 EVO-A2: this REPLACES the duplicate
// runtime route src/pages/api/search-index.json.ts, which re-scanned knowledge/
// with its OWN category map that had drifted (missing politics, zh+en only).
// Derived from legacyDocs = the same single scan → zh+en, all categories, no
// drift. Strip the bigram fields; keep the {t,d,u,tags,lang} shape the old
// route emitted so Layout's fallback is unchanged.
const fallbackDocs = legacyDocs.map((d) => ({
  t: d.t,
  d: d.d,
  u: d.u,
  tags: d.tags,
  lang: d.lang,
}));
await writeFile(
  join(apiDir, 'search-index.json'),
  JSON.stringify(fallbackDocs),
  'utf-8',
);
console.log(
  `[search] fallback plain index: ${fallbackDocs.length} docs (zh+en) → search-index.json`,
);
