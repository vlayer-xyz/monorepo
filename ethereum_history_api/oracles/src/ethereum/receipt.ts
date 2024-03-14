import { Hex, Log, TransactionReceipt, TransactionType, concatHex, hexToRlp } from 'viem';
import { toHexString } from './blockHeader.js';

export type RecursiveArray<T> = T | RecursiveArray<T>[];

export function logToRlp(log: Log): RecursiveArray<Hex> {
  return [log.address, log.topics, log.data];
}

export function txTypeToHex(type: TransactionType): Hex {
  switch (type) {
    case 'legacy':
    case 'eip155':
      return '0x00';
    case 'eip2930':
      return '0x01';
    case 'eip1559':
      return '0x02';
    case 'eip4844':
      return '0x03';
    default:
      throw new Error(`Unknown transaction type: ${type}`);
  }
}

export function encodeReceipt(receipt: TransactionReceipt): Hex {
  const logs = receipt.logs.map(logToRlp);
  const receiptHex = [
    (receipt.status === 'reverted' ? '0x00' : '0x01') as Hex,
    toHexString(receipt.cumulativeGasUsed),
    receipt.logsBloom,
    logs
  ];

  const encodedReceipt = concatHex([txTypeToHex(receipt.type), hexToRlp(receiptHex)]);
  return encodedReceipt;
}
