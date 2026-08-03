import { authRepository } from '../../infrastructure/repositories/AuthRepository';

export async function signInWithGoogle() {
  return authRepository.login({ email: 'google-user@kshetriva.com' });
}

export async function loginWithEmail(email: string, pass: string) {
  return authRepository.login({ email, password: pass });
}

export async function registerWithEmail(email: string, pass: string, name: string) {
  return authRepository.register({ email, password: pass, name });
}

export async function updateUserSubscription(uid: string, code: string): Promise<boolean> {
  return authRepository.verifySubscription(uid);
}

export async function logoutUser() {
  return authRepository.logout();
}
