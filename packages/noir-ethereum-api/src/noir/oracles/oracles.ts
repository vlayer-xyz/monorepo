import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { createDefaultClient } from '../../ethereum/client.js';
import { getAccountOracle } from './accountOracles.js';
import { type PublicClient } from 'viem';
import { getHeaderOracle } from './headerOracle.js';

export type NoirArguments = string[][];

export type Oracle = (client: PublicClient, args: NoirArguments) => Promise<ForeignCallOutput[]>;

export type Oracles = (name: string, args: NoirArguments) => Promise<ForeignCallOutput[]>;

type OracleMap = Record<string, Oracle>;

export const createOracles =
  (client: PublicClient) =>
  (dict: OracleMap): Oracles =>
  async (name: string, args: NoirArguments): Promise<ForeignCallOutput[]> => {
    const fn = dict[name];
    if (fn === undefined) {
      throw new Error(`Unknown oracle ${name}`);
    }
    return await fn(client, args);
  };

export const defaultOracles = createOracles(createDefaultClient())({
  get_account: getAccountOracle,
  get_header: getHeaderOracle
});
