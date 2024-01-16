import { describe, expect, it } from 'vitest';
import { GetBlockReturnType, GetProofReturnType } from 'viem';
import { createMockingClient } from '../../src/ethereum/mockClient.js';

describe('mockingClient', () => {
  it.only('read recorded JSON-RPC API calls from file in mocking client', async () => {
    const filePath = './test/fixtures/mocClientData.json';
    const mockingClient = createMockingClient(filePath);

    const getBlock: GetBlockReturnType = (await mockingClient.getBlock({
      blockNumber: 14194126n
    })) as GetBlockReturnType;
    const getProof = (await mockingClient.getProof({
      blockNumber: 14194126n,
      storageKeys: [],
      address: '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb'
    })) as GetProofReturnType;

    expect(getBlock.number).toBe(14194126n);
    expect(getBlock.hash).toBe('0xbe8aa5945d3377e65ed06757555d0d4babe269097574c210133e59cf6bc17d18');

    expect(getProof.storageHash).toBe('0xae2792244417bc1749b9cd9a0bdc1c4a6cf32f147b37202c8cb3590777659aec');
  });
});
