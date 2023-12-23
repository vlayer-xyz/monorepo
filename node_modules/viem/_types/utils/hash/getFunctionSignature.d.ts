import { type AbiFunction } from 'abitype';
import type { ErrorType } from '../../errors/utils.js';
import { type NormalizeSignatureErrorType } from './normalizeSignature.js';
export type GetFunctionSignatureErrorType = NormalizeSignatureErrorType | ErrorType;
export declare const getFunctionSignature: (fn_: string | AbiFunction) => string;
//# sourceMappingURL=getFunctionSignature.d.ts.map