import { describe, expect, it } from 'vitest';
import { decodeGetReceiptArguments } from './receiptOracle.js';
import { mainnet } from 'viem/chains';

describe('receiptOracle', () => {
  describe('decodeGetReceiptArguments', () => {
    it('success', () => {
      expect(decodeGetReceiptArguments([['0x01'], ['0xf'], ['0xb4']])).toStrictEqual({
        chainId: mainnet.id,
        blockNumber: 15n,
        txId: 180
      });
    });
    it('get_receipt requires 3 arguments', () => {
      expect(() => decodeGetReceiptArguments([['0xf']])).toThrow('get_receipt requires 3 arguments');
    });
  });
});
