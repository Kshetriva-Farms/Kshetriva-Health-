import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in popup. Please allow popups for this site and try again.';
    case 'auth/cancelled-popup-request':
      return 'Another sign-in attempt is already in progress.';
    case 'auth/unauthorized-domain':
      return 'This domain is not yet authorized for sign-in. Add it under Firebase Console → Authentication → Settings → Authorized domains.';
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled for this project yet. Enable it under Firebase Console → Authentication → Sign-in method.';
    case 'auth/network-request-failed':
      return 'Network error while contacting the authentication server. Please check your connection and try again.';
    case 'auth/internal-error':
      return 'Authentication service returned an internal error. Please try again shortly.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

class AuthService {
  private auth = app ? getAuth(app) : null;

  async login({ email, password }: AuthCredentials): Promise<User> {
    if (!this.auth) {
      throw new Error('Authentication service is not configured. Please contact support.');
    }
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return await this.fetchOrInitUserProfile(userCredential.user);
    } catch (error) {
      throw new Error(parseFirebaseAuthError(error));
    }
  }

  async loginWithGoogle(): Promise<User> {
    if (!this.auth) {
      throw new Error('Authentication service is not configured. Please contact support.');
    }
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(this.auth, provider);
      return await this.fetchOrInitUserProfile(userCredential.user);
    } catch (error: any) {
      const code = error?.code || '';
      // Popups are commonly blocked by browser settings, mobile browsers, or
      // in-app webviews (e.g. Instagram/Facebook browser). Fall back to a
      // full-page redirect flow, which works in those environments.
      if (
        code === 'auth/popup-blocked' ||
        code === 'auth/operation-not-supported-in-this-environment' ||
        code === 'auth/cancelled-popup-request'
      ) {
        await signInWithRedirect(this.auth, provider);
        // The browser navigates away here; this promise will not resolve.
        // The redirect result is picked up by handleRedirectResult() on return.
        return new Promise<User>(() => {});
      }
      throw new Error(parseFirebaseAuthError(error));
    }
  }

  /**
   * Completes a signInWithRedirect flow. Call once on app init (before/alongside
   * onAuthChanged) so redirect-based Google sign-ins finish and surface their errors.
   */
  async handleRedirectResult(): Promise<User | null> {
    if (!this.auth) return null;
    try {
      const result = await getRedirectResult(this.auth);
      if (result?.user) {
        return await this.fetchOrInitUserProfile(result.user);
      }
      return null;
    } catch (error) {
      console.error('Google redirect sign-in failed:', parseFirebaseAuthError(error));
      return null;
    }
  }

  async register({ email, password, name }: AuthCredentials & { name: string }): Promise<User> {
    if (!this.auth) {
      throw new Error('Authentication service is not configured. Please contact support.');
    }
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
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
      throw new Error(parseFirebaseAuthError(error));
    }
  }

  async sendPasswordReset(email: string): Promise<void> {
    if (!email) {
      throw new Error('Please enter a valid email address.');
    }
    if (!this.auth) {
      throw new Error('Authentication service is not configured. Please contact support.');
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
      console.error('Firebase Auth is not configured. Check your environment variables.');
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(this.auth, async (firebaseUser: any) => {
      if (firebaseUser) {
        try {
          const userProfile = await this.fetchOrInitUserProfile(firebaseUser);
          callback(userProfile);
        } catch (e) {
          console.error('Failed to load user profile:', e);
          callback(null);
        }
      } else {
        callback(null);
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
      subscriptionTier: 'NONE',
      subscriptionActive: false,
      isSubscriptionActive: false,
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
