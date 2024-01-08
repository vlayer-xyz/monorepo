import { assert } from './assert.js';

type PaddingDirection = 'left' | 'right'

export function padArray(array: string[], len: number, pad: string, direction: PaddingDirection = 'right') {
  assert(len >= array.length, `len param: ${len} should be greater than array length: ${array.length}`);

  const padding = new Array(len - array.length).fill(pad);
  switch (direction) {
    case "left":
      return padding.concat(array)
    case "right":
      return array.concat(padding)
  }
}

export const alterArray = function (array: readonly string[]): string[] {
  assert(array.length > 0, "Array should not be empty")
  return [incHexByte(array[0]), ...array.slice(1)];
}

function incHexByte(hexByte: string): string {
  const newByte = ((parseInt(hexByte) + 1) % 256).toString(16);
  return '0x' + newByte;
}
