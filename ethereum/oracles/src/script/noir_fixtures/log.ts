import { Log, toRlp } from 'viem';
import { encodeHexString, indentBlock, joinArray } from '../../noir/noir_js/encode.js';
import { createFocusedBoundedVecFixture, createVerticalBoundedVecFixture } from './boundedVec.js';
import { padArray } from '../../util/array.js';
import { BYTES_32_ZERO } from '../../util/const.js';
import { logToRlpFields } from '../../ethereum/receipt.js';
import { encodeHex } from '../../noir/oracles/common/encode.js';
import { ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';
import { MAX_RECEIPT_RLP_LEN_M } from '../../noir/oracles/rpc/common/proofConfig/receipt.js';

const MAX_TOPICS = 4;

export function createLogFixture(log: Log<bigint, number, false>, idx: number): string {
  const topics = padArray(log.topics, MAX_TOPICS, BYTES_32_ZERO);
  const logRlp = joinArray(padArray(encodeHex(toRlp(logToRlpFields(log))), MAX_RECEIPT_RLP_LEN_M, ZERO_PAD_VALUE));

  return `use crate::log::Log;

global log_idx = ${idx};
global log_rlp = ${logRlp};

global log = Log {
  address: ${indentBlock(joinArray(encodeHexString(log.address)), 1)},
  topics: ${indentBlock(
    createVerticalBoundedVecFixture(
      topics.map((topic) => joinArray(encodeHexString(topic))),
      log.topics.length
    ),
    1
  )},
  data: ${indentBlock(createFocusedBoundedVecFixture(log.data), 1)},
};
`;
}
