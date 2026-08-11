'use client';

import React from 'react';
import { useAuth } from '@/application/hooks/useAuth';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { Lock, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { APP_ROUTES } from '@/lib/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackMessage?: string;
  /** Require an active paid subscription, not just a signed-in account. */
  requireSubscription?: boolean;
  /** Require an admin account (email on the @kshetriva.com domain, matching firestore.rules). */
  requireAdmin?: boolean;
}

const ADMIN_EMAIL_PATTERN = /@kshetriva\.com$/i;

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackMessage = 'Exclusive for Kshetriva Farms Vegetable Basket Subscribers.',
  requireSubscription = false,
  requireAdmin = false,
}) => {
  const { isAuthenticated, loading, loginWithGoogle, user } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-stone-500">Verifying Kshetriva Subscription...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="max-w-xl mx-auto my-12 text-center p-8 space-y-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <Badge variant="amber">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
            Subscriber Access Gate
          </Badge>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            Unlock Full Kshetriva Health+ Access
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">{fallbackMessage}</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/30 text-xs text-emerald-300 border border-emerald-500/20 text-left space-y-1.5">
          <p className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" /> Included Free with Every Farm Basket
          </p>
          <p className="text-stone-300">
            Sign in with your subscriber account to access custom Gemini AI meal plans, daily vitals logging, and farm-fresh organic recipes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={APP_ROUTES.AUTH.LOGIN}>
            <Button variant="primary" className="w-full sm:w-auto">
              Sign In to Continue <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Button variant="secondary" onClick={() => loginWithGoogle()} className="w-full sm:w-auto">
            Quick Sign In with Google
          </Button>
        </div>
      </Card>
    );
  }

  if (requireAdmin && !ADMIN_EMAIL_PATTERN.test(user?.email || '')) {
    return (
      <Card className="max-w-xl mx-auto my-12 text-center p-8 space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-lg">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">Admins Only</h2>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          This area is restricted to Kshetriva Farms team accounts.
        </p>
        <Link href={APP_ROUTES.DASHBOARD || '/dashboard'}>
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </Card>
    );
  }

  if (requireSubscription && !(user?.subscriptionActive || user?.isSubscriptionActive)) {
    return (
      <Card className="max-w-xl mx-auto my-12 text-center p-8 space-y-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <Badge variant="amber">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
            Subscriber-Only Feature
          </Badge>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            Upgrade to Unlock This
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">{fallbackMessage}</p>
        </div>
        <Link href={APP_ROUTES.SUBSCRIPTION || '/subscription'}>
          <Button variant="primary" className="w-full sm:w-auto">
            View Subscription Plans <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </Card>
    );
  }

  return <>{children}</>;
};
