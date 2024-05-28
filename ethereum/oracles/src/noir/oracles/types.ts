import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { MultiChainClient } from '../../ethereum/client.js';

export type NoirArgument = string[];
export type NoirArguments = NoirArgument[];

export type Oracle = (multiChainClient: MultiChainClient, args: NoirArguments) => Promise<ForeignCallOutput[]>;
