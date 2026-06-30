#!/usr/bin/env node
/**
 * generate-og-images.mjs — Multi-language OG image batch generator v4
 *
 * v4 structural optimization (2026-05-03 musing-chaplygin session):
 *   Old v3 opened a new page per article (newPage + goto + networkidle +
 *   font load wait + screenshot + close), ~2.3s per article x 4 workers = 17 min /
 *   ~1700 articles. Each repeats Astro hydration, font load, TCP roundtrip.
 *
 *   v4 uses "single-page frontend + JS dynamic replacement + screenshot loop":
 *   1. Inline HTML template via single setContent (no dev server needed)
 *   2. document.fonts loads Noto Serif TC once
 *   3. Per article: page.evaluate({...}) mutates DOM -> double-rAF -> screenshot
 *   Measured (POC, 2026-05-03): 50 entries 1.45s, mean 26ms/entry, p95 31ms.
 *   1731 articles estimated ~45s (single worker) / ~13s (4 workers) vs v3 17 min = 22-77x.
 *
 *   Trade-off: loses Astro page rendering DRY ("design is source"). Template is
 *   inlined in this file. To prevent drift: this file itself is in TEMPLATE_FILES,
 *   git mtime change triggers full regen; favicon embedded as base64 for visual fidelity.
 *
 * Architecture (vs v3):
 *   1. Render source: inline HTML (v3: Astro ?shot=1 page)
 *   2. Font: Google Noto Serif TC inline link (same as v3)
 *   3. Output: JPG 85 to public/og-images/[lang]/[category]/[slug].jpg (same as v3)
 *   4. Incremental: md or this file (template = self) mtime newer than JPG triggers regen (v3: template list mtime)
 *   5. Parallel: default 4 workers (OG_WORKERS override, each worker has own page) (same as v3)
 *
 * *Multi-language URL slug rules (following v3)*:
 *   - default lang (en): URL uses root filename
 *   - other langs: URL uses locale dir slug (via knowledge/{lang}/{Category}/)
 *
 * Usage (backward-compatible with v3):
 *   npm run og:generate                               # scan all articles + diary (v4.1 default includes diary)
 *   npm run og:generate -- --lang zh-TW               # only generate zh-TW articles
 *   npm run og:generate -- --lang ko --category food
 *   npm run og:generate -- --slug 李洋
 *   npm run og:generate -- --force                    # force regenerate all
 *   npm run og:generate -- --diary                    # diary only
 *   npm run og:generate -- --no-diary                 # skip diary (v4.1 opt-out)
 *   npm run og:generate -- --diary --slug 2026-05-01-gamma-late
 *   OG_WORKERS=2 npm run og:generate                  # reduce worker count
 *
 * v4.1 (2026-05-03 musing-chaplygin follow-up fix): production OG sampling found all diary
 *   (/og-images/semiont/diary/*.jpg) returning 404. Root cause: v3/v4 shared pre-existing
 *   bug — CI ran og:generate without diary by default, needed --include-diary. Fix:
 *   default changed to articles + diary together (SSOT alignment: sitemap already includes diary OG path
 *   -> generator default should produce them). --include-diary kept as backward-compat alias; --no-diary
 *   is the new opt-out (for article-only use cases).
 *
 * Diary output: public/og-images/semiont/diary/[slug].jpg
 */

import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
import { statSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { readdir, stat, readFile } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import {
  ENABLED_LANGUAGE_CODES,
  DEFAULT_LANGUAGE,
} from '../../src/config/languages.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..', '..');

const knowledgeDir = join(repoRoot, 'knowledge');
const outDir = join(repoRoot, 'public', 'og-images');
const faviconPath = join(repoRoot, 'public', 'favicon.png');

