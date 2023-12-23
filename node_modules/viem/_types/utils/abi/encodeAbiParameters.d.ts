import type { AbiParameter, AbiParametersToPrimitiveTypes } from 'abitype';
import { type AbiEncodingArrayLengthMismatchErrorType, type AbiEncodingBytesSizeMismatchErrorType, type AbiEncodingLengthMismatchErrorType, type InvalidAbiEncodingTypeErrorType, type InvalidArrayErrorType } from '../../errors/abi.js';
import { type InvalidAddressErrorType } from '../../errors/address.js';
import type { ErrorType } from '../../errors/utils.js';
import type { Hex } from '../../types/misc.js';
import { type IsAddressErrorType } from '../address/isAddress.js';
import { type ConcatErrorType } from '../data/concat.js';
import { type PadHexErrorType } from '../data/pad.js';
import { type SizeErrorType } from '../data/size.js';
import { type SliceErrorType } from '../data/slice.js';
import { type BoolToHexErrorType, type NumberToHexErrorType, type StringToHexErrorType } from '../encoding/toHex.js';
export type EncodeAbiParametersReturnType = Hex;
export type EncodeAbiParametersErrorType = AbiEncodingLengthMismatchErrorType | PrepareParamsErrorType | EncodeParamsErrorType | ErrorType;
/**
 * @description Encodes a list of primitive values into an ABI-encoded hex value.
 */
export declare function encodeAbiParameters<const TParams extends readonly AbiParameter[] | readonly unknown[]>(params: TParams, values: TParams extends readonly AbiParameter[] ? AbiParametersToPrimitiveTypes<TParams> : never): EncodeAbiParametersReturnType;
export type PrepareParamsErrorType = ErrorType;
export type PrepareParamErrorType = GetArrayComponentsErrorType | InvalidAbiEncodingTypeErrorType | ErrorType;
export type EncodeParamsErrorType = NumberToHexErrorType | SizeErrorType | ErrorType;
export type EncodeAddressErrorType = InvalidAddressErrorType | IsAddressErrorType | ErrorType;
export type EncodeArrayErrorType = AbiEncodingArrayLengthMismatchErrorType | ConcatErrorType | EncodeParamsErrorType | InvalidArrayErrorType | NumberToHexErrorType | PrepareParamErrorType | ErrorType;
export type EncodeBytesErrorType = AbiEncodingBytesSizeMismatchErrorType | ConcatErrorType | PadHexErrorType | NumberToHexErrorType | SizeErrorType | ErrorType;
export type EncodeBoolErrorType = PadHexErrorType | BoolToHexErrorType | ErrorType;
export type EncodeNumberErrorType = NumberToHexErrorType | ErrorType;
export type EncodeStringErrorType = ConcatErrorType | NumberToHexErrorType | PadHexErrorType | SizeErrorType | SliceErrorType | StringToHexErrorType | ErrorType;
export type EncodeTupleErrorType = ConcatErrorType | EncodeParamsErrorType | PrepareParamErrorType | ErrorType;
export type GetArrayComponentsErrorType = ErrorType;
export declare function getArrayComponents(type: string): [length: number | null, innerType: string] | undefined;
//# sourceMappingURL=encodeAbiParameters.d.ts.map