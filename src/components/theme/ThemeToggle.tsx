'use client';

import React from 'react';
import { useTheme } from '@/application/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl transition-all duration-300 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-amber-400 border border-stone-200/60 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      aria-label="Toggle Dark/Light Mode"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12 text-stone-700" />
      )}
    </button>
  );
};
