/**
 * HashSet implementation
 */

import type { ISet, IEnumerator } from './interfaces';

/**
 * Represents a set of values.
 * @template T The type of elements.
 */
export class HashSet<T> implements ISet<T> {
  private readonly _set: Set<T>;

  /**
   * Creates a new HashSet.
   * @param collection Initial collection.
   */
  constructor(collection?: Iterable<T>) {
    this._set = new Set(collection);
  }

  /**
   * Gets the number of elements.
   */
  get count(): number {
    return this._set.size;
  }

  /**
   * Adds an element to the set.
   * @param item The element.
   * @returns true if added; false if already exists.
   */
  add(item: T): boolean {
    const size = this._set.size;
    this._set.add(item);
    return this._set.size > size;
  }

  /**
   * Removes all elements.
   */
  clear(): void {
    this._set.clear();
  }

  /**
   * Determines whether the set contains the specified element.
   * @param item The element.
   * @returns true if exists.
   */
  contains(item: T): boolean {
    return this._set.has(item);
  }

  /**
   * Removes the specified element.
   * @param item The element.
   * @returns true if removed.
   */
  remove(item: T): boolean {
    return this._set.delete(item);
  }

  /**
   * Removes all elements in the specified collection.
   * @param other The collection to remove.
   */
  exceptWith(other: Iterable<T>): void {
    for (const item of other) {
      this._set.delete(item);
    }
  }

  /**
   * Modifies the set to contain only elements in both sets.
   * @param other The collection to intersect.
   */
  intersectWith(other: Iterable<T>): void {
    const otherSet = new Set(other);
    for (const item of this._set) {
      if (!otherSet.has(item)) {
        this._set.delete(item);
      }
    }
  }

  /**
   * Determines whether the set is a proper subset.
   * @param other The collection.
   * @returns true if proper subset.
   */
  isProperSubsetOf(other: Iterable<T>): boolean {
    const otherSet = new Set(other);
    if (this._set.size >= otherSet.size) {
      return false;
    }
    for (const item of this._set) {
      if (!otherSet.has(item)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Determines whether the set is a proper superset.
   * @param other The collection.
   * @returns true if proper superset.
   */
  isProperSupersetOf(other: Iterable<T>): boolean {
    const otherSet = new Set(other);
    if (this._set.size <= otherSet.size) {
      return false;
    }
    for (const item of otherSet) {
      if (!this._set.has(item)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Determines whether the set is a subset.
   * @param other The collection.
   * @returns true if subset.
   */
  isSubsetOf(other: Iterable<T>): boolean {
    const otherSet = new Set(other);
    for (const item of this._set) {
      if (!otherSet.has(item)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Determines whether the set is a superset.
   * @param other The collection.
   * @returns true if superset.
   */
  isSupersetOf(other: Iterable<T>): boolean {
    for (const item of other) {
      if (!this._set.has(item)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Determines whether the sets overlap.
   * @param other The collection.
   * @returns true if overlap.
   */
  overlaps(other: Iterable<T>): boolean {
    for (const item of other) {
      if (this._set.has(item)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Determines whether the sets are equal.
   * @param other The collection.
   * @returns true if equal.
   */
  setEquals(other: Iterable<T>): boolean {
    const otherSet = new Set(other);
    if (this._set.size !== otherSet.size) {
      return false;
    }
    for (const item of this._set) {
      if (!otherSet.has(item)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Modifies the set to be symmetric difference.
   * @param other The collection.
   */
  symmetricExceptWith(other: Iterable<T>): void {
    for (const item of other) {
      if (this._set.has(item)) {
        this._set.delete(item);
      } else {
        this._set.add(item);
      }
    }
  }

  /**
   * Modifies the set to be union of both sets.
   * @param other The collection.
   */
  unionWith(other: Iterable<T>): void {
    for (const item of other) {
      this._set.add(item);
    }
  }

  /**
   * Returns an enumerator.
   * @returns An IEnumerator.
   */
  getEnumerator(): IEnumerator<T> {
    const items = Array.from(this._set);
    let index = -1;
    return {
      get current(): T | undefined {
        if (index < 0 || index >= items.length) {
          return undefined;
        }
        return items[index];
      },
      moveNext(): boolean {
        index++;
        return index < items.length;
      },
      reset(): void {
        index = -1;
      },
    };
  }

  /**
   * Gets the iterator.
   */
  *[Symbol.iterator](): Iterator<T> {
    yield* this._set;
  }

  /**
   * Copies elements to an array.
   * @param array The destination array.
   * @param arrayIndex The starting index.
   */
  copyTo(array: Array<T>, arrayIndex = 0): void {
    let index = arrayIndex;
    for (const item of this._set) {
      array[index++] = item;
    }
  }

  /**
   * Removes elements that match a predicate.
   * @param match The predicate.
   * @returns Number of removed elements.
   */
  removeWhere(match: (item: T) => boolean): number {
    let count = 0;
    for (const item of this._set) {
      if (match(item)) {
        this._set.delete(item);
        count++;
      }
    }
    return count;
  }

  /**
   * Converts to an array.
   * @returns An array containing all elements.
   */
  toArray(): Array<T> {
    return Array.from(this._set);
  }

  /**
   * Ensures the set can hold the specified number.
   * @param capacity The capacity.
   * @returns The current capacity.
   */
  ensureCapacity(capacity: number): number {
    // Set grows dynamically, just return current
    return Math.max(capacity, this._set.size);
  }

  /**
   * Trims excess capacity.
   */
  trimExcess(): void {
    // Set automatically trims, no-op
  }
}
