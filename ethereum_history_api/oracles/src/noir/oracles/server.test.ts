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

describe('oracle server', async () => {
  const mockClient = await createMockClient('./fixtures/mockClientData.json');
  const getHeaderRpcCall = async () => await fetch('http://localhost:5555', GET_HEADER_POST_DATA);
  const getHeaderRpcCallStatus = async () => {
    let response: Response | string;
    try {
      response = (await getHeaderRpcCall()).statusText;
    } catch (e) {
      response = 'fetch failed';
    }
    return response;
  };

  it('withOracleServer should start server', async () => {
    const rpcCallStatus = await withOracleServer(async () => {
      return await getHeaderRpcCallStatus();
    }, mockClient);
    expect(rpcCallStatus).toStrictEqual('OK');
  });

  it('withOracleServer should close server after callback finish', async () => {
    await withOracleServer(async () => {}, mockClient);

    expect(async () => await getHeaderRpcCall()).rejects.toThrow('fetch failed');
  });

  it('withOracleServer should close server when callback throws an exception', async () => {
    const throwsError = () => {
      throw new Error('error');
    };

    expect(async () => await withOracleServer(async () => throwsError(), mockClient)).rejects.toThrow('error');

    expect(async () => await getHeaderRpcCall()).rejects.toThrow('fetch failed');
  });
});
