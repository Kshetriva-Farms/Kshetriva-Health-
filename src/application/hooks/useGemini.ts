import { useState } from 'react';
import { AIAdviceRequest, AIAdviceResponse } from '../../domain/entities/AIAdvisor';
import { aiRepository } from '../../infrastructure/repositories/AIRepository';

export function useGemini() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [advice, setAdvice] = useState<AIAdviceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAdvice = async (request: AIAdviceRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiRepository.generateAdvice(request);
      setAdvice(response);
      return response;
    } catch (err: any) {
      const msg = err.message || 'Failed to generate AI health advice';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    advice,
    error,
    getAdvice,
  };
}
