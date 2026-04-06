/**
 * Core types and interfaces for tsDotnetizer
 * Provides fundamental abstractions matching .NET patterns
 */

/**
 * Specifies the day of the week.
 */
export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

/**
 * Specifies whether applicable String.Split method overloads include or omit empty substrings from the return value.
 */
export enum StringSplitOptions {
  None = 0,
  RemoveEmptyEntries = 1,
}

/**
 * Defines methods to support the comparison of objects for equality.
 * @template T The type of objects to compare.
 */
export type IEqualityComparer<T> = (a: T, b: T) => boolean;

/**
 * Defines methods to indicate if an object match a predicate.
 * @template T The type of object to test.
 */
export type IPredicate<T> = (value: T) => boolean;

/**
 * Defines methods to select a value from an object.
 * @template T The type of source object.
 * @template TResult The type of result value.
 */
export type ISelector<T, TResult> = (value: T) => TResult;

/**
 * Defines methods to select a value from an object with its index.
 * @template T The type of source object.
 * @template TResult The type of result value.
 */
export type ISelectorWithIndex<T, TResult> = (value: T, index: number) => TResult;

/**
 * Defines a method to compare two objects.
 * Returns a negative number if a < b, zero if a === b, positive if a > b.
 * @template T The type of objects to compare.
 */
export type IComparator<T> = (a: T, b: T) => number;

/**
 * Represents an index from the start or the end of a collection.
 * Similar to .NET's Index type.
 */
export class Index {
  private readonly _value: number;
  private readonly _fromEnd: boolean;

  /**
   * Creates a new Index.
   * @param value The index value.
   * @param fromEnd Whether the index is from the end (true) or from the start (false).
   */
  constructor(value: number, fromEnd = false) {
    if (!Number.isInteger(value)) {
      throw new Error('Index value must be an integer');
    }
    if (value < 0) {
      throw new Error('Index value must be non-negative');
    }
    this._value = value;
    this._fromEnd = fromEnd;
  }

  /**
   * Gets the index value.
   */
  get value(): number {
    return this._value;
  }

  /**
   * Gets a value indicating whether the index is from the end.
   */
  get isFromEnd(): boolean {
    return this._fromEnd;
  }

  /**
   * Gets an Index from the start.
   * @param value The zero-based index from the start.
   */
  static fromStart(value: number): Index {
    return new Index(value, false);
  }

  /**
   * Gets an Index from the end.
   * @param value The index from the end (1 means last element).
   */
  static fromEnd(value: number): Index {
    return new Index(value, true);
  }

  /**
   * Calculates the actual offset for a given collection length.
   * @param length The length of the collection.
   * @returns The zero-based index.
   */
  getOffset(length: number): number {
    if (this._fromEnd) {
      return length - this._value;
    }
    return this._value;
  }

  /**
   * Converts the Index to a string representation.
   */
  toString(): string {
    return this._fromEnd ? `^${this._value}` : `${this._value}`;
  }
}

/**
 * Represents a range with a start and end index.
 * Similar to .NET's Range type.
 */
export class Range {
  private readonly _start: Index;
  private readonly _end: Index;

  /**
   * Creates a new Range.
   * @param start The start index.
   * @param end The end index.
   */
  constructor(start: Index, end: Index) {
    this._start = start;
    this._end = end;
  }

  /**
   * Gets the start index.
   */
  get start(): Index {
    return this._start;
  }

  /**
   * Gets the end index.
   */
  get end(): Index {
    return this._end;
  }

  /**
   * Creates a range from a start index to the end of the collection.
   * @param start The start index.
   */
  static fromStart(start: Index): Range {
    return new Range(start, new Index(0, true));
  }

  /**
   * Creates a range to an end index from the start of the collection.
   * @param end The end index.
   */
  static toEnd(end: Index): Range {
    return new Range(new Index(0, false), end);
  }

  /**
   * Creates a range that encompasses the entire collection.
   */
  static get all(): Range {
    return new Range(new Index(0, false), new Index(0, true));
  }

  /**
   * Calculates the offset and length for a given collection length.
   * @param length The length of the collection.
   * @returns An object with start offset and length.
   */
  getOffsetAndLength(length: number): { offset: number; length: number } {
    const start = this._start.getOffset(length);
    const end = this._end.getOffset(length);
    if (end < start) {
      throw new Error('Start index must be less than or equal to end index');
    }
    return { offset: start, length: end - start };
  }

  /**
   * Converts the Range to a string representation.
   */
  toString(): string {
    return `${this._start}..${this._end}`;
  }
}
