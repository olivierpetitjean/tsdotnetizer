/**
 * Tests for collections
 */

import { describe, it, expect } from 'vitest';
import { Dictionary, HashSet } from '../../src/collections';

describe('Dictionary', () => {
  it('should create empty', () => {
    const dict = new Dictionary<string, number>();
    expect(dict.count).toBe(0);
  });

  it('should add items', () => {
    const dict = new Dictionary<string, number>();
    dict.add('one', 1);
    dict.add('two', 2);
    expect(dict.count).toBe(2);
  });

  it('should throw on duplicate key', () => {
    const dict = new Dictionary<string, number>();
    dict.add('key', 1);
    expect(() => dict.add('key', 2)).toThrow();
  });

  it('should set and get values', () => {
    const dict = new Dictionary<string, number>();
    dict.set('key', 42);
    expect(dict.get('key')).toBe(42);
  });

  it('should return undefined for missing key', () => {
    const dict = new Dictionary<string, number>();
    expect(dict.get('missing')).toBeUndefined();
  });

  it('should check containsKey', () => {
    const dict = new Dictionary<string, number>();
    dict.add('key', 1);
    expect(dict.containsKey('key')).toBe(true);
    expect(dict.containsKey('missing')).toBe(false);
  });

  it('should check containsValue', () => {
    const dict = new Dictionary<string, number>();
    dict.add('one', 1);
    dict.add('two', 2);
    expect(dict.containsValue(1)).toBe(true);
    expect(dict.containsValue(3)).toBe(false);
  });

  it('should remove items', () => {
    const dict = new Dictionary<string, number>();
    dict.add('key', 1);
    expect(dict.remove('key')).toBe(true);
    expect(dict.remove('key')).toBe(false);
    expect(dict.count).toBe(0);
  });

  it('should clear', () => {
    const dict = new Dictionary<string, number>();
    dict.add('one', 1);
    dict.add('two', 2);
    dict.clear();
    expect(dict.count).toBe(0);
  });

  it('should get keys', () => {
    const dict = new Dictionary<string, number>();
    dict.add('b', 2);
    dict.add('a', 1);
    expect(dict.keys).toContain('a');
    expect(dict.keys).toContain('b');
  });

  it('should get values', () => {
    const dict = new Dictionary<string, number>();
    dict.add('one', 1);
    dict.add('two', 2);
    expect(dict.values).toContain(1);
    expect(dict.values).toContain(2);
  });

  it('should try get value', () => {
    const dict = new Dictionary<string, number>();
    dict.add('key', 42);
    const [success, value] = dict.tryGetValue('key');
    expect(success).toBe(true);
    expect(value).toBe(42);
  });

  it('should fail try get for missing key', () => {
    const dict = new Dictionary<string, number>();
    const [success, value] = dict.tryGetValue('missing');
    expect(success).toBe(false);
    expect(value).toBeUndefined();
  });

  it('should create from entries', () => {
    const dict = new Dictionary([
      ['a', 1],
      ['b', 2],
    ]);
    expect(dict.count).toBe(2);
    expect(dict.get('a')).toBe(1);
  });

  it('should create from key-value pairs', () => {
    const dict = new Dictionary([
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
    ]);
    expect(dict.count).toBe(2);
  });

  it('should iterate', () => {
    const dict = new Dictionary<string, number>();
    dict.add('a', 1);
    dict.add('b', 2);
    const items: Array<[string, number]> = [];
    for (const item of dict) {
      items.push([item.key, item.value]);
    }
    expect(items).toHaveLength(2);
  });

  it('should use enumerator', () => {
    const dict = new Dictionary<string, number>();
    dict.add('a', 1);
    const enumerator = dict.getEnumerator();
    expect(enumerator.moveNext()).toBe(true);
    expect(enumerator.current!.value).toBe(1);
    expect(enumerator.moveNext()).toBe(false);
  });

  it('should convert to object', () => {
    const dict = new Dictionary<string, number>();
    dict.add('a', 1);
    dict.add('b', 2);
    const obj = dict.toObject();
    expect(obj).toEqual({ a: 1, b: 2 });
  });

  it('should create from object', () => {
    const obj = { a: 1, b: 2 };
    const dict = Dictionary.fromObject(obj);
    expect(dict.get('a')).toBe(1);
    expect(dict.get('b')).toBe(2);
  });
});

