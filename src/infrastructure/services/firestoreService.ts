import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { IFirestoreService } from '../../domain/repositories/IFirestoreService';

export class FirestoreService implements IFirestoreService {
  async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    try {
      if (!db) return null;
      const docRef = doc(db, collectionName, docId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as T;
      }
      return null;
    } catch (error) {
      console.error(`Firestore getDocument error [${collectionName}/${docId}]:`, error);
      return null;
    }
  }

  async setDocument<T>(collectionName: string, docId: string, data: T): Promise<void> {
    try {
      if (!db) return;
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data as any, { merge: true });
    } catch (error) {
      console.error(`Firestore setDocument error [${collectionName}/${docId}]:`, error);
      throw error;
    }
  }

  async updateDocument<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    try {
      if (!db) return;
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data as any);
    } catch (error) {
      console.error(`Firestore updateDocument error [${collectionName}/${docId}]:`, error);
      throw error;
    }
  }

  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      if (!db) return;
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Firestore deleteDocument error [${collectionName}/${docId}]:`, error);
      throw error;
    }
  }

  async queryCollection<T>(
    collectionName: string,
    field: string,
    operator: any = '==',
    value: any
  ): Promise<T[]> {
    try {
      if (!db) return [];
      const colRef = collection(db, collectionName);
      const q = query(colRef, where(field, operator, value), limit(50));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d: any) => d.data() as T);
    } catch (error) {
      console.error(`Firestore queryCollection error [${collectionName}]:`, error);
      return [];
    }
  }
}

export const firestoreService = new FirestoreService();
