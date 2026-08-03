export interface IngredientItem {
  name: string;
  quantity: string;
  isFromFarmBasket: boolean;
}

export interface FarmRecipe {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  servingSize?: string; // e.g. "2 Servings (350g per portion)"
  difficulty: 'Easy' | 'Medium' | 'Chef Level';
  category: 'Salad' | 'Smoothie' | 'Soup' | 'Main Dish' | 'Detox Water' | 'Curry' | 'Sabzi' | 'Chutney';
  cuisine?: 'Indian' | 'Global';
  heroProduce: string[]; // Produce items like "Organic Spinach", "Heritage Carrots"
  ingredients: IngredientItem[];
  instructions: string[];
  estimatedCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  healthBenefits: string[];
  imageUrl?: string;
  isSubscriberExclusive?: boolean;
  isFavorite?: boolean;
  isSaved?: boolean;
}
