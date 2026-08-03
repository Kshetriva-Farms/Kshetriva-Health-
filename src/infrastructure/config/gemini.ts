import { GoogleGenAI } from '@google/genai';
import { env } from './env';

export const geminiClient = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
export const FALLBACK_GEMINI_MODEL = 'gemini-1.5-flash';
