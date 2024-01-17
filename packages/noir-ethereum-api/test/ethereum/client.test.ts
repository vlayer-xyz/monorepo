import { describe, expect, it } from 'vitest';
import { GetBlockParameters, GetBlockReturnType, GetProofParameters, GetProofReturnType, PublicClient } from 'viem';
import { createDefaultClient } from '../../src/ethereum/client.js';

export const BLOCK_NUMBER = 14194126n;
export const ADDRESS = '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb';

export const GET_PROOF_PARAMETERS = {
  blockNumber: BLOCK_NUMBER,
  storageKeys: [],
  address: ADDRESS
} as GetProofParameters;

export const GET_BLOCK_PARAMETERS = { blockNumber: BLOCK_NUMBER } as GetBlockParameters;

export const expectPublicClientBehaviour = async (client: PublicClient) => {
  const getBlock = (await client.getBlock(GET_BLOCK_PARAMETERS)) as GetBlockReturnType;
  const getProof = (await client.getProof(GET_PROOF_PARAMETERS)) as GetProofReturnType;

  expect(getBlock.number).toBe(BLOCK_NUMBER);
  expect(getBlock.hash).toBe('0xbe8aa5945d3377e65ed06757555d0d4babe269097574c210133e59cf6bc17d18');

  expect(getProof.storageHash).toBe('0xae2792244417bc1749b9cd9a0bdc1c4a6cf32f147b37202c8cb3590777659aec');
};

describe('defaultClient', () => {
  it('should behave like eth PublicClient', async () => {
    await expectPublicClientBehaviour(createDefaultClient());
  });
});
