import { describe, expect, it } from 'vitest';
import { getAccountProof } from '../../../src/noir/oracles/accountOracles.js';
import { createDefaultClient } from '../../../src/ethereum/client.js';

describe('accountOracle', async () => {
  it('getAccountProof', async () => {
    const proof = await getAccountProof(createDefaultClient(), '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb', 14194126n);
    expect(proof.balance).toStrictEqual(14523859557397289696549n);
    expect(proof.storageHash).toStrictEqual('0xae2792244417bc1749b9cd9a0bdc1c4a6cf32f147b37202c8cb3590777659aec');
  });
});
