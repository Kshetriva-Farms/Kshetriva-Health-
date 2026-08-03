export const APP_ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CALORIE_TRACKER: '/calorie-tracker',
  WATER_TRACKER: '/water-tracker',
  WEIGHT_TRACKER: '/weight-tracker',
  FARM_BASKET: '/farm-basket',
  MEAL_PLAN: '/meal-plan',
  AI_ADVISOR: '/ai-advisor',
  RECIPES: '/recipes',
  VITALS: '/vitals',
  SUBSCRIPTION: '/subscription',
  ADMIN: '/admin',
  NOTIFICATIONS: '/notifications',
  ANALYTICS: '/analytics',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    PROFILE_CREATION: '/profile-creation',
  },
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export type AppRoute = typeof APP_ROUTES[keyof typeof APP_ROUTES] | string;
