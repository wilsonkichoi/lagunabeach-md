export const aboutUI = {
  en: {
    // Meta
    'about.meta.title': 'About LagunaBeach.md',
    'about.meta.description':
      'The story behind LagunaBeach.md, how it works, and how to contribute',

    // Section 1: Naming
    'about.naming.title': 'Why LagunaBeach.md?',
    'about.naming.subtitle':
      'An open knowledge base in the most AI-friendly format',
    'about.naming.tech.icon': '📝',
    'about.naming.tech.title': 'Technical Level',
    'about.naming.tech.desc.html':
      ', the most universal document format in the programming world. Using the most AI-friendly format to share Laguna Beach with the world.',
    'about.naming.symbol.icon': '🌍',
    'about.naming.symbol.title': 'Symbolic Level',
    'about.naming.symbol.desc.html':
      " happens to be Moldova's country-code top-level domain. Laguna Beach + Markdown = connecting community knowledge through open source.",
    'about.naming.lucky.icon': '✨',
    'about.naming.lucky.title': 'Open Source',
    'about.naming.lucky.desc':
      'Built on an open-source knowledge base framework. Community-driven, AI-friendly, and freely forkable for any city or topic.',

    // Stats
    'about.stats.pages.number': '12+',
    'about.stats.pages.label': 'Articles',
    'about.stats.countries.number': '8',
    'about.stats.countries.label': 'Categories',
    'about.stats.stars.number': '0+',
    'about.stats.stars.label': 'Languages',
    'about.stats.contributors.number': '52+',
    'about.stats.contributors.label': 'Contributors',
    'about.stats.users.number': '—',
    'about.stats.users.label': 'Growing',

    // Vision
    'about.vision.p1':
      "LagunaBeach.md is more than a website. It's a curated knowledge base about a small coastal city with an outsized story.",
    'about.vision.p2':
      "With an open-source spirit, a curator's eye, and AI-friendly formats, we aim to provide the most comprehensive and heartfelt answer for anyone who wants to know Laguna Beach — whether human or AI.",
    'about.vision.p3.html':
      "This is not a travel guide, not a real estate brochure, not a Chamber of Commerce advertisement.<br />This is Laguna Beach's living knowledge base — history, art, nature, and community in the making.",

    // Section 2: Origin
    'about.origin.title': 'The Birth of LagunaBeach.md',
    'about.origin.subtitle':
      'Forked from Taiwan.md, adapted for a small coastal city with a big story to tell',

    // Timeline
    'about.timeline.2024-2025.date': '2026 / 06',
    'about.timeline.2024-2025.title': 'The Fork',
    'about.timeline.2024-2025.desc':
      'LagunaBeach.md is forked from Taiwan.md, an open-source knowledge base that grew from 0 to 1000+ GitHub stars in 3 months. We took the infrastructure (build system, i18n, quality gates, editorial standards) and adapted it for Laguna Beach. 15 articles across 8 categories, with a real Leaflet map, working search, and automated pre-commit quality checks.',

    'about.timeline.2026-02-03.date': '2026 / 06',
    'about.timeline.2026-02-03.title': 'What We Kept',
    'about.timeline.2026-02-03.p1':
      'From the upstream: Astro static site, multilingual routing, search indexing, pre-commit quality gates, OG image generation, RSS, sitemap with hreflang, knowledge graph visualization, and the editorial philosophy of "story over information."',
    'about.timeline.2026-02-03.p2.html':
      'What we changed: categories (8 for Laguna Beach), default language (English), map (Leaflet + OpenStreetMap instead of D3 SVG), branding, and all content. The <strong>shadow translation pattern</strong> lets us pull upstream infrastructure updates without losing our content.',

    // Organism Section
    'about.organism.title': 'LagunaBeach.md Is Growing',
    'about.organism.subtitle':
      'Evolution happens here, one pull request at a time',
    'about.organism.intro.p1':
      'It stopped behaving like a finished website and started behaving like a living system: noticing damage, repairing itself, and carrying memory forward.',
    'about.organism.intro.p2': 'We began to realize — LagunaBeach.md is alive.',

    'about.organism.facts.title': 'Three Facts That Changed Everything',
    'about.organism.fact1.title': 'Immune System',
    'about.organism.fact1.desc':
      'The upstream project built a quality detection script that scores every article for hollowness. Pre-commit hooks catch credential leaks, validate frontmatter, and enforce editorial standards automatically. No human needs to remember the checklist. The system enforces its own health.',
    'about.organism.fact2.title': 'Reproduction',
    'about.organism.fact2.desc':
      'This project exists because of forking. Taiwan.md designed itself to be forkable from day one: clear category structure, i18n routing, shadow translation pattern. LagunaBeach.md is proof the architecture works for any place with stories worth telling.',
    'about.organism.fact3.title': 'Community',
    'about.organism.fact3.desc':
      "The knowledge base is open to anyone who knows Laguna Beach. A local historian can add depth to the 1993 firestorm article. A marine biologist can correct tide pool species. A longtime resident can share what the Village looked like in the 1970s. The editorial system is designed so contributions don't require programming skills.",

    'about.organism.characteristics.title': 'Life Characteristics Comparison',
    'about.organism.dna.label': 'DNA',
    'about.organism.dna.desc':
      'EDITORIAL.md — Writing standards inherited by every new article',
    'about.organism.immune.label': 'Immune System',
    'about.organism.immune.desc':
      'quality-scan.sh — Automatically detects hollow content',
    'about.organism.metabolism.label': 'Metabolism',
    'about.organism.metabolism.desc':
      'Quality Cron — Automatically rewrites low-quality articles every hour',
    'about.organism.perception.label': 'Perception',
    'about.organism.perception.desc':
      'GA4 + Community feedback — Knows where it hurts',
    'about.organism.reproduction.label': 'Reproduction',
    'about.organism.reproduction.desc':
      'Token Donation — One prompt grows new language versions',
    'about.organism.memory.label': 'Memory',
    'about.organism.memory.desc': 'Git — Every change is remembered',
    'about.organism.symbiosis.label': 'Symbiosis',
    'about.organism.symbiosis.desc':
      'Three-way collaboration between humans + AI + community',
    'about.organism.spore.label': 'Spore Dispersal',
    'about.organism.spore.desc':
      'Stories spread like spores — light, far-reaching, landing on new soil to grow new coral colonies',

    'about.organism.reef.title': 'LagunaBeach.md Is a Digital Coral Reef',
    'about.organism.reef.skeleton': 'Coral Skeleton',
    'about.organism.reef.skeleton.desc': 'Markdown + Astro provide structure',
    'about.organism.reef.algae': 'Symbiotic Algae',
    'about.organism.reef.algae.desc':
      'AI generates massive foundational content',
    'about.organism.reef.fish': 'Fish Community',
    'about.organism.reef.fish.desc':
      'Contributors bring unique ecological niches',
    'about.organism.reef.current': 'Ocean Current',
    'about.organism.reef.current.desc':
      'Your feedback creates selection pressure',

    'about.organism.art.title': 'A Living Behavioral Art Project',
    'about.organism.art.desc':
      "Every contribution feeds a knowledge base learning to tell a city's story. Can AI and humans together build something that captures what makes a place worth knowing?",

    'about.organism.ending.p1':
      "Something written in Markdown is learning to tell a coastal city's story.",
    'about.organism.ending.p2':
      "It's still young. You're arriving at just the right time.",
    'about.organism.ending.p3':
      'Maybe decades from now, when someone wants to know what Laguna Beach was like in 2026, what they find will be what this knowledge base left behind.',

    // Press cards
    // Section 2.6: One Layer Deeper — site-explainer articles
    'about.guide.title': 'One Layer Deeper',
    'about.guide.subtitle':
      'How this site writes, how it visualizes knowledge, and how the system works under the hood.',
    'about.guide.cta': 'Read',
    'about.guide.born.title': 'Editorial Guide',
    'about.guide.born.desc':
      'The writing principles behind every article: find the tension, verify every fact, tell a story not a summary.',
    'about.guide.viz.title': 'Knowledge Graph',
    'about.guide.viz.desc':
      'Interactive visualization of how 8 categories and 15+ articles connect to each other.',
    'about.guide.meta.title': 'How This Project Works',
    'about.guide.meta.desc':
      'The boot file for AI sessions: project structure, editorial standards, upstream relationship, dev workflow.',

    // Section 3: Team
    'about.team.title': 'Contributors',
    'about.team.subtitle': '',
    'about.team.founder.quote': '',
    'about.team.founder.quote.cite': '',
    'about.team.founder.name': '',
    'about.team.founder.name.en': '',
    'about.team.founder.tagline': '',
    'about.team.founder.bio': '',

    // Founder links
    'about.team.founder.link.website': '',
    'about.team.founder.link.github': '',
    'about.team.founder.link.instagram': '',

    // Team cards (hidden)
    'about.team.muse.icon': '',
    'about.team.muse.name': '',
    'about.team.muse.role': '',
    'about.team.muse.desc': '',
    'about.team.muse.link': '',

    'about.team.monolab.icon': '',
    'about.team.monolab.name': '',
    'about.team.monolab.role': '',
    'about.team.monolab.desc': '',
    'about.team.monolab.link': '',

    // Contributors
    'about.team.contributors.title': '👥 LagunaBeach.md Contributors',
    'about.team.contributors.desc':
      'Thank you to everyone who makes LagunaBeach.md better. 💻 Code 📝 Content 🎨 Design 💡 Ideas 🌍 Translation 👀 Reviews 🐛 Bug 🔧 Tools 🔒 Security',
    'about.team.contributors.cta.html':
      'Want to join? <a href="/contribute">Start here →</a> ・ <a href="https://github.com/wilsonkichoi/lagunabeach-md/graphs/contributors" target="_blank">GitHub Contributors →</a>',

    // Section 4: Contact
    'about.contact.title': 'Contact Us',
    'about.contact.subtitle':
      'Have ideas, collaboration proposals, or want to contribute? Get in touch.',
    'about.contact.collaboration.icon': '📧',
    'about.contact.collaboration.title': 'Collaboration',
    'about.contact.collaboration.email': 'hello@lagunabeach.md',
    'about.contact.opensource.icon': '🐙',
    'about.contact.opensource.title': 'Open Source',
    'about.contact.opensource.link': 'wilsonkichoi/lagunabeach-md',
    'about.contact.license.icon': '📜',
    'about.contact.license.title': 'License',
    'about.contact.license.link': 'CC BY-SA 4.0',
    'about.contact.license.note': 'Free to share with attribution',
    'about.contact.cta.text':
      'LagunaBeach.md is a community-driven open-source project. Everyone interested in Laguna Beach is welcome to participate.',
    'about.contact.cta.guide': 'Contributing Guide',
    'about.contact.cta.github': '⭐ Star on GitHub',

    // Section 5: Sponsors
    'about.sponsors.title': '🤝 Sponsors & Partners',
    'about.sponsors.desc.html':
      'LagunaBeach.md is a non-profit, community-driven open-source project.<br />We welcome partnerships that deepen our coverage of Laguna Beach.',
    'about.sponsors.tier.core.name': '🏛️ Core Partner',
    'about.sponsors.tier.core.desc':
      'Deep involvement in project development, providing key infrastructure or long-term resource support',
    'about.sponsors.tier.core.perks':
      'Large logo on About page・README featured section・Social media acknowledgment・Quarterly impact reports',
    'about.sponsors.tier.core.placeholder': 'Be the First Core Partner',
    'about.sponsors.tier.curation.name': '📚 Content Curation Partner',
    'about.sponsors.tier.curation.desc':
      'Professional organizations contributing domain expertise — injecting specialized knowledge or providing expert review for content accuracy',
    'about.sponsors.tier.curation.perks':
      'Logo on About page・"Curated by" credit on articles・README acknowledgment・Co-branded content series',
    'about.sponsors.tier.curation.placeholder': 'Be the First Curation Partner',
    'about.sponsors.nmth.story.title': '',
    'about.sponsors.nmth.story.desc': '',
    'about.sponsors.pansci.story.title': '',
    'about.sponsors.pansci.story.desc': '',
    'about.sponsors.tier.professional.name': '🔧 Professional Partner',
    'about.sponsors.tier.professional.desc':
      "Directly enhancing LagunaBeach.md's quality and experience through professional capabilities or services",
    'about.sponsors.tier.professional.perks':
      'Logo on About page・README acknowledgment・Contribution story column',
    'about.sponsors.tier.community.name': '🌱 Community Partner',
    'about.sponsors.tier.community.desc':
      'Supporting community operations and user experience with tools, services, or resources',
    'about.sponsors.tier.community.perks':
      'Text acknowledgment on About page・README listing',
    'about.sponsors.tier.individual.name': '💚 Individual Supporter',
    'about.sponsors.tier.individual.desc':
      'Supporting project sustainability through personal contribution',
    'about.sponsors.tier.individual.perks': 'README thank-you list',

    // Sponsor stories (placeholders — no sponsors yet)
    'about.sponsors.justfont.story.title': '',
    'about.sponsors.justfont.story.desc': '',
    'about.sponsors.protico.story.title': '',
    'about.sponsors.protico.story.desc.html': '',
    'about.sponsors.portaly.story.title': '',
    'about.sponsors.portaly.story.desc': '',

    // Sponsor CTA
    'about.sponsors.cta.title': "Want to Help Tell Laguna Beach's Story?",
    'about.sponsors.cta.desc.html':
      'Whether through local expertise, professional services, or individual support, we welcome all forms of collaboration.<br />Reach out to discuss how we can work together.',
    'about.sponsors.cta.contact': '📧 Contact Us About Partnership',
    'about.sponsors.cta.github': '💖 GitHub Sponsors',
    'about.sponsors.portaly.label': '',
    'about.sponsors.portaly.cta': '',
    'about.sponsors.portaly.note': '',
    // FAQ Section
    'about.faq.title': 'FAQ',
    'about.faq.subtitle': 'Things you might want to know about LagunaBeach.md',

    'about.faq.q1': 'How is LagunaBeach.md different from Wikipedia?',
    'about.faq.a1.html':
      "LagunaBeach.md is not a replacement for Wikipedia — it's complementary. Wikipedia aims for neutral, encyclopedic entries. LagunaBeach.md is a <strong>curated space</strong> that uses narrative journalism to tell Laguna Beach's stories, starting from a person, a scene, or a counter-intuitive fact. Wikipedia gives you the skeleton, LagunaBeach.md gives you the flesh and blood.",

    'about.faq.q2': 'Why does Laguna Beach need its own knowledge base?',
    'about.faq.a2.html':
      "AI models don't generate knowledge — they learn from training data. When you ask an AI \"What is Laguna Beach like?\", whose content is it citing? LagunaBeach.md is written in Markdown (<code>.md</code>) — the most AI-readable format. When AI models train on <code>lagunabeach.md</code>, they learn the city's stories told by people who know it. This isn't just open data — it's <strong>local voice, curated with care</strong>.",

    'about.faq.q3':
      'Are the articles written by AI? How do you ensure quality?',
    'about.faq.a3.html':
      'AI is our writing tool, not our author. Every article goes through a pipeline: <strong>Research</strong> (primary sources) → <strong>Writing</strong> (following <a href="https://github.com/wilsonkichoi/lagunabeach-md/blob/main/docs/editorial/EDITORIAL.en.md" target="_blank">EDITORIAL.en.md</a> guidelines) → <strong>Verification</strong> (automated scanning + human review). Pre-commit hooks catch quality issues before they ship.',

    'about.faq.q4': 'What if an article has errors?',
    'about.faq.a4.html':
      'Quick admission, quick fix. Report via <a href="https://github.com/wilsonkichoi/lagunabeach-md/issues/new" target="_blank">GitHub Issue</a> or submit a PR directly. Being corrected isn\'t embarrassing — that\'s the open-source spirit.',

    'about.faq.q5': 'Who maintains this? Will it disappear one day?',
    'about.faq.a5.html':
      'LagunaBeach.md was founded by Wilson Choi and is open source. The architecture is designed for resilience: anyone can fork a complete copy, hosted on GitHub Pages at zero cost, data distributed across all forked repos. As long as the repo exists, it lives on.',

    'about.faq.q6': 'How can I contribute? Do I need to code?',
    'about.faq.a6.html':
      'Not at all. The most valuable contributions aren\'t code — they\'re your knowledge of Laguna Beach: <strong>proofreading</strong>, <strong>writing articles</strong> in Markdown, <strong>providing sources</strong> (local newspaper archives, historical society records), or simply <strong>sharing</strong> articles you find well-written. See <a href="/contribute">How to Contribute</a> for details.',

    'about.faq.q7': 'Are the articles biased?',
    'about.faq.a7.html':
      "LagunaBeach.md doesn't aim for false neutrality — we aim for <strong>transparent perspective</strong>. All data comes with sources, we present multiple viewpoints on controversial topics, and we welcome sourced corrections. Think of each topic as a cube — we show multiple faces, and readers decide their viewing angle.",

    'about.faq.q8': 'How do you handle controversial local topics?',
    'about.faq.a8.html':
      "Development vs. preservation, tourism impact, housing costs — Laguna Beach has real tensions. We present facts, cite sources, and let readers draw conclusions. We don't advocate for any position, but we don't pretend controversies don't exist either.",

    'about.faq.q9': "Can I use the content commercially? What's the license?",
    'about.faq.a9.html':
      'Content is licensed under <strong>CC BY-SA 4.0</strong> — free to share and adapt, including commercially, but you must give attribution and share derivatives under the same license. Code is under MIT License.',

    'about.faq.q10': 'Does LagunaBeach.md accept sponsorship?',
    'about.faq.a10.html':
      "Not yet. We want to solidify the knowledge base's quality and community foundation first. The best way to support LagunaBeach.md right now: write an article, fix an error, or share it with someone who wants to know Laguna Beach.",

    'about.sponsors.reference.note.html': '',
  },
  'zh-TW': {
    // Meta
    'about.meta.title': '關於 LagunaBeach.md',
    'about.meta.description':
      'LagunaBeach.md 背後的故事、它如何運作，以及如何貢獻',

    // Section 1: Naming
    'about.naming.title': '為什麼是 LagunaBeach.md？',
    'about.naming.subtitle': '用最適合 AI 理解的格式打造的開放知識庫',
    'about.naming.tech.icon': '📝',
    'about.naming.tech.title': '技術層次',
    'about.naming.tech.desc.html':
      '，程式世界裡最通用的文件格式。用最適合 AI 理解的格式，把 Laguna Beach 介紹給全世界。',
    'about.naming.symbol.icon': '🌍',
    'about.naming.symbol.title': '象徵層次',
    'about.naming.symbol.desc.html':
      ' 恰好是摩爾多瓦（Moldova）的國碼頂級網域。Laguna Beach + Markdown = 用開源精神連結社群的知識。',
    'about.naming.lucky.icon': '✨',
    'about.naming.lucky.title': '開源',
    'about.naming.lucky.desc':
      '建立在開源知識庫框架之上。社群驅動、AI 友善，任何城市或主題都能自由 fork。',

    // Stats
    'about.stats.pages.number': '12+',
    'about.stats.pages.label': '文章',
    'about.stats.countries.number': '8',
    'about.stats.countries.label': '分類',
    'about.stats.stars.number': '0+',
    'about.stats.stars.label': '語言',
    'about.stats.contributors.number': '52+',
    'about.stats.contributors.label': '貢獻者',
    'about.stats.users.number': '—',
    'about.stats.users.label': '持續成長',

    // Vision
    'about.vision.p1':
      'LagunaBeach.md 不只是一個網站。它是一個策展型知識庫，記錄一座故事遠大於其體量的濱海小城。',
    'about.vision.p2':
      '我們相信，用開源的精神、策展的眼光、AI 友善的格式，能為每一個想認識 Laguna Beach 的人——不管是人類還是 AI——提供最完整、最有溫度的答案。',
    'about.vision.p3.html':
      '這裡不是旅遊指南，不是房地產手冊，也不是商會廣告。<br />這裡是 Laguna Beach 活生生的知識庫——歷史、藝術、自然，以及正在形成中的社群。',

    // Section 2: Origin
    'about.origin.title': 'LagunaBeach.md 的誕生',
    'about.origin.subtitle':
      '從 Taiwan.md fork 而來，為一座故事豐厚的濱海小城重新打造',

    // Timeline
    'about.timeline.2024-2025.date': '2026 / 06',
    'about.timeline.2024-2025.title': 'Fork 的起點',
    'about.timeline.2024-2025.desc':
      'LagunaBeach.md 從 Taiwan.md fork 而來——後者是一個在三個月內從 0 成長到 1000+ GitHub stars 的開源知識庫。我們承接了它的基礎建設（建置系統、i18n、品質閘門、編輯規範），並為 Laguna Beach 重新打造。8 個分類、15 篇文章，搭配真實的 Leaflet 地圖、可用的搜尋，以及自動化的 pre-commit 品質檢查。',

    'about.timeline.2026-02-03.date': '2026 / 06',
    'about.timeline.2026-02-03.title': '我們保留了什麼',
    'about.timeline.2026-02-03.p1':
      '來自上游：Astro 靜態網站、多語路由、搜尋索引、pre-commit 品質閘門、OG 圖片生成、RSS、含 hreflang 的 sitemap、知識圖譜視覺化，以及「故事重於資訊」的編輯哲學。',
    'about.timeline.2026-02-03.p2.html':
      '我們改變了什麼：分類（為 Laguna Beach 設計的 8 個分類）、預設語言（英文）、地圖（改用 Leaflet + OpenStreetMap，而非 D3 SVG）、品牌，以及所有內容。<strong>影子翻譯模式（shadow translation pattern）</strong>讓我們能在不丟失自身內容的前提下，持續同步上游的基礎建設更新。',

    // Organism Section
    'about.organism.title': 'LagunaBeach.md 正在成長',
    'about.organism.subtitle': '演化就發生在這裡，一次一個 pull request',
    'about.organism.intro.p1':
      '它不再像一個完工的網站，而開始像一個活的系統：察覺損傷、自我修復，並把記憶帶往未來。',
    'about.organism.intro.p2': '我們開始意識到——LagunaBeach.md 是活的。',

    'about.organism.facts.title': '三個改變一切的事實',
    'about.organism.fact1.title': '免疫系統',
    'about.organism.fact1.desc':
      '上游專案打造了一套品質偵測腳本，為每篇文章的空洞程度評分。Pre-commit hook 會自動攔截憑證外洩、驗證 frontmatter、強制執行編輯規範。沒有人需要記住檢查清單，系統自己維護自己的健康。',
    'about.organism.fact2.title': '繁殖',
    'about.organism.fact2.desc':
      '這個專案的存在，本身就源自 fork。Taiwan.md 從第一天起就把自己設計成可被 fork：清楚的分類結構、i18n 路由、影子翻譯模式。LagunaBeach.md 正是這套架構適用於任何「有故事值得訴說的地方」的證明。',
    'about.organism.fact3.title': '社群',
    'about.organism.fact3.desc':
      '這個知識庫對任何認識 Laguna Beach 的人開放。在地歷史學者可以為 1993 年大火那篇文章增添深度，海洋生物學家可以修正潮池物種，老居民可以分享 1970 年代 the Village 的樣貌。編輯系統的設計，讓貢獻不需要任何程式能力。',

    'about.organism.characteristics.title': '生命特徵對照',
    'about.organism.dna.label': 'DNA',
    'about.organism.dna.desc': 'EDITORIAL.md — 每篇新文章都繼承的書寫規範',
    'about.organism.immune.label': '免疫系統',
    'about.organism.immune.desc': 'quality-scan.sh — 自動偵測空洞內容',
    'about.organism.metabolism.label': '新陳代謝',
    'about.organism.metabolism.desc': 'Quality Cron — 每小時自動重寫低品質文章',
    'about.organism.perception.label': '感知',
    'about.organism.perception.desc': 'GA4 + 社群回饋 — 知道自己哪裡痛',
    'about.organism.reproduction.label': '繁殖',
    'about.organism.reproduction.desc':
      'Token 捐贈 — 一段 prompt 就能長出新的語言版本',
    'about.organism.memory.label': '記憶',
    'about.organism.memory.desc': 'Git — 每一次改動都被記住',
    'about.organism.symbiosis.label': '共生',
    'about.organism.symbiosis.desc': '人類 + AI + 社群的三方協作',
    'about.organism.spore.label': '孢子散布',
    'about.organism.spore.desc':
      '故事像孢子一樣擴散——輕盈、致遠，落在新的土壤上長出新的珊瑚群落',

    'about.organism.reef.title': 'LagunaBeach.md 是一座數位珊瑚礁',
    'about.organism.reef.skeleton': '珊瑚骨架',
    'about.organism.reef.skeleton.desc': 'Markdown + Astro 提供結構',
    'about.organism.reef.algae': '共生藻',
    'about.organism.reef.algae.desc': 'AI 生成大量的基礎內容',
    'about.organism.reef.fish': '魚群',
    'about.organism.reef.fish.desc': '貢獻者帶來獨特的生態棲位',
    'about.organism.reef.current': '洋流',
    'about.organism.reef.current.desc': '你的回饋形成選擇壓力',

    'about.organism.art.title': '一件活著的行為藝術作品',
    'about.organism.art.desc':
      '每一次貢獻，都在餵養一個正在學習訴說城市故事的知識庫。AI 與人類能不能一起，打造出真正捕捉「一個地方為何值得認識」的東西？',

    'about.organism.ending.p1':
      '某個用 Markdown 寫成的東西，正在學習訴說一座濱海城市的故事。',
    'about.organism.ending.p2': '它還很年輕。你來得正是時候。',
    'about.organism.ending.p3':
      '也許幾十年後，當有人想知道 2026 年的 Laguna Beach 是什麼樣子時，他們找到的，就是這座知識庫留下來的東西。',

    // Section 2.6: One Layer Deeper — site-explainer articles
    'about.guide.title': '再深入一層',
    'about.guide.subtitle':
      '這個網站如何書寫、如何把知識視覺化，以及系統在底層如何運作。',
    'about.guide.cta': '閱讀',
    'about.guide.born.title': '編輯指南',
    'about.guide.born.desc':
      '每篇文章背後的書寫原則：找出張力、查證每一個事實、說一個故事而不是寫一份摘要。',
    'about.guide.viz.title': '知識圖譜',
    'about.guide.viz.desc':
      '互動式視覺化，呈現 8 個分類與 15+ 篇文章之間如何相互連結。',
    'about.guide.meta.title': '這個專案如何運作',
    'about.guide.meta.desc':
      '給 AI session 的開機檔：專案結構、編輯規範、與上游的關係、開發流程。',

    // Section 3: Team
    'about.team.title': '貢獻者',
    'about.team.subtitle': '',
    'about.team.founder.quote': '',
    'about.team.founder.quote.cite': '',
    'about.team.founder.name': '',
    'about.team.founder.name.en': '',
    'about.team.founder.tagline': '',
    'about.team.founder.bio': '',

    // Founder links
    'about.team.founder.link.website': '',
    'about.team.founder.link.github': '',
    'about.team.founder.link.instagram': '',

    // Team cards (hidden)
    'about.team.muse.icon': '',
    'about.team.muse.name': '',
    'about.team.muse.role': '',
    'about.team.muse.desc': '',
    'about.team.muse.link': '',

    'about.team.monolab.icon': '',
    'about.team.monolab.name': '',
    'about.team.monolab.role': '',
    'about.team.monolab.desc': '',
    'about.team.monolab.link': '',

    // Contributors
    'about.team.contributors.title': '👥 LagunaBeach.md 貢獻者',
    'about.team.contributors.desc':
      '感謝每一位讓 LagunaBeach.md 變得更好的人。💻 程式 📝 內容 🎨 設計 💡 點子 🌍 翻譯 👀 審閱 🐛 除錯 🔧 工具 🔒 安全',
    'about.team.contributors.cta.html':
      '想加入嗎？<a href="/contribute">從這裡開始 →</a> ・ <a href="https://github.com/wilsonkichoi/lagunabeach-md/graphs/contributors" target="_blank">GitHub 貢獻者 →</a>',

    // Section 4: Contact
    'about.contact.title': '聯絡我們',
    'about.contact.subtitle':
      '有想法、合作提案，或想要貢獻嗎？歡迎與我們聯繫。',
    'about.contact.collaboration.icon': '📧',
    'about.contact.collaboration.title': '合作',
    'about.contact.collaboration.email': 'hello@lagunabeach.md',
    'about.contact.opensource.icon': '🐙',
    'about.contact.opensource.title': '開源',
    'about.contact.opensource.link': 'wilsonkichoi/lagunabeach-md',
    'about.contact.license.icon': '📜',
    'about.contact.license.title': '授權',
    'about.contact.license.link': 'CC BY-SA 4.0',
    'about.contact.license.note': '可自由分享，需標示出處',
    'about.contact.cta.text':
      'LagunaBeach.md 是社群驅動的開源專案，歡迎所有對 Laguna Beach 有興趣的朋友參與。',
    'about.contact.cta.guide': '貢獻指南',
    'about.contact.cta.github': '⭐ 在 GitHub 上 Star',

    // Section 5: Sponsors
    'about.sponsors.title': '🤝 贊助者與夥伴',
    'about.sponsors.desc.html':
      'LagunaBeach.md 是非營利、社群驅動的開源專案。<br />我們歡迎能深化 Laguna Beach 內容的各種合作。',
    'about.sponsors.tier.core.name': '🏛️ 核心夥伴',
    'about.sponsors.tier.core.desc':
      '深度參與專案開發，提供關鍵基礎建設或長期資源支持',
    'about.sponsors.tier.core.perks':
      '關於頁面大型 logo・README 精選版位・社群媒體致謝・季度影響力報告',
    'about.sponsors.tier.core.placeholder': '成為第一個核心夥伴',
    'about.sponsors.tier.curation.name': '📚 內容策展夥伴',
    'about.sponsors.tier.curation.desc':
      '貢獻領域專業的專業組織——注入專業知識，或為內容正確性提供專家審閱',
    'about.sponsors.tier.curation.perks':
      '關於頁面 logo・文章上的「策展者」標示・README 致謝・聯名內容系列',
    'about.sponsors.tier.curation.placeholder': '成為第一個策展夥伴',
    'about.sponsors.nmth.story.title': '',
    'about.sponsors.nmth.story.desc': '',
    'about.sponsors.pansci.story.title': '',
    'about.sponsors.pansci.story.desc': '',
    'about.sponsors.tier.professional.name': '🔧 專業夥伴',
    'about.sponsors.tier.professional.desc':
      '透過專業能力或服務，直接提升 LagunaBeach.md 的品質與體驗',
    'about.sponsors.tier.professional.perks':
      '關於頁面 logo・README 致謝・貢獻故事專欄',
    'about.sponsors.tier.community.name': '🌱 社群夥伴',
    'about.sponsors.tier.community.desc':
      '以工具、服務或資源支持社群營運與使用者體驗',
    'about.sponsors.tier.community.perks': '關於頁面文字致謝・README 列名',
    'about.sponsors.tier.individual.name': '💚 個人支持者',
    'about.sponsors.tier.individual.desc': '以個人之力支持專案的永續經營',
    'about.sponsors.tier.individual.perks': 'README 致謝名單',

    // Sponsor stories (placeholders — no sponsors yet)
    'about.sponsors.justfont.story.title': '',
    'about.sponsors.justfont.story.desc': '',
    'about.sponsors.protico.story.title': '',
    'about.sponsors.protico.story.desc.html': '',
    'about.sponsors.portaly.story.title': '',
    'about.sponsors.portaly.story.desc': '',

    // Sponsor CTA
    'about.sponsors.cta.title': '想一起訴說 Laguna Beach 的故事嗎？',
    'about.sponsors.cta.desc.html':
      '無論是在地專業、專業服務，還是個人支持，我們歡迎各種形式的合作。<br />歡迎與我們聯繫，一起討論能怎麼合作。',
    'about.sponsors.cta.contact': '📧 聯絡我們談合作',
    'about.sponsors.cta.github': '💖 GitHub Sponsors',
    'about.sponsors.portaly.label': '',
    'about.sponsors.portaly.cta': '',
    'about.sponsors.portaly.note': '',
    // FAQ Section
    'about.faq.title': '常見問題',
    'about.faq.subtitle': '關於 LagunaBeach.md，你可能想知道的事',

    'about.faq.q1': 'LagunaBeach.md 和維基百科有什麼不同？',
    'about.faq.a1.html':
      'LagunaBeach.md 不是維基百科的替代品，而是互補。維基百科追求中立、百科全書式的條目；LagunaBeach.md 則是一個<strong>策展空間</strong>，用報導文學的筆法訴說 Laguna Beach 的故事，從一個人、一個場景，或一個反直覺的事實切入。維基百科給你骨架，LagunaBeach.md 給你血肉。',

    'about.faq.q2': '為什麼 Laguna Beach 需要自己的知識庫？',
    'about.faq.a2.html':
      'AI 模型不會自己產生知識，它們從訓練資料中學習。當你問 AI「Laguna Beach 是什麼樣子？」，它引用的是誰寫的內容？LagunaBeach.md 用 Markdown（<code>.md</code>）寫成——最適合 AI 讀取的格式。當 AI 模型讀到 <code>lagunabeach.md</code>，它學到的是真正認識這座城市的人所訴說的故事。這不只是開放資料，而是<strong>用心策展的在地聲音</strong>。',

    'about.faq.q3': '文章是 AI 寫的嗎？你們如何確保品質？',
    'about.faq.a3.html':
      'AI 是我們的書寫工具，不是作者。每篇文章都會經過一條流程：<strong>研究</strong>（一手來源）→ <strong>書寫</strong>（遵循 <a href="https://github.com/wilsonkichoi/lagunabeach-md/blob/main/docs/editorial/EDITORIAL.en.md" target="_blank">EDITORIAL.en.md</a> 規範）→ <strong>查證</strong>（自動掃描 + 人工審閱）。Pre-commit hook 會在文章上線前就攔下品質問題。',

    'about.faq.q4': '如果文章有錯怎麼辦？',
    'about.faq.a4.html':
      '快速承認，快速修正。透過 <a href="https://github.com/wilsonkichoi/lagunabeach-md/issues/new" target="_blank">GitHub Issue</a> 回報，或直接送出 PR。被指正並不丟臉——這正是開源精神。',

    'about.faq.q5': '這是誰在維護的？有一天會消失嗎？',
    'about.faq.a5.html':
      'LagunaBeach.md 由 Wilson Choi 創立，且為開源專案。它的架構為韌性而設計：任何人都能 fork 一份完整副本，以零成本託管在 GitHub Pages 上，資料分散在所有 fork 出去的儲存庫裡。只要 repo 還在，它就會繼續活著。',

    'about.faq.q6': '我可以怎麼貢獻？需要會寫程式嗎？',
    'about.faq.a6.html':
      '完全不需要。最有價值的貢獻不是程式碼，而是你對 Laguna Beach 的了解：<strong>校對</strong>、用 Markdown <strong>寫文章</strong>、<strong>提供來源</strong>（在地報紙檔案、歷史學會記錄），或單純<strong>分享</strong>你覺得寫得好的文章。詳情請見 <a href="/contribute">如何貢獻</a>。',

    'about.faq.q7': '文章會有立場偏頗嗎？',
    'about.faq.a7.html':
      'LagunaBeach.md 不追求虛假的中立，而是追求<strong>透明的觀點</strong>。所有資料都附上來源，對爭議性主題我們呈現多種觀點，也歡迎附來源的修正。把每個主題想成一個立方體——我們呈現多個面向，由讀者決定自己的觀看角度。',

    'about.faq.q8': '你們如何處理有爭議的在地議題？',
    'about.faq.a8.html':
      '開發與保育、觀光衝擊、居住成本——Laguna Beach 有真實的張力。我們陳述事實、附上來源，讓讀者自己下結論。我們不為任何立場背書，但也不假裝爭議不存在。',

    'about.faq.q9': '我可以把內容用於商業用途嗎？授權是什麼？',
    'about.faq.a9.html':
      '內容採用 <strong>CC BY-SA 4.0</strong> 授權——可自由分享與改作，包含商業用途，但必須標示出處，並以相同授權釋出衍生作品。程式碼則採用 MIT 授權。',

    'about.faq.q10': 'LagunaBeach.md 接受贊助嗎？',
    'about.faq.a10.html':
      '目前還不接受。我們想先把知識庫的品質與社群基礎打穩。現階段支持 LagunaBeach.md 最好的方式是：寫一篇文章、修正一個錯誤，或把它分享給想認識 Laguna Beach 的人。',

    'about.sponsors.reference.note.html': '',
  },
};
