import { parseNumeric } from './formatters';

/**
 * Calculate week-over-week percentage change
 */
export function calculateWeekOverWeekChange(
  current: number | string,
  previous: number | string
): number {
  const currentVal = typeof current === 'string' ? parseNumeric(current) : current;
  const previousVal = typeof previous === 'string' ? parseNumeric(previous) : previous;

  if (previousVal === 0) return 0;

  return ((currentVal - previousVal) / previousVal) * 100;
}

/**
 * Determine trend direction based on percentage change
 */
export function getTrendDirection(
  percentChange: number,
  threshold: number = 5
): 'up' | 'down' | 'neutral' {
  if (percentChange > threshold) return 'up';
  if (percentChange < -threshold) return 'down';
  return 'neutral';
}

/**
 * Calculate percentage from two values
 */
export function calculatePercentage(part: number, whole: number): number {
  if (whole === 0) return 0;
  return (part / whole) * 100;
}

/**
 * Get the dominant category from an object of values
 */
export function getDominantCategory<T extends Record<string, number>>(
  categories: T
): keyof T | null {
  const entries = Object.entries(categories);
  if (entries.length === 0) return null;

  const sorted = entries.sort(([, a], [, b]) => b - a);
  return sorted[0][0] as keyof T;
}

/**
 * Calculate average of an array of numbers
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculate sum of an array of numbers
 */
export function sum(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}

/**
 * Format a large number with K/M suffixes
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

/**
 * Calculate relative proportion of each value in an object
 */
export function calculateProportions<T extends Record<string, number>>(
  values: T
): Record<keyof T, number> {
  const total = Object.values(values).reduce((acc, val) => acc + val, 0);
  if (total === 0) {
    return Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = 0;
      return acc;
    }, {} as Record<keyof T, number>);
  }

  return Object.entries(values).reduce((acc, [key, value]) => {
    acc[key as keyof T] = (value / total) * 100;
    return acc;
  }, {} as Record<keyof T, number>);
}
