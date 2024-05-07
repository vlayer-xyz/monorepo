use crate::account_with_storage::{Account, StateProof};
use crate::header::get_header;
use crate::misc::{fragment::Fragment, types::{Address, Bytes32, BYTES32_LENGTH}};
use crate::verifiers::account::verify_account;
use crate::serde::Serialize;

struct AccountWithinBlock {
    account: Account,
    block_hash: Bytes32,
}

type AccountWithStateProof = (Account, StateProof);

pub fn get_account(chain_id: Field, block_no: u64, address: Address) -> AccountWithinBlock {
    let (account, state_proof) = get_account_unconstrained(chain_id, block_no, address);
    let header = get_header(chain_id, block_no);
    verify_account(address, account, state_proof, header.state_root);
    AccountWithinBlock { account, block_hash: header.hash }
}

#[oracle(get_account)]
unconstrained fn get_account_oracle(_chain_id: Field, _block_no: u64, _address: [u8; 20]) -> AccountWithStateProof {}

unconstrained fn get_account_unconstrained(
    chain_id: Field,
    block_no: u64,
    address: Address
) -> AccountWithStateProof {
    get_account_oracle(chain_id, block_no, address)
}
