import { Hex, keccak256 } from 'viem';
import { StorageProofConfig } from '../../noir/oracles/accountOracle/encode.js';
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
    { key: keccak256(storageProof.key), value: toHexString(storageProof.value), proof: storageProof.proof },
    StorageProofConfig.MAX_PREFIXED_KEY_NIBBLE_LEN,
    StorageProofConfig.VALUE_LEN,
    StorageProofConfig.MAX_LEAF_LEN,
    StorageProofConfig.MAX_PROOF_LEVELS
  );
}
