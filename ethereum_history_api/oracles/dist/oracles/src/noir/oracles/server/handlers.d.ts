import { PublicClient } from 'viem';
import { ForeignCallResult, ForeignCallParams } from './types.js';
/**
 * The format that the Noir oracles server receives the arguments in is slightly different than the format that acvm.js uses.
 * Therefore, we need to convert both the arguments and the outputs.
 * Please refer to ./types.ts for the format that the server receives.
 */
export type JSONRPCServerMethods = {
    get_header(params: ForeignCallParams): ForeignCallResult;
    get_account(params: ForeignCallParams): ForeignCallResult;
};
export interface ServerParams {
    client: PublicClient;
}
export declare function getHeaderHandler(params: ForeignCallParams, { client }: ServerParams): Promise<ForeignCallResult>;
export declare function getAccountHandler(params: ForeignCallParams, { client }: ServerParams): Promise<ForeignCallResult>;
