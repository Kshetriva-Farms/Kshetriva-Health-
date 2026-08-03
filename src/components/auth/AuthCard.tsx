import React from 'react';
import { Sprout, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Card className="p-8 space-y-6 bg-slate-900/80 dark:bg-slate-900/90 border border-slate-700/60 backdrop-blur-xl shadow-2xl rounded-3xl">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 transform hover:scale-105 transition-transform">
              <Sprout className="w-7 h-7" />
            </div>
            <Badge variant="emerald" className="px-3 py-1">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 inline text-emerald-400" />
              Kshetriva Health+ Secure Auth
            </Badge>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {subtitle}
            </p>
          </div>
          {children}
        </Card>
      </div>
    </div>
  );
};
