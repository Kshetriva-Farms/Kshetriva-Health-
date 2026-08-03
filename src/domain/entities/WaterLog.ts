export interface WaterLogEntry {
  id: string;
  amountMl: number;
  loggedAt: string; // e.g. "10:30 AM"
  timestamp: string; // ISO string
}

export interface DailyWaterLog {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD
  targetMl: number;
  totalMl: number;
  entries: WaterLogEntry[];
  updatedAt?: string;
}
