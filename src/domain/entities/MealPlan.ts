export interface MealPlanRequest {
  goal: 'Weight Loss' | 'Muscle Gain' | 'Maintain Weight';
  targetCalories: number;
  targetProtein: number;
  availableVegetables: string[];
  budget: string; // e.g. "$15/day" or "₹300/day"
  cuisineStyle: 'Pan-Indian' | 'North Indian' | 'South Indian';
}

export interface MealPlanMeal {
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  title: string;
  description: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTimeMinutes: number;
}

export interface IndianMealPlan {
  id: string;
  goal: string;
  targetCalories: number;
  totalCalories: number;
  totalProtein: number;
  meals: {
    breakfast: MealPlanMeal;
    lunch: MealPlanMeal;
    dinner: MealPlanMeal;
    snacks: MealPlanMeal;
  };
  nutritionalSummary: {
    fiberG: number;
    vitCMg: number;
    ironMg: number;
    keyMicroNutrients: string[];
  };
  shoppingSuggestions: string[];
  generatedAt: string;
}
