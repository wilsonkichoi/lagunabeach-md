/**
 * dashboard-client.js — /dashboard 全部 client-side 渲染邏輯
 *
 * 2026-06-13 refactor session 從 dashboard.template.astro 抽出（原 <script
 * define:vars={{ lang }}> 內嵌 2,729 行 × 6 語言頁各一份 inline copy）。
 * 抽成 Astro-processed module 後：bundle 一份 hashed .js 六頁共用 + 瀏覽器可快取，
 * 每頁 HTML 減 ~100KB。內容 1:1 verbatim 搬運（sed 行段抽取）。
 *
 * lang 來源改變：原 define:vars 注入 → 改讀 <html lang>（Layout 設定、
 * post-build-check 每 build 驗證六語言 lang attribute 正確性）。值域相同。
 */
const lang = document.documentElement.getAttribute('lang') || 'zh-TW';

const isEn = lang === 'en';
const categoryLabels = {
  about: isEn ? 'About' : '關於',
  art: isEn ? 'Art' : '藝術',
  culture: isEn ? 'Culture' : '文化',
  economy: isEn ? 'Economy' : '經濟',
  food: isEn ? 'Food' : '美食',
  geography: isEn ? 'Geography' : '地理',
  history: isEn ? 'History' : '歷史',
  lifestyle: isEn ? 'Lifestyle' : '生活',
  music: isEn ? 'Music' : '音樂',
  nature: isEn ? 'Nature' : '自然',
  people: isEn ? 'People' : '人物',
  society: isEn ? 'Society' : '社會',
  technology: isEn ? 'Technology' : '科技',
};

const langPrefix = isEn ? '/en' : '';

let allArticles = [];
let sortField = 'date';
let sortDir = -1; // -1 = desc

// ── Section timestamp helpers ──
// 每個資料來源的「最後更新時間」顯示在對應 section 標題右邊。
// 資料來源分兩群：(A) prebuild 時生成的 vitals/articles/organism/translations
// 共享同一個 timestamp；(B) analytics（SENSES.md fetch-sense-data.sh 產出）
// 跟 prebuild 不同時間。未來可擴充其他 live 來源。
function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const relText = isEn
    ? diffMin < 1
      ? 'just now'
      : diffMin < 60
        ? diffMin + ' min ago'
        : diffHr < 24
          ? diffHr + ' hr ago'
          : diffDay + ' d ago'
    : diffMin < 1
      ? '剛才'
      : diffMin < 60
        ? diffMin + ' 分鐘前'
        : diffHr < 24
          ? diffHr + ' 小時前'
          : diffDay + ' 天前';
  // 精確時間（本地時區）
  const pad = (n) => String(n).padStart(2, '0');
  const abs =
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    ' ' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes());
  const prefix = isEn ? 'Updated ' : '資料更新 ';
  return prefix + abs + ' (' + relText + ')';
}
function renderSectionTimestamps(sourceTimestamps) {
  document.querySelectorAll('.section-timestamp').forEach((el) => {
    const src = el.getAttribute('data-source');
    const iso = sourceTimestamps[src];
    const txt = formatRelativeTime(iso);
    if (txt) {
      el.textContent = txt;
      el.setAttribute('title', iso); // hover 顯示 ISO
    }
  });
}

// ── Fetch all data ──
Promise.all([
  fetch('/api/dashboard-articles.json').then((r) => r.json()),
  fetch('/api/dashboard-vitals.json').then((r) => r.json()),
  fetch('/api/dashboard-organism.json').then((r) => r.json()),
  fetch('/api/dashboard-translations.json').then((r) => r.json()),
  fetch('/api/dashboard-i18n.json')
    .then((r) => r.json())
    .catch(() => null),
  fetch('/api/dashboard-analytics.json')
    .then((r) => r.json())
    .catch(() => null),
  fetch('/api/dashboard-spores.json')
    .then((r) => r.json())
    .catch(() => null),
  fetch('/api/contributors.json')
    .then((r) => r.json())
    .catch(() => null),
])
  .then(
    ([
      articles,
      vitals,
      organism,
      translations,
      i18nCoverage,
      analytics,
      spores,
      contributors,
    ]) => {
      allArticles = articles;
      // 各 section 資料更新時間（articles 共用 vitals.lastUpdated — 同批生成）
      renderSectionTimestamps({
        vitals: vitals && vitals.lastUpdated,
        articles: vitals && vitals.lastUpdated,
        organism: organism && organism.lastUpdated,
        translations: translations && translations.lastUpdated,
        i18n: i18nCoverage && i18nCoverage.generated,
        analytics: analytics && analytics.lastUpdated,
        spores: spores && spores.lastUpdated,
        contributors: contributors && contributors.lastUpdated,
      });
      const steps = [
        () => renderVitals(vitals),
        () => renderActivityFeed(articles),
        () => renderRegistry(articles),
        () => renderHealthDistribution(articles),
        () => renderOrganism(organism),
        () => renderTranslations(translations, vitals),
        () => {
          if (i18nCoverage) renderI18nCoverage(i18nCoverage);
        },
        () => renderImmune(articles, vitals),
        () => {
          if (spores) renderSpores(spores);
        },
        () => {
          if (contributors) renderContributors(contributors);
        },
        () => renderGrowth(articles),
        () => renderContentAnalysis(articles),
        () => {
          if (analytics) renderAnalytics(analytics);
        },
        () => renderNextSteps(articles, translations),
        () => renderFooter(vitals),
      ];
      steps.forEach((fn, i) => {
        try {
          fn();
        } catch (e) {
          console.error(`Dashboard render step ${i} failed:`, e);
        }
      });
    },
  )
  .catch((e) => console.error('Dashboard fetch failed:', e));

// ── Number Roll-up Animation ──
function animateValue(el, start, end, duration, suffix) {
  suffix = suffix || '';
  const startTime = performance.now();
  const isFloat = String(end).includes('.');
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const current = start + (end - start) * eased;
    el.textContent =
      (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Vital Signs ──
function renderVitals(v) {
  // Hero stats
  const langCount = Object.keys(v.languageCoverage).length;
  setText('hero-stat-articles', v.totalArticles);
  setText('hero-stat-languages', langCount);
  setText('hero-stat-contributors', v.contributors || '—');

  // Animate hero stats
  animateValue(
    document.getElementById('hero-stat-articles'),
    0,
    v.totalArticles,
    1200,
  );
  setTimeout(
    () =>
      animateValue(
        document.getElementById('hero-stat-languages'),
        0,
        langCount,
        800,
      ),
    200,
  );
  setTimeout(() => {
    if (typeof v.contributors === 'number') {
      animateValue(
        document.getElementById('hero-stat-contributors'),
        0,
        v.contributors,
        800,
      );
    }
  }, 400);

  // Vital cards with staggered animation
  const vitalData = [
    { id: 'vital-heartbeat', value: v.articlesLast7Days, suffix: '' },
    { id: 'vital-cells', value: v.totalArticles, suffix: '' },
    {
      id: 'vital-immunity',
      value: parseFloat(v.humanReviewedPercent),
      suffix: '%',
    },
    {
      id: 'vital-dna',
      value: null,
      text: `${langCount} ${isEn ? 'langs' : '語言'}`,
    },
    {
      id: 'vital-revision',
      value: parseFloat(v.avgRevision),
      suffix: '',
      prefix: '×',
    },
  ];

  vitalData.forEach((d, i) => {
    const el = document.getElementById(d.id);
    if (!el) return;
    if (d.value === null) {
      // non-numeric, just set text
      setTimeout(() => {
        el.textContent = d.text;
      }, i * 100);
    } else {
      setTimeout(() => {
        const prefix = d.prefix || '';
        const suffix = d.suffix || '';
        const isFloat = String(d.value).includes('.');
        const startTime = performance.now();
        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / 800, 1);
          const eased = 1 - (1 - progress) * (1 - progress);
          const current = d.value * eased;
          el.textContent =
            prefix +
            (isFloat ? current.toFixed(1) : Math.round(current)) +
            suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      }, i * 100);
    }
  });
}

// ── Activity Feed ──
function renderActivityFeed(articles) {
  const feed = document.getElementById('activity-feed');
  // Sort by lastModified descending (git commit date), take top 10
  const recent = [...articles]
    .filter((a) => a.lastModified)
    .sort((a, b) => b.lastModified.localeCompare(a.lastModified))
    .slice(0, 10);

  if (recent.length === 0) {
    feed.textContent = isEn ? 'No recent activity' : '暫無最近活動';
    return;
  }

  feed.innerHTML = recent
    .map((a) => {
      const emoji = (a.revision || 0) > 1 ? '✏️' : '📄';
      const articleUrl = langPrefix + '/' + a.category + '/' + a.slug;
      const dateStr = a.lastModified || a.date || '';
      const subject = a.commitSubject || '';
      // Extract short action label from commit subject (e.g. "rewrite:", "fix:", "translate:")
      const actionMatch = subject.match(/^[🧬\s]*(?:\[semiont\]\s*)?(\w+):/);
      const actionLabel = actionMatch ? actionMatch[1] : '';
      const badgeHtml = actionLabel
        ? '<span class="feed-badge feed-badge-' +
          actionLabel +
          '">' +
          actionLabel +
          '</span>'
        : '';
      return (
        '<div class="feed-item">' +
        '<span class="feed-emoji">' +
        emoji +
        '</span>' +
        '<a href="' +
        articleUrl +
        '" target="_blank" rel="noopener" class="feed-title">' +
        a.title +
        '</a>' +
        badgeHtml +
        '<span class="feed-date">' +
        dateStr +
        '</span>' +
        '</div>'
      );
    })
    .join('');
}

// ── Article Registry ──
function renderRegistry(articles) {
  // Populate category filter with counts
  const catCounts = {};
  articles.forEach((a) => {
    catCounts[a.category] = (catCounts[a.category] || 0) + 1;
  });
  const cats = Object.keys(catCounts).sort();
  const catSelect = document.getElementById('filter-category');
  cats.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = `${categoryLabels[c] || c} (${catCounts[c]})`;
    catSelect.appendChild(opt);
  });

  renderTable(articles);
  bindRegistryEvents();
}

function renderTable(articles) {
  const tbody = document.getElementById('registry-body');
  const sorted = [...articles].sort((a, b) => {
    let va = a[sortField],
      vb = b[sortField];
    if (va == null) va = '';
    if (vb == null) vb = '';
    if (typeof va === 'string') return va.localeCompare(vb) * sortDir;
    return (va > vb ? 1 : va < vb ? -1 : 0) * sortDir;
  });

  const categoryColors = {
    about: '#6366f1',
    art: '#ec4899',
    culture: '#f59e0b',
    economy: '#10b981',
    food: '#f97316',
    geography: '#06b6d4',
    history: '#8b5cf6',
    lifestyle: '#84cc16',
    music: '#a855f7',
    nature: '#14b8a6',
    people: '#3b82f6',
    society: '#ef4444',
    technology: '#0ea5e9',
  };

  tbody.innerHTML = sorted
    .map((a) => {
      const catLabel = categoryLabels[a.category] || a.category;
      const catColor = categoryColors[a.category] || '#64748b';
      const date = a.date || '—';
      const modified = a.lastModified || '—';
      const qs = a.qualityScore || 0;
      const qLabel =
        qs === 0 ? '✅' : qs <= 3 ? '✅' : qs <= 7 ? `⚠️ ${qs}` : `🔴 ${qs}`;
      const fi = a.formatIssues || 0;
      const fLabel = fi === 0 ? '✅' : fi === 1 ? '⚠️' : '❌';
      const reviewed = a.lastHumanReview ? '✅' : '—';
      const subcategory = a.subcategory || '—';
      const langs = ['en', 'es', 'ja', 'ko']
        .map(
          (l) =>
            `<span class="lang-dot ${a.translations[l] ? 'has' : 'missing'}" title="${l.toUpperCase()}">${l.toUpperCase()}</span>`,
        )
        .join('');
      const articleUrl = `${langPrefix}/${a.category}/${a.slug}`;
      const catDir = a.category.charAt(0).toUpperCase() + a.category.slice(1);
      const editUrl = `https://github.com/frank890417/taiwan-md/edit/main/knowledge/${catDir}/${a.slug}.md`;
      return `<tr class="registry-row" data-url="${articleUrl}" title="${(typeof a.description === 'string' ? a.description : '').replace(/"/g, '&quot;')}">
          <td class="col-title"><a href="${articleUrl}">${a.title}</a>${a.featured ? ' ⭐' : ''}</td>
          <td><span class="cat-tag" style="background:${catColor}15;color:${catColor};border:1px solid ${catColor}30">${catLabel}</span></td>
          <td>${subcategory}</td>
          <td>${date}</td>
          <td>${modified}</td>
          <td class="col-center">${qLabel}</td>
          <td class="col-center">${fLabel}</td>
          <td class="col-center">${reviewed}</td>
          <td class="col-right">${(a.wordCount || 0).toLocaleString()}</td>
          <td class="col-center col-hideable">${a.tagCount || 0}</td>
          <td class="col-langs">${langs}</td>
          <td class="col-center col-hideable">${a.revision || 0}</td>
          <td class="col-edit"><a href="${editUrl}" class="edit-link" target="_blank" rel="noopener" title="${isEn ? 'Edit on GitHub' : '在 GitHub 編輯'}">✏️</a></td>
        </tr>`;
    })
    .join('');

  document.getElementById('registry-summary').textContent =
    `${isEn ? 'Showing' : '顯示'} ${sorted.length} / ${allArticles.length} ${isEn ? 'articles' : '篇文章'}`;
}

