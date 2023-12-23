import type { Abi } from 'abitype';
import { type AbiFunctionNotFoundErrorType } from '../../errors/abi.js';
import type { GetFunctionArgs, InferFunctionName } from '../../types/contract.js';
import { type ConcatHexErrorType } from '../data/concat.js';
import { type GetFunctionSelectorErrorType } from '../hash/getFunctionSelector.js';
import type { ErrorType } from '../../errors/utils.js';
import { type EncodeAbiParametersErrorType } from './encodeAbiParameters.js';
import { type FormatAbiItemErrorType } from './formatAbiItem.js';
import { type GetAbiItemErrorType } from './getAbiItem.js';
export type EncodeFunctionDataParameters<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string | undefined = string, _FunctionName = InferFunctionName<TAbi, TFunctionName>> = {
    functionName?: _FunctionName;
} & (TFunctionName extends string ? {
    abi: TAbi;
} & GetFunctionArgs<TAbi, TFunctionName> : _FunctionName extends string ? {
    abi: [TAbi[number]];
} & GetFunctionArgs<TAbi, _FunctionName> : never);
export type EncodeFunctionDataErrorType = AbiFunctionNotFoundErrorType | ConcatHexErrorType | EncodeAbiParametersErrorType | FormatAbiItemErrorType | GetAbiItemErrorType | GetFunctionSelectorErrorType | ErrorType;
export declare function encodeFunctionData<const TAbi extends Abi | readonly unknown[], TFunctionName extends string | undefined = undefined>({ abi, args, functionName, }: EncodeFunctionDataParameters<TAbi, TFunctionName>): `0x${string}`;
//# sourceMappingURL=encodeFunctionData.d.ts.map