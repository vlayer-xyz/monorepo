import { describe, it, expect } from 'vitest';
import { ReceiptTrie } from './receiptTrie.js';

describe('ReceiptTrie', () => {
  describe('keyFromIndex', () => {
    it('0', () => {
      expect(ReceiptTrie.keyFromIdx(0)).toEqual(new Uint8Array([128]));
    });
    it('1', () => {
      expect(ReceiptTrie.keyFromIdx(1)).toEqual(new Uint8Array([1]));
    });
    it('256', () => {
      expect(ReceiptTrie.keyFromIdx(256)).toEqual(new Uint8Array([130, 1, 0]));
    });
  });
});
