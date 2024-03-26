import { Proof } from '../../ethereum/proof.js';
import {
  MAX_RECEIPT_PROOF_LEN,
  MAX_RECEIPT_RLP_LEN,
  MAX_RECEIPT_TREE_DEPTH
} from '../../noir/oracles/accountOracle/encode.js';
import { createProofFixture } from './proof.js';

export function createReceiptProofFixture(proof: Proof): string {
  return createProofFixture(
    proof,
    MAX_RECEIPT_TREE_DEPTH,
    MAX_RECEIPT_RLP_LEN,
    MAX_RECEIPT_PROOF_LEN,
    'crate::receipt::TxReceiptProof',
    'TxReceiptProof'
  );
}
