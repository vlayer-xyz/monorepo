import { Hash } from 'viem';
import { encodeHexString, joinArray } from '../../noir/noir_js/encode.js';
import { encodeBytes32, encodeProof } from '../../noir/oracles/common/encode.js';
import { STORAGE_PROOF_LEN } from '../../noir/oracles/accountOracle/encode.js';

interface StorageProof {
  key: Hash;
  proof: Hash[];
  value: bigint;
}

export function createStorageProofFixture(storageProofs: StorageProof[]): string {
  const storageProofsNoir = storageProofs.map(createSingleStorageProofFixture);
  return `use crate::account_with_storage::StorageProof;

global proofs = ${joinArray(storageProofsNoir)};
`;
}

function createSingleStorageProofFixture(storageProof: StorageProof): string {
  const key = encodeHexString(storageProof.key);
  const value = encodeBytes32(storageProof.value);
  const proof = encodeProof(storageProof.proof, STORAGE_PROOF_LEN);
  const depth = storageProof.proof.length;
  const storageProofFixture = `
  StorageProof {
    key: ${joinArray(key)},
    value: ${joinArray(value)},
    proof: ${joinArray(proof)},
    depth: ${depth}
  }`;
  return storageProofFixture;
}
