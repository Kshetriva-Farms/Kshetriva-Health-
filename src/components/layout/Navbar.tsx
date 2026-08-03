'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/application/hooks/useAuth';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Button } from '../common/Button';
import { Sprout, Sparkles, Activity, Utensils, User, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Dashboard', href: APP_ROUTES.DASHBOARD, icon: Activity },
    { name: 'Gemini AI', href: APP_ROUTES.AI_ADVISOR, icon: Sparkles },
    { name: 'Farm Recipes', href: APP_ROUTES.RECIPES, icon: Utensils },
    { name: 'Daily Vitals', href: APP_ROUTES.VITALS, icon: Sprout },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/50 dark:border-stone-800/50 bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={APP_ROUTES.HOME} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
              Kshetriva
            </span>
            <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              HEALTH+
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {user?.displayName}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {user?.subscriptionTier.replace('_', ' ')}
                </span>
              </div>
              <button
                onClick={() => logout()}
                className="p-2 rounded-xl text-stone-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href={APP_ROUTES.AUTH.LOGIN}>
              <Button size="sm" variant="primary" leftIcon={<User className="w-4 h-4" />}>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
