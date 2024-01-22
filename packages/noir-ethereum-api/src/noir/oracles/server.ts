import { JSONRPCRequest, JSONRPCServer, TypedJSONRPCServer } from 'json-rpc-2.0';
import Fastify from 'fastify';
import { getHeaderHandler, getAccountHandler, JSONRPCServerMethods, ServerParams } from './server/handlers.js';
import { createDefaultClient } from '../../ethereum/client.js';

const PORT = 5555;
const client = createDefaultClient();

const jsonRPCServer: TypedJSONRPCServer<JSONRPCServerMethods, ServerParams> = new JSONRPCServer();
const serverParams = { client };
jsonRPCServer.addMethod('get_header', getHeaderHandler);
jsonRPCServer.addMethod('get_account', getAccountHandler);

const app = Fastify({
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

app.post('/', (request, reply) => {
  const jsonRPCRequest = request.body as JSONRPCRequest;
  request.log.info({ jsonRPCRequest }, 'Received request');

  jsonRPCServer.receive(jsonRPCRequest, serverParams).then((jsonRPCResponse) => {
    if (jsonRPCResponse) {
      reply.send(jsonRPCResponse);
    } else {
      reply.status(204).send();
    }
  });
});

app.listen({ port: PORT }, (err) => {
  if (err) throw err;
});
