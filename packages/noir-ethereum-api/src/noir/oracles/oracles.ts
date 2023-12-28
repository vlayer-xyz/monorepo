import { ForeignCallOutput } from '@noir-lang/noir_js';
import { createDefaultClient } from '../../ethereum/client.js';
import { getAccountOracle } from "./accountOracles.js";

export type Oracles = (name: string, args: string[][]) => Promise<ForeignCallOutput[]>;

export const oracles: Oracles = async (name: string, args: string[][]): Promise<ForeignCallOutput[]> => {
  if (name === "get_account") {
    return await getAccountOracle(createDefaultClient(), args);
  }
  return Promise.reject("Unknown oracle");
}
