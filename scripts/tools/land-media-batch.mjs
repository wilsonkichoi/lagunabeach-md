#!/usr/bin/env node
/**
 * land-media-batch.mjs — Batch-land a media manifest (army research output).
 *
 * Reads manifest JSON (army-raw.json etc) -> for a given slug calls image-ingest ingest
 * per image (download/strip EXIF/resize/WebP/compress/cache) -> prints the full article
 * "paste into article" edit plan (frontmatter image: / each inline markdown + caption /
 * image source list / video + viz suggestions).
 *
 * image-ingest.mjs remains the single-image processing SSOT; this file is batch orchestrator only.
 *
 * Usage:
 *   node scripts/tools/land-media-batch.mjs --manifest reports/research/2026-06/media-manifests/army-raw.json \
 *        --slug 蛋撻 --prefix dan-ta [--dry-run] [--include-fair]
 *
 * Rules:
 *   - hero = first role=hero + landscape clean image; portrait hero auto-demoted to inline
 *   - Default skips fair-use (unless --include-fair), abstract/portrait needs manual source
 *   - direct_url used if real http; otherwise source_page (image-ingest resolves Special:FilePath)
 *   - name = {prefix}-{hero|NN}[-{year}], year extracted from first 4-digit number in caption
 *
 * Canonical: REWRITE Step 1.9.2 / paired with image-ingest.mjs
 */
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const INGEST = join(__dirname, 'image-ingest.mjs');

const C = {
  red: '\x1b[0;31m',
  grn: '\x1b[0;32m',
  yel: '\x1b[0;33m',
  gry: '\x1b[0;90m',
  bold: '\x1b[1m',
  cyan: '\x1b[0;36m',
  nc: '\x1b[0m',
};

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2),
        n = argv[i + 1];
      if (n === undefined || n.startsWith('--')) out[k] = true;
      else {
        out[k] = n;
        i++;
      }
    } else out._.push(a);
  }
  return out;
}
const aspect = (d) => {
  const m = /(\d+)\s*[x×]\s*(\d+)/.exec(d || '');
  return m ? +m[1] / +m[2] : null;
};
const yearOf = (s) => {
  const m = /\b(19|20)\d{2}\b/.exec(s || '');
  return m ? m[0] : null;
};
const isFair = (l) => /fair[\s-]?use/i.test(l || '');
const cleanLic = (l) =>
  !isFair(l) && /(cc0|cc\s?by|public domain|pd-|政府|open data)/i.test(l || '');

const args = parseArgs(process.argv.slice(2));
const { manifest, slug, prefix } = args;
if (!manifest || !slug || !prefix) {
  console.error(`${C.red}Missing required: --manifest --slug --prefix${C.nc}`);
  process.exit(2);
}
const dry = !!args['dry-run'];
const includeFair = !!args['include-fair'];

const all = JSON.parse(
  await readFile(
    manifest.startsWith('/') ? manifest : join(REPO_ROOT, manifest),
    'utf-8',
  ),
);
const m = all.find((x) => x.slug === slug);
if (!m) {
  console.error(`${C.red}manifest has no slug=${slug}${C.nc}`);
  process.exit(1);
}
const cat = m.cat;
const catDir = cat.toLowerCase();

// Sort: hero candidates first (role=hero & landscape & clean), rest in order
let imgs = (m.images || []).filter((im) => {
  if (isFair(im.license) && !includeFair) {
    console.log(
      `${C.yel}⏭ Skipping fair-use: ${im.subject?.slice(0, 40)} (needs --include-fair + manual confirmation)${C.nc}`,
    );
    return false;
  }
  return true;
});

// Determine hero: first with role=hero and valid aspect; otherwise first landscape clean image
let heroIdx = imgs.findIndex(
  (im) =>
    im.role === 'hero' &&
    (aspect(im.dims) === null ||
      (aspect(im.dims) >= 0.9 && aspect(im.dims) <= 2.0)),
);
if (heroIdx < 0)
  heroIdx = imgs.findIndex((im) => {
    const a = aspect(im.dims);
    return a !== null && a >= 0.9 && a <= 2.0;
  });

