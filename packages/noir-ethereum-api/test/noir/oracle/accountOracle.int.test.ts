import { describe, expect, it } from 'vitest';
import { getAccountOracle } from '../../../src/noir/oracles/accountOracles.js';
import { createMockClient } from '../../../src/ethereum/mockClient.js';

describe(
  'accountOracle',
  async () => {
    it('getAccountOracle', async () => {
      // prettier-ignore
      const accountAddressInNoirFormat = [
        '0x30', '0x78', '0x62', '0x34', '0x37', '0x65', '0x33', '0x63', '0x64', '0x38', '0x33', '0x37', '0x64', '0x44',
        '0x46', '0x38', '0x65', '0x34', '0x63', '0x35', '0x37', '0x66', '0x30', '0x35', '0x64', '0x37', '0x30', '0x61',
        '0x62', '0x38', '0x36', '0x35', '0x64', '0x65', '0x36', '0x65', '0x31', '0x39', '0x33', '0x62', '0x62', '0x62'
      ];
      const blockNumberInNoirFormat = '0xd895ce';
      const client = await createMockClient('./test/fixtures/mockClientData.json');
      const account = await getAccountOracle(client, [[blockNumberInNoirFormat], accountAddressInNoirFormat]);
      // prettier-ignore
      expect(account[3]).toStrictEqual([
        '0xb4', '0x7e', '0x3c', '0xd8', '0x37', '0xdd', '0xf8', '0xe4', '0xc5', '0x7f', '0x5', '0xd7', '0xa', '0xb8',
        '0x65', '0xde', '0x6e', '0x19', '0x3b', '0xbb'
      ])
      expect(account[0]).toStrictEqual('0x313570a84bf378efd25');
      expect(account[6]).toStrictEqual('0x8');
    });
  },
  {
    timeout: 2000
  }
);
