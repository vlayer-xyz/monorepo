use crate::account_with_storage::{Account, StateProof};
use crate::header::get_header;
use crate::misc::types::{Address, Bytes32};
use crate::verifiers::account::verify_account;

struct AccountWithinBlock {
    account: Account,
    block_hash: Bytes32,
}

type AccountWithStateProof = (Account, StateProof);

pub fn get_account(block_no: u64, address: Address) -> AccountWithinBlock {
    let (account, state_proof) = get_account_unconstrained(block_no, address);
    let header = get_header(block_no);
    verify_account(address, account, state_proof, header.state_root);
    AccountWithinBlock { account, block_hash: header.hash }
}

#[oracle(get_account)]
unconstrained fn get_account_oracle(_block_no: u64, _address: [u8; 20]) -> AccountWithStateProof {}

unconstrained fn get_account_unconstrained(block_no: u64, address: Address) -> AccountWithStateProof {
    get_account_oracle(block_no, address)
}
