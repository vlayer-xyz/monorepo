import { describe, expect, it } from 'vitest';
import { PublicClient } from 'viem';
import { createMockClient } from './mockClient.js';
import { GET_BLOCK_PARAMETERS, GET_PROOF_PARAMETERS } from './recordingClient.test.js';
import { readObject } from '../util/file.js';

describe('mockingClient', () => {
  it('read recorded JSON-RPC API calls from file in mocking client', async () => {
    const filePath = './fixtures/mockClientData.json';
    const mockingClient: PublicClient = await createMockClient([filePath]);

    const block = await mockingClient.getBlock(GET_BLOCK_PARAMETERS);
    const proof = await mockingClient.getProof(GET_PROOF_PARAMETERS);

    const data: { result: object }[] = await readObject(filePath);
    expect(block).toStrictEqual(data[0].result);
    expect(proof).toStrictEqual(data[1].result);
  });
});
