import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { statusToHex } from '../../../ethereum/receipt.js';
import { padArray } from '../../../util/array.js';
import { encodeField, encodeHex, encodeProof, encodeBytes } from '../common/encode.js';
import { ZERO_PAD_VALUE } from '../common/const.js';
import { Proof } from '../../../ethereum/proof.js';
import { TransactionReceipt } from '../../../types.js';
import { BYTES_32_ZERO, U1_ZERO } from '../../../util/const.js';
import { getProofConfig } from '../common/proofConfig.js';

// TODO: Remove this when we remove legacy fixtures
export const LEGACY_MAX_RECEIPT_ENCODED_LEN = 525;
export const LEGACY_MAX_RECEIPT_RLP_LEN = LEGACY_MAX_RECEIPT_ENCODED_LEN - 1;

class ReceiptProofConfig {
  public static readonly MAX_KEY_LEN = 3;
  public static readonly MAX_PROOF_LEVELS = 7;
}

export class ReceiptProofConfigM extends ReceiptProofConfig {
  public static MAX_VALUE_LEN = 1000;

  private static readonly config = getProofConfig(this.MAX_KEY_LEN, this.MAX_VALUE_LEN, this.MAX_PROOF_LEVELS);
  public static readonly MAX_PREFIXED_KEY_NIBBLE_LEN = this.config.maxPrefixedKeyNibbleLen;
  public static readonly MAX_LEAF_LEN = this.config.maxLeafLen;
  public static readonly MAX_PROOF_LEN = this.config.maxProofLen;
}

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
  const key = encodeBytes(BigInt(receiptProof.key), ReceiptProofConfig.MAX_KEY_LEN);
  const value = padArray(encodeHex(receiptProof.value), LEGACY_MAX_RECEIPT_ENCODED_LEN, ZERO_PAD_VALUE, 'left');
  const proof = encodeProof(receiptProof.proof, ReceiptProofConfigM.MAX_PROOF_LEN);
  const depth = encodeField(receiptProof.proof.length);

  return [key, proof, depth, value];
}
