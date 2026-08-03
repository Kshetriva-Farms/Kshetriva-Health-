export interface OrganicRecipe {
  id: string;
  title: string;
  subtitle: string;
  category: 'Soups & Broths' | 'Salads & Bowls' | 'Sauté & Curries' | 'Smoothies & Juices';
  primaryHarvestProduce: string[];
  prepTimeMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Chef Level';
  caloriesPerServing: number;
  macros: {
    protein: number;
    carbs: number;
    fiber: number;
    fat: number;
  };
  healthTarget: 'Gut Microbiome' | 'Anti-Inflammation' | 'Heart Health' | 'Metabolic Energy';
  bioactiveCompounds: string[];
  ingredients: { name: string; quantity: string; isFromFarmBasket: boolean }[];
  instructions: string[];
  chefTip: string;
  imageBgColor: string;
  icon: string;
}

export const CURATED_FARM_RECIPES: OrganicRecipe[] = [
  {
    id: 'rec-1',
    title: 'Vedic Palak & Garlic Antioxidant Soup',
    subtitle: 'Bioactive chlorophyll & iron restoration bowl',
    category: 'Soups & Broths',
    primaryHarvestProduce: ['Organic Spinach (Palak)', 'A2 Vedic Desi Tomatoes'],
    prepTimeMinutes: 15,
    difficulty: 'Easy',
    caloriesPerServing: 180,
    macros: { protein: 6, carbs: 16, fiber: 5, fat: 9 },
    healthTarget: 'Anti-Inflammation',
    bioactiveCompounds: ['Chlorophyll', 'Lycopene', 'Allicin'],
    ingredients: [
      { name: 'Fresh Kshetriva Organic Palak', quantity: '200g', isFromFarmBasket: true },
      { name: 'A2 Vedic Tomatoes', quantity: '2 medium', isFromFarmBasket: true },
      { name: 'Crushed Organic Garlic Cloves', quantity: '4 cloves', isFromFarmBasket: true },
      { name: 'Cold-Pressed Mustard Oil / A2 Ghee', quantity: '1 tbsp', isFromFarmBasket: false },
      { name: 'Toasted Cumin & Black Pepper', quantity: '1 tsp', isFromFarmBasket: false },
    ],
    instructions: [
      'Blanch fresh organic spinach leaves in boiling water for 90 seconds to preserve vibrant chlorophyll.',
      'Sauté crushed garlic and cumin in cold-pressed mustard oil until fragrant.',
      'Puree spinach and tomatoes together, simmer gently with sautéed spices for 5 minutes.',
      'Finish with fresh lemon juice and crushed pepper for maximum iron bioavailability.'
    ],
    chefTip: 'Do not overcook spinach; brief blanching preserves heat-sensitive Vitamin C and active digestive enzymes.',
    imageBgColor: 'from-emerald-600/20 to-teal-900/30',
    icon: '🍲',
  },
  {
    id: 'rec-2',
    title: 'Desi Carrot & Ginger Beta-Carotene Glow Bowl',
    subtitle: 'Lipid-activated vision & skin microbiome support',
    category: 'Salads & Bowls',
    primaryHarvestProduce: ['Desi Red Carrots (Gajar)'],
    prepTimeMinutes: 20,
    difficulty: 'Easy',
    caloriesPerServing: 240,
    macros: { protein: 4, carbs: 28, fiber: 7, fat: 12 },
    healthTarget: 'Gut Microbiome',
    bioactiveCompounds: ['Beta-Carotene', 'Gingerol', 'Pectin Fiber'],
    ingredients: [
      { name: 'Grated Desi Red Carrots', quantity: '250g', isFromFarmBasket: true },
      { name: 'Fresh Ginger Root', quantity: '1 tbsp finely julienned', isFromFarmBasket: true },
      { name: 'Toasted Pumpkin & Sesame Seeds', quantity: '2 tbsp', isFromFarmBasket: false },
      { name: 'Extra Virgin Cold-Pressed Olive Oil', quantity: '1.5 tbsp', isFromFarmBasket: false },
      { name: 'Raw Organic Honey / Jaggery', quantity: '1 tsp', isFromFarmBasket: false },
    ],
    instructions: [
      'Grate fresh farm carrots and toss with julienned ginger.',
      'Whisk extra virgin oil with raw honey and sea salt to create an emulsified dressing.',
      'Toss carrots in dressing and let rest for 10 minutes to allow natural carotene extraction into healthy lipids.',
      'Garnish generously with toasted pumpkin and sesame seeds for zinc and magnesium.'
    ],
    chefTip: 'Pairing carrots with healthy fats increases beta-carotene absorption efficiency by up to 600%.',
    imageBgColor: 'from-amber-500/20 to-orange-900/30',
    icon: '🥕',
  },
  {
    id: 'rec-3',
    title: 'Sulforaphane Steamed Broccoli & Roasted Seeds',
    subtitle: 'Clinical cellular detoxification & liver shield',
    category: 'Sauté & Curries',
    primaryHarvestProduce: ['Fresh Farm Broccoli'],
    prepTimeMinutes: 18,
    difficulty: 'Medium',
    caloriesPerServing: 210,
    macros: { protein: 9, carbs: 18, fiber: 6, fat: 11 },
    healthTarget: 'Anti-Inflammation',
    bioactiveCompounds: ['Sulforaphane', 'Glucoraphanin', 'Vitamin K1'],
    ingredients: [
      { name: 'Kshetriva Broccoli Florets & Stems', quantity: '300g', isFromFarmBasket: true },
      { name: 'Mustard Seed Powder', quantity: '1/2 tsp', isFromFarmBasket: false },
      { name: 'Cold-Pressed Sesame Oil', quantity: '1 tbsp', isFromFarmBasket: false },
      { name: 'Coarse Sea Salt & Chili Flakes', quantity: 'To taste', isFromFarmBasket: false },
    ],
    instructions: [
      'Chop broccoli florets and let rest on cutting board for 10 minutes (activates myrosinase enzyme).',
      'Lightly steam for 4 minutes until vibrant green and tender-crisp.',
      'Drizzle with cold-pressed sesame oil and sprinkle with mustard seed powder to amplify sulforaphane formation.'
    ],
    chefTip: 'Adding mustard seed powder post-steam replaces any heat-degraded myrosinase, unlocking 100% sulforaphane potency.',
    imageBgColor: 'from-emerald-700/20 to-green-950/30',
    icon: '🥦',
  },
  {
    id: 'rec-4',
    title: 'Lycopene Rich Blistered Tomato & Basil Elixir',
    subtitle: 'Vascular rejuvenation & cardiac longevity tonic',
    category: 'Smoothies & Juices',
    primaryHarvestProduce: ['A2 Vedic Desi Tomatoes'],
    prepTimeMinutes: 12,
    difficulty: 'Easy',
    caloriesPerServing: 130,
    macros: { protein: 3, carbs: 14, fiber: 4, fat: 7 },
    healthTarget: 'Heart Health',
    bioactiveCompounds: ['Lycopene', 'Rosmarinic Acid', 'Potassium'],
    ingredients: [
      { name: 'A2 Vedic Desi Tomatoes', quantity: '4 large ripe', isFromFarmBasket: true },
      { name: 'Fresh Farm Holy Basil (Tulsi)', quantity: '10 leaves', isFromFarmBasket: true },
      { name: 'Extra Virgin Cold-Pressed Oil', quantity: '1 tsp', isFromFarmBasket: false },
      { name: 'Rock Salt & Crushed Pepper', quantity: 'To taste', isFromFarmBasket: false },
    ],
    instructions: [
      'Score tomato skins and gently blister in a hot pan with 1 tsp oil for 5 minutes.',
      'Blend warmed tomatoes with fresh tulsi leaves and rock salt into a silky elixir.',
      'Sip warm or chilled for a refreshing cardiovascular boost.'
    ],
    chefTip: 'Heat breaks down tomato cell walls, transforming trans-lycopene into highly bioavailable cis-lycopene.',
    imageBgColor: 'from-rose-600/20 to-red-950/30',
    icon: '🍅',
  }
];
