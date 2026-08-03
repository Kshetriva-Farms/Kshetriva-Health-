import { DailyCalorieLog, LoggedMealItem } from '../entities/FoodItem';

export interface ICalorieTrackerRepository {
  getDailyLog(userId: string, date: string): Promise<DailyCalorieLog | null>;
  saveDailyLog(log: DailyCalorieLog): Promise<void>;
  logMealItem(userId: string, date: string, item: LoggedMealItem): Promise<DailyCalorieLog>;
  removeMealItem(userId: string, date: string, itemId: string): Promise<DailyCalorieLog>;
  getWeeklyHistory(userId: string, endDate?: string): Promise<DailyCalorieLog[]>;
  getMonthlyHistory(userId: string, endDate?: string): Promise<DailyCalorieLog[]>;
}
