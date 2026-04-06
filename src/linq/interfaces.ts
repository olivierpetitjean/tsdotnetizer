/**
 * LINQ interfaces and types
 */

import type { IEqualityComparer, IPredicate, ISelector, ISelectorWithIndex } from '../core';

/**
 * Represents a collection of objects that have a common key.
 * @template TKey The type of the key.
 * @template TElement The type of the elements.
 */
export interface IGrouping<TKey, TElement> extends Array<TElement> {
  /**
   * Gets the key of the IGrouping.
   */
  readonly key: TKey;
}

/**
 * Represents a sorted sequence.
 * @template TSource The type of the elements.
 */
export interface IOrderedEnumerable<TSource> extends ILinqEnumerable<TSource> {
  /**
   * Performs a subsequent ordering of the elements in ascending order.
   * @template TKey The type of the key.
   * @param keySelector A function to extract a key from an element.
   * @returns An IOrderedEnumerable whose elements are sorted according to a key.
   */
  thenBy<TKey>(keySelector: ISelector<TSource, TKey>): IOrderedEnumerable<TSource>;

  /**
   * Performs a subsequent ordering of the elements in descending order.
   * @template TKey The type of the key.
   * @param keySelector A function to extract a key from an element.
   * @returns An IOrderedEnumerable whose elements are sorted in descending order.
   */
  thenByDescending<TKey>(keySelector: ISelector<TSource, TKey>): IOrderedEnumerable<TSource>;

  /**
   * Creates an array from an IOrderedEnumerable.
   * @returns An array that contains the elements from the input sequence.
   */
  toArray(): Array<TSource>;
}

/**
 * Represents a sequence that can be enumerated and provides LINQ methods.
 * @template TSource The type of the elements.
 */
export interface ILinqEnumerable<TSource> extends Iterable<TSource> {
  /**
   * Applies an accumulator function over a sequence.
   * @param func An accumulator function to be invoked on each element.
   * @returns The final accumulator value.
   */
  aggregate(func: (acc: TSource, current: TSource) => TSource): TSource;

  /**
   * Applies an accumulator function over a sequence with a seed value.
   * @template TAccumulate The type of the accumulator value.
   * @param seed The initial accumulator value.
   * @param func An accumulator function to be invoked on each element.
   * @returns The final accumulator value.
   */
  aggregate<TAccumulate>(
    seed: TAccumulate,
    func: (acc: TAccumulate, current: TSource) => TAccumulate
  ): TAccumulate;

  /**
   * Applies an accumulator function over a sequence with seed, func and result selector.
   * @template TAccumulate The type of the accumulator value.
   * @template TResult The type of the resulting value.
   * @param seed The initial accumulator value.
   * @param func An accumulator function.
   * @param resultSelector A function to transform the final accumulator value.
   * @returns The transformed final accumulator value.
   */
  aggregate<TAccumulate, TResult>(
    seed: TAccumulate,
    func: (acc: TAccumulate, current: TSource) => TAccumulate,
    resultSelector: (acc: TAccumulate) => TResult
  ): TResult;

  /**
   * Determines whether all elements satisfy a condition.
   * @param predicate A function to test each element.
   * @returns true if all elements satisfy the condition; otherwise, false.
   */
  all(predicate: IPredicate<TSource>): boolean;

  /**
   * Determines whether any element exists.
   * @returns true if the sequence contains any elements; otherwise, false.
   */
  any(): boolean;

  /**
   * Determines whether any element satisfies a condition.
   * @param predicate A function to test each element.
   * @returns true if any elements satisfy the condition; otherwise, false.
   */
  any(predicate: IPredicate<TSource>): boolean;

  /**
   * Appends a value to the end of the sequence.
   * @param element The value to append.
   * @returns A new sequence with the element appended.
   */
  append(element: TSource): ILinqEnumerable<TSource>;

  /**
   * Computes the average of a sequence of numeric values.
   * @param selector A function to extract a numeric value from an element.
   * @returns The average of the sequence.
   * @throws {Error} If the source contains no elements.
   */
  average(selector: ISelector<TSource, number>): number;

  /**
   * Splits the elements of a sequence into chunks of size at most count.
   * @param size The maximum size of each chunk.
   * @returns A sequence of chunks.
   * @throws {Error} If size is less than 1.
   */
  chunk(size: number): ILinqEnumerable<Array<TSource>>;

