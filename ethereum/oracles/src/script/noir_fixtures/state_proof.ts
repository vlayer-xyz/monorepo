import { GetProofReturnType, keccak256 } from 'viem';

import { getValue } from '../../noir/oracles/rpc/accountOracle/encode.js';
import { createTopLevelProofFixture } from './proof.js';
import { accountProofConfig } from '../../noir/oracles/rpc/common/proofConfig/account.js';

export function createStateProofFixture(stateProof: GetProofReturnType): string {
  return createTopLevelProofFixture(
    { key: keccak256(stateProof.address), value: getValue(stateProof.accountProof), proof: stateProof.accountProof },
    accountProofConfig
  );
}
