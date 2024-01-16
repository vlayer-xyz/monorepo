import { describe, expect, it } from 'vitest';
import { createDefaultClient } from '../../src/ethereum/client.js';
import { Call, createRecordingClient } from '../../src/ethereum/recordingClient.js';
import { readObject, withTempFile, writeObject } from '../../src/utils/file.js';
import { createMockingClient } from '../../src/ethereum/mockClient.js';
import { GetBlockReturnType, GetProofReturnType } from 'viem';

const EXPECTED_CALLS = [
  {
    method: 'getBlock',
    arguments: [{ blockNumber: 14194126n }],
    result: {
      hash: '0xbe8aa5945d3377e65ed06757555d0d4babe269097574c210133e59cf6bc17d18'
    }
  },
  {
    method: 'getProof',
    arguments: [
      {
        blockNumber: 14194126n,
        storageKeys: [],
        address: '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb'
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

    client.getBlock({ blockNumber: 14194126n });
    client.getProof({ blockNumber: 14194126n, storageKeys: [], address: '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb' });
    const calls: Call[] = await client.getCalls();

    expect(calls).toMatchObject(EXPECTED_CALLS);
  });

  it('save recorded JSON-RPC API calls to file', async () => {
    await withTempFile(async (tempFilePath) => {
      const client = createRecordingClient(createDefaultClient());

      client.getBlock({ blockNumber: 14194126n });
      client.getProof({
        blockNumber: 14194126n,
        storageKeys: [],
        address: '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb'
      });
      await writeObject(await client.getCalls(), tempFilePath);

      const savedCalls = await readObject(tempFilePath);
      expect(savedCalls).toMatchObject(EXPECTED_CALLS);
    });
  });

  it('record and mock roundtrip', async () => {
    await withTempFile(async (tempFilePath) => {
      const client = createRecordingClient(createDefaultClient());

      client.getBlock({ blockNumber: 14194126n });
      client.getProof({
        blockNumber: 14194126n,
        storageKeys: [],
        address: '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb'
      });
      await writeObject(await client.getCalls(), tempFilePath);

      const mockingClient = createMockingClient(tempFilePath);

      const getBlock: GetBlockReturnType = (await mockingClient.getBlock({
        blockNumber: 14194126n
      })) as GetBlockReturnType;
      const getProof: GetProofReturnType = (await mockingClient.getProof({
        blockNumber: 14194126n,
        storageKeys: [],
        address: '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb'
      })) as GetProofReturnType;

      expect(getBlock.number).toBe(14194126n);
      expect(getBlock.hash).toBe('0xbe8aa5945d3377e65ed06757555d0d4babe269097574c210133e59cf6bc17d18');

      expect(getProof.storageHash).toBe('0xae2792244417bc1749b9cd9a0bdc1c4a6cf32f147b37202c8cb3590777659aec');
    });
  });
});
