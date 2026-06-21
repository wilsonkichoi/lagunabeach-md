/**
 * exploreUI — i18n strings for /explore (database discovery hub).
 *
 * Born 2026-05-10 (issue #615 child) — replaces the old `/#categories`
 * anchor with a dedicated database front-page so visitors who arrive
 * looking to *find* things (not read narrative) get a search-first
 * interface with hot keywords + category cards + featured picks.
 *
 * Hot search keywords are intentionally translated per language (not
 * shared) so each locale surfaces terms that locale's readers actually
 * search for. They can later be replaced with GA4-derived top queries
 * via fetch-search-events.py without touching this file's structure.
 */
export const exploreUI = {
  en: {
    // Meta
    'explore.meta.title':
      'Explore LagunaBeach.md — Browse the open knowledge base',
    'explore.meta.description':
      'Browse 685+ curated articles about Laguna Beach: history, art, nature, food, beaches, trails, events, and neighborhoods. Search, discover, and explore.',

    // Hero
    'explore.hero.eyebrow': 'KNOWLEDGE HUB',
    'explore.hero.title': 'Explore LagunaBeach.md',
    'explore.hero.subtitle':
      'Curated long-form narratives about Laguna Beach — search, discover, or browse by category.',

    // Search section
    'explore.search.heading': 'Search the database',
    'explore.search.placeholder':
      'Search Laguna Beach — people, places, events…',
    'explore.search.button': 'Search',
    'explore.search.random': 'Random discovery',
    'explore.search.randomSubtitle':
      'Roll the dice — find a story you didn’t know you were looking for',
    'explore.hotSearches.label': 'Trending',
    'explore.hotSearches.term1': 'Pageant of the Masters',
    'explore.hotSearches.term2': 'Tide Pools',
    'explore.hotSearches.term3': '1993 Firestorm',
    'explore.hotSearches.term4': 'Plein Air Painting',
    'explore.hotSearches.term5': 'Crystal Cove',
    'explore.hotSearches.term6': 'Top of the World',

    // Stats ribbon
    'explore.stats.articles': 'articles',
    'explore.stats.contributors': 'contributors',
    'explore.stats.languages': 'languages',
    'explore.stats.last30d': 'updates / 30d',

    // Categories section
    'explore.categories.heading': 'Browse by category',
    'explore.categories.subtitle':
      'Twelve domains, each with its own curated angle on the island.',

    // Featured picks section
    'explore.featured.heading': 'Featured deep-dives',
    'explore.featured.subtitle':
      'A-grade articles with extensive citations and cross-references.',
    'explore.featured.viewAll': 'View all featured →',
    'explore.featured.citations': 'citations',
    'explore.featured.minRead': 'min read',
    'explore.popular.heading': 'Popular now',
    'explore.popular.subtitle': 'Most-read articles over the past 7 days.',
    'explore.popular.views': 'views',

    // More ways to explore
    'explore.more.heading': 'More ways to explore',
    'explore.more.graph.title': 'Knowledge Graph',
    'explore.more.graph.desc':
      'See how every article connects in a force-directed visualization.',
    'explore.more.graph.cta': 'Open the graph →',
    'explore.more.map.title': 'Geographic Map',
    'explore.more.map.desc': 'Find articles by their location on the island.',
    'explore.more.map.cta': 'Open the map →',
    'explore.more.terminology.title': 'Terminology',
    'explore.more.terminology.desc':
      'Quick reference for terms used across the knowledge base.',
    'explore.more.terminology.cta': 'Open glossary →',

    // CTA footer
    'explore.cta.heading': "Can't find what you're looking for?",
    'explore.cta.body':
      'LagunaBeach.md is open-source — anyone can contribute an article, fix a fact, or translate a page.',
    'explore.cta.contribute': 'Contribute an article',
    'explore.cta.github': 'View on GitHub',
  },
  'zh-TW': {
    'explore.meta.title': '探索 LagunaBeach.md — 瀏覽開放的台灣知識庫',
    'explore.meta.description':
      '瀏覽 685+ 篇台灣策展文章：歷史、地理、文化、美食、藝術、音樂、科技、自然、人物、社會、經濟、生活。搜尋、發現、探索。',

    'explore.hero.eyebrow': '知識庫',
    'explore.hero.title': '探索 LagunaBeach.md',
    'explore.hero.subtitle': '策展島嶼的深度敘事 — 搜尋、發現、依分類瀏覽。',

    'explore.search.heading': '搜尋資料庫',
    'explore.search.placeholder': '搜尋台灣的一切（人、地、文化、事件）',
    'explore.search.button': '搜尋',
    'explore.search.random': '隨機探索',
    'explore.search.randomSubtitle': '擲一把骰子 — 遇見一個你沒想到的故事',
    'explore.hotSearches.label': '熱門搜尋',
    'explore.hotSearches.term1': '半導體',
    'explore.hotSearches.term2': '夜市',
    'explore.hotSearches.term3': '原住民',
    'explore.hotSearches.term4': '二二八',
    'explore.hotSearches.term5': '台積電',
    'explore.hotSearches.term6': '珍珠奶茶',

    'explore.stats.articles': '篇文章',
    'explore.stats.contributors': '位貢獻者',
    'explore.stats.languages': '種語言',
    'explore.stats.last30d': '近 30 天更新',

    'explore.categories.heading': '依分類瀏覽',
    'explore.categories.subtitle': '十二個領域，每個都是這座島嶼的一個切面。',

    'explore.featured.heading': '深度精選',
    'explore.featured.subtitle':
      'A 級文章 — 完整腳註、跨篇引用、可追溯的研究軌跡。',
    'explore.featured.viewAll': '看完整精選 →',
    'explore.featured.citations': '引用',
    'explore.featured.minRead': '分鐘',
    'explore.popular.heading': '熱門文章',
    'explore.popular.subtitle': '近 7 天最多人讀的文章。',
    'explore.popular.views': '瀏覽',

    'explore.more.heading': '其他探索方式',
    'explore.more.graph.title': '知識圖譜',
    'explore.more.graph.desc': '用力導向圖看每篇文章如何彼此連結。',
    'explore.more.graph.cta': '打開圖譜 →',
    'explore.more.map.title': '地理地圖',
    'explore.more.map.desc': '依文章在島上的位置查找。',
    'explore.more.map.cta': '打開地圖 →',
    'explore.more.terminology.title': '名詞對照',
    'explore.more.terminology.desc': '知識庫共用名詞的速查表。',
    'explore.more.terminology.cta': '打開對照表 →',

    'explore.cta.heading': '找不到想看的？',
    'explore.cta.body':
      'LagunaBeach.md 是開源的 — 任何人都可以貢獻一篇文章、修一個事實，或翻譯一頁。',
    'explore.cta.contribute': '貢獻一篇',
    'explore.cta.github': '在 GitHub 上瀏覽',
  },
} as const;
