import { encodeHexString } from '../../noir/noir_js/encode.js';
import { encodeArray, encodeProof } from '../../noir/oracles/common/encode.js';
import {
  MAX_RECEIPT_PROOF_LENGTH,
  MAX_RECEIPT_RLP_LENGTH,
  MAX_RECEIPT_TREE_DEPTH
} from '../../noir/oracles/accountOracle/encode.js';
import { ReceiptProof } from '../../ethereum/receiptProof.js';
import { padArray } from '../../util/array.js';
import { ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';

export function createReceiptProofFixture(receiptProof: ReceiptProof): string {
  const key = encodeArray(receiptProof.key, MAX_RECEIPT_TREE_DEPTH);
  const value = padArray(encodeHexString(receiptProof.value), MAX_RECEIPT_RLP_LENGTH, ZERO_PAD_VALUE);
  const proof = encodeProof(receiptProof.proof, MAX_RECEIPT_PROOF_LENGTH);
  const depth = receiptProof.proof.length;
  return `use crate::receipt::TxReceiptProof;

  global proof = TxReceiptProof {
    key: [
      ${key.join(',')}
    ],
    value: [
      ${value.join(',')}
    ],
    proof: [
      ${proof.join(',')}
    ],
    depth: ${depth}
  };`;
}
