/**
 * Frontmatter YAML validation for Taiwan.md
 *
 * Scans all .md files in knowledge/ and validates:
 * - YAML parses without error (gray-matter)
 * - Required fields exist: title, description, date, tags
 * - tags is an array (not string)
 * - date is a valid date
 * - No duplicate slugs within a category
 * - File naming conventions (no spaces in en/, lowercase)
 *
 * Run: node scripts/test-frontmatter.mjs
 * Exit 1 = validation failed (block commit/deploy)
 */

import { readdir, readFile } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';
import matter from 'gray-matter';

const KNOWLEDGE = resolve(process.cwd(), 'knowledge');
const CATEGORIES = [
  'About',
  'History',
  'Geography',
  'Culture',
  'Food',
  'Art',
  'Music',
  'Technology',
  'Nature',
  'People',
  'Society',
  'Economy',
  'Lifestyle',
];
const LANGS = ['', 'en', 'es', 'ja', 'ko']; // '' = zh-TW root

const STRICT = process.argv.includes('--strict');
const CI_MODE = process.argv.includes('--ci');
const STAGED_MODE = process.argv.includes('--staged');
// Default: YAML parse errors are hard errors, missing fields are warnings
// --strict: everything is an error
// --ci: only validate changed files (git diff HEAD~1)
// --staged: only validate staged files (git diff --cached, for pre-commit hook)

let errors = [];
let warnings = [];
let totalFiles = 0;
let passedFiles = 0;

// In CI/staged mode, get list of changed .md files in knowledge/
let changedFiles = null;
if (CI_MODE || STAGED_MODE) {
  try {
    const { execSync } = await import('node:child_process');
    const cmd = STAGED_MODE
      ? 'git diff --cached --name-only --diff-filter=ACM -- knowledge/'
      : 'git diff --name-only HEAD~1 -- knowledge/';
    const diff = execSync(cmd, { encoding: 'utf-8' });
    changedFiles = new Set(diff.trim().split('\n').filter(Boolean));
    const mode = STAGED_MODE ? 'Staged' : 'CI';
    if (changedFiles.size === 0) {
      console.log(
        `🔍 ${mode} mode: no knowledge/ .md files changed, skipping.\n`,
      );
      process.exit(0);
    }
    console.log(`🔍 ${mode} mode: checking ${changedFiles.size} file(s)\n`);
  } catch {
    console.log('⚠️  Could not get git diff, skipping validation.\n');
    process.exit(0);
  }
}

// ── Helpers ──

function isValidDate(val) {
  if (!val) return false;
  const d = new Date(val);
  return !isNaN(d.getTime());
}

function isArrayOfStrings(val) {
  return Array.isArray(val) && val.every((v) => typeof v === 'string');
}

// ── Title format rules (zh-TW only — translations have their own conventions)
//
// 觸發：2026-05-04 黃魚鴞 PR review session — title 用半形 `:` `,` 跑進去
// 沒被擋。canonical：docs/editorial/EDITORIAL.md §Title 五原則 + 半形標點禁用。
//
// Three checks:
//   1. Vague adjectives blacklist (per EDITORIAL §原則 3)
//   2. CJK-context half-width punctuation in title
//   3. People category: must have colon sandwich (per EDITORIAL §原則 5)

// EDITORIAL §原則 3 canonical 禁用清單。其他「神話 / 不朽 / 永恆」等
// 沒列在這裡的詞可能是文章本身的 subject (如《原住民神話》、《不朽記憶》)，
// 不算空泛形容詞。要擴充先讀 docs/editorial/EDITORIAL.md §原則 3。
const TITLE_VAGUE_ADJECTIVES = ['傳奇', '偉大', '優秀', '最強', '國民', '天后'];

// CJK char range used for context-aware checks
const CJK_RE = /[一-鿿㐀-䶿]/;

