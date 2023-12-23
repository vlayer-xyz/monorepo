import { type Abi, type AbiParameter } from 'abitype';
import type { ErrorType } from '../../errors/utils.js';
import type { GetFunctionArgs, InferItemName } from '../../types/contract.js';
import type { Hex } from '../../types/misc.js';
import { type IsHexErrorType } from '../../utils/data/isHex.js';
import { type GetFunctionSelectorErrorType } from '../../utils/hash/getFunctionSelector.js';
import { type IsAddressErrorType } from '../address/isAddress.js';
export type GetAbiItemParameters<TAbi extends Abi | readonly unknown[] = Abi, TItemName extends string = string> = {
    abi: TAbi;
    name: InferItemName<TAbi, TItemName> | Hex;
} & Partial<GetFunctionArgs<TAbi, TItemName>>;
export type GetAbiItemReturnType<TAbi extends Abi | readonly unknown[] = Abi, TItemName extends string = string> = Extract<TAbi[number], {
    name: TItemName;
}>;
export type GetAbiItemErrorType = IsArgOfTypeErrorType | IsHexErrorType | GetFunctionSelectorErrorType | ErrorType;
export declare function getAbiItem<const TAbi extends Abi | readonly unknown[], TItemName extends string>({ abi, args, name, }: GetAbiItemParameters<TAbi, TItemName>): GetAbiItemReturnType<TAbi, TItemName>;
export type IsArgOfTypeErrorType = IsAddressErrorType | ErrorType;
export declare function isArgOfType(arg: unknown, abiParameter: AbiParameter): boolean;
export declare function getAmbiguousTypes(sourceParameters: readonly AbiParameter[], targetParameters: readonly AbiParameter[], args: readonly unknown[]): AbiParameter['type'][] | undefined;
//# sourceMappingURL=getAbiItem.d.ts.map