import { copy, updateNestedField } from './object.js';
import { describe, expect, it } from 'vitest';

describe('updateNestedField', () => {
  it('existing key', () => {
    const object = { a: [{ bar: { c: 3 } }] };
    updateNestedField(object, ['a', '0', 'bar', 'c'], (x: number) => x + 1);
    expect(object.a[0].bar.c).to.eq(4);
  });

  it('non-existing key', () => {
    const object = { a: [{ bar: { c: 3 } }] };
    expect(() => updateNestedField(object, ['x', '0', 'y', 'z'], () => 5)).toThrow(
      'Path x.0.y.z does not exist in the object'
    );
  });
});

describe('copy', () => {
  it('copy object', () => {
    const obj = { a: 1, b: [{ c: 'x' }] };
    expect(copy(obj)).toStrictEqual(obj);
  });

  it('modify initial object', () => {
    const obj = { a: 1, b: [{ c: 'x' }] };
    const objCopy = copy(obj);
    obj.a = 2;
    expect(objCopy.a).toStrictEqual(1);
  });
});
