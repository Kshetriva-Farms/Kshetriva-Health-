import { IAIRepository } from '../../domain/repositories/IAIRepository';
import { AIAdviceRequest, AIAdviceResponse, NutritionAdviceRequest, AIAdvisorResponse } from '../../domain/entities/AIAdvisor';
import { geminiService } from '../services/geminiService';

export class AIRepository implements IAIRepository {
  async generateAdvice(request: AIAdviceRequest): Promise<AIAdviceResponse> {
    try {
      return await geminiService.generateAdvice(request);
    } catch (error) {
      console.warn('AIRepository service call error, returning fallback:', error);
      return {
        summary: 'AI Health Guidance',
        content: `Based on your request "${request.userQuery}", maintain balanced hydration and nutrient-dense whole foods.`,
        recommendations: ['Stay hydrated', 'Track daily vitals'],
        createdAt: new Date().toISOString()
      };
    }
  }

  async streamAdvice(request: AIAdviceRequest, onChunk: (text: string) => void): Promise<string> {
    const advice = await this.generateAdvice(request);
    const content = advice.content || advice.summary || '';
    onChunk(content);
    return content;
  }

  // Backwards compatibility method
  async generateNutritionAdvice(request: NutritionAdviceRequest): Promise<AIAdvisorResponse> {
    const response = await this.generateAdvice({
      userQuery: request.userPrompt || 'Nutrition Advice Request',
      produceHarvest: request.produceHarvest,
    });
    return {
      adviceText: response.content || response.summary || 'Eat nutrient-rich organic produce.',
      timestamp: new Date().toISOString(),
    };
  }
}

export const aiRepository = new AIRepository();
