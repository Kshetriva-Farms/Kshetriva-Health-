'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../application/context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  Utensils,
  Activity,
  User,
  LogOut,
  Sprout,
  ShieldCheck,
  CreditCard,
  ShieldAlert,
  Bell,
  BarChart2,
  Settings,
} from 'lucide-react';
import { NotificationBellWidget } from '../notifications/NotificationBellWidget';
import { APP_ROUTES } from '../../lib/constants/routes';
import { cn } from '../../lib/utils';

export const SidebarNav: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: APP_ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Analytics', href: APP_ROUTES.ANALYTICS, icon: BarChart2 },
    { label: 'AI Advisor', href: APP_ROUTES.AI_ADVISOR, icon: Sparkles },
    { label: 'Healthy Recipes', href: APP_ROUTES.RECIPES, icon: Utensils },
    { label: 'Vitals Log', href: APP_ROUTES.VITALS, icon: Activity },
    { label: 'Subscription', href: APP_ROUTES.SUBSCRIPTION, icon: CreditCard },
    { label: 'Notifications', href: APP_ROUTES.NOTIFICATIONS, icon: Bell },
    { label: 'Admin Panel', href: APP_ROUTES.ADMIN, icon: ShieldAlert },
    { label: 'Profile', href: APP_ROUTES.PROFILE, icon: User },
    { label: 'Settings', href: APP_ROUTES.SETTINGS, icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 min-h-screen sticky top-0 shrink-0 justify-between z-30 shadow-xl">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-100 tracking-tight leading-tight">
                Kshetriva
              </h2>
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> VIP Health+
              </span>
            </div>
          </div>

          <NotificationBellWidget />
        </div>

        {/* Main Nav Links */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Main Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 transition-transform duration-200 group-hover:scale-110',
                    isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer & Logout */}
      <div className="pt-4 border-t border-slate-800 space-y-4">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-800/40 border border-slate-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'K'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-slate-200 truncate">
              {user?.displayName || 'Subscriber'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email || 'pro@kshetriva.com'}</p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
