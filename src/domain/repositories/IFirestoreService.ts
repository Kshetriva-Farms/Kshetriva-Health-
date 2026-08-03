/**
 * Firestore Service Interface
 * Pure domain contract for document database operations.
 */
export interface IFirestoreService {
  getDocument<T>(collectionName: string, id: string): Promise<T | null>;
  setDocument<T>(collectionName: string, id: string, data: T): Promise<void>;
  updateDocument<T>(collectionName: string, id: string, data: Partial<T>): Promise<void>;
  deleteDocument(collectionName: string, id: string): Promise<void>;
  queryCollection<T>(
    collectionName: string,
    field: string,
    operator: any,
    value: any
  ): Promise<T[]>;
}
