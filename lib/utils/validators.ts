/**
 * Validate if a value is a valid number
 */
export function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Validate if a string is a valid date
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate if an array has data
 */
export function hasData<T>(arr: T[] | undefined | null): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Sanitize state code to uppercase 2-letter format
 */
export function sanitizeStateCode(state: string | undefined): string | undefined {
  if (!state) return undefined;
  const cleaned = state.trim().toUpperCase();
  return cleaned.length === 2 ? cleaned : undefined;
}
