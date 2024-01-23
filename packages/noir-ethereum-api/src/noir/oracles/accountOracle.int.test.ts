import { describe, expect, it } from 'vitest';
import { getAccountOracle } from './accountOracles.js';
import { createMockClient } from '../../ethereum/mockClient.js';

describe(
  'accountOracle',
  async () => {
    it('getAccountOracle', async () => {
      // prettier-ignore
      const accountAddressInNoirFormat = [
        "0xb4", "0x7e", "0x3c", "0xd8", "0x37", "0xdd", "0xf8", "0xe4", "0xc5", "0x7f", "0x5", "0xd7", "0xa", "0xb8",
        "0x65", "0xde", "0x6e", "0x19", "0x3b", "0xbb"
      ]
      const blockNumberInNoirFormat = '0xd895ce';
      const client = await createMockClient('./test/fixtures/mockClientData.json');
      const account = await getAccountOracle(client, [[blockNumberInNoirFormat], accountAddressInNoirFormat]);
      // prettier-ignore
      expect(account[3]).toStrictEqual(accountAddressInNoirFormat);
      expect(account[0]).toStrictEqual('0x313570a84bf378efd25');
      expect(account[6]).toStrictEqual('0x8');
    });
  },
  {
    timeout: 2000
  }
);
