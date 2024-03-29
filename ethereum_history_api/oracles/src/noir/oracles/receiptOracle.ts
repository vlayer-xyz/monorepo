import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { assert } from '../../util/assert.js';
import { decodeField } from './common/decode.js';
import { NoirArguments } from './oracles.js';
import { AlchemyClient } from '../../ethereum/client.js';
import { getReceiptProof } from '../../ethereum/receiptProof.js';
import { encodeReceipt, encodeReceiptProof } from './receiptOracle/encode.js';
import { txTypeToHex } from '../../ethereum/receipt.js';

export enum ARGS {
  BLOCK_NUM_INDEX,
  TX_ID_INDEX
}
const GET_RECEIPT_ARGS_COUNT = Object.keys(ARGS).length;

export enum OFFSETS {
  TX_TYPE,
  STATUS,
  STATUS_IS_SOME,
  STATE_ROOT,
  STATE_ROOT_IS_SOME,
  CUMULATIVE_GAS_USED,
  LOGS_BLOOM,
  PROOF_KEY,
  PROOF_VALUE,
  PROOF,
  PROOF_DEPTH
}

export const getReceiptOracle = async (client: AlchemyClient, args: NoirArguments): Promise<ForeignCallOutput[]> => {
  const { blockNumber, txId } = decodeGetReceiptArguments(args);
  const blockReceipts = await client.getTransactionReceipts({
    blockNumber
  });
  const receipt = blockReceipts.find((receipt) => receipt.transactionIndex === txId);
  if (!receipt) {
    throw new Error(`Transaction receipt not found for txId: ${txId}`);
  }
  const txType = txTypeToHex(receipt.type);
  const block = await client.getBlock({ blockNumber });
  const receiptProof = await getReceiptProof(block, blockReceipts, txId);

  const encodedReceipt = encodeReceipt(receipt);
  const encodedReceiptProof = encodeReceiptProof(receiptProof);
  return [txType, ...encodedReceipt, ...encodedReceiptProof];
};

export function decodeGetReceiptArguments(args: NoirArguments): {
  blockNumber: bigint;
  txId: number;
} {
  assert(args.length === GET_RECEIPT_ARGS_COUNT, `get_receipt requires ${GET_RECEIPT_ARGS_COUNT} arguments`);

  assert(args[ARGS.BLOCK_NUM_INDEX].length === 1, 'blockNumber should be a single value');
  const blockNumber = decodeField(args[ARGS.BLOCK_NUM_INDEX][0]);
  const txId = Number(decodeField(args[ARGS.TX_ID_INDEX][0]));

  return { blockNumber, txId };
}
