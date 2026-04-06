/**
 * Utility functions and helpers
 */

/**
 * Generates unique hash codes for objects.
 */
export class HashCode {
  private static _idGenerator = 0;
  private static readonly _objectIds = new WeakMap<object, string>();

  /**
   * Gets a unique identifier for an object.
   * @param obj The object to get an ID for.
   * @returns A unique string identifier.
   */
  static get(obj: unknown): string {
    if (obj === null || obj === undefined) {
      return String(obj);
    }

    if (typeof obj !== 'object') {
      // For primitives, use string representation with type prefix
      return `${typeof obj}:${String(obj)}`;
    }

    // For objects, use WeakMap to store unique ID
    let id = HashCode._objectIds.get(obj as object);
    if (!id) {
      id = `obj_${++HashCode._idGenerator}`;
      HashCode._objectIds.set(obj as object, id);
    }
    return id;
  }

  /**
   * Combines hash codes of multiple values.
   * @param values Values to combine.
   * @returns A combined hash code number.
   */
  static combine(...values: unknown[]): number {
    let hash = 17;
    for (const value of values) {
      const valueHash = HashCode.getHashCode(value);
      hash = (hash * 31 + valueHash) | 0;
    }
    return hash;
  }

  /**
   * Gets a numeric hash code for a value.
   * @param value The value to hash.
   * @returns A numeric hash code.
   */
  private static getHashCode(value: unknown): number {
    if (value === null || value === undefined) {
      return 0;
    }

    const type = typeof value;
    switch (type) {
      case 'boolean':
        return value ? 1 : 0;
      case 'number':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Math.floor(Math.abs(value as number)) % 2147483647;
      case 'string':
        return HashCode.hashString(value as string);
      case 'bigint':
        return Number(value as bigint) % 2147483647;
      case 'object':
        if (value instanceof Date) {
          return value.getTime() % 2147483647;
        }
        // For objects, use a simplified hash based on keys
        if (Array.isArray(value)) {
          return HashCode.combine(...value);
        }
        return HashCode.hashString(HashCode.get(value));
      default:
        return 0;
    }
  }

  /**
   * Computes a hash code for a string.
   * @param str The string to hash.
   * @returns A numeric hash code.
   */
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash + char) | 0;
    }
    return Math.abs(hash) % 2147483647;
  }
}

/**
 * Checks if a value is a Date object.
 * @param value The value to check.
 * @returns True if the value is a Date.
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Checks if a value is null or undefined.
 * @param value The value to check.
 * @returns True if null or undefined.
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Gets a comparator function for a value type.
 * @param value A sample value to determine the type.
 * @returns A comparator function appropriate for the type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getComparator(value: any): (a: unknown, b: unknown) => number {
  if (typeof value === 'string') {
    return stringComparator;
  }
  if (typeof value === 'number') {
    return numberComparator;
  }
  if (typeof value === 'boolean') {
    return booleanComparator;
  }
  if (isDate(value)) {
    return dateComparator;
  }
  return defaultComparator;
}

/**
 * Gets an equality comparer function for a value type.
 * @param value A sample value to determine the type.
 * @returns An equality comparer function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getEqualityComparer(value: any): (a: unknown, b: unknown) => boolean {
  if (typeof value === 'number' && isNaN(value)) {
    return (a, b) => typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
  }
  return (a, b) => a === b;
}

/**
 * Compares two strings.
 * @param a First string.
 * @param b Second string.
 * @returns Comparison result (-1, 0, 1).
 */
export function stringComparator(a: unknown, b: unknown): number {
  const s1 = String(a);
  const s2 = String(b);
  if (s1 < s2) return -1;
  if (s1 > s2) return 1;
  return 0;
}

/**
 * Compares two numbers.
 * @param a First number.
 * @param b Second number.
 * @returns Comparison result (-1, 0, 1).
 */
export function numberComparator(a: unknown, b: unknown): number {
  const n1 = Number(a);
  const n2 = Number(b);
  if (n1 < n2) return -1;
  if (n1 > n2) return 1;
  return 0;
}

/**
 * Compares two booleans.
 * @param a First boolean.
 * @param b Second boolean.
 * @returns Comparison result (-1, 0, 1).
 */
export function booleanComparator(a: unknown, b: unknown): number {
  const b1 = Boolean(a);
  const b2 = Boolean(b);
  if (b1 === b2) return 0;
  return b1 ? 1 : -1;
}

/**
 * Compares two Dates.
 * @param a First Date.
 * @param b Second Date.
 * @returns Comparison result (-1, 0, 1).
 */
export function dateComparator(a: unknown, b: unknown): number {
  const d1 = a instanceof Date ? a.getTime() : 0;
  const d2 = b instanceof Date ? b.getTime() : 0;
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

/**
 * Default comparator for unknown types.
 * @param a First value.
 * @param b Second value.
 * @returns Comparison result (-1, 0, 1).
 */
function defaultComparator(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  const s1 = String(a);
  const s2 = String(b);
  if (s1 < s2) return -1;
  if (s1 > s2) return 1;
  return 0;
}

/**
 * Repeats a string pattern a specified number of times.
 * @param pattern The string to repeat.
 * @param count The number of times to repeat.
 * @returns The repeated string.
 */
export function stringRepeat(pattern: string, count: number): string {
  if (count < 0) {
    throw new Error('Count cannot be negative');
  }
  if (count === 0) {
    return '';
  }
  return pattern.repeat(count);
}

/**
 * Formats a number with a format string.
 * Supports basic .NET-style format specifiers.
 * @param n The number to format.
 * @param format The format string.
 * @returns The formatted string.
 */
export function formatNumber(n: number, format: string): string {
  if (!format || format === 'G' || format === 'g') {
    return String(n);
  }

  // Handle standard numeric format strings
  const match = format.match(/^([CDEFGNP])(\d*)$/i);
  if (match) {
    const specifier = match[1].toUpperCase();
    const precision = match[2] ? parseInt(match[2], 10) : 2;

    switch (specifier) {
      case 'C': // Currency
        return n.toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        });
      case 'D': // Decimal
        return Math.floor(n).toString().padStart(precision, '0');
      case 'E': // Exponential
        return n.toExponential(precision);
      case 'F': // Fixed-point
        return n.toFixed(precision);
      case 'N': // Number
        return n.toLocaleString(undefined, {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        });
      case 'P': // Percent
        return n.toLocaleString(undefined, {
          style: 'percent',
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        });
      case 'G': // General
      default:
        return String(n);
    }
  }

  // Custom numeric format - simplified implementation
  return String(n);
}
