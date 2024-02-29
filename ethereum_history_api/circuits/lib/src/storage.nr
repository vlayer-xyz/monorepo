use crate::misc::types::Bytes32;
use crate::account::PROOF_LEN;

struct StorageProofsWithStorageRoot<N> {
    storage_root: Bytes32,
    proofs: [StorageProof; N]
}

struct StorageProof {
    key: Bytes32,
    value: Bytes32,
    proof: [u8; PROOF_LEN],
    depth: Field
}
