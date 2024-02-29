import { Hash } from 'viem';
import { encodeHexString } from '../../noir/noir_js/encode.js';
import { encodeProof } from '../../noir/oracles/accountOracles.js';
import { encodeBytes32 } from '../../noir/oracles/encode.js';

export function createStorageProofFixture(storageProofs: { key: Hash; proof: Hash[]; value: bigint }[]): string {
  const storageProofsNoir = storageProofs.map(createSingleStorageProofFixture);
  return `
use crate::storage::StorageProof;
use crate::misc::types::Bytes32;
use crate::account::PROOF_LEN;

global proofs: [StorageProof; ${storageProofs.length}] = [
  ${storageProofsNoir.join(',\n')}
];
`;
}

function createSingleStorageProofFixture(storageProof: { key: Hash; proof: Hash[]; value: bigint }): string {
  const key = encodeHexString(storageProof.key);
  const value = encodeBytes32(storageProof.value);
  const proof = encodeProof(storageProof.proof).map((byte) => parseInt(byte, 16));
  const depth = storageProof.proof.length;
  const storageProofFixture = `
  StorageProof {
    key: [
      ${key}
    ],
    value: [
      ${value}
    ],
    proof: [
      ${proof}
    ],
    depth: ${depth}
  }
`;
  return storageProofFixture;
}
