export interface DailyMacros {
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface VitalMetric {
  id?: string;
  userId: string;
  date: string;
  dailyWaterIntakeMl: number;
  targetWaterIntakeMl: number;
  caloriesConsumed: number;
  targetCalories: number;
  organicProducePortions: number;
  targetProducePortions: number;
  sleepHours?: number;
  weightKg?: number;
  macros?: DailyMacros;
  notes?: string;
  createdAt?: string;
}

export interface Vital {
  id: string;
  type: 'heartRate' | 'bloodPressure' | 'bloodGlucose' | 'spo2' | 'weight' | 'water';
  value: number;
  unit: string;
  recordedAt: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface VitalLogInput {
  type: Vital['type'];
  value: number;
  unit: string;
  status?: Vital['status'];
}
