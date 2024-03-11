import { describe, expect, it } from 'vitest';
import { createMockClient } from '../../ethereum/mockClient.js';
import { getProofOracle } from './proofOracle.js';

describe(
  'proofOracle',
  () => {
    const OFFSETS = {
      NONCE: 0,
      BALANCE: 1,
      ADDRESS: 4,
      STATE_PROOF_DEPTH: 7,
      STORAGE_PROOF_DEPTH: 11
    };
    it('getAccountOracle', async () => {
      // prettier-ignore
      const usdcAccountAddressInNoirFormat = [
        "0xa0", "0xb8", "0x69", "0x91", "0xc6", "0x21", "0x8b", "0x36", "0xc1", "0xd1",
        "0x9d", "0x4a", "0x2e", "0x9e", "0xb0", "0xce", "0x36", "0x06", "0xeb", "0x48"
      ];
      // prettier-ignore
      const circleUsdcBalanceStorageKeyInNoirFormat = [
        '0x57', '0xd1', '0x8a', '0xf7', '0x93', '0xd7', '0x30', '0x0c', 
        '0x4b', '0xa4', '0x6d', '0x19', '0x2e', '0xc7', '0xaa', '0x09', 
        '0x50', '0x70', '0xdd', '0xe6', '0xc5', '0x2c', '0x68', '0x7c', 
        '0x6d', '0x0d', '0x92', '0xfb', '0x85', '0x32', '0xb3', '0x05'
      ];
      // 19000000
      const parisBlockNumberInNoirFormat = '0x121eac0';
      const mockFilePaths = [
        './fixtures/mainnet/paris/usdc/eth_getBlockByHash.json',
        './fixtures/mainnet/paris/usdc/eth_getProof.json'
      ];
      const client = await createMockClient(mockFilePaths);
      const stateAndStorageProof = await getProofOracle(client, [
        [parisBlockNumberInNoirFormat],
        usdcAccountAddressInNoirFormat,
        circleUsdcBalanceStorageKeyInNoirFormat
      ]);
      expect(stateAndStorageProof[OFFSETS.NONCE]).toStrictEqual('0x01');
      expect(stateAndStorageProof[OFFSETS.BALANCE]).toStrictEqual('0x00');
      expect(stateAndStorageProof[OFFSETS.ADDRESS]).toStrictEqual(usdcAccountAddressInNoirFormat);
      expect(stateAndStorageProof[OFFSETS.STATE_PROOF_DEPTH]).toStrictEqual('0x09');
      expect(stateAndStorageProof[OFFSETS.STORAGE_PROOF_DEPTH]).toStrictEqual('0x07');
    });
  },
  {
    timeout: 2000
  }
);
