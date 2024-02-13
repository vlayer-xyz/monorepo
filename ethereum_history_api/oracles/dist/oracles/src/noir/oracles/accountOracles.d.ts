import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { type GetProofReturnType, type Hex, type PublicClient } from 'viem';
import { NoirArguments } from './oracles.js';
export declare const getAccountOracle: (client: PublicClient, args: NoirArguments) => Promise<ForeignCallOutput[]>;
export declare function parseNoirGetAccountArguments(args: NoirArguments): {
    blockNumber: bigint;
    address: Hex;
};
export declare function encodeAccount(ethProof: GetProofReturnType): ForeignCallOutput[];
export declare function encodeStateProof(ethProof: GetProofReturnType): ForeignCallOutput[];
