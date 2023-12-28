import { ForeignCallOutput } from '@noir-lang/noir_js';
import { createDefaultClient } from '../../ethereum/client.js';
import { getAccountOracle } from "./accountOracles.js";
import { PublicClient } from 'viem';

export type Oracle = (client: PublicClient, args: string[][]) => Promise<ForeignCallOutput[]>;

export type Oracles = (name: string, args: string[][]) => Promise<ForeignCallOutput[]>;

type OracleMap = {
  [key: string]: Oracle;
};

export const createOracles = (client: PublicClient) => (dict: OracleMap): Oracles =>
  async (name: string, args: string[][]): Promise<ForeignCallOutput[]> => {
    const fn = dict[name];
    return fn ? fn(client, args) : Promise.reject("Unknown oracle");
  }

export const defaultOracles = createOracles(createDefaultClient())({getAccountOracle});
