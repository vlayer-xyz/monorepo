import { describe, expect, it } from 'vitest';
import { decodeGetReceiptArguments } from './receiptOracle.js';

describe('receiptOracle', () => {
  it('decodeGetReceiptArguments success', () => {
    expect(decodeGetReceiptArguments([['0xf'], ['0xb4']])).toStrictEqual({
      blockNumber: 15n,
      txId: 180n
    });
  });
});