describe('HashSet', () => {
  it('should create empty', () => {
    const set = new HashSet<number>();
    expect(set.count).toBe(0);
  });

  it('should create from collection', () => {
    const set = new HashSet([1, 2, 3]);
    expect(set.count).toBe(3);
  });

  it('should add items', () => {
    const set = new HashSet<number>();
    expect(set.add(1)).toBe(true);
    expect(set.add(1)).toBe(false);
    expect(set.count).toBe(1);
  });

  it('should clear', () => {
    const set = new HashSet([1, 2, 3]);
    set.clear();
    expect(set.count).toBe(0);
  });

  it('should check contains', () => {
    const set = new HashSet([1, 2, 3]);
    expect(set.contains(2)).toBe(true);
    expect(set.contains(4)).toBe(false);
  });

  it('should remove', () => {
    const set = new HashSet([1, 2, 3]);
    expect(set.remove(2)).toBe(true);
    expect(set.remove(2)).toBe(false);
    expect(set.count).toBe(2);
  });

  it('should do except with', () => {
    const set = new HashSet([1, 2, 3, 4]);
    set.exceptWith([2, 4]);
    expect([...set].sort()).toEqual([1, 3]);
  });

  it('should do intersect with', () => {
    const set = new HashSet([1, 2, 3]);
    set.intersectWith([2, 3, 4]);
    expect([...set].sort()).toEqual([2, 3]);
  });

  it('should check is subset', () => {
    const set = new HashSet([1, 2]);
    expect(set.isSubsetOf([1, 2, 3])).toBe(true);
    expect(set.isSubsetOf([1, 3])).toBe(false);
  });

  it('should check is proper subset', () => {
    const set = new HashSet([1, 2]);
    expect(set.isProperSubsetOf([1, 2, 3])).toBe(true);
    expect(set.isProperSubsetOf([1, 2])).toBe(false);
  });

  it('should check is superset', () => {
    const set = new HashSet([1, 2, 3]);
    expect(set.isSupersetOf([1, 2])).toBe(true);
    expect(set.isSupersetOf([1, 4])).toBe(false);
  });

  it('should check is proper superset', () => {
    const set = new HashSet([1, 2, 3]);
    expect(set.isProperSupersetOf([1, 2])).toBe(true);
    expect(set.isProperSupersetOf([1, 2, 3])).toBe(false);
  });

  it('should check overlaps', () => {
    const set = new HashSet([1, 2, 3]);
    expect(set.overlaps([2, 4])).toBe(true);
    expect(set.overlaps([4, 5])).toBe(false);
  });

  it('should check set equals', () => {
    const set = new HashSet([1, 2, 3]);
    expect(set.setEquals([1, 2, 3])).toBe(true);
    expect(set.setEquals([1, 2])).toBe(false);
    expect(set.setEquals([1, 2, 3, 4])).toBe(false);
  });

  it('should do symmetric except with', () => {
    const set = new HashSet([1, 2, 3]);
    set.symmetricExceptWith([2, 3, 4]);
    expect([...set].sort()).toEqual([1, 4]);
  });

  it('should do union with', () => {
    const set = new HashSet([1, 2]);
    set.unionWith([2, 3, 4]);
    expect([...set].sort()).toEqual([1, 2, 3, 4]);
  });

  it('should use enumerator', () => {
    const set = new HashSet([1, 2, 3]);
    const enumerator = set.getEnumerator();
    let count = 0;
    while (enumerator.moveNext()) {
      count++;
    }
    expect(count).toBe(3);
  });

  it('should copy to array', () => {
    const set = new HashSet([1, 2, 3]);
    const arr = new Array(3);
    set.copyTo(arr, 0);
    expect(arr).toHaveLength(3);
    expect(arr.sort()).toEqual([1, 2, 3]);
  });

  it('should remove where', () => {
    const set = new HashSet([1, 2, 3, 4, 5]);
    const count = set.removeWhere(x => x > 3);
    expect(count).toBe(2);
    expect([...set]).toEqual([1, 2, 3]);
  });

  it('should convert to array', () => {
    const set = new HashSet([1, 2, 3]);
    expect(set.toArray()).toEqual([1, 2, 3]);
  });

  it('should iterate', () => {
    const set = new HashSet([1, 2, 3]);
    const items: number[] = [];
    for (const item of set) {
      items.push(item);
    }
    expect(items.sort()).toEqual([1, 2, 3]);
  });
});
