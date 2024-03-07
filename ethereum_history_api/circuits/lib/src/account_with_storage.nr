use crate::misc::types::{Address, Bytes32};
use crate::account::{Account, StateProof};

global STORAGE_PROOF_LEN = 3724; // = 7 (MAX_STORAGE_PROOF_LEVELS) * 532 (MAX_TRIE_NODE_LENGTH)

struct StorageValuesWithinAccount<N> {
    value: [Bytes32; N],
    storage_root: Bytes32
}

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

type AccountWithStateAndStorageProofs<N> = (Account, StateProof, [StorageProof; N]);

pub fn get_account_with_storage<N>(
    block_number: Field,
    address: Address,
    storage_keys: [Bytes32; N]
) 
// -> StorageWithinBlock<N>
{}

#[oracle(get_proof)]
unconstrained fn get_proof_oracle<N>(
    _block_no: Field,
    _address: [u8; 20],
    _storage_keys: [Bytes32; N]
) -> AccountWithStateAndStorageProofs<N> {}

unconstrained fn get_proof_unconstrained<N>(
    block_no: Field,
    address: Address,
    storage_keys: [Bytes32; N]
) -> AccountWithStateAndStorageProofs<N> {
    get_proof_oracle(block_no, address, storage_keys)
}
