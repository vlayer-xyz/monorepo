import type { ErrorType } from '../../errors/utils.js';
import type { Assign } from '../../types/utils.js';
export type DefineFormatterErrorType = ErrorType;
export declare function defineFormatter<TType extends string, TParameters, TReturnType>(type: TType, format: (_: TParameters) => TReturnType): <TOverrideParameters, TOverrideReturnType, TExclude extends (keyof TParameters | keyof TOverrideParameters)[] = []>({ exclude, format: overrides, }: {
    exclude?: TExclude | undefined;
    format: (_: TOverrideParameters) => TOverrideReturnType;
}) => {
    exclude: TExclude | undefined;
    format: (args: Assign<TParameters, TOverrideParameters>) => (Assign<TReturnType, TOverrideReturnType> extends infer T ? { [K in keyof T]: Assign<TReturnType, TOverrideReturnType>[K]; } : never) & { [_key in TExclude[number]]: never; };
    type: TType;
};
//# sourceMappingURL=formatter.d.ts.map