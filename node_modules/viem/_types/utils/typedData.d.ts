import type { TypedData, TypedDataDomain, TypedDataParameter } from 'abitype';
import type { Hex } from '../types/misc.js';
import type { TypedDataDefinition } from '../types/typedData.js';
import type { ErrorType } from '../errors/utils.js';
import { type IsAddressErrorType } from './address/isAddress.js';
import { type SizeErrorType } from './data/size.js';
import { type NumberToHexErrorType } from './encoding/toHex.js';
import { type HashDomainErrorType } from './signature/hashTypedData.js';
export type ValidateTypedDataErrorType = HashDomainErrorType | IsAddressErrorType | NumberToHexErrorType | SizeErrorType | ErrorType;
export declare function validateTypedData<const TTypedData extends TypedData | {
    [key: string]: unknown;
}, TPrimaryType extends string = string>({ domain, message, primaryType, types: types_, }: TypedDataDefinition<TTypedData, TPrimaryType>): void;
export type GetTypesForEIP712DomainErrorType = ErrorType;
export declare function getTypesForEIP712Domain({ domain, }: {
    domain?: TypedDataDomain;
}): TypedDataParameter[];
export type DomainSeparatorErrorType = GetTypesForEIP712DomainErrorType | HashDomainErrorType | ErrorType;
export declare function domainSeparator({ domain }: {
    domain: TypedDataDomain;
}): Hex;
//# sourceMappingURL=typedData.d.ts.map