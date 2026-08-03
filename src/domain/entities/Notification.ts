export type NotificationCategory =
  | 'WATER'
  | 'EXERCISE'
  | 'MEAL_LOG'
  | 'VEGGIE_DELIVERY'
  | 'SUBSCRIPTION'
  | 'RECIPE';

export type NotificationChannel = 'PUSH' | 'EMAIL' | 'IN_APP';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface NotificationPreferences {
  inAppEnabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  categories: {
    water: boolean;
    exercise: boolean;
    mealLog: boolean;
    veggieDelivery: boolean;
    subscription: boolean;
    recipe: boolean;
  };
  scheduleTimes: {
    waterFrequencyHours: number;
    exerciseTime: string;
    mealLogBreakfastTime: string;
    mealLogLunchTime: string;
    mealLogDinnerTime: string;
  };
}
