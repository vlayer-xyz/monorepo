import { Proof } from '../../ethereum/proof.js';
import {
  MAX_TRANSACTION_PROOF_LEN,
  MAX_TRANSACTION_RLP_LEN,
  MAX_TX_KEY_NIBBLE_LEN
} from '../../noir/oracles/accountOracle/encode.js';
import { createProofFixture } from './proof.js';

export function createTransactionProofFixture(proof: Proof): string {
  return createProofFixture(
    proof,
    MAX_TX_KEY_NIBBLE_LEN,
    MAX_TRANSACTION_RLP_LEN,
    MAX_TRANSACTION_PROOF_LEN,
    'crate::transaction::TransactionProof',
    'TransactionProof'
  );
}
