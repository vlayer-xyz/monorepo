import { describe, expect, it } from 'vitest';
import { createOracles, clientOracles } from './oracles.js';
import { MultiChainClient } from '../../ethereum/client.js';

describe('importOracles', () => {
  it('success', async () => {
    const oracle = createOracles({} as MultiChainClient)({
      stub: async () => await Promise.resolve(['7'])
    });
    expect(await oracle('stub', [])).toStrictEqual(['7']);
  });

  it('throws when non-existing oracle', async () => {
    const oracle = createOracles({} as MultiChainClient)({});
    await expect(oracle('non-existing', [])).rejects.toThrow();
  });
});

describe('clientOracles', () => {
  it('returns proper oracles for a specific chain with custom json rpc', async () => {
    const oracle = clientOracles('polygon', 'http://localhost:8545');
    await expect(oracle('get_account', [])).rejects.toThrow('get_account requires 3 arguments');
  });

  it('throws when chain name not recognized by viem', () => {
    expect(() => clientOracles('polygonTypo', 'http://localhost:8545')).toThrow('Unknown chain ID: polygonTypo');
  });
});