// 9 LB categories — key = exact knowledge/ folder name, value = URL slug
const CATEGORY_MAP = {
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

const LANGUAGES = ENABLED_LANGUAGE_CODES;
const DEFAULT_LANG = DEFAULT_LANGUAGE.code;

// i18n labels embedded inline (extracted from src/i18n/ui.ts)。Source-of-truth
// Mirrors ui.ts; low maintenance cost (13 cats x 4 langs, changes ~every 6 months).
// If ui.ts adds categories or languages, sync this table (REFLEXES #43 same-type SSOT risk).
const HOME_LABEL = {
  'zh-TW': '首頁',
  en: 'Home',
  ja: 'ホーム',
  ko: '홈',
};

const CATEGORY_LABEL = {
  'zh-TW': {
    about: '關於',
    history: '歷史',
    geography: '地理',
    culture: '文化',
    food: '美食',
    art: '藝術',
    music: '音樂',
    technology: '科技',
    nature: '自然',
    people: '人物',
    politics: '政治',
    society: '社會',
    economy: '經濟',
    lifestyle: '生活',
  },
  en: {
    about: 'About',
    'art-galleries': 'Art & Galleries',
    beaches: 'Beaches',
    'events-festivals': 'Events & Festivals',
    food: 'Food',
    history: 'History',
    'nature-marine-life': 'Nature & Marine Life',
    neighborhoods: 'Neighborhoods',
    trails: 'Trails',
  },
  ja: {
    about: '概要',
    history: '歴史',
    geography: '地理',
    culture: '文化',
    food: 'グルメ',
    art: '芸術',
    music: '音楽',
    technology: 'テクノロジー',
    nature: '自然',
    people: '人物',
    politics: '政治',
    society: '社会',
    economy: '経済',
    lifestyle: 'ライフスタイル',
  },
  ko: {
    about: '소개',
    history: '역사',
    geography: '지리',
    culture: '문화',
    food: '음식',
    art: '예술',
    music: '음악',
    technology: '기술',
    nature: '자연',
    people: '인물',
    politics: '정치',
    society: '사회',
    economy: '경제',
    lifestyle: '라이프스타일',
  },
};

// 影響 OG 視覺輸出的檔案 — 任一 mtime 比 JPG 新 → 全量重產。
// v4：本檔自身（template inline）+ favicon。若本檔修 visual rendering 邏輯
// 或 favicon 改了，所有 OG 重 generate。
const TEMPLATE_FILES = [
  'scripts/core/generate-og-images.mjs',
  'public/favicon.png',
];

const DIARY_TEMPLATE_FILES = TEMPLATE_FILES; // 共用（v4 single template owner）
const DIARY_SOURCE_DIR = 'docs/semiont/diary';

const VIEWPORT = { width: 1200, height: 630 };
const JPEG_QUALITY = 85;
const FONT_WAIT_MS = 8000;
const WORKERS = Number(process.env.OG_WORKERS || 4);

// ── Greek transliteration (mirror src/lib/semiont-diary.ts) ────────────────
const GREEK_TRANSLIT = {
  α: 'alpha',
  β: 'beta',
  γ: 'gamma',
  δ: 'delta',
  ε: 'epsilon',
  ζ: 'zeta',
  η: 'eta',
  θ: 'theta',
  ι: 'iota',
  κ: 'kappa',
  λ: 'lambda',
  μ: 'mu',
  ν: 'nu',
  ξ: 'xi',
  ο: 'omicron',
  π: 'pi',
  ρ: 'rho',
  σ: 'sigma',
  τ: 'tau',
  υ: 'upsilon',
  φ: 'phi',
  χ: 'chi',
  ψ: 'psi',
  ω: 'omega',
};

function diarySlugFromFilename(filename) {
  const base = basename(filename, '.md');
  const m = base.match(/^(\d{4}-\d{2}-\d{2})(?:-(.+))?$/);
  if (!m) return null;
  const date = m[1];
  const suffix = m[2] || '';
  if (!suffix) return date;
  let translit = '';
  for (const ch of suffix) {
    if (ch === '+') {
      translit += '-plus';
    } else {
      translit += GREEK_TRANSLIT[ch] || ch;
    }
  }
  return `${date}-${translit}`;
}

// ── Frontmatter parsing ─────────────────────────────────────────────────────

async function readArticleMeta(filePath) {
  const raw = await readFile(filePath, 'utf-8');
  const { data } = matter(raw);
  return {
    title: typeof data.title === 'string' ? data.title : null,
    description: typeof data.description === 'string' ? data.description : '',
  };
}

async function readDiaryMeta(filePath) {
  // Diary 無 frontmatter；title = H1 (#)。description 來源優先序：
  //   1. 第一個 blockquote `> ...`（舊文件常用）
  //   2. 第一個 italic-only 段落 `_..._`（新文件常用）
  //   3. 第一個非空白、非 heading、非 metadata 的段落
  const raw = await readFile(filePath, 'utf-8');
  const lines = raw.split('\n');
  let title = '';
  let titleLineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('# ')) {
      title = lines[i].replace(/^#\s+/, '').trim();
      titleLineIdx = i;
      break;
    }
  }

  let description = '';
  if (titleLineIdx >= 0) {
    const after = lines.slice(titleLineIdx + 1);
    for (const line of after) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('#')) continue;
      if (trimmed.startsWith('---')) continue;
      if (trimmed.startsWith('![')) continue;
      if (trimmed.startsWith('> ')) {
        description = trimmed.replace(/^>\s+/, '').trim();
        if (description.length >= 20) break;
        // too short → 繼續找下一段
        continue;
      }
      // italic-only paragraph: _..._ or *...*
      const italicMatch = trimmed.match(/^[_*](.+)[_*]$/);
      if (italicMatch && italicMatch[1].length >= 20) {
        description = italicMatch[1].trim();
        break;
      }
      // Regular paragraph
      if (
        !trimmed.startsWith('_') &&
        !trimmed.startsWith('*') &&
        trimmed.length >= 30
      ) {
        description = trimmed;
        break;
      }
    }
  }
  return { title: title || basename(filePath, '.md'), description };
}

