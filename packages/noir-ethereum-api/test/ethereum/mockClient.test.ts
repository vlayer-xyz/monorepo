import { describe, it } from 'vitest';
import { PublicClient } from 'viem';
import { createMockClient } from '../../src/ethereum/mockClient.js';
import { expectPublicClientBehaviour } from './client.test.js';

describe('mockingClient', () => {
  it('read recorded JSON-RPC API calls from file in mocking client', async () => {
    const filePath = './test/fixtures/mockClientData.json';
    const mockingClient: PublicClient = await createMockClient(filePath);

    await expectPublicClientBehaviour(mockingClient);
  });
});
