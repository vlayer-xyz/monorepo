import { Proof } from '../../ethereum/proof.js';
import {
  MAX_RECEIPT_LEAF_SIZE_M,
  MAX_RECEIPT_PREFIXED_KEY_NIBBLE_LEN,
  MAX_RECEIPT_SIZE_M,
  MAX_RECEIPT_TREE_DEPTH
} from '../../noir/oracles/receiptOracle/encode.js';
import { createNewProofInputFixture } from './new_proof.js';

export function createNewReceiptProofFixture(proof: Proof): string {
  return createNewProofInputFixture(
    proof,
    MAX_RECEIPT_PREFIXED_KEY_NIBBLE_LEN,
    MAX_RECEIPT_SIZE_M,
    MAX_RECEIPT_LEAF_SIZE_M,
    MAX_RECEIPT_TREE_DEPTH
  );
}