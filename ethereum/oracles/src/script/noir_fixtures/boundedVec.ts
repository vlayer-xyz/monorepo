import { Hex } from 'viem';
import { indentBlock, joinArray, joinArrayVertical } from '../../noir/noir_js/encode.js';
import { encodeHex } from '../../noir/oracles/common/encode.js';
import { ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';
import { padArray } from '../../util/array.js';
import { BYTE_HEX_LEN } from '../../util/const.js';
import { PREFIX } from '../../util/hex.js';

export function createFocusedBoundedVecFixture(value: Hex): string {
  const valueAsFields = encodeHex(value);
  return `BoundedVec {
  storage: ${indentBlock(joinArray(valueAsFields), 1)},
  len: ${valueAsFields.length}
}`;
}

export function createVerticalBoundedVecFixture(values: string[], len: number = values.length): string {
  return `BoundedVec {
  storage: ${indentBlock(joinArrayVertical(values), 1)},
  len: ${len}
}`;
}

export function createBoundedVecFixture(value: Hex, maxLen: number): string {
  const dataLen = (value.length - PREFIX.length) / BYTE_HEX_LEN;
  const input = joinArray(padArray(encodeHex(value), maxLen, ZERO_PAD_VALUE));

  return `BoundedVec {
  storage: ${indentBlock(input, 1)},
  len: ${dataLen}
}`;
}
