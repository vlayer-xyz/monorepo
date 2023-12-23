import type { Abi } from 'abitype';
import { type AbiConstructorNotFoundErrorType } from '../../errors/abi.js';
import type { GetConstructorArgs } from '../../types/contract.js';
import type { Hex } from '../../types/misc.js';
import { type ConcatHexErrorType } from '../data/concat.js';
import type { ErrorType } from '../../errors/utils.js';
import { type EncodeAbiParametersErrorType } from './encodeAbiParameters.js';
export type EncodeDeployDataParameters<TAbi extends Abi | readonly unknown[] = Abi> = {
    abi: TAbi;
    bytecode: Hex;
} & GetConstructorArgs<TAbi>;
export type EncodeDeployDataErrorType = AbiConstructorNotFoundErrorType | ConcatHexErrorType | EncodeAbiParametersErrorType | ErrorType;
export declare function encodeDeployData<const TAbi extends Abi | readonly unknown[]>({ abi, args, bytecode, }: EncodeDeployDataParameters<TAbi>): `0x${string}`;
//# sourceMappingURL=encodeDeployData.d.ts.map