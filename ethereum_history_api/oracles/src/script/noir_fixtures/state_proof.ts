import { GetProofReturnType } from 'viem';
import { encodeHexString } from '../../noir/noir_js/encode.js';
import { encodeProof } from '../../noir/oracles/common/encode.js';
import { STATE_PROOF_LEN, encodeValue } from '../../noir/oracles/accountOracle/encode.js';

export function createStateProofFixture(stateProof: GetProofReturnType): string {
  const key = encodeHexString(stateProof.address);
  const value = encodeValue(stateProof.accountProof);
  const proof = encodeProof(stateProof.accountProof, STATE_PROOF_LEN);
  const depth = stateProof.accountProof.length;
  const stateProofFixture = `use crate::account::StateProof;

global state_proof = StateProof {
  key: [
    ${key.join(',')}
  ],
  value: [
    ${value.join(',')}
  ],
  proof: [
    ${proof.join(',')}
  ],
  depth: ${depth},
};
`;
  return stateProofFixture;
}
