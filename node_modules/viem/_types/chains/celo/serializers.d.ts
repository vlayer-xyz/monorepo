import type { TransactionSerializable } from '../../types/transaction.js';
import { type SerializeTransactionFn } from '../../utils/transaction/serializeTransaction.js';
import type { CeloTransactionSerializable, TransactionSerializableCIP42, TransactionSerializableCIP64, TransactionSerializedCIP42, TransactionSerializedCIP64 } from './types.js';
export declare const serializeTransactionCelo: SerializeTransactionFn<CeloTransactionSerializable | TransactionSerializable>;
export declare const serializersCelo: {
    readonly transaction: SerializeTransactionFn<TransactionSerializable | CeloTransactionSerializable>;
};
export type SerializeTransactionCIP42ReturnType = TransactionSerializedCIP42;
export type SerializeTransactionCIP64ReturnType = TransactionSerializedCIP64;
export declare function assertTransactionCIP42(transaction: TransactionSerializableCIP42): void;
export declare function assertTransactionCIP64(transaction: TransactionSerializableCIP64): void;
//# sourceMappingURL=serializers.d.ts.map