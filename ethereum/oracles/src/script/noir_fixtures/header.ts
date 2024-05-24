import { GetBlockReturnType } from 'viem';
import { encodeHexString, joinArray } from '../../noir/noir_js/encode.js';
import { blockToHeader, headerToRlp } from '../../ethereum/blockHeader.js';
import { padArray } from '../../util/array.js';
import { MAX_HEADER_RLP_LEN } from '../../noir/oracles/rpc/headerOracle/encode.js';
import { ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';

export function createHeaderFixture(block: GetBlockReturnType): string {
  const blockHash = encodeHexString(block.hash);
  const stateRoot = encodeHexString(block.stateRoot);
  const transactionsRoot = encodeHexString(block.transactionsRoot);
  const receiptsRoot = encodeHexString(block.receiptsRoot);

  const header = blockToHeader(block);
  const headerHex = headerToRlp(header);
  const headerHexArray = encodeHexString(headerHex);
  const headerData = padArray(Array.from(headerHexArray), MAX_HEADER_RLP_LEN, ZERO_PAD_VALUE);

  const headerFixture = `use crate::header::BlockHeaderPartial;

global number = ${block.number};
global hash = ${joinArray(blockHash)};
global state_root = ${joinArray(stateRoot)};
global transactions_root = ${joinArray(transactionsRoot)};
global receipts_root = ${joinArray(receiptsRoot)};

global encoded_length: u64 = ${headerHexArray.length};
global encoded_data: [u8; ${MAX_HEADER_RLP_LEN}] = ${joinArray(headerData)};

global block_header_partial = BlockHeaderPartial { number, hash, state_root, transactions_root, receipts_root };
global block_header_rlp = BoundedVec { storage: encoded_data, len: encoded_length };
`;

  return headerFixture;
}
