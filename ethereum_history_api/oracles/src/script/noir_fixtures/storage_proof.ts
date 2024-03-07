import { Hash } from 'viem';
import { encodeHexString } from '../../noir/noir_js/encode.js';
import { STORAGE_PROOF_LENGTH } from '../../noir/oracles/storageOracle.js';
import { encodeBytes32, encodeProof } from '../../noir/oracles/codec/encode.js';

interface StorageProof {
  key: Hash;
  proof: Hash[];
  value: bigint;
}

export function createStorageProofFixture(storageProofs: StorageProof[]): string {
  const storageProofsNoir = storageProofs.map(createSingleStorageProofFixture);
  return `use crate::storage::StorageProof;

global proofs = [${storageProofsNoir.join(',')}
];
`;
}

function createSingleStorageProofFixture(storageProof: StorageProof): string {
  const key = encodeHexString(storageProof.key);
  const value = encodeBytes32(storageProof.value);
  const proof = encodeProof(storageProof.proof, STORAGE_PROOF_LENGTH).map((byte) => parseInt(byte, 16));
  const depth = storageProof.proof.length;
  const storageProofFixture = `
  StorageProof {
    key: [
      ${key.join(',')}
    ],
    value: [
      ${value.join(',')}
    ],
    proof: [
      ${proof.join(',')}
    ],
    depth: ${depth}
  }`;
  return storageProofFixture;
}
