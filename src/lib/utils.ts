import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS class names safely without style conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats ISO date string into friendly readable string.
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats water intake into liters/ml display.
 */
export function formatHydration(ml: number): string {
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(1)} L`;
  }
  return `${ml} ml`;
}
