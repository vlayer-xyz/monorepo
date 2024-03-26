// eslint-disable-next-line no-restricted-imports
import { TransactionReceipt as TransactionReceiptViem } from 'viem';

export type TransactionReceipt = TransactionReceiptViem<bigint, number, 'success' | 'reverted' | null>;
