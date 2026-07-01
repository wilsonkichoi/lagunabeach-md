#!/usr/bin/env node
/**
 * image-ingest.mjs — Taiwan.md image post-processing toolchain SSOT (validate + transform pipeline)
 *
 * Instruments all manual image post-processing steps specified by REWRITE-PIPELINE
 * Step 1.9.2 / Step 4.3. Previously scattered across: cache-county-images.mjs (Wikimedia
 * only) + check-aspect.sh (aspect only) + various manual sips/curl runs. This tool
 * unifies everything using sharp (already bundled with Astro, cross-platform).
 *
 * Three modes:
 *
 *   ingest — download/read -> sniff magic bytes -> block GIF/HEIC/BMP/TIFF -> auto-orient + strip EXIF/GPS
 *            -> resize cap -> convert (default WebP) -> quality search to hit size budget
 *            -> naming convention -> cache to public/article-images/{cat}/ -> emit md/frontmatter/source/license matrix
 *
 *   check  — validate only (no file modification), pre-commit / CI gate: format allowlist / aspect / size budget / EXIF residual
 *
 *   audit  — site-wide scan of public/article-images/: format distribution / oversize / EXIF leaks / aspect violations
 *            + WebP migration estimate (non-webp count + bytes saveable)
 *
 * Usage:
 *   node scripts/tools/image-ingest.mjs ingest --src <URL|path> --cat Food \
 *        --name dan-ta-portuguese-tart-2024 --role hero \
 *        [--format webp|jpg|png|keep] [--alt "description"] \
 *        [--credit "author / Wikimedia"] [--license "CC BY-SA 4.0"] [--source-url "https://..."] [--dry-run]
 *
 *   node scripts/tools/image-ingest.mjs check public/article-images/food/*.webp [--role hero]
 *   node scripts/tools/image-ingest.mjs audit [--cat Food] [--json]
 *
 * Canonical: REWRITE-PIPELINE Step 1.9.2 + Step 4.3 / REFLEXES #15 #30
 */
import {
  readFile,
  writeFile,
  mkdir,
  access,
  readdir,
  stat,
} from 'node:fs/promises';
import { dirname, join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const IMG_ROOT = join(REPO_ROOT, 'public', 'article-images');

// ── Guardrail constants (aligned with REWRITE-PIPELINE Step 1.9.2) ────────────
const SIZE_BUDGET = { hero: 600 * 1024, inline: 400 * 1024 }; // hard ceiling (bytes)
const SIZE_WARN = { hero: 500 * 1024, inline: 350 * 1024 };
const DIM_CAP = { hero: 2400, inline: 1600 }; // max width, downscale only
const ASPECT = { hero: [0.9, 2.0], inline: [0.75, 2.5] }; // w/h
const SVG_MAX = 50 * 1024;
const OUTPUT_FORMATS = new Set(['webp', 'jpg', 'jpeg', 'png']);
const BANNED_STORE = new Set(['gif', 'heic', 'heif', 'bmp', 'tiff']); // must convert before storing
const QUALITY_START = 82;
const QUALITY_FLOOR = 58;

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Taiwan.md ImageIngest/1.0';

const C = {
  red: '\x1b[0;31m',
  grn: '\x1b[0;32m',
  yel: '\x1b[0;33m',
  gry: '\x1b[0;90m',
  bold: '\x1b[1m',
  cyan: '\x1b[0;36m',
  nc: '\x1b[0m',
};
const kb = (b) => `${(b / 1024).toFixed(0)}KB`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── arg parser ────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) out[key] = true;
      else {
        out[key] = next;
        i++;
      }
    } else out._.push(a);
  }
  return out;
}