function bindRegistryEvents() {
  // Column toggle
  const colToggleBtn = document.getElementById('column-toggle-btn');
  colToggleBtn.addEventListener('click', function () {
    const table = document.getElementById('registry-table');
    const expanded = table.classList.toggle('show-all-columns');
    this.textContent = expanded
      ? isEn
        ? '⚙️ Hide extra columns'
        : '⚙️ 隱藏額外欄位'
      : isEn
        ? '⚙️ Show all columns'
        : '⚙️ 顯示所有欄位';
  });

  // Sort
  document.querySelectorAll('.sortable').forEach((th) => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      if (sortField === field) sortDir *= -1;
      else {
        sortField = field;
        sortDir = -1;
      }
      document
        .querySelectorAll('.sortable')
        .forEach((h) => h.classList.remove('sort-asc', 'sort-desc'));
      th.classList.add(sortDir === 1 ? 'sort-asc' : 'sort-desc');
      applyFilters();
    });
  });

  // Filters
  [
    'registry-search',
    'filter-category',
    'filter-reviewed',
    'filter-featured',
    'filter-translation',
  ].forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener(
      id === 'registry-search' ? 'input' : 'change',
      debounce(applyFilters, 150),
    );
  });
}

function applyFilters() {
  const search = document.getElementById('registry-search').value.toLowerCase();
  const cat = document.getElementById('filter-category').value;
  const rev = document.getElementById('filter-reviewed').value;
  const feat = document.getElementById('filter-featured').value;
  const trans = document.getElementById('filter-translation').value;

  const filtered = allArticles.filter((a) => {
    if (
      search &&
      !a.title.toLowerCase().includes(search) &&
      !(typeof a.description === 'string' ? a.description : '')
        .toLowerCase()
        .includes(search) &&
      !(a.tags || []).some((t) => t.toLowerCase().includes(search))
    )
      return false;
    if (cat && a.category !== cat) return false;
    if (rev === 'true' && !a.lastHumanReview) return false;
    if (rev === 'false' && a.lastHumanReview) return false;
    if (feat === 'true' && !a.featured) return false;
    if (feat === 'false' && a.featured) return false;
    if (trans === 'has-en' && !a.translations.en) return false;
    if (trans === 'missing-en' && a.translations.en) return false;
    return true;
  });
  renderTable(filtered);
}

// ── Organism Anatomy ──
const organColorMap = {
  '❤️': '#ef4444',
  '🫀': '#ef4444',
  心臟: '#ef4444',
  Heart: '#ef4444',
  '🧠': '#8b5cf6',
  大腦: '#8b5cf6',
  Brain: '#8b5cf6',
  '🫁': '#3b82f6',
  肺: '#3b82f6',
  Lungs: '#3b82f6',
  '🦴': '#f59e0b',
  骨骼: '#f59e0b',
  Skeleton: '#f59e0b',
  '🩸': '#f87171',
  血液: '#f87171',
  Blood: '#f87171',
  '👁️': '#06b6d4',
  眼睛: '#06b6d4',
  Eyes: '#06b6d4',
  '🦷': '#e2e8f0',
  牙齒: '#e2e8f0',
  Teeth: '#e2e8f0',
  '💪': '#ec4899',
  肌肉: '#ec4899',
  Muscles: '#ec4899',
  '🧬': '#a855f7',
  DNA: '#a855f7',
  '🛡️': '#4ade80',
  免疫: '#4ade80',
  Immunity: '#4ade80',
};
function getOrganColor(o) {
  return (
    organColorMap[o.emoji] ||
    organColorMap[o.name] ||
    organColorMap[o.nameZh] ||
    null
  );
}

function renderOrganism(data) {
  const organFileMap = {
    heart: {
      file: 'knowledge/',
      label: 'knowledge/',
      desc: isEn ? 'Content directory' : '內容目錄',
    },
    immune: {
      file: 'docs/editorial/EDITORIAL.md',
      label: 'EDITORIAL.md',
      desc: isEn ? 'Quality guidelines' : '品質規範',
    },
    dna: {
      file: 'docs/editorial/EDITORIAL.md',
      label: 'EDITORIAL.md',
      desc: isEn ? 'Editorial DNA' : '編輯基因',
    },
    skeleton: {
      file: 'astro.config.mjs',
      label: 'astro.config.mjs',
      desc: isEn ? 'Framework config' : '框架配置',
    },
    breath: {
      file: '.github/workflows/',
      label: '.github/workflows/',
      desc: isEn ? 'CI/CD pipelines' : 'CI/CD 管線',
    },
    reproduce: {
      file: 'CONTRIBUTING.md',
      label: 'CONTRIBUTING.md',
      desc: isEn ? 'Contributor guide' : '貢獻指南',
    },
    senses: {
      file: '.github/ISSUE_TEMPLATE/',
      label: '.github/ISSUE_TEMPLATE/',
      desc: isEn ? 'Issue templates' : 'Issue 模板',
    },
    translation: {
      file: 'src/content/',
      label: 'src/content/',
      desc: isEn ? 'Translation files' : '翻譯檔案',
    },
  };

  const grid = document.getElementById('organ-grid');
  grid.innerHTML = data.organs
    .map((o) => {
      const defaultColor =
        o.score >= 70 ? '#4ade80' : o.score >= 40 ? '#facc15' : '#f87171';
      const barColor = getOrganColor(o) || defaultColor;
      const trendIcon = o.trend === 'up' ? '↑' : o.trend === 'down' ? '↓' : '→';
      const trendClass = o.trend;
      const isHeart =
        o.emoji === '❤️' || o.emoji === '🫀' || o.name === 'Heart';
      const heartClass = isHeart ? ' organ-card-heart' : '';
      const scoreTint =
        o.score < 30
          ? 'background:rgba(248,113,113,0.04);'
          : o.score >= 70
            ? 'background:rgba(74,222,128,0.04);'
            : '';
      const topBorder = 'border-top:3px solid ' + barColor + ';';
      const organKey = (o.id || o.name || '').toLowerCase();
      const fileInfo = organFileMap[organKey] || null;
      const fileFooter = fileInfo
        ? `<div class="organ-file"><a href="https://github.com/frank890417/taiwan-md/tree/main/${fileInfo.file}" target="_blank" rel="noopener" class="organ-file-link">📁 ${fileInfo.label}</a></div>`
        : '';
      // Concern hint based on organ type
      let concern = '';
      if (organKey === 'immune' || organKey === '免疫系統') {
        const naked = allArticles.filter((a) => (a.fnCount || 0) === 0).length;
        concern = isEn
          ? `${naked} articles without footnotes`
          : `${naked} 篇無腳註`;
      } else if (organKey === 'language' || organKey === '語言器官') {
        const esPct = Math.round(
          (allArticles.filter((a) => a.translations?.es).length /
            allArticles.length) *
            100,
        );
        concern = isEn
          ? `ES ${esPct}%, JA needs growth`
          : `ES ${esPct}%，JA 待成長`;
      }
      const concernHtml = concern
        ? `<div class="organ-concern">${concern}</div>`
        : '';

      return `<div class="organ-card${heartClass}" style="${topBorder}${scoreTint}">
          <div class="organ-header">
            <span class="organ-emoji">${o.emoji}</span>
            <span class="organ-name">${isEn ? o.name : o.nameZh}</span>
          </div>
          <div class="organ-metaphor">${o.metaphor}</div>
          <div class="organ-score-row">
            <div class="organ-score" data-score="${o.score}" style="color:${barColor}">${o.score}</div>
            <span class="organ-trend ${trendClass}">${trendIcon}</span>
          </div>
          <div class="organ-bar"><div class="organ-bar-fill" style="width:${o.score}%;background:${barColor}"></div></div>
          ${concernHtml}
          ${fileFooter}
        </div>`;
    })
    .join('');

  // Animate organ scores
  document.querySelectorAll('.organ-score[data-score]').forEach((el, i) => {
    const target = parseInt(el.dataset.score, 10);
    el.textContent = '0';
    setTimeout(() => animateValue(el, 0, target, 700), i * 100);
  });
}

