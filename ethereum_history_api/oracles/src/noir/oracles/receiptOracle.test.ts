import { describe, expect, it } from 'vitest';
import { decodeGetReceiptArguments } from './receiptOracle.js';

describe('receiptOracle', () => {
  describe('decodeGetReceiptArguments', () => {
    it('success', () => {
      expect(decodeGetReceiptArguments([['0xf'], ['0xb4']])).toStrictEqual({
        blockNumber: 15n,
        txId: 180
      });
    });
    it('get_receipt requires 2 arguments', () => {
      expect(() => decodeGetReceiptArguments([['0xf']])).toThrow('get_receipt requires 2 arguments');
    });
  });
});
