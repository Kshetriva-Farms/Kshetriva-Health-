'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'amber' | 'teal' | 'rose' | 'stone' | 'slate' | 'blue';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'emerald',
  size = 'md',
  icon,
  ...props
}) => {
  const base = 'inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-sm';

  const variants = {
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
    teal: 'bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300',
    stone: 'bg-stone-500/10 border-stone-500/30 text-stone-700 dark:text-stone-300',
    slate: 'bg-slate-500/10 border-slate-500/30 text-slate-700 dark:text-slate-300',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={cn(base, variants[variant] || variants.emerald, sizes[size], className)} {...props}>
      {icon}
      {children}
    </span>
  );
};
