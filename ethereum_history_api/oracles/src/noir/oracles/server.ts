import { PublicClient } from 'viem';
import { buildOracleServer } from './server/app.js';
import { createMockClient } from '../../ethereum/mockClient.js';

const PORT = 5555;
const MOCK_ORACLE_SERVER_PORT = PORT + 1;

export const startOracleServer = async (client: PublicClient, port: number = PORT) => {
  const app = buildOracleServer(
    {
      logger: {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname,req.hostname,req.remoteAddress,req.remotePort'
          }
        }
      }
    },
    client
  );

  await app.listen({ port });
  return app;
};

export async function withMockOracleServer<T>(fn: (serverUrl: string) => Promise<T>): Promise<T> {
  const mockClient = await createMockClient('./fixtures/mockClientData.json');
  const app = await startOracleServer(mockClient, MOCK_ORACLE_SERVER_PORT);
  const serverUrl = `http://localhost:${MOCK_ORACLE_SERVER_PORT}`;
  try {
    return await fn(serverUrl);
  } finally {
    await app.close();
  }
}
