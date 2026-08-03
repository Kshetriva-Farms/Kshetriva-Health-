export type SubscriptionTier =
  | 'NONE'
  | 'WEEKLY_BASKET'
  | 'BIWEEKLY_BASKET'
  | 'MONTHLY_BASKET'
  | 'VIP_HEALTH_PLUS'
  | 'basic'
  | 'pro';

export type ActivityLevel =
  | 'Sedentary'
  | 'Lightly Active'
  | 'Moderately Active'
  | 'Very Active';

export type HealthGoalType =
  | 'Weight Loss'
  | 'Muscle Gain'
  | 'Maintain Weight';

export interface UserProfile {
  uid: string;
  id?: string;
  email: string;
  displayName: string;
  name?: string;
  photoURL?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionActive: boolean;
  isSubscriptionActive?: boolean;
  basketDeliveryDay?: 'Monday' | 'Wednesday' | 'Friday' | 'Saturday';
  
  // Health & Body Profile Metrics
  age?: number;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  activityLevel?: ActivityLevel;
  primaryGoal?: HealthGoalType;
  dailyCaloriesGoal?: number;
  waterGoalMl?: number;

  healthGoals?: string[];
  dietaryRestrictions?: string[];
  createdAt: string;
  updatedAt?: string;
}

export type User = UserProfile;
