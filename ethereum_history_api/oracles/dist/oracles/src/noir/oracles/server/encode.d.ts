import { ForeignCallOutput } from '@noir-lang/noir_js';
import { ForeignCallParams, ForeignCallResult } from './types.js';
import { NoirArguments } from '../oracles.js';
export declare function decodeNoirArguments(params: ForeignCallParams): NoirArguments;
export declare function encodeForeignCallResult(noirOutputs: ForeignCallOutput[]): ForeignCallResult;
