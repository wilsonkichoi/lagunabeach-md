/**
 * soundscape-data.ts — single source of truth for the /soundscape page
 * across all supported language variants (en / zh-TW).
 *
 * LagunaBeach.md has no field-recording collection yet — every category
 * below ships with an empty `sounds` array and a wishlist of real, verified
 * Laguna Beach sounds worth recording (waves, festivals, wildlife, town
 * life). Do not add placeholder/fabricated recordings here; only add a
 * `sounds` entry once someone actually contributes an audio file.
 *
 * `zh-TW` is the required canonical field on every Localized value (kept
 * for the dormant i18n architecture); `en` is the language actually served
 * by default. `ja`/`ko` are optional and fall through to `zh-TW` via
 * `localize()` if absent.
 */

import type { Lang } from '../types';

export type Localized = Partial<Record<Lang, string>> & { 'zh-TW': string };

export interface Sound {
  /** Filename under /public/assets/sounds/ */
  file: string;
  location: Localized;
  description: Localized;
  icon: string;
  contributor: string;
  /** Optional — overrides the default github.com/{contributor} link. */
  contributorUrl?: string;
  date: string;
}

export interface WishlistItem {
  icon: string;
  text: Localized;
}

export interface SoundCategory {
  id: string;
  icon: string;
  title: Localized;
  sounds: Sound[];
  wishlist: WishlistItem[];
  /** Deep-article path (same for all languages since articles are lang-routed). */
  article: string;
}

/**
 * Resolve a Localized field for the given language with zh-TW fallback.
 *
 * Treats an empty string as an *intentional* empty (no fallback) — this
 * lets pages opt out of a field on a per-language basis. Only `undefined`
 * triggers the zh-TW fallback.
 */
export function localize(field: Localized, lang: Lang): string {
  const val = field[lang];
  if (val !== undefined) return val;
  return field['zh-TW'];
}

/**
 * Return the English secondary label for a Localized field, but ONLY when
 * viewing from the zh-TW page (dormant — en is the default language site-
 * wide). Returns empty string (= don't render) when:
 * - lang is not 'zh-TW'
 * - field has no `en` value
 * - `en` is identical to `zh-TW` (would be visual noise)
 */
export function secondary(field: Localized, lang: Lang): string {
  if (lang !== 'zh-TW') return '';
  const en = field.en;
  if (!en || en === field['zh-TW']) return '';
  return en;
}

// ─── UI chrome (hero + section headings + CTA) ───
export const soundscapeUI = {
  meta: {
    title: {
      'zh-TW': '拉古納海灘聲景 — LagunaBeach.md',
      en: 'Laguna Beach Soundscape — LagunaBeach.md',
    } as Localized,
    description: {
      'zh-TW':
        '用耳朵認識拉古納海灘——一個還在等待第一批錄音的田野收音計畫，收錄浪聲、藝術節、野生動物與小鎮日常',
      en: 'A field recording wishlist for Laguna Beach — waves, art festivals, coastal wildlife, and small-town rhythms, waiting for their first contributor',
    } as Localized,
  },
  hero: {
    eyebrow: '🎧 Soundscape',
    title: {
      'zh-TW': '拉古納海灘聲景',
      en: 'Laguna Beach Soundscape',
    } as Localized,
    subtitle: {
      'zh-TW': '有些故事，用耳朵聽比用眼睛看更真實。',
      en: 'Some stories are best told through ears.',
    } as Localized,
    subtitleSecondary: {
      'zh-TW': 'Some stories are best told through ears.',
      en: '',
    } as Localized,
    readMoreLabel: {
      'zh-TW': '📖 深度文章：',
      en: '📖 Read more: ',
    } as Localized,
    readMoreLink: {
      'zh-TW': '潮池與海洋保護區',
      en: 'Tide Pools (article)',
    } as Localized,
  },
  sections: {
    wishlistHeading: {
      'zh-TW': '📋 想收集 Wanted',
      en: '📋 Wishlist',
    } as Localized,
    emptyState: {
      'zh-TW': '這個分類還沒有錄音，等你來貢獻！',
      en: 'No recordings yet — be the first contributor!',
    } as Localized,
    emptyStateSecondary: {
      'zh-TW': 'No recordings yet — be the first contributor!',
      en: '',
    } as Localized,
    readArticle: {
      'zh-TW': '📖 閱讀完整文章 Read more →',
      en: '📖 Read the full article →',
    } as Localized,
    contributeTitle: {
      'zh-TW': '🎤 貢獻你的錄音',
      en: '🎤 Contribute Your Recording',
    } as Localized,
    contributeBodyHtml: {
      'zh-TW':
        '用手機錄下 30 秒到 2 分鐘的拉古納海灘聲景，轉成 MP3，開一個 PR 就好。<br />不會用 GitHub？直接<a href="mailto:hello@lagunabeach.md">寄信給我們</a>，附上錄音檔和地點描述。',
      en: 'Record 30 seconds to 2 minutes of a Laguna Beach soundscape on your phone, convert to MP3, and open a PR.<br />Not a GitHub user? <a href="mailto:hello@lagunabeach.md">Email us</a> with the audio file and location description.',
    } as Localized,
    contributeStep1: {
      'zh-TW': '錄下聲音（30s – 2min）',
      en: 'Record audio (30s – 2min)',
    } as Localized,
    contributeStep2: {
      'zh-TW': '轉成 MP3（128kbps+）',
      en: 'Convert to MP3 (128kbps+)',
    } as Localized,
    contributeStep3: {
      'zh-TW': '開 PR 或寄信給我們',
      en: 'Open a PR or email us',
    } as Localized,
    contributeCtaLabel: {
      'zh-TW': '前往貢獻頁面 →',
      en: 'Go to Contribute page →',
    } as Localized,
    statsFormat: {
      'zh-TW': '{sounds} recordings · {wanted} wanted · {cats} categories',
      en: '{sounds} recordings · {wanted} wanted · {cats} categories',
    } as Localized,
  },
};

