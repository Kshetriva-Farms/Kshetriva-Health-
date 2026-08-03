'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { AuthCard } from '../../../components/auth/AuthCard';
import { useAuth } from '../../../application/context/AuthContext';
import { useAuthValidation } from '../../../application/hooks/useAuthValidation';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { APP_ROUTES } from '../../../lib/constants/routes';

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithEmail, loginWithGoogle } = useAuth();
  const { validateEmail, validatePassword, getPasswordStrength } = useAuthValidation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const passwordStrength = getPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const nameErr = !name.trim() ? 'Full Name is required.' : null;
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = password !== confirmPassword ? 'Passwords do not match.' : null;
    const termsErr = !termsAgreed ? 'You must agree to the Terms of Service.' : null;

    if (nameErr || emailErr || passErr || confirmErr || termsErr) {
      setFormErrors({
        name: nameErr || undefined,
        email: emailErr || undefined,
        password: passErr || undefined,
        confirmPassword: confirmErr || undefined,
        terms: termsErr || undefined,
      });
      return;
    }

    setFormErrors({});
    setLoading(true);

    try {
      await registerWithEmail(email, password, name);
      router.push(APP_ROUTES.AUTH.PROFILE_CREATION);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      router.push(APP_ROUTES.AUTH.PROFILE_CREATION);
    } catch (err: any) {
      setError(err.message || 'Google registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create Your Account"
      subtitle="Join Kshetriva Health+ for AI-driven nutrition advice, vitals tracking & personalized wellness"
    >
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
          }}
          leftIcon={<UserIcon className="w-4 h-4" />}
          error={formErrors.name}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
          }}
          leftIcon={<Mail className="w-4 h-4" />}
          error={formErrors.email}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: undefined }));
            }}
            leftIcon={<Lock className="w-4 h-4" />}
            error={formErrors.password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {password && (
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Password Strength</span>
              <span className="font-semibold text-slate-200">{passwordStrength.label}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        <Input
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (formErrors.confirmPassword) setFormErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          leftIcon={<Lock className="w-4 h-4" />}
          error={formErrors.confirmPassword}
          required
        />

        <div className="space-y-1">
          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-300 pt-1">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => {
                setTermsAgreed(e.target.checked);
                if (formErrors.terms) setFormErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/40"
            />
            <span className="leading-tight">
              I agree to the{' '}
              <a href="#" className="text-emerald-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-emerald-400 hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {formErrors.terms && <p className="text-[11px] text-rose-400">{formErrors.terms}</p>}
        </div>

        <Button variant="primary" type="submit" isLoading={loading} className="w-full py-3">
          Create Account & Continue <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900 px-3 text-slate-500 font-semibold">
            Or sign up with
          </span>
        </div>
      </div>

      <Button
        variant="glass"
        type="button"
        onClick={handleGoogleRegister}
        isLoading={loading}
        className="w-full gap-2.5 py-2.5 text-xs font-semibold"
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
        Sign up with Google
      </Button>

      <div className="pt-2 text-center text-xs text-slate-400">
        Already registered?{' '}
        <Link
          href={APP_ROUTES.AUTH.LOGIN}
          className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
        >
          Sign In
        </Link>
      </div>
    </AuthCard>
  );
}
