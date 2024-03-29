import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { NoirArguments } from './oracles.js';
import { AlchemyClient } from '../../ethereum/client.js';
import { txTypeToHex } from '../../ethereum/receipt.js';
import { getTxProof } from '../../ethereum/txProof.js';
import { encodeTx, encodeTxProof } from './transactionOracle/encode.js';
import { decodeGetReceiptArguments } from './receiptOracle.js';

export enum OFFSETS {
  TX_TYPE,
  NONCE,
  GAS_LIMIT,
  TO,
  TO_IS_SOME,
  VALUE,
  DATA,
  DATA_LEN,
  V,
  R,
  S,
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
