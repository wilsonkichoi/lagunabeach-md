/**
 * triage.test.mjs — classify.mjs 純函式測試。
 * 跑：node --test scripts/feedback/triage.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  detectSpam,
  resolveType,
  buildIssue,
  dedupeKey,
  isDuplicate,
  triageBatch,
} from './lib/classify.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const seed = JSON.parse(readFileSync(join(here, 'seed-feedback.json'), 'utf8'));
const byId = (id) => seed.find((r) => r.id.startsWith(id));

test('detectSpam flags the obvious spam row', () => {
  const spam = byId('4444');
  const r = detectSpam(spam);
  assert.equal(r.isSpam, true);
  assert.ok(r.score >= 3);
});

test('detectSpam passes a genuine correction', () => {
  const ok = byId('1111');
  assert.equal(detectSpam(ok).isSpam, false);
});

test('resolveType trusts the reader-selected type', () => {
  assert.equal(resolveType(byId('1111')), 'content');
  assert.equal(resolveType(byId('2222')), 'bug');
  assert.equal(resolveType(byId('3333')), 'newtopic');
});

test('resolveType infers when type missing', () => {
  assert.equal(resolveType({ body: '這裡連結壞掉了 404' }), 'bug');
  assert.equal(resolveType({ body: '日期有誤,應為 1993' }), 'content');
  assert.equal(resolveType({ body: '想看更多關於台灣茶的文章' }), 'newtopic');
  assert.equal(
    resolveType({ body: '無關鍵字', correct_info: '正確版本' }),
    'content',
  );
});

test('buildIssue maps content → fact-correction template + labels', () => {
  const iss = buildIssue(byId('1111'));
  assert.equal(iss.type, 'content');
  assert.match(iss.title, /^\[Fact Check\] 李安$/);
  assert.deepEqual(iss.labels, ['needs-verification', 'from-feedback']);
  assert.match(iss.body, /哪裡有誤/);
  assert.match(iss.body, /正確資訊/);
});

test('buildIssue maps bug → bug template + labels', () => {
  const iss = buildIssue(byId('2222'));
  assert.equal(iss.type, 'bug');
  assert.match(iss.title, /^\[Bug\] /);
  assert.deepEqual(iss.labels, ['bug', 'from-feedback']);
});

test('buildIssue maps newtopic → article template + labels', () => {
  const iss = buildIssue(byId('3333'));
  assert.equal(iss.type, 'newtopic');
  assert.match(iss.title, /^\[Article\] /);
  assert.deepEqual(iss.labels, ['content', 'from-feedback']);
});

test('issue body carries display_name + feedback id but NEVER email', () => {
  for (const row of seed) {
    const iss = buildIssue(row);
    assert.match(iss.body, /feedback id:/);
    // 沒有任何 email 形狀的字串混進 issue body
    assert.doesNotMatch(
      iss.body,
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
      `email leaked in issue for ${row.id}`,
    );
  }
});

test('blank display_name falls back to 匿名讀者 in provenance', () => {
  const iss = buildIssue(byId('2222')); // display_name === ''
  assert.match(iss.body, /回報者：匿名讀者/);
});

test('dedupeKey is stable for the same logical report', () => {
  assert.equal(dedupeKey(byId('1111')), dedupeKey(byId('5555')));
});

test('isDuplicate catches an already-filed feedback id', () => {
  const row = byId('1111');
  const built = buildIssue(row);
  assert.equal(
    isDuplicate(row, [{ title: built.title, body: built.body }]),
    true,
  );
  assert.equal(isDuplicate(row, [{ title: 'unrelated', body: 'nope' }]), false);
});

test('triageBatch: file genuine, reject spam, skip in-batch dup', () => {
  const results = triageBatch(seed, []);
  const decisions = Object.fromEntries(
    results.map((r) => [r.row.id.slice(0, 4), r.decision]),
  );
  assert.equal(decisions['1111'], 'file'); // genuine content
  assert.equal(decisions['2222'], 'file'); // genuine bug
  assert.equal(decisions['3333'], 'file'); // genuine newtopic
  assert.equal(decisions['4444'], 'reject'); // spam
  assert.equal(decisions['5555'], 'skip'); // duplicate of 1111 in same batch

  const filed = results.filter((r) => r.decision === 'file');
  assert.equal(filed.length, 3);
});
