import { GetProofReturnType } from 'viem';
import { encodeHexString } from '../../noir/noir_js/encode.js';
import { STATE_PROOF_LENGTH, encodeValue } from '../../noir/oracles/accountOracle.js';
import { encodeProof } from '../../noir/oracles/codec/encode.js';

export function createStateProofFixture(stateProof: GetProofReturnType): string {
  const key = encodeHexString(stateProof.address);
  const value = encodeValue(stateProof.accountProof).map((byte) => parseInt(byte, 16));
  const proof = encodeProof(stateProof.accountProof, STATE_PROOF_LENGTH).map((byte) => parseInt(byte, 16));
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
