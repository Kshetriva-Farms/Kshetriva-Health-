import { IngredientItem } from './Recipe';

export interface NutritionAdviceRequest {
  produceHarvest: string[];
  healthGoals: string[];
  dietaryRestrictions?: string[];
  targetCalories?: number;
  userPrompt?: string;
}

export interface AIAdviceRequest {
  userQuery: string;
  vitalsSummary?: Record<string, any>;
  medicalHistory?: Record<string, any>;
  produceHarvest?: string[];
}

export interface AIRecipeRecommendation {
  title: string;
  prepTimeMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Chef Level';
  ingredients: IngredientItem[];
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

export interface AIAdvisorResponse {
  adviceText?: string;
  summary?: string;
  content?: string;
  recommendations?: string[];
  confidenceScore?: number;
  curatedRecipe?: AIRecipeRecommendation;
  produceHighlights?: { produceName: string; keyBenefit: string }[];
  timestamp?: string;
  createdAt?: string;
}

export type AIAdviceResponse = AIAdvisorResponse;
