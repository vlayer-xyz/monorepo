import { describe, expect, it } from 'vitest';
import { createDefaultClient } from '../../src/ethereum/client.js';
import { Call, createRecordingClient } from '../../src/ethereum/recordingClient.js';
import { readObject, withTempFile, writeObject } from '../../src/utils/file.js';
import { createMockClient } from '../../src/ethereum/mockClient.js';
import { PublicClient } from 'viem';
import {
  ADDRESS,
  BLOCK_NUMBER,
  expectPublicClientBehaviour,
  GET_BLOCK_PARAMETERS,
  GET_PROOF_PARAMETERS
} from './client.test.js';

const EXPECTED_CALLS = [
  {
    method: 'getBlock',
    arguments: [{ blockNumber: BLOCK_NUMBER }],
    result: {
      hash: '0xbe8aa5945d3377e65ed06757555d0d4babe269097574c210133e59cf6bc17d18'
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
      storageHash: '0xae2792244417bc1749b9cd9a0bdc1c4a6cf32f147b37202c8cb3590777659aec'
    }
  }
];

describe('recordingClient', () => {
  it('record JSON-RPC API calls', async () => {
    const client = createRecordingClient(createDefaultClient());

    client.getBlock(GET_BLOCK_PARAMETERS);
    client.getProof(GET_PROOF_PARAMETERS);
    const calls: Call[] = await client.getCalls();

    expect(calls).toMatchObject(EXPECTED_CALLS);
  });

  it('save recorded JSON-RPC API calls to file', async () => {
    await withTempFile(async (tempFilePath) => {
      const client = createRecordingClient(createDefaultClient());

      client.getBlock(GET_BLOCK_PARAMETERS);
      client.getProof(GET_PROOF_PARAMETERS);
      await writeObject(await client.getCalls(), tempFilePath);

      const savedCalls = await readObject(tempFilePath);
      expect(savedCalls).toMatchObject(EXPECTED_CALLS);
    });
  });

  it('record and mock', async () => {
    await withTempFile(async (tempFilePath) => {
      const client = createRecordingClient(createDefaultClient());

      client.getBlock(GET_BLOCK_PARAMETERS);
      client.getProof(GET_PROOF_PARAMETERS);
      await writeObject(await client.getCalls(), tempFilePath);

      const mockingClient: PublicClient = await createMockClient(tempFilePath);

      await expectPublicClientBehaviour(mockingClient);
    });
  });
});
