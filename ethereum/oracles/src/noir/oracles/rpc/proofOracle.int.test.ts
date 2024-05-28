import { describe, expect, it } from 'vitest';
import { createMockMultiChainClient } from '../../../ethereum/mockClient.js';
import { getProofOracle } from './proofOracle.js';

describe(
  'proofOracle',
  () => {
    const OFFSETS = {
      NONCE: 0,
      BALANCE: 1,
      STATE_PROOF_INPUT: 4,
      STORAGE_PROOF_INPUT: 5
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
      const mainnetChainIdInNoirFormat = '0x01';
      const mockFilePaths = [
        './fixtures/mainnet/paris/usdc_circle/eth_getBlockByHash_19000000.json',
        './fixtures/mainnet/paris/usdc_circle/eth_getProof_19000000.json'
      ];
      const multiChainClient = await createMockMultiChainClient(mockFilePaths);
      const stateAndStorageProof = await getProofOracle(multiChainClient, [
        [mainnetChainIdInNoirFormat],
        [parisBlockNumberInNoirFormat],
        usdcAccountAddressInNoirFormat,
        circleUsdcBalanceStorageKeyInNoirFormat
      ]);
      expect(stateAndStorageProof[OFFSETS.NONCE]).toStrictEqual('0x01');
      expect(stateAndStorageProof[OFFSETS.BALANCE]).toStrictEqual('0x');

      const stateProofInputDepthPart =
        stateAndStorageProof[OFFSETS.STATE_PROOF_INPUT][stateAndStorageProof[OFFSETS.STATE_PROOF_INPUT].length - 1];
      expect(stateProofInputDepthPart).toStrictEqual('0x09');
      const storageProofInputDepthPart =
        stateAndStorageProof[OFFSETS.STORAGE_PROOF_INPUT][stateAndStorageProof[OFFSETS.STORAGE_PROOF_INPUT].length - 1];
      expect(storageProofInputDepthPart).toStrictEqual('0x07');
    });
  },
  {
    timeout: 2000
  }
);
