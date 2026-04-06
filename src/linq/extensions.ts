/**
 * Array extensions providing LINQ methods
 */

import { LinqEnumerable } from './enumerable';
import { OrderedEnumerable } from './ordered';
import type { ILinqEnumerable, IOrderedEnumerable, IGrouping } from './interfaces';
import type { IPredicate, ISelector, ISelectorWithIndex, IEqualityComparer } from '../core';

declare global {
  interface Array<T> extends ILinqEnumerable<T> {
    /**
     * Projects each element into a new form.
     * @template TResult The type of result elements.
     * @param selector A transform function.
     * @returns A new array with projected elements.
     */
    select<TResult>(selector: ISelector<T, TResult>): Array<TResult>;

    /**
     * Projects each element and index into a new form.
     * @template TResult The type of result elements.
     * @param selector A transform function with index.
     * @returns A new array with projected elements.
     */
    select<TResult>(selector: (element: T, index: number) => TResult): Array<TResult>;

    // Override toArray to return this
    toArray(): Array<T>;
  }
}

/**
 * Extends Array prototype with LINQ methods.
 * Note: This modifies the global Array prototype.
 */
export function extendArrayPrototype(): void {
  // Helper to create LinqEnumerable from array
  const asLinq = <T>(arr: Array<T>): LinqEnumerable<T> => new LinqEnumerable(arr);

  // ========== Projection ==========

  Array.prototype.select = function <T, TResult>(
    this: Array<T>,
    selector: ISelector<T, TResult> | ((element: T, index: number) => TResult)
  ): Array<TResult> {
    const result: Array<TResult> = [];
    for (let i = 0; i < this.length; i++) {
      result.push((selector as (element: T, index: number) => TResult)(this[i]!, i));
    }
    return result;
  };

  // ========== Quantifiers ==========

  Array.prototype.all = function <T>(this: Array<T>, predicate: IPredicate<T>): boolean {
    for (const element of this) {
      if (!predicate(element)) {
        return false;
      }
    }
    return true;
  };

  Array.prototype.any = function <T>(this: Array<T>, predicate?: IPredicate<T>): boolean {
    for (const element of this) {
      if (!predicate || predicate(element)) {
        return true;
      }
    }
    return false;
  };

  Array.prototype.contains = function <T>(
    this: Array<T>,
    value: T,
    comparer?: IEqualityComparer<T>
  ): boolean {
    const compare = comparer || ((a, b) => a === b);
    for (const element of this) {
      if (compare(element, value)) {
        return true;
      }
    }
    return false;
  };

  Array.prototype.isEmpty = function <T>(this: Array<T>): boolean {
    return this.length === 0;
  };

  // ========== Concatenation ==========

  Array.prototype.append = function <T>(this: Array<T>, element: T): ILinqEnumerable<T> {
    return asLinq(this).append(element);
  };

  Array.prototype.prepend = function <T>(this: Array<T>, element: T): ILinqEnumerable<T> {
    return asLinq(this).prepend(element);
  };

  // @ts-expect-error: LINQ concat(Iterable) intentionally replaces Array.concat(...ConcatArray[])
  Array.prototype.concat = function <T>(this: Array<T>, other: Iterable<T>): ILinqEnumerable<T> {
    return asLinq(this).concat(other);
  };

  // ========== Chunking ==========

  Array.prototype.chunk = function <T>(this: Array<T>, size: number): ILinqEnumerable<Array<T>> {
    return asLinq(this).chunk(size);
  };

  // ========== Filtering ==========

  Array.prototype.where = function <T>(
    this: Array<T>,
    predicate: IPredicate<T>
  ): ILinqEnumerable<T> {
    return asLinq(this).where(predicate);
  };

  Array.prototype.ofType = function <T, TResult>(this: Array<T>): ILinqEnumerable<TResult> {
    return asLinq(this).ofType<TResult>();
  };

  Array.prototype.skipWhile = function <T>(
    this: Array<T>,
    predicate: IPredicate<T>
  ): ILinqEnumerable<T> {
    return asLinq(this).skipWhile(predicate);
  };

  Array.prototype.takeWhile = function <T>(
    this: Array<T>,
    predicate: IPredicate<T>
  ): ILinqEnumerable<T> {
    return asLinq(this).takeWhile(predicate);
  };

  Array.prototype.defaultIfEmpty = function <T>(
    this: Array<T>,
    defaultValue: T
  ): ILinqEnumerable<T> {
    return asLinq(this).defaultIfEmpty(defaultValue);
  };

  // ========== Projection ==========

  Array.prototype.selectMany = function <T, TResult>(
    this: Array<T>,
    selector: ISelector<T, Iterable<TResult>> | ISelectorWithIndex<T, Iterable<TResult>>
  ): ILinqEnumerable<TResult> {
    return asLinq(this).selectMany(selector);
  };

  // ========== Partitioning ==========

  Array.prototype.skip = function <T>(this: Array<T>, count: number): ILinqEnumerable<T> {
    return asLinq(this).skip(count);
  };

  Array.prototype.skipLast = function <T>(this: Array<T>, count: number): ILinqEnumerable<T> {
    return asLinq(this).skipLast(count);
  };

  Array.prototype.take = function <T>(this: Array<T>, count: number): ILinqEnumerable<T> {
    return asLinq(this).take(count);
  };

  Array.prototype.takeLast = function <T>(this: Array<T>, count: number): ILinqEnumerable<T> {
    return asLinq(this).takeLast(count);
  };

  // ========== Element Access ==========

  Array.prototype.elementAt = function <T>(
    this: Array<T>,
    index: number | { isFromEnd: true; value: number }
  ): T {
    return asLinq(this).elementAt(index);
  };

  Array.prototype.elementAtOrDefault = function <T>(
    this: Array<T>,
    index: number | { isFromEnd: true; value: number }
  ): T | undefined {
    return asLinq(this).elementAtOrDefault(index);
  };

  Array.prototype.first = function <T>(this: Array<T>, predicate?: IPredicate<T>): T {
    if (predicate) {
      for (const element of this) {
        if (predicate(element)) {
          return element;
        }
      }
      throw new Error('Sequence contains no matching element');
    }
    if (this.length === 0) {
      throw new Error('Sequence contains no elements');
    }
    return this[0]!;
  };

  Array.prototype.firstOrDefault = function <T>(
    this: Array<T>,
    predicate?: IPredicate<T>,
    defaultValue?: T
  ): T | undefined {
    if (predicate) {
      for (const element of this) {
        if (predicate(element)) {
          return element;
        }
      }
      return defaultValue;
    }
    return this.length > 0 ? this[0] : defaultValue;
  };

  Array.prototype.last = function <T>(this: Array<T>, predicate?: IPredicate<T>): T {
    if (predicate) {
      for (let i = this.length - 1; i >= 0; i--) {
        const element = this[i]!;
        if (predicate(element)) {
          return element;
        }
      }
      throw new Error('Sequence contains no matching element');
    }
    if (this.length === 0) {
      throw new Error('Sequence contains no elements');
    }
    return this[this.length - 1]!;
  };

  Array.prototype.lastOrDefault = function <T>(
    this: Array<T>,
    predicate?: IPredicate<T>,
    defaultValue?: T
  ): T | undefined {
    if (predicate) {
      for (let i = this.length - 1; i >= 0; i--) {
        const element = this[i]!;
        if (predicate(element)) {
          return element;
        }
      }
      return defaultValue;
    }
    return this.length > 0 ? this[this.length - 1] : defaultValue;
  };

  Array.prototype.single = function <T>(this: Array<T>, predicate?: IPredicate<T>): T {
    let found = false;
    let result: T = undefined as unknown as T;

    for (const element of this) {
      if (!predicate || predicate(element)) {
        if (found) {
          throw new Error('Sequence contains more than one matching element');
        }
        found = true;
        result = element;
      }
    }

    if (!found) {
      throw new Error(
        predicate ? 'Sequence contains no matching element' : 'Sequence contains no elements'
      );
    }

    return result;
  };

  Array.prototype.singleOrDefault = function <T>(
    this: Array<T>,
    predicate?: IPredicate<T>,
    defaultValue?: T
  ): T | undefined {
    let found = false;
    let result: T = undefined as unknown as T;

    for (const element of this) {
      if (!predicate || predicate(element)) {
        if (found) {
          throw new Error('Sequence contains more than one matching element');
        }
        found = true;
        result = element;
      }
    }

    return found ? result : defaultValue;
  };

  // ========== Ordering ==========

  Array.prototype.orderBy = function <T, TKey>(
    this: Array<T>,
    keySelector: ISelector<T, TKey>
  ): IOrderedEnumerable<T> {
    return new OrderedEnumerable(this, keySelector as ISelector<T, unknown>, false);
  };

  Array.prototype.orderByDescending = function <T, TKey>(
    this: Array<T>,
    keySelector: ISelector<T, TKey>
  ): IOrderedEnumerable<T> {
    return new OrderedEnumerable(this, keySelector as ISelector<T, unknown>, true);
  };

  // ========== Grouping ==========

  Array.prototype.groupBy = function <T, TKey, TElement = T>(
    this: Array<T>,
    keySelector: ISelector<T, TKey>,
    elementSelector?: ISelector<T, TElement>
  ): ILinqEnumerable<IGrouping<TKey, TElement>> {
    return asLinq(this).groupBy(keySelector, elementSelector);
  };

  // ========== Joins ==========

  // @ts-expect-error: LINQ join(inner, outerKey, innerKey, result) intentionally replaces Array.join(separator)
  Array.prototype.join = function <T, TInner, TKey, TResult>(
    this: Array<T>,
    inner: Iterable<TInner>,
    outerKeySelector: ISelector<T, TKey>,
    innerKeySelector: ISelector<TInner, TKey>,
    resultSelector: (outer: T, inner: TInner) => TResult
  ): ILinqEnumerable<TResult> {
    return asLinq(this).join(inner, outerKeySelector, innerKeySelector, resultSelector);
  };

  // ========== Set Operations ==========

  Array.prototype.distinct = function <T>(
    this: Array<T>,
    comparer?: IEqualityComparer<T>
  ): ILinqEnumerable<T> {
    return asLinq(this).distinct(comparer);
  };

  Array.prototype.distinctBy = function <T, TKey>(
    this: Array<T>,
    keySelector: ISelector<T, TKey>
  ): ILinqEnumerable<T> {
    return asLinq(this).distinctBy(keySelector);
  };

  Array.prototype.except = function <T>(
    this: Array<T>,
    other: Iterable<T>,
    comparer?: IEqualityComparer<T>
  ): ILinqEnumerable<T> {
    return asLinq(this).except(other, comparer);
  };

  Array.prototype.exceptBy = function <T, TKey>(
    this: Array<T>,
    other: Iterable<TKey>,
    keySelector: ISelector<T, TKey>
  ): ILinqEnumerable<T> {
    return asLinq(this).exceptBy(other, keySelector);
  };

  Array.prototype.intersect = function <T>(
    this: Array<T>,
    other: Iterable<T>,
    comparer?: IEqualityComparer<T>
  ): ILinqEnumerable<T> {
    return asLinq(this).intersect(other, comparer);
  };

  Array.prototype.intersectBy = function <T, TKey>(
    this: Array<T>,
    other: Iterable<TKey>,
    keySelector: ISelector<T, TKey>
  ): ILinqEnumerable<T> {
    return asLinq(this).intersectBy(other, keySelector);
  };

  Array.prototype.union = function <T>(
    this: Array<T>,
    other: Iterable<T>,
    comparer?: IEqualityComparer<T>
  ): ILinqEnumerable<T> {
    return asLinq(this).union(other, comparer);
  };

  Array.prototype.unionBy = function <T, TKey>(
    this: Array<T>,
    other: Iterable<T>,
    keySelector: ISelector<T, TKey>
  ): ILinqEnumerable<T> {
    return asLinq(this).unionBy(other, keySelector);
  };

  // ========== Aggregation Methods ==========

  Array.prototype.aggregate = function <T, TAccumulate, TResult>(
    this: Array<T>,
    seedOrFunc: TAccumulate | ((acc: T, current: T) => T),
    funcOrResultSelector?:
      | ((acc: TAccumulate, current: T) => TAccumulate)
      | ((acc: T, current: T) => T),
    resultSelector?: (acc: TAccumulate) => TResult
  ): TAccumulate | TResult | T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (asLinq(this).aggregate as any)(seedOrFunc, funcOrResultSelector, resultSelector);
  };

  Array.prototype.count = function <T>(this: Array<T>, predicate?: IPredicate<T>): number {
    if (!predicate) {
      return this.length;
    }
    let count = 0;
    for (const element of this) {
      if (predicate(element)) {
        count++;
      }
    }
    return count;
  };

  Array.prototype.countBy = function <T, TKey>(
    this: Array<T>,
    keySelector: ISelector<T, TKey>
  ): ILinqEnumerable<[TKey, number]> {
    return asLinq(this).countBy(keySelector);
  };

  Array.prototype.sum = function <T>(this: Array<T>, selector: ISelector<T, number>): number {
    let sum = 0;
    for (const element of this) {
      sum += selector(element);
    }
    return sum;
  };

  Array.prototype.average = function <T>(this: Array<T>, selector: ISelector<T, number>): number {
    if (this.length === 0) {
      throw new Error('Sequence contains no elements');
    }
    let sum = 0;
    for (const element of this) {
      sum += selector(element);
    }
    return sum / this.length;
  };

  Array.prototype.max = function <T, TResult>(
    this: Array<T>,
    selector?: ISelector<T, TResult>
  ): T | TResult {
    if (this.length === 0) {
      throw new Error('Sequence contains no elements');
    }
    let max = selector ? selector(this[0]!) : this[0]!;
    for (let i = 1; i < this.length; i++) {
      const value = selector ? selector(this[i]!) : this[i]!;
      const comparableMax = typeof max === 'string' ? max : Number(max);
      const comparableValue = typeof value === 'string' ? value : Number(value);
      const numMax = typeof comparableMax === 'string' ? comparableMax : Number(comparableMax);
      const numValue =
        typeof comparableValue === 'string' ? comparableValue : Number(comparableValue);
      if (numValue > numMax) {
        max = value;
      }
    }
    return max;
  };

  Array.prototype.maxBy = function <T, TKey>(this: Array<T>, keySelector: ISelector<T, TKey>): T {
    if (this.length === 0) {
      throw new Error('Sequence contains no elements');
    }
    let max = this[0]!;
    let maxKey = keySelector(max);
    for (let i = 1; i < this.length; i++) {
      const element = this[i]!;
      const key = keySelector(element);
      const comparableMaxKey = typeof maxKey === 'string' ? maxKey : Number(maxKey);
      const comparableKey = typeof key === 'string' ? key : Number(key);
      const numMaxKey =
        typeof comparableMaxKey === 'string' ? comparableMaxKey : Number(comparableMaxKey);
      const numKey = typeof comparableKey === 'string' ? comparableKey : Number(comparableKey);
      if (numKey > numMaxKey) {
        max = element;
        maxKey = key;
      }
    }
    return max;
  };

  Array.prototype.min = function <T, TResult>(
    this: Array<T>,
    selector?: ISelector<T, TResult>
  ): T | TResult {
    if (this.length === 0) {
      throw new Error('Sequence contains no elements');
    }
    let min = selector ? selector(this[0]!) : this[0]!;
    for (let i = 1; i < this.length; i++) {
      const value = selector ? selector(this[i]!) : this[i]!;
      const comparableMin = typeof min === 'string' ? min : Number(min);
      const comparableValue = typeof value === 'string' ? value : Number(value);
      const numMin = typeof comparableMin === 'string' ? comparableMin : Number(comparableMin);
      const numValue =
        typeof comparableValue === 'string' ? comparableValue : Number(comparableValue);
      if (numValue < numMin) {
        min = value;
      }
    }
    return min;
  };

  Array.prototype.minBy = function <T, TKey>(this: Array<T>, keySelector: ISelector<T, TKey>): T {
    if (this.length === 0) {
      throw new Error('Sequence contains no elements');
    }
    let min = this[0]!;
    let minKey = keySelector(min);
    for (let i = 1; i < this.length; i++) {
      const element = this[i]!;
      const key = keySelector(element);
      const comparableMinKey = typeof minKey === 'string' ? minKey : Number(minKey);
      const comparableKey = typeof key === 'string' ? key : Number(key);
      const numMinKey =
        typeof comparableMinKey === 'string' ? comparableMinKey : Number(comparableMinKey);
      const numKey = typeof comparableKey === 'string' ? comparableKey : Number(comparableKey);
      if (numKey < numMinKey) {
        min = element;
        minKey = key;
      }
    }
    return min;
  };

  // ========== Conversion ==========

  Array.prototype.toArray = function <T>(this: Array<T>): Array<T> {
    return this;
  };

  Array.prototype.toMap = function <T, TKey>(
    this: Array<T>,
    keySelector: ISelector<T, TKey>
  ): Map<TKey, T> {
    const map = new Map<TKey, T>();
    for (const element of this) {
      const key = keySelector(element);
      map.set(key, element);
    }
    return map;
  };

  Array.prototype.toSet = function <T>(this: Array<T>): Set<T> {
    return new Set(this);
  };

  Array.prototype.tryGetNonEnumeratedCount = function <T>(this: Array<T>): [boolean, number] {
    return [true, this.length];
  };

  // ========== Zipping ==========

  Array.prototype.zip = function <T, TSecond, TThird, TResult>(
    this: Array<T>,
    second: Iterable<TSecond>,
    thirdOrResultSelector?: Iterable<TThird> | ((first: T, second: TSecond) => TResult),
    resultSelector?: (first: T, second: TSecond, third: TThird) => TResult
  ): ILinqEnumerable<unknown> {
    return asLinq(this).zip(second, thirdOrResultSelector, resultSelector);
  };

  Array.prototype.withIndex = function <T>(
    this: Array<T>
  ): ILinqEnumerable<{ index: number; value: T }> {
    return asLinq(this).withIndex();
  };

  // ========== Iteration ==========

  // @ts-expect-error: LINQ forEach(element, index) intentionally narrows Array.forEach(value, index, array) callback
  Array.prototype.forEach = function <T>(
    this: Array<T>,
    action: (element: T, index: number) => void
  ): void {
    for (let i = 0; i < this.length; i++) {
      action(this[i]!, i);
    }
  };

  // ========== Symbol.iterator ==========
  // Already native on Array
}

