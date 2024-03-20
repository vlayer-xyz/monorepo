import { describe, it, expect } from 'vitest';
import { ReceiptTrie } from './receiptTrie.js';

describe('ReceiptTrie', () => {
  describe('keyFromIndex', () => {
    it('0', () => {
      expect(ReceiptTrie.keyFromIdx(0)).toEqual('0x80');
    });
    it('1', () => {
      expect(ReceiptTrie.keyFromIdx(1)).toEqual('0x01');
    });
    it('256', () => {
      expect(ReceiptTrie.keyFromIdx(256)).toEqual('0x820100');
    });
  });
});
