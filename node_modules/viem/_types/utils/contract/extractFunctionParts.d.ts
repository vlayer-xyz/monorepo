import type { ErrorType } from '../../errors/utils.js';
export type ExtractFunctionPartsErrorType = ErrorType;
/** @deprecated – use `parseAbiItem` from `abitype`. */
export declare function extractFunctionParts(def: string): {
    type: string | undefined;
    name: string | undefined;
    params: string | undefined;
};
export type ExtractFunctionNameErrorType = ErrorType;
/** @deprecated – use `parseAbiItem` from `abitype`. */
export declare function extractFunctionName(def: string): string | undefined;
export type ExtractFunctionParamsErrorType = ErrorType;
/** @deprecated – use `parseAbiItem` from `abitype`. */
export declare function extractFunctionParams(def: string): {
    indexed?: boolean | undefined;
    type: string;
    name: string;
}[] | undefined;
export type ExtractFunctionTypeErrorType = ErrorType;
/** @deprecated – use `parseAbiItem` from `abitype`. */
export declare function extractFunctionType(def: string): string | undefined;
//# sourceMappingURL=extractFunctionParts.d.ts.map