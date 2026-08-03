export type SubscriptionTier = 'NONE' | 'WEEKLY_BASKET' | 'BIWEEKLY_BASKET' | 'MONTHLY_BASKET' | 'VIP_HEALTH_PLUS';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionActive: boolean;
  basketDeliveryDay?: 'Monday' | 'Wednesday' | 'Friday' | 'Saturday';
  healthGoals?: string[];
  dietaryRestrictions?: string[];
  createdAt: string;
}

export interface ProduceItem {
  id: string;
  name: string;
  category: 'Leafy Greens' | 'Root Vegetables' | 'Cruciferous' | 'Herbs' | 'Gourds & Squash' | 'Seasonal Fruits';
  icon: string;
  healthBenefits: string[];
  caloriesPer100g: number;
  macros: {
    protein: number; // in grams
    carbs: number;
    fiber: number;
    fat: number;
  };
  keyVitamins: string[];
}

export interface FarmBasketHarvest {
  id: string;
  weekNumber: number;
  deliveryDate: string;
  produceItems: ProduceItem[];
  curatedNutritionTip: string;
}

export interface HealthMetrics {
  date: string;
  dailyWaterIntakeMl: number;
  targetWaterIntakeMl: number;
  caloriesConsumed: number;
  targetCalories: number;
  organicProducePortions: number; // target: 5 portions/day
  sleepHours?: number;
  weightKg?: number;
}

export interface GeminiMealRecommendation {
  id: string;
  title: string;
  prepTimeMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Chef Level';
  ingredients: { name: string; quantity: string; isFromFarmBasket: boolean }[];
  instructions: string[];
  healthTarget: string;
  estimatedCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  whyItBenefitsYou: string;
}
