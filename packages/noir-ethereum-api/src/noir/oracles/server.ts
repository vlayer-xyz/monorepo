import { buildFastifyApp } from './server/app.js';

const PORT = 5555;

const app = buildFastifyApp({
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

app.listen({ port: PORT }, (err) => {
  if (err) throw err;
});
