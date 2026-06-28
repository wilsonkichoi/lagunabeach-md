/**
 * feedback.mjs — Feedback subsystem config (client-side, inlined by Vite at build).
 *
 * Design: feedback is an "isolated failure domain." This file only decides which
 * backend the widget uses + degradation behavior. Errors must never bubble to main
 * site render. All values are PUBLIC (anon key is designed to be public; real
 * permissions enforced by Supabase RLS; service key never enters frontend).
 *
 * Modes (PUBLIC_FEEDBACK_MODE):
 *   - 'off'         → widget does not appear at all
 *   - 'github-only' → shows a single "Report via GitHub" button (pure static fallback, zero backend, always safe)
 *   - 'mock'        → uses in-browser MockBackend (localStorage), for preview / e2e testing
 *   - 'supabase'    → production backend (requires PUBLIC_SUPABASE_URL + PUBLIC_SUPABASE_ANON_KEY)
 *
 * Default 'github-only': safe to ship to production before Wilson provisions Supabase
 * (reader clicks feedback → goes to existing GitHub issue template). After Wilson
 * ratifies, set PUBLIC_FEEDBACK_MODE=supabase + two keys to go live; no main-site build changes needed.
 */

// Vite/Astro injects import.meta.env; falls back to empty object when running directly in node.
const env =
  (typeof import.meta !== 'undefined' && import.meta && import.meta.env) || {};

export const FEEDBACK_MODE = env.PUBLIC_FEEDBACK_MODE || 'github-only';

export const SUPABASE_URL = env.PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = env.PUBLIC_SUPABASE_ANON_KEY || '';

/** Enabled auth providers (order = UI display order). email always as fallback (collects email + no external OAuth app needed). */
export const FEEDBACK_PROVIDERS = (
  env.PUBLIC_FEEDBACK_PROVIDERS || 'google,github,email'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const GITHUB_REPO = 'wilsonkichoi/lagunabeach-md';
export const GITHUB_NEW_ISSUE_URL = `https://github.com/${GITHUB_REPO}/issues/new/choose`;

/**
 * Resolve the effective backend kind (safely degrades "set supabase mode but
 * missing keys" half-configured state to github-only).
 */
export function resolveBackendKind() {
  if (FEEDBACK_MODE === 'off') return 'off';
  if (FEEDBACK_MODE === 'mock') return 'mock';
  if (FEEDBACK_MODE === 'supabase') {
    return SUPABASE_URL && SUPABASE_ANON_KEY ? 'supabase' : 'github-only';
  }
  return 'github-only';
}
