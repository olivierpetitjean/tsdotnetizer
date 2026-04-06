/**
 * Tests for array utilities
 */

import { describe, it, expect } from 'vitest';
import {
  add,
  addRange,
  clear,
  findIndex,
  findLastIndex,
  insert,
  remove,
  removeAll,
  removeAt,
  clone,
  List,
} from '../../src/array';

describe('Array functions', () => {
  describe('add', () => {
    it('should add item', () => {
      const arr: number[] = [];
      add(arr, 1);
      expect(arr).toEqual([1]);
    });
  });

  describe('addRange', () => {
    it('should add multiple items', () => {
      const arr: number[] = [1];
      addRange(arr, [2, 3]);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('clear', () => {
    it('should remove all items', () => {
      const arr = [1, 2, 3];
      clear(arr);
      expect(arr).toEqual([]);
    });
  });

  describe('findIndex', () => {
    it('should find index of matching element', () => {
      // Use values where index and value don't coincide to avoid confusion
      const arr = [10, 20, 30, 40, 50];
      expect(findIndex(arr, x => x > 25)).toBe(2); // element 30 is at index 2
      expect(findIndex(arr, x => x > 100)).toBe(-1);
    });
  });

  describe('findLastIndex', () => {
    it('should find last index of matching element', () => {
      const arr = [1, 2, 3, 2, 1];
      expect(findLastIndex(arr, x => x === 2)).toBe(3);
      expect(findLastIndex(arr, x => x > 10)).toBe(-1);
    });
  });

  describe('insert', () => {
    it('should insert at index', () => {
      const arr = [1, 3];
      insert(arr, 1, 2);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('remove', () => {
    it('should remove first occurrence', () => {
      const arr = [1, 2, 3, 2];
      expect(remove(arr, 2)).toBe(true);
      expect(arr).toEqual([1, 3, 2]);
    });

    it('should return false if not found', () => {
      const arr = [1, 2, 3];
      expect(remove(arr, 4)).toBe(false);
    });
  });

  describe('removeAll', () => {
    it('should remove all matching', () => {
      const arr = [1, 2, 3, 2, 4];
      const count = removeAll(arr, x => x > 2);
      expect(count).toBe(2);
      expect(arr).toEqual([1, 2, 2]);
    });
  });

  describe('removeAt', () => {
    it('should remove at index', () => {
      const arr = [1, 2, 3];
      removeAt(arr, 1);
      expect(arr).toEqual([1, 3]);
    });
  });

  describe('clone', () => {
    it('should create shallow copy', () => {
      const arr = [1, 2, 3];
      const copy = clone(arr);
      expect(copy).toEqual(arr);
      expect(copy).not.toBe(arr);
    });
  });
});

describe('List', () => {
  it('should create empty', () => {
    const list = new List<number>();
    expect(list.count).toBe(0);
  });

  it('should create from items', () => {
    const list = new List([1, 2, 3]);
    expect(list.count).toBe(3);
  });

  it('should add', () => {
    const list = new List<number>();
    list.add(1);
    expect(list.count).toBe(1);
    expect(list[0]).toBe(1);
  });

  it('should addRange', () => {
    const list = new List<number>();
    list.addRange([1, 2, 3]);
    expect(list.count).toBe(3);
  });

  it('should clear', () => {
    const list = new List([1, 2, 3]);
    list.clear();
    expect(list.count).toBe(0);
  });

  it('should find', () => {
    const list = new List([1, 2, 3, 4, 5]);
    expect(list.find(x => x > 3)).toBe(4);
    expect(list.find(x => x > 10)).toBeUndefined();
  });

  it('should findIndex', () => {
    const list = new List([1, 2, 3]);
    expect(list.findIndex(x => x === 2)).toBe(1);
  });

  it('should findLast', () => {
    const list = new List([1, 2, 3, 2, 1]);
    expect(list.findLast(x => x === 2)).toBe(2);
  });

  it('should findLastIndex', () => {
    const list = new List([1, 2, 3, 2, 1]);
    expect(list.findLastIndex(x => x === 2)).toBe(3);
  });

  it('should insert', () => {
    const list = new List([1, 3]);
    list.insert(1, 2);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it('should remove', () => {
    const list = new List([1, 2, 3]);
    expect(list.remove(2)).toBe(true);
    expect(list.toArray()).toEqual([1, 3]);
  });

  it('should removeAll', () => {
    const list = new List([1, 2, 3, 4, 5]);
    const count = list.removeAll(x => x > 3);
    expect(count).toBe(2);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it('should removeAt', () => {
    const list = new List([1, 2, 3]);
    list.removeAt(1);
    expect(list.toArray()).toEqual([1, 3]);
  });

  it('should reverse', () => {
    const list = new List([1, 2, 3]);
    list.reverse();
    expect(list.toArray()).toEqual([3, 2, 1]);
  });

  it('should getRange', () => {
    const list = new List([1, 2, 3, 4, 5]);
    const range = list.getRange(1, 3);
    expect(range.toArray()).toEqual([2, 3, 4]);
  });

  it('should removeRange', () => {
    const list = new List([1, 2, 3, 4, 5]);
    list.removeRange(1, 3);
    expect(list.toArray()).toEqual([1, 5]);
  });

  it('should check contains', () => {
    const list = new List([1, 2, 3]);
    expect(list.contains(2)).toBe(true);
    expect(list.contains(4)).toBe(false);
  });

  it('should get item', () => {
    const list = new List([1, 2, 3]);
    expect(list.item(0)).toBe(1);
    expect(list.item(2)).toBe(3);
  });

  it('should set capacity', () => {
    const list = new List([1, 2, 3]);
    list.capacity = 2;
    expect(list.count).toBe(2);
  });
});
