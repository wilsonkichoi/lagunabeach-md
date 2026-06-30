#!/usr/bin/env node
/**
 * LagunaBeach.md API Generator
 * Generate static JSON API endpoints for knowledge base
 *
 * Usage: node scripts/generate-api.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path configuration
const KNOWLEDGE_DIR = path.join(__dirname, '../../knowledge');
const OUTPUT_DIR = path.join(__dirname, '../../public/api');
const BASE_URL = 'https://lagunabeach.md';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Simple frontmatter parser
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: content };
  }

  const frontmatterText = match[1];
  const bodyContent = match[2];
  const frontmatter = {};

  // Simple YAML parsing (basic format only)
  const lines = frontmatterText.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex !== -1) {
        const key = trimmed.slice(0, colonIndex).trim();
        let value = trimmed.slice(colonIndex + 1).trim();

        // Remove quotes
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // Handle array format [tag1, tag2]
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value
            .slice(1, -1)
            .split(',')
            .map((v) => v.trim().replace(/['"]/g, ''))
            .filter((v) => v.length > 0);
        }

        frontmatter[key] = value;
      }
    }
  }

  return { frontmatter, content: bodyContent };
}

/**
 * Calculate article reading time (word count / 250 wpm)
 */
function calculateReadingTime(content) {
  // Strip markdown markers
  const plainText = content
    .replace(/#+\s/g, '') // headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\*([^*]+)\*/g, '$1') // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/`([^`]+)`/g, '$1'); // inline code

  const wordCount = plainText.length;
  const minutes = Math.max(1, Math.ceil(wordCount / 250));
  return minutes;
}

/**
 * Recursively read all markdown files
 */
function getAllMarkdownFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath, baseDir));
    } else if (item.endsWith('.md') && !item.startsWith('_')) {
      // Skip _Hub files (category pages)
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Derive category from file path
 */
function getCategoryFromPath(filePath) {
  const relativePath = path.relative(KNOWLEDGE_DIR, filePath);
  const pathParts = relativePath.split(path.sep);
  return pathParts[0] || 'Misc';
}

/**
 * Generate article URL
 */
function generateArticleUrl(filePath) {
  const relativePath = path.relative(KNOWLEDGE_DIR, filePath);
  // Path shape is always `[lang/]Category/slug` — the category is the
  // second-to-last segment. Astro routes the category in lowercase
  // (getStaticPaths emits the lowercase categorySlug, e.g. `politics`), so
  // the canonical URL must lowercase it too. Preserving the on-disk
  // PascalCase folder name (`/en/Politics/...`) yields a URL that resolves
  // on a case-insensitive macOS dev box but 404s on case-sensitive hosts
  // like Cloudflare Pages — the exact dev/prod gap behind the non-default-
  // language "surprise me" 404s (RandomDiscovery / explore random pools).
  const parts = relativePath.replace(/\.md$/, '').split(path.sep);
  const catIdx = parts.length - 2; // category sits before the slug
  const urlPath = parts
    .map((part, i) =>
      encodeURIComponent(i === catIdx ? part.toLowerCase() : part),
    )
    .join('/');

  return `${BASE_URL}/${urlPath}`;
}

/**
 * Process a single markdown file
 */
function processMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, content: bodyContent } = parseFrontmatter(content);

    const category = getCategoryFromPath(filePath);
    const fileName = path.basename(filePath, '.md');
    const url = generateArticleUrl(filePath);
    const readingTime = calculateReadingTime(bodyContent);

    return {
      title: frontmatter.title || fileName,
      description: frontmatter.description || '',
      category: category,
      tags: Array.isArray(frontmatter.tags)
        ? frontmatter.tags
        : frontmatter.tags
          ? [frontmatter.tags]
          : [],
      url: url,
      readingTime: readingTime,
      featured:
        frontmatter.featured === true || frontmatter.featured === 'true',
      date: frontmatter.date || null,
      path: path.relative(KNOWLEDGE_DIR, filePath),
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Generate statistics
 */
function generateStats(articles) {
  const categories = [...new Set(articles.map((a) => a.category))];
  const allTags = articles.flatMap((a) => a.tags);
  const uniqueTags = [...new Set(allTags)];

  // Simple contributor estimate (based on different writing style features)
  const estimatedContributors = Math.ceil(articles.length / 15); // assuming ~15 articles per contributor

  const categoryStats = categories.map((category) => ({
    name: category,
    count: articles.filter((a) => a.category === category).length,
  }));

  const topTags = uniqueTags
    .map((tag) => ({
      name: tag,
      count: allTags.filter((t) => t === tag).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return {
    totalArticles: articles.length,
    totalCategories: categories.length,
    estimatedContributors: estimatedContributors,
    totalTags: uniqueTags.length,
    categories: categoryStats,
    topTags: topTags,
    languageDistribution: {
      en: articles.length, // canonical language (English)
    },
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Randomly select articles
 */
function getRandomArticles(articles, count = 20) {
  const shuffled = [...articles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, articles.length));
}

/**
 * Generate article index (for Smart 404)
 * Map {category}/{slug} -> { zhTitle, enTitle, category, langs[] }
 */
function generateArticleIndex() {
  console.log('📇 Generating article-index.json (Smart 404 index)...');

  const translationsPath = path.join(KNOWLEDGE_DIR, '_translations.json');
  if (!fs.existsSync(translationsPath)) {
    console.warn(
      '⚠️  _translations.json not found, skipping article-index generation',
    );
    return;
  }

  const translationsRaw = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
  // Defensive filter: drop stale entries whose zh target doesn't exist.
  // Prevents Smart 404 from showing suggestions for non-existent articles.
  const translations = {};
  let _staleEntries = 0;
  for (const [lf, zf] of Object.entries(translationsRaw)) {
    if (fs.existsSync(path.join(KNOWLEDGE_DIR, zf))) {
      translations[lf] = zf;
    } else {
      _staleEntries += 1;
    }
  }
  if (_staleEntries > 0) {
    console.log(
      `   ⚠️  Skipped ${_staleEntries} stale _translations.json entries (zh file missing)`,
    );
  }
  // Rule 3: aligned to LB 9-category mapping (inert block until translations land)
  const categoryFolderToSlug = {
    About: 'about',
    'Art & Galleries': 'art-galleries',
    Beaches: 'beaches',
    'Events & Festivals': 'events-festivals',
    Food: 'food',
    History: 'history',
    'Nature & Marine Life': 'nature-marine-life',
    Neighborhoods: 'neighborhoods',
    Trails: 'trails',
  };

  // Reverse maps: zhFile → jaFile / koFile
  //
  // ja/ko translations use NATIVE slugs that differ from EN slugs
  // (e.g. `ja/Culture/taiwan-youtuber.md` vs `en/Culture/taiwan-youtuber-industry.md`).
  // The previous implementation checked `knowledge/ja/<Cat>/<enSlug>.md` which
  // never matched for these cases, so Smart 404 always said "no ja version"
  // even when one existed. Build canonical reverse maps via _translations.json.
  const zhToJaFile = {};
  const zhToKoFile = {};
  for (const [langFile, zhFile] of Object.entries(translations)) {
    if (langFile.startsWith('ja/')) zhToJaFile[zhFile] = langFile;
    if (langFile.startsWith('ko/')) zhToKoFile[zhFile] = langFile;
  }

  const index = {};

  for (const [langFile, zhFile] of Object.entries(translations)) {
    // Only process en/ entries (they define the canonical English slug)
    if (!langFile.startsWith('en/')) continue;

    // Parse: "en/Food/beef-noodle-soup.md" → category=Food, slug=beef-noodle-soup
    const langParts = langFile.replace(/\.md$/, '').split('/');
    if (langParts.length < 3) continue;
    const enCategoryFolder = langParts[1];
    const enSlug = langParts[2];
    const categorySlug =
      categoryFolderToSlug[enCategoryFolder] || enCategoryFolder.toLowerCase();

    // Parse: "Food/牛肉麵.md" → zhTitle=牛肉麵
    const zhParts = zhFile.replace(/\.md$/, '').split('/');
    if (zhParts.length < 2) continue;
    const zhCategoryFolder = zhParts[0];
    const zhTitle = zhParts[1];

    // Skip Hub files
    if (zhTitle.startsWith('_') || enSlug.startsWith('_')) continue;

    const key = `${categorySlug}/${enSlug}`;

    // Skip if already indexed (multiple en slugs → same zh article)
    if (index[key]) continue;

    // Read English title from frontmatter
    let enTitle = enSlug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const enFilePath = path.join(
      KNOWLEDGE_DIR,
      'en',
      enCategoryFolder,
      `${enSlug}.md`,
    );
    if (fs.existsSync(enFilePath)) {
      try {
        const enContent = fs.readFileSync(enFilePath, 'utf8');
        const { frontmatter } = parseFrontmatter(enContent);
        if (frontmatter.title) enTitle = frontmatter.title;
      } catch {}
    }

    // Check which languages have this article — via _translations.json
    // reverse lookup, because ja/ko files use native slugs that differ
    // from the EN slug we're indexing under.
    const langs = ['zh-TW', 'en']; // zh-TW and en always exist if in _translations.json
    const jaFileRel = zhToJaFile[zhFile];
    if (jaFileRel && fs.existsSync(path.join(KNOWLEDGE_DIR, jaFileRel))) {
      langs.push('ja');
    }
    const koFileRel = zhToKoFile[zhFile];
    if (koFileRel && fs.existsSync(path.join(KNOWLEDGE_DIR, koFileRel))) {
      langs.push('ko');
    }

    index[key] = { zhTitle, enTitle, category: categorySlug, langs };
  }

  const outputPath = path.join(OUTPUT_DIR, 'article-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(index), 'utf8');
  const count = Object.keys(index).length;
  const size = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log(`📇 Generated article-index.json (${count} articles, ${size}KB)`);
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 LagunaBeach.md API Generator starting...');

  // Read all markdown files
  console.log('📖 Scanning knowledge directory...');
  const markdownFiles = getAllMarkdownFiles(KNOWLEDGE_DIR);
  console.log(`Found ${markdownFiles.length} markdown files`);

  // Process all articles
  console.log('⚙️  Parsing article metadata...');
  const articles = markdownFiles
    .map(processMarkdownFile)
    .filter((article) => article !== null)
    .sort((a, b) => a.title.localeCompare(b.title, 'en'));

  console.log(`✅ Successfully processed ${articles.length} articles`);

  // Generate articles.json
  const articlesOutput = path.join(OUTPUT_DIR, 'articles.json');
  fs.writeFileSync(articlesOutput, JSON.stringify(articles, null, 2), 'utf8');
  console.log(`📄 Generated articles.json (${articles.length} articles)`);

  // Generate stats.json
  const stats = generateStats(articles);
  const statsOutput = path.join(OUTPUT_DIR, 'stats.json');
  fs.writeFileSync(statsOutput, JSON.stringify(stats, null, 2), 'utf8');
  console.log(`📊 Generated stats.json (${stats.totalCategories} categories)`);

  // Generate article-index.json (Smart 404)
  generateArticleIndex();

  console.log('\n🎉 API generation complete！');
  console.log(`📂 Output directory: ${OUTPUT_DIR}`);
  console.log('📋 Generated files:');
  console.log('   - articles.json (All article metadata)');
  console.log('   - stats.json (Statistics)');
  console.log('   - article-index.json (Smart 404 index)');
}

// Execute
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}
