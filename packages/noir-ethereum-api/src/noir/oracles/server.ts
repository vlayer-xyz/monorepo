import { JSONRPCServer, TypedJSONRPCServer } from 'json-rpc-2.0';
import express from 'express';
import bodyParser from 'body-parser';
import { getHeaderHandler, getAccountHandler, JSONRPCServerMethods, ServerParams } from './server/handlers.js';
import { createDefaultClient } from '../../ethereum/client.js';

const PORT = 5555; // Suggested by nargo docs: https://noir-lang.org/docs/how_to/how-to-oracles#step-3---usage-with-nargo
const client = createDefaultClient();

const server: TypedJSONRPCServer<JSONRPCServerMethods, ServerParams> = new JSONRPCServer();
const serverParams = { client };
server.addMethod('get_header', getHeaderHandler);
server.addMethod('get_account', getAccountHandler);

const app = express();
app.use(bodyParser.json());
app.post('/', (req, res) => {
  const jsonRPCRequest = req.body;
  console.log(jsonRPCRequest.method);

  server.receive(jsonRPCRequest, serverParams).then((jsonRPCResponse) => {
    if (jsonRPCResponse) {
      res.json(jsonRPCResponse);
    } else {
      res.sendStatus(204);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Oracles server listening on port ${PORT}`);
});
