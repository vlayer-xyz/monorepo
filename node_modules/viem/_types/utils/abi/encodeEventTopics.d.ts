import type { Abi } from 'abitype';
import { type AbiEventNotFoundErrorType } from '../../errors/abi.js';
import { type FilterTypeNotSupportedErrorType } from '../../errors/log.js';
import type { GetEventArgs, InferEventName } from '../../types/contract.js';
import { type ToBytesErrorType } from '../encoding/toBytes.js';
import { type GetEventSelectorErrorType } from '../hash/getEventSelector.js';
import { type Keccak256ErrorType } from '../hash/keccak256.js';
import type { ErrorType } from '../../errors/utils.js';
import { type EncodeAbiParametersErrorType } from './encodeAbiParameters.js';
import { type FormatAbiItemErrorType } from './formatAbiItem.js';
export type EncodeEventTopicsParameters<TAbi extends Abi | readonly unknown[] = Abi, TEventName extends string | undefined = string, _EventName = InferEventName<TAbi, TEventName>> = {
    eventName?: _EventName;
} & (TEventName extends string ? {
    abi: TAbi;
    args?: GetEventArgs<TAbi, TEventName>;
} : _EventName extends string ? {
    abi: [TAbi[number]];
    args?: GetEventArgs<TAbi, _EventName>;
} : never);
export type EncodeEventTopicsErrorType = AbiEventNotFoundErrorType | EncodeArgErrorType | FormatAbiItemErrorType | GetEventSelectorErrorType | ErrorType;
export declare function encodeEventTopics<const TAbi extends Abi | readonly unknown[], TEventName extends string | undefined = undefined>({ abi, eventName, args }: EncodeEventTopicsParameters<TAbi, TEventName>): `0x${string}`[];
export type EncodeArgErrorType = Keccak256ErrorType | ToBytesErrorType | EncodeAbiParametersErrorType | FilterTypeNotSupportedErrorType | ErrorType;
//# sourceMappingURL=encodeEventTopics.d.ts.map