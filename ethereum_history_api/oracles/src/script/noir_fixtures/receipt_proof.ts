import { encodeHexString } from '../../noir/noir_js/encode.js';
import { encodeHex, encodeProof } from '../../noir/oracles/common/encode.js';
import {
  MAX_RECEIPT_PROOF_LEN,
  MAX_RECEIPT_RLP_LEN,
  MAX_RECEIPT_TREE_DEPTH
} from '../../noir/oracles/accountOracle/encode.js';
import { ReceiptProof } from '../../ethereum/receiptProof.js';
import { padArray } from '../../util/array.js';
import { ZERO_PAD_VALUE } from '../../noir/oracles/common/const.js';
import { padHex } from 'viem';
import { BYTE_HEX_LEN } from '../../util/const.js';

export function createReceiptProofFixture(receiptProof: ReceiptProof): string {
  const paddedKey = padHex(receiptProof.key, { size: MAX_RECEIPT_TREE_DEPTH / BYTE_HEX_LEN, dir: 'left' });
  const key = encodeHex(paddedKey);
  const value = padArray(encodeHexString(receiptProof.value), MAX_RECEIPT_RLP_LEN, ZERO_PAD_VALUE);
  const proof = encodeProof(receiptProof.proof, MAX_RECEIPT_PROOF_LEN);
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
};
`;
}
