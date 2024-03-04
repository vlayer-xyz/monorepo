import { createDefaultClient } from '../ethereum/client.js';
import { startOracleServer } from '../noir/oracles/server.js';

await startOracleServer(createDefaultClient());
