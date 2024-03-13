import { describe, expect, it } from 'vitest';
import { PublicClient } from 'viem';
import { createMockClient } from './mockClient.js';
import {
  LONDON_CRYPTO_PUNKS_GET_BLOCK_PARAMETERS,
  LONDON_CRYPTO_PUNKS_GET_PROOF_PARAMETERS
} from './recordingClient.test.js';
import { readObject } from '../util/file.js';
import { GetBlockFixture, GetProofFixture } from '../fixtures/types.js';

describe('mockingClient', () => {
  it('read recorded JSON-RPC API calls from file in mocking client', async () => {
    const filePaths = [
      './fixtures/mainnet/london/crypto_punks/eth_getBlockByHash_14194126.json',
      './fixtures/mainnet/london/crypto_punks/eth_getProof_14194126.json'
    ];
    const mockingClient: PublicClient = await createMockClient(filePaths);

    const actualBlock = await mockingClient.getBlock(LONDON_CRYPTO_PUNKS_GET_BLOCK_PARAMETERS);
    const actualProof = await mockingClient.getProof(LONDON_CRYPTO_PUNKS_GET_PROOF_PARAMETERS);
    const expectedBlock = (await readObject<GetBlockFixture<false>>(filePaths[0])).result;
    const expectedProof = (await readObject<GetProofFixture>(filePaths[1])).result;

    expect(actualBlock).toStrictEqual(expectedBlock);
    expect(actualProof).toStrictEqual(expectedProof);
  });
});
