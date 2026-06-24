export interface ResourceSite {
  nameKey: string; // i18n key, e.g. 'resources.site.cityHall'
  url: string;
  domain: string;
  descKey?: string; // optional description i18n key (featured sites only)
  featured?: boolean; // Top 3 featured per chapter
}

export interface HeroCategory {
  id: string;
  labelKey: string;
  color: string;
  sites: ResourceSite[];
}

// ─── Chapter 1: City & Civic ───
export const civicGov: ResourceSite[] = [
  {
    nameKey: 'resources.site.cityHall',
    url: 'https://www.lagunabeachcity.net/',
    domain: 'lagunabeachcity.net',
    featured: true,
    descKey: 'resources.featured.cityHall',
  },
  {
    nameKey: 'resources.site.lbusd',
    url: 'https://www.lbusd.org/',
    domain: 'lbusd.org',
  },
  {
    nameKey: 'resources.site.chamber',
    url: 'https://www.lagunabeachchamber.org/',
    domain: 'lagunabeachchamber.org',
  },
  {
    nameKey: 'resources.site.octa',
    url: 'https://www.octa.net/',
    domain: 'octa.net',
    featured: true,
    descKey: 'resources.featured.octa',
  },
  {
    nameKey: 'resources.site.visitLb',
    url: 'https://www.visitlagunabeach.com/',
    domain: 'visitlagunabeach.com',
    featured: true,
    descKey: 'resources.featured.visitLb',
  },
];

// ─── Chapter 2: History, Arts & Culture ───
export const historyArts: ResourceSite[] = [
  {
    nameKey: 'resources.site.historicalSociety',
    url: 'https://lagunabeachhistory.org/',
    domain: 'lagunabeachhistory.org',
    featured: true,
    descKey: 'resources.featured.historicalSociety',
  },
  {
    nameKey: 'resources.site.artMuseum',
    url: 'https://lagunaartmuseum.org/',
    domain: 'lagunaartmuseum.org',
    featured: true,
    descKey: 'resources.featured.artMuseum',
  },
  {
    nameKey: 'resources.site.foapom',
    url: 'https://www.foapom.com/',
    domain: 'foapom.com',
    featured: true,
    descKey: 'resources.featured.foapom',
  },
  {
    nameKey: 'resources.site.sawdust',
    url: 'https://sawdustartfestival.org/',
    domain: 'sawdustartfestival.org',
  },
  {
    nameKey: 'resources.site.artWalk',
    url: 'https://www.firstthursdaysartwalk.org/',
    domain: 'firstthursdaysartwalk.org',
  },
];

// ─── Chapter 3: Nature & Outdoors ───
export const natureOutdoors: ResourceSite[] = [
  {
    nameKey: 'resources.site.ocParks',
    url: 'https://www.ocparks.com/lagunacoast',
    domain: 'ocparks.com',
    featured: true,
    descKey: 'resources.featured.ocParks',
  },
  {
    nameKey: 'resources.site.crystalCove',
    url: 'https://www.parks.ca.gov/?page_id=644',
    domain: 'parks.ca.gov',
    featured: true,
    descKey: 'resources.featured.crystalCove',
  },
  {
    nameKey: 'resources.site.oceanFoundation',
    url: 'https://lagunaoceanfoundation.org/',
    domain: 'lagunaoceanfoundation.org',
  },
  {
    nameKey: 'resources.site.noaaTides',
    url: 'https://tidesandcurrents.noaa.gov/tide_predictions.html',
    domain: 'tidesandcurrents.noaa.gov',
  },
  {
    nameKey: 'resources.site.library',
    url: 'https://www.ocpl.org/libraries/laguna-beach',
    domain: 'ocpl.org',
  },
];

// ─── Chapter 4: Community & Media ───
export const communityMedia: ResourceSite[] = [
  {
    nameKey: 'resources.site.indy',
    url: 'https://lagunabeachindy.com/',
    domain: 'lagunabeachindy.com',
    featured: true,
    descKey: 'resources.featured.indy',
  },
  {
    nameKey: 'resources.site.stuNews',
    url: 'https://stunewslaguna.com/',
    domain: 'stunewslaguna.com',
    featured: true,
    descKey: 'resources.featured.stuNews',
  },
];

// ─── Hero Mindmap Data ───
export const heroCategories: HeroCategory[] = [
  {
    id: 'civic',
    labelKey: 'resources.category.civic.label',
    color: '#065f46',
    sites: civicGov,
  },
  {
    id: 'history',
    labelKey: 'resources.category.history.label',
    color: '#059669',
    sites: historyArts,
  },
  {
    id: 'nature',
    labelKey: 'resources.category.nature.label',
    color: '#10b981',
    sites: natureOutdoors,
  },
  {
    id: 'community',
    labelKey: 'resources.category.community.label',
    color: '#047857',
    sites: communityMedia,
  },
];

// ─── LagunaBeach.md Links (footer) ───
export const projectLinks: ResourceSite[] = [
  {
    nameKey: 'resources.site.github',
    url: 'https://github.com/wilsonkichoi/lagunabeach-md',
    domain: 'github.com',
  },
  {
    nameKey: 'resources.site.contribute',
    url: '/contribute',
    domain: 'lagunabeach.md',
  },
  {
    nameKey: 'resources.site.rss',
    url: '/rss.xml',
    domain: 'lagunabeach.md',
  },
];
