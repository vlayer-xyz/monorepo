import { describe, expect, it } from 'vitest';
import { assert } from '../../../../util/assert.js';
import { RECEIPT_OFFSETS } from './encode.js';
import { encodeReceipt } from './encode.js';
import { loadReceiptFixture } from '../../../../historyAPIFixtures.js';

describe('ReceiptOracle encode', () => {
  describe('encodeReceipt', () => {
    it('absent fields are defaulted to zero values', async () => {
      const legacyReceipt = await loadReceiptFixture(
        'mainnet',
        'cancun',
        'small_block',
        '0x94a8715a083008845fc4983e89627e6a99de9f15d8455cc3fb2c1583f594932a'
      );
      assert(legacyReceipt.blobGasUsed === undefined, 'Expected legacy receipt type. Please check the fixtures');
      assert(legacyReceipt.blobGasPrice === undefined, 'Expected legacy receipt type. Please check the fixtures');
      assert(legacyReceipt.root === undefined, 'Expected legacy receipt type. Please check the fixtures');

      const noirReceipt = encodeReceipt(legacyReceipt);

      expect(noirReceipt[RECEIPT_OFFSETS.STATUS]).toStrictEqual('0x01');
      expect(noirReceipt[RECEIPT_OFFSETS.STATUS_IS_SOME]).toStrictEqual('0x01');
      // prettier-ignore
      expect(noirReceipt[RECEIPT_OFFSETS.STATE_ROOT]).toStrictEqual([
        "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00",
        "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00",
        "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00",
        "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00",
      ]);
      expect(noirReceipt[RECEIPT_OFFSETS.STATE_ROOT_IS_SOME]).toStrictEqual('0x00');
      expect(noirReceipt[RECEIPT_OFFSETS.CUMULATIVE_GAS_USED]).toStrictEqual('0x08a73c');
    });
  });
});
