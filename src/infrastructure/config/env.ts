/**
 * Centralized Environment Configuration & Validation Module
 */
export const env = {
  GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
  FIREBASE: {
    API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-kshetriva-api-key',
    AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'kshetriva-health-plus.firebaseapp.com',
    PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'kshetriva-health-plus',
    STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'kshetriva-health-plus.appspot.com',
    MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
    APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890',
  },
  IS_DEV: process.env.NODE_ENV === 'development',
};
