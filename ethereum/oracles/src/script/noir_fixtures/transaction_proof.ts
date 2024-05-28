import { Proof } from '../../ethereum/proof.js';
import { txProofConfigM } from '../../noir/oracles/rpc/common/proofConfig/tx.js';
import { createTopLevelProofFixture } from './proof.js';

export function createTransactionProofFixture(proof: Proof): string {
  return createTopLevelProofFixture(proof, txProofConfigM);
}
