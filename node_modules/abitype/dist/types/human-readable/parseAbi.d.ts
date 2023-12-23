import type { Abi } from '../abi.js';
import type { Error, Filter } from '../types.js';
import type { Signatures } from './types/signatures.js';
import type { ParseStructs } from './types/structs.js';
import type { ParseSignature } from './types/utils.js';
/**
 * Parses human-readable ABI into JSON {@link Abi}
 *
 * @param TSignatures - Human-readable ABI
 * @returns Parsed {@link Abi}
 *
 * @example
 * type Result = ParseAbi<
 *   // ^? type Result = readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
 *   [
 *     'function balanceOf(address owner) view returns (uint256)',
 *     'event Transfer(address indexed from, address indexed to, uint256 amount)',
 *   ]
 * >
 */
export type ParseAbi<TSignatures extends readonly string[]> = string[] extends TSignatures ? Abi : TSignatures extends readonly string[] ? TSignatures extends Signatures<TSignatures> ? ParseStructs<TSignatures> extends infer Structs ? {
    [K in keyof TSignatures]: TSignatures[K] extends string ? ParseSignature<TSignatures[K], Structs> : never;
} extends infer Mapped extends readonly unknown[] ? Filter<Mapped, never> extends infer Result ? Result extends readonly [] ? never : Result : never : never : never : never : never;
/**
 * Parses human-readable ABI into JSON {@link Abi}
 *
 * @param signatures - Human-Readable ABI
 * @returns Parsed {@link Abi}
 *
 * @example
 * const abi = parseAbi([
 *   //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
 *   'function balanceOf(address owner) view returns (uint256)',
 *   'event Transfer(address indexed from, address indexed to, uint256 amount)',
 * ])
 */
export declare function parseAbi<const TSignatures extends readonly string[]>(signatures: TSignatures['length'] extends 0 ? Error<'At least one signature required'> : Signatures<TSignatures> extends TSignatures ? TSignatures : Signatures<TSignatures>): ParseAbi<TSignatures>;
//# sourceMappingURL=parseAbi.d.ts.map