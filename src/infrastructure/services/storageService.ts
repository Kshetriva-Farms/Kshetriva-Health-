import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';
import { IStorageService } from '../../domain/repositories/IStorageService';

export class StorageService implements IStorageService {
  async uploadFile(
    path: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      if (!storage) {
        return `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80`;
      }
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: any) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(progress);
          },
          (error: any) => reject(error),
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          }
        );
      });
    } catch (error) {
      console.error(`Storage upload error [${path}]:`, error);
      throw error;
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      if (!storage) return;
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error(`Storage delete error [${path}]:`, error);
      throw error;
    }
  }

  async getFileUrl(path: string): Promise<string> {
    try {
      if (!storage) return '';
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error(`Storage getUrl error [${path}]:`, error);
      return '';
    }
  }
}

export const storageService = new StorageService();
