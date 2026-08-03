/**
 * Storage Service Interface
 * Pure domain contract for cloud storage file operations.
 */
export interface IStorageService {
  uploadFile(path: string, file: File, onProgress?: (progress: number) => void): Promise<string>;
  deleteFile(path: string): Promise<void>;
  getFileUrl(path: string): Promise<string>;
}
