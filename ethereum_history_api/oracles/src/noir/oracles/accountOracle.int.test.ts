import { describe, expect, it } from 'vitest';
import { OFFSETS, getAccountOracle } from './accountOracle.js';
import { createMockClient } from '../../ethereum/mockClient.js';
import { Chain, MultiChainClient } from '../../ethereum/client.js';

describe('accountOracle', () => {
  it('getAccountOracle', async () => {
    const mainnetChainIdInNoirFormat = '0x01';
    // prettier-ignore
    const cryptoPunksAccountAddressInNoirFormat = [
        "0xb4", "0x7e", "0x3c", "0xd8", "0x37", "0xdd", "0xf8", "0xe4", "0xc5", "0x7f",
        "0x05", "0xd7", "0x0a", "0xb8", "0x65", "0xde", "0x6e", "0x19", "0x3b", "0xbb"
      ]
    const londonBlockNumberInNoirFormat = '0xd895ce';
    const mockFilePaths = [
      './fixtures/mainnet/london/crypto_punks/eth_getBlockByHash_14194126.json',
      './fixtures/mainnet/london/crypto_punks/eth_getProof_14194126.json'
    ];
    const client = await createMockClient(mockFilePaths);
    const multiChainClient = MultiChainClient.createSingleChainClient(Chain.MAINNET, client);
    const account = await getAccountOracle(multiChainClient, [
      [mainnetChainIdInNoirFormat],
      [londonBlockNumberInNoirFormat],
      cryptoPunksAccountAddressInNoirFormat
    ]);
    expect(account[OFFSETS.NONCE]).toStrictEqual('0x01');
    expect(account[OFFSETS.BALANCE]).toStrictEqual('0x0313570a84bf378efd25');
    expect(account[OFFSETS.PROOF_KEY]).toStrictEqual(cryptoPunksAccountAddressInNoirFormat);
    expect(account[OFFSETS.PROOF_DEPTH]).toStrictEqual('0x08');
  });
});
