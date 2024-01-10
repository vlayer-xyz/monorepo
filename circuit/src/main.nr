mod get_account;
mod get_header;
mod arrays;

use dep::proof;
use crate::get_account::{get_account, AccountWithProof};
use crate::get_header::{get_header, BlockHeaderPartial};

fn main(
    block_no: pub Field,
    address: pub [u8; 20],
    state_root: [u8; proof::KEY_LENGTH]
) -> pub AccountWithProof {
    let account = get_account(block_no, address, state_root);
    get_header(block_no);
    account
}
