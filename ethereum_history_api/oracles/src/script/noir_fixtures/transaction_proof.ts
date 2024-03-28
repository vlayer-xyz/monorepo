import { Proof } from '../../ethereum/proof.js';
import {
  MAX_TX_KEY_NIBBLE_LEN,
  MAX_TX_PROOF_LEN,
  MAX_TX_RLP_LEN
} from '../../noir/oracles/transactionOracle/encode.js';
import { createProofFixture } from './proof.js';

export function createTransactionProofFixture(proof: Proof): string {
  return createProofFixture(
    proof,
    MAX_TX_KEY_NIBBLE_LEN,
    MAX_TX_RLP_LEN,
    MAX_TX_PROOF_LEN,
    'crate::transaction::TransactionProof',
    'TransactionProof'
  );
}
