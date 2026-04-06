/**
 * OrderedEnumerable implementation for LINQ ordering operations
 */

import type { ISelector } from '../core';
import { LinqEnumerable, registerOrderedFactory } from './enumerable';
import type { IOrderedEnumerable } from './interfaces';

/**
 * Represents a sorted sequence with the ability to perform subsequent orderings.
 * @template T The type of elements.
 */
export class OrderedEnumerable<T> extends LinqEnumerable<T> implements IOrderedEnumerable<T> {
  private readonly _comparers: Array<{ selector: ISelector<T, unknown>; descending: boolean }>;
  /** The original unsorted source, kept so thenBy can re-sort with all comparers. */
  private readonly _originalSource: Array<T>;

  /**
   * Creates a new OrderedEnumerable.
   * @param source The source sequence.
   * @param keySelector The key selector function.
   * @param descending Whether to sort in descending order.
   */
  constructor(source: Iterable<T>, keySelector: ISelector<T, unknown>, descending: boolean) {
    super([]);
    this._comparers = [{ selector: keySelector, descending }];
    this._originalSource = [...source];
    this._source = this.buildSorted();
  }

  /**
   * Performs a subsequent ordering in ascending order.
   * @template TKey The type of the key.
   * @param keySelector A function to extract a key.
   * @returns A new OrderedEnumerable.
   */
  thenBy<TKey>(keySelector: ISelector<T, TKey>): IOrderedEnumerable<T> {
    this._comparers.push({ selector: keySelector as ISelector<T, unknown>, descending: false });
    this._source = this.buildSorted();
    return this as IOrderedEnumerable<T>;
  }

  /**
   * Performs a subsequent ordering in descending order.
   * @template TKey The type of the key.
   * @param keySelector A function to extract a key.
   * @returns A new OrderedEnumerable.
   */
  thenByDescending<TKey>(keySelector: ISelector<T, TKey>): IOrderedEnumerable<T> {
    this._comparers.push({ selector: keySelector as ISelector<T, unknown>, descending: true });
    this._source = this.buildSorted();
    return this as IOrderedEnumerable<T>;
  }

  /**
   * Creates an array from the ordered sequence.
   * @returns An array containing the sorted elements.
   */
  toArray(): Array<T> {
    return [...this._source];
  }

  /**
   * Builds a sorted copy of the original source using all current comparers.
   */
  private buildSorted(): Array<T> {
    const array = [...this._originalSource];
    array.sort((a, b) => {
      for (const comparer of this._comparers) {
        const keyA = comparer.selector(a);
        const keyB = comparer.selector(b);

        let result: number;
        if (typeof keyA === 'string' && typeof keyB === 'string') {
          result = keyA.localeCompare(keyB);
        } else if (keyA instanceof Date && keyB instanceof Date) {
          result = keyA.getTime() - keyB.getTime();
        } else if (typeof keyA === 'number' && typeof keyB === 'number') {
          result = keyA - keyB;
        } else {
          if (keyA === keyB) {
            result = 0;
          } else if (keyA === null || keyA === undefined) {
            result = -1;
          } else if (keyB === null || keyB === undefined) {
            result = 1;
          } else if (keyA < keyB) {
            result = -1;
          } else {
            result = 1;
          }
        }

        if (comparer.descending) {
          result = -result;
        }

        if (result !== 0) {
          return result;
        }
      }
      return 0;
    });
    return array;
  }
}

// Register factory to break circular dependency
registerOrderedFactory(
  <T>(source: Iterable<T>, selector: ISelector<T, unknown>, descending: boolean) =>
    new OrderedEnumerable<T>(source, selector, descending)
);
