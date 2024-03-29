import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { assert } from '../../util/assert.js';
import { decodeField } from './common/decode.js';
import { NoirArguments } from './oracles.js';
import { AlchemyClient } from '../../ethereum/client.js';
import { txTypeToHex } from '../../ethereum/receipt.js';
import { getTxProof } from '../../ethereum/txProof.js';
import { encodeTx, encodeTxProof } from './transactionOracle/encode.js';
import { decodeGetReceiptArguments } from './receiptOracle.js';

enum ARGS {
  BLOCK_NUM_INDEX,
  TX_ID_INDEX
}
const GET_TX_ARGS_COUNT = Object.keys(ARGS).length;

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

export const getTransactionOracle = async (
  client: AlchemyClient,
  args: NoirArguments
): Promise<ForeignCallOutput[]> => {
  const { blockNumber, txId } = decodeGetTransactionArguments(args);
  const transaction = await client.getTransaction({
    blockNumber,
    index: txId
  });
  if (!transaction) {
    throw new Error(`Transaction not found for txId: ${txId}`);
  }
  const txType = txTypeToHex(transaction.type);
  const txProof = await getTxProof(client, blockNumber, txId);

  const encodedTransaction = encodeTx(transaction);
  const encodedTxProof = encodeTxProof(txProof);
  return [txType, ...encodedTransaction, ...encodedTxProof];
};

export function decodeGetTransactionArguments(args: NoirArguments): {
  blockNumber: bigint;
  txId: number;
} {
  return decodeGetReceiptArguments(args);
}
