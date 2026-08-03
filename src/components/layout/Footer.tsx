'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, Heart } from 'lucide-react';
import { APP_ROUTES } from '@/lib/constants/routes';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-stone-200/60 dark:border-stone-800/60 bg-stone-50 dark:bg-stone-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-emerald-600 to-teal-400 bg-clip-text text-transparent">
                Kshetriva Health+
              </span>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm">
              Empowering Kshetriva Farms subscribers with farm-fresh organic nutrition recommendations, personalized Gemini AI meal planning, and daily vital tracking.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li>
                <Link href={APP_ROUTES.DASHBOARD} className="hover:text-emerald-500 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href={APP_ROUTES.AI_ADVISOR} className="hover:text-emerald-500 transition-colors">
                  Gemini AI Advisor
                </Link>
              </li>
              <li>
                <Link href={APP_ROUTES.RECIPES} className="hover:text-emerald-500 transition-colors">
                  Farm Recipes
                </Link>
              </li>
              <li>
                <Link href={APP_ROUTES.VITALS} className="hover:text-emerald-500 transition-colors">
                  Daily Vitals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-4">
              Subscribe & Connect
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
              Weekly organic harvest delivered direct from Kshetriva Farms.
            </p>
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              🌱 Certified Organic Farming
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-200/40 dark:border-stone-800/40 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Kshetriva Farms Health+. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for clean organic living.
          </p>
        </div>
      </div>
    </footer>
  );
};
