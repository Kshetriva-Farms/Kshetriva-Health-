'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, RefreshCw, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Global Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6 bg-slate-900 border-slate-800 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <Badge variant="rose">
            <Sparkles className="w-3.5 h-3.5 mr-1 inline" /> System Resilience Activated
          </Badge>
          <h1 className="text-2xl font-black tracking-tight text-slate-100">
            Something went wrong
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our system captured a temporary runtime exception. Don't worry, your health data and logs are safe.
          </p>
        </div>

        {error.message && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-rose-300 truncate">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="primary"
            onClick={() => reset()}
            className="flex-1 py-3 text-xs font-semibold"
          >
            <RefreshCw className="w-4 h-4 mr-1.5 inline" /> Try Again
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button
              variant="outline"
              className="w-full py-3 text-xs font-semibold border-slate-700"
            >
              <Home className="w-4 h-4 mr-1.5 inline" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
