import { Log } from 'viem';
import { encodeHexString, indentBlock, joinArray, joinArrayVertical } from '../../noir/noir_js/encode.js';
import { createPaddedValueFixture } from './paddedValue.js';

export function createLogFixture(log: Log<bigint, number, false>): string {
  return `use crate::log::Log;

let log = Log {
  address: ${indentBlock(joinArray(encodeHexString(log.address)), 1)},
  topics: ${indentBlock(joinArrayVertical(log.topics.map((topic) => joinArray(encodeHexString(topic)))), 1)},
  data: ${indentBlock(createPaddedValueFixture(log.data), 1)},
};
`;
}