  /**
   * Concatenates two sequences.
   * @param other The sequence to concatenate.
   * @returns A sequence containing elements from both sequences.
   */
  concat(other: Iterable<TSource>): ILinqEnumerable<TSource>;

  /**
   * Determines whether the sequence contains a specified element.
   * @param value The value to locate.
   * @returns true if the sequence contains the value; otherwise, false.
   */
  contains(value: TSource): boolean;

  /**
   * Determines whether the sequence contains a specified element using a comparer.
   * @param value The value to locate.
   * @param comparer An equality comparer.
   * @returns true if the sequence contains the value; otherwise, false.
   */
  contains(value: TSource, comparer: IEqualityComparer<TSource>): boolean;

  /**
   * Returns the number of elements in a sequence.
   * @returns The number of elements.
   */
  count(): number;

  /**
   * Returns a number that represents how many elements satisfy a condition.
   * @param predicate A function to test each element.
   * @returns The number of elements that satisfy the condition.
   */
  count(predicate: IPredicate<TSource>): number;

  /**
   * Returns key-value pairs where the key is the result of a selector and the value is the count.
   * @template TKey The type of the key.
   * @param keySelector A function to extract a key from an element.
   * @returns A sequence of key-value pairs with counts.
   */
  countBy<TKey>(keySelector: ISelector<TSource, TKey>): ILinqEnumerable<[TKey, number]>;

  /**
   * Returns the elements of the sequence or a default value if empty.
   * @param defaultValue The default value.
   * @returns The sequence or default value if empty.
   */
  defaultIfEmpty(defaultValue: TSource): ILinqEnumerable<TSource>;

  /**
   * Returns distinct elements from a sequence.
   * @returns A sequence of distinct elements.
   */
  distinct(): ILinqEnumerable<TSource>;

  /**
   * Returns distinct elements using a specified comparer.
   * @param comparer An equality comparer.
   * @returns A sequence of distinct elements.
   */
  distinct(comparer: IEqualityComparer<TSource>): ILinqEnumerable<TSource>;

  /**
   * Returns distinct elements based on a key selector.
   * @template TKey The type of the key.
   * @param keySelector A function to extract a key from an element.
   * @returns A sequence of distinct elements.
   */
  distinctBy<TKey>(keySelector: ISelector<TSource, TKey>): ILinqEnumerable<TSource>;

  /**
   * Returns the element at a specified index.
   * @param index The zero-based index.
   * @returns The element at the specified index.
   * @throws {Error} If index is out of range.
   */
  elementAt(index: number): TSource;

  /**
   * Returns the element at a specified index from the end.
   * @param index The index from the end.
   * @returns The element at the specified index.
   * @throws {Error} If index is out of range.
   */
  elementAt(index: { isFromEnd: true; value: number }): TSource;

  /**
   * Returns the element at a specified index or undefined if out of range.
   * @param index The zero-based index.
   * @returns The element or undefined.
   */
  elementAtOrDefault(index: number): TSource | undefined;

  /**
   * Returns the element at a specified index from the end or undefined.
   * @param index The index from the end.
   * @returns The element or undefined.
   */
  elementAtOrDefault(index: { isFromEnd: true; value: number }): TSource | undefined;

  /**
   * Produces the set difference of two sequences.
   * @param other The sequence to remove.
   * @returns A sequence containing elements not in other.
   */
  except(other: Iterable<TSource>): ILinqEnumerable<TSource>;

  /**
   * Produces the set difference using a comparer.
   * @param other The sequence to remove.
   * @param comparer An equality comparer.
   * @returns A sequence containing elements not in other.
   */
  except(other: Iterable<TSource>, comparer: IEqualityComparer<TSource>): ILinqEnumerable<TSource>;

  /**
   * Produces the set difference based on a key selector.
   * @template TKey The type of the key.
   * @param other The sequence to remove.
   * @param keySelector A function to extract a key.
   * @returns A sequence containing elements not in other.
   */
  exceptBy<TKey>(
    other: Iterable<TKey>,
    keySelector: ISelector<TSource, TKey>
  ): ILinqEnumerable<TSource>;

  /**
   * Returns the first element.
   * @returns The first element.
   * @throws {Error} If the sequence is empty.
   */
  first(): TSource;

