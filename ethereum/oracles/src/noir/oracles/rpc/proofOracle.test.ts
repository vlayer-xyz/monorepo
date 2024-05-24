import { describe, expect, it } from 'vitest';
import { CRYPTO_PUNKS_ADDRESS } from '../../../ethereum/recordingClient.test.js';
import { decodeGetProofArguments } from './proofOracle.js';
import { CIRCLE_USDC_BALANCE_STORAGE_KEY } from '../../../fixtures/historyAPIConfig.js';
import { mainnet } from 'viem/chains';

describe('proofOracle', () => {
  it('decodeGetProofArguments success', () => {
    expect(
      decodeGetProofArguments([
        ['0x01'],
        ['0xf'],
        // prettier-ignore
        [
            "0xb4", "0x7e", "0x3c", "0xd8", "0x37", "0xdd", "0xf8", "0xe4", "0xc5", "0x7f", 
            "0x05", "0xd7", "0x0a", "0xb8", "0x65", "0xde", "0x6e", "0x19", "0x3b", "0xbb",
        ],
        // prettier-ignore
        [
          '0x57', '0xd1', '0x8a', '0xf7', '0x93', '0xd7', '0x30', '0x0c', 
          '0x4b', '0xa4', '0x6d', '0x19', '0x2e', '0xc7', '0xaa', '0x09', 
          '0x50', '0x70', '0xdd', '0xe6', '0xc5', '0x2c', '0x68', '0x7c', 
          '0x6d', '0x0d', '0x92', '0xfb', '0x85', '0x32', '0xb3', '0x05'
        ]
      ])
    ).toStrictEqual({
      chainId: mainnet.id,
      blockNumber: 15n,
      address: CRYPTO_PUNKS_ADDRESS,
      storageKey: CIRCLE_USDC_BALANCE_STORAGE_KEY
    });
  });
});
