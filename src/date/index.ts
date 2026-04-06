/**
 * Date/DateTime extensions and utilities
 */

import { DayOfWeek } from '../core';

/**
 * Adds milliseconds to a date.
 * @param date The date.
 * @param value Milliseconds to add.
 * @returns A new Date.
 */
export function addMilliseconds(date: Date, value: number): Date {
  const result = new Date(date);
  result.setMilliseconds(result.getMilliseconds() + value);
  return result;
}

/**
 * Adds seconds to a date.
 * @param date The date.
 * @param value Seconds to add.
 * @returns A new Date.
 */
export function addSeconds(date: Date, value: number): Date {
  const result = new Date(date);
  result.setSeconds(result.getSeconds() + value);
  return result;
}

/**
 * Adds minutes to a date.
 * @param date The date.
 * @param value Minutes to add.
 * @returns A new Date.
 */
export function addMinutes(date: Date, value: number): Date {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + value);
  return result;
}

/**
 * Adds hours to a date.
 * @param date The date.
 * @param value Hours to add.
 * @returns A new Date.
 */
export function addHours(date: Date, value: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + value);
  return result;
}

/**
 * Adds days to a date.
 * @param date The date.
 * @param value Days to add.
 * @returns A new Date.
 */
export function addDays(date: Date, value: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + value);
  return result;
}

/**
 * Adds months to a date.
 * @param date The date.
 * @param value Months to add.
 * @returns A new Date.
 */
export function addMonths(date: Date, value: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + value);
  return result;
}

/**
 * Adds years to a date.
 * @param date The date.
 * @param value Years to add.
 * @returns A new Date.
 */
export function addYears(date: Date, value: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + value);
  return result;
}

/**
 * Compares two dates.
 * @param d1 First date.
 * @param d2 Second date.
 * @returns Negative if d1 < d2, 0 if equal, positive if d1 > d2.
 */
export function compareDates(d1: Date, d2: Date): number {
  const t1 = d1.getTime();
  const t2 = d2.getTime();
  if (t1 < t2) return -1;
  if (t1 > t2) return 1;
  return 0;
}

/**
 * Gets the date component (time set to midnight).
 * @param date The date.
 * @returns A new Date with time at midnight.
 */
export function getDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Gets the year component.
 * @param date The date.
 * @returns The year.
 */
export function getYear(date: Date): number {
  return date.getFullYear();
}

/**
 * Gets the month component (1-12).
 * @param date The date.
 * @returns The month (1-12).
 */
export function getMonth(date: Date): number {
  return date.getMonth() + 1;
}

/**
 * Gets the day of month.
 * @param date The date.
 * @returns The day (1-31).
 */
export function getDay(date: Date): number {
  return date.getDate();
}

/**
 * Gets the day of week.
 * @param date The date.
 * @returns The DayOfWeek enum value.
 */
export function getDayOfWeek(date: Date): DayOfWeek {
  return date.getDay() as DayOfWeek;
}

/**
 * Gets the hour component.
 * @param date The date.
 * @returns The hour (0-23).
 */
export function getHour(date: Date): number {
  return date.getHours();
}

/**
 * Gets the minute component.
 * @param date The date.
 * @returns The minute (0-59).
 */
export function getMinute(date: Date): number {
  return date.getMinutes();
}

/**
 * Gets the second component.
 * @param date The date.
 * @returns The second (0-59).
 */
export function getSecond(date: Date): number {
  return date.getSeconds();
}

/**
 * Gets the millisecond component.
 * @param date The date.
 * @returns The millisecond (0-999).
 */
export function getMillisecond(date: Date): number {
  return date.getMilliseconds();
}

/**
 * Checks if a year is a leap year.
 * @param year The year.
 * @returns true if leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Gets the number of days in a month.
 * @param year The year.
 * @param month The month (1-12).
 * @returns The number of days.
 */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Gets the current date and time.
 * @returns A new Date with current date and time.
 */
export function now(): Date {
  return new Date();
}

/**
 * Gets the current date (time at midnight).
 * @returns A new Date with current date and time at midnight.
 */
export function today(): Date {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Formats a date with a format string.
 * Supports .NET-style format strings (simplified).
 * @param date The date.
 * @param format The format string.
 * @returns The formatted string.
 */
export function formatDate(date: Date, format: string): string {
  if (!format || format === 'G') {
    return date.toLocaleString();
  }
  if (format === 'D') {
    return date.toLocaleDateString();
  }
  if (format === 'T') {
    return date.toLocaleTimeString();
  }
  if (format === 'd') {
    const y = String(date.getFullYear());
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  if (format === 's') {
    // Sortable: ISO 8601 using local time (matches .NET DateTime.ToString("s"))
    const y = String(date.getFullYear());
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}-${mo}-${d}T${h}:${mi}:${s}`;
  }

  // Custom format
  const tokens: Record<string, () => string> = {
    yyyy: () => String(date.getFullYear()),
    MM: () => String(date.getMonth() + 1).padStart(2, '0'),
    dd: () => String(date.getDate()).padStart(2, '0'),
    HH: () => String(date.getHours()).padStart(2, '0'),
    mm: () => String(date.getMinutes()).padStart(2, '0'),
    ss: () => String(date.getSeconds()).padStart(2, '0'),
    fff: () => String(date.getMilliseconds()).padStart(3, '0'),
  };

  let result = format;
  for (const [token, fn] of Object.entries(tokens)) {
    result = result.replace(token, fn());
  }
  return result;
}

/**
 * DateTime class with static methods (similar to .NET DateTime).
 */
export class DateTime {
  /**
   * Gets the current date and time.
   */
  static get now(): Date {
    return now();
  }

  /**
   * Gets the current date.
   */
  static get today(): Date {
    return today();
  }

  /**
   * Checks if a year is a leap year.
   * @param year The year.
   * @returns true if leap year.
   */
  static isLeapYear(year: number): boolean {
    return isLeapYear(year);
  }

  /**
   * Gets the number of days in a month.
   * @param year The year.
   * @param month The month (1-12).
   * @returns The number of days.
   */
  static daysInMonth(year: number, month: number): number {
    return daysInMonth(year, month);
  }

  /**
   * Compares two dates.
   * @param d1 First date.
   * @param d2 Second date.
   * @returns Comparison result.
   */
  static compare(d1: Date, d2: Date): number {
    return compareDates(d1, d2);
  }

  /**
   * Creates a new Date from year, month, day.
   * @param year The year.
   * @param month The month (1-12).
   * @param day The day (1-31).
   * @returns A new Date.
   */
  static fromYMD(year: number, month: number, day: number): Date {
    return new Date(year, month - 1, day);
  }

  /**
   * Parses a date string.
   * @param value The string to parse.
   * @returns A Date, or undefined if invalid.
   */
  static parse(value: string): Date | undefined {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return undefined;
    }
    return date;
  }

  /**
   * Tries to parse a date string.
   * @param value The string to parse.
   * @returns A tuple [success, date].
   */
  static tryParse(value: string): [boolean, Date | undefined] {
    const date = DateTime.parse(value);
    return [date !== undefined, date];
  }
}
