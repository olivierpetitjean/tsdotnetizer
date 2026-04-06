/**
 * Array/List extensions (non-LINQ methods)
 */

/**
 * Adds an item to the end of an array.
 * @template T The type of elements.
 * @param array The array.
 * @param item The item to add.
 */
export function add<T>(array: Array<T>, item: T): void {
  array.push(item);
}

/**
 * Adds items to the end of an array.
 * @template T The type of elements.
 * @param array The array.
 * @param items The items to add.
 */
export function addRange<T>(array: Array<T>, items: Iterable<T>): void {
  for (const item of items) {
    array.push(item);
  }
}

/**
 * Removes all items from an array.
 * @template T The type of elements.
 * @param array The array.
 */
export function clear<T>(array: Array<T>): void {
  array.length = 0;
}

/**
 * Finds the index of an item matching a predicate.
 * @template T The type of elements.
 * @param array The array.
 * @param predicate The predicate.
 * @returns The index, or -1 if not found.
 */
export function findIndex<T>(array: Array<T>, predicate: (item: T) => boolean): number {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i]!)) {
      return i;
    }
  }
  return -1;
}

/**
 * Finds the last index of an item matching a predicate.
 * @template T The type of elements.
 * @param array The array.
 * @param predicate The predicate.
 * @returns The index, or -1 if not found.
 */
export function findLastIndex<T>(array: Array<T>, predicate: (item: T) => boolean): number {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i]!)) {
      return i;
    }
  }
  return -1;
}

/**
 * Inserts an item at a specified index.
 * @template T The type of elements.
 * @param array The array.
 * @param index The index.
 * @param item The item.
 */
export function insert<T>(array: Array<T>, index: number, item: T): void {
  array.splice(index, 0, item);
}

/**
 * Removes the first occurrence of an item.
 * @template T The type of elements.
 * @param array The array.
 * @param item The item.
 * @returns true if removed.
 */
export function remove<T>(array: Array<T>, item: T): boolean {
  const index = array.indexOf(item);
  if (index >= 0) {
    array.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Removes all items matching a predicate.
 * @template T The type of elements.
 * @param array The array.
 * @param predicate The predicate.
 * @returns The number of removed items.
 */
export function removeAll<T>(array: Array<T>, predicate: (item: T) => boolean): number {
  let count = 0;
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i]!)) {
      array.splice(i, 1);
      count++;
    }
  }
  return count;
}

/**
 * Removes the item at a specified index.
 * @template T The type of elements.
 * @param array The array.
 * @param index The index.
 */
export function removeAt<T>(array: Array<T>, index: number): void {
  array.splice(index, 1);
}

/**
 * Creates a shallow copy of an array.
 * @template T The type of elements.
 * @param array The array.
 * @returns A new array.
 */
export function clone<T>(array: Array<T>): Array<T> {
  return [...array];
}

/**
 * List class (similar to .NET List<T>).
 * @template T The type of elements.
 */
export class List<T> extends Array<T> {
  /**
   * Forces Array methods like splice/map/filter to return plain Array instead
   * of List, preventing constructor re-invocation with internal arguments.
   */
  static get [Symbol.species](): ArrayConstructor {
    return Array;
  }

  /**
   * Creates a new List.
   * @param items Initial items.
   */
  constructor(items?: Iterable<T> | number) {
    // When called internally by Array methods (e.g. splice), they pass a number
    // as the first argument. We must handle that case.
    if (typeof items === 'number') {
      super(items);
      return;
    }
    super();
    if (items) {
      for (const item of items) {
        this.push(item);
      }
    }
  }

  /**
   * Gets the number of elements.
   * Named to avoid collision with the LINQ count() method added via Array extensions.
   */
  // @ts-expect-error: 'count' getter shadows the LINQ count() function added via extendArrayPrototype
  get count(): number {
    return this.length;
  }

  /**
   * Gets or sets the capacity.
   */
  get capacity(): number {
    return this.length;
  }

  set capacity(value: number) {
    // Arrays grow dynamically
    if (value < this.length) {
      this.length = value;
    }
  }

  /**
   * Adds an item.
   * @param item The item.
   */
  add(item: T): void {
    this.push(item);
  }

  /**
   * Adds items.
   * @param items The items.
   */
  addRange(items: Iterable<T>): void {
    for (const item of items) {
      this.push(item);
    }
  }

  /**
   * Clears all items.
   */
  clear(): void {
    this.length = 0;
  }

  /**
   * Finds an item.
   * @param predicate The predicate.
   * @returns The item, or undefined.
   */
  find(predicate: (item: T, index: number, array: T[]) => boolean): T | undefined {
    const arr = this as unknown as T[];
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]!;
      if (predicate(item, i, arr)) {
        return item;
      }
    }
    return undefined;
  }

  /**
   * Finds the index of an item.
   * @param predicate The predicate.
   * @returns The index, or -1.
   */
  findIndex(predicate: (item: T, index: number, array: T[]) => boolean): number {
    const arr = this as unknown as T[];
    for (let i = 0; i < arr.length; i++) {
      if (predicate(arr[i]!, i, arr)) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Finds the last index of an item.
   * @param predicate The predicate.
   * @returns The index, or -1.
   */
  findLastIndex(predicate: (item: T, index: number, array: T[]) => boolean): number {
    const arr = this as unknown as T[];
    for (let i = arr.length - 1; i >= 0; i--) {
      if (predicate(arr[i]!, i, arr)) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Finds the last item.
   * @param predicate The predicate.
   * @returns The item, or undefined.
   */
  findLast(predicate: (item: T, index: number, array: T[]) => boolean): T | undefined {
    const arr = this as unknown as T[];
    for (let i = arr.length - 1; i >= 0; i--) {
      const item = arr[i]!;
      if (predicate(item, i, arr)) {
        return item;
      }
    }
    return undefined;
  }

  /**
   * Inserts an item.
   * @param index The index.
   * @param item The item.
   */
  insert(index: number, item: T): void {
    super.splice(index, 0, item);
  }

  /**
   * Removes an item.
   * @param item The item.
   * @returns true if removed.
   */
  remove(item: T): boolean {
    const index = this.indexOf(item);
    if (index >= 0) {
      this.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Removes all matching items.
   * @param predicate The predicate.
   * @returns The number removed.
   */
  removeAll(predicate: (item: T) => boolean): number {
    return removeAll(this as unknown as T[], predicate);
  }

  /**
   * Removes at an index.
   * @param index The index.
   */
  removeAt(index: number): void {
    this.splice(index, 1);
  }

  /**
   * Reverses the list in place and returns the list.
   */
  reverse(): T[] {
    super.reverse();
    return this as unknown as T[];
  }

  /**
   * Converts to array.
   * @returns This list (already an array).
   */
  toArray(): Array<T> {
    return this as unknown as T[];
  }

  /**
   * Gets a range of elements.
   * @param index The starting index.
   * @param count The count.
   * @returns A new List.
   */
  getRange(index: number, count: number): List<T> {
    const result = new List<T>();
    for (let i = index; i < index + count && i < this.length; i++) {
      result.push(this[i]!);
    }
    return result;
  }

  /**
   * Removes a range.
   * @param index The starting index.
   * @param count The count.
   */
  removeRange(index: number, count: number): void {
    this.splice(index, count);
  }

  /**
   * Checks if an item exists.
   * @param item The item.
   * @returns true if exists.
   */
  contains(item: T): boolean {
    return this.includes(item);
  }

  /**
   * Gets or sets an item.
   * @param index The index.
   */
  item(index: number): T {
    return this[index]!;
  }
}
