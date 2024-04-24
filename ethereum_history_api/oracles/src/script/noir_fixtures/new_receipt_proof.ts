import { Proof } from '../../ethereum/proof.js';
import {
  MAX_RECEIPT_LEAF_SIZE_M,
  MAX_RECEIPT_PREFIXED_KEY_NIBBLE_LEN,
  MAX_RECEIPT_SIZE_M,
  MAX_RECEIPT_TREE_DEPTH
} from '../../noir/oracles/receiptOracle/encode.js';
import { createNewProofFixture } from './new_proof.js';

export function createNewReceiptProofFixture(proof: Proof): string {
  return createNewProofFixture(
    proof,
    MAX_RECEIPT_PREFIXED_KEY_NIBBLE_LEN,
    MAX_RECEIPT_SIZE_M,
    MAX_RECEIPT_LEAF_SIZE_M,
    MAX_RECEIPT_TREE_DEPTH
  );
}
