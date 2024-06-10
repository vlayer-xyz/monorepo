import { JSONRPCRequest, JSONRPCServer, TypedJSONRPCServer } from 'json-rpc-2.0';
import Fastify from 'fastify';
import http from 'http';
import { JSONRPCServerMethods, ServerParams, getOracleHandler, getRpcOracleHandler } from './handlers.js';
import { MultiChainClient } from '../../../ethereum/client.js';
import { getHeaderOracle } from '../rpc/headerOracle.js';
import { getAccountOracle } from '../rpc/accountOracle.js';
import { getProofOracle } from '../rpc/proofOracle.js';
import { getReceiptOracle } from '../rpc/receiptOracle.js';
import { getTransactionOracle } from '../rpc/transactionOracle.js';
import { getStorageOracle } from '../recursive/getStorageOracle.js';

const HTTP_STATUS_NO_CONTENT = 204;

const jsonRPCServer: TypedJSONRPCServer<JSONRPCServerMethods, ServerParams> = new JSONRPCServer();
jsonRPCServer.addMethod('get_header', getRpcOracleHandler.bind(this, getHeaderOracle));
jsonRPCServer.addMethod('get_account', getRpcOracleHandler.bind(this, getAccountOracle));
jsonRPCServer.addMethod('get_proof', getRpcOracleHandler.bind(this, getProofOracle));
jsonRPCServer.addMethod('get_receipt', getRpcOracleHandler.bind(this, getReceiptOracle));
jsonRPCServer.addMethod('get_transaction', getRpcOracleHandler.bind(this, getTransactionOracle));
jsonRPCServer.addMethod('get_storage_recursive', getOracleHandler.bind(this, getStorageOracle));

export function buildOracleServer(
  opts: Fastify.FastifyHttpOptions<http.Server> = {},
  multiChainClient: MultiChainClient = MultiChainClient.from_env()
): Fastify.FastifyInstance {
  const app = Fastify(opts);
  const serverParams = { client: multiChainClient };

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
