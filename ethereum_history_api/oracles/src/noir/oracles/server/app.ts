import { JSONRPCRequest, JSONRPCServer, TypedJSONRPCServer } from 'json-rpc-2.0';
import Fastify from 'fastify';
import http from 'http';
import { getHeaderHandler, getAccountHandler, JSONRPCServerMethods, ServerParams } from './handlers.js';
import { createDefaultClient } from '../../../ethereum/client.js';

const client = createDefaultClient();

const jsonRPCServer: TypedJSONRPCServer<JSONRPCServerMethods, ServerParams> = new JSONRPCServer();
const serverParams = { client };
jsonRPCServer.addMethod('get_header', getHeaderHandler);
jsonRPCServer.addMethod('get_account', getAccountHandler);

export function buildOracleServer(opts: Fastify.FastifyHttpOptions<http.Server> = {}): Fastify.FastifyInstance {
  const app = Fastify(opts);

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

  return app;
}