// ── Translation Coverage ──
// 2026-05-01 γ-late2 v2：3-state donut（fresh / stale / missing）+ (-N) deficit
// 真實 truth source = knowledge/_translation-status.json（status.py 算的）
// 舊 dashboard 把 fresh+stale 都算「已翻譯」遮蔽真實健康度；新版 surface
// 三狀態 + deficit，配合 PR #748 文件記錄的 sovereignty preservation 視角。
function renderTranslations(data, vitals) {
  const bars = document.getElementById('translation-bars');
  const langNames = {
    'zh-TW': '中文',
    en: 'English',
    es: 'Español',
    ja: '日本語',
    ko: '한국어',
    fr: 'Français',
  };
  const langLabels = {
    'zh-TW': 'SSOT',
    en: '',
    es: '',
    ja: '',
    ko: '',
    fr: '',
  };
  const maxTotal = vitals.totalArticles;

  // 3-state palette（與 v1 langColors 不同 — 之前是「每語言一色」，
  // 新版改「每狀態一色」讓 fresh/stale/missing 跨語言可比）
  const STATE_COLORS = {
    fresh: '#22c55e', // green-500 — healthy
    stale: '#f59e0b', // amber-500 — warning
    missing: '#e2e8f0', // slate-200 — gap (light grey ring background)
    ssot: '#3b82f6', // blue — zh canonical
  };

  bars.innerHTML =
    '<div class="donut-row">' +
    data.languages
      .map((l) => {
        const s = data.summary[l];
        const isSsot = l === 'zh-TW';
        // freshPct = 真實健康度（只算 fresh，不含 stale）— 中央大字
        // 舊 percentage = (fresh+stale)/total，仍保留作為 sub-label
        const freshPct = s.freshPct != null ? s.freshPct : s.percentage;
        const stalePct =
          s.stale != null && maxTotal > 0
            ? parseFloat(((s.stale / maxTotal) * 100).toFixed(1))
            : 0;
        const missPct =
          s.missing != null && maxTotal > 0
            ? parseFloat(((s.missing / maxTotal) * 100).toFixed(1))
            : 0;
        const fresh = s.fresh != null ? s.fresh : s.total;
        const stale = s.stale != null ? s.stale : 0;
        const miss = s.missing != null ? s.missing : 0;
        const deficit = s.deficit != null ? s.deficit : 0;

        const label =
          langLabels[l] ||
          (isSsot
            ? 'SSOT'
            : freshPct >= 90
              ? isEn
                ? 'Full Fresh'
                : '完整最新'
              : freshPct >= 50
                ? isEn
                  ? 'Mostly Fresh'
                  : '多數最新'
                : freshPct >= 20
                  ? isEn
                    ? 'Partial'
                    : '部分覆蓋'
                  : freshPct > 0
                    ? isEn
                      ? 'Sparse'
                      : '稀疏'
                    : isEn
                      ? 'Empty'
                      : '空缺');

        // 3-segment donut: render 3 stacked SVG arcs
        // r=15.9, circumference ≈ 99.9
        // We render 3 partially-filled circles, each with strokeDasharray
        // controlling its segment length and dashoffset positioning it in sequence.
        // Segment order (clockwise from top): fresh → stale → missing-fill (light grey)
        const C = 99.9;
        const freshLen = isSsot
          ? C
          : Math.min(C, (Math.max(0, fresh) / Math.max(1, maxTotal)) * C);
        const staleLen = isSsot
          ? 0
          : Math.min(
              C - freshLen,
              (Math.max(0, stale) / Math.max(1, maxTotal)) * C,
            );
        // missing fills the rest (background ring already shows it; we draw
        // an explicit slate segment for clarity in tooltips/hover)

        // SVG dasharray pattern: "<gap> <visible> <gap>"
        // simpler: use multiple <circle> with computed dasharray + offset
        // Offset starts at 25 (12 o'clock origin in viewBox 36x36 with stroke-dashoffset=25)
        const f2 = (n) => n.toFixed(2);
        const offsetFresh = 25;
        const offsetStale = 25 - freshLen; // can be negative; SVG handles wrap
        const tooltipText = isSsot
          ? `${vitals.totalArticles} ${isEn ? 'canonical articles' : '篇 zh canonical'}`
          : `${fresh} ${isEn ? 'fresh' : '最新'} · ${stale} ${isEn ? 'stale' : '舊版'} · ${miss} ${isEn ? 'missing' : '未譯'}`;

        // central display: SSOT shows "100%"; others show fresh%
        const centerText = isSsot
          ? '100%'
          : freshPct >= 100
            ? '100%'
            : freshPct >= 10
              ? freshPct.toFixed(1) + '%'
              : freshPct.toFixed(1) + '%';

        // Below count: F+S/total + (-deficit)
        const countLine = isSsot
          ? `${vitals.totalArticles} / ${vitals.totalArticles}`
          : `${fresh + stale} / ${maxTotal}` +
            (deficit > 0
              ? ` <span class="donut-deficit">(-${deficit})</span>`
              : '');

        // 3-line breakdown strip below count
        const breakdown = isSsot
          ? ''
          : `<div class="donut-breakdown" title="${tooltipText}">
                 <span class="bd-fresh">●${fresh}</span>
                 <span class="bd-stale">●${stale}</span>
                 <span class="bd-missing">●${miss}</span>
               </div>`;

        return `<div class="donut-item" title="${tooltipText}">
          <svg viewBox="0 0 36 36" class="donut-chart">
            <!-- background: full ring grey (= missing visualisation) -->
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="${STATE_COLORS.missing}" stroke-width="3"/>
            ${
              isSsot
                ? `<circle cx="18" cy="18" r="15.9" fill="none" stroke="${STATE_COLORS.ssot}" stroke-width="3"
                stroke-dasharray="${f2(C)} 0" stroke-dashoffset="${offsetFresh}"
                stroke-linecap="butt" class="donut-fill" data-state="ssot"/>`
                : `
            <!-- stale segment: amber, drawn behind so fresh draws over it -->
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="${STATE_COLORS.stale}" stroke-width="3"
              stroke-dasharray="0 ${f2(C)}" data-target-len="${f2(staleLen)}"
              stroke-dashoffset="${f2(offsetStale)}" stroke-linecap="butt"
              class="donut-fill donut-fill-stale"/>
            <!-- fresh segment: green, drawn last so it's on top -->
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="${STATE_COLORS.fresh}" stroke-width="3"
              stroke-dasharray="0 ${f2(C)}" data-target-len="${f2(freshLen)}"
              stroke-dashoffset="${offsetFresh}" stroke-linecap="butt"
              class="donut-fill donut-fill-fresh"/>`
            }
            <text x="18" y="20.5" text-anchor="middle" font-size="7.5" font-weight="700" fill="#1e293b">${centerText}</text>
          </svg>
          <div class="donut-label">${langNames[l] || l} <span class="trans-badge">${label}</span></div>
          <div class="donut-count">${countLine}</div>
          ${breakdown}
        </div>`;
      })
      .join('') +
    '</div>';

  // Animate 3-segment donut fills
  requestAnimationFrame(() => {
    bars.querySelectorAll('.donut-fill').forEach((el) => {
      const targetLen = el.getAttribute('data-target-len');
      const targetTotal = el.getAttribute('data-target'); // backward compat
      const C = 99.9;
      if (targetLen != null) {
        // 3-segment mode: animate just this segment to its target length
        requestAnimationFrame(() => {
          const len = parseFloat(targetLen);
          el.style.strokeDasharray = `${len.toFixed(2)} ${(C - len).toFixed(2)}`;
        });
      } else if (targetTotal != null) {
        // legacy single-color mode
        requestAnimationFrame(() => {
          const t = parseFloat(targetTotal);
          if (t >= 99) {
            el.style.strokeDasharray = '99.9 0';
          } else {
            const len = (t / 100) * 99.9;
            el.style.strokeDasharray = len.toFixed(2) + ' 99.9';
          }
        });
      }
    });
  });

  // ─ Matrix ─ per-cell now shows fresh / total + tiny stale stripe + (-N) deficit
  const cats = Object.keys(data.matrix)
    .filter((c) => c !== 'about')
    .sort();
  const thead = document.getElementById('translation-matrix-head');
  thead.innerHTML = `<tr><th>${isEn ? 'Category' : '分類'}</th>${data.languages
    .map((l) => {
      const s = data.summary[l] || {};
      const def =
        l !== 'zh-TW' && s.deficit > 0
          ? ` <span class="th-deficit">(-${s.deficit})</span>`
          : '';
      return `<th>${l}${def}</th>`;
    })
    .join('')}</tr>`;
  const tbody = document.getElementById('translation-matrix-body');
  tbody.innerHTML = cats
    .map((cat) => {
      const row = data.matrix[cat];
      const zhCount = typeof row['zh-TW'] === 'number' ? row['zh-TW'] : 0;
      return `<tr>
          <td><strong>${categoryLabels[cat] || cat}</strong></td>
          ${data.languages
            .map((l) => {
              if (l === 'zh-TW') {
                return `<td class="matrix-cell cell-ssot">${zhCount}</td>`;
              }
              const cell = row[l];
              if (!cell) {
                return `<td class="matrix-cell cell-none">0</td>`;
              }
              // cell shape: { count, fresh, stale, missing, deficit }
              const fresh = cell.fresh || 0;
              const stale = cell.stale || 0;
              const miss = cell.missing || 0;
              const deficit = cell.deficit || 0;
              const freshPct =
                zhCount > 0 ? Math.round((fresh / zhCount) * 100) : 0;
              // colour by FRESH ratio (real health), not by total
              const cls =
                freshPct >= 90
                  ? 'cell-full'
                  : freshPct >= 50
                    ? 'cell-partial'
                    : freshPct > 0
                      ? 'cell-low'
                      : 'cell-none';
              const tip = `${fresh} ${isEn ? 'fresh' : '最新'} · ${stale} ${isEn ? 'stale' : '舊'} · ${miss} ${isEn ? 'missing' : '缺'}`;
              const deficitMark =
                deficit > 0
                  ? ` <span class="cell-deficit">-${deficit}</span>`
                  : '';
              return `<td class="matrix-cell ${cls}" title="${tip}">${fresh}<span class="cell-stale-mark">/${stale}</span>${deficitMark}</td>`;
            })
            .join('')}
        </tr>`;
    })
    .join('');
}

// ── i18n UI Coverage（2026-04-25 β7 Phase 3 #9）──
// 不同於上方 renderTranslations（文章層）— 這裡顯示 src/i18n/ 12 module
// 各語言 UI 字串 keys 的覆蓋率
function renderI18nCoverage(data) {
  const bars = document.getElementById('i18n-bars');
  const langNames = {
    'zh-TW': '中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어',
    fr: 'Français',
    es: 'Español',
  };
  const langColors = {
    'zh-TW': '#3b82f6',
    en: '#4ade80',
    ja: '#ec4899',
    ko: '#a855f7',
    fr: '#f97316',
    es: '#facc15',
  };
  const langs = Object.keys(data.lang_totals);
  const maxTotal = data.max_total;

  bars.innerHTML =
    '<div class="donut-row">' +
    langs
      .map((l) => {
        const t = data.lang_totals[l];
        const pct = Math.min(t.coverage_pct, 100);
        const color = langColors[l] || '#3b82f6';
        const label =
          l === 'zh-TW'
            ? 'SSOT'
            : pct >= 99
              ? isEn
                ? 'Full'
                : '完整'
              : pct >= 50
                ? isEn
                  ? 'Partial'
                  : '部分'
                : pct > 0
                  ? isEn
                    ? 'Seedling'
                    : '萌芽'
                  : isEn
                    ? 'Fallback'
                    : '依賴 Fallback';
        return `<div class="donut-item">
          <svg viewBox="0 0 36 36" class="donut-chart">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="3"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="${color}" stroke-width="3"
              stroke-dasharray="0, 100" data-target="${pct}" stroke-dashoffset="25"
              stroke-linecap="round" class="donut-fill"/>
            <text x="18" y="20.5" text-anchor="middle" font-size="8" font-weight="700" fill="#1e293b">${Math.round(pct)}%</text>
          </svg>
          <div class="donut-label">${langNames[l] || l} <span class="trans-badge">${label}</span></div>
          <div class="donut-count">${t.keys} / ${maxTotal}</div>
        </div>`;
      })
      .join('') +
    '</div>';

  // Animate donut fills
  requestAnimationFrame(() => {
    bars.querySelectorAll('.donut-fill').forEach((el) => {
      const target = el.getAttribute('data-target');
      requestAnimationFrame(() => {
        // Fix v2: explicit circumference + drop threshold to ≥99 (round-cap visual overlap starts before 100%)
        // Circle r=15.9 → circumference = 2π × 15.9 ≈ 99.9
        const t = parseFloat(target);
        if (t >= 99) {
          el.style.strokeDasharray = '99.9 0';
        } else {
          const len = (t / 100) * 99.9;
          el.style.strokeDasharray = len.toFixed(2) + ' 99.9';
        }
      });
    });
  });

  // Matrix: module × lang
  const thead = document.getElementById('i18n-matrix-head');
  thead.innerHTML = `<tr><th>${isEn ? 'Module' : 'Module'}</th>${langs.map((l) => `<th>${l}</th>`).join('')}</tr>`;
  const tbody = document.getElementById('i18n-matrix-body');
  tbody.innerHTML = data.modules
    .map((m) => {
      const zhCount = m.langs['zh-TW'] || 0;
      const cells = langs
        .map((l) => {
          const c = m.langs[l] || 0;
          let cell;
          if (c === 0 && zhCount > 0) {
            cell = `<td style="color:#dc2626;">🔴 0</td>`;
          } else if (c < zhCount) {
            cell = `<td style="color:#ca8a04;">🟡 ${c}/${zhCount}</td>`;
          } else if (c > 0) {
            cell = `<td style="color:#16a34a;">✅ ${c}</td>`;
          } else {
            cell = `<td style="color:#94a3b8;">—</td>`;
          }
          return cell;
        })
        .join('');
      return `<tr><td><strong>${m.name}</strong></td>${cells}</tr>`;
    })
    .join('');
}

