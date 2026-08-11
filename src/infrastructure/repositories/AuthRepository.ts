import { IAuthRepository, AuthCredentials } from '../../domain/repositories/IAuthRepository';
import { User, UserProfile } from '../../domain/entities/User';
import { authService } from '../services/authService';

export class AuthRepository implements IAuthRepository {
  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = authService.onAuthChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  async login(credentials: AuthCredentials): Promise<User> {
    return await authService.login(credentials);
  }

  async loginWithGoogle(): Promise<UserProfile> {
    return await authService.loginWithGoogle();
  }

  async handleRedirectResult(): Promise<User | null> {
    return await authService.handleRedirectResult();
  }

  async register(credentials: AuthCredentials & { name: string }): Promise<User> {
    return await authService.register(credentials);
  }

  async sendPasswordReset(email: string): Promise<void> {
    await authService.sendPasswordReset(email);
  }

  async logout(): Promise<void> {
    await authService.logout();
  }

  async verifySubscription(userId: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!(user && user.isSubscriptionActive);
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return authService.onAuthChanged(callback);
  }

  // Backwards-compatibility methods
  subscribeToAuthChanges(callback: (user: UserProfile | null) => void): () => void {
    return this.onAuthStateChanged(callback);
  }

  async loginWithEmail(email: string, pass: string): Promise<UserProfile> {
    return this.login({ email, password: pass });
  }

  async registerWithEmail(email: string, pass: string, displayName: string): Promise<UserProfile> {
    return this.register({ email, password: pass, name: displayName });
  }

  async updateUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
    await authService.updateUserProfile(uid, profile);
  }
}

export const authRepository = new AuthRepository();
