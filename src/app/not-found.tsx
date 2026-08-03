import React from 'react';
import Link from 'next/link';
import { Sprout, Home, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6 bg-slate-900 border-slate-800 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg">
          <Sprout className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge variant="emerald">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> 404 - Page Not Found
          </Badge>
          <h1 className="text-3xl font-black tracking-tight text-slate-100">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The page or route you are looking for does not exist or has been relocated to another section.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/dashboard">
            <Button variant="primary" className="w-full py-3 text-xs font-semibold shadow-emerald-900/40">
              <Home className="w-4 h-4 mr-2 inline" /> Return to Health+ Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
