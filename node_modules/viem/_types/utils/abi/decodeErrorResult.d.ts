import type { Abi, ExtractAbiError, ExtractAbiErrorNames } from 'abitype';
import { type AbiDecodingZeroDataErrorType, type AbiErrorSignatureNotFoundErrorType } from '../../errors/abi.js';
import type { AbiItem, GetErrorArgs } from '../../types/contract.js';
import type { Hex } from '../../types/misc.js';
import { type GetFunctionSelectorErrorType } from '../hash/getFunctionSelector.js';
import type { ErrorType } from '../../errors/utils.js';
import { type DecodeAbiParametersErrorType } from './decodeAbiParameters.js';
import { type FormatAbiItemErrorType } from './formatAbiItem.js';
export type DecodeErrorResultParameters<TAbi extends Abi | readonly unknown[] = Abi> = {
    abi?: TAbi;
    data: Hex;
};
export type DecodeErrorResultReturnType<TAbi extends Abi | readonly unknown[] = Abi, _ErrorNames extends string = TAbi extends Abi ? Abi extends TAbi ? string : ExtractAbiErrorNames<TAbi> : string> = {
    [TName in _ErrorNames]: {
        abiItem: TAbi extends Abi ? ExtractAbiError<TAbi, TName> : AbiItem;
        args: GetErrorArgs<TAbi, TName>['args'];
        errorName: TName;
    };
}[_ErrorNames];
export type DecodeErrorResultErrorType = AbiDecodingZeroDataErrorType | AbiErrorSignatureNotFoundErrorType | DecodeAbiParametersErrorType | FormatAbiItemErrorType | GetFunctionSelectorErrorType | ErrorType;
export declare function decodeErrorResult<const TAbi extends Abi | readonly unknown[]>({ abi, data, }: DecodeErrorResultParameters<TAbi>): DecodeErrorResultReturnType<TAbi>;
//# sourceMappingURL=decodeErrorResult.d.ts.map