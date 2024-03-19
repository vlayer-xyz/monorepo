import { TransactionReceipt, Hex } from 'viem';
import { assert } from 'vitest';
import { AlchemyClient } from './client.js';
import { ReceiptTrie } from './trie.js';

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
