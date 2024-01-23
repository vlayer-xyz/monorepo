import { updateNestedField } from '../../src/utils/object.js';
import { describe, it, expect } from 'vitest';

describe('updateNestedField', () => {
  it('existing key', () => {
    const object = { a: [{ bar: { c: 3 } }] };
    updateNestedField(object, ['a', '0', 'bar', 'c'], (x: number) => x + 1);
    expect(object.a[0].bar.c).to.eq(4);
  });

  it('non-existing key', () => {
    const object = { a: [{ bar: { c: 3 } }] };
    updateNestedField(object, ['x', '0', 'y', 'z'], () => 5);
    expect(object.x[0].y.z).to.eq(5);
  });
});
