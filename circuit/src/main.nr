mod get_account;

use crate::get_account::{get_account, AccountWithProof};

fn main(block_no: pub Field, address: pub str<42>) -> pub AccountWithProof {
    let account = get_account(block_no, address);
    account
}
