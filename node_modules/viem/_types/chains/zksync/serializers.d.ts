import { type SerializeTransactionFn } from '../../utils/transaction/serializeTransaction.js';
import type { ZkSyncTransactionSerializable, ZkSyncTransactionSerializableEIP712, ZkSyncTransactionSerializedEIP712 } from './types.js';
export declare const serializeTransactionZkSync: SerializeTransactionFn<ZkSyncTransactionSerializable>;
export declare const serializersZkSync: {
    readonly transaction: SerializeTransactionFn<ZkSyncTransactionSerializable>;
};
export type SerializeTransactionEIP712ReturnType = ZkSyncTransactionSerializedEIP712;
export declare function assertTransactionEIP712(transaction: ZkSyncTransactionSerializableEIP712): void;
//# sourceMappingURL=serializers.d.ts.map