// ── Article entry discovery (sync from v3) ──────────────────────────────────

async function findMarkdownFiles(filterLang, filterCategory) {
  const results = [];
  const langsToScan = filterLang ? [filterLang] : LANGUAGES;

  for (const lang of langsToScan) {
    for (const [folderName, categorySlug] of Object.entries(CATEGORY_MAP)) {
      if (filterCategory && categorySlug !== filterCategory) continue;

      if (lang === DEFAULT_LANG) {
        // Default language articles live at root: knowledge/{Category}/
        const folderPath = join(knowledgeDir, folderName);
        if (!existsSync(folderPath)) continue;
        const files = await readdir(folderPath);
        for (const file of files) {
          if (!file.endsWith('.md') || file.startsWith('_')) continue;
          const filePath = join(folderPath, file).normalize('NFC');
          const fileStat = await stat(filePath);
          results.push({
            kind: 'article',
            lang,
            categorySlug,
            urlSlug: basename(file, '.md'),
            filePath,
            mtimeMs: fileStat.mtimeMs,
          });
        }
      } else {
        // Non-default languages: knowledge/{lang}/{Category}/
        const folderPath = join(knowledgeDir, lang, folderName);
        if (!existsSync(folderPath)) continue;
        const files = await readdir(folderPath);
        for (const file of files) {
          if (!file.endsWith('.md') || file.startsWith('_')) continue;
          const filePath = join(folderPath, file).normalize('NFC');
          if (!existsSync(filePath)) continue;
          const fileStat = await stat(filePath);
          results.push({
            kind: 'article',
            lang,
            categorySlug,
            urlSlug: basename(file, '.md'),
            filePath,
            mtimeMs: fileStat.mtimeMs,
          });
        }
      }
    }
  }
  return results;
}

async function findDiaryEntries(filterSlug) {
  const folder = join(repoRoot, DIARY_SOURCE_DIR);
  if (!existsSync(folder)) return [];
  const files = await readdir(folder);
  const out = [];
  for (const f of files) {
    if (!f.endsWith('.md') || f.startsWith('_') || f.startsWith('.')) continue;
    const slug = diarySlugFromFilename(f);
    if (!slug) continue;
    if (filterSlug && slug !== filterSlug) continue;
    const full = join(folder, f);
    const st = await stat(full);
    out.push({
      kind: 'diary',
      lang: 'zh-TW',
      categorySlug: 'diary',
      urlSlug: slug,
      filePath: full,
      mtimeMs: st.mtimeMs,
    });
  }
  return out;
}

