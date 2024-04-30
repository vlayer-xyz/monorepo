import { Proof } from '../../ethereum/proof.js';
import { txProofConfigM } from '../../noir/oracles/common/proofConfig/tx.js';
import { createNewTopLevelProofInputFixture } from './new_proof.js';

export function createNewTransactionProofFixture(proof: Proof): string {
  return createNewTopLevelProofInputFixture(
    proof,
    txProofConfigM.maxPrefixedKeyNibbleLen,
    txProofConfigM.maxValueLen,
    txProofConfigM.maxLeafLen,
    txProofConfigM.maxProofLevels
  );
}
