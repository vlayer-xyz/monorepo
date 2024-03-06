use dep::proof::{MAX_ACCOUNT_STATE_LENGTH, KEY_LENGTH};
use crate::header::get_header;
use crate::misc::types::{Address, Bytes32};
use crate::verifiers::account::verify_account;

global STATE_PROOF_LEN = 4788; // = 9 (MAX_STATE_PROOF_LEVELS) * 532 (MAX_TRIE_NODE_LENGTH)

struct Account {
    nonce: Field,
    balance: Field,
    storage_root: Bytes32,
    code_hash: Bytes32,
}

struct StateProof {
    key: Address,
    value: [u8; MAX_ACCOUNT_STATE_LENGTH],
    proof: [u8; STATE_PROOF_LEN],
    depth: Field,
}

struct AccountWithinBlock {
    account: Account,
    block_hash: Bytes32,
}

type AccountWithStateProof = (Account, StateProof);

pub fn get_account(block_no: Field, address: Address) -> AccountWithinBlock {
    let (account, state_proof) = get_account_unconstrained(block_no, address);
    let header = get_header(block_no);
    verify_account(address, account, state_proof, header.state_root);
    AccountWithinBlock { account, block_hash: header.hash }
}

#[oracle(get_account)]
unconstrained fn get_account_oracle(_block_no: Field, _address: [u8; 20]) -> AccountWithStateProof {}

unconstrained fn get_account_unconstrained(
    block_no: Field,
    address: Address
) -> AccountWithStateProof {
    get_account_oracle(block_no, address)
}
