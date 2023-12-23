import type { ErrorType } from '../../errors/utils.js';
type Resolved<TReturnType extends readonly unknown[] = any> = [
    result: TReturnType[number],
    results: TReturnType
];
type BatchResultsCompareFn<TResult = unknown> = (a: TResult, b: TResult) => number;
export type CreateBatchSchedulerArguments<TParameters = unknown, TReturnType extends readonly unknown[] = readonly unknown[]> = {
    fn: (args: TParameters[]) => Promise<TReturnType>;
    id: number | string;
    shouldSplitBatch?: (args: TParameters[]) => boolean;
    wait?: number;
    sort?: BatchResultsCompareFn<TReturnType[number]>;
};
export type CreateBatchSchedulerReturnType<TParameters = unknown, TReturnType extends readonly unknown[] = readonly unknown[]> = {
    flush: () => void;
    schedule: TParameters extends undefined ? (args?: TParameters) => Promise<Resolved<TReturnType>> : (args: TParameters) => Promise<Resolved<TReturnType>>;
};
export type CreateBatchSchedulerErrorType = ErrorType;
export declare function createBatchScheduler<TParameters, TReturnType extends readonly unknown[]>({ fn, id, shouldSplitBatch, wait, sort, }: CreateBatchSchedulerArguments<TParameters, TReturnType>): CreateBatchSchedulerReturnType<TParameters, TReturnType>;
export {};
//# sourceMappingURL=createBatchScheduler.d.ts.map