import { Trie } from '@ethereumjs/trie';
import { Hex, bytesToHex, hexToBytes, toRlp, Transaction } from 'viem';
import { encodeField } from '../noir/oracles/common/encode.js';
import { encodeReceipt } from './receipt.js';
import { encodeTx } from './transaction.js';
import { TransactionReceipt } from '../types.js';

export class BaseTrie {
  protected trie: Trie = new Trie();

  public root(): Hex {
    return bytesToHex(this.trie.root());
  }

  protected async putHexValue(txIdx: number, valueHex: Hex) {
    const key = BaseTrie.keyFromIdxBytes(txIdx);
    const value = hexToBytes(valueHex);
    await this.trie.put(key, value);
  }

  public async createProof(txIdx: number): Promise<Hex[]> {
    const key = BaseTrie.keyFromIdxBytes(txIdx);
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

export class ReceiptTrie extends BaseTrie {
  public async put(txIdx: number, receipt: TransactionReceipt) {
    await this.putHexValue(txIdx, encodeReceipt(receipt));
  }
}

export class TxTrie extends BaseTrie {
  public async put(txIdx: number, tx: Transaction) {
    await this.putHexValue(txIdx, encodeTx(tx));
  }
}
