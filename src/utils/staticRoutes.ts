/**
 * staticRoutes.ts — per-lang existence of static-page routes (filesystem-derived SSOT).
 *
 * 2026-06-10 deploy-heal: both structural sources of the 6.67% broken-link rate
 * came from "assuming a route exists in every language" — the language switcher
 * produced dead links for zh-only pages (/semiont/diary/* ×650, /companies,
 * /lifetree…), and nav produced /es/bench for es/fr. A hand-maintained list
 * goes stale whenever a new language or page is born, so instead we derive from
 * the src/pages tree: a page file existing ⟺ the route existing. This is the
 * architecture-as-data principle: derive perception from the filesystem rather
 * than from a list someone has to remember to update.
 *
 * Scope: static pages only (.astro files under src/pages). Article routes
 * (content-collection dynamic pages) are handled by getLangSwitchPath's
 * _translations.json registry.
 */
import { readdirSync } from 'fs';
import { resolve, join } from 'path';
import type { Lang } from '../config/languages';
import { LANGUAGES } from '../config/languages';

const NON_DEFAULT_LANGS = LANGUAGES.filter(
  (l) => l.enabled && !l.isDefault,
).map((l) => l.code) as readonly Lang[];

interface PageNode {
  /** Subdirectories / nested routes */
  children: Map<string, PageNode>;
  /** Page filenames at this level (.astro/.ts, extension stripped), incl. [param] / [...rest] */
  pages: Set<string>;
  /** Dynamic segment names at this level ([slug] etc., excluding [...rest]) */
  dynamicNames: Set<string>;
  /** Whether this level has a rest segment ([...slug].astro) — consumes all remaining levels */
  hasRest: boolean;
}

// The SSOT for category slugs is the knowledge/ directory names (lowercased = URL slug).
// [category].astro's dynamic match should only admit this set — otherwise a
// "static page the language doesn't have" like /ja/semiont gets misread as a
// possible category page (hit for real in the 2026-06-10 deploy-heal).
let _categorySlugs: Set<string> | null = null;
function getCategorySlugs(): Set<string> {
  if (_categorySlugs) return _categorySlugs;
  const set = new Set<string>();
  try {
    for (const e of readdirSync(resolve(process.cwd(), 'knowledge'), {
      withFileTypes: true,
    })) {
      if (e.isDirectory() && /^[A-Z]/.test(e.name))
        set.add(e.name.toLowerCase());
    }
  } catch {}
  _categorySlugs = set;
  return set;
}

/** Whether this segment can be consumed by a dynamic page at this level. [category] only consumes real category slugs. */
function dynamicAccepts(node: PageNode, seg: string): boolean {
  for (const dn of node.dynamicNames) {
    if (dn === '[category]') {
      if (getCategorySlugs().has(seg)) return true;
    } else {
      return true;
    }
  }
  return false;
}

function buildTree(dir: string): PageNode {
  const node: PageNode = {
    children: new Map(),
    pages: new Set(),
    dynamicNames: new Set(),
    hasRest: false,
  };
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return node;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      const child = buildTree(join(dir, e.name));
      node.children.set(e.name, child);
      if (e.name.startsWith('[...')) node.hasRest = true;
      else if (e.name.startsWith('[')) node.dynamicNames.add(e.name);
    } else if (/\.(astro|ts)$/.test(e.name) && !e.name.startsWith('_')) {
      const base = e.name.replace(/\.(astro|ts)$/, '');
      node.pages.add(base);
      if (base.startsWith('[...')) node.hasRest = true;
      else if (base.startsWith('[')) node.dynamicNames.add(base);
    }
  }
  return node;
}

// Module-level cache: walk the src/pages tree once per build process.
let _root: PageNode | null = null;
function getRoot(): PageNode {
  if (!_root) _root = buildTree(resolve(process.cwd(), 'src/pages'));
  return _root;
}

/**
 * Whether this static route has a corresponding page file under the given language.
 * basePath excludes the language prefix (e.g. '/semiont/diary/2026-04-04', '/bench', '/').
 * Dynamic segments ([slug]) are treated as matchable (conservatively admitted —
 * slug validity for dynamic pages like hub/[category] is decided by their own
 * getStaticPaths, not this util's responsibility).
 */
export function staticPageExists(
  lang: Lang | 'zh-TW',
  basePath: string,
): boolean {
  let node = getRoot();
  if (lang !== 'zh-TW') {
    const langChild = node.children.get(lang);
    if (!langChild) return false;
    node = langChild;
  }
  const segments = basePath.split('/').filter(Boolean);
  if (segments.length === 0) return node.pages.has('index');

  for (let i = 0; i < segments.length; i++) {
    const seg = decodeURIComponent(segments[i]);
    const isLast = i === segments.length - 1;
    if (node.hasRest) return true;
    if (isLast) {
      if (node.pages.has(seg)) return true;
      const dir = node.children.get(seg);
      if (dir && (dir.pages.has('index') || dir.hasRest)) return true;
      return dynamicAccepts(node, seg);
    }
    const child = node.children.get(seg);
    if (child) {
      node = child;
      continue;
    }
    // Dynamic directory ([param]/...): only admit remaining levels if seg is accepted by a dynamic page
    return dynamicAccepts(node, seg);
  }
  return false;
}

/**
 * lang-aware href for nav / dropdown: if the language version exists → prefix with
 * the language; if not → fall back to the zh path (the reader at least reaches
 * content instead of a 404).
 */
export function resolveStaticHref(
  lang: Lang | 'zh-TW',
  basePath: string,
): string {
  if (lang === 'en') return basePath;
  if (staticPageExists(lang, basePath)) {
    return basePath === '/' ? `/${lang}` : `/${lang}${basePath}`;
  }
  return basePath;
}

export { NON_DEFAULT_LANGS };
