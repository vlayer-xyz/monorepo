import { PublicClient } from 'viem';
import { ForeignCallResult, ForeignCallParams } from './types.js';
import { getAccountOracle } from '../accountOracle.js';
import { getHeaderOracle } from '../headerOracle.js';
import { decodeNoirArguments, encodeForeignCallResult } from './encode.js';

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
};

export interface ServerParams {
  client: PublicClient;
}

export async function getHeaderHandler(
  params: ForeignCallParams,
  { client }: ServerParams
): Promise<ForeignCallResult> {
  const noirArguments = decodeNoirArguments(params);
  const noirOutputs = await getHeaderOracle(client, noirArguments);
  const result = encodeForeignCallResult(noirOutputs);
  return result;
}

export async function getAccountHandler(
  params: ForeignCallParams,
  { client }: ServerParams
): Promise<ForeignCallResult> {
  const noirArguments = decodeNoirArguments(params);
  const noirOutputs = await getAccountOracle(client, noirArguments);
  const result = encodeForeignCallResult(noirOutputs);
  return result;
}
