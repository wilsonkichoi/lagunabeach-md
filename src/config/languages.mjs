/**
 * Language registry for LagunaBeach.md.
 *
 * English-only for now. i18n architecture preserved (dormant) for future expansion.
 * Upstream taiwan-md languages.mjs kept in sync via shadow pattern.
 */

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
    enabled: false,
  },
];

export const ENABLED_LANGUAGE_CODES = LANGUAGES.filter((l) => l.enabled).map(
  (l) => l.code,
);

export const ALL_LANGUAGE_CODES = LANGUAGES.map((l) => l.code);

export const DEFAULT_LANGUAGE = LANGUAGES.find((l) => l.isDefault);

export const LANGUAGE_DISPLAY_NAMES = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l.displayName]),
);

export function getLanguage(code) {
  return LANGUAGES.find((l) => l.code === code);
}
