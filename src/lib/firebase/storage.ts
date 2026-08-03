import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './config';

export const storage = getStorage(app);

export async function uploadUserProfileImage(uid: string, file: File): Promise<string> {
  try {
    const storageRef = ref(storage, `users/${uid}/profile_${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Firebase Storage Upload Error:", error);
    throw error;
  }
}
