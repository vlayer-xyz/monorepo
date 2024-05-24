import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { MultiChainClient } from '../../ethereum/client.js';

export type NoirArgument = string[];
export type NoirArguments = NoirArgument[];

export type Oracle = (args: NoirArguments) => Promise<ForeignCallOutput[]>;
export type RpcOracle = (multiChainClient: MultiChainClient, args: NoirArguments) => Promise<ForeignCallOutput[]>;
