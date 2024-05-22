import { assert } from './assert.js';
import { incHexByte } from './string.js';

type PaddingDirection = 'left' | 'right';

export function padArray<T>(array: T[], len: number, pad: T, direction: PaddingDirection = 'right'): T[] {
  assert(len >= array.length, `len param: ${len} should be greater than array length: ${array.length}`);

  const padding = new Array<T>(len - array.length).fill(pad);
  switch (direction) {
    case 'left':
      return padding.concat(array);
    case 'right':
      return array.concat(padding);
  }
}

export const alterArray = function (array: readonly string[]): string[] {
  assert(array.length > 0, 'Array should not be empty');
  return [incHexByte(array[0]), ...array.slice(1)];
};

export function last<T>(array: readonly T[]): T {
  assert(array.length > 0, 'Array should not be empty');
  return array[array.length - 1];
}

export function hasDuplicates<T>(array: T[]) {
  return new Set(array).size !== array.length;
}
