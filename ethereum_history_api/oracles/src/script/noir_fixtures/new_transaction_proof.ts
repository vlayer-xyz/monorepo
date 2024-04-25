import { Proof } from '../../ethereum/proof.js';
import {
  MAX_TX_LEAF_SIZE_M,
  MAX_TX_PREFIXED_KEY_NIBBLE_LEN,
  MAX_TX_SIZE_M,
  MAX_TX_TREE_DEPTH
} from '../../noir/oracles/transactionOracle/encode.js';
import { createNewProofInputFixture } from './new_proof.js';

export function createNewTransactionProofFixture(proof: Proof): string {
  return createNewProofInputFixture(
    proof,
    MAX_TX_PREFIXED_KEY_NIBBLE_LEN,
    MAX_TX_SIZE_M,
    MAX_TX_LEAF_SIZE_M,
    MAX_TX_TREE_DEPTH
  );
}
