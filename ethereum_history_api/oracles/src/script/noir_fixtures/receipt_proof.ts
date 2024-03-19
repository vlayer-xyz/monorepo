import { encodeHexString } from '../../noir/noir_js/encode.js';
import { encodeArray, encodeBytes32, encodeProof } from '../../noir/oracles/common/encode.js';
import { MAX_RECEIPT_PROOF_LENGTH, MAX_RECEIPT_TREE_DEPTH } from '../../noir/oracles/accountOracle/encode.js';
import { ReceiptProof } from '../../ethereum/receiptProof.js';

export function createReceiptProofFixture(receiptProofs: ReceiptProof[]): string {
  const receiptProofsNoir = receiptProofs.map(createSingleReceiptProofFixture);
  return `use crate::receipt::TxReceiptProof;

global proofs = [${receiptProofsNoir.join(',')}
];
`;
}

function createSingleReceiptProofFixture(receiptProof: ReceiptProof): string {
  const key = encodeArray(receiptProof.key, MAX_RECEIPT_TREE_DEPTH);
  const value = receiptProof.value;
  const proof = encodeProof(receiptProof.proof, MAX_RECEIPT_PROOF_LENGTH).map((byte) => parseInt(byte, 16));
  const depth = receiptProof.proof.length;
  const storageProofFixture = `
  TxReceiptProof {
    key: [
      ${key.join(',')}
    ],
    proof: [
      ${proof.join(',')}
    ],
    depth: ${depth}
  }`;
  // `
  // TxReceiptProof {
  //   key: [
  //     ${key.join(',')}
  //   ],
  //   value: [
  //     ${value.join(',')}
  //   ],
  //   proof: [
  //     ${proof.join(',')}
  //   ],
  //   depth: ${depth}
  // }`;
  return storageProofFixture;
}
