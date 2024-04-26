import { Hex } from 'viem';
import {
  MAX_STORAGE_LEAF_SIZE,
  MAX_STORAGE_PREFIXED_KEY_NIBBLE_LEN,
  MAX_STORAGE_PROOF_LEVELS,
  MAX_STORAGE_SLOT_LEN
} from '../../noir/oracles/accountOracle/encode.js';
import { createNewProofInputFixture } from './new_proof.js';
import { joinArrayVertical } from '../../noir/noir_js/encode.js';
import { toHexString } from '../../ethereum/blockHeader.js';

interface StorageProof {
  key: Hex;
  proof: Hex[];
  value: bigint;
}

export function createNewStorageProofFixture(storageProofs: StorageProof[]): string {
  const storageProofsNoir = storageProofs.map(createSingleStorageProofFixture);
  return `use crate::merkle_patricia_proofs::proof::{Proof, ProofInput};

global proofs = ${joinArrayVertical(storageProofsNoir)};
`;
}

function createSingleStorageProofFixture(storageProof: StorageProof): string {
  return createNewProofInputFixture(
    { key: storageProof.key, value: toHexString(storageProof.value), proof: storageProof.proof },
    MAX_STORAGE_PREFIXED_KEY_NIBBLE_LEN,
    MAX_STORAGE_SLOT_LEN,
    MAX_STORAGE_LEAF_SIZE,
    MAX_STORAGE_PROOF_LEVELS
  );
}
