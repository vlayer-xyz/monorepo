import type { AbiEvent, AbiFunction } from 'abitype';
import { type FormatAbiItemErrorType } from '../abi/formatAbiItem.js';
import { type ToBytesErrorType } from '../encoding/toBytes.js';
import type { ErrorType } from '../../errors/utils.js';
import { type GetFunctionSignatureErrorType } from './getFunctionSignature.js';
import { type Keccak256ErrorType } from './keccak256.js';
export type HashFunctionErrorType = Keccak256ErrorType | ToBytesErrorType | GetFunctionSignatureErrorType | ErrorType;
export declare function hashFunction(def: string): `0x${string}`;
export type HashAbiItemErrorType = Keccak256ErrorType | ToBytesErrorType | FormatAbiItemErrorType | ErrorType;
export declare function hashAbiItem(abiItem: AbiFunction | AbiEvent): `0x${string}`;
//# sourceMappingURL=hashFunction.d.ts.map