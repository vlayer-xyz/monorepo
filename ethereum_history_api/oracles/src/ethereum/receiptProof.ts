import { TransactionReceipt, Hex, Block } from 'viem';
import { ReceiptTrie } from './trie.js';
import { encodeReceipt } from './receipt.js';
import { assert } from '../util/assert.js';

export interface ReceiptProof {
  key: Hex;
  proof: Hex[];
  value: Hex;
}

export async function getReceiptTrie(receipts: TransactionReceipt[], expectedRoot: Hex): Promise<ReceiptTrie> {
  const trie = new ReceiptTrie();
  for (const [i, receipt] of receipts.entries()) {
    await trie.put(i, receipt);
  }
  assert(expectedRoot === trie.root(), `receiptsRoot mismatch: ${expectedRoot} !== ${trie.root()}`);
  return trie;
}

export async function getReceiptProof(
  block: Block,
  receipts: TransactionReceipt[],
  txIdx: number
): Promise<ReceiptProof> {
  const trie = await getReceiptTrie(receipts, block.receiptsRoot);

  const proof = await trie.createProof(txIdx);

  return {
    key: ReceiptTrie.keyFromIdx(txIdx),
    proof,
    value: encodeReceipt(receipts[txIdx])
  };
}