function outputPathFor(entry) {
  if (entry.kind === 'diary') {
    const dir = join(outDir, 'semiont', 'diary');
    return { dir, jpg: join(dir, `${entry.urlSlug}.jpg`) };
  }
  const isDefault = entry.lang === DEFAULT_LANG;
  const langPath = isDefault ? '' : entry.lang;
  const categoryOutDir = join(outDir, langPath, entry.categorySlug);
  return {
    dir: categoryOutDir,
    jpg: join(categoryOutDir, `${entry.urlSlug}.jpg`),
  };
}

function getTemplateMtimeMs() {
  return Math.max(
    0,
    ...TEMPLATE_FILES.map((f) => {
      const full = join(repoRoot, f);
      return existsSync(full) ? statSync(full).mtimeMs : 0;
    }),
  );
}

// ── HTML Template (inline) ──────────────────────────────────────────────────

function buildTemplateHtml(faviconDataUri) {
  return `<!doctype html>
<html lang="${DEFAULT_LANG}">
<head>
<meta charset="utf-8">
<title>OG Batch (taiwan.md)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;600;700&family=Noto+Serif+JP:wght@700;900&family=Noto+Serif+KR:wght@700;900&family=Noto+Serif+TC:wght@400;700;900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  width: 1200px; height: 630px;
  background: #1a3c34; color: #f4f0ea;
  font-family: 'Noto Serif TC', 'Source Han Serif TC', serif;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
body[data-diary='1'] {
  background: #03080a;
  background-image: linear-gradient(to bottom, #03080a 0%, #0a1612 100%);
}

.frame {
  width: 1200px; height: 630px;
  position: relative;
  padding: 12vh 6vw 6vh;
  display: flex; flex-direction: column;
}
body[data-diary='1'] .frame { padding: 18vh 6vw 8vh; }

.breadcrumb {
  font-size: 1.05rem;
  color: rgba(244, 240, 234, 0.65);
  margin-bottom: 1.6rem;
  font-family: 'Noto Sans TC', system-ui, -apple-system, sans-serif;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 0.5em;
  white-space: nowrap;
  overflow: hidden;
}
body[data-diary='1'] .breadcrumb { display: none; }

.breadcrumb .crumb-sep {
  color: rgba(244, 240, 234, 0.45);
  font-size: 0.95em;
  flex-shrink: 0;
}
.breadcrumb .crumb {
  flex-shrink: 0;
}
.breadcrumb .crumb-trunc {
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

h1.hero-title {
  font-family: 'Noto Serif TC', 'Source Han Serif TC', serif;
  font-weight: 900;
  font-size: 3.75rem;
  line-height: 1.2;
  margin-bottom: 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #f4f0ea;
  letter-spacing: 0.01em;
}
body[data-diary='1'] h1.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
}
html[lang='ja'] h1.hero-title { font-family: 'Noto Serif JP', 'Noto Serif TC', serif; }
html[lang='ko'] h1.hero-title { font-family: 'Noto Serif KR', 'Noto Serif TC', serif; }

p.description {
  font-family: 'Noto Serif TC', 'Source Han Serif TC', serif;
  font-size: 1.2rem;
  line-height: 1.65;
  max-width: min(860px, 75%);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: rgba(244, 240, 234, 0.85);
}
html[lang='ja'] p.description { font-family: 'Noto Serif JP', 'Noto Serif TC', serif; }
html[lang='ko'] p.description { font-family: 'Noto Serif KR', 'Noto Serif TC', serif; }

.watermark {
  position: absolute;
  right: 48px; bottom: 40px;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: 1.3rem;
  color: #ffffff;
  line-height: 1;
}
.watermark img {
  width: 1.4rem; height: 1.4rem;
  vertical-align: middle;
}
.watermark .brand-text { color: #ffffff; }
.watermark .brand-dot {
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: 600;
  color: #00d4aa;
}
</style>
</head>
<body>
<div class="frame">
  <nav class="breadcrumb" id="breadcrumb"></nav>
  <h1 class="hero-title" id="title"></h1>
  <p class="description" id="description"></p>
  <span class="watermark">
    <img src="${faviconDataUri}" alt="" aria-hidden="true">
    <span class="brand-text">Taiwan<span class="brand-dot">.md</span></span>
  </span>
</div>
<script>
window.__renderOG = ({ kind, lang, title, description, breadcrumb }) => {
  document.documentElement.lang = lang || '${DEFAULT_LANG}';
  if (kind === 'diary') document.body.setAttribute('data-diary', '1');
  else document.body.removeAttribute('data-diary');

  const bc = document.getElementById('breadcrumb');
  bc.innerHTML = '';
  if (breadcrumb && breadcrumb.length) {
    breadcrumb.forEach((b, i) => {
      if (i > 0) {
        const sep = document.createElement('span');
        sep.className = 'crumb-sep';
        sep.textContent = '›';
        bc.appendChild(sep);
      }
      const s = document.createElement('span');
      // Last item gets ellipsis-truncate; earlier items are flex-shrink: 0
      s.className = i === breadcrumb.length - 1 ? 'crumb crumb-trunc' : 'crumb';
      s.textContent = b;
      bc.appendChild(s);
    });
  }

  document.getElementById('title').textContent = title || '';
  document.getElementById('description').textContent = description || '';
};

window.__waitFontReady = async () => {
  await document.fonts.ready;
  // Preload most critical weight x family
  await Promise.all([
    document.fonts.load('900 60px "Noto Serif TC"'),
    document.fonts.load('900 60px "Noto Serif JP"').catch(() => {}),
    document.fonts.load('900 60px "Noto Serif KR"').catch(() => {}),
    document.fonts.load('400 19px "Noto Serif TC"'),
  ]);
  return document.fonts.check('900 60px "Noto Serif TC"');
};

window.__doubleRaf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
</script>
</body>
</html>`;
}

