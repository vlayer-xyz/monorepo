import type { AbiEventParameter, AbiParameter } from '../abi.js';
import type { Join } from '../types.js';
import { type FormatAbiParameter } from './formatAbiParameter.js';
/**
 * Formats {@link AbiParameter}s to human-readable ABI parameter.
 *
 * @param TAbiParameters - ABI parameters
 * @returns Human-readable ABI parameters
 *
 * @example
 * type Result = FormatAbiParameters<[
 *   // ^? type Result = 'address from, uint256 tokenId'
 *   { type: 'address'; name: 'from'; },
 *   { type: 'uint256'; name: 'tokenId'; },
 * ]>
 */
export type FormatAbiParameters<TAbiParameters extends readonly [
    AbiParameter | AbiEventParameter,
    ...(readonly (AbiParameter | AbiEventParameter)[])
]> = Join<{
    [K in keyof TAbiParameters]: FormatAbiParameter<TAbiParameters[K]>;
}, ', '>;
/**
 * Formats {@link AbiParameter}s to human-readable ABI parameters.
 *
 * @param abiParameters - ABI parameters
 * @returns Human-readable ABI parameters
 *
 * @example
 * const result = formatAbiParameters([
 *   //  ^? const result: 'address from, uint256 tokenId'
 *   { type: 'address', name: 'from' },
 *   { type: 'uint256', name: 'tokenId' },
 * ])
 */
export declare function formatAbiParameters<const TAbiParameters extends readonly [
    AbiParameter | AbiEventParameter,
    ...(readonly (AbiParameter | AbiEventParameter)[])
]>(abiParameters: TAbiParameters): FormatAbiParameters<TAbiParameters>;
//# sourceMappingURL=formatAbiParameters.d.ts.map