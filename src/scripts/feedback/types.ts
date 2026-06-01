/**
 * types.ts — Feedback 子系統共用型別（widget ↔ backend 契約）。
 */

export type FeedbackType = 'content' | 'bug' | 'newtopic';

/** OAuth 登入提供者（email magic-link 走另一條路，不在此列）。 */
export type OAuthProvider = 'google' | 'github';

/** 登入後拿到的使用者。email 一定有（goal: 帳號至少要拿到 email）。 */
export interface FeedbackUser {
  uid: string;
  email: string;
  /** 暱稱（不填就回退成帳號 email 的 local-part；見 resolveDisplayName）。 */
  displayName: string;
  /** 是否還沒設過暱稱 → widget 第一次登入要問一次。 */
  needsNickname: boolean;
}

/** 一筆待送出的回報。article context 由 widget 自動帶，讀者不用填。 */
export interface FeedbackDraft {
  type: FeedbackType;
  body: string;
  /** content 類選填：正確資訊 + 來源。 */
  correctInfo?: string;
  articleSlug: string;
  articleTitle: string;
  category: string;
  lang: string;
  sourceUrl: string;
}

export interface SubmitResult {
  id: string;
}

/**
 * Backend 介面 — SupabaseBackend / MockBackend 都實作這份。
 * widget.ts 永遠只認這個介面，不直接碰 supabase-js，好做隔離 + 測試。
 */
export interface FeedbackBackend {
  readonly kind: 'supabase' | 'mock';
  /** 載入 SDK / 還原 session。拋錯 = widget 降級成 github-only。 */
  init(): Promise<void>;
  currentUser(): Promise<FeedbackUser | null>;
  /** OAuth 登入（google / github）。正式：redirect；mock：即時登入。 */
  signInWithOAuth(provider: OAuthProvider): Promise<void>;
  /** Email 登入（正式：寄 magic-link / OTP；mock：即時登入）。回傳是否已寄出。 */
  signInWithEmail(email: string): Promise<{ sent: boolean }>;
  /** 設定暱稱（留空 → 用帳號代替）。 */
  saveNickname(nickname: string): Promise<FeedbackUser>;
  submit(draft: FeedbackDraft): Promise<SubmitResult>;
  signOut(): Promise<void>;
}

/** 暱稱回退規則：nickname → OAuth 顯示名 → email local-part → '匿名讀者'。 */
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
  return '匿名讀者';
}
