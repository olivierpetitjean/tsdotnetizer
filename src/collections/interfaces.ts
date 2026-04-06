/**
 * Collection interfaces
 */

/**
 * Supports iteration over a collection of a specified type.
 * @template T The type of elements.
 */
export interface IEnumerator<T> {
  /**
   * Gets the current element.
   */
  readonly current: T | undefined;

  /**
   * Advances to the next element.
   * @returns true if advanced successfully; false if at end.
   */
  moveNext(): boolean;

  /**
   * Resets the enumerator to the beginning.
   */
  reset(): void;
}

/**
 * Exposes the enumerator, which supports iteration over a collection.
 * @template T The type of elements.
 */
export interface IEnumerable<T> extends Iterable<T> {
  /**
   * Returns an enumerator that iterates through the collection.
   * @returns An IEnumerator.
   */
  getEnumerator(): IEnumerator<T>;
}

/**
 * Defines a key/value pair.
 * @template TKey The type of the key.
 * @template TValue The type of the value.
 */
export interface IKeyValuePair<TKey, TValue> {
  /**
   * Gets the key.
   */
  readonly key: TKey;

  /**
   * Gets the value.
   */
  value: TValue;
}

/**
 * Represents a generic collection of key/value pairs.
 * @template TKey The type of the key.
 * @template TValue The type of the value.
 */
export interface IDictionary<TKey, TValue> extends IEnumerable<IKeyValuePair<TKey, TValue>> {
  /**
   * Gets the number of elements.
   */
  readonly count: number;

  /**
   * Gets an array containing the keys.
   */
  readonly keys: Array<TKey>;

  /**
   * Gets an array containing the values.
   */
  readonly values: Array<TValue>;

  /**
   * Gets or sets the value associated with the specified key.
   * @param key The key.
   * @returns The value, or undefined if key not found.
   */
  get(key: TKey): TValue | undefined;
  set(key: TKey, value: TValue): void;

  /**
   * Adds an element with the provided key and value.
   * @param key The key.
   * @param value The value.
   * @throws {Error} If key already exists.
   */
  add(key: TKey, value: TValue): void;

  /**
   * Removes the element with the specified key.
   * @param key The key.
   * @returns true if removed; false if key not found.
   */
  remove(key: TKey): boolean;

  /**
   * Determines whether the dictionary contains the specified key.
   * @param key The key.
   * @returns true if key exists; otherwise, false.
   */
  containsKey(key: TKey): boolean;

  /**
   * Determines whether the dictionary contains the specified value.
   * @param value The value.
   * @returns true if value exists; otherwise, false.
   */
  containsValue(value: TValue): boolean;

  /**
   * Removes all elements.
   */
  clear(): void;

  /**
   * Attempts to get the value associated with the specified key.
   * @param key The key.
   * @returns A tuple [success, value] where success indicates if key was found.
   */
  tryGetValue(key: TKey): [boolean, TValue | undefined];
}

/**
 * Represents a set of values.
 * @template T The type of elements.
 */
export interface ISet<T> extends IEnumerable<T> {
  /**
   * Gets the number of elements.
   */
  readonly count: number;

  /**
   * Adds an element to the set.
   * @param item The element to add.
   * @returns true if added; false if already exists.
   */
  add(item: T): boolean;

  /**
   * Removes all elements.
   */
  clear(): void;

  /**
   * Determines whether the set contains the specified element.
   * @param item The element.
   * @returns true if element exists; otherwise, false.
   */
  contains(item: T): boolean;

  /**
   * Removes the specified element.
   * @param item The element to remove.
   * @returns true if removed; false if not found.
   */
  remove(item: T): boolean;

  /**
   * Removes all elements in the specified collection.
   * @param other The collection of elements to remove.
   */
  exceptWith(other: Iterable<T>): void;

  /**
   * Modifies the set to contain only elements in both sets.
   * @param other The collection to compare.
   */
  intersectWith(other: Iterable<T>): void;

  /**
   * Determines whether the set is a proper subset of the specified collection.
   * @param other The collection to compare.
   * @returns true if proper subset; otherwise, false.
   */
  isProperSubsetOf(other: Iterable<T>): boolean;

  /**
   * Determines whether the set is a proper superset of the specified collection.
   * @param other The collection to compare.
   * @returns true if proper superset; otherwise, false.
   */
  isProperSupersetOf(other: Iterable<T>): boolean;

  /**
   * Determines whether the set is a subset of the specified collection.
   * @param other The collection to compare.
   * @returns true if subset; otherwise, false.
   */
  isSubsetOf(other: Iterable<T>): boolean;

  /**
   * Determines whether the set is a superset of the specified collection.
   * @param other The collection to compare.
   * @returns true if superset; otherwise, false.
   */
  isSupersetOf(other: Iterable<T>): boolean;

  /**
   * Determines whether the set and collection share common elements.
   * @param other The collection to compare.
   * @returns true if sets overlap; otherwise, false.
   */
  overlaps(other: Iterable<T>): boolean;

  /**
   * Determines whether the set and collection contain same elements.
   * @param other The collection to compare.
   * @returns true if sets equal; otherwise, false.
   */
  setEquals(other: Iterable<T>): boolean;

  /**
   * Modifies the set to contain elements in either set but not both.
   * @param other The collection to compare.
   */
  symmetricExceptWith(other: Iterable<T>): void;

  /**
   * Modifies the set to be union of both sets.
   * @param other The collection to add.
   */
  unionWith(other: Iterable<T>): void;
}
