'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Sparkles, Utensils, Activity, Plus } from 'lucide-react';
import { APP_ROUTES } from '../../lib/constants/routes';
import { cn } from '../../lib/utils';

interface BottomNavProps {
  onQuickAddOpen: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onQuickAddOpen }) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: APP_ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'AI Advisor', href: APP_ROUTES.AI_ADVISOR, icon: Sparkles },
    { label: 'Recipes', href: APP_ROUTES.RECIPES, icon: Utensils },
    { label: 'Vitals', href: APP_ROUTES.VITALS, icon: Activity },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 px-4 py-2 shadow-2xl">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-colors',
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Floating Action Button */}
        <button
          onClick={onQuickAddOpen}
          className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 transform hover:scale-105 active:scale-95 transition-all border-4 border-slate-900"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-colors',
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
