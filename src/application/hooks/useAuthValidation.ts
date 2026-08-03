import { useState } from 'react';

export function useAuthValidation() {
  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email address is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters long.';
    return null;
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: 'bg-stone-700' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  return {
    validateEmail,
    validatePassword,
    getPasswordStrength,
  };
}
