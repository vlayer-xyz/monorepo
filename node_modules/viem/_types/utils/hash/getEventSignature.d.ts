import type { AbiEvent } from 'abitype';
import type { ErrorType } from '../../errors/utils.js';
import { type GetFunctionSignatureErrorType } from './getFunctionSignature.js';
export type GetEventSignatureErrorType = GetFunctionSignatureErrorType | ErrorType;
export declare const getEventSignature: (fn: string | AbiEvent) => string;
//# sourceMappingURL=getEventSignature.d.ts.map