import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { type BlockHeader } from '../../ethereum/blockHeader.js';
import { type PublicClient } from 'viem';
import { NoirArguments } from './oracles.js';
export declare const MAX_HEADER_RLP_SIZE = 708;
export declare const getHeaderOracle: (client: PublicClient, args: NoirArguments) => Promise<ForeignCallOutput[]>;
export declare function parseNoirGetHeaderArguments(args: NoirArguments): bigint;
export declare function getBlock(client: PublicClient, blockNumber: bigint): Promise<BlockHeader>;
export declare function encodeBlockHeaderPartial(header: BlockHeader): ForeignCallOutput[];
