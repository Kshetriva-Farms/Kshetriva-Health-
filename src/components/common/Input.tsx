'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="absolute left-3.5 text-stone-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full rounded-xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 px-4 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:ring-red-500/50',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 text-stone-400 cursor-pointer">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <span className="text-xs text-red-500 font-medium mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
