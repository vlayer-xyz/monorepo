import type { TypedData, TypedDataDomain } from 'abitype';
import type { ErrorType } from '../../errors/utils.js';
import type { Hex } from '../../types/misc.js';
import type { TypedDataDefinition } from '../../types/typedData.js';
import { type EncodeAbiParametersErrorType } from '../abi/encodeAbiParameters.js';
import { type ToHexErrorType } from '../encoding/toHex.js';
import { type Keccak256ErrorType } from '../hash/keccak256.js';
import { type GetTypesForEIP712DomainErrorType, type ValidateTypedDataErrorType } from '../typedData.js';
type MessageTypeProperty = {
    name: string;
    type: string;
};
export type HashTypedDataParameters<TTypedData extends TypedData | {
    [key: string]: unknown;
} = TypedData, TPrimaryType extends string = string> = TypedDataDefinition<TTypedData, TPrimaryType>;
export type HashTypedDataReturnType = Hex;
export type HashTypedDataErrorType = GetTypesForEIP712DomainErrorType | HashDomainErrorType | HashStructErrorType | ValidateTypedDataErrorType | ErrorType;
export declare function hashTypedData<const TTypedData extends TypedData | {
    [key: string]: unknown;
}, TPrimaryType extends string = string>({ domain: domain_, message, primaryType, types: types_, }: HashTypedDataParameters<TTypedData, TPrimaryType>): HashTypedDataReturnType;
export type HashDomainErrorType = HashStructErrorType | ErrorType;
export declare function hashDomain({ domain, types, }: {
    domain: TypedDataDomain;
    types: Record<string, MessageTypeProperty[]>;
}): `0x${string}`;
type HashStructErrorType = EncodeDataErrorType | Keccak256ErrorType | ErrorType;
type EncodeDataErrorType = EncodeAbiParametersErrorType | EncodeFieldErrorType | HashTypeErrorType | ErrorType;
type HashTypeErrorType = ToHexErrorType | EncodeTypeErrorType | Keccak256ErrorType | ErrorType;
type EncodeTypeErrorType = FindTypeDependenciesErrorType;
type FindTypeDependenciesErrorType = ErrorType;
type EncodeFieldErrorType = Keccak256ErrorType | EncodeAbiParametersErrorType | ToHexErrorType | ErrorType;
export {};
//# sourceMappingURL=hashTypedData.d.ts.map