#!/usr/bin/env node
/**
 * CheckallKnowledge baseArticles是否includes「referenceData」或「Further Reading」paragraph
 * And是否includesat least一可點擊的 URL
 *
 * Usage: node scripts/check-references.mjs [--strict]
 * --strict: NonereferenceData的Articles會導致 exit code 1
 */

import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';

const KNOWLEDGE_DIR = join(process.cwd(), 'knowledge');
const STRICT = process.argv.includes('--strict');

// 匹配referenceDataparagraph的 pattern
const REF_PATTERNS = [
  /^##\s*(referenceData|reference文獻|DataSource|References?|Sources?|Further Reading|Further Reading)/im,
];

// 匹配 URL 的 pattern
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

  console.log(`\n📚 LagunaBeach.md referenceDataCheckreport`);
  console.log(`${'='.repeat(50)}`);
  console.log(`總Articles數: ${results.length}`);
  console.log(`✅ 有referenceData: ${results.length - missing.length}`);
  console.log(`❌ 缺referenceDataparagraph: ${noSection.length}`);
  console.log(`⚠️ 有paragraph但無 URL: ${noUrl.length}`);
  console.log(`${'='.repeat(50)}\n`);

  if (noSection.length > 0) {
    console.log(`❌ 缺少「referenceData」paragraph的Articles：`);
    noSection.forEach((r) => console.log(`   - ${r.path}`));
    console.log('');
  }

  if (noUrl.length > 0) {
    console.log(`⚠️ 有「referenceData」paragraph但None URL 的Articles：`);
    noUrl.forEach((r) => console.log(`   - ${r.path}`));
    console.log('');
  }

  const coverage = (
    ((results.length - missing.length) / results.length) *
    100
  ).toFixed(1);
  console.log(`📊 referenceDatacover率: ${coverage}%\n`);

  if (STRICT && missing.length > 0) {
    console.log('❌ STRICT Mode：有Articles缺少referenceData，CheckFailed');
    process.exit(1);
  }
}

main().catch(console.error);
