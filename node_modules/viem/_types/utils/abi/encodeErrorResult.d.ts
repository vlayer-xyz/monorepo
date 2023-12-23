import type { Abi } from 'abitype';
import type { GetErrorArgs, InferErrorName } from '../../types/contract.js';
import { type ConcatHexErrorType } from '../data/concat.js';
import { type GetFunctionSelectorErrorType } from '../hash/getFunctionSelector.js';
import type { ErrorType } from '../../errors/utils.js';
import { type EncodeAbiParametersErrorType } from './encodeAbiParameters.js';
import { type FormatAbiItemErrorType } from './formatAbiItem.js';
import { type GetAbiItemErrorType } from './getAbiItem.js';
export type EncodeErrorResultParameters<TAbi extends Abi | readonly unknown[] = Abi, TErrorName extends string | undefined = string, _ErrorName = InferErrorName<TAbi, TErrorName>> = {
    errorName?: _ErrorName;
} & (TErrorName extends string ? {
    abi: TAbi;
} & GetErrorArgs<TAbi, TErrorName> : _ErrorName extends string ? {
    abi: [TAbi[number]];
} & GetErrorArgs<TAbi, _ErrorName> : never);
export type EncodeErrorResultErrorType = GetAbiItemErrorType | FormatAbiItemErrorType | GetFunctionSelectorErrorType | EncodeAbiParametersErrorType | ConcatHexErrorType | ErrorType;
export declare function encodeErrorResult<const TAbi extends Abi | readonly unknown[], TErrorName extends string | undefined = undefined>({ abi, errorName, args }: EncodeErrorResultParameters<TAbi, TErrorName>): `0x${string}`;
//# sourceMappingURL=encodeErrorResult.d.ts.map