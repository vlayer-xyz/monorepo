import { Hex } from 'viem';
import { indentBlock, joinArray } from '../../noir/noir_js/encode.js';
import { encodeHex } from '../../noir/oracles/common/encode.js';

export function createPaddedValueFixture(value: Hex): string {
  const valueAsFields = encodeHex(value);
  return `PaddedValue {
  value: ${indentBlock(joinArray(valueAsFields), 1)},
  length: ${valueAsFields.length}
}`;
}
