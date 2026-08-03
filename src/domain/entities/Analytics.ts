export interface DailyCalorieData {
  day: string;
  consumed: number;
  target: number;
  burned: number;
}

export interface WeightProgressData {
  date: string;
  weightKg: number;
  targetKg: number;
}

export interface WaterIntakeData {
  day: string;
  intakeMl: number;
  goalMl: number;
}

export interface MacroDistribution {
  name: string;
  grams: number;
  percentage: number;
  color: string;
}

export interface MealFrequencyData {
  mealType: string;
  percentage: number;
  count: number;
  color: string;
}

export interface HealthScoreSummary {
  overallScore: number;
  calorieAdherenceScore: number;
  hydrationScore: number;
  weightTrendScore: number;
  bmi: number;
  bmiCategory: string;
}
