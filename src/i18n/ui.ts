/**
 * ui.ts — generic interface strings (English).
 *
 * Trimmed en-only port of the fork's i18n bundle (task 1.1a). Holds ONLY
 * place-agnostic UI labels — nav chrome, footer section headers, search
 * affordances. Place strings (site name, category titles) never live here;
 * they flow from `place.config.ts`. This keeps the genericity gate green while
 * preserving the fork's `t()` call sites.
 */

export const defaultLang = 'en';
export const showDefaultLang = false;

export const ui = {
  en: {
    // header nav
    'nav.explore': 'Explore',
    'nav.latest': 'Latest',
    'nav.graph': 'Knowledge Graph',
    'nav.about': 'About',
    'nav.contribute': 'Contribute',
    'nav.changelog': 'Changelog',
    'nav.dashboard': 'Dashboard',
    // header aria + search
    'nav.aria-home': 'Home',
    'nav.aria-main-navigation': 'Main navigation',
    'nav.aria-mobile-navigation': 'Mobile navigation',
    'nav.aria-search': 'Search',
    'nav.aria-toggle-menu': 'Toggle menu',
    'nav.search-placeholder': 'Search articles',
    'nav.search-type-to-search': 'Type to search across all articles',
    // footer
    'footer.explore': 'Explore',
    'footer.project': 'Project',
    'footer.contact': 'Contact',
    'footer.about': 'About',
    'footer.graph': 'Knowledge Graph',
    'footer.dashboard': 'Dashboard',
    'footer.contribute': 'Contribute',
    'footer.changelog': 'Changelog',
    'footer.report': 'Report an issue',
    'footer.discuss': 'Discussions',
    'footer.rss': 'RSS',
    'footer.builtWith': 'Built with Astro — open source, AI-friendly.',
    'footer.support': 'Support',
    'footer.support.cta': 'Star on GitHub',
  },
} as const;
