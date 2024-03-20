import { Trie } from '@ethereumjs/trie';
import { Hex, bytesToHex, TransactionReceipt, hexToBytes, toRlp } from 'viem';
import { encodeField } from '../noir/oracles/common/encode.js';
import { encodeReceiptToRlp } from './receipt.js';

export class ReceiptTrie {
  private trie: Trie = new Trie();

  public root(): Hex {
    return bytesToHex(this.trie.root());
  }

  public async put(txIdx: number, receipt: TransactionReceipt) {
    const key = ReceiptTrie.keyFromIdx(txIdx);
    const value = hexToBytes(encodeReceiptToRlp(receipt));
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
