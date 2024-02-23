import { GetProofReturnType } from 'viem';
import { encodeHexString } from '../../noir/noir_js/encode.js';
import { encodeProof, encodeValue } from '../../noir/oracles/accountOracles.js';

export function createStateProofFixture(stateProof: GetProofReturnType): string {
  const key = encodeHexString(stateProof.address);
  const value = encodeValue(stateProof.accountProof).map((byte) => parseInt(byte, 16));
  const proof = encodeProof(stateProof.accountProof).map((byte) => parseInt(byte, 16));
  const depth = stateProof.accountProof.length;
  const stateProofFixture = `use crate::account::StateProof;

global key = [
    ${key}
];
global value = [
    ${value}
];
global proof = [
    ${proof}
];
global depth = ${depth};

global state_proof = StateProof {key, value, proof, depth};
`;
  return stateProofFixture;
}
