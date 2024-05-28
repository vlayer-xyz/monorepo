import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { NoirArguments } from '../types.js';
import { MultiChainClient } from '../../../ethereum/client.js';
import { txTypeToHex } from '../../../ethereum/receipt.js';
import { getTxProof } from '../../../ethereum/txProof.js';
import { encodeTx, encodeTxProof } from './transactionOracle/encode.js';
import { decodeGetReceiptArguments } from './receiptOracle.js';
import { assert } from '../../../util/assert.js';

export enum OFFSETS {
  TX_TYPE,
  NONCE,
  GAS_LIMIT,
  TO,
  TO_IS_SOME,
  VALUE_HI,
  VALUE_LO,
  DATA,
  DATA_LEN,
  V,
  R,
  S,
  PROOF_INPUT
}

export const getTransactionOracle = async (
  multiChainClient: MultiChainClient,
  args: NoirArguments
): Promise<ForeignCallOutput[]> => {
  const { blockNumber, txId, chainId } = decodeGetTransactionArguments(args);
  const client = multiChainClient.getClient(chainId);
  const block = await client.getBlock({ blockNumber, includeTransactions: true });

  if (txId >= block.transactions.length) {
    throw new Error(`Transaction not found for txId: ${txId}`);
  }
  const transaction = block.transactions[txId];
  assert(
    transaction.transactionIndex == txId,
    `Transaction's transactionIndex: ${transaction.transactionIndex} does not match given transaction index: ${txId}`
  );
  const txProof = await getTxProof(block.transactions, block.transactionsRoot, txId);

  const txType = txTypeToHex(transaction.type);
  const encodedTransaction = encodeTx(transaction);
  const encodedTxProof = encodeTxProof(txProof);
  return [txType, ...encodedTransaction, encodedTxProof];
};

export function decodeGetTransactionArguments(args: NoirArguments): {
  chainId: number;
  blockNumber: bigint;
  txId: number;
} {
  return decodeGetReceiptArguments(args);
}
