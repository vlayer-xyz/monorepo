import { GetProofReturnType, keccak256 } from 'viem';

import { getValue } from '../../noir/oracles/rpc/accountOracle/encode.js';
import { createNewTopLevelProofFixture } from './new_proof.js';
import { accountProofConfig } from '../../noir/oracles/rpc/common/proofConfig/account.js';

export function createNewStateProofFixture(stateProof: GetProofReturnType): string {
  return createNewTopLevelProofFixture(
    { key: keccak256(stateProof.address), value: getValue(stateProof.accountProof), proof: stateProof.accountProof },
    accountProofConfig
  );
}
