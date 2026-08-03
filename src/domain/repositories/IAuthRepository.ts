import { User } from '../entities/User';

export interface AuthCredentials {
  email?: string;
  password?: string;
}

export interface IAuthRepository {
  getCurrentUser(): Promise<User | null>;
  login(credentials: AuthCredentials): Promise<User>;
  loginWithGoogle(): Promise<User>;
  register(credentials: AuthCredentials & { name: string }): Promise<User>;
  sendPasswordReset(email: string): Promise<void>;
  logout(): Promise<void>;
  verifySubscription(userId: string): Promise<boolean>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
