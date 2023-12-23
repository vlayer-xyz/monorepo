import type { Abi, AbiConstructor, AbiError, AbiEvent, AbiEventParameter, AbiFallback, AbiFunction, AbiParameter, AbiReceive, AbiStateMutability } from '../abi.js';
import { type FormatAbiParameters as FormatAbiParameters_ } from './formatAbiParameters.js';
import type { AssertName } from './types/signatures.js';
/**
 * Formats ABI item (e.g. error, event, function) into human-readable ABI item
 *
 * @param TAbiItem - ABI item
 * @returns Human-readable ABI item
 */
export type FormatAbiItem<TAbiItem extends Abi[number]> = Abi[number] extends TAbiItem ? string : (TAbiItem extends AbiFunction ? AbiFunction extends TAbiItem ? string : `function ${AssertName<TAbiItem['name']>}(${FormatAbiParameters<TAbiItem['inputs']>})${TAbiItem['stateMutability'] extends Exclude<AbiStateMutability, 'nonpayable'> ? ` ${TAbiItem['stateMutability']}` : ''}${TAbiItem['outputs']['length'] extends 0 ? '' : ` returns (${FormatAbiParameters<TAbiItem['outputs']>})`}` : never) | (TAbiItem extends AbiEvent ? AbiEvent extends TAbiItem ? string : `event ${AssertName<TAbiItem['name']>}(${FormatAbiParameters<TAbiItem['inputs']>})` : never) | (TAbiItem extends AbiError ? AbiError extends TAbiItem ? string : `error ${AssertName<TAbiItem['name']>}(${FormatAbiParameters<TAbiItem['inputs']>})` : never) | (TAbiItem extends AbiConstructor ? AbiConstructor extends TAbiItem ? string : `constructor(${FormatAbiParameters<TAbiItem['inputs']>})${TAbiItem['stateMutability'] extends 'payable' ? ' payable' : ''}` : never) | (TAbiItem extends AbiFallback ? AbiFallback extends TAbiItem ? string : 'fallback()' : never) | (TAbiItem extends AbiReceive ? AbiReceive extends TAbiItem ? string : 'receive() external payable' : never);
type FormatAbiParameters<TAbiParameters extends readonly (AbiParameter | AbiEventParameter)[]> = TAbiParameters['length'] extends 0 ? '' : FormatAbiParameters_<TAbiParameters extends readonly [
    AbiParameter | AbiEventParameter,
    ...(readonly (AbiParameter | AbiEventParameter)[])
] ? TAbiParameters : never>;
/**
 * Formats ABI item (e.g. error, event, function) into human-readable ABI item
 *
 * @param abiItem - ABI item
 * @returns Human-readable ABI item
 */
export declare function formatAbiItem<const TAbiItem extends Abi[number]>(abiItem: TAbiItem): FormatAbiItem<TAbiItem>;
export {};
//# sourceMappingURL=formatAbiItem.d.ts.map