// ── Immune System ──
function renderImmune(articles, vitals) {
  const overview = document.getElementById('immune-overview');
  const reviewedCount = articles.filter((a) => a.lastHumanReview).length;
  const featuredCount = articles.filter((a) => a.featured).length;
  const verifiedCount = articles.filter((a) => a.lastVerified).length;
  const total = articles.length;

  const immuneMetrics = [
    {
      label: isEn ? 'Human Reviewed' : '人工審閱',
      count: reviewedCount,
      total,
      color: '#4ade80',
    },
    {
      label: isEn ? 'Featured' : '精選文章',
      count: featuredCount,
      total,
      color: '#f59e0b',
    },
    {
      label: isEn ? 'Verified' : '已驗證',
      count: verifiedCount,
      total,
      color: '#3b82f6',
    },
  ];

  overview.innerHTML =
    '<div class="donut-row">' +
    immuneMetrics
      .map((m) => {
        const pct = Math.round((m.count / m.total) * 100);
        return `<div class="donut-item">
          <svg viewBox="0 0 36 36" class="donut-chart">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="3"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="${m.color}" stroke-width="3"
              stroke-dasharray="0, 100" data-target="${pct}" stroke-dashoffset="25"
              stroke-linecap="round" class="donut-fill"/>
            <text x="18" y="20.5" text-anchor="middle" font-size="8" font-weight="700" fill="#1e293b">${pct}%</text>
          </svg>
          <div class="donut-label">${m.label}</div>
          <div class="donut-count">${m.count} / ${m.total}</div>
        </div>`;
      })
      .join('') +
    '</div>';

  // Animate donut fills
  requestAnimationFrame(() => {
    overview.querySelectorAll('.donut-fill').forEach((el) => {
      const target = el.getAttribute('data-target');
      requestAnimationFrame(() => {
        // Fix v2: explicit circumference + drop threshold to ≥99 (round-cap visual overlap starts before 100%)
        // Circle r=15.9 → circumference = 2π × 15.9 ≈ 99.9
        const t = parseFloat(target);
        if (t >= 99) {
          el.style.strokeDasharray = '99.9 0';
        } else {
          const len = (t / 100) * 99.9;
          el.style.strokeDasharray = len.toFixed(2) + ' 99.9';
        }
      });
    });
  });

  // Citation health
  const citEl = document.getElementById('citation-health');
  if (citEl) {
    const withFn = articles.filter((a) => (a.fnCount || 0) > 0).length;
    const withOverview = articles.filter((a) => a.hasOverview).length;
    const withReading = articles.filter((a) => a.hasReading).length;
    const fnPct = Math.round((withFn / total) * 100);
    const ovPct = Math.round((withOverview / total) * 100);
    const rdPct = Math.round((withReading / total) * 100);
    citEl.innerHTML = `<div class="citation-stats">
        <div class="cit-stat">
          <span class="cit-num ${fnPct < 10 ? 'cit-danger' : ''}">${fnPct}%</span>
          <span class="cit-label">${isEn ? 'Has Footnotes' : '有腳註'}</span>
          <span class="cit-detail">${withFn} / ${total}</span>
        </div>
        <div class="cit-stat">
          <span class="cit-num ${ovPct < 50 ? 'cit-warn' : ''}">${ovPct}%</span>
          <span class="cit-label">${isEn ? '30s Overview' : '30 秒概覽'}</span>
          <span class="cit-detail">${withOverview} / ${total}</span>
        </div>
        <div class="cit-stat">
          <span class="cit-num ${rdPct < 10 ? 'cit-danger' : ''}">${rdPct}%</span>
          <span class="cit-label">${isEn ? 'Extended Reading' : '延伸閱讀'}</span>
          <span class="cit-detail">${withReading} / ${total}</span>
        </div>
      </div>`;
  }

  // Queue: unreviewed articles, oldest first
  const unreviewed = articles.filter((a) => !a.lastHumanReview);
  const queue = [...unreviewed]
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    .slice(0, 15);

  const queueHeader = document.querySelector('.queue-desc');
  if (queueHeader) {
    queueHeader.textContent += ` (${unreviewed.length} ${isEn ? 'total' : '篇待審'})`;
  }

  const QUEUE_COLLAPSE_LIMIT = 5;
  const queueEl = document.getElementById('immune-queue');
  const queueItems = queue.map(
    (a) => `<a href="${langPrefix}/${a.category}/${a.slug}" class="queue-item">
        <span class="queue-cat cat-${a.category}">${categoryLabels[a.category] || a.category}</span>
        <span class="queue-title">${a.title}</span>
        <span class="queue-date">${a.date || '—'}</span>
      </a>`,
  );

  if (queue.length > QUEUE_COLLAPSE_LIMIT) {
    const visibleItems = queueItems.slice(0, QUEUE_COLLAPSE_LIMIT).join('');
    const hiddenItems = queueItems.slice(QUEUE_COLLAPSE_LIMIT).join('');
    queueEl.innerHTML =
      visibleItems +
      `<div class="queue-hidden" id="queue-hidden" style="display:none">${hiddenItems}</div>` +
      `<button class="queue-toggle-btn" id="queue-toggle-btn">${isEn ? 'Show all (' + queue.length + ' total)' : '顯示全部 (' + queue.length + ' 篇)'}</button>`;

    document
      .getElementById('queue-toggle-btn')
      .addEventListener('click', function () {
        const hidden = document.getElementById('queue-hidden');
        const expanded = hidden.style.display !== 'none';
        hidden.style.display = expanded ? 'none' : 'grid';
        this.textContent = expanded
          ? isEn
            ? 'Show all (' + queue.length + ' total)'
            : '顯示全部 (' + queue.length + ' 篇)'
          : isEn
            ? 'Collapse'
            : '收合';
        this.classList.toggle('expanded', !expanded);
      });
  } else {
    queueEl.innerHTML = queueItems.join('');
  }
}

// ── Reproduction System — Spores (2026-04-18 δ-late) ──
function renderSpores(s) {
  if (!s) return;

  // Helper
  const fmt = (n) => {
    if (n == null || isNaN(n)) return '—';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return Math.round(n / 1000) + 'K';
    return String(n);
  };

  // 2.1 Overview tiles
  const overview = document.getElementById('spores-overview');
  if (overview) {
    const totalReach = (s.topPerformers || []).reduce(
      (sum, p) => sum + (p.views || 0),
      0,
    );
    const top = (s.topPerformers || [])[0] || null;
    const warningCount = (s.backfillWarnings || []).filter(
      (w) => w.status === 'OVERDUE',
    ).length;
    overview.innerHTML = [
      '<div class="spore-tile">',
      '<div class="spore-tile-value">' + (s.totals.count || 0) + '</div>',
      '<div class="spore-tile-label">' +
        (isEn ? 'Total Spores' : '發過孢子數') +
        '</div>',
      '</div>',
      '<div class="spore-tile">',
      '<div class="spore-tile-value">' + fmt(totalReach) + '</div>',
      '<div class="spore-tile-label">' +
        (isEn ? 'Top-5 Total Reach' : 'Top5 總觸及') +
        '</div>',
      '</div>',
      '<div class="spore-tile">',
      '<div class="spore-tile-value">' +
        (top ? (top.badge || '⭐') + ' ' + fmt(top.views) : '—') +
        '</div>',
      '<div class="spore-tile-label">' +
        (isEn ? 'Strongest Spore' : '最強孢子') +
        (top
          ? ' (#' + top.n + ' ' + (top.article || '').slice(0, 10) + ')'
          : '') +
        '</div>',
      '</div>',
      '<div class="spore-tile' +
        (warningCount > 0 ? ' spore-tile-warn' : '') +
        '">',
      '<div class="spore-tile-value">' + warningCount + '</div>',
      '<div class="spore-tile-label">' +
        (isEn ? 'Backfill Overdue' : '回填 OVERDUE') +
        '</div>',
      '</div>',
    ].join('');
  }

  // 2.2 Top Performers table
  const top = document.getElementById('spores-top');
  if (top) {
    const rows = (s.topPerformers || [])
      .slice(0, 8)
      .map((p) => {
        const articleClean = (p.article || '').replace(/^[🌋🔥⭐\s]+/, '');
        const url = p.url || '';
        // Whole row opens the spore post in a new tab; the title is also a real
        // anchor so keyboard / middle-click work (the row handler ignores clicks
        // that land on the anchor to avoid opening twice).
        const articleCell = url
          ? '<a href="' +
            url +
            '" target="_blank" rel="noopener noreferrer">' +
            articleClean +
            '</a>'
          : articleClean;
        return (
          '<tr' +
          (url
            ? ' class="spore-row-link" data-url="' +
              url +
              '" style="cursor:pointer"'
            : '') +
          '>' +
          '<td class="spore-badge">' +
          (p.badge || '') +
          ' #' +
          p.n +
          '</td>' +
          '<td>' +
          articleCell +
          '</td>' +
          '<td><span class="platform-' +
          (p.platform || 'other') +
          '">' +
          (p.platform || '—').toUpperCase() +
          '</span></td>' +
          '<td class="num">' +
          fmt(p.views) +
          '</td>' +
          '<td class="num">' +
          (p.rate != null ? p.rate.toFixed(2) + '%' : '—') +
          '</td>' +
          '<td class="num">' +
          fmt(p.engagements) +
          '</td>' +
          '</tr>'
        );
      })
      .join('');
    top.innerHTML =
      '<table class="spore-table"><thead><tr>' +
      '<th>#</th>' +
      '<th>' +
      (isEn ? 'Article' : '文章') +
      '</th>' +
      '<th>' +
      (isEn ? 'Platform' : '平台') +
      '</th>' +
      '<th class="num">Views</th>' +
      '<th class="num">Rate</th>' +
      '<th class="num">' +
      (isEn ? 'Engagements' : '互動') +
      '</th>' +
      '</tr></thead><tbody>' +
      (rows || '<tr><td colspan="6">—</td></tr>') +
      '</tbody></table>';
    top.querySelectorAll('tr.spore-row-link').forEach((tr) => {
      tr.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; // anchor handles its own click
        const u = tr.getAttribute('data-url');
        if (u) window.open(u, '_blank', 'noopener');
      });
    });
  }

  // 2.3 Amplification horizontal bars
  const amp = document.getElementById('spores-amplification');
  if (amp) {
    const items = (s.amplification || [])
      .filter((a) => a.multiplier || a.ga_7d_after)
      .slice(0, 8);
    if (items.length === 0) {
      amp.innerHTML =
        '<p class="muted">' +
        (isEn ? 'No amplification data yet.' : '尚未累積放大倍數資料。') +
        '</p>';
    } else {
      // 決定 bar 長度的 metric：優先用 multiplier（有 ga_before 基線的），
      // fallback 用 ga_7d_after（絕對 GA 7d views）—— 這確保長度反映真實量級差異
      const hasAnyMul = items.some((i) => i.multiplier);
      const maxMetric = hasAnyMul
        ? Math.max(...items.map((i) => i.multiplier || 0), 1)
        : Math.max(...items.map((i) => i.ga_7d_after || 0), 1);
      amp.innerHTML =
        '<div class="spore-amp-list">' +
        items
          .map((i) => {
            const metric = hasAnyMul ? i.multiplier || 0 : i.ga_7d_after || 0;
            // log scale for ga_7d_after（因為差 100x 常見，linear 會讓小的看不見）
            const pct = hasAnyMul
              ? Math.min((metric / maxMetric) * 100, 100)
              : Math.min(
                  (Math.log(Math.max(metric, 1)) /
                    Math.log(Math.max(maxMetric, 2))) *
                    100,
                  100,
                );
            const label = i.multiplier
              ? i.multiplier +
                'x (' +
                (i.ga_before || '?') +
                ' → ' +
                (i.ga_7d_after || '?') +
                ')'
              : fmt(i.ga_7d_after) + ' views/7d';
            return (
              '<div class="spore-amp-row">' +
              '<div class="spore-amp-name">' +
              (i.article || '').slice(0, 20) +
              '</div>' +
              '<div class="spore-amp-bar"><div class="spore-amp-fill" style="width:' +
              pct +
              '%"></div></div>' +
              '<div class="spore-amp-value">' +
              label +
              '</div>' +
              '</div>'
            );
          })
          .join('') +
        '</div>';
    }
  }

  // 2.4 Platform comparison donut/table
  const plat = document.getElementById('spores-platforms');
  if (plat) {
    const p = s.platformComparison || {};
    const platformKeys = Object.keys(p);
    if (platformKeys.length === 0) {
      plat.innerHTML = '<p class="muted">—</p>';
    } else {
      plat.innerHTML =
        '<table class="spore-table"><thead><tr>' +
        '<th>' +
        (isEn ? 'Platform' : '平台') +
        '</th>' +
        '<th class="num">' +
        (isEn ? 'Count' : '發過') +
        '</th>' +
        '<th class="num">' +
        (isEn ? 'Avg Views' : '平均觸及') +
        '</th>' +
        '<th class="num">' +
        (isEn ? 'Max Views' : '最高') +
        '</th>' +
        '<th class="num">' +
        (isEn ? 'Avg Rate' : '平均互動率') +
        '</th>' +
        '<th class="num">' +
        (isEn ? 'Max Rate' : '最高互動率') +
        '</th>' +
        '</tr></thead><tbody>' +
        platformKeys
          .map(
            (k) =>
              '<tr>' +
              '<td><span class="platform-' +
              k +
              '">' +
              k.toUpperCase() +
              '</span></td>' +
              '<td class="num">' +
              p[k].count +
              '</td>' +
              '<td class="num">' +
              fmt(p[k].avgViews) +
              '</td>' +
              '<td class="num">' +
              fmt(p[k].maxViews) +
              '</td>' +
              '<td class="num">' +
              (p[k].avgRate != null ? p[k].avgRate.toFixed(2) + '%' : '—') +
              '</td>' +
              '<td class="num">' +
              (p[k].maxRate != null ? p[k].maxRate.toFixed(2) + '%' : '—') +
              '</td>' +
              '</tr>',
          )
          .join('') +
        '</tbody></table>';
    }
  }

  // 2.5 Backfill warnings + no-URL historical footer
  const bf = document.getElementById('spores-backfill');
  if (bf) {
    const warnings = (s.backfillWarnings || []).slice(0, 10);
    const noUrl = s.noUrlHistorical || [];
    const noUrlFooter =
      noUrl.length > 0
        ? '<p class="muted" style="margin-top:0.8rem;font-size:0.8rem">🔒 ' +
          (isEn
            ? noUrl.length +
              ' historical spore(s) lack URL (permanent harvest gap): '
            : noUrl.length + ' 筆歷史孢子缺 URL（永久 harvest 缺口）：') +
          noUrl
            .map((w) => '#' + w.n + ' ' + (w.article || '').slice(0, 10))
            .join(' / ') +
          '</p>'
        : '';
    if (warnings.length === 0) {
      bf.innerHTML =
        '<p class="muted">' +
        (isEn ? 'All caught up.' : '全部回填完畢。') +
        '</p>' +
        noUrlFooter;
    } else {
      bf.innerHTML =
        '<ul class="spore-backfill-list">' +
        warnings
          .map((w) => {
            const color =
              w.status === 'OVERDUE'
                ? '🔴'
                : w.publishedDays >= 3
                  ? '🟡'
                  : '🟢';
            return (
              '<li>' +
              color +
              ' <strong>#' +
              w.n +
              ' ' +
              (w.article || '').slice(0, 20) +
              '</strong>' +
              ' <span class="platform-' +
              (w.platform || 'other') +
              '">' +
              (w.platform || '').toUpperCase() +
              '</span>' +
              ' <span class="muted">' +
              w.publishedDays +
              (isEn ? 'd ago' : ' 天前') +
              '</span>' +
              ' — ' +
              w.status +
              '</li>'
            );
          })
          .join('') +
        '</ul>' +
        noUrlFooter;
    }
  }

  // 2.6 Weekly pulse sparkline
  const wk = document.getElementById('spores-weekly');
  if (wk) {
    const weeks = s.weeklyPulse || [];
    if (weeks.length === 0) {
      wk.innerHTML = '<p class="muted">—</p>';
    } else {
      const maxPub = Math.max(...weeks.map((w) => w.published), 1);
      wk.innerHTML =
        '<div class="spore-weekly">' +
        weeks
          .map((w) => {
            const h = Math.max((w.published / maxPub) * 100, 5);
            return (
              '<div class="spore-week">' +
              '<div class="spore-week-bar-wrap">' +
              '<div class="spore-week-bar" style="height:' +
              h +
              '%"></div>' +
              '</div>' +
              '<div class="spore-week-count">' +
              w.published +
              '</div>' +
              '<div class="spore-week-label">' +
              w.week.slice(-3) +
              '</div>' +
              '</div>'
            );
          })
          .join('') +
        '</div>';
    }
  }
}

