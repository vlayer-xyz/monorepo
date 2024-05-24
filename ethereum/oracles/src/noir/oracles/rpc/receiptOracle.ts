import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { assert } from '../../../util/assert.js';
import { decodeField } from '../common/decode.js';
import { NoirArguments } from '../types.js';
import { MultiChainClient } from '../../../ethereum/client.js';
import { getReceiptProof } from '../../../ethereum/receiptProof.js';
import { encodeReceipt, encodeReceiptProof } from './receiptOracle/encode.js';
import { txTypeToHex } from '../../../ethereum/receipt.js';
import { Enum } from '../../../util/enum.js';

export enum ARGS {
  CHAIN_ID,
  BLOCK_NUM,
  TX_ID
}

export enum OFFSETS {
  TX_TYPE,
  STATUS,
  STATUS_IS_SOME,
  STATE_ROOT,
  STATE_ROOT_IS_SOME,
  CUMULATIVE_GAS_USED,
  LOGS_BLOOM,
  PROOF_INPUT
}

export const getReceiptOracle = async (
  multiChainClient: MultiChainClient,
  args: NoirArguments
): Promise<ForeignCallOutput[]> => {
  const { blockNumber, txId, chainId } = decodeGetReceiptArguments(args);
  const client = multiChainClient.getClient(chainId);
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
  return [txType, ...encodedReceipt, encodedReceiptProof];
};

export function decodeGetReceiptArguments(args: NoirArguments): {
  chainId: number;
  blockNumber: bigint;
  txId: number;
} {
  assert(args.length === Enum.size(ARGS), `get_receipt requires ${Enum.size(ARGS)} arguments`);

  assert(args[ARGS.CHAIN_ID].length === 1, 'chainId should be a single value');
  const chainId = Number(decodeField(args[ARGS.CHAIN_ID][0]));
  assert(args[ARGS.BLOCK_NUM].length === 1, 'blockNumber should be a single value');
  const blockNumber = decodeField(args[ARGS.BLOCK_NUM][0]);
  const txId = Number(decodeField(args[ARGS.TX_ID][0]));

  return { blockNumber, txId, chainId };
}
