use crate::misc::types::Bytes32;

global STORAGE_PROOF_LEN = 4788;

struct StorageProofsWithStorageRoot<N> {
    storage_root: Bytes32,
    proofs: [StorageProof; N]
}

struct StorageProof {
    key: Bytes32,
    value: Bytes32,
    proof: [u8; STORAGE_PROOF_LEN],
    depth: Field
}
