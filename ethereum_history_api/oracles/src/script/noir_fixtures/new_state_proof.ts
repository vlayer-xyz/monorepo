import { GetProofReturnType } from 'viem';

import { AccountCircuitConfig, getValue } from '../../noir/oracles/accountOracle/encode.js';
import { createNewTopLevelProofInputFixture } from './new_proof.js';

export function createNewStateProofFixture(stateProof: GetProofReturnType): string {
  return createNewTopLevelProofInputFixture(
    { key: stateProof.address, value: getValue(stateProof.accountProof), proof: stateProof.accountProof },
    AccountCircuitConfig.MAX_PREFIXED_KEY_NIBBLE_LEN,
    AccountCircuitConfig.MAX_VALUE,
    AccountCircuitConfig.MAX_LEAF_LEN,
    AccountCircuitConfig.MAX_STATE_PROOF_LEVELS
  );
}
