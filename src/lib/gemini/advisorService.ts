import { GeminiMealRecommendation, ProduceItem } from '@/types';

export interface AIAdvisorRequest {
  selectedProduce: ProduceItem[];
  healthGoal: string;
  dietaryPreference?: string;
  prepTimeMaxMinutes?: number;
}

export async function generateStructuredMealPlans(
  request: AIAdvisorRequest
): Promise<GeminiMealRecommendation[]> {
  const { selectedProduce, healthGoal } = request;
  const p1Name = selectedProduce[0]?.name || 'Organic Palak';
  const p2Name = selectedProduce[1]?.name || 'Desi Red Carrots';

  return [
    {
      id: 'meal-1',
      title: `Vedic ${p1Name} & Desi Root Vitality Bowl`,
      prepTimeMinutes: 20,
      difficulty: 'Easy',
      ingredients: [
        { name: p1Name, quantity: '150g', isFromFarmBasket: true },
        { name: p2Name, quantity: '100g', isFromFarmBasket: true },
        { name: 'Cold-Pressed Mustard Oil / A2 Ghee', quantity: '1 tsp', isFromFarmBasket: false },
        { name: 'Toasted Pumpkin & Flax Seeds', quantity: '1 tbsp', isFromFarmBasket: false },
      ],
      instructions: [
        'Wash harvest produce thoroughly in salt water.',
        'Lightly sauté carrots in A2 ghee for 3 minutes to activate lipid-soluble beta-carotene.',
        'Wilt leafy greens on low flame to preserve heat-sensitive enzymes.',
        'Finish with toasted seeds and fresh lemon juice to maximize iron bioavailability.',
      ],
      healthTarget: healthGoal,
      estimatedCalories: 280,
      macros: { protein: 8, carbs: 24, fat: 12 },
      whyItBenefitsYou: `High synergy between lipid-soluble vitamins in ${p2Name} and bioavailable iron in ${p1Name}, specifically supporting ${healthGoal}.`,
    },
    {
      id: 'meal-2',
      title: `Farm-Fresh Detox Broth with ${selectedProduce[2]?.name || 'Broccoli'} & Vedic Spices`,
      prepTimeMinutes: 25,
      difficulty: 'Medium',
      ingredients: [
        { name: selectedProduce[2]?.name || 'Fresh Farm Broccoli', quantity: '200g', isFromFarmBasket: true },
        { name: selectedProduce[3]?.name || 'A2 Desi Tomatoes', quantity: '2 medium', isFromFarmBasket: true },
        { name: 'Fresh Turmeric & Ginger Root', quantity: '1 inch grated', isFromFarmBasket: true },
      ],
      instructions: [
        'Simmer crushed ginger and turmeric in vegetable stock for 10 minutes.',
        'Add chopped cruciferous broccoli florets during the final 5 minutes of simmering.',
        'Blister tomatoes separately and fold into the warm broth.',
        'Serve warm with a pinch of fresh crushed pepper for enhanced curcumin absorption.',
      ],
      healthTarget: healthGoal,
      estimatedCalories: 190,
      macros: { protein: 9, carbs: 21, fat: 4 },
      whyItBenefitsYou: `Sulforaphane compound activation from broccoli combined with lycopene from farm tomatoes creates a potent antioxidant shield tailored to ${healthGoal}.`,
    },
  ];
}
