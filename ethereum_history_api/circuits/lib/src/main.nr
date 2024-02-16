mod account;
mod account_test;
mod header;
mod header_test;
mod misc;
mod fixtures;

use dep::proof;
use crate::account::{verify_account, Account};
use crate::header::{get_header, BlockHeaderPartial};

global HASH_LENGTH = 32;

fn main(
    block_no: pub Field,
    address: pub [u8; 20],
    // This is marked pub due to an issue in noir JS library. For details - see README.md `Private arguments` section.
    state_root: pub [u8; HASH_LENGTH]
) -> pub Account {
    let account = verify_account(block_no, address, state_root);
    assert(get_header(block_no).state_root == state_root, "State root does not match");
    account
}
