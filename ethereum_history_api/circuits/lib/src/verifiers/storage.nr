use dep::proof::TrieProof;

use crate::misc::types::Bytes32;
use crate::account_with_storage::StorageProof;

pub fn verify_storage_value(storage_root: Bytes32, proof: StorageProof) {
    let trie_proof = TrieProof { key: proof.key, value: proof.value, proof: proof.proof, depth: proof.depth };

    // Method verify_storage_root asserts on failure or returns true; it doesn't return false. Validating return for safety.
    assert(trie_proof.verify_storage_root(storage_root), "TrieProof: Invalid storage root");
}

pub fn verify_storage_values<N>(storage_root: Bytes32, proofs: [StorageProof; N]) {
    for i in 0..N {
        verify_storage_value(storage_root, proofs[i]);
    }
}
