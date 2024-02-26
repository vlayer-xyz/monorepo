import Fastify from 'fastify';
import { buildOracleServer } from './server/app.js';

const PORT = 5555;

const app = buildOracleServer({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname,req.hostname,req.remoteAddress,req.remotePort'
      }
    }
  }
});

export const startOracleServer = async () => {
  await app.listen({ port: PORT });
  return app;
};

export async function withOracleServer<T>(fn: () => Promise<T>): Promise<T> {
  const app = await startOracleServer();
  try {
    return await fn();
  } finally {
    await app.close();
  }
}
