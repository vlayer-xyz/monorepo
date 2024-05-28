import { Proof } from '../../ethereum/proof.js';
import { receiptProofConfigM } from '../../noir/oracles/common/proofConfig/receipt.js';
import { createTopLevelProofFixture } from './proof.js';

export function createReceiptProofFixture(proof: Proof): string {
  return createTopLevelProofFixture(proof, receiptProofConfigM);
}
