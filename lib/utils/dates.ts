import { subWeeks, format } from 'date-fns';

/**
 * Get date N weeks ago
 */
export function getWeeksAgo(weeks: number): Date {
  return subWeeks(new Date(), weeks);
}

/**
 * Get ISO date string for N weeks ago
 */
export function getWeeksAgoISO(weeks: number): string {
  return format(getWeeksAgo(weeks), 'yyyy-MM-dd');
}

/**
 * Get current date as ISO string
 */
export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Sort data by date field
 */
export function sortByDate<T extends { [key: string]: any }>(
  data: T[],
  dateField: keyof T,
  ascending: boolean = true
): T[] {
  return [...data].sort((a, b) => {
    const dateA = new Date(a[dateField]).getTime();
    const dateB = new Date(b[dateField]).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}
