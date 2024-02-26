import { describe, it, expect } from 'vitest';
import { withOracleServer } from './server.js';

describe('oracle server', async () => {
  it('withOracleServer should start server', async () => {
    const jsonRpcPayload = {
      jsonrpc: '2.0',
      method: 'get_header',
      params: [{ Single: { inner: 'd895ce' } }],
      id: 1
    };

    const getHeaderRpcCall = async () => {
      return await fetch('http://localhost:5555', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonRpcPayload)
      });
    };

    await withOracleServer(async () => {
      const response = await getHeaderRpcCall();
      expect(response.status).toBe(200);
    });
  });
});
