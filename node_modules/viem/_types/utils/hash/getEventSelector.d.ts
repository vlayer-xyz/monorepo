import type { AbiEvent } from 'abitype';
import type { ErrorType } from '../../errors/utils.js';
import { type ToBytesErrorType } from '../encoding/toBytes.js';
import { type Keccak256ErrorType } from './keccak256.js';
export type GetEventSelectorErrorType = Keccak256ErrorType | ToBytesErrorType | ErrorType;
export declare const getEventSelector: (fn: string | AbiEvent) => `0x${string}`;
//# sourceMappingURL=getEventSelector.d.ts.map