use crate::account::{Account, StateProof};
use crate::header::get_header;
use crate::misc::types::{Address, Bytes32};
use crate::verifiers::account::verify_account;
use crate::verifiers::storage::verify_storage_values;

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

struct AccountWithStorageWithinBlock {
    account: Account,
    block_hash: Bytes32,
}

struct StateAndStorageProof<N> {
		account: Account,
		state_proof: StateProof,
    storage_proofs: [StorageProof; N]
}

struct StorageWithinBlock<N> {
    block_hash: Bytes32,
		account: Account,
    values: [Bytes32; N],
}

pub fn get_account_with_storage<N>(
    block_number: Field,
    address: Address,
    storage_keys: [Bytes32; N]
) -> StorageWithinBlock<N> {
    let header = get_header(block_number);
    let proof = get_proof_unconstrained(block_number, address, storage_keys);

    verify_account(address, proof.account, proof.state_proof, header.state_root);
    verify_storage_values(proof.account.storage_root, proof.storage_proofs);

    StorageWithinBlock {
        block_hash: header.hash,
        account: proof.account,
        values: proof.storage_proofs.map(|p: StorageProof| p.value)
    }
}

#[oracle(get_proof)]
unconstrained fn get_proof_oracle<N>(
    _block_no: Field,
    _address: [u8; 20],
    _storage_keys: [Bytes32; N]
) -> StateAndStorageProof<N> {}

unconstrained fn get_proof_unconstrained<N>(block_no: Field, address: Address, storage_keys: [Bytes32; N]) -> StateAndStorageProof<N> {
    get_proof_oracle(block_no, address, storage_keys)
}
