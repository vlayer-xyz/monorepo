mod get_account;
mod get_header;

use crate::get_account::{get_account, AccountWithProof};
use crate::get_header::{get_header, BlockHeader};

fn main(block_no: pub Field, address: pub str<42>) -> pub AccountWithProof {
    let account = get_account(block_no, address);
    get_header(block_no);
    account
}