const plan = { hero: null, inline: [], sources: [] };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let inlineN = 0;
for (let i = 0; i < imgs.length; i++) {
  if (i > 0) await sleep(5000); // throttle Wikimedia (avoid 429 burst)
  const im = imgs[i];
  const role = i === heroIdx ? 'hero' : 'inline';
  const yr = yearOf(im.caption) || yearOf(im.subject) || '';
  const name =
    role === 'hero'
      ? `${prefix}-hero${yr ? '-' + yr : ''}`
      : `${prefix}-${String(++inlineN).padStart(2, '0')}${yr ? '-' + yr : ''}`;
  const src =
    im.direct_url &&
    /^https?:\/\//.test(im.direct_url) &&
    !/derive-from-file-page/i.test(im.direct_url)
      ? im.direct_url
      : im.source_page;
  if (!src) {
    console.log(`${C.red}✗ No usable src: ${im.subject?.slice(0, 40)}${C.nc}`);
    continue;
  }
  const credit = `${im.author || '?'} / Wikimedia Commons`;
  const ingestArgs = [
    'ingest',
    '--src',
    src,
    '--cat',
    cat,
    '--name',
    name,
    '--role',
    role,
    '--format',
    'webp',
    '--alt',
    im.alt || im.subject || '',
    '--credit',
    credit,
    '--license',
    im.license || '',
    '--source-url',
    im.source_page || '',
  ];
  if (dry) ingestArgs.push('--dry-run');
  console.log(
    `${C.bold}── ${role} ${name} ──${C.nc} ${C.gry}${im.tier} ${im.license}${C.nc}`,
  );
  let okIngest = true;
  try {
    execFileSync('node', [INGEST, ...ingestArgs], {
      stdio: 'inherit',
      cwd: REPO_ROOT,
    });
  } catch (e) {
    okIngest = false;
    console.log(
      `${C.red}  ✗ ingest failed (exit) — possibly over budget / aspect, see above${C.nc}`,
    );
  }
  const webPath = `/article-images/${catDir}/${name}.webp`;
  const lic = im.license || '';
  const licShort = cleanLic(lic) ? lic.replace(/\s*via.*$/i, '') : lic;
  if (role === 'hero') plan.hero = { webPath, name, im };
  else plan.inline.push({ webPath, im });
  plan.sources.push(
    `- [${im.subject?.slice(0, 50) || name}](${im.source_page}) — Photo: ${im.author || '?'}, ${yr || 'n.d.'}, ${licShort}`,
  );
}

// ── Print edit plan ──
console.log(
  `\n${C.bold}══════ ${slug} edit plan (${plan.inline.length + (plan.hero ? 1 : 0)} images) ══════${C.nc}`,
);
if (plan.hero) {
  const im = plan.hero.im;
  console.log(`\n${C.cyan}# frontmatter (add after readingTime)${C.nc}`);
  console.log(`image: '${plan.hero.webPath}'`);
  console.log(`imageCredit: '${im.author || '?'} / Wikimedia Commons'`);
  console.log(
    `imageLicense: '${(im.license || '').replace(/\s*via.*$/i, '')}'`,
  );
  console.log(`imageSource: '${im.source_page}'`);
}
console.log(
  `\n${C.cyan}# inline (place in corresponding section, markdown + italic caption)${C.nc}`,
);
for (const x of plan.inline) {
  const im = x.im;
  const licVia = /commons\.wikimedia/i.test(im.source_page || '')
    ? `[${(im.license || '').replace(/\s*via.*$/i, '')} via Wikimedia Commons](${im.source_page})`
    : `[${im.license}](${im.source_page})`;
  console.log(`\n![${im.alt || im.subject}](${x.webPath})`);
  console.log(
    `_${im.caption || im.subject}. Photo: ${im.author || '?'}. ${licVia}._`,
  );
}
console.log(`\n${C.cyan}# Image sources (place before ## References)${C.nc}`);
console.log(
  `## Image Sources\n\nThis article uses ${plan.sources.length} public domain / CC licensed images, all cached in \`public/article-images/${catDir}/\` to avoid hotlinking source servers:\n`,
);
plan.sources.forEach((s) => console.log(s));
if ((m.videos || []).length) {
  console.log(
    `\n${C.cyan}# Official videos (optional iframe embed, Step 4.3.6)${C.nc}`,
  );
  m.videos.forEach((v) =>
    console.log(
      `  - ${v.work?.slice(0, 50)} → youtube ${v.youtube_id} (${v.channel}, official=${v.verified_official})`,
    ),
  );
}
if ((m.viz_recommendation || '').trim())
  console.log(
    `\n${C.yel}# viz recommendation (supplement abstract topics with charts): ${C.nc}${m.viz_recommendation.slice(0, 200)}`,
  );
console.log(
  `\n${C.gry}negative: ${(m.negative_findings || '').slice(0, 160)}${C.nc}`,
);
