import { Hash, Hex, Log, TransactionReceipt, TransactionType, bytesToHex, concatHex, hexToBytes, toRlp } from 'viem';
import { toHexString } from './blockHeader.js';
import { AlchemyClient } from './alchemyClient.js';
import { Trie } from '@ethereumjs/trie';
import { assert } from '../util/assert.js';
import { encodeField } from '../noir/oracles/common/encode.js';

export type RecursiveArray<T> = T | RecursiveArray<T>[];

export function logToRlpFields(log: Log): RecursiveArray<Hex> {
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

type PreByzantiumReceipt = TransactionReceipt & { root: Hash };

function isPreByzantium(receipt: TransactionReceipt): receipt is PreByzantiumReceipt {
  return receipt.root !== undefined;
}

function statusToHex(status: 'success' | 'reverted') {
  return (status === 'reverted' ? '0x' : '0x01') as Hex;
}

export function receiptToRlpFields(receipt: TransactionReceipt): RecursiveArray<Hex> {
  const logs = receipt.logs.map(logToRlpFields);
  const fields: RecursiveArray<Hex> = [];
  if (isPreByzantium(receipt)) {
    fields.push(receipt.root);
  } else {
    fields.push(statusToHex(receipt.status));
  }
  fields.push(toHexString(receipt.cumulativeGasUsed), receipt.logsBloom, logs);
  return fields;
}

export function encodeReceipt(receipt: TransactionReceipt): Hex {
  const receiptRlpFields = receiptToRlpFields(receipt);
  const receiptRlp = toRlp(receiptRlpFields);
  if (receipt.type === 'legacy') {
    return receiptRlp;
  }
  const encodedReceipt = concatHex([txTypeToHex(receipt.type), receiptRlp]);
  return encodedReceipt;
}

export class ReceiptTrie {
  private trie: Trie = new Trie();

  public root(): Hex {
    return bytesToHex(this.trie.root());
  }

  public async put(txIdx: number, receipt: TransactionReceipt) {
    const key = ReceiptTrie.keyFromIdx(txIdx);
    const value = hexToBytes(encodeReceipt(receipt));
    await this.trie.put(key, value);
  }

  public async createProof(txIdx: number): Promise<Hex[]> {
    const key = ReceiptTrie.keyFromIdx(txIdx);
    const proof = await this.trie.createProof(key);
    return proof.map((node) => bytesToHex(node));
  }

  public static keyFromIdx(txIdx: number): Uint8Array {
    return toRlp(encodeField(txIdx), 'bytes');
  }
}

export async function getReceiptTrie(receipts: TransactionReceipt[], expectedRoot: Hex): Promise<ReceiptTrie> {
  const trie = new ReceiptTrie();
  for (const [i, receipt] of receipts.entries()) {
    await trie.put(i, receipt);
  }
  assert(expectedRoot === trie.root(), `receiptsRoot mismatch: ${expectedRoot} !== ${trie.root()}`);
  return trie;
}

export async function getReceiptProof(client: AlchemyClient, blockNumber: bigint, txIdx: number): Promise<Hex[]> {
  const block = await client.getBlock({ blockNumber });
  const receipts = await client.getTransactionReceipts({ blockNumber });
  const trie = await getReceiptTrie(receipts, block.receiptsRoot);

  return await trie.createProof(txIdx);
}
