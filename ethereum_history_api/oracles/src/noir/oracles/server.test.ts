import { describe, it, expect } from 'vitest';
import { withOracleServer } from './server.js';
import { createMockClient } from '../../ethereum/mockClient.js';

const JSON_RPC_PAYLOAD = {
  jsonrpc: '2.0',
  method: 'get_header',
  params: [{ Single: { inner: 'd895ce' } }],
  id: 1
};

const GET_HEADER_POST_DATA = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(JSON_RPC_PAYLOAD)
};

const ORACLE_SERVER_PORT = 5556;

type LocalhostOracleStatus = 'OK' | 'NOT_AVAILABLE';

async function localhostOracleStatus() {
  let statusText: LocalhostOracleStatus;
  try {
    const response = await fetch(`http://localhost:${ORACLE_SERVER_PORT}`, GET_HEADER_POST_DATA);
    statusText = response.status == 200 ? 'OK' : 'NOT_AVAILABLE';
  } catch (e) {
    statusText = 'NOT_AVAILABLE';
  }
  return statusText;
}

describe('oracle server', async () => {
  const mockClient = await createMockClient('./fixtures/mockClientData.json');

  it('withOracleServer should start server', async () => {
    const oracleStatus = await withOracleServer(
      async () => {
        return await localhostOracleStatus();
      },
      mockClient,
      ORACLE_SERVER_PORT
    );
    expect(oracleStatus).toStrictEqual('OK');
  });

  it('withOracleServer should close server after callback finish', async () => {
    await withOracleServer(async () => {}, mockClient, ORACLE_SERVER_PORT);

    expect(await localhostOracleStatus()).toStrictEqual('NOT_AVAILABLE');
  });

  it('withOracleServer should close server when callback throws an exception', async () => {
    const throwsError = () => {
      throw new Error('error');
    };

    expect(
      async () => await withOracleServer(async () => throwsError(), mockClient, ORACLE_SERVER_PORT)
    ).rejects.toThrow('error');

    expect(await localhostOracleStatus()).toStrictEqual('NOT_AVAILABLE');
  });
});
