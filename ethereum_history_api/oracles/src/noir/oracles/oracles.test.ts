import { describe, expect, it } from 'vitest';
import { createOracles } from './oracles.js';
import { AlchemyClient } from '../../ethereum/client.js';

describe('importOracles', () => {
  it('success', async () => {
    const oracle = createOracles({} as AlchemyClient)({
      stub: async () => await Promise.resolve(['7'])
    });
    expect(await oracle('stub', [])).toStrictEqual(['7']);
  });

  it('throws when non-existing oracle', async () => {
    const oracle = createOracles({} as AlchemyClient)({});
    await expect(oracle('non-existing', [])).rejects.toThrow();
  });
});
