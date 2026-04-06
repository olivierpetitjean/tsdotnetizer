/**
 * Dictionary implementation
 */

import type { IDictionary, IKeyValuePair, IEnumerator } from './interfaces';

/**
 * Represents a collection of keys and values.
 * @template TKey The type of the key.
 * @template TValue The type of the value.
 */
export class Dictionary<TKey, TValue> implements IDictionary<TKey, TValue> {
  private readonly _map: Map<TKey, TValue>;

  /**
   * Creates a new Dictionary.
   * @param entries Initial entries.
   */
  constructor(entries?: Iterable<[TKey, TValue]> | Iterable<IKeyValuePair<TKey, TValue>>) {
    this._map = new Map();
    if (entries) {
      for (const entry of entries) {
        if (Array.isArray(entry)) {
          this._map.set(entry[0], entry[1]);
        } else {
          this._map.set(entry.key, entry.value);
        }
      }
    }
  }

  /**
   * Gets the number of elements.
   */
  get count(): number {
    return this._map.size;
  }

  /**
   * Gets an array containing the keys.
   */
  get keys(): Array<TKey> {
    return Array.from(this._map.keys());
  }

  /**
   * Gets an array containing the values.
   */
  get values(): Array<TValue> {
    return Array.from(this._map.values());
  }

  /**
   * Gets the value associated with the specified key.
   * @param key The key.
   * @returns The value, or undefined.
   */
  get(key: TKey): TValue | undefined {
    return this._map.get(key);
  }

  /**
   * Sets the value associated with the specified key.
   * @param key The key.
   * @param value The value.
   */
  set(key: TKey, value: TValue): void {
    this._map.set(key, value);
  }

  /**
   * Adds an element with the provided key and value.
   * @param key The key.
   * @param value The value.
   * @throws {Error} If key already exists.
   */
  add(key: TKey, value: TValue): void {
    if (this._map.has(key)) {
      throw new Error('An item with the same key has already been added');
    }
    this._map.set(key, value);
  }

  /**
   * Removes the element with the specified key.
   * @param key The key.
   * @returns true if removed; false if key not found.
   */
  remove(key: TKey): boolean {
    return this._map.delete(key);
  }

  /**
   * Determines whether the dictionary contains the specified key.
   * @param key The key.
   * @returns true if key exists.
   */
  containsKey(key: TKey): boolean {
    return this._map.has(key);
  }

  /**
   * Determines whether the dictionary contains the specified value.
   * @param value The value.
   * @returns true if value exists.
   */
  containsValue(value: TValue): boolean {
    for (const v of this._map.values()) {
      if (v === value) {
        return true;
      }
    }
    return false;
  }

  /**
   * Removes all elements.
   */
  clear(): void {
    this._map.clear();
  }

  /**
   * Attempts to get the value associated with the specified key.
   * @param key The key.
   * @returns A tuple [success, value].
   */
  tryGetValue(key: TKey): [boolean, TValue | undefined] {
    if (this._map.has(key)) {
      return [true, this._map.get(key)];
    }
    return [false, undefined];
  }

  /**
   * Returns an enumerator that iterates through the collection.
   * @returns An IEnumerator.
   */
  getEnumerator(): IEnumerator<IKeyValuePair<TKey, TValue>> {
    const entries = Array.from(this._map.entries());
    let index = -1;
    return {
      get current(): IKeyValuePair<TKey, TValue> | undefined {
        if (index < 0 || index >= entries.length) {
          return undefined;
        }
        const [key, value] = entries[index]!;
        return { key, value };
      },
      moveNext(): boolean {
        index++;
        return index < entries.length;
      },
      reset(): void {
        index = -1;
      },
    };
  }

  /**
   * Gets the iterator for the sequence.
   */
  *[Symbol.iterator](): Iterator<IKeyValuePair<TKey, TValue>> {
    for (const [key, value] of this._map) {
      yield { key, value };
    }
  }

  /**
   * Converts the dictionary to a plain object.
   * @returns An object with key-value pairs.
   */
  toObject(): Record<string, TValue> {
    const obj: Record<string, TValue> = {};
    for (const [key, value] of this._map) {
      obj[String(key)] = value;
    }
    return obj;
  }

  /**
   * Creates a Dictionary from a plain object.
   * @param obj The object.
   * @returns A Dictionary.
   */
  static fromObject<TValue>(obj: Record<string, TValue>): Dictionary<string, TValue> {
    const entries = Object.entries(obj);
    return new Dictionary(entries);
  }
}
