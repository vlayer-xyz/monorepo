import { Hex, keccak256, toRlp } from 'viem';
import { createProofInputFixture } from './proof.js';
import { joinArrayVertical } from '../../noir/noir_js/encode.js';
import { toHexString } from '../../ethereum/blockHeader.js';
import { storageProofConfig } from '../../noir/oracles/rpc/common/proofConfig/storage.js';

interface StorageProof {
  key: Hex;
  proof: Hex[];
  value: bigint;
}

export function createStorageProofFixture(storageProofs: StorageProof[]): string {
  const storageProofsNoir = storageProofs.map(createSingleStorageProofFixture);
  return `use crate::merkle_patricia_proofs::proof::{Proof, ProofInput};
use crate::account_with_storage::{MAX_PREFIXED_KEY_NIBBLE_LEN, MAX_STORAGE_DEPTH_NO_LEAF_M, MAX_STORAGE_VALUE_LEN, MAX_STORAGE_LEAF_LEN};

global proofs = ${joinArrayVertical(storageProofsNoir)};

global proofs_serialized = proofs.map(|proof: ProofInput<MAX_PREFIXED_KEY_NIBBLE_LEN, MAX_STORAGE_VALUE_LEN, MAX_STORAGE_DEPTH_NO_LEAF_M, MAX_STORAGE_LEAF_LEN>| proof.serialize());
`;
}

function createSingleStorageProofFixture(storageProof: StorageProof): string {
  return createProofInputFixture(
    { key: keccak256(storageProof.key), value: toRlp(toHexString(storageProof.value)), proof: storageProof.proof },
    storageProofConfig
  );
}
