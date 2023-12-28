import { readFileSync } from 'fs';
import { ForeignCallOutput } from '@noir-lang/noir_js';

import { Oracles } from "../src/noir/oracles/oracles.js";
import { AccountWithProof } from "../src/noir/oracles/accountOracles.js";

export function loadAccountWithProof(name: string): AccountWithProof {
  return JSON.parse(readFileSync(`./test/resources/${name}`, 'utf-8')) as AccountWithProof;
}

interface MapNameToOracleResult {
  [key: string]: ForeignCallOutput[]
}

export const stubOracles: (dict: MapNameToOracleResult) => Oracles =
  (dict: MapNameToOracleResult) => (name, args) =>
    Promise.resolve(dict[name]) ?? Promise.reject("Unknown oracle");
