import { describe, expect, it } from 'vitest';
import { Call, createRecordingClient } from '../../src/ethereum/recordingClient.js';
import { readObject, withTempFile, writeObject } from '../../src/utils/file.js';
import { createMockClient } from '../../src/ethereum/mockClient.js';
import {
  GetBlockParameters,
  GetBlockReturnType,
  GetProofParameters,
  GetProofReturnType,
  Hex,
  PublicClient
} from 'viem';

export const BLOCK_NUMBER = 14194126n;
export const ADDRESS: Hex = '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb';
const BLOCK_HASH: Hex = '0xbe8aa5945d3377e65ed06757555d0d4babe269097574c210133e59cf6bc17d18';
const STORAGE_HASH: Hex = '0xae2792244417bc1749b9cd9a0bdc1c4a6cf32f147b37202c8cb3590777659aec';

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
      storageHash: STORAGE_HASH
    }
  }
];

export const expectPublicClientBehaviour = async (client: PublicClient) => {
  const getBlock = (await client.getBlock(GET_BLOCK_PARAMETERS)) as GetBlockReturnType;
  const getProof = (await client.getProof(GET_PROOF_PARAMETERS)) as GetProofReturnType;

  expect(getBlock.number).toBe(BLOCK_NUMBER);
  expect(getBlock.hash).toBe(BLOCK_HASH);

  expect(getProof.storageHash).toBe(STORAGE_HASH);
};

describe('recordingClient', async () => {
  const mockPublicClient: PublicClient = {
    getBlock: () => EXPECTED_CALLS[0].result,
    getProof: () => EXPECTED_CALLS[1].result
  } as unknown as PublicClient;

  it('record JSON-RPC API calls', async () => {
    const client = createRecordingClient(mockPublicClient);

    client.getBlock(GET_BLOCK_PARAMETERS);
    client.getProof(GET_PROOF_PARAMETERS);
    const calls: Call[] = await client.getCalls();

    expect(calls).toMatchObject(EXPECTED_CALLS);
  });

  it('save recorded JSON-RPC API calls to file', async () => {
    await withTempFile(async (tempFilePath) => {
      const client = createRecordingClient(mockPublicClient);

      client.getBlock(GET_BLOCK_PARAMETERS);
      client.getProof(GET_PROOF_PARAMETERS);
      await writeObject(await client.getCalls(), tempFilePath);

      const savedCalls = await readObject(tempFilePath);
      expect(savedCalls).toMatchObject(EXPECTED_CALLS);
    });
  });

  it('record and mock', async () => {
    await withTempFile(async (tempFilePath) => {
      const client = createRecordingClient(mockPublicClient);

      client.getBlock(GET_BLOCK_PARAMETERS);
      client.getProof(GET_PROOF_PARAMETERS);
      await writeObject(await client.getCalls(), tempFilePath);

      const mockingClient: PublicClient = await createMockClient(tempFilePath);

      await expectPublicClientBehaviour(mockingClient);
    });
  });
});
