import { Proof } from '../../ethereum/proof.js';
import { receiptProofConfigM } from '../../noir/oracles/common/proofConfig/receipt.js';
import { createNewTopLevelProofInputFixture } from './new_proof.js';

export function createNewReceiptProofFixture(proof: Proof): string {
  return createNewTopLevelProofInputFixture(
    proof,
    receiptProofConfigM.maxPrefixedKeyNibbleLen,
    receiptProofConfigM.maxValueLen,
    receiptProofConfigM.maxLeafLen,
    receiptProofConfigM.maxProofLevels
  );
}
