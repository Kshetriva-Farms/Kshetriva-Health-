import { AIAdviceRequest, AIAdviceResponse } from '../../domain/entities/AIAdvisor';
import { IAIRepository } from '../../domain/repositories/IAIRepository';

export async function generateHealthAdviceUseCase(
  aiRepo: IAIRepository,
  request: AIAdviceRequest
): Promise<AIAdviceResponse> {
  if (!request.userQuery || request.userQuery.trim().length === 0) {
    throw new Error('Query text is required for AI advice generation.');
  }

  return await aiRepo.generateAdvice(request);
}
