import { format } from 'date-fns';

/**
 * Format a number as percentage with specified decimal places
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a large number with commas
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string, formatStr: string = 'MMM d, yyyy'): string {
  try {
    return format(new Date(dateString), formatStr);
  } catch {
    return dateString;
  }
}

/**
 * Parse a potentially string or number value to a number
 */
export function parseNumeric(value: string | number): number {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}
