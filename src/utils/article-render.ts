/**
 * article-render.ts — article markdown → HTML render pipeline（module-level, build-wide 共享）
 *
 * 為什麼從 article.template.astro 抽出來（2026-06-13 refactor session）：
 * 1. 檔案長度：renderTwModule 17 模組 + footnote/wikilink pipeline ≈ 900 行
 *    佔掉 template 40%，template 該只剩 view orchestration。
 * 2. Scope 正確性：.astro frontmatter 是 per-render scope（每頁重跑），
 *    renderer/函式每頁重新配置。module scope 整個 build 只配置一次。
 *    ⚠️ 同 class bug 前科：_gitCaches Map 放 frontmatter → git log 子程序
 *    每頁重跑 4,895 次（見 reports/article-template-refactor-2026-06-13.md）。
 *    任何 cache / 昂貴初始化都必須住在被 import 的 .ts module，不是 frontmatter。
 *
 * 內容物全部 1:1 verbatim 搬運（sed 行段抽取），輸出 byte-identical：
 * - resolveWikilinks / marked renderer hooks（heading/link/image/code）
 * - renderTwModule：17 種 tw-* 視覺模組（graph.md §模組型錄 的 renderer 實體）
 * - processFootnotes：GFM [^n] 腳註
 * - renderArticleHtml：title-dedup → wikilink → footnote → marked → 延伸閱讀 split
 */
import { marked } from 'marked';

function resolveWikilinks(md: string) {
  if (!md) return md;
  return md.replace(
    /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g,
    (_, target, display) => {
      return `**${display || target}**`;
    },
  );
}

const renderer = new marked.Renderer();

