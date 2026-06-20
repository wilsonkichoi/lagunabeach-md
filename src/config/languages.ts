/**
 * LANGUAGES_REGISTRY -- Single source of truth for all i18n languages.
 *
 * English-only for now. i18n architecture preserved (dormant) for future expansion.
 * Must stay in sync with languages.mjs.
 */

export interface LanguageEntry {
  code: string;
  displayName: string;
  hreflang: string;
  isDefault?: boolean;
  enabled: boolean;
  notes?: string;
}

export const LANGUAGES = [
  {
    code: 'en',
    displayName: 'English',
    hreflang: 'en',
    isDefault: true,
    enabled: true,
  },
  {
    code: 'zh-TW',
    displayName: '中文',
    hreflang: 'zh-Hant',
    enabled: true,
  },
] as const satisfies readonly LanguageEntry[];

export type Lang = (typeof LANGUAGES)[number]['code'];

export const ENABLED_LANGUAGE_CODES: readonly Lang[] = LANGUAGES.filter(
  (l) => l.enabled,
).map((l) => l.code);

export const ALL_LANGUAGE_CODES: readonly Lang[] = LANGUAGES.map((l) => l.code);

export const DEFAULT_LANGUAGE: LanguageEntry = LANGUAGES.find(
  (l): l is Extract<(typeof LANGUAGES)[number], { isDefault: true }> =>
    'isDefault' in l,
)!;

export const LANGUAGE_DISPLAY_NAMES: Record<string, string> =
  Object.fromEntries(LANGUAGES.map((l) => [l.code, l.displayName]));

export function getLanguage(code: string): LanguageEntry | undefined {
  return LANGUAGES.find((l) => l.code === code);
}
