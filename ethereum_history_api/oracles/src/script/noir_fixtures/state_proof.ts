import { GetProofReturnType } from 'viem';
import { encodeHexString, indentBlock, joinArray } from '../../noir/noir_js/encode.js';
import { encodeProof } from '../../noir/oracles/common/encode.js';
import { STATE_PROOF_LEN, encodeValue } from '../../noir/oracles/accountOracle/encode.js';

export function createStateProofFixture(stateProof: GetProofReturnType): string {
  const key = encodeHexString(stateProof.address);
  const value = encodeValue(stateProof.accountProof);
  const proof = encodeProof(stateProof.accountProof, STATE_PROOF_LEN);
  const depth = stateProof.accountProof.length;
  const stateProofFixture = `use crate::account::StateProof;

global state_proof = StateProof {
  key: ${indentBlock(joinArray(key), 1)},
  value: ${indentBlock(joinArray(value), 1)},
  proof: ${indentBlock(joinArray(proof), 1)},
  depth: ${depth},
};
`;
  return stateProofFixture;
}
