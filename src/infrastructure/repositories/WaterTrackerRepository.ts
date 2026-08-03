import { IWaterTrackerRepository } from '../../domain/repositories/IWaterTrackerRepository';
import { DailyWaterLog, WaterLogEntry } from '../../domain/entities/WaterLog';
import { firestoreService } from '../services/firestoreService';

export class WaterTrackerRepository implements IWaterTrackerRepository {
  async getDailyLog(userId: string, date: string): Promise<DailyWaterLog | null> {
    const docId = `${userId}_${date}`;
    return await firestoreService.getDocument<DailyWaterLog>('water_logs', docId);
  }

  async saveDailyLog(log: DailyWaterLog): Promise<void> {
    const docId = `${log.userId}_${log.date}`;
    await firestoreService.setDocument('water_logs', docId, {
      ...log,
      updatedAt: new Date().toISOString(),
    });
  }

  async addWaterEntry(
    userId: string,
    date: string,
    entryInput: Omit<WaterLogEntry, 'id'>
  ): Promise<DailyWaterLog> {
    const existing = await this.getDailyLog(userId, date);

    const newEntry: WaterLogEntry = {
      ...entryInput,
      id: `w-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };

    const updatedEntries = existing ? [newEntry, ...existing.entries] : [newEntry];
    const totalMl = updatedEntries.reduce((acc, e) => acc + e.amountMl, 0);

    const newLog: DailyWaterLog = {
      id: `${userId}_${date}`,
      userId,
      date,
      targetMl: existing?.targetMl || 3000,
      totalMl,
      entries: updatedEntries,
      updatedAt: new Date().toISOString(),
    };

    await this.saveDailyLog(newLog);
    return newLog;
  }

  async removeWaterEntry(userId: string, date: string, entryId: string): Promise<DailyWaterLog> {
    const existing = await this.getDailyLog(userId, date);
    if (!existing) {
      throw new Error('No water log entry found.');
    }

    const updatedEntries = existing.entries.filter((e) => e.id !== entryId);
    const totalMl = updatedEntries.reduce((acc, e) => acc + e.amountMl, 0);

    const updatedLog: DailyWaterLog = {
      ...existing,
      totalMl,
      entries: updatedEntries,
      updatedAt: new Date().toISOString(),
    };

    await this.saveDailyLog(updatedLog);
    return updatedLog;
  }

  async getWeeklyHistory(userId: string): Promise<DailyWaterLog[]> {
    const logs = await firestoreService.queryCollection<DailyWaterLog>(
      'water_logs',
      'userId',
      '==',
      userId
    );
    return logs.slice(0, 7);
  }

  async getMonthlyHistory(userId: string): Promise<DailyWaterLog[]> {
    const logs = await firestoreService.queryCollection<DailyWaterLog>(
      'water_logs',
      'userId',
      '==',
      userId
    );
    return logs.slice(0, 30);
  }
}

export const waterTrackerRepository = new WaterTrackerRepository();
