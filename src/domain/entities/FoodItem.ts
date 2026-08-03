export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number; // kcal per base serving
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
  servingSize: string; // e.g. "1 cup (150g)", "1 medium", "100g"
}

export interface LoggedMealItem {
  id: string;
  foodId?: string;
  name: string;
  mealCategory: MealCategory;
  quantity: number; // e.g., 1.5 servings or 150 grams
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAt: string;
}

export interface DailyCalorieLog {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD
  targetCalories: number;
  loggedItems: LoggedMealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  updatedAt?: string;
}