// ── Contribution Leaderboard (2026-04-19 β) ──
function renderContributors(c) {
  if (!c) return;

  // Overview — 4 stat cards
  const overview = document.getElementById('contributors-overview');
  if (overview) {
    overview.innerHTML =
      '<div class="contributors-stats">' +
      [
        ['👥 ' + (isEn ? 'Total' : '總貢獻者'), c.totals.contributors],
        ['🔥 ' + (isEn ? 'Weekly active' : '週活躍'), c.weeklyActive],
        ['📅 ' + (isEn ? 'Monthly active' : '月活躍'), c.monthlyActive],
        [
          '🌱 ' + (isEn ? 'New (30d)' : '新人（30 天）'),
          c.recentlyJoined.length,
        ],
      ]
        .map(
          ([l, v]) =>
            '<div class="contributors-stat"><div class="contributors-stat-num">' +
            v +
            '</div><div class="contributors-stat-label">' +
            l +
            '</div></div>',
        )
        .join('') +
      '</div>';
  }

  // Leaderboard — top 20 card grid
  const board = document.getElementById('contributors-leaderboard');
  if (board) {
    const areaLabel = (a) => {
      const labels = isEn
        ? {
            content: '📝 Content',
            system: '⚙️ System',
            translation: '🌐 Translation',
            other: '• Other',
          }
        : {
            content: '📝 內容',
            system: '⚙️ 系統',
            translation: '🌐 翻譯',
            other: '• 其他',
          };
      return labels[a.primaryArea] || '—';
    };
    board.innerHTML =
      '<ol class="contributors-board">' +
      c.leaderboard
        .map((a, i) => {
          const rankBadge =
            i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i + 1);
          return (
            '<li class="contributors-row">' +
            '<span class="contributors-rank">' +
            rankBadge +
            '</span>' +
            '<a href="' +
            a.profileUrl +
            '" target="_blank" rel="noopener" class="contributors-person">' +
            '<img src="' +
            a.avatarUrl +
            '" alt="' +
            a.login +
            '" class="contributors-avatar" loading="lazy" />' +
            '<span class="contributors-login">' +
            a.login +
            '</span>' +
            '</a>' +
            '<span class="contributors-commits">' +
            a.commits.toLocaleString() +
            '<span class="contributors-unit"> ' +
            (isEn ? 'commits' : '次') +
            '</span></span>' +
            '<span class="contributors-area contributors-area-' +
            a.primaryArea +
            '">' +
            areaLabel(a) +
            '</span>' +
            '</li>'
          );
        })
        .join('') +
      '</ol>';
  }

  // Top by primary area (3 columns)
  const areas = document.getElementById('contributors-areas');
  if (areas) {
    const col = (title, emoji, list) =>
      '<div class="contributors-area-col">' +
      '<h4>' +
      emoji +
      ' ' +
      title +
      '</h4>' +
      (list.length > 0
        ? '<ol class="contributors-area-list">' +
          list
            .map(
              (a) =>
                '<li><a href="' +
                a.profileUrl +
                '" target="_blank" rel="noopener"><img src="' +
                a.avatarUrl +
                '" alt="" loading="lazy" /><span>' +
                a.login +
                '</span><span class="contributors-area-count">' +
                (a.breakdown
                  ? a.breakdown[
                      a.primaryArea === 'content'
                        ? 'content'
                        : a.primaryArea === 'system'
                          ? 'system'
                          : 'translation'
                    ]
                  : a.commits) +
                '</span></a></li>',
            )
            .join('') +
          '</ol>'
        : '<p class="contributors-empty">—</p>') +
      '</div>';
    areas.innerHTML =
      '<div class="contributors-areas-grid">' +
      col(isEn ? 'Content' : '內容', '📝', c.topContent) +
      col(isEn ? 'System' : '系統', '⚙️', c.topSystem) +
      col(isEn ? 'Translation' : '翻譯', '🌐', c.topTranslation) +
      '</div>';
  }

  // Recently joined
  const recent = document.getElementById('contributors-recent');
  if (recent) {
    if (c.recentlyJoined.length === 0) {
      recent.innerHTML =
        '<p class="contributors-empty">' +
        (isEn
          ? 'No new contributors in the last 30 days.'
          : '過去 30 天沒有新貢獻者。') +
        '</p>';
    } else {
      recent.innerHTML =
        '<div class="contributors-recent-grid">' +
        c.recentlyJoined
          .map((a) => {
            const dateStr = a.firstCommitAt
              ? a.firstCommitAt.slice(0, 10)
              : '—';
            return (
              '<a href="' +
              a.profileUrl +
              '" target="_blank" rel="noopener" class="contributors-recent-card">' +
              '<img src="' +
              a.avatarUrl +
              '" alt="' +
              a.login +
              '" loading="lazy" />' +
              '<div class="contributors-recent-meta">' +
              '<div class="contributors-recent-login">' +
              a.login +
              '</div>' +
              '<div class="contributors-recent-date">' +
              (isEn ? 'Joined ' : '加入於 ') +
              dateStr +
              '</div>' +
              '</div></a>'
            );
          })
          .join('') +
        '</div>';
    }
  }
}

