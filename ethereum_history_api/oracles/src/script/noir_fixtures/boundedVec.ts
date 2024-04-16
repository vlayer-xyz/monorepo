import { Hex } from 'viem';
import { indentBlock, joinArray, joinArrayVertical } from '../../noir/noir_js/encode.js';
import { encodeHex } from '../../noir/oracles/common/encode.js';

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
