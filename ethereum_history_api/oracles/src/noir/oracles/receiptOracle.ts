import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { assert } from '../../util/assert.js';
import { decodeField } from './common/decode.js';
import { NoirArguments } from './oracles.js';
import { TransactionReceipt } from 'viem';
import { AlchemyClient } from '../../ethereum/client.js';
import { encodeField, encodeHex } from './common/encode.js';
import { statusToHex } from '../../ethereum/receipt.js';

const GET_RECEIPT_ARGS_COUNT = 2;
const BLOCK_NUM_INDEX = 0;
const TX_ID_INDEX = 1;

export const OFFSETS = {
  BLOB_GAS_USED: 0,
  BLOB_GAS_PRICE: 1,
  STATUS: 2,
  STATE_ROOT: 3,
  CUMULATIVE_GAS_USED: 4,
  LOGS_BLOOM: 5
};

export const getReceiptOracle = async (client: AlchemyClient, args: NoirArguments): Promise<ForeignCallOutput[]> => {
  const { blockNumber, txId } = decodeGetReceiptArguments(args);
  const blockReceipts = await client.getTransactionReceipts({
    blockNumber
  });
  const receipt = blockReceipts.find((receipt) => receipt.transactionIndex === Number(txId));
  if (!receipt) {
    throw new Error(`Transaction receipt not found for txId: ${txId}`);
  }
  const encodedReceipt = encodeReceipt(receipt);
  return [...encodedReceipt];
};

export function decodeGetReceiptArguments(args: NoirArguments): {
  blockNumber: bigint;
  txId: bigint;
} {
  assert(args.length === GET_RECEIPT_ARGS_COUNT, `get_receipt requires ${GET_RECEIPT_ARGS_COUNT} arguments`);

  assert(args[BLOCK_NUM_INDEX].length === 1, 'blockNumber should be a single value');
  const blockNumber = decodeField(args[BLOCK_NUM_INDEX][0]);
  const txId = decodeField(args[TX_ID_INDEX][0]);

  return { blockNumber, txId };
}

export function encodeReceipt(receipt: TransactionReceipt): ForeignCallOutput[] {
  const blobGasUsed = encodeField(receipt.blobGasUsed ?? 0);
  const blobGasPrice = encodeField(receipt.blobGasPrice ?? 0);
  const status = statusToHex(receipt.status);
  const stateRoot = encodeHex(receipt.root ?? '0x0000000000000000000000000000000000000000000000000000000000000000');
  const cumulativeGasUsed = encodeField(receipt.cumulativeGasUsed);
  const logsBloom = encodeHex(receipt.logsBloom);

  return [blobGasUsed, blobGasPrice, status, stateRoot, cumulativeGasUsed, logsBloom];
}
