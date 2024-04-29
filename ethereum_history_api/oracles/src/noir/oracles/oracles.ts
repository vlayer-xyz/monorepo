import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { MultiChainClient } from '../../ethereum/client.js';
import { getAccountOracle } from './accountOracle.js';
import { getHeaderOracle } from './headerOracle.js';
import { getProofOracle } from './proofOracle.js';
import { getReceiptOracle } from './receiptOracle.js';
import { getTransactionOracle } from './transactionOracle.js';

export type NoirArgument = string[];
export type NoirArguments = NoirArgument[];

export type Oracle = (multiChainClient: MultiChainClient, args: NoirArguments) => Promise<ForeignCallOutput[]>;

export type Oracles = (name: string, args: NoirArguments) => Promise<ForeignCallOutput[]>;

type OracleMap = Record<string, Oracle>;

export const createOracles =
  (multiChainClient: MultiChainClient) =>
  (dict: OracleMap): Oracles =>
  async (name: string, args: NoirArguments): Promise<ForeignCallOutput[]> => {
    const fn = dict[name];
    if (fn === undefined) {
      throw new Error(`Unknown oracle ${name}`);
    }
    return await fn(multiChainClient, args);
  };

export const defaultOraclesMap: OracleMap = {
  get_account: getAccountOracle,
  get_header: getHeaderOracle,
  get_proof: getProofOracle,
  get_receipt: getReceiptOracle,
  get_transaction: getTransactionOracle
};

export const defaultOracles = createOracles(MultiChainClient.create())(defaultOraclesMap);
