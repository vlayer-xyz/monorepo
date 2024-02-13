interface Value {
    inner: string;
}
export interface SingleForeignCallParam {
    Single: Value;
}
export interface ArrayForeignCallParam {
    Array: Value[];
}
export type ForeignCallParam = SingleForeignCallParam | ArrayForeignCallParam;
export type ForeignCallParams = ForeignCallParam[];
export interface ForeignCallResult {
    values: ForeignCallParams;
}
export {};
