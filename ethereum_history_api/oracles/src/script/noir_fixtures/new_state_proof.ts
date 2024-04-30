import { GetProofReturnType, keccak256 } from 'viem';

import { getValue } from '../../noir/oracles/accountOracle/encode.js';
import { createNewTopLevelProofInputFixture } from './new_proof.js';
import { accountProofConfig, LEGACY_MAX_ACCOUNT_STATE_LEN } from '../../noir/oracles/common/proofConfig/account.js';

export function createNewStateProofFixture(stateProof: GetProofReturnType): string {
  return createNewTopLevelProofInputFixture(
    { key: keccak256(stateProof.address), value: getValue(stateProof.accountProof), proof: stateProof.accountProof },
    accountProofConfig.maxPrefixedKeyNibbleLen,
    LEGACY_MAX_ACCOUNT_STATE_LEN,
    accountProofConfig.maxLeafLen,
    accountProofConfig.maxProofLevels
  );
}
