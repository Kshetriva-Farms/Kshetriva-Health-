import { DailyWaterLog, WaterLogEntry } from '../entities/WaterLog';

export interface IWaterTrackerRepository {
  getDailyLog(userId: string, date: string): Promise<DailyWaterLog | null>;
  saveDailyLog(log: DailyWaterLog): Promise<void>;
  addWaterEntry(userId: string, date: string, entry: Omit<WaterLogEntry, 'id'>): Promise<DailyWaterLog>;
  removeWaterEntry(userId: string, date: string, entryId: string): Promise<DailyWaterLog>;
  getWeeklyHistory(userId: string): Promise<DailyWaterLog[]>;
  getMonthlyHistory(userId: string): Promise<DailyWaterLog[]>;
}
