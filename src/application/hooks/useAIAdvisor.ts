import { useState } from 'react';
import { aiRepository } from '../../infrastructure/repositories/AIRepository';
import { NutritionAdviceRequest, AIAdvisorResponse } from '../../domain/entities/AIAdvisor';

export function useAIAdvisor() {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<AIAdvisorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = async (request: NutritionAdviceRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiRepository.generateNutritionAdvice(request);
      setResponse(result);
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to consult Gemini AI Advisor';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    response,
    error,
    fetchAdvice,
  };
}
