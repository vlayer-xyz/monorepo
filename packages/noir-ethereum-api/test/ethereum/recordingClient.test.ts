import { describe, expect, it } from 'vitest';
import { createDefaultClient } from '../../src/ethereum/client.js';
import { Call, createRecordingClient, saveCallsToFile } from '../../src/ethereum/recordingClient.js';
import { GetBlockReturnType, GetProofReturnType } from 'viem';
import * as fs from 'fs/promises';
import { parse } from '../../src/utils/json-bigint.js';
import { withTempFile } from '../helpers.js';

describe('recordingClient', () => {
  it('record JSON-RPC API calls', async () => {
    // given
    const client = createRecordingClient(createDefaultClient());

    // when
    client.getBlock({ blockNumber: 14194126n });
    client.getProof({ blockNumber: 14194126n, storageKeys: [], address: '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb' });
    const callResults: Call[] = await client.getCalls();

    // then
    validateResults(callResults);
  });

  it('save recorded JSON-RPC API calls to file', async () => {
    await withTempFile(async (tempFilePath) => {
      // given
      const client = createRecordingClient(createDefaultClient());

      // when
      client.getBlock({ blockNumber: 14194126n });
      client.getProof({
        blockNumber: 14194126n,
        storageKeys: [],
        address: '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb'
      });
      await saveCallsToFile(client, tempFilePath);

      // then
      const fileContent = await fs.readFile(tempFilePath, 'utf8');
      const savedCalls = parse(fileContent) as Call[];
      validateResults(savedCalls);
    });
  });
});

function validateResults(calls: Call[]) {
  expect(calls.length).toStrictEqual(2);

  expect(calls[0].method).toStrictEqual('getBlock');
  expect(calls[0].arguments).toEqual([{ blockNumber: 14194126n }]);
  expect((calls[0].result as GetBlockReturnType).hash).toStrictEqual(
    '0xbe8aa5945d3377e65ed06757555d0d4babe269097574c210133e59cf6bc17d18'
  );

  expect(calls[1].method).toStrictEqual('getProof');
  expect(calls[1].arguments).toEqual([
    {
      blockNumber: 14194126n,
      storageKeys: [],
      address: '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb'
    }
  ]);
  expect((calls[1].result as GetProofReturnType).storageHash).toStrictEqual(
    '0xae2792244417bc1749b9cd9a0bdc1c4a6cf32f147b37202c8cb3590777659aec'
  );
}
