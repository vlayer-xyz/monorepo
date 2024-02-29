import { Hash } from 'viem';
import { encodeHexString } from '../../noir/noir_js/encode.js';
import { encodeProof } from '../../noir/oracles/accountOracles.js';
import { encodeBytes32 } from '../../noir/oracles/encode.js';

export function createStorageProofFixture(storageProof: { key: Hash; proof: Hash[]; value: bigint }): string {
  const key = encodeHexString(storageProof.key);
  const value = encodeBytes32(storageProof.value);
  const proof = encodeProof(storageProof.proof).map((byte) => parseInt(byte, 16));
  const depth = storageProof.proof.length;
  const storageProofFixture = `
use crate::misc::types::Bytes32;
use crate::account::PROOF_LEN;

global key: Bytes32 = [
    ${key}
];
global value: Bytes32 = [
    ${value}
];
global proof: [u8; PROOF_LEN] = [
    ${proof}
];
global depth: Field = ${depth};
`;
  return storageProofFixture;
}