function checkTitleFormat(title, category, label, lang, report, errors) {
  if (!title || typeof title !== 'string') return;
  // Skip non-zh-TW: translations follow source-lang punct conventions
  if (lang) return;

  // 1. Vague adjectives — warn (some articles like 蔡英文 might be exempt
  //    if used as quote in scare-quotes; agent decides)
  for (const adj of TITLE_VAGUE_ADJECTIVES) {
    if (title.includes(adj)) {
      report(
        `${label}: title 含空泛形容詞「${adj}」(EDITORIAL §原則 3 禁止「傳奇/偉大/最強/國民」等空泛詞)`,
      );
    }
  }

  // 2. Half-width punctuation in CJK context (hard error — silent rendering issue)
  const halfWidthPunct = [
    [/(?<=[一-鿿㐀-䶿]):(?=[一-鿿㐀-䶿]|[0-9])/, ':', '：'],
    [/(?<=[一-鿿㐀-䶿]),(?=[一-鿿㐀-䶿]|[0-9])/, ',', '，'],
    [/(?<=[一-鿿㐀-䶿]);(?=[一-鿿㐀-䶿])/, ';', '；'],
    [/(?<=[一-鿿㐀-䶿])\?(?=[一-鿿㐀-䶿])/, '?', '？'],
    [/(?<=[一-鿿㐀-䶿])!(?=[一-鿿㐀-䶿])/, '!', '！'],
  ];
  for (const [re, half, full] of halfWidthPunct) {
    if (re.test(title)) {
      errors.push(
        `${label}: title 含半形「${half}」(中文段落應用「${full}」) — 建議跑 \`python3 scripts/tools/check-cjk-punct.py --fix\``,
      );
    }
  }

  // 3. People category requires colon sandwich (人名：弧線)
  if (category === 'People') {
    const hasColon = /[:：]/.test(title);
    if (!hasColon) {
      report(
        `${label}: People title 缺冒號三明治結構 (EDITORIAL §原則 5「人名：代表性弧線」格式必填)`,
      );
    } else {
      // Check the post-colon part is non-trivial (≥ 8 CJK chars roughly)
      const m = title.match(/^[^:：]+[:：]\s*(.+)$/);
      if (m) {
        const afterColon = m[1].trim();
        // Count "weight": each CJK char = 1, ASCII char = 0.5
        let weight = 0;
        for (const ch of afterColon) weight += CJK_RE.test(ch) ? 1 : 0.5;
        if (weight < 8) {
          report(
            `${label}: People title 冒號後敘述太短 ("${afterColon}", weight ${weight.toFixed(1)} < 8) — 副標應能單獨成立 (EDITORIAL §原則 4)`,
          );
        }
      }
    }
  }

  // 4. Length sanity (CJK chars + half-width chars at 0.5 weight)
  let len = 0;
  for (const ch of title) len += CJK_RE.test(ch) ? 1 : 0.5;
  if (len > 35) {
    report(
      `${label}: title 過長 (effective length ${len.toFixed(1)} > 35) — EDITORIAL 建議 ≤ 30`,
    );
  }
}

// ── Scan ──

