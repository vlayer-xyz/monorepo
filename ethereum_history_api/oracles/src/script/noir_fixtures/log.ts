import { Log } from 'viem';
import { encodeHexString, indentBlock, joinArray } from '../../noir/noir_js/encode.js';
import { createBoundedVecFixture, createVerticalBoundedVecFixture } from './boundedVec.js';
import { padArray } from '../../util/array.js';
import { BYTES_32_ZERO } from '../../util/const.js';

const MAX_TOPICS = 4;

export function createLogFixture(log: Log<bigint, number, false>): string {
  const topics = padArray(log.topics, MAX_TOPICS, BYTES_32_ZERO);
  return `use crate::log::Log;

global log = Log {
  address: ${indentBlock(joinArray(encodeHexString(log.address)), 1)},
  topics: ${indentBlock(createVerticalBoundedVecFixture(topics.map((topic) => joinArray(encodeHexString(topic)))), 1)},
  data: ${indentBlock(createBoundedVecFixture(log.data), 1)},
};
`;
}