  /**
   * Returns the first element that satisfies a condition.
   * @param predicate A function to test each element.
   * @returns The first matching element.
   * @throws {Error} If no element satisfies the condition.
   */
  first(predicate: IPredicate<TSource>): TSource;

  /**
   * Returns the first element, or undefined / defaultValue if empty.
   * @param predicate Optional function to test each element.
   * @param defaultValue Optional default value returned when no element is found.
   * @returns The first matching element, defaultValue, or undefined.
   */
  firstOrDefault(predicate?: IPredicate<TSource>, defaultValue?: TSource): TSource | undefined;

  /**
   * Groups elements by a key selector.
   * @template TKey The type of the key.
   * @param keySelector A function to extract a key.
   * @returns A sequence of IGrouping.
   */
  groupBy<TKey>(keySelector: ISelector<TSource, TKey>): ILinqEnumerable<IGrouping<TKey, TSource>>;

  /**
   * Groups elements by a key selector with element selector.
   * @template TKey The type of the key.
   * @template TElement The type of the elements in the group.
   * @param keySelector A function to extract a key.
   * @param elementSelector A function to map each source element.
   * @returns A sequence of IGrouping.
   */
  groupBy<TKey, TElement>(
    keySelector: ISelector<TSource, TKey>,
    elementSelector: ISelector<TSource, TElement>
  ): ILinqEnumerable<IGrouping<TKey, TElement>>;

