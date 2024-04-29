import { parse } from 'ts-command-line-args';
import { createClient as createClientMap } from '../ethereum/client.js';
import { startOracleServer } from '../noir/oracles/server.js';

interface Args {
  chain: string;
  help?: boolean;
}

export const args = parse<Args>(
  {
    chain: { type: String, defaultValue: 'mainnet', description: 'One of mainnet, sepolia' },
    help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' }
  },
  {
    helpArg: 'help'
  }
);

const createClient = createClientMap.get(args.chain);
if (!createClient) {
  throw new Error(`Unsupported chain: ${args.chain}`);
}

await startOracleServer(createClient());
