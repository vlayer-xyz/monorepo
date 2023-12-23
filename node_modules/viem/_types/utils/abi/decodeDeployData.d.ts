import type { Abi } from 'abitype';
import { type AbiConstructorNotFoundErrorType, type AbiConstructorParamsNotFoundErrorType } from '../../errors/abi.js';
import type { GetConstructorArgs } from '../../types/contract.js';
import type { Hex } from '../../types/misc.js';
import type { ErrorType } from '../../errors/utils.js';
import { type DecodeAbiParametersErrorType } from './decodeAbiParameters.js';
export type DecodeDeployDataParameters<TAbi extends Abi | readonly unknown[] = Abi> = {
    abi: TAbi;
    bytecode: Hex;
    data: Hex;
};
export type DecodeDeployDataReturnType<TAbi extends Abi | readonly unknown[] = Abi> = {
    bytecode: Hex;
} & GetConstructorArgs<TAbi>;
export type DecodeDeployDataErrorType = AbiConstructorNotFoundErrorType | AbiConstructorParamsNotFoundErrorType | DecodeAbiParametersErrorType | ErrorType;
export declare function decodeDeployData<const TAbi extends Abi | readonly unknown[]>({ abi, bytecode, data, }: DecodeDeployDataParameters<TAbi>): DecodeDeployDataReturnType<TAbi>;
//# sourceMappingURL=decodeDeployData.d.ts.map