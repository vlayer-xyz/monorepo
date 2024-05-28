import { Proof } from '../../ethereum/proof.js';
import { receiptProofConfigM } from '../../noir/oracles/rpc/common/proofConfig/receipt.js';
import { createTopLevelProofFixture } from './proof.js';

export function createReceiptProofFixture(proof: Proof): string {
  return createTopLevelProofFixture(proof, receiptProofConfigM);
}
