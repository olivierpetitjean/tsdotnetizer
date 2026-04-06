/**
 * Tests for string utilities
 */

import { describe, it, expect } from 'vitest';
import {
  startsWith,
  endsWith,
  contains,
  compareStrings,
  compareTo,
  padLeft,
  padRight,
  replace,
  split,
  isNullOrEmpty,
  isNullOrWhiteSpace,
  format,
  join,
  toString,
  empty as stringEmpty,
  StringClass,
} from '../../src/string';
import { StringSplitOptions } from '../../src/core';

describe('String predicates', () => {
  it('should check startsWith', () => {
    expect(startsWith('hello world', 'hello')).toBe(true);
    expect(startsWith('hello world', 'world')).toBe(false);
  });

  it('should check endsWith', () => {
    expect(endsWith('hello world', 'world')).toBe(true);
    expect(endsWith('hello world', 'hello')).toBe(false);
  });

  it('should check contains', () => {
    expect(contains('hello world', 'lo wo')).toBe(true);
    expect(contains('hello world', 'xyz')).toBe(false);
  });
});

describe('String comparison', () => {
  it('should compare strings', () => {
    expect(compareStrings('a', 'b')).toBeLessThan(0);
    expect(compareStrings('b', 'a')).toBeGreaterThan(0);
    expect(compareStrings('a', 'a')).toBe(0);
  });

  it('should compareTo', () => {
    expect(compareTo('a', 'b')).toBeLessThan(0);
  });
});

describe('String padding', () => {
  it('should pad left', () => {
    expect(padLeft('42', 5)).toBe('   42');
    expect(padLeft('42', 5, '0')).toBe('00042');
    expect(padLeft('42', 2)).toBe('42');
  });

  it('should pad right', () => {
    expect(padRight('42', 5)).toBe('42   ');
    expect(padRight('42', 5, '0')).toBe('42000');
    expect(padRight('42', 2)).toBe('42');
  });
});

describe('String manipulation', () => {
  it('should replace', () => {
    expect(replace('hello world', 'world', 'universe')).toBe('hello universe');
    expect(replace('aaa', 'a', 'b')).toBe('bbb');
  });

  it('should split', () => {
    expect(split('a,b,c', ',')).toEqual(['a', 'b', 'c']);
  });

  it('should split with remove empty', () => {
    expect(split('a,,c', ',', StringSplitOptions.RemoveEmptyEntries)).toEqual(['a', 'c']);
  });
});

describe('String validation', () => {
  it('should check null or empty', () => {
    expect(isNullOrEmpty(null)).toBe(true);
    expect(isNullOrEmpty(undefined)).toBe(true);
    expect(isNullOrEmpty('')).toBe(true);
    expect(isNullOrEmpty('a')).toBe(false);
  });

  it('should check null or whitespace', () => {
    expect(isNullOrWhiteSpace(null)).toBe(true);
    expect(isNullOrWhiteSpace(undefined)).toBe(true);
    expect(isNullOrWhiteSpace('')).toBe(true);
    expect(isNullOrWhiteSpace('   ')).toBe(true);
    expect(isNullOrWhiteSpace('\t\n')).toBe(true);
    expect(isNullOrWhiteSpace(' a ')).toBe(false);
  });
});

describe('String formatting', () => {
  it('should format with placeholders', () => {
    expect(format('Hello {0}', 'World')).toBe('Hello World');
    expect(format('{0} {1}', 'Hello', 'World')).toBe('Hello World');
    expect(format('{0} + {1} = {2}', 1, 2, 3)).toBe('1 + 2 = 3');
  });

  it('should keep unmatched placeholders', () => {
    expect(format('{0} {1}', 'Hello')).toBe('Hello {1}');
  });

  it('should join strings', () => {
    expect(join(',', ['a', 'b', 'c'])).toBe('a,b,c');
    expect(join('-', [1, 2, 3])).toBe('1-2-3');
  });

  it('should convert to string', () => {
    expect(toString(42)).toBe('42');
    expect(toString(null)).toBe('');
    expect(toString(undefined)).toBe('');
  });

  it('should have empty string', () => {
    expect(stringEmpty).toBe('');
  });
});

describe('StringClass', () => {
  it('should have empty', () => {
    expect(StringClass.empty).toBe('');
  });

  it('should check null or empty', () => {
    expect(StringClass.isNullOrEmpty('')).toBe(true);
    expect(StringClass.isNullOrEmpty('a')).toBe(false);
  });

  it('should check null or whitespace', () => {
    expect(StringClass.isNullOrWhiteSpace('   ')).toBe(true);
    expect(StringClass.isNullOrWhiteSpace('a')).toBe(false);
  });

  it('should compare', () => {
    expect(StringClass.compare('a', 'b')).toBeLessThan(0);
  });

  it('should format', () => {
    expect(StringClass.format('Hello {0}', 'World')).toBe('Hello World');
  });

  it('should join', () => {
    expect(StringClass.join(',', ['a', 'b'])).toBe('a,b');
  });

  it('should concat', () => {
    expect(StringClass.concat('a', 'b', 'c')).toBe('abc');
  });
});
