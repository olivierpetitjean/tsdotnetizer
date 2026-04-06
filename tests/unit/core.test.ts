/**
 * Tests for core types and utilities
 */

import { describe, it, expect } from 'vitest';
import {
  DayOfWeek,
  StringSplitOptions,
  Index,
  Range,
  CultureInfo,
  HashCode,
  isNullOrUndefined,
  getComparator,
  stringComparator,
  numberComparator,
} from '../../src/core';

describe('DayOfWeek', () => {
  it('should have correct enum values', () => {
    expect(DayOfWeek.Sunday).toBe(0);
    expect(DayOfWeek.Monday).toBe(1);
    expect(DayOfWeek.Saturday).toBe(6);
  });
});

describe('StringSplitOptions', () => {
  it('should have correct enum values', () => {
    expect(StringSplitOptions.None).toBe(0);
    expect(StringSplitOptions.RemoveEmptyEntries).toBe(1);
  });
});

describe('Index', () => {
  it('should create index from start', () => {
    const index = Index.fromStart(5);
    expect(index.value).toBe(5);
    expect(index.isFromEnd).toBe(false);
  });

  it('should create index from end', () => {
    const index = Index.fromEnd(3);
    expect(index.value).toBe(3);
    expect(index.isFromEnd).toBe(true);
  });

  it('should calculate offset correctly', () => {
    const index = Index.fromEnd(1);
    expect(index.getOffset(10)).toBe(9);
  });

  it('should reject negative values', () => {
    expect(() => new Index(-1)).toThrow();
  });

  it('should reject non-integers', () => {
    expect(() => new Index(1.5)).toThrow();
  });

  it('should convert to string', () => {
    expect(Index.fromStart(5).toString()).toBe('5');
    expect(Index.fromEnd(3).toString()).toBe('^3');
  });
});

describe('Range', () => {
  it('should create range from start', () => {
    const range = Range.fromStart(Index.fromStart(2));
    expect(range.start.value).toBe(2);
    expect(range.end.isFromEnd).toBe(true);
  });

  it('should create range to end', () => {
    const range = Range.toEnd(Index.fromEnd(2));
    expect(range.start.value).toBe(0);
    expect(range.end.value).toBe(2);
  });

  it('should get all range', () => {
    const range = Range.all;
    expect(range.start.value).toBe(0);
    expect(range.end.isFromEnd).toBe(true);
  });

  it('should calculate offset and length', () => {
    const range = new Range(Index.fromStart(2), Index.fromEnd(1));
    const { offset, length } = range.getOffsetAndLength(10);
    expect(offset).toBe(2);
    expect(length).toBe(7);
  });

  it('should convert to string', () => {
    const range = new Range(Index.fromStart(2), Index.fromEnd(1));
    expect(range.toString()).toBe('2..^1');
  });
});

describe('CultureInfo', () => {
  it('should create with default values', () => {
    const culture = new CultureInfo();
    expect(culture.language).toBeDefined();
    expect(culture.decimalSeparator).toMatch(/^[.,]$/);
  });

  it('should get/set properties', () => {
    const culture = new CultureInfo();
    culture.decimalSeparator = ',';
    expect(culture.decimalSeparator).toBe(',');

    culture.language = 'fr';
    expect(culture.language).toBe('fr');

    culture.dateFormat = 'dd/MM/yyyy';
    expect(culture.dateFormat).toBe('dd/MM/yyyy');
  });

  it('should have singleton current instance', () => {
    const current = CultureInfo.current;
    expect(current).toBeDefined();
    expect(CultureInfo.current).toBe(current);
  });
});

describe('HashCode', () => {
  it('should generate unique IDs for objects', () => {
    const obj1 = {};
    const obj2 = {};
    expect(HashCode.get(obj1)).not.toBe(HashCode.get(obj2));
  });

  it('should return consistent IDs for same object', () => {
    const obj = {};
    expect(HashCode.get(obj)).toBe(HashCode.get(obj));
  });

  it('should handle primitives', () => {
    expect(HashCode.get('test')).toBe('string:test');
    expect(HashCode.get(42)).toBe('number:42');
    expect(HashCode.get(true)).toBe('boolean:true');
  });

  it('should handle null/undefined', () => {
    expect(HashCode.get(null)).toBe('null');
    expect(HashCode.get(undefined)).toBe('undefined');
  });

  it('should combine hash codes', () => {
    const combined = HashCode.combine('a', 'b', 'c');
    expect(typeof combined).toBe('number');
  });
});

describe('isNullOrUndefined', () => {
  it('should return true for null', () => {
    expect(isNullOrUndefined(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isNullOrUndefined(undefined)).toBe(true);
  });

  it('should return false for other values', () => {
    expect(isNullOrUndefined(0)).toBe(false);
    expect(isNullOrUndefined('')).toBe(false);
    expect(isNullOrUndefined(false)).toBe(false);
  });
});

describe('getComparator', () => {
  it('should return string comparator for strings', () => {
    const cmp = getComparator('test');
    expect(cmp('a', 'b')).toBeLessThan(0);
    expect(cmp('b', 'a')).toBeGreaterThan(0);
    expect(cmp('a', 'a')).toBe(0);
  });

  it('should return number comparator for numbers', () => {
    const cmp = getComparator(1);
    expect(cmp(1, 2)).toBeLessThan(0);
    expect(cmp(2, 1)).toBeGreaterThan(0);
    expect(cmp(1, 1)).toBe(0);
  });
});

describe('stringComparator', () => {
  it('should compare strings correctly', () => {
    expect(stringComparator('a', 'b')).toBeLessThan(0);
    expect(stringComparator('b', 'a')).toBeGreaterThan(0);
    expect(stringComparator('a', 'a')).toBe(0);
  });
});

describe('numberComparator', () => {
  it('should compare numbers correctly', () => {
    expect(numberComparator(1, 2)).toBeLessThan(0);
    expect(numberComparator(2, 1)).toBeGreaterThan(0);
    expect(numberComparator(1, 1)).toBe(0);
  });
});
