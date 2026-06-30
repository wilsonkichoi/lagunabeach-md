#!/usr/bin/env node
/**
 * extract-build-perf.mjs — fetch build performance trend from GitHub Actions API
 *
 * Why: over 12 days (2026-04-21 to 2026-05-03), per-page render time rose from
 * 98ms to 167ms (+70%) with nobody noticing until asked "why is it slower?".
 * Root cause: build performance wasn't in the dashboard freshness check scope.
 * This script extracts build time data from GitHub Actions deploy runs, parses
 * average ms/page, and writes to dashboard-build-perf.json.
 *
 * REFLEXES #15: "instrument recurring patterns" applied to build perf silent regression.
 *
 * Non-blocking: API call failure / missing token → soft skip (avoids SSOT
 * freshness verify failing due to transient GH API outage).
 *
 * Usage:
 *   node scripts/core/extract-build-perf.mjs                  # default 30 runs
 *   node scripts/core/extract-build-perf.mjs --runs 60        # last 60 deploys
 *   GH_TOKEN=xxx node scripts/core/extract-build-perf.mjs     # auth (5000/hr vs 60/hr)
 *
 * Output: public/api/dashboard-build-perf.json
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO = join(__dirname, '../..');
const OUT_PATH = join(REPO, 'public/api/dashboard-build-perf.json');

const args = process.argv.slice(2);
const runsIdx = args.indexOf('--runs');
const N_RUNS = runsIdx >= 0 ? parseInt(args[runsIdx + 1], 10) : 30;

// ── Helpers ─────────────────────────────────────────────────────────────────
function ghApi(path) {
  // gh CLI is simpler than fetch + token, already authenticated.
  // If gh unavailable, fall back to anonymous fetch (60/hr rate limit).
  try {
    const out = execSync(`gh api "${path}" 2>/dev/null`, {
      encoding: 'utf-8',
      maxBuffer: 50 * 1024 * 1024,
    });
    return JSON.parse(out);
  } catch (e) {
    return null;
  }
}

function parseDuration(seconds) {
  return Math.round(seconds);
}

// ── Step 1: list recent deploy.yml runs ─────────────────────────────────────
function fetchRuns() {
  // workflow file path: .github/workflows/deploy.yml
  // gh api: /repos/:owner/:repo/actions/workflows/deploy.yml/runs
  const resp = ghApi(
    `/repos/frank890417/taiwan-md/actions/workflows/deploy.yml/runs?per_page=${N_RUNS}&status=completed`,
  );
  if (!resp || !resp.workflow_runs) {
    console.error(
      '⚠️  Cannot fetch GitHub Actions runs (gh CLI failed or no auth)',
    );
    return [];
  }
  return resp.workflow_runs.filter((r) => r.conclusion === 'success');
}

// ── Step 2: per run: fetch build job timing log ─────────────────────────────
// Each run has build job + deploy job. We only look at build.
// From jobs API, get build job's started_at / completed_at + step details.
function fetchJobs(runId) {
  const resp = ghApi(`/repos/frank890417/taiwan-md/actions/runs/${runId}/jobs`);
  if (!resp || !resp.jobs) return null;
  return resp.jobs.find((j) => j.name === 'build') ?? null;
}

// ── Step 3: parse build job → { build_seconds, ms_per_page, page_count } ─────
// page_count parsed from build step log ("Pages built: NNNN").
// Not always available (log may be expired by GitHub), use build_seconds as fallback.
function jobToMetrics(job) {
  if (!job || !job.started_at || !job.completed_at) return null;
  const startMs = Date.parse(job.started_at);
  const endMs = Date.parse(job.completed_at);
  const totalSeconds = parseDuration((endMs - startMs) / 1000);

  // Only count "Build" step for fairness (other steps like checkout / OG generate
  // are unrelated to per-page render time).
  let buildStepSeconds = null;
  if (job.steps) {
    const buildStep = job.steps.find(
      (s) => s.name === 'Build' || s.name === 'build',
    );
    if (buildStep && buildStep.started_at && buildStep.completed_at) {
      buildStepSeconds = parseDuration(
        (Date.parse(buildStep.completed_at) -
          Date.parse(buildStep.started_at)) /
          1000,
      );
    }
  }

  return {
    run_id: job.run_id,
    started_at: job.started_at,
    total_job_seconds: totalSeconds,
    build_step_seconds: buildStepSeconds,
    conclusion: job.conclusion,
    html_url: job.html_url,
  };
}

// ── Step 4: estimate page count from current build (fallback) ────────────────
// Real page count is in the build log (may expire). When unavailable, use
// last successful run's sitemap.xml URL count as approximation.
function estimatePageCountFromSitemap() {
  const sitemapPath = join(REPO, 'dist/sitemap-index.xml');
  if (!existsSync(sitemapPath)) return null;
  // sitemap-index points to multiple sitemap-*.xml files. Simplified: use main sitemap-0.xml
  try {
    const sitemapMain = join(REPO, 'dist/sitemap-0.xml');
    if (!existsSync(sitemapMain)) return null;
    // grep -c counts "lines" — sitemap is single-line XML, always returns 1 → ms_per_page
    // showed bogus 1099000 data for a long time (2026-06-10 audit hotspot #6). Count matches instead.
    const out = execSync(`grep -o '<url>' "${sitemapMain}" | wc -l`, {
      encoding: 'utf-8',
    });
    return parseInt(out.trim(), 10);
  } catch {
    return null;
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
function main() {
  // 2026-06-10 audit #6: skip in CI — 31 serial gh api calls = ~8s pure network
  // on the build critical path, and CI doesn't need to re-fetch (JSON is git-tracked,
  // local refresh routine updates daily). Set FORCE_BUILD_PERF=1 to force in CI.
  if (process.env.GITHUB_ACTIONS === 'true' && !process.env.FORCE_BUILD_PERF) {
    console.log(
      '⏭️  CI env: skip build-perf scrape (using git-tracked data in repo)',
    );
    return 0;
  }
  console.log(`📊 build-perf scrape (last ${N_RUNS} deploy runs)...`);

  const runs = fetchRuns();
  if (runs.length === 0) {
    // Soft fail: write last-known + skip flag, don't break prebuild.
    writeFileSync(
      OUT_PATH,
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          status: 'unavailable',
          reason:
            'GitHub Actions API no auth or temporarily unavailable; is gh CLI installed?',
          runs: [],
        },
        null,
        2,
      ),
    );
    console.log(
      '⚠️  GH API unavailable — soft skip, writing status:unavailable',
    );
    return 0;
  }

  console.log(`   ✓ ${runs.length} runs fetched`);

  const metrics = [];
  for (const run of runs) {
    const job = fetchJobs(run.id);
    const m = jobToMetrics(job);
    if (m) metrics.push(m);
  }

  console.log(`   ✓ ${metrics.length}/${runs.length} build jobs parsed`);

  // Aggregate
  const buildSecs = metrics
    .map((m) => m.build_step_seconds ?? m.total_job_seconds)
    .filter((s) => s != null);
  // 2026-06-10 audit #6: previous slice(0,7/30) was "last 7/30 runs" (~15 runs/day
  // → the so-called 30d avg was actually < 1 day). Changed to real started_at time
  // window filtering; coverage_days reveals how many days the fetched runs span.
  const now = Date.now();
  const secsWithin = (days) =>
    metrics
      .filter(
        (m) =>
          m.started_at && now - Date.parse(m.started_at) <= days * 86400_000,
      )
      .map((m) => m.build_step_seconds ?? m.total_job_seconds)
      .filter((s) => s != null);
  const last7 = secsWithin(7);
  const last30 = secsWithin(30);
  const oldest = metrics[metrics.length - 1]?.started_at;
  const coverageDays = oldest
    ? Math.round(((now - Date.parse(oldest)) / 86400_000) * 10) / 10
    : null;

  const avg = (arr) =>
    arr.length === 0
      ? null
      : Math.round(arr.reduce((s, x) => s + x, 0) / arr.length);

  // Page count estimate (current build only)
  const currentPageCount = estimatePageCountFromSitemap();

  // Per-page estimate: latest build's build_step_seconds / page_count
  // (page_count varies across runs; simplest approximation)
  let msPerPage = null;
  if (currentPageCount && metrics[0]?.build_step_seconds) {
    msPerPage = Math.round(
      (metrics[0].build_step_seconds * 1000) / currentPageCount,
    );
  }

  const output = {
    generated_at: new Date().toISOString(),
    status: 'ok',
    summary: {
      latest_build_seconds: buildSecs[0] ?? null,
      avg_build_seconds_7d: avg(last7),
      avg_build_seconds_30d: avg(last30),
      current_page_count: currentPageCount,
      // Actual days covered by fetched runs (< 7 means 7d/30d avg only spans this many days)
      coverage_days: coverageDays,
      ms_per_page_latest: msPerPage,
      // Threshold: per-page > 50ms = flag for dashboard alert.
      // 2026-06-13 tightened 200→50: after article refactor (git subprocesses ×4,697→6),
      // new baseline is Build step 125s / 8,437 pages = ~15ms/page; 50ms = 3.3x
      // headroom, catches "expensive operation in per-render scope" bugs on the first
      // build (old threshold 200 required 13x degradation to trigger).
      flag_slow: msPerPage != null && msPerPage > 50,
    },
    trend: metrics.map((m) => ({
      run_id: m.run_id,
      started_at: m.started_at,
      build_seconds: m.build_step_seconds ?? m.total_job_seconds,
      url: m.html_url,
    })),
  };

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(output, null, 2));

  console.log(`   ✓ ${OUT_PATH}`);
  console.log(`   → latest build: ${output.summary.latest_build_seconds}s`);
  console.log(
    `   → 7d avg:       ${output.summary.avg_build_seconds_7d}s (coverage ${coverageDays ?? '?'}d)`,
  );
  console.log(`   → 30d avg:      ${output.summary.avg_build_seconds_30d}s`);
  console.log(
    `   → ms/page:      ${output.summary.ms_per_page_latest ?? 'n/a'} ${output.summary.flag_slow ? '⚠️  > 200ms threshold' : ''}`,
  );

  return 0;
}

process.exit(main());
