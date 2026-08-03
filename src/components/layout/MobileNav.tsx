'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, ShoppingBag, Activity, Utensils } from 'lucide-react';
import { APP_ROUTES } from '@/lib/constants/routes';

export const MobileNav = () => {
  const pathname = usePathname();

  const items = [
    { label: 'Home', href: APP_ROUTES.HOME, icon: Home },
    { label: 'AI Advisor', href: APP_ROUTES.AI_ADVISOR, icon: Sparkles },
    { label: 'Harvest', href: APP_ROUTES.FARM_BASKET, icon: ShoppingBag },
    { label: 'Vitals', href: APP_ROUTES.VITALS, icon: Activity },
    { label: 'Recipes', href: APP_ROUTES.RECIPES, icon: Utensils },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-900/90 dark:bg-stone-950/90 backdrop-blur-xl border-t border-stone-800 px-4 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-1 transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
