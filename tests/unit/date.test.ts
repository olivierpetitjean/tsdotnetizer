/**
 * Tests for date utilities
 */

import { describe, it, expect } from 'vitest';
import {
  addMilliseconds,
  addSeconds,
  addMinutes,
  addHours,
  addDays,
  addMonths,
  addYears,
  compareDates,
  getDate,
  getYear,
  getMonth,
  getDay,
  getDayOfWeek,
  getHour,
  getMinute,
  getSecond,
  getMillisecond,
  isLeapYear,
  daysInMonth,
  formatDate,
  DateTime,
} from '../../src/date';
import { DayOfWeek } from '../../src/core';

describe('Date manipulation', () => {
  const baseDate = new Date(2024, 0, 15, 10, 30, 45, 500); // Jan 15, 2024 10:30:45.500

  it('should add milliseconds', () => {
    const result = addMilliseconds(baseDate, 500);
    expect(result.getMilliseconds()).toBe(0);
    expect(result.getSeconds()).toBe(46);
  });

  it('should add seconds', () => {
    const result = addSeconds(baseDate, 30);
    expect(result.getSeconds()).toBe(15);
    expect(result.getMinutes()).toBe(31);
  });

  it('should add minutes', () => {
    const result = addMinutes(baseDate, 45);
    expect(result.getMinutes()).toBe(15);
    expect(result.getHours()).toBe(11);
  });

  it('should add hours', () => {
    const result = addHours(baseDate, 5);
    expect(result.getHours()).toBe(15);
  });

  it('should add days', () => {
    const result = addDays(baseDate, 10);
    expect(result.getDate()).toBe(25);
  });

  it('should add months', () => {
    const result = addMonths(baseDate, 3);
    expect(result.getMonth()).toBe(3); // April
  });

  it('should add years', () => {
    const result = addYears(baseDate, 2);
    expect(result.getFullYear()).toBe(2026);
  });
});

describe('Date getters', () => {
  const date = new Date(2024, 0, 15, 10, 30, 45, 500);

  it('should get date component', () => {
    const result = getDate(date);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });

  it('should get year', () => {
    expect(getYear(date)).toBe(2024);
  });

  it('should get month (1-12)', () => {
    expect(getMonth(date)).toBe(1);
  });

  it('should get day', () => {
    expect(getDay(date)).toBe(15);
  });

  it('should get day of week', () => {
    // Jan 15, 2024 is Monday
    expect(getDayOfWeek(date)).toBe(DayOfWeek.Monday);
  });

  it('should get hour', () => {
    expect(getHour(date)).toBe(10);
  });

  it('should get minute', () => {
    expect(getMinute(date)).toBe(30);
  });

  it('should get second', () => {
    expect(getSecond(date)).toBe(45);
  });

  it('should get millisecond', () => {
    expect(getMillisecond(date)).toBe(500);
  });
});

describe('Date comparison', () => {
  it('should compare equal dates', () => {
    const d1 = new Date(2024, 0, 15);
    const d2 = new Date(2024, 0, 15);
    expect(compareDates(d1, d2)).toBe(0);
  });

  it('should compare earlier date', () => {
    const d1 = new Date(2024, 0, 14);
    const d2 = new Date(2024, 0, 15);
    expect(compareDates(d1, d2)).toBeLessThan(0);
  });

  it('should compare later date', () => {
    const d1 = new Date(2024, 0, 16);
    const d2 = new Date(2024, 0, 15);
    expect(compareDates(d1, d2)).toBeGreaterThan(0);
  });
});

describe('Calendar utilities', () => {
  it('should identify leap years', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
  });

  it('should get days in month', () => {
    expect(daysInMonth(2024, 1)).toBe(31); // January
    expect(daysInMonth(2024, 2)).toBe(29); // February (leap)
    expect(daysInMonth(2023, 2)).toBe(28); // February (non-leap)
    expect(daysInMonth(2024, 4)).toBe(30); // April
  });
});

describe('Date formatting', () => {
  const date = new Date(2024, 0, 15, 10, 30, 45, 500);

  it('should format with default', () => {
    const result = formatDate(date, '');
    // Should return a non-empty locale string representation
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result).toBe(date.toLocaleString());
  });

  it('should format as ISO date', () => {
    const result = formatDate(date, 'd');
    expect(result).toBe('2024-01-15');
  });

  it('should format as sortable (local time, not UTC)', () => {
    const result = formatDate(date, 's');
    // .NET "s" format = ISO 8601 local time: 2024-01-15T10:30:45
    expect(result).toBe('2024-01-15T10:30:45');
  });

  it('should format with custom pattern', () => {
    const result = formatDate(date, 'yyyy-MM-dd HH:mm:ss');
    expect(result).toContain('2024-01-15');
    expect(result).toContain('10:30:45');
  });
});

describe('DateTime class', () => {
  it('should have now', () => {
    const before = new Date();
    const now = DateTime.now;
    const after = new Date();
    expect(now.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(now.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should have today', () => {
    const today = DateTime.today;
    expect(today.getHours()).toBe(0);
    expect(today.getMinutes()).toBe(0);
    expect(today.getSeconds()).toBe(0);
  });

  it('should check leap year', () => {
    expect(DateTime.isLeapYear(2024)).toBe(true);
    expect(DateTime.isLeapYear(2023)).toBe(false);
  });

  it('should get days in month', () => {
    expect(DateTime.daysInMonth(2024, 2)).toBe(29);
  });

  it('should compare dates', () => {
    const d1 = new Date(2024, 0, 14);
    const d2 = new Date(2024, 0, 15);
    expect(DateTime.compare(d1, d2)).toBeLessThan(0);
  });

  it('should create from YMD', () => {
    const date = DateTime.fromYMD(2024, 1, 15);
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(15);
  });

  it('should parse valid date', () => {
    const date = DateTime.parse('2024-01-15');
    expect(date).toBeDefined();
    expect(date!.getFullYear()).toBe(2024);
  });

  it('should return undefined for invalid', () => {
    const date = DateTime.parse('invalid');
    expect(date).toBeUndefined();
  });

  it('should try parse valid', () => {
    const [success, date] = DateTime.tryParse('2024-01-15');
    expect(success).toBe(true);
    expect(date).toBeDefined();
  });

  it('should try parse invalid', () => {
    const [success, date] = DateTime.tryParse('invalid');
    expect(success).toBe(false);
    expect(date).toBeUndefined();
  });
});
