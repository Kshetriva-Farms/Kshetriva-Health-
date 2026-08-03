'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_ROUTES } from '@/lib/constants/routes';
import { Activity, Sparkles, Utensils, Sprout, ShieldCheck, HeartPulse } from 'lucide-react';
import { useAuth } from '@/application/hooks/useAuth';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    { title: 'Overview', href: APP_ROUTES.DASHBOARD, icon: Activity },
    { title: 'Gemini AI Advisor', href: APP_ROUTES.AI_ADVISOR, icon: Sparkles, badge: 'AI' },
    { title: 'Farm-to-Table Recipes', href: APP_ROUTES.RECIPES, icon: Utensils },
    { title: 'Daily Vitals & Hydration', href: APP_ROUTES.VITALS, icon: Sprout },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-stone-200/60 dark:border-stone-800/60 bg-stone-50/50 dark:bg-stone-950/50 min-h-[calc(100vh-4rem)] p-4">
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-lg">
              {user?.displayName?.[0] || 'K'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                {user?.displayName || 'Subscriber'}
              </h4>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 inline" />
                Active Subscription
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Main Menu
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-400 text-stone-950">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Kshetriva Farms Wellness Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900/40 via-teal-900/30 to-stone-900 border border-emerald-500/20 text-emerald-100">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1">
            <HeartPulse className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Harvest Wellness</span>
          </div>
          <p className="text-xs text-stone-300">
            Fresh organic harvest delivering daily enzymatic nutrition.
          </p>
        </div>
      </div>
    </aside>
  );
};
