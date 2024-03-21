import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { TransactionReceipt } from 'viem';
import { statusToHex } from '../../../ethereum/receipt.js';
import { padArray } from '../../../util/array.js';
import { encodeField, encodeHex, encodeProof, encodeBytes } from '../common/encode.js';
import { ZERO_PAD_VALUE } from '../common/const.js';
import { ReceiptProof } from '../../../ethereum/receiptProof.js';

const MAX_RECEIPT_PROOF_LEVELS = 7;
const MAX_RECEIPT_LENGTH = 532;
export const MAX_RECEIPT_RLP_LENGTH = 532;
const MAX_RECEIPT_PROOF_LENGTH = MAX_RECEIPT_LENGTH * MAX_RECEIPT_PROOF_LEVELS;
export const KEY_LENGTH = 4;

export function encodeReceipt(receipt: TransactionReceipt): ForeignCallOutput[] {
  const blobGasUsed = encodeField(receipt.blobGasUsed ?? 0);
  const blobGasPrice = encodeField(receipt.blobGasPrice ?? 0);
  const status = statusToHex(receipt.status);
  const stateRoot = encodeHex(receipt.root ?? '0x0000000000000000000000000000000000000000000000000000000000000000');
  const cumulativeGasUsed = encodeField(receipt.cumulativeGasUsed);
  const logsBloom = encodeHex(receipt.logsBloom);

  return [blobGasUsed, blobGasPrice, status, stateRoot, cumulativeGasUsed, logsBloom];
}

export function encodeReceiptProof(receiptProof: ReceiptProof): ForeignCallOutput[] {
  const key = encodeBytes(BigInt(receiptProof.key), KEY_LENGTH);
  const value = padArray(encodeHex(receiptProof.value), MAX_RECEIPT_RLP_LENGTH, ZERO_PAD_VALUE);
  const proof = encodeProof(receiptProof.proof, MAX_RECEIPT_PROOF_LENGTH);
  const depth = encodeField(receiptProof.proof.length);

  return [key, value, proof, depth];
}
