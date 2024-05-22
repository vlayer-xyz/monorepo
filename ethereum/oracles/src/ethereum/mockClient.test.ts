import { describe, expect, it } from 'vitest';
import { createMockClient } from './mockClient.js';
import {
  LONDON_CRYPTO_PUNKS_GET_BLOCK_PARAMETERS,
  LONDON_CRYPTO_PUNKS_GET_PROOF_PARAMETERS
} from './recordingClient.test.js';
import { readFixture } from '../util/file.js';
import { GetBlockFixture, GetProofFixture } from '../fixtures/types.js';
import { AlchemyClient } from './client.js';

describe('mockingClient', () => {
  it('read recorded JSON-RPC API calls from file in mocking client', async () => {
    const filePaths = [
      './fixtures/mainnet/london/crypto_punks/eth_getBlockByHash_14194126.json',
      './fixtures/mainnet/london/crypto_punks/eth_getProof_14194126.json'
    ];
    const mockingClient: AlchemyClient = await createMockClient(filePaths);

    const actualBlock = await mockingClient.getBlock(LONDON_CRYPTO_PUNKS_GET_BLOCK_PARAMETERS);
    const actualProof = await mockingClient.getProof(LONDON_CRYPTO_PUNKS_GET_PROOF_PARAMETERS);
    const expectedBlock = (await readFixture<GetBlockFixture<false>>(filePaths[0])).result;
    const expectedProof = (await readFixture<GetProofFixture>(filePaths[1])).result;

    expect(actualBlock).toStrictEqual(expectedBlock);
    expect(actualProof).toStrictEqual(expectedProof);
  });
});
