import { describe, expect, it } from 'vitest';
import { Call, createRecordingClient } from './recordingClient.js';
import { withTempFile, writeObject } from '../util/file.js';
import { createMockClient } from './mockClient.js';
import { GetBlockParameters, GetProofParameters, Hex } from 'viem';
import { AlchemyClient } from './client.js';

export const LONDON_BLOCK_NUMBER = 14194126n;
export const CRYPTO_PUNKS_ADDRESS: Hex = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb';
const BLOCK_HASH: Hex = '0xbe8aa5945d3377e65ed06757555d0d4babe269097574c210133e59cf6bc17d18';
const STORAGE_ROOT: Hex = '0xae2792244417bc1749b9cd9a0bdc1c4a6cf32f147b37202c8cb3590777659aec';

export const LONDON_CRYPTO_PUNKS_GET_PROOF_PARAMETERS = {
  blockNumber: LONDON_BLOCK_NUMBER,
  storageKeys: [],
  address: CRYPTO_PUNKS_ADDRESS
} as GetProofParameters;
export const LONDON_CRYPTO_PUNKS_GET_BLOCK_PARAMETERS = { blockNumber: LONDON_BLOCK_NUMBER } as GetBlockParameters;
const EXPECTED_CALLS = [
  {
    method: 'getBlock',
    arguments: [{ blockNumber: LONDON_BLOCK_NUMBER }],
    result: {
      number: LONDON_BLOCK_NUMBER,
      hash: BLOCK_HASH
    }
  },
  {
    method: 'getProof',
    arguments: [
      {
        blockNumber: LONDON_BLOCK_NUMBER,
        storageKeys: [],
        address: CRYPTO_PUNKS_ADDRESS
      }
    ],
    result: {
      storageHash: STORAGE_ROOT
    }
  }
];

describe('recordingClient', () => {
  const publicClientMock: AlchemyClient = {
    getBlock: () => EXPECTED_CALLS[0].result,
    getProof: () => EXPECTED_CALLS[1].result
  } as unknown as AlchemyClient;

  it('record JSON-RPC API calls', async () => {
    const client = createRecordingClient(publicClientMock);

    await client.getBlock(LONDON_CRYPTO_PUNKS_GET_BLOCK_PARAMETERS);
    await client.getProof(LONDON_CRYPTO_PUNKS_GET_PROOF_PARAMETERS);
    const calls: Call[] = client.getCalls();

    expect(calls).toMatchObject(EXPECTED_CALLS);
  });

  it('record and mock', async () => {
    await withTempFile(async (tempFilePath) => {
      const client = createRecordingClient(publicClientMock);

      await client.getBlock(LONDON_CRYPTO_PUNKS_GET_BLOCK_PARAMETERS);
      await client.getProof(LONDON_CRYPTO_PUNKS_GET_PROOF_PARAMETERS);
      await writeObject(client.getCalls(), tempFilePath);

      const mockingClient: AlchemyClient = await createMockClient([tempFilePath]);

      const block = await mockingClient.getBlock(LONDON_CRYPTO_PUNKS_GET_BLOCK_PARAMETERS);
      const proof = await mockingClient.getProof(LONDON_CRYPTO_PUNKS_GET_PROOF_PARAMETERS);

      expect(block.number).toBe(LONDON_BLOCK_NUMBER);
      expect(block.hash).toBe(BLOCK_HASH);

      expect(proof.storageHash).toBe(STORAGE_ROOT);
    });
  });
});
