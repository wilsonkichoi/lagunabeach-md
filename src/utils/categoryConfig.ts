import { useTranslations } from '../i18n/utils';

export const getCategoryConfigs = (t: ReturnType<typeof useTranslations>) => ({
  history: {
    name: 'History',
    description:
      'Founding, indigenous peoples, artists colony, historical events',
    icon: '📜',
    color: '#92400e',
    colorLight: '#f59e0b20',
    gradient: 'linear-gradient(135deg, #92400e, #d97706)',
    cover: '',
  },
  'art-galleries': {
    name: 'Art & Galleries',
    description: 'Plein air painting, galleries, public art, art festivals',
    icon: '🎨',
    color: '#be185d',
    colorLight: '#be185d20',
    gradient: 'linear-gradient(135deg, #be185d, #ec4899)',
    cover: '',
  },
  'nature-marine-life': {
    name: 'Nature & Marine Life',
    description:
      'Tide pools, coastal ecology, marine protected areas, wildlife',
    icon: '🌊',
    color: '#0e7490',
    colorLight: '#0e749020',
    gradient: 'linear-gradient(135deg, #0e7490, #06b6d4)',
    cover: '',
  },
  food: {
    name: 'Food',
    description: 'Restaurants, cafes, food history, local specialties',
    icon: '🍽️',
    color: '#ea580c',
    colorLight: '#ea580c20',
    gradient: 'linear-gradient(135deg, #ea580c, #f97316)',
    cover: '',
  },
  beaches: {
    name: 'Beaches',
    description: 'Individual beaches, access, conditions, surfing',
    icon: '🏖️',
    color: '#0284c7',
    colorLight: '#0284c720',
    gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    cover: '',
  },
  trails: {
    name: 'Trails',
    description: 'Hiking, coastal walks, trail conditions, views',
    icon: '🥾',
    color: '#15803d',
    colorLight: '#15803d20',
    gradient: 'linear-gradient(135deg, #15803d, #22c55e)',
    cover: '',
  },
  'events-festivals': {
    name: 'Events & Festivals',
    description:
      'Pageant of the Masters, Sawdust Art Festival, seasonal events',
    icon: '🎭',
    color: '#7c3aed',
    colorLight: '#7c3aed20',
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    cover: '',
  },
  neighborhoods: {
    name: 'Neighborhoods',
    description: 'Top of the World, Village, South Laguna, Canyon areas',
    icon: '🏘️',
    color: '#b45309',
    colorLight: '#b4530920',
    gradient: 'linear-gradient(135deg, #b45309, #f59e0b)',
    cover: '',
  },
});

const __plainCategoryConfig = getCategoryConfigs((key) => key as any);

export const categoryList = Object.keys(__plainCategoryConfig) as CategoryKey[];
export type CategoryKey = keyof typeof __plainCategoryConfig;