// ── Growth Timeline (SVG area chart) ──
function renderGrowth(articles) {
  const container = document.getElementById('growth-chart');
  const byDate = {};
  articles.forEach((a) => {
    if (a.date) {
      const dateKey = a.date.slice(0, 10);
      byDate[dateKey] = (byDate[dateKey] || 0) + 1;
    }
  });
  const dates = Object.keys(byDate).sort();
  if (dates.length === 0) {
    container.textContent = 'No data';
    return;
  }

  // Build cumulative data
  const data = [];
  let cumulative = 0;
  dates.forEach((d) => {
    cumulative += byDate[d];
    data.push({ date: d, daily: byDate[d], cumulative });
  });

  const milestones = [
    { date: '2025-03-17', emoji: '🚀', label: isEn ? 'Launch' : '上線' },
    { date: '2025-03-18', emoji: '📰', label: isEn ? 'Media' : '媒體報導' },
    { date: '2025-03-19', emoji: '📈', label: isEn ? 'Peak' : '高峰' },
    {
      date: '2025-03-21',
      emoji: '🌱',
      label: isEn ? 'Gardener' : '園丁模式',
    },
  ];

  const chartH = 280;
  const padL = 52,
    padR = 16,
    padT = 30,
    padB = 40;
  const w = container.clientWidth || 800;
  const plotW = w - padL - padR;
  const plotH = chartH - padT - padB;
  const maxY = data[data.length - 1].cumulative;
  const n = data.length;

  // Determine nice Y ticks
  const yTickCount = 5;
  const yStep = Math.ceil(maxY / yTickCount / 10) * 10 || 1;
  const yMax = yStep * yTickCount;

  function xPos(i) {
    return padL + (i / Math.max(n - 1, 1)) * plotW;
  }
  function yPos(v) {
    return padT + plotH - (v / yMax) * plotH;
  }

  // Build line path and area path
  const linePoints = data.map(
    (d, i) => `${xPos(i).toFixed(1)},${yPos(d.cumulative).toFixed(1)}`,
  );
  const linePath = 'M' + linePoints.join(' L');
  const areaPath =
    linePath +
    ` L${xPos(n - 1).toFixed(1)},${(padT + plotH).toFixed(1)} L${xPos(0).toFixed(1)},${(padT + plotH).toFixed(1)} Z`;

  // X labels: show every Nth to avoid crowding
  const isMobile = window.innerWidth < 600;
  const labelEvery = isMobile ? 4 : 3;

  let xLabels = '';
  data.forEach((d, i) => {
    if (i % labelEvery === 0 || i === n - 1) {
      const mmdd = d.date.slice(5).replace('-', '/');
      xLabels += `<text x="${xPos(i).toFixed(1)}" y="${chartH - 4}" text-anchor="middle" class="growth-svg-label">${mmdd}</text>`;
    }
  });

  // Y axis ticks
  let yLabels = '';
  for (let t = 0; t <= yTickCount; t++) {
    const val = t * yStep;
    const y = yPos(val);
    yLabels += `<line x1="${padL}" x2="${w - padR}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(0,0,0,0.06)" />`;
    yLabels += `<text x="${padL - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="growth-svg-label">${val}</text>`;
  }

  // Data point circles + invisible hover targets
  let circles = '';
  data.forEach((d, i) => {
    const cx = xPos(i).toFixed(1);
    const cy = yPos(d.cumulative).toFixed(1);
    circles += `<circle cx="${cx}" cy="${cy}" r="3" fill="#8b5cf6" class="growth-dot" />`;
    circles += `<circle cx="${cx}" cy="${cy}" r="12" fill="transparent" class="growth-dot-hover" data-idx="${i}" />`;
  });

  // Milestone markers
  let milestonesSvg = '';
  const milestoneOffsets = [-40, -60, -40, -60];
  milestones.forEach((m, mi) => {
    const idx = data.findIndex((d) => d.date === m.date);
    if (idx === -1) return;
    const cx = xPos(idx).toFixed(1);
    const cy = parseFloat(yPos(data[idx].cumulative).toFixed(1));
    const offset = milestoneOffsets[mi] || -40;
    const labelY = Math.max(padT + 6, cy + offset);
    const lineEndY = labelY + 6;
    milestonesSvg += `<line x1="${cx}" y1="${lineEndY}" x2="${cx}" y2="${cy - 6}" stroke="#8b5cf6" stroke-width="1" stroke-dasharray="3,2" opacity="0.5" />`;
    milestonesSvg += `<circle cx="${cx}" cy="${cy}" r="5" fill="#8b5cf6" stroke="#fff" stroke-width="2" />`;
    milestonesSvg += `<text x="${cx}" y="${labelY}" text-anchor="middle" class="growth-milestone-label">${m.emoji} ${m.label}</text>`;
  });

  // Tooltip element (HTML overlay)
  container.innerHTML = `
      <div class="growth-area-wrapper" style="position:relative">
        <svg viewBox="0 0 ${w} ${chartH}" width="100%" height="${chartH}" class="growth-svg">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(139,92,246,0.3)" />
              <stop offset="100%" stop-color="rgba(139,92,246,0.02)" />
            </linearGradient>
          </defs>
          ${yLabels}
          <path d="${areaPath}" fill="url(#areaGrad)" />
          <path d="${linePath}" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linejoin="round" />
          ${circles}
          ${milestonesSvg}
          ${xLabels}
        </svg>
        <div class="growth-tooltip" id="growth-tooltip" style="display:none"></div>
      </div>`;

  // Tooltip interaction
  const tooltip = document.getElementById('growth-tooltip');
  const tooltipMargin = 12;
  container.querySelectorAll('.growth-dot-hover').forEach((el) => {
    el.addEventListener('mouseenter', function (e) {
      const idx = parseInt(this.dataset.idx, 10);
      const d = data[idx];
      const mmdd = d.date.slice(5).replace('-', '/');
      tooltip.innerHTML = `<strong>${mmdd}</strong><br>+${d.daily} ${isEn ? 'new' : '新增'}<br>${isEn ? 'Total' : '累計'}: ${d.cumulative}`;
      tooltip.style.display = 'block';
      tooltip.style.visibility = 'hidden';
      const cx = xPos(idx);
      const cy = yPos(d.cumulative);
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;
      const minLeft = container.scrollLeft + tooltipMargin;
      const maxLeft =
        container.scrollLeft +
        container.clientWidth -
        tooltipWidth -
        tooltipMargin;
      const preferredLeft = cx + tooltipMargin;
      const left = Math.max(minLeft, Math.min(preferredLeft, maxLeft));
      const minTop = tooltipMargin;
      const maxTop = chartH - tooltipHeight - tooltipMargin;
      const preferredTop = cy - tooltipHeight - tooltipMargin;
      const top =
        preferredTop >= minTop
          ? preferredTop
          : Math.min(cy + tooltipMargin, maxTop);
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${Math.max(minTop, top)}px`;
      tooltip.style.visibility = 'visible';
    });
    el.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
      tooltip.style.visibility = 'visible';
    });
  });
}

// ── Content Analysis ──
function renderContentAnalysis(articles) {
  const chartEl = document.getElementById('ca-category-chart');
  const statsEl = document.getElementById('ca-stats');
  if (!chartEl || !statsEl) return;

  // Count by category
  const catCounts = {};
  articles.forEach((a) => {
    const cat = a.category || 'other';
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  });

  const sorted = Object.entries(catCounts)
    .filter(([cat]) => cat !== 'root' && cat !== 'resources')
    .sort((a, b) => b[1] - a[1]);

  const maxCount = sorted[0]?.[1] || 1;
  const colors = [
    '#8b5cf6',
    '#6366f1',
    '#3b82f6',
    '#06b6d4',
    '#10b981',
    '#84cc16',
    '#f59e0b',
    '#f97316',
    '#ef4444',
    '#ec4899',
    '#a855f7',
    '#14b8a6',
    '#eab308',
  ];

  chartEl.innerHTML = sorted
    .map(([cat, count], i) => {
      const pct = ((count / maxCount) * 100).toFixed(1);
      const color = colors[i % colors.length];
      const label = categoryLabels[cat.toLowerCase()] || cat;
      return `<div class="ca-bar-row">
        <span class="ca-bar-label">${label}</span>
        <div class="ca-bar-track">
          <div class="ca-bar-fill" style="width:0%;background:${color}" data-width="${pct}%">
            <span class="ca-bar-count">${count}</span>
          </div>
        </div>
      </div>`;
    })
    .join('');

  // Animate bars
  requestAnimationFrame(() => {
    chartEl.querySelectorAll('.ca-bar-fill').forEach((el, i) => {
      setTimeout(() => {
        el.style.width = el.dataset.width;
      }, i * 60);
    });
  });

  // Stats panel
  const totalCats = sorted.length;
  const totalArts = sorted.reduce((s, [, c]) => s + c, 0);
  const avgPerCat = Math.round(totalArts / totalCats);
  const largest = sorted[0];
  const largestLabel = largest
    ? categoryLabels[largest[0].toLowerCase()] || largest[0]
    : '—';

  statsEl.innerHTML = `
      <div class="ca-stat-card">
        <div class="ca-stat-number">${totalArts}</div>
        <div class="ca-stat-label">${isEn ? 'Total Articles' : '總文章數'}</div>
      </div>
      <div class="ca-stat-card">
        <div class="ca-stat-number">${totalCats}</div>
        <div class="ca-stat-label">${isEn ? 'Categories' : '分類數'}</div>
      </div>
      <div class="ca-stat-card">
        <div class="ca-stat-number">${avgPerCat}</div>
        <div class="ca-stat-label">${isEn ? 'Avg per Category' : '平均每類'}</div>
      </div>
      <div class="ca-stat-card">
        <div class="ca-stat-number">${largestLabel}</div>
        <div class="ca-stat-label">${largest ? (isEn ? 'Largest: ' + largest[1] : '最大分類: ' + largest[1] + ' 篇') : '—'}</div>
      </div>`;
}

// ── Health Distribution Histogram ──
function renderHealthDistribution(articles) {
  const container = document.getElementById('health-chart');
  const summaryEl = document.getElementById('health-summary');

  // Bucket articles into score ranges
  const ranges = [
    { label: '0-20', min: 0, max: 20, color: '#ef4444' },
    { label: '20-40', min: 20, max: 40, color: '#f97316' },
    { label: '40-60', min: 40, max: 60, color: '#eab308' },
    { label: '60-80', min: 60, max: 80, color: '#86efac' },
    { label: '80-100', min: 80, max: 101, color: '#22c55e' },
  ];

  const buckets = ranges.map((r) => ({
    ...r,
    count: articles.filter(
      (a) => (a.healthScore || 0) >= r.min && (a.healthScore || 0) < r.max,
    ).length,
  }));

  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  // SVG dimensions
  const w = 600,
    h = 260;
  const padL = 50,
    padR = 20,
    padT = 30,
    padB = 40;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const barW = plotW / buckets.length;
  const barGap = 12;

  // Y axis ticks
  const yTickCount = 4;
  const yStep = Math.ceil(maxCount / yTickCount / 5) * 5 || 1;
  const yMax = yStep * yTickCount;
  function yPos(v) {
    return padT + plotH - (v / yMax) * plotH;
  }

  let yLines = '';
  for (let t = 0; t <= yTickCount; t++) {
    const val = t * yStep;
    const y = yPos(val);
    yLines +=
      '<line x1="' +
      padL +
      '" x2="' +
      (w - padR) +
      '" y1="' +
      y.toFixed(1) +
      '" y2="' +
      y.toFixed(1) +
      '" stroke="rgba(0,0,0,0.06)" />';
    yLines +=
      '<text x="' +
      (padL - 8) +
      '" y="' +
      (y + 4).toFixed(1) +
      '" text-anchor="end" class="health-svg-label">' +
      val +
      '</text>';
  }

  let bars = '';
  buckets.forEach((b, i) => {
    const x = padL + i * barW + barGap / 2;
    const bw = barW - barGap;
    const barH = b.count > 0 ? (b.count / yMax) * plotH : 0;
    const y = padT + plotH - barH;
    bars +=
      '<rect x="' +
      x.toFixed(1) +
      '" y="' +
      y.toFixed(1) +
      '" width="' +
      bw.toFixed(1) +
      '" height="' +
      barH.toFixed(1) +
      '" rx="4" fill="' +
      b.color +
      '" opacity="0.85"><animate attributeName="height" from="0" to="' +
      barH.toFixed(1) +
      '" dur="0.6s" fill="freeze" /><animate attributeName="y" from="' +
      (padT + plotH).toFixed(1) +
      '" to="' +
      y.toFixed(1) +
      '" dur="0.6s" fill="freeze" /></rect>';
    // Count label on top
    if (b.count > 0) {
      bars +=
        '<text x="' +
        (x + bw / 2).toFixed(1) +
        '" y="' +
        (y - 6).toFixed(1) +
        '" text-anchor="middle" class="health-bar-count">' +
        b.count +
        '</text>';
    }
    // X label
    bars +=
      '<text x="' +
      (x + bw / 2).toFixed(1) +
      '" y="' +
      (h - 8) +
      '" text-anchor="middle" class="health-svg-label">' +
      b.label +
      '</text>';
  });

  container.innerHTML =
    '<svg viewBox="0 0 ' +
    w +
    ' ' +
    h +
    '" width="100%" height="' +
    h +
    '" class="health-svg">' +
    yLines +
    bars +
    '</svg>';

  // Summary line
  const needsAttention = articles.filter(
    (a) => (a.healthScore || 0) < 40,
  ).length;
  if (needsAttention > 0) {
    summaryEl.textContent = isEn
      ? '\uD83D\uDD34 ' +
        needsAttention +
        ' articles need attention (score < 40)'
      : '\uD83D\uDD34 ' + needsAttention + ' 篇文章需要關注（分數 < 40）';
  } else {
    summaryEl.textContent = isEn
      ? '\uD83D\uDFE2 All articles are in good health!'
      : '\uD83D\uDFE2 所有文章健康狀態良好！';
  }
}

// ── Next Steps ──
// ── GA4 Analytics ──
// Wait for d3 + d3-cloud to be available on window (they're loaded via
// `<script is:inline defer>` tags in the head, so they finish asynchronously).
// Returns a promise that resolves when both are ready, or rejects after timeout.
function waitForD3(timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (
        typeof window.d3 !== 'undefined' &&
        window.d3.layout &&
        window.d3.layout.cloud
      ) {
        resolve(window.d3);
      } else if (Date.now() - start > timeoutMs) {
        reject(
          new Error('d3 + d3-cloud failed to load within ' + timeoutMs + 'ms'),
        );
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  });
}

// Render a d3-cloud SVG into the given container. Responsive: 16:9 max aspect
// ratio, uses the container's own width. Based on
// https://observablehq.com/@d3/word-cloud
function renderWordCloudSvg(container, wordCloudData, isEn) {
  if (!container || !wordCloudData || !wordCloudData.length) return;

  waitForD3()
    .then((d3) => {
      const parentWidth =
        container.clientWidth || container.parentElement?.clientWidth || 800;
      // Max 16:9 aspect; scale height from width, bounded between 320 and 720
      const width = Math.max(320, Math.min(1200, parentWidth));
      const height = Math.max(320, Math.min(720, Math.round((width * 9) / 16)));

      // Log-scaled font-size with a wide dynamic range so the long tail is
      // visibly smaller than the top queries:
      //   range: 9px → 78px (≈8.7x ratio)
      //   1-impression query lands at exactly the minimum (t=0)
      //   top query lands at maximum (t=1)
      const maxImp = wordCloudData[0]?.impressions || 1;
      const logMax = Math.log(Math.max(maxImp, 2));
      const FONT_MIN = 9;
      const FONT_MAX = 78;
      const fontSizeFor = (imp) => {
        if (logMax === 0) return Math.round((FONT_MIN + FONT_MAX) / 2);
        // Math.max(imp, 1) ensures log is defined; log(1)=0 lands at FONT_MIN
        const t = Math.log(Math.max(imp, 1)) / logMax;
        return Math.round(FONT_MIN + (FONT_MAX - FONT_MIN) * t);
      };

      const words = wordCloudData.map((w) => ({
        text: w.query,
        size: fontSizeFor(w.impressions),
        impressions: w.impressions,
        clicks: w.clicks,
      }));

      // Fixed seed so layout is stable across renders (less jarring on refresh)
      let seed = 1;
      const seededRandom = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      d3.layout
        .cloud()
        .size([width, height])
        .words(words)
        .padding(2)
        .rotate(() => 0)
        .font('"Noto Sans TC", "Source Han Sans TC", system-ui, sans-serif')
        .fontSize((d) => d.size)
        .random(seededRandom)
        .spiral('archimedean')
        .on('end', (laidOut) => {
          drawWordCloud(container, laidOut, width, height, isEn);
        })
        .start();
    })
    .catch((err) => {
      console.warn('[dashboard] word cloud fallback:', err.message);
      container.innerHTML = `<div class="sc-wordcloud-fallback">${isEn ? 'Word cloud unavailable' : '文字雲載入失敗'}</div>`;
      container.removeAttribute('aria-busy');
    });
}

// Draw the laid-out word cloud into the container as an SVG. d3-cloud has
// positioned each word; we just translate to those coordinates.
function drawWordCloud(container, words, width, height, isEn) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('class', 'sc-wordcloud-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute(
    'aria-label',
    isEn ? 'Search Console query word cloud' : 'Search Console 關鍵字文字雲',
  );

  const g = document.createElementNS(svgNS, 'g');
  g.setAttribute('transform', `translate(${width / 2}, ${height / 2})`);
  svg.appendChild(g);

  for (const w of words) {
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute(
      'transform',
      `translate(${w.x.toFixed(1)}, ${w.y.toFixed(1)}) rotate(${w.rotate})`,
    );
    text.setAttribute('font-size', String(w.size));
    text.setAttribute(
      'font-family',
      '"Noto Sans TC", "Source Han Sans TC", system-ui, sans-serif',
    );
    text.setAttribute('fill', w.clicks > 0 ? '#6366f1' : '#94a3b8');
    text.setAttribute('font-weight', w.clicks > 0 ? '600' : '500');
    text.setAttribute(
      'class',
      w.clicks > 0 ? 'sc-word sc-word-clicked' : 'sc-word',
    );
    text.textContent = w.text;

    const titleEl = document.createElementNS(svgNS, 'title');
    titleEl.textContent =
      w.clicks > 0
        ? `${w.text} — ${w.impressions} ${isEn ? 'impressions' : '曝光'} · ${w.clicks} ${isEn ? 'clicks' : '點擊'}`
        : `${w.text} — ${w.impressions} ${isEn ? 'impressions' : '曝光'}`;
    text.appendChild(titleEl);

    g.appendChild(text);
  }

  container.innerHTML = '';
  container.appendChild(svg);
  container.removeAttribute('aria-busy');
}

function renderAnalytics(data) {
  const totalsEl = document.getElementById('analytics-totals');
  const insightsEl = document.getElementById('analytics-insights');
  const pagesEl = document.getElementById('analytics-pages');
  const articles7dEl = document.getElementById('analytics-articles-7d');
  const searchEl = document.getElementById('analytics-search');
  const crawlersEl = document.getElementById('analytics-crawlers');
  const countriesEl = document.getElementById('analytics-countries');
  if (!totalsEl) return;

  const ga = data.ga || {};
  const gaDays = ga.days || 28;
  const search = data.searchConsole7d || data.searchConsole24h || {};
  const searchPeriodDays = data.searchConsole7d ? 7 : 1;
  // Prefer cloudflare7d (fresh from CF cache, 7-day window) over the older
  // cloudflare24h which stayed hand-curated with the last known aiCrawlers
  // breakdown. aiCrawlers is carried forward from cloudflare24h by the
  // generator since Free tier can't refresh it.
  const cloudflare = data.cloudflare7d || data.cloudflare24h || {};
  const cloudflareDays = cloudflare.days || (data.cloudflare7d ? 7 : 1);
  const t = ga.totals || data.totals || {};
  const fmtNum = (n) => (typeof n === 'number' ? n.toLocaleString() : n);
  const fmtPct = (n) =>
    typeof n === 'number' && Number.isFinite(n) ? `${n.toFixed(1)}%` : n;
  const fmtRank = (n) =>
    typeof n === 'number' && Number.isFinite(n) ? n.toFixed(2) : n;
  const gaHighlights = ga.highlights || [];
  const topPages = ga.topPages || data.topPages || [];
  const topArticles7d = ga.topArticles7d || [];
  const topQueries = search.topQueries || [];
  const opportunities = search.opportunities || [];
  const crawlers = cloudflare.aiCrawlers?.crawlers || [];
  const topCountries = cloudflare.traffic?.topCountries || data.countries || [];

  // Totals row
  totalsEl.innerHTML = [
    {
      icon: '👁️',
      value: fmtNum(t.activeUsers),
      label: isEn ? 'Active Users (GA)' : '活躍使用者（GA）',
    },
    {
      icon: '🆕',
      value: fmtNum(t.newUsers),
      label: isEn ? 'New Users (GA)' : '新使用者（GA）',
    },
    {
      icon: '⏱️',
      value:
        typeof t.avgEngagementSeconds === 'number'
          ? `${Math.round(t.avgEngagementSeconds)}s`
          : `${Math.round(parseFloat(t.avgSessionDuration || 0))}s`,
      label: isEn ? 'Avg Engagement' : '平均互動',
    },
    {
      icon: '⚡',
      value: fmtNum(t.events),
      label: isEn ? 'Events (GA)' : '事件數（GA）',
    },
    {
      icon: '🔎',
      value: fmtNum(search.totals?.clicks),
      label: isEn
        ? `Search Clicks (${searchPeriodDays}d)`
        : `搜尋點擊（近 ${searchPeriodDays} 天）`,
    },
    {
      icon: '🤖',
      value: fmtNum(cloudflare.aiCrawlers?.detectedRequests),
      label: isEn ? 'AI Crawls' : 'AI 爬取',
    },
  ]
    .map(
      (m) => `<div class="ga-stat-card">
      <div class="ga-stat-icon">${m.icon}</div>
      <div class="ga-stat-value" data-count="${typeof m.value === 'string' ? m.value.replace(/[^0-9.]/g, '') : m.value}">${m.value}</div>
      <div class="ga-stat-label">${m.label}</div>
    </div>`,
    )
    .join('');

  // Multi-source summary
  if (insightsEl) {
    const brandShare =
      search.totals?.clicks > 0
        ? Math.round(((search.brand?.clicks || 0) / search.totals.clicks) * 100)
        : 0;
    const successfulCrawls = cloudflare.aiCrawlers?.http200 || 0;
    insightsEl.innerHTML =
      `<h3 class="subsection-title">${isEn ? '🧭 Signal Readout' : '🧭 訊號判讀'}</h3>` +
      '<div class="ga-callouts">' +
      [
        {
          title: isEn ? 'Behavior' : '站內行為',
          body: isEn
            ? `${ga.label || 'Recent GA window'} shows home still dominates, while graph/dashboard/map are sticky utility pages.`
            : `${ga.label || '最近 GA 觀測窗'} 顯示首頁仍是主漏斗，但圖譜、Dashboard、地圖已是高黏著工具頁。`,
          meta:
            gaHighlights
              .slice(0, 2)
              .map((item) => `${item.title} ${fmtNum(item.views)}`)
              .join(' · ') || '',
        },
        {
          title: isEn ? 'Search' : '搜尋意圖',
          body: isEn
            ? `Only ${fmtNum(search.totals?.clicks)} clicks came in over the last 24h, and ${brandShare}% were brand searches. Discovery is still ahead of capture.`
            : `過去 24 小時只有 ${fmtNum(search.totals?.clicks)} 次點擊，其中 ${brandShare}% 仍是品牌詞。被看見的速度，仍快於被接住的速度。`,
          meta: opportunities[0]
            ? `${opportunities[0].query} · ${fmtNum(opportunities[0].impressions)} imp · #${fmtRank(opportunities[0].position)}`
            : '',
        },
        {
          title: isEn ? 'Edge + AI' : '邊緣與 AI',
          body: isEn
            ? `${fmtNum(cloudflare.aiCrawlers?.detectedRequests)} AI crawler requests arrived in the last 24h; ${fmtNum(successfulCrawls)} returned HTTP 200.`
            : `過去 24 小時 Cloudflare 看見 ${fmtNum(cloudflare.aiCrawlers?.detectedRequests)} 次 AI crawler 請求，其中 ${fmtNum(successfulCrawls)} 次成功拿到 HTTP 200。`,
          meta: cloudflare.aiCrawlers?.topCrawler
            ? `${cloudflare.aiCrawlers.topCrawler.name} ${fmtNum(cloudflare.aiCrawlers.topCrawler.requests)} · ${cloudflare.aiCrawlers.topPath?.path || ''}`
            : '',
        },
      ]
        .map(
          (item) => `<div class="ga-callout">
              <div class="ga-callout-title">${item.title}</div>
              <div class="ga-callout-body">${item.body}</div>
              <div class="ga-callout-meta">${item.meta}</div>
            </div>`,
        )
        .join('') +
      '</div>';
  }

  // Helper: render a GA page/article list (clickable rows → new tab, 2-col layout)
  const renderGaList = (rows, titleText) => {
    const items = rows.slice(0, 20);
    const mid = Math.ceil(items.length / 2);
    const leftItems = items.slice(0, mid);
    const rightItems = items.slice(mid);

    const renderItem = (p, i) => {
      const rawTitle = p.title
        ? p.title.replace(/\s+\|\s+Taiwan\.md$/, '')
        : '';
      const fallbackName =
        p.path === '/' || p.path === ''
          ? isEn
            ? 'Home'
            : '首頁'
          : decodeURIComponent((p.path || '').replace(/^\/|\/$/g, ''));
      const name = rawTitle || fallbackName;
      const href = p.path || '/';
      return `<a class="ga-page-row ga-page-row-link" href="${href}" target="_blank" rel="noopener noreferrer">
            <span class="ga-page-rank">${i + 1}</span>
            <span class="ga-page-name">${name}</span>
            <span class="ga-page-pv">${fmtNum(p.views || p.pageViews)} ${isEn ? 'views' : '瀏覽'}</span>
          </a>`;
    };

    return (
      `<h3 class="subsection-title">${titleText}</h3>` +
      '<div class="ga-pages-list-2col">' +
      '<div class="ga-pages-list-col">' +
      leftItems.map((p, i) => renderItem(p, i)).join('') +
      '</div>' +
      '<div class="ga-pages-list-col">' +
      rightItems.map((p, i) => renderItem(p, i + mid)).join('') +
      '</div>' +
      '</div>'
    );
  };

  // GA top pages — top 20 pages (28d window, deduped by normalized path)
  if (pagesEl && topPages.length) {
    const pagesTitle = isEn
      ? `🏆 GA Top Pages (last ${gaDays}d)`
      : `🏆 GA 熱門頁面（近 ${gaDays} 天）`;
    pagesEl.innerHTML = renderGaList(topPages, pagesTitle);
  }

  // GA top articles — last 7 days, excludes hubs/meta pages via regex filter
  if (articles7dEl && topArticles7d.length) {
    const articlesTitle = isEn
      ? '📰 GA Top Articles (last 7d)'
      : '📰 GA 熱門文章（近 7 天）';
    articles7dEl.innerHTML = renderGaList(topArticles7d, articlesTitle);
  }

  // Search Console — 7-day data (falls back to 24h if 7d not present)
  if (searchEl && topQueries.length) {
    const scLabel = isEn
      ? `🔎 Search Console (${searchPeriodDays}d)`
      : `🔎 Search Console（近 ${searchPeriodDays} 天）`;

    // Word cloud: all queries with ≥1 impression. Rendered via d3-cloud
    // layout (see https://observablehq.com/@d3/word-cloud) into an SVG
    // with max 16:9 aspect ratio. The actual d3.layout.cloud() call happens
    // after the innerHTML is set (see renderWordCloudSvg below).
    const wordCloud = search.wordCloud || [];
    let wordCloudHtml = '';
    if (wordCloud.length) {
      const cloudTitle = isEn
        ? `☁️ All Queries (${wordCloud.length})`
        : `☁️ 所有關鍵字（${wordCloud.length} 個）`;
      wordCloudHtml =
        `<h4 class="ga-block-title">${cloudTitle}</h4>` +
        `<div class="sc-wordcloud-container" aria-busy="true">
             <div class="sc-wordcloud-loading">${isEn ? 'Building cloud…' : '計算中⋯'}</div>
           </div>`;
    }

    // Brand vs non-brand breakdown (2026-04-17 δ — REFLEXES #24 第 5 種儀器化)
    const brandBreakdown = search.brandBreakdown || null;
    const brandSplitHtml = brandBreakdown
      ? `<div class="sc-brand-split">
            <div class="sc-brand-pill sc-brand-pill-brand">
              <span class="sc-brand-label">${isEn ? 'Brand' : '品牌'}</span>
              <span class="sc-brand-value">${fmtNum(brandBreakdown.brand.clicks)}/${fmtNum(brandBreakdown.brand.impressions)}</span>
              <span class="sc-brand-ctr">CTR ${fmtPct(brandBreakdown.brand.ctr)}</span>
            </div>
            <div class="sc-brand-pill sc-brand-pill-nonbrand">
              <span class="sc-brand-label">${isEn ? 'Non-brand' : '非品牌'}</span>
              <span class="sc-brand-value">${fmtNum(brandBreakdown.nonBrand.clicks)}/${fmtNum(brandBreakdown.nonBrand.impressions)}</span>
              <span class="sc-brand-ctr">CTR ${fmtPct(brandBreakdown.nonBrand.ctr)}</span>
            </div>
            <div class="sc-brand-note">${isEn ? 'Total CTR aggregates both. Non-brand CTR is the real external discoverability.' : '總 CTR 加權掩蓋分層真相；非品牌 CTR 才是真實搜尋可見度'}</div>
          </div>`
      : '';

    searchEl.innerHTML =
      `<h3 class="subsection-title">${scLabel}</h3>` +
      `<div class="ga-subtle">${
        isEn
          ? `${fmtNum(search.totals?.impressions)} impressions · ${fmtNum(search.totals?.clicks)} clicks · ${fmtPct(search.totals?.ctr)} CTR`
          : `${fmtNum(search.totals?.impressions)} 曝光 · ${fmtNum(search.totals?.clicks)} 點擊 · ${fmtPct(search.totals?.ctr)} CTR`
      }</div>` +
      brandSplitHtml +
      (() => {
        const qItems = topQueries.slice(0, 20);
        const qMid = Math.ceil(qItems.length / 2);
        const renderQ = (q, i) => `<div class="sc-query-row">
              <span class="sc-query-rank">${i + 1}</span>
              <span class="sc-query-label">${q.query}</span>
              <span class="sc-query-clicks">${fmtNum(q.clicks)} ${isEn ? 'clicks' : '點擊'}</span>
              <span class="sc-query-impr">${fmtNum(q.impressions)} ${isEn ? 'impr' : '曝光'}</span>
              <span class="sc-query-ctr">${fmtPct(q.ctr)}</span>
              <span class="sc-query-pos">#${fmtRank(q.position)}</span>
            </div>`;
        return (
          '<div class="sc-queries-grid">' +
          '<div class="sc-queries-col">' +
          qItems
            .slice(0, qMid)
            .map((q, i) => renderQ(q, i))
            .join('') +
          '</div>' +
          '<div class="sc-queries-col">' +
          qItems
            .slice(qMid)
            .map((q, i) => renderQ(q, i + qMid))
            .join('') +
          '</div>' +
          '</div>'
        );
      })() +
      (opportunities.length
        ? `<h4 class="ga-block-title">${isEn ? 'Best Next Fixes' : '優先補洞'}</h4>` +
          '<div class="ga-mini-list">' +
          opportunities
            .slice(0, 5)
            .map(
              (q) => `<div class="ga-mini-row">
                  <span class="ga-mini-label">${q.query}</span>
                  <span class="ga-mini-meta">${fmtNum(q.impressions)}i / #${fmtRank(q.position)}</span>
                </div>`,
            )
            .join('') +
          '</div>'
        : '') +
      wordCloudHtml;

    // Now the container exists in the DOM — render the d3-cloud SVG into it.
    // Runs async (waits for d3 CDN scripts to finish loading).
    if (wordCloud.length) {
      renderWordCloudSvg(
        searchEl.querySelector('.sc-wordcloud-container'),
        wordCloud,
        isEn,
      );
    }
  }

  // Cloudflare AI crawler watch
  if (crawlersEl && crawlers.length) {
    const maxRequests = crawlers[0]?.requests || 1;
    crawlersEl.innerHTML =
      `<h3 class="subsection-title">${isEn ? '🤖 AI Crawl Watch' : '🤖 AI 爬行監測'}${cloudflare.aiCrawlersStale ? ' <span class="ga-stale-hint" title="Last refreshed snapshot — Free tier cannot auto-fetch user-agent breakdown">●</span>' : ''}</h3>` +
      `<div class="ga-kpi-strip">
          <span>${isEn ? 'Allowed' : '允許'} ${fmtNum(cloudflare.aiCrawlers?.allowedRequests)}</span>
          <span>HTTP 200 ${fmtNum(cloudflare.aiCrawlers?.http200)}</span>
          <span>${isEn ? 'Failed' : '失敗'} ${fmtNum(cloudflare.aiCrawlers?.unsuccessfulRequests)}</span>
        </div>` +
      crawlers
        .slice(0, 8)
        .map((crawler) => {
          const pct = ((crawler.requests / maxRequests) * 100).toFixed(0);
          return `<div class="ga-source-row">
              <span class="ga-source-name">${crawler.name}</span>
              <div class="ga-source-bar-track">
                <div class="ga-source-bar-fill" style="width:${pct}%"></div>
              </div>
              <span class="ga-source-count">${fmtNum(crawler.requests)}</span>
            </div>`;
        })
        .join('');
  }

  // Countries / regions
  if (countriesEl && topCountries.length) {
    const countryFlags = {
      Taiwan: '🇹🇼',
      'United States': '🇺🇸',
      Japan: '🇯🇵',
      Australia: '🇦🇺',
      Singapore: '🇸🇬',
      Canada: '🇨🇦',
      'Hong Kong': '🇭🇰',
      'United Kingdom': '🇬🇧',
      Germany: '🇩🇪',
      Malaysia: '🇲🇾',
      France: '🇫🇷',
      'South Korea': '🇰🇷',
      Thailand: '🇹🇭',
      Netherlands: '🇳🇱',
      Indonesia: '🇮🇩',
      Philippines: '🇵🇭',
      Brazil: '🇧🇷',
      India: '🇮🇳',
      Vietnam: '🇻🇳',
      'New Zealand': '🇳🇿',
      China: '🇨🇳',
      Mexico: '🇲🇽',
      Spain: '🇪🇸',
      Italy: '🇮🇹',
    };
    const maxUsers = topCountries[0]?.requests || topCountries[0]?.users || 1;
    countriesEl.innerHTML =
      `<h3 class="subsection-title">${isEn ? `🌍 Edge Geography (${cloudflareDays}d)` : `🌍 邊緣流量地理（近 ${cloudflareDays} 天）`}</h3>` +
      '<div class="ga-countries-list">' +
      topCountries
        .slice(0, 8)
        .map((c) => {
          const flag = countryFlags[c.country] || '🌐';
          const count = c.requests || c.users;
          const pct = ((count / maxUsers) * 100).toFixed(0);
          return `<div class="ga-country-row">
            <span class="ga-country-flag">${flag}</span>
            <span class="ga-country-name">${c.country}</span>
            <div class="ga-country-bar-track">
              <div class="ga-country-bar-fill" style="width:${pct}%"></div>
            </div>
            <span class="ga-country-count">${fmtNum(count)}</span>
          </div>`;
        })
        .join('') +
      '</div>';
  }
}

function renderNextSteps(articles, translations) {
  const grid = document.getElementById('nextsteps-grid');

  // Card 1: Lowest health score article
  const sorted = [...articles].sort(
    (a, b) => (a.healthScore || 0) - (b.healthScore || 0),
  );
  const worst = sorted[0];
  const worstUrl = worst
    ? langPrefix + '/' + worst.category + '/' + worst.slug
    : '#';

  // Card 2: Language with most missing translations
  const langs = ['en', 'es', 'ja', 'ko'];
  const langNames = {
    en: 'English',
    es: 'Español',
    ja: '日本語',
    ko: '한국어',
  };
  let maxMissing = 0,
    maxMissingLang = 'en';
  langs.forEach((l) => {
    const missing = articles.filter((a) => !a.translations[l]).length;
    if (missing > maxMissing) {
      maxMissing = missing;
      maxMissingLang = l;
    }
  });

  // Card 3: Oldest unreviewed article
  const unreviewed = articles
    .filter((a) => !a.lastHumanReview && a.date)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const oldest = unreviewed[0];
  const oldestUrl = oldest
    ? langPrefix + '/' + oldest.category + '/' + oldest.slug
    : '#';
  let daysSince = 0;
  if (oldest && oldest.date) {
    daysSince = Math.floor(
      (Date.now() - new Date(oldest.date)) / (1000 * 60 * 60 * 24),
    );
  }

  const contributeUrl =
    'https://github.com/frank890417/taiwan-md/blob/main/CONTRIBUTING.md';

  grid.innerHTML =
    '<div class="nextstep-card">' +
    '<div class="nextstep-emoji">🔧</div>' +
    '<div class="nextstep-action">' +
    (isEn ? 'Improve' : '改善') +
    '</div>' +
    (worst
      ? '<div class="nextstep-detail"><a href="' +
        worstUrl +
        '">' +
        worst.title +
        '</a></div>' +
        '<div class="nextstep-meta">' +
        (isEn ? 'Health score: ' : '健康分數：') +
        '<strong>' +
        (worst.healthScore || 0) +
        '</strong></div>'
      : '<div class="nextstep-detail">' +
        (isEn ? 'All articles healthy!' : '所有文章都很健康！') +
        '</div>') +
    '<a href="' +
    contributeUrl +
    '" class="nextstep-link" target="_blank" rel="noopener">' +
    (isEn ? 'Contribute →' : '貢獻 →') +
    '</a>' +
    '</div>' +
    '<div class="nextstep-card">' +
    '<div class="nextstep-emoji">🌐</div>' +
    '<div class="nextstep-action">' +
    (isEn ? 'Translate' : '翻譯') +
    '</div>' +
    '<div class="nextstep-detail">' +
    (langNames[maxMissingLang] || maxMissingLang) +
    '</div>' +
    '<div class="nextstep-meta">' +
    maxMissing +
    (isEn ? ' articles missing' : ' 篇文章缺少翻譯') +
    '</div>' +
    '<a href="' +
    contributeUrl +
    '" class="nextstep-link" target="_blank" rel="noopener">' +
    (isEn ? 'Contribute →' : '貢獻 →') +
    '</a>' +
    '</div>' +
    '<div class="nextstep-card">' +
    '<div class="nextstep-emoji">📝</div>' +
    '<div class="nextstep-action">' +
    (isEn ? 'Review' : '審閱') +
    '</div>' +
    (oldest
      ? '<div class="nextstep-detail"><a href="' +
        oldestUrl +
        '">' +
        oldest.title +
        '</a></div>' +
        '<div class="nextstep-meta">' +
        daysSince +
        (isEn ? ' days since creation' : ' 天前建立') +
        '</div>'
      : '<div class="nextstep-detail">' +
        (isEn ? 'All articles reviewed!' : '所有文章已審閱！') +
        '</div>') +
    '<a href="' +
    contributeUrl +
    '" class="nextstep-link" target="_blank" rel="noopener">' +
    (isEn ? 'Contribute →' : '貢獻 →') +
    '</a>' +
    '</div>';
}

// ── Footer ──
function renderFooter(vitals) {
  const el = document.getElementById('dashboard-footer');
  if (!el) return;
  const d = new Date(vitals.lastUpdated || Date.now());
  const formatted = d.toLocaleDateString(isEn ? 'en-US' : 'zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  el.textContent = `${isEn ? 'Data generated' : '數據產生於'} ${formatted}`;
}

// ── Utils ──
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
