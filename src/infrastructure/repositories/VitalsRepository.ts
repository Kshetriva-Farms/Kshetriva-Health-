import { IVitalsRepository } from '../../domain/repositories/IVitalsRepository';
import { VitalMetric, Vital, VitalLogInput } from '../../domain/entities/Vital';
import { firestoreService } from '../services/firestoreService';

export class VitalsRepository implements IVitalsRepository {
  async getDailyVital(userId: string, date: string): Promise<VitalMetric | null> {
    const docId = `${userId}_${date}`;
    return firestoreService.getDocument<VitalMetric>('vitals', docId);
  }

  async logVitalMetric(vital: VitalMetric): Promise<void> {
    const docId = `${vital.userId}_${vital.date}`;
    await firestoreService.setDocument('vitals', docId, {
      ...vital,
      createdAt: vital.createdAt || new Date().toISOString(),
    });
  }

  async getVitalsHistory(userId: string, daysLimit = 7): Promise<VitalMetric[]> {
    return firestoreService.queryCollection<VitalMetric>('vitals', 'userId', '==', userId);
  }

  async getUserVitals(userId: string): Promise<Vital[]> {
    const metrics = await this.getVitalsHistory(userId);
    if (metrics && metrics.length > 0) {
      return metrics.map((m, idx) => ({
        id: m.id || `v-${idx}`,
        type: 'heartRate',
        value: m.caloriesConsumed || 72,
        unit: 'bpm',
        recordedAt: m.date || new Date().toISOString(),
        status: 'normal'
      }));
    }
    return [
      { id: 'v1', type: 'heartRate', value: 72, unit: 'bpm', recordedAt: new Date().toISOString(), status: 'normal' },
      { id: 'v2', type: 'bloodPressure', value: 120, unit: 'mmHg', recordedAt: new Date().toISOString(), status: 'normal' },
      { id: 'v3', type: 'bloodGlucose', value: 95, unit: 'mg/dL', recordedAt: new Date().toISOString(), status: 'normal' },
      { id: 'v4', type: 'spo2', value: 98, unit: '%', recordedAt: new Date().toISOString(), status: 'normal' },
    ];
  }

  async logVital(userId: string, input: VitalLogInput): Promise<Vital> {
    const newVital: Vital = {
      id: `v-${Date.now()}`,
      type: input.type,
      value: input.value,
      unit: input.unit,
      recordedAt: new Date().toISOString(),
      status: input.status || 'normal',
    };
    await firestoreService.setDocument('user_vitals', `${userId}_${newVital.id}`, newVital);
    return newVital;
  }
}

export const vitalsRepository = new VitalsRepository();
