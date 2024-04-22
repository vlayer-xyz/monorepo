import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { assert } from '../../util/assert.js';
import { decodeField } from './common/decode.js';
import { NoirArguments } from './oracles.js';
import { AlchemyClient } from '../../ethereum/client.js';
import { getReceiptProof } from '../../ethereum/receiptProof.js';
import { encodeReceipt, encodeReceiptProof } from './receiptOracle/encode.js';
import { txTypeToHex } from '../../ethereum/receipt.js';
import { ENUM_LEN_TO_ENUM_KEY_LEN_RATO } from '../../util/const.js';

export enum ARGS {
  BLOCK_NUM,
  TX_ID
}
const ARGS_COUNT = Object.keys(ARGS).length / ENUM_LEN_TO_ENUM_KEY_LEN_RATO;

export enum OFFSETS {
  TX_TYPE,
  STATUS,
  STATUS_IS_SOME,
  STATE_ROOT,
  STATE_ROOT_IS_SOME,
  CUMULATIVE_GAS_USED,
  LOGS_BLOOM,
  PROOF_KEY,
  PROOF,
  PROOF_DEPTH,
  PROOF_VALUE
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
  assert(args.length === ARGS_COUNT, `get_receipt requires ${ARGS_COUNT} arguments`);

  assert(args[ARGS.BLOCK_NUM].length === 1, 'blockNumber should be a single value');
  const blockNumber = decodeField(args[ARGS.BLOCK_NUM][0]);
  const txId = Number(decodeField(args[ARGS.TX_ID][0]));

  return { blockNumber, txId };
}
