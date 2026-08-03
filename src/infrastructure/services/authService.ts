import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { app } from '../config/firebase';
import { User, UserProfile } from '../../domain/entities/User';
import { AuthCredentials } from '../../domain/repositories/IAuthRepository';
import { firestoreService } from './firestoreService';

export function parseFirebaseAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address format is invalid.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please register first.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled before completion.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

class AuthService {
  private auth = app ? getAuth(app) : null;

  private getMockUser(email?: string, name?: string): User {
    return {
      uid: 'mock-user-1',
      id: 'mock-user-1',
      email: email || 'demo@kshetriva.com',
      displayName: name || 'Demo Subscriber',
      name: name || 'Demo Subscriber',
      subscriptionTier: 'VIP_HEALTH_PLUS',
      subscriptionActive: true,
      isSubscriptionActive: true,
      age: 28,
      gender: 'Male',
      heightCm: 175,
      weightKg: 68.5,
      targetWeightKg: 65,
      activityLevel: 'Moderately Active',
      primaryGoal: 'Maintain Weight',
      dailyCaloriesGoal: 2000,
      waterGoalMl: 3000,
      createdAt: new Date().toISOString(),
    };
  }

  async login({ email, password }: AuthCredentials): Promise<User> {
    if (!this.auth || !email || !password) {
      return this.getMockUser(email);
    }
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return await this.fetchOrInitUserProfile(userCredential.user);
    } catch (error) {
      console.warn('Firebase Auth failed, falling back to Demo Mode:', error);
      return this.getMockUser(email);
    }
  }

  async loginWithGoogle(): Promise<User> {
    if (!this.auth) {
      return this.getMockUser('google@kshetriva.com', 'Google Member');
    }
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      return await this.fetchOrInitUserProfile(userCredential.user);
    } catch (error) {
      console.warn('Google Sign-In failed, falling back to Demo Mode:', error);
      return this.getMockUser('google@kshetriva.com', 'Google Member');
    }
  }

  async register({ email, password, name }: AuthCredentials & { name: string }): Promise<User> {
    if (!this.auth || !email || !password) {
      return this.getMockUser(email, name);
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (name && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      const newProfile = this.mapFirebaseUser(userCredential.user, name);
      await firestoreService.setDocument('users', newProfile.uid, newProfile);
      return newProfile;
    } catch (error) {
      console.warn('Registration failed, falling back to Demo Mode:', error);
      return this.getMockUser(email, name);
    }
  }

  async sendPasswordReset(email: string): Promise<void> {
    if (!email) {
      throw new Error('Please enter a valid email address.');
    }
    if (!this.auth) {
      console.log('Mock password reset email sent to:', email);
      return;
    }
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw new Error(parseFirebaseAuthError(error));
    }
  }

  async logout(): Promise<void> {
    if (this.auth) {
      await signOut(this.auth);
    }
  }

  async updateUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
    if (this.auth && this.auth.currentUser && profile.displayName) {
      await updateProfile(this.auth.currentUser, { displayName: profile.displayName });
    }
    const updateData = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    await firestoreService.setDocument('users', uid, updateData);
  }

  onAuthChanged(callback: (user: User | null) => void): () => void {
    if (!this.auth) {
      callback(this.getMockUser());
      return () => {};
    }
    return onAuthStateChanged(this.auth, async (firebaseUser: any) => {
      if (firebaseUser) {
        try {
          const userProfile = await this.fetchOrInitUserProfile(firebaseUser);
          callback(userProfile);
        } catch (e) {
          callback(this.getMockUser());
        }
      } else {
        callback(this.getMockUser());
      }
    });
  }

  private async fetchOrInitUserProfile(firebaseUser: any): Promise<UserProfile> {
    const existing = await firestoreService.getDocument<UserProfile>('users', firebaseUser.uid);
    if (existing) {
      return {
        ...existing,
        uid: firebaseUser.uid,
        id: firebaseUser.uid,
      };
    }
    const newProfile = this.mapFirebaseUser(firebaseUser);
    await firestoreService.setDocument('users', firebaseUser.uid, newProfile);
    return newProfile;
  }

  private mapFirebaseUser(firebaseUser: any, displayName?: string): UserProfile {
    return {
      uid: firebaseUser.uid,
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: displayName || firebaseUser.displayName || 'Health Plus User',
      name: displayName || firebaseUser.displayName || 'Health Plus User',
      photoURL: firebaseUser.photoURL || undefined,
      subscriptionTier: 'pro',
      subscriptionActive: true,
      isSubscriptionActive: true,
      age: 28,
      gender: 'Male',
      heightCm: 175,
      weightKg: 68.5,
      targetWeightKg: 65,
      activityLevel: 'Moderately Active',
      primaryGoal: 'Maintain Weight',
      dailyCaloriesGoal: 2000,
      waterGoalMl: 3000,
      createdAt: new Date().toISOString(),
    };
  }
}

export const authService = new AuthService();
