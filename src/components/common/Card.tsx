'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'bordered';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'glass',
  hoverEffect = true,
  ...props
}) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-300 relative overflow-hidden';

  const variants = {
    glass:
      'bg-white/80 dark:bg-stone-900/60 backdrop-blur-xl border border-stone-200/60 dark:border-stone-800/60 shadow-xl shadow-emerald-950/5',
    solid:
      'bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-md',
    bordered:
      'bg-transparent border-2 border-emerald-500/20 dark:border-emerald-500/30',
  };

  const hoverStyles = hoverEffect
    ? 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/10 hover:border-emerald-500/40'
    : '';

  return (
    <div className={cn(baseStyles, variants[variant], hoverStyles, className)} {...props}>
      {children}
    </div>
  );
};
