mod get_account;
use crate::get_account::{get_account, Account};

fn main(block_no: pub Field, address: pub str<42>) -> pub Account {
    let account = get_account(18800000, address);
    assert(account.nonce == 0); // Temporary test
    account
}
