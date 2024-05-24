import { Hex, keccak256, toRlp } from 'viem';
import { createNewProofInputFixture } from './new_proof.js';
import { joinArrayVertical } from '../../noir/noir_js/encode.js';
import { toHexString } from '../../ethereum/blockHeader.js';
import { storageProofConfig } from '../../noir/oracles/rpc/common/proofConfig/storage.js';

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
    { key: keccak256(storageProof.key), value: toRlp(toHexString(storageProof.value)), proof: storageProof.proof },
    storageProofConfig
  );
}
