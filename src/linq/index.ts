/**
 * LINQ module exports
 */

export type { IGrouping, IOrderedEnumerable, ILinqEnumerable } from './interfaces';

// ordered.ts must be imported before enumerable.ts to register the factory
export { OrderedEnumerable } from './ordered';
export { LinqEnumerable, registerOrderedFactory } from './enumerable';
export { extendArrayPrototype, asEnumerable, range, repeat, empty } from './extensions';
