import { Vital, VitalLogInput } from '../../domain/entities/Vital';
import { IVitalsRepository } from '../../domain/repositories/IVitalsRepository';

export async function logVitalUseCase(
  vitalsRepo: IVitalsRepository,
  userId: string,
  input: VitalLogInput
): Promise<Vital> {
  if (!userId) {
    throw new Error('User ID is required to log vitals.');
  }

  if (input.value <= 0) {
    throw new Error('Vital value must be greater than 0.');
  }

  return await vitalsRepo.logVital(userId, input);
}
