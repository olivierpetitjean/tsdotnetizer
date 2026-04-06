/**
 * tsDotnetizer - A TypeScript library that brings .NET Framework APIs to JavaScript/TypeScript
 *
 * @packageDocumentation
 */

// Core types and utilities
export {
  DayOfWeek,
  StringSplitOptions,
  type IEqualityComparer,
  type IPredicate,
  type ISelector,
  type IComparator,
  Index,
  Range,
  CultureInfo,
  HashCode,
  isDate,
  isNullOrUndefined,
  getComparator,
  getEqualityComparer,
  stringComparator,
  numberComparator,
  booleanComparator,
  dateComparator,
  stringRepeat,
  formatNumber,
} from './core';

// LINQ
export {
  type IGrouping,
  type IOrderedEnumerable,
  type ILinqEnumerable,
  LinqEnumerable,
  OrderedEnumerable,
  extendArrayPrototype,
  asEnumerable,
  range,
  repeat,
  empty,
} from './linq';

// Collections
export {
  type IEnumerator,
  type IEnumerable,
  type IKeyValuePair,
  type IDictionary,
  type ISet,
  Dictionary,
  HashSet,
} from './collections';

// Date/DateTime
export {
  addMilliseconds,
  addSeconds,
  addMinutes,
  addHours,
  addDays,
  addMonths,
  addYears,
  compareDates,
  getDate,
  getYear,
  getMonth,
  getDay,
  getDayOfWeek,
  getHour,
  getMinute,
  getSecond,
  getMillisecond,
  isLeapYear,
  daysInMonth,
  now,
  today,
  formatDate,
  DateTime,
} from './date';

// String
export {
  startsWith,
  endsWith,
  contains,
  compareStrings,
  compareTo,
  padLeft,
  padRight,
  replace,
  split,
  isNullOrEmpty,
  isNullOrWhiteSpace,
  format,
  join,
  toString,
  empty as stringEmpty,
  StringClass,
} from './string';

// Number
export {
  format as formatNumberDirect,
  parseNumber,
  tryParseNumber,
  isValidNumber,
  clamp,
  NumberClass,
} from './number';

// Array/List
export {
  add,
  addRange,
  clear,
  findIndex,
  findLastIndex,
  insert,
  remove,
  removeAll,
  removeAt,
  clone,
  List,
} from './array';

// Diagnostics
export { StopWatch } from './diagnostics';

/**
 * Library version
 */
export const VERSION = '1.0.0';

/**
 * Extends the global Array prototype with LINQ methods.
 * Call this function to enable array.Where(), array.Select(), etc.
 *
 * @example
 * ```typescript
 * import { enableArrayExtensions } from 'tsdotnetizer';
 * enableArrayExtensions();
 *
 * const result = [1, 2, 3].where(x => x > 1).toArray();
 * ```
 */
export function enableArrayExtensions(): void {
  const { extendArrayPrototype } = require('./linq');
  extendArrayPrototype();
}
