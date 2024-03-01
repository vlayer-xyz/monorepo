import { GetProofReturnType } from 'viem';
import { encodeHexString } from '../../noir/noir_js/encode.js';
import { encodeProof, encodeValue } from '../../noir/oracles/accountOracles.js';

export function createStateProofFixture(stateProof: GetProofReturnType): string {
  const key = encodeHexString(stateProof.address);
  const value = encodeValue(stateProof.accountProof).map((byte) => parseInt(byte, 16));
  const proof = encodeProof(stateProof.accountProof).map((byte) => parseInt(byte, 16));
  const depth = stateProof.accountProof.length;
  const stateProofFixture = `use crate::account::StateProof;

global state_proof = StateProof {
  key: [
    ${key}
  ],
  value: [
    ${value}
  ],
  proof: [
    ${proof}
  ],
  depth: ${depth},
};
`;
  return stateProofFixture;
}
