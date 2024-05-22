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

type TxBase = Omit<TransactionBase, 'yParity'>;

export class TxRlpEncoder {
  public static txToFields(tx: Transaction): RecursiveArray<Hex> {
    switch (tx.type) {
      case 'legacy':
        return this.legacyToFields(tx as TransactionLegacy);
      case 'eip2930':
        return this.eip2930ToFields(tx as TransactionEIP2930);
      case 'eip1559':
        return this.eip1559ToFields(tx as TransactionEIP1559);
      case 'eip4844':
        return this.eip4844ToFields(tx as TransactionEIP4844);
      default:
        throw new Error(`Unknown transaction type: ${(tx as Transaction).type}`);
    }
  }

  public static legacyToFields(tx: TransactionLegacy): RecursiveArray<Hex> {
    return [
      encodeField(tx.nonce),
      encodeField(tx.gasPrice),
      encodeField(tx.gas),
      ...this.toValueInputToFields(tx),
      ...this.signatureToFields(tx)
    ];
  }

  public static eip2930ToFields(tx: TransactionEIP2930): RecursiveArray<Hex> {
    return [
      encodeField(tx.chainId),
      encodeField(tx.nonce),
      encodeField(tx.gasPrice),
      encodeField(tx.gas),
      ...this.toValueInputToFields(tx),
      this.accessListToFields(tx.accessList),
      ...this.signatureToFields(tx)
    ];
  }

  public static eip1559ToFields(tx: TransactionEIP1559): RecursiveArray<Hex> {
    return [
      encodeField(tx.chainId),
      encodeField(tx.nonce),
      encodeField(tx.maxPriorityFeePerGas),
      encodeField(tx.maxFeePerGas),
      encodeField(tx.gas),
      ...this.toValueInputToFields(tx),
      this.accessListToFields(tx.accessList),
      ...this.signatureToFields(tx)
    ];
  }

  public static eip4844ToFields(tx: TransactionEIP4844): RecursiveArray<Hex> {
    return [
      encodeField(tx.chainId),
      encodeField(tx.nonce),
      encodeField(tx.maxPriorityFeePerGas),
      encodeField(tx.maxFeePerGas),
      encodeField(tx.gas),
      ...this.toValueInputToFields(tx),
      this.accessListToFields(tx.accessList),
      encodeField(tx.maxFeePerBlobGas),
      [...tx.blobVersionedHashes],
      ...this.signatureToFields(tx)
    ];
  }

  private static accessListToFields(accessList: AccessList): RecursiveArray<Hex> {
    return accessList.map(({ address, storageKeys }) => [address, storageKeys]);
  }

  private static signatureToFields(baseTx: TxBase): Hex[] {
    return [encodeField(baseTx.v), baseTx.r, baseTx.s];
  }

  private static toValueInputToFields(tx: TxBase): Hex[] {
    return [tx.to ?? '0x', encodeField(tx.value), tx.input];
  }
}

export function encodeTx(tx: Transaction): Hex {
  const txRlp = toRlp(TxRlpEncoder.txToFields(tx));
  if (tx.type === 'legacy') {
    return txRlp;
  }
  const encodedTx = concatHex([txTypeToHex(tx.type), txRlp]);
  return encodedTx;
}
