import { ForeignCallOutput } from '@noir-lang/noir_js';
export declare function expectCircuitFail(p: Promise<boolean>): Promise<void>;
export type FieldsOfType<ObjectType, FieldType> = {
    [K in keyof ObjectType]: ObjectType[K] extends FieldType ? K : never;
}[keyof ObjectType];
export interface Account {
    nonce: string;
    balance: string;
    codeHash: string[];
    storageHash: string[];
}
export interface AccountStateProof {
    key: string[];
    value: string[];
    proof: string[];
    depth: string;
}
export declare function serializeAccount(account: Account): ForeignCallOutput[];
export declare function serializeStateProof(account: AccountStateProof): ForeignCallOutput[];
