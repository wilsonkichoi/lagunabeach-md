#!/usr/bin/env node
/**
 * Check all knowledge base articles for "References" / "Further Reading" sections
 * and at least one clickable URL.
 *
 * Usage: node scripts/check-references.mjs [--strict]
 * --strict: articles missing references cause exit code 1
 */

import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';

const KNOWLEDGE_DIR = join(process.cwd(), 'knowledge');
const STRICT = process.argv.includes('--strict');

// Patterns matching reference sections (both EN and zh-TW headings)
const REF_PATTERNS = [
  /^##\s*(參考資料|參考文獻|資料來源|References?|Sources?|延伸閱讀|Further Reading)/im,
];

// URL pattern
const URL_PATTERN = /https?:\/\/[^\s)>\]]+/;

async function getAllMdFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllMdFiles(fullPath)));
    } else if (entry.name.endsWith('.md') && !entry.name.startsWith('_')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function checkFile(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const relPath = relative(process.cwd(), filePath);

  const hasRefSection = REF_PATTERNS.some((p) => p.test(content));
  const hasUrl = URL_PATTERN.test(content);

  return {
    path: relPath,
    hasRefSection,
    hasUrl,
    ok: hasRefSection && hasUrl,
  };
}

async function main() {
  const files = await getAllMdFiles(KNOWLEDGE_DIR);
  const results = await Promise.all(files.map(checkFile));

  const missing = results.filter((r) => !r.ok);
  const noSection = results.filter((r) => !r.hasRefSection);
  const noUrl = results.filter((r) => r.hasRefSection && !r.hasUrl);

  console.log(`\n📚 References check report`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Total articles: ${results.length}`);
  console.log(`✅ Has references: ${results.length - missing.length}`);
  console.log(`❌ Missing references section: ${noSection.length}`);
  console.log(`⚠️  Has section but no URL: ${noUrl.length}`);
  console.log(`${'='.repeat(50)}\n`);

  if (noSection.length > 0) {
    console.log(`❌ Articles missing references section:`);
    noSection.forEach((r) => console.log(`   - ${r.path}`));
    console.log('');
  }

  if (noUrl.length > 0) {
    console.log(`⚠️  Articles with references section but no URLs:`);
    noUrl.forEach((r) => console.log(`   - ${r.path}`));
    console.log('');
  }

  const coverage = (
    ((results.length - missing.length) / results.length) *
    100
  ).toFixed(1);
  console.log(`📊 References coverage: ${coverage}%\n`);

  if (STRICT && missing.length > 0) {
    console.log('❌ STRICT mode: articles missing references, check failed');
    process.exit(1);
  }
}

main().catch(console.error);