// ── Per-entry render data builder ───────────────────────────────────────────

function buildBreadcrumb(entry) {
  if (entry.kind === 'diary') return [];
  const lang = entry.lang;
  const homeLabel = HOME_LABEL[lang] || HOME_LABEL[DEFAULT_LANG];
  const catLabel =
    CATEGORY_LABEL[lang]?.[entry.categorySlug] ||
    CATEGORY_LABEL[DEFAULT_LANG][entry.categorySlug] ||
    entry.categorySlug;
  // Article 3rd layer uses truncated title (v3 visual fidelity)
  return [homeLabel, catLabel, entry.title || entry.urlSlug];
}

async function buildRenderPayload(entry) {
  if (entry.kind === 'diary') {
    const meta = await readDiaryMeta(entry.filePath);
    return {
      kind: 'diary',
      lang: 'zh-TW',
      title: meta.title,
      description: meta.description,
      breadcrumb: [],
    };
  }
  const meta = await readArticleMeta(entry.filePath);
  const enriched = {
    ...entry,
    title: meta.title || entry.urlSlug,
    description: meta.description || '',
  };
  return {
    kind: 'article',
    lang: entry.lang,
    title: enriched.title,
    description: enriched.description,
    breadcrumb: buildBreadcrumb(enriched),
  };
}

// ── Worker ──────────────────────────────────────────────────────────────────

async function workerLoop(
  id,
  queue,
  processedCounter,
  total,
  browser,
  templateHtml,
  skipFontWait,
) {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  let ok = 0,
    failed = 0;
  try {
    await page.setContent(templateHtml, { waitUntil: 'domcontentloaded' });
    if (!skipFontWait) {
      try {
        await page.waitForFunction(
          () => typeof window.__waitFontReady === 'function',
          { timeout: 5000 },
        );
        await page.evaluate(() => window.__waitFontReady());
      } catch (_) {
        /* fallback: continue without font ready signal */
      }
    }

    while (queue.length > 0) {
      const entry = queue.shift();
      if (!entry) break;
      const idx = ++processedCounter.value;
      const label =
        entry.kind === 'diary'
          ? `[${idx}/${total}] w${id} diary/${entry.urlSlug}`
          : `[${idx}/${total}] w${id} ${entry.lang}/${entry.categorySlug}/${entry.urlSlug}`;

      try {
        const payload = await buildRenderPayload(entry);
        await page.evaluate((data) => window.__renderOG(data), payload);
        await page.evaluate(() => window.__doubleRaf());
        const { dir, jpg } = outputPathFor(entry);
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        await page.screenshot({
          path: jpg,
          type: 'jpeg',
          quality: JPEG_QUALITY,
          clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
          animations: 'disabled',
        });
        ok++;
        console.log(`${label} ... ✓`);
      } catch (err) {
        failed++;
        console.log(`${label} ... ✗ ${err.message}`);
      }
    }
  } finally {
    await ctx.close();
  }
  return { ok, failed };
}

