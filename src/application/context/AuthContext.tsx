'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../../domain/entities/User';
import { authRepository } from '../../infrastructure/repositories/AuthRepository';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<UserProfile>;
  loginWithEmail: (email: string, pass: string, rememberMe?: boolean) => Promise<UserProfile>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<UserProfile>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = authRepository.subscribeToAuthChanges((profile: UserProfile | null) => {
      setUser(profile);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const profile = await authRepository.loginWithGoogle();
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string, rememberMe: boolean = false) => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {
        if (rememberMe) {
          localStorage.setItem('kshetriva_remember_email', email);
        } else {
          localStorage.removeItem('kshetriva_remember_email');
        }
      }
      const profile = await authRepository.loginWithEmail(email, pass);
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const profile = await authRepository.registerWithEmail(email, pass, name);
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    await authRepository.sendPasswordReset(email);
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (user) {
      await authRepository.updateUserProfile(user.uid || user.id || '', profile);
      setUser((prev) => (prev ? { ...prev, ...profile } : null));
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authRepository.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        sendPasswordReset,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export function useAuth() {
  return useAuthContext();
}
