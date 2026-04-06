/**
 * String extensions and utilities
 */

import { StringSplitOptions } from '../core';

/**
 * Checks if a string starts with a specified substring.
 * @param str The string.
 * @param searchString The substring.
 * @returns true if starts with.
 */
export function startsWith(str: string, searchString: string): boolean {
  return str.startsWith(searchString);
}

/**
 * Checks if a string ends with a specified substring.
 * @param str The string.
 * @param searchString The substring.
 * @returns true if ends with.
 */
export function endsWith(str: string, searchString: string): boolean {
  return str.endsWith(searchString);
}

/**
 * Checks if a string contains a specified substring.
 * @param str The string.
 * @param searchString The substring.
 * @returns true if contains.
 */
export function contains(str: string, searchString: string): boolean {
  return str.includes(searchString);
}

/**
 * Compares two strings.
 * @param str1 First string.
 * @param str2 Second string.
 * @returns Comparison result.
 */
export function compareStrings(str1: string, str2: string): number {
  if (str1 < str2) return -1;
  if (str1 > str2) return 1;
  return 0;
}

/**
 * Compares this string with another.
 * @param str The string.
 * @param other The other string.
 * @returns Comparison result.
 */
export function compareTo(str: string, other: string): number {
  return compareStrings(str, other);
}

/**
 * Pads a string on the left.
 * @param str The string.
 * @param totalWidth The total width.
 * @param paddingChar The padding character (default space).
 * @returns The padded string.
 */
export function padLeft(str: string, totalWidth: number, paddingChar = ' '): string {
  if (str.length >= totalWidth) return str;
  return str.padStart(totalWidth, paddingChar);
}

/**
 * Pads a string on the right.
 * @param str The string.
 * @param totalWidth The total width.
 * @param paddingChar The padding character (default space).
 * @returns The padded string.
 */
export function padRight(str: string, totalWidth: number, paddingChar = ' '): string {
  if (str.length >= totalWidth) return str;
  return str.padEnd(totalWidth, paddingChar);
}

/**
 * Replaces all occurrences of a substring.
 * @param str The string.
 * @param oldValue The substring to replace.
 * @param newValue The replacement.
 * @returns The modified string.
 */
export function replace(str: string, oldValue: string, newValue: string): string {
  return str.split(oldValue).join(newValue);
}

/**
 * Splits a string.
 * @param str The string.
 * @param separator The separator.
 * @param options Split options.
 * @returns An array of substrings.
 */
export function split(str: string, separator: string, options = StringSplitOptions.None): string[] {
  const parts = str.split(separator);
  if (options === StringSplitOptions.RemoveEmptyEntries) {
    return parts.filter(p => p.length > 0);
  }
  return parts;
}

/**
 * Checks if a string is null, undefined, or empty.
 * @param str The string.
 * @returns true if null or empty.
 */
export function isNullOrEmpty(str: string | null | undefined): boolean {
  return str === null || str === undefined || str.length === 0;
}

/**
 * Checks if a string is null, undefined, empty, or whitespace only.
 * @param str The string.
 * @returns true if null or whitespace.
 */
export function isNullOrWhiteSpace(str: string | null | undefined): boolean {
  return str === null || str === undefined || str.trim().length === 0;
}

/**
 * Formats a string with placeholders.
 * Replaces {0}, {1}, etc. with corresponding arguments.
 * @param format The format string.
 * @param args The arguments.
 * @returns The formatted string.
 */
export function format(format: string, ...args: unknown[]): string {
  return format.replace(/\{(\d+)\}/g, (match, index) => {
    const i = parseInt(index, 10);
    return i < args.length ? String(args[i]) : match;
  });
}

/**
 * Joins strings with a separator.
 * @param separator The separator.
 * @param values The values to join.
 * @returns The joined string.
 */
export function join(separator: string, values: Iterable<unknown>): string {
  const parts: string[] = [];
  for (const value of values) {
    parts.push(String(value));
  }
  return parts.join(separator);
}

/**
 * Converts a value to a string.
 * @param value The value.
 * @returns The string representation.
 */
export function toString(value: unknown): string {
  if (value === null) return '';
  if (value === undefined) return '';
  return String(value);
}

/**
 * Empty string constant.
 */
export const empty = '';

/**
 * String class with static methods (similar to .NET String).
 */
export class StringClass {
  /**
   * Empty string.
   */
  static get empty(): string {
    return empty;
  }

  /**
   * Checks if a string is null or empty.
   * @param str The string.
   * @returns true if null or empty.
   */
  static isNullOrEmpty(str: string | null | undefined): boolean {
    return isNullOrEmpty(str);
  }

  /**
   * Checks if a string is null or whitespace.
   * @param str The string.
   * @returns true if null or whitespace.
   */
  static isNullOrWhiteSpace(str: string | null | undefined): boolean {
    return isNullOrWhiteSpace(str);
  }

  /**
   * Compares two strings.
   * @param str1 First string.
   * @param str2 Second string.
   * @returns Comparison result.
   */
  static compare(str1: string, str2: string): number {
    return compareStrings(str1, str2);
  }

  /**
   * Formats a string.
   * @param format The format string.
   * @param args The arguments.
   * @returns The formatted string.
   */
  static format(format: string, ...args: unknown[]): string {
    return formatString(format, ...args);
  }

  /**
   * Joins strings.
   * @param separator The separator.
   * @param values The values.
   * @returns The joined string.
   */
  static join(separator: string, values: Iterable<unknown>): string {
    return join(separator, values);
  }

  /**
   * Concatenates strings.
   * @param values The values.
   * @returns The concatenated string.
   */
  static concat(...values: unknown[]): string {
    return values.map(String).join('');
  }
}

// Alias for format
const formatString = format;
