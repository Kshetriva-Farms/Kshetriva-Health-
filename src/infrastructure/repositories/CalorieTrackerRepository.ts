import { ICalorieTrackerRepository } from '../../domain/repositories/ICalorieTrackerRepository';
import { DailyCalorieLog, LoggedMealItem } from '../../domain/entities/FoodItem';
import { firestoreService } from '../services/firestoreService';

export class CalorieTrackerRepository implements ICalorieTrackerRepository {
  async getDailyLog(userId: string, date: string): Promise<DailyCalorieLog | null> {
    const docId = `${userId}_${date}`;
    return await firestoreService.getDocument<DailyCalorieLog>('calorie_logs', docId);
  }

  async saveDailyLog(log: DailyCalorieLog): Promise<void> {
    const docId = `${log.userId}_${log.date}`;
    await firestoreService.setDocument('calorie_logs', docId, {
      ...log,
      updatedAt: new Date().toISOString(),
    });
  }

  async logMealItem(userId: string, date: string, item: LoggedMealItem): Promise<DailyCalorieLog> {
    const existing = await this.getDailyLog(userId, date);
    const updatedItems = existing ? [item, ...existing.loggedItems] : [item];

    const totalCalories = updatedItems.reduce((acc, i) => acc + i.calories, 0);
    const totalProtein = updatedItems.reduce((acc, i) => acc + i.protein, 0);
    const totalCarbs = updatedItems.reduce((acc, i) => acc + i.carbs, 0);
    const totalFat = updatedItems.reduce((acc, i) => acc + i.fat, 0);

    const newLog: DailyCalorieLog = {
      id: `${userId}_${date}`,
      userId,
      date,
      targetCalories: existing?.targetCalories || 2000,
      loggedItems: updatedItems,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      updatedAt: new Date().toISOString(),
    };

    await this.saveDailyLog(newLog);
    return newLog;
  }

  async removeMealItem(userId: string, date: string, itemId: string): Promise<DailyCalorieLog> {
    const existing = await this.getDailyLog(userId, date);
    if (!existing) {
      throw new Error('No log entry found to remove item from.');
    }

    const updatedItems = existing.loggedItems.filter((i) => i.id !== itemId);
    const totalCalories = updatedItems.reduce((acc, i) => acc + i.calories, 0);
    const totalProtein = updatedItems.reduce((acc, i) => acc + i.protein, 0);
    const totalCarbs = updatedItems.reduce((acc, i) => acc + i.carbs, 0);
    const totalFat = updatedItems.reduce((acc, i) => acc + i.fat, 0);

    const updatedLog: DailyCalorieLog = {
      ...existing,
      loggedItems: updatedItems,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      updatedAt: new Date().toISOString(),
    };

    await this.saveDailyLog(updatedLog);
    return updatedLog;
  }

  async getWeeklyHistory(userId: string, endDate?: string): Promise<DailyCalorieLog[]> {
    const logs = await firestoreService.queryCollection<DailyCalorieLog>(
      'calorie_logs',
      'userId',
      '==',
      userId
    );
    return logs.slice(0, 7);
  }

  async getMonthlyHistory(userId: string, endDate?: string): Promise<DailyCalorieLog[]> {
    const logs = await firestoreService.queryCollection<DailyCalorieLog>(
      'calorie_logs',
      'userId',
      '==',
      userId
    );
    return logs.slice(0, 30);
  }
}

export const calorieTrackerRepository = new CalorieTrackerRepository();
