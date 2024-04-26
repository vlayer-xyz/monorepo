import { Proof } from '../../ethereum/proof.js';
import { TxProofConfigM } from '../../noir/oracles/transactionOracle/encode.js';
import { createNewTopLevelProofInputFixture } from './new_proof.js';

export function createNewTransactionProofFixture(proof: Proof): string {
  return createNewTopLevelProofInputFixture(
    proof,
    TxProofConfigM.MAX_PREFIXED_KEY_NIBBLE_LEN,
    TxProofConfigM.MAX_VALUE_LEN,
    TxProofConfigM.MAX_LEAF_LEN,
    TxProofConfigM.MAX_PROOF_LEVELS
  );
}
