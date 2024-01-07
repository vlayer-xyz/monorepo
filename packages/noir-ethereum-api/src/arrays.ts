import { assert } from './assert.js';

type PaddingDirection = 'left' | 'right';

export function padArray(array: string[], len: number, pad: string, direction: PaddingDirection = 'right') {
  assert(len >= array.length, `len param: ${len} should be greater than array length: ${array.length}`);

  const padding = new Array(len - array.length).fill(pad);
  switch (direction) {
    case 'left':
      return padding.concat(array);
    case 'right':
      return array.concat(padding);
  }
}
