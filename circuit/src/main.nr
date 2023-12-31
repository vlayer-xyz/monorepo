mod get_account;
mod get_header;

use crate::get_account::{get_account, AccountWithProof};
use crate::get_header::{get_header, BlockHeaderPartial};

fn main(block_no: pub Field, address: pub [u8; 20]) -> pub AccountWithProof {
    let account = get_account(block_no, address);
    get_header(block_no);
    account
}