// Inject id attributes on headings for TOC anchor links
renderer.heading = ({ text, depth }) => {
  const id = text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .slice(0, 60);
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

renderer.link = ({ href, title, text }) => {
  const isExternal =
    href?.startsWith('http://') || href?.startsWith('https://');
  const titleAttr = title ? ` title="${title}"` : '';
  const targetAttr = isExternal
    ? ' target="_blank" rel="noopener noreferrer"'
    : '';
  return `<a href="${href}"${titleAttr}${targetAttr}>${text}</a>`;
};

renderer.image = ({ href, title, text }) => {
  const titleAttr = title ? ` title="${title}"` : '';
  return `<img src="${href}" alt="${text || ''}"${titleAttr} loading="lazy" onerror="this.onerror=null;this.classList.add('img-broken')" />`;
};

// ── 文章內共用視覺模組（fenced-code 語法糖 → HTML，CSS 在 article-modules.css）─
// 作者寫 ```tw-figure / tw-versus / tw-bars / tw-timeline 區塊，逐列用 | 分欄。
const _esc = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function renderTwModule(lang: string, raw: string): string {
  let lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return '';

  // 跨模組「來源」列：任一列 `來源：…` / `資料來源：…` / `source: …` 抽成 sibling 來源 caption
  let src = '';
  const _srcRe = /^(?:資料來源|來源|source)\s*[:：]\s*(.+)$/i;
  lines = lines.filter((l) => {
    const m = l.match(_srcRe);
    if (m) {
      src = m[1].trim();
      return false;
    }
    return true;
  });
  if (lines.length === 0 && !src) return '';
  const _src = src ? `<p class="tw-mod-src">資料來源：${_esc(src)}</p>` : '';

  // 跨模組「標題」列：資料模組第一列若不含 `|` 視為模組標題（graph.md：標題說 takeaway）。
  // tw-figure / tw-quote / tw-source / tw-line / tw-waffle / tw-note 有自己的 positional 邏輯，不走這層。
  const TITLED = new Set([
    'tw-bars',
    'tw-stat',
    'tw-versus',
    'tw-timeline',
    'tw-heatmap',
    'tw-slope',
    'tw-dot',
    'tw-stack',
    'tw-pyramid',
    'tw-tiles',
    'tw-iso',
  ]);
  let modTitle = '';
  if (
    TITLED.has(lang) &&
    lines.length > 1 &&
    lines[0] &&
    !lines[0].includes('|') &&
    !/^單位\s*[:：]/.test(lines[0])
  ) {
    modTitle = lines.shift() || '';
  }
  const _title = modTitle
    ? `<div class="tw-mod-title">${_esc(modTitle)}</div>`
    : '';
  // 數字小工具：千分位 + 從欄位字串抽數值（保留負號）
  const _fmt = (v: number) =>
    Math.abs(v) >= 1000 ? v.toLocaleString('en-US') : String(v);
  const _num = (s: string) => parseFloat(String(s).replace(/[^0-9.\-]/g, ''));
  // 強調列語法：標籤開頭 `*` → 該列 highlight、其餘列退灰（Datawrapper 灰色脈絡 pattern）
  const _emph = (raw: string) =>
    raw.startsWith('*')
      ? { label: raw.slice(1).trim(), hi: true }
      : { label: raw, hi: false };

  if (lang === 'tw-figure') {
    // line1: 大數字（含 -> / → 視為 before→after）；line2: 說明；line3: 來源
    // 也接受 `來源：…` 列（被上方 _srcRe 抽走時 merge 進 positional slot，不再靜默掉）
    const [big = '', cap = '', posSrc = ''] = lines;
    const figSrc = posSrc || src;
    const parts = big.split(/\s*(?:->|→|➜)\s*/);
    const nums =
      parts.length >= 2
        ? `<span class="tw-figure-num">${_esc(parts[0])}</span><span class="tw-figure-arrow">→</span><span class="tw-figure-num">${_esc(parts[1])}</span>`
        : `<span class="tw-figure-num tw-figure-num--solo">${_esc(big)}</span>`;
    return (
      `<div class="tw-figure"><div class="tw-figure-nums">${nums}</div>` +
      (cap ? `<div class="tw-figure-cap">${_esc(cap)}</div>` : '') +
      (figSrc
        ? `<div class="tw-figure-src">資料來源：${_esc(figSrc)}</div>`
        : '') +
      `</div>`
    );
  }

  if (lang === 'tw-versus') {
    // line1: 左標題 | 右標題；其餘列: 左 | 右
    const [head, ...rows] = lines;
    const [lt = '', rt = ''] = head.split('|').map((s) => s.trim());
    // 每格內嵌側別標籤（桌機隱藏、手機顯示）—— 兩欄收摺成單欄時配對識別不丟失
    const tagA = `<span class="tw-versus-tag">${_esc(lt)}</span>`;
    const tagB = `<span class="tw-versus-tag">${_esc(rt)}</span>`;
    const body = rows
      .map((r) => {
        const [l = '', rr = ''] = r.split('|').map((s) => s.trim());
        return `<div class="tw-versus-row"><div class="tw-versus-cell">${tagA}${_esc(l)}</div><div class="tw-versus-cell">${tagB}${_esc(rr)}</div></div>`;
      })
      .join('');
    return (
      `<div class="tw-versus">${_title ? `<div class="tw-mod-title tw-versus-title">${_esc(modTitle)}</div>` : ''}<div class="tw-versus-heads">` +
      `<div class="tw-versus-head tw-versus-head--a">${_esc(lt)}</div>` +
      `<div class="tw-versus-vs">vs</div>` +
      `<div class="tw-versus-head tw-versus-head--b">${_esc(rt)}</div></div>` +
      `<div class="tw-versus-body">${body}</div></div>${_src}`
    );
  }

  if (lang === 'tw-bars') {
    // 每列: 標籤 | 數值 | (選填註記)。數值取數字部分縮放長度（支援負值 → 分歧條）。
    // 標籤開頭 `*` = 強調列（其餘列退灰）。
    const parsed = lines.map((l) => {
      const [rawLabel = '', val = '', note = ''] = l
        .split('|')
        .map((s) => s.trim());
      const { label, hi } = _emph(rawLabel);
      const num = _num(val) || 0;
      return { label, val, num, note, hi };
    });
    const hasNeg = parsed.some((p) => p.num < 0);
    const anyHi = parsed.some((p) => p.hi);
    const valHtml = (p: { val: string; note: string }) =>
      `<div class="tw-bars-val">${_esc(p.val)}${p.note ? `<span class="tw-bars-note"> ${_esc(p.note)}</span>` : ''}</div>`;
    let body = '';
    if (!hasNeg) {
      const max = Math.max(...parsed.map((p) => p.num), 0.0001);
      body = parsed
        .map((p) => {
          const pct = Math.max(3, Math.round((p.num / max) * 100));
          return (
            `<div class="tw-bars-row${p.hi ? ' tw-bars-row--hi' : ''}"><div class="tw-bars-label">${_esc(p.label)}</div>` +
            `<div class="tw-bars-track"><div class="tw-bars-fill" style="width:${pct}%"></div></div>` +
            valHtml(p) +
            `</div>`
          );
        })
        .join('');
    } else {
      // 分歧條：0 在中線，負值往左（冷色）、正值往右（暖色）
      const maxAbs = Math.max(...parsed.map((p) => Math.abs(p.num)), 0.0001);
      body = parsed
        .map((p) => {
          const pct = Math.max(1.5, (Math.abs(p.num) / maxAbs) * 49);
          const neg = p.num < 0;
          return (
            `<div class="tw-bars-row${p.hi ? ' tw-bars-row--hi' : ''}"><div class="tw-bars-label">${_esc(p.label)}</div>` +
            `<div class="tw-bars-track tw-bars-track--div"><span class="tw-bars-zero"></span>` +
            `<div class="tw-bars-fill ${neg ? 'tw-bars-fill--neg' : 'tw-bars-fill--pos'}" style="${neg ? 'right:50%;left:auto;' : 'left:50%;'}width:${pct}%"></div></div>` +
            valHtml(p) +
            `</div>`
          );
        })
        .join('');
    }
    return `<div class="tw-bars${anyHi ? ' tw-bars--focus' : ''}">${_title}${body}</div>${_src}`;
  }

  if (lang === 'tw-timeline') {
    // 每列: 年份 | 標題 | (選填說明)
    const body = lines
      .map((l) => {
        const [year = '', t = '', desc = ''] = l
          .split('|')
          .map((s) => s.trim());
        return (
          `<div class="tw-timeline-item"><div class="tw-timeline-year">${_esc(year)}</div>` +
          `<div class="tw-timeline-node"></div>` +
          `<div class="tw-timeline-content"><div class="tw-timeline-title">${_esc(t)}</div>` +
          (desc ? `<div class="tw-timeline-desc">${_esc(desc)}</div>` : '') +
          `</div></div>`
        );
      })
      .join('');
    return `<div class="tw-timeline">${_title}${body}</div>${_src}`;
  }

  if (lang === 'tw-stat') {
    // 每列: 數值 | 標籤 | (選填註記)
    const cards = lines
      .map((l) => {
        const [val = '', label = '', note = ''] = l
          .split('|')
          .map((s) => s.trim());
        return (
          `<div class="tw-stat-card"><div class="tw-stat-val">${_esc(val)}</div>` +
          (label ? `<div class="tw-stat-label">${_esc(label)}</div>` : '') +
          (note ? `<div class="tw-stat-note">${_esc(note)}</div>` : '') +
          `</div>`
        );
      })
      .join('');
    const statCore = `<div class="tw-stat">${cards}</div>`;
    return _title
      ? `<div class="tw-stat-wrap">${_title}${statCore}</div>${_src}`
      : `${statCore}${_src}`;
  }

  if (lang === 'tw-waffle') {
    // 選填標題（不含 |）+ 每列: 類別 | 數值(%)；100 格依比例填色
    let title = '';
    let rows = lines;
    if (lines[0] && !lines[0].includes('|')) {
      title = lines[0];
      rows = lines.slice(1);
    }
    const cats = rows.map((l) => {
      const [label = '', val = ''] = l.split('|').map((s) => s.trim());
      const num = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
      return { label, val, num };
    });
    const total = cats.reduce((a, c) => a + c.num, 0) || 1;
    const floors = cats.map((c) => Math.floor((c.num / total) * 100));
    const rem = 100 - floors.reduce((a, b) => a + b, 0);
    const fracs = cats
      .map((c, i) => ({ i, f: (c.num / total) * 100 - floors[i] }))
      .sort((a, b) => b.f - a.f);
    for (let k = 0; k < rem && k < fracs.length; k++) floors[fracs[k].i]++;
    const order: number[] = [];
    floors.forEach((cnt, ci) => {
      for (let j = 0; j < cnt; j++) order.push(ci);
    });
    const cells = order
      .slice(0, 100)
      .map((ci) => `<div class="tw-waffle-cell" data-cat="${ci % 5}"></div>`)
      .join('');
    const swatch = [
      'var(--tw-warm)',
      'var(--tw-cool)',
      'var(--tw-green)',
      'var(--color-accent)',
      'var(--tw-mute)',
    ];
    const legend = cats
      .map(
        (c, ci) =>
          `<span class="tw-waffle-key"><span class="tw-waffle-swatch" style="background:${swatch[ci % 5]}"></span>${_esc(c.label)} <b>${_esc(c.val)}</b></span>`,
      )
      .join('');
    return (
      `<div class="tw-waffle">` +
      (title ? `<div class="tw-mod-title">${_esc(title)}</div>` : '') +
      `<div class="tw-waffle-grid" role="img" aria-label="${_esc(title || '方格圖')}">${cells}</div>` +
      `<div class="tw-waffle-legend">${legend}</div></div>${_src}`
    );
  }

  if (lang === 'tw-quote') {
    // line1: 引文；line2: 姓名 | 角色/場合
    const [q = '', by = ''] = lines;
    const qt = q.replace(/^[「『]/, '').replace(/[」』]$/, '');
    const [name = '', role = ''] = by.split('|').map((s) => s.trim());
    const byHtml = name
      ? `<figcaption class="tw-quote-by"><b>${_esc(name)}</b>${role ? `，${_esc(role)}` : ''}</figcaption>`
      : '';
    return `<figure class="tw-quote"><blockquote class="tw-quote-text">${_esc(qt)}</blockquote>${byHtml}</figure>${_src}`;
  }

  if (lang === 'tw-source') {
    // 整段當來源條（或被 _srcRe 抽走則用 src）
    const txt = lines.join(' ') || src;
    if (!txt) return '';
    return `<p class="tw-source"><span class="tw-source-icon">⌖</span><span>${_esc(txt)}</span></p>`;
  }

  if (lang === 'tw-line') {
    // line1: 標題；line2: x軸名 | 序列1 | 序列2…；其餘: x值 | y1 | y2…
    // 基準線列：`基準：標籤 | 值` → 虛線參考線（無端點、單一標籤），不是序列
    if (lines.length < 3) return '';
    const title = lines[0];
    const header = lines[1].split('|').map((s) => s.trim());
    const xName = header[0] || '';
    const series = header.slice(1);
    const refRe = /^基準線?\s*[:：]\s*/;
    const baselines: { label: string; v: number }[] = [];
    const dataLines = lines.slice(2).filter((l) => {
      const first = l.split('|')[0].trim();
      if (refRe.test(first)) {
        const label = first.replace(refRe, '');
        const v = _num(l.split('|')[1] || '');
        if (!isNaN(v)) baselines.push({ label, v });
        return false;
      }
      return true;
    });
    const rows = dataLines.map((l) => {
      const c = l.split('|').map((s) => s.trim());
      return {
        x: c[0] || '',
        ys: series.map((_, i) => _num(c[i + 1] || '')),
      };
    });
    const allY = [
      ...rows.flatMap((r) => r.ys),
      ...baselines.map((b) => b.v),
    ].filter((v) => !isNaN(v));
    if (allY.length === 0) return '';
    let yMin = Math.min(...allY);
    let yMax = Math.max(...allY);
    if (yMin === yMax) {
      yMin = yMin > 0 ? 0 : yMin - 1;
      yMax = yMax + 1;
    }
    // 動態右邊界：序列名 / 基準標籤要放得下（CJK ~12.5px/字 @ font 12）
    const maxName = Math.max(0, ...series.map((s) => s.length));
    const W = 400,
      H = 200,
      mL = 44,
      mR = Math.min(96, Math.max(40, 14 + maxName * 12.5)),
      mT = 20,
      mB = 26;
    const pw = W - mL - mR,
      ph = H - mT - mB;
    const sx = (i: number) =>
      mL + (rows.length > 1 ? (i / (rows.length - 1)) * pw : pw / 2);
    const sy = (v: number) => mT + (1 - (v - yMin) / (yMax - yMin)) * ph;
    const colCls = ['tw-line-s0', 'tw-line-s1', 'tw-line-s2'];
    let g = '';
    g += `<line class="tw-line-axis" x1="${mL}" y1="${sy(yMax).toFixed(1)}" x2="${W - mR}" y2="${sy(yMax).toFixed(1)}"/>`;
    g += `<line class="tw-line-axis" x1="${mL}" y1="${sy(yMin).toFixed(1)}" x2="${W - mR}" y2="${sy(yMin).toFixed(1)}"/>`;
    g += `<text class="tw-line-ylab" x="${mL - 6}" y="${(sy(yMax) + 4).toFixed(1)}" text-anchor="end">${_esc(_fmt(yMax))}</text>`;
    g += `<text class="tw-line-ylab" x="${mL - 6}" y="${(sy(yMin) + 4).toFixed(1)}" text-anchor="end">${_esc(_fmt(yMin))}</text>`;
    g += `<text class="tw-line-xlab" x="${sx(0).toFixed(1)}" y="${H - 8}" text-anchor="start">${_esc(rows[0].x)}</text>`;
    if (rows.length >= 5) {
      const mid = Math.floor((rows.length - 1) / 2);
      g += `<text class="tw-line-xlab" x="${sx(mid).toFixed(1)}" y="${H - 8}" text-anchor="middle">${_esc(rows[mid].x)}</text>`;
    }
    if (rows.length > 1)
      g += `<text class="tw-line-xlab" x="${sx(rows.length - 1).toFixed(1)}" y="${H - 8}" text-anchor="end">${_esc(rows[rows.length - 1].x)}</text>`;
    // 基準線（虛線、無端點、右端單一標籤 — graph.md §八 反例 gallery 的正解）
    baselines.forEach((b) => {
      const y = sy(b.v).toFixed(1);
      g += `<line class="tw-line-ref" x1="${mL}" y1="${y}" x2="${W - mR}" y2="${y}"/>`;
      g += `<text class="tw-line-reflab" x="${W - mR}" y="${(sy(b.v) - 4).toFixed(1)}" text-anchor="end">${_esc(b.label)} ${_esc(_fmt(b.v))}</text>`;
    });
    series.forEach((sname, si) => {
      const pts = rows
        .map((r, i) => ({ x: sx(i), y: sy(r.ys[si]), v: r.ys[si] }))
        .filter((p) => !isNaN(p.v));
      if (pts.length === 0) return;
      const cls = colCls[si % 3];
      const line = pts
        .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
        .join(' ');
      if (series.length === 1) {
        // 面積填色只給單序列：多序列疊面積會互相蓋成一坨
        const area = `${pts[0].x.toFixed(1)},${sy(yMin).toFixed(1)} ${line} ${pts[pts.length - 1].x.toFixed(1)},${sy(yMin).toFixed(1)}`;
        g += `<polygon class="tw-line-area ${cls}" points="${area}"/>`;
      }
      g += `<polyline class="tw-line-path ${cls}" points="${line}"/>`;
      pts.forEach((p) => {
        g += `<circle class="tw-line-dot ${cls}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2.5"/>`;
      });
      const last = pts[pts.length - 1];
      g += `<text class="tw-line-slab ${cls}" x="${(last.x + 5).toFixed(1)}" y="${(last.y + 4).toFixed(1)}">${_esc(sname)}</text>`;
    });
    const svg = `<svg class="tw-line-plot" viewBox="0 0 ${W} ${H}" role="img" aria-label="${_esc(title)}" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
    const capExtra = baselines.length
      ? `（基準線：${baselines.map((b) => `${b.label} = ${_fmt(b.v)}`).join('、')}）`
      : '';
    const thead = `<tr><th scope="col">${_esc(xName)}</th>${series.map((s) => `<th scope="col">${_esc(s)}</th>`).join('')}</tr>`;
    const tbody = rows
      .map(
        (r) =>
          `<tr><th scope="row">${_esc(r.x)}</th>${r.ys.map((y) => `<td>${isNaN(y) ? '' : _esc(String(y))}</td>`).join('')}</tr>`,
      )
      .join('');
    const table = `<table class="tw-sr-only"><caption>${_esc(title)}${_esc(capExtra)}</caption><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
    return `<figure class="tw-line"><div class="tw-mod-title">${_esc(title)}</div>${svg}${table}</figure>${_src}`;
  }

  if (lang === 'tw-heatmap') {
    // line1: 角標 | 欄1 | 欄2…；其餘: 列標 | v1 | v2…（每欄各自正規化成色深）
    if (lines.length < 2) return '';
    const header = lines[0].split('|').map((s) => s.trim());
    const corner = header[0] || '';
    const cols = header.slice(1);
    const rows = lines.slice(1).map((l) => {
      const c = l.split('|').map((s) => s.trim());
      return { label: c[0] || '', vals: cols.map((_, i) => c[i + 1] || '') };
    });
    const colNums = cols.map((_, ci) =>
      rows.map((r) => parseFloat((r.vals[ci] || '').replace(/[^0-9.\-]/g, ''))),
    );
    const colMin = colNums.map((arr) =>
      Math.min(...arr.filter((v) => !isNaN(v))),
    );
    const colMax = colNums.map((arr) =>
      Math.max(...arr.filter((v) => !isNaN(v))),
    );
    const thead = `<tr><th scope="col">${_esc(corner)}</th>${cols.map((c) => `<th scope="col">${_esc(c)}</th>`).join('')}</tr>`;
    const tbody = rows
      .map((r) => {
        const tds = r.vals
          .map((v, ci) => {
            const num = parseFloat((v || '').replace(/[^0-9.\-]/g, ''));
            const range = colMax[ci] - colMin[ci];
            if (isNaN(num))
              return `<td class="tw-hm-na">${_esc(v || '–')}</td>`;
            const i = range === 0 ? 0.5 : (num - colMin[ci]) / range;
            // 深色格自動翻白字（build-time 算好，不靠 CSS 猜對比）
            return `<td${i >= 0.55 ? ' class="tw-hm-hi"' : ''} style="--i:${i.toFixed(2)}">${_esc(v)}</td>`;
          })
          .join('');
        return `<tr><th scope="row">${_esc(r.label)}</th>${tds}</tr>`;
      })
      .join('');
    return `<div class="tw-heatmap">${_title}<table class="tw-heatmap-table"><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>${_src}`;
  }

  if (lang === 'tw-slope') {
    // 斜率圖：恰兩個時點的變化。line1(選填): 標題；header: `左時點 | 右時點`（恰 2 欄）；
    // rows: `標籤 | 左值 | 右值`。標籤開頭 `*` = 強調列。
    if (lines.length < 2) return '';
    const head = lines[0].split('|').map((s) => s.trim());
    if (head.length !== 2) return '';
    const [tL, tR] = head;
    const rows = lines
      .slice(1)
      .map((l) => {
        const c = l.split('|').map((s) => s.trim());
        const { label, hi } = _emph(c[0] || '');
        return {
          label,
          hi,
          v1: _num(c[1] || ''),
          v2: _num(c[2] || ''),
          s1: c[1] || '',
          s2: c[2] || '',
        };
      })
      .filter((r) => !isNaN(r.v1) && !isNaN(r.v2));
    if (rows.length === 0) return '';
    const all = rows.flatMap((r) => [r.v1, r.v2]);
    let yMin = Math.min(...all),
      yMax = Math.max(...all);
    if (yMin === yMax) {
      yMin -= 1;
      yMax += 1;
    }
    const padY = (yMax - yMin) * 0.07;
    yMin -= padY;
    yMax += padY;
    const maxLab = Math.max(...rows.map((r) => r.label.length));
    const maxV1 = Math.max(...rows.map((r) => r.s1.length));
    const maxV2 = Math.max(...rows.map((r) => r.s2.length));
    const W = 400,
      H = 210,
      mT = 30,
      mB = 12;
    const mL = Math.min(170, 16 + maxLab * 13 + maxV1 * 7.5);
    const mR = Math.min(90, 14 + maxV2 * 7.5);
    const xL = mL,
      xR = W - mR;
    const sy = (v: number) =>
      mT + (1 - (v - yMin) / (yMax - yMin)) * (H - mT - mB);
    // 端點標籤防重疊：同側相鄰標籤至少隔 13px
    const resolve = (ys: number[]) => {
      const idx = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
      for (let k = 1; k < idx.length; k++)
        if (idx[k].y - idx[k - 1].y < 13) idx[k].y = idx[k - 1].y + 13;
      const out: number[] = [];
      idx.forEach((e) => (out[e.i] = e.y));
      return out;
    };
    const labL = resolve(rows.map((r) => sy(r.v1)));
    const labR = resolve(rows.map((r) => sy(r.v2)));
    const anyHi = rows.some((r) => r.hi);
    let g = '';
    g += `<text class="tw-slope-time" x="${xL}" y="14" text-anchor="middle">${_esc(tL)}</text>`;
    g += `<text class="tw-slope-time" x="${xR}" y="14" text-anchor="middle">${_esc(tR)}</text>`;
    g += `<line class="tw-line-axis" x1="${xL}" y1="${mT}" x2="${xL}" y2="${H - mB}"/>`;
    g += `<line class="tw-line-axis" x1="${xR}" y1="${mT}" x2="${xR}" y2="${H - mB}"/>`;
    rows.forEach((r, ri) => {
      const y1 = sy(r.v1),
        y2 = sy(r.v2);
      const cls = r.hi ? ' tw-slope-row--hi' : '';
      g += `<line class="tw-slope-line${cls}" x1="${xL}" y1="${y1.toFixed(1)}" x2="${xR}" y2="${y2.toFixed(1)}"/>`;
      g += `<circle class="tw-slope-dot${cls}" cx="${xL}" cy="${y1.toFixed(1)}" r="3"/>`;
      g += `<circle class="tw-slope-dot${cls}" cx="${xR}" cy="${y2.toFixed(1)}" r="3"/>`;
      g += `<text class="tw-slope-lab${cls}" x="${xL - 8}" y="${(labL[ri] + 3.5).toFixed(1)}" text-anchor="end">${_esc(r.label)} <tspan class="tw-slope-v">${_esc(r.s1)}</tspan></text>`;
      g += `<text class="tw-slope-lab${cls}" x="${xR + 8}" y="${(labR[ri] + 3.5).toFixed(1)}" text-anchor="start"><tspan class="tw-slope-v">${_esc(r.s2)}</tspan></text>`;
    });
    const aria = modTitle || `${tL} 到 ${tR} 的變化`;
    const svg = `<svg class="tw-slope-plot" viewBox="0 0 ${W} ${H}" role="img" aria-label="${_esc(aria)}" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
    const thead = `<tr><th scope="col"></th><th scope="col">${_esc(tL)}</th><th scope="col">${_esc(tR)}</th></tr>`;
    const tbody = rows
      .map(
        (r) =>
          `<tr><th scope="row">${_esc(r.label)}</th><td>${_esc(r.s1)}</td><td>${_esc(r.s2)}</td></tr>`,
      )
      .join('');
    const table = `<table class="tw-sr-only"><caption>${_esc(aria)}</caption><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
    return `<figure class="tw-slope${anyHi ? ' tw-slope--focus' : ''}">${_title}${svg}${table}</figure>${_src}`;
  }

  if (lang === 'tw-dot') {
    // 點圖（dot strip / range）：rows: `標籤 | 值` 或 `標籤 | 起值 | 迄值 | (註)`。
    // 全部列共用同一個軸（這是它比 bars 適合「分布」的原因）。`*` = 強調列。
    const rows = lines
      .map((l) => {
        const c = l.split('|').map((s) => s.trim());
        const { label, hi } = _emph(c[0] || '');
        const v1 = _num(c[1] || '');
        const v2 = c.length >= 3 && c[2] !== '' ? _num(c[2]) : NaN;
        const note = c[3] || (isNaN(v2) ? c[2] || '' : '');
        return {
          label,
          hi,
          v1,
          v2,
          s1: c[1] || '',
          s2: isNaN(v2) ? '' : c[2],
          note,
        };
      })
      .filter((r) => !isNaN(r.v1));
    if (rows.length === 0) return '';
    const all = rows.flatMap((r) => (isNaN(r.v2) ? [r.v1] : [r.v1, r.v2]));
    const dMin = Math.min(...all),
      dMax = Math.max(...all);
    const span = dMax - dMin || 1;
    const lo = dMin - span * 0.06,
      hi_ = dMax + span * 0.06;
    const pos = (v: number) => (((v - lo) / (hi_ - lo)) * 100).toFixed(1);
    const anyHi = rows.some((r) => r.hi);
    const axis = `<div class="tw-dot-row tw-dot-axis" aria-hidden="true"><div class="tw-dot-label"></div><div class="tw-dot-track tw-dot-track--axis"><span class="tw-dot-axislab" style="left:${pos(dMin)}%">${_esc(_fmt(dMin))}</span><span class="tw-dot-axislab tw-dot-axislab--max" style="left:${pos(dMax)}%">${_esc(_fmt(dMax))}</span></div><div class="tw-dot-val"></div></div>`;
    const body = rows
      .map((r) => {
        const p1 = pos(r.v1);
        const seg = !isNaN(r.v2)
          ? `<span class="tw-dot-seg" style="left:${Math.min(+p1, +pos(r.v2))}%;width:${Math.abs(+pos(r.v2) - +p1)}%"></span><span class="tw-dot-pt tw-dot-pt--end" style="left:${pos(r.v2)}%"></span>`
          : '';
        const valTxt = !isNaN(r.v2)
          ? `${_esc(r.s1)} <span class="tw-dot-arrow">→</span> ${_esc(r.s2)}`
          : _esc(r.s1);
        return `<div class="tw-dot-row${r.hi ? ' tw-dot-row--hi' : ''}"><div class="tw-dot-label">${_esc(r.label)}</div><div class="tw-dot-track">${seg}<span class="tw-dot-pt${isNaN(r.v2) ? '' : ' tw-dot-pt--start'}" style="left:${p1}%"></span></div><div class="tw-dot-val">${valTxt}${r.note ? `<span class="tw-bars-note"> ${_esc(r.note)}</span>` : ''}</div></div>`;
      })
      .join('');
    return `<div class="tw-dot${anyHi ? ' tw-dot--focus' : ''}">${_title}${axis}${body}</div>${_src}`;
  }

  if (lang === 'tw-stack') {
    // 100% 堆疊條：跨列比較「組成」。header: `列名欄 | 類1 | 類2…`；rows: `標籤 | v1 | v2…`
    // 每列自動正規化成 100%，段寬 ≥ 10% 才顯示文字（其餘看圖例 + 資料表）。
    if (lines.length < 2) return '';
    const header = lines[0].split('|').map((s) => s.trim());
    if (header.length < 3) return '';
    const cats = header.slice(1);
    const rows = lines.slice(1).map((l) => {
      const c = l.split('|').map((s) => s.trim());
      return {
        label: c[0] || '',
        vals: cats.map((_, i) => c[i + 1] || ''),
        nums: cats.map((_, i) => Math.max(0, _num(c[i + 1] || '') || 0)),
      };
    });
    const legend = cats
      .map(
        (c, ci) =>
          `<span class="tw-stack-key"><span class="tw-stack-swatch" data-cat="${ci % 5}"></span>${_esc(c)}</span>`,
      )
      .join('');
    const body = rows
      .map((r) => {
        const total = r.nums.reduce((a, b) => a + b, 0) || 1;
        const segs = r.nums
          .map((n, ci) => {
            const pct = (n / total) * 100;
            if (pct <= 0) return '';
            return `<div class="tw-stack-seg" data-cat="${ci % 5}" style="width:${pct.toFixed(1)}%">${pct >= 10 ? `<span>${_esc(r.vals[ci])}</span>` : ''}</div>`;
          })
          .join('');
        return `<div class="tw-stack-row"><div class="tw-stack-label">${_esc(r.label)}</div><div class="tw-stack-bar">${segs}</div></div>`;
      })
      .join('');
    const thead = `<tr><th scope="col">${_esc(header[0])}</th>${cats.map((c) => `<th scope="col">${_esc(c)}</th>`).join('')}</tr>`;
    const tbody = rows
      .map(
        (r) =>
          `<tr><th scope="row">${_esc(r.label)}</th>${r.vals.map((v) => `<td>${_esc(v)}</td>`).join('')}</tr>`,
      )
      .join('');
    const table = `<table class="tw-sr-only"><caption>${_esc(modTitle || header[0])}</caption><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
    return `<div class="tw-stack">${_title}<div class="tw-stack-legend">${legend}</div>${body}${table}</div>${_src}`;
  }

  if (lang === 'tw-pyramid') {
    // 金字塔（背對背長條）：header: `組欄名 | 左名 | 右名`；rows: `組 | 左值 | 右值`
    if (lines.length < 2) return '';
    const header = lines[0].split('|').map((s) => s.trim());
    if (header.length < 3) return '';
    const [, nameL, nameR] = header;
    const rows = lines.slice(1).map((l) => {
      const c = l.split('|').map((s) => s.trim());
      return {
        label: c[0] || '',
        vL: _num(c[1] || '') || 0,
        vR: _num(c[2] || '') || 0,
        sL: c[1] || '',
        sR: c[2] || '',
      };
    });
    const max = Math.max(...rows.flatMap((r) => [r.vL, r.vR]), 0.0001);
    const body = rows
      .map((r) => {
        const wL = ((r.vL / max) * 100).toFixed(1);
        const wR = ((r.vR / max) * 100).toFixed(1);
        return (
          `<div class="tw-pyramid-row">` +
          `<div class="tw-pyramid-side tw-pyramid-side--l"><span class="tw-pyramid-v">${_esc(r.sL)}</span><div class="tw-pyramid-bar" style="width:${wL}%"></div></div>` +
          `<div class="tw-pyramid-mid">${_esc(r.label)}</div>` +
          `<div class="tw-pyramid-side tw-pyramid-side--r"><div class="tw-pyramid-bar" style="width:${wR}%"></div><span class="tw-pyramid-v">${_esc(r.sR)}</span></div>` +
          `</div>`
        );
      })
      .join('');
    const heads = `<div class="tw-pyramid-row tw-pyramid-heads"><div class="tw-pyramid-side tw-pyramid-side--l tw-pyramid-head">${_esc(nameL)}</div><div class="tw-pyramid-mid"></div><div class="tw-pyramid-side tw-pyramid-head">${_esc(nameR)}</div></div>`;
    return `<div class="tw-pyramid" role="group" aria-label="${_esc(modTitle || `${nameL} vs ${nameR}`)}">${_title}${heads}${body}</div>${_src}`;
  }

  if (lang === 'tw-tiles') {
    // 台灣 22 縣市 tile-grid cartogram（視覺主權：佈局寫死在 renderer，不靠 LLM 畫形狀，
    // per REFLEXES #61）。rows: `縣市 | 值 | (註)`。臺/台、市/縣字尾自動正規化；
    // 對不上 60% 以上就退化成 bars（翻譯版縣市名對不上時內容不會消失）。
    const TILE_GRID: (string | null)[][] = [
      ['連江', null, '台北', '基隆', null],
      [null, '桃園', '新北', '宜蘭', null],
      ['金門', '新竹市', '新竹縣', null, null],
      [null, '苗栗', '台中', '花蓮', null],
      [null, '彰化', '南投', null, null],
      ['澎湖', '雲林', '嘉義市', null, null],
      [null, '嘉義縣', '台南', null, null],
      [null, null, '高雄', '屏東', '台東'],
    ];
    const EN_ALIAS: Record<string, string> = {
      taipei: '台北',
      'new taipei': '新北',
      keelung: '基隆',
      taoyuan: '桃園',
      'hsinchu city': '新竹市',
      'hsinchu county': '新竹縣',
      miaoli: '苗栗',
      taichung: '台中',
      changhua: '彰化',
      nantou: '南投',
      yunlin: '雲林',
      'chiayi city': '嘉義市',
      'chiayi county': '嘉義縣',
      tainan: '台南',
      kaohsiung: '高雄',
      pingtung: '屏東',
      yilan: '宜蘭',
      hualien: '花蓮',
      taitung: '台東',
      penghu: '澎湖',
      kinmen: '金門',
      lienchiang: '連江',
      matsu: '連江',
    };
    const normCounty = (raw: string) => {
      const s = raw.replace(/臺/g, '台').trim();
      const en = EN_ALIAS[s.toLowerCase()];
      if (en) return en;
      const stem = s.replace(/[市縣]$/, '');
      return stem === '新竹' || stem === '嘉義' ? s : stem;
    };
    const rows = lines
      .map((l) => {
        const c = l.split('|').map((s) => s.trim());
        return { raw: c[0] || '', val: c[1] || '', num: _num(c[1] || '') };
      })
      .filter((r) => r.raw);
    if (rows.length === 0) return '';
    const byCounty = new Map<string, { val: string; num: number }>();
    const unmatched: string[] = [];
    const gridNames = new Set(TILE_GRID.flat().filter(Boolean) as string[]);
    rows.forEach((r) => {
      const key = normCounty(r.raw);
      if (gridNames.has(key)) byCounty.set(key, { val: r.val, num: r.num });
      else unmatched.push(r.raw);
    });
    if (byCounty.size / rows.length < 0.6) {
      // 縣市名對不上（多半是翻譯版）→ 退化成排序 bars，內容不消失
      const barsLines = [...rows]
        .sort((a, b) => b.num - a.num)
        .map((r) => `${r.raw} | ${r.val}`)
        .join('\n');
      return `<div class="tw-tiles tw-tiles--fallback">${_title}${renderTwModule('tw-bars', barsLines)}</div>${_src}`;
    }
    const nums = [...byCounty.values()]
      .map((e) => e.num)
      .filter((v) => !isNaN(v));
    const tMin = Math.min(...nums),
      tMax = Math.max(...nums);
    const range = tMax - tMin || 1;
    const cells = TILE_GRID.flat()
      .map((name) => {
        if (!name) return `<i class="tw-tiles-gap" aria-hidden="true"></i>`;
        const e = byCounty.get(name);
        if (!e || isNaN(e.num))
          return `<div class="tw-tiles-cell tw-tiles-cell--empty"><span class="tw-tiles-name">${_esc(name)}</span><b class="tw-tiles-val">–</b></div>`;
        const i = (e.num - tMin) / range;
        return `<div class="tw-tiles-cell${i >= 0.55 ? ' tw-hm-hi' : ''}" style="--i:${i.toFixed(2)}"><span class="tw-tiles-name">${_esc(name)}</span><b class="tw-tiles-val">${_esc(e.val)}</b></div>`;
      })
      .join('');
    const scale = `<div class="tw-tiles-scale"><span>${_esc(_fmt(tMin))}</span><i class="tw-tiles-grad" aria-hidden="true"></i><span>${_esc(_fmt(tMax))}</span></div>`;
    const warn = unmatched.length
      ? `<p class="tw-tiles-warn">未對應縣市：${unmatched.map(_esc).join('、')}</p>`
      : '';
    const tbody = [...byCounty.entries()]
      .map(
        ([n, e]) =>
          `<tr><th scope="row">${_esc(n)}</th><td>${_esc(e.val)}</td></tr>`,
      )
      .join('');
    const table = `<table class="tw-sr-only"><caption>${_esc(modTitle || '台灣縣市資料地圖')}</caption><thead><tr><th scope="col">縣市</th><th scope="col">數值</th></tr></thead><tbody>${tbody}</tbody></table>`;
    return `<div class="tw-tiles" role="group" aria-label="${_esc(modTitle || '台灣縣市資料地圖')}">${_title}<div class="tw-tiles-grid">${cells}</div>${scale}${warn}${table}</div>${_src}`;
  }

  if (lang === 'tw-iso') {
    // 單位圖（isotype）：把大數字換成可以數的符號（FT：只用整數，符號不切半）。
    // 選填 config 列：`單位：⬤ = 20000 戶`；rows: `標籤 | 值 | (註)`
    let glyph = '●',
      per = 1,
      unitLabel = '';
    const um = (lines[0] || '').match(
      /^單位\s*[:：]\s*(\S+)?\s*[=＝]\s*([\d,.]+)\s*(.*)$/,
    );
    if (um) {
      if (um[1]) glyph = um[1];
      per = parseFloat(um[2].replace(/,/g, '')) || 1;
      unitLabel = (um[3] || '').trim();
      lines.shift();
    }
    const rows = lines
      .map((l) => {
        const c = l.split('|').map((s) => s.trim());
        return {
          label: c[0] || '',
          val: c[1] || '',
          num: _num(c[1] || ''),
          note: c[2] || '',
        };
      })
      .filter((r) => !isNaN(r.num));
    if (rows.length === 0) return '';
    const body = rows
      .map((r, ri) => {
        const count = Math.max(0, Math.min(60, Math.round(r.num / per)));
        const units = Array.from(
          { length: count },
          () =>
            `<span class="tw-iso-unit" data-cat="${ri % 5}">${_esc(glyph)}</span>`,
        ).join('');
        return `<div class="tw-iso-row"><div class="tw-iso-label">${_esc(r.label)}</div><div class="tw-iso-units" aria-hidden="true">${units}</div><div class="tw-iso-val">${_esc(r.val)}${r.note ? `<span class="tw-bars-note"> ${_esc(r.note)}</span>` : ''}</div></div>`;
      })
      .join('');
    const key = `<p class="tw-iso-key">${_esc(glyph)} ≈ ${_esc(_fmt(per))}${unitLabel ? ` ${_esc(unitLabel)}` : ''}</p>`;
    return `<div class="tw-iso">${_title}${body}${key}</div>${_src}`;
  }

  if (lang === 'tw-note') {
    // 方法論盒／更正註記（報導者【說明】/(註) 公約；error boundary = traceability）。
    // line1 可為 `說明` / `方法` / `註` / `更正` / `更新` 之一；其餘列各自成段。
    let kind = '說明';
    if (lines[0] && /^(說明|方法|註|更正|更新)$/.test(lines[0])) {
      kind = lines.shift() as string;
    }
    if (lines.length === 0) return '';
    const warn = kind === '註' || kind === '更正';
    const bodyHtml = lines.map((l) => `<p>${_esc(l)}</p>`).join('');
    return `<aside class="tw-note${warn ? ' tw-note--warn' : ''}"><span class="tw-note-chip">【${_esc(kind)}】</span><div class="tw-note-body">${bodyHtml}</div></aside>${_src}`;
  }

  return '';
}

renderer.code = ({ text, lang }) => {
  if (lang && lang.startsWith('tw-')) {
    const html = renderTwModule(lang, text);
    if (html) return html;
  }
  const langClass = lang ? ` class="language-${lang}"` : '';
  return `<pre><code${langClass}>${_esc(text)}</code></pre>`;
};

// ── Footnote preprocessor (GFM-compatible [^n] syntax) ──────────────────────
function processFootnotes(md: string): string {
  // Collect footnote definitions: [^label]: content (may span rest of line)
  const definitions: Record<string, string> = {};
  const defRegex = /^\[\^([^\]]+)\]:\s*(.+?)(?=\n\[\^|\n\n|\n#|\n---|\s*$)/gms;
  let m: RegExpExecArray | null;
  while ((m = defRegex.exec(md)) !== null) {
    definitions[m[1]] = m[2].trim();
  }
  if (Object.keys(definitions).length === 0) return md;

  // Order of first use in the text
  const order: string[] = [];
  let body = md.replace(defRegex, ''); // remove definitions from body

  // Replace inline refs [^label] → superscript HTML
  body = body.replace(/\[(\^[^\]]+)\](?!:)/g, (_, raw) => {
    const label = raw.slice(1); // strip leading ^
    if (!definitions[label]) return `[${raw}]`;
    if (!order.includes(label)) order.push(label);
    const num = order.indexOf(label) + 1;
    const id = `fn-${label}`;
    const refId = `fnref-${label}`;
    return `<sup id="${refId}"><a href="#${id}" class="footnote-ref" aria-label="脚注 ${num}">${num}</a></sup>`;
  });

  // Build footnotes section
  if (order.length > 0) {
    const items = order.map((label, i) => {
      const num = i + 1;
      const id = `fn-${label}`;
      const refId = `fnref-${label}`;
      // Process links inside footnote text via marked inline parser
      const defHtml = marked.parseInline(definitions[label]) as string;
      return `<li id="${id}">${defHtml}<a href="#${refId}" class="footnote-backref" aria-label="返回引用 ${num}">↩</a></li>`;
    });
    body =
      body.trimEnd() +
      `\n\n<section class="footnotes" aria-label="腳注"><ol>${items.join('')}</ol></section>`;
  }

  return body;
}

// ── Title-dedup → wikilink → footnote → marked → 延伸閱讀 split ─────────────
// 1:1 對應 template 原 frontmatter 行為：strip 開頭重複 H1、跑 marked、
// 找 延伸閱讀 split 點（SSODT sections 插入位置）。splitIndex === -1 表示沒找到。
export interface RenderedArticle {
  fullHtml: string;
  splitIndex: number;
}

export function renderArticleHtml(
  title: string,
  content: string,
): RenderedArticle {
  // Strip a leading `# Title` heading when it duplicates the frontmatter title
  // — ArticleHero already renders the title as the H1 of the page, and ~40%
  // of zh-TW articles still include `# {Title}` as the first body line. The
  // duplicate visually competes with the hero title. Operate on raw markdown
  // (before footnote / wikilink processing) so the regex only sees `# Title`,
  // not an HTML element with id attributes injected by marked.
  const _titleEsc = String(title).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const bodyMarkdown = content.replace(
    new RegExp(`^\\s*#\\s+${_titleEsc}\\s*\\n+`),
    '',
  );

  const fullHtml = marked.parse(
    processFootnotes(resolveWikilinks(bodyMarkdown)),
    {
      renderer,
      breaks: true,
    },
  ) as string;

  // Split content before 延伸閱讀/Further Reading to insert SSODT sections
  // 2026-05-03 fix: bold paragraph format `**延伸閱讀**：` was silently broken
  // — splitIndex stayed -1 → SSODT sections (SporeFootprint / Perspectives /
  // DiaryTeaser) didn't render despite hasSSoDT=true. Per format-check both
  // `## 延伸閱讀` (h2) and `**延伸閱讀**` (bold p) are canonical accepted formats
  // — template MUST also accept both. 121 articles use bold format vs 95 h2.
  const splitMarkers = [
    '<h2>延伸閱讀</h2>',
    '<h2>Further Reading</h2>',
    '<h2>延伸閱讀<',
    '<p><strong>延伸閱讀</strong>',
    '<p><strong>Further Reading</strong>',
  ];
  let splitIndex = -1;
  for (const marker of splitMarkers) {
    const idx = fullHtml.indexOf(marker);
    if (idx !== -1) {
      splitIndex = idx;
      break;
    }
  }
  // Also try id-based h2 (marked adds ids)
  if (splitIndex === -1) {
    const idMatch = fullHtml.match(/<h2[^>]*id="[^"]*"[^>]*>延伸閱讀/);
    if (idMatch && idMatch.index !== undefined) splitIndex = idMatch.index;
  }
  // Final fallback: any <p><strong> containing 延伸閱讀 (handles whitespace variants)
  if (splitIndex === -1) {
    const pMatch = fullHtml.match(/<p>\s*<strong>\s*延伸閱讀/);
    if (pMatch && pMatch.index !== undefined) splitIndex = pMatch.index;
  }

  return { fullHtml, splitIndex };
}