// ─── Category + wishlist data ───
// Ordered array; display order = array order. No recordings exist yet for
// any category — every wishlist item below is a real, verifiable Laguna
// Beach sound, not a placeholder.
export const categories: SoundCategory[] = [
  {
    id: 'ocean-tidepools',
    icon: '🌊',
    title: {
      'zh-TW': '海洋與潮池',
      en: 'Ocean & Tide Pools',
    },
    sounds: [],
    wishlist: [
      {
        icon: '🌊',
        text: {
          'zh-TW': 'Main Beach 的海浪聲',
          en: 'Waves breaking at Main Beach',
        },
      },
      {
        icon: '🦭',
        text: {
          'zh-TW': '海獅與海狗在外海的叫聲',
          en: 'Sea lions and harbor seals offshore',
        },
      },
      {
        icon: '🐚',
        text: {
          'zh-TW': 'Heisler Park 海洋保護區潮池的環境音',
          en: 'Heisler Park tide pools (marine reserve ambience)',
        },
      },
      {
        icon: '🌫️',
        text: {
          'zh-TW': '清晨海霧捲入海岸的聲音',
          en: 'Morning marine fog rolling in off the coast',
        },
      },
    ],
    article: '/nature-marine-life/tide-pools/',
  },
  {
    id: 'arts-festival-season',
    icon: '🎨',
    title: {
      'zh-TW': '藝術節季節',
      en: 'Arts Festival Season',
    },
    sounds: [],
    wishlist: [
      {
        icon: '🎻',
        text: {
          'zh-TW': 'Pageant of the Masters 在 Irvine Bowl 的現場樂團與旁白',
          en: 'Pageant of the Masters live orchestra and narration at the Irvine Bowl',
        },
      },
      {
        icon: '🔥',
        text: {
          'zh-TW': 'Sawdust Art Festival 的玻璃吹製示範',
          en: 'Glassblowing demonstration at the Sawdust Art Festival',
        },
      },
      {
        icon: '🚎',
        text: {
          'zh-TW': 'First Thursdays Art Walk 畫廊人聲與免費電車',
          en: 'First Thursdays Art Walk gallery murmur and the free trolley',
        },
      },
    ],
    article: '/events-festivals/pageant-of-the-masters/',
  },
  {
    id: 'canyon-wildlife',
    icon: '🦅',
    title: {
      'zh-TW': '峽谷與野生動物',
      en: 'Canyon & Wildlife',
    },
    sounds: [],
    wishlist: [
      {
        icon: '🦅',
        text: {
          'zh-TW': 'Laguna Coast Wilderness Park 上方紅尾鵟的叫聲',
          en: 'Red-tailed hawk cry over Laguna Coast Wilderness Park',
        },
      },
      {
        icon: '🐺',
        text: {
          'zh-TW': '黃昏時分的灰狼吼聲',
          en: 'Coyote chorus at dusk',
        },
      },
      {
        icon: '🐦',
        text: {
          'zh-TW': '海岸灌叢清晨的鳥鳴',
          en: 'Coastal sage scrub birdsong at sunrise',
        },
      },
    ],
    article: '/trails/laguna-coast-wilderness-park/',
  },
  {
    id: 'town-rhythms',
    icon: '🏘️',
    title: {
      'zh-TW': '小鎮日常',
      en: 'Town Rhythms',
    },
    sounds: [],
    wishlist: [
      {
        icon: '🥬',
        text: {
          'zh-TW': '週六 Farmers Market 在 Lumber Yard 停車場的人聲',
          en: 'Saturday Farmers Market at the Lumber Yard lot',
        },
      },
      {
        icon: '🚎',
        text: {
          'zh-TW': '夏季免費電車站名廣播',
          en: 'Free summer trolley stop announcements',
        },
      },
      {
        icon: '☕',
        text: {
          'zh-TW': 'PCH 上咖啡店露台的人聲',
          en: 'Downtown café patio chatter along Coast Highway',
        },
      },
    ],
    article: '/neighborhoods/the-village/',
  },
];

// ─── Aggregate stats (computed once at module load) ───
export const totalSounds = categories.reduce(
  (sum, cat) => sum + cat.sounds.length,
  0,
);
export const totalWishlist = categories.reduce(
  (sum, cat) => sum + cat.wishlist.length,
  0,
);
export const totalCategories = categories.length;
