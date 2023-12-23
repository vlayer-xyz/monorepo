import type { CeloTransactionRequest, CeloTransactionSerializable, TransactionSerializableCIP42, TransactionSerializableCIP64 } from './types.js';
export declare function isEmpty(value: string | undefined | number | BigInt): value is undefined;
export declare function isPresent(value: string | undefined | number | BigInt): value is string | number | BigInt;
export declare function isEIP1559(transaction: CeloTransactionSerializable | CeloTransactionRequest): boolean;
export declare function isCIP42(transaction: CeloTransactionSerializable | CeloTransactionRequest): transaction is TransactionSerializableCIP42;
export declare function isCIP64(transaction: CeloTransactionSerializable | CeloTransactionRequest): transaction is TransactionSerializableCIP64;
//# sourceMappingURL=utils.d.ts.map