  /**
   * Correlates elements of two sequences based on equality of keys.
   * @template TInner The type of inner elements.
   * @template TKey The type of the keys.
   * @template TResult The type of the result.
   * @param inner The inner sequence.
   * @param outerKeySelector A function to extract keys from outer elements.
   * @param innerKeySelector A function to extract keys from inner elements.
   * @param resultSelector A function to create result elements.
   * @returns A sequence of joined elements.
   */
  join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: ISelector<TSource, TKey>,
    innerKeySelector: ISelector<TInner, TKey>,
    resultSelector: (outer: TSource, inner: TInner) => TResult
  ): ILinqEnumerable<TResult>;

  /**
   * Produces the set intersection of two sequences.
   * @param other The sequence to intersect with.
   * @returns A sequence of common elements.
   */
  intersect(other: Iterable<TSource>): ILinqEnumerable<TSource>;

  /**
   * Produces the set intersection using a comparer.
   * @param other The sequence to intersect with.
   * @param comparer An equality comparer.
   * @returns A sequence of common elements.
   */
  intersect(
    other: Iterable<TSource>,
    comparer: IEqualityComparer<TSource>
  ): ILinqEnumerable<TSource>;

  /**
   * Produces the set intersection based on a key selector.
   * @template TKey The type of the key.
   * @param other The sequence to intersect with.
   * @param keySelector A function to extract keys.
   * @returns A sequence of common elements.
   */
  intersectBy<TKey>(
    other: Iterable<TKey>,
    keySelector: ISelector<TSource, TKey>
  ): ILinqEnumerable<TSource>;

  /**
   * Gets a value indicating whether the sequence is empty.
   * @returns true if the sequence is empty; otherwise, false.
   */
  isEmpty(): boolean;

  /**
   * Returns the last element.
   * @returns The last element.
   * @throws {Error} If the sequence is empty.
   */
  last(): TSource;

  /**
   * Returns the last element that satisfies a condition.
   * @param predicate A function to test each element.
   * @returns The last matching element.
   * @throws {Error} If no element satisfies the condition.
   */
  last(predicate: IPredicate<TSource>): TSource;

  /**
   * Returns the last element, or undefined / defaultValue if empty.
   * @param predicate Optional function to test each element.
   * @param defaultValue Optional default value returned when no element is found.
   * @returns The last matching element, defaultValue, or undefined.
   */
  lastOrDefault(predicate?: IPredicate<TSource>, defaultValue?: TSource): TSource | undefined;

  /**
   * Returns the maximum value.
   * @returns The maximum value.
   * @throws {Error} If the sequence is empty.
   */
  max(): TSource;

  /**
   * Returns the maximum value using a selector.
   * @template TResult The type of the value to compare.
   * @param selector A function to extract a value.
   * @returns The maximum value.
   * @throws {Error} If the sequence is empty.
   */
  max<TResult>(selector: ISelector<TSource, TResult>): TResult;

  /**
   * Returns the element with maximum key.
   * @template TKey The type of the key.
   * @param keySelector A function to extract a key.
   * @returns The element with maximum key.
   * @throws {Error} If the sequence is empty.
   */
  maxBy<TKey>(keySelector: ISelector<TSource, TKey>): TSource;

  /**
   * Returns the minimum value.
   * @returns The minimum value.
   * @throws {Error} If the sequence is empty.
   */
  min(): TSource;

  /**
   * Returns the minimum value using a selector.
   * @template TResult The type of the value to compare.
   * @param selector A function to extract a value.
   * @returns The minimum value.
   * @throws {Error} If the sequence is empty.
   */
  min<TResult>(selector: ISelector<TSource, TResult>): TResult;

  /**
   * Returns the element with minimum key.
   * @template TKey The type of the key.
   * @param keySelector A function to extract a key.
   * @returns The element with minimum key.
   * @throws {Error} If the sequence is empty.
   */
  minBy<TKey>(keySelector: ISelector<TSource, TKey>): TSource;

  /**
   * Filters elements of type TResult.
   * @template TResult The type to filter to.
   * @returns A sequence of elements of type TResult.
   */
  ofType<TResult>(): ILinqEnumerable<TResult>;

  /**
   * Sorts elements in ascending order.
   * @template TKey The type of the key.
   * @param keySelector A function to extract a key.
   * @returns An IOrderedEnumerable.
   */
  orderBy<TKey>(keySelector: ISelector<TSource, TKey>): IOrderedEnumerable<TSource>;

  /**
   * Sorts elements in descending order.
   * @template TKey The type of the key.
   * @param keySelector A function to extract a key.
   * @returns An IOrderedEnumerable.
   */
  orderByDescending<TKey>(keySelector: ISelector<TSource, TKey>): IOrderedEnumerable<TSource>;

  /**
   * Adds a value to the beginning of the sequence.
   * @param element The value to prepend.
   * @returns A new sequence with the element prepended.
   */
  prepend(element: TSource): ILinqEnumerable<TSource>;

  /**
   * Projects each element to an IEnumerable and flattens.
   * @template TResult The type of the elements in the result.
   * @param selector A function to project each element.
   * @returns A flattened sequence.
   */
  selectMany<TResult>(selector: ISelector<TSource, Iterable<TResult>>): ILinqEnumerable<TResult>;

  /**
   * Projects each element into a new form.
   * @template TResult The type of result elements.
   * @param selector A transform function.
   * @returns A sequence of projected elements.
   */
  select<TResult>(selector: ISelector<TSource, TResult>): ILinqEnumerable<TResult>;

  /**
   * Projects each element and its index into a new form.
   * @template TResult The type of result elements.
   * @param selector A transform function that receives element and index.
   * @returns A sequence of projected elements.
   */
  select<TResult>(selector: (element: TSource, index: number) => TResult): ILinqEnumerable<TResult>;

  /**
   * Projects each element and index to an IEnumerable and flattens.
   * @template TResult The type of the elements in the result.
   * @param selector A function to project each element and index.
   * @returns A flattened sequence.
   */
  selectMany<TResult>(
    selector: ISelectorWithIndex<TSource, Iterable<TResult>>
  ): ILinqEnumerable<TResult>;

  /**
   * Returns the only element.
   * @returns The single element.
   * @throws {Error} If sequence is empty or has more than one element.
   */
  single(): TSource;

  /**
   * Returns the only element that satisfies a condition.
   * @param predicate A function to test each element.
   * @returns The single matching element.
   * @throws {Error} If no or multiple elements satisfy the condition.
   */
  single(predicate: IPredicate<TSource>): TSource;

  /**
   * Returns the only element, or undefined / defaultValue if empty.
   * @param predicate Optional function to test each element.
   * @param defaultValue Optional default value returned when no element is found.
   * @returns The single matching element, defaultValue, or undefined.
   * @throws {Error} If multiple elements satisfy the condition.
   */
  singleOrDefault(predicate?: IPredicate<TSource>, defaultValue?: TSource): TSource | undefined;

  /**
   * Bypasses a specified number of elements.
   * @param count The number of elements to skip.
   * @returns A sequence with remaining elements.
   */
  skip(count: number): ILinqEnumerable<TSource>;

  /**
   * Returns elements from a sequence as long as a condition is true.
   * @param predicate A function to test each element.
   * @returns A sequence with remaining elements after the condition becomes false.
   */
  skipWhile(predicate: IPredicate<TSource>): ILinqEnumerable<TSource>;

  /**
   * Bypasses a specified number of elements from the end.
   * @param count The number of elements to skip from the end.
   * @returns A sequence with elements except the last count.
   */
  skipLast(count: number): ILinqEnumerable<TSource>;

  /**
   * Computes the sum of a sequence of numbers.
   * @param selector A function to extract a number.
   * @returns The sum.
   */
  sum(selector: ISelector<TSource, number>): number;

  /**
   * Returns a specified number of contiguous elements.
   * @param count The number of elements to return.
   * @returns A sequence with up to count elements.
   */
  take(count: number): ILinqEnumerable<TSource>;

  /**
   * Returns elements as long as a condition is true.
   * @param predicate A function to test each element.
   * @returns A sequence of elements that satisfy the condition.
   */
  takeWhile(predicate: IPredicate<TSource>): ILinqEnumerable<TSource>;

  /**
   * Returns a specified number of elements from the end.
   * @param count The number of elements to take from the end.
   * @returns A sequence with up to count elements from the end.
   */
  takeLast(count: number): ILinqEnumerable<TSource>;

  /**
   * Creates an array from the sequence.
   * @returns An array containing elements from the sequence.
   */
  toArray(): Array<TSource>;

  /**
   * Creates a Map from the sequence.
   * @template TKey The type of the key.
   * @param keySelector A function to extract a key.
   * @returns A Map containing elements grouped by key.
   */
  toMap<TKey>(keySelector: ISelector<TSource, TKey>): Map<TKey, TSource>;

  /**
   * Creates a Set from the sequence.
   * @returns A Set containing distinct elements.
   */
  toSet(): Set<TSource>;

  /**
   * Attempts to determine the number of elements without enumeration.
   * @returns A tuple [success, count] where success indicates if count is accurate.
   */
  tryGetNonEnumeratedCount(): [boolean, number];

  /**
   * Produces the set union of two sequences.
   * @param other The sequence to union with.
   * @returns A sequence of unique elements from both sequences.
   */
  union(other: Iterable<TSource>): ILinqEnumerable<TSource>;

  /**
   * Produces the set union using a comparer.
   * @param other The sequence to union with.
   * @param comparer An equality comparer.
   * @returns A sequence of unique elements from both sequences.
   */
  union(other: Iterable<TSource>, comparer: IEqualityComparer<TSource>): ILinqEnumerable<TSource>;

  /**
   * Produces the set union based on a key selector.
   * @template TKey The type of the key.
   * @param other The sequence to union with.
   * @param keySelector A function to extract keys.
   * @returns A sequence of unique elements from both sequences.
   */
  unionBy<TKey>(
    other: Iterable<TSource>,
    keySelector: ISelector<TSource, TKey>
  ): ILinqEnumerable<TSource>;

  /**
   * Filters a sequence of values based on a predicate.
   * @param predicate A function to test each element.
   * @returns A sequence of elements that satisfy the condition.
   */
  where(predicate: IPredicate<TSource>): ILinqEnumerable<TSource>;

  /**
   * Merges two or three sequences.
   * - zip(second) → ILinqEnumerable<[TSource, TSecond]>
   * - zip(second, resultSelector) → ILinqEnumerable<TResult>
   * - zip(second, third) → ILinqEnumerable<[TSource, TSecond, TThird]>
   * - zip(second, third, resultSelector) → ILinqEnumerable<TResult>
   */
  zip<TSecond, TThird = never, TResult = never>(
    second: Iterable<TSecond>,
    thirdOrResultSelector?: Iterable<TThird> | ((first: TSource, second: TSecond) => TResult),
    resultSelector?: (first: TSource, second: TSecond, third: TThird) => TResult
  ): ILinqEnumerable<unknown>;

  /**
   * Produces a sequence with Index paired with elements.
   * @returns A sequence of [Index, TSource] pairs.
   */
  withIndex(): ILinqEnumerable<{ index: number; value: TSource }>;

  /**
   * Iterates over the sequence and performs an action on each element.
   * @param action A function to execute on each element.
   */
  forEach(action: (element: TSource, index: number) => void): void;
}
