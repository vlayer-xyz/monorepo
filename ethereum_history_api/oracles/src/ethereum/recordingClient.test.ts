import { describe, expect, it } from 'vitest';
import { Call, createRecordingClient } from './recordingClient.js';
import { withTempFile, writeObject } from '../util/file.js';
import { createMockClient } from './mockClient.js';
import { GetBlockParameters, GetProofParameters, Hex, Address } from 'viem';
import { AlchemyClient } from './client.js';

export const LONDON_BLOCK_NUM = 14194126n;
export const CRYPTO_PUNKS_ADDRESS: Address = '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB';
export const OWNER_OF_9TH_CRYPTO_PUNK_OF_STORAGE_KEY: Hex =
  '0x825eb4cda6b8b44578c55770496c59e6dc3cf2235f690bcdaf51a61898ceb284';
const BLOCK_HASH: Hex = '0xbe8aa5945d3377e65ed06757555d0d4babe269097574c210133e59cf6bc17d18';
const STORAGE_ROOT: Hex = '0xae2792244417bc1749b9cd9a0bdc1c4a6cf32f147b37202c8cb3590777659aec';

export const LONDON_CRYPTO_PUNKS_GET_PROOF_PARAMETERS = {
  blockNumber: LONDON_BLOCK_NUM,
  storageKeys: [OWNER_OF_9TH_CRYPTO_PUNK_OF_STORAGE_KEY],
  address: CRYPTO_PUNKS_ADDRESS
} as GetProofParameters;
export const LONDON_CRYPTO_PUNKS_GET_BLOCK_PARAMETERS = { blockNumber: LONDON_BLOCK_NUM } as GetBlockParameters;
const EXPECTED_CALLS = [
  {
    method: 'getBlock',
    arguments: [{ blockNumber: LONDON_BLOCK_NUM }],
    result: {
      number: LONDON_BLOCK_NUM,
      hash: BLOCK_HASH
    }
  },
  {
    method: 'getProof',
    arguments: [
      {
        blockNumber: LONDON_BLOCK_NUM,
        storageKeys: [OWNER_OF_9TH_CRYPTO_PUNK_OF_STORAGE_KEY],
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

      expect(block.number).toBe(LONDON_BLOCK_NUM);
      expect(block.hash).toBe(BLOCK_HASH);

      expect(proof.storageHash).toBe(STORAGE_ROOT);
    });
  });
});
