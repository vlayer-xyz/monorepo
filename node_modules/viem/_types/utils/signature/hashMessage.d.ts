import type { ErrorType } from '../../errors/utils.js';
import type { ByteArray, Hex, SignableMessage } from '../../types/misc.js';
import { type ConcatErrorType } from '../data/concat.js';
import { type StringToBytesErrorType, type ToBytesErrorType } from '../encoding/toBytes.js';
import { type Keccak256ErrorType } from '../hash/keccak256.js';
type To = 'hex' | 'bytes';
export type HashMessage<TTo extends To> = (TTo extends 'bytes' ? ByteArray : never) | (TTo extends 'hex' ? Hex : never);
export type HashMessageErrorType = ConcatErrorType | Keccak256ErrorType | StringToBytesErrorType | ToBytesErrorType | ErrorType;
export declare function hashMessage<TTo extends To = 'hex'>(message: SignableMessage, to_?: TTo): HashMessage<TTo>;
export {};
//# sourceMappingURL=hashMessage.d.ts.map