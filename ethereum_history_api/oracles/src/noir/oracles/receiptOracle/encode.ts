import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { TransactionReceipt, Hex } from 'viem';
import { statusToHex } from '../../../ethereum/receipt.js';
import { encodeField, encodeHex, encodeProof, encodeBytes32 } from '../common/encode.js';

const MAX_RECEIPT_PROOF_LEVELS = 6;
const MAX_RECEIPT_LENGTH = 516;
const RECEIPT_PROOF_LENGTH = MAX_RECEIPT_LENGTH * MAX_RECEIPT_PROOF_LEVELS;

export function encodeReceipt(receipt: TransactionReceipt): ForeignCallOutput[] {
  const blobGasUsed = encodeField(receipt.blobGasUsed ?? 0);
  const blobGasPrice = encodeField(receipt.blobGasPrice ?? 0);
  const status = statusToHex(receipt.status);
  const stateRoot = encodeHex(receipt.root ?? '0x0000000000000000000000000000000000000000000000000000000000000000');
  const cumulativeGasUsed = encodeField(receipt.cumulativeGasUsed);
  const logsBloom = encodeHex(receipt.logsBloom);

  return [blobGasUsed, blobGasPrice, status, stateRoot, cumulativeGasUsed, logsBloom];
}

export function encodeReceiptProof(receiptProof: Hex[], txId: bigint): ForeignCallOutput[] {
  const key = encodeBytes32(txId);
  const value = encodeHex(receiptProof[0]);
  const proof = encodeProof(receiptProof, RECEIPT_PROOF_LENGTH);
  const depth = encodeField(receiptProof.length);

  return [key, value, proof, depth];
}
