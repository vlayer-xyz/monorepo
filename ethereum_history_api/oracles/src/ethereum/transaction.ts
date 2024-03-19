import {
  AccessList,
  Hex,
  Transaction,
  TransactionBase,
  TransactionEIP1559,
  TransactionEIP2930,
  TransactionEIP4844,
  TransactionLegacy,
  concatHex,
  toRlp
} from 'viem';
import { RecursiveArray, txTypeToHex } from './receipt.js';
import { encodeField } from '../noir/oracles/common/encode.js';

export function accessListToRlpFields(accessList: AccessList): RecursiveArray<Hex> {
  return accessList.map(({ address, storageKeys }) => [address, storageKeys]);
}

type TxBase = Omit<TransactionBase, 'yParity'>;

export function signatureToRlpFields(baseTx: TxBase): Hex[] {
  return [encodeField(baseTx.v), baseTx.r, baseTx.s];
}

export function toValueInputTxToRlpFields(tx: TxBase): Hex[] {
  return [tx.to ?? '0x', encodeField(tx.value), tx.input];
}

export function legacyTransactionToRlpFields(tx: TransactionLegacy): RecursiveArray<Hex> {
  return [
    encodeField(tx.nonce),
    encodeField(tx.gasPrice),
    encodeField(tx.gas),
    ...toValueInputTxToRlpFields(tx),
    ...signatureToRlpFields(tx)
  ];
}

export function eip2930TransactionToRlpFields(tx: TransactionEIP2930): RecursiveArray<Hex> {
  return [
    encodeField(tx.chainId),
    encodeField(tx.nonce),
    encodeField(tx.gasPrice),
    encodeField(tx.gas),
    ...toValueInputTxToRlpFields(tx),
    accessListToRlpFields(tx.accessList),
    ...signatureToRlpFields(tx)
  ];
}

export function eip1559TransactionToRlpFields(tx: TransactionEIP1559): RecursiveArray<Hex> {
  return [
    encodeField(tx.chainId),
    encodeField(tx.nonce),
    encodeField(tx.maxPriorityFeePerGas),
    encodeField(tx.maxFeePerGas),
    encodeField(tx.gas),
    ...toValueInputTxToRlpFields(tx),
    accessListToRlpFields(tx.accessList),
    ...signatureToRlpFields(tx)
  ];
}

export function eip4844TransactionToRlpFields(tx: TransactionEIP4844): RecursiveArray<Hex> {
  return [
    encodeField(tx.chainId),
    encodeField(tx.nonce),
    encodeField(tx.maxPriorityFeePerGas),
    encodeField(tx.maxFeePerGas),
    encodeField(tx.gas),
    ...toValueInputTxToRlpFields(tx),
    accessListToRlpFields(tx.accessList),
    encodeField(tx.maxFeePerBlobGas),
    tx.blobVersionedHashes,
    ...signatureToRlpFields(tx)
  ];
}

export function transactionToRlpFields(tx: Transaction): RecursiveArray<Hex> {
  switch (tx.type) {
    case 'legacy':
      return legacyTransactionToRlpFields(tx as TransactionLegacy);
    case 'eip2930':
      return eip2930TransactionToRlpFields(tx as TransactionEIP2930);
    case 'eip1559':
      return eip1559TransactionToRlpFields(tx as TransactionEIP1559);
    case 'eip4844':
      return eip4844TransactionToRlpFields(tx as TransactionEIP4844);
    default:
      throw new Error(`Unknown transaction type: ${(tx as Transaction).type}`);
  }
}

export function encodeTx(tx: Transaction): Hex {
  const txRlp = toRlp(transactionToRlpFields(tx));
  if (tx.type === 'legacy') {
    return txRlp;
  }
  const encodedTx = concatHex([txTypeToHex(tx.type), txRlp]);
  return encodedTx;
}
