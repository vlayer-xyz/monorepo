import { updateNestedField } from './object.js';
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
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    expect((object as any).x[0]?.y?.z).to.eq(5);
  });
});
