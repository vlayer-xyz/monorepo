use dep::proof::{TrieProof, StorageProof as StorageProofDep};

use crate::misc::types::{Bytes32, Address};

global STORAGE_PROOF_LEN = 3724; // = 7 (MAX_STORAGE_PROOF_LEVELS) * 532 (MAX_TRIE_NODE_LENGTH)

struct StorageValuesWithinAccount<N> {
    value: [Bytes32; N],
    storage_root: Bytes32
}

struct StorageProof {
    key: Bytes32,
    value: Bytes32,
    proof: [u8; STORAGE_PROOF_LEN],
    depth: Field
}

struct StorageProofsWithStorageRoot<N> {
    storage_root: Bytes32,
    proofs: [StorageProof; N]
}

pub(crate) fn verify_storage_value(storage_root: Bytes32, proof: StorageProof) {
    let trie_proof = TrieProof { key: proof.key, value: proof.value, proof: proof.proof, depth: proof.depth };
    assert(trie_proof.verify_storage_root(storage_root), "TrieProof: Invalid storage root");
}
