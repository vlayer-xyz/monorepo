import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { statusToHex } from '../../../ethereum/receipt.js';
import { padArray } from '../../../util/array.js';
import { encodeField, encodeHex, encodeProof, encodeBytes } from '../common/encode.js';
import { ZERO_PAD_VALUE } from '../common/const.js';
import { Proof } from '../../../ethereum/proof.js';
import { TransactionReceipt } from '../../../types.js';
import { BYTES_32_ZERO, U1_ZERO } from '../../../util/const.js';

const MAX_RECEIPT_PROOF_LEVELS = 7;
const MAX_RECEIPT_LENGTH = 532;
export const MAX_RECEIPT_RLP_LENGTH = 532;
const MAX_RECEIPT_PROOF_LENGTH = MAX_RECEIPT_LENGTH * MAX_RECEIPT_PROOF_LEVELS;
export const KEY_LENGTH = 4;

export enum RECEIPT_OFFSETS {
  STATUS,
  STATUS_IS_SOME,
  STATE_ROOT,
  STATE_ROOT_IS_SOME,
  CUMULATIVE_GAS_USED,
  LOGS_BLOOM
}

export function encodeReceipt(receipt: TransactionReceipt): ForeignCallOutput[] {
  const status = receipt.status === null ? U1_ZERO : statusToHex(receipt.status);
  const statusIsSome = receipt.status === null ? '0x00' : '0x01';
  const stateRoot = encodeHex(receipt.root ?? BYTES_32_ZERO);
  const stateRootIsSome = receipt.root === undefined ? '0x00' : '0x01';
  const cumulativeGasUsed = encodeField(receipt.cumulativeGasUsed);
  const logsBloom = encodeHex(receipt.logsBloom);

  return [status, statusIsSome, stateRoot, stateRootIsSome, cumulativeGasUsed, logsBloom];
}

export function encodeReceiptProof(receiptProof: Proof): ForeignCallOutput[] {
  const key = encodeBytes(BigInt(receiptProof.key), KEY_LENGTH);
  const value = padArray(encodeHex(receiptProof.value), MAX_RECEIPT_RLP_LENGTH, ZERO_PAD_VALUE);
  const proof = encodeProof(receiptProof.proof, MAX_RECEIPT_PROOF_LENGTH);
  const depth = encodeField(receiptProof.proof.length);

  return [key, value, proof, depth];
}
