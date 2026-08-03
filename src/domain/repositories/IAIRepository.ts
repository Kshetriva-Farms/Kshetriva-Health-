import { AIAdviceRequest, AIAdviceResponse } from '../entities/AIAdvisor';

export interface IAIRepository {
  generateAdvice(request: AIAdviceRequest): Promise<AIAdviceResponse>;
  streamAdvice(request: AIAdviceRequest, onChunk: (text: string) => void): Promise<string>;
}
