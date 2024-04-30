import { Proof } from '../../ethereum/proof.js';
import { ReceiptProofConfigM } from '../../noir/oracles/common/proofConfig/receipt.js';
import { createNewTopLevelProofInputFixture } from './new_proof.js';

export function createNewReceiptProofFixture(proof: Proof): string {
  return createNewTopLevelProofInputFixture(
    proof,
    ReceiptProofConfigM.MAX_PREFIXED_KEY_NIBBLE_LEN,
    ReceiptProofConfigM.MAX_VALUE_LEN,
    ReceiptProofConfigM.MAX_LEAF_LEN,
    ReceiptProofConfigM.MAX_PROOF_LEVELS
  );
}
