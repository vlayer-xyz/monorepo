mod get_account;
mod get_account_test;
mod get_header;
mod get_header_test;
mod arrays;
mod arrays_test;

use dep::proof;
use crate::get_account::{get_account, Account};
use crate::get_header::{get_header, BlockHeaderPartial};

global HASH_LENGTH = 32;

fn main(
    block_no: pub Field,
    address: pub [u8; 20],
    // This is marked pub due to an issue in noir JS library. For details - see README.md `Private arguments` section.
    state_root: pub [u8; HASH_LENGTH]
) -> pub Account {
    let account = get_account(block_no, address, state_root);
    get_header(block_no);
    account
}
