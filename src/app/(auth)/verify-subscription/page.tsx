'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/application/hooks/useAuth';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { AuthRepository } from '@/infrastructure/repositories/AuthRepository';
import { ShieldCheck, Key, CheckCircle2, Sparkles } from 'lucide-react';
import { APP_ROUTES } from '@/lib/constants/routes';

const authRepo = new AuthRepository();

export default function VerifySubscriptionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [code, setCode] = useState('KSHETRIVA-WEEKLY-108');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (user?.uid) {
        await authRepo.updateUserProfile(user.uid, {
          subscriptionTier: code.includes('VIP') ? 'VIP_HEALTH_PLUS' : 'WEEKLY_BASKET',
          subscriptionActive: true,
        });
      }
      setSuccess(true);
      setTimeout(() => router.push(APP_ROUTES.DASHBOARD), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Subscription verification failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-6">
      <Card className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Key className="w-6 h-6" />
          </div>
          <Badge variant="amber">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
            Kshetriva Basket Linker
          </Badge>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            Verify Vegetable Basket
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Enter your Kshetriva Farms order confirmation code or phone number
          </p>
        </div>

        {success ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-center space-y-2 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-bold text-sm">Basket Verified Successfully!</p>
            <p className="text-xs">Redirecting to your Health+ Dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium border border-red-500/20">
                {error}
              </div>
            )}

            <Input
              label="Subscriber Code / Order ID"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              leftIcon={<Key className="w-4 h-4 text-amber-500" />}
              required
            />

            <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-900 text-xs text-stone-600 dark:text-stone-400 space-y-1">
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Sample Test Codes:
              </p>
              <p>
                • <code className="font-mono">KSHETRIVA-WEEKLY-108</code> (Weekly Basket)
              </p>
              <p>
                • <code className="font-mono">KSHETRIVA-VIP-308</code> (VIP Basket)
              </p>
            </div>

            <Button variant="primary" type="submit" isLoading={loading} className="w-full py-3">
              Verify & Link Subscription
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
