/**
 * types.ts — Shared types for the feedback subsystem (widget <-> backend contract).
 */

export type FeedbackType = 'content' | 'bug' | 'newtopic' | 'idea';

/** OAuth login providers (email magic-link uses a separate path, not listed here). */
export type OAuthProvider = 'google' | 'github';

/** User object after login. email is always present (goal: account must capture email). */
export interface FeedbackUser {
  uid: string;
  email: string;
  /** Nickname (falls back to email local-part if unset; see resolveDisplayName). */
  displayName: string;
  /** Whether nickname has never been set -> widget asks once on first login. */
  needsNickname: boolean;
}

/** A feedback submission draft. Article context is auto-filled by the widget. */
export interface FeedbackDraft {
  type: FeedbackType;
  body: string;
  /** Optional for 'content' type: correct information + source. */
  correctInfo?: string;
  articleSlug: string;
  articleTitle: string;
  category: string;
  lang: string;
  sourceUrl: string;
  /** Reader-selected passage from the article (text-selection correction; v2). */
  quote?: string;
  /** Source page kind: article/category/home/dashboard/semiont/other (v2). */
  pageKind?: string;
}

export interface SubmitResult {
  id: string;
}

/** A single item in the "My Feedback" list (v3 closed-loop visibility). */
export interface MyFeedbackItem {
  id: string;
  type: FeedbackType;
  body: string;
  status: string; // new | filed | rejected
  issueUrl?: string | null;
  issueNumber?: number | null;
  triageNote?: string | null; // AI triage reasoning (available after 0003)
  createdAt?: string;
  articleTitle?: string | null;
  quote?: string | null;
}

/**
 * Backend interface — implemented by both SupabaseBackend and MockBackend.
 * widget.ts only depends on this interface, never touches supabase-js directly,
 * enabling isolation + testing.
 */
export interface FeedbackBackend {
  readonly kind: 'supabase' | 'mock';
  /** Load SDK / restore session. Throws = widget degrades to github-only. */
  init(): Promise<void>;
  currentUser(): Promise<FeedbackUser | null>;
  /** OAuth login (google / github). Production: redirect; mock: instant login. */
  signInWithOAuth(provider: OAuthProvider): Promise<void>;
  /** Email login (production: sends magic-link/OTP; mock: instant). Returns whether sent. */
  signInWithEmail(email: string): Promise<{ sent: boolean }>;
  /** Set nickname (empty -> falls back to account name). */
  saveNickname(nickname: string): Promise<FeedbackUser>;
  submit(draft: FeedbackDraft): Promise<SubmitResult>;
  /** "My Feedback" list (current user's own entries, RLS-restricted). */
  myFeedback(): Promise<MyFeedbackItem[]>;
  signOut(): Promise<void>;
}

/** Nickname fallback: nickname -> OAuth display name -> email local-part -> 'Anonymous'. */
export function resolveDisplayName(
  nickname: string | null | undefined,
  oauthName: string | null | undefined,
  email: string | null | undefined,
): string {
  const n = (nickname || '').trim();
  if (n) return n;
  const o = (oauthName || '').trim();
  if (o) return o;
  const local = (email || '').split('@')[0].trim();
  if (local) return local;
  return 'Anonymous Reader';
}
