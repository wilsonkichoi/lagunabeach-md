import { useTranslations } from '../i18n/utils';

export type CategoryItem = {
  name: string;
  url: string;
  desc: string;
};

export type Category = {
  icon: string;
  title: string;
  description: string;
  items: CategoryItem[];
};

// Open data sources for Laguna Beach: city, county (Orange County),
// state (California), and federal portals, plus local civic, coastal,
// and arts/nature organizations. URLs live here; display strings are in
// src/i18n/data.ts under data.category.*.
export const getCategories = (
  t: ReturnType<typeof useTranslations>,
): Category[] => [
  {
    icon: '🏛️',
    title: t('data.category.1.title'),
    description: t('data.category.1.description'),
    items: [
      {
        name: t('data.category.1.item.1.name'),
        url: 'https://www.lagunabeachcity.net/',
        desc: t('data.category.1.item.1.desc'),
      },
      {
        name: t('data.category.1.item.2.name'),
        url: 'https://data-ocgov.opendata.arcgis.com/',
        desc: t('data.category.1.item.2.desc'),
      },
      {
        name: t('data.category.1.item.3.name'),
        url: 'https://data.ca.gov/',
        desc: t('data.category.1.item.3.desc'),
      },
      {
        name: t('data.category.1.item.4.name'),
        url: 'https://data.census.gov/',
        desc: t('data.category.1.item.4.desc'),
      },
      {
        name: t('data.category.1.item.5.name'),
        url: 'https://www.data.gov/',
        desc: t('data.category.1.item.5.desc'),
      },
    ],
  },
  {
    icon: '🌊',
    title: t('data.category.2.title'),
    description: t('data.category.2.description'),
    items: [
      {
        name: t('data.category.2.item.1.name'),
        url: 'https://tidesandcurrents.noaa.gov/',
        desc: t('data.category.2.item.1.desc'),
      },
      {
        name: t('data.category.2.item.2.name'),
        url: 'https://www.coastal.ca.gov/',
        desc: t('data.category.2.item.2.desc'),
      },
      {
        name: t('data.category.2.item.3.name'),
        url: 'https://wildlife.ca.gov/Conservation/Marine/MPAs/Laguna-Beach',
        desc: t('data.category.2.item.3.desc'),
      },
      {
        name: t('data.category.2.item.4.name'),
        url: 'https://www.airnow.gov/',
        desc: t('data.category.2.item.4.desc'),
      },
      {
        name: t('data.category.2.item.5.name'),
        url: 'https://www.usgs.gov/',
        desc: t('data.category.2.item.5.desc'),
      },
    ],
  },
  {
    icon: '🗺️',
    title: t('data.category.3.title'),
    description: t('data.category.3.description'),
    items: [
      {
        name: t('data.category.3.item.1.name'),
        url: 'https://ocgis.com/',
        desc: t('data.category.3.item.1.desc'),
      },
      {
        name: t('data.category.3.item.2.name'),
        url: 'https://gis.data.ca.gov/',
        desc: t('data.category.3.item.2.desc'),
      },
      {
        name: t('data.category.3.item.3.name'),
        url: 'https://apps.nationalmap.gov/',
        desc: t('data.category.3.item.3.desc'),
      },
      {
        name: t('data.category.3.item.4.name'),
        url: 'https://www.openstreetmap.org/',
        desc: t('data.category.3.item.4.desc'),
      },
    ],
  },
  {
    icon: '📰',
    title: t('data.category.4.title'),
    description: t('data.category.4.description'),
    items: [
      {
        name: t('data.category.4.item.1.name'),
        url: 'https://www.lagunabeachindy.com/',
        desc: t('data.category.4.item.1.desc'),
      },
      {
        name: t('data.category.4.item.2.name'),
        url: 'https://voiceofoc.org/',
        desc: t('data.category.4.item.2.desc'),
      },
      {
        name: t('data.category.4.item.3.name'),
        url: 'https://www.lagunabeachcity.net/government',
        desc: t('data.category.4.item.3.desc'),
      },
    ],
  },
  {
    icon: '🎨',
    title: t('data.category.5.title'),
    description: t('data.category.5.description'),
    items: [
      {
        name: t('data.category.5.item.1.name'),
        url: 'https://lagunaartmuseum.org/',
        desc: t('data.category.5.item.1.desc'),
      },
      {
        name: t('data.category.5.item.2.name'),
        url: 'https://lagunaoceanfoundation.org/',
        desc: t('data.category.5.item.2.desc'),
      },
      {
        name: t('data.category.5.item.3.name'),
        url: 'https://lagunacanyon.org/',
        desc: t('data.category.5.item.3.desc'),
      },
      {
        name: t('data.category.5.item.4.name'),
        url: 'https://www.inaturalist.org/',
        desc: t('data.category.5.item.4.desc'),
      },
    ],
  },
];
