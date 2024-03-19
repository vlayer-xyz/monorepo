import { Hex, Transaction } from 'viem';
import { assert } from 'vitest';
import { AlchemyClient } from './client.js';
import { TxTrie } from './trie.js';

export async function getTxTrie(txs: Transaction[], expectedRoot: Hex): Promise<TxTrie> {
  const trie = new TxTrie();
  for (const [i, tx] of txs.entries()) {
    await trie.put(i, tx);
  }
  assert(expectedRoot === trie.root(), `txRoot mismatch: ${expectedRoot} !== ${trie.root()}`);
  return trie;
}

export async function getTxProof(client: AlchemyClient, blockNumber: bigint, txIdx: number): Promise<Hex[]> {
  const block = await client.getBlock({ blockNumber, includeTransactions: true });
  const trie = await getTxTrie(block.transactions, block.transactionsRoot);

  return await trie.createProof(txIdx);
}
