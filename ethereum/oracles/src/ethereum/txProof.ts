import { Hex, Transaction } from 'viem';
import { assert } from '../util/assert.js';
import { Proof } from './proof.js';
import { encodeTx } from './transaction.js';
import { TxTrie } from './trie.js';

export async function getTxTrie(txs: Transaction[], expectedRoot: Hex): Promise<TxTrie> {
  const trie = new TxTrie();
  for (const [i, tx] of txs.entries()) {
    await trie.put(i, tx);
  }
  assert(expectedRoot === trie.root(), `txRoot mismatch: ${expectedRoot} !== ${trie.root()}`);
  return trie;
}

export async function getTxProof(transactions: Transaction[], transactionsRoot: Hex, txIdx: number): Promise<Proof> {
  const trie = await getTxTrie(transactions, transactionsRoot);

  const proof = await trie.createProof(txIdx);

  return {
    key: TxTrie.keyFromIdx(txIdx),
    value: encodeTx(transactions[txIdx]),
    proof: proof
  };
}
