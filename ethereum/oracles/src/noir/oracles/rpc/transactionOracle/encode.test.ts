import { describe, expect, it } from 'vitest';
import { TX_OFFSETS, encodeTx } from './encode.js';
import { loadTxFixture } from '../../../../historyAPIFixtures.js';
import { ETH_TRANSFER_TX_HASH, CHAIN_LINK_TRANSFER_TX_HASH } from '../../../../fixtures/historyAPIConfig.js';
import { MAX_DATA_LEN_M } from '../common/txConfig.js';
import { ZERO_PAD_VALUE } from '../../common/const.js';
import { padArray } from '../../../../util/array.js';

// TODO: Add a test for contract creation transaction when we support transactions longer than trie nodes.
describe('TransactionOracle encode', () => {
  describe('encodeTx', () => {
    it('transaction with empty data', async () => {
      const contractCreationTransaction = await loadTxFixture('mainnet', 'cancun', 'transfer', ETH_TRANSFER_TX_HASH);
      const noirTransaction = encodeTx(contractCreationTransaction);

      expect(noirTransaction[TX_OFFSETS.DATA]).toStrictEqual(padArray([], MAX_DATA_LEN_M, ZERO_PAD_VALUE));

      expect(noirTransaction[TX_OFFSETS.NONCE]).toStrictEqual('0x');
      expect(noirTransaction[TX_OFFSETS.GAS_LIMIT]).toStrictEqual('0x5a3c');
      expect(noirTransaction[TX_OFFSETS.TO_IS_SOME]).toStrictEqual('0x01');
      expect(noirTransaction[TX_OFFSETS.VALUE_HI]).toStrictEqual('0x');
      expect(noirTransaction[TX_OFFSETS.VALUE_LO]).toStrictEqual('0x038d7ea4c68000');
      expect(noirTransaction[TX_OFFSETS.DATA_LEN]).toStrictEqual('0x');
    });

    it('transaction with non-empty data', async () => {
      const contractCreationTransaction = await loadTxFixture(
        'mainnet',
        'cancun',
        'small_block',
        CHAIN_LINK_TRANSFER_TX_HASH
      );
      const noirTransaction = encodeTx(contractCreationTransaction);

      expect(noirTransaction[TX_OFFSETS.NONCE]).toStrictEqual('0x485a');
      expect(noirTransaction[TX_OFFSETS.GAS_LIMIT]).toStrictEqual('0x0493e0');
      expect(noirTransaction[TX_OFFSETS.TO_IS_SOME]).toStrictEqual('0x01');
      expect(noirTransaction[TX_OFFSETS.VALUE_HI]).toStrictEqual('0x');
      expect(noirTransaction[TX_OFFSETS.VALUE_LO]).toStrictEqual('0x');
      // prettier-ignore
      expect(noirTransaction[TX_OFFSETS.DATA]).toStrictEqual(padArray([
        '0xa9','0x05','0x9c','0xbb','0x00','0x00','0x00','0x00','0x00','0x00',
        '0x00','0x00','0x00','0x00','0x00','0x00','0x12','0x5f','0x66','0x02',
        '0x39','0x70','0x7c','0x9d','0xe3','0x46','0x2d','0x3f','0xa6','0x33',
        '0xf2','0x72','0x3a','0xd0','0xb8','0x84','0x00','0x00','0x00','0x00',
        '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00',
        '0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x00','0x3f',
        '0x44','0x12','0x7f','0xb4','0x3f','0xa1','0x00','0x00'
      ], MAX_DATA_LEN_M, ZERO_PAD_VALUE));
      expect(noirTransaction[TX_OFFSETS.DATA_LEN]).toStrictEqual('0x44');
    });
  });
});
