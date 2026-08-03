'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { AuthCard } from '../../../components/auth/AuthCard';
import { useAuth } from '../../../application/context/AuthContext';
import { useAuthValidation } from '../../../application/hooks/useAuthValidation';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { APP_ROUTES } from '../../../lib/constants/routes';

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const { validateEmail } = useAuthValidation();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }

    setEmailError(undefined);
    setLoading(true);

    try {
      await sendPasswordReset(email);
      setSuccessMessage(`A password reset link has been sent to ${email}. Please check your inbox.`);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your registered email address and we will send you instructions to reset your password"
    >
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Registered Email Address"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(undefined);
          }}
          leftIcon={<Mail className="w-4 h-4" />}
          error={emailError}
          required
        />

        <Button variant="primary" type="submit" isLoading={loading} className="w-full py-3">
          Send Reset Instructions
        </Button>
      </form>

      <div className="pt-3 text-center">
        <Link
          href={APP_ROUTES.AUTH.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </div>
    </AuthCard>
  );
}
