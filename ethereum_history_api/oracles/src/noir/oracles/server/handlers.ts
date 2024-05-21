import { ForeignCallResult, ForeignCallParams } from './types.js';
import { decodeNoirArguments, encodeForeignCallResult } from './encode.js';
import { MultiChainClient } from '../../../ethereum/client.js';
import { Oracle } from '../oracles.js';

/**
 * The format that the Noir oracles server receives the arguments in is slightly different than the format that acvm.js uses.
 * Therefore, we need to convert both the arguments and the outputs.
 * Please refer to ./types.ts for the format that the server receives.
 */

// This needs to be a type, not an interface because TypedJSONRPCServer requires it to have an index signature.
/* eslint-disable-next-line @typescript-eslint/consistent-type-definitions */
export type JSONRPCServerMethods = {
  get_header(params: ForeignCallParams): ForeignCallResult;
  get_account(params: ForeignCallParams): ForeignCallResult;
  get_proof(params: ForeignCallParams): ForeignCallResult;
  get_receipt(params: ForeignCallParams): ForeignCallResult;
  get_transaction(params: ForeignCallParams): ForeignCallResult;
  get_account_with_storage_recursive(params: ForeignCallParams): ForeignCallResult;
};

export interface ServerParams {
  client: MultiChainClient;
}

export async function getOracleHandler(
  oracle: Oracle,
  params: ForeignCallParams,
  { client }: ServerParams
): Promise<ForeignCallResult> {
  const noirArguments = decodeNoirArguments(params);
  const noirOutputs = await oracle(client, noirArguments);
  const result = encodeForeignCallResult(noirOutputs);
  return result;
}
