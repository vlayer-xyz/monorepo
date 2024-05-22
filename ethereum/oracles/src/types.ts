// eslint-disable-next-line no-restricted-imports
import { TransactionReceipt as TransactionReceiptViem } from 'viem';

// Old pre-byzantium receipts have `status === null`. Viem types don't express it, so we override it here.
export type TransactionReceipt = TransactionReceiptViem<bigint, number, 'success' | 'reverted' | null>;
