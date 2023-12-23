/**
 * Infers embedded primitive type of any type
 *
 * @param T - Type to infer
 * @returns Embedded type of {@link TType}
 *
 * @example
 * type Result = Narrow<['foo', 'bar', 1]>
 */
export type Narrow<TType> = (unknown extends TType ? unknown : never) | (TType extends Function ? TType : never) | (TType extends bigint | boolean | number | string ? TType : never) | (TType extends [] ? [] : never) | {
    [K in keyof TType]: Narrow<TType[K]>;
};
/**
 * Infers embedded primitive type of any type
 * Same as `as const` but without setting the object as readonly and without needing the user to use it.
 *
 * @param value - Value to infer
 * @returns Value with embedded type inferred
 *
 * @example
 * const result = narrow(['foo', 'bar', 1])
 */
export declare function narrow<TType>(value: Narrow<TType>): Narrow<TType>;
//# sourceMappingURL=narrow.d.ts.map