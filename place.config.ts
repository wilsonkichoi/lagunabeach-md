/**
 * place.config.ts — THE ingress for this instance's place identity.
 *
 * Everything place-specific (name, categories, map, feature toggles, SEO) lives
 * here. `src/` and `scripts/` stay generic and read from this file, so the Phase 5
 * framework cut ("sekai-kb") can strip this one file to re-place the whole site.
 * Init-time fields (place, categories, map) are written once by the `npm run init`
 * wizard; `features` and `languages` are runtime-toggleable. See SPEC.md
 * "place.config.ts" and .fable/STRATEGIC-DIRECTION.md §B.
 */

export interface PlaceConfig {
  place: {
    name: string;
    tagline: string;
    domain: string;
    locale: string;
    languages: string[];
  };
  /** 5-14 categories. slug/icon/description feed nav, hubs, and category pages. */
  categories: Array<{
    slug: string;
    title: string;
    icon: string;
    description: string;
  }>;
  /** Leaflet init: center [lat, lng], zoom, and maxBounds [[S,W],[N,E]]. */
  map: {
    center: [number, number];
    zoom: number;
    maxBounds: [[number, number], [number, number]];
  };
  features: {
    graph: boolean;
    map: boolean;
    dashboard: boolean;
    soundscape: boolean;
    feedback: boolean;
    chat: boolean;
    social: boolean;
    analytics: boolean;
  };
  /**
   * Outbound identity links. `repo` + `email` are always rendered (footer,
   * SEO sameAs/contactPoint, the "edit on GitHub" affordance). `social`
   * handles feed the footer social row and SEO sameAs, and render ONLY when
   * `features.social` is true. Handles include the leading `@`; component
   * code strips it when building platform URLs.
   * Added by task 1.1a (shell): §B's schema had no home for these; extending
   * it was Wilson's call (diverges from STRATEGIC-DIRECTION §B, tracked on LB-3).
   */
  links: {
    repo: string;
    email: string;
    social: {
      twitter?: string;
      threads?: string;
      instagram?: string;
    };
  };
  seo: {
    defaultOgImage: string;
    twitterHandle?: string;
  };
}

const config: PlaceConfig = {
  place: {
    name: 'Laguna Beach',
    tagline:
      'Open-source, AI-friendly knowledge base about Laguna Beach, California.',
    domain: 'lagunabeach.md',
    locale: 'en',
    languages: ['en'],
  },
  categories: [
    {
      slug: 'history',
      title: 'History',
      icon: '📜',
      description:
        'Founding, indigenous peoples, artists colony, historical events',
    },
    {
      slug: 'art-galleries',
      title: 'Art & Galleries',
      icon: '🎨',
      description: 'Plein air painting, galleries, public art, art festivals',
    },
    {
      slug: 'nature-marine-life',
      title: 'Nature & Marine Life',
      icon: '🌊',
      description:
        'Tide pools, coastal ecology, marine protected areas, wildlife',
    },
    {
      slug: 'food',
      title: 'Food',
      icon: '🍽️',
      description: 'Restaurants, cafes, food history, local specialties',
    },
    {
      slug: 'beaches',
      title: 'Beaches',
      icon: '🏖️',
      description: 'Individual beaches, access, conditions, surfing',
    },
    {
      slug: 'trails',
      title: 'Trails',
      icon: '🥾',
      description: 'Hiking, coastal walks, trail conditions, views',
    },
    {
      slug: 'events-festivals',
      title: 'Events & Festivals',
      icon: '🎭',
      description:
        'Pageant of the Masters, Sawdust Art Festival, seasonal events',
    },
    {
      slug: 'neighborhoods',
      title: 'Neighborhoods',
      icon: '🏘️',
      description: 'Top of the World, Village, South Laguna, Canyon areas',
    },
  ],
  map: {
    center: [33.5427, -117.7854],
    zoom: 13,
    // City extent (SW → NE corners), keeps panning within Laguna Beach.
    maxBounds: [
      [33.48, -117.83],
      [33.61, -117.72],
    ],
  },
  features: {
    graph: true,
    map: true,
    dashboard: true,
    soundscape: false,
    feedback: false,
    chat: false,
    social: false,
    analytics: false,
  },
  links: {
    repo: 'https://github.com/wilsonkichoi/lagunabeach-md',
    email: 'hello@lagunabeach.md',
    social: {
      twitter: '@lagunabeachmd',
      threads: '@lagunabeachmd',
      instagram: '@lagunabeachmd',
    },
  },
  seo: {
    defaultOgImage: '/images/laguna-social.jpg',
    twitterHandle: '@lagunabeachmd',
  },
};

export default config;
