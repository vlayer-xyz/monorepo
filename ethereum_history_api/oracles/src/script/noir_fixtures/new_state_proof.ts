import { GetProofReturnType } from 'viem';
import {
  MAX_ACCOUNT_LEAF_SIZE,
  MAX_ACCOUNT_PREFIXED_KEY_NIBBLE_LEN,
  MAX_ACCOUNT_STATE_LEN,
  MAX_STATE_PROOF_LEVELS,
  getValue
} from '../../noir/oracles/accountOracle/encode.js';
import { createNewProofInputFixture } from './new_proof.js';

export function createNewStateProofFixture(stateProof: GetProofReturnType): string {
  return createNewProofInputFixture(
    { key: stateProof.address, value: getValue(stateProof.accountProof), proof: stateProof.accountProof },
    MAX_ACCOUNT_PREFIXED_KEY_NIBBLE_LEN,
    MAX_ACCOUNT_STATE_LEN,
    MAX_ACCOUNT_LEAF_SIZE,
    MAX_STATE_PROOF_LEVELS
  );
}
