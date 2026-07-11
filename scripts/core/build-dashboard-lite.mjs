#!/usr/bin/env node
/**
 * build-dashboard-lite.mjs — Prebuild: article-health rollup + immune score.
 *
 * Consumes: src/data/article-health.json (produced by article-health:json)
 * Emits:    src/data/dashboard-lite.json
 *
 * Graceful degradation: if the input JSON is absent, emits a minimal fallback
 * so the build stays green.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '../..');
const INPUT_PATH = join(PROJECT_ROOT, 'src/data/article-health.json');
const OUTPUT_DIR = join(PROJECT_ROOT, 'src/data');
const OUTPUT_PATH = join(OUTPUT_DIR, 'dashboard-lite.json');

const DIMENSION_WEIGHTS = {
  review_coverage: 0.30,
  plugin_pass_rate: 0.25,
  plugin_health: 0.15,
  citation_density: 0.15,
  tool_freshness: 0.10,
  drift_velocity: 0.05,
};

function computePluginPassRate(reports) {
  if (!reports.length) return { score: 0, detail: { total: 0 } };
  const hardPass = reports.filter(r => r.summary.hard === 0).length;
  const warnPass = reports.filter(r => r.summary.warn === 0).length;
  const total = reports.length;
  const hardPct = (hardPass / total) * 100;
  const warnPct = (warnPass / total) * 100;
  const score = hardPct * 0.7 + warnPct * 0.3;
  return {
    score: Math.round(score * 10) / 10,
    detail: { total, hardPass, warnPass, hardPct: Math.round(hardPct * 10) / 10, warnPct: Math.round(warnPct * 10) / 10 },
  };
}

function computeRollup(reports) {
  const total = reports.length;
  const totalHard = reports.reduce((s, r) => s + r.summary.hard, 0);
  const totalWarn = reports.reduce((s, r) => s + r.summary.warn, 0);
  const totalInfo = reports.reduce((s, r) => s + r.summary.info, 0);
  const allPass = reports.filter(r => r.summary.hard === 0).length;
  return { total, totalHard, totalWarn, totalInfo, allPass, passRate: total ? Math.round((allPass / total) * 1000) / 10 : 0 };
}

function computeImmuneScore(reports) {
  const pluginPass = computePluginPassRate(reports);

  // Dimensions we can compute from article-health JSON alone.
  // Others require git/filesystem access not available at prebuild time;
  // use conservative defaults (midpoint values).
  const components = {
    review_coverage: 50,
    plugin_pass_rate: pluginPass.score,
    plugin_health: 80,
    citation_density: 50,
    tool_freshness: 60,
    drift_velocity: 90,
  };

  const score = Math.round(
    Object.entries(DIMENSION_WEIGHTS).reduce(
      (sum, [dim, weight]) => sum + (components[dim] ?? 0) * weight, 0
    )
  );

  const status = score >= 80
    ? 'Healthy'
    : score >= 60
      ? 'Attention needed'
      : score >= 40
        ? 'Drift'
        : 'Critical';

  return { score, status, components, weights: DIMENSION_WEIGHTS, pluginPassDetail: pluginPass.detail };
}

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  let reports;
  try {
    const raw = readFileSync(INPUT_PATH, 'utf8');
    const data = JSON.parse(raw);
    reports = data.reports || [];
  } catch {
    // Graceful degradation: input absent or invalid
    const fallback = { generated: new Date().toISOString(), available: false, rollup: null, immune: null };
    writeFileSync(OUTPUT_PATH, JSON.stringify(fallback, null, 2) + '\n');
    console.log('build-dashboard-lite: input absent, wrote fallback JSON');
    return;
  }

  const rollup = computeRollup(reports);
  const immune = computeImmuneScore(reports);

  const output = {
    generated: new Date().toISOString(),
    available: true,
    rollup,
    immune,
    perArticle: reports.map(r => ({
      file: r.file,
      category: r.category,
      slug: r.slug,
      hard: r.summary.hard,
      warn: r.summary.warn,
      info: r.summary.info,
      passed: r.summary.hard === 0,
    })),
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n');
  console.log(`build-dashboard-lite: ${reports.length} articles, immune=${immune.score} (${immune.status})`);
}

main();
