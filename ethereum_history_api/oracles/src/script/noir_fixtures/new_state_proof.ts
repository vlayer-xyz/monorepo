import { GetProofReturnType, keccak256 } from 'viem';

import { AccountProofConfig, MAX_ACCOUNT_STATE_LEN, getValue } from '../../noir/oracles/accountOracle/encode.js';
import { createNewTopLevelProofInputFixture } from './new_proof.js';

export function createNewStateProofFixture(stateProof: GetProofReturnType): string {
  return createNewTopLevelProofInputFixture(
    { key: keccak256(stateProof.address), value: getValue(stateProof.accountProof), proof: stateProof.accountProof },
    AccountProofConfig.MAX_PREFIXED_KEY_NIBBLE_LEN,
    MAX_ACCOUNT_STATE_LEN,
    AccountProofConfig.MAX_LEAF_LEN,
    AccountProofConfig.MAX_PROOF_LEVELS
  );
}
