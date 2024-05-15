import { describe, expect, it } from 'vitest';
import { MultiChainClient } from './client.js';

describe('from_params', () => {
  const customRpcUrl = 'http://localhost:8545';

  it('setups client with custom params', () => {
    const multiClient = MultiChainClient.from_params('mainnet', customRpcUrl);
    const { chain, transport } = multiClient.getClient(1);

    expect(chain).toBeDefined();
    expect(transport.url).toBe(customRpcUrl);
  });

  it("throws when rpcUrl doesn't match URL pattern", () => {
    expect(() => MultiChainClient.from_params('mainnet', 'localhost:8545')).toThrow('rpcUrl should be a valid URL');
  });

  it('throws when chain name not recognized by viem', () => {
    expect(() => MultiChainClient.from_params('typo', customRpcUrl)).toThrow('Unknown chain ID: typo');
  });
});
