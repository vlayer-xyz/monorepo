import { MultiChainClient } from '../ethereum/client.js';
import { startOracleServer } from '../noir/oracles/server.js';

await startOracleServer(MultiChainClient.from_env());
