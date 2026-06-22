/**
 * lib/audit.js — Stage 3.5 Hallucination Audit detectors
 *
 * Pure functions for pattern detection. Extracted from commands/audit.js
 * so vitest can import and unit-test them directly.
 *
 * Reference: MANIFESTO §10 anti-hallucination iron rule + REWRITE-PIPELINE Stage 3.5.
 * 5 hallucination patterns:
 *   1. Award hallucination
 *   2. Names + precise numbers
 *   3. Location displacement
 *   4. Fabricated direct quotes
 *   5. Co-creator omission
 */

export const AWARD_PATTERNS = [
  // "won the Nth annual X award" / "Nth X Award"
  /\bthe\s+\d+(?:st|nd|rd|th)\s+(?:annual\s+)?[^.\n]{0,40}?\b(?:Award|Medal|Prize|Hall of Fame)\b/gi,
  // "received / won / was awarded ... Award/Medal/Prize"
  /\b(?:received|won|was awarded|earned)\s+(?:the\s+)?[^.\n]{0,40}?\b(?:Award|Medal|Prize|Hall of Fame)\b/gi,
  // "in YYYY ... won/received ... Award"
  /\bin\s+\d{4}[^.\n]{0,30}?\b(?:won|received|was awarded|earned)\b[^.\n]{0,30}?\b(?:Award|Medal|Prize|Hall of Fame)\b/gi,
];

export const NAME_NUMBER_PATTERNS = [
  // Capitalized name + precise duration in minutes/hours within one sentence
  /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)[\s\S]{1,80}?(\d{2,4})\s*(?:mins?|minutes|hours?)\b/g,
  // Capitalized name + "spent N semesters/weeks/years/times with"
  /([A-Z][a-z]+)[\s\S]{0,40}?spent[\s\S]{0,15}?(\d+)\s*(?:semesters?|weeks?|years?|times)\b/gi,
];

export const FOREIGN_CITIES = [
  'Luxembourg',
  'Milan',
  'Paris',
  'Berlin',
  'London',
  'New York',
  'Tokyo',
  'Seoul',
  'Amsterdam',
  'Stockholm',
  'Vienna',
  'Zurich',
  'Brussels',
  'Copenhagen',
  'Helsinki',
  'Prague',
  'Warsaw',
  'Athens',
  'Rome',
];

export const QUOTE_PATTERNS = [/[""]([^""]{15,200})[""]|"([^"]{15,200})"/g];

export const COCREATOR_PATTERNS = [
  /\bco-founded\s+[^.\n]{0,60}/gi,
  /\bco-created\s+[^.\n]{0,60}/gi,
  /\bjointly\s+founded\s+[^.\n]{0,60}/gi,
];

/** Line number (1-indexed) for a byte offset in body. */
export function getLineNumber(body, matchIndex) {
  return body.slice(0, matchIndex).split('\n').length;
}

/** True if body has [^N] footnote within `window` chars around matchIndex. */
export function hasNearbyFootnote(body, matchIndex, windowSize = 200) {
  const start = Math.max(0, matchIndex - windowSize);
  const end = Math.min(body.length, matchIndex + windowSize);
  return /\[\^[\w-]+\]/.test(body.slice(start, end));
}

/**
 * Extract all potentially hallucinated claims from an article body.
 * Returns a grouped claim object keyed by pattern type.
 */
export function extractClaims(body) {
  const claims = {
    award: [],
    nameNumber: [],
    location: [],
    quote: [],
    cocreator: [],
  };

  for (const pattern of AWARD_PATTERNS) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(body)) !== null) {
      const line = getLineNumber(body, m.index);
      const hasFootnote = hasNearbyFootnote(body, m.index);
      claims.award.push({
        line,
        text: m[0].trim(),
        hasFootnote,
        severity: hasFootnote ? 'warn' : 'high',
      });
    }
  }

  for (const pattern of NAME_NUMBER_PATTERNS) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(body)) !== null) {
      const line = getLineNumber(body, m.index);
      const hasFootnote = hasNearbyFootnote(body, m.index);
      claims.nameNumber.push({
        line,
        text: m[0].trim().slice(0, 100),
        name: m[1],
        number: m[2],
        hasFootnote,
        severity: hasFootnote ? 'warn' : 'high',
      });
    }
  }

  for (const city of FOREIGN_CITIES) {
    const regex = new RegExp(city, 'g');
    let m;
    while ((m = regex.exec(body)) !== null) {
      const line = getLineNumber(body, m.index);
      const hasFootnote = hasNearbyFootnote(body, m.index, 150);
      if (!hasFootnote) {
        claims.location.push({
          line,
          text: city,
          context: body.slice(Math.max(0, m.index - 30), m.index + 30).trim(),
          severity: 'med',
        });
      }
    }
  }

  for (const pattern of QUOTE_PATTERNS) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(body)) !== null) {
      const line = getLineNumber(body, m.index);
      const hasFootnote = hasNearbyFootnote(body, m.index, 100);
      claims.quote.push({
        line,
        text: m[0].slice(0, 60) + (m[0].length > 60 ? '...」' : ''),
        full: m[0],
        hasFootnote,
        severity: hasFootnote ? 'info' : 'warn',
      });
    }
  }

  for (const pattern of COCREATOR_PATTERNS) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(body)) !== null) {
      const line = getLineNumber(body, m.index);
      // Suppress if "with NAME" appears nearby (co-founder is named, not omitted)
      const contextAfter = body.slice(m.index, m.index + 80);
      const contextBefore = body.slice(Math.max(0, m.index - 40), m.index);
      if (
        /\bwith\s+[A-Z][a-z]+/.test(contextAfter) ||
        /[A-Z][a-z]+\s+and\s+[A-Z][a-z]+\s*$/.test(contextBefore)
      ) {
        continue;
      }
      claims.cocreator.push({
        line,
        text: m[0].trim(),
        severity: 'high',
      });
    }
  }

  return claims;
}

/** Compute pass/warn/fail verdict from claim counts. */
export function computeVerdict(claims, strict = false) {
  const highFlags =
    claims.award.filter((c) => c.severity === 'high').length +
    claims.nameNumber.filter((c) => c.severity === 'high').length +
    claims.cocreator.filter((c) => c.severity === 'high').length;
  const warnFlags =
    claims.award.filter((c) => c.severity === 'warn').length +
    claims.nameNumber.filter((c) => c.severity === 'warn').length +
    claims.quote.filter((c) => c.severity === 'warn').length +
    claims.location.length;

  if (highFlags > 0) {
    return {
      status: 'fail',
      label: '❌ HIGH-severity flags detected — do not merge',
      exitCode: 1,
      highFlags,
      warnFlags,
    };
  }
  if (strict && warnFlags > 0) {
    return {
      status: 'fail',
      label: '⚠️  Strict mode: warnings treated as failures',
      exitCode: 1,
      highFlags,
      warnFlags,
    };
  }
  if (warnFlags > 0) {
    return {
      status: 'warn',
      label: '⚠️  Warnings — review before merge',
      exitCode: 0,
      highFlags,
      warnFlags,
    };
  }
  return {
    status: 'pass',
    label: '✅ No hallucination patterns detected',
    exitCode: 0,
    highFlags,
    warnFlags,
  };
}
