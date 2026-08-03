import { ProduceItem } from '@/types';

export const APP_NAME = "Kshetriva Health+";
export const APP_TAGLINE = "Empowering Farm-to-Table Vitality";

export const SAMPLE_FARM_PRODUCE: ProduceItem[] = [
  {
    id: 'p1',
    name: 'Organic Spinach (Palak)',
    category: 'Leafy Greens',
    icon: '🥬',
    healthBenefits: ['Rich in Iron & Folate', 'Improves Cellular Regeneration', 'Supports Heart Health'],
    caloriesPer100g: 23,
    macros: { protein: 2.9, carbs: 3.6, fiber: 2.2, fat: 0.4 },
    keyVitamins: ['Vitamin A', 'Vitamin C', 'Vitamin K', 'Iron']
  },
  {
    id: 'p2',
    name: 'Desi Red Carrots (Gajar)',
    category: 'Root Vegetables',
    icon: '🥕',
    healthBenefits: ['High Beta-Carotene', 'Boosts Vision & Skin Radiance', 'Gut Microbiome Support'],
    caloriesPer100g: 41,
    macros: { protein: 0.9, carbs: 9.6, fiber: 2.8, fat: 0.2 },
    keyVitamins: ['Vitamin A', 'Biotin', 'Potassium']
  },
  {
    id: 'p3',
    name: 'Fresh Farm Broccoli',
    category: 'Cruciferous',
    icon: '🥦',
    healthBenefits: ['Sulforaphane Rich', 'Potent Detoxification Support', 'Immune Boosting'],
    caloriesPer100g: 34,
    macros: { protein: 2.8, carbs: 6.6, fiber: 2.6, fat: 0.4 },
    keyVitamins: ['Vitamin C', 'Vitamin K', 'Folate']
  },
  {
    id: 'p4',
    name: 'A2 Vedic Desi Tomatoes',
    category: 'Seasonal Fruits',
    icon: '🍅',
    healthBenefits: ['High Lycopene Content', 'Fights Oxidative Stress', 'Cardiovascular Shield'],
    caloriesPer100g: 18,
    macros: { protein: 0.9, carbs: 3.9, fiber: 1.2, fat: 0.2 },
    keyVitamins: ['Lycopene', 'Vitamin C', 'Potassium']
  }
];

export const NAV_LINKS = [
  { label: 'Home', href: '/', icon: 'Home' },
  { label: 'AI Health Advisor', href: '#ai-advisor', icon: 'Sparkles' },
  { label: 'My Basket Health', href: '#basket-health', icon: 'ShoppingBag' },
  { label: 'Vitals Tracker', href: '#vitals', icon: 'Activity' },
  { label: 'Recipes', href: '#recipes', icon: 'Utensils' },
];
