/**
 * Implementation of LINQ enumerable
 */

import {
  type IEqualityComparer,
  type IPredicate,
  type ISelector,
  type ISelectorWithIndex,
} from '../core';
import type { ILinqEnumerable, IOrderedEnumerable, IGrouping } from './interfaces';

// Lazy factory to avoid circular dependency with ordered.ts
// Set by ordered.ts at module load time
let _orderedFactory:
  | (<T>(
      source: Iterable<T>,
      selector: ISelector<T, unknown>,
      descending: boolean
    ) => IOrderedEnumerable<T>)
  | undefined;

/**
 * Registers the OrderedEnumerable factory. Called by ordered.ts on load.
 */
export function registerOrderedFactory<T>(
  factory: (
    source: Iterable<T>,
    selector: ISelector<T, unknown>,
    descending: boolean
  ) => IOrderedEnumerable<T>
): void {
  _orderedFactory = factory as typeof _orderedFactory;
}

/**
 * Base class for all LINQ-enabled enumerables.
 * Implements the ILinqEnumerable interface.
 * @template T The type of elements.
 */
export class LinqEnumerable<T> implements ILinqEnumerable<T> {
  protected _source: Iterable<T>;

  /**
   * Creates a new LinqEnumerable.
   * @param source The source iterable.
   */
  constructor(source: Iterable<T>) {
    this._source = source;
  }

  /**
   * Gets the iterator for the sequence.
   */
  *[Symbol.iterator](): Iterator<T> {
    yield* this._source;
  }

  // ========== Aggregation ==========

  aggregate<TResult>(
    seedOrFunc: T | ((acc: T, current: T) => T),
    funcOrResultSelector?: ((acc: T, current: T) => T) | ((acc: T, current: T) => T),
    resultSelector?: (acc: T) => TResult
  ): T | TResult {
    // Check which overload is being used
    if (typeof seedOrFunc === 'function') {
      // Overload 1: (func)
      const func = seedOrFunc as (acc: T, current: T) => T;
      let first = true;
      let accumulator: T = undefined as unknown as T;

      for (const element of this._source) {
        if (first) {
          accumulator = element;
          first = false;
        } else {
          accumulator = func(accumulator, element);
        }
      }

      if (first) {
        throw new Error('Sequence contains no elements');
      }

      return accumulator;
    } else {
      // Overloads 2 & 3: (seed, func) or (seed, func, resultSelector)
      const seed = seedOrFunc;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const func = funcOrResultSelector as (acc: any, current: T) => any;
      let accumulator = seed;

      for (const element of this._source) {
        accumulator = func(accumulator, element);
      }

      if (resultSelector) {
        return resultSelector(accumulator);
      }

      return accumulator;
    }
  }

  // ========== Quantifiers ==========

  all(predicate: IPredicate<T>): boolean {
    for (const element of this._source) {
      if (!predicate(element)) {
        return false;
      }
    }
    return true;
  }

  any(predicate?: IPredicate<T>): boolean {
    for (const element of this._source) {
      if (!predicate || predicate(element)) {
        return true;
      }
    }
    return false;
  }

  contains(value: T, comparer?: IEqualityComparer<T>): boolean {
    const compare = comparer || ((a, b) => a === b);
    for (const element of this._source) {
      if (compare(element, value)) {
        return true;
      }
    }
    return false;
  }

  isEmpty(): boolean {
    for (const _ of this._source) {
      return false;
    }
    return true;
  }

  // ========== Concatenation ==========

