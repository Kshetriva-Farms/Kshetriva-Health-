export interface WeightLogEntry {
  id: string;
  weightKg: number;
  bodyFatPct?: number; // Optional body fat percentage
  bmi: number;
  loggedAt: string; // e.g. "2026-07-28" or "09:30 AM Today"
  timestamp: string; // ISO string
  notes?: string;
}

export interface WeightTrackerProfile {
  id?: string;
  userId: string;
  currentWeightKg: number;
  targetWeightKg: number;
  heightCm: number;
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  bodyFatPct?: number;
  entries: WeightLogEntry[];
  updatedAt?: string;
}
