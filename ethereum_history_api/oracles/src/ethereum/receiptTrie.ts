import { Trie } from '@ethereumjs/trie';
import { Hex, bytesToHex, TransactionReceipt, hexToBytes, toRlp } from 'viem';
import { encodeField } from '../noir/oracles/common/encode.js';
import { encodeReceipt } from './receipt.js';

export class ReceiptTrie {
  private trie: Trie = new Trie();

  public root(): Hex {
    return bytesToHex(this.trie.root());
  }

  public async put(txIdx: number, receipt: TransactionReceipt) {
    const key = ReceiptTrie.keyFromIdxBytes(txIdx);
    const value = hexToBytes(encodeReceipt(receipt));
    await this.trie.put(key, value);
  }

  public async createProof(txIdx: number): Promise<Hex[]> {
    const key = ReceiptTrie.keyFromIdxBytes(txIdx);
    const proof = await this.trie.createProof(key);
    return proof.map((node) => bytesToHex(node));
  }

  private static keyFromIdxBytes(txIdx: number): Uint8Array {
    return toRlp(encodeField(txIdx), 'bytes');
  }

  public static keyFromIdx(txIdx: number): Hex {
    return toRlp(encodeField(txIdx));
  }
}
