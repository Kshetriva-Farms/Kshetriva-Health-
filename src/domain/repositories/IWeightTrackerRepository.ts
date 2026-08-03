import { WeightTrackerProfile, WeightLogEntry } from '../entities/WeightLog';

export interface IWeightTrackerRepository {
  getWeightProfile(userId: string): Promise<WeightTrackerProfile | null>;
  saveWeightProfile(profile: WeightTrackerProfile): Promise<void>;
  logWeightEntry(
    userId: string,
    entryInput: Omit<WeightLogEntry, 'id' | 'bmi'>,
    heightCm: number,
    targetWeightKg: number
  ): Promise<WeightTrackerProfile>;
  removeWeightEntry(userId: string, entryId: string): Promise<WeightTrackerProfile>;
}
