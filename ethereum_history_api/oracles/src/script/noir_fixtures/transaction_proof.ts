import { Proof } from '../../ethereum/proof.js';
import {
  MAX_TRANSACTION_PROOF_LEN,
  MAX_TRANSACTION_RLP_LEN,
  MAX_TRANSACTION_TREE_DEPTH
} from '../../noir/oracles/accountOracle/encode.js';
import { createProofFixture } from './proof.js';

export function createTransactionProofFixture(proof: Proof): string {
  return createProofFixture(
    proof,
    MAX_TRANSACTION_TREE_DEPTH,
    MAX_TRANSACTION_RLP_LEN,
    MAX_TRANSACTION_PROOF_LEN,
    'crate::transaction::TransactionProof',
    'TransactionProof'
  );
}
