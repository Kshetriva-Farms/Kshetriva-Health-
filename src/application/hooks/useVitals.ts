import { useState, useEffect } from 'react';
import { Vital, VitalLogInput } from '../../domain/entities/Vital';
import { vitalsRepository } from '../../infrastructure/repositories/VitalsRepository';
import { useAuth } from '../context/AuthContext';

export function useVitals() {
  const { user } = useAuth();
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVitals = async () => {
    if (!user) return;
    const userId = user.id || user.uid || '';
    if (!userId) return;
    try {
      setIsLoading(true);
      const data = await vitalsRepository.getUserVitals(userId);
      setVitals(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vitals');
    } finally {
      setIsLoading(false);
    }
  };

  const addVital = async (input: VitalLogInput) => {
    if (!user) return;
    const userId = user.id || user.uid || '';
    if (!userId) return;
    try {
      const newVital = await vitalsRepository.logVital(userId, input);
      setVitals((prev) => [newVital, ...prev]);
      return newVital;
    } catch (err: any) {
      setError(err.message || 'Failed to add vital');
      throw err;
    }
  };

  useEffect(() => {
    fetchVitals();
  }, [user]);

  return {
    vitals,
    isLoading,
    error,
    refreshVitals: fetchVitals,
    addVital,
  };
}
