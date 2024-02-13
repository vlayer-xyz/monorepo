import { JSONRPCServer } from 'json-rpc-2.0';
import Fastify from 'fastify';
import { getHeaderHandler, getAccountHandler } from './handlers.js';
import { createDefaultClient } from '../../../ethereum/client.js';
const client = createDefaultClient();
const jsonRPCServer = new JSONRPCServer();
const serverParams = { client };
jsonRPCServer.addMethod('get_header', getHeaderHandler);
jsonRPCServer.addMethod('get_account', getAccountHandler);
export function buildOracleServer(opts = {}) {
    const app = Fastify(opts);
    app.post('/', (request, reply) => {
        const jsonRPCRequest = request.body;
        request.log.info({ jsonRPCRequest }, 'Received request');
        jsonRPCServer.receive(jsonRPCRequest, serverParams).then((jsonRPCResponse) => {
            if (jsonRPCResponse) {
                reply.send(jsonRPCResponse);
            }
            else {
                reply.status(204).send();
            }
        });
    });
    return app;
}
