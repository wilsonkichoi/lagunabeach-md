/**
 * Unit tests for lib/audit.js — Stage 3.5 Hallucination Audit detectors.
 *
 * Run with: cd cli && npx vitest run
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractClaims,
  computeVerdict,
  AWARD_PATTERNS,
  NAME_NUMBER_PATTERNS,
  COCREATOR_PATTERNS,
} from '../src/lib/audit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadFixture(name) {
  const p = path.join(__dirname, 'fixtures', name);
  const raw = fs.readFileSync(p, 'utf8');
  // strip frontmatter for body-only analysis
  const m = raw.match(/^---\s*\n[\s\S]*?\n---\s*\n([\s\S]*)$/);
  return m ? m[1] : raw;
}

describe('fixtures sanity', () => {
  it('audit-clean.md references References', () => {
    const body = loadFixture('audit-clean.md');
    expect(body).toMatch(/## References/);
  });

  it('audit-dirty.md seeds all 5 patterns', () => {
    const body = loadFixture('audit-dirty.md');
    expect(body).toMatch(/62nd Annual Heritage Award/);
    expect(body).toMatch(/Kasper/);
    expect(body).toMatch(/Luxembourg/);
    expect(body).toMatch(/This is what the future looks like/);
    expect(body).toMatch(/co-founded a new foundation/);
  });
});

describe('extractClaims — dirty fixture', () => {
  const body = loadFixture('audit-dirty.md');
  const claims = extractClaims(body);

  it('flags award hallucinations', () => {
    expect(claims.award.length).toBeGreaterThanOrEqual(2);
    expect(
      claims.award.some((c) => c.text.includes('62nd Annual Heritage Award')),
    ).toBe(true);
    // No footnotes in dirty → severity should be high
    expect(claims.award.every((c) => c.severity === 'high')).toBe(true);
  });

  it('flags names + precise numbers', () => {
    expect(claims.nameNumber.length).toBeGreaterThanOrEqual(1);
    const hit = claims.nameNumber.find((c) => c.text.includes('Jediah'));
    expect(hit).toBeDefined();
    expect(hit.number).toBe('750');
    expect(hit.severity).toBe('high');
  });

  it('flags foreign city (Luxembourg) without nearby footnote', () => {
    expect(claims.location.some((c) => c.text === 'Luxembourg')).toBe(true);
  });

  it('flags direct quotes as warn', () => {
    expect(claims.quote.length).toBeGreaterThanOrEqual(2);
    expect(
      claims.quote.some((c) =>
        c.full.includes('This is what the future looks like'),
      ),
    ).toBe(true);
    // no footnote nearby → warn
    expect(claims.quote.some((c) => c.severity === 'warn')).toBe(true);
  });

  it('flags co-creator omission (co-founded without "with NAME")', () => {
    expect(claims.cocreator.length).toBeGreaterThanOrEqual(1);
    expect(
      claims.cocreator.some((c) =>
        c.text.includes('co-founded a new foundation'),
      ),
    ).toBe(true);
  });
});

describe('extractClaims — clean fixture', () => {
  const body = loadFixture('audit-clean.md');
  const claims = extractClaims(body);

  it('no award flags', () => {
    expect(claims.award.length).toBe(0);
  });
  it('no name-number flags', () => {
    expect(claims.nameNumber.length).toBe(0);
  });
  it('no co-creator flags', () => {
    expect(claims.cocreator.length).toBe(0);
  });
});

describe('computeVerdict', () => {
  it('dirty fixture → fail verdict with HIGH flags', () => {
    const body = loadFixture('audit-dirty.md');
    const v = computeVerdict(extractClaims(body));
    expect(v.status).toBe('fail');
    expect(v.exitCode).toBe(1);
    expect(v.highFlags).toBeGreaterThanOrEqual(3);
  });

  it('clean fixture → pass verdict (may have zero warnings)', () => {
    const body = loadFixture('audit-clean.md');
    const v = computeVerdict(extractClaims(body));
    expect(v.exitCode).toBe(0);
    expect(v.highFlags).toBe(0);
  });

  it('strict mode turns warnings into failures', () => {
    const synthetic = {
      award: [],
      nameNumber: [],
      location: [{ line: 1, text: 'Paris', severity: 'med' }],
      quote: [],
      cocreator: [],
    };
    expect(computeVerdict(synthetic, false).status).toBe('warn');
    expect(computeVerdict(synthetic, true).status).toBe('fail');
  });
});

describe('co-creator false-positive suppression', () => {
  it('suppresses when "with NAME" follows co-founded', () => {
    const body = 'She co-founded the gallery with Maria Chen in 1998.';
    const claims = extractClaims(body);
    expect(claims.cocreator.length).toBe(0);
  });

  it('does NOT suppress bare co-founded', () => {
    const body =
      'That same year he co-founded a new foundation, beginning to promote the cause.';
    const claims = extractClaims(body);
    expect(claims.cocreator.length).toBeGreaterThanOrEqual(1);
  });

  it('suppresses "X and Y co-founded" structure', () => {
    const body = 'Maria and Jane co-founded the festival together in 2005.';
    expect(extractClaims(body).cocreator.length).toBe(0);
  });
});

describe('raw pattern exports', () => {
  it('AWARD_PATTERNS matches canonical phrasings', () => {
    const samples = [
      'In 2024 she won the 62nd Annual Heritage Award',
      'She received the 37th Golden Bell Award for Best Host',
      'In 2019 he was awarded a notable prize',
    ];
    for (const s of samples) {
      const anyMatch = AWARD_PATTERNS.some((p) => {
        p.lastIndex = 0;
        return p.test(s);
      });
      expect(anyMatch).toBe(true);
    }
  });

  it('NAME_NUMBER_PATTERNS matches name + minutes', () => {
    const p = NAME_NUMBER_PATTERNS[0];
    p.lastIndex = 0;
    expect(
      p.test('Jediah Coleman spent 750 minutes on the final project'),
    ).toBe(true);
  });

  it('COCREATOR_PATTERNS matches bare co-founded', () => {
    const p = COCREATOR_PATTERNS[0];
    p.lastIndex = 0;
    expect(p.test('He co-founded an organization to support the cause.')).toBe(
      true,
    );
  });
});
