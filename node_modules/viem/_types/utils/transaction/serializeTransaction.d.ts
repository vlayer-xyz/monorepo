import { type InvalidLegacyVErrorType } from '../../errors/transaction.js';
import type { ErrorType } from '../../errors/utils.js';
import type { Signature } from '../../types/misc.js';
import type { TransactionSerializable, TransactionSerialized, TransactionType } from '../../types/transaction.js';
import { type ConcatHexErrorType } from '../data/concat.js';
import { type ToHexErrorType } from '../encoding/toHex.js';
import { type ToRlpErrorType } from '../encoding/toRlp.js';
import { type AssertTransactionEIP1559ErrorType, type AssertTransactionEIP2930ErrorType, type AssertTransactionLegacyErrorType } from './assertTransaction.js';
import { type GetTransactionType, type GetTransationTypeErrorType } from './getTransactionType.js';
import { type SerializeAccessListErrorType } from './serializeAccessList.js';
export type SerializedTransactionReturnType<TTransactionSerializable extends TransactionSerializable = TransactionSerializable, TTransactionType extends TransactionType = GetTransactionType<TTransactionSerializable>> = TransactionSerialized<TTransactionType>;
export type SerializeTransactionFn<TTransactionSerializable extends TransactionSerializable = TransactionSerializable> = typeof serializeTransaction<TTransactionSerializable>;
export type SerializeTransactionErrorType = GetTransationTypeErrorType | SerializeTransactionEIP1559ErrorType | SerializeTransactionEIP2930ErrorType | SerializeTransactionLegacyErrorType | ErrorType;
export declare function serializeTransaction<TTransactionSerializable extends TransactionSerializable>(transaction: TTransactionSerializable, signature?: Signature): SerializedTransactionReturnType<TTransactionSerializable>;
type SerializeTransactionEIP1559ErrorType = AssertTransactionEIP1559ErrorType | ConcatHexErrorType | InvalidLegacyVErrorType | ToHexErrorType | ToRlpErrorType | SerializeAccessListErrorType | ErrorType;
type SerializeTransactionEIP2930ErrorType = AssertTransactionEIP2930ErrorType | ConcatHexErrorType | InvalidLegacyVErrorType | ToHexErrorType | ToRlpErrorType | SerializeAccessListErrorType | ErrorType;
type SerializeTransactionLegacyErrorType = AssertTransactionLegacyErrorType | InvalidLegacyVErrorType | ToHexErrorType | ToRlpErrorType | ErrorType;
export {};
//# sourceMappingURL=serializeTransaction.d.ts.map