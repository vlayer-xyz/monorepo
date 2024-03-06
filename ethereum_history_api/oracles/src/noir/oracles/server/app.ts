import { JSONRPCRequest, JSONRPCServer, TypedJSONRPCServer } from 'json-rpc-2.0';
import Fastify from 'fastify';
import http from 'http';
import { getHeaderHandler, getAccountHandler, JSONRPCServerMethods, ServerParams } from './handlers.js';
import { createDefaultClient } from '../../../ethereum/client.js';
import { PublicClient } from 'viem';

const HTTP_STATUS_NO_CONTENT = 204;

const jsonRPCServer: TypedJSONRPCServer<JSONRPCServerMethods, ServerParams> = new JSONRPCServer();
jsonRPCServer.addMethod('get_header', getHeaderHandler);
jsonRPCServer.addMethod('get_account', getAccountHandler);

export function buildOracleServer(
  opts: Fastify.FastifyHttpOptions<http.Server> = {},
  client: PublicClient = createDefaultClient()
): Fastify.FastifyInstance {
  const app = Fastify(opts);
  const serverParams = { client };

  app.post('/', async (request, reply) => {
    const jsonRPCRequest = request.body as JSONRPCRequest;
    request.log.info({ jsonRPCRequest }, 'Received request');

    await jsonRPCServer.receive(jsonRPCRequest, serverParams).then(async (jsonRPCResponse) => {
      if (jsonRPCResponse) {
        await reply.send(jsonRPCResponse);
      } else {
        await reply.status(HTTP_STATUS_NO_CONTENT).send();
      }
    });
  });

  return app;
}
