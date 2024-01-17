import { describe, expect, it } from 'vitest';
import { equals } from '../../src/utils/object.js';

describe('equals', () => {
  it('true', () => {
    expect(equals([1, 2], [1, 2])).toBe(true);
    expect(equals({ a: 1 }, { a: 1 })).toBe(true);
    expect(equals({ a: 1, b: { c: 'a' } }, { a: 1, b: { c: 'a' } })).toBe(true);
  });

  it('false', () => {
    expect(equals([1, 2], [1, 3])).toBe(false);
    expect(equals({ a: 1 }, { a: 2 })).toBe(false);
    expect(equals({ a: 1, b: { c: 'a' } }, { a: 1, b: { c: 'b' } })).toBe(false);
  });
});
