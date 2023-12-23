import { type InvalidSerializedTransactionTypeErrorType } from '../../errors/transaction.js';
import type { ErrorType } from '../../errors/utils.js';
import type { TransactionSerialized, TransactionSerializedEIP1559, TransactionSerializedEIP2930 } from '../../types/transaction.js';
import { type SliceHexErrorType } from '../data/slice.js';
import { type HexToNumberErrorType } from '../encoding/fromHex.js';
export type GetSerializedTransactionType<TTransactionSerialized extends TransactionSerialized = TransactionSerialized> = TTransactionSerialized extends TransactionSerializedEIP1559 ? 'eip1559' : TTransactionSerialized extends TransactionSerializedEIP2930 ? 'eip2930' : 'legacy';
export type GetSerializedTransactionTypeErrorType = HexToNumberErrorType | InvalidSerializedTransactionTypeErrorType | SliceHexErrorType | ErrorType;
export declare function getSerializedTransactionType<TSerialized extends TransactionSerialized>(serializedTransaction: TSerialized): GetSerializedTransactionType<TSerialized>;
//# sourceMappingURL=getSerializedTransactionType.d.ts.map