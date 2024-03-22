import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { assert } from '../../util/assert.js';
import { decodeField } from './common/decode.js';
import { NoirArguments } from './oracles.js';
import { AlchemyClient } from '../../ethereum/client.js';
import { getReceiptProof } from '../../ethereum/receiptProof.js';
import { encodeReceipt, encodeReceiptProof } from './receiptOracle/encode.js';

const GET_RECEIPT_ARGS_COUNT = 2;
const BLOCK_NUM_INDEX = 0;
const TX_ID_INDEX = 1;

export const OFFSETS = {
  BLOB_GAS_USED: 0,
  BLOB_GAS_PRICE: 1,
  STATUS: 2,
  STATE_ROOT: 3,
  CUMULATIVE_GAS_USED: 4,
  LOGS_BLOOM: 5,
  PROOF_KEY: 6,
  PROOF_VALUE: 7,
  PROOF: 8,
  PROOF_DEPTH: 9
};

export const getReceiptOracle = async (client: AlchemyClient, args: NoirArguments): Promise<ForeignCallOutput[]> => {
  const { blockNumber, txId } = decodeGetReceiptArguments(args);
  const blockReceipts = await client.getTransactionReceipts({
    blockNumber
  });
  const receipt = blockReceipts.find((receipt) => receipt.transactionIndex === txId);
  if (!receipt) {
    throw new Error(`Transaction receipt not found for txId: ${txId}`);
  }
  const block = await client.getBlock({ blockNumber });
  const receiptProof = await getReceiptProof(block, blockReceipts, txId);

  const encodedReceipt = encodeReceipt(receipt);
  const encodedReceiptProof = encodeReceiptProof(receiptProof);
  return [...encodedReceipt, ...encodedReceiptProof];
};

export function decodeGetReceiptArguments(args: NoirArguments): {
  blockNumber: bigint;
  txId: number;
} {
  assert(args.length === GET_RECEIPT_ARGS_COUNT, `get_receipt requires ${GET_RECEIPT_ARGS_COUNT} arguments`);

  assert(args[BLOCK_NUM_INDEX].length === 1, 'blockNumber should be a single value');
  const blockNumber = decodeField(args[BLOCK_NUM_INDEX][0]);
  const txId = Number(decodeField(args[TX_ID_INDEX][0]));

  return { blockNumber, txId };
}
