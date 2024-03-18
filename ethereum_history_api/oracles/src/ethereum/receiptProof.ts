import { TransactionReceipt, Hex } from 'viem';
import { assert } from 'vitest';
import { AlchemyClient } from './client.js';
import { ReceiptTrie } from './receiptTrie.js';
import { encodeReceipt } from './receipt.js';

type ReceiptProof = {
  key: Uint8Array;
  proof: Hex[];
  value: Hex;
};

export async function getReceiptTrie(receipts: TransactionReceipt[], expectedRoot: Hex): Promise<ReceiptTrie> {
  const trie = new ReceiptTrie();
  for (const [i, receipt] of receipts.entries()) {
    await trie.put(i, receipt);
  }
  assert(expectedRoot === trie.root(), `receiptsRoot mismatch: ${expectedRoot} !== ${trie.root()}`);
  return trie;
}

export async function getReceiptProof(
  client: AlchemyClient,
  blockNumber: bigint,
  txIdx: number
): Promise<ReceiptProof> {
  const block = await client.getBlock({ blockNumber });
  const receipts = await client.getTransactionReceipts({ blockNumber });
  const trie = await getReceiptTrie(receipts, block.receiptsRoot);

  const proof = await trie.createProof(txIdx);

  return {
    key: ReceiptTrie.keyFromIdx(txIdx),
    proof,
    value: encodeReceipt(receipts[txIdx])
  };
}

export async function getReceiptProofs(
  client: AlchemyClient,
  blockNumber: bigint,
  txIndexes: number[]
): Promise<ReceiptProof[]> {
  const block = await client.getBlock({ blockNumber });
  const receipts = await client.getTransactionReceipts({ blockNumber });
  const trie = await getReceiptTrie(receipts, block.receiptsRoot);

  return await Promise.all(
    txIndexes.map(async (txIdx) => ({
      key: ReceiptTrie.keyFromIdx(txIdx),
      proof: await trie.createProof(txIdx),
      value: encodeReceipt(receipts[txIdx])
    }))
  );
}
