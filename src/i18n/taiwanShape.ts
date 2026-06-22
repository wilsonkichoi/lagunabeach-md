export const taiwanShapeUI = {
  en: {
    // Meta
    'taiwanShape.meta.title':
      "Taiwan's Shape — Open-Source Maps, SVG, GeoJSON & TopoJSON Data",
    'taiwanShape.meta.description':
      "Complete open-source Taiwan map data: SVG outlines, TopoJSON for counties and townships, usage examples in D3.js, Leaflet, Python, and Vue. AI keeps drawing Taiwan wrong — here's the correct data.",

    // Hero
    'taiwanShape.hero.kicker': '🗺️ Open Cartographic Archive',
    'taiwanShape.hero.title': "Taiwan's Shape",
    'taiwanShape.hero.subtitle':
      'SVG, GeoJSON, TopoJSON — a complete open-source map dataset for developers, designers, and researchers.',

    // Story
    'taiwanShape.story.heading': 'Why the shape of Taiwan matters',
    'taiwanShape.story.p1':
      "Ask any AI image generator to draw Taiwan and watch what happens. It usually spits out a fat, rounded blob somewhere between an olive and a potato. Taiwan is not an olive. It's a 394-kilometer-long sweet potato with a central mountain range and more than 100 offshore islands.",
    'taiwanShape.story.p2':
      "Getting the shape right is not just a design nit — it's an identity problem. This page collects all the open-source assets we use on taiwan.md so anyone can render Taiwan accurately in their own project.",

    // Comparison
    'taiwanShape.comparison.title': '🤖 vs. 🇹🇼 — AI gets this wrong. Always.',
    'taiwanShape.comparison.aiLabel': 'AI-generated (wrong)',
    'taiwanShape.comparison.correctLabel': 'Correct (Wikipedia)',

    // SVG section
    'taiwanShape.svg.heading': '📐 SVG outlines — instant drop-in',
    'taiwanShape.svg.description':
      'Four hand-picked SVG files, all CC / public domain. Drop directly into any website, app, or design file.',
    'taiwanShape.svg.usageHeading': 'Usage examples',
    'taiwanShape.svg.licenseNote':
      'All SVGs are under Creative Commons or public domain. Attribution appreciated but not required.',

    // GeoJSON / TopoJSON section
    'taiwanShape.geo.heading': '🌐 TopoJSON — interactive maps at county level',
    'taiwanShape.geo.intro1':
      "For interactive maps — zoom, hover, fill by data value — you need real geographic coordinates, not just SVG paths. We bundle TopoJSON files extracted from Waiting's taiwan-vue-components (MIT License, 2018).",
    'taiwanShape.geo.intro2':
      'TopoJSON is GeoJSON compressed: shared borders between counties are stored only once, making files 80% smaller. It can be converted to GeoJSON on the fly with topojson-client.',
    'taiwanShape.geo.formatHeading': 'TopoJSON vs GeoJSON — which one?',
    'taiwanShape.geo.formatTopo':
      'TopoJSON: smaller file size, shared topology between adjacent regions, the right choice for web maps.',
    'taiwanShape.geo.formatGeo':
      'GeoJSON: simpler format, direct compatibility with Python geopandas, QGIS, and most GIS tools.',
    'taiwanShape.geo.countryHeading': 'Country-level outline (22 counties)',
    'taiwanShape.geo.countryDesc':
      '~21 KB TopoJSON file with all 22 counties and special municipalities as separate features. Perfect for choropleth maps.',
    'taiwanShape.geo.townsHeading': 'Township-level (6 special municipalities)',
    'taiwanShape.geo.townsDesc':
      "We bundle the 6 special municipalities' township-level files. For the other 16 counties, see the source repository on GitHub.",

    // Admin codes
    'taiwanShape.codes.heading': '🧭 Administrative division codes',
    'taiwanShape.codes.intro':
      "Taiwan's administrative divisions use numeric codes. Here's the reference table for all 22 county-level divisions (file naming follows `towns-{code}.json`).",
    'taiwanShape.codes.codeCol': 'Code',
    'taiwanShape.codes.nameCol': 'Division',
    'taiwanShape.codes.typeCol': 'Type',

    // Usage examples
    'taiwanShape.examples.heading': '💻 Usage examples',
    'taiwanShape.examples.htmlTitle': 'HTML — static embed',
    'taiwanShape.examples.cssTitle': 'CSS — background image',
    'taiwanShape.examples.d3Title': 'D3.js — interactive choropleth',
    'taiwanShape.examples.pythonTitle': 'Python — geopandas',
    'taiwanShape.examples.leafletTitle': 'Leaflet — tile-based map overlay',
    'taiwanShape.examples.vueTitle': 'Vue — taiwan-vue-components',

    // Other sources
    'taiwanShape.others.heading': '📚 Other open data sources',
    'taiwanShape.others.intro':
      "If you need more than what's bundled here — higher resolution, different projections, historical administrative boundaries — these are the sources we recommend:",

    // License
    'taiwanShape.license.heading': '⚖️ License & attribution',
    'taiwanShape.license.intro':
      'Every file on this page is open source. Here are the exact origins and licenses:',

    // Download
    'taiwanShape.download.svg': 'Download SVG',
    'taiwanShape.download.topo': 'Download TopoJSON',
    'taiwanShape.download.all': 'Download all (ZIP)',
    'taiwanShape.copy.button': 'Copy SVG',
    'taiwanShape.copy.copied': '✓ Copied',
  },

  'zh-TW': {
    // Meta
    'taiwanShape.meta.title':
      '台灣的形狀 — 開源地圖資料集：SVG、GeoJSON、TopoJSON',
    'taiwanShape.meta.description':
      '完整的開源台灣地圖資料：SVG 輪廓、縣市與鄉鎮級 TopoJSON、D3.js / Leaflet / Python / Vue 使用範例。AI 畫出來的台灣永遠是錯的，這裡是對的。',

    'taiwanShape.hero.kicker': '🗺️ 開源地圖資料集',
    'taiwanShape.hero.title': '台灣的形狀',
    'taiwanShape.hero.subtitle':
      'SVG、GeoJSON、TopoJSON — 給開發者、設計師、研究者的完整開源地圖資料。',

    'taiwanShape.story.heading': '為什麼台灣的形狀重要',
    'taiwanShape.story.p1':
      '讓任何一款 AI 畫圖工具畫台灣，出來的幾乎都是一顆圓圓胖胖、介於橄欖和馬鈴薯之間的東西。台灣不是橄欖。它是一條 394 公里長的番薯，有一條縱貫南北的中央山脈，還有一百多座離島。',
    'taiwanShape.story.p2':
      '把形狀畫對，不只是設計細節，是身份問題。這個頁面收集我們在 taiwan.md 上使用的所有開源地圖素材，讓任何人都能在自己的專案裡精確地呈現台灣。',

    'taiwanShape.comparison.title': '🤖 vs. 🇹🇼 — AI 每次都畫錯，真的',
    'taiwanShape.comparison.aiLabel': 'AI 生成（錯的）',
    'taiwanShape.comparison.correctLabel': '正確版本（維基百科）',

    'taiwanShape.svg.heading': '📐 SVG 輪廓 — 直接嵌入',
    'taiwanShape.svg.description':
      '四組精選 SVG 檔案，全部是 CC 授權或公有領域。可以直接丟進任何網頁、App 或設計稿。',
    'taiwanShape.svg.usageHeading': '使用方式',
    'taiwanShape.svg.licenseNote':
      '所有 SVG 皆為 Creative Commons 授權或公有領域。標註來源為佳但非必要。',

    'taiwanShape.geo.heading': '🌐 TopoJSON — 縣市級互動地圖',
    'taiwanShape.geo.intro1':
      '如果你要做的是互動地圖——縮放、滑鼠懸停、用資料值填色——你需要的不是 SVG 路徑，而是真正的地理座標資料。我們打包了從 Waiting 的 taiwan-vue-components（MIT 授權，2018）萃取的 TopoJSON 檔案。',
    'taiwanShape.geo.intro2':
      'TopoJSON 是 GeoJSON 的壓縮版：相鄰縣市共用的邊界只儲存一次，檔案小 80%。用 topojson-client 可以即時轉回 GeoJSON。',
    'taiwanShape.geo.formatHeading': 'TopoJSON vs GeoJSON — 該選哪一個',
    'taiwanShape.geo.formatTopo':
      'TopoJSON：檔案小、相鄰區域共用邊界、適合做網頁互動地圖。',
    'taiwanShape.geo.formatGeo':
      'GeoJSON：格式簡單、直接相容 Python geopandas、QGIS 和多數 GIS 工具。',
    'taiwanShape.geo.countryHeading': '全國輪廓（22 個縣市）',
    'taiwanShape.geo.countryDesc':
      '約 21 KB 的 TopoJSON 檔案，包含 22 個縣市與直轄市，每個都是獨立的 feature。做 choropleth 地圖的起點。',
    'taiwanShape.geo.townsHeading': '六都鄉鎮級資料',
    'taiwanShape.geo.townsDesc':
      '我們打包了六都的鄉鎮級 TopoJSON 檔案。其他 16 個縣市的檔案請到原始 GitHub repo 下載。',

    'taiwanShape.codes.heading': '🧭 行政區代碼對照表',
    'taiwanShape.codes.intro':
      '台灣的行政區使用數字代碼編碼。以下是 22 個縣市級行政區的對照表（檔名規則：`towns-{code}.json`）。',
    'taiwanShape.codes.codeCol': '代碼',
    'taiwanShape.codes.nameCol': '行政區',
    'taiwanShape.codes.typeCol': '類型',

    'taiwanShape.examples.heading': '💻 使用範例',
    'taiwanShape.examples.htmlTitle': 'HTML — 靜態嵌入',
    'taiwanShape.examples.cssTitle': 'CSS — 背景圖片',
    'taiwanShape.examples.d3Title': 'D3.js — 互動 choropleth',
    'taiwanShape.examples.pythonTitle': 'Python — geopandas',
    'taiwanShape.examples.leafletTitle': 'Leaflet — 瓦片地圖疊圖',
    'taiwanShape.examples.vueTitle': 'Vue — taiwan-vue-components',

    'taiwanShape.others.heading': '📚 其他開源資料來源',
    'taiwanShape.others.intro':
      '如果你需要的比這裡打包的更多——更高解析度、不同投影、歷史行政區界——以下是我們推薦的來源：',

    'taiwanShape.license.heading': '⚖️ 授權與出處',
    'taiwanShape.license.intro':
      '這個頁面上的每個檔案都是開源的。以下是完整的來源與授權資訊：',

    'taiwanShape.download.svg': '下載 SVG',
    'taiwanShape.download.topo': '下載 TopoJSON',
    'taiwanShape.download.all': '下載全部（ZIP）',
    'taiwanShape.copy.button': '複製 SVG',
    'taiwanShape.copy.copied': '✓ 已複製',
  },
} as const;
