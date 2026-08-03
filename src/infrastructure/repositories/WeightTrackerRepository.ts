import { IWeightTrackerRepository } from '../../domain/repositories/IWeightTrackerRepository';
import { WeightTrackerProfile, WeightLogEntry } from '../../domain/entities/WeightLog';
import { firestoreService } from '../services/firestoreService';

export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: WeightTrackerProfile['bmiCategory'] } {
  if (!heightCm || heightCm <= 0) return { bmi: 22.0, category: 'Normal' };
  const hM = heightCm / 100;
  const bmi = Math.round((weightKg / (hM * hM)) * 10) / 10;

  let category: WeightTrackerProfile['bmiCategory'] = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 18.5 && bmi < 25) category = 'Normal';
  else if (bmi >= 25 && bmi < 30) category = 'Overweight';
  else category = 'Obese';

  return { bmi, category };
}

export class WeightTrackerRepository implements IWeightTrackerRepository {
  async getWeightProfile(userId: string): Promise<WeightTrackerProfile | null> {
    return await firestoreService.getDocument<WeightTrackerProfile>('weight_logs', userId);
  }

  async saveWeightProfile(profile: WeightTrackerProfile): Promise<void> {
    await firestoreService.setDocument('weight_logs', profile.userId, {
      ...profile,
      updatedAt: new Date().toISOString(),
    });
  }

  async logWeightEntry(
    userId: string,
    entryInput: Omit<WeightLogEntry, 'id' | 'bmi'>,
    heightCm: number = 175,
    targetWeightKg: number = 65
  ): Promise<WeightTrackerProfile> {
    const existing = await this.getWeightProfile(userId);
    const { bmi, category } = calculateBMI(entryInput.weightKg, heightCm);

    const newEntry: WeightLogEntry = {
      ...entryInput,
      bmi,
      id: `wgt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };

    const updatedEntries = existing ? [newEntry, ...existing.entries] : [newEntry];

    const updatedProfile: WeightTrackerProfile = {
      id: userId,
      userId,
      currentWeightKg: entryInput.weightKg,
      targetWeightKg,
      heightCm,
      bmi,
      bmiCategory: category,
      bodyFatPct: entryInput.bodyFatPct || existing?.bodyFatPct,
      entries: updatedEntries,
      updatedAt: new Date().toISOString(),
    };

    await this.saveWeightProfile(updatedProfile);
    return updatedProfile;
  }

  async removeWeightEntry(userId: string, entryId: string): Promise<WeightTrackerProfile> {
    const existing = await this.getWeightProfile(userId);
    if (!existing) {
      throw new Error('No weight profile found.');
    }

    const updatedEntries = existing.entries.filter((e) => e.id !== entryId);
    const latestWeight = updatedEntries.length > 0 ? updatedEntries[0].weightKg : existing.currentWeightKg;
    const { bmi, category } = calculateBMI(latestWeight, existing.heightCm);

    const updatedProfile: WeightTrackerProfile = {
      ...existing,
      currentWeightKg: latestWeight,
      bmi,
      bmiCategory: category,
      entries: updatedEntries,
      updatedAt: new Date().toISOString(),
    };

    await this.saveWeightProfile(updatedProfile);
    return updatedProfile;
  }
}

export const weightTrackerRepository = new WeightTrackerRepository();
