import { describe, expect, it } from 'vitest';
import { createDefaultClient } from '../../src/ethereum/client.js';
import { AwaitedRecordingEntry, recordingClient } from '../../src/ethereum/recordingClient.js';
import { GetBlockReturnType, GetProofReturnType } from 'viem';

describe('recordingClient', () => {
  it('record JSON-RPC API calls', async () => {
    const client = recordingClient(createDefaultClient());
    client.getBlock({ blockNumber: 14194126n });
    client.getProof({ blockNumber: 14194126n, storageKeys: [], address: '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb' });
    const recordings: AwaitedRecordingEntry[] = await client.getRecordings();

    expect(recordings.length).toStrictEqual(2);

    expect(recordings[0].method).toStrictEqual('getBlock');
    expect(recordings[0].arguments).toStrictEqual([{ blockNumber: 14194126n }]);
    expect((recordings[0].result as GetBlockReturnType).hash).toStrictEqual(
      '0xbe8aa5945d3377e65ed06757555d0d4babe269097574c210133e59cf6bc17d18'
    );

    expect(recordings[1].method).toStrictEqual('getProof');
    expect(recordings[1].arguments).toStrictEqual([
      {
        blockNumber: 14194126n,
        storageKeys: [],
        address: '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb'
      }
    ]);
    expect((recordings[1].result as GetProofReturnType).storageHash).toStrictEqual(
      '0xae2792244417bc1749b9cd9a0bdc1c4a6cf32f147b37202c8cb3590777659aec'
    );
  });
});