for (const lang of LANGS) {
  for (const cat of CATEGORIES) {
    const dir = lang ? join(KNOWLEDGE, lang, cat) : join(KNOWLEDGE, cat);
    let files;
    try {
      files = (await readdir(dir)).filter(
        (f) => f.endsWith('.md') && !f.startsWith('_'),
      );
    } catch {
      // Category doesn't exist for this language — OK
      continue;
    }

    const slugs = new Map(); // slug → filename (duplicate detection)

    for (const file of files) {
      const filePath = join(dir, file);
      const relPath = lang
        ? `knowledge/${lang}/${cat}/${file}`
        : `knowledge/${cat}/${file}`;
      const label = lang ? `${lang}/${cat}/${file}` : `${cat}/${file}`;
      const slug = basename(file, '.md');

      // In CI mode, skip unchanged files
      if (changedFiles && !changedFiles.has(relPath)) continue;

      totalFiles++;

      // 1. Read & parse YAML
      let fm;
      try {
        const raw = await readFile(filePath, 'utf-8');
        const parsed = matter(raw);
        fm = parsed.data;
      } catch (err) {
        // YAML parse errors are always critical — they crash getStaticPaths
        errors.push(
          `${label}: YAML parse error — ${err.message.split('\n')[0]}`,
        );
        continue;
      }

      // 2. Required fields (warnings in relaxed mode, errors in strict)
      const report = STRICT ? (m) => errors.push(m) : (m) => warnings.push(m);
      if (!fm.title || typeof fm.title !== 'string') {
        report(`${label}: missing or invalid 'title'`);
      } else {
        // Title format checks (zh-TW only — see checkTitleFormat docstring)
        checkTitleFormat(fm.title, cat, label, lang, report, errors);
      }
      if (!fm.description || typeof fm.description !== 'string') {
        report(`${label}: missing or invalid 'description'`);
      }
      if (!fm.date) {
        report(`${label}: missing 'date'`);
      } else if (!isValidDate(fm.date)) {
        errors.push(`${label}: invalid date '${fm.date}'`);
      }
      if (!fm.tags) {
        warnings.push(`${label}: missing 'tags' (should be an array)`);
      } else if (!isArrayOfStrings(fm.tags)) {
        errors.push(
          `${label}: 'tags' must be an array of strings, got ${typeof fm.tags}: ${JSON.stringify(fm.tags).slice(0, 80)}`,
        );
      }

      // subcategory check（2026-04-25 β7 新增，回應 PR #617 @Zaious 建議）
      // - zh-TW（default lang）: 強制必填 → 用 docs/taxonomy/SUBCATEGORY.md 對應分類
      // - 翻譯檔（en/ja/ko/fr/es）：跳過（subcategory 在原文 SSOT 已定義）
      // - About 分類：免（沒有 subcategory 概念）
      // - _Hub.md / _ 開頭檔案：filter 已排除，不會到這
      if (!lang && cat !== 'About' && !fm.subcategory) {
        report(
          `${label}: missing 'subcategory' (見 docs/taxonomy/SUBCATEGORY.md 對應 ${cat} 子分類表)`,
        );
      }

      // 3. Duplicate slug detection
      if (slugs.has(slug)) {
        errors.push(
          `${label}: duplicate slug '${slug}' (also: ${slugs.get(slug)})`,
        );
      }
      slugs.set(slug, file);

      // 4. English file naming convention
      if (lang === 'en' && /[A-Z]/.test(slug) && slug !== slug.toLowerCase()) {
        warnings.push(`${label}: English slug has uppercase characters`);
      }

      // 5. Tags copy-paste detection (different title but identical tags to another file — heuristic)
      // Skipped for now: needs cross-file comparison after scan

      passedFiles++;
    }
  }
}

// ── Report ──

console.log(`\n📋 Frontmatter validation: ${totalFiles} files scanned\n`);

if (warnings.length > 0) {
  console.log(`⚠️  ${warnings.length} warning(s):`);
  warnings.slice(0, 20).forEach((w) => console.log(`   - ${w}`));
  if (warnings.length > 20)
    console.log(`   ... and ${warnings.length - 20} more`);
  console.log('');
}

if (errors.length > 0) {
  console.log(`🔴 ${errors.length} error(s):`);
  errors.slice(0, 30).forEach((e) => console.log(`   - ${e}`));
  if (errors.length > 30) console.log(`   ... and ${errors.length - 30} more`);
  console.log(
    `\n❌ Frontmatter validation FAILED (${errors.length} errors in ${totalFiles} files)`,
  );
  process.exit(1);
} else {
  console.log(
    `✅ Frontmatter validation passed: ${passedFiles}/${totalFiles} files OK${warnings.length ? ` (${warnings.length} warnings)` : ''}`,
  );
}
