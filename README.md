# tsDotnetizer

A modern TypeScript library that brings .NET Framework APIs and patterns to JavaScript/TypeScript.

[![npm version](https://badge.fury.io/js/tsdotnetizer.svg)](https://www.npmjs.com/package/tsdotnetizer)
[![CI](https://github.com/olivierpetitjean/tsdotnetizer/workflows/CI/badge.svg)](https://github.com/olivierpetitjean/tsdotnetizer/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **System.Linq** - Complete LINQ implementation with modern .NET 6/7/8/9 methods
  - Standard methods: `Where`, `Select`, `OrderBy`, `GroupBy`, `Join`, etc.
  - Modern methods: `Chunk`, `DistinctBy`, `ExceptBy`, `IntersectBy`, `UnionBy`, `MinBy`, `MaxBy`, `SkipLast`, `TakeLast`, `CountBy`
- **System.Collections** - Dictionary, HashSet, and other collection types
- **System.DateTime** - Date manipulation with Add methods, formatting
- **System.String** - String utilities (format, pad, split)
- **System.Diagnostics** - StopWatch for performance measurement
- **Fully typed** - Complete TypeScript support with strict types
- **Tree-shakable** - Import only what you need
- **Dual format** - ESM and CommonJS support

## Installation

```bash
npm install tsdotnetizer
```

## Quick Start

```typescript
import { enableArrayExtensions, List, Dictionary, StopWatch } from 'tsdotnetizer';

// Enable LINQ methods on arrays
enableArrayExtensions();

// LINQ operations on arrays
const numbers = [1, 2, 3, 4, 5];
const even = numbers.where(x => x % 2 === 0);
const doubled = numbers.select(x => x * 2);
const sorted = numbers.orderBy(x => x);

// Chaining
const result = [5, 2, 8, 1, 9]
  .where(x => x > 3)
  .orderBy(x => x)
  .take(2)
  .toArray(); // [5, 8]

// Dictionary
const dict = new Dictionary<string, number>();
dict.add('one', 1);
dict.add('two', 2);

// HashSet
const set = new HashSet([1, 2, 3, 2]);
console.log(set.count); // 3

// StopWatch
const sw = StopWatch.startNew();
// ... your operation
sw.stop();
console.log(`Elapsed: ${sw.elapsedMilliseconds}ms`);
```

## Module Usage

```typescript
// Core types and utilities
import { Index, Range, DayOfWeek, CultureInfo, HashCode } from 'tsdotnetizer';

// LINQ (without array extensions)
import { asEnumerable, range, LinqEnumerable } from 'tsdotnetizer';

// Collections
import { Dictionary, HashSet, List } from 'tsdotnetizer';

// Date utilities
import { DateTime, addDays, formatDate } from 'tsdotnetizer';

// String utilities
import { format, isNullOrEmpty, StringClass } from 'tsdotnetizer';

// Number utilities
import { NumberClass, clamp } from 'tsdotnetizer';

// Diagnostics
import { StopWatch } from 'tsdotnetizer';
```

## API Reference

### LINQ Methods

All standard LINQ methods are available:

- **Filtering**: `where`, `skip`, `take`, `skipWhile`, `takeWhile`, `distinct`, `distinctBy`
- **Projection**: `select`, `selectMany`
- **Ordering**: `orderBy`, `orderByDescending`, `thenBy`, `thenByDescending`
- **Grouping**: `groupBy`
- **Joining**: `join`
- **Set Operations**: `union`, `unionBy`, `intersect`, `intersectBy`, `except`, `exceptBy`
- **Quantifiers**: `all`, `any`, `contains`
- **Aggregation**: `count`, `countBy`, `sum`, `average`, `max`, `maxBy`, `min`, `minBy`, `aggregate`
- **Element Access**: `first`, `firstOrDefault`, `last`, `lastOrDefault`, `single`, `singleOrDefault`, `elementAt`, `elementAtOrDefault`
- **Conversion**: `toArray`, `toSet`, `toMap`
- **Others**: `chunk`, `skipLast`, `takeLast`, `concat`, `append`, `prepend`, `zip`, `withIndex`, `forEach`

### Collections

**Dictionary<TKey, TValue>**

- `add(key, value)`, `set(key, value)`, `get(key)`, `remove(key)`
- `containsKey(key)`, `containsValue(value)`
- `keys`, `values`, `count`
- `tryGetValue(key)`

**HashSet<T>**

- `add(item)`, `remove(item)`, `contains(item)`, `clear()`
- `unionWith(other)`, `intersectWith(other)`, `exceptWith(other)`, `symmetricExceptWith(other)`
- `isSubsetOf(other)`, `isSupersetOf(other)`, `isProperSubsetOf(other)`, `isProperSupersetOf(other)`
- `overlaps(other)`, `setEquals(other)`

**List<T>**

- `add(item)`, `addRange(items)`, `insert(index, item)`
- `remove(item)`, `removeAll(predicate)`, `removeAt(index)`, `removeRange(index, count)`
- `find(predicate)`, `findIndex(predicate)`, `findLast(predicate)`, `findLastIndex(predicate)`
- `reverse()`, `getRange(index, count)`, `toArray()`, `clear()`

### Date Utilities

**DateTime static methods**:

- `DateTime.now`, `DateTime.today`
- `DateTime.isLeapYear(year)`, `DateTime.daysInMonth(year, month)`
- `DateTime.compare(d1, d2)`, `DateTime.parse(value)`, `DateTime.tryParse(value)`

**Instance methods**:

- `addDays(date, value)`, `addMonths(date, value)`, `addYears(date, value)`
- `addHours(date, value)`, `addMinutes(date, value)`, `addSeconds(date, value)`
- `formatDate(date, format)`

### String Utilities

- `format(format, ...args)` - Replaces {0}, {1}, etc. with arguments
- `isNullOrEmpty(str)`, `isNullOrWhiteSpace(str)`
- `padLeft(str, totalWidth, paddingChar)`, `padRight(str, totalWidth, paddingChar)`
- `startsWith(str, searchString)`, `endsWith(str, searchString)`, `contains(str, searchString)`
- `compareStrings(s1, s2)`, `replace(str, oldValue, newValue)`
- `join(separator, values)`

### Number Utilities

- `NumberClass.parse(str)`, `NumberClass.tryParse(str)`
- `NumberClass.clamp(value, min, max)`
- `NumberClass.isValid(value)`

### Diagnostics

**StopWatch**:

- `StopWatch.startNew()`
- `start()`, `stop()`, `reset()`, `restart()`
- `elapsedMilliseconds`, `elapsedSeconds`, `isRunning`
- `StopWatch.measure(fn)`, `StopWatch.measureAsync(fn)`

## Migration from Legacy tsDotnetize

If you were using the legacy `tsDotnetize` library:

1. **Install the new package**:

   ```bash
   npm uninstall tsDotnetize
   npm install tsdotnetizer
   ```

2. **Update imports**:

   ```typescript
   // Old
   /// <reference path="tsDotnetize.d.ts" />

   // New
   import { enableArrayExtensions, ... } from 'tsdotnetizer';
   ```

3. **Bug fixes** in the new version:
   - `Millisecond` property (was misspelled `Milliecond`)
   - Proper TypeScript types (no more `any` returns)
   - Better error messages
   - More complete implementations

4. **New features** available:
   - Modern LINQ methods (Chunk, DistinctBy, etc.)
   - HashSet collection
   - Index and Range types
   - Better async support

## License

MIT © [Olivier Petitjean](https://github.com/olivierpetitjean)
