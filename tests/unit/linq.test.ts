/**
 * Tests for LINQ functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  LinqEnumerable,
  asEnumerable,
  range,
  repeat,
  empty,
  extendArrayPrototype,
} from '../../src/linq';

describe('LinqEnumerable', () => {
  describe('Creation', () => {
    it('should create from array', () => {
      const enumerable = new LinqEnumerable([1, 2, 3]);
      expect([...enumerable]).toEqual([1, 2, 3]);
    });

    it('should create from iterable', () => {
      const set = new Set([1, 2, 3]);
      const enumerable = new LinqEnumerable(set);
      expect([...enumerable]).toEqual([1, 2, 3]);
    });
  });

  describe('Quantifiers', () => {
    it('should check all elements match predicate', () => {
      const enumerable = new LinqEnumerable([2, 4, 6]);
      expect(enumerable.all(x => x % 2 === 0)).toBe(true);
      expect(enumerable.all(x => x > 3)).toBe(false);
    });

    it('should check if any element exists', () => {
      const emptyEnum = new LinqEnumerable<number>([]);
      const nonEmpty = new LinqEnumerable([1]);

      expect(emptyEnum.any()).toBe(false);
      expect(nonEmpty.any()).toBe(true);
    });

    it('should check if any matches predicate', () => {
      const enumerable = new LinqEnumerable([1, 2, 3]);
      expect(enumerable.any(x => x > 2)).toBe(true);
      expect(enumerable.any(x => x > 5)).toBe(false);
    });

    it('should check contains', () => {
      const enumerable = new LinqEnumerable([1, 2, 3]);
      expect(enumerable.contains(2)).toBe(true);
      expect(enumerable.contains(5)).toBe(false);
    });

    it('should check isEmpty', () => {
      expect(new LinqEnumerable([]).isEmpty()).toBe(true);
      expect(new LinqEnumerable([1]).isEmpty()).toBe(false);
    });
  });

  describe('Filtering', () => {
    it('should filter with where', () => {
      const result = new LinqEnumerable([1, 2, 3, 4, 5]).where(x => x > 2).toArray();
      expect(result).toEqual([3, 4, 5]);
    });

    it('should take elements', () => {
      const result = new LinqEnumerable([1, 2, 3, 4, 5]).take(3).toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should skip elements', () => {
      const result = new LinqEnumerable([1, 2, 3, 4, 5]).skip(2).toArray();
      expect(result).toEqual([3, 4, 5]);
    });

    it('should take last elements', () => {
      const result = new LinqEnumerable([1, 2, 3, 4, 5]).takeLast(2).toArray();
      expect(result).toEqual([4, 5]);
    });

    it('should skip last elements', () => {
      const result = new LinqEnumerable([1, 2, 3, 4, 5]).skipLast(2).toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should take while predicate is true', () => {
      const result = new LinqEnumerable([1, 2, 3, 2, 1]).takeWhile(x => x < 3).toArray();
      expect(result).toEqual([1, 2]);
    });

    it('should skip while predicate is true', () => {
      const result = new LinqEnumerable([1, 2, 3, 2, 1]).skipWhile(x => x < 3).toArray();
      expect(result).toEqual([3, 2, 1]);
    });

    it('should provide default if empty', () => {
      const result = new LinqEnumerable<number>([]).defaultIfEmpty(0).toArray();
      expect(result).toEqual([0]);
    });

    it('should not add default if not empty', () => {
      const result = new LinqEnumerable([1, 2]).defaultIfEmpty(0).toArray();
      expect(result).toEqual([1, 2]);
    });
  });

  describe('Projection', () => {
    it('should select elements', () => {
      const result = new LinqEnumerable([1, 2, 3]).select(x => x * 2).toArray();
      expect(result).toEqual([2, 4, 6]);
    });

    it('should select with index', () => {
      const result = new LinqEnumerable(['a', 'b', 'c']).select((x, i) => `${i}:${x}`).toArray();
      expect(result).toEqual(['0:a', '1:b', '2:c']);
    });

    it('should select many', () => {
      const enumerable = new LinqEnumerable([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
      const result = enumerable.selectMany(x => x).toArray();
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should ofType filters non-object elements', () => {
      const mixed = new LinqEnumerable<unknown>([1, { id: 1 }, 'hello', { id: 2 }, null]);
      const result = mixed.ofType<{ id: number }>().toArray();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1 });
      expect(result[1]).toEqual({ id: 2 });
    });
  });

  describe('Aggregation', () => {
    it('should count elements', () => {
      expect(new LinqEnumerable([1, 2, 3]).count()).toBe(3);
      expect(new LinqEnumerable([1, 2, 3]).count(x => x > 1)).toBe(2);
    });

    it('should count by key', () => {
      const enumerable = new LinqEnumerable(['a', 'b', 'a', 'c', 'a']);
      const result = enumerable.countBy(x => x).toArray();
      expect(result).toContainEqual(['a', 3]);
      expect(result).toContainEqual(['b', 1]);
      expect(result).toContainEqual(['c', 1]);
    });

    it('should sum', () => {
      const enumerable = new LinqEnumerable([{ value: 1 }, { value: 2 }, { value: 3 }]);
      expect(enumerable.sum(x => x.value)).toBe(6);
    });

    it('should average', () => {
      const enumerable = new LinqEnumerable([{ value: 2 }, { value: 4 }, { value: 6 }]);
      expect(enumerable.average(x => x.value)).toBe(4);
    });

    it('should throw on empty average', () => {
      const enumerable = new LinqEnumerable<{ value: number }>([]);
      expect(() => enumerable.average(x => x.value)).toThrow();
    });

    it('should aggregate', () => {
      const enumerable = new LinqEnumerable([1, 2, 3, 4]);
      const sum = enumerable.aggregate((acc, x) => acc + x);
      expect(sum).toBe(10);
    });

    it('should aggregate with seed', () => {
      const enumerable = new LinqEnumerable([1, 2, 3]);
      const result = enumerable.aggregate(10, (acc, x) => acc + x);
      expect(result).toBe(16);
    });

    it('should aggregate with result selector', () => {
      const enumerable = new LinqEnumerable([1, 2, 3]);
      const result = enumerable.aggregate(
        0,
        (acc, x) => acc + x,
        acc => `Sum: ${acc}`
      );
      expect(result).toBe('Sum: 6');
    });
  });

  describe('Set Operations', () => {
    it('should return distinct elements', () => {
      const result = new LinqEnumerable([1, 2, 2, 3, 3, 3]).distinct().toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return distinct by key', () => {
      const items = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 1, name: 'C' },
      ];
      const result = new LinqEnumerable(items).distinctBy(x => x.id).toArray();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, name: 'A' });
      expect(result[1]).toEqual({ id: 2, name: 'B' });
    });

    it('should return except', () => {
      const result = new LinqEnumerable([1, 2, 3, 4]).except([2, 4]).toArray();
      expect(result).toEqual([1, 3]);
    });

    it('should return except by key', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = new LinqEnumerable(items).exceptBy([2], x => x.id).toArray();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1 });
      expect(result[1]).toEqual({ id: 3 });
    });

    it('should return intersect', () => {
      const result = new LinqEnumerable([1, 2, 3]).intersect([2, 3, 4]).toArray();
      expect(result).toEqual([2, 3]);
    });

    it('should return intersect by key', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = new LinqEnumerable(items).intersectBy([2, 3, 4], x => x.id).toArray();
      expect(result).toHaveLength(2);
    });

    it('should return union', () => {
      const result = new LinqEnumerable([1, 2, 3]).union([3, 4, 5]).toArray();
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return union by key', () => {
      const items = [{ id: 1 }, { id: 2 }];
      const other = [{ id: 2 }, { id: 3 }];
      const result = new LinqEnumerable(items).unionBy(other, x => x.id).toArray();
      expect(result).toHaveLength(3);
    });
  });

  describe('Element Access', () => {
    it('should get first', () => {
      expect(new LinqEnumerable([1, 2, 3]).first()).toBe(1);
    });

    it('should throw on empty first', () => {
      expect(() => new LinqEnumerable<number>([]).first()).toThrow();
    });

    it('should get first with predicate', () => {
      expect(new LinqEnumerable([1, 2, 3]).first(x => x > 1)).toBe(2);
    });

    it('should get first or default', () => {
      expect(new LinqEnumerable<number>([]).firstOrDefault()).toBeUndefined();
      expect(new LinqEnumerable([1, 2]).firstOrDefault()).toBe(1);
    });

    it('should get last', () => {
      expect(new LinqEnumerable([1, 2, 3]).last()).toBe(3);
    });

    it('should get last with predicate', () => {
      expect(new LinqEnumerable([1, 2, 3, 4]).last(x => x < 4)).toBe(3);
    });

    it('should get single', () => {
      expect(new LinqEnumerable([42]).single()).toBe(42);
    });

    it('should throw on empty single', () => {
      expect(() => new LinqEnumerable<number>([]).single()).toThrow();
    });

    it('should throw on multiple single', () => {
      expect(() => new LinqEnumerable([1, 2]).single()).toThrow();
    });

    it('should get element at index', () => {
      expect(new LinqEnumerable([1, 2, 3]).elementAt(1)).toBe(2);
    });

    it('should throw on out of range', () => {
      expect(() => new LinqEnumerable([1, 2]).elementAt(5)).toThrow();
    });

    it('should get element at from end', () => {
      expect(new LinqEnumerable([1, 2, 3]).elementAt({ isFromEnd: true, value: 1 })).toBe(3);
    });

    it('should get element at or default', () => {
      expect(new LinqEnumerable([1, 2, 3]).elementAtOrDefault(1)).toBe(2);
      expect(new LinqEnumerable([1, 2, 3]).elementAtOrDefault(10)).toBeUndefined();
    });

    it('should get last or default', () => {
      expect(new LinqEnumerable<number>([]).lastOrDefault()).toBeUndefined();
      expect(new LinqEnumerable([1, 2, 3]).lastOrDefault()).toBe(3);
    });

    it('should get last or default with predicate', () => {
      expect(new LinqEnumerable([1, 2, 3]).lastOrDefault(x => x < 3)).toBe(2);
      expect(new LinqEnumerable([1, 2, 3]).lastOrDefault(x => x > 10)).toBeUndefined();
    });

    it('should get single or default', () => {
      expect(new LinqEnumerable<number>([]).singleOrDefault()).toBeUndefined();
      expect(new LinqEnumerable([42]).singleOrDefault()).toBe(42);
    });

    it('should throw on multiple for single or default', () => {
      expect(() => new LinqEnumerable([1, 2]).singleOrDefault()).toThrow();
    });

    it('should get single or default with predicate', () => {
      expect(new LinqEnumerable([1, 2, 3]).singleOrDefault(x => x === 2)).toBe(2);
      expect(new LinqEnumerable([1, 2, 3]).singleOrDefault(x => x > 10)).toBeUndefined();
    });
  });

  describe('Ordering', () => {
    it('should order by', () => {
      const result = new LinqEnumerable([3, 1, 2]).orderBy(x => x).toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should order by descending', () => {
      const result = new LinqEnumerable([3, 1, 2]).orderByDescending(x => x).toArray();
      expect(result).toEqual([3, 2, 1]);
    });

    it('should then by', () => {
      const items = [
        { name: 'A', age: 2 },
        { name: 'B', age: 1 },
        { name: 'A', age: 1 },
      ];
      const result = new LinqEnumerable(items)
        .orderBy(x => x.name)
        .thenBy(x => x.age)
        .toArray();
      expect(result[0]).toEqual({ name: 'A', age: 1 });
      expect(result[1]).toEqual({ name: 'A', age: 2 });
      expect(result[2]).toEqual({ name: 'B', age: 1 });
    });

    it('should then by descending', () => {
      const items = [
        { name: 'A', age: 1 },
        { name: 'A', age: 2 },
      ];
      const result = new LinqEnumerable(items)
        .orderBy(x => x.name)
        .thenByDescending(x => x.age)
        .toArray();
      expect(result[0]).toEqual({ name: 'A', age: 2 });
      expect(result[1]).toEqual({ name: 'A', age: 1 });
    });
  });

  describe('Grouping', () => {
    it('should group by', () => {
      const items = ['a', 'bb', 'c', 'ddd'];
      const groups = new LinqEnumerable(items).groupBy(x => x.length).toArray();

      expect(groups).toHaveLength(3);
      expect(groups[0]).toBeDefined();
      expect(groups[0]!.key).toBe(1);
      expect([...groups[0]!]).toEqual(['a', 'c']);
    });

    it('should group by with element selector', () => {
      const items = ['a', 'bb', 'c'];
      const groups = new LinqEnumerable(items)
        .groupBy(
          x => x.length,
          x => x.toUpperCase()
        )
        .toArray();

      expect(groups[0]).toBeDefined();
      expect([...groups[0]!]).toEqual(['A', 'C']);
    });
  });

  describe('Min/Max', () => {
    it('should get max', () => {
      expect(new LinqEnumerable([1, 3, 2]).max()).toBe(3);
    });

    it('should get max with selector', () => {
      const items = [{ value: 1 }, { value: 3 }, { value: 2 }];
      expect(new LinqEnumerable(items).max(x => x.value)).toBe(3);
    });

    it('should throw on empty max', () => {
      expect(() => new LinqEnumerable<number>([]).max()).toThrow();
    });

    it('should get max by key', () => {
      const items = [
        { id: 1, name: 'A' },
        { id: 3, name: 'B' },
      ];
      expect(new LinqEnumerable(items).maxBy(x => x.id).name).toBe('B');
    });

    it('should get min', () => {
      expect(new LinqEnumerable([3, 1, 2]).min()).toBe(1);
    });

    it('should get min with selector', () => {
      const items = [{ value: 3 }, { value: 1 }, { value: 2 }];
      expect(new LinqEnumerable(items).min(x => x.value)).toBe(1);
    });

    it('should get min by key', () => {
      const items = [
        { id: 3, name: 'A' },
        { id: 1, name: 'B' },
      ];
      expect(new LinqEnumerable(items).minBy(x => x.id).name).toBe('B');
    });
  });

  describe('Chunking', () => {
    it('should chunk elements', () => {
      const result = new LinqEnumerable([1, 2, 3, 4, 5]).chunk(2).toArray();
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should throw on invalid chunk size', () => {
      expect(() => new LinqEnumerable([1]).chunk(0)).toThrow();
    });
  });

  describe('Joins', () => {
    it('should join sequences', () => {
      const outer = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ];
      const inner = [
        { id: 1, value: 10 },
        { id: 2, value: 20 },
      ];

      const result = new LinqEnumerable(outer)
        .join(
          inner,
          o => o.id,
          i => i.id,
          (o, i) => ({ name: o.name, value: i.value })
        )
        .toArray();

      expect(result).toEqual([
        { name: 'A', value: 10 },
        { name: 'B', value: 20 },
      ]);
    });
  });

  describe('Concatenation', () => {
    it('should append element', () => {
      const result = new LinqEnumerable([1, 2]).append(3).toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should prepend element', () => {
      const result = new LinqEnumerable([2, 3]).prepend(1).toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should concat sequences', () => {
      const result = new LinqEnumerable([1, 2]).concat([3, 4]).toArray();
      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe('Conversion', () => {
    it('should convert to array', () => {
      const arr = new LinqEnumerable([1, 2, 3]).toArray();
      expect(Array.isArray(arr)).toBe(true);
      expect(arr).toEqual([1, 2, 3]);
    });

    it('should convert to map', () => {
      const items = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ];
      const map = new LinqEnumerable(items).toMap(x => x.id);
      expect(map.get(1)).toEqual({ id: 1, name: 'A' });
      expect(map.get(2)).toEqual({ id: 2, name: 'B' });
    });

    it('should convert to set', () => {
      const set = new LinqEnumerable([1, 2, 2, 3]).toSet();
      expect(set.size).toBe(3);
      expect([...set]).toEqual([1, 2, 3]);
    });

    it('should try get non-enumerated count', () => {
      const [success, count] = new LinqEnumerable([1, 2, 3]).tryGetNonEnumeratedCount();
      expect(success).toBe(true);
      expect(count).toBe(3);
    });
  });

  describe('Zipping', () => {
    it('should zip two sequences', () => {
      const result = new LinqEnumerable([1, 2, 3]).zip(['a', 'b', 'c']).toArray();
      expect(result).toEqual([
        [1, 'a'],
        [2, 'b'],
        [3, 'c'],
      ]);
    });

    it('should zip with result selector', () => {
      const result = new LinqEnumerable([1, 2]).zip(['a', 'b'], (n, s) => `${n}${s}`).toArray();
      expect(result).toEqual(['1a', '2b']);
    });

    it('should zip three sequences', () => {
      const result = new LinqEnumerable([1, 2]).zip([10, 20], [100, 200]).toArray();
      expect(result).toEqual([
        [1, 10, 100],
        [2, 20, 200],
      ]);
    });

    it('should zip three sequences with result selector', () => {
      const result = new LinqEnumerable([1, 2])
        .zip([10, 20], [100, 200], (a, b, c) => a + b + c)
        .toArray();
      expect(result).toEqual([111, 222]);
    });
  });

  describe('WithIndex', () => {
    it('should pair elements with index', () => {
      const result = new LinqEnumerable(['a', 'b', 'c']).withIndex().toArray();
      expect(result).toEqual([
        { index: 0, value: 'a' },
        { index: 1, value: 'b' },
        { index: 2, value: 'c' },
      ]);
    });
  });

  describe('Iteration', () => {
    it('should support forEach', () => {
      const items: number[] = [];
      new LinqEnumerable([1, 2, 3]).forEach((x, i) => {
        items.push(x + i);
      });
      expect(items).toEqual([1, 3, 5]);
    });
  });
});

describe('Utility functions', () => {
  describe('asEnumerable', () => {
    it('should wrap iterable', () => {
      const result = asEnumerable([1, 2, 3]).toArray();
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('range', () => {
    it('should generate range', () => {
      const result = range(5, 3).toArray();
      expect(result).toEqual([5, 6, 7]);
    });
  });

  describe('repeat', () => {
    it('should repeat value', () => {
      const result = repeat('x', 3).toArray();
      expect(result).toEqual(['x', 'x', 'x']);
    });
  });

  describe('empty', () => {
    it('should return empty sequence', () => {
      const result = empty().toArray();
      expect(result).toEqual([]);
    });
  });
});

describe('Array Extensions', () => {
  beforeEach(() => {
    extendArrayPrototype();
  });

  it('should extend Array with where', () => {
    const result = [1, 2, 3].where(x => x > 1).toArray();
    expect(result).toEqual([2, 3]);
  });

  it('should extend Array with select (returns array)', () => {
    const result = [1, 2, 3].select(x => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  it('should extend Array with orderBy', () => {
    const result = [3, 1, 2].orderBy(x => x).toArray();
    expect(result).toEqual([1, 2, 3]);
  });

  it('should extend Array with first', () => {
    expect([1, 2, 3].first()).toBe(1);
  });

  it('should extend Array with count', () => {
    expect([1, 2, 3].count()).toBe(3);
    expect([1, 2, 3].count(x => x > 1)).toBe(2);
  });

  it('should extend Array with sum', () => {
    expect([1, 2, 3].sum(x => x)).toBe(6);
  });

  it('should extend Array with average', () => {
    expect([2, 4, 6].average(x => x)).toBe(4);
  });

  it('should extend Array with max', () => {
    expect([1, 3, 2].max()).toBe(3);
  });

  it('should extend Array with min', () => {
    expect([3, 1, 2].min()).toBe(1);
  });

  it('should extend Array with distinct', () => {
    const result = [1, 2, 2, 3].distinct().toArray();
    expect(result).toEqual([1, 2, 3]);
  });

  it('should extend Array with skip and take', () => {
    const result = [1, 2, 3, 4, 5].skip(1).take(3).toArray();
    expect(result).toEqual([2, 3, 4]);
  });

  it('should chain multiple operations', () => {
    const result = [5, 2, 8, 1, 9]
      .where(x => x > 3)
      .orderBy(x => x)
      .take(2)
      .toArray();
    expect(result).toEqual([5, 8]);
  });
});
