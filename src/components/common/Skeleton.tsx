'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-stone-200 dark:bg-stone-800/80',
        className
      )}
      {...props}
    />
  );
};