// ── Magic-bytes format sniffing (don't trust file extension) ──────────────────
function sniffFormat(buf) {
  if (buf.length < 12) return 'unknown';
  const b = buf;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
    return 'png';
  if (
    b.slice(0, 4).toString('ascii') === 'RIFF' &&
    b.slice(8, 12).toString('ascii') === 'WEBP'
  )
    return 'webp';
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return 'gif';
  if (b[0] === 0x42 && b[1] === 0x4d) return 'bmp';
  if (
    (b[0] === 0x49 && b[1] === 0x49 && b[2] === 0x2a) ||
    (b[0] === 0x4d && b[1] === 0x4d && b[2] === 0x00)
  )
    return 'tiff';
  // HEIC/HEIF: ftyp box with heic/heix/mif1 brand
  if (b.slice(4, 8).toString('ascii') === 'ftyp') {
    const brand = b.slice(8, 12).toString('ascii');
    if (/heic|heix|hevc|mif1|heif/i.test(brand)) return 'heic';
  }
  const head = b.slice(0, 256).toString('utf-8');
  if (head.includes('<svg') || head.includes('<?xml')) return 'svg';
  return 'unknown';
}

// ── Download (generalized: UA / 30s timeout / 429,5xx retry / thumb->original) ──
function thumbToOriginal(url) {
  const m = url.match(
    /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/[a-z]+)\/thumb\/([0-9a-f])\/([0-9a-f]{2})\/([^/]+)\/[^/]+$/,
  );
  return m ? `${m[1]}/${m[2]}/${m[3]}/${m[4]}` : null;
}
async function fetchOnce(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    return await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': UA, Accept: 'image/*' },
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}
async function download(url, attempt = 1) {
  try {
    let resp = await fetchOnce(url);
    if (resp.status === 404 && attempt === 1) {
      const orig = thumbToOriginal(url);
      if (orig) {
        console.log(`     ${C.gry}↻ thumb 404 → original${C.nc}`);
        resp = await fetchOnce(orig);
      }
    }
    if (!resp.ok) {
      if ((resp.status === 429 || resp.status >= 500) && attempt < 6) {
        await sleep(8000 * attempt); // Wikimedia 429 aggressive, needs 8s+ progressive backoff
        return download(url, attempt + 1);
      }
      throw new Error(`HTTP ${resp.status}`);
    }
    return Buffer.from(await resp.arrayBuffer());
  } catch (e) {
    if (attempt < 4) {
      await sleep(3000);
      return download(url, attempt + 1);
    }
    throw e;
  }
}

// Commons File: page / Special:FilePath -> canonical Special:FilePath download URL
// (allows manifest to give File: page URL or "derive-from-file-page" and still download original)
function commonsFilePath(src) {
  let m = src.match(/commons\.wikimedia\.org\/wiki\/(?:File|Image):(.+)$/i);
  if (m) {
    const fname = m[1].replace(/^.*\//, '').split('#')[0];
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${fname}`;
  }
  if (/commons\.wikimedia\.org\/wiki\/Special:FilePath\//i.test(src))
    return src;
  return null;
}

async function resolveSource(src) {
  if (/^https?:\/\//.test(src)) {
    const cf = commonsFilePath(src);
    const url = cf || src;
    console.log(
      `  ${C.gry}↓ downloading ${cf ? '[Commons FilePath] ' : ''}${url.slice(0, 80)}…${C.nc}`,
    );
    return download(url);
  }
  const p = src.startsWith('/') ? src : join(REPO_ROOT, src);
  return readFile(p);
}

function validateName(name) {
  const bare = name.replace(/\.[a-z0-9]+$/i, '');
  const warn = [];
  if (!/^[a-z0-9-]+$/.test(bare))
    return {
      ok: false,
      bare,
      err: 'Name must be all-lowercase kebab-case (no spaces / no CJK / no underscores)',
    };
  if (!/\d{4}/.test(bare))
    warn.push('Recommend including 4-digit year ({subject}-{topic}-{year})');
  if (bare.split('-').length < 2)
    warn.push('Recommend at least two segments (subject-topic)');
  return { ok: true, bare, warn };
}

// ── ingest (transform main path) ────────────────────────────────────────────
async function modeIngest(args) {
  const { src, cat, name, role = 'inline' } = args;
  const fmt = (args.format || 'webp').toLowerCase();
  if (!src || !cat || !name) {
    console.error(
      `${C.red}Missing required parameters: --src --cat --name${C.nc}`,
    );
    process.exit(2);
  }
  if (!['hero', 'inline'].includes(role)) {
    console.error(`${C.red}--role 只能 hero|inline${C.nc}`);
    process.exit(2);
  }
  const nameCheck = validateName(name);
  if (!nameCheck.ok) {
    console.error(`${C.red}✗ ${nameCheck.err}${C.nc}`);
    process.exit(2);
  }
  nameCheck.warn?.forEach((w) => console.log(`  ${C.yel}⚠ ${w}${C.nc}`));

  const catDir = cat.toLowerCase();
  let buf;
  try {
    buf = await resolveSource(src);
  } catch (e) {
    console.error(`${C.red}✗ Source fetch failed: ${e.message}${C.nc}`);
    process.exit(1);
  }

  const inFmt = sniffFormat(buf);
  console.log(
    `  ${C.gry}Source format (magic bytes): ${inFmt}  original ${kb(buf.length)}${C.nc}`,
  );
  if (inFmt === 'unknown') {
    console.error(
      `${C.red}✗ Cannot identify image format (magic bytes mismatch)${C.nc}`,
    );
    process.exit(1);
  }

  // SVG：向量，不 raster 處理，只檢查體積
  if (inFmt === 'svg') {
    if (buf.length > SVG_MAX)
      console.log(
        `  ${C.yel}⚠ SVG ${kb(buf.length)} > ${kb(SVG_MAX)} 上限${C.nc}`,
      );
    const dest = join(IMG_ROOT, catDir, `${nameCheck.bare}.svg`);
    if (!args['dry-run']) {
      await mkdir(dirname(dest), { recursive: true });
      await writeFile(dest, buf);
    }
    emitSnippets({ catDir, file: `${nameCheck.bare}.svg`, role, args });
    console.log(
      `  ${C.grn}✓ SVG 入庫 ${dest.replace(REPO_ROOT + '/', '')}${C.nc}`,
    );
    return;
  }

  if (BANNED_STORE.has(inFmt))
    console.log(
      `  ${C.cyan}↻ ${inFmt} banned from storage -> converting to ${fmt === 'keep' ? 'webp' : fmt}${C.nc}`,
    );

  // 出檔格式
  let outFmt =
    fmt === 'keep'
      ? inFmt === 'png'
        ? 'png'
        : inFmt === 'webp'
          ? 'webp'
          : 'jpeg'
      : fmt === 'jpg'
        ? 'jpeg'
        : fmt;
  if (BANNED_STORE.has(inFmt) && fmt === 'keep') outFmt = 'webp';
  if (!OUTPUT_FORMATS.has(outFmt)) {
    console.error(`${C.red}✗ Output format not allowed: ${outFmt}${C.nc}`);
    process.exit(2);
  }
  const extFinal = outFmt === 'jpeg' ? 'jpg' : outFmt; // jpeg→jpg 副檔名

  let meta;
  try {
    meta = await sharp(buf).metadata();
  } catch (e) {
    console.error(`${C.red}✗ sharp read failed: ${e.message}${C.nc}`);
    process.exit(1);
  }
  const hadExif = !!meta.exif || !!meta.iptc || !!meta.xmp;
  console.log(
    `  ${C.gry}Original dimensions ${meta.width}x${meta.height}  EXIF/metadata: ${hadExif ? 'present (will strip)' : 'none'}${C.nc}`,
  );

  const cap = DIM_CAP[role];
  // quality search to fit budget
  const budget = SIZE_BUDGET[role];
  const warnBudget = SIZE_WARN[role];
  let out,
    qUsed = QUALITY_START,
    finalMeta;
  for (let q = QUALITY_START; q >= QUALITY_FLOOR; q -= 6) {
    let pipe = sharp(buf, { failOn: 'error' }).rotate(); // auto-orient from EXIF then drop it
    if (meta.width > cap)
      pipe = pipe.resize({ width: cap, withoutEnlargement: true });
    if (outFmt === 'webp') pipe = pipe.webp({ quality: q, effort: 5 });
    else if (outFmt === 'jpeg') pipe = pipe.jpeg({ quality: q, mozjpeg: true });
    else if (outFmt === 'png')
      pipe = pipe.png({ compressionLevel: 9, palette: true });
    out = await pipe.toBuffer();
    qUsed = q;
    if (outFmt === 'png') break; // png 不做 quality search
    if (out.length <= budget) break;
  }
  finalMeta = await sharp(out).metadata();
  const ar = +(finalMeta.width / finalMeta.height).toFixed(3);
  const [amin, amax] = ASPECT[role];

  // 報告
  const sizeMark =
    out.length > budget
      ? `${C.red}✗ ${kb(out.length)} > ${kb(budget)} over budget${C.nc}`
      : out.length > warnBudget
        ? `${C.yel}⚠ ${kb(out.length)}${C.nc}`
        : `${C.grn}${kb(out.length)}${C.nc}`;
  const arMark =
    ar >= amin && ar <= amax
      ? `${C.grn}${ar}${C.nc}`
      : `${C.red}✗ ${ar} (${role} requires ${amin}-${amax}, recommend replacing image not forcing crop)${C.nc}`;
  console.log(
    `  Processed: ${finalMeta.width}x${finalMeta.height}  ${outFmt} q${qUsed}  ${sizeMark}  aspect ${arMark}  EXIF stripped`,
  );
  console.log(
    `  ${C.gry}Compression ${((1 - out.length / buf.length) * 100).toFixed(0)}% (${kb(buf.length)} -> ${kb(out.length)})${C.nc}`,
  );

  const fileName = `${nameCheck.bare}.${extFinal}`;
  const dest = join(IMG_ROOT, catDir, fileName);
  if (args['dry-run']) {
    console.log(
      `  ${C.cyan}[dry-run] 不寫檔 → ${dest.replace(REPO_ROOT + '/', '')}${C.nc}`,
    );
  } else {
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, out);
    console.log(`  ${C.grn}✓ 入庫 ${dest.replace(REPO_ROOT + '/', '')}${C.nc}`);
  }
  emitSnippets({ catDir, file: fileName, role, args });
  // 硬性失敗 → 非零 exit（讓批次/CI 看得到）
  if (out.length > budget) process.exitCode = 1;
}

function emitSnippets({ catDir, file, role, args }) {
  const webPath = `/article-images/${catDir}/${file}`;
  const alt =
    args.alt || '(TODO: describe the image specifically, do not use "image")';
  console.log(`\n  ${C.bold}── Paste into article ──${C.nc}`);
  if (role === 'hero')
    console.log(`  frontmatter:  ${C.cyan}image: ${webPath}${C.nc}`);
  console.log(`  markdown:     ${C.cyan}![${alt}](${webPath})${C.nc}`);
  if (args.credit || args.license || args['source-url']) {
    const credit = args.credit || '(author)';
    const lic = args.license || '(license)';
    const url = args['source-url'] || '';
    console.log(
      `  §圖片來源:    ${C.cyan}- [${credit}](${url}) — ${lic}${C.nc}`,
    );
    console.log(
      `  授權矩陣 row: ${C.gry}| ${file} | ${credit} | ${lic} | ${url} | ${role} |${C.nc}`,
    );
  } else {
    console.log(
      `  ${C.yel}⚠ No --credit/--license/--source-url given, image source section needs manual completion (CC/fair-use must be labeled)${C.nc}`,
    );
  }
}

// ── check (validation gate, no file modification) ────────────────────────────
async function inspectFile(path, roleHint) {
  const abs =
    path.startsWith('/') && !path.startsWith(REPO_ROOT)
      ? join(REPO_ROOT, path.replace(/^\//, 'public/'))
      : path.startsWith('/')
        ? path
        : join(REPO_ROOT, path);
  // 接受 repo-relative 或 web-path /article-images/...
  let real = abs;
  try {
    await access(real);
  } catch {
    real = join(REPO_ROOT, 'public', path.replace(/^\//, ''));
  }
  const buf = await readFile(real);
  const fmt = sniffFormat(buf);
  const role =
    roleHint || (basename(real).includes('hero') ? 'hero' : 'inline');
  const v = [];
  // 格式白名單
  if (BANNED_STORE.has(fmt))
    v.push({
      sev: 'hard',
      msg: `Format ${fmt} banned from storage (must convert to webp/jpg/png)`,
    });
  else if (fmt === 'unknown')
    v.push({ sev: 'hard', msg: 'Cannot identify format (magic bytes)' });
  let dims = '';
  if (fmt !== 'svg' && fmt !== 'unknown') {
    try {
      const m = await sharp(buf).metadata();
      dims = `${m.width}×${m.height}`;
      const ar = +(m.width / m.height).toFixed(3);
      const [amin, amax] = ASPECT[role];
      if (ar < amin || ar > amax)
        v.push({
          sev: 'hard',
          msg: `aspect ${ar}（${role} 須 ${amin}–${amax}）`,
        });
      if (m.exif || m.iptc || m.xmp)
        v.push({
          sev: 'warn',
          msg: 'EXIF/metadata residual (recommend re-ingest to strip)',
        });
      const budget = SIZE_BUDGET[role];
      if (buf.length > budget)
        v.push({
          sev: 'hard',
          msg: `${kb(buf.length)} > ${kb(budget)} (${role} budget)`,
        });
    } catch (e) {
      v.push({ sev: 'hard', msg: `sharp read failed: ${e.message}` });
    }
  }
  if (fmt === 'svg' && buf.length > SVG_MAX)
    v.push({ sev: 'warn', msg: `SVG ${kb(buf.length)} > ${kb(SVG_MAX)}` });
  return {
    path: real.replace(REPO_ROOT + '/', ''),
    fmt,
    role,
    dims,
    size: buf.length,
    v,
  };
}

async function modeCheck(args) {
  const files = args._.slice(1);
  if (!files.length) {
    console.error(`${C.red}check requires at least one file path${C.nc}`);
    process.exit(2);
  }
  let hard = 0,
    warn = 0;
  for (const f of files) {
    let r;
    try {
      r = await inspectFile(f, args.role);
    } catch (e) {
      console.log(`${C.red}✗ ${f} — ${e.message}${C.nc}`);
      hard++;
      continue;
    }
    const mark = r.v.some((x) => x.sev === 'hard')
      ? C.red + '✗'
      : r.v.length
        ? C.yel + '⚠'
        : C.grn + '✓';
    console.log(
      `${mark} ${r.path}${C.nc}  ${C.gry}${r.fmt} ${r.dims} ${kb(r.size)} [${r.role}]${C.nc}`,
    );
    for (const x of r.v) {
      console.log(
        `    ${x.sev === 'hard' ? C.red : C.yel}${x.sev}: ${x.msg}${C.nc}`,
      );
      x.sev === 'hard' ? hard++ : warn++;
    }
  }
  console.log(
    `\n${hard ? C.red : C.grn}Validation: ${hard} hard / ${warn} warn${C.nc}`,
  );
  if (hard) process.exitCode = 1;
}

// ── audit (site-wide scan + WebP migration estimate) ─────────────────────────
async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(jpe?g|png|webp|svg|gif|bmp|tiff?|hei[cf])$/i.test(e.name))
      out.push(p);
  }
  return out;
}

async function modeAudit(args) {
  const base = args.cat ? join(IMG_ROOT, args.cat.toLowerCase()) : IMG_ROOT;
  const files = await walk(base);
  const byExt = {};
  let totalBytes = 0,
    nonWebpBytes = 0,
    nonWebpCount = 0,
    banned = 0,
    exifLeak = 0,
    oversize = 0,
    aspectBad = 0;
  const issues = [];
  for (const f of files) {
    const st = await stat(f);
    const ext = extname(f).slice(1).toLowerCase();
    byExt[ext] = (byExt[ext] || 0) + 1;
    totalBytes += st.size;
    const rel = f.replace(REPO_ROOT + '/', '');
    const role = basename(f).includes('hero') ? 'hero' : 'inline';
    if (
      ext === 'gif' ||
      ext === 'bmp' ||
      ext === 'tiff' ||
      ext === 'tif' ||
      ext === 'heic' ||
      ext === 'heif'
    ) {
      banned++;
      issues.push(`${C.red}banned${C.nc} ${rel}`);
    }
    if (!['webp', 'svg'].includes(ext)) {
      nonWebpCount++;
      nonWebpBytes += st.size;
    }
    if (ext !== 'svg') {
      try {
        const buf = await readFile(f);
        const m = await sharp(buf).metadata();
        if (m.exif || m.iptc || m.xmp) {
          exifLeak++;
        }
        const ar = m.width / m.height;
        const [amin, amax] = ASPECT[role];
        if (ar < amin || ar > amax) {
          aspectBad++;
        }
        if (st.size > SIZE_BUDGET[role]) {
          oversize++;
        }
      } catch {
        /* skip unreadable */
      }
    }
  }
  if (args.json) {
    console.log(
      JSON.stringify(
        {
          root: base.replace(REPO_ROOT + '/', ''),
          count: files.length,
          byExt,
          totalKB: Math.round(totalBytes / 1024),
          nonWebpCount,
          oversize,
          exifLeak,
          aspectBad,
          banned,
        },
        null,
        2,
      ),
    );
    return;
  }
  console.log(
    `${C.bold}📊 image audit — ${base.replace(REPO_ROOT + '/', '')}${C.nc}`,
  );
  console.log(
    `  Files: ${files.length}  Total size: ${(totalBytes / 1024 / 1024).toFixed(1)}MB`,
  );
  console.log(
    `  Format distribution: ${Object.entries(byExt)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}=${v}`)
      .join(' ')}`,
  );
  console.log(
    `  ${banned ? C.red : C.grn}Banned formats (GIF/BMP/TIFF/HEIC): ${banned}${C.nc}`,
  );
  console.log(
    `  ${oversize ? C.yel : C.grn}Over size budget: ${oversize}${C.nc}  ${aspectBad ? C.yel : C.grn}Aspect violations: ${aspectBad}${C.nc}  ${exifLeak ? C.yel : C.grn}EXIF residual: ${exifLeak}${C.nc}`,
  );
  console.log(
    `  ${C.cyan}WebP migration: non-webp ${nonWebpCount} files / ${(nonWebpBytes / 1024 / 1024).toFixed(1)}MB (converting to webp saves est. 25-35%)${C.nc}`,
  );
  if (issues.length) {
    console.log(`  ${C.gry}— banned 清單 —${C.nc}`);
    issues.slice(0, 20).forEach((i) => console.log(`    ${i}`));
  }
}

// ── dispatch ────────────────────────────────────────────────────────────────
const args = parseArgs(process.argv.slice(2));
const mode = args._[0];
const dispatch = { ingest: modeIngest, check: modeCheck, audit: modeAudit };
if (!dispatch[mode]) {
  console.error(
    `${C.bold}image-ingest.mjs${C.nc} — image post-processing SSOT\n` +
      `  modes: ${C.cyan}ingest${C.nc} (download+transform+store) / ${C.cyan}check${C.nc} (validation gate) / ${C.cyan}audit${C.nc} (site-wide scan)\n` +
      `  see header for usage.`,
  );
  process.exit(mode ? 2 : 0);
}
dispatch[mode](args).catch((e) => {
  console.error(`${C.red}${e.stack || e.message}${C.nc}`);
  process.exit(1);
});
