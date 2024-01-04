import { assert } from './assert.js';

export function padArrayRight(array: string[], len: number, pad: string) {
  assert(len >= array.length, `len param: ${len} should be greater than array length: ${array.length}`);

  return array.concat(new Array(len - array.length).fill(pad))
}