/**
 * Creates a LINQ-enabled enumerable from an iterable.
 * @template T The type of elements.
 * @param source The source iterable.
 * @returns A LinqEnumerable.
 */
export function asEnumerable<T>(source: Iterable<T>): LinqEnumerable<T> {
  return new LinqEnumerable(source);
}

/**
 * Creates a LINQ-enabled enumerable from a range of numbers.
 * @param start The starting number.
 * @param count The number of elements.
 * @returns A LinqEnumerable of numbers.
 */
export function range(start: number, count: number): LinqEnumerable<number> {
  return new LinqEnumerable(
    (function* () {
      for (let i = 0; i < count; i++) {
        yield start + i;
      }
    })()
  );
}

/**
 * Creates a LINQ-enabled enumerable from a repeated value.
 * @template T The type of element.
 * @param element The element to repeat.
 * @param count The number of times to repeat.
 * @returns A LinqEnumerable.
 */
export function repeat<T>(element: T, count: number): LinqEnumerable<T> {
  return new LinqEnumerable(
    (function* () {
      for (let i = 0; i < count; i++) {
        yield element;
      }
    })()
  );
}

/**
 * Creates an empty LINQ-enabled enumerable.
 * @template T The type of elements.
 * @returns An empty LinqEnumerable.
 */
export function empty<T>(): LinqEnumerable<T> {
  return new LinqEnumerable<T>([]);
}
