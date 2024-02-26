import { PublicClient } from 'viem';
import { buildOracleServer } from './server/app.js';

const PORT = 5555;

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

export async function withOracleServer<T>(fn: () => Promise<T>, client: PublicClient, port: number): Promise<T> {
  const app = await startOracleServer(client, port);
  try {
    return await fn();
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await app.close();
  }
}
