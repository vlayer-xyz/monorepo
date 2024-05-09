import { Hex } from 'viem';
import { indentBlock, joinArray, joinArrayVertical } from '../../noir/noir_js/encode.js';
import { encodeHex } from '../../noir/oracles/common/encode.js';
import { ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';
import { padArray } from '../../util/array.js';
import { BYTE_HEX_LEN } from '../../util/const.js';

export function createBoundedVecFixture(value: Hex): string {
  const valueAsFields = encodeHex(value);
  return `BoundedVec {
  storage: ${indentBlock(joinArray(valueAsFields), 1)},
  len: ${valueAsFields.length}
}`;
}

export function createVerticalBoundedVecFixture(values: string[]): string {
  return `BoundedVec {
  storage: ${indentBlock(joinArrayVertical(values), 1)},
  len: ${values.length}
}`;
}

export function createBoundedVecFixtureWithLen(value: Hex, max_len: number): string {
  const prefixLen = 2; // 0x
  const dataLen = (value.length - prefixLen) / BYTE_HEX_LEN;
  const input = joinArray(padArray(encodeHex(value), max_len, ZERO_PAD_VALUE));

  return `BoundedVec {
  storage: ${indentBlock(input, 1)},
  len: ${dataLen}
}`;
}
