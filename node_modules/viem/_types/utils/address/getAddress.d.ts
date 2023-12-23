import type { Address } from 'abitype';
import type { ErrorType } from '../../errors/utils.js';
import { type StringToBytesErrorType } from '../encoding/toBytes.js';
import { type Keccak256ErrorType } from '../hash/keccak256.js';
import { type IsAddressErrorType } from './isAddress.js';
export type ChecksumAddressErrorType = Keccak256ErrorType | StringToBytesErrorType | ErrorType;
export declare function checksumAddress(address_: Address, chainId?: number): Address;
export type GetAddressErrorType = ChecksumAddressErrorType | IsAddressErrorType | ErrorType;
export declare function getAddress(address: string, chainId?: number): Address;
//# sourceMappingURL=getAddress.d.ts.map