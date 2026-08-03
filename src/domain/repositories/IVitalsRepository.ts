import { VitalMetric, Vital, VitalLogInput } from '../entities/Vital';

export interface IVitalsRepository {
  getDailyVital(userId: string, date: string): Promise<VitalMetric | null>;
  logVitalMetric(vital: VitalMetric): Promise<void>;
  getVitalsHistory(userId: string, daysLimit?: number): Promise<VitalMetric[]>;
  getUserVitals(userId: string): Promise<Vital[]>;
  logVital(userId: string, input: VitalLogInput): Promise<Vital>;
}
