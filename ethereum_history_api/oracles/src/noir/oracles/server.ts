import { buildOracleServer } from './server/app.js';
import { createMockMultiChainClient } from '../../ethereum/mockClient.js';
import { MultiChainClient } from '../../ethereum/client.js';

const PORT = 5555;
const MOCK_ORACLE_SERVER_PORT = PORT + 1;

export const startOracleServer = async (client: MultiChainClient, port: number = PORT, silent = false) => {
  const logger = silent
    ? false
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname,req.hostname,req.remoteAddress,req.remotePort'
          }
        }
      };
  const app = buildOracleServer(
    {
      logger
    },
    client
  );

  await app.listen({ port });
  return app;
};

export async function withMockOracleServer<T>(
  fixtureFilePaths: string[],
  fn: (serverUrl: string) => Promise<T>
): Promise<T> {
  const client = await createMockMultiChainClient(fixtureFilePaths);
  const app = await startOracleServer(client, MOCK_ORACLE_SERVER_PORT, true);
  const serverUrl = `http://localhost:${MOCK_ORACLE_SERVER_PORT}`;
  try {
    return await fn(serverUrl);
  } finally {
    await app.close();
  }
}
