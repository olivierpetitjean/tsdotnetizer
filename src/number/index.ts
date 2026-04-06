/**
 * Number extensions and utilities
 */

import { formatNumber as formatNum } from '../core';

/**
 * Formats a number.
 * @param num The number.
 * @param format The format string.
 * @returns The formatted string.
 */
export function format(num: number, format?: string): string {
  if (!format) {
    return String(num);
  }
  return formatNum(num, format);
}

/**
 * Parses a number from a string.
 * @param str The string.
 * @returns The number, or NaN if invalid.
 */
export function parseNumber(str: string): number {
  const trimmed = str.trim();
  if (trimmed === '') {
    return NaN;
  }
  const parsed = Number(trimmed);
  return parsed;
}

/**
 * Tries to parse a number.
 * @param str The string.
 * @returns A tuple [success, number].
 */
export function tryParseNumber(str: string): [boolean, number] {
  const parsed = parseNumber(str);
  return [!isNaN(parsed), parsed];
}

/**
 * Checks if a value is a valid number.
 * @param value The value.
 * @returns true if valid number.
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Clamps a number between min and max.
 * @param value The value.
 * @param min The minimum.
 * @param max The maximum.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Number class with static methods (similar to .NET).
 */
export class NumberClass {
  /**
   * Parses a number.
   * @param str The string.
   * @returns The number.
   * @throws {Error} If invalid.
   */
  static parse(str: string): number {
    const parsed = parseNumber(str);
    if (isNaN(parsed)) {
      throw new Error('Input string was not in a correct format');
    }
    return parsed;
  }

  /**
   * Tries to parse a number.
   * @param str The string.
   * @returns A tuple [success, number].
   */
  static tryParse(str: string): [boolean, number] {
    return tryParseNumber(str);
  }

  /**
   * Checks if a value is a valid number.
   * @param value The value.
   * @returns true if valid.
   */
  static isValid(value: unknown): value is number {
    return isValidNumber(value);
  }

  /**
   * Clamps a value.
   * @param value The value.
   * @param min The minimum.
   * @param max The maximum.
   * @returns The clamped value.
   */
  static clamp(value: number, min: number, max: number): number {
    return clamp(value, min, max);
  }

  /**
   * The maximum finite value.
   */
  static get maxValue(): number {
    return Number.MAX_VALUE;
  }

  /**
   * The minimum finite value.
   */
  static get minValue(): number {
    return Number.MIN_VALUE;
  }

  /**
   * Positive infinity.
   */
  static get positiveInfinity(): number {
    return Infinity;
  }

  /**
   * Negative infinity.
   */
  static get negativeInfinity(): number {
    return -Infinity;
  }

  /**
   * Not-a-Number.
   */
  static get NaN(): number {
    return NaN;
  }
}
