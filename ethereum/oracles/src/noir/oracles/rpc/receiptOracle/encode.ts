import { type ForeignCallOutput } from '@noir-lang/noir_js';
import { statusToHex } from '../../../../ethereum/receipt.js';
import { padArray } from '../../../../util/array.js';
import { encodeField, encodeHex, encodeProof, encodeBytes } from '../../common/encode.js';
import { MAX_TRIE_NODE_LEN, ZERO_PAD_VALUE } from '../../common/const.js';
import { Proof } from '../../../../ethereum/proof.js';
import { TransactionReceipt } from '../../../../types.js';
import { BYTES_32_ZERO, U1_ZERO } from '../../../../util/const.js';
import { receiptProofConfigM } from '../common/proofConfig/receipt.js';

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

export function encodeReceiptProof(receiptProof: Proof): ForeignCallOutput {
  const key = encodeBytes(BigInt(receiptProof.key), receiptProofConfigM.maxPrefixedKeyNibbleLen);
  const value = padArray(encodeHex(receiptProof.value), receiptProofConfigM.maxValueLen, ZERO_PAD_VALUE, 'left');
  const nodes = encodeProof(
    receiptProof.proof.slice(0, receiptProof.proof.length - 1),
    (receiptProofConfigM.maxProofDepth - 1) * MAX_TRIE_NODE_LEN
  );
  const leaf = padArray(
    encodeHex(receiptProof.proof[receiptProof.proof.length - 1]),
    receiptProofConfigM.maxLeafLen,
    ZERO_PAD_VALUE
  );
  const depth = encodeField(receiptProof.proof.length);

  return [...key, ...value, ...nodes, ...leaf, depth];
}
