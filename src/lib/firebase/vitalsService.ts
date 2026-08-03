import { VitalsRepository } from '@/infrastructure/repositories/VitalsRepository';
import { HealthMetrics } from '@/types';

const vitalsRepo = new VitalsRepository();

export async function saveDailyHealthMetrics(uid: string, metrics: HealthMetrics): Promise<void> {
  await vitalsRepo.logVitalMetric({
    userId: uid,
    date: metrics.date || new Date().toISOString().split('T')[0],
    dailyWaterIntakeMl: metrics.dailyWaterIntakeMl,
    targetWaterIntakeMl: metrics.targetWaterIntakeMl,
    caloriesConsumed: metrics.caloriesConsumed,
    targetCalories: metrics.targetCalories,
    organicProducePortions: metrics.organicProducePortions,
    targetProducePortions: 5,
    sleepHours: metrics.sleepHours,
    weightKg: metrics.weightKg,
  });
}

export async function fetchDailyHealthMetrics(uid: string, dateStr?: string): Promise<HealthMetrics> {
  const today = dateStr || new Date().toISOString().split('T')[0];
  const fetched = await vitalsRepo.getDailyVital(uid, today);

  if (fetched) {
    return {
      date: fetched.date,
      dailyWaterIntakeMl: fetched.dailyWaterIntakeMl,
      targetWaterIntakeMl: fetched.targetWaterIntakeMl,
      caloriesConsumed: fetched.caloriesConsumed,
      targetCalories: fetched.targetCalories,
      organicProducePortions: fetched.organicProducePortions,
      sleepHours: fetched.sleepHours,
      weightKg: fetched.weightKg,
    };
  }

  return {
    date: today,
    dailyWaterIntakeMl: 1750,
    targetWaterIntakeMl: 3000,
    caloriesConsumed: 1450,
    targetCalories: 2000,
    organicProducePortions: 4,
    sleepHours: 7.5,
    weightKg: 68.5,
  };
}
