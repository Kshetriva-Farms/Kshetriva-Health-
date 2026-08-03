'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/application/hooks/useAuth';
import { ShieldCheck, Mail, Lock, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await registerWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
          {isRegister ? 'Join Kshetriva Health+' : 'Subscriber Login'}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Access your personalized organic produce nutrition & Gemini AI advisor
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium border border-red-500/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            required
          />
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="subscriber@kshetrivafarms.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <Button variant="primary" type="submit" isLoading={loading} className="w-full py-3">
          {isRegister ? 'Create Account & Verify' : 'Sign In'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200 dark:border-stone-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-stone-900 px-2 text-stone-400 font-semibold">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="secondary"
        onClick={handleGoogleSignIn}
        isLoading={loading}
        className="w-full gap-2 py-2.5"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Google Authentication
      </Button>

      <div className="mt-6 text-center text-xs text-stone-500">
        {isRegister ? 'Already registered?' : "Don't have an account yet?"}{' '}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {isRegister ? 'Sign In' : 'Register Here'}
        </button>
      </div>
    </Modal>
  );
};
