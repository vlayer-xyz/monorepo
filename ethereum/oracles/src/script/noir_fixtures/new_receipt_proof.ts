import { Proof } from '../../ethereum/proof.js';
import { receiptProofConfigM } from '../../noir/oracles/rpc/common/proofConfig/receipt.js';
import { createNewTopLevelProofFixture } from './new_proof.js';

export function createNewReceiptProofFixture(proof: Proof): string {
  return `${createNewTopLevelProofFixture(proof, receiptProofConfigM)}
global proof_input_serialized = proof_input.serialize();
`;
}
