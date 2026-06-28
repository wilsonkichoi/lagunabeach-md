/**
 * track.ts — Feedback widget GA4 events (safe gtag wrapper).
 *
 * Aligned with Layout.astro's GA4 bootstrap (G-GP9LN8026H) + EventTracker pattern:
 * all events prefixed `feedback_`; if gtag is absent (ad blocker / private / local)
 * it's a silent no-op. Entire body wrapped in try/catch so it never blocks user actions.
 *
 * Purpose: data-driven evolution flywheel — events flow into GA4 -> EVOLVE / news-lens
 * routine reads dashboard-analytics.json -> learns how readers use feedback, which types
 * are most common, which login method has lowest friction, then calibrates widget +
 * content priority.
 *
 * Event taxonomy (stable; renaming requires updating GA4 explorations):
 *   feedback_open          { source: fab|selection, page_kind }
 *   feedback_selection_pill{ page_kind }
 *   feedback_type_select   { type, page_kind }
 *   feedback_login         { provider: google|github|email, page_kind }
 *   feedback_submit        { type, page_kind, has_quote, login_method }
 *   feedback_done          { type, page_kind }
 *   feedback_my_view       { }
 *   feedback_degraded      { reason: backend-null|submit-error|github-only }
 */
export function track(
  event: string,
  params: Record<string, unknown> = {},
): void {
  try {
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g === 'function') g('event', `feedback_${event}`, params);
  } catch {
    /* GA failure must not affect widget */
  }
}
