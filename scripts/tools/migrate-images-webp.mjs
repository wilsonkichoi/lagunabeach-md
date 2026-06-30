#!/usr/bin/env node
/**
 * migrate-images-webp.mjs — Site-wideexisting圖 jpg/png → WebP 遷移（Cheyu 2026-06-13 拍板 §自主權邊界）。
 *
 * 1. public/article-images/**.{jpg,jpeg,png} → .webp（jpg lossy q82 / png lossless，清 EXIF，cap 2400w）
 * 2. 改寫all tracked 文characters檔（knowledge/** 6 語 + src/data + factory json…，exclude gitignored src/content/{lang}）
 * 裡指向「已轉檔那些圖」的 /article-images/...jpg|png → .webp（exact-path，restricted to converted set）
 * 3. --apply 才刪original raster + 寫檔；Default dry-run（handle --limit ，印 before/after + ref preview，零Write）
 *
 * SVG 不動（向量）。本 session 新生的 .webp 不動。
 *
 * Usage:
 * node scripts/tools/migrate-images-webp.mjs # dry-run 10
 * node scripts/tools/migrate-images-webp.mjs --limit 20 # dry-run 20
 * node scripts/tools/migrate-images-webp.mjs --apply # full轉 + 改 ref + 刪原檔
 *
 * Safety：apply 前先 commit（git revert 是退路）。apply 後跑 sync.sh + grep 殘留 .jpg/.png ref。
 */
import { readFile, writeFile, readdir, stat, unlink } from 'node:fs/promises';
import { join, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..', '..');
const IMG_ROOT = join(REPO, 'public', 'article-images');
const CAP = 2400;
const C = {
  red: '\x1b[0;31m',
  grn: '\x1b[0;32m',
  yel: '\x1b[0;33m',
  gry: '\x1b[0;90m',
  cyan: '\x1b[0;36m',
  bold: '\x1b[1m',
  nc: '\x1b[0m',
};
const kb = (b) => `${(b / 1024).toFixed(0)}KB`;

const apply = process.argv.includes('--apply');
const li = process.argv.indexOf('--limit');
const limit = li >= 0 ? parseInt(process.argv[li + 1]) : 10;

async function walk(d) {
  const out = [];
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(jpe?g|png)$/i.test(e.name)) out.push(p);
  }
  return out;
}

async function convert(file) {
  const buf = await readFile(file);
  const png = /\.png$/i.test(file);
  const meta = await sharp(buf).metadata();
  let pipe = sharp(buf).rotate();
  if (meta.width > CAP)
    pipe = pipe.resize({ width: CAP, withoutEnlargement: true });
  pipe = png
    ? pipe.webp({ lossless: true, effort: 5 })
    : pipe.webp({ quality: 82, effort: 5 });
  const out = await pipe.toBuffer();
  return {
    in: buf.length,
    out: out.length,
    buf: out,
    hadExif: !!(meta.exif || meta.iptc || meta.xmp),
  };
}

const webOld = (file) =>
  '/article-images/' + relative(IMG_ROOT, file).split(/[\\/]/).join('/');
const toWebp = (p) => p.replace(/\.(jpe?g|png)$/i, '.webp');

async function main() {
  const files = await walk(IMG_ROOT);
  console.log(
    `${C.bold}WebP 遷移 — ${files.length} raster（${apply ? 'APPLY' : 'DRY-RUN ' + Math.min(limit, files.length) + ' '}）${C.nc}`,
  );
  const targets = apply ? files : files.slice(0, limit);

  let sumIn = 0,
    sumOut = 0,
    exif = 0,
    fail = 0;
  const map = new Map(); // webOld → webNew
  for (const f of targets) {
    try {
      const r = await convert(f);
      sumIn += r.in;
      sumOut += r.out;
      if (r.hadExif) exif++;
      const wo = webOld(f),
        wn = toWebp(wo);
      map.set(wo, wn);
      const pct = ((1 - r.out / r.in) * 100).toFixed(0);
      console.log(
        `  ${pct >= 0 ? C.grn : C.yel}${kb(r.in)}→${kb(r.out)} (${pct}%)${C.nc} ${C.gry}${r.hadExif ? 'EXIF✗ ' : ''}${C.nc}${wn}`,
      );
      if (apply) {
        await writeFile(join(REPO, 'public', wn.replace(/^\//, '')), r.buf);
      }
    } catch (e) {
      fail++;
      console.log(`  ${C.red}✗ ${webOld(f)} — ${e.message}${C.nc}`);
    }
  }
  console.log(
    `\n ${C.bold}轉檔：${sumIn ? (sumIn / 1048576).toFixed(1) : 0}MB → ${(sumOut / 1048576).toFixed(1)}MB（省 ${sumIn ? ((1 - sumOut / sumIn) * 100).toFixed(0) : 0}%）/ EXIF 清 ${exif} / fail ${fail}${C.nc}`,
  );

  // ── ref rewrite ──
  const tracked = execFileSync('git', ['ls-files'], {
    cwd: REPO,
    encoding: 'utf-8',
  })
    .split('\n')
    .filter(Boolean)
    .filter((f) => /\.(md|json|astro|ts|js|mjs|mdx)$/i.test(f))
    .filter((f) => !/^src\/content\/(zh-TW|en|ja|ko|fr|es)\//.test(f));
  const reImg = /\/article-images\/[^"')\s\]>]+?\.(?:jpe?g|png)/gi;
  let filesTouched = 0,
    refsChanged = 0;
  const sampleChanges = [];
  for (const rel of tracked) {
    let content;
    try {
      content = await readFile(join(REPO, rel), 'utf-8');
    } catch {
      continue;
    }
    if (!content.includes('/article-images/')) continue;
    let n = 0;
    const next = content.replace(reImg, (m) => {
      if (map.has(m)) {
        n++;
        const nw = toWebp(m);
        if (sampleChanges.length < 8)
          sampleChanges.push(`${rel}: …${m.slice(-40)} → .webp`);
        return nw;
      }
      return m;
    });
    if (n > 0) {
      refsChanged += n;
      filesTouched++;
      if (apply) await writeFile(join(REPO, rel), next);
    }
  }
  console.log(
    ` ${C.bold}ref 改寫：${refsChanged} 處 / ${filesTouched} 檔${C.nc}（scan ${tracked.length} tracked text files）`,
  );
  sampleChanges.forEach((s) => console.log(`    ${C.gry}${s}${C.nc}`));

  if (apply) {
    let del = 0;
    for (const f of targets) {
      try {
        await unlink(f);
        del++;
      } catch {}
    }
    console.log(` ${C.bold}刪original raster：${del}${C.nc}`);
    console.log(
      `\n ${C.cyan}next step：bash scripts/core/sync.sh && grep -rlE '/article-images/[^")\\s]+\\.(jpe?g|png)' knowledge/ src/data/ | head（should be空）${C.nc}`,
    );
  } else {
    console.log(
      `\n ${C.yel}DRY-RUN：未寫any檔。--apply 才真轉 + 改 ref + 刪原檔。${C.nc}`,
    );
  }
}
main().catch((e) => {
  console.error(`${C.red}${e.stack}${C.nc}`);
  process.exit(1);
});
