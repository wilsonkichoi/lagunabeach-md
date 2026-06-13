#!/usr/bin/env node
/**
 * Prebuild: src/data/content-dates.json
 * Accurate per-URL "last meaningful modification" date for SEO freshness.
 *
 * WHY (2026-06-07 SEO 完整修復 — reports/seo-optimization-plan-2026-06-07.md §1.1):
 *   The sitemap used a global `lastmod: new Date()` → every page claimed
 *   "modified today" on every build. Google's docs name this exact anti-pattern
 *   ("Don't set the last modification time to the current time whenever the
 *   sitemap is served") and respond by distrusting the site's lastmod entirely,
 *   killing the crawl-scheduling benefit. Separately, Article JSON-LD
 *   dateModified always equalled datePublished, so EVOLVE'd articles never
 *   signalled freshness.
 *
 * WHAT:
 *   One git pass over knowledge/ (the SSOT). For each article file, take the
 *   newest commit date that is NOT cosmetic/automated — so a nightly babel run
 *   or a lint sweep never fakes freshness (Google's "artificially refreshing"
 *   red flag). Author-date (%aI) is used = wall-clock ISO-8601 with timezone,
 *   exactly the format Google wants (and consistent with the repo's wall-clock
 *   timestamp discipline). Output is keyed by site URL path.
 *
 * CONSUMED BY:
 *   - astro.config.mjs  → per-URL sitemap <lastmod>
 *   - src/templates/article.template.astro → Article JSON-LD dateModified
 *   Both reading one source keeps visible/structured dates consistent (another
 *   Google requirement).
 *
 * SAFETY: a file whose every commit is cosmetic (e.g. a translation only ever
 *   touched by babel) is omitted → consumers fall back to frontmatter.date,
 *   which is conservative (a stale-but-true date, never a fake-fresh one).
 */
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import {
  ENABLED_LANGUAGE_CODES,
  DEFAULT_LANGUAGE,
} from '../../src/config/languages.mjs';

const ROOT = process.cwd();
const OUT = resolve(ROOT, 'src/data/content-dates.json');

// knowledge/ category folder (capitalised) → URL slug (lowercase)
const CAT_TO_SLUG = {
  About: 'about',
  History: 'history',
  Geography: 'geography',
  Culture: 'culture',
  Food: 'food',
  Art: 'art',
  Music: 'music',
  Technology: 'technology',
  Nature: 'nature',
  People: 'people',
  Society: 'society',
  Economy: 'economy',
  Lifestyle: 'lifestyle',
  Politics: 'politics',
};
// Derive from the language registry (SSOT) — no hardcoded array (REFLEXES #20).
const NON_DEFAULT_LANGS = new Set(
  ENABLED_LANGUAGE_CODES.filter((c) => c !== DEFAULT_LANGUAGE.code),
);

// Commit subjects that do NOT represent a meaningful content change.
// Excluding them stops nightly babel / lint / routine sweeps from faking
// freshness. Tuned to Taiwan.md's commit conventions (git log inspected).
const COSMETIC =
  /(\[routine\]|babel|prettier|\blint\b|^🧬 \[semiont\] chore|format-only|translate\(|apostrophe|simplified-char|繁簡)/i;

// Spore lifecycle commits (ship / harvest backfill / sporeLinks pointer sync)
// touch article frontmatter only — publishing or measuring a spore is NOT an
// article content change. Without this, 34/57 spore-carrying articles had
// their /latest position + sitemap lastmod set by spore ops (2026-06-10
// audit, reports/spore-data-architecture-2026-06-10.md §2.3). Type-position
// anchors keep real fixes like「heal: … 孢子 #132 查證抓出文章 date error」
// counting as content. Belt-and-suspenders: since the same report's refactor,
// harvest no longer writes article files at all.
const SPORE_POINTER =
  /(^🧬 \[semiont\] (spore|harvest)\b|^🧬 \[harvest|fix\(spore\)|evolve\+harvest|feat: spore SSOT cleanup|衍生資料同步|sporeLinks)/i;

// Image / media-only operations (supplement hero+inline images, optimize, WebP
// migrate, cache, fix image refs) touch article bodies but do NOT change prose —
// they should not reset SEO-freshness / /latest position. Without this, the
// 2026-06-13 WebP migration (570 articles, mechanical .jpg→.webp) + media-
// supplement batches set 580 articles' /latest date to one single day. Adding
// media is an enrichment, not a content-freshness event (user directive
// 2026-06-13: 補圖不該把文章擠到「最新文章」今天). Errs toward conservative
// (stale-but-true) per this file's stated principle, never fake-fresh.
const MEDIA_ONLY =
  /(WebP 全站遷移|媒體增補|媒體落地|影像後處理|image-ingest|land-media|migrate-images|圖片以 ?WebP|babel year-mangle)/i;

function knowledgePathToUrl(p) {
  const parts = p.split('/');
  if (parts[0] !== 'knowledge') return null;
  let i = 1;
  let lang = 'zh-TW';
  if (NON_DEFAULT_LANGS.has(parts[1])) {
    lang = parts[1];
    i = 2;
  }
  const cat = parts[i];
  const file = parts[i + 1];
  // must be exactly knowledge/[lang/]Cat/file.md (no deeper nesting)
  if (parts.length !== i + 2) return null;
  if (!cat || !file || !file.endsWith('.md') || file.startsWith('_'))
    return null;
  const catSlug = CAT_TO_SLUG[cat];
  if (!catSlug) return null;
  const slug = file.replace(/\.md$/, '').normalize('NFC');
  const prefix = lang === 'zh-TW' ? '' : `/${lang}`;
  return `${prefix}/${catSlug}/${slug}/`;
}

function main() {
  let log = '';
  try {
    log = execSync(
      'git log --full-history -z --name-only --format="COMMIT|%H|%aI|%s" -- knowledge/',
      { encoding: 'utf-8', maxBuffer: 256 * 1024 * 1024 },
    );
  } catch (e) {
    console.error('[content-dates] git log failed:', e.message);
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(
      OUT,
      JSON.stringify({ _generated: null, count: 0, dates: {} }),
    );
    return;
  }

  const dates = {}; // url -> ISO (newest non-cosmetic wins; log is newest-first)
  let curDate = '';
  let cosmetic = false;
  let skipped = 0;

  for (let token of log.split('\0')) {
    token = token.replace(/^\n+/, '').trim();
    if (!token) continue;
    if (token.startsWith('COMMIT|')) {
      const parts = token.split('|');
      curDate = parts[2] || '';
      const subject = parts.slice(3).join('|');
      cosmetic =
        COSMETIC.test(subject) ||
        SPORE_POINTER.test(subject) ||
        MEDIA_ONLY.test(subject);
    } else if (token.startsWith('knowledge/') && token.endsWith('.md')) {
      if (cosmetic) {
        skipped++;
        continue;
      }
      const url = knowledgePathToUrl(token);
      if (!url) continue;
      if (!dates[url]) dates[url] = curDate;
    }
  }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(
    OUT,
    JSON.stringify({
      _generated: new Date().toISOString(),
      count: Object.keys(dates).length,
      dates,
    }),
  );
  console.log(
    `[content-dates] ${Object.keys(dates).length} URL dates (skipped ${skipped} cosmetic file-touches) → src/data/content-dates.json`,
  );
}

main();
