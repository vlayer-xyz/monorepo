import type { AbiFunction } from 'abitype';
import type { ErrorType } from '../../errors/utils.js';
import { type SliceErrorType } from '../data/slice.js';
import { type ToBytesErrorType } from '../encoding/toBytes.js';
import { type GetFunctionSignatureErrorType } from './getFunctionSignature.js';
import { type Keccak256ErrorType } from './keccak256.js';
export type GetFunctionSelectorErrorType = GetFunctionSignatureErrorType | Keccak256ErrorType | SliceErrorType | ToBytesErrorType | ErrorType;
export declare const getFunctionSelector: (fn: string | AbiFunction) => `0x${string}`;
//# sourceMappingURL=getFunctionSelector.d.ts.map