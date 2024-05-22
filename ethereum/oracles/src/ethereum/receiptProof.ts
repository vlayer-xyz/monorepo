import { ReceiptTrie } from './trie.js';
import { Hex, Block } from 'viem';
import { encodeReceipt } from './receipt.js';
import { assert } from '../util/assert.js';
import { Proof } from './proof.js';
import { TransactionReceipt } from '../types.js';

export async function getReceiptTrie(receipts: TransactionReceipt[], expectedRoot: Hex): Promise<ReceiptTrie> {
  const trie = new ReceiptTrie();
  for (const [i, receipt] of receipts.entries()) {
    await trie.put(i, receipt);
  }
  assert(expectedRoot === trie.root(), `receiptsRoot mismatch: ${expectedRoot} !== ${trie.root()}`);
  return trie;
}

export async function getReceiptProof(block: Block, receipts: TransactionReceipt[], txIdx: number): Promise<Proof> {
  const trie = await getReceiptTrie(receipts, block.receiptsRoot);

  const proof = await trie.createProof(txIdx);

  return {
    key: ReceiptTrie.keyFromIdx(txIdx),
    value: encodeReceipt(receipts[txIdx]),
    proof
  };
}