  append(element: T): ILinqEnumerable<T> {
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        yield* this._source;
        yield element;
      }.bind(this)()
    );
  }

  prepend(element: T): ILinqEnumerable<T> {
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        yield element;
        yield* this._source;
      }.bind(this)()
    );
  }

  concat(other: Iterable<T>): ILinqEnumerable<T> {
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        yield* this._source;
        yield* other;
      }.bind(this)()
    );
  }

  // ========== Chunking ==========

  chunk(size: number): ILinqEnumerable<Array<T>> {
    if (size < 1) {
      throw new Error('Size must be greater than 0');
    }

    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        let chunk: Array<T> = [];
        for (const element of this._source) {
          chunk.push(element);
          if (chunk.length === size) {
            yield chunk;
            chunk = [];
          }
        }
        if (chunk.length > 0) {
          yield chunk;
        }
      }.bind(this)()
    );
  }

  // ========== Filtering ==========

  where(predicate: IPredicate<T>): ILinqEnumerable<T> {
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        for (const element of this._source) {
          if (predicate(element)) {
            yield element;
          }
        }
      }.bind(this)()
    );
  }

  ofType<TResult>(): ILinqEnumerable<TResult> {
    return new LinqEnumerable<TResult>(
      function* (this: LinqEnumerable<T>) {
        for (const element of this._source) {
          if (element !== null && element !== undefined && typeof element === 'object') {
            yield element as unknown as TResult;
          }
        }
      }.bind(this)()
    );
  }

  skipWhile(predicate: IPredicate<T>): ILinqEnumerable<T> {
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        let skipping = true;
        for (const element of this._source) {
          if (skipping) {
            if (!predicate(element)) {
              skipping = false;
              yield element;
            }
          } else {
            yield element;
          }
        }
      }.bind(this)()
    );
  }

  takeWhile(predicate: IPredicate<T>): ILinqEnumerable<T> {
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        for (const element of this._source) {
          if (!predicate(element)) {
            break;
          }
          yield element;
        }
      }.bind(this)()
    );
  }

  defaultIfEmpty(defaultValue: T): ILinqEnumerable<T> {
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        let hasElements = false;
        for (const element of this._source) {
          hasElements = true;
          yield element;
        }
        if (!hasElements) {
          yield defaultValue;
        }
      }.bind(this)()
    );
  }

  // ========== Projection ==========

  select<TResult>(
    selector: ISelector<T, TResult> | ((element: T, index: number) => TResult)
  ): ILinqEnumerable<TResult> {
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        let index = 0;
        for (const element of this._source) {
          yield (selector as (element: T, index: number) => TResult)(element, index);
          index++;
        }
      }.bind(this)()
    );
  }

  selectMany<TResult>(
    selector: ISelector<T, Iterable<TResult>> | ISelectorWithIndex<T, Iterable<TResult>>
  ): ILinqEnumerable<TResult> {
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        let index = 0;
        for (const element of this._source) {
          const inner = (selector as ISelectorWithIndex<T, Iterable<TResult>>)(element, index);
          yield* inner;
          index++;
        }
      }.bind(this)()
    );
  }

  // ========== Partitioning ==========

  skip(count: number): ILinqEnumerable<T> {
    if (count < 0) {
      throw new Error('Count cannot be negative');
    }

    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        let skipped = 0;
        for (const element of this._source) {
          if (skipped < count) {
            skipped++;
          } else {
            yield element;
          }
        }
      }.bind(this)()
    );
  }

  skipLast(count: number): ILinqEnumerable<T> {
    if (count < 0) {
      throw new Error('Count cannot be negative');
    }
    if (count === 0) {
      return this;
    }

    // Need to buffer elements
    return new LinqEnumerable<T>(
      function* (this: LinqEnumerable<T>) {
        const buffer: Array<T> = [];
        for (const element of this._source) {
          buffer.push(element);
          if (buffer.length > count) {
            yield buffer.shift()!;
          }
        }
      }.bind(this)()
    );
  }

  take(count: number): ILinqEnumerable<T> {
    if (count < 0) {
      throw new Error('Count cannot be negative');
    }
    if (count === 0) {
      return new LinqEnumerable<T>([]);
    }

    return new LinqEnumerable<T>(
      function* (this: LinqEnumerable<T>) {
        let taken = 0;
        for (const element of this._source) {
          if (taken >= count) {
            break;
          }
          yield element;
          taken++;
        }
      }.bind(this)()
    );
  }

  takeLast(count: number): ILinqEnumerable<T> {
    if (count < 0) {
      throw new Error('Count cannot be negative');
    }
    if (count === 0) {
      return new LinqEnumerable<T>([]);
    }

    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        const buffer: Array<T> = [];
        for (const element of this._source) {
          buffer.push(element);
          if (buffer.length > count) {
            buffer.shift();
          }
        }
        yield* buffer;
      }.bind(this)()
    );
  }

  // ========== Element Access ==========

  elementAt(index: number | { isFromEnd: true; value: number }): T {
    let actualIndex: number;
    const isFromEnd = typeof index === 'object' && index.isFromEnd;

    if (isFromEnd) {
      // Need to materialize to count
      const array = this.toArray();
      actualIndex = array.length - (index as { value: number }).value;
      if (actualIndex < 0 || actualIndex >= array.length) {
        throw new Error('Index was out of range');
      }
      return array[actualIndex];
    }

    actualIndex = index as number;
    let currentIndex = 0;
    for (const element of this._source) {
      if (currentIndex === actualIndex) {
        return element;
      }
      currentIndex++;
    }
    throw new Error('Index was out of range');
  }

  elementAtOrDefault(index: number | { isFromEnd: true; value: number }): T | undefined {
    try {
      return this.elementAt(index);
    } catch {
      return undefined;
    }
  }

  first(predicate?: IPredicate<T>): T {
    for (const element of this._source) {
      if (!predicate || predicate(element)) {
        return element;
      }
    }
    throw new Error(
      predicate ? 'Sequence contains no matching element' : 'Sequence contains no elements'
    );
  }

  firstOrDefault(predicate?: IPredicate<T>, defaultValue?: T): T | undefined {
    for (const element of this._source) {
      if (!predicate || predicate(element)) {
        return element;
      }
    }
    return defaultValue;
  }

  last(predicate?: IPredicate<T>): T {
    let found = false;
    let result: T = undefined as unknown as T;

    for (const element of this._source) {
      if (!predicate || predicate(element)) {
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
  }

  lastOrDefault(predicate?: IPredicate<T>, defaultValue?: T): T | undefined {
    let found = false;
    let result: T = undefined as unknown as T;

    for (const element of this._source) {
      if (!predicate || predicate(element)) {
        found = true;
        result = element;
      }
    }

    return found ? result : defaultValue;
  }

  single(predicate?: IPredicate<T>): T {
    let found = false;
    let result: T = undefined as unknown as T;

    for (const element of this._source) {
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
  }

  singleOrDefault(predicate?: IPredicate<T>, defaultValue?: T): T | undefined {
    let found = false;
    let result: T = undefined as unknown as T;

    for (const element of this._source) {
      if (!predicate || predicate(element)) {
        if (found) {
          throw new Error('Sequence contains more than one matching element');
        }
        found = true;
        result = element;
      }
    }

    return found ? result : defaultValue;
  }

  // ========== Ordering ==========

  orderBy<TKey>(keySelector: ISelector<T, TKey>): IOrderedEnumerable<T> {
    if (!_orderedFactory)
      throw new Error('OrderedEnumerable factory not registered. Import ordered.ts before use.');
    return _orderedFactory(this._source, keySelector as ISelector<T, unknown>, false);
  }

  orderByDescending<TKey>(keySelector: ISelector<T, TKey>): IOrderedEnumerable<T> {
    if (!_orderedFactory)
      throw new Error('OrderedEnumerable factory not registered. Import ordered.ts before use.');
    return _orderedFactory(this._source, keySelector as ISelector<T, unknown>, true);
  }

  // ========== Grouping ==========

  groupBy<TKey, TElement = T>(
    keySelector: ISelector<T, TKey>,
    elementSelector?: ISelector<T, TElement>
  ): ILinqEnumerable<IGrouping<TKey, TElement>> {
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        const groups = new Map<TKey, Array<TElement>>();
        const keys: Array<TKey> = [];

        for (const element of this._source) {
          const key = keySelector(element);
          const groupElement = elementSelector
            ? elementSelector(element)
            : (element as unknown as TElement);

          let group = groups.get(key);
          if (!group) {
            group = [];
            groups.set(key, group);
            keys.push(key);
          }
          group.push(groupElement);
        }

        for (const key of keys) {
          const group = groups.get(key)!;
          // Cast through unknown to set the readonly 'key' property during construction
          (group as unknown as { key: TKey }).key = key;
          yield group as IGrouping<TKey, TElement>;
        }
      }.bind(this)()
    );
  }

  // ========== Joins ==========

  join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: ISelector<T, TKey>,
    innerKeySelector: ISelector<TInner, TKey>,
    resultSelector: (outer: T, inner: TInner) => TResult
  ): ILinqEnumerable<TResult> {
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        // Build lookup for inner sequence
        const lookup = new Map<TKey, Array<TInner>>();
        for (const innerElement of inner) {
          const key = innerKeySelector(innerElement);
          let group = lookup.get(key);
          if (!group) {
            group = [];
            lookup.set(key, group);
          }
          group.push(innerElement);
        }

        // Match outer with inner
        for (const outerElement of this._source) {
          const key = outerKeySelector(outerElement);
          const innerGroup = lookup.get(key);
          if (innerGroup) {
            for (const innerElement of innerGroup) {
              yield resultSelector(outerElement, innerElement);
            }
          }
        }
      }.bind(this)()
    );
  }

  // ========== Set Operations ==========

  distinct(comparer?: IEqualityComparer<T>): ILinqEnumerable<T> {
    const compare = comparer || ((a, b) => a === b);
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        const seen: Array<T> = [];
        for (const element of this._source) {
          let isDuplicate = false;
          for (const seenElement of seen) {
            if (compare(element, seenElement)) {
              isDuplicate = true;
              break;
            }
          }
          if (!isDuplicate) {
            seen.push(element);
            yield element;
          }
        }
      }.bind(this)()
    );
  }

  distinctBy<TKey>(keySelector: ISelector<T, TKey>): ILinqEnumerable<T> {
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        const seen = new Set<TKey>();
        for (const element of this._source) {
          const key = keySelector(element);
          if (!seen.has(key)) {
            seen.add(key);
            yield element;
          }
        }
      }.bind(this)()
    );
  }

  except(other: Iterable<T>, comparer?: IEqualityComparer<T>): ILinqEnumerable<T> {
    const compare = comparer || ((a, b) => a === b);
    const otherArray = Array.isArray(other) ? other : [...other];

    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        for (const element of this._source) {
          let found = false;
          for (const otherElement of otherArray) {
            if (compare(element, otherElement)) {
              found = true;
              break;
            }
          }
          if (!found) {
            yield element;
          }
        }
      }.bind(this)()
    );
  }

  exceptBy<TKey>(other: Iterable<TKey>, keySelector: ISelector<T, TKey>): ILinqEnumerable<T> {
    const otherSet = new Set(other);
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        for (const element of this._source) {
          const key = keySelector(element);
          if (!otherSet.has(key)) {
            yield element;
          }
        }
      }.bind(this)()
    );
  }

  intersect(other: Iterable<T>, comparer?: IEqualityComparer<T>): ILinqEnumerable<T> {
    const compare = comparer || ((a, b) => a === b);
    const otherArray = Array.isArray(other) ? other : [...other];

    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        const yielded: Array<T> = [];
        for (const element of this._source) {
          for (const otherElement of otherArray) {
            if (compare(element, otherElement)) {
              // Check if already yielded
              let alreadyYielded = false;
              for (const y of yielded) {
                if (compare(element, y)) {
                  alreadyYielded = true;
                  break;
                }
              }
              if (!alreadyYielded) {
                yielded.push(element);
                yield element;
              }
              break;
            }
          }
        }
      }.bind(this)()
    );
  }

  intersectBy<TKey>(other: Iterable<TKey>, keySelector: ISelector<T, TKey>): ILinqEnumerable<T> {
    const otherSet = new Set(other);
    const yielded = new Set<TKey>();

    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        for (const element of this._source) {
          const key = keySelector(element);
          if (otherSet.has(key) && !yielded.has(key)) {
            yielded.add(key);
            yield element;
          }
        }
      }.bind(this)()
    );
  }

  union(other: Iterable<T>, comparer?: IEqualityComparer<T>): ILinqEnumerable<T> {
    const compare = comparer || ((a, b) => a === b);

    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        const seen: Array<T> = [];
        for (const element of this._source) {
          let isDuplicate = false;
          for (const seenElement of seen) {
            if (compare(element, seenElement)) {
              isDuplicate = true;
              break;
            }
          }
          if (!isDuplicate) {
            seen.push(element);
            yield element;
          }
        }
        for (const element of other) {
          let isDuplicate = false;
          for (const seenElement of seen) {
            if (compare(element, seenElement)) {
              isDuplicate = true;
              break;
            }
          }
          if (!isDuplicate) {
            seen.push(element);
            yield element;
          }
        }
      }.bind(this)()
    );
  }

  unionBy<TKey>(other: Iterable<T>, keySelector: ISelector<T, TKey>): ILinqEnumerable<T> {
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        const seen = new Set<TKey>();
        for (const element of this._source) {
          const key = keySelector(element);
          if (!seen.has(key)) {
            seen.add(key);
            yield element;
          }
        }
        for (const element of other) {
          const key = keySelector(element);
          if (!seen.has(key)) {
            seen.add(key);
            yield element;
          }
        }
      }.bind(this)()
    );
  }

  // ========== Aggregation Methods ==========

  count(predicate?: IPredicate<T>): number {
    let count = 0;
    for (const element of this._source) {
      if (!predicate || predicate(element)) {
        count++;
      }
    }
    return count;
  }

  countBy<TKey>(keySelector: ISelector<T, TKey>): ILinqEnumerable<[TKey, number]> {
    return new LinqEnumerable<[TKey, number]>(
      function* (this: LinqEnumerable<T>) {
        const counts = new Map<TKey, number>();
        for (const element of this._source) {
          const key = keySelector(element);
          counts.set(key, (counts.get(key) || 0) + 1);
        }
        for (const [key, count] of counts) {
          yield [key, count] as [TKey, number];
        }
      }.bind(this)()
    );
  }

  sum(selector: ISelector<T, number>): number {
    let sum = 0;
    for (const element of this._source) {
      sum += selector(element);
    }
    return sum;
  }

  average(selector: ISelector<T, number>): number {
    let sum = 0;
    let count = 0;
    for (const element of this._source) {
      sum += selector(element);
      count++;
    }
    if (count === 0) {
      throw new Error('Sequence contains no elements');
    }
    return sum / count;
  }

  max(): T;
  max<TResult>(selector: ISelector<T, TResult>): TResult;
  max<TResult>(selector?: ISelector<T, TResult>): T | TResult {
    let hasElements = false;
    let max: T | TResult = undefined as unknown as T | TResult;
    let maxValue = -Infinity;

    for (const element of this._source) {
      const value = selector ? selector(element) : element;
      const numValue = typeof value === 'string' ? Number(value) : Number(value as unknown);

      if (!hasElements || numValue > maxValue) {
        hasElements = true;
        max = value;
        maxValue = numValue;
      }
    }

    if (!hasElements) {
      throw new Error('Sequence contains no elements');
    }

    return max;
  }

  maxBy<TKey>(keySelector: ISelector<T, TKey>): T {
    let hasElements = false;
    let max: T = undefined as unknown as T;
    let maxKey: TKey = undefined as unknown as TKey;

    for (const element of this._source) {
      const key = keySelector(element);
      const comparable = typeof key === 'string' ? key : Number(key);
      const numKey = typeof comparable === 'string' ? comparable : Number(comparable);
      const maxComparable = typeof maxKey === 'string' ? maxKey : Number(maxKey);
      const maxNumKey = typeof maxComparable === 'string' ? maxComparable : Number(maxComparable);

      if (!hasElements || numKey > maxNumKey) {
        hasElements = true;
        max = element;
        maxKey = key;
      }
    }

    if (!hasElements) {
      throw new Error('Sequence contains no elements');
    }

    return max;
  }

  min(): T;
  min<TResult>(selector: ISelector<T, TResult>): TResult;
  min<TResult>(selector?: ISelector<T, TResult>): T | TResult {
    let hasElements = false;
    let min: T | TResult = undefined as unknown as T | TResult;
    let minValue = Infinity;

    for (const element of this._source) {
      const value = selector ? selector(element) : element;
      const numValue = typeof value === 'string' ? Number(value) : Number(value as unknown);

      if (!hasElements || numValue < minValue) {
        hasElements = true;
        min = value;
        minValue = numValue;
      }
    }

    if (!hasElements) {
      throw new Error('Sequence contains no elements');
    }

    return min;
  }

  minBy<TKey>(keySelector: ISelector<T, TKey>): T {
    let hasElements = false;
    let min: T = undefined as unknown as T;
    let minKey: TKey = undefined as unknown as TKey;

    for (const element of this._source) {
      const key = keySelector(element);
      const comparable = typeof key === 'string' ? key : Number(key);
      const numKey = typeof comparable === 'string' ? comparable : Number(comparable);
      const minComparable = typeof minKey === 'string' ? minKey : Number(minKey);
      const minNumKey = typeof minComparable === 'string' ? minComparable : Number(minComparable);

      if (!hasElements || numKey < minNumKey) {
        hasElements = true;
        min = element;
        minKey = key;
      }
    }

    if (!hasElements) {
      throw new Error('Sequence contains no elements');
    }

    return min;
  }

  // ========== Conversion ==========

  toArray(): Array<T> {
    return [...this._source];
  }

  toMap<TKey>(keySelector: ISelector<T, TKey>): Map<TKey, T> {
    const map = new Map<TKey, T>();
    for (const element of this._source) {
      const key = keySelector(element);
      map.set(key, element);
    }
    return map;
  }

  toSet(): Set<T> {
    return new Set(this._source);
  }

  tryGetNonEnumeratedCount(): [boolean, number] {
    if (Array.isArray(this._source)) {
      return [true, this._source.length];
    }
    if (this._source instanceof Set) {
      return [true, this._source.size];
    }
    if (this._source instanceof Map) {
      return [true, this._source.size];
    }
    return [false, 0];
  }

  // ========== Zipping ==========

  zip<TSecond, TThird, TResult>(
    second: Iterable<TSecond>,
    thirdOrResultSelector?: Iterable<TThird> | ((first: T, second: TSecond) => TResult),
    resultSelector?: (first: T, second: TSecond, third: TThird) => TResult
  ): ILinqEnumerable<unknown> {
    // Determine which overload
    const isThreeWay = thirdOrResultSelector && typeof thirdOrResultSelector !== 'function';

    if (isThreeWay) {
      // Three-way zip
      const third = thirdOrResultSelector as Iterable<TThird>;
      const finalSelector: (a: T, b: TSecond, c: TThird) => unknown =
        (resultSelector as ((a: T, b: TSecond, c: TThird) => unknown) | undefined) ??
        ((a, b, c) => [a, b, c]);
      return new LinqEnumerable(
        function* (this: LinqEnumerable<T>) {
          const iter1 = this._source[Symbol.iterator]();
          const iter2 = second[Symbol.iterator]();
          const iter3 = third[Symbol.iterator]();
          while (true) {
            const r1 = iter1.next();
            const r2 = iter2.next();
            const r3 = iter3.next();
            if (r1.done || r2.done || r3.done) break;
            yield finalSelector(r1.value, r2.value, r3.value);
          }
        }.bind(this)()
      );
    }

    // Two-way zip
    const selector =
      typeof thirdOrResultSelector === 'function'
        ? (thirdOrResultSelector as (first: T, second: TSecond) => TResult)
        : (a: T, b: TSecond) => [a, b] as unknown as TResult;

    return new LinqEnumerable<unknown>(
      function* (this: LinqEnumerable<T>) {
        const iter1 = this._source[Symbol.iterator]();
        const iter2 = second[Symbol.iterator]();
        while (true) {
          const r1 = iter1.next();
          const r2 = iter2.next();
          if (r1.done || r2.done) break;
          yield selector(r1.value, r2.value);
        }
      }.bind(this)()
    );
  }

  withIndex(): ILinqEnumerable<{ index: number; value: T }> {
    return new LinqEnumerable(
      function* (this: LinqEnumerable<T>) {
        let index = 0;
        for (const element of this._source) {
          yield { index, value: element };
          index++;
        }
      }.bind(this)()
    );
  }

  // ========== Iteration ==========

  forEach(action: (element: T, index: number) => void): void {
    let index = 0;
    for (const element of this._source) {
      action(element, index);
      index++;
    }
  }
}