// ── Main ────────────────────────────────────────────────────────────────────

/**
 * Self-healing Playwright launch (2026-06-01): most common OG gen failure is Playwright browser
 * binary missing/version mismatch (cache key drift, arch mismatch, version bump). Correct fault tolerance is not silent skip
 * (makes problem invisible long-term), but detect binary issue -> reinstall -> re-render self-healing.
 * If self-heal still fails, throw (main().catch prints clear error + blocks build) — real problems never buried.
 */
async function launchChromiumWithHeal() {
  try {
    return await chromium.launch({ headless: true });
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    const isMissingBinary =
      /Executable doesn't exist|playwright install|chrome-headless-shell/i.test(
        msg,
      );
    if (!isMissingBinary) throw err; // Not a binary problem (e.g. system deps) -> throw directly
    console.error(
      '\n⚠️  Playwright browser binary missing -> self-heal: reinstalling chromium then retrying launch (once)',
    );
    console.error(`⚠️  Trigger message：${msg.split('\n')[0]}`);
    try {
      execSync('npx playwright install chromium', { stdio: 'inherit' });
    } catch (installErr) {
      const im =
        installErr && installErr.message
          ? installErr.message
          : String(installErr);
      throw new Error(
        `Playwright auto-install failed, cannot self-heal. Original launch error：${msg.split('\n')[0]}；Install error：${im.split('\n')[0]}`,
      );
    }
    console.error('✓ Playwright chromium installed, retrying launch...');
    return await chromium.launch({ headless: true }); // If fails again -> throws to main().catch
  }
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (name) => {
    const eq = args.find((a) => a.startsWith(`--${name}=`));
    if (eq) return eq.split('=')[1];
    const i = args.indexOf(`--${name}`);
    return i !== -1 ? args[i + 1] : null;
  };
  const hasFlag = (name) => args.includes(`--${name}`);

  const filterLang = getArg('lang');
  const filterCategory = getArg('category');
  const filterSlug = getArg('slug');
  const force = hasFlag('force');
  const skipFontWait = hasFlag('no-font-wait');
  const onlyDiary = hasFlag('diary');
  const includeDiaryFlag = hasFlag('include-diary'); // v3 alias, backward-compatible
  const noDiary = hasFlag('no-diary');
  // v4.1 default: articles + diary together (unless --no-diary or --diary only)
  const includeDiary = onlyDiary || includeDiaryFlag || !noDiary;

  console.log(
    `\n🖼️  OG Image Generator v4 (inline-HTML batch / Noto Serif TC / JPG ${JPEG_QUALITY})`,
  );
  console.log(`   architecture: single-page + JS mutate + screenshot loop`);
  console.log(`   viewport    : ${VIEWPORT.width}×${VIEWPORT.height}`);
  console.log(`   workers     : ${WORKERS}`);
  if (filterLang) console.log(`   lang        : ${filterLang}`);
  if (filterCategory) console.log(`   category    : ${filterCategory}`);
  if (filterSlug) console.log(`   slug        : ${filterSlug}`);
  if (onlyDiary) console.log(`   mode        : --diary (only)`);
  else if (noDiary) console.log(`   mode        : --no-diary (article only)`);
  else console.log(`   mode        : article + diary (v4.1 default)`);
  if (force) console.log(`   mode        : --force`);
  console.log('');

  // Load favicon → base64 (embed once into template)
  if (!existsSync(faviconPath)) {
    // throw (not process.exit) -> goes to main().catch non-fatal handler, does not block build
    throw new Error(`favicon not found: ${faviconPath}`);
  }
  const faviconB64 = readFileSync(faviconPath).toString('base64');
  const faviconDataUri = `data:image/png;base64,${faviconB64}`;
  const templateHtml = buildTemplateHtml(faviconDataUri);

  // Discovery
  const articleEntries = onlyDiary
    ? []
    : await findMarkdownFiles(filterLang, filterCategory);
  const diaryEntries = includeDiary ? await findDiaryEntries(filterSlug) : [];
  const entries = [...articleEntries, ...diaryEntries];

  const byLang = entries.reduce((acc, e) => {
    const key = e.kind === 'diary' ? 'diary' : e.lang;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  console.log(
    `📂 ${entries.length} routable items: ` +
      Object.entries(byLang)
        .map(([l, n]) => `${l}=${n}`)
        .join(', '),
  );

  const tplMtime = getTemplateMtimeMs();
  const toUpdate = entries.filter((entry) => {
    if (filterSlug && entry.urlSlug !== filterSlug) return false;
    if (force) return true;
    const { jpg } = outputPathFor(entry);
    if (!existsSync(jpg)) return true;
    const jpgMtime = statSync(jpg).mtimeMs;
    return entry.mtimeMs > jpgMtime || tplMtime > jpgMtime;
  });

  if (toUpdate.length === 0) {
    console.log(`✅ No images need (re)generation.\n`);
    return;
  }
  console.log(`📝 ${toUpdate.length} images queued.\n`);

  const browser = await launchChromiumWithHeal();
  const startTime = Date.now();

  const queue = [...toUpdate];
  const processedCounter = { value: 0 };

  let totals = { ok: 0, failed: 0 };
  try {
    const results = await Promise.all(
      Array.from({ length: WORKERS }, (_, i) =>
        workerLoop(
          i + 1,
          queue,
          processedCounter,
          toUpdate.length,
          browser,
          templateHtml,
          skipFontWait,
        ),
      ),
    );
    for (const r of results) {
      totals.ok += r.ok;
      totals.failed += r.failed;
    }
  } finally {
    await browser.close();
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const rate = elapsed > 0 ? (totals.ok / parseFloat(elapsed)).toFixed(2) : '0';
  const mark = totals.failed === 0 ? '✅' : '⚠️';
  console.log(
    `\n${mark}  ${totals.ok}/${toUpdate.length} in ${elapsed}s (${rate} img/s, ${WORKERS} workers)` +
      (totals.failed ? `, ${totals.failed} failed` : '') +
      '\n',
  );
}

main().catch((err) => {
  // Block deploy + clear error labeling (2026-06-01 directive, fixes previous 'silent exit 0'):
  // Correct fault tolerance = self-heal (launchChromiumWithHeal detects binary issues, reinstalls, re-renders),
  // not swallowing errors. If self-heal still fails = real problem -> print categorized fix instructions + exit 1
  // to block deploy. Better to block (immediately visible, easy to fix) than silently hide (hard to discover).
  const msg = err && err.message ? err.message : String(err);
  console.error(
    '\n❌ ════════════════════════════════════════════════════════',
  );
  console.error(
    '❌ OG image generation failed — blocking build/deploy (self-heal exhausted = real problem, needs fix)',
  );
  console.error(`❌ Error:${msg.split('\n')[0]}`);
  if (
    /Executable doesn't exist|playwright install|chrome-headless-shell/i.test(
      msg,
    )
  ) {
    console.error(
      '❌ Category: Playwright browser binary issue (auto-reinstall still failed)',
    );
    console.error('❌ How to fix:');
    console.error(
      '❌   1) deploy.yml Playwright cache key must include runner.arch (os is Linux for both arm/x64)',
    );
    console.error(
      '❌   2) "Install Playwright Chromium binary" step must run (even on cache-hit, must be able to re-install)',
    );
    console.error(
      '❌   3) Local repro: rm -rf ~/.cache/ms-playwright && npx playwright install chromium',
    );
  } else if (/favicon not found/i.test(msg)) {
    console.error(
      '❌ Category: favicon missing — verify public/favicon.png exists in repo',
    );
  } else {
    console.error(
      '❌ Category: uncategorized OG generation error — full stack below for diagnosis:',
    );
    console.error(err);
  }
  console.error(
    '❌ ════════════════════════════════════════════════════════\n',
  );
  process.exit(1);
});
