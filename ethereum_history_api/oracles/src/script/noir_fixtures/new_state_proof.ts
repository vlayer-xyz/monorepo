import { GetProofReturnType } from 'viem';

import { getValue } from '../../noir/oracles/accountOracle/encode.js';
import { createNewTopLevelProofInputFixture } from './new_proof.js';
import { accountProofConfig } from '../../noir/oracles/common/proofConfig/account.js';

export function createNewStateProofFixture(stateProof: GetProofReturnType): string {
  return createNewTopLevelProofInputFixture(
    { key: stateProof.address, value: getValue(stateProof.accountProof), proof: stateProof.accountProof },
    accountProofConfig
  );
}
