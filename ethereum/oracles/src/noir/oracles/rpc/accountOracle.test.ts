import { describe, expect, it } from 'vitest';
import { CRYPTO_PUNKS_ADDRESS } from '../../../ethereum/recordingClient.test.js';
import { decodeGetAccountArguments } from './accountOracle.js';
import { mainnet } from 'viem/chains';

describe('accountOracle', () => {
  it('decodeGetAccountArguments success', () => {
    expect(
      decodeGetAccountArguments([
        ['0x01'],
        ['0xf'],
        // prettier-ignore
        ["0xb4", "0x7e", "0x3c", "0xd8", "0x37", "0xdd", "0xf8", "0xe4", "0xc5", "0x7f", "0x05", "0xd7", "0x0a", "0xb8",
        "0x65", "0xde", "0x6e", "0x19", "0x3b", "0xbb"]
      ])
    ).toStrictEqual({
      chainId: mainnet.id,
      blockNumber: 15n,
      address: CRYPTO_PUNKS_ADDRESS
    });
  });
});
