import { AIAdviceRequest, AIAdviceResponse } from '../../domain/entities/AIAdvisor';
import { MealPlanRequest, IndianMealPlan } from '../../domain/entities/MealPlan';

/**
 * Client-side facade for AI features. All Gemini calls happen server-side
 * (see src/app/api/gemini/*) so the API key never reaches the browser bundle.
 */
class GeminiService {
  async generateAdvice(request: AIAdviceRequest): Promise<AIAdviceResponse> {
    const res = await fetch('/api/gemini/advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error(`AI advice request failed with status ${res.status}`);
    }

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate AI advice.');
    }

    return {
      summary: data.summary,
      content: data.content,
      recommendations: data.recommendations,
      confidenceScore: data.confidenceScore,
      createdAt: data.createdAt,
    };
  }

  async generateIndianMealPlan(request: MealPlanRequest): Promise<IndianMealPlan> {
    const res = await fetch('/api/gemini/mealplan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error(`Meal plan request failed with status ${res.status}`);
    }

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate meal plan.');
    }

    return data.plan as IndianMealPlan;
  }
}

export const geminiService = new GeminiService();
