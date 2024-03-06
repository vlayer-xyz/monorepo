import { describe, expect, it } from 'vitest';
import { Call, createRecordingClient } from './recordingClient.js';
import { withTempFile, writeObject } from '../util/file.js';
import { createMockClient } from './mockClient.js';
import { GetBlockParameters, GetProofParameters, Hex, PublicClient } from 'viem';

export const BLOCK_NUMBER = 14194126n;
export const ADDRESS: Hex = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb';
const BLOCK_HASH: Hex = '0xbe8aa5945d3377e65ed06757555d0d4babe269097574c210133e59cf6bc17d18';
const STORAGE_ROOT: Hex = '0xae2792244417bc1749b9cd9a0bdc1c4a6cf32f147b37202c8cb3590777659aec';

export const GET_PROOF_PARAMETERS = {
  blockNumber: BLOCK_NUMBER,
  storageKeys: [],
  address: ADDRESS
} as GetProofParameters;
export const GET_BLOCK_PARAMETERS = { blockNumber: BLOCK_NUMBER } as GetBlockParameters;
const EXPECTED_CALLS = [
  {
    method: 'getBlock',
    arguments: [{ blockNumber: BLOCK_NUMBER }],
    result: {
      number: BLOCK_NUMBER,
      hash: BLOCK_HASH
    }
  },
  {
    method: 'getProof',
    arguments: [
      {
        blockNumber: BLOCK_NUMBER,
        storageKeys: [],
        address: ADDRESS
      }
    ],
    result: {
      storageHash: STORAGE_ROOT
    }
  }
];

describe('recordingClient', () => {
  const publicClientMock: PublicClient = {
    getBlock: () => EXPECTED_CALLS[0].result,
    getProof: () => EXPECTED_CALLS[1].result
  } as unknown as PublicClient;

  it('record JSON-RPC API calls', async () => {
    const client = createRecordingClient(publicClientMock);

    await client.getBlock(GET_BLOCK_PARAMETERS);
    await client.getProof(GET_PROOF_PARAMETERS);
    const calls: Call[] = client.getCalls();
    const lastCall: Call = client.getLastCall();

    expect(lastCall).toMatchObject(EXPECTED_CALLS[1]);
    expect(calls).toMatchObject(EXPECTED_CALLS);
  });

  it('record and mock', async () => {
    await withTempFile(async (tempFilePath) => {
      const client = createRecordingClient(publicClientMock);

      await client.getBlock(GET_BLOCK_PARAMETERS);
      await client.getProof(GET_PROOF_PARAMETERS);
      await writeObject(client.getCalls(), tempFilePath);

      const mockingClient: PublicClient = await createMockClient(tempFilePath);

      const block = await mockingClient.getBlock(GET_BLOCK_PARAMETERS);
      const proof = await mockingClient.getProof(GET_PROOF_PARAMETERS);

      expect(block.number).toBe(BLOCK_NUMBER);
      expect(block.hash).toBe(BLOCK_HASH);

      expect(proof.storageHash).toBe(STORAGE_ROOT);
    });
  });
});
